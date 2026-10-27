#!/usr/bin/env bash
# Genera el paquete de despliegue de "Huellitas en Casa".
# Uso: ./build.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "1) Minificando CSS y JS..."
npx --yes clean-css-cli -o css/styles.min.css css/styles.css
npx --yes terser js/app.js --compress --mangle -o js/app.min.js

echo "2) Armando carpeta dist/ con la estructura final..."
rm -rf dist tuapp.zip tuapp.tar.gz
mkdir -p dist/css dist/js dist/img
cp index.html dist/
cp css/styles.min.css dist/css/
cp js/app.min.js dist/js/
cp img/*.jpg dist/img/

echo "3) Comprimiendo paquete..."
(cd dist && zip -qr ../tuapp.zip .)
tar -czf tuapp.tar.gz -C dist .

echo "Listo:"
ls -lh tuapp.zip tuapp.tar.gz
