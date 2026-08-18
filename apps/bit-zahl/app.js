/**
 * Null-Eins-Wandler – Binärzahl in Dezimalzahl umwandeln (Rechenspiel).
 * idee-db: 121
 *
 * Buch: Dal_E_N_-_Elektronika_Dlya_Detey_-_2017, S. 188–191, Kap. 9
 * „Как схемы понимают единицы и нули“, Projekt № 18
 * „Преобразование двоичного числа в десятичное“.
 *
 * Zusatzanweisung (hat Vorrang): Eine Zielzahl (je nach Stufe bis 255) wird
 * vorgegeben. Das Kind stellt sie mit Bit-Kästchen ein, die als Schalter
 * (Icons) gestaltet sind. Unter den Kästchen steht die laufende Summe:
 * 0+0+0+0…=0, bei gesetztem Bit dessen Wert. Kippt ein Bit, ändert sich die
 * Summe – das Kind entscheidet, ob es „mehr“ oder „weniger“ braucht.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 640, VIEW_H = 360;
const CELL_W = 68, CELL_H = 104, GAP = 8, CELL_Y = 118;

const T = {
  ziel:    { de: 'Ziel',    ru: 'Цель',          en: 'Target' },
  mehr:    { de: 'mehr',    ru: 'больше',        en: 'more' },
  weniger: { de: 'weniger', ru: 'меньше',        en: 'less' },
  richtig: { de: 'Genau getroffen!', ru: 'Точно в цель!', en: 'Right on target!' },
  klicks:  { de: 'Klicks',  ru: 'кликов',        en: 'taps' }
};

function sprache(app) {
  return (app && typeof app.get === 'function') ? (app.get('sprache') || 'de') : 'de';
}
function tt(app, o) {
  const l = sprache(app);
  return (o && (o[l] || o.de)) || '';
}

/** Stellenwerte von links (MSB) nach rechts (LSB): 2^(n−1) … 1. */
function werte(stellen) {
  const v = [];
  for (let i = 0; i < stellen; i++) v.push(Math.pow(2, stellen - 1 - i));
  return v;
}

