/**
 * Stäbchen-Knobelei – virtuelle Streichholzspiele.
 * idee-db: 63
 *
 * Aus der Ideen-DB (Beitrag 63, Pchyolko/Polyak, Arithmetik 3. Klasse 1955,
 * S. 131 „Занимательные задачи“, Nr. 1169): Aus zwölf Stäbchen werden vier
 * Quadrate gelegt, dann nimmt man Stäbchen weg oder legt sie um, damit andere
 * Anzahlen entstehen. Die App macht daraus ein Tangram-artiges Modul mit
 * virtuellen Stäbchen: Eine Startfigur liegt vor, ein Ziel ist vorgegeben
 * („Nimm zwei Stäbchen weg …“, „Lege drei Stäbchen um …“). Das Kind tippt
 * Stäbchen an, um sie zu entfernen oder zu versetzen. Gezählt werden die Züge
 * und mit der Mindestzahl verglichen; ↩ nimmt den letzten Zug zurück.
 *
 * Die Stufen steigern sich von „wegnehmen“ über „umlegen“ bis zu einer frei
 * zu bauenden Figur. Alle Figuren liegen auf einem 4×4-Einheitsraster; ein
 * Quadrat zählt, wenn seine vier Seiten vollständig aus Stäbchen bestehen.
 */
import { MiniApp, svg } from '../_framework/framework.js';

// ─── Geometrie ──────────────────────────────────────────────────────
const W = 4, H = 4;               // Rasterzellen
const UNIT = 56;                  // eine Stäbchenlänge in viewBox-Einheiten
const VIEW_W = 600, VIEW_H = 470;
const BX = VIEW_W / 2 - (W / 2) * UNIT;   // Gitterpunkt (0,0)
const BY = 250 - (H / 2) * UNIT;

const px = (x) => BX + x * UNIT;
const py = (y) => BY + y * UNIT;

/** Alle möglichen Einheits-Segmente auf dem Brett (h<zeile>,<spalte> / v<zeile>,<spalte>). */
const BOARD_SEGS = [];
for (let y = 0; y <= H; y++) for (let x = 0; x < W; x++) BOARD_SEGS.push(`h${y},${x}`);
for (let x = 0; x <= W; x++) for (let y = 0; y < H; y++) BOARD_SEGS.push(`v${y},${x}`);

