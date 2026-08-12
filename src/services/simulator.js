/**
 * Servicio de Simulación y Telemetría de Salida de Red.
 */
export async function ejecutarSimulacion(query = 'comoobtener+un+dom', timeoutMs = 8000) {
  const timestamp = new Date().toISOString();
  const targetUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Diamond-Orchestrator/1.0 (Simulation Node)',
        'Accept': 'text/html'
      },
      signal: controller.signal
    });

    // Consumir y descartar stream para liberar recursos inmediatamente
    await response.arrayBuffer();

    return {
      status: response.ok ? "STABLE" : "WARN",
      httpCode: response.status,
      query,
      timestamp
    };
  } catch (error) {
    const isTimeout = error.name === 'AbortError';
    return {
      status: "ERROR",
      error: isTimeout ? `Timeout tras ${timeoutMs}ms` : error.message,
      timestamp
    };
  } finally {
    clearTimeout(timer);
  }
}
