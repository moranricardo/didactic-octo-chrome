import puppeteer from 'puppeteer-core';

// Detección dinámica del ejecutable según el entorno
const executablePath = process.env.GITHUB_ACTIONS
  ? '/usr/bin/google-chrome'
  : '/data/data/com.termux/files/usr/lib/chromium/headless_shell';

try {
  const browser = await puppeteer.launch({
    executablePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--headless=new'
    ]
  });

  const page = await browser.newPage();
  // Tu flujo base de scraping o monitoreo aquí
  
  await browser.close();
  console.log("Proceso completado exitosamente.");
} catch (error) {
  console.error("Error durante la ejecución:", error);
  process.exit(1);
}
