import puppeteer from 'puppeteer-core';

async function checkBridge() {
  console.log("Iniciando validación de puente (Modo ESM + Binario Local)...");

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      // INYECCIÓN CRÍTICA: Apuntamos a la ruta real detectada por find
      executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser',
      // Parámetros de aislamiento optimizados para la RAM del Moto E6 Plus
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage', 
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    console.log("Abriendo canal de telemetría...");
    await page.goto('https://httpbin.org/status/200', { waitUntil: 'domcontentloaded' });
    
    console.log("🌐 Puente exitoso: Navegador Chromium operativo en Termux.");
    await browser.close();
  } catch (error) {
    console.error("❌ Fallo en el puente de automatización:", error.message || error);
    process.exit(1);
  }
}

checkBridge();

