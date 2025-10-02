const http = require('http');
const fs = require('fs');
const port = 3000;

let counter = 0;
const counterFile = 'counter.txt';

try {
  const data = fs.readFileSync(counterFile, 'utf8');
  counter = parseInt(data) || 0;
} catch (err) {
  counter = 0;
}

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    counter++;
    fs.writeFile(counterFile, counter.toString(), (err) => {
      if (err) console.error('Błąd zapisu:', err);
    });

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Witaj na stronie! Odwiedziłeś ją już ${counter} razy.`);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - Strona nie istnieje');
  }
});

server.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});