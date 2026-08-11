const puppeteer = require('puppeteer-core');
const { execSync } = require('child_process');
const fs = require('fs');

// Función para detectar la ruta dinámica de Chromium en Termux
function getChromiumPath() {
  // 1. Intentar obtener la ruta desde el comando 'which'
  try {
    const path = execSync('which chromium || which chromium-browser', { encoding: 'utf8' }).trim();
    if (path && fs.existsSync(path)) return path;
  } catch (e) {
    // Ignorar si falla el comando
  }

  // 2. Rutas comunes en Termux
  const commonPaths = [
    '/data/data/com.termux/files/usr/bin/chromium',
    '/data/data/com.termux/files/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];

  for (const path of commonPaths) {
    if (fs.existsSync(path)) return path;
  }

  return null;
}

async function checkBridge() {
  console.log("🚀 Iniciando validación de puente (Termux Chromium)...");

  const chromiumPath = getChromiumPath();

  if (!chromiumPath) {
    console.error("❌ Error: No se encontró el binario de Chromium.");
    console.log("💡 Sugerencia: Instálalo en Termux ejecutando: pkg install chromium");
    process.exit(1);
  }

  console.log(`📍 Chromium detectado en: ${chromiumPath}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: chromiumPath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    const title = await page.title();
    console.log(`✅ Puente exitoso: Navegador operativo. Título obtenido: "${title}"`);

  } catch (error) {
    console.error("❌ Fallo en el puente de automatización:", error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

checkBridge();
