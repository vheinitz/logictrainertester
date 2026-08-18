# Aufgabe 01 — `sim-dreiecke` implementieren

Du arbeitest im Repo LOGIK-Trainer (KABC-II-angelehntes Offline-Training im Browser).

## Nur diese Datei schreiben

`src/games/sim-dreiecke.js`

Nicht anfassen: andere Spiele, `index.js`, `modules.js`, Faktoren, Tests, README, `drag.js`.

## Ausgangslage

Die Datei ist ein Stub via `createStub`. Registry und Modul-Metadaten existieren schon:

- id `sim-dreiecke`, Skala simultan, ages 3–12, mode mixed, KABC-Ref Dreiecke
- Faktoren: Ausdauer, Teil-Ganzes, räumliches Vorstellungsvermögen, visuell-motorische Koordination

## Kontrakt (wie `plan-geschichten.js`)

```
init(gs) / render(gs) / dispose(gs) / actions / scoring
instruction = { de, ru, en }
optional settingsSchema + registerModuleSettings
Klicks nur über G('name', …); Drag über data-zieh / data-ablage
```

Vorlage für Drag+Auswertung: `src/games/plan-geschichten.js`.
Drag-API: `src/core/drag.js` — Action **`verschiebe(gs, stueck, ziel)`**.
Rundenende: `countRound` + `resultScreen` aus `core/session.js`.
Zeitbalken: `bar` aus `core/shell.js` (CSS-Animation, **kein Re-Render pro Tick**).
Timer in `dispose` und bei Auswertung abräumen; `dragAufraeumen()` in `dispose`.
`gs.gd._ready = true` in init, `false` in dispose.

`scoring = 'count'`.

## Spielidee

Kind legt **einfarbige gleichschenklige Dreiecke** (zwei Seiten: hell/dunkel oder zwei Farben) so, dass sie eine **Vorlage** ergeben.

Nicht KABC-Originalitems. Keine freie Pixel-Geometrie.

**Raster:** Dreiecke sitzen auf einem festen Dreiecksgitter (z. B. gleichseitige Zellen). Jede Zelle hat eine Orientierung (▲/▼) und eine Farbe. Vorlage zeigt das Zielmuster. Vorrat enthält genau die nötigen Plättchen (plus optional 0–1 Ablenker auf hohen Stufen).

**Bedienung:** wie Geschichten — Antippen (Stück, dann Platz) oder Ziehen. Nochmal antippen legt zurück. Rotation: Action `drehe(gs, stueck)` per Knopf am aufgenommenen Stück oder Doppel-Aktion — 60°/180° je nach Gitter, dokumentiert im Kommentar. Occupied slot: Bewohner zurück in den Vorrat (nicht tauschen).

**Auswertung:** automatisch wenn alle Pflichtplätze belegt sind, oder bei Zeitablauf = ungelöst. Richtig = jede Zelle Orientierung+Farbe wie Vorlage. Feedback: ✅/❌, bei Fehler die Vorlage noch einmal zeigen. Danach nächste Aufgabe oder `resultScreen`.

**Niveau 1–5 (Alter 3–12):**

| Stufe | Zellen | Extra |
|---|---|---|
| 1 | 2–3 | keine Rotation nötig |
| 2 | 4 | evtl. eine Drehung |
| 3 | 6 | zwei Farben |
| 4 | 8 | Rotation nötig |
| 5 | 10 | Ablenker oder gespiegelte Vorlage |

Richtig → level++, falsch → level-- (Clamp 1–5), analog Geschichten.

**Item-Vorrat:** genug verschiedene Vorlagen, dass der Smoke-Test (≥20 unterscheidbare Aufgaben je Stufe, falls ihr eine Wiederholungssperre habt) nicht scheitert. Ohne Sperre: Generator, der aus kleinen Bausteinen würfelt, plus feste Startmuster. Keine zwei Lösungen, die gleich gut sind, wenn die Vorlage eindeutig ist.

**UI-Texte** komplett `{de,ru,en}` via `pick()`. Keine deutschen Wörter fest im Markup.

**Settings:** z. B. `sekProTeil` (Zeit je Plättchen), Schema wie Sudoku/Geschichten.

**instruction** erklärt Antippen + Ziehen + Drehen, dreisprachig.

## Qualität

- Kinder-UI: große Trefferflächen, kein Hover-only.
- Kein Punktestand/Niveau-Text mitten in der Aufgabe nötig; Anleitung gehört in `instruction`.
- Kommentare auf Deutsch, im Stil der anderen Module (warum, nicht was).
- Kein `createStub` mehr in dieser Datei.

## Fertig

`npm test` muss nicht zwingend grün sein, solange Integration Stubs noch ausnimmt — dein Modul darf aber nicht crashen, wenn smoke es lädt (`init`/`render`/`dispose`). Lokal prüfen:

```
node --input-type=module -e "
import * as m from './src/games/sim-dreiecke.js';
const gs = { gd:{}, score:0, total:0, rounds:0 };
m.init(gs);
if (!gs.gd._ready) throw new Error('ready');
const h = m.render(gs);
if (!h || /noch nicht umgesetzt|createStub/.test(h)) throw new Error('stub');
m.dispose(gs);
if (gs.gd._ready) throw new Error('dispose');
console.log('ok', m.scoring, Object.keys(m.actions));
"
```

Danach aufhören. Keine weiteren Dateien.
