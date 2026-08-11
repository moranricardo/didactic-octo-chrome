const puppeteer = require('puppeteer-core');

async function checkBridge() {
  console.log("🚀 Iniciando validación de puente (Termux Chromium)...");

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser',
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
