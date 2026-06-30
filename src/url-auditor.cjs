const https = require('https');
const options = {
  hostname: 'www.google.com',
  port: 443,
  path: '/search?q=comoobtener+un+dom',
  method: 'GET'
};

async function ejecutarSimulacion() {
    return new Promise((resolve) => {
        let telemetria = { status: "PENDING", timestamp: new Date().toISOString() };
        
        const req = https.request(options, (res) => {
            res.on('data', () => {}); // Consumir datos
            res.on('end', () => {
                telemetria.status = "STABLE";
                telemetria.httpCode = res.statusCode;
                resolve(telemetria);
            });
        });

        req.on('error', (e) => {
            resolve({ status: "ERROR", error: e.message, timestamp: new Date().toISOString() });
        });

        req.end();
    });
}
module.exports = { ejecutarSimulacion };
