import { promises as fs } from 'fs';
import { getGerritData } from '../lib/lib-gerrit.js';

async function runPulse() {
    console.log("📡 Ra Pulse: Iniciando auditoría...");
    try {
        const data = await getGerritData('/changes/?q=status:open');
        await fs.writeFile('state.json', JSON.stringify(data, null, 2));
        console.log("💾 Estado persistido exitosamente.");
    } catch (error) {
        console.error("❌ Error en Ra Pulse:", error.message);
    }
}

runPulse();

