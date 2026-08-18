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

DB-Zeile 28 · Buch: 5-6-Matematika-Zadachi-na-smekalku-1995 · Stelle: S. 64, Kapitel „Смесь“, Nr. 275–276

## Idee (aus der Ideen-Spalte)
Das Wolf-Ziege-Kohl-Rätsel (Nr. 275) wird als Bootsspiel mit drei Figuren und einem kleinen Boot umgesetzt. Das Kind wählt pro Überfahrt aus, wen es mitnimmt, und beobachtet, ob am Ufer jemand gefressen wird. Die App markiert verbotene Zustände wie Wolf mit Ziege oder Ziege mit Kohl ohne Aufsicht sofort und lässt den Zug rückgängig machen. Eine Zustandsanzeige zeigt beide Ufer übersichtlich, damit das Kind den Überblick behält. Die Soldaten-Aufgabe (Nr. 276) wird zur zweiten Stufe mit zwei Kindern als Fährleuten und mehreren Soldaten. Das Kind lernt, dass manchmal Rückfahrten nötig sind, um voranzukommen; die App hebt solche scheinbaren Rückschritte positiv hervor. Ein Planungsmodus lässt das Kind die Zugfolge zuerst als Symbolkette aufschreiben, bevor es spielt. Die App zählt die Überfahrten und vergleicht mit der Mindestzahl. Das Modul trainiert das Durchdenken mehrerer Schritte und das Erkennen von Sackgassen.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Davon nur Ziege-wolf-Kohl umsetzen. Auffressenirgendwie grafisch gestalten. Das mit den soldaten lassen.

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-64-kapitel-nr-275-276). Trage `idee-db: 28` in den app.js-Kopf ein.
