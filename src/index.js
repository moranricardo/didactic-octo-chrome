const fs = require('fs');
const path = require('path');

console.log("🐙 Iniciando núcleo lógico de didactic-octo-chrome (Evolución P.A.R.A)...");

const profilePath = path.join(__dirname, '../data/profile.json');

try {
  if (!fs.existsSync(profilePath)) {
    console.error("❌ Archivo de identidad (profile.json) no detectado. Memoria vacía.");
    process.exit(1);
  }

  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
  
  console.log(`✅ Identidad cargada: ${profile.bot_name} (v${profile.version})`);
  console.log(`👤 Propietario: ${profile.owner}`);
  console.log(`⚙️ Módulos en línea: ${profile.modules.join(', ')}`);
  console.log("🚀 Motor orquestador sincronizado y listo para ejecutar tareas de Protocolo 818.");
  
} catch (error) {
  console.error("❌ Error interno al acceder a la base de conocimiento:", error.message);
  process.exit(1);
}
