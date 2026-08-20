/**
 * Flächen zusammensetzen – Kind teilt selbst.
 *
 * Eine zufällige, zusammenhängende Figur wird erzeugt (ganzzahliges Raster,
 * Kanten in 0/45/90°, optional Halbkreis-/Viertelkreis-Bögen). Das Kind teilt
 * sie von Eckpunkt zu Eckpunkt in Teilflächen, zieht Grundform-Symbole
 * (Rechteck, Dreieck, Kreis, Halbkreis, Viertelkreis) darauf und rechnet:
 * je Teilfläche A_i = Formel = Maße = Ergebnis, und die Summe A = A1 + A2 + …
 */
import { MiniApp, svg } from '../_framework/framework.js';

const PI = Math.PI;
const UNIT = 42;                 // Pixel je Einheit

const FORMEN = {
  rechteck:    { name: { de: 'Rechteck', ru: 'Прямоугольник', en: 'Rectangle' }, formel: 'H·L', farbe: '#4D96FF' },
  dreieck:     { name: { de: 'Dreieck', ru: 'Треугольник', en: 'Triangle' }, formel: '½·g·h', farbe: '#FF8A5C' },
  kreis:       { name: { de: 'Kreis', ru: 'Круг', en: 'Circle' }, formel: 'π·r²', farbe: '#C084FC' },
  halbkreis:   { name: { de: 'Halbkreis', ru: 'Полукруг', en: 'Half circle' }, formel: '½·π·r²', farbe: '#34D399' },
  viertelkreis:{ name: { de: 'Viertelkreis', ru: 'Четверть круга', en: 'Quarter circle' }, formel: '¼·π·r²', farbe: '#FB923C' },
};

// „kreis“-Symbol akzeptiert jede kreisbasierte Teilfläche.
function formPasst(formDerFlaeche, symbol) {
  if (symbol === formDerFlaeche) return true;
  if (symbol === 'kreis') return ['kreis', 'halbkreis', 'viertelkreis'].includes(formDerFlaeche);
  return false;
}

function rand(n) { return Math.floor(Math.random() * n); }

/** Zufällige zusammenhängende Figur (Histogramm + 45°-Schrägen + Bögen). */
function genShape() {
  const W = 3 + rand(3);               // Spalten
  const H = 3 + rand(3);               // max. Höhe
  const h = Array.from({ length: W }, () => 1 + rand(H));

  // gefüllte Zellen (Spalte c, Zeile y von 0..h[c]-1)
  const cells = new Set();
  for (let c = 0; c < W; c++) for (let y = 0; y < h[c]; y++) cells.add(c + ',' + y);

  // Randkanten sammeln (gerichtete Einheitskanten um den Umriss)
  const edges = [];
  const push = (f, t) => edges.push({ f, t });
  for (const key of cells) {
    const [c, y] = key.split(',').map(Number);
    if (!cells.has(c + ',' + (y + 1))) push([c, y + 1], [c + 1, y + 1]);        // oben →
    if (!cells.has(c + ',' + (y - 1))) push([c + 1, y], [c, y]);                 // unten ←
    if (!cells.has((c - 1) + ',' + y)) push([c, y], [c, y + 1]);                 // links ↑
    if (!cells.has((c + 1) + ',' + y)) push([c + 1, y + 1], [c + 1, y]);         // rechts ↓
  }

  // Kante aneinanderhängen → geschlossener Umlauf (dann zu CCW umdrehen)
  const byStart = new Map(edges.map(e => [e.f.join(','), e]));
  const start = edges[0].f;
  const loop = [];
  let cur = start;
  const seen = new Set();
  while (true) {
    loop.push(cur);
    const e = byStart.get(cur.join(','));
    if (!e) break;
    cur = e.t;
    if (cur.join(',') === start.join(',')) break;
    if (seen.has(cur.join(','))) break;
    seen.add(cur.join(','));
  }
  loop.reverse();   // gegen den Uhrzeigersinn

  // 45°-Schrägen an konvexen Ecken (Ecke entfernen → Diagonale)
  const punkte = loop.map(p => [...p]);
  const chamfer = new Set();
  for (let i = 0; i < punkte.length; i++) {
    const a = punkte[(i + punkte.length - 1) % punkte.length];
    const b = punkte[i];
    const c = punkte[(i + 1) % punkte.length];
    const v1 = [b[0] - a[0], b[1] - a[1]];
    const v2 = [c[0] - b[0], c[1] - b[1]];
    const kreuz = v1[0] * v2[1] - v1[1] * v2[0];
    // CCW: konvexe Ecke = Linkskurve; Einheitsbeine → 45°-Diagonale
    if (kreuz > 0 && Math.abs(v1[0]) + Math.abs(v1[1]) === 1 && Math.abs(v2[0]) + Math.abs(v2[1]) === 1 && rand(3) === 0) {
      chamfer.add(i);
    }
  }
  const punkteFinal = punkte.filter((_, i) => !chamfer.has(i));
  const flaeche = shoelace(punkteFinal);

  return { punkte: punkteFinal, flaeche, W, H };
}

