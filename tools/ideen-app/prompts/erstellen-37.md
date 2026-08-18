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

DB-Zeile 37 · Buch: Adaptatsia_Uchebnykh_Materialov_Dlya_Obuchayuschikhsya_S_Ras · Stelle: S. 57–58, Teil III, 3.2.3 „Литературное чтение“, Пример № 15

## Idee (aus der Ideen-Spalte)
Das Verbinden von Wort und Bedeutung per Linie wird zu einem Zuordnungsspiel für Sprachverständnis. In einer Tabelle stehen links schwierige Wörter, rechts ihre Erklärungen oder einfachere Synonyme. Das Kind zieht von jedem Wort eine Linie zur passenden Bedeutung und bekommt sofort Rückmeldung. Nummerierte Spalten erleichtern die Orientierung und das spätere Auswerten der Ergebnisse. Die App kann die Wörter aus kurzen Texten ziehen, damit der Zusammenhang erhalten bleibt. Eine Stufe mit Synonymen bereitet den Boden für das Modul „Teekesselchen“, bei dem Wörter mehrere Bedeutungen tragen. Die Schwierigkeit wächst mit der Abstraktheit der Begriffe, von gegenständlichen bis zu bildhaften Wörtern. Das Kind lernt, unbekannte Wörter über Bedeutung und Ähnlichkeit selbst zu erschließen. Damit wird gezielt der Wortschatz erweitert und das Verstehen von Begriffen trainiert.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Bitte so umsetzen. mit 300 Begriffen aus verschiedenen gebiegen auch abstrakte. Wenn Bilder fehlen, ein Platzhalter benutzen  - ein recheck mit dem Wort. die Bilder erstelle ich mit grok anhand der Platzhalter.

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-57-58-teil-iii-3-2-3-15). Trage `idee-db: 37` in den app.js-Kopf ein.
