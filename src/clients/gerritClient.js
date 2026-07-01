// src/clients/gerritClient.js
import https from 'https';

/**
 * Cliente Gerrit optimizado para arquitectura Cloud-Native.
 * @param {string} endpoint - El path de la API REST.
 * @param {string} [host='android-review.googlesource.com'] - Host de Gerrit.
 */
export async function requestGerrit(endpoint, host = 'android-review.googlesource.com') {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: host,
            port: 443,
            path: endpoint.startsWith('/a') ? endpoint : `/a${endpoint}`,
            method: 'GET',
            headers: { 
                'Accept': 'application/json', 
                'User-Agent': 'Diamond-Orchestrator/1.0' 
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                // Limpieza del prefijo de seguridad de Gerrit )]}'\n
                const cleanData = data.replace(/^\)]\}'\n/, '');
                try {
                    resolve(JSON.parse(cleanData));
                } catch (e) {
                    reject(new Error(`Error al parsear JSON de Gerrit: ${e.message}`));
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error("Timeout de conexión con Gerrit"));
        });
        
        req.end();
    });
}

