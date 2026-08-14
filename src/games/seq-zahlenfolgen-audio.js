/**
 * Zahlenfolgen mit Ansage – adaptiver Merkspannen-Test, auditiv
 * (KABC-II: „Zahlen nachsprechen" – dies ist die Variante, die dem Original
 *  entspricht: die Ziffern werden vorgesprochen, nicht gezeigt.)
 *
 * Unterschied zur Bildschirm-Variante `seq-zahlenfolgen`: die Ziffern kommen
 * als Sprachaufnahme, der Bildschirm zeigt während der Ansage nichts als ein
 * Ohr-Symbol. Damit misst dieses Modul das **akustische** Kurzzeitgedächtnis –
 * deshalb sind ihm im Faktorenmodell die auditiven Fähigkeiten zugeordnet und
 * der Bildschirm-Variante die visuellen.
 *
 * Die Aufnahmen sind vorab erzeugt (tools/make-audio.py) statt zur Laufzeit
 * gesprochen: `speechSynthesis` klingt auf jedem Gerät anders und startet
 * zeitlich unvorhersehbar. Für eine Merkspanne muss jede Ziffer im selben
 * Takt kommen, sonst misst man das Gerät statt das Kind.
 *
 * Die Sprache folgt der Einstellung der App (DE/RU).
 */
import { createSpanTest } from '../core/adaptive.js';
import { shuffle, color, lang } from '../core/html.js';
import { mutedHint, removeHint } from '../core/shell.js';
import { audio, audioReady, loadClip, clipsReady, playClip } from '../core/audio.js';
import { clip, clipText, hasVoice, longestMs } from '../core/audio-assets.js';
import * as settings from '../core/settings.js';

const ID = 'seq-zahlenfolgen-audio';
const FACTOR = 1.3;            // Sekunden je Ziffer (Voreinstellung)
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const GAP_NACH_ANSAGE = 400;   // ms zwischen „Wiederhole:" und der ersten Ziffer
const MIN_LUECKE = 220;        // ms Ruhe zwischen zwei Ziffern

/** Sprache der App, auf vorhandene Aufnahmen eingeschränkt. */
function voiceLang() {
  const l = lang();
  return hasVoice(l) ? l : (hasVoice('de') ? 'de' : l);
}

const dKey = n => 'd' + n;
const key = (l, n) => l + dKey(n);
const leadKey = l => l + 'lead';

/** Ziffern und Ansage der aktuellen Sprache im Hintergrund dekodieren. */
function preload() {
  const l = voiceLang();
  return Promise.all([
    ...DIGITS.map(n => loadClip(key(l, n), clip(l, dKey(n)))),
    loadClip(leadKey(l), clip(l, 'lead'))
  ]);
}

/**
 * Abstand von Ziffernbeginn zu Ziffernbeginn.
 * Folgt der globalen Tempo-Einstellung, bleibt aber immer weit genug, dass
 * das längste Wort nicht ins nächste läuft.
 */
function stepMs() {
  const l = voiceLang();
  const f = settings.get('tempo') * (FACTOR / 2);
  return Math.max(f * 1000, longestMs(l, DIGITS.map(dKey)) + MIN_LUECKE);
}

/**
 * Ansage und Folge sprechen.
 *
 * Erst „Wiederhole:", dann die Ziffern in festem Abstand. Die Ansage gibt dem
 * Kind ein Startsignal – ohne sie kommt die erste Ziffer aus dem Nichts, und
 * genau die geht am ehesten verloren.
 *
 * Der Abstand wird gegen die längste Aufnahme abgesichert: „восемь" dauert
 * 862 ms, ein zu enger Takt ließe die Ziffern ineinanderlaufen.
 */
function speak(sequence, step) {
  const a = audio();
  const l = voiceLang();
  if (!a) return;
  let t = a.currentTime + 0.15;
  const lead = playClip(leadKey(l), t);        // Dauer in Sekunden
  t += (lead || 0) + GAP_NACH_ANSAGE / 1000;
  for (const n of sequence) {
    playClip(key(l, n), t);
    t += step / 1000;
  }
}

