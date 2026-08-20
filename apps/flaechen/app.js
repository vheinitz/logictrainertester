/**
 * Flächen zusammengesetzter Figuren – Lernspiel (eigenes Modul, nicht aus der DB).
 *
 * Ablauf: Teilflächen benennen (Grundform markieren) → je Teilfläche die richtige
 * Formel wählen → rechnen (Gesamtformel ODER jede Teilfläche einzeln und Summe).
 * Kanten sind beschriftet, Kreise mit Radius. π ≈ 3,14.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const PI = Math.PI;

const FORMEN = {
  rechteck:    { name: { de: 'Rechteck', ru: 'Прямоугольник', en: 'Rectangle' }, formel: 'A = a · b' },
  dreieck:     { name: { de: 'Dreieck', ru: 'Треугольник', en: 'Triangle' }, formel: 'A = ½ · g · h' },
  kreis:       { name: { de: 'Kreis', ru: 'Круг', en: 'Circle' }, formel: 'A = π · r²' },
  halbkreis:   { name: { de: 'Halbkreis', ru: 'Полукруг', en: 'Half circle' }, formel: 'A = ½ · π · r²' },
  viertelkreis:{ name: { de: 'Viertelkreis', ru: 'Четверть круга', en: 'Quarter circle' }, formel: 'A = ¼ · π · r²' },
};
const ALLE_FORMELN = Object.values(FORMEN).map(f => f.formel);

function r(x, y, w, h, fill, extra = {}) { return svg.rect(x, y, w, h, fill, extra); }
function p(points, fill, extra = {}) { return svg.el('polygon', { points, fill, ...extra }); }
function c(cx, cy, rad, fill, extra = {}) { return svg.circle(cx, cy, rad, fill, extra); }
function t(x, y, s, extra = {}) { return svg.text(x, y, s, { 'font-size': 15, fill: '#333', ...extra }); }
function halb(cx, cy, rad, seite, fill) {
  const d = seite === 'links'
    ? `M ${cx} ${cy - rad} A ${rad} ${rad} 0 0 0 ${cx} ${cy + rad} Z`
    : `M ${cx} ${cy - rad} A ${rad} ${rad} 0 0 1 ${cx} ${cy + rad} Z`;
  return `<path d="${d}" fill="${fill}" stroke="#3a3560" stroke-width="1.5"/>`;
}
function viertel(cx, cy, rad, fill) {
  return `<path d="M ${cx} ${cy - rad} A ${rad} ${rad} 0 0 1 ${cx + rad} ${cy} L ${cx} ${cy} Z"
    fill="${fill}" stroke="#3a3560" stroke-width="1.5"/>`;
}
function mass(x1, y1, x2, y2, text, vert = false) {
  const lx = vert ? x1 : (x1 + x2) / 2;
  const ly = vert ? (y1 + y2) / 2 : y1 + 16;
  return svg.group(
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#888" stroke-width="1" stroke-dasharray="4 3"/>` +
    `<text x="${lx}" y="${ly}" font-size="14" fill="#b04a00" font-weight="bold" ${vert ? 'text-anchor="start" dx="4"' : 'text-anchor="middle"'}>${text}</text>`
  );
}
function radius(x, y, text) {
  return `<text x="${x}" y="${y}" font-size="13" fill="#b04a00" font-weight="bold">${text}</text>`;
}

const FIGUREN = [
  {
    id: 'stadion', name: { de: 'Stadionform', ru: 'Стадион', en: 'Stadium' },
    teile: [
      { form: 'rechteck', a: 8, b: 4, flaeche: 32, hit: [80, 110, 160, 80], draw: f => r(80, 110, 160, 80, f) },
      { form: 'halbkreis', r: 2, flaeche: 2 * PI, hit: [40, 110, 40, 80], draw: f => halb(80, 150, 40, 'links', f) },
      { form: 'halbkreis', r: 2, flaeche: 2 * PI, hit: [240, 110, 40, 80], draw: f => halb(240, 150, 40, 'rechts', f) },
    ],
    labels: [
      mass(80, 205, 240, 205, '8'),
      mass(60, 110, 60, 190, '4', true),
      radius(28, 150, 'r=2'), radius(252, 150, 'r=2'),
    ],
  },
  {
    id: 'haus', name: { de: 'Haus', ru: 'Домик', en: 'House' },
    teile: [
      { form: 'rechteck', a: 6, b: 5, flaeche: 30, hit: [110, 130, 120, 100], draw: f => r(110, 130, 120, 100, f) },
      { form: 'dreieck', g: 6, h: 4, flaeche: 12, hit: [110, 50, 120, 80], draw: f => p('110,130 230,130 170,50', f) },
    ],
    labels: [
      mass(110, 245, 230, 245, '6'),
      mass(100, 130, 100, 230, '5', true),
      radius(180, 92, 'h=4'),
    ],
  },
  {
    id: 'halbkreis-auf', name: { de: 'Halbkreis auf Rechteck', ru: 'Полукруг на прямоугольнике', en: 'Half circle on rectangle' },
    teile: [
      { form: 'rechteck', a: 8, b: 5, flaeche: 40, hit: [80, 150, 160, 90], draw: f => r(80, 150, 160, 90, f) },
      { form: 'halbkreis', r: 4, flaeche: 8 * PI, hit: [80, 70, 160, 80], draw: f => {
          return `<path d="M 80 150 A 80 80 0 0 1 240 150 Z" fill="${f}" stroke="#3a3560" stroke-width="1.5"/>`;
        } },
    ],
    labels: [
      mass(80, 255, 240, 255, '8'),
      mass(65, 150, 65, 240, '5', true),
      radius(30, 100, 'r=4'),
    ],
  },
  {
    id: 'l-form', name: { de: 'L-Form', ru: 'Г-образная', en: 'L-shape' },
    teile: [
      { form: 'rechteck', a: 8, b: 3, flaeche: 24, hit: [90, 90, 160, 60], draw: f => r(90, 90, 160, 60, f) },
      { form: 'rechteck', a: 4, b: 3, flaeche: 12, hit: [90, 150, 80, 60], draw: f => r(90, 150, 80, 60, f) },
    ],
    labels: [
      mass(90, 225, 250, 225, '8'),
      mass(80, 90, 80, 210, '3', true),
      mass(90, 90, 170, 90, '4'),
    ],
  },
  {
    id: 'drei-teile', name: { de: 'Drei Teile', ru: 'Три части', en: 'Three parts' },
    teile: [
      { form: 'rechteck', a: 6, b: 4, flaeche: 24, hit: [100, 130, 120, 80], draw: f => r(100, 130, 120, 80, f) },
      { form: 'dreieck', g: 6, h: 3, flaeche: 9, hit: [100, 70, 120, 60], draw: f => p('100,130 220,130 160,70', f) },
      { form: 'viertelkreis', r: 3, flaeche: (9 * PI) / 4, hit: [220, 130, 60, 60], draw: f => viertel(220, 130, 60, f) },
    ],
    labels: [
      mass(100, 225, 220, 225, '6'),
      mass(90, 130, 90, 210, '4', true),
      radius(170, 98, 'h=3'),
      radius(250, 118, 'r=3'),
    ],
  },
  {
    id: 'rechteck-kreis', name: { de: 'Rechteck und Kreis', ru: 'Прямоугольник и круг', en: 'Rectangle and circle' },
    teile: [
      { form: 'rechteck', a: 5, b: 4, flaeche: 20, hit: [100, 110, 100, 80], draw: f => r(100, 110, 100, 80, f) },
      { form: 'kreis', r: 2, flaeche: 4 * PI, hit: [260, 150, 80, 80], draw: f => c(300, 150, 40, f) },
    ],
    labels: [
      mass(100, 205, 200, 205, '5'),
      mass(90, 110, 90, 190, '4', true),
      radius(306, 145, 'r=2'),
    ],
  },
];

const FARBEN = ['#FFD93D', '#4D96FF', '#34D399', '#FF8A5C', '#C084FC'];

function zahlen(form, teil) {
  if (form === 'rechteck') return `${teil.a}·${teil.b}`;
  if (form === 'dreieck') return `½·${teil.g}·${teil.h}`;
  if (form === 'kreis') return `π·${teil.r}²`;
  if (form === 'halbkreis') return `½·π·${teil.r}²`;
  if (form === 'viertelkreis') return `¼·π·${teil.r}²`;
  return '?';
}

const app = new MiniApp({
  id: 'flaechen',
  icon: '📐',
  titel: { de: 'Flächen zusammensetzen', ru: 'Площадь фигур', en: 'Composing areas' },
  anweisung: {
    de: 'Zerlege die Figur in Grundformen, wähle die Formeln und rechne die Gesamtfläche aus. π ≈ 3,14.',
    ru: 'Разбей фигуру на простые формы, выбери формулы и вычисли общую площадь. π ≈ 3,14.',
    en: 'Split the figure into basic shapes, choose the formulas and compute the total area. π ≈ 3.14.'
  },
  hilfe: {
    de: '1) Teilfläche antippen, dann Grundform wählen. 2) Je Teilfläche die richtige Formel wählen. 3) Rechnen: Gesamtformel (Maße einsetzen) oder jede Teilfläche einzeln und Summe. Kanten sind beschriftet, Kreise mit Radius.',
    ru: '1) Коснись части, затем базовой формы. 2) Выбери верную формулу для каждой части. 3) Вычисли: по общей формуле или каждую часть отдельно и сумму. Стороны подписаны, у кругов — радиус.',
    en: '1) Tap a part, then its basic shape. 2) Choose the right formula for each part. 3) Compute: total formula (insert values) or each part separately and sum. Edges are labelled, circles show radius.'
  },
  settingsSchema: {
    modus: { def: 'gesamt', kind: 'select', options: ['gesamt', 'teile'],
      label: { de: 'Rechnen', ru: 'Счёт', en: 'Compute' } }
  },
  auswertung: 'punkte',
  onSettingsChange(app) { app.reset(); },

  init(state, app) {
    state.figur = FIGUREN[Math.floor(Math.random() * FIGUREN.length)];
    state.phase = 'benennen';
    state.zuordnung = {};
    state.gewaehlteTeil = null;
    state.formelIdx = 0;
    state.eingaben = {};
    state.richtig = 0;
    state.fertig = false;
  },

  render(state, app) {
    if (state.phase === 'fertig') return this._ergebnis(state);
    const fig = state.figur;

    const teileSvg = fig.teile.map((teil, i) => {
      const farbe = state.zuordnung[i] ? FARBEN[i % FARBEN.length] + 'cc' : '#ffffff';
      const gew = state.gewaehlteTeil === i;
      const badge = state.zuordnung[i] ? FORMEN[state.zuordnung[i]].name.de : '?';
      const [hx, hy, hw, hh] = teil.hit;
      const badgeSvg =
        `<rect x="${hx + hw / 2 - 30}" y="${hy + hh / 2 - 13}" width="60" height="26" rx="13" fill="#fff" stroke="${gew ? '#5b4fcf' : '#3a3560'}" stroke-width="${gew ? 3 : 1.5}"/>` +
        `<text x="${hx + hw / 2}" y="${hy + hh / 2 + 5}" font-size="13" font-weight="bold" text-anchor="middle" fill="#222">${badge}</text>`;
      return svg.group(teil.draw(farbe) + badgeSvg);
    }).join('');

    const svgStr = `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg">${teileSvg}${fig.labels.join('')}</svg>`;

    if (state.phase === 'benennen') {
      const chips = Object.entries(FORMEN).map(([key, f]) =>
        `<button type="button" class="ma-btn" onclick="window.__flaechen_form('${key}')"
          ${state.gewaehlteTeil === null ? 'disabled' : ''}>${f.name.de}</button>`).join('');
      return `<div style="text-align:center">${svgStr}
        <p style="font-size:.9em;margin:.3rem 0">Tippe eine Teilfläche an, dann ihre Grundform.</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">${chips}</div>
      </div>`;
    }

    if (state.phase === 'formeln') {
      const idx = state.formelIdx;
      const name = FORMEN[state.zuordnung[idx]].name.de;
      const optionen = this._formelOptionen(state, idx);
      return `<div style="text-align:center">${svgStr}
        <p style="font-size:.95em;margin:.4rem 0">Teil ${idx + 1} (${name}) — welche Formel?</p>
        <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">
          ${optionen.map((f, k) => `<button type="button" class="ma-btn" onclick="window.__flaechen_formel(${k})">${f}</button>`).join('')}
        </div>
      </div>`;
    }

    if (state.phase === 'rechnen') return this._rechnenHtml(state, svgStr);
  },

  _formelOptionen(state, idx) {
    const richtig = FORMEN[state.zuordnung[idx]].formel;
    const andere = ALLE_FORMELN.filter(f => f !== richtig).slice(0, 3);
    const opt = [richtig, ...andere];
    for (let i = opt.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opt[i], opt[j]] = [opt[j], opt[i]];
    }
    state._richtigeFormelIdx = opt.indexOf(richtig);
    return opt;
  },

  _rechnenHtml(state, svgStr) {
    const fig = state.figur;

    if (app.get('modus') === 'teile') {
      const felder = fig.teile.map((teil, i) => {
        const name = FORMEN[state.zuordnung[i]].name.de;
        const v = state.eingaben[i] ?? '';
        return `<div style="margin:.3rem 0">
          <span style="font-size:.9em">Teil ${i + 1} (${name}): A =</span>
          <input type="number" step="0.01" value="${v}" style="width:7ch;font-size:1em;padding:.2rem"
            oninput="window.__flaechen_teil(${i}, this.value)">
        </div>`;
      }).join('');
      return `<div style="text-align:center">${svgStr}
        <div style="max-width:340px;margin:.4rem auto;text-align:left">${felder}</div>
        <button class="ma-btn" onclick="window.__flaechen_pruefen_teile()">Prüfen</button>
      </div>`;
    }

    const formeln = fig.teile.map((t, i) => FORMEN[state.zuordnung[i]].formel.replace('A = ', '')).join(' + ');
    const nummern = fig.teile.map((t, i) => zahlen(state.zuordnung[i], t)).join(' + ');
    return `<div style="text-align:center">${svgStr}
      <p style="font-size:.95em;margin:.3rem 0">A = ${formeln}</p>
      <p style="font-size:.9em;color:var(--ma-neben)">A = ${nummern}</p>
      <div style="margin:.4rem 0">A = <input type="number" step="0.01" style="width:8ch;font-size:1.1em;padding:.2rem"
        oninput="window.__flaechen_antwort=this.value"></div>
      <button class="ma-btn" onclick="window.__flaechen_pruefen_gesamt()">Prüfen</button>
    </div>`;
  },

  _ergebnis(state) {
    const fig = state.figur;
    const gesamt = fig.teile.reduce((s, t) => s + t.flaeche, 0);
    const zeilen = fig.teile.map((t, i) =>
      `<div>Teil ${i + 1} (${FORMEN[state.zuordnung[i]].name.de}): ${t.flaeche.toFixed(2)}</div>`).join('');
    return `<div class="ma-result ma-fertig">
      <div class="ma-ok">${state.richtig ? '✅' : '❌'}</div>
      <div style="font-size:1.1em">A = ${gesamt.toFixed(2)}</div>
      <div style="font-size:.85em;color:var(--ma-neben);margin-top:.4rem">${zeilen}</div>
      <button class="ma-btn" onclick="window.__flaechen_neu()">🔁 Neue Figur</button>
    </div>`;
  },

  // Benennen: Teilfläche antippen
  onTap(state, x, y, app) {
    if (state.phase !== 'benennen') return;
    const fig = state.figur;
    for (let i = 0; i < fig.teile.length; i++) {
      const [hx, hy, hw, hh] = fig.teile[i].hit;
      if (x >= hx && x <= hx + hw && y >= hy && y <= hy + hh) {
        state.gewaehlteTeil = i;
        app.rerender();
        return;
      }
    }
  },

  actions: {
    form(state, key, app) {
      if (state.phase !== 'benennen' || state.gewaehlteTeil === null) return false;
      state.zuordnung[state.gewaehlteTeil] = key;
      state.gewaehlteTeil = null;
      if (Object.keys(state.zuordnung).length === state.figur.teile.length) {
        state.phase = 'formeln';
        state.formelIdx = 0;
      }
      app.rerender();
    },
    formel(state, idx, app) {
      if (state.phase !== 'formeln') return false;
      if (idx !== state._richtigeFormelIdx) state.versuche = (state.versuche || 0) + 1;
      state.formelIdx++;
      if (state.formelIdx >= state.figur.teile.length) state.phase = 'rechnen';
      app.rerender();
    },
    teil(state, i, val, app) {
      const v = parseFloat(val);
      state.eingaben[i] = Number.isNaN(v) ? undefined : v;
      return false;
    },
    pruefen_teile(state, ...args) {
      const app = args[args.length - 1];
      const korrekte = state.figur.teile.map(t => t.flaeche);
      let summe = 0, ok = true;
      state.figur.teile.forEach((t, i) => {
        const v = state.eingaben[i];
        if (v === undefined) { ok = false; return; }
        summe += v;
        if (Math.abs(v - korrekte[i]) > 0.5) ok = false;
      });
      const gesamt = korrekte.reduce((a, b) => a + b, 0);
      state.richtig = (ok && Math.abs(summe - gesamt) < 0.5) ? 1 : 0;
      state.fertig = true;
      app.rerender();
    },
    pruefen_gesamt(state, ...args) {
      const app = args[args.length - 1];
      const v = parseFloat(window.__flaechen_antwort);
      const gesamt = state.figur.teile.reduce((s, t) => s + t.flaeche, 0);
      state.richtig = (!Number.isNaN(v) && Math.abs(v - gesamt) < 0.5) ? 1 : 0;
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
    if (state.fertig) {
      const gesamt = state.figur.teile.reduce((s, t) => s + t.flaeche, 0);
      return { fertig: true, wert: `A = ${gesamt.toFixed(2)}` };
    }
    return null;
  },
  statusHtml(state) {
    const ph = { benennen: 'Benennen', formeln: 'Formel wählen', rechnen: 'Rechnen' }[state.phase] || '';
    return `<div class="ma-result">📐 ${ph}</div>`;
  }
});

export default app;
export function mount(root) {
  app.mount(root);
  window.__flaechen_form = key => app.dispatch('form', key);
  window.__flaechen_formel = idx => app.dispatch('formel', idx);
  window.__flaechen_teil = (i, v) => app.dispatch('teil', i, v);
  window.__flaechen_pruefen_teile = () => app.dispatch('pruefen_teile');
  window.__flaechen_pruefen_gesamt = () => app.dispatch('pruefen_gesamt');
  window.__flaechen_neu = () => app.dispatch('neu');
}
