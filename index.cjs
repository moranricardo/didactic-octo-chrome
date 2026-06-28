const fs = require('fs').promises;
const { ejecutarSimulacion } = require('./url-auditor.cjs');

// CONFIGURACIÓN
const GERRIT_HOST = 'android-review.googlesource.com'; 
const ENDPOINT = '/changes/?q=status:open&o=LABELS'; 
const STATE_FILE = './state.json';

const UMBRALES = {
    ANTIGUEDAD_MAXIMA_DIAS: 7,
    CRITICIDAD_MINIMA: 2,
    PALABRAS_EXCLUIDAS: ["Import translations", "Update golden images"]
};

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
        const url = `https://${GERRIT_HOST}${ENDPOINT}`;
        const fetchOptions = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome-mobile-es-419/124.0.0.0 Mobile Safari/537.36',
                'Accept': 'application/json'
            }
        };

        console.log(`📡 Solicitando datos a ${GERRIT_HOST}...`);
        const response = await fetch(url, fetchOptions);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const rawText = await response.text();
        const changes = cleanAndParseGerrit(rawText);
        
        const telemetriaAuditor = await ejecutarSimulacion();

        const anomalies = [];
        for (const change of changes) {
            // 1. Filtrado de ruido: ignora cambios que contienen las palabras excluidas
            const esRuido = UMBRALES.PALABRAS_EXCLUIDAS.some(keyword => change.subject.includes(keyword));
            if (esRuido) continue;

            // 2. Cálculo de antigüedad
            const diffDays = Math.ceil((new Date() - new Date(change.updated)) / (1000 * 60 * 60 * 24));
            
            // 3. Verificación de aprobación CR+2
            const crLabel = change.labels?.['Code-Review'] || {};
            const hasCR2 = crLabel.approved || (Array.isArray(crLabel.all) && crLabel.all.some(v => v.value >= UMBRALES.CRITICIDAD_MINIMA));

            if (hasCR2 && diffDays >= UMBRALES.ANTIGUEDAD_MAXIMA_DIAS) {
                console.log(`⚠️ Alerta Crítica: "${change.subject}" lleva ${diffDays} días bloqueado.`);
                anomalies.push({
                    changeId: change.change_id,
                    changeNumber: change._number,
                    subject: change.subject,
                    updated: change.updated,
                    daysPending: diffDays
                });
            }
        }

        const telemetry = {
            timestamp: new Date().toISOString(),
            status: "STABLE",
            totalScanned: changes.length,
            anomaliesDetected: anomalies.length,
            anomalies: anomalies,
            auditor: telemetriaAuditor
        };

        await fs.writeFile(STATE_FILE, JSON.stringify(telemetry, null, 2), 'utf-8');
        console.log(`\n💾 [Memoria] Telemetría guardada: ${anomalies.length} alertas críticas detectadas.`);

    } catch (error) {
        console.error(`\n❌ Fallo en el Duat: [${error.message}]`);
        const failureState = {
            timestamp: new Date().toISOString(),
            status: "DEGRADED",
            error: error.message
        };
        await fs.writeFile(STATE_FILE, JSON.stringify(failureState, null, 2), 'utf-8').catch(() => {});
    }
}

auditRaPulse();
