/**
 * Rover / Weg zum Knochen (KABC-II: Rover)
 *
 * Misst Wegplanung und räumliches Denken, nicht Geschicklichkeit.
 * Bedienung A: Kind tippt nacheinander orthogonale Nachbarfelder; sie
 * werden zum Pfad. Letzter Tipp aufs Zielfeld wertet aus. Begründung:
 * näher am KABC-Gedanken „kürzester Weg“ als Drag, und ohne Echtzeit.
 *
 * Hindernisse werden nur gesetzt, wenn danach noch ein Weg existiert (BFS).
 */
import { engine } from '../core/engine.js';
import { pick, esc } from '../core/html.js';
import { countRound, resultScreen } from '../core/session.js';
import { registerModuleSettings, modGet } from '../core/settings.js';
import { bar, pictogram } from '../core/shell.js';
import * as settings from '../core/settings.js';

const ID = 'sim-rover';

export const settingsSchema = {
  sekProFeld: {
    def: 4, min: 2, max: 20, step: 1, unit: 's',
    de: 'Zeit je erwartetem Schritt', ru: 'Время на шаг', en: 'Time per expected step',
    hintDe: 'Gesamtzeit = Mindestschritte × dieser Wert. Läuft sie ab, gilt der Weg als nicht gefunden.',
    hintRu: 'Общее время = минимальные шаги × это значение.',
    hintEn: 'Total time = minimum steps × this value. When it runs out, the path counts as unsolved.'
  }
};
registerModuleSettings(ID, settingsSchema);

export const instruction = {
  de: 'Führe den Hund zum Knochen. Tippe nacheinander benachbarte Felder. Um Hindernisse herum, nicht hindurch.',
  ru: 'Проведи собаку к кости. Нажимай соседние клетки. Обходи препятствия.',
  en: 'Guide the dog to the bone. Tap neighbouring cells in order. Go around obstacles, not through them.'
};

const UI = {
  frage: { de: '🐕 Weg zum Knochen', ru: '🐕 Путь к кости', en: '🐕 Path to the bone' },
  tipp: {
    de: 'Tippe benachbarte Felder vom Hund zum Knochen.',
    ru: 'Нажимай соседние клетки от собаки к кости.',
    en: 'Tap neighbouring cells from the dog to the bone.'
  },
  kurz: {
    de: 'Nur der kürzeste Weg zählt.',
    ru: 'Считается только кратчайший путь.',
    en: 'Only the shortest path counts.'
  },
  niveau: { de: 'Niveau', ru: 'Уровень', en: 'Level' },
  minSchritte: { de: 'Mindestschritte', ru: 'Минимум шагов', en: 'Minimum steps' },
  zurueck: { de: 'Letzten Schritt zurück', ru: 'Отменить шаг', en: 'Undo last step' }
};

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function key(r, c) { return r + ',' + c; }

function bfs(rows, cols, blocked, start, goal) {
  const q = [[start[0], start[1], 0]];
  const seen = new Set([key(start[0], start[1])]);
  const parent = new Map();
  while (q.length) {
    const [r, c, d] = q.shift();
    if (r === goal[0] && c === goal[1]) {
      const path = [[r, c]];
      let k = key(r, c);
      while (parent.has(k)) {
        const p = parent.get(k);
        path.push(p);
        k = key(p[0], p[1]);
      }
      path.reverse();
      return { dist: d, path };
    }
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      const kk = key(nr, nc);
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (blocked.has(kk)) continue;
      if (seen.has(kk)) continue;
      seen.add(kk);
      parent.set(kk, [r, c]);
      q.push([nr, nc, d + 1]);
    }
  }
  return null;
}

