/**
 * Symmetrie: Finde die Figur – Achsensymmetrie (Spiegelsymmetrie) erkennen.
 * idee-db: 88
 *
 * Buch: Besedy_Po_Fizike_chast_1__1974_Bludov, S. 151–157,
 * „Симметрия и энергетика кристаллов“.
 *
 * Das Kind sieht fünf aus Zellen gebaute Figuren (wie digitale Tintenkleckse
 * bzw. Kristall-Bausteine). Nur EINE davon ist spiegelsymmetrisch: Eine
 * senkrechte Achse teilt sie in zwei deckungsgleiche Hälften. Das Kind muss
 * die symmetrische Figur antippen. Falsche Antworten werden rot markiert und
 * als Fehler gezählt; bei der richtigen Figur erscheint die gestrichelte
 * Spiegelachse.
 *
 * Jede Runde wird neu aus einem Pool symmetrischer und asymmetrischer Figuren
 * zusammengestellt und gemischt, damit man immer wieder üben kann (🔁).
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 780, VIEW_H = 280;
const CARD_W = 140, CARD_H = 212, GAP = 12;
const START_X = Math.round((VIEW_W - (5 * CARD_W + 4 * GAP)) / 2);
const CARD_Y = 20;

// 5×5-Raster, aus dem jede Figur gebaut wird (wie Bausteine im Kristallmodell).
const GRID = 5, CELL = 24, CGAP = 2;
const FIG_W = GRID * CELL + (GRID - 1) * CGAP; // 128
const FIG_X = Math.round((CARD_W - FIG_W) / 2);
const FIG_Y = 18;

const ZELLE = '#6c63ff';

/**
 * Spiegelachse ist die senkrechte Mittelspalte (Spalte 2 bei 0..4):
 * eine Zelle "r,c" wird zu "r,4-c".
 */
function spiegel(zelle) {
  const [r, c] = zelle.split(',').map(Number);
  return `${r},${4 - c}`;
}
function istSymmetrisch(zellen) {
  const s = new Set(zellen);
  return [...s].every(z => s.has(spiegel(z)));
}

/** Symmetrische Figuren (Spiegelachse senkrecht, Spalte 2). */
const SYM = [
  // Raute (Diamant)
  ['0,2', '1,1', '1,2', '1,3', '2,0', '2,1', '2,2', '2,3', '2,4', '3,1', '3,2', '3,3', '4,2'],
  // Sanduhr / Schmetterling
  ['0,1', '0,3', '1,0', '1,2', '1,4', '2,0', '2,1', '2,3', '2,4', '3,1', '3,3', '4,2'],
  // Pfeil nach unten
  ['0,2', '1,2', '2,1', '2,2', '2,3', '3,0', '3,1', '3,3', '3,4', '4,2'],
  // Kreuz (Plus)
  ['0,2', '1,2', '2,0', '2,1', '2,2', '2,3', '2,4', '3,2', '4,2'],
  // Tanne / Weihnachtsbaum
  ['0,2', '1,1', '1,2', '1,3', '2,0', '2,1', '2,2', '2,3', '2,4', '3,2', '4,2']
];

/** Asymmetrische Figuren (keine Spiegelachse). */
const ASYM = [
  // Raute mit fehlender Ecke links unten
  ['0,2', '1,1', '1,2', '1,3', '2,1', '2,2', '2,3', '2,4', '3,1', '3,2', '3,3', '4,2'],
  // Zickzack (Treppe)
  ['0,0', '0,1', '1,1', '1,2', '2,2', '2,3', '3,3', '3,4', '4,4'],
  // L-Form
  ['0,0', '0,1', '0,2', '0,3', '0,4', '1,0', '2,0', '3,0', '4,0'],
  // Treppe in die andere Richtung
  ['0,3', '0,4', '1,2', '1,3', '2,1', '2,2', '3,0', '3,1', '4,0'],
  // Schmetterling mit fehlendem Flügel links oben
  ['0,1', '0,3', '1,2', '1,4', '2,0', '2,1', '2,3', '2,4', '3,1', '3,3', '4,2']
];

const T = {
  fehler:   { de: 'Fehler', ru: 'ошибки', en: 'mistakes' },
  richtig:  { de: 'Richtig! Diese Figur ist spiegelsymmetrisch.', ru: 'Правильно! Эта фигура симметрична.', en: 'Correct! This shape is mirror-symmetric.' },
  falsch:   { de: 'Diese Figur ist nicht symmetrisch. Versuch es weiter.', ru: 'Эта фигура не симметрична. Попробуй ещё раз.', en: 'This shape is not symmetric. Try again.' },
  geschafft: { de: 'Richtig! Die gestrichelte Linie ist die Spiegelachse.', ru: 'Правильно! Пунктирная линия — ось симметрии.', en: 'Correct! The dashed line is the mirror axis.' }
};

