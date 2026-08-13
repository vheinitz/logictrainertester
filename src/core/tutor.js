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
import { pick, lang } from './html.js';
import * as settings from './settings.js';
import { countRound, resultScreen } from './session.js';

/**
 * @param {object} cfg
 *   id
 *   minLevel/maxLevel/startLevel
 *   genTask(gd) → { title, instruction, material, steps: [string], note }
 *   observe   Liste der Beobachtungspunkte für die Begleitperson
 */
const TUTOR_UI = {
  anleitung: { de: '🧑‍🏫 Anleitung für die Begleitperson', ru: '🧑‍🏫 Инструкция для взрослого', en: '🧑‍🏫 Guide for the accompanying adult' },
  material:  { de: 'Material:', ru: 'Материалы:', en: 'Materials:' },
  achten:    { de: '👀 Worauf achten?', ru: '👀 На что смотреть?', en: '👀 What to look for' },
  gelaufen:  { de: 'Wie ist es gelaufen?', ru: 'Как получилось?', en: 'How did it go?' },
  gelungen:  { de: '✅ Gelungen', ru: '✅ Получилось', en: '✅ Succeeded' },
  mitHilfe:  { de: '🤝 Mit Hilfe', ru: '🤝 С помощью', en: '🤝 With help' },
  nochNicht: { de: '↩️ Noch nicht', ru: '↩️ Пока нет', en: '↩️ Not yet' },
  andere:    { de: '⏭️ Andere Aufgabe', ru: '⏭️ Другое задание', en: '⏭️ Another task' },
  notiert:   { de: '📝 Notiert:', ru: '📝 Записано:', en: '📝 Noted:' },
  niveau:    { de: 'Niveau', ru: 'Уровень', en: 'Level' },
  naechste:  { de: '▶️ Nächste Aufgabe', ru: '▶️ Следующее задание', en: '▶️ Next task' },
  fertig:    { de: '🏠 Fertig', ru: '🏠 Готово', en: '🏠 Done' },
  wertung:   { de: ['nicht gelungen', 'mit Hilfe gelungen', 'gelungen'],
               ru: ['не получилось', 'получилось с помощью', 'получилось'],
               en: ['did not succeed', 'succeeded with help', 'succeeded'] }
};
const tu = k => { const l = lang(); return TUTOR_UI[k][l] || TUTOR_UI[k].de; };

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

    if (gd.phase === 'done') {
      return resultScreen(gs, { score: gs.score, total: gs.total });
    }

    if (gd.phase === 'rated') {
      const label = tu('wertung')[gd.lastRating];
      const cls = gd.lastRating === 2 ? 'feedback-correct' : gd.lastRating === 1 ? 'feedback-correct' : 'feedback-wrong';
      return `<div style="width:100%;max-width:560px;text-align:center">
        <div class="feedback-banner ${cls}">${tu('notiert')} <b>${label}</b></div>
        <div style="font-size:.8em;color:var(--text-light);margin-bottom:10px">${tu('niveau')} ${gd.level}</div>
        <button class="btn btn-primary btn-small" onclick="G('next')">${tu('naechste')}</button>
        <button class="btn btn-secondary btn-small" onclick="navigateTo('menu')">${tu('fertig')}</button>
      </div>`;
    }

    return `<div style="width:100%;max-width:600px">
      <div class="tutor-guide" style="max-width:none">
        <h3>${tu('anleitung')}</h3>
        <p style="font-weight:700;font-size:1.05em;margin-bottom:6px">${pick(task.title)}</p>
        <p style="margin-bottom:10px">${pick(task.instruction)}</p>
        ${task.material ? `<p style="font-size:.9em"><b>${tu('material')}</b> ${pick(task.material)}</p>` : ''}
        ${task.steps && task.steps.length ? `<ol style="margin:10px 0 4px 20px;font-size:.92em;line-height:1.7">
          ${(Array.isArray(task.steps) ? task.steps : pick(task.steps) || []).map(s => `<li>${pick(s)}</li>`).join('')}
        </ol>` : ''}
        ${task.note ? `<p style="font-size:.85em;color:var(--text-light);margin-top:8px">💡 ${pick(task.note)}</p>` : ''}
      </div>

      ${cfg.observe && cfg.observe.length ? `<div style="background:var(--bg);border-radius:var(--radius-sm);padding:12px 16px;margin:12px 0">
        <div style="font-weight:700;font-size:.9em;margin-bottom:6px">${tu('achten')}</div>
        <ul style="margin-left:18px;font-size:.85em;line-height:1.6">
          ${cfg.observe.map(o => `<li>${pick(o)}</li>`).join('')}
        </ul>
      </div>` : ''}

      <div style="text-align:center;margin-top:16px">
        <div style="font-weight:700;margin-bottom:8px">${tu('gelaufen')}</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-small" style="background:var(--green);color:#fff" onclick="G('rate',2)">${tu('gelungen')}</button>
          <button class="btn btn-small" style="background:var(--gold);color:#4A3B00" onclick="G('rate',1)">${tu('mitHilfe')}</button>
          <button class="btn btn-small" style="background:var(--secondary);color:#fff" onclick="G('rate',0)">${tu('nochNicht')}</button>
        </div>
        <div style="margin-top:10px">
          <button class="btn btn-secondary btn-small" onclick="G('skip')">${tu('andere')}</button>
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
      const vorbei = countRound(gs);
      clearTimeout(gd._weiter);
      gd._weiter = setTimeout(() => {
        if (!engine.activeGame || engine.activeGame.id !== cfg.id) return;
        if (vorbei) gd.phase = 'done'; else nextTask(gs);
        engine.renderGame();
      }, Math.round(settings.get('feedbackOk') * 1000) + 600);
    },
    next(gs) { nextTask(gs); },
    skip(gs) { nextTask(gs); },
    restart(gs) {
      clearTimeout(gs.gd && gs.gd._weiter);
      gs.gd = {};
      gs.score = 0; gs.total = 0; gs.rounds = 0;
      init(gs);
    }
  };

  return { init, render, dispose, actions, scoring: 'count', tutor: true };
}
