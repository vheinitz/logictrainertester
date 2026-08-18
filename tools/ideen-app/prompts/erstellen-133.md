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

DB-Zeile 133 · Buch: Domoryad_A_P_-_Matematicheskie_igry_i_razvlechenia_-_1961 · Stelle: S. 73–78, § 14 „Das Fünfzehner-Spiel und ähnliche Spiele“

## Idee (aus der Ideen-Spalte)
Das klassische Schiebepuzzle mit 15 Plättchen und einem freien Feld eignet sich als digitales Planungsspiel. Die App zeigt ein 4×4-Feld, bei dem das Kind die Plättchen per Ziehen so lange verschiebt, bis die Zahlen oder Bilder geordnet sind. Für jüngere Kinder beginnt man mit einem 3×3-Feld und nur acht Plättchen, damit die Aufgabe überschaubar bleibt. Statt Zahlen lassen sich Bilderstreifen einsetzen, die in die richtige Reihenfolge geschoben werden müssen – das schafft die Brücke zum Modul „Bildergeschichte ordnen“. Die App zählt die Züge mit und zeigt nach dem Lösen an, wie viele Züge mindestens nötig gewesen wären. Eine Hilfe-Funktion markiert das Plättchen, das als Nächstes gezogen werden sollte, ohne die Lösung komplett zu verraten. Weil manche Mischungen unlösbar sind, erzeugt die App nur lösbare Ausgangsstellungen und verwandelt so einen möglichen Frustmoment in einen Lernanlass. Als Wort-Variante wird die „Chamäleon“-Aufgabe aus dem Buch übernommen: Buchstaben eines Worts werden auf verbundenen Feldern verschoben, bis das Wort richtig zu lesen ist. Dadurch werden räumliche Vorstellung, Vorausplanen und das Denken in mehreren Schritten gemeinsam trainiert.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Supper idee bitte 3x3 und 4x4 mit je einem freien kachel

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-73-78-14-das-f-nfzehner-spiel-und-hnli). Trage `idee-db: 133` in den app.js-Kopf ein.
