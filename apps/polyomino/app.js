/**
 * Vielecke einsetzen (Gardner, Kapitel 12 „Polyomino“).
 * idee-db: 3
 *
 * Fünf vielseitige Figuren und fünf Platzhalter (Umrisse). Die Figuren werden
 * nach dem Klonen zufällig gedreht (0–360°); das Kind erkennt die Form und
 * zieht sie per Drag & Drop auf den passenden Umriss. Beim Loslassen richtet
 * sich die Figur „automatisch aus“: sie verschwindet, die Silhouette färbt
 * sich. Während des Ziehens folgt die Figur dem Zeiger.
 * Schwierigkeit = mehr Kanten.
 */
import { MiniApp } from '../_framework/framework.js';

const SCALE = 0.92;
const FARBEN = ['#FF6B6B', '#FFD93D', '#4D96FF', '#34D399', '#C084FC', '#FB923C'];

// Polygone als Punktlisten (0..80). level = Schwierigkeit (Kantenzahl).
const POLYGONE = [
  { id: 'dreieck',  kanten: 3,  level: 1, pts: [[0, 80], [28, 0], [80, 80]] },
  { id: 'quadrat',  kanten: 4,  level: 1, pts: [[0, 0], [80, 0], [80, 80], [0, 80]] },
  { id: 'rechteck', kanten: 4,  level: 1, pts: [[0, 0], [80, 0], [80, 42], [0, 42]] },
  { id: 'trapez',   kanten: 4,  level: 1, pts: [[16, 0], [64, 0], [80, 80], [0, 80]] },
  { id: 'raute',    kanten: 4,  level: 1, pts: [[40, 0], [80, 40], [40, 80], [0,40]] },
  { id: 'drachen',  kanten: 4,  level: 2, pts: [[40, 0], [80, 28], [40, 80], [0, 52]] },
  { id: 'pfeil',    kanten: 5,  level: 2, pts: [[0, 0], [52, 0], [80, 42], [30, 80], [0, 60]] },
  { id: 'sechseck', kanten: 6,  level: 3, pts: [[20, 0], [60, 0], [80, 30], [60, 80], [20, 80], [0, 30]] },
  { id: 'sechsL',   kanten: 6,  level: 3, pts: [[0, 0], [52, 0], [52, 30], [80, 30], [80, 80], [0, 80]] },
  { id: 'sieben',   kanten: 7,  level: 4, pts: [[40, 0], [80, 18], [72, 70], [30, 80], [0, 60], [0, 28], [20, 20]] },
  { id: 'achteck',  kanten: 8,  level: 4, pts: [[0, 0], [40, 0], [80, 0], [80, 40], [80, 80], [40, 80], [0, 80], [0, 40]] },
  { id: 'oktogon',  kanten: 8,  level: 5, pts: [[20, 0], [60, 0], [80, 20], [80, 60], [60, 80], [20, 80], [0, 60], [0, 20]] },
  { id: 'plus',     kanten: 12, level: 5, pts: [[30, 0], [50, 0], [50, 30], [80, 30], [80, 50], [50, 50], [50, 80], [30, 80], [30, 50], [0, 50], [0, 30], [30, 30]] },
];

