/**
 * Polyomino – Figuren richtig einsetzen (Gardner, Kapitel 12 „Polyomino“).
 * idee-db: 3
 *
 * Fünf vielseitige Figuren und fünf Platzhalter (nicht in Reihen/Spalten).
 * Symmetrische Figuren passen in jeder Drehung, unsymmetrische nur richtig
 * gedreht. Schwierigkeit = mehr Kanten (komplexere Figuren).
 */
import { MiniApp, svg } from '../_framework/framework.js';

const CELL = 34;
const FARBEN = ['#FF6B6B', '#FFD93D', '#4D96FF', '#34D399', '#C084FC', '#FB923C'];

// Polyominos: cells = Einheitsquadrate [x,y], level = Schwierigkeitsstufe.
const SHAPES = [
  { id: 'domino',   level: 1, cells: [[0,0],[1,0]] },
  { id: 'triI',     level: 1, cells: [[0,0],[1,0],[2,0]] },
  { id: 'triL',     level: 1, cells: [[0,0],[1,0],[0,1]] },
  { id: 'quadrat',  level: 1, cells: [[0,0],[1,0],[0,1],[1,1]] },
  { id: 'tetroI',   level: 1, cells: [[0,0],[1,0],[2,0],[3,0]] },
  { id: 'tetroL',   level: 2, cells: [[0,0],[1,0],[2,0],[0,1]] },
  { id: 'tetroJ',   level: 2, cells: [[0,0],[1,0],[2,0],[2,1]] },
  { id: 'tetroT',   level: 2, cells: [[0,0],[1,0],[2,0],[1,1]] },
  { id: 'tetroS',   level: 3, cells: [[1,0],[2,0],[0,1],[1,1]] },
  { id: 'tetroZ',   level: 3, cells: [[0,0],[1,0],[1,1],[2,1]] },
  { id: 'pentoP',   level: 3, cells: [[0,0],[1,0],[2,0],[0,1],[1,1]] },
  { id: 'pentoX',   level: 4, cells: [[1,0],[0,1],[1,1],[2,1],[1,2]] },
  { id: 'pentoU',   level: 4, cells: [[0,0],[1,0],[0,1],[0,2],[1,2]] },
  { id: 'pentoT',   level: 4, cells: [[0,0],[1,0],[2,0],[1,1],[1,2]] },
  { id: 'pentoW',   level: 5, cells: [[0,0],[1,0],[1,1],[2,1],[2,2]] },
  { id: 'pentoZ',   level: 5, cells: [[0,0],[1,0],[2,0],[2,1],[3,1]] },
  { id: 'pentoF',   level: 5, cells: [[0,1],[1,0],[1,1],[1,2],[2,1]] },
];