const test = createSpanTest({
  id: ID,
  minN: 2,
  maxN: 10,
  levelCap: 10,          // mehr als 10 verschiedene Ziffern gibt es nicht
  factor: FACTOR,
  answerFactor: 3,       // Eingabezeit großzügiger: Ziffern suchen dauert
  // Platz für die Ansage vor der ersten Ziffer (längste: „Повтори:" 836 ms)
  // plus die Lücke danach, damit die Zeigephase nicht mitten im Sprechen endet.
  showPadMs: 1400,
  instruction: {
    de: 'Du <b>hörst</b> Zahlen, eine nach der anderen. Merke sie dir – und tippe sie danach in derselben Reihenfolge an. Der Ton muss eingeschaltet sein.',
    ru: 'Ты <b>услышишь</b> числа, одно за другим. Запомни их — и потом нажми их в том же порядке. Звук должен быть включён.',
    en: 'You will <b>hear</b> numbers, one after another. Remember them – then tap them in the same order. Sound must be on.'
  },

  genItems: (level) => shuffle(DIGITS).slice(0, Math.min(level, DIGITS.length)),

  onInit: () => { audio(); preload(); },

  /**
   * Ansagen, sobald die Aufnahmen dekodiert sind. Der Zeitstempel schützt
   * davor, in eine längst weitergelaufene Runde hineinzusprechen.
   */
  onShow: (gd) => {
    if (!settings.get('sound')) return;
    const stamp = gd.phaseStart;
    preload().then(() => {
      if (gd.phase !== 'show' || gd.phaseStart !== stamp) return;
      const l = voiceLang();
      if (!clipsReady(gd.sequence.map(n => key(l, n)))) return;
      speak(gd.sequence, stepMs());
    });
  },

  // Während der Ansage zeigt der Bildschirm nichts – sonst wäre es kein Hörtest.
  renderShow: () => {
    const stumm = !settings.get('sound') || !audioReady() || !hasVoice(voiceLang());
    return `<div style="font-size:calc(4.4em * var(--pic));line-height:1.1">${stumm ? '🔇' : '👂'}</div>
      ${stumm ? mutedHint() : ''}`;
  },

  renderSolution: (gd) => `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    ${gd.sequence.map(n =>
      `<div style="width:calc(40px * var(--pic) / 2 + 20px);height:calc(40px * var(--pic) / 2 + 20px);border-radius:50%;background:${bg(n)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800">${n}</div>`
    ).join('')}
  </div>`,

  renderAnswer: (gd, ctx) => `
    <div style="display:flex;gap:10px;min-height:52px;align-items:center;justify-content:center;margin:0 0 22px;flex-wrap:wrap">
      ${ctx.selected.map((n, i) =>
        `<div class="pick-target" onclick="G('remove',${i})" title="${removeHint()}" style="width:calc(46px * var(--pic) / 2 + 23px);height:calc(46px * var(--pic) / 2 + 23px);border-radius:50%;background:${bg(n)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:calc(1.25em * var(--pic));font-weight:800;cursor:pointer">${n}</div>`
      ).join('')}
      ${Array(ctx.slotsLeft).fill(0).map(() =>
        `<div style="width:calc(46px * var(--pic) / 2 + 23px);height:calc(46px * var(--pic) / 2 + 23px);border-radius:50%;border:2px dashed #D8D4EE"></div>`
      ).join('')}
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:380px;margin:0 auto">
      ${DIGITS.map(n =>
        `<div class="pick-target" onclick="G('pick',${n})" style="width:calc(56px * var(--pic) / 2 + 28px);height:calc(56px * var(--pic) / 2 + 28px);border-radius:50%;background:${bg(n)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:calc(1.4em * var(--pic));font-weight:700;cursor:pointer">${n}</div>`
      ).join('')}
    </div>`
});

const bg = n => (n === 0 ? '#94A3B8' : color(n - 1));

export const { init, render, dispose, actions, scoring, chrome, instruction,
               getFactor, setFactor } = test;

/** Nur für Tests: welche Sprache und welche Wörter kämen zum Einsatz? */
export function _voice() {
  const l = voiceLang();
  return { lang: l, words: DIGITS.map(n => clipText(l, dKey(n))) };
}
