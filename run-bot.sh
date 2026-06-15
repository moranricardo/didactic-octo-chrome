#!/data/data/com.termux/files/usr/bin/bash
# Protocolo 818 - Ejecución automatizada

# 1. Limpieza inicial de seguridad
rm -f evidencias/captura.png

# 2. Ejecutar bot
echo "🤖 Iniciando captura..."
if node index.js; then
    echo "📸 Captura completada."
    
    # 3. Blindaje automático
    if [ -f "evidencias/captura.png" ]; then
        echo "🔒 Blindando..."
        bash blindar.sh "evidencias/captura.png"
    fi
else
    echo "❌ Error en el bot."
fi

echo "✅ Proceso finalizado."
