#!/usr/bin/env bash
set -e

TARGET_URL="https://es.aptoide.com"
TIMESTAMP=$(date -u +%FT%TZ)

# Crear todas las rutas posibles de cuarentena
mkdir -p logs/maat_quarantine data quarantine

RAW_FILE="logs/maat_quarantine/raw_payload.tmp"
CLEAN_FILE="logs/maat_quarantine/sanitized_data.out"
AUDIT_LOG="logs/maat_audit.log"

echo "🛡️ Iniciando Protocolo Maat..."
echo "📡 Interrogando nodo externo: $TARGET_URL"

# 1. Extracción de datos
curl -s -A "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome-mobile-es-419 Safari/537.36 (Bot Factory/818)" "$TARGET_URL" > "$RAW_FILE"

# 2. Sanitización
echo "🧹 Ejecutando barrido de seguridad..."
sed 's/^[)]}\x27//g' "$RAW_FILE" > "$CLEAN_FILE"

# Espejo en rutas secundarias por compatibilidad
cp "$CLEAN_FILE" data/sanitized_payload.json
cp "$CLEAN_FILE" quarantine/sanitized.json

# 3. Auditoría
if [ -s "$CLEAN_FILE" ]; then
    echo "✅ Payload purificado y asegurado en: $CLEAN_FILE"
    echo "[${TIMESTAMP}] - ÉXITO - Origen: $TARGET_URL - Estado: Sanitizado" >> "$AUDIT_LOG"
else
    echo "❌ Falla de integridad en la conexión con el nodo."
    echo "[${TIMESTAMP}] - ERROR - Origen: $TARGET_URL - Estado: Fallo de Extracción" >> "$AUDIT_LOG"
    exit 1
fi

rm -f "$RAW_FILE"
echo "🌀 Ciclo de interrogación completado."
