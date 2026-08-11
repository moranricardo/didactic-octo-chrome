#!/bin/bash
# ==============================================================================
# Script de blindaje Protocolo 818 (Versión Efímera y Segura)
# Propósito: Cifrar archivos sensibles mediante AES256 y destruir el original.
# ==============================================================================

set -e

FILE="$1"

# 1. Validar argumento de entrada
if [ -z "$FILE" ]; then
    echo "❌ Error: Debes especificar un archivo."
    echo "💡 Uso: $0 <archivo>"
    exit 1
fi

# 2. Verificar dependencias del sistema
if ! command -v gpg &> /dev/null; then
    echo "❌ Error: 'gpg' no está instalado."
    echo "💡 Instálalo ejecutando: pkg install gnupg (en Termux) o apt install gnupg"
    exit 1
fi

# 3. Verificar existencia del archivo objetivo
if [ ! -f "$FILE" ]; then
    echo "⚠️ Error: El archivo '$FILE' no existe o no es un archivo regular."
    exit 1
fi

echo "🔒 Iniciando proceso de blindaje para: '$FILE'..."

# 4. Cifrado GPG usando algoritmo fuerte (AES256)
gpg --symmetric --cipher-algo AES256 "$FILE"

# 5. Verificación y borrado seguro del original
if [ -f "${FILE}.gpg" ]; then
    echo "🧹 Eliminando original de forma segura..."
    if command -v shred &> /dev/null; then
        shred -u -z -n 3 "$FILE"
    else
        rm -f "$FILE"
    fi
    echo "✅ Blindaje exitoso: '${FILE}.gpg' generado y original eliminado."
else
    echo "❌ Error crítico: Falló la creación del archivo cifrado '${FILE}.gpg'."
    exit 1
fi
