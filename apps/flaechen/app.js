/**
 * Flächen zusammensetzen – Kind teilt selbst (Karo-Papier).
 *
 * Eine zusammenhängende Figur (Polygon mit Halbkreis-Bögen) wird als EINE
 * Fläche erzeugt. Das Kind teilt sie von Gitter-Schnittpunkten aus, zieht
 * Grundform-Symbole auf die Teilflächen und rechnet A1, A2, … und die Summe.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const PI = Math.PI;
const UNIT = 32;
const OFF = 22;

const FORMEN = {
  rechteck:    { name: { de: 'Rechteck', ru: 'Прямоугольник', en: 'Rectangle' }, formel: 'H·L', farbe: '#4D96FF' },
  dreieck:     { name: { de: 'Dreieck', ru: 'Треугольник', en: 'Triangle' }, formel: '½·g·h', farbe: '#FF8A5C' },
  kreis:       { name: { de: 'Kreis', ru: 'Круг', en: 'Circle' }, formel: 'π·r²', farbe: '#C084FC' },
  halbkreis:   { name: { de: 'Halbkreis', ru: 'Полукруг', en: 'Half circle' }, formel: '½·π·r²', farbe: '#34D399' },
  viertelkreis:{ name: { de: 'Viertelkreis', ru: 'Четверть круга', en: 'Quarter circle' }, formel: '¼·π·r²', farbe: '#FB923C' },
};

function rand(n) { return Math.floor(Math.random() * n); }
function key(p) { return p.join(','); }

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

function onSeg(P, A, B) {
  const cross = (P[0] - A[0]) * (B[1] - A[1]) - (P[1] - A[1]) * (B[0] - A[0]);
  if (cross !== 0) return false;
  const dx = B[0] - A[0], dy = B[1] - A[1];
  const t = dx !== 0 ? (P[0] - A[0]) / dx : (dy !== 0 ? (P[1] - A[1]) / dy : 0);
  return t > 0 && t < 1;
}

function simplify(verts) {
  const out = [];
  for (let i = 0; i < verts.length; i++) {
    const a = verts[(i + verts.length - 1) % verts.length], b = verts[i], c = verts[(i + 1) % verts.length];
    const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    if (cross !== 0) out.push(b);
  }
  return out;
}

function orient(a, b, c) { return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); }
function onSeg2(p, a, b) {
  return Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) &&
         Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1]);
}
function segmenteKreuzen(a, b, c, d) {
  const o1 = orient(a, b, c), o2 = orient(a, b, d), o3 = orient(c, d, a), o4 = orient(c, d, b);
  if (o1 * o2 < 0 && o3 * o4 < 0) return true;
  if (o1 === 0 && onSeg2(c, a, b)) return true;
  if (o2 === 0 && onSeg2(d, a, b)) return true;
  if (o3 === 0 && onSeg2(a, c, d)) return true;
  if (o4 === 0 && onSeg2(b, c, d)) return true;
  return false;
}
function sehneGueltig(verts, ia, ib) {
  const A = verts[ia], B = verts[ib], n = verts.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    if (i === ia || i === ib || j === ia || j === ib) continue;
    if (segmenteKreuzen(A, B, verts[i], verts[j])) return false;
  }
  return true;
}

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
  return null;
}

function formPasst(wahr, symbol) {
  if (wahr === null) return false;
  if (symbol === wahr) return true;
  if (symbol === 'kreis') return ['kreis', 'halbkreis', 'viertelkreis'].includes(wahr);
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

function genShape() {
  const W = 2 + rand(3), H = 2 + rand(2);
  const h = Array.from({ length: W }, () => 1 + rand(H));
  h[0] = H; h[1] = H;   // garantierte flache Oberkante → Wölbung

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

  const chamfer = new Set();
  for (let i = 0; i < loop.length; i++) {
    const a = loop[(i + loop.length - 1) % loop.length], b = loop[i], c = loop[(i + 1) % loop.length];
    const v1 = [b[0] - a[0], b[1] - a[1]], v2 = [c[0] - b[0], c[1] - b[1]];
    const kreuz = v1[0] * v2[1] - v1[1] * v2[0];
    if (kreuz > 0 && Math.abs(v1[0]) + Math.abs(v1[1]) === 1 && Math.abs(v2[0]) + Math.abs(v2[1]) === 1 && rand(3) === 0) chamfer.add(i);
  }
  const punkteRaw = simplify(loop.filter((_, i) => !chamfer.has(i)));
  const maxY = Math.max(...punkteRaw.map(p => p[1]));
  const punkte = punkteRaw.map(([x, y]) => [x, maxY - y]);

  // Halbkreise an waagerechte Kanten, Wölbung nach außen (Kante ersetzt den Bogen)
  const boegen = [];
  for (let i = 0; i < punkte.length && boegen.length < 2; i++) {
    const a = punkte[i], b = punkte[(i + 1) % punkte.length];
    if (a[1] !== b[1]) continue;
    const L = Math.abs(b[0] - a[0]);
    if (L < 2) continue;
    const x1 = Math.min(a[0], b[0]), x2 = Math.max(a[0], b[0]);
    const y = a[1], cx = (x1 + x2) / 2;
    const obenAussen = !pointInPoly(cx, y - 0.5, punkte);
    const untenAussen = !pointInPoly(cx, y + 0.5, punkte);
    const oben = !(obenAussen || !untenAussen);
    boegen.push({ edge: i, chordA: [x1, y], chordB: [x2, y], r: L / 2, cx, cy: y, oben, flaeche: (PI * (L / 2) ** 2) / 2 });
  }

  const flaeche = shoelace(punkte);
  const gesamt = flaeche + boegen.reduce((s, k) => s + k.flaeche, 0);
  const maxR = Math.max(0, ...boegen.map(k => k.r));
  const oy = OFF + maxR * UNIT;
  return { punkte, boegen, flaeche, gesamt, W, H, oy };
}

/** Fläche eines Gebiets = Shoelace(Polygon) + Bögen. */
function areaOf(g) {
  return shoelace(g.punkte) + (g.boegen || []).reduce((s, b) => s + b.flaeche, 0);
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
    de: '1) Gitterschnittpunkte antippen → Teillinie. 2) Symbol auf die Teilfläche ziehen (nur die richtige Form wird angenommen). 3) Maße/Radius und Fläche eintragen, unten die Summe.',
    ru: '1) Коснись узлов сетки — разрез. 2) Перетащи символ (принимается только верная форма). 3) Введи размеры/радиус и площадь, внизу сумма.',
    en: '1) Tap grid intersections — cut. 2) Drag a symbol (only the correct shape is accepted). 3) Enter dimensions/radius and area, below the sum.'
  },
  settingsSchema: {},
  auswertung: 'punkte',

  init(state, app) {
    state.shape = genShape();
    state.gebiete = [{
      punkte: state.shape.punkte.slice(),
      boegen: state.shape.boegen.slice(),
      form: null, name: 'A1'
    }];
    state.gewaehlt = null;
    state.gewaehltesSymbol = null;
    state.eingaben = {};
    state.fertig = false;
    state.richtig = 0;
    state.fehler = 0;
    state.history = [];
  },

  render(state, app) {
    return `<div style="display:flex;flex-direction:column;gap:.5rem">
      ${this._canvas(state)}
      ${state.fertig ? this._ergebnis(state) : this._symbolleiste(state)}
      ${this._liste(state)}
    </div>`;
  },

  _canvas(state) {
    const S = UNIT, O = OFF, Oy = state.shape.oy;
    const xs = state.shape.punkte.map(p => p[0]), ys = state.shape.punkte.map(p => p[1]);
    const maxX = Math.max(...xs), maxY = Math.max(...ys);
    const w = (maxX + 1) * S + O * 2;
    const h = (maxY + 1) * S + Oy * 2;
    const px = p => p[0] * S + O, py = p => p[1] * S + Oy;

    // Füllungen (ohne Strich)
    const fills = state.gebiete.map(g => {
      const fill = g.form ? FORMEN[g.form].farbe + 'aa' : 'rgba(255,255,255,0.12)';
      let inner = g.punkte.map(p => `${px(p)},${py(p)}`).join(' ');
      inner = `<polygon points="${inner}" fill="${fill}"/>`;
      for (const b of (g.boegen || [])) {
        const x1 = px(b.chordA), y1 = py(b.chordA), x2 = px(b.chordB), y2 = py(b.chordB);
        const rr = b.r * S, sweep = b.oben ? 1 : 0;
        inner += `<path d="M ${x1} ${y1} A ${rr} ${rr} 0 0 ${sweep} ${x2} ${y2} Z" fill="${fill}"/>`;
      }
      return inner;
    }).join('');

    // Eine durchgehende Außenlinie
    const bogenByEdge = new Map(state.shape.boegen.map(k => [k.edge, k]));
    let d = `M ${px(state.shape.punkte[0])} ${py(state.shape.punkte[0])}`;
    for (let i = 0; i < state.shape.punkte.length; i++) {
      const nxt = state.shape.punkte[(i + 1) % state.shape.punkte.length];
      const nx = px(nxt), ny = py(nxt);
      const b = bogenByEdge.get(i);
      if (b) {
        const rr = b.r * S;
        const dx = nxt[0] - state.shape.punkte[i][0];
        const sweep = ((dx > 0) === b.oben) ? 1 : 0;
        d += ` A ${rr} ${rr} 0 0 ${sweep} ${nx} ${ny}`;
      } else {
        d += ` L ${nx} ${ny}`;
      }
    }
    d += ' Z';
    const umriss = `<path d="${d}" fill="none" stroke="#3a3560" stroke-width="2.5"/>`;

    // Teillinien (innere Kanten, die zwei Gebiete teilen)
    const teillinien = [];
    for (let i = 0; i < state.gebiete.length; i++) {
      const g = state.gebiete[i];
      for (let a = 0; a < g.punkte.length; a++) {
        const A = g.punkte[a], B = g.punkte[(a + 1) % g.punkte.length];
        // ist diese Kante eine Außenkante (nicht von zwei Gebieten geteilt)?
        let geteilt = false;
        for (let j = 0; j < state.gebiete.length && !geteilt; j++) {
          if (j === i) continue;
          const gp = state.gebiete[j].punkte;
          for (let b2 = 0; b2 < gp.length; b2++) {
            const C = gp[b2], D = gp[(b2 + 1) % gp.length];
            if ((key(A) === key(C) && key(B) === key(D)) || (key(A) === key(D) && key(B) === key(C))) { geteilt = true; break; }
          }
        }
        if (geteilt) teillinien.push(`<line x1="${px(A)}" y1="${py(A)}" x2="${px(B)}" y2="${py(B)}" stroke="#3a3560" stroke-width="2"/>`);
      }
    }

    // Radius-Beschriftung (in Wölbrichtung)
    const radien = state.shape.boegen.map(b => {
      const zx = b.cx * S + O, cyS = b.cy * S + Oy;
      const ziel = b.oben ? b.cy + b.r : b.cy - b.r;   // oben=false → Wölbung nach oben
      const zy = ziel * S + Oy;
      return `<line x1="${zx}" y1="${cyS}" x2="${zx}" y2="${zy}" stroke="#b04a00" stroke-width="1" stroke-dasharray="4 3"/>` +
        `<text x="${zx + 4}" y="${zy + (b.oben ? 12 : -4)}" font-size="13" fill="#b04a00" font-weight="bold">r=${b.r}</text>`;
    }).join('');

    // Karo
    let grid = '';
    for (let gx = 0; gx <= maxX + 1; gx++) grid += `<line x1="${gx * S + O}" y1="${O}" x2="${gx * S + O}" y2="${(maxY + 1) * S + Oy}" stroke="#8f8bd8" stroke-width="0.8" stroke-opacity="0.4"/>`;
    for (let gy = 0; gy <= maxY + 1; gy++) grid += `<line x1="${O}" y1="${gy * S + Oy}" x2="${(maxX + 1) * S + O}" y2="${gy * S + Oy}" stroke="#8f8bd8" stroke-width="0.8" stroke-opacity="0.4"/>`;

    const mark = state.gewaehlt
      ? `<circle cx="${px(state.gewaehlt)}" cy="${py(state.gewaehlt)}" r="5" fill="#5b4fcf" stroke="#fff" stroke-width="2"/>`
      : '';

    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"
        style="width:100%;max-width:440px;height:auto;background:#fdfdff;border:1px solid #ddd;border-radius:8px;touch-action:none">
      ${fills}${teillinien}${umriss}${radien}${grid}${mark}
    </svg>`;
  },

  _symbolleiste(state) {
    return `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
      ${Object.entries(FORMEN).map(([k, f]) =>
        `<button type="button" class="ma-btn" draggable="true" title="${f.name.de}"
          onclick="window.__flaech_sym('${k}')"
          ondragstart="window.__flaech_drag='${k}';event.dataTransfer.setData('text/plain','${k}')"
          style="display:flex;align-items:center;gap:6px;border-color:${f.farbe};padding:.3rem .6rem">
          ${formIcon(k)}<span style="font-size:.8em">${f.name.de}</span>
        </button>`).join('')}
    </div>`;
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
      <div style="margin-top:.3rem">
        <button class="ma-btn" onclick="window.__flaech_undo()" ${state.history.length ? '' : 'disabled'}>↩︎ Linie zurück</button>
      </div>
    </div>`;
  },

  _ergebnis(state) {
    return `<div class="ma-result ma-fertig">
      <div class="ma-ok">${state.richtig ? '✅' : '❌'}</div>
      <div style="font-size:1.1em">A = ${state.shape.gesamt.toFixed(2)}</div>
      <button class="ma-btn" onclick="window.__flaech_neu()">🔁 Neue Figur</button>
    </div>`;
  },

  _naechsterRandPunkt(gx, gy) {
    const s = app.state;
    let best = null, bestDist = Infinity;
    for (const g of s.gebiete) {
      for (const v of g.punkte) {
        const d = (gx - v[0]) ** 2 + (gy - v[1]) ** 2;
        if (d < bestDist) { bestDist = d; best = [v[0], v[1]]; }
      }
      for (let i = 0; i < g.punkte.length; i++) {
        const a = g.punkte[i], b = g.punkte[(i + 1) % g.punkte.length];
        const dx = b[0] - a[0], dy = b[1] - a[1];
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        for (let st = 1; st < steps; st++) {
          const x = a[0] + dx * st / steps, y = a[1] + dy * st / steps;
          if (!Number.isInteger(x) || !Number.isInteger(y)) continue;
          const d = (gx - x) ** 2 + (gy - y) ** 2;
          if (d < bestDist) { bestDist = d; best = [x, y]; }
        }
      }
    }
    return bestDist <= 2.5 ? best : null;
  },

  onTap(state, x, y, app) {
    if (state.fertig) return;
    const S = UNIT, O = OFF;
    const gx = (x - O) / S, gy = (y - state.shape.oy) / S;

    if (state.gewaehltesSymbol) {
      const gi = this._gebietBeiGrid([gx, gy]);
      if (gi !== null) {
        this._zuordnen(state, gi, state.gewaehltesSymbol, app);
        state.gewaehltesSymbol = null;
        app.rerender();
      }
      return;
    }

    const P = this._naechsterRandPunkt(gx, gy);
    if (!P) return;
    if (state.gewaehlt === null) { state.gewaehlt = P; app.rerender(); return; }
    if (key(state.gewaehlt) === key(P)) { state.gewaehlt = null; app.rerender(); return; }
    this._teilen(state, state.gewaehlt, P, app);
    state.gewaehlt = null;
    app.rerender();
  },

  _gebietBeiGrid(P) {
    const s = app.state;
    for (let i = 0; i < s.gebiete.length; i++) {
      const g = s.gebiete[i];
      if (pointInPoly(P[0], P[1], g.punkte)) return i;
      for (const b of (g.boegen || [])) {
        if (this._inBogen(P[0], P[1], b)) return i;
      }
    }
    return null;
  },

  _inBogen(gx, gy, b) {
    if (gx < b.chordA[0] || gx > b.chordB[0]) return false;
    if (b.oben ? gy > b.cy : gy < b.cy) return false;
    return (gx - b.cx) ** 2 + (gy - b.cy) ** 2 <= b.r * b.r + 1e-6;
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

  _teilen(state, A, B, app) {
    for (let gi = 0; gi < state.gebiete.length; gi++) {
      const g = state.gebiete[gi];
      if (!this._aufGebiet(A, g) || !this._aufGebiet(B, g)) continue;
      const verts = [];
      for (let i = 0; i < g.punkte.length; i++) {
        const v = g.punkte[i], w = g.punkte[(i + 1) % g.punkte.length];
        verts.push(v);
        if (onSeg(A, v, w)) verts.push(A);
        if (onSeg(B, v, w)) verts.push(B);
      }
      const ia = verts.findIndex(v => v[0] === A[0] && v[1] === A[1]);
      const ib = verts.findIndex(v => v[0] === B[0] && v[1] === B[1]);
      if (ia < 0 || ib < 0 || ia === ib) continue;
      if (!sehneGueltig(verts, ia, ib)) continue;
      const t1 = this._subLoop(verts, ia, ib);
      const t2 = this._subLoop(verts, ib, ia);
      // Halbkreis: eine Seite darf nur die Sehne (2 Punkte) sein, wenn dort ein Bogen liegt
      const hatBogen = (t) => t.length === 2 && (g.boegen || []).some(b =>
        (key(t[0]) === key(b.chordA) && key(t[1]) === key(b.chordB)) ||
        (key(t[0]) === key(b.chordB) && key(t[1]) === key(b.chordA)));
      const s1 = hatBogen(t1) ? t1 : simplify(t1);
      const s2 = hatBogen(t2) ? t2 : simplify(t2);
      if (s1.length < 2 || s2.length < 2) continue;
      if (Math.abs(shoelace(s1) + shoelace(s2) - shoelace(verts)) > 0.01) continue;

      // Bögen den neuen Teilgebieten zuordnen (2-Punkt-Seite = Halbkreis bekommt ihren Bogen)
      const b1 = [], b2 = [];
      for (const b of (g.boegen || [])) {
        const anS1 = this._kanteIn(b.chordA, b.chordB, s1);
        const anS2 = this._kanteIn(b.chordA, b.chordB, s2);
        if (s1.length === 2 && anS1) b1.push(b);
        else if (s2.length === 2 && anS2) b2.push(b);
        else if (anS1) b1.push(b);
        else b2.push(b);
      }
      // Degeneriertes Gebiet (nur die Sehne) + Bogen = Halbkreis
      const g1 = { punkte: s1, boegen: b1, form: null, name: 'A' + (state.gebiete.length) };
      const g2 = { punkte: s2, boegen: b2, form: null, name: 'A' + (state.gebiete.length + 1) };
      if (g1.punkte.length < 3 && g1.boegen.length === 0) continue;
      if (g2.punkte.length < 3 && g2.boegen.length === 0) continue;
      if (areaOf(g1) < 0.01 || areaOf(g2) < 0.01) continue;

      state.history.push(state.gebiete.map(x => ({
        punkte: x.punkte.map(p => [...p]), boegen: (x.boegen || []).map(b => ({ ...b })), form: x.form, name: x.name
      })));
      state.gebiete.splice(gi, 1, g1, g2);
      return;
    }
  },

  _kanteIn(A, B, poly) {
    for (let i = 0; i < poly.length; i++) {
      const C = poly[i], D = poly[(i + 1) % poly.length];
      if ((key(A) === key(C) && key(B) === key(D)) || (key(A) === key(D) && key(B) === key(C))) return true;
    }
    return false;
  },

  _wahrForm(g) {
    if ((g.boegen || []).length === 1 && g.punkte.length === 2) return 'halbkreis';
    if ((g.boegen || []).length > 0) return null;
    return echteForm(g.punkte);
  },

  _zuordnen(state, gi, symbol, app) {
    const g = state.gebiete[gi];
    if (formPasst(this._wahrForm(g), symbol)) g.form = symbol;
    else state.fehler++;
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
      state.richtig = (!Number.isNaN(total) && Math.abs(total - state.shape.gesamt) < 0.5) ? 1 : 0;
      state.fertig = true;
      app.rerender();
    },
    undo(state, ...args) {
      const app = args[args.length - 1];
      if (state.history.length) {
        state.gebiete = state.history.pop();
        state.gewaehlt = null;
        app.rerender();
      }
    },
    neu(state, ...args) {
      const app = args[args.length - 1];
      app.init(state, app);
      app.rerender();
    },
  },

  evaluate(state) {
    if (state.fertig) return { fertig: true, wert: `A = ${state.shape.gesamt.toFixed(2)}` };
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
  window.__flaech_undo = () => app.dispatch('undo');
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
        const gx = (x - OFF) / UNIT, gy = (y - app.state.shape.oy) / UNIT;
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
