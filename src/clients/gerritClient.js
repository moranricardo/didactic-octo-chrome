const https = require('https');

const fetchGerrit = (host, path) => new Promise((resolve, reject) => {
    const options = {
        hostname: host,
        port: 443,
        path: `/a${path}`,
        method: 'GET',
        headers: { 'Accept': 'application/json', 'User-Agent': 'Diamond-Orchestrator/1.0' }
    };

    https.get(options, (res) => {
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => {
            try {
                // Limpieza del prefijo de seguridad de Gerrit
                const cleanData = body.replace(/^\)\]\}'\n/, '');
                resolve(JSON.parse(cleanData));
            } catch (e) { reject(new Error("Gerrit JSON parse error")); }
        });
    }).on('error', reject).setTimeout(10000, () => reject(new Error("Timeout")));
});

module.exports = { fetchGerrit };

