const fs = require('fs');
const path = require('path');

const SANITIZED_FILE = path.join(__dirname, '../logs/maat_quarantine/sanitized_data.out');

console.log("🐙 Iniciando núcleo lógicos de didactic-octo-chrome...");

try {
    if (!fs.existsSync(SANITIZED_FILE)) {
        console.error("❌ Archivo sanitizado no detectado. Ejecuta el Gerrit-Client primero.");
        process.exit(1);
    }

    // Leemos el archivo purificado
    const rawData = fs.readFileSync(SANITIZED_FILE, 'utf8');
    console.log("🛡️ Leyendo payload purificado por el Protocolo Maat...");

    // Convertimos la data cruda en un objeto JSON manipulable
    const parsedData = JSON.parse(rawData);
    
    console.log("✅ Decodificación exitosa.");
    console.log(`📊 Tamaño del payload: ${Object.keys(parsedData).length} nodos principales detectados.`);
    
    // Imprimimos una pequeña muestra del ADN de los datos
    console.log("\n--- [ MUESTRA DE DATOS EXTRAÍDOS ] ---");
    console.log(JSON.stringify(parsedData, null, 2).substring(0, 400) + "\n... [DATA TRUNCADA PARA PROTECCIÓN DE TERMINAL]");
    console.log("--------------------------------------\n");

} catch (error) {
    console.error("❌ Falla de parseo térmico:", error.message);
}
