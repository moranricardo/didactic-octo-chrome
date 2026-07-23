import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SANITIZED_FILE = path.join(__dirname, '../logs/maat_quarantine/sanitized_data.out');

console.log("🐙 Iniciando núcleo lógico de didactic-octo-chrome...");

try {
    if (!fs.existsSync(SANITIZED_FILE)) {
        console.error("❌ Archivo sanitizado no detectado. Ejecuta el Gerrit-Client primero.");
        process.exit(1);
    }

    // Leemos el archivo purificado y limpiamos espacios al inicio/final
    const rawData = fs.readFileSync(SANITIZED_FILE, 'utf8').trim();
    console.log("🛡️ Leyendo payload purificado por el Protocolo Maat...");

    // Sensor de Estructura: ¿Es HTML o es JSON?
    if (rawData.startsWith('<!DOCTYPE') || rawData.startsWith('<html')) {
        console.log("🌐 Detectada matriz HTML (Web Scrape). Adaptando sensores...");
        
        // Extracción táctica del título usando expresiones regulares
        const titleMatch = rawData.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'Nodo de título no encontrado';
        
        console.log("✅ Escaneo HTML exitoso.");
        console.log(`📊 Peso del bloque: ${rawData.length} bytes decodificados.`);
        console.log(`📌 Información extraída -> Título: ${title}`);
        
        console.log("\n--- [ CÓDIGO FUENTE SUPERFICIAL ] ---");
        console.log(rawData.substring(0, 300) + "\n... [CÓDIGO TRUNCADO PARA PROTEGER TERMINAL]");
        console.log("--------------------------------------\n");

    } else {
        console.log("🧩 Detectada matriz JSON (API Endpoint). Procesando nodos...");
        const parsedData = JSON.parse(rawData);
        
        console.log("✅ Decodificación JSON exitosa.");
        console.log(`📊 Tamaño del payload: ${Object.keys(parsedData).length} raíces detectadas.`);
    }

} catch (error) {
    console.error("❌ Falla de parseo térmico:", error.message);
}
