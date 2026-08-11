import puppeteer from 'puppeteer-core';
import { execSync } from 'child_process';
import fs from 'fs';

function getChromiumPath() {
  try {
    const path = execSync('command -v chromium || command -v chromium-browser', { encoding: 'utf8' }).trim();
    if (path && fs.existsSync(path)) return path;
  } catch (e) {}

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
  console.log("🚀 Iniciando validación de puente (Modo ESM)...");

  const chromiumPath = getChromiumPath();

  if (!chromiumPath) {
    console.error("❌ Error: No se encontró el binario de Chromium en el entorno.");
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
