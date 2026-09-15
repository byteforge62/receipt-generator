import fs from 'fs';
import http from 'http';
import path from 'path';

// Also copy IdCard.jpeg to vsa-id-card.jpeg for clear naming
const srcVsa = path.join(process.cwd(), 'src', 'assets', 'IdCard.jpeg');
const destVsa = path.join(process.cwd(), 'src', 'assets', 'vsa-id-card.png');
fs.copyFileSync(srcVsa, destVsa);
console.log('Copied IdCard.jpeg to vsa-id-card.png');

// Server to receive base64 PNG from make_dbsc.html
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const base64Data = body.replace(/^data:image\/png;base64,/, "");
      const destDbsc = path.join(process.cwd(), 'src', 'assets', 'dbsc-id-card.png');
      fs.writeFileSync(destDbsc, base64Data, 'base64');
      console.log('Successfully saved dbsc-id-card.png!');
      res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
      res.end('OK');
      setTimeout(() => process.exit(0), 500);
    });
  } else {
    res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
    res.end('Waiting for POST');
  }
});

server.listen(9876, () => {
  console.log('Template saver server listening on port 9876');
});
