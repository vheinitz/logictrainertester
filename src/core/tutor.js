/**
 * Tutor-Modul-Engine
 * ──────────────────
 * Für Aufgaben, die eine erwachsene Person anleitet und die das Gerät nicht
 * selbst bewerten kann: Rhythmus klopfen, Zaubertrick nachmachen, Geschichte
 * erzählen, Teekesselchen raten.
 *
 * Der ehrliche Entwurf ist hier nicht „irgendwie automatisch punkten", sondern:
 * Aufgabe + Anleitung anzeigen, danach bewertet die Begleitperson in drei
 * Stufen. Das ergibt vergleichbare Werte, ohne so zu tun, als hätte das
 * Programm etwas gemessen.
 *
 * Bewertung: gelungen = 1, mit Hilfe = 0,5, nicht gelungen = 0.
 */
import { engine } from './engine.js';
import { pick } from './html.js';
import * as settings from './settings.js';

/**
 * @param {object} cfg
 *   id
 *   minLevel/maxLevel/startLevel
 *   genTask(gd) → { title, instruction, material, steps: [string], note }
 *   observe   Liste der Beobachtungspunkte für die Begleitperson
 */
export function createTutorModule(cfg) {
  const minLevel = cfg.minLevel ?? 1;
  const maxLevel = cfg.maxLevel ?? 5;

  function nextTask(gs) {
    const gd = gs.gd;
    gd.task = cfg.genTask(gd, gs);
    gd.phase = 'task';
  }

  function init(gs) {
    const gd = gs.gd || {};
    gs.gd = gd;
    gd.level = gd.level || cfg.startLevel || minLevel;
    gd._ready = true;
    if (cfg.onInit) cfg.onInit(gd, gs);
    nextTask(gs);
    return gs;
  }

  function dispose(gs) {
    if (gs && gs.gd) { clearTimeout(gs.gd._weiter); gs.gd._ready = false; }
  }

  function render(gs) {
    let gd = gs.gd;
    if (!gd || !gd._ready) { init(gs); gd = gs.gd; }
    const task = gd.task;
    if (!task) return '';

    if (gd.phase === 'rated') {
      const label = ['nicht gelungen', 'mit Hilfe gelungen', 'gelungen'][gd.lastRating];
      const cls = gd.lastRating === 2 ? 'feedback-correct' : gd.lastRating === 1 ? 'feedback-correct' : 'feedback-wrong';
      return `<div style="width:100%;max-width:560px;text-align:center">
        <div class="feedback-banner ${cls}">📝 Notiert: <b>${label}</b></div>
        <div style="font-size:.8em;color:var(--text-light);margin-bottom:10px">Niveau ${gd.level}</div>
        <button class="btn btn-primary btn-small" onclick="G('next')">▶️ Nächste Aufgabe</button>
        <button class="btn btn-secondary btn-small" onclick="navigateTo('menu')">🏠 Fertig</button>
      </div>`;
    }

    return `<div style="width:100%;max-width:600px">
      <div class="tutor-guide" style="max-width:none">
        <h3>🧑‍🏫 Anleitung für die Begleitperson</h3>
        <p style="font-weight:700;font-size:1.05em;margin-bottom:6px">${task.title}</p>
        <p style="margin-bottom:10px">${task.instruction}</p>
        ${task.material ? `<p style="font-size:.9em"><b>Material:</b> ${task.material}</p>` : ''}
        ${task.steps && task.steps.length ? `<ol style="margin:10px 0 4px 20px;font-size:.92em;line-height:1.7">
          ${task.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>` : ''}
        ${task.note ? `<p style="font-size:.85em;color:var(--text-light);margin-top:8px">💡 ${task.note}</p>` : ''}
      </div>

      ${cfg.observe && cfg.observe.length ? `<div style="background:var(--bg);border-radius:var(--radius-sm);padding:12px 16px;margin:12px 0">
        <div style="font-weight:700;font-size:.9em;margin-bottom:6px">👀 Worauf achten?</div>
        <ul style="margin-left:18px;font-size:.85em;line-height:1.6">
          ${cfg.observe.map(o => `<li>${pick(o)}</li>`).join('')}
        </ul>
      </div>` : ''}

      <div style="text-align:center;margin-top:16px">
        <div style="font-weight:700;margin-bottom:8px">Wie ist es gelaufen?</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-small" style="background:var(--green);color:#fff" onclick="G('rate',2)">✅ Gelungen</button>
          <button class="btn btn-small" style="background:var(--gold);color:#4A3B00" onclick="G('rate',1)">🤝 Mit Hilfe</button>
          <button class="btn btn-small" style="background:var(--secondary);color:#fff" onclick="G('rate',0)">↩️ Noch nicht</button>
        </div>
        <div style="margin-top:10px">
          <button class="btn btn-secondary btn-small" onclick="G('skip')">⏭️ Andere Aufgabe</button>
        </div>
      </div>
    </div>`;
  }

  const actions = {
    rate(gs, r) {
      const gd = gs.gd;
      if (!gd || gd.phase !== 'task') return false;
      gd.lastRating = r;
      gd.phase = 'rated';
      gs.total = (gs.total || 0) + 1;
      gs.score = (gs.score || 0) + (r === 2 ? 1 : r === 1 ? 0.5 : 0);
      if (r === 2 && gd.level < maxLevel) gd.level++;
      else if (r === 0 && gd.level > minLevel) gd.level--;
      // Von selbst weiter, wie überall sonst – die Begleitperson hat schon
      // geklickt, ein zweiter Klick auf „Weiter" ist nur Reibung.
      clearTimeout(gd._weiter);
      gd._weiter = setTimeout(() => {
        if (!engine.activeGame || engine.activeGame.id !== cfg.id) return;
        nextTask(gs); engine.renderGame();
      }, Math.round(settings.get('feedbackOk') * 1000) + 600);
    },
    next(gs) { nextTask(gs); },
    skip(gs) { nextTask(gs); }
  };

  return { init, render, dispose, actions, scoring: 'count', tutor: true };
}
