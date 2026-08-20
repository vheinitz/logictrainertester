/**
 * Flächen zusammensetzen – Kind teilt selbst (Karo-Papier).
 *
 * Zufällige zusammenhängende Figur auf einem Einheitsquadrat-Raster (0/45/90°).
 * Das Kind teilt von jedem Gitter-Schnittpunkt aus, zieht Grundform-Symbole
 * (in Form-Farbe) auf die Teilflächen und rechnet A1, A2, … und die Summe.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const PI = Math.PI;
const UNIT = 42;
const OFF = 30;

const FORMEN = {
  rechteck:    { name: { de: 'Rechteck', ru: 'Прямоугольник', en: 'Rectangle' }, formel: 'H·L', farbe: '#4D96FF' },
  dreieck:     { name: { de: 'Dreieck', ru: 'Треугольник', en: 'Triangle' }, formel: '½·g·h', farbe: '#FF8A5C' },
  kreis:       { name: { de: 'Kreis', ru: 'Круг', en: 'Circle' }, formel: 'π·r²', farbe: '#C084FC' },
  halbkreis:   { name: { de: 'Halbkreis', ru: 'Полукруг', en: 'Half circle' }, formel: '½·π·r²', farbe: '#34D399' },
  viertelkreis:{ name: { de: 'Viertelkreis', ru: 'Четверть круга', en: 'Quarter circle' }, formel: '¼·π·r²', farbe: '#FB923C' },
};

function rand(n) { return Math.floor(Math.random() * n); }
function key(p) { return p.join(','); }

/** Zufällige zusammenhängende Figur (Histogramm + 45°-Schrägen). */
function genShape() {
  const W = 3 + rand(3), H = 3 + rand(3);
  const h = Array.from({ length: W }, () => 1 + rand(H));
  const cells = new Set();
  for (let c = 0; c < W; c++) for (let y = 0; y < h[c]; y++) cells.add(c + ',' + y);

  const edges = [];
  for (const k of cells) {
    const [c, y] = k.split(',').map(Number);
    if (!cells.has(c + ',' + (y + 1))) edges.push({ f: [c, y + 1], t: [c + 1, y + 1] });
    if (!cells.has(c + ',' + (y - 1))) edges.push({ f: [c + 1, y], t: [c, y] });
    if (!cells.has((c - 1) + ',' + y)) edges.push({ f: [c, y], t: [c, y + 1] });
    if (!cells.has((c + 1) + ',' + y)) edges.push({ f: [c + 1, y + 1], t: [c + 1, y] });
  }
  const byStart = new Map(edges.map(e => [key(e.f), e]));
  const start = edges[0].f, loop = [];
  let cur = start; const seen = new Set();
  while (true) {
    loop.push(cur);
    const e = byStart.get(key(cur));
    if (!e) break;
    cur = e.t;
    if (key(cur) === key(start) || seen.has(key(cur))) break;
    seen.add(key(cur));
  }
  loop.reverse();

  // 45°-Schrägen an konvexen Ecken
  const chamfer = new Set();
  for (let i = 0; i < loop.length; i++) {
    const a = loop[(i + loop.length - 1) % loop.length], b = loop[i], c = loop[(i + 1) % loop.length];
    const v1 = [b[0] - a[0], b[1] - a[1]], v2 = [c[0] - b[0], c[1] - b[1]];
    const kreuz = v1[0] * v2[1] - v1[1] * v2[0];
    if (kreuz > 0 && Math.abs(v1[0]) + Math.abs(v1[1]) === 1 && Math.abs(v2[0]) + Math.abs(v2[1]) === 1 && rand(3) === 0) chamfer.add(i);
  }
  const punkte = loop.filter((_, i) => !chamfer.has(i));
  return { punkte, flaeche: shoelace(punkte), W, H };
}

