import { getGerritData, getUrgentCommits } from './3_Resources/herramientas/lib-gerrit.js';

async function testDrive() {
    console.log('--- ☀️ INICIANDO CICLO DE RA: PRUEBA DE PULSO ---');

    try {
        console.log('\n[Fase 1] Verificando Maat con endpoint público...');
        const publicChanges = await getGerritData('changes/?q=status:open&n=3');
        
        const count = Array.isArray(publicChanges) ? publicChanges.length : 0;
        console.log(`✅ Conexión establecida. Se detectaron ${count} cambios abiertos en el servidor.`);

        console.log('\n[Fase 2] Invocando el radar analítico (getUrgentCommits)...');
        const urgentCommits = await getUrgentCommits(5);

        console.log('\n--- 📋 REPORTE DE ANOMALÍAS ENCONTRADAS ---');
        if (!urgentCommits || urgentCommits.length === 0) {
            console.log('✨ El horizonte está despejado. No se encontraron bloqueos CR-2 o Verified-1.');
        } else {
            console.table(urgentCommits);
        }

        console.log('\n⚡ El pulso del sistema es óptimo. Listos para producción.');

    } catch (err) {
        console.error('\n🚨 ¡APOFIS HA ATACADO EL FLUJO! Error en el Duat:');
        console.error(`💥 Mensaje: ${err.message || err}`);
        process.exit(1);
    }
}

testDrive();
