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

DB-Zeile 39 · Buch: Adaptatsia_Uchebnykh_Materialov_Dlya_Obuchayuschikhsya_S_Ras · Stelle: S. 61–63, Teil III, 3.2.4 „Окружающий мир“, Пример № 17

## Idee (aus der Ideen-Spalte)
Das Sortieren von Tieren in Gruppen wird zum Kernspiel des Moduls „Oberbegriffe“. Auf dem Bildschirm sind Tierbilder verteilt, und es gibt Felder für Gruppen wie Insekten, Fische, Vögel oder Säugetiere. Das Kind zieht jedes Bild in die richtige Gruppe und erhält dabei sofort Rückmeldung. Als Hilfe erscheint zunächst bei jeder Gruppe ein Beispielbild, das als Anker dient. In einer leichteren Stufe ordnet das Kind vorgegebene Gruppenkarten den Bildern zu, statt die Namen selbst kennen zu müssen. Die App kann mit weiteren Kategorien wie Lebensmittel, Kleidung oder Werkzeuge erweitert werden. Das Kind lernt, gemeinsame Merkmale zu erkennen und Begriffe übergeordneten Klassen zuzuordnen. Die Rückmeldung erklärt, warum ein Tier zu einer Gruppe gehört, und stärkt so das Verständnis. Damit wird genau das kategoriale Denken trainiert, das dem Modul „Oberbegriffe“ zugrunde liegt.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Bitte 6-12 Tiere pro aufgabe mit 2-4 gruppen. Bilder und Gruppen sollen widerspruchsfrei sein. Wenn Bilder fehlen, platzhalter erstellen - rechteck mit Wort. die bilder werden anhand derplatzhalter später mit grok generiert

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-61-63-teil-iii-3-2-4-17). Trage `idee-db: 39` in den app.js-Kopf ein.
