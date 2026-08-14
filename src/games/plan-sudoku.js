/**
 * Bilder-Sudoku – planvolles, systematisches Vorgehen
 *
 * 4×4 (Niveau 1–3) bzw. 6×6 (ab Niveau 4) mit Symbolen statt Ziffern.
 * Jedes Symbol genau einmal pro Zeile, Spalte und Block.
 *
 * Bedienung: erst ein leeres Feld antippen, dann ein Symbol wählen. Das
 * leere Feld in der Symbolreihe löscht – ein eigener Knopf dafür stünde
 * weit weg von der Stelle, an der man ihn braucht.
 *
 * Falsch gesetzte Symbole werden nicht sofort verraten. Ausgewertet wird,
 * sobald das letzte Feld gefüllt ist, oder wenn die Zeit abläuft. Kein
 * „Prüfen"-Knopf: wer das Gitter voll hat, ist fertig, und ein zusätzlicher
 * Klick sagt darüber nichts aus.
 *
 * Eigenes Modul statt choice.js: hier wird ein Gitter gefüllt, nicht eine von
 * N Möglichkeiten gewählt.
 */
import { engine } from '../core/engine.js';
import { shuffle, randInt, pick } from '../core/html.js';
import { countRound, resultScreen } from '../core/session.js';
import { registerModuleSettings, modGet } from '../core/settings.js';
import { bar, pictogram } from '../core/shell.js';
import * as settings from '../core/settings.js';

const ID = 'plan-sudoku';

/**
 * Eigene Stellschrauben dieses Moduls.
 *
 * Die Zeit richtet sich nach der Zahl der leeren Felder, nicht nach dem
 * Niveau: die leeren Felder sind das, was tatsächlich Arbeit macht, und sie
 * wachsen ohnehin mit dem Niveau. Eine feste Zeit je Rätsel wäre auf Stufe 1
 * zu großzügig und auf Stufe 6 unfair.
 */
export const settingsSchema = {
  sekProFeld: {
    def: 12, min: 3, max: 40, step: 1, unit: 's',
    de: 'Zeit je leerem Feld', ru: 'Время на пустую клетку', en: 'Time per empty field',
    hintDe: 'Die Gesamtzeit ergibt sich aus der Zahl der leeren Felder. Läuft sie ab, gilt das Rätsel als nicht gelöst.',
    hintRu: 'Общее время складывается из числа пустых клеток. Если оно истекло, головоломка считается нерешённой.',
    hintEn: 'Total time follows from the number of empty fields. When it runs out, the puzzle counts as unsolved.'
  }
};
registerModuleSettings(ID, settingsSchema);

const UI = {
  regel: { de: '🧮 Jedes Symbol einmal pro Zeile, Spalte und Block', ru: '🧮 Каждый символ один раз в строке, столбце и блоке', en: '🧮 Each symbol once per row, column and block' },
  waehlen: { de: 'Jetzt ein Symbol wählen', ru: 'Теперь выбери символ', en: 'Now choose a symbol' },
  antippen: { de: 'Erst ein leeres Feld antippen', ru: 'Сначала нажми на пустую клетку', en: 'First tap an empty field' },
  niveau: { de: 'Niveau', ru: 'Уровень', en: 'Level' },
  geloest: { de: 'Gelöst!', ru: 'Решено!', en: 'Solved!' },
  geloestText: { de: 'Jedes Symbol genau einmal pro Zeile, Spalte und Block.', ru: 'Каждый символ ровно один раз в строке, столбце и блоке.', en: 'Each symbol exactly once per row, column and block.' },
  leeren: { de: 'Feld leeren', ru: 'Очистить клетку', en: 'Clear field' }
};

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

let timer = null;
function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }
function isActive() { return !!(engine.activeGame && engine.activeGame.id === ID); }

/** Zeitgrenze eines Rätsels: Zahl der leeren Felder × eingestellte Zeit. */
function frist(p) {
  const leer = p.given.flat().filter(v => v === null).length;
  return leer * modGet(ID, 'sekProFeld') * 1000;
}

function starteRaetsel(gs) {
  const gd = gs.gd;
  gd.puzzle = newPuzzle(gd.level);
  gd.selected = null;
  gd.wrongCells = null;
  gd.phase = 'play';
  gd.phaseStart = Date.now();
  gd.frist = frist(gd.puzzle);
  clearTimer();
  timer = setTimeout(() => { if (isActive()) auswerten(gs); }, gd.frist);
}

export function init(gs) {
  const gd = gs.gd || {};
  gs.gd = gd;
  gd.level = gd.level || 1;
  gd._ready = true;
  starteRaetsel(gs);
  return gs;
}

export function dispose(gs) {
  clearTimer();
  if (gs && gs.gd) gs.gd._ready = false;
}

