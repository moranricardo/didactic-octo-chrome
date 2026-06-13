import https from 'https';
import fs from 'fs';

const CONFIG = {
    GERRIT_HOST: 'android-review.googlesource.com',
    ENDPOINT: '/changes/?q=status:open+(label:Code-Review-2+OR+label:Verified-1)&n=3&o=LABELS',
    TARGET_REPO: 'moranricardo/didactic-octo-chrome'
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

async function auditarCambiosAbiertos() {
    console.log("--- 👁️ [Fase Auditoría] Escaneando Gerrit ---");
    try {
        const cambios = await consultarGerrit(CONFIG.ENDPOINT);
        const estadoActual = cambios.map(c => ({
            id: c.id, change_id: c.change_id, subject: c.subject, owner: c.owner.name, updated: c.updated
        }));
        fs.writeFileSync('state.json', JSON.stringify(estadoActual, null, 2));
        console.log(`✅ [Auditoría] ${estadoActual.length} cambios mapeados.`);
    } catch (error) {
        console.error("🚨 [Auditoría] Fallo:", error.message);
    }
}

auditarCambiosAbiertos();
