/**
 * Memory – 12 Karten, per Klick umdrehen, Paare finden
 */
import { t } from '../i18n/i18n-core.js';
import { engine } from '../core/engine.js';

const EMOJIS = ['🐶','🐱','🐰','🐸','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐵','🐔','🐧','🦄'];

function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

export function init(gs) {
  const gd = gs.gd || {};
  gd.pairs = gd.pairs || 6;
  const picked = shuffle(EMOJIS).slice(0, gd.pairs);
  gd.cards = shuffle([...picked, ...picked]).map((e, i) => ({
    emoji: e, index: i, revealed: false, matched: false
  }));
  gd.firstPick = null;
  gd.locked = false;
  gd.moves = 0;
  gs.gd = gd;
  return gs;
}

export function render(gs) {
  const gd = gs.gd;
  if (!gd || !gd.cards) { init(gs); return render(gs); }

  const matched = gd.cards.filter(c => c.matched).length;
  const allDone = matched === gd.cards.length;

  let html = `<div style="width:100%;max-width:420px">
    <p style="font-size:1.1em">🃏 <b>Finde die passenden Paare!</b></p>
    <p style="color:var(--text-light);font-size:0.9em">Züge: ${gd.moves} &nbsp;|&nbsp; Paare: ${matched/2}/${gd.pairs}</p>
    
    <div class="memory-grid" style="margin:12px auto">`;

  gd.cards.forEach((card, i) => {
    let cls = 'memory-card ';
    if (card.matched) cls += 'memory-card-matched';
    else if (card.revealed) cls += 'memory-card-revealed';
    else cls += 'memory-card-hidden';
    html += `<div class="${cls}" onclick="window._flipMemoryCard(${i})">${card.revealed || card.matched ? card.emoji : '?'}</div>`;
  });

  html += `</div>`;

  if (allDone) {
    const stars = gd.moves <= gd.pairs + 2 ? '⭐⭐⭐' : gd.moves <= gd.pairs + 5 ? '⭐⭐' : '⭐';
    html += `<div class="feedback-banner feedback-correct">🎉 Alle Paare gefunden! ${stars}<br>In ${gd.moves} Zügen</div>`;
  }

  html += `</div>`;
  return html;
}

window._flipMemoryCard = function(idx) {
  const gs = engine.gameState;
  const gd = gs.gd;
  if (gd.locked) return;
  const card = gd.cards[idx];
  if (card.revealed || card.matched) return;

  card.revealed = true;

  if (!gd.firstPick && gd.firstPick !== 0) {
    gd.firstPick = idx;
    engine.render();
    return;
  }

  gd.moves++;
  const first = gd.cards[gd.firstPick];
  gd.locked = true;

  if (first.emoji === card.emoji) {
    first.matched = true;
    card.matched = true;
    gd.firstPick = null;
    gd.locked = false;
    gs.score = (gs.score || 0) + 1;
    gs.total = (gs.total || 0) + 1;
    
    // Check if all done
    const allDone = gd.cards.every(c => c.matched);
    if (allDone) {
      gs.score = (gs.score || 0) + 2; // Bonus
    }
    engine.render();
  } else {
    gs.total = (gs.total || 0) + 1;
    engine.render();
    setTimeout(() => {
      first.revealed = false;
      card.revealed = false;
      gd.firstPick = null;
      gd.locked = false;
      engine.render();
    }, 700);
  }
};
