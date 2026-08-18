Du baust/änderst EINE Mini-App im LOGIK-Trainer-Projekt (KABC-II-angelehntes
Kindertraining). Gemeinsames Framework liegt in apps/_framework/ – lies zuerst
dessen README.md und framework.js.

Vertrag jeder App: apps/<slug>/app.js definiert
  new MiniApp({ id, icon, titel{de,ru,en}, anweisung{de,ru,en}, hilfe{de,ru,en},
                settingsSchema, init(state,app), render(state,app)->HTML/SVG,
                actions{}, onTap/onDrag/onDrop(state,…,app), evaluate(state,app) })
und index.html lädt ../_framework/framework.css + ./app.bundle.js (wird nachher
mit `npm run build:miniapps` gebündelt).

Im app.js-Kopf steht die Kennung `idee-db: <id>` (bei neuer App: eintragen).
Texte immer {de,ru,en} – die App ist wie die Haupt-App mehrsprachig und für
weitere Sprachen erweiterbar (einfach einen Schlüssel ergänzen).

Schreibe NUR die Dateien der App; nichts anderes im Repo ändern.


# AUFGABE: neue Mini-App erstellen

DB-Zeile 107 · Buch: Carol_Vorderman_Craig_Steele_Claire_Quigley_Da · Stelle: S. 70–72, Kapitel „Follow the Numbers“ (Spielprinzip und Ablaufplan)

## Idee (aus der Ideen-Spalte)
Das Verbinde-die-Punkte-Prinzip lässt sich eins zu eins in das Zahlenfolgen-Modul übertragen. Zahlenpunkte erscheinen verstreut auf dem Bildschirm, und das Kind tippt sie in aufsteigender Reihenfolge an. Jede richtig gewählte Zahl wird mit der vorherigen durch eine Linie verbunden, sodass der Fortschritt sichtbar wird. Bei einem Fehler verschwinden alle Linien und das Kind beginnt von vorn, genau wie im Buch beschrieben. Die Schwierigkeit steigt über die Anzahl der Punkte, größere Zahlenbereiche oder Lücken, etwa nur gerade Zahlen. Eine Variante mit Rückwärtszählen fordert zusätzlich die kognitive Flexibilität. Die App erfasst Zeit und Fehlerzahl, um Fortschritte bei der seriellen Ordnung sichtbar zu machen. Eine akustische Ansage der Zielzahl unterstützt Kinder mit schwächerem visuellen Scannen. Das Spiel trainiert nebenbei das Halten der aktuellen Zielposition im Arbeitsgedächtnis. Als Alltagsförderung lässt sich daraus ableiten, Alltagsdinge der Reihe nach zu ordnen, etwa Größen oder Wochentage.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
MAn kann es so machen, dass das kind ein programm aus pfeilen oder buchstaben schreibt und dann go. entsprechend dem programm werden die Punkte verbunden. anschliessend wird geprüfft, on erwünschte figur entstand

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-70-72-kapitel-follow-the-numbers-spiel). Trage `idee-db: 107` in den app.js-Kopf ein.
