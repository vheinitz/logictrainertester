# Mini-App-Framework (`apps/_framework/`)

Jede Idee aus der Ideen-DB (`tools/ideen-app/`) kann eine Mini-App werden.
Alle Mini-Apps liegen unter `apps/` (ein Verzeichnis je App) und nutzen das
gemeinsame Framework, damit Styles und Bausteine nicht dupliziert werden.

## Bausteine

| Baustein | Wo | Was |
|---|---|---|
| Shell | `framework.js` (`MiniApp`) | Titel, Anweisungsbereich, Hilfe (aufklappbar), Einstellungen |
| Canvas | `framework.js` | Zeichenfläche (SVG oder HTML), Sprites, Zeiger-Normalisierung |
| Interaktion | `framework.js` | Tippen (tap) und Ziehen (drag) über Pointer-Events, 8-px-Schwelle |
| Einstellungen | `framework.js` | Schema-basiert, je App + global, in localStorage || Auswertung | `framework.js` | score/Züge + Ergebnisseite (`resultScreen`) |
| Sprites | `svg.*` | kleine SVG-Helfer (rect, circle, text, group) |
| Styles | `framework.css` | geteilte Optik |

## Vertrag einer App

```js
import { MiniApp } from '../_framework/framework.js';

const app = new MiniApp({
  id: '…',
  icon: '…',
  titel: { de, ru, en },
  anweisung: { de, ru, en },          // Kurzanweisung, oben aufklappbar
  hilfe:    { de, ru, en },           // längere Hilfe
  settingsSchema: {                   // je App
    scheiben: { def:3, min:3, max:6, step:1, label:{de,ru,en} }
  },
  auswertung: 'zuege' | 'punkte',

  init(state, app) { … },             // Zustand aufbauen
  render(state, app) { return html/svg; },
  dispose(state) { … },               // optional
  actions: { name(state, …args, app) { … } },   // Aufruf: app.dispatch('name', …)
  onTap(state, x, y, app) { … },      // x,y in viewBox-Koordinaten
  onDrag(state, x0,y0, x1,y1, app) { … },
  onDrop(state, x0,y0, x1,y1, app) { … },
  evaluate(state, app) { … },         // { fertig, optimal, text, wert } oder { text }
});
app.mount(rootEl);                    // rootEl = Container-DOM-Knoten
```

Koordinaten von `onTap`/`onDrop` sind bereits in **viewBox-Einheiten**, wenn
im Canvas eine `<svg viewBox="…">` liegt — die Umrechnung übernimmt das
Framework.

## Einbinden

Eigenständig: `apps/<name>/index.html` lädt `framework.css` + `app.bundle.js`.
Das Bundle wird erzeugt, damit die App **von `file://` aus** läuft (ES-Module
sind dort blockiert — derselbe Grund wie beim Haupt-Bundle):

```bash
npm run build:miniapps   # bündelt jede App zu apps/<name>/app.bundle.js
```

Mehrere Apps in einer Seite: jede `app.mount(container)` in ihren eigenen
Container — Einstellungen je App sind getrennt, globale (Sprache, Bildgröße,
Ton) werden geteilt.

## Sprache

Wie die Haupt-App sind die Mini-Apps **de/ru/en**-fähig und für weitere
Sprachen erweiterbar:

- Alle Texte als `{ de, ru, en }`-Objekte; `pick()` wählt die aktive Sprache.
- Die aktive Sprache ist eine **globale Einstellung** (⚙️ → „Sprache“) und
  wirkt sofort auf alle Mini-Apps einer Seite.
- Neue Sprache ergänzen: Schlüssel in jedem Textobjekt + in die
  `options`-Liste der globalen Einstellung `sprache` eintragen.

## Neue App anlegen

1. `apps/<name>/` anlegen.
2. `index.html` kopieren (Titel anpassen).
3. `app.js`: `new MiniApp({…})` mit `init/render/actions/evaluate`.
4. Testen: `node --input-type=module` + jsdom (siehe `test/miniapp-smoke.mjs`).

## Beispiel

`apps/hanoi/` — Türme von Hanoi (aus Ideen-DB Beitrag 1, Gardner).
