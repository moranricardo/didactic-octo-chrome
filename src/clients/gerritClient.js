import https from 'https';

/**
 * Cliente Gerrit optimizado para arquitectura Cloud-Native.
 * @param {string} endpoint - El path de la API REST.
 * @param {Object|string} [opts='android-review.googlesource.com'] - Host o configuración.
 */
export async function requestGerrit(endpoint, opts = 'android-review.googlesource.com') {
    const host = typeof opts === 'string' ? opts : (opts.host || 'android-review.googlesource.com');
    const authenticated = typeof opts === 'object' ? (opts.authenticated || false) : false;

    return new Promise((resolve, reject) => {
        let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        if (authenticated && !path.startsWith('/a/')) {
            path = `/a${path}`;
        }

        const options = {
            hostname: host,
            port: 443,
            path: path,
            method: 'GET',
            headers: { 
                'Accept': 'application/json', 
                'User-Agent': 'Diamond-Orchestrator/1.0' 
            }
        };

        const req = https.request(options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                reject(new Error(`Gerrit devolvió código de error HTTP ${res.statusCode}`));
                res.resume();
                return;
            }

            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                // Limpieza limpia del prefijo de seguridad Anti-XSS
                const cleanData = data.replace(/^\)]\}'[\s]*/, '');
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
