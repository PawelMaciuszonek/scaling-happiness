const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 3000;

let counter = 0;
const counterFile = 'counter.txt';
const guestsFile = 'guests.txt';

// Wczytaj licznik odwiedzin
try {
  const data = fs.readFileSync(counterFile, 'utf8');
  counter = parseInt(data) || 0;
} catch (err) {
  counter = 0;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (pathname === '/') {
    counter++;
    fs.writeFile(counterFile, counter.toString(), (err) => {
      if (err) console.error('Błąd zapisu:', err);
    });

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>Witaj na stronie!</h1><p>Odwiedziłeś ją już ${counter} razy.</p>`);

  } else if (pathname === '/add') {
    const name = query.name;
    if (!name) {
      res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Błąd</h1><p>Brak parametru "name" w zapytaniu.</p>');
      return;
    }

    fs.appendFile(guestsFile, name + '\n', (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Błąd serwera</h1><p>Nie udało się zapisać gościa.</p>');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>Dodano gościa</h1><p>Witaj, ${name}!</p>`);
      }
    });

  } else if (pathname === '/list') {
    fs.readFile(guestsFile, 'utf8', (err, data) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      if (err || !data.trim()) {
        res.end('<h1>Lista gości</h1><p>Lista gości jest pusta.</p>');
      } else {
        const guests = data.trim().split('\n').map(name => `<li>${name}</li>`).join('');
        res.end(`<h1>Lista gości</h1><ul>${guests}</ul>`);
      }
    });

  } else if (pathname === '/clear') {
    fs.writeFile(guestsFile, '', (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Błąd</h1><p>Nie udało się wyczyścić listy gości.</p>');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Lista gości została wyczyszczona.</h1>');
      }
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1><p>Strona nie istnieje.</p>');
  }
});

server.listen(port, () => {
  console.log(`Serwer działa na porcie ${port}`);
});