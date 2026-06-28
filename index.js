import fs from 'fs/promises';

// CONFIGURACIÓN SOBRE CÓDIGO: El Contrato de Datos del Centro y Radios
const GERRIT_HOST = 'android-review.googlesource.com'; 
const ENDPOINT = '/changes/?q=status:open&o=LABELS'; 
const STATE_FILE = './state.json';

/**
 * Regla de Oro de Seguridad: Purificación del prefijo Anti-XSS de Gerrit
 * @param {string} textRaw 
 * @returns {any}
 */
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

/**
 * El Latido: Orquestación de la consulta al endpoint de Gerrit
 */
async function auditRaPulse() {
    console.log("--- ⚖️ [Maat] Iniciando Auditoría de Resiliencia ---");
    
    try {
        const url = `https://${GERRIT_HOST}${ENDPOINT}`;
        
        // Configuración de Fetch Nativo con inyección de Huella Digital (chrome-mobile-es-419)
        const fetchOptions = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Ch-Ua': '"Not-A.Brand";v="99", "Chromium";v="124", "Google Chrome";v="124"',
                'Sec-Ch-Ua-Mobile': '?1',
                'Sec-Ch-Ua-Platform': '"Android"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        };
        
        console.log(`📡 Solicitando datos a ${GERRIT_HOST}...`);
        const response = await fetch(url, fetchOptions);
        
        if (!response.ok) {
            throw new Error(`Error en el Inframundo HTTP: ${response.status} ${response.statusText}`);
        }

        const rawText = await response.text();
        const changes = cleanAndParseGerrit(rawText);
        
        console.log(`¡Maat restaurado! Pulso recibido: Se han recuperado ${changes.length} cambios.`);
        
        const anomalies = [];

        // Análisis del Sistema: Buscando anomalías con CR+2 bloqueados
        for (const change of changes) {
            const crLabel = change.labels?.['Code-Review'] || {};
            
            // Evaluamos si está aprobado en la propiedad directa o si algún voto del array de registros es exactamente 2
            const hasCR2 = crLabel.approved || 
                           (Array.isArray(crLabel.all) && crLabel.all.some(vote => vote.value === 2));
            
            if (hasCR2) {
                const message = `Alerta: "${change.subject}" tiene CR+2 pero sigue sin integrarse.`;
                console.log(`⚠️ ${message}`);
                anomalies.push({
                    changeId: change.change_id,
                    changeNumber: change._number,
                    subject: change.subject,
                    updated: change.updated
                });
            }
        }

        // Telemetría de Estado: Guardando el pulso del sistema
        const telemetry = {
            timestamp: new Date().toISOString(),
            status: "STABLE",
            anomaliesDetected: anomalies.length,
            anomalies: anomalies
        };

        await fs.writeFile(STATE_FILE, JSON.stringify(telemetry, null, 2), 'utf-8');
        console.log(`\n💾 [Memoria] Telemetría de estado guardada con éxito en ${STATE_FILE}.`);

    } catch (error) {
        console.error(`\n❌ Fallo al navegar por el Duat: [${error.message || error.toString()}]`);
        
        // Registro de falla en telemetría para mantener el pulso del orquestador
        const failureState = {
            timestamp: new Date().toISOString(),
            status: "DEGRADED",
            error: error.message || error.toString()
        };
        await fs.writeFile(STATE_FILE, JSON.stringify(failureState, null, 2), 'utf-8').catch(() => {});
    }
}

// Ejecutar el pulso principal del ciclo de Ra
auditRaPulse();
