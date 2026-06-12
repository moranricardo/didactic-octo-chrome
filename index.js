import puppeteer from 'puppeteer-core';
import { getUrgentCommits } from './lib-gerrit.js';
import { createGitHubIssue } from './lib-github.js';

// Detección dinámica de ejecutables para entornos híbridos
const executablePath = process.env.GITHUB_ACTIONS
  ? '/usr/bin/google-chrome'
  : '/data/data/com.termux/files/usr/lib/chromium/headless_shell';

async function main() {
    console.log('--- 🚀 DESPERTANDO EL ORQUESTADOR CENTRAL ---');
    
    try {
        // 🛡️ FASE 1: Análisis y Reporte Automático por API
        console.log('\n[Fase API] Iniciando escaneo en Gerrit...');
        const urgentCommits = await getUrgentCommits(3); // Capturamos las 3 anomalías top
        
        if (urgentCommits.length > 0) {
            console.log(`⚠️ Se detectaron ${urgentCommits.length} anomalías críticas en Gerrit.`);
            
            // Construir un cuerpo estilizado en Markdown para el Issue de GitHub
            const tituloIssue = `🚨 Reporte Automatizado: Anomalías detectadas en Gerrit (${new Date().toLocaleDateString()})`;
            let cuerpoIssue = `## ⚠️ Reporte Crítico de Estado de Commits\n\n`;
            cuerpoIssue += `El sistema automático ha detectado bloqueos activos en el servidor de Android Review. Se requiere atención inmediata:\n\n`;
            cuerpoIssue += `| ID Cambio | Subproyecto | Descripción / Asunto | Estado de Alerta |\n`;
            cuerpoIssue += `| --- | --- | --- | --- |\n`;
            
            urgentCommits.forEach(c => {
                cuerpoIssue += `| \`${c.id}\` | **${c.proyecto}** | ${c.asunto} | ${c.alerta} |\n`;
            });
            
            cuerpoIssue += `\n\n_Generado automáticamente desde Termux de forma segura mediante Ra Pulse_ ⚡`;

            // Despachar el reporte directo a tu repositorio de GitHub
            const nuevoIssue = await createGitHubIssue(tituloIssue, cuerpoIssue);
            console.log(`✅ ¡Puente completado! Alerta publicada con éxito.`);
            console.log(`🔗 Consulta el Issue aquí: ${nuevoIssue.html_url}`);
        } else {
            console.log('✨ El ecosistema está estable. No hay anomalías que reportar hoy.');
        }

        // 🌐 FASE 2: Motor Visual Automático (Puppeteer)
        console.log('\n[Fase Puppeteer] Activando sandbox para futuras auditorías visuales...');
        const browser = await puppeteer.launch({
            executablePath,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new']
        });

        const page = await browser.newPage();
        // Reservado para flujos complejos de navegación...
        
        await browser.close();
        console.log('\n--- 🏁 PROCESO HÍBRIDO COMPLETADO CON ÉXITO ---');

    } catch (error) {
        console.error('\n🚨 Fallo catastrófico en la ejecución principal:', error.message);
        process.exit(1);
    }
}

main();
