/**
 * Zahlenfolgen – adaptiver Test mit Bewertungsmodell
 *
 * Ablauf:
 *   N Zahlen zeigen (N × f Sekunden, f aus settings, default 2).
 *   Dann feste Pause 3s.
 *   Dann Antwort-Phase: maximal N × 2 × f Sekunden Zeit (zeitgesteuert).
 *   Keine Wiederholungen in der Sequenz.
 *   Kein "Fertig"-Knopf – Eingabe ist zeitgesteuert: volle Sequenz = sofort prüfen,
 *   Zeit abgelaufen = Fehlversuch.
 *
 *   Richtig → N++, falsch/timeout → neuer Versuch mit gleichem N.
 *   Bewertung: N=2:0% 3:20% 4:30% 5:50% 6:75% 7:90% 8:100% 9:120% 10:130% 10+:150%
 */
import { t } from '../i18n/i18n-core.js';
import { engine } from '../core/engine.js';

// ─── Settings (können später aus Settings-DB geladen werden) ───
let F = 2;              // Sekunden pro Ziffer (×N) – default 2, via Einstellungen änderbar
const PAUSE_S = 3;       // feste Pause zwischen zeigen und antworten
const SCORE_MAP = { 2:0, 3:20, 4:30, 5:50, 6:75, 7:90, 8:100, 9:120, 10:130 };
const BONUS_10PLUS = 150;
const MIN_N = 2;
const MAX_N = 10;

// ─── Globale Setter für Einstellungen ───
export function setFactor(val) { F = Math.max(0.5, Math.min(5, Number(val) || 2)); }
export function getFactor() { return F; }

// Generate N unique digits (1-9, keine Wiederholungen)
function genSeq(len) {
  const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Fisher-Yates partial shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(len, 9));
}

function computeScore(level) {
  if (level > MAX_N) return BONUS_10PLUS;
  return SCORE_MAP[level] || 0;
}

export function init(gs) {
  const gd = gs.gd || {};

  if (!gd.level) gd.level = MIN_N;

  gd.sequence = genSeq(gd.level);
  gd.userAnswer = [];
  gd.phase = 'show';
  gd.phaseStart = Date.now();
  gd.showDuration = gd.level * F * 1000;          // N × f Sekunden
  gd.answerDuration = gd.level * 2 * F * 1000;    // N × 2 × f Sekunden (doppelt so lang wie Merkzeit)
  gd.currentScore = computeScore(gd.level);
  gd.bestLevel = gd.bestLevel || MIN_N;
  gd.digitPool = [1,2,3,4,5,6,7,8,9, 1,2,3,4,5,6,7,8,9, 0,0];
  gd.autoCheckTimer = null;

  gs.gd = gd;
  return gs;
}

// Clear any running timer
function clearTimer(gd) {
  if (gd.autoCheckTimer) {
    clearTimeout(gd.autoCheckTimer);
    gd.autoCheckTimer = null;
  }
}

