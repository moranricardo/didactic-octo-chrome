import puppeteer from 'puppeteer-core';
import { execSync } from 'child_process';
import fs from 'fs';

function getChromiumPath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const binaries = ['chromium', 'chromium-browser', 'google-chrome', 'chrome'];

  for (const bin of binaries) {
    try {
      const path = execSync(`command -v ${bin}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], shell: true }).trim();
      if (path && fs.existsSync(path)) return path;
    } catch (e) {}
  }

  return null;
}

async function checkLightweightBridge() {
  console.log("⚡ Ejecutando validación de puente ligero (Modo Telemetría/Nube)...");
  try {
    const response = await fetch('https://httpbin.org/status/200');
    if (response.ok) {
      console.log("🌐 Conexión al puente exitosa (Modo Ligero). Listo para delegar trabajo pesado a GitHub.");
      return true;
    }
  } catch (err) {
    console.error("❌ Fallo de red en el puente ligero:", err.message);
  }
  return false;
}

async function checkBridge() {
  console.log("🚀 Iniciando comprobación de puente...");

  const chromiumPath = getChromiumPath();

  if (!chromiumPath) {
    console.log("ℹ️ No se detectó motor Chromium pesado local.");
    const isLightOk = await checkLightweightBridge();
    if (!isLightOk) {
      process.exit(1);
    }
    return;
  }

  console.log(`📍 Navegador pesado detectado en: ${chromiumPath}`);

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
    console.log("📡 Abriendo canal de telemetría...");
    await page.goto('https://httpbin.org/status/200', { waitUntil: 'domcontentloaded', timeout: 15000 });

    console.log("🌐 Puente exitoso: Navegador Chromium operativo localmente.");
  } catch (error) {
    console.error("❌ Fallo en el puente de automatización pesado:", error.message || error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

checkBridge();
