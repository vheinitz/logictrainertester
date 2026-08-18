/**
 * Memory – Paare finden
 *
 * Migriert auf den neuen Spiel-Kontrakt (actions statt window._xyz, eigener
 * dispose()). Der Timer, der zwei nicht passende Karten wieder zudeckt, war
 * vorher ein freilaufendes setTimeout: verließ man das Modul in diesen 700 ms,
 * lief es weiter und schrieb in einen bereits verworfenen Spielstand.
 *
 * Zusätzlich: die Paarzahl wächst mit jedem gelösten Brett (6 → 10 Paare).
 */
import { engine } from '../core/engine.js';
import { shuffle, sample, pick } from '../core/html.js';
import { countRound, resultScreen, done } from '../core/session.js';
import { bar } from '../core/shell.js';
import { registerModuleSettings, modGet } from '../core/settings.js';

const UI = {
  frage: { de: '🃏 Finde die passenden Paare!', ru: '🃏 Найди парные карточки!', en: '🃏 Find the matching pairs!' },
  zuege: { de: 'Züge', ru: 'Ходы', en: 'Moves' },
  paare: { de: 'Paare', ru: 'Пары', en: 'Pairs' },
  gefunden: { de: 'Alle Paare gefunden!', ru: 'Все пары найдены!', en: 'All pairs found!' },
  in:   { de: 'In', ru: 'За', en: 'In' },
  zuegen: { de: 'Zügen', ru: 'ходов', en: 'moves' },
  naechstes: { de: 'Nächstes Brett', ru: 'Следующее поле', en: 'Next board' }
};

const ID = 'lern-memory';
registerModuleSettings(ID, {
  sekProPaar: {
    def: 12, min: 4, max: 40, step: 1, unit: 's',
    de: 'Zeit je Paar', ru: 'Время на пару', en: 'Time per pair',
    hintDe: 'Gesamtzeit = Paare × dieser Wert. Läuft sie ab, zählt das Brett als nicht gelöst.',
    hintRu: 'Общее время = пары × это значение.',
    hintEn: 'Total time is pairs × this value. When it runs out the board counts as unsolved.'
  }
});

const EMOJIS = ['🐶','🐱','🐰','🐸','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐵','🐔','🐧','🦄'];

let flipTimer = null;
let boardTimer = null;

function clearFlipTimer() {
  if (flipTimer) { clearTimeout(flipTimer); flipTimer = null; }
}

function deal(gd) {
  const picked = sample(EMOJIS, gd.pairs);
  gd.cards = shuffle([...picked, ...picked]).map(e => ({ emoji: e, revealed: false, matched: false }));
  gd.firstPick = null;
  gd.locked = false;
  gd.moves = 0;
  gd.phaseStart = Date.now();
  gd.frist = gd.pairs * modGet(ID, 'sekProPaar') * 1000;
}

function clearBoardTimer() {
  if (boardTimer) { clearTimeout(boardTimer); boardTimer = null; }
}

function starteFrist(gs) {
  clearBoardTimer();
  const gd = gs.gd;
  boardTimer = setTimeout(() => {
    boardTimer = null;
    if (!engine.activeGame || engine.activeGame.id !== ID) return;
    if (gd.phase === 'done' || gd.cards.every(c => c.matched)) return;
    gs.total = (gs.total || 0) + 1;
    if (countRound(gs)) gd.phase = 'done';
    else { gd.pairs = Math.max(4, (gd.pairs || 6) - 1); deal(gd); starteFrist(gs); }
    engine.renderGame();
  }, gd.frist);
}

export function init(gs) {
  const gd = gs.gd || {};
  gs.gd = gd;
  gd.pairs = gd.pairs || 6;
  deal(gd);
  gd._ready = true;
  starteFrist(gs);
  return gs;
}

export function dispose(gs) {
  clearFlipTimer();
  clearBoardTimer();
  if (gs && gs.gd) gs.gd._ready = false;
}

