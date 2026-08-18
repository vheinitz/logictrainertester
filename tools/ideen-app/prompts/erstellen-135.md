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

DB-Zeile 135 · Buch: Domoryad_A_P_-_Matematicheskie_igry_i_razvlechenia_-_1961 · Stelle: S. 197–205, § 36 „Aufgaben logischen Charakters“

## Idee (aus der Ideen-Spalte)
Die gesammelten Logikaufgaben liefern reichhaltige Vorlagen für das Modul „Rätsel“ und für schlussfolgerndes Denken. Die Lügner/Wahrheitssager-Aufgabe wird als kurzer Dialog mit zwei Figuren umgesetzt, bei dem das Kind entscheidet, wer die Wahrheit sagt. Das Mützen-Rätsel wird zu einem Mehrschritt-Szenario, in dem das Kind nacheinander die Sicht der einzelnen Figuren durchdenken muss. Die Falschmünzen-Aufgabe erscheint als Wäge-Spiel mit einer Balkenwaage: Aus zwölf Münzen ist die abweichende in möglichst wenigen Wägungen zu finden, wobei die App jeden Wiegeschritt auswertet. Das Umfüll-Rätsel mit Gefäßen von 8, 5 und 3 Litern wird als Gieß-Spiel mit klaren Regeln und Undo-Funktion angeboten. Die Überfahrt-Aufgabe mit Händlern und Dienern wird als Fluss-Spiel mit Boot und Bedingungen gestaltet, bei dem das Kind die Passagiere wählen muss. Jede Aufgabe wird in kleine, überprüfbare Schritte zerlegt, damit das Kind systematisches Ausschließen übt. Die App streicht unmögliche Fälle auf Wunsch automatisch und gibt so eine didaktische Hilfestellung. So werden logisches Schließen, das Halten mehrerer Bedingungen im Kopf und die Frustrationstoleranz gefördert.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Bitte nur wiegeaufgabe mit falschmünzen implementieren

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-197-205-36-aufgaben-logischen-charakte). Trage `idee-db: 135` in den app.js-Kopf ein.
