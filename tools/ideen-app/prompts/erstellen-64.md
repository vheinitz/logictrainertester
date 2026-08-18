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

DB-Zeile 64 · Buch: Arifmetika_Uchebnik_dlya_3_klassa_nachalnoy_shkoly_Pchyolko_A_S_Polyak_G_B_1955 · Stelle: S. 132, „Устные примеры и задачи", Nr. 1172–1175 (Kettenrechnen)

## Idee (aus der Ideen-Spalte)
Diese mündlichen Kettenaufgaben wie „15 mal 4, geteilt durch 5, mal 7, plus 16" sind ein fertiges Muster für das auditive Zahlenfolgen-Modul. Die App spricht die Rechenschritte einzeln vor, das Kind behält die Zwischenergebnisse im Kopf und nennt am Ende das Ergebnis. Die Länge der Kette lässt sich stufenweise erhöhen, um die Merkspanne zu fordern. Eine visuelle Variante zeigt die Schritte als Perlenkette, bei der nur die nächste Perle kurz aufleuchtet. So wird gleichzeitig das Arbeitsgedächtnis und die Fähigkeit trainiert, eine Folge von Anweisungen korrekt auszuführen. Das Feedback kann das Zwischenergebnis an jeder Stelle anzeigen, damit das Kind den Fehlerort selbst findet. Im Alltag lässt sich das als Spiel „Der Einkaufszettel im Kopf" aufgreifen. Auch Zahlen wie „verdopple, drittle, minus 3" passen als kurze, altersgerechte Ketten.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Bitte mehrere Schwierigkeitsstufen, die jede einzlelne zahl begrenzen von 1 bis 15

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-132-nr-1172-1175-kettenrechnen). Trage `idee-db: 64` in den app.js-Kopf ein.
