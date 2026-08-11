/**
 * Auswahl-Aufgaben-Engine
 * ───────────────────────
 * Deckt alles ab, was auf „(optional erst etwas zeigen,) dann eine von N
 * Möglichkeiten anklicken" hinausläuft: Wissensquiz, Bausteine zählen,
 * Gestaltschließen, Suchbild, Symbol-Abruf, Atlantis-Abruf.
 *
 * Phasen:  study (optional) → ask → feedback → nächste Runde
 *
 * Schwierigkeit: gd.level steigt nach `upAfter` richtigen Antworten in Folge
 * und sinkt nach `downAfter` falschen. genRound() bekommt das Niveau und
 * entscheidet selbst, wie es das umsetzt.
 *
 * Bewertung: count – gs.score = richtig, gs.total = beantwortet.
 */
import { engine } from './engine.js';
import { esc, pick } from './html.js';

const RUNNING = new Map();

function stopTimers(id) {
  const s = RUNNING.get(id);
  if (!s) return;
  clearTimeout(s.deadline);
  clearInterval(s.clock);
  RUNNING.delete(id);
}

/**
 * Wie in core/adaptive.js: die Sekundenanzeige schreibt nur in #advClock und
 * baut den Spielbereich nicht neu auf. Ein Neuaufbau zwischen mousedown und
 * mouseup würde den Klick verschlucken.
 */
function schedule(id, ms, fn, clockFor) {
  stopTimers(id);
  const s = {};
  s.deadline = setTimeout(() => {
    clearInterval(s.clock);
    RUNNING.delete(id);
    if (!isActive(id)) return;
    fn();
  }, ms);
  if (clockFor) {
    const until = Date.now() + ms;
    s.clock = setInterval(() => {
      if (!isActive(id)) { stopTimers(id); return; }
      const el = document.getElementById('advClock');
      if (el) el.textContent = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    }, 200);
  }
  RUNNING.set(id, s);
}

function isActive(id) {
  return !!(engine.activeGame && engine.activeGame.id === id);
}

/**
 * @param {object} cfg
 *   id           Modul-ID
 *   minLevel/maxLevel/startLevel
 *   upAfter      richtige Antworten in Folge bis Niveau +1 (default 2)
 *   downAfter    falsche in Folge bis Niveau −1 (default 2)
 *   genRound(gd) → {
 *     study:   { html, seconds }   optional – erst zeigen, dann fragen
 *     prompt:  HTML über den Optionen
 *     options: [{ html, label? }]
 *     correct: Index der richtigen Option
 *     explain: string | {de,ru}
 *     columns: Spaltenzahl im Optionsraster (default: automatisch)
 *     layout:  'grid' | 'list'
 *   }
 */
