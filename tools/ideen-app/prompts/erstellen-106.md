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

DB-Zeile 106 · Buch: Carol_Vorderman_Craig_Steele_Claire_Quigley_Da · Stelle: S. 138–140, Kapitel „Dance Challenge“ (Spielprinzip und Ablaufplan)

## Idee (aus der Ideen-Spalte)
Das Merkspiel „Dance Challenge“ ist eine direkte Vorlage für das Modul „Handbewegungen“ und für das Gedächtnistraining. Eine Figur führt eine kurze Bewegungsfolge vor, und das Kind wiederholt sie anschließend auf vier farbigen Feldern. Die App zeigt die Folge zunächst komplett, blendet sie dann aus und lässt das Kind die Reihenfolge antippen. Mit jeder Runde wird die Sequenz um einen Schritt länger, sodass die Gedächtnisspanne schrittweise wächst. Ein falscher Schritt beendet die Runde nicht sofort, sondern wird als Versuch gewertet; erst nach drei Fehlern erscheint die Auswertung. Jeder Farbe kann ein eigener Ton zugeordnet werden, damit Hören und Sehen wie beim Zahlenfolgen-Modul kombiniert werden. Die Übungsrückmeldung misst, wie viele Schritte das Kind fehlerfrei nachbilden kann. Als Fördermethode für den Alltag ergibt sich daraus das Nachmachen einfacher Klatsch- oder Bewegungsfolgen. In einer Spielvariante erhöht sich das Vorführtempo, um die Automatisierung zu trainieren. Zusätzlich kann das Kind eigene Folgen „vorspielen“ und so selbst zum Anleiter werden.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Es gibt solche Menschens-cartoon bilder, wo einzelne glieder separat gezeichnet sind mit beugungen und ohne und aus zusammensetzen de rGlieder kann man die Bewegungen darstellen. Solche bilder können hier benutzt werden. Hier ohne bewertung, Computer machts vor, kind widerholt, kompoter macht nach einer zeit langsam wieder vor zum kontrolieren

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-138-140-kapitel-dance-challenge-spielp). Trage `idee-db: 106` in den app.js-Kopf ein.
