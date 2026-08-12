import { updateSystemState } from '../services/telemetry.js';

const GERRIT_URL = 'https://android-review.googlesource.com/changes/?q=status:open&n=5';

export async function requestGerrit(timeoutMs = 8000) {
  console.log(`🤖 Ra Pulse -> Interrogando Gerrit en: ${GERRIT_URL}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(GERRIT_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Diamond-Orchestrator/1.0 (Gerrit-Client)'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Respuesta HTTP no válida: ${response.status}`);
    }

    const rawData = await response.text();
    const cleanData = rawData.replace(/^\)]}'\n?/, '');

    const changes = JSON.parse(cleanData);
    console.log(`✅ JSON parseado. Se procesaron ${changes.length} cambios recientemente.`);

    changes.forEach((c) => {
      const id = c.change_id ? c.change_id.substring(0, 8) : 'N/A';
      const subject = c.subject ? c.subject.substring(0, 60) : 'Sin asunto';
      console.log(`   [${id}] ${subject}...`);
    });

    await updateSystemState('SUCCESS', { changesCount: changes.length });
    return changes;

  } catch (error) {
    const isTimeout = error.name === 'AbortError';
    const errorType = isTimeout ? 'NETWORK_ERROR' : 'PARSE_ERROR';
    
    console.error(`❌ Error en cliente Gerrit (${errorType}):`, error.message);
    await updateSystemState(errorType, { changesCount: 0 });
  } finally {
    clearTimeout(timer);
  }
}
