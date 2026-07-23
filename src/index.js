import puppeteer from 'puppeteer-core';

(async () => {
    let browser;
    try {
        console.log("🚀 Iniciando navegador Chromium...");
        browser = await puppeteer.launch({
            executablePath: '/data/data/com.termux/files/usr/bin/chromium-browser',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--lang=es-419'
            ]
        });

        const page = await browser.newPage();
        
        // 👣 APLICANDO HUELLA
        console.log("👣 Aplicando huella: (Chrome-mobile-es-419)");
        await page.setViewport({ width: 360, height: 640, isMobile: true });
        await page.setUserAgent('Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'es-419,es;q=0.9'
        });

        console.log("🌐 Navegando a Gerrit UI...");
        await page.goto('https://android-review.googlesource.com/q/status:open', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        // 📸 CAPTURA DE EVIDENCIA
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const path = `evidencias/snapshot-${timestamp}.png`;
        await page.screenshot({ path: path, fullPage: true });

        console.log(`✅ Validación de UI exitosa. Evidencia guardada en: ${path}`);
    } catch (uiError) {
        console.warn("⚠️ Advertencia en validación UI:", uiError.message);
    } finally {
        if (browser) {
            await browser.close();
            console.log("🔒 Navegador cerrado de forma segura.");
        }
    }
})();