function keyPts(k) {
  const m = k.match(/([hv])(\d+),(\d+)/);
  const t = m[1], y = +m[2], x = +m[3];
  return t === 'h' ? [x, y, x + 1, y] : [x, y, x, y + 1];
}
function segXY(k) {
  const [x1, y1, x2, y2] = keyPts(k);
  return [px(x1), py(y1), px(x2), py(y2)];
}
function distSeg(x, y, k) {
  const [x1, y1, x2, y2] = segXY(k);
  const dx = x2 - x1, dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((x - x1) * dx + (y - y1) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

// ─── Startfiguren ───────────────────────────────────────────────────
/** 2×2-Gitter: zwölf Stäbchen, vier kleine (und ein großes) Quadrat. */
function start22() {
  const s = [];
  for (let y = 1; y <= 3; y++) for (let x = 1; x < 3; x++) s.push(`h${y},${x}`);
  for (let x = 1; x <= 3; x++) for (let y = 1; y < 3; y++) s.push(`v${y},${x}`);
  return s;
}
/** Kreuz aus fünf Quadraten: sechzehn Stäbchen, fünf Quadrate. */
function startKreuz() {
  const cells = [[2, 2], [2, 1], [2, 3], [1, 2], [3, 2]];
  const s = new Set();
  for (const [cx, cy] of cells) {
    s.add(`h${cy},${cx}`); s.add(`h${cy + 1},${cx}`);
    s.add(`v${cy},${cx}`); s.add(`v${cy},${cx + 1}`);
  }
  return [...s];
}

// ─── Auswertung (Quadrate zählen) ───────────────────────────────────
function squareList(S) {
  const list = [];
  for (let size = 1; size <= Math.min(W, H); size++) {
    for (let y = 0; y + size <= H; y++) {
      for (let x = 0; x + size <= W; x++) {
        let ok = true;
        for (let i = 0; i < size; i++) {
          if (!S.has(`h${y},${x + i}`) || !S.has(`h${y + size},${x + i}`) ||
              !S.has(`v${y + i},${x}`) || !S.has(`v${y + i},${x + size}`)) ok = false;
        }
        if (ok) list.push({ x, y, size });
      }
    }
  }
  return list;
}
function counts(S) {
  const l = squareList(S);
  return { klein: l.filter(s => s.size === 1).length, gross: l.filter(s => s.size > 1).length };
}

// ─── Aufgaben ───────────────────────────────────────────────────────
const MODUS_HINWEIS = {
  wegnehmen: {
    de: 'Tippe ein Stäbchen an, um es wegzunehmen',
    ru: 'Коснись палочки, чтобы убрать её',
    en: 'Tap a stick to remove it'
  },
  umlegen: {
    de: 'Tippe ein Stäbchen an, dann eine freie Stelle',
    ru: 'Коснись палочки, затем свободного места',
    en: 'Tap a stick, then an empty spot'
  },
  frei: {
    de: 'Tippe eine freie Stelle (legen) oder ein Stäbchen (entfernen)',
    ru: 'Коснись свободного места (положить) или палочки (убрать)',
    en: 'Tap an empty spot (place) or a stick (remove)'
  }
};

const LEVELS = [
  {
    id: 'weg-2', modus: 'wegnehmen', start: start22(), n: 2, min: 2,
    goal: { klein: 2, gross: 0 },
    ziel: { de: 'Nimm 2 Stäbchen weg → 2 Quadrate', ru: 'Убери 2 палочки → 2 квадрата', en: 'Remove 2 sticks → 2 squares' }
  },
  {
    id: 'weg-3', modus: 'wegnehmen', start: start22(), n: 3, min: 3,
    goal: { klein: 1, gross: 0 },
    ziel: { de: 'Nimm 3 Stäbchen weg → 1 Quadrat', ru: 'Убери 3 палочки → 1 квадрат', en: 'Remove 3 sticks → 1 square' }
  },
  {
    id: 'weg-4', modus: 'wegnehmen', start: start22(), n: 4, min: 4,
    goal: { klein: 0, gross: 1 },
    ziel: { de: 'Nimm 4 Stäbchen weg → 1 großes Quadrat', ru: 'Убери 4 палочки → 1 большой квадрат', en: 'Remove 4 sticks → 1 big square' }
  },
  {
    id: 'kreuz-weg', modus: 'wegnehmen', start: startKreuz(), n: 2, min: 2,
    goal: { klein: 4, gross: 0 },
    ziel: { de: 'Nimm 2 Stäbchen weg → 4 Quadrate', ru: 'Убери 2 палочки → 4 квадрата', en: 'Remove 2 sticks → 4 squares' }
  },
  {
    id: 'um-3', modus: 'umlegen', start: start22(), n: 3, min: 3,
    goal: { klein: 3, gross: 0 },
    ziel: { de: 'Lege 3 Stäbchen um → 3 Quadrate', ru: 'Переложи 3 палочки → 3 квадрата', en: 'Move 3 sticks → 3 squares' }
  },
  {
    id: 'kreuz-um', modus: 'umlegen', start: startKreuz(), n: 2, min: 2,
    goal: { klein: 4, gross: 0 },
    ziel: { de: 'Lege 2 Stäbchen um → 4 Quadrate', ru: 'Переложи 2 палочки → 4 квадрата', en: 'Move 2 sticks → 4 squares' }
  },
  {
    id: 'frei', modus: 'frei', start: [], n: 0, min: 10, supply: 12,
    goal: { klein: 3, gross: 0 },
    ziel: { de: 'Baue aus höchstens 12 Stäbchen 3 Quadrate', ru: 'Построй из ≤ 12 палочек 3 квадрата', en: 'Build 3 squares from ≤ 12 sticks' }
  }
];

// ─── Buttons im SVG ─────────────────────────────────────────────────
const BTN = {
  prev: { x: 18, y: 404, w: 50, h: 44 },
  next: { x: 532, y: 404, w: 50, h: 44 },
  undo: { x: 250, y: 404, w: 100, h: 44 }
};
function hitBtn(x, y) {
  for (const [k, b] of Object.entries(BTN)) {
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return k;
  }
  return null;
}
function btnSvg(k, label) {
  const b = BTN[k];
  return svg.group(
    svg.rect(b.x, b.y, b.w, b.h, '#fff', { rx: 8, stroke: '#ccc', 'stroke-width': 1.2 }) +
    svg.text(b.x + b.w / 2, b.y + b.h / 2 + 6, label, { 'text-anchor': 'middle', 'font-size': 17, fill: '#444' })
  );
}

/** Einzelnes Stäbchen als dicke, abgerundete Linie mit „Zündkopf“. */
function stickSvg(k, hl) {
  const [x1, y1, x2, y2] = segXY(k);
  const wood = hl ? '#7a6cf0' : '#d99a4a';
  let out = '';
  if (hl) out += svg.el('line', { x1, y1, x2, y2, stroke: '#5b4fcf', 'stroke-width': 19, 'stroke-linecap': 'round', opacity: 0.25 });
  out += svg.el('line', { x1, y1, x2, y2, stroke: wood, 'stroke-width': hl ? 13 : 9, 'stroke-linecap': 'round' });
  out += svg.circle(x1, y1, hl ? 7.5 : 6.8, '#8a2f1c');
  return out;
}

/** Lokalisierter Text über die aktive Sprach-Einstellung. */
function tt(app, o) {
  const l = (app && typeof app.get === 'function') ? (app.get('sprache') || 'de') : 'de';
  return (o && (o[l] || o.de)) || '';
}

function stickBei(state, x, y) {
  // Enge Schwelle (< halbe Stäbchenlänge), damit ein Tipp neben dem Ende
  // eines Stäbchens nicht versehentlich das Nachbarstäbchen trifft.
  let best = null, bd = UNIT * 0.4;
  for (const k of state.sticks) {
    const d = distSeg(x, y, k);
    if (d < bd) { bd = d; best = k; }
  }
  return best;
}
function emptyBei(state, x, y) {
  let best = null, bd = UNIT * 0.5;
  for (const k of BOARD_SEGS) {
    if (state.sticks.has(k)) continue;
    const d = distSeg(x, y, k);
    if (d < bd) { bd = d; best = k; }
  }
  return best;
}

const app = new MiniApp({
  id: 'streichholz-spiele',
  icon: '🥢',
  titel: {
    de: 'Stäbchen-Knobelei',
    ru: 'Головоломки со спичками',
    en: 'Matchstick Puzzles'
  },
  anweisung: {
    de: 'Lege mit virtuellen Stäbchen die geforderte Figur: Antippen nimmt Stäbchen weg oder versetzt sie. ↩ macht den letzten Zug rückgängig, ◀/▶ wechselt die Aufgabe.',
    ru: 'Сложи нужную фигуру из виртуальных палочек: касание убирает или переносит палочки. ↩ отменяет последний ход, ◀/▶ переключают задание.',
    en: 'Build the required figure with virtual sticks: tapping removes or moves sticks. ↩ undoes the last move, ◀/▶ switch tasks.'
  },
  hilfe: {
    de: 'Jede Aufgabe beginnt mit einer Figur aus Stäbchen (aus 12 Stäbchen lassen sich z. B. 4 Quadrate legen). Erreiche das Ziel, indem du Stäbchen wegnimmst oder umlegst: Stäbchen antippen, dann eine freie Stelle antippen. Unter der Figur siehst du Quadrate, Züge und die Mindestzahl. Mit ↩ nimmst du den letzten Zug zurück. Die Lösung lässt sich auch mit Zahnstochern oder Streichhölzern am Tisch nachlegen.',
    ru: 'Каждое задание начинается с фигуры из палочек (из 12 палочек можно сложить, например, 4 квадрата). Достигни цели, убирая или перекладывая палочки: коснись палочки, затем свободного места. Под фигурой видны квадраты, ходы и минимальное число. ↩ отменяет последний ход. Решение можно повторить зубочистками или спичками на столе.',
    en: 'Each task starts with a figure of sticks (12 sticks can make, for example, 4 squares). Reach the goal by removing or moving sticks: tap a stick, then tap an empty spot. Below the figure you see squares, moves and the minimum. ↩ undoes the last move. You can recreate the solution with toothpicks or matches at the table.'
  },
  settingsSchema: {},
  auswertung: 'zuege',

  // ─── Zustand ──────────────────────────────────────────────────────
  init(state, app) {
    if (state.level === undefined || state.level < 0) state.level = 0;
    this._loadLevel(state, app);
  },

  _loadLevel(state, app) {
    const lvl = LEVELS[state.level];
    state.sticks = new Set(lvl.start);
    state.modus = lvl.modus;
    state.entfernt = [];
    state.supply = lvl.modus === 'frei' ? lvl.supply : 0;
    state.zuege = 0;
    state.historie = [];
    state.pick = null;
    state.geschafft = false;
    state.fertig = false;
  },

  setLevel(app, idx) {
    const n = LEVELS.length;
    const i = ((idx % n) + n) % n;
    app.state.level = i;
    this._loadLevel(app.state, app);
    app.rerender();
  },

  undo(app) {
    const s = app.state;
    const h = s.historie.pop();
    if (!h) return;
    if (h.type === 'weg') { s.sticks.add(h.seg); s.entfernt = s.entfernt.filter(k => k !== h.seg); }
    else if (h.type === 'add') { s.sticks.delete(h.seg); s.supply++; }
    else if (h.type === 'del') { s.sticks.add(h.seg); s.supply--; }
    else if (h.type === 'move') { s.sticks.delete(h.to); s.sticks.add(h.from); }
    s.zuege = s.historie.length;
    s.pick = null;
    this._commit(s, app);
  },

  _commit(state, app) {
    this._check(state, app);
    app.rerender();
  },

  _check(state, app) {
    const lvl = LEVELS[state.level];
    const c = counts(state.sticks);
    let ok = c.klein === lvl.goal.klein && c.gross === lvl.goal.gross;
    if (lvl.modus === 'wegnehmen' && state.entfernt.length !== lvl.n) ok = false;
    state.geschafft = ok;
    state.fertig = ok;
  },

  // ─── Interaktion ─────────────────────────────────────────────────
  onTap(state, x, y, app) {
    const btn = hitBtn(x, y);
    if (btn) {
      if (btn === 'prev') this.setLevel(app, state.level - 1);
      else if (btn === 'next') this.setLevel(app, state.level + 1);
      else if (btn === 'undo') this.undo(app);
      return;
    }
    if (state.geschafft) return;
    const lvl = LEVELS[state.level];
    if (lvl.modus === 'wegnehmen') this._tapWeg(state, app, x, y);
    else if (lvl.modus === 'umlegen') this._tapUm(state, app, x, y);
    else this._tapFrei(state, app, x, y);
  },

  _tapWeg(state, app, x, y) {
    const lvl = LEVELS[state.level];
    if (state.entfernt.length >= lvl.n) return;
    const seg = stickBei(state, x, y);
    if (!seg) return;
    state.sticks.delete(seg);
    state.entfernt.push(seg);
    state.historie.push({ type: 'weg', seg });
    state.zuege++;
    this._commit(state, app);
  },

  _tapUm(state, app, x, y) {
    const seg = stickBei(state, x, y);
    if (state.pick == null) {
      if (seg) { state.pick = seg; app.rerender(); }
    } else if (seg) {
      if (seg !== state.pick) { state.pick = seg; app.rerender(); }
      else { state.pick = null; app.rerender(); }
    } else {
      const to = emptyBei(state, x, y);
      if (to) this._move(state, app, state.pick, to);
      else { state.pick = null; app.rerender(); }
    }
  },

  _move(state, app, from, to) {
    state.sticks.delete(from);
    state.sticks.add(to);
    state.historie.push({ type: 'move', from, to });
    state.zuege++;
    state.pick = null;
    this._commit(state, app);
  },

  _tapFrei(state, app, x, y) {
    const seg = stickBei(state, x, y);
    if (seg) {
      state.sticks.delete(seg);
      state.supply++;
      state.historie.push({ type: 'del', seg });
      state.zuege++;
      this._commit(state, app);
    } else if (state.supply > 0) {
      const to = emptyBei(state, x, y);
      if (to) {
        state.sticks.add(to);
        state.supply--;
        state.historie.push({ type: 'add', seg: to });
        state.zuege++;
        this._commit(state, app);
      }
    }
  },

  // ─── Zeichnen ────────────────────────────────────────────────────
  render(state, app) {
    const lvl = LEVELS[state.level];
    const parts = [];

    parts.push(svg.text(300, 34, tt(app, lvl.ziel),
      { 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 'bold', fill: '#333' }));
    parts.push(svg.text(300, 58, tt(app, MODUS_HINWEIS[lvl.modus]),
      { 'text-anchor': 'middle', 'font-size': 13, fill: '#777' }));

    // Gitterpunkte als Orientierung
    for (let y = 0; y <= H; y++) for (let x = 0; x <= W; x++) {
      parts.push(svg.circle(px(x), py(y), 2.6, '#d9d9ee'));
    }

    // fertige Quadrate sanft hinterlegen
    for (const sq of squareList(state.sticks)) {
      const fill = sq.size > 1 ? '#4D96FF' : '#34D399';
      parts.push(svg.rect(px(sq.x), py(sq.y), sq.size * UNIT, sq.size * UNIT, fill,
        { rx: 8, opacity: 0.16 }));
    }

    // weggenommene Stäbchen als Geister anzeigen
    for (const seg of state.entfernt) {
      const [x1, y1, x2, y2] = segXY(seg);
      parts.push(svg.el('line', { x1, y1, x2, y2, stroke: '#bbb', 'stroke-width': 7,
        'stroke-linecap': 'round', 'stroke-dasharray': '7 7', opacity: 0.55 }));
    }

    for (const k of state.sticks) parts.push(stickSvg(k, k === state.pick));

    parts.push(btnSvg('prev', '◀'));
    parts.push(btnSvg('next', '▶'));
    parts.push(btnSvg('undo', '↩'));
    parts.push(svg.text(300, 394,
      `${tt(app, { de: 'Aufgabe', ru: 'Задание', en: 'Task' })} ${state.level + 1}/${LEVELS.length}`,
      { 'text-anchor': 'middle', 'font-size': 14, fill: '#555' }));

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;
  },

  // ─── Statuszeile + Erfolg ────────────────────────────────────────
  statusHtml(state, app) {
    const lvl = LEVELS[state.level];
    const c = counts(state.sticks);
    const parts = [];
    parts.push(`◻ ${c.klein}/${lvl.goal.klein}`);
    if (lvl.goal.gross > 0 || c.gross > 0) parts.push(`▢ ${c.gross}/${lvl.goal.gross}`);
    if (lvl.modus === 'wegnehmen') parts.push(`${tt(app, { de: 'weg', ru: 'убрано', en: 'removed' })}: ${state.entfernt.length}/${lvl.n}`);
    if (lvl.modus === 'frei') parts.push(`${tt(app, { de: 'Vorrat', ru: 'запас', en: 'supply' })}: ${state.supply}`);
    parts.push(`${tt(app, { de: 'Züge', ru: 'ходы', en: 'moves' })}: ${state.zuege}`);
    if (state.pick) parts.push(tt(app, {
      de: 'Stäbchen gewählt – tippe eine freie Stelle',
      ru: 'палочка выбрана – коснись свободного места',
      en: 'stick picked – tap an empty spot'
    }));

    let html = `<div class="ma-result">${parts.join(' · ')}</div>`;

    if (state.geschafft) {
      const min = lvl.min;
      const optimal = state.zuege === min;
      let msg;
      if (lvl.modus === 'frei') {
        msg = `${tt(app, { de: 'Geschafft!', ru: 'Получилось!', en: 'Done!' })} · ` +
          `${tt(app, { de: 'Stäbchen', ru: 'палочек', en: 'sticks' })}: ${state.sticks.size}` +
          (optimal ? '' : ` (${tt(app, { de: 'mind.', ru: 'мин.', en: 'min.' })} ${min})`);
      } else {
        msg = `${tt(app, { de: 'Geschafft!', ru: 'Получилось!', en: 'Done!' })} · ` +
          `${tt(app, { de: 'Züge', ru: 'ходы', en: 'moves' })}: ${state.zuege}` +
          (optimal ? ` – ${tt(app, { de: 'optimal!', ru: 'оптимально!', en: 'optimal!' })}` :
            ` (${tt(app, { de: 'Optimal', ru: 'оптимум', en: 'optimal' })}: ${min})`);
      }
      msg += ` · ${tt(app, { de: 'Nächste: ▶', ru: 'Дальше: ▶', en: 'Next: ▶' })}`;
      html += `<div class="ma-result ma-fertig"><div class="ma-ok">✅</div>${msg}</div>`;
    }

    return html;
  }
});

export default app;

// Direkt einbinden (apps/streichholz-spiele/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