function rot90(cells) {
  return cells.map(([x, y]) => [-y, x]);
}
function rotCells(cells, n) {
  let c = cells.map(p => [...p]);
  for (let i = 0; i < ((n % 4) + 4) % 4; i++) c = rot90(c);
  const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1]));
  return c.map(([x, y]) => [x - mx, y - my]);
}
function norm(cells) {
  const mx = Math.min(...cells.map(p => p[0])), my = Math.min(...cells.map(p => p[1]));
  return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
function same(a, b) {
  return JSON.stringify(norm(a)) === JSON.stringify(norm(b));
}
function bounds(cells) {
  const xs = cells.map(p => p[0]), ys = cells.map(p => p[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
}
function shapeSvg(cells, fill, dx, dy, opts = {}) {
  return cells.map(([x, y]) =>
    svg.rect(dx + x * CELL, dy + y * CELL, CELL - 3, CELL - 3, fill, {
      rx: 5, stroke: opts.stroke || '#3a3560', 'stroke-width': 1.5,
    })
  ).join('');
}

// 6 verstreute Platzhalter-Positionen (nicht in Reihe/Spalte)
const SLOT_POS = [[40, 36], [330, 26], [512, 96], [84, 210], [392, 216], [518, 286]];
const TRAY_Y = 350;

const app = new MiniApp({
  id: 'polyomino',
  icon: '🧩',
  titel: { de: 'Polyomino', ru: 'Полиомино', en: 'Polyomino' },
  anweisung: {
    de: 'Lege jede Figur auf ihren Platzhalter. Unsymmetrische Figuren müssen richtig gedreht sein – tippe die Figur noch einmal an, um sie zu drehen.',
    ru: 'Положи каждую фигуру на её место. Несимметричные фигуры нужно правильно повернуть — нажми фигуру ещё раз, чтобы повернуть.',
    en: 'Place each shape on its placeholder. Asymmetric shapes must be rotated correctly – tap the shape again to rotate it.'
  },
  hilfe: {
    de: 'Eine Figur antippen wählt sie aus, nochmal antippen dreht sie. Dann den passenden Platzhalter antippen – oder die Figur direkt dorthin ziehen. Passende Figuren sind grau angedeutet. Höhere Stufen haben Figuren mit mehr Kanten.',
    ru: 'Нажми фигуру, чтобы выбрать, ещё раз — чтобы повернуть. Затем коснись нужного места или перетащи фигуру. На высоких уровнях фигуры с бо́льшим числом сторон.',
    en: 'Tap a shape to select it, tap again to rotate. Then tap the matching placeholder – or drag the shape there. Higher levels use shapes with more edges.'
  },
  settingsSchema: {
    stufe: { def: 1, min: 1, max: 5, step: 1, label: { de: 'Stufe', ru: 'Уровень', en: 'Level' } }
  },
  auswertung: 'punkte',
  onSettingsChange(app) { app.reset(); },

  init(state, app) {
    state.stufe = app.get('stufe');
    state.pool = SHAPES.filter(s => s.level <= state.stufe);
    const n = 5;
    const gewaehlt = [];
    const kopie = [...state.pool];
    while (gewaehlt.length < n && kopie.length) {
      const i = Math.floor(Math.random() * kopie.length);
      gewaehlt.push(kopie.splice(i, 1)[0]);
    }
    state.formen = gewaehlt.map((sh, i) => ({
      id: sh.id, cells: sh.cells, farbe: FARBEN[i % FARBEN.length],
      rot: Math.floor(Math.random() * 4), placed: false, slotId: null,
    }));
    // Platzhalter: Zielzellen in zufälliger Drehung, verstreut.
    state.slots = state.formen.map((f, i) => ({
      id: 'slot' + i, formId: f.id, pos: SLOT_POS[i],
      cells: rotCells(f.cells, Math.floor(Math.random() * 4)), gefuellt: false,
    }));
    state.gewaehlt = null;
    state.gelegt = 0;
    state.fertig = false;
  },

  render(state, app) {
    const slots = state.slots.map(s => {
      const farbe = s.gefuellt ? (state.formen.find(f => f.slotId === s.id)?.farbe || '#bbb') : 'transparent';
      const stroke = s.gefuellt ? 'none' : '#a9a4d8';
      const dash = s.gefuellt ? {} : { 'stroke-dasharray': '5 4' };
      return shapeSvg(s.cells, farbe, s.pos[0], s.pos[1], { stroke, ...dash });
    }).join('');

    const formen = state.formen.map((f, i) => {
      if (f.placed) return '';
      const x = 60 + i * 100;
      const gew = state.gewaehlt === i;
      const extra = gew ? { stroke: '#5b4fcf', 'stroke-width': 4 } : {};
      return svg.group(shapeSvg(rotCells(f.cells, f.rot), f.farbe, x, TRAY_Y, extra), {});
    }).join('');

    const hinweis = state.gewaehlt !== null
      ? svg.text(24, 30, '↻', { 'font-size': 34, fill: '#5b4fcf' })
      : '';

    return `<svg viewBox="0 0 600 470" xmlns="http://www.w3.org/2000/svg">
      ${hinweis}${slots}${formen}
    </svg>`;
  },

  _formBei(x, y) {
    const s = app.state;
    for (let i = 0; i < s.formen.length; i++) {
      const f = s.formen[i];
      if (f.placed) continue;
      const x0 = 60 + i * 100;
      const [minx, maxx, miny, maxy] = bounds(rotCells(f.cells, f.rot));
      if (x >= x0 + minx * CELL && x <= x0 + (maxx + 1) * CELL &&
          y >= TRAY_Y + miny * CELL && y <= TRAY_Y + (maxy + 1) * CELL) return i;
    }
    return null;
  },

  _slotBei(x, y) {
    const s = app.state;
    for (let i = 0; i < s.slots.length; i++) {
      const sl = s.slots[i];
      if (sl.gefuellt) continue;
      const [minx, maxx, miny, maxy] = bounds(sl.cells);
      if (x >= sl.pos[0] + minx * CELL && x <= sl.pos[0] + (maxx + 1) * CELL &&
          y >= sl.pos[1] + miny * CELL && y <= sl.pos[1] + (maxy + 1) * CELL) return i;
    }
    return null;
  },

  onTap(state, x, y, app) {
    const fi = this._formBei(x, y);
    if (fi !== null) {
      if (state.gewaehlt === fi) {
        // nochmal antippen = drehen
        state.formen[fi].rot = (state.formen[fi].rot + 1) % 4;
      } else {
        state.gewaehlt = fi;
      }
      app.rerender();
      return;
    }
    const si = this._slotBei(x, y);
    if (si !== null && state.gewaehlt !== null) {
      this._legen(app, state.gewaehlt, si);
    } else {
      state.gewaehlt = null;
      app.rerender();
    }
  },

  onDrop(state, x0, y0, x1, y1, app) {
    const fi = this._formBei(x0, y0);
    const si = this._slotBei(x1, y1);
    if (fi !== null && si !== null) this._legen(app, fi, si);
    else { state.gewaehlt = null; app.rerender(); }
  },

  _legen(app, fi, si) {
    const s = app.state;
    const form = s.formen[fi];
    const slot = s.slots[si];
    if (same(rotCells(form.cells, form.rot), slot.cells)) {
      form.placed = true;
      form.slotId = slot.id;
      slot.gefuellt = true;
      s.gelegt++;
      s.gewaehlt = null;
      if (s.gelegt === s.formen.length) s.fertig = true;
    } else {
      // falsch gedreht / falscher Platzhalter: sanft zurück
      s.gewaehlt = null;
    }
    app.rerender();
  },

  evaluate(state) {
    if (state.fertig) {
      return { fertig: true, wert: `${state.gelegt}/${state.formen.length}` };
    }
    return null;
  },
  statusHtml(state) {
    return `<div class="ma-result">🧩 ${state.gelegt}/${state.formen.length}</div>`;
  }
});

export default app;
export function mount(root) { app.mount(root); }
