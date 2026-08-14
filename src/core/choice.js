/**
 * Auswahl-Aufgaben-Engine
 * ───────────────────────
 * Deckt alles ab, was auf „(optional erst etwas zeigen,) dann eine von N
 * Möglichkeiten anklicken" hinausläuft: Wissensquiz, Bausteine zählen,
 * Gestaltschließen, Suchbild, Symbol-Abruf, Atlantis-Abruf.
 *
 * Phasen:  study (optional) → ask → feedback → nächste Runde
 *
 * Kein „Weiter"-Knopf: die Rückmeldung läuft nach kurzer Zeit von selbst
 * weiter, und die Antwortphase hat ein Zeitlimit. Das hält den Ablauf für ein
 * Kind gleichförmig – dieselbe Erwartung wie bei den Merkspannen-Tests – und
 * verhindert, dass eine unbeantwortete Aufgabe endlos stehen bleibt.
 *
 * Was hier NICHT passiert: die Aufgabe vor dem Antworten ausblenden. Bei
 * „Was passt nicht?" oder einer Wissensfrage würde das aus einer Denk- eine
 * Gedächtnisaufgabe machen und damit etwas anderes messen. Ausgeblendet wird
 * nur, wo Merken das Ziel ist – das leistet die optionale `study`-Phase.
 *
 * Schwierigkeit: gd.level steigt nach `upAfter` richtigen Antworten in Folge
 * und sinkt nach `downAfter` falschen. genRound() bekommt das Niveau und
 * entscheidet selbst, wie es das umsetzt.
 *
 * Bewertung: count – gs.score = richtig, gs.total = beantwortet.
 */
import { engine } from './engine.js';
import { esc, pick, lang } from './html.js';
import { bar } from './shell.js';
import * as settings from './settings.js';
import { registerModuleSettings, modGet } from './settings.js';
import { countRound, resultScreen } from './session.js';

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

const CHOICE_UI = {
  merken:   { de: 'zum Merken', ru: 'на запоминание', en: 'to memorise' },
  noch:     { de: 'Noch', ru: 'Ещё', en: '' },
  weiter:   { de: '⏭️ Weiter', ru: '⏭️ Дальше', en: '⏭️ Skip' },
  richtig:  { de: '🎉 <b>Richtig!</b>', ru: '🎉 <b>Правильно!</b>', en: '🎉 <b>Correct!</b>' },
  falsch:   { de: '😔 <b>Leider nicht.</b>', ru: '😔 <b>Не совсем.</b>', en: '😔 <b>Not quite.</b>' },
  zeitum:   { de: '⏰ <b>Zeit abgelaufen.</b>', ru: '⏰ <b>Время вышло.</b>', en: '⏰ <b>Time is up.</b>' },
  waere:    { de: 'Richtig wäre:', ru: 'Правильный ответ:', en: 'The answer was:' }
};
const cu = k => { const l = lang(); return CHOICE_UI[k][l] !== undefined && CHOICE_UI[k][l] !== '' ? CHOICE_UI[k][l] : CHOICE_UI[k].de; };

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
 *   roundKey(round, gd) → string
 *                Kennung der Aufgabe. Ist sie gesetzt, sorgt die Engine
 *                dafür, dass sich innerhalb eines Durchgangs nichts
 *                wiederholt.
 *   answerSeconds
 *                Eigene Bedenkzeit dieses Moduls statt der allgemeinen.
 *                Wird als Einstellung des Moduls angemeldet und ist damit
 *                auf der Einstellungsseite verstellbar.
 */
