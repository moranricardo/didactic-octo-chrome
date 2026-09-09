import http from 'node:http';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execPromise = promisify(exec);
const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  if (url === '/system/info' && method === 'GET') {
    try {
      // Ejecutamos comandos nativos de la shell de Termux
      const { stdout: uptime } = await execPromise('uptime');
      const { stdout: uname } = await execPromise('uname -a');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        uptime: uptime.trim(),
        kernel: uname.trim()
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 | Ruta no encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor con child_process en http://localhost:${PORT}`);
});
