#!/usr/bin/env python3
"""Annotiert die 5x5-Blätter für die Bildgeschichten-App.

Grok legt pro Blatt fünf Geschichten an – eine je Zeile, fünf Kacheln je Zeile.
Manche Kacheln sind unbrauchbar, und die Reihenfolge stimmt nicht immer. Dieses
Werkzeug zeigt die Blätter nacheinander an, legt ein 5x5-Raster darüber und
nimmt die Reihenfolge per Mausklick auf: der erste Klick in einer Zeile ist
Bild 1, der zweite Bild 2 usw. Nicht angeklickte Kacheln bleiben unbenutzt.

Beim Laden wird jedes Blatt auf ZIEL_BREITE verkleinert und dabei im Original
überschrieben; die gespeicherten Koordinaten passen also zur Datei im Ordner.

Aufruf:

    python3 tools/annotieren.py [bildordner] [ausgabe.json]

Tasten:

    Klick        Kachel bekommt die nächste Nummer ihrer Zeile
    Klick erneut Nummer entfernen, Rest der Zeile rückt auf
    c            alle Nummern des Blattes löschen
    s            speichern und zum nächsten Blatt
    Leertaste    nächstes Blatt (ohne zu speichern)
    n / p        nächstes / vorheriges Blatt (ohne zu speichern)
    q            beenden

Erzeugt data/bildgeschichten.json mit den Kachelkoordinaten und daneben
data/bildgeschichten.js (dasselbe als ES-Modul), das die Mini-App einbindet.
"""

import json
import sys
from pathlib import Path

import tkinter as tk
from PIL import Image, ImageTk

WURZEL = Path(__file__).resolve().parent.parent

# Zielbreite: breitere Blätter werden beim Laden auf diese Breite verkleinert
# (Höhe folgt dem Seitenverhältnis) und im Original überschrieben. Anzeige und
# JSON-Koordinaten beziehen sich danach auf diese Größe.
ZIEL_BREITE = 800
# JPEG-Qualität der überschriebenen Blätter.
JPEG_QUALITAET = 92
# Kacheln je Zeile und Spalte.
RASTER = 5
# Bilddateien mit diesen Endungen werden geladen.
ENDUNGEN = {".jpg", ".jpeg", ".png", ".webp"}

FARBE_RASTER = "#ffffff"
FARBE_MARKE = "#00c000"
FARBE_TEXT = "#ffffff"


def js_schreiben(pfad: Path, daten: dict) -> None:
    """Schreibt dieselben Daten als ES-Modul – die Mini-App läuft von file://,
    wo fetch() auf JSON blockiert ist."""
    pfad.write_text(
        "// Erzeugt von tools/annotieren.py – nicht von Hand bearbeiten.\n"
        "export const BILDGESCHICHTEN = "
        + json.dumps(daten, indent=2, ensure_ascii=False)
        + ";\n",
        encoding="utf-8",
    )


def kachel_rechteck(breite: int, hoehe: int, zeile: int, spalte: int) -> dict:
    """Liefert den Ausschnitt einer Kachel im Originalbild (x, y, w, h)."""
    x0 = round(spalte * breite / RASTER)
    x1 = round((spalte + 1) * breite / RASTER)
    y0 = round(zeile * hoehe / RASTER)
    y1 = round((zeile + 1) * hoehe / RASTER)
    return {"x": x0, "y": y0, "w": x1 - x0, "h": y1 - y0}


