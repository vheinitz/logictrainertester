/**
 * Ergebnis von Hand eintragen – nach einer Vorführung.
 *
 * Warum es das gibt
 * ─────────────────
 * Manche Aufgaben laufen am Bildschirm schlechter als am Tisch, und bei
 * manchen Kindern läuft alles am Tisch besser. Die App kann dann trotzdem
 * nützlich sein: sie zeigt der Begleitperson, wie die Aufgabe geht, und
 * nimmt hinterher das Ergebnis auf, das mit Kärtchen und Material zustande
 * kam. Ohne diesen Weg müsste man sich zwischen „am Tisch üben" und
 * „Verlauf sehen" entscheiden – und beides zusammen ist der Sinn der App.
 *
 * Was eingetragen wird
 * ────────────────────
 * Vor allem das **erreichte Niveau**, denn danach entscheidet der Plan
 * (siehe core/richtwerte.js). Richtig/gestellt kommt dazu, weil es die
 * Sicherheit auf diesem Niveau beschreibt: Stufe 4 mit 8 von 10 ist etwas
 * anderes als Stufe 4 mit 4 von 10.
 *
 * Der Eintrag wird genauso gespeichert wie ein gespielter Durchgang, aber
 * mit `vonHand: true` im Verlauf. Wer später fragt, warum ein Wert aus der
 * Reihe fällt, soll sehen können, dass er nicht aus dem Spiel stammt.
 */
import { engine } from '../core/engine.js';
import { getModule } from '../data/modules.js';
import { erwartetesNiveau } from '../core/richtwerte.js';
import { alterJahre } from '../core/norms.js';
import { analogBox } from './analog-box.js';
import * as storage from '../core/storage.js';
import { lang, esc } from '../core/html.js';

const T = {
  titel:    { de: 'Ergebnis eintragen', ru: 'Внести результат', en: 'Enter the result' },
  unter:    { de: 'So ist es am Tisch gelaufen', ru: 'Как это прошло за столом', en: 'How it went at the table' },
  hinweis:  { de: 'Trag ein, was das Kind ohne Bildschirm geschafft hat. Der Eintrag zählt genauso wie ein gespielter Durchgang – im Verlauf ist er als Eintrag von Hand erkennbar.',
              ru: 'Внесите, что ребёнок сделал без экрана. Запись учитывается наравне с пройденным подходом — в истории она помечена как внесённая вручную.',
              en: 'Enter what the child managed without a screen. The entry counts like a played session – in the history it is marked as entered by hand.' },
  niveau:   { de: 'Erreichte Stufe', ru: 'Достигнутый уровень', en: 'Level reached' },
  niveauHilfe: { de: 'Die schwerste Stufe, die noch sicher saß.', ru: 'Самый трудный уровень, который держался уверенно.', en: 'The hardest level that still held.' },
  erwartet: { de: 'Richtwert für dieses Alter', ru: 'Ориентир для этого возраста', en: 'Guide value for this age' },
  richtig:  { de: 'Richtig gelöst', ru: 'Решено верно', en: 'Solved correctly' },
  von:      { de: 'von', ru: 'из', en: 'of' },
  gestellt: { de: 'Aufgaben gestellt', ru: 'заданий предложено', en: 'tasks given' },
  speichern:{ de: '✓ Eintragen', ru: '✓ Внести', en: '✓ Enter' },
  abbrechen:{ de: 'Abbrechen', ru: 'Отмена', en: 'Cancel' },
  fehler:   { de: 'Bitte richtig und gestellt so eintragen, dass richtig nicht größer ist als gestellt.',
              ru: 'Введите так, чтобы «верно» не превышало «предложено».',
              en: 'Please enter the numbers so that correct is not greater than given.' },
  ohneLeiter:{ de: 'Diese Aufgabe hat keine Stufen – hier zählt nur richtig von gestellt.',
               ru: 'У этого задания нет уровней — здесь считается только «верно из предложенных».',
               en: 'This task has no levels – only correct out of given counts here.' }
};
const t = k => { const l = lang(); return T[k][l] || T[k].de; };

