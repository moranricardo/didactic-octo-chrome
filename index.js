import fs from 'fs';

const CONFIG = {
    GERRIT_HOST: 'android-review.googlesource.com',
    // Filtro de resiliencia: abiertos, con un Code-Review +2, limitados a 3 para no saturar memoria
    ENDPOINT: '/changes/?q=status:open+label:Code-Review=2&n=3&o=LABELS',
    STATE_FILE: 'state.json'
};

async function consultarGerrit(endpoint) {
    const url = `https://${CONFIG.GERRIT_HOST}${endpoint}`;
    try {
        const response = await fetch(url);
        let body = await response.text();
        if (body.startsWith(")]}'\n")) body = body.substring(5);
        return JSON.parse(body);
    } catch (error) {
        console.error("🚨 Error de conexión en el Duat:", error.message);
        return null;
    }
}

async function auditarResiliencia() {
    console.log("--- ⚖️ [Maat] Iniciando Auditoría de Resiliencia ---");
    
    const cambios = await consultarGerrit(CONFIG.ENDPOINT);
    if (!cambios || cambios.length === 0) {
        console.log("✅ El sistema se mantiene en equilibrio. Sin cambios estancados.");
        return;
    }

    // Mapeamos solo lo esencial para nuestra base de conocimiento
    const estadoActual = cambios.map(c => ({
        id: c.id,
        change_id: c.change_id,
        subject: c.subject,
        updated: c.updated,
        status: 'STUCK_WITH_CR2'
    }));

    // El pilar del sistema: Persistencia local
    fs.writeFileSync(CONFIG.STATE_FILE, JSON.stringify(estadoActual, null, 2));
    console.log(`💾 [Memoria] ${estadoActual.length} anomalías de resiliencia guardadas en ${CONFIG.STATE_FILE}.`);
    
    // Imprimimos el reporte en la terminal
    estadoActual.forEach(a => {
        console.log(`⚠️ Alerta: "${a.subject}" tiene CR+2 pero sigue sin integrarse.`);
    });
}

auditarResiliencia();
