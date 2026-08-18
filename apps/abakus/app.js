/**
 * Stein-Abakus – Zahlen auf dem Abakus legen (ohne Arithmetik).
 * idee-db: 50
 *
 * Aus der Ideen-DB (Beitrag 50, Akhmanov „Просто арифметика“, S. 30–31,
 * Kap. 2 „Абак — вычислительный инструмент древности“).
 *
 * Generischer Abakus-Trainer: In jeder Spalte liegt ein Stein über der
 * Mittellinie (zählt 5) und vier Steine darunter (zählen je 1). Das Kind legt
 * per Tippen oder Ziehen eine Zahl. Die gelegte Zahl wird laufend als Ziffer
 * angezeigt und (optional) vorgelesen.
 *
 *   • 🎯 Ziel: eine vorgegebene Zahl nachlegen
 *   • 🔍 Frei: selbst Zahlen ausprobieren, die App liest sie vor
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 600;
const VIEW_H = 470;

// Abakus-Geometrie (viewBox-Einheiten)
const BW = 56;                 // Stein-Breite
const BH = 24;                 // Stein-Höhe
const BAR_Y = 270;             // Mittellinie
const BAR_H = 6;
const ROD_TOP = 180;           // Stab oben
const ROD_BOT = 410;           // Stab unten
const UPPER_AWAY = 190;        // 5er-Stein: oben (nicht gezählt)
const UPPER_ACTIVE = 246;      // 5er-Stein: an der Linie (gezählt)
const LOWER_ACTIVE0 = 276;     // 1er-Stein ganz oben an der Linie
const LOWER_STEP = 30;         // Abstand der 1er-Steine

// Farben
const C_UP = '#e67e22', C_UP_STROKE = '#b85c1a';      // 5er-Stein
const C_DOWN = '#5b4fcf', C_DOWN_STROKE = '#3f36a8';  // 1er-Stein
const C_OFF = '#f0eefe', C_OFF_STROKE = '#c9c3f0';    // nicht gelegt

const BTNS = [
  { id: 'ziel', x: 16, y: 16, w: 104, h: 40, label: { de: '🎯 Ziel', ru: '🎯 Цель', en: '🎯 Target' } },
  { id: 'frei', x: 128, y: 16, w: 104, h: 40, label: { de: '🔍 Frei', ru: '🔍 Свободно', en: '🔍 Free' } },
  { id: 'sprechen', x: 472, y: 16, w: 56, h: 40, label: { de: '🔊', ru: '🔊', en: '🔊' } },
  { id: 'neu', x: 536, y: 16, w: 52, h: 40, label: { de: '🎲', ru: '🎲', en: '🎲' } },
];

/** Aktive Sprache (global geteilt, wie in der Haupt-App). */
function lang() {
  try { return localStorage.getItem('miniapp-lang') || 'de'; }
  catch { return 'de'; }
}
/** Mehrsprachigen Text auflösen. */
function T(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang()] || obj.de || '';
}

function rnd(n) { return Math.floor(Math.random() * n); }

/** Spaltenmitte für Spalte i (0 = ganz links = höchste Stelle). */
function colX(i, n) {
  const inner = 480;
  const cw = inner / n;
  return 60 + (i + 0.5) * cw;
}

/** Oberkante des 1er-Steins j (0 = am nächsten zur Mittellinie). */
function unterY(state, col, j) {
  const a = state.beads[col].unten;
  if (j < a) return LOWER_ACTIVE0 + j * LOWER_STEP;
  const k = 3 - j; // inaktive Steine stapeln sich von unten
  return ROD_BOT - BH - k * LOWER_STEP;
}

function beadSvg(cx, y, fill, stroke, extra = {}) {
  return svg.rect(cx - BW / 2, y, BW, BH, fill, { rx: 12, stroke, 'stroke-width': 2, ...extra });
}

function buttonSvg(b, aktiv, label) {
  const fill = aktiv ? '#5b4fcf' : '#ffffff';
  const stroke = aktiv ? '#5b4fcf' : '#c9c3f0';
  const color = aktiv ? '#ffffff' : '#333333';
  return svg.group(
    svg.rect(b.x, b.y, b.w, b.h, fill, { rx: 10, stroke, 'stroke-width': 2 }) +
    svg.text(b.x + b.w / 2, b.y + b.h / 2 + 7, label, { 'font-size': 16, 'font-weight': 'bold', fill: color, 'text-anchor': 'middle' })
  );
}