export function createChoiceGame(cfg) {
  const id = cfg.id;
  const minLevel = cfg.minLevel ?? 1;
  const maxLevel = cfg.maxLevel ?? 5;
  const upAfter = cfg.upAfter ?? 2;
  const downAfter = cfg.downAfter ?? 2;

  // Eigene Bedenkzeit: manche Aufgaben sind in fünf Sekunden zu beantworten
  // oder gar nicht. Dreißig Sekunden Grundzeit sind dort keine Großzügigkeit,
  // sondern Leerlauf, in dem die Aufmerksamkeit wegdriftet.
  if (typeof cfg.answerSeconds === 'number') {
    registerModuleSettings(id, {
      antwortzeit: {
        def: cfg.answerSeconds, min: 2, max: 60, step: 1, unit: 's',
        de: 'Antwortzeit', ru: 'Время на ответ', en: 'Answer time',
        hintDe: 'Nach dieser Zeit gilt die Aufgabe als nicht gelöst. Höhere Niveaustufen bekommen zusätzlich den allgemeinen Zuschlag.',
        hintRu: 'По истечении этого времени задание считается нерешённым. На высоких уровнях добавляется общая прибавка.',
        hintEn: 'After this time the task counts as unsolved. Higher levels additionally get the general surcharge.'
      }
    });
  }

  /**
   * Aufgabe erzeugen, die in diesem Durchgang noch nicht dran war.
   *
   * Ohne das kam dieselbe Frage zwei-, dreimal hintereinander – das wirkt
   * wie ein Fehler und misst beim zweiten Mal etwas anderes, nämlich die
   * Erinnerung an die vorige Antwort statt des Wissens.
   *
   * Ist der Vorrat erschöpft, wird das Gedächtnis geleert statt endlos zu
   * würfeln: lieber eine Wiederholung als gar keine Aufgabe.
   */
  function frischeRunde(gd, gs) {
    if (!cfg.roundKey) return cfg.genRound(gd, gs);
    // Reihenfolge statt Menge: bei erschöpftem Vorrat wird gezielt das
    // Älteste vergessen, damit Wiederholungen so weit wie möglich
    // auseinanderliegen.
    gd._gestellt = gd._gestellt || [];

    const holen = () => {
      const r = cfg.genRound(gd, gs);
      return [r, cfg.roundKey(r, gd)];
    };

    for (let versuch = 0; versuch < 30; versuch++) {
      const [r, key] = holen();
      if (key == null) return r;
      if (!gd._gestellt.includes(key)) { gd._gestellt.push(key); return r; }
    }

    // Der Vorrat dieser Stufe ist kleiner als der Durchgang. Dann lieber eine
    // Wiederholung als gar keine Aufgabe – aber nicht direkt hintereinander:
    // die beiden zuletzt gestellten bleiben gesperrt.
    gd._gestellt = gd._gestellt.slice(-2);
    for (let versuch = 0; versuch < 30; versuch++) {
      const [r, key] = holen();
      if (key == null || !gd._gestellt.includes(key)) {
        if (key != null) gd._gestellt.push(key);
        return r;
      }
    }
    const [r, key] = holen();
    if (key != null) gd._gestellt.push(key);
    return r;
  }

  function nextRound(gs) {
    const gd = gs.gd;
    gd.round = frischeRunde(gd, gs);
    gd.picked = null;
    gd.answeredCorrect = null;
    if (gd.round.study && gd.round.study.seconds > 0) {
      gd.phase = 'study';
      gd.phaseStart = Date.now();
      gd.studyDuration = Math.round(gd.round.study.seconds * 1000 * settings.get('studyFactor'));
      schedule(id, gd.studyDuration, () => {
        beginneAntwort(gs);
        engine.renderGame();
      }, true);
    } else {
      gd.phase = 'ask';
      beginneAntwort(gs);
    }
  }

  /** Antwortphase mit Zeitlimit starten. Ohne Antwort gilt sie als nicht gelöst. */
  function beginneAntwort(gs) {
    const gd = gs.gd;
    gd.phase = 'ask';
    gd.phaseStart = Date.now();
    // Bedenkzeit wächst mit dem Niveau. Auf Stufe 5 ist die Aufgabe schwerer,
    // aber die Uhr lief bisher gleich schnell – wer weiter kam, wurde dafür
    // mit knapperer Zeit bestraft.
    const stufe = Math.max(1, gd.level || 1);
    const faktor = 1 + (stufe - 1) * settings.get('choiceLevelFactor');
    const grund = typeof cfg.answerSeconds === 'number'
      ? modGet(id, 'antwortzeit')
      : settings.get('choiceAnswer');
    gd.answerDuration = Math.round(grund * faktor * 1000);
    schedule(id, gd.answerDuration, () => zeitAbgelaufen(gs));
  }

  function zeitAbgelaufen(gs) {
    const gd = gs.gd;
    if (!gd || gd.phase !== 'ask') return;
    gd.picked = null;
    gd.answeredCorrect = false;
    gd.timeout = true;
    gd.phase = 'feedback';
    gs.total = (gs.total || 0) + 1;
    gd.streakDown++; gd.streakUp = 0;
    if (gd.streakDown >= downAfter && gd.level > minLevel) { gd.level--; gd.streakDown = 0; }
    engine.renderGame();
    weiterNach(gs, false);
  }

  /**
   * Nach der Rückmeldung von selbst weiter – oder zum Ergebnis, wenn der
   * Durchgang die eingestellte Zahl von Übungen erreicht hat.
   */
  function weiterNach(gs, richtig) {
    const ms = Math.round((richtig ? settings.get('feedbackOk') : settings.get('feedbackWrong')) * 1000);
    const vorbei = countRound(gs);
    schedule(id, ms, () => {
      if (vorbei) { gs.gd.phase = 'done'; } else { nextRound(gs); }
      engine.renderGame();
    });
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
          <span id="advClock">${Math.ceil(remaining / 1000)}</span>s ${cu('merken')}
        </p>
        <button class="btn btn-secondary btn-small" onclick="G('skipStudy')">${cu('weiter')}</button>
      </div>`;
    }

    if (gd.phase === 'ask') {
      const elapsed = Date.now() - (gd.phaseStart || Date.now());
      return `<div data-phase="ask" style="width:100%;max-width:560px">
        ${bar(gd.answerDuration || 30000, elapsed)}
        ${r.prompt}
        ${optionsHtml(r, gd)}
      </div>`;
    }

    if (gd.phase === 'done') {
      return resultScreen(gs, { score: gs.score, total: gs.total });
    }

    // feedback – läuft von selbst weiter, kein Knopf
    const explain = r.explain ? pick(r.explain) : '';
    const richtig = r.options[r.correct] ? (r.options[r.correct].label || '') : '';
    const banner = gd.answeredCorrect
      ? `<div class="feedback-banner feedback-correct">${cu('richtig')}${explain ? ' ' + esc(explain) : ''}</div>`
      : `<div class="feedback-banner feedback-wrong">${gd.timeout ? cu('zeitum') : cu('falsch')}
           ${cu('waere')} ${richtig}${explain ? '<br><span style="font-size:.85em">' + esc(explain) + '</span>' : ''}</div>`;

    return `<div data-phase="feedback" style="width:100%;max-width:560px;text-align:center">
      ${banner}
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
        `<div class="game-card-item pick-target" onclick="G('choose',${i})" style="aspect-ratio:auto;min-height:calc(36px * var(--pic));padding:8px;font-size:${o.small ? '1.1em' : 'calc(2.2em * var(--pic))'}">${o.html}</div>`
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
      gd.timeout = false;
      weiterNach(gs, correct);
    },

    /** Bleibt für Tests und als Notausgang erreichbar. */
    next(gs) {
      nextRound(gs);
    },

    restart(gs) {
      stopTimers(id);
      gs.gd = {};
      gs.score = 0; gs.total = 0; gs.rounds = 0;
      init(gs);
    },

    skipStudy(gs) {
      const gd = gs.gd;
      if (!gd || gd.phase !== 'study') return false;
      beginneAntwort(gs);
    },

    // Spiele können eigene Actions ergänzen (z. B. „nächsten Hinweis zeigen")
    ...(cfg.extraActions || {})
  };

  return { init, render, dispose, actions, scoring: 'count' };
}
