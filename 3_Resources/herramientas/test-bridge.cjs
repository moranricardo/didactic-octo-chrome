const puppeteer = require('puppeteer-core');
const { execSync } = require('child_process');
const fs = require('fs');

/**
 * Detecta dinámicamente la ruta de Chromium en cualquier sistema (Linux, macOS, Docker, Termux)
 */
function getChromiumPath() {
  // 1. Prioridad: Variable de entorno definida por el usuario o pipeline (CI/CD)
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  // 2. Intentar buscar en el PATH del sistema operativo de forma dinámica
  try {
    const path = execSync('command -v chromium || command -v chromium-browser || command -v google-chrome', { encoding: 'utf8' }).trim();
    if (path && fs.existsSync(path)) return path;
  } catch (e) {
    // Ignorar si falla el comando en el entorno
  }

  // 3. Fallback: Rutas estándares conocidas en múltiples entornos
  const commonPaths = [
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/data/data/com.termux/files/usr/bin/chromium'
  ];

  for (const path of commonPaths) {
    if (fs.existsSync(path)) return path;
  }

  return null;
}

async function checkBridge() {
  console.log("🚀 Iniciando validación del puente de automatización...");

  const chromiumPath = getChromiumPath();

  if (!chromiumPath) {
    console.error("❌ Error: No se encontró un binario de Chromium o Chrome en el sistema.");
    console.log("💡 Asegúrate de tener Chromium/Chrome instalado en tu entorno.");
    process.exit(1);
  }

  console.log(`📍 Navegador detectado en: ${chromiumPath}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: chromiumPath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote'
      ]
    });

    const page = await browser.newPage();
    console.log("📡 Validando respuesta de navegación...");
    
    await page.goto('https://httpbin.org/status/200', { waitUntil: 'domcontentloaded', timeout: 15000 });

    console.log("✅ Puente exitoso: Navegador operativo.");

  } catch (error) {
    console.error("❌ Fallo en el puente de automatización:", error.message || error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

checkBridge();
