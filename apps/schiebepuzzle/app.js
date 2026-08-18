/**
 * Das Fünfzehner-Spiel – Schiebepuzzle (3×3 und 4×4, je ein freies Feld).
 * idee-db: 133
 *
 * Buch: Domoryad, „Matematicheskie igry i razvlechenia“ (1961), S. 73–78,
 * § 14 „Das Fünfzehner-Spiel und ähnliche Spiele“.
 *
 * Ein Schiebepuzzle mit 8 (3×3) bzw. 15 (4×4) Plättchen und genau einem
 * freien Feld. Nur Plättchen, die an das freie Feld grenzen, lassen sich
 * dorthin schieben (antippen oder ziehen). Gezählt werden die Züge; nach
 * dem Lösen wird – bei Zahlen/Bildern – die optimale (minimale) Zugzahl
 * angezeigt. Inhalte: Zahlen, eine Bildergeschichte (Brücke zu „Bildergeschichte
 * ordnen“) und die „Chamäleon“-Wort-Variante (Buchstaben eines Worts).
 *
 * Nur lösbare Ausgangsstellungen: Die Startstellung entsteht aus der gelösten
 * Stellung durch eine zufällige, nicht umkehrende Zugfolge. Eine Hilfe-Funktion
 * markiert gierig das nächste sinnvolle Plättchen, ohne die Lösung zu verraten.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 420, VIEW_H = 480;
const MARGIN = 16;
const BOARD_Y = 72;
const HEX = '123456789abcdef';

// Bildergeschichten (Reihenfolge der Bilder in der gelösten Stellung).
const BILDER3 = ['🌰', '🌱', '💧', '🌦️', '🌷', '🐝', '🦋', '🌈'];            // 8 Bilder: Samen → Blume
const BILDER4 = ['🌅', '🚶', '🚌', '🏫', '📚', '✏️', '🍎', '⚽', '🏠', '🍽️', '🛁', '📖', '🌙', '😴', '⭐']; // 15 Bilder: ein Tag

// Inhalt-Auswahl (Sprachneutral über Symbole im Einstellungs-Dropdown).
const MODES = { '🔢': 'zahlen', '🖼️': 'bilder', '🔤': 'wort' };

// Wort-Variante („Chamäleon“): Wortlängen passend zu Feldgröße 3/4.
const WOERTER = {
  de: { 3: 'FÜNFZEHN', 4: 'FÜNFZEHNERSPIEL' },
  en: { 3: 'PATIENCE', 4: 'FORWARDTHINKING' },
  ru: { 3: 'СМЕКАЛКА', 4: 'ЗАНИМАТЕЛЬНОСТЬ' }
};

const T = {
  zuege:     { de: 'Züge', ru: 'ходы', en: 'moves' },
  optimal:   { de: 'Optimal', ru: 'Минимум', en: 'Optimal' },
  du:        { de: 'Du', ru: 'Ты', en: 'You' },
  mischung:  { de: 'gemischt mit', ru: 'перемешано за', en: 'shuffled with' },
  geschafft: { de: 'Geschafft!', ru: 'Готово!', en: 'Solved!' },
  tipp:      { de: 'Tipp', ru: 'Подсказка', en: 'Hint' },
  wort:      { de: 'Wort', ru: 'Слово', en: 'Word' },
  tippAn:    {
    de: 'Zieh das orange markierte Plättchen ins leere Feld.',
    ru: 'Передвинь оранжевую плитку в пустую клетку.',
    en: 'Slide the orange tile into the empty square.'
  },
  nurNachbar: {
    de: 'Nur ein Plättchen direkt neben dem leeren Feld lässt sich bewegen.',
    ru: 'Двигается только плитка рядом с пустой клеткой.',
    en: 'Only a tile directly next to the empty square can move.'
  }
};

function sprache(app) {
  return (app && typeof app.get === 'function') ? (app.get('sprache') || 'de') : 'de';
}
function tt(app, o) {
  const l = sprache(app);
  return (o && (o[l] || o.de)) || '';
}

// ─── Solver (optimale Zugzahl) ──────────────────────────────────────

/** Manhattan + Linear-Konflikt-Heuristik für das 15er-Puzzle. */
const GOAL_POS15 = (() => {
  const s = '123456789abcdef0', pos = {};
  for (let i = 0; i < 16; i++) pos[s[i]] = i;
  return pos;
})();
function h15(s) {
  let man = 0;
  for (let i = 0; i < 16; i++) {
    const ch = s[i];
    if (ch === '0') continue;
    const gi = GOAL_POS15[ch];
    man += Math.abs(Math.floor(i / 4) - Math.floor(gi / 4)) + Math.abs(i % 4 - gi % 4);
  }
  let lc = 0;
  for (let r = 0; r < 4; r++) {
    const tiles = [];
    for (let c = 0; c < 4; c++) {
      const i = r * 4 + c, ch = s[i];
      if (ch === '0') continue;
      const gi = GOAL_POS15[ch];
      if (Math.floor(gi / 4) === r) tiles.push({ c, gc: gi % 4 });
    }
    for (let a = 0; a < tiles.length; a++)
      for (let b = a + 1; b < tiles.length; b++)
        if (tiles[a].c < tiles[b].c && tiles[a].gc > tiles[b].gc) lc++;
  }
  for (let c = 0; c < 4; c++) {
    const tiles = [];
    for (let r = 0; r < 4; r++) {
      const i = r * 4 + c, ch = s[i];
      if (ch === '0') continue;
      const gi = GOAL_POS15[ch];
      if (gi % 4 === c) tiles.push({ r, gr: Math.floor(gi / 4) });
    }
    for (let a = 0; a < tiles.length; a++)
      for (let b = a + 1; b < tiles.length; b++)
        if (tiles[a].r < tiles[b].r && tiles[a].gr > tiles[b].gr) lc++;
  }
  return man + 2 * lc;
}

