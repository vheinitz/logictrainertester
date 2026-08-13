#!/usr/bin/env python3
"""Schneidet aus einem Wimmelbild-Blatt den eigentlichen Bildbereich heraus.

Die Blätter haben immer denselben Aufbau: Überschrift, darunter die bunte
Illustration, darunter eine Tabelle mit Fragen und Koordinaten. Der Bildbereich
wird über die Farbsättigung gefunden – die Illustration ist bunt, Überschrift
und Tabelle sind grau. Anschließend wird der gefundene Streifen nach oben und
unten erweitert, solange die Zeilen nicht weiß sind (der helle Himmel am oberen
Bildrand ist kaum gesättigt und würde sonst abgeschnitten).

Aufruf:

    python3 tools/zuschneiden.py source/dorfplatz-original.jpg dorfplatz

Erzeugt:

    images/<id>.jpg          den zugeschnittenen Bildbereich
    build/<id>-tabelle.png   den Tabellenbereich, vergrößert, zum Abtippen/OCR
    build/<id>-geruest.js    ein Datei-Gerüst mit den erkannten Maßen

Die Fragen und Koordinaten trägt man danach von Hand (oder per OCR) in
data/<id>.js ein – siehe README.md.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

WURZEL = Path(__file__).resolve().parent.parent

# Ab dieser mittleren Sättigung je Zeile gilt eine Zeile als Illustration.
SAETTIGUNG_SCHWELLE = 40
# Ab dieser mittleren Helligkeit gilt eine Zeile als leer (Papierweiß).
WEISS_SCHWELLE = 247
# Kürzere Streifen sind Zierlinien o. Ä., kein Bildbereich.
MIN_HOEHE = 50


def streifen_finden(bild: Image.Image) -> tuple[int, int]:
    """Liefert (oben, unten) des Illustrationsbereichs in Pixelzeilen."""
    hsv = np.asarray(bild.convert("HSV")).astype(int)
    rgb = np.asarray(bild.convert("RGB")).astype(int)
    saettigung = hsv[:, :, 1].mean(axis=1)
    helligkeit = rgb.mean(axis=(1, 2))
    hoehe = len(saettigung)

    bunt = saettigung > SAETTIGUNG_SCHWELLE
    streifen, start = [], None
    for y in range(hoehe):
        if bunt[y] and start is None:
            start = y
        elif not bunt[y] and start is not None:
            streifen.append((start, y))
            start = None
    if start is not None:
        streifen.append((start, hoehe))

    streifen = [s for s in streifen if s[1] - s[0] >= MIN_HOEHE]
    if not streifen:
        raise SystemExit("Kein Bildbereich gefunden – Schwellen anpassen.")

    oben, unten = max(streifen, key=lambda s: s[1] - s[0])
    while oben > 0 and helligkeit[oben - 1] < WEISS_SCHWELLE:
        oben -= 1
    while unten < hoehe and helligkeit[unten] < WEISS_SCHWELLE:
        unten += 1
    return oben, unten


def spalten_finden(bild: Image.Image, oben: int, unten: int) -> tuple[int, int]:
    """Liefert (links, rechts) des Illustrationsbereichs in Pixelspalten."""
    rgb = np.asarray(bild.convert("RGB")).astype(int)
    helligkeit = rgb[oben:unten].mean(axis=(0, 2))
    gefuellt = np.where(helligkeit < WEISS_SCHWELLE)[0]
    if len(gefuellt) == 0:
        return 0, bild.width
    return int(gefuellt.min()), int(gefuellt.max()) + 1


def geruest(kennung: str, quelle: Path, zuschnitt: dict, groesse: dict) -> str:
    return f"""// Datensatz "{kennung}" – erzeugt von tools/zuschneiden.py, Fragen noch eintragen.
Wimmelbild.register({{
  id: '{kennung}',
  titel: '{kennung}',
  bild: 'images/{kennung}.jpg',
  bildGroesse: {{ breite: {groesse['breite']}, hoehe: {groesse['hoehe']} }},
  koordinatenRaum: {{ breite: 1000, hoehe: 1500 }},
  toleranz: 0.06,
  koordinatenGeprueft: false,
  quelle: {{
    datei: '{quelle.as_posix()}',
    zuschnitt: {{ x: {zuschnitt['x']}, y: {zuschnitt['y']}, breite: {zuschnitt['breite']}, hoehe: {zuschnitt['hoehe']} }}
  }},
  fragen: [
    // {{ nr: 1, frage: 'Wo ist ...?', ziel: '...', x: 0, y: 0 }},
  ]
}});
"""


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Aufruf: zuschneiden.py <quellbild> <kennung>")
    quelle = Path(sys.argv[1])
    kennung = sys.argv[2]
    bild = Image.open(quelle)

    oben, unten = streifen_finden(bild)
    links, rechts = spalten_finden(bild, oben, unten)
    ausschnitt = bild.crop((links, oben, rechts, unten))

    (WURZEL / "images").mkdir(exist_ok=True)
    (WURZEL / "build").mkdir(exist_ok=True)
    ziel = WURZEL / "images" / f"{kennung}.jpg"
    ausschnitt.convert("RGB").save(ziel, quality=92, optimize=True)

    # Alles unterhalb der Illustration ist der Fragenteil – vergrößert
    # abgelegt, damit man ihn bequem abtippen oder durch eine OCR schicken kann.
    tabelle = bild.crop((0, unten, bild.width, bild.height))
    if tabelle.height > 20:
        tabelle.resize((tabelle.width * 2, tabelle.height * 2), Image.LANCZOS).save(
            WURZEL / "build" / f"{kennung}-tabelle.png"
        )

    zuschnitt = {"x": links, "y": oben, "breite": rechts - links, "hoehe": unten - oben}
    groesse = {"breite": ausschnitt.width, "hoehe": ausschnitt.height}
    (WURZEL / "build" / f"{kennung}-geruest.js").write_text(
        geruest(kennung, quelle, zuschnitt, groesse), encoding="utf-8"
    )

    print(f"Bildbereich  : x={links} y={oben} {zuschnitt['breite']}x{zuschnitt['hoehe']}")
    print(f"geschrieben  : {ziel.relative_to(WURZEL)}")
    print(f"               build/{kennung}-tabelle.png")
    print(f"               build/{kennung}-geruest.js")


if __name__ == "__main__":
    main()
