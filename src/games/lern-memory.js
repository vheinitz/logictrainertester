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
import { shuffle, sample } from '../core/html.js';
import { countRound, resultScreen, done } from '../core/session.js';

const EMOJIS = ['🐶','🐱','🐰','🐸','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐵','🐔','🐧','🦄'];

let flipTimer = null;

function clearFlipTimer() {
  if (flipTimer) { clearTimeout(flipTimer); flipTimer = null; }
}

function deal(gd) {
  const picked = sample(EMOJIS, gd.pairs);
  gd.cards = shuffle([...picked, ...picked]).map(e => ({ emoji: e, revealed: false, matched: false }));
  gd.firstPick = null;
  gd.locked = false;
  gd.moves = 0;
}

export function init(gs) {
  const gd = gs.gd || {};
  gs.gd = gd;
  gd.pairs = gd.pairs || 6;
  deal(gd);
  gd._ready = true;
  return gs;
}

export function dispose(gs) {
  clearFlipTimer();
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
    <p style="font-size:1.1em;text-align:center">🃏 <b>Finde die passenden Paare!</b></p>
    <p style="color:var(--text-light);font-size:.9em;text-align:center">Züge: ${gd.moves} &nbsp;|&nbsp; Paare: ${matched / 2}/${gd.pairs}</p>
    <div class="memory-grid" style="margin:12px auto;grid-template-columns:repeat(${cols},1fr)">`;

  gd.cards.forEach((card, i) => {
    const cls = card.matched ? 'memory-card-matched'
      : card.revealed ? 'memory-card-revealed' : 'memory-card-hidden';
    html += `<div class="memory-card pick-target ${cls}" onclick="G('flip',${i})">${card.revealed || card.matched ? card.emoji : '?'}</div>`;
  });

  html += `</div>`;

  if (allDone) {
    const stars = gd.moves <= gd.pairs + 2 ? '⭐⭐⭐' : gd.moves <= gd.pairs + 5 ? '⭐⭐' : '⭐';
    html += `<div class="feedback-banner feedback-correct">🎉 Alle Paare gefunden! ${stars}<br>In ${gd.moves} Zügen</div>
      <div style="text-align:center;margin-top:10px">
        <button class="btn btn-primary btn-small" onclick="G('nextBoard')">▶️ Nächstes Brett (${Math.min(gd.pairs + 1, 10)} Paare)</button>
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
    gs.gd = { pairs: 6 };
    gs.score = 0; gs.total = 0; gs.rounds = 0;
    init(gs);
  },

  nextBoard(gs) {
    const gd = gs.gd;
    clearFlipTimer();
    gd.pairs = Math.min(gd.pairs + 1, 10);
    deal(gd);
  }
};

export const scoring = 'count';
