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
  Profil errechnet. 36 der 89 Faktorbezeichnungen kommen im Skript gar nicht
  vor, und die Zuordnung Faktor → Modul gibt es dort nicht.

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
