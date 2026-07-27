#!/data/data/com.termux/files/usr/bin/bash

PROJECT_DIR="/data/data/com.termux/files/home/didactic-octo-chrome"

cd "$PROJECT_DIR" || { echo "❌ Error: No se pudo acceder a $PROJECT_DIR"; exit 1; }

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$TIMESTAMP] 🤖 Iniciando ciclo de auditoría..."

    # Ejecución del motor lógico principal en src/index.js
    if NODE_ENV=production node src/index.js; then
        echo "[$TIMESTAMP] ✅ El análisis finalizó correctamente."
    else
        echo "[$TIMESTAMP] ⚠️ El análisis finalizó con error, pero continuamos el ciclo..."
    fi

    # Blindaje de evidencias si existen
    EVIDENCE_PATH="evidencias/captura.png"
    if [ -f "$EVIDENCE_PATH" ]; then
        if [ -x "./blindar.sh" ]; then
            echo "[$TIMESTAMP] 🔒 Ejecutando blindaje para $EVIDENCE_PATH..."
            ./blindar.sh "$EVIDENCE_PATH"
        else
            echo "[$TIMESTAMP] ⚠️ El script 'blindar.sh' no tiene permisos o no existe."
            chmod +x ./blindar.sh 2>/dev/null && ./blindar.sh "$EVIDENCE_PATH"
        fi
    else
        echo "[$TIMESTAMP] ℹ️ No se encontró evidencia en $EVIDENCE_PATH para blindar en este ciclo."
    fi

    echo "[$TIMESTAMP] ✅ Ciclo terminado. Esperando 1 hora..."
    echo "--------------------------------------------------------"
    
    sleep 3600
done