export function render(gs) {
  const gd = gs.gd;
  if (!gd || !gd.sequence) { init(gs); return render(gs); }

  const elapsed = Date.now() - gd.phaseStart;

  // ═══ PHASE: show ═══
  if (gd.phase === 'show') {
    const remaining = Math.max(0, gd.showDuration - elapsed);
    if (remaining <= 0) {
      clearTimer(gd);
      gd.phase = 'wait';
      gd.phaseStart = Date.now();
      engine.render();
      return '';
    }
    setTimeout(() => engine.render(), Math.min(remaining, 150));
    return `<div style="text-align:center">
      <p style="font-size:1.1em;margin-bottom:4px">🔢 <b>Merke dir diese ${gd.level} Zahlen!</b></p>
      <div style="display:flex;gap:8px;justify-content:center;margin:16px 0;flex-wrap:wrap">
        ${gd.sequence.map((n, i) =>
          `<div style="width:52px;height:52px;border-radius:50%;background:${['#FF6B6B','#4ECDC4','#FFD93D','#4D96FF','#FF8A5C','#C084FC','#FB923C','#34D399','#F472B6'][i]};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.5em;font-weight:800">${n}</div>`
        ).join('')}
      </div>
      <p style="color:var(--text-light);font-size:0.85em">Noch ${remaining > 1000 ? Math.ceil(remaining/1000)+'s' : '<1s'} • Faktor f=${F}s</p>
      <div style="margin-top:6px;font-size:0.75em;color:var(--text-light)">
        Niveau ${gd.level} • max. Bewertung: ${computeScore(gd.level)}%
      </div>
      <button class="btn btn-secondary btn-small" onclick="window._stopZahlenTest()" style="margin-top:8px">⏹️ Beenden</button>
    </div>`;
  }

  // ═══ PHASE: wait (feste Pause 3s) ═══
  if (gd.phase === 'wait') {
    const remaining = Math.max(0, PAUSE_S * 1000 - elapsed);
    if (remaining <= 0) {
      clearTimer(gd);
      gd.phase = 'answer';
      gd.phaseStart = Date.now();
      gd.userAnswer = [];

      // Auto-check timer: wenn Antwortzeit abläuft → Fehlversuch
      gd.autoCheckTimer = setTimeout(() => {
        window._timeoutAnswer();
      }, gd.answerDuration);

      engine.render();
      return '';
    }
    setTimeout(() => engine.render(), Math.min(remaining, 300));
    return `<div style="text-align:center">
      <p style="font-size:1.2em">⏳ <b>Pause…</b></p>
      <p style="color:var(--text-light);margin:16px 0">Noch <b>${Math.ceil(remaining/1000)}s</b></p>
      <div style="margin-top:12px">
        <button class="btn btn-secondary btn-small" onclick="window._skipWaitZahlen()">⏭️ Überspringen</button>
        <button class="btn btn-secondary btn-small" onclick="window._stopZahlenTest()">⏹️ Beenden</button>
      </div>
    </div>`;
  }

  // ═══ PHASE: answer (Eingabe per Klick, zeitgesteuert, kein Fertig-Knopf) ═══
  if (gd.phase === 'answer') {
    const answerElapsed = elapsed;
    const answerTotal = gd.answerDuration;
    const remaining = Math.max(0, answerTotal - answerElapsed);
    const selected = gd.userAnswer;
    const slotsLeft = gd.level - selected.length;

    // Wenn alle Zahlen eingegeben → sofort prüfen (kein Fertig-Knopf nötig!)
    if (slotsLeft === 0) {
      clearTimer(gd);
      // Kurzer Delay damit das Kind die letzte Eingabe sieht
      if (!gd._checkingNow) {
        gd._checkingNow = true;
        setTimeout(() => {
          gd._checkingNow = false;
          window._doCheckZahlen();
        }, 300);
      }
    }

    return `<div style="width:100%;max-width:480px">
      <p style="font-size:1.1em;text-align:center">👆 <b>Klicke die ${gd.level} Zahlen in der Reihenfolge!</b></p>

      <!-- Timer bar -->
      <div style="margin:8px 0">
        <div style="display:flex;justify-content:space-between;font-size:0.75em;color:var(--text-light);margin-bottom:2px">
          <span>${slotsLeft > 0 ? 'Noch '+slotsLeft+' Zahl'+(slotsLeft!==1?'en':'') : '✅ Alle!'}</span>
          <span>⏱️ ${Math.ceil(remaining/1000)}s</span>
        </div>
        <div style="background:#F0EFF8;border-radius:4px;height:6px;overflow:hidden">
          <div style="background:${remaining < answerTotal*0.3 ? 'var(--secondary)' : remaining < answerTotal*0.6 ? 'var(--gold)' : 'var(--green)'};height:100%;width:${(remaining/answerTotal)*100}%;border-radius:4px;transition:width 0.3s"></div>
        </div>
      </div>

      <!-- Answer row -->
      <div style="display:flex;gap:8px;min-height:52px;align-items:center;justify-content:center;margin:12px 0;flex-wrap:wrap">
        ${selected.map((n, i) =>
          `<div onclick="window._removeZahl(${i})" style="width:44px;height:44px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2em;font-weight:800;cursor:pointer;position:relative">${n}<span style="position:absolute;font-size:0.4em;bottom:-10px;color:var(--secondary)">✕</span></div>`
        ).join('')}
        ${Array(slotsLeft).fill(0).map(() =>
          `<div style="width:44px;height:44px;border-radius:50%;border:2px dashed #E0DDF5"></div>`
        ).join('')}
      </div>

      <!-- Digit grid -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px">
        ${gd.digitPool.map((n, i) => {
          const colors = ['#FF6B6B','#4ECDC4','#FFD93D','#4D96FF','#FF8A5C','#C084FC','#FB923C','#34D399','#F472B6'];
          const bg = n === 0 ? '#94A3B8' : colors[n - 1];
          return `<div onclick="window._pickZahl(${n},this)" style="width:48px;height:48px;border-radius:50%;background:${bg};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.2em;font-weight:700;cursor:pointer;transition:all 0.12s;user-select:none">${n}</div>`;
        }).join('')}
      </div>

      <div style="margin-top:12px;display:flex;gap:8px;justify-content:center">
        <button class="btn btn-secondary btn-small" onclick="window._resetZahlen()">🔄 Neu</button>
        <button class="btn btn-secondary btn-small" onclick="window._stopZahlenTest()">⏹️ Beenden</button>
      </div>
    </div>`;
  }

  // ═══ PHASE: feedback ═══
  if (gd.stopped) {
    return (gd.feedback || '') + `<div style="margin-top:12px"><button class="btn btn-primary btn-small" onclick="navigateTo('menu')">🏠 Fertig</button></div>`;
  }
  return gd.feedback || '';
}

