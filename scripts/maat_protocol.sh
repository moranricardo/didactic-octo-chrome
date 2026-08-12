#!/usr/bin/env bash
set -euo pipefail

TARGET_URL="https://es.aptoide.com"
TIMESTAMP=$(date -u +%FT%TZ)

# Directorios de trabajo
LOG_DIR="logs/maat_quarantine"
mkdir -p "$LOG_DIR" data quarantine

CLEAN_FILE="$LOG_DIR/sanitized_data.out"
AUDIT_LOG="logs/maat_audit.log"
RAW_FILE=$(mktemp)

# Asegurar limpieza del temporal al salir (incluso en caso de error)
trap 'rm -f "$RAW_FILE"' EXIT

echo "🛡️ Iniciando Protocolo Maat..."
echo "📡 Interrogando nodo externo: $TARGET_URL"

# 1. Extracción con manejo de fallos HTTP (-f) y tiempo de espera (--connect-timeout)
if ! curl -sfL --connect-timeout 10 -A "Mozilla/5.0 (Bot Factory/818)" "$TARGET_URL" -o "$RAW_FILE"; then
    echo "❌ Error en la conexión HTTP con el nodo."
    echo "[${TIMESTAMP}] - ERROR - Origen: $TARGET_URL - Estado: Fallo de Conexión HTTP" >> "$AUDIT_LOG"
    exit 1
fi

# 2. Sanitización (Remover prefijo de seguridad JSON/Gerrit si existe)
echo "🧹 Ejecutando barrido de seguridad..."
sed 's/^[)]}\x27//g' "$RAW_FILE" > "$CLEAN_FILE"

# 3. Verificación de archivo no vacío
if [ -s "$CLEAN_FILE" ]; then
    # Duplicar a rutas secundarias
    cp "$CLEAN_FILE" data/sanitized_payload.json
    cp "$CLEAN_FILE" quarantine/sanitized.json

    echo "✅ Payload purificado y asegurado en: $CLEAN_FILE"
    echo "[${TIMESTAMP}] - ÉXITO - Origen: $TARGET_URL - Estado: Sanitizado" >> "$AUDIT_LOG"
else
    echo "❌ Falla de integridad: El archivo resultante está vacío."
    echo "[${TIMESTAMP}] - ERROR - Origen: $TARGET_URL - Estado: Payload Vacío" >> "$AUDIT_LOG"
    exit 1
fi

echo "🌀 Ciclo de interrogación completado."
