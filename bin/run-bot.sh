#!/data/data/com.termux/files/usr/bin/bash
cd /data/data/com.termux/files/home/didactic-octo-chrome
while true; do
    echo "[$(date)] 🤖 Iniciando auditoría..."
    
    # Ejecutamos el bot y forzamos que el script continúe aunque el bot falle
    node index.cjs || echo "⚠️ El bot finalizó con error, pero continuamos..."

    # Blindaje
    if [ -f "evidencias/captura.png" ]; then
        ./blindar.sh "evidencias/captura.png"
    fi

    echo "✅ Ciclo terminado. Esperando 1 hora..."
    sleep 3600
done
