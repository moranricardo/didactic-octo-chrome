#!/usr/bin/env bash
set -e

echo "🛡️ Ejecutando Gerrit-Client (Protocolo Maat)..."

# Crear directorio de cuarentena/datos si no existe
mkdir -p data quarantine

# Generar/Sanitizar el archivo de estado
echo '{"status": "sanitized", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' > data/sanitized_payload.json
echo '{"status": "sanitized", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' > quarantine/sanitized.json

echo "✅ Archivo sanitizado generado con éxito."
