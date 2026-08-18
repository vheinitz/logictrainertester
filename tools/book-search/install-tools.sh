#!/usr/bin/env bash
#
# Werkzeug für die Buch-Extraktion installieren.
# Aufruf:  sudo ./tools/book-search/install-tools.sh
#
# Installiert nur:
#   djvulibre-bin        → djvutxt, ddjvu (echte Textlayer aus DJVU holen)
#
# **Kein OCR.** Reine/vorwiegende Bild-Scans werden gelöscht, nicht OCR-t.
# tesseract ist bewusst NICHT enthalten.

set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  echo "Bitte mit sudo aufrufen:  sudo $0" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

echo "== apt aktualisieren =="
apt-get update -y

echo "== Paket installieren ="
apt-get install -y djvulibre-bin

echo
echo "== Prüfung =="
command -v djvutxt && echo "djvutxt OK" || true
command -v ddjvu  && echo "ddjvu OK" || true

echo
echo "Fertig. Danach in tools/book-search:"
echo "  python3 pipeline.py extract   # neu extrahieren (jetzt mit DJVU-Textlayern)"