export function createChoiceGame(cfg) {
  const id = cfg.id;
  const minLevel = cfg.minLevel ?? 1;
  const maxLevel = cfg.maxLevel ?? 5;
  const upAfter = cfg.upAfter ?? 2;
  const downAfter = cfg.downAfter ?? 2;

  function nextRound(gs) {
    const gd = gs.gd;
    gd.round = cfg.genRound(gd, gs);
    gd.picked = null;
    gd.answeredCorrect = null;
    if (gd.round.study && gd.round.study.seconds > 0) {
      gd.phase = 'study';
      gd.phaseStart = Date.now();
      gd.studyDuration = gd.round.study.seconds * 1000;
      schedule(id, gd.studyDuration, () => {
        gd.phase = 'ask';
        engine.renderGame();
      }, true);
    } else {
      gd.phase = 'ask';
      stopTimers(id);
    }
  }

  function init(gs) {
    const gd = gs.gd || {};
    gs.gd = gd;
    gd.level = gd.level || cfg.startLevel || minLevel;
    gd.streakUp = 0;
    gd.streakDown = 0;
    gd._ready = true;
    if (cfg.onInit) cfg.onInit(gd, gs);
    nextRound(gs);
    return gs;
  }

  function dispose(gs) {
    stopTimers(id);
    if (gs && gs.gd) gs.gd._ready = false;
  }

  function render(gs) {
    let gd = gs.gd;
    if (!gd || !gd._ready) { init(gs); gd = gs.gd; }
    const r = gd.round;
    if (!r) return '';

    if (gd.phase === 'study') {
      const elapsed = Date.now() - gd.phaseStart;
      const remaining = Math.max(0, gd.studyDuration - elapsed);
      return `<div style="text-align:center;width:100%">
        ${r.study.html}
        <div style="max-width:260px;margin:14px auto 8px;background:#F0EFF8;border-radius:4px;height:8px;overflow:hidden">
          <div class="adv-bar" style="animation-duration:${gd.studyDuration}ms;animation-delay:-${elapsed}ms"></div>
        </div>
        <p style="color:var(--text-light);font-size:.85em">
          Noch <span id="advClock">${Math.ceil(remaining / 1000)}</span>s zum Merken
        </p>
        <button class="btn btn-secondary btn-small" onclick="G('skipStudy')">⏭️ Weiter</button>
      </div>`;
    }

    if (gd.phase === 'ask') {
      return `<div style="width:100%;max-width:560px">
        ${r.prompt}
        ${optionsHtml(r, gd)}
      </div>`;
    }

    // feedback
    const explain = r.explain ? pick(r.explain) : '';
    const banner = gd.answeredCorrect
      ? `<div class="feedback-banner feedback-correct">🎉 <b>Richtig!</b>${explain ? ' ' + esc(explain) : ''}</div>`
      : `<div class="feedback-banner feedback-wrong">😔 <b>Leider nicht.</b> Richtig wäre: ${r.options[r.correct].label || ''}${explain ? '<br><span style="font-size:.85em">' + esc(explain) + '</span>' : ''}</div>`;

    return `<div style="width:100%;max-width:560px;text-align:center">
      ${banner}
      <div style="font-size:.8em;color:var(--text-light);margin-bottom:8px">Niveau ${gd.level}</div>
      <button class="btn btn-primary btn-small" onclick="G('next')">▶️ Weiter</button>
    </div>`;
  }

  function optionsHtml(r, gd) {
    const layout = r.layout || 'grid';
    if (layout === 'list') {
      return `<div class="options-vertical" style="margin:16px auto">
        ${r.options.map((o, i) =>
          `<button class="option-btn pick-target" onclick="G('choose',${i})">${o.html}</button>`
        ).join('')}
      </div>`;
    }
    const cols = r.columns || Math.min(r.options.length, 5);
    return `<div style="display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:10px;margin:16px 0;width:100%">
      ${r.options.map((o, i) =>
        `<div class="game-card-item pick-target" onclick="G('choose',${i})" style="aspect-ratio:auto;min-height:72px;padding:8px;font-size:${o.small ? '1.1em' : '2.2em'}">${o.html}</div>`
      ).join('')}
    </div>`;
  }

  const actions = {
    choose(gs, idx) {
      const gd = gs.gd;
      if (!gd || gd.phase !== 'ask') return false;
      const r = gd.round;
      gd.picked = idx;
      const correct = idx === r.correct;
      gd.answeredCorrect = correct;
      gd.phase = 'feedback';

      gs.total = (gs.total || 0) + 1;
      if (correct) {
        gs.score = (gs.score || 0) + 1;
        gd.streakUp++; gd.streakDown = 0;
        if (gd.streakUp >= upAfter && gd.level < maxLevel) { gd.level++; gd.streakUp = 0; }
      } else {
        gd.streakDown++; gd.streakUp = 0;
        if (gd.streakDown >= downAfter && gd.level > minLevel) { gd.level--; gd.streakDown = 0; }
      }
      stopTimers(id);
    },

    next(gs) {
      nextRound(gs);
    },

    skipStudy(gs) {
      const gd = gs.gd;
      if (!gd || gd.phase !== 'study') return false;
      stopTimers(id);
      gd.phase = 'ask';
    },

    // Spiele können eigene Actions ergänzen (z. B. „nächsten Hinweis zeigen")
    ...(cfg.extraActions || {})
  };

  return { init, render, dispose, actions, scoring: 'count' };
}
