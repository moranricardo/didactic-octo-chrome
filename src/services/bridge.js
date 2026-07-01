import puppeteer from 'puppeteer-core';

export async function launchBridge() {
  console.log("🚀 Iniciando puente de telemetría (ESM + Chromium Local)...");
  
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-zygote'
      ]
    });
    
    return browser;
  } catch (error) {
    console.error("❌ Fallo crítico en el puente:", error.message);
    throw error;
  }
}

