export function getSystemMetrics() {
  const memory = process.memoryUsage();

  return {
    timestamp: new Date().toISOString(),
    platform: process.platform,
    nodeVersion: process.version,
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      rssMb: Number((memory.rss / 1024 / 1024).toFixed(2)),
      heapUsedMb: Number((memory.heapUsed / 1024 / 1024).toFixed(2))
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('📊 Métricas del sistema en tiempo real:');
  console.table(getSystemMetrics());
}
