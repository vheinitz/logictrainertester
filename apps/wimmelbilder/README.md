# Wimmelbild-Suche

Sucharbeit am Wimmelbild: Die App stellt die Fragen eines Bildes in zufälliger
Reihenfolge, die Antwort erfolgt per Klick ins Bild, und am Ende steht eine
Auswertung mit Trefferquote und Zeiten je Frage. Bilder und Fragen entstehen im
eingebauten Editor – neues Blatt hereinreichen, Fragen schreiben oder
importieren, Stellen anklicken, exportieren.

`index.html` im Browser öffnen genügt – kein Server, kein Build, keine
Abhängigkeiten.

## Bedienung

| | |
|---|---|
| Klick ins Bild | Antwort abgeben, im Editor: Stelle setzen |
| Ziehen | Bildausschnitt verschieben |
| Mausrad, `+` / `−` | Zoomen (nötig bei kleinen Gegenständen) |
| `0` | ganzes Bild |
| Leertaste | Frage überspringen |
| `↑` `↓` | im Editor: Frage wechseln |
| `Esc` | Runde abbrechen, Dialog schließen |

Einstellbar sind Anzahl der Fragen, Zeitlimit je Frage, ob nach einer falschen
Antwort die richtige Stelle gezeigt wird, ob gemischt wird, und ob Fragen ohne
gesetzte Stelle draußen bleiben. Das Ergebnis lässt sich als JSON sichern.

## Ein neues Wimmelbild aufnehmen

Alles in der App, ohne Kommandozeile:

1. **Neues Wimmelbild…** auf dem Startbildschirm, Blatt wählen. Der Bildbereich
   wird automatisch erkannt – die Illustration ist bunt, Überschrift und
   Fragentabelle sind grau, gesucht wird also der längste zusammenhängende
   Streifen kräftig gefärbter Zeilen. Der Vorschlag steht als Rahmen in der
   Vorschau und lässt sich in den vier Feldern nachstellen oder ganz abschalten.
2. Titel und Kennung vergeben, **Anlegen** – der Editor öffnet sich.
3. Fragen anlegen: **+ Frage** und tippen, oder **Fragen importieren…** für eine
   ganze Liste (siehe unten).
4. Zu jeder Frage die Stelle im Bild anklicken. Jeder weitere Klick legt eine
   **weitere Stelle** zur selben Frage an – für Dinge, die es mehrfach gibt
   (zwei Drachen, drei Pilze), und für große (ein Turm oder eine Laterne braucht
   mehrere Punkte, damit ein Klick oben wie unten zählt). Einzelne Stellen
   löscht das × daneben. **Reihum setzen** springt nach jedem Klick zur nächsten
   Frage ohne Stelle – damit geht eine lange Liste am Stück durch.
5. **Exportieren…** – siehe *Formate*.

Gespeichert wird laufend im `localStorage` des Browsers; ein Satz aus `data/`
wird dabei von der lokalen Fassung verdeckt und über **Änderungen verwerfen**
wieder freigegeben. Der Export ist das, was die Arbeit dauerhaft macht.

## Fragen importieren

Im Editor unter **Fragen importieren…**, als Text eingefügt oder als Datei.
Erkannt werden unter anderem:

```
Nr.  Frage                          Koordinaten (x,y)     ← Kopfzeilen entfallen
1. Wo ist der rote Luftballon? (210,80)
2) Wo ist die Katze?   80 ; 120
Wo ist der Pilz?;50;1290
Wo ist die Eule?                                          ← ohne Stelle, später klicken
Wo ist eine Ente? (100,200) (300,400)                     ← mehrere Stellen
1. Wo ist X? (10,20)    26. Wo ist Y? (30,40)             ← zweispaltige Tabelle
```

Eine Zeile wird an den Nummern aufgetrennt: „26." beginnt eine neue Frage, alle
Zahlenpaare davor gehören zur vorigen. Steht keine Nummer da, gilt die ganze
Zeile als eine Frage mit allen ihren Stellen.

Damit lässt sich eine abgetippte oder per OCR gelesene Tabelle direkt
übernehmen. Ebenfalls als Quelle geeignet: eine `.json`-Datei aus dem Export
und ein Modul aus `data/`.

