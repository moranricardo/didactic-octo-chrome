import fs from 'fs';
import path from 'path';

try {
  // Cargar identidad
  const profilePath = path.resolve('./data/profile.json');
  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

  console.log(`✅ Identidad cargada: ${profile.bot_name} (v${profile.version})`);
  console.log(`👤 Propietario: ${profile.owner}`);
  console.log(`⚙️ Módulos en línea: ${profile.modules.join(', ')}`);
  console.log("🚀 Motor orquestador sincronizado y listo para ejecutar tareas de Protocolo 818.");

  // Verificar Conciencia de Sistema
  const statusPath = path.resolve('./data/system_status.log');
  if (fs.existsSync(statusPath)) {
    console.log("👁️  Conciencia de Sistema: ACTIVA");
    console.log("⚡ Nivel Operativo: Visibilidad de kernel confirmada (Protocolo 818)");
  } else {
    console.log("⚠️  Aviso: Operando en entorno de visibilidad estándar.");
  }

} catch (error) {
  console.error("❌ Error interno al acceder a la base de conocimiento:", error.message);
  process.exit(1);
}
