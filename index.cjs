const https = require('https');
const fs = require('fs');
const path = require('path');

console.log("=================================================");
console.log("🌌 [FILTRADO EXTREMO] Iniciando el Ciclo de Ra...");
console.log("=================================================");

// ⚙️ CONFIGURACIÓN Y FILTROS
const FILTROS = {
    // Agrega aquí las extensiones que quieres cazar (ej: '.js', '.cpp', '.json', '.md')
    extensionesPermitidas: ['.json', '.py', '.gn', '.cc', '.js'],
    limiteBusqueda: 10 // Ampliamos a 10 para tener más margen de filtrado
};

const CONFIG = {
    host: 'chromium-review.googlesource.com',
    port: 443,
    // CURRENT_REVISION y CURRENT_FILES nos traen la lista de archivos modificados
    path: `/changes/?q=status:open&n=${FILTROS.limiteBusqueda}&o=CURRENT_REVISION&o=CURRENT_FILES`
};

function reportarPulso(estado, mensaje) {
    const rutaEstado = path.join(__dirname, 'state.json');
    const pulso = {
        timestamp: new Date().toISOString(),
        status: estado,
        message: mensaje,
        environment: "Termux (Chromium Filtered)"
    };
    try { fs.writeFileSync(rutaEstado, JSON.stringify(pulso, null, 2), 'utf8'); } catch (err) {}
}

const opciones = {
    hostname: CONFIG.host,
    port: CONFIG.port,
    path: CONFIG.path,
    method: 'GET',
    headers: { 'Accept': 'application/json' }
};

console.log(`⏳ Solicitando cambios y mapas de archivos a Google...`);

const req = https.request(opciones, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });

    res.on('end', () => {
        try {
            const prefijoXSS = ")]}'\n";
            let jsonLimpio = data;
            if (data.startsWith(prefijoXSS)) { jsonLimpio = data.slice(prefijoXSS.length); }

            const cambios = JSON.parse(jsonLimpio);
            let totalFiltrados = 0;

            console.log(`\n📡 Google respondió. Analizando entrañas de ${cambios.length} commits...\n`);
            console.log("==================================================");

            cambios.forEach(cambio => {
                // Obtener la revisión actual y sus archivos
                const revisionActual = cambio.current_revision;
                const archivos = cambio.revisions[revisionActual].files;
                
                // Extraer los nombres de los archivos modificados
                const listaArchivos = Object.keys(archivos);

                // Verificar si alguno de los archivos coincide con nuestras extensiones
                const tieneArchivoClave = listaArchivos.some(archivo => 
                    FILTROS.extensionesPermitidas.some(ext => archivo.endsWith(ext))
                );

                if (tieneArchivoClave) {
                    totalFiltrados++;
                    console.log(`[🎯 MATCH - ID: ${cambio._number}]`);
                    console.log(`📁 Proyecto: ${cambio.project}`);
                    console.log(`📝 Subject: ${cambio.subject}`);
                    console.log(`📂 Archivos clave detectados:`);
                    
                    // Imprimir solo los archivos que pasaron el filtro
                    listaArchivos.forEach(archivo => {
                        const pasaFiltro = FILTROS.extensionesPermitidas.some(ext => archivo.endsWith(ext));
                        if (pasaFiltro) console.log(`   ➔ 📄 ${archivo}`);
                    });
                    console.log("--------------------------------------------------");
                }
            });

            console.log(`\n✅ Maat Estable. Filtro completado. Mostrando ${totalFiltrados} de ${cambios.length} cambios.`);
            reportarPulso('HEALTHY', `Filtro aplicado. Coincidencias encontradas: ${totalFiltrados}`);

        } catch (error) {
            console.error("\n⚠️ Error en el procesamiento del filtro.");
            console.error(error);
            reportarPulso('CRITICAL', error.message);
        }
    });
});

req.on('error', (error) => {
    reportarPulso('DEAD', error.message);
});

req.end();
