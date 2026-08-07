/**
 * Game: Zahlenfolgen merken
 * Dynamic import module – each game exports { render(gs), init(gs) }
 */
import { t } from '../i18n/i18n-core.js';
import { engine } from '../core/engine.js';
import * as storage from '../core/storage.js';

function shuffle(a) { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }

export function init(gs) {
  const gd = gs.gd || {};
  gd.len = gd.len || 2;
  gd.sequence = [];
  for (let i = 0; i < gd.len; i++) gd.sequence.push(Math.floor(Math.random() * 9) + 1);
  gd.userAnswer = [];
  gd.showing = true;
  gd.showStart = Date.now();
  gd.answered = false;
  gs.gd = gd;
  return gs;
}

export function render(gs) {
  const gd = gs.gd;
  if (!gd || !gd.sequence) { init(gs); return render(gs); }

  if (gd.showing) {
    setTimeout(() => { gd.showing = false; engine.render(); }, 2000);
    return `<p style="font-size:1.2em">🔢 <b>${t('memorizeNumbers') || 'Merke dir diese Zahlen:'}</b></p>
      <div class="sequence-display">${gd.sequence.map((n,i) => `<div class="seq-item" style="background:${['#FF6B6B','#4ECDC4','#FFD93D','#4D96FF','#FF8A5C'][i%5]};color:${i===2?'#333':'#fff'}">${n}</div>`).join('')}</div>
      <p style="color:var(--text-light);font-size:.9em">${t('disappearing') || 'Verschwindet in 2 Sekunden...'}</p>`;
  }

  if (!gd.answered) {
    return `<p>✏️ <b>${t('enterNumbers') || 'Gib die Zahlen ein:'}</b></p>
      <input id="answerInput" class="answer-input" placeholder="${gd.sequence.join('')}" onkeypress="if(event.key==='Enter')window._checkZahlen()">
      <br><button class="btn btn-primary btn-small" onclick="window._checkZahlen()">${t('check')}</button>`;
  }

  return gd.feedback || '';
}

// Global check function
window._checkZahlen = function() {
  const gs = engine.gameState;
  const gd = gs.gd;
  const inp = (document.getElementById('answerInput')?.value || '').replace(/\D/g, '');
  const correct = gd.sequence.join('');
  gs.total = (gs.total || 0) + 1;
  const ok = inp === correct;
  if (ok) {
    gs.score = (gs.score || 0) + 1;
    gd.feedback = `<div class="feedback-banner feedback-correct">${t('correct')}</div>`;
    gd.len = Math.min(gd.len + 1, 8);
  } else {
    gd.feedback = `<div class="feedback-banner feedback-wrong">${t('wrong')} ${t('correctWas') || 'Richtig war:'} <b>${correct}</b></div>`;
  }
  gd.answered = true;
  engine.render();
};
