// Configuración del servidor central de Gerrit
const GERRIT_BASE = 'https://android-review.googlesource.com';

// Lector genérico del inframundo de Gerrit
export async function getGerritData(endpoint) {
    const url = `${GERRIT_BASE}/${endpoint.replace(/^\//, '')}`;
    console.log(`[Gerrit Core] 🛰️ Conectando a: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const text = await response.text();
    const sanitized = text.replace(/^\)\]\}'\n/, '');
    return JSON.parse(sanitized);
}

// Extractor especializado de anomalías críticas (Atención Inmediata)
export async function getUrgentCommits(limit = 10) {
    // Query para filtrar bloqueos CR-2 o Verified-1
    const query = 'status:open (label:Code-Review-2 OR label:Verified-1)';
    const endpoint = `/changes/?q=${encodeURIComponent(query)}&n=${limit}&o=LABELS`;
    
    const changes = await getGerritData(endpoint);
    
    // Mapear y procesar cada anomalía de forma ligera
    return changes.map(change => {
        let alerta = 'Revisión Requerida';
        if (change.labels) {
            if (change.labels['Code-Review']?.rejected) alerta = '🚨 RECHAZADO (CR-2)';
            else if (change.labels['Verified']?.rejected) alerta = '💥 FALLÓ CI (Verified-1)';
        }
        
        return {
            id: change.change_id.slice(0, 10) + '...',
            proyecto: change.project.split('/').pop(),
            asunto: change.subject.length > 50 ? change.subject.slice(0, 47) + '...' : change.subject,
            alerta: alerta
        };
    });
}
