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

DB-Zeile 42 · Buch: Adaptatsia_Uchebnykh_Materialov_Dlya_Obuchayuschikhsya_S_Ras · Stelle: S. 22–23, Teil II, 2.2.3 „Литературное чтение“ (bildhafte Sprache, Sprichwörter)

## Idee (aus der Ideen-Spalte)
Das Erklären bildhafter Wendungen wird zu einem Spiel für flexibles Sprachverständnis. Das Kind sieht eine Redewendung und wählt zwischen wörtlicher und übertragener Bedeutung. Jede Bedeutung wird mit einem Bild veranschaulicht: einmal das wörtliche Bild, einmal die tatsächlich gemeinte Alltagssituation. Das Kind ordnet der Wendung die richtige Erklärung zu und erkennt so den Unterschied. Auch Sprichwörter lassen sich auf diese Weise entschlüsseln, indem das Kind die passende Lebenssituation findet. Die App kann zeigen, wo und wann die Wendung im Alltag gebraucht wird. Das trainiert das Verstehen von Mehrdeutigkeit und übertragenem Sinn. Damit wird genau die Denkflexibilität gefördert, die hinter dem Modul „Teekesselchen“ steht. Die Idee passt ebenso in das Modul „Rätsel“, wo es um das Knacken von Wortbedeutungen geht.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Bin icch gespannt, wie du es machst

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-22-23-teil-ii-2-2-3-bildhafte-sprache). Trage `idee-db: 42` in den app.js-Kopf ein.
