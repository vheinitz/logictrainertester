# LOGIK-Trainer

Kognitives Trainings- und Testprogramm für Kinder, angelehnt an die Struktur der
KABC-II. Läuft vollständig offline im Browser, ohne Server und ohne Konto.
Alle Daten bleiben in der IndexedDB des Geräts.

## Herkunft und Abgrenzung

**Ideengrundlage** dieser App sind die *Arbeitsmaterialien zur KABC-II* (2016),
erarbeitet von einem Arbeitskreis unter Leitung von Dr. Werner Laschkowski
(RschD, Regierung von Mittelfranken) mit Lehrkräften mittelfränkischer
Förderschulen. Von dort stammen die Gliederung nach Skalen und Subtests sowie
ein Teil der Fachbegriffe für Einflussfaktoren, Hypothesen und
Fördermöglichkeiten. Dank an den Arbeitskreis für diese Vorarbeit.

Übernommen wurde die **Systematik, nicht der Text**. Ein Abgleich der
App-Texte gegen das Skript ergibt: kein einziger übernommener Satz. Die
längste wörtliche Übereinstimmung ist 47 Zeichen lang, der Median 23 – es
handelt sich durchweg um Fachbegriffe wie „Visuelles Kurzzeitgedächtnis".
Übereinstimmungen ab Satzlänge: keine.

**Neu entstanden** (nach Angabe des Autors mit KI-Unterstützung erarbeitet)
sind die beiden Teile, die diese App überhaupt erst zu einem Programm machen:

- Die **quantitative Auswertung** – Score-Maps je Niveau, das adaptive
  Hoch- und Runterstufen, die Fortschreibung des besten Niveaus, die
  Prozentbewertung. Im Skript existiert davon nichts; es ist ein rein
  qualitatives Beobachtungs- und Interpretationshilfsmittel für
  Testleiterinnen und Testleiter („Hypothese" 29×, „Beobachtung" 27×,
  Auswertungsformeln: keine).
