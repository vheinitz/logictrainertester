# Wimmelbild-Suche

Sucharbeit am Wimmelbild: Die App stellt die Fragen eines Bildes in zufälliger
Reihenfolge, die Antwort erfolgt per Klick ins Bild, und am Ende steht eine
Auswertung mit Trefferquote und Zeiten je Frage.

`index.html` im Browser öffnen genügt – kein Server, kein Build, keine
Abhängigkeiten. Die Datensätze werden als gewöhnliche `<script>`-Dateien
geladen, damit das auch über `file://` funktioniert.

## Bedienung

| | |
|---|---|
| Klick ins Bild | Antwort abgeben |
| Ziehen | Bildausschnitt verschieben |
| Mausrad, `+` / `−` | Zoomen (nötig bei kleinen Gegenständen) |
| `0` | ganzes Bild |
| Leertaste | Frage überspringen |
| `Esc` | Runde abbrechen |

Einstellbar sind die Anzahl der Fragen, ein Zeitlimit je Frage, ob nach einer
falschen Antwort die richtige Stelle gezeigt wird, und ob gemischt wird. Das
Ergebnis lässt sich als JSON sichern.

## Zustand der Koordinaten

**Die Koordinaten aus der Tabelle unter dem Bild sind unbrauchbar.** Das Blatt
nennt einen Koordinatenraum von 1000×1500 (hochkant), der Bildbereich ist aber
1152×934 (quer); die Werte sind lückenlos nach y sortiert, laufen bis y=1600 –
fünf Ziele liegen damit unterhalb des Bildes – und treffen bei Stichproben
nichts: Der Fußball steht mit (840,380) auf dem Dach eines Hauses, obwohl er
unten in der Wiese liegt. Es sind erfundene Zahlen, die zum Bild passen sollen,
aber nicht passen.

Sie sind trotzdem eingetragen, damit der Datensatz vollständig ist. Solange
`koordinatenGeprueft: false` steht, warnt die App auf dem Startbildschirm. Die
richtigen Stellen setzt man über **Ziele kalibrieren**:

1. Bild wählen, *Ziele kalibrieren*.
2. Zur genannten Sache ins Bild klicken – die App springt zur nächsten offenen.
   Mit `←`/`→` oder über die Liste rechts springt man gezielt hin und her,
   *Marke löschen* nimmt eine Setzung zurück.
3. *Datei exportieren* → die Datei nach `data/<id>.js` speichern, sie ersetzt
   die alte. Danach steht `koordinatenGeprueft: true` darin.

Zwischenstände liegen im `localStorage` und gelten sofort auch fürs Spielen –
der Export macht sie nur dauerhaft.

## Ein weiteres Wimmelbild aufnehmen

```bash
python3 tools/zuschneiden.py source/<blatt>.jpg <kennung>
```

Das Werkzeug findet den Illustrationsbereich über die Farbsättigung (die
Zeichnung ist bunt, Überschrift und Fragentabelle sind grau), schneidet ihn nach
`images/<kennung>.jpg` und legt in `build/` zwei Hilfsdateien ab: den
Tabellenbereich doppelt vergrößert zum Abtippen oder für eine OCR, und ein
Datei-Gerüst mit den erkannten Maßen.

Danach:

1. `build/<kennung>-geruest.js` nach `data/<kennung>.js` kopieren und die Fragen
   eintragen (aus `build/<kennung>-tabelle.png`).
2. In `index.html` eine Zeile ergänzen:
   `<script src="data/<kennung>.js"></script>`
3. Ziele in der App kalibrieren und die Datei neu exportieren.

Bringt ein Blatt keine brauchbaren Koordinaten mit, trägt man `x: 0, y: 0` ein
und setzt alles im Kalibrier-Modus – die Fragetexte allein genügen als
Ausgangspunkt.

## Datenformat

Jede Datei in `data/` meldet einen Bildsatz an:

```js
Wimmelbild.register({
  id: 'dorfplatz',                 // eindeutig, zugleich Dateiname
  titel: 'Dorfplatz',
  untertitel: '…',
  bild: 'images/dorfplatz.jpg',    // der zugeschnittene Bildbereich
  bildGroesse:     { breite: 1152, hoehe: 934 },   // Pixelmaße dieses Bildes
  koordinatenRaum: { breite: 1000, hoehe: 1500 },  // Raum, in dem x/y stehen
  toleranz: 0.06,                  // Trefferradius, Anteil der kurzen Bildseite
  koordinatenGeprueft: false,      // true, sobald nachgemessen
  quelle: { datei: '…', zuschnitt: { x, y, breite, hoehe } },
  fragen: [
    { nr: 1, frage: 'Wo ist der rote Luftballon?', ziel: 'roter Luftballon',
      x: 210, y: 80, toleranz: 0.04 }   // toleranz je Frage ist optional
  ]
});
```

`x`/`y` stehen immer im `koordinatenRaum` des jeweiligen Blattes, nie in
Bildpixeln. Der Kern rechnet daraus relative Koordinaten und erst daraus
Bildpixel. Deshalb dürfen weitere Blätter beliebig andere Maße, Seitenverhält­
nisse und Koordinatenräume mitbringen; hat ein Blatt gar keinen eigenen Raum,
lässt man `koordinatenRaum` weg und trägt Bildpixel ein.

`ziel` ist der kurze Name des Gesuchten. Er steht im Kalibrier-Modus und in der
Auswertung, wo der ganze Fragesatz zu lang wäre.

## Aufbau

```
index.html                Seiten: Auswahl, Spiel, Auswertung, Kalibrierung
js/wimmelbild.js          Kern: Registrierung, Koordinaten, Runde, Auswertung, Export
js/app.js                 Oberfläche, Zoom/Verschieben, Spielablauf
css/app.css
data/<id>.js              je Wimmelbild ein Datensatz
images/<id>.jpg           je Wimmelbild der zugeschnittene Bildbereich
source/<id>-original.jpg  das vollständige Blatt, wie es hereinkam
tools/zuschneiden.py      Zuschnitt und Gerüst für ein neues Blatt
test/smoke.mjs            Test: Daten, Runde, Auswertung, Export, Oberfläche
```

## Test

```bash
node test/smoke.mjs
```

Prüft die Datensätze auf Vollständigkeit, spielt eine Runde mit Treffer,
Fehlklick, Auslassung und beiden Rändern des Trefferradius durch, kontrolliert
Mischen und Auswertung, schickt eine Kalibrierung durch Export und Neuladen und
klickt die Oberfläche im jsdom durch. `numpy` und `Pillow` braucht nur
`tools/zuschneiden.py`, nicht die App.
