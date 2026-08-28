/**
 * Bauplan für die beiden Abruf-Module.
 *
 * Bewusst kein createChoiceGame: dort wächst die Schwierigkeit mit dem
 * Können, und die Zahl der Runden steht in den Einstellungen. Beim
 * verzögerten Abruf ist beides falsch. Gefragt wird genau das, was vorher
 * gelernt wurde – jedes Paar einmal, nicht öfter und nicht weniger. Die
 * Aufgabe ist so schwer, wie sie beim Lernen war; sie nachträglich zu
 * erleichtern hieße, etwas anderes zu messen.
 *
 * Was passiert, wenn es nichts abzurufen gibt
 * ───────────────────────────────────────────
 * Dann steht hier kein Test, sondern eine Auskunft: was zuerst zu tun ist,
 * und wie lange es noch dauert. Ein leerer oder ausgedachter Test wäre die
 * schlechtere Antwort – er lieferte eine Zahl, die nichts bedeutet.
 */
import { engine } from './engine.js';
import { shuffle, sample, pick, esc, lang } from './html.js';
import { countRound, resultScreen } from './session.js';
import { bar, pictogram } from './shell.js';
import * as settings from './settings.js';
import { stand, verbrauchen, MIN_MINUTEN, SOLL_MINUTEN } from './abruf.js';

const UI = {
  nichtsT: { de: 'Dafür fehlt noch der erste Teil', ru: 'Не хватает первой части', en: 'The first part is still missing' },
  nichts: {
    de: 'Diese Aufgabe fragt ab, was vom Lernen übrig geblieben ist. Dafür muss zuerst gelernt werden.',
    ru: 'Это задание проверяет, что осталось после занятия. Значит, сначала нужно позаниматься.',
    en: 'This task asks what is left after learning. So the learning has to happen first.'
  },
  zufruehT: { de: 'Noch zu früh', ru: 'Ещё рано', en: 'Still too early' },
  zufrueh: {
    de: 'Zwischen Lernen und Abruf soll etwas anderes passieren – sonst steckt alles noch im Kopf und der Test misst dasselbe wie eben.',
    ru: 'Между занятием и проверкой должно пройти другое занятие — иначе всё ещё в голове, и тест измерит то же самое.',
    en: 'Something else should happen between learning and recall – otherwise everything is still in mind and the test measures the same thing again.'
  },
  nochMin: { de: 'Noch etwa', ru: 'Ещё примерно', en: 'About' },
  minuten: { de: 'Minuten – macht so lange andere Aufgaben.', ru: 'мин. — займитесь пока другими заданиями.', en: 'minutes to go – do other tasks in the meantime.' },
  zualtT: { de: 'Zu lange her', ru: 'Слишком давно', en: 'Too long ago' },
  zualt: {
    de: 'Das Lernen liegt zu weit zurück. Was jetzt noch da wäre, ist etwas anderes als das, was nach zwanzig Minuten hängen bleibt. Bitte noch einmal lernen.',
    ru: 'С момента занятия прошло слишком много времени. То, что осталось сейчас, — это уже не то, что держится через двадцать минут. Позанимайтесь ещё раз.',
    en: 'The learning was too long ago. What would still be there now is not the same as what stays after twenty minutes. Please learn it again.'
  },
  zumLernen: { de: '▶ Zum Lernteil', ru: '▶ К части с обучением', en: '▶ To the learning part' },
  seit: { de: 'Gelernt vor', ru: 'Занимались', en: 'Learned' },
  minKurz: { de: 'Minuten', ru: 'мин. назад', en: 'minutes ago' },
  paare: { de: 'Paare', ru: 'пар', en: 'pairs' }
};
const u = k => pick(UI[k]);

/**
 * @param {object} cfg
 *   id          Kennung des ABRUF-Moduls
 *   lernModulId Kennung des Lernmoduls, dessen Paare abgefragt werden
 *   frage       {de,ru,en} – Frage über den Optionen
 *   fuellwoerter() → string[]  Zusatzoptionen, falls zu wenige gelernte Namen
 */
