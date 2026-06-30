const fs = require('fs').promises;
const path = require('path');

// RUTAS ACTUALIZADAS (Relativas a src/)
const { ejecutarSimulacion } = require('./url-auditor.cjs');
const { getGerritChanges } = require('../lib/lib-gerrit.js'); // Asegúrate de implementar esto aquí

// CONFIGURACIÓN (Debería venir de config/config.json, pero mantenemos lógica aquí)
const STATE_FILE = path.join(__dirname, '../data/state.json');

const UMBRALES = {
    ANTIGUEDAD_MAXIMA_DIAS: 7,
    CRITICIDAD_MINIMA: 2,
    PALABRAS_EXCLUIDAS: ["Import translations", "Update golden images"]
};

// Lógica de limpieza movida a lib-gerrit.js si deseas mayor limpieza, 
// o mantenida aquí por simplicidad.
function cleanAndParseGerrit(textRaw) {
    const antiXssPrefix = ")]}'\n";
    let cleanText = textRaw;
    if (cleanText.startsWith(antiXssPrefix)) {
        cleanText = cleanText.substring(antiXssPrefix.length);
    } else if (cleanText.startsWith(")]}'")) {
        cleanText = cleanText.substring(4);
    }
    return JSON.parse(cleanText);
}

async function auditRaPulse() {
    console.log("--- ⚖️ [Maat] Iniciando Auditoría de Resiliencia ---");

    try {
        // La lógica de fetch se puede abstraer a lib-gerrit.js en el futuro
        const GERRIT_HOST = 'android-review.googlesource.com'; 
        const url = `https://${GERRIT_HOST}/changes/?q=status:open&o=LABELS`;
        
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const rawText = await response.text();
        const changes = cleanAndParseGerrit(rawText);

        const telemetriaAuditor = await ejecutarSimulacion();

        const anomalies = [];
        for (const change of changes) {
            const esRuido = UMBRALES.PALABRAS_EXCLUIDAS.some(keyword => change.subject.includes(keyword));
            if (esRuido) continue;

            const diffDays = Math.ceil((new Date() - new Date(change.updated)) / (1000 * 60 * 60 * 24));
            const crLabel = change.labels?.['Code-Review'] || {};
            const hasCR2 = crLabel.approved || (Array.isArray(crLabel.all) && crLabel.all.some(v => v.value >= UMBRALES.CRITICIDAD_MINIMA));

            if (hasCR2 && diffDays >= UMBRALES.ANTIGUEDAD_MAXIMA_DIAS) {
                anomalies.push({
                    changeId: change.change_id,
                    subject: change.subject,
                    daysPending: diffDays
                });
            }
        }

        const telemetry = {
            timestamp: new Date().toISOString(),
            status: "STABLE",
            anomaliesDetected: anomalies.length,
            anomalies,
            auditor: telemetriaAuditor
        };

        await fs.writeFile(STATE_FILE, JSON.stringify(telemetry, null, 2), 'utf-8');
        console.log(`💾 [Memoria] Telemetría guardada en /data con ${anomalies.length} alertas.`);

    } catch (error) {
        console.error(`❌ Fallo en el Duat: [${error.message}]`);
        await fs.writeFile(STATE_FILE, JSON.stringify({ status: "DEGRADED", error: error.message }), 'utf-8').catch(() => {});
    }
}

auditRaPulse();
