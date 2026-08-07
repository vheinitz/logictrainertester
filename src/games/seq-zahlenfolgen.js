/**
 * Zahlenfolgen – adaptiver Test mit Bewertungsmodell
 *
 * Ablauf:
 *   N Zahlen zeigen (N × f Sekunden), dann 2×N×f Sekunden warten.
 *   Richtig → N++, falsch → neuer Versuch mit gleichem N.
 *   Timeout beim Warten = Fehlversuch → N-- (min 2).
 *   Bewertungsskala:
 *     N=2:0%  3:20%  4:30%  5:50%  6:75%  7:90%  8:100%  9:120%  10:130%
 *     N=10+richtig:150%
 *   Die letzte Bewertung zählt. Läuft bis Abbruch.
 */
import { t } from '../i18n/i18n-core.js';
import { engine } from '../core/engine.js';

const F = 0.8; // Sekunden pro Ziffer (×N)
const SCORE_MAP = { 2:0, 3:20, 4:30, 5:50, 6:75, 7:90, 8:100, 9:120, 10:130 };
const BONUS_10PLUS = 150;
const MIN_N = 2;
const MAX_N = 10;

// Generate random digits 1-9
function genSeq(len) {
  const s = [];
  for (let i = 0; i < len; i++) s.push(Math.floor(Math.random() * 9) + 1);
  return s;
}

export function init(gs) {
  const gd = gs.gd || {};

  // Persist level across rounds
  if (!gd.level) gd.level = MIN_N;

  gd.sequence = genSeq(gd.level);
  gd.userAnswer = [];
  gd.phase = 'show';   // 'show' | 'wait' | 'answer' | 'feedback'
  gd.showStart = Date.now();
  gd.showDuration = gd.level * F * 1000;        // N×f Sekunden zeigen
  gd.waitDuration = 2 * gd.level * F * 1000;     // 2×N×f Sekunden warten
  gd.answered = false;
  gd.currentScore = computeScore(gd.level);
  gd.bestLevel = gd.bestLevel || MIN_N;

  // 20 clickable digits (0-9 mixed, more of 1-9)
  gd.digitPool = [1,2,3,4,5,6,7,8,9, 1,2,3,4,5,6,7,8,9, 0,0];

  gs.gd = gd;
  return gs;
}

function computeScore(level) {
  if (level > MAX_N) return BONUS_10PLUS;
  return SCORE_MAP[level] || 0;
}

