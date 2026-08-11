#!/bin/bash
# Script de blindaje Protocolo 818 (Versión Mejorada)

FILE="$1"

# 1. Validar que se haya proporcionado un argumento
if [ -z "$FILE" ]; then
    echo "❌ Error: Debes especificar un archivo. Uso: $0 <archivo>"
    exit 1
fi

# 2. Verificar que el archivo existe
if [ -f "$FILE" ]; then
    echo "🔒 Iniciando proceso de blindaje para: $FILE..."

    # Cifrado GPG usando algoritmo fuerte (AES256)
    # Se solicita la contraseña directamente sin exponerla en el código
    gpg --symmetric --cipher-algo AES256 "$FILE"

    # 3. Verificación y borrado seguro del original
    if [ -f "$FILE.gpg" ]; then
        # Se intenta borrado seguro con shred si está disponible; si no, rm habitual
        if command -v shred &> /dev/null; then
            shred -u -z -n 3 "$FILE"
        else
            rm -f "$FILE"
        fi
        echo "✅ Blindaje exitoso: $FILE ha sido cifrado y eliminado de forma segura."
    else
        echo "❌ Error: Falló la creación de $FILE.gpg."
        exit 1
    fi
else
    echo "⚠️ Archivo '$FILE' no encontrado para blindar."
    exit 1
fi
