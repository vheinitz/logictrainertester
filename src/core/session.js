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
import { lang, esc } from './html.js';
import { alterJahre, indexFuer, einordnung, hinweis } from './norms.js';
import { bewerte, herkunftText } from './richtwerte.js';

const UI = {
  fertig:   { de: 'Geschafft!', ru: 'Готово!', en: 'Done!' },
  von:      { de: 'von', ru: 'из', en: 'of' },
  gruppe:   { de: '← Zurück zur Gruppe', ru: '← Назад к группе', en: '← Back to the group' },
  nochmal:  { de: '🔁 Noch eine Runde', ru: '🔁 Ещё раз', en: '🔁 One more round' },
  menue:    { de: '🏠 Menü', ru: '🏠 Меню', en: '🏠 Menu' },
  zumPlanKnopf: { de: '🗺️ Zurück zum Plan', ru: '🗺️ Назад к плану', en: '🗺️ Back to the plan' },
  naechste: { de: '▶ Nächste Aufgabe', ru: '▶ Следующее задание', en: '▶ Next task' },

  vorfuehrungT: { de: 'Vorführung beendet', ru: 'Показ окончен', en: 'Demonstration finished' },
  vorfuehrung:  { de: 'Das war nur zum Zeigen – gespeichert wurde nichts. Macht die Aufgabe jetzt am Tisch und tragt danach ein, wie es gelaufen ist.',
                  ru: 'Это был только показ — ничего не сохранено. Теперь сделайте задание за столом и потом внесите результат.',
                  en: 'That was for showing only – nothing was saved. Do the task at the table now and enter afterwards how it went.' },
  eintragen:    { de: '✍️ Ergebnis eintragen', ru: '✍️ Внести результат', en: '✍️ Enter the result' },
  verwerfen:    { de: 'Ohne Eintrag beenden', ru: 'Закончить без записи', en: 'Finish without an entry' },
  richtig:  { de: 'richtig', ru: 'верно', en: 'correct' },
  niveau:   { de: 'Bestes Niveau', ru: 'Лучший уровень', en: 'Best level' },
  fuerAlter:{ de: 'Für Alter', ru: 'Для возраста', en: 'For age' },
  erwartet: { de: 'erwartet', ru: 'ожидается', en: 'expected' },
  zumPlan:  { de: '🗺️ Was jetzt zu tun ist', ru: '🗺️ Что делать дальше', en: '🗺️ What to do next' }
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
 * Altersnormierter Index, wenn es für das Modul eine Normtabelle gibt.
 *
 * Ohne Tabelle oder ohne hinterlegtes Geburtsjahr bleibt der Block leer –
 * dann steht auf der Ergebnisseite weiter nur die rohe Spanne. Lieber gar
 * keine Einordnung als eine, die das Alter ignoriert.
 *
 * Der Hinweis darunter ist nicht schmückend: die Tabellen sind
 * Literaturrichtwerte, keine geeichten Normen. Wer 82 liest, soll nicht
 * glauben, ein Testverfahren habe das festgestellt.
 */
function normBlock(mod, opt) {
  if (!mod || !mod.norm || typeof opt.level !== 'number' || !opt.level) return '';
  const alter = alterJahre();
  if (alter == null) return '';
  const n = indexFuer(opt.level, alter, mod.norm);
  if (!n) return '';

  const farbe = n.index >= 116 ? 'var(--green)' : n.index >= 85 ? 'var(--primary)' : 'var(--secondary)';
  const warnung = n.auffaellig ? 'auffaellig' : n.unterAltersgrenze ? 'jung' : null;

  return `<div style="margin:18px auto 0;max-width:360px;padding:14px 16px;background:var(--bg);border-radius:var(--radius-sm)">
    <div style="font-size:.8em;color:var(--text-light);letter-spacing:.03em">${u('fuerAlter')} ${alter.toFixed(1).replace('.', ',')}</div>
    <div style="font-size:2.1em;font-weight:800;color:${farbe};line-height:1.2">${n.index}</div>
    <div style="font-size:.95em">${einordnung(n.index)}</div>
    ${warnung ? `<p style="font-size:.8em;color:var(--secondary);margin-top:8px;line-height:1.5">${hinweis(warnung)}</p>` : ''}
    <p style="font-size:.72em;color:var(--text-light);margin-top:10px;line-height:1.5">${hinweis('orientierung')}</p>
  </div>`;
}

/**
 * Einordnung über den Richtwert – für alle Module mit Niveauleiter.
 *
 * Der Normblock darüber gilt nur für die beiden Ziffernspannen, für die
 * Literaturwerte vorliegen. Alle anderen zeigten bisher nur eine nackte Zahl:
 * „7/10 richtig" sagt einem Elternteil nichts, weil die Aufgabe mitwächst und
 * fast jeder dort landet. Hier steht, ob das für das Alter viel oder wenig
 * ist – und zwar in dem Moment, in dem tatsächlich jemand hinsieht.
 *
 * Ausdrücklich als Richtwert bezeichnet, mit seiner Herkunft darunter. Wer
 * „unter dem Richtwert" liest, soll nicht glauben, ein Testverfahren habe
 * etwas festgestellt.
 */
function richtwertBlock(mod, opt, gs) {
  if (!mod || !mod.stufen || mod.norm) return '';
  const niveau = typeof opt.level === 'number' && opt.level ? opt.level : (gs && gs.level) || 0;
  const b = bewerte(mod, niveau, alterJahre());
  if (!b) return '';
  const komma = n => String(n).replace('.', ',');

  return `<div data-role="richtwert" style="margin:18px auto 0;max-width:360px;padding:14px 16px;
      background:var(--bg);border-radius:var(--radius-sm)">
    <div style="font-size:.8em;color:var(--text-light)">${u('niveau')} ${komma(b.erreicht)} ·
      ${u('erwartet')} ${komma(b.erwartet)}</div>
    <div style="font-size:1.05em;font-weight:700;color:${b.farbe};margin-top:4px">
      ${b.icon} ${esc(b.text)}</div>
    <p style="font-size:.72em;color:var(--text-light);margin-top:8px;line-height:1.5">
      ${esc(herkunftText(b.herkunft))}</p>
    ${b.stufe === 'weitDarunter' || b.stufe === 'darunter'
      ? `<div style="margin-top:10px"><a href="#" onclick="navigateTo('plan');return false"
          style="color:var(--primary);font-weight:600;text-decoration:none;font-size:.9em">${u('zumPlan')} ›</a></div>`
      : ''}
  </div>`;
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

  // Vorführung: die Zahlen auf dem Bildschirm sind die der Vorführung, nicht
  // die des Kindes. Sie zu zeigen wäre irreführend – und zu speichern falsch.
  if (gs && gs.zeigen) {
    return `<div data-phase="done" data-modus="zeigen" style="text-align:center;width:100%">
      <div style="font-size:3.4em;line-height:1.1">👁️</div>
      <div style="font-weight:800;font-size:1.15em;margin-bottom:6px">${u('vorfuehrungT')}</div>
      <p style="line-height:1.65;max-width:380px;margin:0 auto">${esc(u('vorfuehrung'))}</p>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:18px">
        <button class="btn btn-primary btn-small" onclick="window._ergebnisEintragen()">${u('eintragen')}</button>
        <button class="btn btn-secondary btn-small" onclick="navigateTo('plan')">${u('verwerfen')}</button>
      </div>
    </div>`;
  }

  return `<div data-phase="done" style="text-align:center;width:100%">
    <div style="font-size:3.4em;line-height:1.1">🏁</div>
    <div style="font-weight:800;font-size:1.15em;margin-bottom:6px">${u('fertig')}</div>
    ${wert}
    ${normBlock(mod, opt)}
    ${richtwertBlock(mod, opt, gs)}
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:18px">
      <button class="btn btn-primary btn-small" onclick="window._naechsteAufgabe()">${u('naechste')}</button>
      <button class="btn btn-secondary btn-small" onclick="navigateTo('plan')">${u('zumPlanKnopf')}</button>
      <button class="btn btn-secondary btn-small" onclick="G('restart')">${u('nochmal')}</button>
      ${scaleId ? `<button class="btn btn-secondary btn-small"
        onclick="navigateTo('scale',{scaleId:'${scaleId}'})">${u('gruppe')}</button>` : ''}
    </div>
  </div>`;
}
