const GERRIT_BASE = 'https://android-review.googlesource.com';

export async function getGerritData(endpoint) {
    const url = `${GERRIT_BASE}/${endpoint.replace(/^\//, '')}`;
    console.log(`[Gerrit Core] 🛰️ Conectando a: ${url}`);
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        const text = await response.text();
        const sanitized = text.replace(/^\)\]\}'\n/, '');
        return JSON.parse(sanitized);
    } catch (error) {
        throw new Error(`Fallo en la consulta a Gerrit (${url}): ${error.message}`);
    }
}

export async function getUrgentCommits(limit = 10) {
    const query = 'status:open (label:Code-Review-2 OR label:Verified-1)';
    const endpoint = `/changes/?q=${encodeURIComponent(query)}&n=${limit}&o=LABELS`;
    
    const changes = await getGerritData(endpoint);
    if (!Array.isArray(changes)) return [];

    return changes.map(change => {
        let alerta = 'Revisión Requerida';
        if (change.labels) {
            if (change.labels['Code-Review']?.rejected) alerta = '🚨 RECHAZADO (CR-2)';
            else if (change.labels['Verified']?.rejected) alerta = '💥 FALLÓ CI (Verified-1)';
        }

        return {
            id: (change.change_id || '').slice(0, 10) + '...',
            proyecto: change.project ? change.project.split('/').pop() : 'desconocido',
            asunto: change.subject && change.subject.length > 50 ? change.subject.slice(0, 47) + '...' : (change.subject || 'Sin asunto'),
            alerta: alerta
        };
    });
}
