// test-connection.js (Versión independiente para aprendizaje)

async function testDrive() {
  console.log('--- ☀️ PRUEBA DE CONEXIÓN HTTP ---');

  try {
    console.log('[1/2] Consultando API pública de prueba...');
    
    // Consulta a una API pública JSON sin requerir librerías locales
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    
    if (!response.ok) {
      throw new Error(`Estado de respuesta HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Datos recibidos con éxito:');
    console.table(data);

    console.log('\n⚡ Ejecución completada correctamente.');

  } catch (err) {
    console.error('\n🚨 Error en la conexión:');
    console.error(`💥 Mensaje: ${err.message}`);
    process.exit(1);
  }
}

testDrive();
