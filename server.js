import http from 'node:http';

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('🚀 ¡Servidor Node.js nativo funcionando!');
});

server.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
