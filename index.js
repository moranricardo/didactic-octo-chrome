import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/data/data/com.termux/files/usr/lib/chromium/headless_shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  await page.screenshot({ path: 'evidencias/captura.png' });
  console.log('Captura realizada con éxito');
  await browser.close();
})();
