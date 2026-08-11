const GERRIT_BASE = 'https://android-review.googlesource.com';

/**
 * Realiza peticiones genéricas a la API de Gerrit de forma segura.
 */
export async function getGerritData(endpoint) {
    const cleanEndpoint = endpoint.replace(/^\//, '');
    const url = `${GERRIT_BASE}/${cleanEndpoint}`;
    console.log(`[Gerrit Core] 🛰️ Conectando a: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        
        const text = await response.text();
        // Gerrit antepone un prefijo de seguridad anticarga (XSS) que debemos remover
        const sanitized = text.replace(/^\)\]\}'\n/, '');
        return JSON.parse(sanitized);
    } catch (error) {
        throw new Error(`Fallo en la consulta a Gerrit (${url}): ${error.message}`);
    }
}

/**
 * Obtiene commits urgentes que requieren revisión o fallaron en el CI.
 */
export async function getUrgentCommits(limit = 10) {
    const query = 'status:open (label:Code-Review-2 OR label:Verified-1)';
    
    // Usamos URLSearchParams para estructurar los parámetros de forma limpia y segura
    const params = new URLSearchParams({
        q: query,
        n: limit.toString(),
        o: 'LABELS'
    });

    const endpoint = `/changes/?${params.toString()}`;
    const changes = await getGerritData(endpoint);
    
    if (!Array.isArray(changes)) return [];

    return changes.map(change => {
        let alerta = 'Revisión Requerida';
        
        const crRejected = change.labels?.['Code-Review']?.rejected;
        const verifiedRejected = change.labels?.['Verified']?.rejected;

        if (crRejected) {
            alerta = '🚨 RECHAZADO (CR-2)';
        } else if (verifiedRejected) {
            alerta = '💥 FALLÓ CI (Verified-1)';
        }

        return {
            id: change.change_id ? `${change.change_id.slice(0, 10)}...` : 'unknown_id',
            proyecto: change.project ? change.project.split('/').pop() : 'desconocido',
            asunto: change.subject 
                ? (change.subject.length > 50 ? `${change.subject.slice(0, 47)}...` : change.subject) 
                : 'Sin asunto',
            alerta
        };
    });
}
