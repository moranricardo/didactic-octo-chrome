import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Puente dimensional para ES Modules (Recreación de __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SANITIZED_FILE = path.join(__dirname, '../logs/maat_quarantine/sanitized_data.out');

console.log("🐙 Iniciando núcleo lógico de didactic-octo-chrome...");

try {
    if (!fs.existsSync(SANITIZED_FILE)) {
        console.error("❌ Archivo sanitizado no detectado. Ejecuta el Gerrit-Client primero.");
        process.exit(1);
    }

    // Leemos el archivo purificado en cuarentena
    const rawData = fs.readFileSync(SANITIZED_FILE, 'utf8').trim();
    console.log("🛡️ Leyendo payload purificado por el Protocolo Maat...");

    // Sensor de Estructura: Detectando si es HTML o JSON
    if (rawData.startsWith('<!DOCTYPE') || rawData.startsWith('<html')) {
        console.log("🌐 Detectada matriz HTML (Web Scrape). Analizando nodos...");
        
        // Extracción táctica del título real usando expresiones regulares avanzadas
        const titleMatch = rawData.match(/<title[^>]*>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'Nodo de título no encontrado';
        
        console.log("✅ Escaneo HTML completado con éxito.");
        console.log(`📊 Peso del bloque analizado: ${rawData.length} bytes.`);
        console.log(`📌 Información extraída -> Título del Nodo: ${title}`);
        
    } else {
        console.log("🧩 Detectada matriz JSON (API Endpoint). Procesando nodos...");
        const parsedData = JSON.parse(rawData);
        
        console.log("✅ Decodificación JSON exitosa.");
        console.log(`📊 Tamaño del payload: ${Object.keys(parsedData).length} raíces detectadas.`);
    }

} catch (error) {
    console.error("❌ Falla de parseo térmico en el motor:", error.message);
}
