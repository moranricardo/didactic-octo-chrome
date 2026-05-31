 HEAD
const puppeteer = require('puppeteer-core');

const puppeteer = require('puppeteer');
 bb018d5 (Limpiar y restaurar test-bridge.js)

async function checkBridge() {
  console.log("Iniciando validación de puente entre octocromo y titiritero...");
  
  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome', // Ajusta según el path en tu runner
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    console.log("Puente exitoso: Navegador Chromium operativo.");
    
    await browser.close();
  } catch (error) {
    console.error("Fallo en el puente:", error);
    process.exit(1);
  }
}

 HEAD
checkBridge();

checkBridge();
 bb018d5 (Limpiar y restaurar test-bridge.js)