- Das **kognitive Faktorenmodell** – die Einordnung von 89 Fähigkeiten in 14
  Kategorien und ihre Zuordnung zu den Trainingsmodulen, aus der sich das
  Profil errechnet. Die Begriffe selbst stammen großenteils aus dem Skript
  (64 wörtlich, 19 sinngemäß, 6 eigene – siehe „Woher die kognitiven
  Faktoren stammen"), die Zuordnung Faktor → Modul gibt es dort nicht.

  *Frühere Fassungen dieses Abschnitts nannten 36 nicht belegte
  Bezeichnungen. Diese Zahl stammte aus einem groben Textvergleich; das
  Nachzählen gegen die Faktorenlisten der 18 Subtests ergab 25.*

**Was diese App nicht ist:** kein Testverfahren und kein Ersatz für eines. Sie
enthält keine Originalaufgaben, keine Normtabellen und keine Standardwerte.
Die Aufgaben sind eigene Nachbauten allgemein bekannter Paradigmen
(Zahlenspanne, Bausteine zählen, Gestaltschließen), die deutlich älter sind
als die KABC. Ergebnisse sind Übungsrückmeldungen, keine Diagnostik.

KABC-II ist eine eingetragene Marke der jeweiligen Rechteinhaber. Sie wird
hier ausschließlich als Sachhinweis auf die Struktur verwendet, auf die sich
die App bezieht – nicht als Produktname und ohne jede Verbindung zu oder
Billigung durch die Rechteinhaber.

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
  i18n/            Oberflächentexte DE/RU/EN
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

### Zahlenfolgen: zwei Varianten, zwei Messungen

`seq-zahlenfolgen` zeigt die Ziffern, `seq-zahlenfolgen-audio` sagt sie an.
Das sind nicht zwei Anzeigearten desselben Tests, sondern **zwei verschiedene
Messungen** — und deshalb sind sie im Faktorenmodell getrennt geführt:

| | sehen | hören |
|---|---|---|
| Faktoren | Visuelles Kurzzeitgedächtnis (KF086) | Akustisches/Auditives KZG (KF004, KF011) |
| gemeinsam | Aufmerksamkeit, Ausdauer, Seriation, Zahlenumgang | dieselben |

Stünde die Bildschirm-Variante bei den auditiven Faktoren, bekäme ein Kind mit
Hörproblem dort einen guten Wert — das Profil würde die Schwäche verdecken.
Die Ansage-Variante entspricht dem KABC-Originalsubtest.

**Sprachaufnahmen sind vorab erzeugt** (`tools/make-audio.py`, piper offline,
DE + RU), nicht zur Laufzeit gesprochen. `speechSynthesis` klingt auf jedem
Gerät anders und startet zeitlich unvorhersehbar; für eine Merkspanne muss
jede Ziffer im selben Takt kommen, sonst misst man das Gerät statt das Kind.
Die Aufnahmen liegen als base64-MP3 im Bundle (`src/data/audio-digits.js`,
erzeugt) — von `file://` aus blockiert der Browser `fetch`, nachgeladene
Dateien ließen sich dort nicht dekodieren. Die Sprache folgt der
App-Einstellung.

Vor der Folge steht eine Ansage („Wiederhole:" / „Повтори:"), damit die erste
Ziffer nicht aus dem Nichts kommt — die geht sonst am ehesten verloren.

**Warum die Ziffern einzeln erzeugt werden.** Naheliegend wäre, die ganze
Folge als einen Satz sprechen zu lassen: das klingt natürlicher. Es geht aber
nicht, weil die Folge pro Runde neu gewürfelt wird — es gibt nichts Festes zu
erzeugen. Der Versuch, eine Komma-Liste zu sprechen und an den Pausen zu
schneiden, scheitert zusätzlich an der russischen Stimme: sie spricht zehn
Ziffern in 2,7 s ohne hörbare Pause an den Kommas.

**Warum es trotzdem abgehackt klang — und was es wirklich war.** Nicht der
Player: die Clips werden über die Audio-Uhr sample-genau geplant, dort geht
nichts verloren. Die Ursache war messbar der Stille-Schnitt bei −45 dB, der in
die Wortanfänge geschnitten hat. Die russischen Clips begannen mit bis zu
**15 % Amplitude** statt bei null — bei jeder Ziffer ein Knacken (Deutsch nur
1,5 %, deshalb fiel es dort kaum auf). Behoben durch:

| Maßnahme | Wirkung |
|---|---|
| langsamer sprechen (`length_scale` 1,15 DE / 1,45 RU) | kurze Wörter bekommen Kontur |
| schonender Schnitt bei −55 dB | Anlaute bleiben erhalten |
| Ein-/Ausblenden 15/45 ms | Clip beginnt und endet bei null |
| 10 ms Stille-Polster | fängt das Nachschwingen des MP3-Kodierers auf |
| Spitzenpegel statt `loudnorm` | `loudnorm` arbeitet unter 1 s unzuverlässig |

Ergebnis: größte Randamplitude **0,18 %** statt 15,1 %. Der Generator bricht
ab, wenn ein Clip über 2 % liegt.

Neu erzeugen:

```bash
python3 tools/make-audio.py    # braucht piper-tts mit lokalen Stimmen + ffmpeg
```

Der Smoke-Test rechnet außerdem nach, dass die gesprochene Folge in die
Zeigephase passt — sonst würde ein späteres Tempo-Feintuning die letzte Ziffer
abschneiden, und das merkt man erst beim Zuhören.

### Ich packe meinen Koffer: der Koffer wird nie neu gewürfelt

Der Kern des Spiels ist, dass die Liste *dieselbe* bleibt und wächst. Eine
frühere Fassung packte bei jedem Niveau, das nicht genau um eins gewachsen
war, einen komplett neuen Zufallskoffer — also nach **jedem Fehler**. Damit
standen plötzlich lauter fremde Dinge da, das Spiel fühlte sich an, als hätte
es von vorn begonnen, und der kumulative Charakter war weg.

Jetzt wächst und schrumpft der Koffer nur: bei einem Fehler fällt das zuletzt
hinzugekommene Ding heraus, der Rest bleibt. Geht es wieder hoch, kommt ein
neues Ding dazu — die Aufgabe wiederholt sich also nicht wörtlich.

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

### Warum manche Tests eine Hör-Fassung haben

Fünf Faktoren der Kategorie „Auditive Wahrnehmung" wurden von Modulen gespeist,
die ihre Aufgaben als **Text am Bildschirm** zeigen — die Zuordnung stammte aus
der Original-Darbietung, bei der die Testleitung vorspricht. Wer nur die
Textfassungen spielte, bekam trotzdem Werte für akustisches Gedächtnis.

Stilles Lesen aktiviert zwar die phonologische Schleife, also *verbales*
Kurzzeitgedächtnis. Aber „Auditive Wahrnehmung" und „Akustisch-motorisches
Gedächtnis" brauchen echten Klang. Deshalb jetzt:

- Textfassungen zählen auf *Visuelles Kurzzeitgedächtnis* und *Sequentielles
  Gedächtnis*.
- Auditive Faktoren speisen nur Module mit Tonausgabe. Ein Test in
  `test/smoke.mjs` liest dafür den Quelltext jedes Moduls: steht dort kein
  `core/audio.js`, darf es in keinem auditiven Faktor auftauchen.
- Für Zahlenfolgen, Wörter-Kette und Koffer packen gibt es je eine
  Hör-Fassung. Der Vergleich beider ist das eigentlich Interessante: dieselbe
  Aufgabe einmal über die Augen, einmal über die Ohren.

### Drei Sprachen, und wie Lücken sichtbar werden

Deutsch, Russisch, Englisch. Fehlt ein Schlüssel in der aktiven Sprache,
fällt `t()` auf Deutsch zurück — absichtlich: ein deutscher Satz mitten in
der russischen Oberfläche ist ein sichtbarer, meldbarer Mangel, ein leerer
Knopf wäre ein stiller.

Genau dieser Fall trat auf. Übersetzt war nur die zentrale Texttabelle;
Modultitel, Skalennamen, Aufgabentexte, Quizfragen und die Beschriftungen
der Ablauf-Engines standen fest auf Deutsch im Code. Auf Russisch war
dadurch die halbe Oberfläche deutsch, ohne dass irgendetwas kaputt aussah.

Dagegen stehen jetzt drei Messungen statt Durchsehen:

* **`tools/check-lang.mjs`** rendert jedes Spielmodul in RU und EN durch
  seine Hauptphasen und schlägt bei deutschen Spuren an (Umlaute, ß,
  deutsche Stoppwörter). Aufruf für ein Modul oder mit `--alle`.
* Der Smoke-Test besteht darauf, dass **jede Methodenseite in allen drei
  Sprachen lückenlos** ist — 763 Felder — und dass `steps` und `tips` je
  Sprache gleich viele Einträge haben. Sonst fehlt in einer Sprache ein
  Arbeitsschritt, ohne dass etwas leer aussieht.
* Ein Wächter gegen **leserbezogene Sprachhinweise**: „Die Seite gibt es
  nur auf Englisch" ist eine Warnung für deutsche und russische Leser. Im
  englischen Text steht dann eine Einschränkung, die für den Leser keine
  ist. Zweimal wörtlich mitübersetzt worden, beide Male gefunden.

Mehrsprachige Felder sind durchweg `{de, ru, en}` und werden über `pick()`
aus `core/html.js` aufgelöst. Kleine, ortsgebundene Wörterbücher stehen
bewusst neben ihrer Ansicht statt in der zentralen Tabelle — bei einem
Dutzend Begriffen, die nur eine Seite braucht, findet man sie dort leichter.

Ein Sonderfall: die Verweistabelle Förderpunkt → Methodenseite ist über die
**deutschen** Originaltexte verschlüsselt. Angezeigt wird die aktive Sprache,
verlinkt wird über den deutschen Eintrag derselben Position.

### Sprachaufnahmen liegen neben dem Bundle

`dist/audio-de.js` und `dist/audio-ru.js` (je 57 Aufnahmen: Ziffern, Ansage,
30 Wörter, 16 Kofferdinge) werden per `<script>` aus `index.html` geladen und
füllen `window.LOGIK_AUDIO`.

Nicht im Bundle, weil das App-Bundle klein bleiben und sich unabhängig ändern
soll; der Browser lädt beide parallel und cacht sie getrennt. Nicht erst im
Test nachgeladen, weil sie dann beim Speichern der Seite fehlen würden und von
`file://` aus gar nicht ladbar wären — dort blockiert der Browser `fetch` und
ES-Module. Ein statisches `<script>` funktioniert überall.

Die Wortlisten stehen in `src/data/wordlists.json` — dieselbe Quelle, aus der
die App den Bildschirmtext nimmt und `tools/make-audio.py` die Aufnahmen
erzeugt. Zwei Listen würden auseinanderlaufen.

### Ein Durchgang hat ein Ende

Voreingestellt 10 Übungen, in den Einstellungen von 3 bis 40 wählbar. Danach
Ergebnis und zurück zur Testgruppe. Ohne Grenze läuft jedes Modul endlos: für
ein Kind ohne absehbares Ende, und für die Auswertung stünden Werte aus 4 und
aus 40 Übungen unvergleichbar nebeneinander.

Gezählt wird in `gs.rounds` — abgeschlossene Übungen, nicht Klicks. Was eine
Übung ist, entscheidet die jeweilige Engine: ein Durchgang beim Merkspann,
eine Frage bei den Auswahlaufgaben, ein **fertiges Brett** bei Memory und ein
**gelöstes Rätsel** beim Sudoku — dort wäre Abbrechen mitten im Brett unsinnig.

Der Fortschritt steht als Punktreihe über der Aufgabe, wortlos wie die
Sternenreihe; ab 20 Übungen wird daraus ein schmaler Balken, weil 30 Punkte
nichts mehr erkennen lassen.

### Bilder zu den Wörtern

Jedes Wort in `wordlists.json` hat ein Symbol, das neben dem Wort steht. Ohne
das ist die Wörter-Kette für Kinder, die noch nicht lesen, gar nicht
durchführbar — und in der Hörfassung könnten sie die Auswahl nicht lesen. Wer
liest, nutzt das Wort und ignoriert das Bild.

Ein Wort ist dafür aus der Liste gefallen: für Tisch gibt es kein brauchbares
Symbol, an seiner Stelle steht jetzt Zug.

### Ansage je Test passend

Vor der Folge steht eine Ansage, damit das erste Element nicht aus dem Nichts
kommt. Je Test die passende Formel — beim Kofferpacken die Spielformel statt
eines neutralen Wiederhole.

Der Smoke-Test rechnet für **jedes** Modul mit Ansage nach, dass die
gesprochene Folge in die Zeigephase passt. Das war nötig: die längere
Koffer-Ansage überzog die Phase auf Russisch um 67 ms und hätte die letzte
Aufnahme abgeschnitten — hörbar, aber im Code unsichtbar.

### Module bringen ihre eigenen Einstellungen mit

Ein Modul weiß am besten, welche Stellschrauben es hat. Die Zeit je leerem
Feld beim Sudoku gehört nicht in eine zentrale Liste, die bei jedem neuen
Modul wächst und irgendwann niemand mehr überblickt.

Ein Modul exportiert stattdessen ein Schema und meldet es an:

```js
export const settingsSchema = {
  sekProFeld: {
    def: 12, min: 3, max: 40, step: 1, unit: 's',
    de: 'Zeit je leerem Feld', ru: '…', en: '…',
    hintDe: '…', hintRu: '…', hintEn: '…'
  }
};
registerModuleSettings(ID, settingsSchema);
```

Damit erscheint es von selbst auf der Einstellungsseite, in einem eigenen
Abschnitt mit Symbol und Titel des Moduls. Gelesen wird mit
`modGet(ID, 'sekProFeld')`.

Zwei Dinge, die dabei zu beachten waren:

* **Die Schlüssel bekommen die Modulkennung vorangestellt** (`plan-sudoku.sekProFeld`).
  Ohne das könnten zwei Module dieselbe Bezeichnung wählen und sich
  gegenseitig überschreiben. Der Testlauf besteht darauf.
* **Angemeldet wird beim Laden des Moduls**, gespeicherte Werte werden dabei
  nachgezogen — beim Start wusste `laden()` von diesen Schlüsseln noch
  nichts. Damit die Einstellungsseite alle Module zeigt und nicht nur die
  zuletzt gespielten, lädt sie einmal alle. Sie liegen ohnehin im selben
  Bundle; das kostet nur das Ausführen.

### Genug Aufgaben je Stufe

Eine Wiederholungssperre nützt nichts, wenn eine Stufe weniger Aufgaben
kennt als ein Durchgang lang ist. Gemessen war der Vorrat teils lächerlich
klein: 3 bis 4 Aufgaben bei zehn Runden.

Der Smoke-Test verlangt jetzt **mindestens 20 unterscheidbare Aufgaben je
Stufe** für jedes Modul mit Sperre — doppelt so viele wie ein Durchgang
braucht, damit sich auch zwischen zwei Durchgängen nicht alles wiederholt.
Er zieht dafür 400 Aufgaben je Stufe und zählt die verschiedenen.

Vorher → nachher, je Stufe:

| Modul | vorher | nachher |
|---|---|---|
| `plan-muster` | 3–4 | 600+ |
| `sim-suchbild` | 4 | 72–200 |
| `wiss-oberbegriffe` | 3–4 | 20 |
| `sim-bausteine` | 10 | 84–600 |
| `lern-symbole` | 16 | 24 |
| `wiss-wortschatz` | 10 | 20 |

Drei verschiedene Wege dorthin, je nach Art des Inhalts:

**Erzeugen statt aufzählen** (`plan-muster`). Die Struktur eines Musters —
ABAB, AABB, ABC, Zahlenreihe — ist von den Symbolen unabhängig. Aus fünf
Bauformen je Stufe und zehn Symbolgruppen entstehen hunderte Aufgaben. Eine
Liste zu verlängern hätte nur bis zur nächsten Beschwerde geholfen: jede
feste Liste ist irgendwann durchgespielt.

**Die Kennung verfeinern** (`sim-bausteine`, `sim-suchbild`). Beide zählten
weniger Aufgaben, als es tatsächlich gab, weil die Kennung zu grob war. Die
Lage des verdeckten Rechtecks bzw. die Position des abweichenden Feldes
gehört dazu — dieselbe Mauer mit anderswo liegender Abdeckung ist eine
andere Aufgabe.

**Inhalt schreiben** (`wiss-oberbegriffe`, `wiss-wortschatz`, `lern-symbole`).
Wo die Aufgabe aus Wissen besteht, hilft keine Technik. 84 neue Oberbegriff-
Aufgaben und 41 neue Wörter, alle dreisprachig.

Nebenbei fiel dabei auf, dass `sim-suchbild` seine neuen Paare gar nicht
erreicht hätte: das Fenster war an eine feste Zahl gekoppelt (`3 + Niveau`)
und endete bei Index 8. Es wandert jetzt anteilig über die ganze Liste —
Stufe 1 nimmt die leicht unterscheidbaren Paare vorne, die höchste Stufe die
ähnlichsten hinten.

### Beim Wortschatz-Quiz ist das Bild die Antwort

Deshalb prüft der Testlauf zwei Dinge, die dort besonders wehtun: **kein
Bild zweimal in derselben Stufe** — zwei gleiche Bilder machen die Aufgabe
unlösbar — und mindestens 20 Wörter je Stufe.

Die Prüfung hat beim Schreiben drei eigene Fehler gefunden: 🔭 war zweimal
vergeben (Fernrohr und Teleskop), 🦔 ebenfalls (Gürteltier und
Stachelschwein), und 🦛 — ein Nilpferd — stand für „Tapir". Bei einem
Bild-Wort-Test ist ein unpassendes Bild keine Kleinigkeit, sondern eine
falsche Antwort.

### Keine Aufgabe zweimal hintereinander

Dieselbe Frage zweimal wirkt wie ein Fehler — und misst beim zweiten Mal
etwas anderes: die Erinnerung an die vorige Antwort statt der Fähigkeit.

Sieben Module hatten dafür eine eigene Lösung, acht keine. Statt das ein
neuntes Mal zu schreiben, kann die Auswahl-Engine es jetzt: ein Modul gibt
`roundKey(round)` an, und die Engine würfelt neu, bis eine Aufgabe kommt,
die im laufenden Durchgang noch nicht dran war.

```js
createChoiceGame({
  roundKey: r => r._key,
  genRound: gd => ({ _key: target.w.de, … })
})
```

Das Gedächtnis ist eine **Reihenfolge, keine Menge**. Ist der Vorrat einer
Stufe kleiner als der Durchgang, wird nicht alles vergessen, sondern nur das
Älteste — Wiederholungen liegen dann so weit auseinander wie möglich, und
zwei gleiche Aufgaben direkt hintereinander gibt es nie. Der Testlauf besteht
genau darauf.

**Was dabei auffiel.** Für `sim-bausteine` hatte ich zuerst
`w×h-cw×ch` als Kennung genommen — ohne die *Lage* des verdeckten Rechtecks.
Auf Stufe 1 gab es damit nur zwei unterscheidbare Aufgaben, und die Sperre
lief ins Leere. Mit `cx,cy` in der Kennung sind es 10 auf Stufe 1 und 252 auf
Stufe 6. Der Fehler lag in der Kennung, nicht im Vorrat.

Bei `sim-suchbild`, `plan-muster` und `wiss-oberbegriffe` ist der Vorrat auf
niedriger Stufe tatsächlich klein (3–4 Aufgaben). Dort sind Wiederholungen
innerhalb von zehn Runden unvermeidlich; sie liegen jetzt nur nicht mehr
Schlag auf Schlag. Mehr Abwechslung bräuchte dort mehr Inhalt, nicht mehr
Technik.

### Eigene Antwortzeit je Modul

Ein Modul kann `answerSeconds` angeben. Die Engine meldet daraus eine
Einstellung an, die auf der Einstellungsseite unter dem Modul erscheint:

```js
createChoiceGame({ id: 'wiss-wortschatz', answerSeconds: 5, … })
```

Das Wortschatz-Quiz steht damit auf 5 s statt der allgemeinen 30 s. Ein Wort
erkennt man oder nicht — wer das Bild nach fünf Sekunden nicht gefunden hat,
findet es auch nach dreißig nicht. Die übrige Zeit wäre Leerlauf, in dem die
Aufmerksamkeit wegdriftet. Der Niveauzuschlag kommt weiterhin obendrauf.

### Bedenkzeit wächst mit dem Niveau

Auf Stufe 5 ist die Aufgabe schwerer, die Uhr lief aber gleich schnell — wer
weiter kam, wurde mit knapperer Zeit bestraft. Die Antwortzeit der
Auswahlaufgaben skaliert deshalb mit der Stufe:

```
Zeit = Grundzeit × (1 + (Stufe − 1) × Zuschlag)
```

Voreingestellt sind 30 s und ein Zuschlag von 0,15 — Stufe 1 bekommt 30 s,
Stufe 5 bekommt 48 s. Auf 0 gestellt gilt für alle Stufen dieselbe Zeit.

Beim Sudoku kommt der Niveaufaktor aus der Aufgabe selbst: die Zeit ist die
Zahl der **leeren Felder** mal der eingestellten Zeit je Feld. Die leeren
Felder sind das, was Arbeit macht, und sie wachsen ohnehin mit dem Niveau.
Eine feste Zeit je Rätsel wäre auf Stufe 1 zu großzügig und auf Stufe 6
unfair.

### Sudoku ohne Prüfen-Knopf

Ausgewertet wird, sobald das letzte Feld gefüllt ist — oder wenn die Zeit
abläuft. Ein zusätzlicher Klick auf „Prüfen" sagt nichts aus, was das volle
Gitter nicht schon sagt. Danach ein Zeichen, ✅ oder ❌, und von selbst
weiter zum nächsten Rätsel; genau der Ablauf, den alle anderen Module auch
haben.

Der Radiergummi ist ein **leeres Feld in der Symbolreihe**, kein Knopf unter
dem Gitter. Er steht damit dort, wo man ihn braucht — der Knopf zwang dazu,
den Blick von der Auswahl wegzunehmen und wieder zurückzufinden.

Ob die Zeit abgelaufen ist, muss der Auswertung nicht mitgegeben werden: bei
Zeitablauf ist das Gitter fast immer noch nicht voll, und ein unvollständiges
Gitter gilt ohnehin als nicht gelöst. Wer im letzten Augenblick fertig wird,
bekommt die Lösung anerkannt.

### Alles Zeitliche steht in den Einstellungen

`src/core/settings.js` hält Anzeigedauer, Antwortzeit, Pause, Lernzeit,
Rückmeldedauer und den Ton an einer Stelle; `⚙️ Einstellungen` baut die Seite
allein aus dem SCHEMA, eine neue Einstellung erscheint dort von selbst. Die
Werte je Modul wirken **relativ**: bei der Voreinstellung 2 s ergibt sich genau
der bisherige Wert, und wer global langsamer stellt, verlangsamt alle Module
im selben Verhältnis.

### Kein „Weiter" mehr

Auch die Auswahlaufgaben laufen jetzt wie die Merkspannen-Tests: Rückmeldung
läuft nach 1,2 s (richtig) bzw. 2,5 s (falsch) von selbst weiter, und die
Antwortphase hat ein Zeitlimit mit Ablaufbalken.

Bewusst **nicht** übernommen wurde das Ausblenden der Aufgabe vor dem
Antworten. Bei „Was passt nicht?" oder einer Wissensfrage würde das aus einer
Denk- eine Gedächtnisaufgabe machen und damit etwas anderes messen.
Ausgeblendet wird nur, wo Merken das Ziel ist — dafür gibt es die
`study`-Phase.

### Navigation: Aufgabe vorn, Erklärung dahinter

Der Startbildschirm eines Moduls zeigt nur, was zum Loslegen nötig ist:
Aufgabe, Durchführung, Hinweise für die Begleitperson, Startknopf. Alles
Erklärende — was der Test misst, Einflüsse, Hypothesen, Förderwege — liegt
hinter dem Symbol-Link 🎯 auf einer eigenen Seite mit Rückweg.

Vorher stand das als langes Panel unter dem Startknopf. Wer mit einem Kind vor
dem Gerät sitzt, scrollt daran vorbei; es lenkt vom Start ab und drängt sich
demjenigen auf, der es gerade nicht braucht. Der Test hält den
Startbildschirm jetzt unter 1400 Zeichen und prüft, dass „Einflüsse",
„Hypothesen" und „Kognitive Faktoren" dort nicht auftauchen.

Karten sind mit `role="button"` und `tabindex` versehen und per Enter oder
Leertaste bedienbar; ein einzelner Zuhörer in `main.js` erledigt das für alle.
Externe Links öffnen durchgehend in einem neuen Tab (`target="_blank"` mit
`rel="noopener noreferrer"`).

### Fortschritt zurücksetzen

Statistik und kognitives Profil haben einen Zurücksetzen-Knopf. Er löscht
Spielstände und Verlauf für alle Module — Sprache und Tempo bleiben, das sind
Einstellungen und keine Ergebnisse.

Bewusst zweistufig: Löschen ist endgültig und kostet im Zweifel den gesamten
Verlauf eines Kindes. Die Abfrage benennt darum, was verschwindet und was
bleibt, und bietet das Sichern gleich daneben an. Nach dem Löschen wird der
Merker der Persistenz mit zurückgesetzt — sonst verglichen die nächsten
Spielstände gegen Zahlen, die es nicht mehr gibt, und der erste Treffer danach
ginge verloren.

### Fördermethoden-Seiten

Zu jedem Förderpunkt im Info-Panel eines Tests gibt es eine eigene Seite: was
die Methode ist, warum sie wirkt, eine Schritt-für-Schritt-Anleitung, Material
mit Bezugsquelle und Selbstbauhinweis, geprüfte Links. Erreichbar über den
Punkt selbst (er wird zum Link) oder über „🧰 Fördermethoden" im Menü.

```
src/data/methods/<id>.js     eine Datei je Methode, Schema in README.md daneben
src/data/methods/index.js    erzeugt (tools/gen-method-index.mjs)
src/data/foerderung-links.js erzeugt (tools/gen-foerderung-links.mjs)
src/ui/methods-view.js       Übersicht und Einzelseite
```

**Der Index wird erzeugt, nicht gepflegt.** Datei ins Verzeichnis legen genügt;
`npm run build` sammelt sie ein. Das war die Voraussetzung dafür, die Seiten
parallel schreiben zu lassen — an einer handgepflegten Sammeldatei hätten sich
gleichzeitig arbeitende Autoren gegenseitig blockiert.

**Prüfung.** `tools/method-schema.mjs` hält die Regeln an einer Stelle; der
Smoke-Test prüft damit alle Seiten, `tools/check-method.mjs <datei>` einzelne.
Geprüft werden unter anderem: DE und RU vorhanden und gleich lang (gleiche
Schrittzahl), Links als echte `https`-URLs mit Beschriftung in beiden Sprachen,
SVG ohne externe Verweise.

**Warum keine Produktfotos.** Die App läuft offline aus einem Bundle, und
fremde Produktfotos wären urheberrechtlich nicht frei. Stattdessen
selbstgezeichnete Schemazeichnungen — bei Nikitin-Würfeln oder Tangram zeigen
die ohnehin mehr als ein Werbefoto — plus Links dorthin, wo die echten Fotos
stehen.

**Ton.** Die Seiten richten sich an Erwachsene, nicht an Kinder: hier ist
ausführlicher Text richtig, anders als auf dem Spielbildschirm. Wo die
Wirksamkeit einer Methode nicht belegt ist, steht das auch so da — mehrere
Seiten sagen ausdrücklich, dass der Übertrag auf Schulleistungen nicht
nachgewiesen ist.

### Statistik zeigt Entwicklung, nicht den besten Tag

Vorher stand je Modul ein waagerechter Balken mit der Trefferquote. Der zeigt
einen Zustand, keine Entwicklung — und beim Bestwert sogar nur den besten Tag.

Jetzt steht in jeder Zeile eine kleine senkrechte Balkenreihe: die einzelnen
Durchgänge in zeitlicher Reihenfolge, dahinter der **laufende Mittelwert als
Zahl**. Nicht der letzte Wert — der wäre die unzuverlässigste Zahl von allen,
weil ein einzelner Durchgang stark mit Tagesform und Konzentration schwankt.
Der Mittelwert ist die stabile Größe, die Streuung darum herum zeigen die
Balken.

**Volle Balkenhöhe ist genau eine Schriftzeile** der Beschreibung daneben
(`height: 1.15em`). Die Reihe sitzt dadurch in derselben Zeile wie der
Modulname, und die Liste bleibt eine Liste statt einer Diagrammsammlung. Die
Balken sind zum Hinsehen da, nicht zum Ablesen — steigt es, fällt es,
schwankt es? Wer den Wert braucht, liest die Zahl.

Drei Entscheidungen, die man beim Nachbauen leicht anders träfe:

* **Feste Breite: 30 Plätze, überall.** Nicht „so viele wie Messungen" —
  nur bei fester Breite stehen die Zahlen dahinter in einer Spalte und zwei
  Zeilen lassen sich nebeneinander lesen. Wer weniger gespielt hat, füllt die
  Reihe noch nicht aus; die freien Plätze bleiben als blasse Sockel stehen
  und sind von einem gemessenen Nullwert unterscheidbar.
* **Verdichten statt abschneiden.** Mehr als 30 Balken sind in einer
  Textzeile nicht mehr unterscheidbar. Längere Reihen werden gemittelt, nicht
  gekürzt — sonst sähe man bei 200 Antworten nur den Anfang oder nur das
  Ende, also gerade nicht die Entwicklung.
* **Fester Maßstab 0–100 für alle Zeilen.** Ein Maßstab je Zeile nutzt die
  Höhe besser aus, aber eine Zeile mit lauter 20ern sähe dann aus wie eine
  mit lauter 90ern. Werte über 100 — die adaptiven Tests vergeben bis 130 —
  werden für die Höhe gekappt, die Zahl daneben bleibt ungekappt.
* **Ein Sockel von 6 % für den Wert null.** Ohne ihn verschwindet ein
  Nulldurchgang spurlos, und die Reihe behauptet, es hätte ihn nicht gegeben.

Einzelne Antworten (`kind: 'count'`) sind für sich 0 oder 100 und damit
wertlos; erst das Verdichten macht daraus eine ablesbare Linie. Module ohne
Verlauf in der Historie zeigen eine einzelne Marke statt einer vorgetäuschten
Entwicklung.

**Dieselben Reihen im kognitiven Profil.** Ein Faktor hat keine eigene
Messung — er speist sich aus mehreren Modulen. Seine Reihe entsteht deshalb
aus den verschmolzenen Historien aller Module, die auf ihn einzahlen,
zeitlich sortiert; dasselbe eine Ebene höher für die Kategorie. Dort stand
vorher ein waagerechter Balken mit dem Zustand.

Die Einschränkung dabei gehört mitgesagt und steht auch in der Oberfläche:
die beteiligten Aufgaben sind unterschiedlich schwer. Ein Wechsel des Moduls
kann in der Reihe wie ein Sprung aussehen, ohne dass sich beim Kind etwas
geändert hätte. Die Reihe taugt für die **Form** der Entwicklung, nicht für
den Vergleich einzelner Balken untereinander.

### Ausdauer und Gleichmäßigkeit aus den Einzelantworten

Gespeichert wird **jede einzelne Antwort**. Für die Anzeige ist das zu fein:
in der Balkenreihe steht ein Wert je **Durchgang**, nicht je Antwort. Eine
einzelne Antwort ist 0 oder 100 und für sich wertlos; als Balken wäre sie
nur Rauschen.

Die Einzelwerte bleiben aber erhalten, weil in ihrer *Reihenfolge* etwas
steckt, das im Mittelwert verschwindet. 60 % können gleichmäßig 60 % sein —
oder erst 90 % und dann 30 %. Zwei Größen greifen das ab:

**Ausdauer** ist der Unterschied zwischen zweiter und erster Hälfte eines
Durchgangs, in Punkten. Negativ heißt: es lässt gegen Ende nach. Die
Halbierung ist robuster als eine Regressionsgerade, wenn nur zehn Werte
vorliegen — und sie lässt sich jemandem erklären, der keine Statistik
gelernt hat.

**Gleichmäßigkeit** ist das Auf und Ab um diese Richtung herum, und zwar
**bereinigt um das Können**. Das ist der entscheidende Punkt: wer im Mittel
die Hälfte richtig hat, *muss* zwangsläufig wechseln. Ein rohes
Schwankungsmaß würde deshalb Können mit Konzentration verwechseln und jedem
mittelmäßigen Kind schlechte Konzentration bescheinigen. Verglichen wird
darum mit einer zufälligen Reihenfolge derselben Werte (von-Neumann-Verhältnis):

```
δ² = Σ(vᵢ − vᵢ₋₁)² / (n−1)
s² = Σ(v − v̄)²    / (n−1)
η  = δ²/s²  geteilt durch den Erwartungswert 2n/(n−1)

η ≈ 1   Reihenfolge wie zufällig – nichts Auffälliges
η > 1   mehr Wechsel als Zufall – Aussetzer
η < 1   ruhiger als Zufall – längere gleichbleibende Strecken
```

Die Teilung durch `2n/(n−1)` ist nicht Kosmetik, sondern eine Korrektur
eines echten Fehlers: ohne sie hängt der Bezugspunkt von der Länge des
Durchgangs ab. Bei zehn Werten liegt der Erwartungswert einer zufälligen
Folge nicht bei 2, sondern bei 2,47 — eine völlig unauffällige Folge wurde
dadurch als „sprunghaft" gemeldet. Der Testlauf prüft das jetzt für die
Längen 8 bis 100.

**Grenzen.** Mindestens 8 Werte je Durchgang und mindestens 3 Durchgänge,
sonst wird nichts behauptet. Auch dann bleibt es ein Hinweis: Tagesform,
Aufgabenwechsel und der Zufall kurzer Folgen wirken mit.

Zusammengehalten werden die Antworten eines Durchgangs über eine
`sessionId`, die beim Beginn eines Durchgangs vergeben wird. Ältere
Einträge haben keine — für die wird der Bruch daran erkannt, dass der
Zähler `round` nicht weiterläuft.

### Das Aufgabenmenü zeigt, was schon dran war

Jede Modulkarte trägt dieselbe Balkenreihe wie die Statistik, mit dem
Mittelwert als Zahl. Noch nicht gespielte Module bekommen eine gestrichelte
Leerzeile mit „noch nicht gespielt" statt gar nichts — der Unterschied
„noch nie" gegenüber „einmal schlecht" muss sichtbar bleiben.

Der Preis dafür: Menü und Skalenansicht laden Ergebnisse und sind dadurch
asynchron. Ohne das sehen 29 Karten gleich aus, und nach zwei Wochen weiß
niemand mehr, was schon dran war.

### Navigation: eine Leiste im Kopf, sonst nichts

Neun Seiten lagen als Knopfreihe auf der Startseite, und jede Seite trug
unten noch einmal „Zurück zum Menü". Wer in der Statistik war, musste erst
zurück, um in die Einstellungen zu kommen. Die Leiste sitzt jetzt **im
Kopfbereich** (`ui/nav.js`) und folgt dem Ablauf, den die Einführung
beschreibt:

```
🧠 LOGIK-Trainer   🗺️ Plan   🧪 Testen ▾   🧰 Lernen   📈 Auswertung ▾   ⚙️ Einstellungen   DE RU EN
                              ├ Gruppen                 ├ Statistik
                              └ Alle Aufgaben           └ Kognitives Profil
```

**„Über die App" steht bewusst nicht darin**: der Titel im Kopf führt schon
dorthin, und ein Eintrag, der dasselbe tut wie das direkt daneben, kostet nur
Breite. Die Seite zur Herkunft ist von der Einführung aus verlinkt.

**Am Seitenende steht keine Navigation mehr.** Weil die Leiste immer sichtbar
ist, war jeder „Zurück"-Knopf darunter ein zweiter Weg zum selben Ziel. Was
bleibt, sind Knöpfe, die etwas *tun*: sichern, zurücksetzen, neue Runde.
Der Testlauf besteht darauf und nennt jede Seite, die wieder einen bekommt.

Aufgeklappt wird per **Klick, nicht beim Überfahren mit der Maus** – auf einem
Tablet gibt es kein Überfahren, und dort läuft die App überwiegend. Auf
schmalen Bildschirmen lässt sich die Leiste seitlich schieben; die
Beschriftungen bleiben stehen. Bloße Symbole waren nicht zu verstehen –
„Testen" und „Auswertung" sehen als Piktogramm gleich aus.

Zwei Fehler, die dabei zu lernen gaben:

**Das Untermenü ging auf und sofort wieder zu.** Der Klick wurde am Knopf
behandelt, dabei zeichnete `renderNav` die Leiste neu und tauschte den Knopf
aus. Wenn das Ereignis danach beim Wächter für Klicks-daneben ankam, war sein
Ziel nicht mehr Teil der Leiste – der Wächter hielt es für einen Klick
außerhalb und schloss wieder. Von außen sah es aus, als passiere nichts.
`stopPropagation` löst das; die Leiste wird außerdem nicht mehr über einen
dynamischen Import neu gezeichnet, sondern direkt.

**Die Beschriftungen waren überall versteckt.** Beim Umbau blieben zweimal
Reste zerschnittener `@media`-Blöcke stehen. Deren Regeln galten dadurch
immer statt nur auf schmalen Bildschirmen. Der Smoke-Test zählt jetzt die
Klammern im Stylesheet, sucht eingerückte Regeln außerhalb eines
`@media`-Blocks und besteht darauf, dass `.nav-label` nirgends versteckt wird.

Die Startseite ist dadurch in zwei geteilt: **Gruppen** zeigt die fünf Skalen
mit ihrem Stand, **Alle Aufgaben** die vollständige Liste mit Altersfilter.
Beide haben keine Überschrift mehr — die Leiste sagt bereits, wo man ist, und
der Name der App steht darüber. Zwei Zeilen, die bei jedem Besuch dasselbe
sagen, kosten nur Platz.

### Die App öffnet mit der Einführung

Bei **jedem** Start, nicht nur beim ersten. Ohne sie wirken 29 Kacheln wie
eine Spielesammlung, und der Ablauf – erst durchtesten, dann üben, später
erneut messen – bleibt unsichtbar, obwohl er den Zweck der App ausmacht.

Kein Merker im Speicher: die App wird nicht täglich benutzt, sondern in
Abständen von Wochen. Bis zum nächsten Mal ist der Ablauf meist wieder
vergessen, und ein „schon gesehen" verbärge die Einführung gerade dann, wenn
sie gebraucht wird. Wer weiterarbeiten will, ist mit einem Klick in der
Leiste dort.

Diese Entscheidung ist zweimal umgekippt, einmal davon still – weil
gleichzeitig der Test mitgedreht wurde und danach niemand mehr etwas merkte.
Sie steht deshalb an einer benannten Stelle (`STARTSEITE` in `main.js`), und
der Smoke-Test liest sie dort nach.

`'menu'` zeigt weiterhin auf die Gruppen: zahlreiche Knöpfe und
Ergebnisseiten navigieren dorthin, und ein Umbenennen aller Stellen brächte
nichts als Gelegenheit für Fehler.

### Bilder sind die Aufgabe, nicht Schmuck

Bei einem Bild-Wort-Test ist das Bild die Antwort; bei einer Merkspanne ist
es das, was man sich merkt. Zu klein dargestellt misst man das Sehen statt
der Fähigkeit — besonders bei kleinen Kindern und auf Tablets.

Alle Bildgrößen hängen deshalb an einer Einstellung, voreingestellt auf
**2×**, verstellbar von 1× bis 3×. Zwei Wege, weil es zwei Arten von Größen
gibt:

- **In `em` angegebene Größen** rechnen über die CSS-Variable `--pic`:
  `font-size: calc(2.2em * var(--pic))`. Die Variable setzt
  `settings.anwenden()` auf dem Wurzelelement — dadurch wirkt eine Änderung
  sofort, ohne dass eine der vierzig Stellen neu gezeichnet werden muss.
- **In Pixel gerechnete Größen** gehen durch `bildPx()`. Bei den Merkspannen
  hängt die Größe von der Anzahl ab — bei zehn Ziffern werden die Kreise
  kleiner —, und dort greift eine CSS-Variable nicht.

Der Smoke-Test sucht nach `font-size` ab 1,25em ohne `var(--pic)` und meldet
jede Stelle, die beim Vergrößern zurückbliebe und die Kachel zerrisse.

### Der Weg durch die App: Einführung und Plan

Die App hatte alles, was man braucht — Tests, Auswertung, 54 Methodenseiten —
aber nichts, was sie verbindet. Wer 29 Module und ein Profil mit 89 Faktoren
vor sich hat, weiß nicht, womit er anfangen soll. Zwei Seiten schließen das.

**Die Einführung** (`ui/intro-view.js`) beschreibt den Ablauf in vier
Schritten: alles einmal durchtesten, Ergebnis ansehen, das Fehlende üben,
nach zwei bis drei Monaten erneut testen. Zwei Punkte stehen dort bewusst
deutlich, weil sie die Messung stärker beeinflussen als jede Feineinstellung
im Ablauf: dass der erste Durchgang **mehrere Stunden über mehrere Tage**
braucht, und dass ein gehetztes oder müdes Kind nicht zeigt, was es kann.
Die Stundenzahl wird aus der Modulzahl gerechnet, nicht geraten.

**Der Plan** (`ui/plan-view.js`) beantwortet genau eine Frage: *was mache ich
jetzt?* Er speichert nichts eigenes, sondern liest den Stand aus und leitet
daraus einen Schritt ab:

| Zustand | nächster Schritt |
|---|---|
| kein Geburtsjahr | eintragen — ohne Alter ist nichts einzuordnen |
| nicht alles getestet | die nächsten offenen Aufgaben, mit Zähler |
| alles getestet | die schwächsten Bereiche üben |
| Übungsphase lang genug | erneut testen (nach 8 Wochen) |

Bewusst **kein** Fortschrittsbalken über allem: der legte nahe, es gehe
darum, „fertig" zu werden. Es geht darum, an der richtigen Stelle zu üben.

### Von der Schwäche zur Übung

Vorher endete das Profil bei der Feststellung „Auditives Kurzzeitgedächtnis
38 %". Was man dagegen tut, stand woanders und war nicht verlinkt.

Jeder Faktor ist jetzt anklickbar und führt auf eine Seite, die zwei Dinge
zusammenbringt: die **Module**, die diesen Faktor trainieren, und die
**Alltagswege** aus den Fördermethoden — gesammelt über die Förderpunkte
aller beteiligten Module, Doppelte fallen weg.

### Fortschritt auch bei den Gruppen

Auf den fünf Skalenkarten stand vorher die Zahl ihrer Module. Die ist jeden
Tag dieselbe und beantwortet nicht die Frage, die beim ersten Durchgang
zählt: *welche Gruppe fehlt noch?* Jetzt steht dort ein Balken mit „3/8" und
darunter der Verlauf über alle Aufgaben der Gruppe.

### Woher die kognitiven Faktoren stammen

Das Modell hat 89 Faktoren. Die naheliegende Frage ist, ob die im Skript
stehen oder dazuerfunden sind. Nachgezählt statt geschätzt: die Abschnitte
„Was wird geprüft", „Wesentliche Einflüsse auf die Testleistung" und
„Hypothesen zu Stärken und Schwächen" aller **18 Subtests** enthalten
zusammen **284 verschiedene Einzelpunkte** — deutlich mehr als unsere 89,
nicht weniger.

Jeder Faktor trägt deshalb ein Feld `quelle`:

| Wert | Bedeutung | Anzahl |
|---|---|---|
| `skript` | wörtlich in einer Faktorenliste eines Subtests | 64 |
| `sinngemaess` | derselbe Begriff, im Skript anders formuliert | 19 |
| `eigen` | von uns ergänzt, dort nicht als Faktor genannt | 6 |

Beispiele für `sinngemaess`: „Fokussierung der Aufmerksamkeit" →
„Aufmerksamkeitsfokussierung", „Strategisches Vorgehen" → „Systematisches
Vorgehen", „Rhythmische Fähigkeiten" → „Rhythmisches Gefühl".

Die sechs eigenen sind: Erzählfähigkeit, Kategorisierungsfähigkeit,
Kombinatorische Fähigkeiten, Mentale Rotationsfähigkeit, Systematisches
Absuchen, Verständnis von Verdeckung. Vier davon gehören zu Modulen, die
selbst keine KABC-Subtests sind (Geschichten-Würfel, Oberbegriffe,
Suchbild, Teekesselchen); zwei sind unsere Deutung des Bausteine-Subtests,
der im Skript „Räumliches Vorstellungsvermögen" nennt, aber weder mentale
Rotation noch Verdeckung.

Auf der Faktorseite steht bei `eigen` ein Hinweis. Der Smoke-Test besteht
darauf, dass jeder Faktor eine Herkunft trägt und dass über 60 % wörtlich
belegt sind — läuft das Modell von der Vorlage weg, fällt es auf.

Die Zuordnung der nicht wörtlichen Treffer ist von Hand geprüft. Ein reiner
Textvergleich hätte zu viele Fehltreffer geliefert: „Muster" steht auch in
einem Subtestnamen, „Kombinatorik" nur in einem Spielenamen, „kreativ" in
„kreatives Schlussfolgern".

### Auswertung: eine Spanne ohne Alter sagt nichts

Vorher zeigte die App für jede erreichte Spanne dieselbe Sternenreihe und
dieselbe Prozentzahl aus einer festen Punkttabelle. Das ist keine
Auswertung, sondern eine Umbenennung des Rohwerts: **Spanne 6 ist mit sechs
Jahren weit überdurchschnittlich und mit fünfzehn leicht unterdurch­schnittlich.**

Gerechnet wird deshalb über den z-Wert gegen eine altersabhängige Norm:

```
z          = (Spanne − Mittelwert(Alter)) / Streuung(Alter)
Index      = 100 + 15 · z        (Skala wie bei Intelligenztests)
Skalenwert = 10  + 3  · z        (Subtest-Skala der KABC-II)
```

Wichtig ist, dass **beide** Größen mit dem Alter wandern. Nicht nur der
Mittelwert steigt, auch die Streuung — bei jüngeren Kindern ist sie kleiner,
eine Ziffer wiegt dort also schwerer. Ein fester Punktwert je Ziffer hätte
Kinder systematisch falsch eingeordnet. Gemessen: bei sechs Jahren sind es
15 Indexpunkte je Ziffer, bei achtzehn 11.

Zwischen den Stützstellen wird linear interpoliert, außerhalb auf den Rand
geklemmt. Der Index ist auf 40–160 begrenzt, und ein z über 3,5 wird
markiert statt ausgegeben: Spanne 10 bei einem Sechsjährigen ergäbe
rechnerisch 184 — das ist kein Messwert mehr, sondern ein Hinweis auf eine
Merktechnik, auf Vorsagen oder auf einen Fehler im Ablauf.

**Was diese Zahlen nicht sind.** Die Tabellen in `core/norms.js` sind
Literaturrichtwerte zur Ziffernspanne, keine an einer Stichprobe geeichten
Normen — genau daraus bezieht ein Verfahren wie die KABC-II seine
Aussagekraft, und genau das fehlt hier. Auf der Ergebnisseite steht das
deshalb mit dabei, und der Smoke-Test besteht darauf: ein Index ohne diesen
Hinweis lässt den Testlauf scheitern.

Und eine Einschränkung, die man nicht wegrechnen kann: gemessen wird nie die
reine Kapazität, sondern Kapazität plus Gruppierungsstrategie plus inneres
Mitsprechen.

**Nur wo es Richtwerte gibt.** `norm` steht am Modul und ist bislang nur bei
den beiden Ziffernspannen gesetzt. Wörter, Kofferpacken, Handzeichen und
Gesichter brauchen je eine eigene Tabelle — beim Kofferpacken liegen die
Mittelwerte höher, weil die Gegenstände semantisch verknüpfbar sind und jede
Runde die vorigen wiederholt. Die Ziffernnorm darauf anzuwenden hieße, allen
Kindern denselben falschen Wert zu geben. Diese Module zeigen weiter die
rohe Spanne.

### Geburtsdatum statt Alter

Gespeichert wird das Geburtsjahr, nicht das Alter — sonst stimmte die Angabe
nach dem nächsten Geburtstag nicht mehr und niemand dächte daran. Der Monat
ist optional; fehlt er, wird die Jahresmitte angenommen, weil das den
größtmöglichen Fehler bei ±6 Monaten hält. Bei Vierjährigen liegt zwischen
4;0 und 4;11 fast eine halbe Ziffer.

Gefragt wird einmal beim ersten Start, vor der Modulliste. „Auf
Voreinstellung zurücksetzen" lässt das Geburtsdatum ausdrücklich stehen: es
ist keine Ablauf-Vorliebe, sondern eine Angabe über das Kind.

### Lesen und Ziffern erst ab sechs

Module mit `requires: 'lesen'` oder `'zahlen'` werden jüngeren Kindern gar
nicht angeboten. Ein Fünfjähriger scheitert an „Was macht ein Tierarzt?"
nicht am Sachwissen, sondern am Text — der Wert misst dann das Lesen. Elf
der 29 Module sind betroffen; für Fünfjährige bleiben 18.

Die Wörter-Kette ist bewusst **nicht** dabei: dort steht neben jedem Wort
ein Bild, und genau dafür ist es da.

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
