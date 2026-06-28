const puppeteer = require('puppeteer-core');

async function checkBridge() {
  console.log("Iniciando validación de puente (Modo Limpio)...");

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    console.log("✅ Puente exitoso: Navegador Chromium operativo.");

    await browser.close();
  } catch (error) {
    console.error("❌ Fallo en el puente:", error.message);
    process.exit(1);
  }
}

checkBridge();

