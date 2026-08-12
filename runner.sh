#!/usr/bin/env bash

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR" || { echo "❌ Error: No se pudo acceder a $PROJECT_DIR"; exit 1; }

trap 'echo -e "\n🛑 Auditoría interrumpida por el usuario. Saliendo..."; exit 0' SIGINT SIGTERM

EVIDENCE_PATH="evidencias/captura.png"
BLINDAR_SCRIPT="./blindar.sh"
INTERVALO_SEGUNDOS=3600

echo "🚀 Demonio de Auditoría iniciado en: $PROJECT_DIR"
echo "--------------------------------------------------------"

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$TIMESTAMP] 🤖 Iniciando ciclo de auditoría..."

    if NODE_ENV=production node src/index.js; then
        echo "[$TIMESTAMP] ✅ El análisis finalizó correctamente."
    else
        echo "[$TIMESTAMP] ⚠️ El análisis finalizó con error, pero continuamos el ciclo..."
    fi

    if [ -f "$EVIDENCE_PATH" ]; then
        if [ -f "$BLINDAR_SCRIPT" ]; then
            [ ! -x "$BLINDAR_SCRIPT" ] && chmod +x "$BLINDAR_SCRIPT" 2>/dev/null
            echo "[$TIMESTAMP] 🔒 Ejecutando blindaje para $EVIDENCE_PATH..."
            "$BLINDAR_SCRIPT" "$EVIDENCE_PATH"
        else
            echo "[$TIMESTAMP] ⚠️ No se encontró el script '$BLINDAR_SCRIPT' para blindar evidencia."
        fi
    else
        echo "[$TIMESTAMP] ℹ️ No se encontró evidencia en $EVIDENCE_PATH en este ciclo."
    fi

    echo "[$TIMESTAMP] ✅ Ciclo terminado. Esperando 1 hora..."
    echo "--------------------------------------------------------"

    sleep $INTERVALO_SEGUNDOS &
    wait $!
done
