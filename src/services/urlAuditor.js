/**
 * Auditor de URLs y Salida de Red (Modo Ligero).
 * @param {string} [targetUrl='https://www.google.com/search?q=comoobtener+un+dom'] - URL a auditar.
 * @param {number} [timeoutMs=8000] - Tiempo límite en milisegundos.
 * @returns {Promise<Object>} Telemetría de la auditoría.
 */
export async function auditarUrl(targetUrl = 'https://www.google.com/search?q=comoobtener+un+dom', timeoutMs = 8000) {
  const timestamp = new Date().toISOString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Diamond-Orchestrator/1.0 (URL-Auditor)',
        'Accept': '*/*'
      },
      signal: controller.signal
    });

    // Liberar memoria inmediatamente descargando el stream sin almacenarlo
    await response.arrayBuffer();

    return {
      status: response.ok ? "STABLE" : "WARN",
      httpCode: response.status,
      url: targetUrl,
      timestamp
    };
  } catch (error) {
    const isTimeout = error.name === 'AbortError';
    return {
      status: "ERROR",
      url: targetUrl,
      error: isTimeout ? `Timeout tras ${timeoutMs}ms` : error.message,
      timestamp
    };
  } finally {
    clearTimeout(timer);
  }
}
