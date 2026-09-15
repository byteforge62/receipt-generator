import fs from 'fs';

const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { display: flex; gap: 20px; background: #222; color: white; font-family: sans-serif; padding: 20px; }
    .card { border: 1px solid #666; padding: 10px; text-align: center; }
    img { max-width: 400px; height: auto; border: 1px solid white; }
  </style>
</head>
<body>
  <div class="card">
    <h3>src/assets/IdCard.jpeg</h3>
    <img src="/src/assets/IdCard.jpeg" />
  </div>
  <div class="card">
    <h3>src/assets/DBSC.jpeg</h3>
    <img src="/src/assets/DBSC.jpeg" />
  </div>
</body>
</html>`;

fs.writeFileSync('public/inspect.html', html);
console.log('Created public/inspect.html');
