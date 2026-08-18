/**
 * Polyomino → Vielecke einsetzen (Gardner, Kapitel 12 „Polyomino“).
 * idee-db: 3
 *
 * Fünf vielseitige Figuren (richtige Polygone, keine Tetrisblöcke) und fünf
 * Platzhalter. Symmetrische Figuren passen in jeder 90°-Drehung, unsymmetrische
 * nur richtig gedreht. Schwierigkeit = mehr Kanten.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const SCALE = 0.92;          // 0..80-Punkte → ~74px
const FARBEN = ['#FF6B6B', '#FFD93D', '#4D96FF', '#34D399', '#C084FC', '#FB923C'];

// Polygone als Punktlisten (0..80). level = Schwierigkeit (Kantenzahl).
const POLYGONE = [
  { id: 'dreieck',  kanten: 3,  level: 1, pts: [[0, 80], [28, 0], [80, 80]] },
  { id: 'quadrat',  kanten: 4,  level: 1, pts: [[0, 0], [80, 0], [80, 80], [0, 80]] },
  { id: 'rechteck', kanten: 4,  level: 1, pts: [[0, 0], [80, 0], [80, 42], [0, 42]] },
  { id: 'trapez',   kanten: 4,  level: 1, pts: [[16, 0], [64, 0], [80, 80], [0, 80]] },
  { id: 'raute',    kanten: 4,  level: 1, pts: [[40, 0], [80, 40], [40, 80], [0, 40]] },
  { id: 'drachen',  kanten: 4,  level: 2, pts: [[40, 0], [80, 28], [40, 80], [0, 52]] },
  { id: 'pfeil',    kanten: 5,  level: 2, pts: [[0, 0], [52, 0], [80, 42], [30, 80], [0, 60]] },
  { id: 'sechseck', kanten: 6,  level: 3, pts: [[20, 0], [60, 0], [80, 30], [60, 80], [20, 80], [0, 30]] },
  { id: 'sechsL',   kanten: 6,  level: 3, pts: [[0, 0], [52, 0], [52, 30], [80, 30], [80, 80], [0, 80]] },
  { id: 'sieben',   kanten: 7,  level: 4, pts: [[40, 0], [80, 18], [72, 70], [30, 80], [0, 60], [0, 28], [20, 20]] },
  { id: 'achteck',  kanten: 8,  level: 4, pts: [[0, 0], [40, 0], [80, 0], [80, 40], [80, 80], [40, 80], [0, 80], [0, 40]] },
  { id: 'oktogon',  kanten: 8,  level: 5, pts: [[20, 0], [60, 0], [80, 20], [80, 60], [60, 80], [20, 80], [0, 60], [0, 20]] },
  { id: 'plus',     kanten: 12, level: 5, pts: [[30, 0], [50, 0], [50, 30], [80, 30], [80, 50], [50, 50], [50, 80], [30, 80], [30, 50], [0, 50], [0, 30], [30, 30]] },
];

function rotPts(pts, n) {
  let p = pts.map(q => [...q]);
  for (let i = 0; i < ((n % 4) + 4) % 4; i++) p = p.map(([x, y]) => [-y, x]);
  const mx = Math.min(...p.map(q => q[0])), my = Math.min(...p.map(q => q[1]));
  return p.map(([x, y]) => [x - mx, y - my]);
}
function norm(pts) {
  return JSON.stringify(pts.map(q => [...q]).sort((a, b) => a[0] - b[0] || a[1] - b[1]));
}
function ptsStr(pts, dx, dy, scale = SCALE) {
  return pts.map(([x, y]) => `${Math.round(dx + x * scale)},${Math.round(dy + y * scale)}`).join(' ');
}
function pointIn(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Verstreute Positionen (nicht in Reihe/Spalte)
const PLATZ_POS = [[44, 36], [330, 26], [512, 100], [84, 208], [392, 214]];
const FIGUR_POS = [[70, 296], [286, 320], [474, 292], [150, 384], [416, 388]];

const app = new MiniApp({
  id: 'polyomino',
  icon: '🧩',
  titel: { de: 'Vielecke einsetzen', ru: 'Многоугольники', en: 'Fit the polygons' },
  anweisung: {
    de: 'Lege jede Figur auf ihren Platzhalter. Unsymmetrische Figuren müssen richtig gedreht sein – tippe die Figur noch einmal an, um sie zu drehen.',
    ru: 'Положи каждую фигуру на её место. Несимметричные фигуры нужно правильно повернуть — нажми фигуру ещё раз, чтобы повернуть.',
    en: 'Place each shape on its placeholder. Asymmetric shapes must be rotated correctly – tap the shape again to rotate it.'
  },
  hilfe: {
    de: 'Figur antippen = wählen, nochmal = um 90° drehen. Dann den passenden Umriss antippen oder die Figur dorthin ziehen. Symmetrische Figuren passen in jeder Drehung. Höhere Stufen haben mehr Kanten.',
    ru: 'Нажми фигуру — выбрать, ещё раз — повернуть на 90°. Затем коснись нужного контура или перетащи фигуру. Симметричные фигуры подходят в любом повороте. На высоких уровнях больше сторон.',
    en: 'Tap a shape to select, tap again to rotate 90°. Then tap the matching outline or drag the shape there. Symmetric shapes fit in any rotation. Higher levels have more edges.'
  },
  settingsSchema: {
    stufe: { def: 1, min: 1, max: 5, step: 1, label: { de: 'Stufe', ru: 'Уровень', en: 'Level' } }
  },
  auswertung: 'punkte',
  onSettingsChange(app) { app.reset(); },

  init(state, app) {
    state.stufe = app.get('stufe');
    const pool = POLYGONE.filter(p => p.level <= state.stufe);
    const gewaehlt = [];
    const kopie = [...pool];
    while (gewaehlt.length < 5 && kopie.length) {
      const i = Math.floor(Math.random() * kopie.length);
      gewaehlt.push(kopie.splice(i, 1)[0]);
    }
    state.paare = gewaehlt.map((p, i) => ({
      id: p.id, kanten: p.kanten, pts: p.pts, farbe: FARBEN[i % FARBEN.length],
      platzPos: PLATZ_POS[i], figurPos: FIGUR_POS[i],
      figurRot: Math.floor(Math.random() * 4), gelegt: false,
    }));
    state.gewaehlt = null;
    state.gelegt = 0;
    state.fertig = false;
  },

  render(state, app) {
    const platzhalter = state.paare.map(p => {
      const stroke = p.gelegt ? '#bbb' : '#a9a4d8';
      const dash = p.gelegt ? '' : ' stroke-dasharray="6 5"';
      const fill = p.gelegt ? (p.farbe + '55') : 'transparent';
      return `<polygon points="${ptsStr(p.pts, p.platzPos[0], p.platzPos[1])}"
        fill="${fill}" stroke="${stroke}" stroke-width="2"${dash}/>`;
    }).join('');

    const figuren = state.paare.map((p, i) => {
      if (p.gelegt) return '';
      const gew = state.gewaehlt === i;
      const drawn = rotPts(p.pts, p.figurRot);
      return `<polygon points="${ptsStr(drawn, p.figurPos[0], p.figurPos[1])}"
        fill="${p.farbe}" stroke="${gew ? '#5b4fcf' : '#3a3560'}"
        stroke-width="${gew ? 5 : 2}"/>`;
    }).join('');

    const hinweis = state.gewaehlt !== null
      ? svg.text(24, 30, '↻', { 'font-size': 34, fill: '#5b4fcf' })
      : '';

    return `<svg viewBox="0 0 600 470" xmlns="http://www.w3.org/2000/svg">
      ${hinweis}${platzhalter}${figuren}
    </svg>`;
  },

  _figurBei(x, y) {
    const s = app.state;
    for (let i = 0; i < s.paare.length; i++) {
      const p = s.paare[i];
      if (p.gelegt) continue;
      const drawn = rotPts(p.pts, p.figurRot)
        .map(([a, b]) => [p.figurPos[0] + a * SCALE, p.figurPos[1] + b * SCALE]);
      if (pointIn(x, y, drawn)) return i;
    }
    return null;
  },

  _platzBei(x, y) {
    const s = app.state;
    for (let i = 0; i < s.paare.length; i++) {
      const p = s.paare[i];
      if (p.gelegt) continue;
      const drawn = p.pts.map(([a, b]) => [p.platzPos[0] + a * SCALE, p.platzPos[1] + b * SCALE]);
      if (pointIn(x, y, drawn)) return i;
    }
    return null;
  },

  onTap(state, x, y, app) {
    const fi = this._figurBei(x, y);
    if (fi !== null) {
      if (state.gewaehlt === fi) state.paare[fi].figurRot = (state.paare[fi].figurRot + 1) % 4;
      else state.gewaehlt = fi;
      app.rerender();
      return;
    }
    const pi = this._platzBei(x, y);
    if (pi !== null && state.gewaehlt !== null) this._legen(app, state.gewaehlt, pi);
    else { state.gewaehlt = null; app.rerender(); }
  },

  onDrop(state, x0, y0, x1, y1, app) {
    const fi = this._figurBei(x0, y0);
    const pi = this._platzBei(x1, y1);
    if (fi !== null && pi !== null) this._legen(app, fi, pi);
    else { state.gewaehlt = null; app.rerender(); }
  },

  _legen(app, fi, pi) {
    const s = app.state;
    const figur = s.paare[fi], platz = s.paare[pi];
    if (figur.id === platz.id &&
        norm(rotPts(figur.pts, figur.figurRot)) === norm(platz.pts)) {
      figur.gelegt = true;
      platz.gelegt = true;
      s.gelegt++;
      s.gewaehlt = null;
      if (s.gelegt === s.paare.length) s.fertig = true;
    } else {
      s.gewaehlt = null;
    }
    app.rerender();
  },

  evaluate(state) {
    if (state.fertig) return { fertig: true, wert: `${state.gelegt}/${state.paare.length}` };
    return null;
  },
  statusHtml(state) {
    return `<div class="ma-result">🧩 ${state.gelegt}/${state.paare.length}</div>`;
  }
});

export default app;
export function mount(root) { app.mount(root); }