function shoelace(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Liegt P (Gitterpunkt) echt auf der Kante A–B? */
function onSeg(P, A, B) {
  const cross = (P[0] - A[0]) * (B[1] - A[1]) - (P[1] - A[1]) * (B[0] - A[0]);
  if (cross !== 0) return false;
  const dx = B[0] - A[0], dy = B[1] - A[1];
  const t = dx !== 0 ? (P[0] - A[0]) / dx : (dy !== 0 ? (P[1] - A[1]) / dy : 0);
  return t > 0 && t < 1;
}

/** P in die Umrisslinie einsetzen (auf Kante) oder Index liefern. */
function insertPoint(verts, P) {
  const idx = verts.findIndex(v => v[0] === P[0] && v[1] === P[1]);
  if (idx >= 0) return { verts, idx };
  for (let i = 0; i < verts.length; i++) {
    if (onSeg(P, verts[i], verts[(i + 1) % verts.length])) {
      const nv = [...verts.slice(0, i + 1), P, ...verts.slice(i + 1)];
      return { verts: nv, idx: i + 1 };
    }
  }
  return null;
}

/** Kollineare Punkte entfernen. */
function simplify(verts) {
  const out = [];
  for (let i = 0; i < verts.length; i++) {
    const a = verts[(i + verts.length - 1) % verts.length], b = verts[i], c = verts[(i + 1) % verts.length];
    const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (cross !== 0) out.push(b);
  }
  return out;
}

/** Ist ein 4-Punkt-Polygon ein achsenparalleles Rechteck? */
function isRect(verts) {
  if (verts.length !== 4) return false;
  for (let i = 0; i < 4; i++) {
    const a = verts[i], b = verts[(i + 1) % 4];
    if (a[0] !== b[0] && a[1] !== b[1]) return false;
  }
  return true;
}

function echteForm(verts) {
  if (verts.length === 3) return 'dreieck';
  if (verts.length === 4 && isRect(verts)) return 'rechteck';
  return null;   // keine Basisform → weiter teilen
}

function formPasst(formDerFlaeche, symbol) {
  if (formDerFlaeche === null) return false;
  if (symbol === formDerFlaeche) return true;
  if (symbol === 'kreis') return ['kreis', 'halbkreis', 'viertelkreis'].includes(formDerFlaeche);
  return false;
}

function formIcon(form) {
  const farbe = FORMEN[form].farbe, s = 24;
  if (form === 'rechteck') return `<svg width="${s}" height="${s}" viewBox="0 0 22 22"><rect x="2" y="5" width="18" height="12" fill="${farbe}" stroke="#3a3560" stroke-width="1.5"/></svg>`;
  if (form === 'dreieck') return `<svg width="${s}" height="${s}" viewBox="0 0 22 22"><polygon points="11,2 21,19 1,19" fill="${farbe}" stroke="#3a3560" stroke-width="1.5"/></svg>`;
  if (form === 'kreis') return `<svg width="${s}" height="${s}" viewBox="0 0 22 22"><circle cx="11" cy="11" r="9" fill="${farbe}" stroke="#3a3560" stroke-width="1.5"/></svg>`;
  if (form === 'halbkreis') return `<svg width="${s}" height="${s}" viewBox="0 0 22 22"><path d="M2 11 A9 9 0 0 1 20 11 Z" fill="${farbe}" stroke="#3a3560" stroke-width="1.5"/></svg>`;
  if (form === 'viertelkreis') return `<svg width="${s}" height="${s}" viewBox="0 0 22 22"><path d="M11 2 A9 9 0 0 1 20 11 L11 11 Z" fill="${farbe}" stroke="#3a3560" stroke-width="1.5"/></svg>`;
}

const app = new MiniApp({
  id: 'flaechen',
  icon: '📐',
  titel: { de: 'Flächen selbst teilen', ru: 'Площадь фигур', en: 'Split the area yourself' },
  anweisung: {
    de: 'Teile die Figur auf dem Raster, ziehe die Form-Symbole auf die Teilflächen und rechne. π ≈ 3,14.',
    ru: 'Раздели фигуру по сетке, перетащи символы форм и вычисли. π ≈ 3,14.',
    en: 'Split the figure on the grid, drag the shape symbols onto the parts and compute. π ≈ 3.14.'
  },
  hilfe: {
    de: '1) Einen Gitter-Schnittpunkt antippen, dann einen zweiten → Teillinie. 2) Symbol auf die Teilfläche ziehen (nur die richtige Form wird angenommen). 3) Maße und Fläche je Teil eintragen, unten die Summe.',
    ru: '1) Коснись узла сетки, затем второго — разрез. 2) Перетащи символ (принимается только верная форма). 3) Введи размеры и площадь, внизу сумма.',
    en: '1) Tap a grid intersection, then another → cut. 2) Drag a symbol (only the correct shape is accepted). 3) Enter dimensions and area, below the sum.'
  },
  settingsSchema: {},
  auswertung: 'punkte',

  init(state, app) {
    state.shape = genShape();
    state.gebiete = [{ punkte: state.shape.punkte.slice(), form: null, name: 'A1' }];
    state.gewaehlt = null;          // erster Gitterpunkt
    state.gewaehltesGebiet = 0;
    state.gewaehltesSymbol = null;
    state.eingaben = {};
    state.fertig = false;
    state.richtig = 0;
    state.fehler = 0;
  },

  render(state, app) {
    return `<div style="display:flex;flex-direction:column;gap:.5rem">
      ${this._canvas(state)}
      ${state.fertig ? this._ergebnis(state) : this._symbolleiste(state)}
      ${this._liste(state)}
    </div>`;
  },

  _canvas(state) {
    const S = UNIT, O = OFF;
    const xs = state.shape.punkte.map(p => p[0]), ys = state.shape.punkte.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const w = (maxX + 1) * S + O * 2, h = (maxY + 1) * S + O * 2;

    // Karo-Papier
    let grid = '';
    for (let gx = 0; gx <= maxX + 1; gx++) grid += `<line x1="${gx * S + O}" y1="${O}" x2="${gx * S + O}" y2="${(maxY + 1) * S + O}" stroke="#e5e3f2" stroke-width="1"/>`;
    for (let gy = 0; gy <= maxY + 1; gy++) grid += `<line x1="${O}" y1="${gy * S + O}" x2="${(maxX + 1) * S + O}" y2="${gy * S + O}" stroke="#e5e3f2" stroke-width="1"/>`;

    const teile = state.gebiete.map((g, gi) => {
      const fill = g.form ? FORMEN[g.form].farbe + '99' : '#ffffff';
      const pts = g.punkte.map(p => `${p[0] * S + O},${p[1] * S + O}`).join(' ');
      return `<polygon points="${pts}" fill="${fill}" stroke="#3a3560" stroke-width="2"/>`;
    }).join('');

    // gewählte Gitterpunkte hervorheben (klein, dezent)
    const mark = state.gewaehlt
      ? `<circle cx="${state.gewaehlt[0] * S + O}" cy="${state.gewaehlt[1] * S + O}" r="5" fill="#5b4fcf" stroke="#fff" stroke-width="2"/>`
      : '';

    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
        style="background:#fdfdff;border:1px solid #ddd;border-radius:8px;touch-action:none">
      ${grid}${teile}${mark}
    </svg>`;
  },

  _symbolleiste(state) {
    const symbole = Object.entries(FORMEN).map(([k, f]) =>
      `<button type="button" class="ma-btn" draggable="true" title="${f.name.de}"
        onclick="window.__flaech_sym('${k}')"
        ondragstart="window.__flaech_drag='${k}';event.dataTransfer.setData('text/plain','${k}')"
        style="display:flex;align-items:center;gap:6px;border-color:${f.farbe};padding:.3rem .6rem">
        ${formIcon(k)}<span style="font-size:.8em">${f.name.de}</span>
      </button>`).join('');
    return `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">${symbole}</div>`;
  },

  _liste(state) {
    const zeilen = state.gebiete.map(g => {
      const e = state.eingaben[g.name] || {};
      const formel = g.form ? FORMEN[g.form].formel : '?';
      const farbe = g.form ? FORMEN[g.form].farbe : '#999';
      return `<div style="display:flex;align-items:center;gap:6px;font-size:.95em;margin:.2rem 0">
        <b style="min-width:2.4ch">${g.name}</b>
        <span style="color:${farbe}">${g.form ? FORMEN[g.form].name.de : '—'}</span>
        <span>= ${formel} =</span>
        <input type="text" placeholder="Maße" value="${e.masze ?? ''}" style="width:7ch"
          onchange="window.__flaech_masze('${g.name}', this.value)">
        <span>=</span>
        <input type="number" step="0.01" placeholder="A" value="${e.flaeche ?? ''}" style="width:7ch"
          onchange="window.__flaech_flaeche('${g.name}', this.value)">
      </div>`;
    }).join('');
    const gesamtFormel = state.gebiete.map(g => g.name).join(' + ');
    return `<div style="max-width:560px;margin:0 auto">
      ${zeilen}
      <div style="font-weight:bold;margin-top:.4rem">A = ${gesamtFormel} =
        <input type="number" step="0.01" placeholder="?" style="width:8ch" oninput="window.__flaech_total=this.value">
        <button class="ma-btn" onclick="window.__flaech_pruefen()">Prüfen</button>
      </div>
    </div>`;
  },

  _ergebnis(state) {
    return `<div class="ma-result ma-fertig">
      <div class="ma-ok">${state.richtig ? '✅' : '❌'}</div>
      <div style="font-size:1.1em">A = ${state.shape.flaeche.toFixed(2)}</div>
      <button class="ma-btn" onclick="window.__flaech_neu()">🔁 Neue Figur</button>
    </div>`;
  },

  onTap(state, x, y, app) {
    if (state.fertig) return;
    const S = UNIT, O = OFF;
    const gx = Math.round((x - O) / S), gy = Math.round((y - O) / S);
    if (Math.abs((x - O) - gx * S) > 12 || Math.abs((y - O) - gy * S) > 12) return;
    const P = [gx, gy];

    // Symbol per Tippen zuordnen
    if (state.gewaehltesSymbol) {
      const gi = this._gebietBeiGrid(P);
      if (gi !== null) {
        this._zuordnen(state, gi, state.gewaehltesSymbol, app);
        state.gewaehltesSymbol = null;
        app.rerender();
      }
      return;
    }

    // Teilung: erster Gitterpunkt, dann zweiter
    if (state.gewaehlt === null) {
      if (this._aufRand(P)) { state.gewaehlt = P; app.rerender(); }
      return;
    }
    if (key(state.gewaehlt) === key(P)) { state.gewaehlt = null; app.rerender(); return; }
    if (this._aufRand(P)) {
      this._teilen(state, state.gewaehlt, P, app);
      state.gewaehlt = null;
      app.rerender();
    }
  },

  _aufRand(P) {
    const s = app.state;
    return s.gebiete.some(g =>
      g.punkte.some((v, i) => key(v) === key(P) || onSeg(P, v, g.punkte[(i + 1) % g.punkte.length])));
  },

  _gebietBeiGrid(P) {
    const s = app.state;
    for (let i = 0; i < s.gebiete.length; i++) {
      if (pointInPoly(P[0], P[1], s.gebiete[i].punkte)) return i;
    }
    return null;
  },

  _teilen(state, A, B, app) {
    for (let gi = 0; gi < state.gebiete.length; gi++) {
      const g = state.gebiete[gi];
      const rA = insertPoint(g.punkte, A);
      const rB = insertPoint(g.punkte, B);
      if (!rA || !rB) continue;
      // beide Punkte müssen auf diesem Gebiet liegen
      if (!this._aufGebiet(A, g) || !this._aufGebiet(B, g)) continue;
      const verts = rB.verts;   // A schon drin (nicht nötig, beide gleich) — neu bauen:
      const vertsA = insertPoint(g.punkte, A).verts;
      const vertsB = insertPoint(vertsA, B);
      const ia = insertPoint(vertsA, A).idx;
      const ib = vertsB.idx;
      const t1 = this._subLoop(vertsB.verts, ia, ib);
      const t2 = this._subLoop(vertsB.verts, ib, ia);
      const s1 = simplify(t1), s2 = simplify(t2);
      if (s1.length < 3 || s2.length < 3) continue;
      if (shoelace(s1) < 0.01 || shoelace(s2) < 0.01) continue;
      const nameA = 'A' + (state.gebiete.length);
      const nameB = 'A' + (state.gebiete.length + 1);
      state.gebiete.splice(gi, 1,
        { punkte: s1, form: null, name: nameA },
        { punkte: s2, form: null, name: nameB });
      return;
    }
  },

  _aufGebiet(P, g) {
    return g.punkte.some((v, i) => key(v) === key(P) || onSeg(P, v, g.punkte[(i + 1) % g.punkte.length]));
  },

  _subLoop(verts, a, b) {
    const out = []; let i = a;
    while (true) {
      out.push(verts[i % verts.length]);
      if (i % verts.length === b % verts.length) break;
      i++;
    }
    return out;
  },

  _zuordnen(state, gi, symbol, app) {
    const g = state.gebiete[gi];
    const form = echteForm(g.punkte);
    if (formPasst(form, symbol)) {
      g.form = symbol;
    } else {
      state.fehler++;
    }
  },

  actions: {
    symbol(state, key, app) { state.gewaehltesSymbol = key; app.rerender(); },
    masze(state, name, val, app) {
      if (!state.eingaben[name]) state.eingaben[name] = {};
      state.eingaben[name].masze = val;
      return false;
    },
    flaeche(state, name, val, app) {
      if (!state.eingaben[name]) state.eingaben[name] = {};
      state.eingaben[name].flaeche = val;
      return false;
    },
    pruefen(state, ...args) {
      const app = args[args.length - 1];
      const total = parseFloat(window.__flaech_total);
      state.richtig = (!Number.isNaN(total) && Math.abs(total - state.shape.flaeche) < 0.5) ? 1 : 0;
      state.fertig = true;
      app.rerender();
    },
    neu(state, ...args) {
      const app = args[args.length - 1];
      app.init(state, app);
      app.rerender();
    },
  },

  evaluate(state) {
    if (state.fertig) return { fertig: true, wert: `A = ${state.shape.flaeche.toFixed(2)}` };
    return null;
  },
  statusHtml(state) {
    const z = state.gebiete.filter(g => g.form).length;
    return `<div class="ma-result">📐 ${z}/${state.gebiete.length} Teilflächen · Fehler: ${state.fehler}</div>`;
  }
});

export default app;
export function mount(root) {
  app.mount(root);
  window.__flaech_sym = k => app.dispatch('symbol', k);
  window.__flaech_masze = (n, v) => app.dispatch('masze', n, v);
  window.__flaech_flaeche = (n, v) => app.dispatch('flaeche', n, v);
  window.__flaech_pruefen = () => app.dispatch('pruefen');
  window.__flaech_neu = () => app.dispatch('neu');
  window.__flaech_drag = null;
  window.__flaech_total = '';
  const canvas = root.querySelector('.ma-canvas');
  if (canvas) {
    canvas.addEventListener('dragover', e => e.preventDefault());
    canvas.addEventListener('drop', e => {
      e.preventDefault();
      const k = window.__flaech_drag || e.dataTransfer.getData('text/plain');
      if (!k) return;
      const svgEl = canvas.querySelector('svg');
      if (svgEl && svgEl.viewBox && svgEl.viewBox.baseVal) {
        const vb = svgEl.viewBox.baseVal;
        const br = svgEl.getBoundingClientRect();
        const x = (e.clientX - br.left) * (vb.width / br.width);
        const y = (e.clientY - br.top) * (vb.height / br.height);
        const gx = Math.round((x - OFF) / UNIT), gy = Math.round((y - OFF) / UNIT);
        const gi = app.cfg._gebietBeiGrid([gx, gy]);
        if (gi !== null) {
          app.cfg._zuordnen(app.state, gi, k, app);
          app.rerender();
        }
      }
      window.__flaech_drag = null;
    });
  }
}