function mulberry32(a) {
  return function () {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function levelParams(level) {
  if (level <= 1) return { rows: 4, cols: 4, obstMin: 1, obstMax: 2, shortest: false, waypoints: 0 };
  if (level === 2) return { rows: 5, cols: 5, obstMin: 3, obstMax: 4, shortest: false, waypoints: 0 };
  if (level === 3) return { rows: 5, cols: 5, obstMin: 4, obstMax: 6, shortest: true, waypoints: 0 };
  if (level === 4) return { rows: 6, cols: 6, obstMin: 6, obstMax: 8, shortest: true, waypoints: 0 };
  return { rows: level >= 5 && Math.random() < 0.4 ? 7 : 6, cols: level >= 5 && Math.random() < 0.4 ? 7 : 6, obstMin: 8, obstMax: 12, shortest: true, waypoints: 1 };
}

function generateMap(level, seed) {
  const p = levelParams(level);
  const rng = mulberry32((seed >>> 0) || (Date.now() ^ (Math.random() * 1e9) | 0));
  const rows = p.rows, cols = p.cols;
  const start = [0, 0];
  const goal = rng() < 0.7 ? [rows - 1, cols - 1] : [rows - 1, rng() < 0.5 ? 0 : cols - 1];
  if (goal[0] === start[0] && goal[1] === start[1]) goal[0] = rows - 1;

  const nObst = p.obstMin + Math.floor(rng() * (p.obstMax - p.obstMin + 1));
  const blocked = new Set();
  const forbidden = new Set([key(start[0], start[1]), key(goal[0], goal[1])]);
  let tries = 0;
  while (blocked.size < nObst && tries < 400) {
    tries++;
    const r = Math.floor(rng() * rows);
    const c = Math.floor(rng() * cols);
    const k = key(r, c);
    if (forbidden.has(k) || blocked.has(k)) continue;
    blocked.add(k);
    if (!bfs(rows, cols, blocked, start, goal)) blocked.delete(k);
  }

  const reach = bfs(rows, cols, blocked, start, goal);
  if (!reach) return generateMap(level, seed + 17);

  // Optional ein Zwischenziel auf einem kürzesten Weg (Stufe 5)
  let waypoint = null;
  if (p.waypoints && reach.path.length > 4) {
    const mid = reach.path[Math.floor(reach.path.length / 2)];
    if (!(mid[0] === start[0] && mid[1] === start[1]) && !(mid[0] === goal[0] && mid[1] === goal[1])) {
      waypoint = mid;
    }
  }

  return {
    rows, cols, start, goal, waypoint,
    blocked: [...blocked],
    minDist: reach.dist,
    shortestOnly: p.shortest,
    hash: `${rows}x${cols}:${[...blocked].sort().join(';')}:${goal.join(',')}`
  };
}

let timer = null;
function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }
function isActive() { return !!(engine.activeGame && engine.activeGame.id === ID); }

function blockedSet(map) {
  return new Set(map.blocked);
}

function starteRunde(gs) {
  const gd = gs.gd;
  const seen = gd.seenHashes || (gd.seenHashes = new Set());
  let map = null;
  for (let i = 0; i < 40; i++) {
    map = generateMap(gd.level, (Date.now() + i * 997) >>> 0);
    if (!seen.has(map.hash)) break;
  }
  seen.add(map.hash);
  gd.map = map;
  gd.path = [[map.start[0], map.start[1]]];
  gd.wpDone = !map.waypoint;
  gd.phase = 'play';
  gd.phaseStart = Date.now();
  gd.frist = Math.max(8, map.minDist) * modGet(ID, 'sekProFeld') * 1000;
  gd.geloest = false;
  gd.hinweis = null;
  clearTimer();
  timer = setTimeout(() => { if (isActive()) auswerten(gs); }, gd.frist);
}

export function init(gs) {
  const gd = gs.gd || {};
  gs.gd = gd;
  gd.level = gd.level || 1;
  gd._ready = true;
  starteRunde(gs);
  return gs;
}

export function dispose(gs) {
  clearTimer();
  if (gs && gs.gd) gs.gd._ready = false;
}

function last(path) { return path[path.length - 1]; }

function nachbarn(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
}

export function render(gs) {
  let gd = gs.gd;
  if (!gd || !gd._ready) { init(gs); gd = gs.gd; }

  if (gd.phase === 'fertig') return resultScreen(gs, { score: gs.score, total: gs.total });

  if (gd.phase === 'feedback') {
    const extra = (!gd.geloest && gd.hinweis)
      ? `<p style="font-size:.9em;color:var(--text-light);margin-top:10px">${esc(gd.hinweis)}</p>`
      : '';
    return `<div data-phase="feedback" style="text-align:center;width:100%">
      ${pictogram(gd.geloest ? '✅' : '❌')}
      ${extra}
    </div>`;
  }

  const m = gd.map;
  const blocked = blockedSet(m);
  const onPath = new Set(gd.path.map(([r, c]) => key(r, c)));
  const cur = last(gd.path);
  const n = Math.max(m.rows, m.cols);
  const cell = n <= 5 ? 52 : n === 6 ? 44 : 38;

  let cells = '';
  for (let r = 0; r < m.rows; r++) {
    for (let c = 0; c < m.cols; c++) {
      const k = key(r, c);
      const isStart = r === m.start[0] && c === m.start[1];
      const isGoal = r === m.goal[0] && c === m.goal[1];
      const isWp = m.waypoint && r === m.waypoint[0] && c === m.waypoint[1];
      const isBlock = blocked.has(k);
      const isHere = r === cur[0] && c === cur[1];
      const inPath = onPath.has(k);
      let icon = '';
      if (isHere) icon = '🐕';
      else if (isGoal) icon = '🦴';
      else if (isWp && !gd.wpDone) icon = '⭐';
      else if (isBlock) icon = '🪨';
      else if (isStart) icon = '🏠';
      const bg = isBlock ? '#E8E4F0' : isHere ? '#EBE9FF' : inPath ? '#D8F3DC' : isGoal ? '#FFF4D6' : '#fff';
      cells += `<div class="pick-target" onclick="G('tap',${r},${c})" style="
        aspect-ratio:1;display:flex;align-items:center;justify-content:center;
        font-size:calc(${n <= 5 ? '1.35em' : '1.1em'} * var(--pic));
        border:1px solid #C9C4E4;background:${bg};cursor:${isBlock ? 'default' : 'pointer'};
        user-select:none">${icon}</div>`;
    }
  }

  const kurz = m.shortestOnly ? ' • ' + pick(UI.kurz) : '';

  return `<div data-phase="play" style="width:100%;max-width:460px">
    <p style="font-size:1.05em;text-align:center">${pick(UI.frage)}</p>
    <p style="font-size:.82em;color:var(--text-light);text-align:center;margin-bottom:10px">
      ${pick(UI.tipp)}${kurz} • ${pick(UI.niveau)} ${gd.level}
    </p>
    <div style="display:grid;grid-template-columns:repeat(${m.cols},1fr);max-width:${m.cols * cell}px;margin:0 auto 12px;gap:0;border:2px solid #B9B4DE">${cells}</div>
    <div style="text-align:center">
      <button type="button" class="btn-ghost" onclick="G('undo')" ${gd.path.length <= 1 ? 'disabled' : ''}>${esc(pick(UI.zurueck))}</button>
    </div>
    ${bar(gd.frist || 1, Date.now() - (gd.phaseStart || Date.now()))}
  </div>`;
}

function pfadGueltig(gd) {
  const m = gd.map;
  const blocked = blockedSet(m);
  const path = gd.path;
  if (path.length < 2) return { ok: false, reason: 'short' };
  for (let i = 1; i < path.length; i++) {
    if (!nachbarn(path[i - 1], path[i])) return { ok: false, reason: 'jump' };
    const k = key(path[i][0], path[i][1]);
    if (blocked.has(k)) return { ok: false, reason: 'block' };
  }
  const end = last(path);
  if (end[0] !== m.goal[0] || end[1] !== m.goal[1]) return { ok: false, reason: 'goal' };
  if (m.waypoint && !gd.wpDone) {
    const hit = path.some(([r, c]) => r === m.waypoint[0] && c === m.waypoint[1]);
    if (!hit) return { ok: false, reason: 'wp' };
  }
  const steps = path.length - 1;
  if (m.shortestOnly && steps > m.minDist) return { ok: false, reason: 'long', steps, min: m.minDist };
  return { ok: true, steps };
}

function auswerten(gs) {
  const gd = gs.gd;
  if (!gd || gd.phase !== 'play') return;
  clearTimer();
  const res = pfadGueltig(gd);
  const geloest = !!res.ok;

  gs.total = (gs.total || 0) + 1;
  if (geloest) {
    gs.score = (gs.score || 0) + 1;
    // Höchstes gelöstes Niveau – die Auswertung braucht es, weil die
    // Trefferquote bei mitwachsender Schwierigkeit nichts unterscheidet.
    gs.level = Math.max(gs.level || 0, gd.level);
    if (gd.level < 5) gd.level++;
  } else if (gd.level > 1) {
    gd.level--;
  }

  gd.geloest = geloest;
  if (!geloest) {
    const n = pick(UI.minSchritte);
    gd.hinweis = `${n}: ${gd.map.minDist}`;
  } else {
    gd.hinweis = null;
  }
  gd.phase = 'feedback';

  const vorbei = countRound(gs);
  engine.renderGame();

  timer = setTimeout(() => {
    if (!isActive()) return;
    if (vorbei) gd.phase = 'fertig';
    else starteRunde(gs);
    engine.renderGame();
  }, Math.round(settings.get(geloest ? 'feedbackOk' : 'feedbackWrong') * 1000));
}

export const actions = {
  tap(gs, r, c) {
    const gd = gs.gd;
    if (!gd || gd.phase !== 'play') return false;
    const m = gd.map;
    const blocked = blockedSet(m);
    if (blocked.has(key(r, c))) return false;
    const cur = last(gd.path);
    if (cur[0] === r && cur[1] === c) return false;
    if (!nachbarn(cur, [r, c])) return false;

    gd.path.push([r, c]);
    if (m.waypoint && r === m.waypoint[0] && c === m.waypoint[1]) gd.wpDone = true;

    if (r === m.goal[0] && c === m.goal[1]) {
      auswerten(gs);
      return;
    }
  },

  undo(gs) {
    const gd = gs.gd;
    if (!gd || gd.phase !== 'play') return false;
    if (gd.path.length <= 1) return false;
    gd.path.pop();
    const m = gd.map;
    if (m.waypoint) {
      gd.wpDone = gd.path.some(([r, c]) => r === m.waypoint[0] && c === m.waypoint[1]);
    }
  },

  restart(gs) {
    clearTimer();
    gs.gd = { level: 1 };
    gs.score = 0; gs.total = 0; gs.rounds = 0; gs.level = 0;
    init(gs);
  }
};

export const scoring = 'count';