class Annotierer:
    def __init__(self, bilder: list[Path], ausgabe: Path):
        self.bilder = bilder
        self.ausgabe = ausgabe
        self.daten = self._laden()
        self.index = 0

        self.wurzel = tk.Tk()
        self.wurzel.title("Bildgeschichten annotieren")
        self.leinwand = tk.Canvas(self.wurzel, highlightthickness=0, bg="#202020")
        self.leinwand.pack()
        self.status = tk.Label(self.wurzel, anchor="w", padx=8, pady=4)
        self.status.pack(fill="x")

        self.leinwand.bind("<Button-1>", self.geklickt)
        self.wurzel.bind("<KeyPress-c>", lambda e: self.loeschen())
        self.wurzel.bind("<KeyPress-s>", lambda e: self.speichern_und_weiter())
        self.wurzel.bind("<KeyPress-n>", lambda e: self.blaettern(+1))
        self.wurzel.bind("<space>", lambda e: self.blaettern(+1))
        self.wurzel.bind("<KeyPress-p>", lambda e: self.blaettern(-1))
        self.wurzel.bind("<KeyPress-q>", lambda e: self.wurzel.destroy())
        self.wurzel.bind("<Escape>", lambda e: self.wurzel.destroy())

        self.blatt_laden()
        self.wurzel.mainloop()

    # --- Daten -----------------------------------------------------------

    def _laden(self) -> dict:
        """Liest eine vorhandene JSON-Datei, damit man nacharbeiten kann."""
        if not self.ausgabe.exists():
            return {"raster": RASTER, "bilder": {}}
        daten = json.loads(self.ausgabe.read_text(encoding="utf-8"))
        daten.setdefault("raster", RASTER)
        daten.setdefault("bilder", {})
        return daten

    def nummern_aus_daten(self, name: str) -> dict:
        """Baut aus der JSON-Struktur die Zuordnung (zeile, spalte) -> Nummer."""
        nummern = {}
        eintrag = self.daten["bilder"].get(name)
        if not eintrag:
            return nummern
        for geschichte in eintrag.get("geschichten", []):
            for kachel in geschichte.get("kacheln", []):
                nummern[(geschichte["zeile"], kachel["spalte"])] = kachel["nr"]
        return nummern

    # --- Blatt anzeigen --------------------------------------------------

    def blatt_laden(self):
        self.pfad = self.bilder[self.index]
        bild = self.blatt_verkleinern(self.pfad)
        self.breite, self.hoehe = bild.size

        self.foto = ImageTk.PhotoImage(bild)
        self.leinwand.config(width=bild.width, height=bild.height)

        self.nummern = self.nummern_aus_daten(self.pfad.name)
        self.zeichnen()

    @staticmethod
    def blatt_verkleinern(pfad: Path) -> Image.Image:
        """Verkleinert ein Blatt auf ZIEL_BREITE und überschreibt das Original."""
        bild = Image.open(pfad).convert("RGB")
        if bild.width <= ZIEL_BREITE:
            return bild
        hoehe = round(bild.height * ZIEL_BREITE / bild.width)
        bild = bild.resize((ZIEL_BREITE, hoehe), Image.LANCZOS)
        if pfad.suffix.lower() in {".jpg", ".jpeg"}:
            bild.save(pfad, quality=JPEG_QUALITAET, subsampling=0)
        else:
            bild.save(pfad)
        return bild

    def zeichnen(self):
        self.leinwand.delete("all")
        self.leinwand.create_image(0, 0, anchor="nw", image=self.foto)

        b, h = self.foto.width(), self.foto.height()
        for i in range(1, RASTER):
            x = round(i * b / RASTER)
            y = round(i * h / RASTER)
            self.leinwand.create_line(x, 0, x, h, fill=FARBE_RASTER, width=1)
            self.leinwand.create_line(0, y, b, y, fill=FARBE_RASTER, width=1)

        for (zeile, spalte), nr in self.nummern.items():
            x0 = round(spalte * b / RASTER)
            y0 = round(zeile * h / RASTER)
            x1 = round((spalte + 1) * b / RASTER)
            y1 = round((zeile + 1) * h / RASTER)
            self.leinwand.create_rectangle(
                x0 + 1, y0 + 1, x1 - 1, y1 - 1, outline=FARBE_MARKE, width=3
            )
            self.leinwand.create_oval(
                x0 + 6, y0 + 6, x0 + 44, y0 + 44, fill=FARBE_MARKE, outline=""
            )
            self.leinwand.create_text(
                x0 + 25,
                y0 + 25,
                text=str(nr),
                fill=FARBE_TEXT,
                font=("DejaVu Sans", 18, "bold"),
            )
        self.status_setzen()

    def status_setzen(self, hinweis: str = ""):
        zeilen = sorted({z for z, _ in self.nummern})
        belegt = " ".join(
            f"Z{z + 1}:{len([1 for (zz, _) in self.nummern if zz == z])}"
            for z in zeilen
        )
        text = (
            f"[{self.index + 1}/{len(self.bilder)}] {self.pfad.name} "
            f"({self.breite}x{self.hoehe})   {belegt or 'keine Nummern'}   "
            f"c=löschen  s=speichern+weiter  Leertaste/n/p=blättern  q=Ende"
        )
        self.status.config(text=(hinweis + "   " + text) if hinweis else text)

    # --- Eingaben --------------------------------------------------------

    def geklickt(self, ereignis):
        spalte = min(RASTER - 1, int(ereignis.x * RASTER / self.foto.width()))
        zeile = min(RASTER - 1, int(ereignis.y * RASTER / self.foto.height()))
        schluessel = (zeile, spalte)

        if schluessel in self.nummern:
            entfernt = self.nummern.pop(schluessel)
            for (z, s), nr in list(self.nummern.items()):
                if z == zeile and nr > entfernt:
                    self.nummern[(z, s)] = nr - 1
        else:
            vergeben = [nr for (z, _), nr in self.nummern.items() if z == zeile]
            self.nummern[schluessel] = len(vergeben) + 1
        self.zeichnen()

    def loeschen(self):
        self.nummern.clear()
        self.zeichnen()

    def blaettern(self, richtung: int):
        neu = self.index + richtung
        if 0 <= neu < len(self.bilder):
            self.index = neu
            self.blatt_laden()
        else:
            self.status_setzen("Kein weiteres Blatt.")

    def speichern_und_weiter(self):
        self.blatt_speichern()
        if self.index + 1 < len(self.bilder):
            self.index += 1
            self.blatt_laden()
        else:
            self.status_setzen("Gespeichert – letztes Blatt.")

    def blatt_speichern(self):
        geschichten = []
        for zeile in range(RASTER):
            kacheln = [
                (self.nummern[(zeile, spalte)], spalte)
                for spalte in range(RASTER)
                if (zeile, spalte) in self.nummern
            ]
            if not kacheln:
                continue
            kacheln.sort()
            geschichten.append(
                {
                    "nr": len(geschichten) + 1,
                    "zeile": zeile,
                    "kacheln": [
                        {
                            "nr": nr,
                            "spalte": spalte,
                            **kachel_rechteck(self.breite, self.hoehe, zeile, spalte),
                        }
                        for nr, spalte in kacheln
                    ],
                }
            )

        name = self.pfad.name
        if geschichten:
            self.daten["bilder"][name] = {
                "datei": str(self.pfad.relative_to(WURZEL)).replace("\\", "/"),
                "breite": self.breite,
                "hoehe": self.hoehe,
                "geschichten": geschichten,
            }
        else:
            self.daten["bilder"].pop(name, None)

        self.daten["raster"] = RASTER
        self.ausgabe.parent.mkdir(parents=True, exist_ok=True)
        self.ausgabe.write_text(
            json.dumps(self.daten, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        js_schreiben(self.ausgabe.with_suffix(".js"), self.daten)
        self.status_setzen(f"Gespeichert: {len(geschichten)} Geschichte(n) →")


def main():
    ordner = Path(sys.argv[1]) if len(sys.argv) > 1 else WURZEL / "img"
    ausgabe = (
        Path(sys.argv[2]) if len(sys.argv) > 2 else WURZEL / "data" / "bildgeschichten.json"
    )

    bilder = sorted(p for p in ordner.iterdir() if p.suffix.lower() in ENDUNGEN)
    if not bilder:
        sys.exit(f"Keine Bilder in {ordner}")
    Annotierer(bilder, ausgabe)


if __name__ == "__main__":
    main()
