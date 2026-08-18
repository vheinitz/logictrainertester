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

DB-Zeile 121 · Buch: Dal_E_N_-_Elektronika_Dlya_Detey_-_2017 · Stelle: S. 188–191, Kap. 9 „Как схемы понимают единицы и нули“, Projekt № 18 „Преобразование двоичного числа в десятичное“

## Idee (aus der Ideen-Spalte)
Die Umwandlung einer Binärzahl in eine Dezimalzahl wird zum Rechenspiel „Null-Eins-Wandler“ ausgebaut. Über einer Reihe aus acht Kästchen mit Nullen und Einsen stehen die Positionswerte 128, 64, 32, 16, 8, 4, 2 und 1, und das Kind addiert nur die Werte, unter denen eine Eins steht. Die App baut die Summe Schritt für Schritt auf, indem jedes angetippte Einser-Feld seinen Wert farbig in eine Additionszeile legt, sodass das Kind Zwischensummen im Kopf behalten und nachverfolgen kann. Umgekehrt zeigt die App eine Zielzahl und das Kind setzt die passenden Einsen, bis die Summe stimmt. Die Stellenwerte werden anfangs als doppelte Verdopplung erklärt (1, 2, 4, 8, 16 …), damit das Kind die Regel selbst entdeckt, statt die Tabelle auswendig zu lernen. In einer Blitz-Variante erscheint die Bitfolge nur kurz, und das Kind muss die Zahl danach aus dem Gedächtnis eintippen, was das Halten mehrerer Teilergebnisse trainiert. Eine Hörfassung liest die Bits nacheinander vor, sodass das Kind die Reihe akustisch behalten und im Kopf verrechnen muss. Schwierigkeitsstufen reichen von vier bis zu acht Stellen und von runden Zahlen wie 1000 bis zu gemischten Folgen. Die App gibt am Ende eine Rückmeldung, welche Position vergessen oder doppelt gezählt wurde, damit der Fehler sichtbar wird.

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
Es wird eine Zahl je mnach stufe zw 255 und 16 bit vorgegeben, anhand der bit-checkboxen (als icons stylen) soll das Kind diese Zahl versuchen bin als einzustellen. Unter der checkbox-bits steht aktuelle Nummer 0 wen off und Wert wen on mit + zeichen dazwischen. so sieht das kind zuerst 0+0+0+0...=0 sobald bit kippt ändert sich die summe und das kind soll entscheiden mehr oder weniger

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: s-188-191-kap-9-projekt-18). Trage `idee-db: 121` in den app.js-Kopf ein.
