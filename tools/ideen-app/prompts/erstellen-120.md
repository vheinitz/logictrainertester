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

DB-Zeile 120 · Buch: Dal_E_N_-_Elektronika_Dlya_Detey_-_2017 · Stelle: S. 251–270, Kap. 12 „Давайте создадим игру!“, Projekt № 23 „Игра на быстроту реакции“

## Idee (aus der Ideen-Spalte)
Das Buch beschreibt ein Reaktionsspiel, bei dem ein Lichtpunkt über eine Reihe von fünf Lampen hin- und herwandert und per Knopfdruck angehalten werden muss. Für die App wird daraus ein Bildschirmspiel, bei dem ein leuchtender Punkt schnell zwischen fünf Feldern pendelt und das Kind genau dann tippt, wenn der Punkt im mittleren Feld steht. Die mittlere Position bringt zehn Punkte, die beiden Nachbarfelder fünf Punkte und ein Randfeld setzt den Zwischenstand wieder auf null, damit das Kind nicht wild tippt, sondern den richtigen Moment abwartet. Eine Runde geht bis fünfzig Punkte, sodass mehrere Anläufe nötig sind und das Kind seine Treffsicherheit über die Versuche hinweg verbessern kann. Die Geschwindigkeit des Pendelns lässt sich in Stufen erhöhen, sobald das Kind regelmäßig das Mittelfeld trifft. Zusätzlich gibt es einen Zweispieler-Modus, in dem abwechselnd jeweils eine Person nur einen einzigen Stoppversuch hat und danach weitergibt. Die App protokolliert, wie oft mittig, daneben oder am Rand gestoppt wurde, und zeigt das als einfaches Balkendiagramm an. Eine ruhigere Variante ersetzt den wandernden Punkt durch einen auf- und abklingenden Ton, damit auch die akustische Aufmerksamkeit geübt wird. So trainiert das Spiel gezielt die Fähigkeit, einen schnellen Wechsel wahrzunehmen und die Reaktion genau zu dosieren.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Vergiss die Beschreibung, behalte nur reaktionsspiel. Wir machen so ein spiel: Die buchstaben  fallen langsam runter und kind muss die richtige bucstabe an tastatur klicken, sobald si den boden nicht berührt. Ansonsten fehlpunkt und nach 5 fehlpunkten gameover. Gewinn nachdem je nach schwierigkeitsstuve 20-200 buchstaben richtig gedrückt.

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-251-270-kap-12-projekt-23). Trage `idee-db: 120` in den app.js-Kopf ein.