export function createAbrufTest(cfg) {
  const ID = cfg.id;
  let timer = null;
  const clearTimer = () => { if (timer) { clearTimeout(timer); timer = null; } };
  const aktiv = () => !!(engine.activeGame && engine.activeGame.id === ID);

  function naechsteFrage(gs) {
    const gd = gs.gd;
    const paar = gd.offen.shift();
    if (!paar) { gd.phase = 'fertig'; return; }

    // Ablenker sind die anderen gelernten Namen. Fremde Wörter wären zu
    // leicht auszuschließen – man müsste nur erkennen, was überhaupt vorkam.
    const andere = gd.paare.filter(p => p.name !== paar.name).map(p => p.name);
    const fehlend = Math.max(0, 3 - andere.length);
    const fueller = fehlend && cfg.fuellwoerter
      ? sample(cfg.fuellwoerter().filter(w => !gd.paare.some(p => p.name === w)), fehlend)
      : [];
    gd.optionen = shuffle([paar.name, ...sample(andere, 3), ...fueller].slice(0, 4));
    gd.aktuell = paar;
    gd.phase = 'frage';
    gd.phaseStart = Date.now();
    gd.frist = Math.round(settings.get('choiceAnswer') * 1000);

    clearTimer();
    timer = setTimeout(() => { if (aktiv()) antworte(gs, null); }, gd.frist);
  }

  function antworte(gs, gewaehlt) {
    const gd = gs.gd;
    if (!gd || gd.phase !== 'frage') return;
    clearTimer();
    const richtig = gewaehlt === gd.aktuell.name;

    gs.total = (gs.total || 0) + 1;
    if (richtig) gs.score = (gs.score || 0) + 1;
    gd.richtig = richtig;
    gd.phase = 'rueckmeldung';

    const vorbei = countRound(gs) || !gd.offen.length;
    engine.renderGame();

    timer = setTimeout(() => {
      if (!aktiv()) return;
      if (vorbei) {
        gd.phase = 'fertig';
        // Ein zweiter Abruf derselben Paare misst nichts Neues mehr.
        verbrauchen(cfg.lernModulId);
      } else {
        naechsteFrage(gs);
      }
      engine.renderGame();
    }, Math.round(settings.get(richtig ? 'feedbackOk' : 'feedbackWrong') * 1000));
  }

  function init(gs) {
    const gd = gs.gd || {};
    gs.gd = gd;
    gd._ready = true;

    const s = stand(cfg.lernModulId);
    gd.hinweis = s.bereit ? null : s.grund;
    gd.minuten = s.minuten;
    if (!s.bereit) { gd.phase = 'hinweis'; return gs; }

    gd.paare = s.paare.slice();
    gd.offen = shuffle(gd.paare.slice());
    naechsteFrage(gs);
    return gs;
  }

  function dispose(gs) {
    clearTimer();
    if (gs && gs.gd) gs.gd._ready = false;
  }

  function hinweisSeite(gd) {
    const titel = gd.hinweis === 'nichts' ? u('nichtsT')
      : gd.hinweis === 'zufrueh' ? u('zufruehT') : u('zualtT');
    const text = gd.hinweis === 'nichts' ? u('nichts')
      : gd.hinweis === 'zufrueh' ? u('zufrueh') : u('zualt');
    const rest = gd.hinweis === 'zufrueh'
      ? `<p style="margin-top:10px;font-weight:700">${esc(u('nochMin'))} ${Math.max(1, MIN_MINUTEN - (gd.minuten || 0))} ${esc(u('minuten'))}</p>`
      : '';
    return `<div data-phase="hinweis" data-grund="${gd.hinweis}" style="text-align:center;max-width:420px">
      <div style="font-size:2.6em;line-height:1.2">⏳</div>
      <div style="font-weight:800;font-size:1.1em;margin:6px 0 8px">${esc(titel)}</div>
      <p style="line-height:1.65">${esc(text)}</p>
      ${rest}
      <div style="margin-top:16px">
        <button class="btn btn-primary btn-small"
          onclick="startModule('${cfg.lernModulId}')">${esc(u('zumLernen'))}</button>
      </div>
    </div>`;
  }

  function render(gs) {
    let gd = gs.gd;
    if (!gd || !gd._ready) { init(gs); gd = gs.gd; }

    if (gd.phase === 'hinweis') return hinweisSeite(gd);
    if (gd.phase === 'fertig') return resultScreen(gs, { score: gs.score, total: gs.total });

    if (gd.phase === 'rueckmeldung') {
      return `<div data-phase="rueckmeldung" style="text-align:center;width:100%">
        ${pictogram(gd.richtig ? '✅' : '❌')}
        ${gd.richtig ? '' : `<div style="margin-top:12px;font-size:1.05em">
          <span style="font-size:calc(2em * var(--pic))">${gd.aktuell.bild}</span>
          <div style="font-weight:800;margin-top:4px">${esc(gd.aktuell.name)}</div></div>`}
      </div>`;
    }

    return `<div data-phase="frage" style="width:100%;max-width:480px;text-align:center">
      <p style="font-size:1.05em">${esc(pick(cfg.frage))}</p>
      <div style="font-size:calc(3.4em * var(--pic));margin:10px 0">${gd.aktuell.bild}</div>
      <div class="options-vertical" style="margin:16px auto">
        ${gd.optionen.map(x =>
          `<button class="option-btn pick-target" onclick="G('waehle',${JSON.stringify(x).replace(/"/g, '&quot;')})">${esc(x)}</button>`
        ).join('')}
      </div>
      <div style="font-size:.78em;color:var(--text-light)">
        ${esc(u('seit'))} ${gd.minuten} ${esc(u('minKurz'))} · ${gd.paare.length} ${esc(u('paare'))}
      </div>
      ${bar(gd.frist || 1, Date.now() - (gd.phaseStart || Date.now()))}
    </div>`;
  }

  const actions = {
    waehle(gs, name) { antworte(gs, name); },
    restart(gs) {
      clearTimer();
      gs.gd = {};
      gs.score = 0; gs.total = 0; gs.rounds = 0;
      init(gs);
    }
  };

  return { init, render, dispose, actions, scoring: 'count' };
}

export { SOLL_MINUTEN };
