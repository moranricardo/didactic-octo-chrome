import https from 'https';
import fs from 'fs';

const CONFIG = {
    GERRIT_HOST: 'android-review.googlesource.com',
    ENDPOINT: '/changes/?q=status:open+(label:Code-Review-2+OR+label:Verified-1)&n=3&o=LABELS',
    STATE_FILE: 'state.json'
};

function consultarGerrit(endpoint) {
    return new Promise((resolve, reject) => {
        const options = { hostname: CONFIG.GERRIT_HOST, path: endpoint, method: 'GET' };
        https.get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                const magicPrefix = ")]}'\n";
                let cleanData = data.startsWith(magicPrefix) ? data.substring(magicPrefix.length) : data;
                resolve(JSON.parse(cleanData));
            });
        }).on('error', reject);
    });
}

async function procesarCicloInteligente() {
    console.log("--- 🧠 [Fase Cognitiva] Comparando estado del Duat ---");
    
    let estadoPrevio = [];
    if (fs.existsSync(CONFIG.STATE_FILE)) {
        estadoPrevio = JSON.parse(fs.readFileSync(CONFIG.STATE_FILE, 'utf8'));
    }

    const cambiosActuales = await consultarGerrit(CONFIG.ENDPOINT);
    const estadoActual = cambiosActuales.map(c => ({
        id: c.id, change_id: c.change_id, subject: c.subject
    }));

    // Comparar: ¿Qué hay de nuevo?
    const idsPrevios = new Set(estadoPrevio.map(c => c.change_id));
    const nuevasAnomalias = estadoActual.filter(c => !idsPrevios.has(c.change_id));

    if (nuevasAnomalias.length > 0) {
        console.log(`⚠️ [Alerta] Se detectaron ${nuevasAnomalias.length} nuevas anomalías.`);
        nuevasAnomalias.forEach(a => console.log(` >> Nueva amenaza detectada: ${a.subject}`));
    } else {
        console.log("✅ [Estado] El sistema se mantiene en equilibrio. Sin nuevas amenazas.");
    }

    fs.writeFileSync(CONFIG.STATE_FILE, JSON.stringify(estadoActual, null, 2));
}

procesarCicloInteligente();
