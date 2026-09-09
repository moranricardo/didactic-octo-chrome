import http from 'node:http';

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { url, method } = req;

  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('🚀 Inicio del laboratorio Node.js');
  } else if (url === '/api/info' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', nodeVersion: process.version }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 | Ruta no encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor con rutas activo en http://localhost:${PORT}`);
});