// ─── Handlers ───────────────────────────────────────────

window._skipWaitZahlen = function () {
  const gd = engine.gameState.gd;
  clearTimer(gd);
  gd.phase = 'answer';
  gd.phaseStart = Date.now();
  gd.userAnswer = [];
  gd.autoCheckTimer = setTimeout(() => window._timeoutAnswer(), gd.answerDuration);
  engine.render();
};

window._pickZahl = function (n, el) {
  const gd = engine.gameState.gd;
  if (gd.phase !== 'answer') return;
  if (gd.userAnswer.length >= gd.level) return;
  // Keine Duplikate in der Antwort
  if (gd.userAnswer.includes(n)) return;
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

/** Called when all N digits are filled (automatic) OR on timeout */
window._doCheckZahlen = function () {
  const gs = engine.gameState;
  const gd = gs.gd;
  clearTimer(gd);

  if (gd.userAnswer.length < gd.level) return; // safety

  const correct = gd.userAnswer.join(',') === gd.sequence.join(',');

  if (correct) {
    const oldLevel = gd.level;
    gd.level = Math.min(gd.level + 1, MAX_N + 2);
    gd.bestLevel = Math.max(gd.bestLevel, oldLevel);
    const newScore = computeScore(oldLevel);
    gd.currentScore = newScore;
    gd.feedback = `<div class="feedback-banner feedback-correct">
      ✅ <b>Richtig!</b> Niveau ${oldLevel} → <b>${newScore}%</b>
    </div>`;
    gs.score = newScore;
  } else {
    // ❌ Falsch → N--, aber min 2
    gd.level = Math.max(MIN_N, gd.level - 1);
    gd.currentScore = 0;
    gd.feedback = `<div class="feedback-banner feedback-wrong">
      ❌ <b>Falsch!</b> Richtig: ${gd.sequence.join(' → ')}<br>
      <span style="font-size:0.8em">Nächstes Niveau: N=${gd.level}</span>
    </div>`;
    gs.score = 0;
  }

  gd.phase = 'feedback';
  gs.total = 1;
  engine.render();

  // Auto-advance
  setTimeout(() => {
    clearTimer(gd);
    gd.userAnswer = [];
    gd.sequence = genSeq(gd.level);
    gd.phase = 'show';
    gd.phaseStart = Date.now();
    gd.showDuration = gd.level * F * 1000;
    gd.answerDuration = gd.level * 2 * F * 1000;
    engine.render();
  }, correct ? 1200 : 2500);
};

/** Timeout in answer phase → Fehlversuch */
window._timeoutAnswer = function () {
  const gs = engine.gameState;
  const gd = gs.gd;
  if (gd.phase !== 'answer') return;

  clearTimer(gd);
  gd.level = Math.max(MIN_N, gd.level - 1);
  gd.currentScore = 0;
  gd.feedback = `<div class="feedback-banner feedback-wrong">
    ⏰ <b>Zeit abgelaufen!</b> N=${gd.level}
  </div>`;
  gd.phase = 'feedback';
  gs.score = 0;
  gs.total = 1;
  engine.render();

  setTimeout(() => {
    clearTimer(gd);
    gd.userAnswer = [];
    gd.sequence = genSeq(gd.level);
    gd.phase = 'show';
    gd.phaseStart = Date.now();
    gd.showDuration = gd.level * F * 1000;
    gd.answerDuration = gd.level * 2 * F * 1000;
    engine.render();
  }, 2500);
};

window._stopZahlenTest = function () {
  const gs = engine.gameState;
  const gd = gs.gd;
  clearTimer(gd);

  const finalLevel = gd.bestLevel || gd.level;
  const finalScore = computeScore(finalLevel);
  gd.currentScore = finalScore;
  gd.feedback = `<div class="feedback-banner feedback-correct">
    🏁 <b>Test beendet!</b> Bestes Niveau: <b>${finalLevel}</b> → <b>${finalScore}%</b>
  </div>`;
  gd.phase = 'feedback';
  gd.stopped = true;
  gs.score = finalScore;
  gs.total = 1;
  engine.render();
};
