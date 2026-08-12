/**
 * Sitzungsumfang: wie viele Übungen ein Durchgang hat.
 *
 * Ohne Grenze läuft jedes Modul endlos weiter. Für ein Kind ist das ungünstig
 * (kein absehbares Ende, kein Erfolgserlebnis) und für die Auswertung auch:
 * Werte aus 4 und aus 40 Übungen stehen sonst unvergleichbar nebeneinander.
 *
 * Gezählt wird in `gs.rounds` – abgeschlossene Übungen, nicht Klicks. Jede
 * Ablauf-Engine erhöht den Zähler an genau der Stelle, an der eine Übung
 * fertig ist; die Entscheidung, ob Schluss ist, fällt hier zentral.
 */
import { get } from './settings.js';
import { getModule } from '../data/modules.js';
import { lang } from './html.js';

const UI = {
  fertig:   { de: 'Geschafft!', ru: 'Готово!' },
  von:      { de: 'von', ru: 'из' },
  gruppe:   { de: '← Zurück zur Gruppe', ru: '← Назад к группе' },
  nochmal:  { de: '🔁 Noch eine Runde', ru: '🔁 Ещё раз' },
  menue:    { de: '🏠 Menü', ru: '🏠 Меню' },
  richtig:  { de: 'richtig', ru: 'верно' },
  niveau:   { de: 'Bestes Niveau', ru: 'Лучший уровень' }
};
const u = k => { const l = lang(); return UI[k][l] || UI[k].de; };

/** Wie viele Übungen ein Durchgang hat. */
export function limit() {
  return get('rounds');
}

/** Eine Übung abgeschlossen. Gibt zurück, ob der Durchgang damit vorbei ist. */
export function countRound(gs) {
  gs.rounds = (gs.rounds || 0) + 1;
  return gs.rounds >= limit();
}

/** Ist der Durchgang vorbei? */
export function done(gs) {
  return (gs.rounds || 0) >= limit();
}

/**
 * Fortschritt als Punktreihe – wortlos, wie die Sternenreihe.
 *
 * Eine Zahl „3/10" mitten im Spielbildschirm wäre wieder Text, und Text
 * lenkt ab. Gefüllte Punkte zeigen dasselbe auf einen Blick; ab 20 Übungen
 * wird auf einen schmalen Balken umgestellt, weil 30 Punkte nichts mehr
 * erkennen lassen.
 */
export function progressDots(gs) {
  const n = limit();
  const fertig = Math.min(gs.rounds || 0, n);
  const titel = `${fertig} ${u('von')} ${n}`;

  if (n > 20) {
    return `<div title="${titel}" aria-label="${titel}"
      style="width:100%;max-width:320px;height:6px;background:#EDEBF8;border-radius:3px;overflow:hidden">
      <div style="width:${(fertig / n) * 100}%;height:100%;background:var(--primary-light);border-radius:3px"></div>
    </div>`;
  }

  let punkte = '';
  for (let i = 0; i < n; i++) {
    const voll = i < fertig;
    punkte += `<span style="width:9px;height:9px;border-radius:50%;display:inline-block;
      background:${voll ? 'var(--primary)' : '#DDD9F0'}"></span>`;
  }
  return `<div title="${titel}" aria-label="${titel}"
    style="display:flex;gap:5px;flex-wrap:wrap;justify-content:center;max-width:320px">${punkte}</div>`;
}

/**
 * Ergebnisseite am Ende eines Durchgangs.
 *
 * @param {object} gs
 * @param {object} opt  { percent, level, score, total }  – was das Modul misst
 */
export function resultScreen(gs, opt = {}) {
  const mod = getModule(gs.moduleId);
  const scaleId = mod ? mod.scale : null;
  const hatProzent = typeof opt.percent === 'number';

  const wert = hatProzent
    ? `<div style="font-size:2.8em;font-weight:800;color:var(--primary)">${opt.percent}%</div>
       <div style="font-size:.9em;color:var(--text-light)">${u('niveau')} ${opt.level || '–'}</div>`
    : `<div style="font-size:2.8em;font-weight:800;color:var(--primary)">${Math.round((opt.score || 0) * 10) / 10}/${opt.total || 0}</div>
       <div style="font-size:.9em;color:var(--text-light)">${u('richtig')}</div>`;

  return `<div data-phase="done" style="text-align:center;width:100%">
    <div style="font-size:3.4em;line-height:1.1">🏁</div>
    <div style="font-weight:800;font-size:1.15em;margin-bottom:6px">${u('fertig')}</div>
    ${wert}
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:18px">
      ${scaleId ? `<button class="btn btn-primary btn-small"
        onclick="navigateTo('scale',{scaleId:'${scaleId}'})">${u('gruppe')}</button>` : ''}
      <button class="btn btn-secondary btn-small" onclick="G('restart')">${u('nochmal')}</button>
      <button class="btn btn-secondary btn-small" onclick="navigateTo('menu')">${u('menue')}</button>
    </div>
  </div>`;
}
