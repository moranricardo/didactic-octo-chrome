import http from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';

const PORT = 3000;
const DB_FILE = './data.json';

// Inicializar archivo de datos si no existe
try {
  await readFile(DB_FILE);
} catch {
  await writeFile(DB_FILE, JSON.stringify({ visitas: 0 }));
}

const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  if (url === '/visita' && method === 'POST') {
    const rawData = await readFile(DB_FILE, 'utf-8');
    const data = JSON.parse(rawData);
    data.visitas += 1;
    await writeFile(DB_FILE, JSON.stringify(data, null, 2));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ mensaje: 'Visita registrada', ...data }));
  } else if (url === '/visitas' && method === 'GET') {
    const rawData = await readFile(DB_FILE, 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(rawData);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 | Ruta no encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor activo con persistencia en http://localhost:${PORT}`);
});
