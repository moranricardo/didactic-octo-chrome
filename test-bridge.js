 Updated upstream
import puppeteer from 'puppeteer';

 HEAD
const puppeteer = require('puppeteer-core');

const puppeteer = require('puppeteer');
 bb018d5 (Limpiar y restaurar test-bridge.js)
 Stashed changes

async function checkBridge() {
  console.log("Iniciando validación de puente entre octocromo y titiritero...");
  
  try {
    const browser = await puppeteer.launch({
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

 Updated upstream
checkBridge();

 HEAD
checkBridge();

checkBridge();
 bb018d5 (Limpiar y restaurar test-bridge.js)
 Stashed changes
