import { getGerritData, getUrgentCommits } from './lib-gerrit.js';

async function testDrive() {
    console.log('--- ☀️ INICIANDO CICLO DE RA: PRUEBA DE PULSO ---');
    
    try {
        // 1. Validar conectividad general con un endpoint público (Últimos 3 cambios abiertos)
        console.log('\n[Fase 1] Verificando Maat con endpoint público...');
        const publicChanges = await getGerritData('changes/?q=status:open&n=3');
        console.log(`✅ Conexión establecida. Se detectaron ${publicChanges.length} cambios abiertos en el servidor.`);

        // 2. Validar el extractor especializado de anomalías críticas (Bloqueos)
        console.log('\n[Fase 2] Invocando el radar analítico (getUrgentCommits)...');
        const urgentCommits = await getUrgentCommits(5);
        
        console.log('\n--- 📋 REPORTE DE ANOMALÍAS ENCONTRADAS ---');
        if (urgentCommits.length === 0) {
            console.log('✨ El horizonte está despejado. No se encontraron bloqueos CR-2 o Verified-1.');
        } else {
            console.table(urgentCommits);
        }
        
        console.log('\n⚡ El pulso del sistema es óptimo. Listos para producción.');

    } catch (err) {
        console.error('\n🚨 ¡APOFIS HA ATACADO EL FLUJO! Error en el Duat:');
        console.error(`💥 Mensaje: ${err.message}`);
    }
}

testDrive();
