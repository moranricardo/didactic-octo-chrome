const https = require('https');
const { updateSystemState } = require('./telemetry');

const GERRIT_URL = 'https://android-review.googlesource.com/changes/?q=status:open&n=5';

console.log(`🤖 Ra Pulse -> Interrogando Gerrit en: ${GERRIT_URL}`);

https.get(GERRIT_URL, (res) => {
    let rawData = '';

    res.on('data', (chunk) => { rawData += chunk; });

    // Hacemos que el callback sea async para poder usar await adentro
    res.on('end', async () => {
        try {
            const xssiPrefix = ")]}'\n";
            let cleanData = rawData;

            if (rawData.startsWith(xssiPrefix)) {
                cleanData = rawData.substring(xssiPrefix.length);
                console.log('🛡️ Prefijo anti-XSS )]}\'\n removido con éxito.');
            }

            const changes = JSON.parse(cleanData);
            console.log(`✅ JSON parseado. Se procesaron ${changes.length} cambios recientemente.`);
            
            changes.forEach((c) => {
                console.log(`   [${c.change_id.substring(0, 8)}] ${c.subject.substring(0, 60)}...`);
            });

            // Esperamos a que la telemetría guarde el archivo antes de cerrar el proceso
            await updateSystemState('SUCCESS', { changesCount: changes.length });

        } catch (error) {
            console.error('❌ Error de parseo:', error.message);
            await updateSystemState('PARSE_ERROR', { changesCount: 0 });
        }
    });
}).on('error', async (err) => {
    console.error('❌ Error de red:', err.message);
    await updateSystemState('NETWORK_ERROR', { changesCount: 0 });
});
