const fs = require('fs').promises;
const path = require('path');

const STATE_FILE = path.join(__dirname, 'state.json');

async function updateSystemState(gerritStatus = 'IDLE', extraData = {}) {
    try {
        const memoryUsage = process.memoryUsage();
        
        const telemetryHeart = {
            timestamp: new Date().toISOString(),
            status: "OPERATIONAL",
            modules: {
                gerrit_client: {
                    last_sync_status: gerritStatus,
                    last_sync_time: new Date().toISOString(),
                    changes_intercepted: extraData.changesCount || 0
                },
                telemetry_heart: {
                    status: "ACTIVE"
                }
            },
            environment: {
                platform: process.platform,
                uptime_seconds: Math.floor(process.uptime()),
                ram_rss_mb: (memoryUsage.rss / 1024 / 1024).toFixed(2)
            }
        };

        await fs.writeFile(STATE_FILE, JSON.stringify(telemetryHeart, null, 4), 'utf8');
        console.log('❤️ Telemetry-Heart: state.json actualizado correctamente.');
        
    } catch (error) {
        console.error('❌ Telemetry-Heart: Error escribiendo el estado:', error.message);
    }
}

// Limpiado: Ya no se ejecuta automáticamente aquí en la importación.
module.exports = { updateSystemState };