function sprache(app) {
  return (app && typeof app.get === 'function') ? (app.get('sprache') || 'de') : 'de';
}
function tt(app, o) {
  const l = sprache(app);
  return (o && (o[l] || o.de)) || '';
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const app = new MiniApp({
  id: 'symmetrie',
  icon: '🦋',
  titel: { de: 'Symmetrie: Finde die Figur', ru: 'Симметрия: найди фигуру', en: 'Symmetry: Find the Shape' },
  anweisung: {
    de: 'Fünf Figuren – nur eine ist spiegelsymmetrisch. Tippe die Figur an, die sich durch eine Achse in zwei gleiche Hälften teilen lässt.',
    ru: 'Пять фигур — только одна симметрична. Коснись фигуры, которую ось делит на две одинаковые половины.',
    en: 'Five shapes — only one is mirror-symmetric. Tap the shape that an axis splits into two equal halves.'
  },
  hilfe: {
    de: 'Eine Figur ist spiegelsymmetrisch (achsensymmetrisch), wenn du sie so falten kannst, dass beide Hälften genau aufeinander liegen. Stell dir einen Spiegel an der Achse vor: links und rechts müssen gleich sein. Prüfe bei jeder Figur, ob eine senkrechte Achse beide Seiten deckungsgleich macht, und tippe dann die richtige an. Am Ende zeigt die gestrichelte Linie die Spiegelachse.',
    ru: 'Фигура зеркально-симметрична (осесимметрична), если её можно сложить так, чтобы обе половинки точно совпали. Представь зеркало на оси: слева и справа должно быть одинаково. Проверь у каждой фигуры, делит ли вертикальная ось её на две одинаковые части, и коснись нужной. В конце пунктирная линия покажет ось симметрии.',
    en: 'A shape is mirror-symmetric (line-symmetric) if you can fold it so both halves match exactly. Imagine a mirror on the axis: left and right must look the same. For each shape, check whether a vertical axis makes both sides match, then tap the correct one. At the end, the dashed line shows the mirror axis.'
  },
  auswertung: 'punkte',
  settingsSchema: {},

  // ─── Zustand ───────────────────────────────────────────────────────
  init(state, app) {
    state.figures = this._erzeugeFiguren();
    state.found = false;
    state.wrong = new Set();
    state.fehler = 0;
    state.feedback = null;
  },

  /** 5 Figuren: genau 1 symmetrische + 4 asymmetrische, gemischt. */
  _erzeugeFiguren() {
    const sym = { zellen: shuffle(SYM)[0], symmetrisch: true };
    const asym = shuffle(ASYM).slice(0, 4).map(zellen => ({ zellen, symmetrisch: false }));
    return shuffle([sym, ...asym]);
  },

  // ─── Rendering ────────────────────────────────────────────────────
  render(state, app) {
    const p = [svg.rect(0, 0, VIEW_W, VIEW_H, '#fafaff')];
    state.cardRects = [];

    state.figures.forEach((fig, i) => {
      const cardX = START_X + i * (CARD_W + GAP);
      const rect = { index: i, x: cardX, y: CARD_Y, w: CARD_W, h: CARD_H };
      state.cardRects.push(rect);

      const falsch = state.wrong.has(i);
      const richtig = state.found && fig.symmetrisch;
      const fill = richtig ? '#eef8ee' : falsch ? '#fff0f0' : '#ffffff';
      const stroke = richtig ? '#2a8a2a' : falsch ? '#e03131' : '#d8d4f0';
      p.push(svg.rect(cardX, CARD_Y, CARD_W, CARD_H, fill, { rx: 12, stroke, 'stroke-width': 2 }));

      // Figur aus Zellen (Bausteine) zeichnen.
      const fx = cardX + FIG_X, fy = CARD_Y + FIG_Y;
      for (const z of fig.zellen) {
        const [r, c] = z.split(',').map(Number);
        p.push(svg.rect(fx + c * (CELL + CGAP), fy + r * (CELL + CGAP), CELL, CELL, ZELLE, { rx: 5 }));
      }

      // Nach dem Finden: Spiegelachse einblenden.
      if (richtig) {
        const ax = fx + FIG_W / 2;
        p.push(svg.el('line', {
          x1: ax, y1: fy - 8, x2: ax, y2: fy + FIG_W + 8,
          stroke: '#2a8a2a', 'stroke-width': 3, 'stroke-dasharray': '6 5'
        }));
      }

      // Falsche Antworten rot durchstreichen.
      if (falsch) {
        p.push(svg.el('line', { x1: cardX + 10, y1: CARD_Y + 10, x2: cardX + 32, y2: CARD_Y + 32, stroke: '#e03131', 'stroke-width': 5, 'stroke-linecap': 'round' }));
        p.push(svg.el('line', { x1: cardX + 32, y1: CARD_Y + 10, x2: cardX + 10, y2: CARD_Y + 32, stroke: '#e03131', 'stroke-width': 5, 'stroke-linecap': 'round' }));
      }

      // Buchstabe als Referenz.
      p.push(svg.text(cardX + CARD_W / 2, CARD_Y + CARD_H - 18, String.fromCharCode(65 + i),
        { 'font-size': 20, fill: '#777', 'text-anchor': 'middle', 'font-weight': 'bold' }));
    });

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">${p.join('')}</svg>`;
  },

  // ─── Interaktion ──────────────────────────────────────────────────
  onTap(state, x, y, app) {
    if (state.found) return;
    const hit = (state.cardRects || []).find(r =>
      x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
    if (!hit) return;

    const fig = state.figures[hit.index];
    if (fig.symmetrisch) {
      state.found = true;
      state.feedback = 'richtig';
    } else {
      state.wrong.add(hit.index);
      state.fehler++;
      state.feedback = 'falsch';
    }
    app.rerender();
  },

  // ─── Auswertung ───────────────────────────────────────────────────
  statusHtml(state, app) {
    let line = `${tt(app, T.fehler)}: ${state.fehler}`;
    if (state.feedback) line += `<br>${tt(app, T[state.feedback])}`;
    return `<div class="ma-result">${line}</div>`;
  },

  evaluate(state, app) {
    if (state.found) {
      return {
        fertig: true,
        text: T.geschafft,
        wert: `${state.fehler} ${tt(app, T.fehler)}`
      };
    }
    return null;
  }
});

export default app;

// Für Smoke-Tests: die Figuren-Pools prüfen können.
export { SYM, ASYM, istSymmetrisch };

// Direkt einbinden (apps/s-151-157/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
