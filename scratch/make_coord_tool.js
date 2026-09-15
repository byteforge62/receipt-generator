import fs from 'fs';

const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background: #1a1a1a; color: #fff; margin: 20px; }
    #container { display: flex; gap: 20px; }
    canvas { border: 1px solid #ff0000; cursor: crosshair; }
    #info { font-family: monospace; font-size: 14px; background: #222; padding: 15px; border-radius: 8px; width: 350px; }
    .coord-item { margin-bottom: 8px; }
  </style>
</head>
<body>
  <h2>Template Coordinate Inspection Tool</h2>
  <div id="container">
    <canvas id="cv" width="853" height="1280"></canvas>
    <div id="info">
      <h3>Mouse Coordinates</h3>
      <div id="coords">X: 0, Y: 0</div>
      <hr/>
      <h3>Sample Field Positions:</h3>
      <div class="coord-item"><b>Header Area:</b> X: 25 to 830, Y: 20 to 180</div>
      <div class="coord-item"><b>Photo Area:</b> Top-Left ~ (308, 345), W: ~237, H: ~282</div>
      <div class="coord-item"><b>Name line:</b> Y ~ 746</div>
      <div class="coord-item"><b>Age line:</b> Y ~ 832</div>
      <div class="coord-item"><b>DOB line:</b> Y ~ 918</div>
      <div class="coord-item"><b>Center line:</b> Y ~ 1004</div>
      <div class="coord-item"><b>Sport line:</b> Y ~ 1090</div>
    </div>
  </div>

  <script>
    const cv = document.getElementById('cv');
    const ctx = cv.getContext('2d');
    const coordsDiv = document.getElementById('coords');
    const img = new Image();
    img.src = '/src/assets/IdCard.jpeg';
    img.onload = () => {
      draw();
    };

    let mouseX = 0, mouseY = 0;

    function draw() {
      ctx.drawImage(img, 0, 0, 853, 1280);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 853; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1280); ctx.stroke();
      }
      for (let y = 0; y < 1280; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(853, y); ctx.stroke();
      }

      // Draw crosshair at mouse
      ctx.strokeStyle = 'yellow';
      ctx.beginPath(); ctx.moveTo(mouseX, 0); ctx.lineTo(mouseX, 1280); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, mouseY); ctx.lineTo(853, mouseY); ctx.stroke();
    }

    cv.addEventListener('mousemove', (e) => {
      const rect = cv.getBoundingClientRect();
      const scaleX = 853 / rect.width;
      const scaleY = 1280 / rect.height;
      mouseX = Math.round((e.clientX - rect.left) * scaleX);
      mouseY = Math.round((e.clientY - rect.top) * scaleY);
      coordsDiv.innerText = \`X: \${mouseX}, Y: \${mouseY}\`;
      draw();
    });
  </script>
</body>
</html>`;

fs.writeFileSync('public/coord_tool.html', html);
console.log('Created public/coord_tool.html');
