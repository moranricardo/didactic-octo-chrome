#!/bin/bash
# Script de blindaje Protocolo 818
FILE=$1

if [ -f "$FILE" ]; then
    # Cifrado GPG usando tu contraseña Moto818#
    echo 'Moto818#' | gpg --batch --yes --passphrase-fd 0 -c "$FILE"
    
    # Verificación y borrado del original
    if [ -f "$FILE.gpg" ]; then
        rm -f "$FILE"
        echo "✅ Blindaje exitoso: $FILE eliminado."
    else
        echo "❌ Error en el blindaje."
    fi
else
    echo "⚠️ Archivo no encontrado para blindar."
fi