export function render(gs) {
  const gd = gs.gd;
  if (!gd || !gd.sequence) { init(gs); return render(gs); }

  const elapsed = Date.now() - gd.showStart;

  // === PHASE: show ===
  if (gd.phase === 'show') {
    const remaining = Math.max(0, gd.showDuration - elapsed);
    if (remaining <= 0) {
      gd.phase = 'wait';
      gd.showStart = Date.now(); // reset timer for wait phase
      engine.render();
      return '';
    }
    // Schedule next render when show phase ends
    setTimeout(() => engine.render(), Math.min(remaining, 200));
    return `<div style="text-align:center">
      <p style="font-size:1.1em;margin-bottom:4px">🔢 <b>Merke dir ${gd.level} Zahlen!</b></p>
      <div style="display:flex;gap:10px;justify-content:center;margin:16px 0;flex-wrap:wrap">
        ${gd.sequence.map((n, i) =>
          `<div style="width:52px;height:52px;border-radius:50%;background:${['#FF6B6B','#4ECDC4','#FFD93D','#4D96FF','#FF8A5C','#C084FC','#FB923C','#34D399','#F472B6','#A78BFA'][i]};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.5em;font-weight:800">${n}</div>`
        ).join('')}
      </div>
      <p style="color:var(--text-light);font-size:0.85em">Noch ${Math.ceil(remaining/1000)}s…</p>
      <div style="margin-top:8px;font-size:0.8em;color:var(--text-light)">
        Niveau ${gd.level} • Bewertung: ${computeScore(gd.level)}%
      </div>
    </div>`;
  }

  // === PHASE: wait (Pause) ===
  if (gd.phase === 'wait') {
    const remaining = Math.max(0, gd.waitDuration - elapsed);
    if (remaining <= 0) {
      gd.phase = 'answer';
      gd.userAnswer = [];
      engine.render();
      return '';
    }
    setTimeout(() => engine.render(), Math.min(remaining, 300));
    return `<div style="text-align:center">
      <p style="font-size:1.2em">⏳ <b>Warte…</b></p>
      <p style="color:var(--text-light);margin:16px 0">Nicht antworten! Noch <b>${Math.ceil(remaining/1000)}s</b></p>
      <p style="font-size:0.8em;color:var(--orange)">⚠️ Zu frühes Antworten zählt als Fehler!</p>
      <div style="margin-top:12px">
        <button class="btn btn-secondary btn-small" onclick="window._skipWaitZahlen()">⏭️ Überspringen</button>
      </div>
    </div>`;
  }

  // === PHASE: answer (Eingabe per Klick) ===
  if (gd.phase === 'answer') {
    const selected = gd.userAnswer;
    const remaining = gd.level - selected.length;

    return `<div style="width:100%;max-width:480px">
      <p style="font-size:1.1em;text-align:center">👆 <b>Klicke die ${gd.level} Zahlen in der richtigen Reihenfolge!</b></p>

      <!-- Answer row -->
      <div style="display:flex;gap:8px;min-height:52px;align-items:center;justify-content:center;margin:12px 0;flex-wrap:wrap">
        ${selected.map((n, i) =>
          `<div onclick="window._removeZahl(${i})" style="width:44px;height:44px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2em;font-weight:800;cursor:pointer;position:relative">${n}<span style="position:absolute;font-size:0.45em;bottom:-10px;color:var(--secondary)">✕</span></div>`
        ).join('')}
        ${Array(remaining).fill(0).map(() =>
          `<div style="width:44px;height:44px;border-radius:50%;border:2px dashed #E0DDF5"></div>`
        ).join('')}
      </div>

      <!-- Digit grid: 20 circles -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px">
        ${gd.digitPool.map((n, i) => {
          const colors = ['#FF6B6B','#4ECDC4','#FFD93D','#4D96FF','#FF8A5C','#C084FC','#FB923C','#34D399','#F472B6'];
          const bg = n === 0 ? '#94A3B8' : colors[n - 1];
          return `<div onclick="window._pickZahl(${n},this)" style="width:48px;height:48px;border-radius:50%;background:${bg};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2em;font-weight:700;cursor:pointer;transition:all 0.12s;user-select:none">${n}</div>`;
        }).join('')}
      </div>

      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-primary btn-small" onclick="window._checkZahlenfolge()" ${selected.length < gd.level ? 'disabled' : ''}>✅ Fertig</button>
        <button class="btn btn-secondary btn-small" onclick="window._resetZahlen()">🔄 Neu</button>
        <button class="btn btn-secondary btn-small" onclick="window._stopZahlenTest()">⏹️ Beenden</button>
      </div>
    </div>`;
  }

  // === PHASE: feedback ===
  if (gd.stopped) {
    return (gd.feedback || '') + `<div style="margin-top:12px"><button class="btn btn-primary btn-small" onclick="navigateTo('menu')">🏠 Fertig</button></div>`;
  }
  return gd.feedback || '';
}

// ─── Handlers ───────────────────────────────────────────

window._skipWaitZahlen = function () {
  const gd = engine.gameState.gd;
  gd.phase = 'answer';
  gd.userAnswer = [];
  engine.render();
};

window._pickZahl = function (n, el) {
  const gd = engine.gameState.gd;
  if (gd.phase !== 'answer') return;
  if (gd.userAnswer.length >= gd.level) return;
  gd.userAnswer.push(n);
  el.style.transform = 'scale(0.82)';
  setTimeout(() => { el.style.transform = ''; }, 120);
  engine.render();
};

