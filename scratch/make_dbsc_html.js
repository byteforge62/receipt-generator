import fs from 'fs';
import path from 'path';

const html = `<!DOCTYPE html>
<html>
<head>
  <title>Generate DBSC Template</title>
</head>
<body style="background:#222; color:white; font-family:sans-serif;">
  <h2>Generating dbsc-id-card.png template...</h2>
  <canvas id="canvas" width="853" height="1280"></canvas>
  <br/>
  <button id="saveBtn" style="padding:10px 20px; font-size:16px; margin-top:10px;">Download / Log PNG Data</button>
  <pre id="status"></pre>

  <script>
    async function run() {
      const cv = document.getElementById('canvas');
      const ctx = cv.getContext('2d');
      const status = document.getElementById('status');

      function loadImage(src) {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });
      }

      function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }

      const baseImg = await loadImage('/src/assets/IdCard.jpeg');
      const dbscLogo = await loadImage('/src/assets/DBSC.jpeg');

      if (!baseImg || !dbscLogo) {
        status.innerText = "Error loading images!";
        return;
      }

      // 1. Draw base card
      ctx.drawImage(baseImg, 0, 0, 853, 1280);

      // 2. Clear header branding area seamlessly with dark header color
      // Header dark background box
      ctx.fillStyle = "#111111";
      ctx.fillRect(20, 15, 813, 165);

      // 3. Draw DBSC Logo
      const logoX = 35;
      const logoY = 22;
      const logoW = 140;
      const logoH = 140;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(logoX, logoY, logoW, logoH, 12) : ctx.rect(logoX, logoY, logoW, logoH);
      ctx.clip();
      ctx.drawImage(dbscLogo, logoX, logoY, logoW, logoH);
      ctx.restore();

      // 4. Draw DBSC FC Header Text
      const textX = 205;

      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 62px 'Arial Black', Arial, sans-serif";
      ctx.fillText("DBSC FC", textX, 85);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px Arial, sans-serif";
      ctx.fillText("FOOTBALL CLUB", textX, 128);

      ctx.fillStyle = "#aaaaaa";
      ctx.font = "18px Arial, sans-serif";
      ctx.fillText("—  PLAY  •  LEARN  •  GROW  —", textX, 162);

      const dataUrl = cv.toDataURL("image/png");
      status.innerText = "DBSC Template generated successfully!\nData length: " + dataUrl.length;

      window.dbscDataUrl = dataUrl;
    }

    run();
  </script>
</body>
</html>`;

fs.writeFileSync('public/make_dbsc.html', html);
console.log('Created public/make_dbsc.html');
