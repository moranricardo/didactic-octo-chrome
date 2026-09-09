import http from 'node:http';

const PORT = 3000;

// Helper para parsear el body JSON de forma asíncrona
const parseJSON = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
};

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  if (url === '/api/echo' && method === 'POST') {
    try {
      const data = await parseJSON(req);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ recibido: data, timestamp: Date.now() }));
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'JSON inválido' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 | Ruta no encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor con parser activo en http://localhost:${PORT}`);
});