const app = new MiniApp({
  id: 'bit-zahl',
  icon: '💡',
  titel: { de: 'Null-Eins-Wandler', ru: 'Ноль-один-преобразователь', en: 'Zero-One Converter' },
  anweisung: {
    de: 'Stelle die Zielzahl mit den Bits ein. Tippe ein Kästchen an, um 0 in 1 (oder zurück) zu verwandeln. Die Summe darunter zeigt, ob du mehr oder weniger brauchst.',
    ru: 'Установи целевое число с помощью битов. Коснись клетки, чтобы превратить 0 в 1 (или обратно). Сумма внизу показывает, нужно ли больше или меньше.',
    en: 'Set the target number with the bits. Tap a box to turn 0 into 1 (or back). The sum below shows whether you need more or less.'
  },
  hilfe: {
    de: 'Jedes Kästchen hat einen Stellenwert: 1, 2, 4, 8, 16 … – jeder Wert ist doppelt so groß wie der vorherige. Eine 1 heißt „zählt“, eine 0 heißt „zählt nicht“. Die Summe aller eingeschalteten Werte ergibt deine Zahl. Ist die Summe zu klein, schalte einen größeren Wert ein (mehr); ist sie zu groß, schalte einen Wert aus (weniger).',
    ru: 'У каждой клетки свой вес: 1, 2, 4, 8, 16 … — каждый следующий вдвое больше предыдущего. 1 значит «считается», 0 — «не считается». Сумма всех включённых весов даёт твоё число. Если сумма мала, включи больший вес (больше); если велика — выключи вес (меньше).',
    en: 'Each box has a place value: 1, 2, 4, 8, 16 … — every value is twice the one before. A 1 means “counts”, a 0 means “does not count”. The sum of all switched-on values is your number. If the sum is too small, switch on a larger value (more); if it is too big, switch a value off (less).'
  },
  auswertung: 'zuege',
  settingsSchema: {
    stellen: {
      def: 8, min: 4, max: 8, step: 1,
      label: { de: 'Stellen (Bits)', ru: 'Разряды (биты)', en: 'Places (bits)' }
    }
  },

  // Stellen-Zahl ändern → neues Spiel mit passendem Ziel (sonst Zustand inkonsistent).
  onSettingsChange(app) { app.reset(); },

  init(state, app) {
    state.stellen = app.get('stellen');
    // Ziel zwischen 1 und 2^n − 1 (nie 0, damit wirklich etwas einzustellen ist).
    state.ziel = 1 + Math.floor(Math.random() * (Math.pow(2, state.stellen) - 1));
    state.bits = Array(state.stellen).fill(0);
    state.zuege = 0;
    state.fertig = false;
  },

  _sum(state) {
    const v = werte(state.stellen);
    return state.bits.reduce((s, b, i) => s + b * v[i], 0);
  },

  render(state, app) {
    const v = werte(state.stellen);
    const n = state.stellen;
    const totalW = n * CELL_W + (n - 1) * GAP;
    const startX = Math.round((VIEW_W - totalW) / 2);
    const p = [svg.rect(0, 0, VIEW_W, VIEW_H, '#fafaff')];

    // Zielanzeige
    p.push(svg.text(VIEW_W / 2, 30, tt(app, T.ziel),
      { 'font-size': 16, fill: '#777', 'text-anchor': 'middle' }));
    p.push(svg.text(VIEW_W / 2, 86, String(state.ziel),
      { 'font-size': 48, 'font-weight': 'bold', fill: '#5b4fcf', 'text-anchor': 'middle' }));

    // Bit-Kästchen (Schalter-Icons): oben der Stellenwert, darunter 0/1.
    state.bitRects = [];
    for (let i = 0; i < n; i++) {
      const x = startX + i * (CELL_W + GAP);
      const on = state.bits[i] === 1;
      state.bitRects.push({ i, x, y: CELL_Y, w: CELL_W, h: CELL_H });
      p.push(svg.rect(x, CELL_Y, CELL_W, CELL_H, '#ffffff', {
        rx: 12, stroke: on ? '#2a8a2a' : '#d8d4f0', 'stroke-width': on ? 3 : 2
      }));
      p.push(svg.text(x + CELL_W / 2, CELL_Y + 30, String(v[i]), {
        'font-size': 20, 'font-weight': 'bold', fill: '#333', 'text-anchor': 'middle'
      }));
      const cy = CELL_Y + 74;
      p.push(svg.circle(x + CELL_W / 2, cy, 24, on ? '#34D399' : '#e9e9f2', {
        stroke: on ? '#1f9d6e' : '#c9c9d8', 'stroke-width': 2
      }));
      p.push(svg.text(x + CELL_W / 2, cy + 6, on ? '1' : '0', {
        'font-size': 20, 'font-weight': 'bold', fill: on ? '#fff' : '#999', 'text-anchor': 'middle'
      }));
    }

    // Summenzeile: 0 bei aus, Wert bei an, mit + dazwischen.
    const sum = this._sum(state);
    const terms = state.bits.map((b, i) => (b ? String(v[i]) : '0'));
    p.push(svg.text(VIEW_W / 2, 274, `${terms.join('+')} = ${sum}`, {
      'font-size': n <= 6 ? 24 : 20, 'font-weight': 'bold', fill: '#222', 'text-anchor': 'middle'
    }));

    // Entscheidungshilfe: mehr / weniger / richtig.
    let hint, fill;
    if (sum < state.ziel) { hint = '▲ ' + tt(app, T.mehr); fill = '#d97706'; }
    else if (sum > state.ziel) { hint = '▼ ' + tt(app, T.weniger); fill = '#d97706'; }
    else { hint = '✓ ' + tt(app, T.richtig); fill = '#2a8a2a'; }
    p.push(svg.text(VIEW_W / 2, 330, hint, {
      'font-size': 24, 'font-weight': 'bold', fill, 'text-anchor': 'middle'
    }));

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">${p.join('')}</svg>`;
  },

  onTap(state, x, y, app) {
    if (state.fertig) return;
    const hit = (state.bitRects || []).find(r =>
      x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
    if (!hit) return;
    this._kippe(state, hit.i, app);
  },

  _kippe(state, i, app) {
    state.bits[i] = state.bits[i] ? 0 : 1;
    state.zuege++;
    if (this._sum(state) === state.ziel) state.fertig = true;
    app.rerender();
  },

  actions: {
    // Programmatisch/Test: Bit i kippen.
    toggle(state, i, app) {
      if (state.fertig || i < 0 || i >= state.stellen) return;
      this._kippe(state, i, app);
    },
    neu(state, app) {
      app.init(state, app);
      app.rerender();
    }
  },

  statusHtml(state, app) {
    return `<div class="ma-result">${tt(app, T.klicks)}: ${state.zuege}</div>`;
  },

  evaluate(state, app) {
    if (state.fertig) {
      return {
        fertig: true,
        text: T.richtig,
        wert: `${state.zuege} ${tt(app, T.klicks)}`
      };
    }
    return null;
  }
});

export default app;

// Direkt einbinden (apps/s-188-191-kap-9-projekt-18/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