/** Punkte um die Mitte (40,40) drehen. */
function rotDeg(pts, deg) {
  const rad = deg * Math.PI / 180, cx = 40, cy = 40;
  return pts.map(([x, y]) => [
    cx + (x - cx) * Math.cos(rad) - (y - cy) * Math.sin(rad),
    cy + (x - cx) * Math.sin(rad) + (y - cy) * Math.cos(rad),
  ]);
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

const PLATZ_POS = [[44, 36], [330, 26], [512, 100], [84, 208], [392, 214]];
const FIGUR_POS = [[70, 296], [286, 320], [474, 292], [150, 384], [416, 388]];
const MITTE = 40 * SCALE;   // Figur-Mitte für den Drag-Ghost

const app = new MiniApp({
  id: 'polyomino',
  icon: '🧩',
  titel: { de: 'Vielecke einsetzen', ru: 'Многоугольники', en: 'Fit the polygons' },
  anweisung: {
    de: 'Ziehe jede Figur auf ihren Umriss. Die Figuren sind gedreht – erkenne die Form.',
    ru: 'Перетащи каждую фигуру на её контур. Фигуры повёрнуты — узнай форму.',
    en: 'Drag each shape onto its outline. The shapes are rotated – recognise the form.'
  },
  hilfe: {
    de: 'Die farbige Figur mit Maus/Finger auf den passenden grauen Umriss ziehen; beim Loslassen richtet sie sich aus. Während des Ziehens folgt sie dem Zeiger. Höhere Stufen haben mehr Kanten.',
    ru: 'Перетащи цветную фигуру на нужный серый контур; при отпускании она выровняется. Во время перетаскивания фигура следует за пальцем. На высоких уровнях больше сторон.',
    en: 'Drag the coloured shape onto the matching grey outline; it aligns on release. While dragging it follows the pointer. Higher levels have more edges.'
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
      winkel: Math.floor(Math.random() * 360), gelegt: false,
    }));
    state._drag = null;
    state.gelegt = 0;
    state.fehler = 0;
    state.fertig = false;
  },

  render(state) {
    const platzhalter = state.paare.map(p => {
      const fill = p.gelegt ? (p.farbe + '66') : 'transparent';
      const dash = p.gelegt ? '' : ' stroke-dasharray="6 5"';
      return `<polygon points="${ptsStr(p.pts, p.platzPos[0], p.platzPos[1])}"
        fill="${fill}" stroke="#a9a4d8" stroke-width="2"${dash}/>`;
    }).join('');

    const figuren = state.paare.map((p, i) => {
      if (p.gelegt) return '';
      if (state._drag && state._drag.fi === i) {
        // Ghost folgt dem Zeiger
        const drawn = rotDeg(p.pts, p.winkel);
        return `<polygon points="${ptsStr(drawn, state._drag.x - MITTE, state._drag.y - MITTE)}"
          fill="${p.farbe}" stroke="#3a3560" stroke-width="2" opacity="0.9"/>`;
      }
      const drawn = rotDeg(p.pts, p.winkel);
      return `<polygon points="${ptsStr(drawn, p.figurPos[0], p.figurPos[1])}"
        fill="${p.farbe}" stroke="#3a3560" stroke-width="2"/>`;
    }).join('');

    return `<svg viewBox="0 0 600 470" xmlns="http://www.w3.org/2000/svg">
      ${platzhalter}${figuren}
    </svg>`;
  },

  _figurBei(x, y) {
    const s = app.state;
    for (let i = 0; i < s.paare.length; i++) {
      const p = s.paare[i];
      if (p.gelegt) continue;
      const drawn = rotDeg(p.pts, p.winkel)
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

  // Figur folgt dem Zeiger.
  onDrag(state, x0, y0, x, y, app) {
    const fi = state._drag?.fi ?? this._figurBei(x0, y0);
    if (fi === null || fi === undefined) return;
    state._drag = { fi, x, y };
    app.rerender();
  },

  // Loslassen: richtig → Figur verschwindet, Silhouette färbt sich.
  // Falsche Silhouette → Fehler zählen.
  onDrop(state, x0, y0, x1, y1, app) {
    const fi = state._drag?.fi ?? this._figurBei(x0, y0);
    const pi = this._platzBei(x1, y1);
    if (fi !== null && fi !== undefined && pi !== null) {
      if (state.paare[fi].id === state.paare[pi].id) {
        state.paare[fi].gelegt = true;
        state.paare[pi].gelegt = true;
        state.gelegt++;
        if (state.gelegt === state.paare.length) state.fertig = true;
      } else {
        state.fehler++;
      }
    }
    state._drag = null;
    app.rerender();
  },

  evaluate(state) {
    if (state.fertig) return { fertig: true, wert: `${state.gelegt}/${state.paare.length}` };
    return null;
  },
  statusHtml(state) {
    return `<div class="ma-result">🧩 ${state.gelegt}/${state.paare.length} · ❌ ${state.fehler}</div>`;
  }
});

export default app;
export function mount(root) { app.mount(root); }
