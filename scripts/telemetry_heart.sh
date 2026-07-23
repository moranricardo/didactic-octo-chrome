#!/bin/bash
# ==========================================
# Telemetry-Heart - Vórtice Toroidal (818)
# ==========================================

TIMESTAMP=$(date -u +%FT%TZ)
CLONE_FILE="config/clone_injection.json"
STATE_FILE="logs/state.json"

echo "Iniciando escaneo del núcleo..."

# Extrayendo datos del ADN inyectado usando grep y awk
if [ -f "$CLONE_FILE" ]; then
    ENTITY=$(grep '"name"' $CLONE_FILE | awk -F'"' '{print $4}')
    VIBE=$(grep '"focus_state"' $CLONE_FILE | awk -F'"' '{print $4}')
    GENRE=$(grep '"primary_genre"' $CLONE_FILE | awk -F'"' '{print $4}')
else
    ENTITY="Entidad Chrome-mobile-es-419"
    VIBE="Descalibrado"
    GENRE="Ruido Blanco"
fi

# Inyectando el pulso en el state.json usando la firma RAPULSE
cat <<RAPULSE > $STATE_FILE
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

echo "🌀 Pulso Toroidal registrado exitosamente por $ENTITY."
echo "Estado actual guardado en: $STATE_FILE"
