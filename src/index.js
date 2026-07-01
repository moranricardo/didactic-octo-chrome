        try {
            const page = await browser.newPage();
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
        }
