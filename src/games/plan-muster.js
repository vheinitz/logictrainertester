/**
 * Muster fortsetzen – visuelles Muster erkennen, per Klick aus 4 Optionen wählen
 */
import { t } from '../i18n/i18n-core.js';
import { engine } from '../core/engine.js';

const PATTERNS = [
  { seq:['🔴','🔵','🔴','🔵'], opts:['🔴','🔵','🟢','🟡'], ans:0 },
  { seq:['⭐','🌟','⭐','🌟'], opts:['⭐','🌟','💫','✨'], ans:0 },
  { seq:['🌞','🌙','🌞','🌙'], opts:['🌞','🌙','⭐','☁️'], ans:0 },
  { seq:['🟥','🟦','🟩','🟥'], opts:['🟦','🟩','🟨','🟪'], ans:0 },
  { seq:['🐕','🐈','🐕','🐈'], opts:['🐕','🐈','🐇','🐘'], ans:0 },
  { seq:['🍎','🍎','🍌','🍎'], opts:['🍎','🍌','🍇','🍊'], ans:0 },
  { seq:['1','2','3','4'], opts:['3','4','5','6'], ans:2 },
  { seq:['🔺','🔺','⬛','🔺'], opts:['🔺','⬛','🔵','🔷'], ans:0 },
  { seq:['🌱','🌿','🌱','🌿'], opts:['🌱','🌿','🌳','🍀'], ans:0 },
  { seq:['🚗','🚌','🚗','🚌'], opts:['🚗','🚌','🚲','✈️'], ans:0 },
  { seq:['🎵','🎶','🎵','🎶'], opts:['🎵','🎶','🎼','🎤'], ans:0 },
  { seq:['❄️','☀️','❄️','☀️'], opts:['❄️','☀️','🌧️','🌈'], ans:0 },
];

export function init(gs) {
  const gd = gs.gd || {};
  if (gd.patIdx === undefined) gd.patIdx = 0;
  gd.current = PATTERNS[gd.patIdx % PATTERNS.length];
  gd.answered = false;
  gd.userPick = null;
  gs.gd = gd;
  return gs;
}

export function render(gs) {
  const gd = gs.gd;
  if (!gd || !gd.current) { init(gs); return render(gs); }

  if (!gd.answered) {
    return `<div style="width:100%;max-width:500px">
      <p style="font-size:1.2em">🔲 <b>Was kommt als nächstes?</b></p>
      
      <div style="display:flex;gap:8px;justify-content:center;align-items:center;margin:20px 0;flex-wrap:wrap">
        ${gd.current.seq.map(s => `<div style="width:56px;height:56px;border-radius:var(--radius-sm);background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:2em">${s}</div>`).join('')}
        <div style="font-size:1.5em;color:var(--text-light)">→</div>
        <div style="width:56px;height:56px;border-radius:var(--radius-sm);border:2px dashed var(--gold);display:flex;align-items:center;justify-content:center;font-size:2em">❓</div>
      </div>

      <p style="color:var(--text-light);font-size:0.9em">Tippe die richtige Fortsetzung:</p>
      <div style="display:flex;gap:12px;justify-content:center;margin:12px 0;flex-wrap:wrap">
        ${gd.current.opts.map((o, i) => {
          const sel = gd.userPick === i;
          return `<div onclick="window._pickMuster(${i},this)" style="width:64px;height:64px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:2em;cursor:pointer;border:3px solid ${sel?'var(--primary)':'#E0DDF5'};background:${sel?'#EBE9FF':'#fff'};transition:all 0.2s">${o}</div>`;
        }).join('')}
      </div>

      <button class="btn btn-primary btn-small" onclick="window._checkMusterGame()" ${gd.userPick===null?'disabled':''}>✅ Diese${gd.userPick!==null?'s':''} ist es!</button>
    </div>`;
  }

  return gd.feedback || '';
}

window._pickMuster = function(idx, el) {
  engine.gameState.gd.userPick = idx;
  engine.render();
};

window._checkMusterGame = function() {
  const gs = engine.gameState;
  const gd = gs.gd;
  if (gd.userPick === null) return;
  
  gs.total = (gs.total || 0) + 1;
  const correct = gd.userPick === gd.current.ans;
  
  if (correct) {
    gs.score = (gs.score || 0) + 1;
    gd.feedback = `<div class="feedback-banner feedback-correct">🎉 Ja! ${gd.current.opts[gd.current.ans]} ist richtig!</div>`;
  } else {
    gd.feedback = `<div class="feedback-banner feedback-wrong">😔 Richtig ist: <b>${gd.current.opts[gd.current.ans]}</b></div>`;
  }
  gd.answered = true;
  gd.patIdx++;
  engine.render();
};
