#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date -u +%FT%TZ)
PRIMARY_PROFILE="data/profile.json"
SECONDARY_PROFILE="config/clone_injection.json"
STATE_FILE="logs/state.json"

mkdir -p logs

echo "🌀 Initiating Core Telemetry Scan..."

read_json_field() {
    local file="$1"
    local query="$2"
    if command -v jq >/dev/null 2>&1; then
        jq -r "$query // empty" "$file" 2>/dev/null || true
    fi
}

ENTITY=""
VIBE=""
GENRE=""

if [ -f "$PRIMARY_PROFILE" ]; then
    ENTITY=$(read_json_field "$PRIMARY_PROFILE" '.digital_entity.name')
    VIBE=$(read_json_field "$PRIMARY_PROFILE" '.frequency_vibe.focus_state')
    GENRE=$(read_json_field "$PRIMARY_PROFILE" '.frequency_vibe.primary_genre')
elif [ -f "$SECONDARY_PROFILE" ]; then
    ENTITY=$(read_json_field "$SECONDARY_PROFILE" '.name')
    VIBE=$(read_json_field "$SECONDARY_PROFILE" '.focus_state')
    GENRE=$(read_json_field "$SECONDARY_PROFILE" '.primary_genre')
fi

# Fallback si no se encontró con jq o archivo
[ -z "$ENTITY" ] && ENTITY="Ricardo Moran Maldonado"
[ -z "$VIBE" ] && VIBE="High-energy coding flow"
[ -z "$GENRE" ] && GENRE="Rap 90s"

cat <<RAPULSE > "$STATE_FILE"
{
  "telemetry_pulse": "$TIMESTAMP",
  "system_status": "ONLINE",
  "active_entity": "$ENTITY",
  "frequency": {
    "state": "$VIBE",
    "background_noise": "$GENRE"
  },
  "toroid_vortex": "Estable y en expansión",
  "location": "Tijuana, Baja California, Mexico - Nodos Locales"
}
RAPULSE

echo "⚡ Pulso Toroidal registrado exitosamente por $ENTITY."
echo "📍 Estado actual guardado en: $STATE_FILE"
