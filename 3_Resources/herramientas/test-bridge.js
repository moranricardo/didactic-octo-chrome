import puppeteer from 'puppeteer-core';
import { execSync } from 'child_process';
import fs from 'fs';

function getChromiumPath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const commands = [
    'command -v chromium',
    'command -v chromium-browser',
    'command -v google-chrome'
  ];

  for (const cmd of commands) {
    try {
      const path = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
      if (path && fs.existsSync(path)) return path;
    } catch (e) {}
  }

  return null;
}

async function checkBridge() {
  console.log("🚀 Iniciando validación de puente (Modo ESM)...");

  const chromiumPath = getChromiumPath();

  if (!chromiumPath) {
    console.error("❌ Error: No se encontró un binario de Chromium o Chrome en el PATH del sistema.");
    console.error("💡 Asegúrate de tener instalado Chromium o define la variable PUPPETEER_EXECUTABLE_PATH.");
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
    console.log("📡 Abriendo canal de telemetría...");
    await page.goto('https://httpbin.org/status/200', { waitUntil: 'domcontentloaded', timeout: 15000 });

    console.log("🌐 Puente exitoso: Navegador Chromium operativo.");
  } catch (error) {
    console.error("❌ Fallo en el puente de automatización:", error.message || error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

checkBridge();
