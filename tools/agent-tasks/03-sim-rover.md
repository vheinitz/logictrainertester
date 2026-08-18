# Aufgabe 03 — `sim-rover` implementieren

Du arbeitest im Repo LOGIK-Trainer (KABC-II-angelehntes Offline-Training im Browser).

## Nur diese Datei schreiben

`src/games/sim-rover.js`

Nicht anfassen: andere Spiele, Tests, README, `drag.js`.

## Ausgangslage

Stub. Metadaten:

- id `sim-rover`, simultan, ages 6–18, KABC-Ref Rover
- misst Wegplanung, räumliches Denken, Strategie — **nicht** Geschicklichkeit

## Kontrakt

Wie `plan-sudoku.js` / `plan-geschichten.js`:

- `init` / `render` / `dispose` / `actions` / `scoring: 'count'`
- `instruction` {de,ru,en}
- `settingsSchema` optional (z. B. Zeit je Feld)
- `countRound`, `resultScreen`, `bar` ohne Tick-Re-Render
- Timer + `_ready` korrekt
- `dragAufraeumen` nur wenn du Drag nutzt

## Spielidee

Hund/Roboter soll vom Start zum Knochen. Gitter mit freien Feldern und **Hindernissen**. Das Kind plant einen Weg.

**Nicht** Echtzeit-Laufen, nicht Labyrinth-Kunst.

Zwei erlaubte Bedienungen (eine wählen, im Kommentar begründen):

**A (empfohlen, näher am KABC-Gedanken „kürzester Weg“):**
Kind tippt nacheinander Felder; sie werden zum Pfad. Letzter Tipp aufs Zielfeld wertet aus, oder Knopf „Fertig“ nur wenn sonst unklar. Alternative: Pfeil-Buttons Zug um Zug, Figur läuft sichtbar ein Feld (Action `zug(gs, dir)`).

**B:** Drag der Figur von Zelle zu Zelle (`data-zieh` auf Figur, `data-ablage` auf Nachbarzellen). Nur orthogonale Schritte.

Bewertung:

- Erreicht das Ziel **ohne** Hindernis und **nur über Nachbarschritte**?
- Optional Stufe ≥3: nur Wege mit **minimaler Schrittlänge** gelten (Manhattan unter freien Zellen — BFS beim Erzeugen speichern). Längerer gültiger Weg = falsch, Feedback zeigt die Mindestlänge (Zahl), nicht den ganzen Lösungsweg als Spoiler auf niedrigen Stufen; auf Fehler die optimale Länge nennen.

Generator:

- Rechteckgitter, Start eine Ecke, Ziel gegenüber oder zufällig, Hindernisse so gesetzt, dass **mindestens ein Weg** existiert (nach jedem Hindernis BFS prüfen).
- Keine unlösbare Karte ausliefern (Smoke/Selbsttest).

## Niveaus 1–5

| Stufe | Gitter | Hindernisse | Extra |
|---|---|---|---|
| 1 | 4×4 | 1–2 | jeder Weg zum Ziel ok |
| 2 | 5×5 | 3–4 | jeder gültige Weg |
| 3 | 5×5 | 4–6 | nur kürzester Weg |
| 4 | 6×6 | 6–8 | kürzester |
| 5 | 6×6 oder 7×7 | mehr, evtl. Einbahn/Kosten gleich 1 | kürzester, evtl. 2 Teilziele nacheinander |

≥ 20 unterscheidbare Karten je Stufe per Generator (Seed/Zufall + Hinderniszahl). Wiederholungssperre optional über Hash der Karte.

Richtig → level++, falsch → level--.

Zeit: `sekProFeld` × Felderzahl oder × erwartete Schrittlänge.

Darstellung: CSS-Grid oder SVG, Start/Ziel/Hindernis klar, ohne Text im Feld wenn Icons reichen. Texte der UI dreisprachig.

Feedback: ✅/❌; bei Fehler Mindestschritte oder ein eingezeichneter Musterweg (kurz, danach weiter).

## Qualität

Messbar (Schritte, Erreichbarkeit), nicht „sieht nach Labyrinth aus“.
Keine Original-Rover-Items.
Kommentare Deutsch (warum).
Kein Stub.

## Selbstcheck

```
node --input-type=module -e "
import * as m from './src/games/sim-rover.js';
const gs = { gd:{}, score:0, total:0, rounds:0 };
m.init(gs);
if (!gs.gd._ready) throw new Error('ready');
const h = m.render(gs);
if (!h || /noch nicht umgesetzt/.test(h)) throw new Error('stub');
m.dispose(gs);
console.log('ok', Object.keys(m.actions));
"
```

Keine anderen Dateien.
