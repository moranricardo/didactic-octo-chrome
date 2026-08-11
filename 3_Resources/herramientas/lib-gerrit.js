import fetch from 'node-fetch'; // Usará fetch global de Node o fallback

// Endpoint público por defecto (Android Source Code)
const GERRIT_BASE_URL = 'https://android-review.googlesource.com';

/**
 * Realiza peticiones a la API REST de Gerrit resolviendo el prefijo de seguridad Magic Prefix.
 */
export async function getGerritData(endpoint) {
  const url = `${GERRIT_BASE_URL}/${endpoint}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  let text = await response.text();
  
  // Protocolo Maat: Remover el prefijo de protección XSS de Gerrit ( ")]}' " )
  if (text.startsWith(")]}'")) {
    text = text.substring(4).trim();
  }

  return JSON.parse(text);
}

/**
 * Escanea cambios en busca de bloqueos críticos o anomalías en el pipeline.
 */
export async function getUrgentCommits(limit = 5) {
  try {
    // Busca cambios abiertos solicitando información detallada de labels
    const query = `changes/?q=status:open&n=${limit}&o=LABELS`;
    const changes = await getGerritData(query);

    const urgent = [];

    for (const change of changes) {
      const labels = change.labels || {};
      const cr = labels['Code-Review'] || {};
      const ver = labels['Verified'] || {};

      // Detectar bloqueos de código (CR-2) o pruebas fallidas (Verified-1)
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