/** Punkt-in-Polygon (gerade Kanten). */
function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Fläche eines geraden Polygons (Shoelace). */
function shoelace(poly) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

/** Teilpolygon aus einem Umlauf [a..b] schneiden. */
function subLoop(poly, a, b) {
  const out = [];
  let i = a;
  while (true) {
    out.push(poly[i % poly.length]);
    if (i % poly.length === b % poly.length) break;
    i++;
  }
  return out;
}

const app = new MiniApp({
  id: 'flaechen',
  icon: '📐',
  titel: { de: 'Flächen selbst teilen', ru: 'Площадь фигур', en: 'Split the area yourself' },
  anweisung: {
    de: 'Teile die Figur von Eckpunkt zu Eckpunkt, ziehe die Grundform-Symbole auf die Teilflächen und rechne. π ≈ 3,14.',
    ru: 'Раздели фигуру от вершины к вершине, перетащи символы форм на части и вычисли. π ≈ 3,14.',
    en: 'Split the figure from vertex to vertex, drag the shape symbols onto the parts and compute. π ≈ 3.14.'
  },
  hilfe: {
    de: '1) Einen Eckpunkt antippen, dann einen zweiten → Teillinie. 2) Symbol auf die Teilfläche ziehen (Halb-/Viertelkreis darf auch „Kreis“ sein). 3) Maße eintragen und Fläche ausrechnen, unten die Summe. Eckpunkte sind als Punkte markiert.',
    ru: '1) Коснись вершины, затем второй — линия разреза. 2) Перетащи символ на часть (полукруг/четверть можно как «круг»). 3) Введи размеры и площадь, внизу сумма.',
    en: '1) Tap a vertex, then another → cut line. 2) Drag a symbol onto the part (half/quarter circle may also be “circle”). 3) Enter dimensions and area, below the sum.'
  },
  settingsSchema: {},
  auswertung: 'punkte',

  init(state, app) {
    const shape = genShape();
    state.shape = shape;
    state.gebiete = [{ punkte: shape.punkte, form: null, name: 'A1', flaeche: null }];
    state.gewaehlt = null;          // erster Eckpunkt (Index ins Gebiet)
    state.gewaehltesGebiet = 0;
    state.zielSymbol = null;        // Symbol, das gezogen wird
    state.gewaehltesSymbol = null;  // via Tap
    state.eingaben = {};            // name -> { masze, flaeche }
    state.total = '';
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
    const S = UNIT;
    // Figur zeichnen (Gebiete + Eckpunkte + Teillinien)
    const teile = state.gebiete.map((g, gi) => {
      const fill = g.form ? FORMEN[g.form].farbe + '88' : '#ffffff';
      const punkte = g.punkte.map(([x, y]) => `${x * S + 30},${y * S + 30}`).join(' ');
      const gew = state.gewaehltesGebiet === gi;
      return `<polygon points="${punkte}" fill="${fill}" stroke="${gew ? '#5b4fcf' : '#3a3560'}" stroke-width="${gew ? 3 : 1.5}"/>`;
    }).join('');

    // Eckpunkte (einmalig, aus der Ursprungsfigur)
    const ecken = state.shape.punkte.map((p, i) => {
      const gew = state.gewaehlt === i;
      return `<circle cx="${p[0] * S + 30}" cy="${p[1] * S + 30}" r="${gew ? 8 : 5}"
        fill="${gew ? '#5b4fcf' : '#fff'}" stroke="#3a3560" stroke-width="2"/>`;
    }).join('');

    // 45°-Schrägen sind jetzt Teil des Polygons (kein Overlay nötig).
    const w = (state.shape.W + 1) * S + 60;
    const h = (state.shape.H + 1) * S + 60;
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="background:#fafaff;border:1px solid #ddd;border-radius:8px">
      ${teile}${ecken}
    </svg>`;
  },

  _symbolleiste(state) {
    const symbole = Object.entries(FORMEN).map(([key, f]) =>
      `<button type="button" class="ma-btn" draggable="true"
        onclick="window.__flaech_sym('${key}')"
        ondragstart="window.__flaech_drag='${key}';event.dataTransfer.setData('text/plain','${key}')"
        style="border-color:${f.farbe}">${f.name.de}</button>`).join('');
    return `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">${symbole}</div>`;
  },

  _liste(state) {
    const zeilen = state.gebiete.map((g, i) => {
      const e = state.eingaben[g.name] || {};
      const formel = g.form ? FORMEN[g.form].formel : '?';
      const ma = e.masze ?? '';
      const fl = e.flaeche ?? '';
      return `<div style="display:flex;align-items:center;gap:6px;font-size:.95em;margin:.2rem 0">
        <b style="min-width:2.4ch">${g.name}</b>
        <span style="color:${g.form ? FORMEN[g.form].farbe : '#999'}">${g.form ? FORMEN[g.form].name.de : '—'}</span>
        <span>= ${formel} =</span>
        <input type="text" placeholder="Maße" value="${ma}" style="width:7ch"
          onchange="window.__flaech_masze('${g.name}', this.value)">
        <span>=</span>
        <input type="number" step="0.01" placeholder="A" value="${fl}" style="width:7ch"
          onchange="window.__flaech_flaeche('${g.name}', this.value)">
      </div>`;
    }).join('');

    const gesamtFormel = state.gebiete.map(g => g.name).join(' + ');
    return `<div style="max-width:520px;margin:0 auto">
      ${zeilen}
      <div style="font-weight:bold;margin-top:.4rem">A = ${gesamtFormel} =
        <input type="number" step="0.01" placeholder="?" style="width:8ch"
          oninput="window.__flaech_total=this.value">
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

  // Eckpunkt antippen → Teilung
  onTap(state, x, y, app) {
    if (state.fertig) return;
    const S = UNIT;
    // nächstes Symbol-Ziel (falls Symbol gewählt)
    if (state.gewaehltesSymbol) {
      const gi = this._gebietBei(x, y);
      if (gi !== null) {
        this._zuordnen(state, gi, state.gewaehltesSymbol, app);
        state.gewaehltesSymbol = null;
        app.rerender();
        return;
      }
    }
    // Eckpunkt treffen
    for (let i = 0; i < state.shape.punkte.length; i++) {
      const [px, py] = state.shape.punkte[i];
      const cx = px * S + 30, cy = py * S + 30;
      if (Math.hypot(x - cx, y - cy) < 10) {
        if (state.gewaehlt === null) {
          state.gewaehlt = i;
        } else if (state.gewaehlt === i) {
          state.gewaehlt = null;
        } else {
          this._teilen(state, state.gewaehlt, i, app);
          state.gewaehlt = null;
        }
        app.rerender();
        return;
      }
    }
    // Gebiet auswählen (für Symbol-Zuordnung per Tap)
    const gi = this._gebietBei(x, y);
    state.gewaehltesGebiet = gi !== null ? gi : state.gewaehltesGebiet;
    app.rerender();
  },

  _gebietBei(x, y) {
    const S = UNIT;
    const s = app.state;
    for (let i = 0; i < s.gebiete.length; i++) {
      const g = s.gebiete[i];
      // Skalierte Punkte
      const poly = g.punkte.map(([px, py]) => [px * S + 30, py * S + 30]);
      if (pointInPoly(x, y, poly)) return i;
    }
    return null;
  },

  // Zwischen zwei Eckpunkten teilen
  _teilen(state, a, b, app) {
    // Finde das Gebiet, das beide Punkte enthält, und teile es.
    const S = UNIT;
    for (let gi = 0; gi < state.gebiete.length; gi++) {
      const g = state.gebiete[gi];
      const idx = p => g.punkte.findIndex(([x, y]) => x === p[0] && y === p[1]);
      const ia = idx(state.shape.punkte[a]);
      const ib = idx(state.shape.punkte[b]);
      if (ia === -1 || ib === -1 || ia === ib) continue;
      // zwei Teilschleifen
      const teil1 = subLoop(g.punkte, ia, ib);
      const teil2 = subLoop(g.punkte, ib, ia);
      if (teil1.length < 3 || teil2.length < 3) continue;
      const a1 = shoelace(teil1), a2 = shoelace(teil2);
      if (a1 < 0.01 || a2 < 0.01) continue;
      const nameA = 'A' + (state.gebiete.length);
      const nameB = 'A' + (state.gebiete.length + 1);
      state.gebiete.splice(gi, 1,
        { punkte: teil1, form: null, name: nameA, flaeche: null },
        { punkte: teil2, form: null, name: nameB, flaeche: null });
      return;
    }
  },

  _zuordnen(state, gi, symbol, app) {
    const g = state.gebiete[gi];
    const flaeche = shoelace(g.punkte);
    // Bestimme die wahre Form aus der Geometrie (grobe Heuristik)
    const form = this._echteForm(g);
    if (formPasst(form, symbol)) {
      g.form = symbol;
      g.flaeche = flaeche;
      // wenn alle Gebiete eine Form haben → Liste fertig
    } else {
      state.fehler++;
    }
  },

  _echteForm(g) {
    // Heuristik aus Punktzahl (nur orthogonale/45°-Polygone)
    const n = g.punkte.length;
    if (n === 3) return 'dreieck';
    if (n === 4) return 'rechteck';
    if (n === 5) return 'dreieck';   // z. B. Rechteck mit 45°-Ecke → Dreieck
    return 'rechteck';
  },

  actions: {
    symbol(state, key, app) {
      state.gewaehltesSymbol = key;
      app.rerender();
    },
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
    const zugeordnet = state.gebiete.filter(g => g.form).length;
    return `<div class="ma-result">📐 ${zugeordnet}/${state.gebiete.length} Teilflächen · Fehler: ${state.fehler}</div>`;
  }
});

export default app;
export function mount(root) {
  app.mount(root);
  window.__flaech_sym = key => app.dispatch('symbol', key);
  window.__flaech_masze = (n, v) => app.dispatch('masze', n, v);
  window.__flaech_flaeche = (n, v) => app.dispatch('flaeche', n, v);
  window.__flaech_pruefen = () => app.dispatch('pruefen');
  window.__flaech_neu = () => app.dispatch('neu');
  window.__flaech_drag = null;
  window.__flaech_total = '';
  // Drag & Drop des Symbols auf die Fläche
  const canvas = root.querySelector('.ma-canvas');
  if (canvas) {
    canvas.addEventListener('dragover', e => e.preventDefault());
    canvas.addEventListener('drop', e => {
      e.preventDefault();
      const key = window.__flaech_drag || e.dataTransfer.getData('text/plain');
      if (!key) return;
      const r = canvas.getBoundingClientRect();
      const svgEl = canvas.querySelector('svg');
      if (svgEl && svgEl.viewBox && svgEl.viewBox.baseVal) {
        const vb = svgEl.viewBox.baseVal;
        const x = (e.clientX - svgEl.getBoundingClientRect().left) * (vb.width / svgEl.getBoundingClientRect().width);
        const y = (e.clientY - svgEl.getBoundingClientRect().top) * (vb.height / svgEl.getBoundingClientRect().height);
        const gi = app.cfg._gebietBei(x, y);
        if (gi !== null) {
          app.cfg._zuordnen(app.state, gi, key, app);
          app.rerender();
        }
      }
      window.__flaech_drag = null;
    });
  }
}