**Achtung beim Koordinatenraum.** Die Zahlen gelten im Koordinatenraum des
Bildsatzes – bei selbst angelegten Sätzen ist das die Bildgröße. Stammt eine
Liste aus einem anderen Raum (etwa „(0,0) bis (1000,1500)" unter einem Blatt),
gehört der erst unter **Einstellungen** gesetzt, sonst landen alle Stellen
falsch. Liegen die Zahlen sichtbar außerhalb, sagt der Import das vorher.

## Formate

| Export | Inhalt | wofür |
|---|---|---|
| **JS-Modul** | `data/<id>.js`, Bild als Pfadangabe | fest in die App einbauen |
| **JSON** | Bildsatz *und* Bild in einer Datei | weitergeben, sichern, wieder importieren |
| **Text** | nur die Frageliste | weiterbearbeiten, wieder importieren |

Für den festen Einbau: Modul nach `data/<id>.js` speichern, daneben über *Bild
speichern* die Bilddatei nach `images/<id>.jpg` legen, und in `index.html` eine
Zeile ergänzen:

```html
<script src="data/<id>.js"></script>
```

Danach ist der Satz auch ohne `localStorage` da – auf jedem Rechner, der den
Ordner bekommt.

## Datenformat

```js
Wimmelbild.register({
  id: 'dorfplatz',                 // eindeutig, zugleich Dateiname
  titel: 'Dorfplatz',
  untertitel: '…',
  bild: 'images/dorfplatz.jpg',    // Pfad oder (lokal) ein data:-URI
  bildGroesse:     { breite: 1152, hoehe: 934 },   // Pixelmaße des Bildes
  koordinatenRaum: { breite: 1152, hoehe: 934 },   // Raum, in dem die Punkte stehen
  toleranz: 0.06,                  // Trefferradius, Anteil der kurzen Bildseite
  quelle: { datei: '…', zuschnitt: { x, y, breite, hoehe } },
  fragen: [
    { nr: 1, frage: 'Wo ist der rote Luftballon?', punkte: [{ x: 582, y: 52 }] },
    { nr: 2, frage: 'Wo ist die alte Laterne?',    punkte: [{ x: 260, y: 225 },
                                                            { x: 260, y: 300 },
                                                            { x: 260, y: 372 }],
      toleranz: 0.04 }               // toleranz je Frage ist optional
  ]
});
```

Eine Frage hat eine **Liste von Stellen**. Getroffen ist, wer nahe genug an
*einer* davon klickt; gemessen und in der Auswertung gezeigt wird die
nächstgelegene. Eine leere Liste heißt: für diese Frage ist noch keine Stelle
gesetzt, sie kann nicht getroffen werden. Ein einzelnes `x`/`y` aus einer
älteren Datei wird als erste Stelle gelesen.

Die Punkte stehen immer im `koordinatenRaum`, nie in Bildpixeln. Der Kern rechnet
daraus relative Koordinaten und erst daraus Bildpixel. Deshalb dürfen weitere
Blätter beliebig andere Maße, Seitenverhältnisse und Koordinatenräume
mitbringen; ohne eigenen Raum gilt die Bildgröße, dann sind x/y Bildpixel.

Fragen ohne Stelle bleiben standardmäßig aus der Runde – der Haken *nur Fragen
mit gesetzter Stelle* ist voreingestellt. Der Startbildschirm sagt, wie viele
das betrifft.

## Auswertung

Oben steht ein Gesicht, darunter fünf Sterne, die Zahl der gefundenen Dinge und
ein Balken mit der Quote – für Kinder sagt das mehr als eine Prozentzahl. Der
angebrochene Stern füllt sich anteilig, das Gesicht hat fünf Stufen von
nachdenklich bis begeistert. Darunter die Zeiten, das Bild mit allen Stellen und
einer Linie von jedem Fehlklick zur nächstgelegenen richtigen Stelle, und die
Liste aller Fragen mit Haken oder Kreuz.

## Zustand der mitgelieferten Bilder

Beim **Schulhof** sind alle 50 Fragen mit Stellen versehen. Mehrfache Stellen
haben die Dinge, die es mehrfach gibt (Drachen, Regenmantel, Fußball, Fahrrad,
Pilz, Frosch, Springseil, Brille) und die großen (Schulbus, Rutsche, Brunnen).

Beim **Strand** sind alle 50 Fragen mit Stellen versehen. Die Gegenstände sind
absichtlich einfach gezeichnet (Ball, Eimer, Seestern, Ente, Anker), damit jedes
Ding klar zu erkennen ist. Mehrfache Stellen haben Palme, Möwe, Drachen, Ball,
Seestern, Orange, Banane, Schmetterling, Pilz, Flip-Flops, Schirm, Katze, Frosch,
Schlüssel und Kompass, dazu Leuchtturm und Sandburg.

Beim **Dorfplatz** sind 7 der 50 Fragen mit Stellen versehen – die Dinge, die
sich im Bild zweifelsfrei wiederfinden lassen. Drei davon zeigen die mehrfachen
Stellen: die Laterne ist zu hoch für einen Punkt (drei Punkte über die Höhe
verteilt), Drachen und Pilz gibt es je zweimal.

Die Koordinaten aus der Tabelle unter dem Bild sind **nicht** übernommen, weil
sie unbrauchbar sind: Das Blatt nennt einen Raum von 1000×1500 (hochkant), der
Bildbereich ist 1152×934 (quer); die Werte sind lückenlos nach y sortiert,
laufen bis y=1600 – fünf Stellen lägen damit unterhalb des Bildes – und treffen
bei Stichproben nichts (der Fußball stünde mit (840,380) auf einem Hausdach,
obwohl er unten in der Wiese liegt). Zum Nachschlagen stehen sie als Kommentar
im Kopf von `data/dorfplatz.js`.

Die übrigen 43 Fragen haben keine Stelle. Etliche davon beschreiben Dinge, die
im Bild gar nicht vorkommen – ein Segelboot etwa gibt es nicht (nur Ruderboote),
und statt eines Fernglases steht dort ein Fernrohr. Solche Fragen setzt man im
Editor oder löscht sie.

## Kommandozeile

`tools/zuschneiden.py` macht denselben Zuschnitt wie die App, für viele Blätter
am Stück:

```bash
python3 tools/zuschneiden.py source/<blatt>.jpg <kennung>
```

Erzeugt `images/<kennung>.jpg`, dazu in `build/` den Tabellenbereich vergrößert
(zum Abtippen oder für eine OCR) und ein Datei-Gerüst. Braucht `numpy` und
`Pillow`; die App selbst braucht nichts davon.

## Aufbau

```
index.html                Seiten: Auswahl, Spiel, Auswertung, Editor
js/hilfen.js              Seitenwechsel, Marken, Dialoge, Download
js/wimmelbild.js          Kern: Sätze, Koordinaten, Runde, Speicher, Import, Export
js/bild.js                Bilddatei lesen, Bildbereich finden, zuschneiden
js/ansicht.js             Zoomen, Verschieben, Klick in Bildkoordinaten
js/aufnahme.js            Bild hereinreichen, neuer Satz, Satz-Import
js/editor.js              Fragen schreiben, Ziele setzen, Ex- und Import
js/app.js                 Auswahl, Spielablauf, Auswertung
data/<id>.js              fest eingebaute Bildsätze
images/<id>.jpg           die zugeschnittenen Bildbereiche
source/<id>-original.jpg  die vollständigen Blätter, wie sie hereinkamen
tools/zuschneiden.py      Zuschnitt auf der Kommandozeile
test/smoke.mjs            Test über den ganzen Ablauf
```

Der Editor lädt beim Import aus `data/` den Quelltext mit einem eigenen
`Wimmelbild`-Objekt aus, statt ihn anzumelden. Das führt Code aus einer Datei
aus, die man selbst ausgewählt hat – dieselbe Vertrauensstellung wie beim
Eintragen in `index.html`.

## Test

```bash
node test/smoke.mjs
```

122 Prüfungen: Datensätze, das Lesen von Frageliste und JSON (auch mehrere
Stellen je Frage und zweispaltige Tabellen), Anlegen, Speichern, Verwerfen, alle
drei Exportwege samt Wiedereinlesen, eine Runde mit Treffer auf der ersten wie
der zweiten Stelle, Fehlklick, Auslassung und dem Rand des Trefferradius, und
die Oberfläche von Auswahl, Spiel, Editor und Dialogen im jsdom.