export function render(gs) {
  let gd = gs.gd;
  if (!gd || !gd._ready) { init(gs); gd = gs.gd; }

  if (gd.phase === 'done') return resultScreen(gs, { score: gs.score, total: gs.total });

  const matched = gd.cards.filter(c => c.matched).length;
  const allDone = matched === gd.cards.length;
  const cols = gd.pairs <= 6 ? 4 : gd.pairs <= 8 ? 4 : 5;

  let html = `<div style="width:100%;max-width:440px">
    ${bar(gd.frist || 1, Date.now() - (gd.phaseStart || Date.now()))}
    <p style="font-size:1.1em;text-align:center">${pick(UI.frage)}</p>
    <p style="color:var(--text-light);font-size:.9em;text-align:center">${pick(UI.zuege)}: ${gd.moves} &nbsp;|&nbsp; ${pick(UI.paare)}: ${matched / 2}/${gd.pairs}</p>
    <div class="memory-grid" style="margin:12px auto;grid-template-columns:repeat(${cols},1fr)">`;

  gd.cards.forEach((card, i) => {
    const cls = card.matched ? 'memory-card-matched'
      : card.revealed ? 'memory-card-revealed' : 'memory-card-hidden';
    html += `<div class="memory-card pick-target ${cls}" onclick="G('flip',${i})">${card.revealed || card.matched ? card.emoji : '?'}</div>`;
  });

  html += `</div>`;

  if (allDone) {
    const stars = gd.moves <= gd.pairs + 2 ? '⭐⭐⭐' : gd.moves <= gd.pairs + 5 ? '⭐⭐' : '⭐';
    html += `<div class="feedback-banner feedback-correct">🎉 ${pick(UI.gefunden)} ${stars}<br>${pick(UI.in)} ${gd.moves} ${pick(UI.zuegen)}</div>
      <div style="text-align:center;margin-top:10px">
        <button class="btn btn-primary btn-small" onclick="G('nextBoard')">▶️ ${pick(UI.naechstes)} (${Math.min(gd.pairs + 1, 10)} ${pick(UI.paare)})</button>
      </div>`;
  }

  html += `</div>`;
  return html;
}

export const actions = {
  flip(gs, idx) {
    const gd = gs.gd;
    if (gd.locked) return false;
    const card = gd.cards[idx];
    if (!card || card.revealed || card.matched) return false;

    card.revealed = true;

    if (gd.firstPick === null) {
      gd.firstPick = idx;
      return;
    }

    gd.moves++;
    const first = gd.cards[gd.firstPick];
    gs.total = (gs.total || 0) + 1;

    if (first.emoji === card.emoji) {
      first.matched = true;
      card.matched = true;
      gd.firstPick = null;
      gs.score = (gs.score || 0) + 1;
      // Ein abgeschlossenes Brett ist eine Übung – nicht jeder einzelne Zug.
      if (gd.cards.every(c => c.matched) && countRound(gs)) gd.phase = 'done';
      return;
    }

    // Kein Paar – kurz zeigen, dann wieder zudecken
    gd.locked = true;
    clearFlipTimer();
    const firstIdx = gd.firstPick;
    flipTimer = setTimeout(() => {
      flipTimer = null;
      if (!engine.activeGame || engine.activeGame.id !== 'lern-memory') return;
      gd.cards[firstIdx].revealed = false;
      card.revealed = false;
      gd.firstPick = null;
      gd.locked = false;
      engine.renderGame();
    }, 700);
  },

  restart(gs) {
    clearFlipTimer();
    clearBoardTimer();
    gs.gd = { pairs: 6 };
    gs.score = 0; gs.total = 0; gs.rounds = 0;
    init(gs);
  },

  nextBoard(gs) {
    const gd = gs.gd;
    clearFlipTimer();
    gd.pairs = Math.min(gd.pairs + 1, 10);
    deal(gd);
    starteFrist(gs);
  }
};

export const scoring = 'count';
