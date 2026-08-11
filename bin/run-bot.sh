#!/usr/bin/env bash

# Determinar directorio raíz del proyecto dinámicamente
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$PROJECT_ROOT" || exit 1

while true; do
    echo "[$(date)] 🤖 Iniciando ciclo de auditoría..."

    # Ejecutar el proceso principal
    node index.cjs || echo "⚠️ El bot finalizó con error, pero continuamos..."

    # Blindaje de evidencias si existen
    if [ -f "evidencias/captura.png" ] && [ -x "./blindar.sh" ]; then
        ./blindar.sh "evidencias/captura.png"
    fi

    # Pausa de seguridad entre iteraciones
    sleep 5
done
