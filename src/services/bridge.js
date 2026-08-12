import puppeteer from 'puppeteer-core';
import { existsSync } from 'fs';

function getChromiumPath() {
  if (process.env.CHROMIUM_PATH && existsSync(process.env.CHROMIUM_PATH)) {
    return process.env.CHROMIUM_PATH;
  }

  const paths = [
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/data/data/com.termux/files/usr/bin/chromium-browser'
  ];

  return paths.find(p => existsSync(p)) || 'chromium-browser';
}

export async function launchBridge() {
  console.log("🚀 Iniciando puente de orquestación (Modo Ligero)...");

  const executablePath = getChromiumPath();

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath,
      userDataDir: process.env.SD_CACHE_DIR || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote',
        '--single-process',
        '--no-first-run',
        '--disable-extensions',
        '--disable-application-cache',
        '--media-cache-size=1',
        '--disk-cache-size=1'
      ]
    });

    console.log(`✅ Puente activo en Chromium [PID: ${browser.process()?.pid}]`);
    return browser;
  } catch (error) {
    console.error("❌ Error en el puente local (Delegar a GitHub Actions):", error.message);
    throw error;
  }
}
