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

DB-Zeile 16 · Buch: 5-6-Matematika-Zadachi-na-smekalku-1995 · Stelle: S. 10–11, Kapitel „Числа / Другие задачи“, Aufgaben 24–30

## Idee (aus der Ideen-Spalte)
Aus den Reihen der Aufgabe 24 entsteht ein Stufen-Pool für das Modul „Zahlenfolgen“: einfache Zehnerschritte (3, 13, 23 …), verdoppelte Differenzen (2, 5, 11, 23 …) und die Fibonacci-artige Reihe (1, 1, 2, 3, 5 …). Jede Reihe wird als Karte mit sichtbaren Gliedern und einem leeren Kästchen gezeigt; das Kind tippt oder spricht die nächste Zahl. Eine Hör-Variante liest die Zahlen nacheinander vor, damit das Arbeitsgedächtnis mitläuft wie im KABC-II-Vorbild. Zwei Hinweisstufen helfen gestaffelt: zuerst „Schau auf die Abstände“, dann wird eine Teildifferenz aufgedeckt. Die Rückmeldung benennt die gefundene Regel in Kindersprache („Immer plus 10“). Die Aufgaben 25–29 mit Zahlen in Klammern und Tabellen werden als „Regel-Detektiv“ umgesetzt: links und rechts stehen zwei Zahlen, in der Mitte ihr Ergebnis, und das Kind findet die fehlende Zahl. Das Rate-Spiel aus Aufgabe 30 wird zum Zwei-Spieler-Modus, bei dem ein Spieler eine Regel festlegt und der andere Glied für Glied die Fortsetzung errät. Punkte gibt es für wenige Rateversuche, damit das Bilden und Prüfen von Hypothesen belohnt wird. Ein Editor erlaubt es, eigene Reihen anzulegen und mit Familie oder Lehrkraft zu teilen. Schwierigkeit und Tempo lassen sich bis zu zwei ineinander verschachtelten Regeln steigern.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Davon sollen nur daten reihen nach verschiedenen Mustern implementiert werden, keie fibonachi, einfache regeln +x, *x, i+i-1, Jeweils 4 zahlen 5 zahl soll erraten werden. Keine eigene edit-reihen.

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-10-11-kapitel-aufgaben-24-30). Trage `idee-db: 16` in den app.js-Kopf ein.
