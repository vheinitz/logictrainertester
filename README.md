# LOGIK-Trainer

Kognitives Trainings- und Testprogramm für Kinder, angelehnt an die Struktur der
KABC-II. Läuft vollständig offline im Browser, ohne Server und ohne Konto.
Alle Daten bleiben in der IndexedDB des Geräts.

## Starten

Die App ist als fertiges Bundle eingecheckt – `index.html` im Browser öffnen
genügt (Doppelklick reicht, es wird kein Server gebraucht).

## Entwickeln

```bash
npm install
npm run build      # dist/logik-trainer.min.js neu bauen
npm run watch      # baut bei jeder Änderung neu
npm test           # Smoke-Test + Integrationstest gegen jsdom
```

`dist/` ist bewusst eingecheckt, damit die App ohne Node-Installation
funktioniert. Nach Änderungen in `src/` also `npm run build` nicht vergessen –
sonst sieht man im Browser noch den alten Stand.

**Build-Kennung gegen den Cache.** Der Browser hält `dist/logik-trainer.min.js`
unter demselben Pfad hartnäckig fest; nach einem Rebuild lief dort weiter der
alte Code, und man sucht den Fehler im Quelltext statt im Cache. `npm run build`
berechnet deshalb eine Kennung aus dem Inhalt aller Quelldateien und schreibt
sie als `?v=…` in das Script-Tag von `index.html`. Ändert sich der Code, ändert
sich die URL — der Browser *muss* neu laden.

Ganz unten im Menü steht dieselbe Kennung. Damit lässt sich ohne Raten klären,
welcher Stand gerade läuft: stimmt sie nicht mit der Ausgabe von `npm run build`
überein, ist es ein alter Stand und kein Fehler im Code.

Der Bundle wird als klassisches Skript geladen und exportiert nichts; er
installiert `window.navigateTo` und füllt `#mainContent`. Nur daran lässt sich
prüfen, ob er lief — eine `--global-name`-Variable wäre mangels Exporten immer
`undefined`.

## Aufbau

```
src/
  core/
    engine.js      Navigation, Spiel-Lifecycle, Action-Bridge G()
    adaptive.js    Merkspannen-Tests (show → wait → answer → feedback, N++/N--)
    choice.js      Auswahlaufgaben, optional mit Lernphase davor
    tutor.js       Aufgaben, die eine Begleitperson anleitet und bewertet
    shell.js       Bausteine des Minimal-Spielbildschirms (Balken, Ring, Sterne)
    audio.js       kurze Töne per WebAudio, über die Audio-Uhr geplant
    storage.js     IndexedDB: Spielstände, Verlauf, Einstellungen
    html.js        esc/jsArg/shuffle/sample und die Farbpalette
    stub.js        Platzhalter für noch nicht umgesetzte Module
  data/
    modules.js            26 Module mit Skala, Altersband und KABC-Bezug
    cognitive-factors.js  89 kognitive Faktoren → welche Module sie trainieren
    performance-model.js  Was misst ein Subtest, Einflüsse, Hypothesen, Förderung
  games/           ein Modul je Datei + index.js als Registry
  ui/views.js      Menü, Training, Statistik, kognitives Profil
  i18n/            Oberflächentexte DE/RU
```

### Kontrakt eines Spielmoduls

```js
export function init(gs)      // Zustand aufbauen, gs.gd._ready = true setzen
export function render(gs)    // HTML-String für den Spielbereich
export function dispose(gs)   // eigene Timer abräumen, _ready zurücksetzen
export const actions = {}     // { name(gs, ...args) }, aufgerufen via G('name', …)
export const scoring          // 'count' oder 'percent'
```

Klicks laufen ausschließlich über `G('action', …)`. Die Engine leitet an das
gerade aktive Modul weiter und rendert danach nur den Spielbereich neu.

### Der Spielbildschirm zeigt nur die Aufgabe

Sechs Module laufen mit `chrome: 'minimal'` (fünf Merkspannen-Tests plus
Rhythmus): keine Kopfzeile,
kein Punktestand, keine Anweisung, kein Niveau, keine Prozente, keine
Sekundenzahl. Sichtbar sind die Aufgabe, ein wortloser Ablaufbalken und der
Beenden-Knopf. Rückmeldung ist ein Piktogramm (✅ / ❌ / ⏰); nach einem Fehler
erscheint die Lösung als Bildzeile, nicht als Satz.

Das ist kein reiner Geschmack: eine sichtbare Niveauanzeige macht aus einem
Test einen Wettbewerb und verändert, wie ein Kind arbeitet. Anleitung gehört
auf den Startbildschirm (`instruction` im Modul), das Ergebnis ans Ende.

Einzige Ausnahme: eine Sternenreihe ganz unten zeigt das beste Niveau — ein
Stern je Stufe, ohne Beschriftung.

Das Tempo (`f`, Sekunden pro Element) ist eine Voreinstellung der Testleitung,
kein Bedienelement im Spiel. Änderbar über die Konsole, bleibt in
localStorage:

```js
_setTempo('seq-zahlenfolgen', 1.5)
```

### Rhythmus ohne Begleitperson