class MinHeap {
  constructor() { this.h = []; }
  push(k, p) { this.h.push({ k, p }); this._up(this.h.length - 1); }
  _up(i) {
    while (i > 0) {
      const par = (i - 1) >> 1;
      if (this.h[par].p <= this.h[i].p) break;
      [this.h[par], this.h[i]] = [this.h[i], this.h[par]];
      i = par;
    }
  }
  pop() {
    if (!this.h.length) return null;
    const top = this.h[0];
    const last = this.h.pop();
    if (this.h.length) { this.h[0] = last; this._down(0); }
    return top.k;
  }
  _down(i) {
    const n = this.h.length;
    for (;;) {
      const l = i * 2 + 1, r = i * 2 + 2;
      let m = i;
      if (l < n && this.h[l].p < this.h[m].p) m = l;
      if (r < n && this.h[r].p < this.h[m].p) m = r;
      if (m === i) break;
      [this.h[m], this.h[i]] = [this.h[i], this.h[m]];
      i = m;
    }
  }
  get size() { return this.h.length; }
}

/**
 * A* für das 15er-Puzzle (exakte optimale Zugzahl) mit Zeit-/Knotenlimit.
 * Liefert null, wenn das Limit überschritten wird (seltene, schwere Fälle).
 */
function astar15(start) {
  const goal = '123456789abcdef0';
  if (start === goal) return 0;
  const g = new Map([[start, 0]]);
  const open = new MinHeap();
  open.push(start, h15(start));
  const closed = new Set();
  const t0 = Date.now();
  let expanded = 0;
  while (open.size) {
    if (Date.now() - t0 > 2500 || expanded > 400000) return null;
    const cur = open.pop();
    if (cur === goal) return g.get(cur);
    if (closed.has(cur)) continue;
    closed.add(cur);
    expanded++;
    const z = cur.indexOf('0');
    const r = Math.floor(z / 4), c = z % 4;
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr > 3 || nc < 0 || nc > 3) continue;
      const nz = nr * 4 + nc;
      const arr = cur.split('');
      [arr[z], arr[nz]] = [arr[nz], arr[z]];
      const nb = arr.join('');
      if (closed.has(nb)) continue;
      const ng = g.get(cur) + 1;
      if (ng < (g.get(nb) ?? Infinity)) {
        g.set(nb, ng);
        open.push(nb, ng + h15(nb));
      }
    }
  }
  return null;
}

