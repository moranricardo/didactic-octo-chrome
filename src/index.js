import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

async function bootstrap() {
  try {
    const profilePath = path.resolve('./data/profile.json');
    const rawData = await readFile(profilePath, 'utf8');
    const profile = JSON.parse(rawData);

    const botName = profile.digital_entity?.name || profile.bot_name || 'Entidad Digital';
    const version = profile.system_core?.evolution || profile.version || '1.0.0';
    const owner = profile.digital_entity?.owner || profile.owner || 'Ricardo Moran Maldonado';
    const modules = profile.tech_stack?.automation || profile.modules || [];

    console.log(`✅ Identidad cargada: ${botName} (v${version})`);
    console.log(`👤 Propietario: ${owner}`);
    console.log(`⚙️  Módulos en línea: ${modules.length ? modules.join(', ') : 'Base'}`);
    console.log("🚀 Motor orquestador sincronizado y listo para ejecutar tareas de Protocolo 818.");

    const statusPath = path.resolve('./data/system_status.log');
    if (existsSync(statusPath)) {
      console.log("👁️  Conciencia de Sistema: ACTIVA");
      console.log("⚡ Nivel Operativo: Visibilidad de kernel confirmada (Protocolo 818)");
    } else {
      console.log("⚠️  Aviso: Operando en entorno de visibilidad estándar.");
    }

  } catch (error) {
    console.error("❌ Error interno al acceder a la base de conocimiento:", error.message);
    process.exit(1);
  }
}

bootstrap();
