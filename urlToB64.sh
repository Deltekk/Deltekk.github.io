#!/bin/bash

URL="$1"

if [ -z "$URL" ]; then
    echo "Uso: $0 <URL>"
    exit 1
fi

# Controllo dipendenze
for CMD in curl magick base64 wl-copy; do
    if ! command -v "$CMD" &> /dev/null; then
        echo "Errore: '$CMD' non è installato."
        exit 1
    fi
done

echo "Elaborazione..."

(
    curl -L --fail --silent --show-error "$URL" | \
    magick - \
        -auto-orient \
        -resize "512x512" \
        -background transparent \
        -gravity center \
        -extent 512x512 \
        -strip \
        -quality 60 \
        webp:- | \
    base64 -w 0

) | wl-copy

if [ $? -eq 0 ]; then
    echo "✓ Immagine convertita e copiata negli appunti!"
    echo "✓ 512x512 WebP, qualità 60"
else
    echo "✗ Errore durante la conversione."
    exit 1
fi