const app = new MiniApp({
  id: 'schiebepuzzle',
  icon: '🧩',
  titel: { de: 'Das Fünfzehner-Spiel', ru: 'Игра в пятнадцать', en: 'The Fifteen Puzzle' },
  anweisung: {
    de: 'Schiebe die Plättchen in das leere Feld, bis alles in der richtigen Reihenfolge liegt. Tippe auf ein Plättchen neben dem leeren Feld – oder ziehe es dorthin.',
    ru: 'Передвигай плитки в пустую клетку, пока всё не встанет по порядку. Коснись плитки рядом с пустой клеткой или перетащи её туда.',
    en: 'Slide the tiles into the empty square until everything is in the correct order. Tap a tile next to the empty square — or drag it there.'
  },
  hilfe: {
    de: 'Das klassische Fünfzehner-Spiel: Ein Feld ist frei, nur seine Nachbarplättchen lassen sich dorthin schieben. Über ⚙️ wählst du die Größe (3×3 mit 8 Plättchen oder 4×4 mit 15) und den Inhalt: Zahlen, eine Bildergeschichte (Samen → Blume bzw. ein Tagesablauf) oder die Buchstaben eines Worts. 💡 markiert ein Plättchen, das du als Nächstes ziehen kannst, ohne die Lösung zu verraten. Jede Stellung ist garantiert lösbar, denn sie entsteht aus der gelösten Stellung durch zufällige Züge. Nach dem Lösen siehst du deine Zugzahl und – bei Zahlen und Bildern – die optimale (minimale) Zugzahl.',
    ru: 'Классическая игра «Пятнашки»: одна клетка свободна, двигаются только соседние с ней плитки. В ⚙️ выбираешь размер (3×3 — 8 плиток или 4×4 — 15) и содержимое: числа, историю в картинках (семя → цветок или распорядок дня) или буквы слова. 💡 показывает плитку, которую стоит подвинуть следующей, не раскрывая решения. Любая позиция гарантированно решаема: она получается из собранной случайными ходами. После решения видно число твоих ходов и — для чисел и картинок — оптимальное (минимальное) число ходов.',
    en: 'The classic Fifteen puzzle: one square is free, only its neighbours can slide into it. In ⚙️ choose the size (3×3 with 8 tiles or 4×4 with 15) and the content: numbers, a picture story (seed → flower or a day’s routine) or the letters of a word. 💡 marks a tile worth moving next, without giving the solution away. Every position is guaranteed solvable, because it is generated from the solved state by random moves. After solving you see your move count and — for numbers and pictures — the optimal (minimum) count.'
  },
  auswertung: 'zuege',
  settingsSchema: {
    feld: {
      def: '3×3', kind: 'select', options: ['3×3', '4×4'],
      label: { de: 'Feldgröße', ru: 'Размер поля', en: 'Grid size' }
    },
    inhalt: {
      def: '🔢', kind: 'select', options: ['🔢', '🖼️', '🔤'],
      label: { de: 'Inhalt', ru: 'Содержимое', en: 'Content' }
    },
    mischen: {
      def: 30, min: 8, max: 80, step: 1,
      label: { de: 'Misch-Züge', ru: 'Ходы перемешивания', en: 'Shuffle moves' }
    }
  },

  // Einstellungen wirken sofort: neue Größe/neuer Inhalt/neue Mischung.
  onSettingsChange(app) { app.reset(); },

  // ─── Zustand ───────────────────────────────────────────────────────
  init(state, app) {
    const n = parseInt(app.get('feld')) || 3;
    const mode = MODES[app.get('inhalt')] || 'zahlen';
    state.n = n;
    state.mode = mode;
    state.goal = this._ziel(n, mode, app);
    state.wort = mode === 'wort' ? state.goal.slice(0, n * n - 1).join('') : null;

    const minMischen = n === 3 ? 8 : 15;
    const mischen = Math.max(minMischen, Math.round(Number(app.get('mischen')) || 30));
    state.mischZuege = mischen;
    state.startBoard = this._mischen(state.goal, n, mischen);
    state.board = state.startBoard.slice();

    state.zuege = 0;
    state.fertig = false;
    state.hintOn = false;
    state.optimal = null;
    state.feedback = null;
  },

  _ziel(n, mode, app) {
    const size = n * n;
    if (mode === 'zahlen') {
      return Array.from({ length: size - 1 }, (_, i) => i + 1).concat([null]);
    }
    if (mode === 'bilder') {
      return (n === 3 ? BILDER3 : BILDER4).concat([null]);
    }
    const l = sprache(app);
    const w = (WOERTER[l] || WOERTER.de)[n];
    return w.split('').concat([null]);
  },

  /** Startstellung durch zufällige, nicht sofort umkehrende Züge erzeugen. */
  _mischen(goal, n, moves) {
    const board = goal.slice();
    let blank = board.indexOf(null);
    let prev = -1;
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let k = 0; k < moves; k++) {
      const r = Math.floor(blank / n), c = blank % n;
      const opts = [];
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
        const idx = nr * n + nc;
        if (idx !== prev) opts.push(idx);
      }
      if (!opts.length) break;
      const pick = opts[Math.floor(Math.random() * opts.length)];
      [board[blank], board[pick]] = [board[pick], board[blank]];
      prev = blank;
      blank = pick;
    }
    // Zufallstreffer auf die gelöste Stellung vermeiden.
    if (this._isSolved({ board, goal })) {
      const r = Math.floor(blank / n), c = blank % n;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= n || nc < 0 || nc >= n) continue;
        const idx = nr * n + nc;
        if (idx !== prev) { [board[blank], board[idx]] = [board[idx], board[blank]]; break; }
      }
    }
    return board;
  },

  _isSolved(state) {
    for (let i = 0; i < state.board.length; i++) {
      if (state.board[i] !== state.goal[i]) return false;
    }
    return true;
  },

  // ─── Rendering ────────────────────────────────────────────────────
  render(state, app) {
    const n = state.n;
    const boardW = VIEW_W - 2 * MARGIN;
    const cell = boardW / n;
    const p = [];
    p.push(svg.rect(0, 0, VIEW_W, VIEW_H, '#fafaff'));

    // Tipp-Knopf (oben links) und Zugzähler (oben rechts).
    p.push(svg.rect(10, 12, 120, 44, state.hintOn ? '#fff3e0' : '#ffffff',
      { rx: 10, stroke: state.hintOn ? '#ff9800' : '#ccc', 'stroke-width': 2 }));
    p.push(svg.text(22, 42, '💡 ' + tt(app, T.tipp),
      { 'font-size': 20, fill: '#333', 'font-weight': 'bold' }));
    p.push(svg.text(VIEW_W - 10, 42, `${tt(app, T.zuege)}: ${state.zuege}`,
      { 'font-size': 22, fill: '#5b4fcf', 'font-weight': 'bold', 'text-anchor': 'end' }));

    const hintIdx = state.hintOn && !state.fertig ? this._hintIdx(state) : null;

    // Spielfeld-Rahmen.
    p.push(svg.rect(MARGIN, BOARD_Y, boardW, boardW, '#eef0f7', { rx: 12 }));

    for (let i = 0; i < state.board.length; i++) {
      const r = Math.floor(i / n), c = i % n;
      const x = MARGIN + c * cell, y = BOARD_Y + r * cell;
      const v = state.board[i];
      const blank = v === null;
      const richtig = !blank && state.goal[i] === v;

      let fill, textFill;
      if (state.mode === 'bilder') {
        fill = richtig ? '#e8f5e9' : '#ffffff';
        textFill = '#333';
      } else {
        fill = richtig ? '#43a047' : '#6c63ff';
        textFill = '#fff';
      }
      const stroke = hintIdx === i ? '#ff9800' : (blank ? '#c9cbd8' : '#5b4fcf');
      const sw = hintIdx === i ? 5 : 1.5;
      p.push(svg.rect(x + 3, y + 3, cell - 6, cell - 6, blank ? '#e6e8f2' : fill,
        { rx: 10, stroke, 'stroke-width': sw }));

      if (!blank) {
        const fontSize = state.mode === 'zahlen' ? cell * 0.42 : cell * 0.5;
        p.push(svg.text(x + cell / 2, y + cell / 2 + fontSize * 0.35, String(v),
          {
            'font-size': fontSize, fill: textFill, 'text-anchor': 'middle',
            'font-weight': state.mode === 'zahlen' ? 'bold' : 'normal'
          }));
      }
    }

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">${p.join('')}</svg>`;
  },

  // ─── Interaktion ──────────────────────────────────────────────────
  _tileBei(state, x, y) {
    const n = state.n;
    const cell = (VIEW_W - 2 * MARGIN) / n;
    const c = Math.floor((x - MARGIN) / cell);
    const r = Math.floor((y - BOARD_Y) / cell);
    if (c < 0 || c >= n || r < 0 || r >= n) return null;
    return r * n + c;
  },
  _nachbarn(idx, n) {
    const r = Math.floor(idx / n), c = idx % n, out = [];
    if (r > 0) out.push(idx - n);
    if (r < n - 1) out.push(idx + n);
    if (c > 0) out.push(idx - 1);
    if (c < n - 1) out.push(idx + 1);
    return out;
  },
  _adjacent(a, b, n) {
    const ar = Math.floor(a / n), ac = a % n, br = Math.floor(b / n), bc = b % n;
    return (ar === br && Math.abs(ac - bc) === 1) || (ac === bc && Math.abs(ar - br) === 1);
  },
  _fehlStand(state) {
    let m = 0;
    for (let i = 0; i < state.board.length; i++) {
      if (state.board[i] !== null && state.board[i] !== state.goal[i]) m++;
    }
    return m;
  },
  /** Gieriger Ein-Zug-Tipp: der Zug, der die meisten Plättchen richtig stellt. */
  _hintIdx(state) {
    const n = state.n;
    const blank = state.board.indexOf(null);
    let best = -1, bestScore = Infinity;
    for (const idx of this._nachbarn(blank, n)) {
      const b = state.board;
      [b[blank], b[idx]] = [b[idx], b[blank]];
      const score = this._fehlStand(state);
      [b[blank], b[idx]] = [b[idx], b[blank]];
      if (score < bestScore) { bestScore = score; best = idx; }
    }
    return best;
  },

  _slide(state, idx, app) {
    if (state.fertig) return false;
    const n = state.n;
    const blank = state.board.indexOf(null);
    if (!this._adjacent(idx, blank, n)) return false;
    [state.board[blank], state.board[idx]] = [state.board[idx], state.board[blank]];
    state.zuege++;
    if (this._isSolved(state)) {
      state.fertig = true;
      state.optimal = this._optimal(state);
    }
    return true;
  },

  _optimal(state) {
    // Bei Wörtern mit doppelten Buchstaben ist die „optimale“ Zugzahl nicht
    // eindeutig – dort zeigen wir stattdessen die Misch-Zugzahl als Referenz.
    if (state.mode === 'wort') return null;
    const enc = this._encode(state.startBoard, state.goal);
    if (state.n === 3) {
      this._prepare3();
      return this._dist3.get(enc) ?? null;
    }
    return astar15(enc);
  },

  _encode(board, goal) {
    const rank = new Map();
    for (let i = 0; i < goal.length; i++) if (goal[i] !== null) rank.set(goal[i], i + 1);
    return board.map(v => (v === null ? '0' : HEX[rank.get(v) - 1])).join('');
  },

  /** BFS über alle erreichbaren 8er-Puzzle-Stellungen (181.440), einmalig. */
  _prepare3() {
    if (this._dist3) return;
    const goal = '123456780';
    const dist = new Map([[goal, 0]]);
    const q = [goal];
    let head = 0;
    while (head < q.length) {
      const cur = q[head++];
      const d = dist.get(cur);
      const z = cur.indexOf('0');
      const r = Math.floor(z / 3), c = z % 3;
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
        const nz = nr * 3 + nc;
        const arr = cur.split('');
        [arr[z], arr[nz]] = [arr[nz], arr[z]];
        const nxt = arr.join('');
        if (!dist.has(nxt)) { dist.set(nxt, d + 1); q.push(nxt); }
      }
    }
    this._dist3 = dist;
  },

  onTap(state, x, y, app) {
    if (state.fertig) return;
    if (x >= 10 && x <= 130 && y >= 12 && y <= 56) {
      state.hintOn = !state.hintOn;
      state.feedback = state.hintOn ? 'tippAn' : null;
      app.rerender();
      return;
    }
    const idx = this._tileBei(state, x, y);
    if (idx == null || state.board[idx] === null) return;
    if (this._slide(state, idx, app)) state.feedback = null;
    else state.feedback = 'nurNachbar';
    app.rerender();
  },

  onDrop(state, x0, y0, x1, y1, app) {
    if (state.fertig) return;
    const from = this._tileBei(state, x0, y0);
    const to = this._tileBei(state, x1, y1);
    if (from == null) { app.rerender(); return; }
    const blank = state.board.indexOf(null);
    if (to === blank && this._adjacent(from, blank, state.n)) {
      if (this._slide(state, from, app)) state.feedback = null;
    } else if (to != null && to !== from) {
      state.feedback = 'nurNachbar';
    }
    app.rerender();
  },

  actions: {
    // Programmatisch/Test: Plättchen an Index `idx` ins leere Feld schieben.
    move(state, idx, app) { this._slide(state, idx, app); }
  },

  // ─── Auswertung ───────────────────────────────────────────────────
  statusHtml(state, app) {
    const parts = [];
    if (state.mode === 'wort' && state.wort) parts.push(`${tt(app, T.wort)}: <b>${state.wort}</b>`);
    if (state.feedback) parts.push(tt(app, T[state.feedback]) || '');
    return parts.length ? `<div class="ma-result">${parts.join(' · ')}</div>` : '';
  },

  evaluate(state, app) {
    if (!state.fertig) return null;
    let wert = `${tt(app, T.du)}: ${state.zuege} ${tt(app, T.zuege)}`;
    if (state.optimal != null) wert += ` · ${tt(app, T.optimal)}: ${state.optimal}`;
    else wert += ` · ${tt(app, T.mischung)}: ${state.mischZuege}`;
    return { fertig: true, text: T.geschafft, wert };
  }
});

export default app;

// Direkt einbinden (apps/s-73-78-fuenfzehner-spiel/index.html) oder als Modul:
export function mount(root) { app.mount(root); }

// Für Smoke-Tests: Solver + Heuristik zugänglich machen.
export { astar15, h15 };