/** Aktuell gelegte Zahl. */
function gesamt(state) {
  let sum = 0;
  const n = state.beads.length;
  for (let i = 0; i < n; i++) {
    const b = state.beads[i];
    const place = Math.pow(10, n - 1 - i);
    sum += (b.oben * 5 + b.unten) * place;
  }
  return sum;
}

/** Ziffern linksbündig, passend zur Spaltenzahl. */
function ziffern(value, spalten) {
  return String(value).padStart(spalten, '0').split('').map(Number);
}

/** Minimal nötige Steingesten: 5er (falls nötig) + 1er-Griff (falls nötig). */
function optimalZuege(ziel, spalten) {
  return ziffern(ziel, spalten).reduce((sum, d) => sum + (d >= 5 ? 1 : 0) + (d % 5 > 0 ? 1 : 0), 0);
}

function zufallsZiel(spalten) {
  const max = Math.pow(10, spalten) - 1;
  return 1 + rnd(max);
}

function sprechen(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(String(text));
  u.lang = { de: 'de-DE', ru: 'ru-RU', en: 'en-US' }[lang()] || 'de-DE';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

const app = new MiniApp({
  id: 'abakus',
  icon: '🧮',
  titel: { de: 'Stein-Abakus', ru: 'Каменный абак', en: 'Stone abacus' },
  anweisung: {
    de: 'Lege die vorgegebene Zahl mit den Steinen. Ein Stein über der Linie zählt 5, jeder Stein unter der Linie zählt 1.',
    ru: 'Выложи заданное число косточками. Одна косточка над линией — это 5, каждая косточка под линией — это 1.',
    en: 'Lay the given number with the beads. A bead above the line counts 5, each bead below the line counts 1.'
  },
  hilfe: {
    de: 'Tippe einen Stein an oder ziehe ihn zur Mittellinie. Oben liegt der 5er-Stein, darunter die vier 1er-Steine. Rechts sind die Einer, links daneben Zehner, Hunderter und Tausender. 🎯 Ziel: die rote Zahl nachlegen. 🔍 Frei: selbst Zahlen ausprobieren – die App liest sie vor. 🔊 liest die Zahl vor, 🎲 würfelt eine neue Zielzahl.',
    ru: 'Коснись косточки или перетащи её к средней линии. Сверху — косточка «5», под ней — четыре косточки «1». Справа единицы, левее — десятки, сотни и тысячи. 🎯 Цель: выложить красное число. 🔍 Свободно: пробуй числа сам — приложение читает их вслух. 🔊 читает число, 🎲 — новое число.',
    en: 'Tap a bead or drag it to the middle line. Above it is the 5-bead, below it the four 1-beads. On the right are the ones, then tens, hundreds and thousands. 🎯 Target: lay the red number. 🔍 Free: try numbers yourself – the app reads them aloud. 🔊 reads the number, 🎲 rolls a new target.'
  },
  settingsSchema: {
    stellen: {
      def: 2, min: 2, max: 4, step: 1,
      label: { de: 'Spalten (Stellen)', ru: 'Столбцы (разряды)', en: 'Columns (places)' }
    },
    vorlesen: {
      def: 1, min: 0, max: 1, step: 1, bool: true,
      label: { de: 'Zahl vorlesen', ru: 'Читать число', en: 'Read number aloud' }
    }
  },
  auswertung: 'zuege',

  // Spaltenzahl wirkt erst nach Neustart; Vorlesen sofort.
  onSettingsChange(app) {
    const s = app.state;
    if (s && s.spalten !== app.get('stellen')) app.reset();
  },

  init(state, app) {
    state.spalten = app.get('stellen');
    state.modus = 'ziel';
    state.beads = Array.from({ length: state.spalten }, () => ({ oben: 0, unten: 0 }));
    state.ziel = zufallsZiel(state.spalten);
    state.zuege = 0;
    state.fertig = false;
    state.drag = null;
    if (state._speakTimer) { clearTimeout(state._speakTimer); state._speakTimer = null; }
  },

  render(state, app) {
    const s = state;
    const n = s.beads.length;
    const total = gesamt(s);
    const match = s.modus === 'ziel' && total === s.ziel;

    // Zahl-Anzeige
    const gelegtLabel = svg.text(300, 92, T({ de: 'Gelegte Zahl', ru: 'Выложенное число', en: 'Number laid' }),
      { 'font-size': 15, fill: '#777', 'text-anchor': 'middle' });
    const gelegtNum = svg.text(300, 138, String(total),
      { 'font-size': 46, 'font-weight': 'bold', fill: match ? '#2a8a2a' : '#5b4fcf', 'text-anchor': 'middle' });

    let zielSvg = '';
    if (s.modus === 'ziel') {
      zielSvg =
        svg.text(20, 104, T({ de: 'Ziel:', ru: 'Цель:', en: 'Target:' }), { 'font-size': 18, fill: '#444' }) +
        svg.text(20, 136, String(s.ziel), { 'font-size': 30, 'font-weight': 'bold', fill: '#c0392b' });
    }

    // Knöpfe
    const knopfSvg = BTNS.filter(b => b.id !== 'neu' || s.modus === 'ziel')
      .map(b => {
        let aktiv = false;
        if (b.id === 'ziel') aktiv = s.modus === 'ziel';
        if (b.id === 'frei') aktiv = s.modus === 'frei';
        return buttonSvg(b, aktiv, T(b.label));
      }).join('');

    // Mittellinie + Stäbe
    const bar = svg.rect(30, BAR_Y, 540, BAR_H, '#5b4fcf', { rx: 3 });
    let rods = '';
    for (let i = 0; i < n; i++) {
      rods += svg.rect(colX(i, n) - 3, ROD_TOP, 6, ROD_BOT - ROD_TOP, '#d8d4f2', { rx: 3 });
    }

    // Steine (der gerade gezogene wird übersprungen und am Ende oben gezeichnet)
    let beads = '';
    for (let i = 0; i < n; i++) {
      const cx = colX(i, n);
      const upActive = s.beads[i].oben === 1;
      const upY = upActive ? UPPER_ACTIVE : UPPER_AWAY;
      const dragUp = s.drag && s.drag.col === i && s.drag.typ === 'oben';
      if (!dragUp) beads += beadSvg(cx, upY, upActive ? C_UP : C_OFF, upActive ? C_UP_STROKE : C_OFF_STROKE);
      for (let j = 0; j < 4; j++) {
        const lowActive = j < s.beads[i].unten;
        const dragLow = s.drag && s.drag.col === i && s.drag.typ === 'unten' && s.drag.index === j;
        if (!dragLow) {
          beads += beadSvg(cx, unterY(s, i, j), lowActive ? C_DOWN : C_OFF, lowActive ? C_DOWN_STROKE : C_OFF_STROKE);
        }
      }
    }
    if (s.drag) {
      const db = s.beads[s.drag.col];
      const active = s.drag.typ === 'oben'
        ? db.oben === 1
        : s.drag.index < db.unten;
      const fill = active ? (s.drag.typ === 'oben' ? C_UP : C_DOWN) : C_OFF;
      const stroke = active ? (s.drag.typ === 'oben' ? C_UP_STROKE : C_DOWN_STROKE) : '#333';
      beads += beadSvg(s.drag.x, s.drag.y, fill, stroke, { 'stroke-width': 3 });
    }

    // Stellenwerte unter den Spalten
    let stellen = '';
    for (let i = 0; i < n; i++) {
      stellen += svg.text(colX(i, n), ROD_BOT + 24, String(Math.pow(10, n - 1 - i)),
        { 'font-size': 15, fill: '#777', 'text-anchor': 'middle' });
    }

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">
      ${gelegtLabel}${gelegtNum}${zielSvg}${knopfSvg}${bar}${rods}${beads}${stellen}
    </svg>`;
  },

  // ─── Interaktion ───────────────────────────────────────────────────

  _beadBei(state, x, y) {
    const n = state.beads.length;
    for (let i = 0; i < n; i++) {
      const cx = colX(i, n);
      if (x < cx - BW / 2 - 6 || x > cx + BW / 2 + 6) continue;
      const upY = state.beads[i].oben ? UPPER_ACTIVE : UPPER_AWAY;
      if (y >= upY - 3 && y <= upY + BH + 3) return { col: i, typ: 'oben', index: 0 };
      for (let j = 0; j < 4; j++) {
        const ly = unterY(state, i, j);
        if (y >= ly - 3 && y <= ly + BH + 3) return { col: i, typ: 'unten', index: j };
      }
    }
    return null;
  },

  _setzeOben(state, col, aktiv) {
    const bead = state.beads[col];
    if (bead.oben === (aktiv ? 1 : 0)) return false;
    bead.oben = aktiv ? 1 : 0;
    state.zuege++;
    return true;
  },

  _setzeUnter(state, col, index, aktiv) {
    const bead = state.beads[col];
    // Beim Hochschieben wandern die Steine darüber mit, beim Runterziehen die darunter.
    const neu = aktiv ? Math.max(bead.unten, index + 1) : Math.min(bead.unten, index);
    if (neu === bead.unten) return false;
    bead.unten = neu;
    state.zuege++;
    return true;
  },

  _tippeBead(state, b) {
    if (b.typ === 'oben') return this._setzeOben(state, b.col, state.beads[b.col].oben === 0);
    const aktiv = b.index < state.beads[b.col].unten;
    return this._setzeUnter(state, b.col, b.index, !aktiv);
  },

  _dragBead(state, b, dy) {
    if (b.typ === 'oben') {
      if (dy > 20) return this._setzeOben(state, b.col, true);
      if (dy < -20) return this._setzeOben(state, b.col, false);
      return false;
    }
    if (dy < -20) return this._setzeUnter(state, b.col, b.index, true);
    if (dy > 20) return this._setzeUnter(state, b.col, b.index, false);
    return false;
  },

  _nachZug(app, changed) {
    const s = app.state;
    if (changed) {
      if (s.modus === 'ziel' && gesamt(s) === s.ziel) s.fertig = true;
      this._sprechenDebounced(app, String(gesamt(s)));
    }
    app.rerender();
  },

  _sprechen(app) {
    const s = app.state;
    const text = s.modus === 'ziel' ? String(s.ziel) : String(gesamt(s));
    sprechen(text);
  },

  _sprechenDebounced(app, text) {
    const s = app.state;
    if (!(app.get('vorlesen') && app.get('ton'))) return;
    if (s._speakTimer) clearTimeout(s._speakTimer);
    s._speakTimer = setTimeout(() => { sprechen(text); s._speakTimer = null; }, 450);
    if (typeof s._speakTimer?.unref === 'function') s._speakTimer.unref();
  },

  _setzeModus(app, modus) {
    const s = app.state;
    if (s.modus === modus) return;
    s.modus = modus;
    s.fertig = false;
    s.zuege = 0;
    s.drag = null;
    s.beads = Array.from({ length: s.spalten }, () => ({ oben: 0, unten: 0 }));
    if (modus === 'ziel') s.ziel = zufallsZiel(s.spalten);
  },

  _neu(app) {
    const s = app.state;
    s.ziel = zufallsZiel(s.spalten);
    s.fertig = false;
    s.zuege = 0;
    s.drag = null;
    s.beads = Array.from({ length: s.spalten }, () => ({ oben: 0, unten: 0 }));
  },

  onTap(state, x, y, app) {
    const btn = BTNS.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
    if (btn) {
      if (btn.id === 'ziel') this._setzeModus(app, 'ziel');
      else if (btn.id === 'frei') this._setzeModus(app, 'frei');
      else if (btn.id === 'sprechen') this._sprechen(app);
      else if (btn.id === 'neu' && state.modus === 'ziel') this._neu(app);
      app.rerender();
      return;
    }
    if (state.fertig) return;
    const b = this._beadBei(state, x, y);
    if (b) {
      const changed = this._tippeBead(state, b);
      this._nachZug(app, changed);
    }
  },

  onDrag(state, x0, y0, x, y, app) {
    if (state.fertig) return;
    if (!state.drag) {
      const b = this._beadBei(state, x0, y0);
      if (b) state.drag = { col: b.col, typ: b.typ, index: b.index, x, y };
    }
    if (state.drag) {
      state.drag.x = x;
      state.drag.y = y;
      app.rerender();
    }
  },

  onDrop(state, x0, y0, x1, y1, app) {
    const b = state.drag || this._beadBei(state, x0, y0);
    state.drag = null;
    if (!b || state.fertig) { app.rerender(); return; }
    const changed = this._dragBead(state, b, y1 - y0);
    this._nachZug(app, changed);
  },

  evaluate(state, app) {
    if (state.modus === 'ziel' && state.fertig) {
      const opt = optimalZuege(state.ziel, state.spalten);
      return {
        fertig: true,
        text: { de: 'Geschafft!', ru: 'Готово!', en: 'Well done!' },
        wert: `${state.zuege} ${T({ de: 'Züge', ru: 'ходов', en: 'moves' })} · ${T({ de: 'optimal', ru: 'оптимально', en: 'optimal' })} ${opt}`
      };
    }
    return null;
  },

  // Live-Statuszeile unter dem Canvas.
  statusHtml(state, app) {
    return `<div class="ma-result">${T({ de: 'Züge', ru: 'Ходы', en: 'Moves' })}: ${state.zuege}</div>`;
  }
});

export default app;

// Direkt einbinden (apps/s-30-31-kap-2/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
