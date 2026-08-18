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

DB-Zeile 88 · Buch: Besedy_Po_Fizike_chast_1__1974_Bludov · Stelle: S. 151–157, „Симметрия и энергетика кристаллов“

## Idee (aus der Ideen-Spalte)
Das Kapitel über Symmetrie liefert gleich mehrere visuelle Übungen. Beim Schmetterling und beim Tintenklecks soll das Kind die fehlende, gespiegelte Hälfte ergänzen oder aus Vorschlägen auswählen — eine direkte Gestaltschließen-Aufgabe. Bei der Schneeflocke lernt es, durch Drehen um 60 Grad zu prüfen, ob die Figur wieder mit sich selbst zur Deckung kommt. Die Achsen zweiter, dritter, vierter und sechster Ordnung werden als Dreh-Puzzle umgesetzt, bei dem das Kind die richtige Drehung finden muss. Zusätzlich können die Karton-Modelle aus dem Buch als digitale Falt-Bauanleitung dienen, bei der das Kind die Anzahl der Flächen zählt und das Netz zum Körper zusammenbaut. So werden Bausteine zählen, mentales Falten und Spiegelbild-Erkennen in einer Einheit verbunden. Die Schwierigkeit steigt von einfachen Spiegelsymmetrien bis zu räumlichen Kristallmodellen.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Bitte es so implementieren: 5 Figuren im eine Achse oder punkt zeichnen und kind muss entscheiden, welche davon pinkt/liniensymmetrisch ist. Nur eine von 5 soll es sein

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-151-157). Trage `idee-db: 88` in den app.js-Kopf ein.