window._removeZahl = function (idx) {
  const gd = engine.gameState.gd;
  gd.userAnswer.splice(idx, 1);
  engine.render();
};

window._resetZahlen = function () {
  engine.gameState.gd.userAnswer = [];
  engine.render();
};

window._checkZahlenfolge = function () {
  const gs = engine.gameState;
  const gd = gs.gd;
  if (gd.userAnswer.length < gd.level) return;

  const correct = gd.userAnswer.join(',') === gd.sequence.join(',');

  if (correct) {
    // ✅ Level-Up
    const oldLevel = gd.level;
    gd.level = Math.min(gd.level + 1, MAX_N + 2); // allow 10+ for bonus
    gd.bestLevel = Math.max(gd.bestLevel, oldLevel);
    const newScore = computeScore(oldLevel);
    gd.currentScore = newScore;
    gd.feedback = `<div class="feedback-banner feedback-correct">
      ✅ <b>Richtig!</b> Niveau ${oldLevel} gemeistert → <b>${newScore}%</b><br>
      <span style="font-size:0.85em">Nächstes Niveau: ${Math.min(gd.level, MAX_N)}</span>
    </div>`;
    gs.score = newScore;
  } else {
    // ❌ Falsch → gleiches Niveau nochmal
    gd.currentScore = 0;
    gd.feedback = `<div class="feedback-banner feedback-wrong">
      ❌ <b>Falsch!</b> Richtig war: ${gd.sequence.join(' → ')}<br>
      <span style="font-size:0.85em">Nächster Versuch wieder mit N=${gd.level}</span>
    </div>`;
    gs.score = 0;
  }

  gd.phase = 'feedback';
  gs.total = 1;
  engine.render();
  // Auto-advance after short feedback
  setTimeout(() => {
    gd.userAnswer = [];
    gd.sequence = genSeq(gd.level);
    gd.phase = 'show';
    gd.showStart = Date.now();
    gd.showDuration = gd.level * F * 1000;
    gd.waitDuration = 2 * gd.level * F * 1000;
    engine.render();
  }, correct ? 1200 : 2500);
};

/** Timeout-Check: wird vom wait-Phase-Timer aufgerufen */
window._timeoutZahlen = function () {
  const gs = engine.gameState;
  const gd = gs.gd;
  if (gd.phase !== 'wait') return;

  // Timeout → zählt als Fehlversuch, N-- (min 2)
  gd.level = Math.max(MIN_N, gd.level - 1);
  gd.currentScore = 0;
  gd.feedback = `<div class="feedback-banner feedback-wrong">
    ⏰ <b>Zeit abgelaufen!</b> Zu langsam.<br>
    <span style="font-size:0.85em">Neues Niveau: N=${gd.level}</span>
  </div>`;
  gd.phase = 'feedback';
  gs.score = 0;
  gs.total = 1;
  engine.render();
  // Auto-advance
  setTimeout(() => {
    gd.userAnswer = [];
    gd.sequence = genSeq(gd.level);
    gd.phase = 'show';
    gd.showStart = Date.now();
    gd.showDuration = gd.level * F * 1000;
    gd.waitDuration = 2 * gd.level * F * 1000;
    engine.render();
  }, 2500);
};

/** Stop test – finalize with current best level score */
window._stopZahlenTest = function () {
  const gs = engine.gameState;
  const gd = gs.gd;

  const finalLevel = gd.bestLevel || gd.level;
  const finalScore = computeScore(finalLevel);
  gd.currentScore = finalScore;
  gd.feedback = `<div class="feedback-banner feedback-correct">
    🏁 <b>Test beendet!</b><br>
    Bestes Niveau: <b>${finalLevel}</b> → Bewertung: <b>${finalScore}%</b>
  </div>`;
  gd.phase = 'feedback';
  gd.stopped = true;
  gs.score = finalScore;
  gs.total = 1;
  engine.render();
};
