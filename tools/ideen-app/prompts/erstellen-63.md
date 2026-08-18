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

DB-Zeile 63 · Buch: Arifmetika_Uchebnik_dlya_3_klassa_nachalnoy_shkoly_Pchyolko_A_S_Polyak_G_B_1955 · Stelle: S. 131, „Занимательные задачи", Nr. 1169 (Stäbchen-Figuren)

## Idee (aus der Ideen-Spalte)
Im Buch werden aus zwölf Stäbchen vier Quadrate gelegt, dann soll man Stäbchen wegnehmen oder umlegen, damit andere Anzahlen entstehen. Das ist die ideale Vorlage für ein Tangram-ähnliches Modul mit virtuellen Streichhölzern. Die App legt eine Startfigur vor und nennt ein Ziel: „Nimm zwei Stäbchen weg, damit zwei Quadrate bleiben". Das Kind tippt Stäbchen an, um sie zu entfernen oder zu verschieben. Jede Umformung verlangt räumliches Vorstellen und das Planen mehrerer Züge im Kopf. Fehlversuche lassen sich einfach rückgängig machen, wodurch Ausprobieren angstfrei bleibt. Ein Zähler kann die verwendeten Züge mit der Mindestzahl vergleichen. Im Alltag lässt sich dieselbe Übung mit Zahnstochern oder Streichhölzern am Küchentisch nachstellen. Die Stufen steigern sich von „wegnehmen" über „umlegen" bis zu frei erfundenen Figuren.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Ja bitte einige Streichholzspiele implementieren

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-131-nr-1169-st-bchen-figuren). Trage `idee-db: 63` in den app.js-Kopf ein.
