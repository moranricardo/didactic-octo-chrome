#!/bin/bash
# Bot de ejecución rápida para Protocolo 818
# Automatiza la captura de evidencias y validación

set -e  # Exit on error

echo "🤖 Iniciando Bot de Evidencias - Protocolo 818..."
echo "⏰ Timestamp: "+$(date '+%Y-%m-%d %H:%M:%S')

# 1. Validar que Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado."
    exit 1
fi

# 2. Validar que las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# 3. Crear directorio de evidencias si no existe
mkdir -p evidencias
mkdir -p logs

# 4. Ejecutar el script de Puppeteer con timestamp
echo "📸 Capturando evidencia..."
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
LOG_FILE="logs/execution_${TIMESTAMP}.log"

node screenshot-monitor.js >> "$LOG_FILE" 2>&1 || {
    echo "❌ Error: Fallo en la ejecución del script de Puppeteer"
    cat "$LOG_FILE"
    exit 1
}

# 5. Verificar si se creó la imagen
SCREENSHOT_COUNT=$(ls -1 evidencias/*.png 2>/dev/null | wc -l)

if [ "$SCREENSHOT_COUNT" -gt 0 ]; then
    LATEST_SCREENSHOT=$(ls -t evidencias/*.png | head -1)
    echo "✅ Evidencia capturada exitosamente: $LATEST_SCREENSHOT"
    echo "📊 Total de evidencias: $SCREENSHOT_COUNT"
    
    # 6. Registrar en log
    echo "✅ Ejecución exitosa - $(date)" >> "$LOG_FILE"
    
    # 7. Mostrar información de la evidencia
    FILE_SIZE=$(ls -lh "$LATEST_SCREENSHOT" | awk '{print $5}')
    echo "📁 Tamaño: $FILE_SIZE"
    echo ""
    echo "✨ Bot de Evidencias ejecutado correctamente"
else
    echo "❌ Error: No se pudo generar la evidencia."
    echo "❌ Fallo - $(date)" >> "$LOG_FILE"
    exit 1
fi
