/**
 * Falschmünzen-Waage – Wiege-Spiel mit einer Balkenwaage.
 * idee-db: 135
 *
 * Aus der Ideen-DB (Beitrag 135, Domoryad: „Matematicheskie igry i
 * razvlechenia“, 1961, S. 197–205, § 36 „Aufgaben logischen Charakters“).
 * Zwölf Münzen, eine ist falsch – sie ist etwas schwerer ODER leichter.
 * Das Kind wägt mit einer Balkenwaage, die App wertet jeden Wiegeschritt aus
 * (linke/rechte Schale schwerer oder Gleichgewicht) und streicht auf Wunsch
 * automatisch alle unmöglichen Fälle. Ziel: die falsche Münze finden und
 * sagen, ob sie schwerer oder leichter ist. Optimal sind 3 Wägungen.
 *
 * Bedienung: Münze antippen (aufnehmen), dann linke/rechte Schale antippen
 * (ablegen) – oder die Münze direkt auf eine Schale ziehen. „Wiegen“ wertet
 * aus, „Tipp“ streicht ausgeschlossene Fälle, „Lösung“ fragt die Antwort ab.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 900;
const VIEW_H = 800;
const N = 12;
const OPTIMAL = 3;

const PAN_X = { L: 170, R: 730 };
const PAN_Y = 352;
const TABLE_RECT = { x: 88, y: 436, w: 724, h: 178 };

// Normale Knöpfe (Spielmodus).
const BUTTONS = [
  { key: 'wiegen',       x: 70,  y: 640, w: 240, h: 52 },
  { key: 'leeren',       x: 330, y: 640, w: 240, h: 52 },
  { key: 'rueckgaengig', x: 590, y: 640, w: 240, h: 52 },
  { key: 'loesung',      x: 70,  y: 702, w: 240, h: 52 },
  { key: 'tipp',         x: 330, y: 702, w: 240, h: 52 },
];

// Antwort-Knöpfe (Lösungsmodus).
const ANSWER_BUTTONS = [
  { key: 'schwerer',  x: 70,  y: 640, w: 240, h: 52 },
  { key: 'leichter',  x: 330, y: 640, w: 240, h: 52 },
  { key: 'abbrechen', x: 590, y: 640, w: 240, h: 52 },
];

const T = {
  wiegen:       { de: '⚖️ Wiegen', ru: '⚖️ Взвесить', en: '⚖️ Weigh' },
  leeren:       { de: '🧹 Leeren', ru: '🧹 Очистить', en: '🧹 Clear' },
  rueckgaengig: { de: '↩ Zurück', ru: '↩ Отменить', en: '↩ Undo' },
  loesung:      { de: '🎯 Lösung', ru: '🎯 Ответ', en: '🎯 Solve' },
  tipp:         { de: '💡 Tipp', ru: '💡 Подсказка', en: '💡 Hint' },
  wagen:        { de: 'Wägungen', ru: 'Взвешивания', en: 'Weighings' },
  tisch:        { de: 'Tisch', ru: 'Стол', en: 'Table' },
  links:        { de: 'Links', ru: 'Левая', en: 'Left' },
  rechts:       { de: 'Rechts', ru: 'Правая', en: 'Right' },

  start: {
    de: 'Lege auf beide Schalen gleich viele Münzen und wiege.',
    ru: 'Положи на обе чаши поровну монет и взвесь.',
    en: 'Put the same number of coins on both pans and weigh.'
  },
  leer: {
    de: 'Lege zuerst Münzen auf beide Schalen.',
    ru: 'Сначала положи монеты на обе чаши.',
    en: 'First put coins on both pans.'
  },
  ungleich: {
    de: 'Beide Schalen brauchen gleich viele Münzen.',
    ru: 'На обеих чашах должно быть поровну монет.',
    en: 'Both pans need the same number of coins.'
  },
  gewogen_L: {
    de: 'Die linke Schale ist schwerer.',
    ru: 'Левая чаша тяжелее.',
    en: 'The left pan is heavier.'
  },
  gewogen_R: {
    de: 'Die rechte Schale ist schwerer.',
    ru: 'Правая чаша тяжелее.',
    en: 'The right pan is heavier.'
  },
  gewogen_equal: {
    de: 'Die Waage ist im Gleichgewicht.',
    ru: 'Весы в равновесии.',
    en: 'The scale is balanced.'
  },
  keine_info: {
    de: 'Diese Wägung grenzt nichts ein.',
    ru: 'Это взвешивание ничего не исключает.',
    en: 'This weighing rules out nothing.'
  },
  doppelt: {
    de: 'Diese Wägung hast du schon gemacht.',
    ru: 'Такое взвешивание уже было.',
    en: 'You already did this weighing.'
  },
  moeglich: {
    de: 'Noch {n} möglich',
    ru: 'Осталось вариантов: {n}',
    en: '{n} case(s) left'
  },
  tipp_an: {
    de: 'Tipp an: unmögliche Fälle werden gestrichen.',
    ru: 'Подсказка вкл.: невозможные случаи вычёркиваются.',
    en: 'Hint on: impossible cases are struck out.'
  },
  tipp_aus: {
    de: 'Tipp aus.',
    ru: 'Подсказка выкл.',
    en: 'Hint off.'
  },
  waehle_muenze: {
    de: 'Welche Münze ist falsch? Tippe sie an.',
    ru: 'Какая монета фальшивая? Нажми на неё.',
    en: 'Which coin is fake? Tap it.'
  },
  waehle_richtung: {
    de: 'Ist Münze {n} schwerer oder leichter?',
    ru: 'Монета {n} тяжелее или легче?',
    en: 'Is coin {n} heavier or lighter?'
  },
  schwerer: { de: '▲ Schwerer', ru: '▲ Тяжелее', en: '▲ Heavier' },
  leichter: { de: '▼ Leichter', ru: '▼ Легче', en: '▼ Lighter' },
  abbrechen: { de: 'Abbrechen', ru: 'Отмена', en: 'Cancel' },
  richtig: {
    de: 'Richtig! Münze {n} ist {dir}.',
    ru: 'Верно! Монета {n} {dir}.',
    en: 'Correct! Coin {n} is {dir}.'
  },
  falsch: {
    de: 'Leider falsch – probiere weiter.',
    ru: 'Неверно – попробуй ещё.',
    en: 'Not correct – keep trying.'
  },
  rueckgaengig_msg: {
    de: 'Letzte Wägung zurückgenommen.',
    ru: 'Последнее взвешивание отменено.',
    en: 'Last weighing undone.'
  },
  geleert: {
    de: 'Alle Münzen sind zurück auf dem Tisch.',
    ru: 'Все монеты вернулись на стол.',
    en: 'All coins are back on the table.'
  },
  schwerer_wort: { de: 'schwerer', ru: 'тяжелее', en: 'heavier' },
  leichter_wort: { de: 'leichter', ru: 'легче', en: 'lighter' },
};

// ─── Lokalisierung ──────────────────────────────────────────────────
function tt(app, o) {
  const l = (app && typeof app.get === 'function') ? (app.get('sprache') || 'de') : 'de';
  return (o && (o[l] || o.de)) || '';
}
function fmt(s, map) {
  return Object.entries(map).reduce((a, [k, v]) => a.replaceAll('{' + k + '}', String(v)), s);
}

// ─── Geometrie / Treffer ────────────────────────────────────────────
function hit(r, x, y) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}
function tableSlot(i) {
  return { x: 150 + (i % 6) * 120, y: 480 + Math.floor(i / 6) * 70 };
}
function panCoins(state, pan) {
  const out = [];
  for (let i = 0; i < N; i++) if (state.ort[i] === pan) out.push(i);
  return out;
}
function coinCenters(state) {
  const out = [];
  for (let i = 0; i < N; i++) {
    if (state.ort[i] === 0) {
      const s = tableSlot(i);
      out.push({ i, x: s.x, y: s.y, r: 34 });
    }
  }
  for (const pan of [1, 2]) {
    const idxs = panCoins(state, pan);
    const cx = pan === 1 ? PAN_X.L : PAN_X.R;
    const n = idxs.length, spacing = 46;
    idxs.forEach((i, k) => {
      out.push({ i, x: cx + (k - (n - 1) / 2) * spacing, y: PAN_Y, r: 24 });
    });
  }
  return out;
}
function coinAt(x, y, state) {
  for (const c of coinCenters(state)) {
    if (Math.hypot(x - c.x, y - c.y) <= c.r + 8) return c.i;
  }
  return null;
}
function panAt(x, y) {
  if (Math.hypot(x - PAN_X.L, y - PAN_Y) <= 92) return 'L';
  if (Math.hypot(x - PAN_X.R, y - PAN_Y) <= 92) return 'R';
  return null;
}

// ─── Logik (Hypothesen) ─────────────────────────────────────────────
function consistent(i, d, weighings) {
  for (const w of weighings) {
    const inL = w.L.includes(i), inR = w.R.includes(i);
    let expected;
    if (d === 1) expected = inL ? 'L' : (inR ? 'R' : '=');
    else expected = inL ? 'R' : (inR ? 'L' : '=');
    if (w.result !== expected) return false;
  }
  return true;
}
function hypotheses(weighings) {
  const out = [];
  for (let i = 0; i < N; i++) {
    for (const d of [1, -1]) {
      if (consistent(i, d, weighings)) out.push([i, d]);
    }
  }
  return out;
}
function possible(state) {
  return hypotheses(state.weighings);
}
function coinHint(i, state) {
  const ps = hypotheses(state.weighings).filter(h => h[0] === i);
  if (!ps.length) return 'none';
  if (ps.every(h => h[1] === 1)) return 'heavy';
  if (ps.every(h => h[1] === -1)) return 'light';
  return 'both';
}
function computeResult(L, R, fake, heavy) {
  const inL = L.includes(fake), inR = R.includes(fake);
  if (!inL && !inR) return '=';
  if (heavy === 1) return inL ? 'L' : 'R';
  return inL ? 'R' : 'L';
}
function sameSet(a, b) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y), sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

// ─── Zeichnen ───────────────────────────────────────────────────────
function btn(x, y, w, h, label, enabled, active) {
  const fill = !enabled ? '#d8d3c6' : (active ? '#bfe6cc' : '#ece7d8');
  const stroke = active ? '#2e8b57' : '#a89f8c';
  const fg = enabled ? '#333' : '#a09a8c';
  return svg.group(
    svg.rect(x, y, w, h, fill, { rx: 12, stroke, 'stroke-width': 2 }) +
    svg.text(x + w / 2, y + h / 2 + 7, label, {
      'font-size': 20, 'text-anchor': 'middle', 'font-weight': 'bold', fill: fg
    })
  );
}

function drawCoin(i, x, y, r, state, hint) {
  const info = hint ? coinHint(i, state) : 'both';
  const impossible = info === 'none';
  const opacity = impossible ? 0.3 : 1;
  const fill = '#f6c445';
  const stroke = state.picked === i ? '#10b981' : '#b8860b';
  const sw = state.picked === i ? 4 : 2;
  let parts = '';
  parts += svg.circle(x, y, r, fill, { stroke, 'stroke-width': sw, opacity });
  if (impossible) {
    parts += svg.el('line', {
      x1: x - r * 0.7, y1: y - r * 0.7, x2: x + r * 0.7, y2: y + r * 0.7,
      stroke: '#c0392b', 'stroke-width': 5, opacity: 0.9
    });
  }
  parts += svg.text(x, y + r * 0.32, String(i + 1), {
    'font-size': Math.round(r * 0.78), 'text-anchor': 'middle', 'font-weight': 'bold',
    fill: impossible ? '#999' : '#6b4a00', opacity
  });
  if (info === 'heavy') {
    parts += svg.text(x + r * 0.8, y - r * 0.7, '▲', {
      'font-size': 14, 'text-anchor': 'middle', fill: '#c0392b', 'font-weight': 'bold'
    });
  } else if (info === 'light') {
    parts += svg.text(x + r * 0.8, y - r * 0.7, '▼', {
      'font-size': 14, 'text-anchor': 'middle', fill: '#2c6bcf', 'font-weight': 'bold'
    });
  }
  if (state.picked === i) {
    parts += svg.circle(x, y, r + 6, 'none', {
      stroke: '#10b981', 'stroke-width': 3, 'stroke-dasharray': '6 4'
    });
  }
  if (state.answerCoin === i) {
    parts += svg.circle(x, y, r + 6, 'none', {
      stroke: '#7c3aed', 'stroke-width': 4, 'stroke-dasharray': '6 4'
    });
  }
  if (state.fertig && i === state.fakeIndex) {
    parts += svg.circle(x, y, r + 8, 'none', { stroke: '#2a8a2a', 'stroke-width': 4 });
  }
  return parts;
}

function drawScale(state, angle, app, hint) {
  const g = [];
  // fester Ständer
  g.push(svg.rect(440, 130, 20, 82, '#6b5b3f', { rx: 5 }));
  g.push(svg.rect(378, 212, 144, 16, '#5a4c34', { rx: 7 }));
  // drehbarer Balken + Schalen
  const rot = [];
  rot.push(svg.rect(170, 124, 560, 12, '#8a6f47', { rx: 6 }));
  rot.push(svg.circle(450, 130, 9, '#4a3f2c'));
  rot.push(svg.el('line', { x1: 170, y1: 132, x2: 92, y2: 330, stroke: '#9b8f7a', 'stroke-width': 3 }));
  rot.push(svg.el('line', { x1: 170, y1: 132, x2: 248, y2: 330, stroke: '#9b8f7a', 'stroke-width': 3 }));
  rot.push(svg.el('line', { x1: 730, y1: 132, x2: 652, y2: 330, stroke: '#9b8f7a', 'stroke-width': 3 }));
  rot.push(svg.el('line', { x1: 730, y1: 132, x2: 808, y2: 330, stroke: '#9b8f7a', 'stroke-width': 3 }));
  rot.push(svg.el('ellipse', { cx: PAN_X.L, cy: PAN_Y, rx: 96, ry: 26, fill: '#e7d7ba', stroke: '#8a6f47', 'stroke-width': 3 }));
  rot.push(svg.el('ellipse', { cx: PAN_X.R, cy: PAN_Y, rx: 96, ry: 26, fill: '#e7d7ba', stroke: '#8a6f47', 'stroke-width': 3 }));
  for (const pan of [1, 2]) {
    const idxs = panCoins(state, pan);
    const cx = pan === 1 ? PAN_X.L : PAN_X.R;
    const n = idxs.length, spacing = 46;
    idxs.forEach((i, k) => {
      const x = cx + (k - (n - 1) / 2) * spacing;
      rot.push(drawCoin(i, x, PAN_Y, 24, state, hint));
    });
  }
  g.push(svg.group(rot.join(''), { transform: `rotate(${angle} 450 130)` }));
  // Beschriftung
  g.push(svg.text(PAN_X.L, 402, tt(app, T.links), {
    'font-size': 15, 'text-anchor': 'middle', fill: '#999'
  }));
  g.push(svg.text(PAN_X.R, 402, tt(app, T.rechts), {
    'font-size': 15, 'text-anchor': 'middle', fill: '#999'
  }));
  return svg.group(g.join(''));
}

function drawTable(state, app, hint) {
  const g = [];
  g.push(svg.rect(TABLE_RECT.x, TABLE_RECT.y, TABLE_RECT.w, TABLE_RECT.h, '#f3ead8', {
    rx: 14, stroke: '#d8c9a8', 'stroke-width': 2
  }));
  g.push(svg.text(TABLE_RECT.x + 16, TABLE_RECT.y + 24, tt(app, T.tisch), {
    'font-size': 15, fill: '#a89f8c', 'font-weight': 'bold'
  }));
  for (let i = 0; i < N; i++) {
    const s = tableSlot(i);
    if (state.ort[i] === 0) {
      g.push(drawCoin(i, s.x, s.y, 34, state, hint));
    } else {
      g.push(svg.circle(s.x, s.y, 34, '#e7dcc2', {
        stroke: '#d8c9a8', 'stroke-width': 2, 'stroke-dasharray': '5 5', opacity: 0.7
      }));
    }
  }
  return svg.group(g.join(''));
}

function msgText(state, app) {
  if (state.answerMode) {
    if (state.answerCoin == null) return tt(app, T.waehle_muenze);
    return fmt(tt(app, T.waehle_richtung), { n: state.answerCoin + 1 });
  }
  const m = state.msg || 'start';
  if (m === 'richtig') {
    const dir = tt(app, state.fakeHeavy === 1 ? T.schwerer_wort : T.leichter_wort);
    return fmt(tt(app, T.richtig), { n: state.fakeIndex + 1, dir });
  }
  return (T[m] && tt(app, T[m])) || '';
}

function drawStatus(state, app, hint) {
  const g = [];
  g.push(svg.text(450, 40, msgText(state, app), {
    'font-size': 20, 'text-anchor': 'middle', 'font-weight': 'bold', fill: '#333'
  }));
  let sub = state.msg2 ? (tt(app, T[state.msg2]) || '') : '';
  if (!sub && hint && !state.fertig && !state.answerMode) {
    sub = fmt(tt(app, T.moeglich), { n: possible(state).length });
  }
  if (sub) {
    g.push(svg.text(450, 68, sub, { 'font-size': 16, 'text-anchor': 'middle', fill: '#777' }));
  }
  return svg.group(g.join(''));
}

function drawButtons(state, app) {
  const g = [];
  if (state.answerMode) {
    const sel = state.answerCoin != null;
    g.push(btn(ANSWER_BUTTONS[0].x, ANSWER_BUTTONS[0].y, ANSWER_BUTTONS[0].w, ANSWER_BUTTONS[0].h,
      tt(app, T.schwerer), sel, false));
    g.push(btn(ANSWER_BUTTONS[1].x, ANSWER_BUTTONS[1].y, ANSWER_BUTTONS[1].w, ANSWER_BUTTONS[1].h,
      tt(app, T.leichter), sel, false));
    g.push(btn(ANSWER_BUTTONS[2].x, ANSWER_BUTTONS[2].y, ANSWER_BUTTONS[2].w, ANSWER_BUTTONS[2].h,
      tt(app, T.abbrechen), true, false));
    g.push(svg.rect(590, 702, 240, 52, '#ece5d3', { rx: 12, stroke: '#a89f8c', 'stroke-width': 2 }));
    g.push(svg.text(710, 734, `${tt(app, T.wagen)}: ${state.weighings.length}`, {
      'font-size': 19, 'text-anchor': 'middle', 'font-weight': 'bold', fill: '#5b4f3c'
    }));
    return svg.group(g.join(''));
  }
  const lc = panCoins(state, 1).length, rc = panCoins(state, 2).length;
  const canWeigh = lc > 0 && rc > 0 && lc === rc && !state.fertig;
  const labels = {
    wiegen: tt(app, T.wiegen),
    leeren: tt(app, T.leeren),
    rueckgaengig: tt(app, T.rueckgaengig),
    loesung: tt(app, T.loesung),
    tipp: tt(app, T.tipp),
  };
  for (const b of BUTTONS) {
    let enabled = true, active = false;
    if (b.key === 'wiegen') enabled = canWeigh;
    else if (b.key === 'rueckgaengig') enabled = state.weighings.length > 0 && !state.fertig;
    else if (b.key === 'loesung') enabled = !state.fertig;
    else if (b.key === 'tipp') active = !!app.get('tipp');
    g.push(btn(b.x, b.y, b.w, b.h, labels[b.key], enabled, active));
  }
  g.push(svg.rect(590, 702, 240, 52, '#ece5d3', { rx: 12, stroke: '#a89f8c', 'stroke-width': 2 }));
  g.push(svg.text(710, 734, `${tt(app, T.wagen)}: ${state.weighings.length}`, {
    'font-size': 19, 'text-anchor': 'middle', 'font-weight': 'bold', fill: '#5b4f3c'
  }));
  return svg.group(g.join(''));
}

// ─── Aktionen ───────────────────────────────────────────────────────
function pickCoin(state, app, i) {
  // Ausgeschlossene Münzen dürfen weiterhin gewogen werden (z. B. als
  // bekannte Gegengewichte) – der Tipp markiert sie nur optisch.
  state.picked = (state.picked === i) ? null : i;
  app.rerender();
}

function wiegen(app) {
  const state = app.state;
  if (state.fertig || state.answerMode) return;
  const L = panCoins(state, 1), R = panCoins(state, 2);
  if (!L.length || !R.length) { state.msg = 'leer'; app.rerender(); return; }
  if (L.length !== R.length) { state.msg = 'ungleich'; app.rerender(); return; }
  const dup = state.weighings.some(w => sameSet(w.L, L) && sameSet(w.R, R));
  if (dup) { state.msg = 'doppelt'; app.rerender(); return; }

  const before = possible(state).length;
  const result = computeResult(L, R, state.fakeIndex, state.fakeHeavy);
  state.weighings.push({ L: L.slice(), R: R.slice(), result, ortBefore: state.ort.slice() });
  const after = possible(state).length;

  state.msg = 'gewogen_' + (result === '=' ? 'equal' : result);
  state.msg2 = (after === before) ? 'keine_info' : null;
  app.rerender();
}

function undo(app) {
  const state = app.state;
  if (!state.weighings.length) return;
  const last = state.weighings.pop();
  state.ort = last.ortBefore.slice();
  state.picked = null;
  state.msg = 'rueckgaengig_msg';
  state.msg2 = null;
  app.rerender();
}

function onButton(app, key) {
  const state = app.state;
  if (key === 'wiegen') wiegen(app);
  else if (key === 'leeren') {
    state.ort.fill(0); state.picked = null;
    state.msg = 'geleert'; state.msg2 = null; app.rerender();
  }
  else if (key === 'rueckgaengig') undo(app);
  else if (key === 'loesung') {
    state.answerMode = true; state.answerCoin = null;
    state.msg = 'waehle_muenze'; state.msg2 = null; app.rerender();
  }
  else if (key === 'tipp') {
    const on = !app.get('tipp');
    state.msg = on ? 'tipp_an' : 'tipp_aus'; state.msg2 = null;
    app.set('tipp', on ? 1 : 0);
  }
}

function submitAnswer(app, i, d) {
  const state = app.state;
  const correct = i === state.fakeIndex && d === state.fakeHeavy;
  state.answerMode = false;
  state.answerCoin = null;
  if (correct) {
    state.fertig = true;
    state.msg = 'richtig';
  } else {
    state.fehlversuche++;
    state.msg = 'falsch';
  }
  state.msg2 = null;
  app.rerender();
}

const app = new MiniApp({
  id: 'falschmuenzen',
  icon: '⚖️',
  titel: {
    de: 'Falschmünzen-Waage',
    ru: 'Фальшивая монета',
    en: 'Counterfeit Coins'
  },
  anweisung: {
    de: 'Eine von 12 Münzen ist falsch – sie ist etwas schwerer ODER leichter. Finde sie mit der Waage und sage, ob sie schwerer oder leichter ist.',
    ru: 'Одна из 12 монет фальшивая – она чуть тяжелее ИЛИ легче. Найди её с помощью весов и скажи, тяжелее она или легче.',
    en: 'One of 12 coins is fake – it is slightly heavier OR lighter. Find it with the scale and say whether it is heavier or lighter.'
  },
  hilfe: {
    de: 'Lege auf beide Schalen gleich viele Münzen und tippe „Wiegen“. Die Waage zeigt, welche Seite schwerer ist (oder Gleichgewicht). Jede Wägung schließt Fälle aus – mit 12 Münzen reichen 3 Wägungen. Tippe eine Münze an, um sie aufzunehmen, und dann die linke oder rechte Schale (oder ziehe die Münze direkt dorthin). „Tipp“ streicht unmögliche Fälle automatisch.',
    ru: 'Положи на обе чаши поровну монет и нажми «Взвесить». Весы покажут, какая чаша тяжелее (или равновесие). Каждое взвешивание исключает варианты – для 12 монет хватает 3 взвешиваний. Нажми монету, чтобы взять её, затем левую или правую чашу (или перетащи монету). «Подсказка» вычёркивает невозможные случаи.',
    en: 'Put the same number of coins on both pans and tap “Weigh”. The scale shows which side is heavier (or balanced). Each weighing rules out cases – with 12 coins, 3 weighings are enough. Tap a coin to pick it up, then tap the left or right pan (or drag the coin there). “Hint” strikes out impossible cases automatically.'
  },
  settingsSchema: {
    tipp: {
      def: 0, min: 0, max: 1, step: 1, bool: true,
      label: {
        de: 'Tipp: unmögliche Fälle streichen',
        ru: 'Подсказка: вычёркивать невозможное',
        en: 'Hint: strike out impossible cases'
      }
    }
  },
  auswertung: 'zuege',

  init(state, app) {
    state.ort = new Array(N).fill(0);
    state.picked = null;
    state.weighings = [];
    state.fakeIndex = Math.floor(Math.random() * N);
    state.fakeHeavy = Math.random() < 0.5 ? 1 : -1;
    state.fertig = false;
    state.fehlversuche = 0;
    state.answerMode = false;
    state.answerCoin = null;
    state.msg = 'start';
    state.msg2 = null;
  },

  render(state, app) {
    const hint = !!app.get('tipp');
    const angle = (() => {
      const last = state.weighings[state.weighings.length - 1];
      if (!last) return 0;
      return last.result === 'L' ? -6 : last.result === 'R' ? 6 : 0;
    })();
    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg" style="font-family:system-ui,sans-serif;width:100%;height:auto">
      ${drawStatus(state, app, hint)}
      ${drawScale(state, angle, app, hint)}
      ${drawTable(state, app, hint)}
      ${drawButtons(state, app)}
    </svg>`;
  },

  onTap(state, x, y, app) {
    if (state.fertig) return;

    if (state.answerMode) {
      for (const b of ANSWER_BUTTONS) {
        if (hit(b, x, y)) {
          if (b.key === 'abbrechen') {
            state.answerMode = false; state.answerCoin = null;
            state.msg = 'start'; state.msg2 = null; app.rerender();
          } else if (b.key === 'schwerer' && state.answerCoin != null) {
            submitAnswer(app, state.answerCoin, 1);
          } else if (b.key === 'leichter' && state.answerCoin != null) {
            submitAnswer(app, state.answerCoin, -1);
          }
          return;
        }
      }
      const ci = coinAt(x, y, state);
      if (ci != null) { state.answerCoin = ci; app.rerender(); }
      return;
    }

    for (const b of BUTTONS) {
      if (hit(b, x, y)) { onButton(app, b.key); return; }
    }

    if (state.picked != null) {
      // Erst auf eine Schale ablegen (auch wenn dort schon eine Münze liegt).
      const pan = panAt(x, y);
      if (pan) {
        state.ort[state.picked] = pan === 'L' ? 1 : 2;
        state.picked = null;
        state.msg = null; state.msg2 = null;
        app.rerender(); return;
      }
      // Andere Münze antippen → Auswahl wechseln, gleiche Münze → abwählen.
      const ci = coinAt(x, y, state);
      if (ci != null) {
        state.picked = (ci === state.picked) ? null : ci;
        app.rerender(); return;
      }
      // Leere Stelle auf dem Tisch → zurück auf den Tisch legen.
      if (hit(TABLE_RECT, x, y)) {
        state.ort[state.picked] = 0;
        state.picked = null;
        app.rerender(); return;
      }
      state.picked = null; app.rerender(); return;
    }

    const ci = coinAt(x, y, state);
    if (ci != null) { pickCoin(state, app, ci); return; }
  },

  onDrop(state, x0, y0, x1, y1, app) {
    if (state.fertig || state.answerMode) { state.picked = null; return; }
    const src = coinAt(x0, y0, state);
    if (src == null) { state.picked = null; app.rerender(); return; }
    const pan = panAt(x1, y1);
    if (pan) {
      state.ort[src] = pan === 'L' ? 1 : 2;
    } else if (hit(TABLE_RECT, x1, y1)) {
      state.ort[src] = 0;
    }
    state.picked = null;
    app.rerender();
  },

  evaluate(state, app) {
    if (!state.fertig) return null;
    const w = state.weighings.length;
    const f = state.fehlversuche;
    return {
      fertig: true,
      optimal: OPTIMAL,
      text: { de: 'Gelöst!', ru: 'Решено!', en: 'Solved!' },
      wert: tt(app, {
        de: `${w} Wägung${w === 1 ? '' : 'en'} · ${f} Fehlversuch${f === 1 ? '' : 'e'}`,
        ru: `${w} взвешиваний · ${f} ошибок`,
        en: `${w} weighing${w === 1 ? '' : 's'} · ${f} wrong guess${f === 1 ? '' : 'es'}`
      })
    };
  }
});

export default app;

// Direkt einbinden (apps/falschmuenzen/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
