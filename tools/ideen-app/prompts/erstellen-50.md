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

DB-Zeile 50 · Buch: Akhmanov_M_S_-_Prosto_Arifmetika_-_prosto__-_2013 · Stelle: S. 30–31, Kap. 2 „Абак — вычислительный инструмент древности“

## Idee (aus der Ideen-Spalte)
Der Abakus wird zum digitalen Legespiel „Stein-Abakus“ mit mehreren senkrechten Spalten. Eine Mittellinie teilt jede Spalte; Steine unter der Linie zählen je eins, Steine über der Linie je fünf. Das Kind legt Steine per Ziehen, um eine vorgegebene Zahl darzustellen, etwa einen Geldbetrag. Die App liest die gelegte Zahl laufend vor und zeigt sie als Ziffer, damit das Kind Selbstkontrolle erhält. Im Umkehr-Modus zeigt die App eine Zahl und das Kind muss die Steine richtig legen. Ein Beispiel wie die 302 158 Drachmen aus dem Buch wird als große Meisteraufgabe mit mehreren Spalten angeboten. Die Schwierigkeitsstufen erweitern die Spalten von Einern und Zehnern bis zu Tausenden. Eine Münzen-Variante verknüpft das Legen mit Geldbeträgen aus dem Alltag. Die feinmotorische Geste des Legens und die räumliche Zuordnung von Spalten und Werten werden gezielt geübt.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Das ist eine gute idee für miniapp. ein generisches Abakus trainer ohne arighmetik. Nur die Zahlen

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-30-31-kap-2). Trage `idee-db: 50` in den app.js-Kopf ein.
