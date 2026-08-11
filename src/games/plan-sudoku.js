/**
 * Bilder-Sudoku – planvolles, systematisches Vorgehen
 *
 * 4×4 (Niveau 1–3) bzw. 6×6 (ab Niveau 4) mit Symbolen statt Ziffern.
 * Jedes Symbol genau einmal pro Zeile, Spalte und Block.
 *
 * Bedienung: erst ein leeres Feld antippen, dann ein Symbol wählen.
 * Falsch gesetzte Symbole werden nicht sofort verraten – geprüft wird erst,
 * wenn das Gitter voll ist. Sonst wäre es Ausprobieren statt Planen.
 *
 * Eigenes Modul statt choice.js: hier wird ein Gitter gefüllt, nicht eine von
 * N Möglichkeiten gewählt.
 */
import { engine } from '../core/engine.js';
import { shuffle, randInt } from '../core/html.js';

const SYMBOLS = ['🍎','⭐','🐟','🌸','🔔','🍀'];

/** Erzeugt ein gültiges Sudoku der Größe n (4 oder 6) durch Zeilen-/Spaltentausch. */
function solvedGrid(n, boxW, boxH) {
  const base = [];
  for (let r = 0; r < n; r++) {
    base.push([...Array(n).keys()].map(c => (r * boxW + Math.floor(r / boxH) + c) % n));
  }
  // Zeilen innerhalb der Bänder und Spalten innerhalb der Stapel mischen
  let g = base;
  for (let band = 0; band < n / boxH; band++) {
    const rows = shuffle([...Array(boxH).keys()].map(i => band * boxH + i));
    const copy = g.map(r => [...r]);
    rows.forEach((src, i) => { g[band * boxH + i] = copy[src]; });
  }
  for (let stack = 0; stack < n / boxW; stack++) {
    const cols = shuffle([...Array(boxW).keys()].map(i => stack * boxW + i));
    const copy = g.map(r => [...r]);
    for (let r = 0; r < n; r++) {
      cols.forEach((src, i) => { g[r][stack * boxW + i] = copy[r][src]; });
    }
  }
  // Symbolzuordnung permutieren
  const perm = shuffle([...Array(n).keys()]);
  return g.map(row => row.map(v => perm[v]));
}

function newPuzzle(level) {
  const n = level >= 4 ? 6 : 4;
  const boxW = n === 4 ? 2 : 3;
  const boxH = 2;
  const solution = solvedGrid(n, boxW, boxH);

  // Wie viele Felder bleiben leer?
  const cells = n * n;
  const blanks = Math.min(cells - n, Math.round(cells * (0.22 + level * 0.06)));
  const holes = new Set();
  while (holes.size < blanks) holes.add(randInt(0, cells - 1));

  const given = solution.map((row, r) => row.map((v, c) => holes.has(r * n + c) ? null : v));
  return { n, boxW, boxH, solution, given, grid: given.map(r => [...r]) };
}

export function init(gs) {
  const gd = gs.gd || {};
  gs.gd = gd;
  gd.level = gd.level || 1;
  gd.puzzle = newPuzzle(gd.level);
  gd.selected = null;
  gd.phase = 'play';
  gd.wrongCells = null;
  gd._ready = true;
  return gs;
}

export function dispose(gs) {
  if (gs && gs.gd) gs.gd._ready = false;
}

