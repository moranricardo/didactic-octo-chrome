// Endpoint por defecto o desde Variable de Entorno
const GERRIT_BASE_URL = process.env.GERRIT_URL || 'https://android-review.googlesource.com';

/**
 * Realiza peticiones a la API REST de Gerrit resolviendo el prefijo de seguridad Magic Prefix.
 */
export async function getGerritData(endpoint, customBaseUrl = null) {
  const baseUrl = customBaseUrl || GERRIT_BASE_URL;
  const url = `${baseUrl}/${endpoint}`;

  // Control de tiempo de espera (10 segundos máximo)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    let text = await response.text();

    // Protocolo Maat: Remover el prefijo de protección XSS de Gerrit ( ")]}' " )
    if (text.startsWith(")]}'")) {
      text = text.substring(4).trim();
    }

    return JSON.parse(text);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Tiempo de espera agotado (Timeout 10s) al conectar con Gerrit: ${url}`);
    }
    throw error;
  }
}

/**
 * Escanea cambios en busca de bloqueos críticos o anomalías en el pipeline.
 */
export async function getUrgentCommits(limit = 5, customBaseUrl = null) {
  try {
    const query = `changes/?q=status:open&n=${limit}&o=LABELS`;
    const changes = await getGerritData(query, customBaseUrl);

    if (!Array.isArray(changes)) return [];

    const urgent = [];

    for (const change of changes) {
      const labels = change.labels || {};
      const cr = labels['Code-Review'] || {};
      const ver = labels['Verified'] || {};

      if (cr.value === -2 || ver.value === -1) {
        urgent.push({
          change_id: change.change_id,
          subject: change.subject,
          owner: change.owner?.name || 'Desconocido',
          status: 'BLOQUEADO'
        });
      }
    }

    return urgent;
  } catch (error) {
    console.warn(`⚠️ No se pudieron consultar las anomalías detalladas: ${error.message}`);
    return [];
  }
}