/** Zahlenfeld mit Beschriftung. */
function feld(id, beschriftung, wert, min, max, hilfe) {
  return `<div style="margin-bottom:14px">
    <label for="${id}" style="display:block;font-weight:700;margin-bottom:4px">${esc(beschriftung)}</label>
    <input id="${id}" type="number" value="${wert}" min="${min}" max="${max}" step="1"
      style="width:96px;padding:8px 10px;font-size:1.1em;border:2px solid #D8D4EE;
             border-radius:10px;text-align:center">
    ${hilfe ? `<div style="font-size:.8em;color:var(--text-light);margin-top:4px">${esc(hilfe)}</div>` : ''}
  </div>`;
}

export function renderEintrag(main) {
  const gs = engine.gameState || {};
  const mod = getModule(gs.moduleId);
  if (!mod) { engine.navigateTo('plan'); return; }

  const titel = (mod.title && (mod.title[lang()] || mod.title.de)) || mod.id;
  const hatLeiter = Array.isArray(mod.stufen);
  const [von, bis] = hatLeiter ? mod.stufen : [0, 0];
  const erw = hatLeiter ? erwartetesNiveau(mod, alterJahre()) : null;

  main.innerHTML = `<h2 class="page-title">✍️ ${t('titel')}</h2>
    <p class="page-subtitle">${mod.icon} ${esc(titel)} · ${esc(t('unter'))}</p>

    <div class="training-container"><div class="training-area"
        style="align-items:stretch;max-width:460px;margin:0 auto">
      <p style="line-height:1.65;margin-bottom:16px">${esc(t('hinweis'))}</p>

      ${analogBox(mod.id, { margin: '0 0 18px', warum: false })}

      ${hatLeiter
        ? feld('eintragNiveau', t('niveau'), Math.max(von, Math.round((erw && erw.niveau) || von)),
               von, bis, t('niveauHilfe') + (erw ? ` ${t('erwartet')}: ${String(Math.round(erw.niveau * 10) / 10).replace('.', ',')}` : ''))
        : `<p style="font-size:.88em;color:var(--text-light);margin-bottom:14px">${esc(t('ohneLeiter'))}</p>`}

      <div style="display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap">
        ${feld('eintragRichtig', t('richtig'), 0, 0, 999)}
        ${feld('eintragGestellt', t('gestellt'), 10, 1, 999)}
      </div>

      <div id="eintragFehler" style="display:none;color:var(--secondary);font-size:.9em;
        line-height:1.5;margin-bottom:10px"></div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
        <button class="btn btn-primary btn-small"
          onclick="window._eintragSpeichern()">${t('speichern')}</button>
        <button class="btn btn-secondary btn-small"
          onclick="navigateTo('plan')">${t('abbrechen')}</button>
      </div>
    </div></div>`;
}

/** Zahl aus einem Feld, mit Grenzen. */
function zahl(id, min, max, ersatz) {
  const el = document.getElementById(id);
  if (!el) return ersatz;
  const n = Math.round(Number(el.value));
  if (!Number.isFinite(n)) return ersatz;
  return Math.max(min, Math.min(max, n));
}

/**
 * Eintrag speichern – auf demselben Weg wie ein gespielter Durchgang.
 *
 * Ein eigener Speicherpfad hätte irgendwann andere Felder gefüllt als das
 * Spiel, und die Auswertung hätte zwei Fälle zu unterscheiden gehabt.
 */
export async function eintragSpeichern() {
  const gs = engine.gameState || {};
  const mod = getModule(gs.moduleId);
  if (!mod) { engine.navigateTo('plan'); return; }

  const hatLeiter = Array.isArray(mod.stufen);
  const [von, bis] = hatLeiter ? mod.stufen : [0, 0];
  const niveau = hatLeiter ? zahl('eintragNiveau', von, bis, von) : 0;
  const gestellt = zahl('eintragGestellt', 1, 999, 1);
  const richtig = zahl('eintragRichtig', 0, 999, 0);

  if (richtig > gestellt) {
    const f = document.getElementById('eintragFehler');
    if (f) { f.textContent = t('fehler'); f.style.display = ''; }
    return;
  }

  const sessionId = Date.now();
  await storage.saveHistory(mod.id, mod.scale, gestellt, richtig, gestellt,
                            richtig > 0, 'count', sessionId, niveau, true);
  await storage.recordProgress(mod.id, mod.scale,
    { kind: 'count', addScore: richtig, addTotal: gestellt, level: niveau });

  engine.navigateTo('plan');
}
