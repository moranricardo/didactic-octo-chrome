/**
 * Ra Pulse - Motor de Coherencia Cruzada y Simulación de Huella
 * Entorno: Termux / Sandbox de Seguridad Local
 * Nivel: Blindado 🔐
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 🔐 SEGURIDAD: Inyección dinámica de URL. Ya no hay hardcoding en el script.
const TARGET_URL = process.argv[2] || 'https://www.google.com/search?q=comoobtener+un+dominio+gratis&client=ms-android-americamovil-mx-revc&sourceid=chrome-mobile&ie=UTF-8';

const HUELLA_DIGITAL = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
    'Sec-Ch-Ua': '"Not-A.Brand";v="99", "Chromium";v="124", "Google Chrome";v="124"',
    'Sec-Ch-Ua-Mobile': '?1',
    'Sec-Ch-Ua-Platform': '"Android"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin'
};

const STATE_FILE = path.join(__dirname, 'state.json');

function auditarCoherenciaCruzada(urlDestino, huella) {
    console.log(`\n=== ⚖️ [Maat] Iniciando Análisis de Coherencia Cruzada ===`);
    console.log(`🔍 Objetivo: ${urlDestino.substring(0, 50)}...`);
    
    let objetoUrl;
    try {
        objetoUrl = new URL(urlDestino);
    } catch (e) {
        console.error("❌ [Error] La URL proporcionada no tiene un formato válido.");
        process.exit(1);
    }

    const params = objetoUrl.searchParams;
    let esCoherente = true;
    const detallesAnalisis = [];

    // 1. Validar correspondencia de Plataforma Móvil
    const sourceId = params.get('sourceid');
    const uaMobileHeader = huella['Sec-Ch-Ua-Mobile'];

    if (sourceId && uaMobileHeader) {
        if (sourceId === 'chrome-mobile' && uaMobileHeader === '?1') {
            detallesAnalisis.push("✅ Plataforma: URL declara Chrome Mobile y Sec-Ch-Ua-Mobile lo confirma (?1).");
        } else {
            esCoherente = false;
            detallesAnalisis.push("❌ Anomalía: Conflicto de plataforma detectado.");
        }
    }

    // 2. Validar correspondencia de Sistema Operativo
    const clientParam = (params.get('client') || '').toLowerCase();
    const uaString = huella['User-Agent'].toLowerCase();

    if (clientParam) {
        if (clientParam.includes('android') && uaString.includes('android')) {
            detallesAnalisis.push("✅ OS: El cliente y el User-Agent apuntan a Android.");
        } else {
            esCoherente = false;
            detallesAnalisis.push("⚠️ Advertencia: Discrepancia de sistema operativo.");
        }
    }

    if (detallesAnalisis.length === 0) {
        detallesAnalisis.push("ℹ️ Neutro: La URL no contiene parámetros auditables de plataforma móvil cruzada.");
    }

    detallesAnalisis.forEach(linea => console.log(linea));
    
    return {
        hostname: objetoUrl.hostname,
        pathConQuery: objetoUrl.pathname + objetoUrl.search,
        esCoherente: esCoherente
    };
}

function ejecutarSimulacion() {
    const analisis = auditarCoherenciaCruzada(TARGET_URL, HUELLA_DIGITAL);

    if (!analisis.esCoherente) {
        console.log("\n🛑 [Abortado] Simulación cancelada debido a inconsistencias graves en la huella.");
        return;
    }

    console.log(`\n📡 [Huella Blindada] Disparando petición simulada...`);
    
    const opcionesPeticion = {
        hostname: analisis.hostname,
        path: analisis.pathConQuery,
        method: 'GET',
        headers: HUELLA_DIGITAL,
        timeout: 5000 // 🔐 SEGURIDAD: Timeout de 5 segundos para evitar colapsos de red
    };

    const req = https.request(opcionesPeticion, (res) => {
        let bytesRecibidos = 0;

        // 🔐 SEGURIDAD: No guardamos el cuerpo de la respuesta, solo medimos el peso para no saturar la RAM
        res.on('data', (chunk) => { bytesRecibidos += chunk.length; });
        
        res.on('end', () => {
            console.log(`\n✨ [Respuesta] HTTP ${res.statusCode} | Peso: ${(bytesRecibidos / 1024).toFixed(2)} KB`);
            console.log(`🌐 Servidor Remoto: ${res.headers['server'] || 'No declarado'}`);
            
            const telemetria = {
                module: "huella-cross-validator",
                timestamp: new Date().toISOString(),
                status: res.statusCode === 200 ? "STABLE" : "ALERT",
                httpCode: res.statusCode,
                payloadSizeKB: parseFloat((bytesRecibidos / 1024).toFixed(2))
            };

            // 🔐 SEGURIDAD: Manejo de errores al escribir en disco
            try {
                fs.writeFileSync(STATE_FILE, JSON.stringify(telemetria, null, 2));
                console.log(`💾 [Memoria] Telemetría guardada en state.json`);
            } catch (fsError) {
                console.error(`❌ Error de I/O al guardar telemetría: ${fsError.message}`);
            }
        });
    });

    req.on('timeout', () => {
        console.error('\n⏱️ [Timeout] El servidor tardó demasiado. Destruyendo conexión para liberar recursos.');
        req.destroy();
    });

    req.on('error', (err) => {
        console.error(`\n❌ Error de red: ${err.message}`);
    });

    req.end();
}

ejecutarSimulacion();