`seq-rhythmus` klopft ein Muster als Töne vor (WebAudio, kein mitgeliefertes
Audiofile) und nimmt die Antwort über **Leertaste oder Tippfläche** entgegen.
Damit braucht das Modul keine erwachsene Person mehr am Gerät.

Drei Entscheidungen, die dabei zählen:

- **Töne über die Audio-Uhr geplant** (`osc.start(zeit)`), nicht über
  `setTimeout`. Letzteres verrutscht um zweistellige Millisekunden — bei einem
  Takt hörbar.
- **Bewertet werden Verhältnisse, nicht absolute Längen.** Die Eingabe wird auf
  die Musterdauer normiert; wer gleichmäßig langsamer nachklopft, hat den
  Rhythmus verstanden. Nur ein grob abweichendes Grundtempo (< 0,4× oder
  > 2,5×) gilt als Fehler.
- **Toleranz ±25 %, mindestens 100 ms.** Weiter darf sie nicht sein: bei ±34 %
  überlappten die Bänder um 400 ms und 800 ms, und gleichmäßiges
  Metronom-Klopfen wäre als „kurz–lang–kurz" durchgegangen — ein Fehler, den
  erst der Testfall `alles gleich lang` sichtbar gemacht hat.

Kein „Fertig"-Knopf: nach 1,6 s Stille wird ausgewertet. Ein Knopf mitten im
Klopfen würde den Rhythmus zerstören. Die erwartete Schlagzahl wird nicht
angezeigt — sie ist Teil der Aufgabe.

`evaluateRhythm(pattern, taps)` ist exportiert und ohne Browser prüfbar.

### Eingaben werden immer angenommen

Die Antwortphase nimmt jeden Tipp entgegen, auch eine Wiederholung. Geprüft
wird erst, wenn die Reihe voll ist. Ob eine Aufgabe Wiederholungen enthält,
entscheidet allein `genItems` beim Erzeugen — eine Eingabe stillschweigend zu
verweigern sähe für ein Kind aus wie ein defekter Knopf.

### Wie das beste Niveau fortgeschrieben wird

`nextBestLevel(best, level, correct)` in `core/adaptive.js`, unit-getestet:

| Fall | Wirkung |
|---|---|
| richtig auf L | `best = max(best, L)` |
| falsch auf L > best | `best` bleibt (nur ein Versuch nach oben) |
| falsch auf L ≤ best | `best = L − 1` |

Beispiel: 6 richtig → **6**, dann 7 falsch → **6**, dann 6 falsch → **5**.
Wer eine Stufe nicht mehr schafft, kann sie nicht sicher — deshalb entwertet
ein Fehler auf gleicher Höhe den bisherigen Bestwert.

### Warum Countdowns nicht neu rendern dürfen

Ein `click` entsteht im Browser nur, wenn mousedown **und** mouseup auf
demselben Element landen. Wird der Spielbereich dazwischen neu aufgebaut, ist
das Element weg und es kommt gar kein Klick zustande — der Tipp wird stumm
verschluckt.

Laufende Anzeigen (Ablaufbalken, Pausenring) sind deshalb reine
CSS-Animationen; JavaScript schreibt während einer Aufgabe höchstens die
Sekundenzahl in `#advClock`. Der negative `animation-delay` sorgt dafür, dass
die Animation nach einem echten Neuaufbau — etwa weil eine Zahl angetippt
wurde — an der richtigen Stelle weiterläuft statt von vorn zu beginnen.

`test/integration.mjs` sichert das ab: es hält einen Knopf 800 ms fest und
klickt anschließend langsam (180 ms zwischen down und up). Mit einem
Re-Render-Tick kommen davon 0 bis 3 von 5 Klicks an, ohne ihn 5 von 5.

### Die zwei Bewertungsarten

| | `count` | `percent` |
|---|---|---|
| verwendet von | Übungsspiele, Quizze, Tutor-Module | adaptive Merkspannen-Tests |
| `gs.score` / `gs.total` | richtig / beantwortet | gelöste Durchgänge / Versuche |
| gespeichert als | `cumScore`/`cumTotal` | `bestPercent`/`bestLevel` |
| `accuracy` (0–100) | `cumScore / cumTotal` | `min(100, bestPercent)` |

`accuracy` ist das einzige Feld, das Statistik und kognitives Profil auswerten.
Die Score-Map der adaptiven Tests geht bis 150 %; der Rohwert bleibt in
`bestPercent` erhalten, auch wenn die Anzeige bei 100 deckelt.

## Noch offen

- `sim-rover`, `sim-dreiecke`, `sim-tangram`, `plan-geschichten` sind Platzhalter –
  sie brauchen Drag-and-drop bzw. gezeichnete Bildfolgen.
- `plan-zaubertricks` und `lern-storycubes` laufen weiterhin mit Begleitperson;
  bei ihnen ist eine automatische Bewertung nicht ehrlich möglich.
- Die Spieltexte sind hart deutsch; die RU-Umschaltung wirkt bisher nur auf die
  Rahmenoberfläche.
- Kein Kinderprofil (Alter, Name, mehrere Kinder). Ohne Altersbezug ist das
  kognitive Profil ein Verlaufswert, keine Einordnung.
