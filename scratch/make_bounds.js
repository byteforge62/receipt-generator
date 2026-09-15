import fs from 'fs';

const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: monospace; background: #111; color: #0f0; padding: 20px; }
    pre { font-size: 14px; line-height: 1.5; }
  </style>
</head>
<body>
  <h2>Automated Image Bounds Analysis for IdCard.jpeg (853 x 1280)</h2>
  <canvas id="cv" width="853" height="1280" style="display:none"></canvas>
  <pre id="log">Analyzing...</pre>

  <script>
    const cv = document.getElementById('cv');
    const ctx = cv.getContext('2d');
    const log = document.getElementById('log');

    const img = new Image();
    img.src = '/src/assets/IdCard.jpeg';
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, 853, 1280);
      const data = imgData.data;

      function getPixel(x, y) {
        const i = (y * 853 + x) * 4;
        return { r: data[i], g: data[i+1], b: data[i+2], a: data[i+3] };
      }

      let results = [];

      // 1. Scan Photo Area (around y=300 to y=650, x=250 to x=600)
      let minX = 853, maxX = 0, minY = 1280, maxY = 0;
      for (let y = 300; y < 660; y++) {
        for (let x = 250; x < 600; x++) {
          const p = getPixel(x, y);
          // Red color check
          if (p.r > 150 && p.g < 60 && p.b < 60) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      results.push("=== RED PHOTO FRAME OUTER BOUNDS ===");
      results.push("Outer: X = " + minX + " to " + maxX + " (W: " + (maxX - minX) + "), Y = " + minY + " to " + maxY + " (H: " + (maxY - minY) + ")");

      // Find inner area of photo frame (inside red border)
      // Scan inward from red border
      let innerMinX = minX + 5, innerMaxX = maxX - 5, innerMinY = minY + 5, innerMaxY = maxY - 5;
      for (let x = minX; x <= maxX; x++) {
        const p = getPixel(x, Math.round((minY + maxY) / 2));
        if (p.r > 150 && p.g < 60 && p.b < 60) {
          innerMinX = x + 4; // step inside red line
        }
      }
      for (let x = maxX; x >= minX; x--) {
        const p = getPixel(x, Math.round((minY + maxY) / 2));
        if (p.r > 150 && p.g < 60 && p.b < 60) {
          innerMaxX = x - 4;
        }
      }
      for (let y = minY; y <= maxY; y++) {
        const p = getPixel(Math.round((minX + maxX) / 2), y);
        if (p.r > 150 && p.g < 60 && p.b < 60) {
          innerMinY = y + 4;
        }
      }
      for (let y = maxY; y >= minY; y--) {
        const p = getPixel(Math.round((minX + maxX) / 2), y);
        if (p.r > 150 && p.g < 60 && p.b < 60) {
          innerMaxY = y - 4;
        }
      }

      results.push("\n=== PHOTO INNER PLACEHOLDER AREA ===");
      results.push("Inner Photo Box: X = " + innerMinX + ", Y = " + innerMinY + ", W = " + (innerMaxX - innerMinX) + ", H = " + (innerMaxY - innerMinY));

      // 2. Scan Text Red Underlines
      results.push("\n=== SCANNING RED UNDERLINES FOR TEXT FIELDS ===");
      let yRanges = [];
      let inRed = false;
      let startY = 0;
      for (let y = 680; y < 1180; y++) {
        let redCount = 0;
        for (let x = 200; x < 750; x++) {
          const p = getPixel(x, y);
          if (p.r > 160 && p.g < 50 && p.b < 50) redCount++;
        }
        if (redCount > 100) {
          if (!inRed) { inRed = true; startY = y; }
        } else {
          if (inRed) {
            inRed = false;
            yRanges.push({ startY, endY: y - 1, midY: Math.round((startY + y - 1) / 2) });
          }
        }
      }

      const fieldNames = ["Name", "Age", "DOB", "Center", "Sport"];
      yRanges.forEach((range, idx) => {
        let lineMinX = 853, lineMaxX = 0;
        for (let y = range.startY; y <= range.endY; y++) {
          for (let x = 100; x < 800; x++) {
            const p = getPixel(x, y);
            if (p.r > 160 && p.g < 50 && p.b < 50) {
              if (x < lineMinX) lineMinX = x;
              if (x > lineMaxX) lineMaxX = x;
            }
          }
        }
        const fieldName = fieldNames[idx] || ("Field " + (idx + 1));
        results.push(fieldName + " Line: Y = " + range.startY + " to " + range.endY + ", Red Line Starts X = " + lineMinX + ", Ends X = " + lineMaxX);
      });

      log.innerText = results.join("\n");
    };
  </script>
</body>
</html>`;

fs.writeFileSync('public/bounds.html', html);
console.log('Fixed public/bounds.html');
