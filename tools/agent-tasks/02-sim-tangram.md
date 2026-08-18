# Aufgabe 02 — `sim-tangram` implementieren

Du arbeitest im Repo LOGIK-Trainer (KABC-II-angelehntes Offline-Training im Browser).

## Nur diese Datei schreiben

`src/games/sim-tangram.js`

Nicht anfassen: andere Spiele, `index.js`, `modules.js`, Faktoren, Tests, README, `drag.js`.

## Ausgangslage

Stub via `createStub`. Metadaten existieren:

- id `sim-tangram`, Skala simultan, ages 6–18
- Faktoren: Flexibilität, Formerkennung, räumliches Vorstellen, Strategie, visuell-motorische Koordination

## Kontrakt

Wie `src/games/plan-geschichten.js`:

- `init` / `render` / `dispose` / `actions` / `scoring: 'count'`
- `instruction` {de,ru,en}
- optional `settingsSchema` + `registerModuleSettings`
- Drag: `data-zieh` / `data-ablage`, Action `verschiebe(gs, stueck, ziel)`
- `countRound` + `resultScreen`, `bar`, Timer aufräumen, `dragAufraeumen`
- `_ready` setzen/löschen
- **Kein Re-Render während der Uhr** (nur CSS-`bar`)

## Spielidee

Klassisches **Tangram**: 7 Teile (5 Dreiecke, 1 Quadrat, 1 Parallelogramm) bilden eine **Silhouette**.

Nicht frei in der Fläche schieben (Kollision in Pixeln ist unzuverlässig und bricht bei Re-Render). Stattdessen:

**Platz-Modell:** Die Figur ist in ein festes Satz von **Zellen/Slots** zerlegt, die genau den 7 Standardteilen entsprechen (welche Form, welche Rotation in 45°-Schritten, optional Spiegelung nur beim Parallelogramm). Das Kind legt Teile aus dem Vorrat auf passende Slots. Ein Teil darf nur auf einen Slot seiner Form (großes Dreieck nur auf große-Dreieck-Slots).

Darstellung: SVG-Silhouette der ganzen Figur + die 7 Slots als unsichtbare/gestrichelte Trefferflächen; gelegte Teile als gefüllte Polygone in der richtigen Pose.

Vorrat: die 7 Standardteile als SVG. `data-zieh` = Teil-id, `data-ablage` = `slot:i` oder `vorrat`.

Rotation: Action `drehe(gs, stueck)` um 45°. Parallelogramm zusätzlich `spiegle`. Knopf sichtbar, wenn das Teil in der Hand oder im Vorrat ausgewählt ist.

Auswertung wenn alle 7 Slots belegt **oder** Zeit abgelaufen. Richtig = jedes Slot hat das vorgesehene Teil in erlaubter Orientierung (manche Figuren erlauben 2 Orientierungen — im Datensatz `okRot: number[]` hinterlegen, nicht raten).

Kein „Prüfen"-Knopf.

## Niveaus 1–5 (Alter 6–18)

| Stufe | Figuren |
|---|---|
| 1 | Quadrat, Rechteck, Drachen — innere Linien der Teile **sichtbar** (fast Vorlage) |
| 2 | einfache Tiere/Boote, innere Linien noch da |
| 3 | Silhouette ohne Innenlinien, konvex/einfach |
| 4 | konkave Silhouetten |
| 5 | schwierige konkave, evtl. ohne Slot-Andeutung (nur Umriss; Snap unsichtbar aber aktiv) |

Mindestens **20 verschiedene Figuren insgesamt**, verteilt auf die Stufen (lieber mehr). Jede Figur: id, stufe, Anzeigename {de,ru,en} optional, Slotliste (Teiltyp + Zielrotation + Position im viewBox).

Richtig → level++, falsch → level--, Clamp 1–5.

Zeit: `sekProTeil` (Default ~20s × 7).

## Darstellung

SVG `viewBox` fest, keine Fremdbilder, keine Emoji als Geometrie. Farben aus CSS-Variablen oder einfache Hex. Offline, kein fetch.

## Texte

Alle UI-Strings `{de,ru,en}` + `pick()`. `instruction` erklärt Legen, Drehen, Zurücklegen.

## Qualität

Große Hit-Areas. Kommentare Deutsch (warum). Kein Stub-Import. Keine KABC-Originalfiguren als Anspruch (eigene/gemeinfreie Tangram-Figuren).

## Selbstcheck

```
node --input-type=module -e "
import * as m from './src/games/sim-tangram.js';
const gs = { gd:{}, score:0, total:0, rounds:0 };
m.init(gs);
if (!gs.gd._ready) throw new Error('ready');
const h = m.render(gs);
if (!h || /noch nicht umgesetzt/.test(h)) throw new Error('stub');
if (!m.actions.verschiebe) throw new Error('verschiebe');
m.dispose(gs);
console.log('ok');
"
```

Keine anderen Dateien ändern.