export function render(gs) {
  let gd = gs.gd;
  if (!gd || !gd._ready) { init(gs); gd = gs.gd; }
  const p = gd.puzzle;
  const { n, boxW, boxH } = p;

  if (gd.phase === 'fertig') return resultScreen(gs, { score: gs.score, total: gs.total });

  // Rückmeldung ohne Text: ein Zeichen, danach geht es von selbst weiter.
  if (gd.phase === 'feedback') {
    return `<div data-phase="feedback" style="text-align:center;width:100%">
      ${pictogram(gd.geloest ? '✅' : '❌')}
    </div>`;
  }

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
        font-size:calc(${n === 4 ? '1.9em' : '1.5em'} * var(--pic));
        border-top:${bt} solid #B9B4DE;border-left:${bl} solid #B9B4DE;
        border-bottom:${bb} solid #B9B4DE;border-right:${br} solid #B9B4DE;
        background:${wrong ? '#FFE9E9' : sel ? '#EBE9FF' : isGiven ? '#F4F2FB' : '#fff'};
        cursor:${isGiven ? 'default' : 'pointer'};
        ${isGiven ? 'opacity:.75' : ''}">${v === null ? '' : SYMBOLS[v]}</div>`;
    }
  }

  // Symbolreihe, und als letzte Kachel ein leeres Feld zum Löschen. Es steht
  // dort, wo man es braucht – ein Knopf unter dem Gitter zwang dazu, den
  // Blick von der Auswahl wegzunehmen und wieder zurückzufinden.
  const aktiv = !!gd.selected;
  const rahmen = `width:calc(52px * var(--pic) / 2 + 26px);height:calc(52px * var(--pic) / 2 + 26px);border-radius:12px;display:flex;align-items:center;
    justify-content:center;font-size:calc(1.7em * var(--pic));cursor:pointer;user-select:none;
    opacity:${aktiv ? 1 : .45}`;

  const palette = [...Array(n).keys()].map(v =>
    `<div class="pick-target" onclick="G('placeSymbol',${v})"
      style="${rahmen};background:var(--bg);border:2px solid ${aktiv ? 'var(--primary-light)' : '#D0CDE8'}"
      >${SYMBOLS[v]}</div>`
  ).join('') +
    `<div class="pick-target" onclick="G('clearCell')" title="${pick(UI.leeren)}"
      aria-label="${pick(UI.leeren)}"
      style="${rahmen};background:#fff;border:2px dashed ${aktiv ? 'var(--primary-light)' : '#D0CDE8'}"></div>`;

  return `<div data-phase="play" style="width:100%;max-width:460px">
    <p style="font-size:1.02em;text-align:center">${pick(UI.regel)}</p>
    <p style="font-size:.82em;color:var(--text-light);text-align:center;margin-bottom:10px">
      ${gd.selected ? pick(UI.waehlen) : pick(UI.antippen)} • ${pick(UI.niveau)} ${gd.level}
    </p>

    <div style="display:grid;grid-template-columns:repeat(${n},1fr);max-width:${n * 56}px;margin:0 auto 14px">${cells}</div>

    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${palette}</div>

    ${bar(Date.now() - (gd.phaseStart || Date.now()), gd.frist || 1)}
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

    // Das letzte Feld beendet das Rätsel. Ein zusätzlicher „Prüfen"-Klick
    // sagt nichts aus, was das volle Gitter nicht schon sagt.
    if (!gd.puzzle.grid.flat().some(x => x === null)) auswerten(gs);
  },

  clearCell(gs) {
    const gd = gs.gd;
    if (!gd.selected) return false;
    const [r, c] = gd.selected;
    if (gd.puzzle.given[r][c] !== null) return false;
    gd.puzzle.grid[r][c] = null;
    gd.wrongCells = null;
  },

  restart(gs) {
    clearTimer();
    gs.gd = { level: 1 };
    gs.score = 0; gs.total = 0; gs.rounds = 0;
    init(gs);
  }
};

/**
 * Rätsel abschließen – durch das letzte gesetzte Symbol oder durch Zeitablauf.
 *
 * Beide Wege enden hier. Ob die Zeit abgelaufen ist, muss nicht übergeben
 * werden: bei Zeitablauf ist das Gitter fast immer noch nicht voll, und ein
 * unvollständiges Gitter gilt ohnehin als nicht gelöst. Wer im letzten
 * Augenblick fertig wird, bekommt die Lösung anerkannt – das ist richtig so.
 *
 * Geprüft wird gegen die Regeln, nicht gegen die gespeicherte Lösung: Rätsel
 * mit vielen Lücken haben oft mehrere gültige Lösungen, und eine davon darf
 * nicht als Fehler gelten.
 */
function auswerten(gs) {
  const gd = gs.gd;
  if (!gd || gd.phase !== 'play') return;
  clearTimer();
  const p = gd.puzzle;
  const n = p.n;

  const wrong = new Set();
  const checkGroup = coords => {
    const seen = new Map();
    for (const [r, c] of coords) {
      const v = p.grid[r][c];
      if (v === null) continue;
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

  // Bei Zeitablauf ist das Gitter meist noch nicht voll – dann zählt es als
  // nicht gelöst, ganz gleich wie regelkonform der bisherige Teil ist.
  const vollstaendig = !p.grid.flat().some(v => v === null);
  const geloest = vollstaendig && wrong.size === 0;

  gs.total = (gs.total || 0) + 1;
  if (geloest) {
    gs.score = (gs.score || 0) + 1;
    if (gd.level < 6) gd.level++;
  } else if (gd.level > 1) {
    gd.level--;
  }

  gd.geloest = geloest;
  gd.wrongCells = geloest ? null : wrong;
  gd.phase = 'feedback';

  // Ein abgeschlossenes Rätsel ist eine Übung – gelöst oder nicht.
  const vorbei = countRound(gs);
  engine.renderGame();

  timer = setTimeout(() => {
    if (!isActive()) return;
    if (vorbei) gd.phase = 'fertig';
    else starteRaetsel(gs);
    engine.renderGame();
  }, Math.round(settings.get(geloest ? 'feedbackOk' : 'feedbackWrong') * 1000));
}

export const scoring = 'count';
