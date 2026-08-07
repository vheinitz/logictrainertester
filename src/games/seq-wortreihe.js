/**
 * Wörter-Kette: Merke Wörter, wähle aus 15+ Buttons per Klick
 */
import { t } from '../i18n/i18n-core.js';
import { engine } from '../core/engine.js';
import * as storage from '../core/storage.js';

const ALL_WORDS = [
  'Haus','Baum','Sonne','Mond','Blume','Fisch','Auto','Buch',
  'Tisch','Stuhl','Katze','Hund','Ball','Apfel','Schuh','Uhr',
  'Bett','Lampe','Vogel','Brot','Milch','Regen','Schnee','Wind',
  'Feuer','Stein','Wolke','Stern','Herz','Tür'
];

export function init(gs) {
  const gd = gs.gd || {};
  gd.len = gd.len || 2;
  const pool = [...ALL_WORDS];
  gd.sequence = [];
  for (let i = 0; i < gd.len; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    gd.sequence.push(pool.splice(idx, 1)[0]);
  }
  // Pick 15 random words including the correct ones + distractors
  const distractors = ALL_WORDS.filter(w => !gd.sequence.includes(w));
  const shuffled = [...distractors].sort(() => Math.random() - 0.5);
  gd.options = [...gd.sequence, ...shuffled].slice(0, 18).sort(() => Math.random() - 0.5);
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
    setTimeout(() => { gd.showing = false; engine.render(); }, 3000 + gd.len * 600);
    return `<p style="font-size:1.2em">📝 <b>Merke dir diese Wörter:</b></p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:16px 0">
        ${gd.sequence.map((w,i) => `<div style="padding:10px 18px;border-radius:20px;background:${['#FF6B6B','#4ECDC4','#FFD93D','#4D96FF','#FF8A5C','#C084FC'][i%6]};color:#fff;font-weight:700;font-size:1.1em">${w}</div>`).join('')}
      </div>
      <p style="color:var(--text-light);font-size:0.9em">Verschwindet in Kürze...</p>`;
  }

  if (!gd.answered) {
    const selected = gd.userAnswer;
    const remaining = gd.len - selected.length;
    const availableWords = gd.options.filter(w => !selected.includes(w));

    return `<div style="width:100%;max-width:550px">
      <p style="font-size:1.1em">👆 <b>Klicke die Wörter in der richtigen Reihenfolge!</b></p>
      <p style="color:var(--text-light);font-size:0.9em">Noch ${remaining} Wort${remaining!==1?'e':''}</p>

      <!-- Answer row -->
      <div style="display:flex;gap:6px;min-height:44px;flex-wrap:wrap;align-items:center;justify-content:center;margin:12px 0">
        ${selected.map((w,i) => {
          const color = ['#FF6B6B','#4ECDC4','#FFD93D','#4D96FF','#FF8A5C','#C084FC'][i%6];
          return `<div onclick="window._removeWort(${i})" style="padding:6px 14px;border-radius:16px;background:${color};color:#fff;font-weight:700;cursor:pointer;font-size:0.95em">${w} ✕</div>`;
        }).join('')}
        ${Array(remaining).fill(0).map(() => `<div style="padding:6px 14px;border-radius:16px;border:2px dashed #E0DDF5;min-width:60px"></div>`).join('')}
      </div>

      <!-- Word buttons -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px">
        ${gd.options.map(w => {
          const used = selected.includes(w);
          return `<div onclick="window._pickWort('${w}',this)" style="padding:8px 16px;border-radius:16px;background:${used?'#E0DDF5':'var(--bg)'};color:${used?'#B0ADC5':'var(--text)'};border:2px solid ${used?'#E0DDF5':'#D0CDE8'};cursor:${used?'default':'pointer'};font-weight:600;font-size:0.95em;transition:all 0.15s;opacity:${used?'0.4':'1'}">${w}</div>`;
        }).join('')}
      </div>

      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-primary btn-small" onclick="window._checkWortreiheGame()">✅ Fertig</button>
        <button class="btn btn-secondary btn-small" onclick="window._resetWortreihe()">🔄 Zurücksetzen</button>
      </div>
    </div>`;
  }

  return gd.feedback || '';
}

window._pickWort = function(w, el) {
  const gd = engine.gameState.gd;
  if (gd.userAnswer.length >= gd.len) return;
  if (gd.userAnswer.includes(w)) return;
  gd.userAnswer.push(w);
  el.style.transform = 'scale(0.9)';
  setTimeout(() => el.style.transform = '', 150);
  engine.render();
};

window._removeWort = function(idx) {
  engine.gameState.gd.userAnswer.splice(idx, 1);
  engine.render();
};

window._resetWortreihe = function() {
  engine.gameState.gd.userAnswer = [];
  engine.render();
};

window._checkWortreiheGame = function() {
  const gs = engine.gameState;
  const gd = gs.gd;
  if (gd.userAnswer.length < gd.len) return;
  
  gs.total = (gs.total || 0) + 1;
  const correct = gd.userAnswer.every((w, i) => w === gd.sequence[i]);
  
  if (correct) {
    gs.score = (gs.score || 0) + 1;
    gd.feedback = `<div class="feedback-banner feedback-correct">🎉 Richtig! ${gd.sequence.join(' → ')}</div>`;
    gd.len = Math.min(gd.len + 1, 6);
  } else {
    gd.feedback = `<div class="feedback-banner feedback-wrong">
      😔 Deine Reihenfolge: <b>${gd.userAnswer.join(' → ')}</b><br>
      Richtig: <b>${gd.sequence.join(' → ')}</b>
    </div>`;
  }
  gd.answered = true;
  engine.render();
};