export function render(gs) {
  let gd = gs.gd;
  if (!gd || !gd._ready) { init(gs); gd = gs.gd; }
  const p = gd.puzzle;
  const { n, boxW, boxH } = p;

  if (gd.phase === 'done') {
    return `<div style="width:100%;max-width:520px;text-align:center">
      <div class="feedback-banner feedback-correct">🎉 <b>Gelöst!</b> Jedes Symbol genau einmal pro Zeile, Spalte und Block.</div>
      <div style="font-size:.8em;color:var(--text-light);margin-bottom:8px">Niveau ${gd.level}</div>
      <button class="btn btn-primary btn-small" onclick="G('nextPuzzle')">▶️ Nächstes Rätsel</button>
    </div>`;
  }

  const filled = p.grid.flat().filter(v => v !== null).length;
  const complete = filled === n * n;

  let cells = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const v = p.grid[r][c];
      const isGiven = p.given[r][c] !== null;
      const sel = gd.selected && gd.selected[0] === r && gd.selected[1] === c;
      const wrong = gd.wrongCells && gd.wrongCells.has(r * n + c);
      // Blockgrenzen sichtbar machen
      const bt = r % boxH === 0 ? '3px' : '1px';
      const bl = c % boxW === 0 ? '3px' : '1px';
      const bb = r === n - 1 ? '3px' : '0';
      const br = c === n - 1 ? '3px' : '0';
      cells += `<div class="pick-target" onclick="G('selectCell',${r},${c})" style="
        aspect-ratio:1;display:flex;align-items:center;justify-content:center;
        font-size:${n === 4 ? '1.9em' : '1.5em'};
        border-top:${bt} solid #B9B4DE;border-left:${bl} solid #B9B4DE;
        border-bottom:${bb} solid #B9B4DE;border-right:${br} solid #B9B4DE;
        background:${wrong ? '#FFE9E9' : sel ? '#EBE9FF' : isGiven ? '#F4F2FB' : '#fff'};
        cursor:${isGiven ? 'default' : 'pointer'};
        ${isGiven ? 'opacity:.75' : ''}">${v === null ? '' : SYMBOLS[v]}</div>`;
    }
  }

  const palette = [...Array(n).keys()].map(v =>
    `<div class="pick-target" onclick="G('placeSymbol',${v})" style="width:52px;height:52px;border-radius:12px;background:var(--bg);border:2px solid ${gd.selected ? 'var(--primary-light)' : '#D0CDE8'};opacity:${gd.selected ? 1 : .45};display:flex;align-items:center;justify-content:center;font-size:1.7em;cursor:pointer;user-select:none">${SYMBOLS[v]}</div>`
  ).join('');

  return `<div style="width:100%;max-width:460px">
    <p style="font-size:1.02em;text-align:center">🧮 <b>Jedes Symbol einmal pro Zeile, Spalte und Block</b></p>
    <p style="font-size:.82em;color:var(--text-light);text-align:center;margin-bottom:10px">
      ${gd.selected ? 'Jetzt ein Symbol wählen' : 'Erst ein leeres Feld antippen'} • Niveau ${gd.level}
    </p>

    <div style="display:grid;grid-template-columns:repeat(${n},1fr);max-width:${n * 56}px;margin:0 auto 14px">${cells}</div>

    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${palette}</div>

    <div style="margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary btn-small" onclick="G('check')" ${complete ? '' : 'disabled style="opacity:.45"'}>✅ Prüfen</button>
      <button class="btn btn-secondary btn-small" onclick="G('clearCell')">🧽 Feld leeren</button>
      <button class="btn btn-secondary btn-small" onclick="G('nextPuzzle')">🔄 Neues Rätsel</button>
    </div>
    ${gd.wrongCells ? `<p style="text-align:center;color:var(--secondary);font-weight:700;font-size:.9em;margin-top:10px">Die rot markierten Felder passen noch nicht.</p>` : ''}
  </div>`;
}

export const actions = {
  selectCell(gs, r, c) {
    const gd = gs.gd;
    if (gd.phase !== 'play') return false;
    if (gd.puzzle.given[r][c] !== null) return false;   // Vorgaben sind fest
    gd.selected = [r, c];
    gd.wrongCells = null;
  },

  placeSymbol(gs, v) {
    const gd = gs.gd;
    if (gd.phase !== 'play' || !gd.selected) return false;
    const [r, c] = gd.selected;
    gd.puzzle.grid[r][c] = v;
    gd.wrongCells = null;
    // Weiter zum nächsten freien Feld – spart viel Tippen
    const n = gd.puzzle.n;
    for (let i = r * n + c + 1; i < n * n; i++) {
      const rr = Math.floor(i / n), cc = i % n;
      if (gd.puzzle.given[rr][cc] === null && gd.puzzle.grid[rr][cc] === null) {
        gd.selected = [rr, cc];
        return;
      }
    }
    gd.selected = null;
  },

  clearCell(gs) {
    const gd = gs.gd;
    if (!gd.selected) return false;
    const [r, c] = gd.selected;
    if (gd.puzzle.given[r][c] !== null) return false;
    gd.puzzle.grid[r][c] = null;
    gd.wrongCells = null;
  },

  check(gs) {
    const gd = gs.gd;
    const p = gd.puzzle;
    const n = p.n;
    if (p.grid.flat().some(v => v === null)) return false;

    // Gegen die Regeln prüfen, nicht gegen die gespeicherte Lösung: Rätsel mit
    // vielen Lücken haben oft mehrere gültige Lösungen, und eine davon darf
    // nicht als Fehler gelten.
    const wrong = new Set();
    const checkGroup = coords => {
      const seen = new Map();
      for (const [r, c] of coords) {
        const v = p.grid[r][c];
        if (seen.has(v)) { wrong.add(r * n + c); wrong.add(seen.get(v)); }
        else seen.set(v, r * n + c);
      }
    };
    for (let r = 0; r < n; r++) checkGroup([...Array(n).keys()].map(c => [r, c]));
    for (let c = 0; c < n; c++) checkGroup([...Array(n).keys()].map(r => [r, c]));
    for (let br = 0; br < n / p.boxH; br++) {
      for (let bc = 0; bc < n / p.boxW; bc++) {
        const coords = [];
        for (let dr = 0; dr < p.boxH; dr++)
          for (let dc = 0; dc < p.boxW; dc++)
            coords.push([br * p.boxH + dr, bc * p.boxW + dc]);
        checkGroup(coords);
      }
    }

    gs.total = (gs.total || 0) + 1;
    if (wrong.size === 0) {
      gs.score = (gs.score || 0) + 1;
      gd.phase = 'done';
      gd.wrongCells = null;
      if (gd.level < 6) gd.level++;
    } else {
      gd.wrongCells = wrong;
      if (gd.level > 1) gd.level--;
    }
  },

  nextPuzzle(gs) {
    const gd = gs.gd;
    gd.puzzle = newPuzzle(gd.level);
    gd.selected = null;
    gd.wrongCells = null;
    gd.phase = 'play';
  }
};

export const scoring = 'count';
