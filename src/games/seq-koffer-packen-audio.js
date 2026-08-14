/**
 * Ich packe meinen Koffer – mit Ansage, kumulative Merkspanne, auditiv
 *
 * Gegenstück zu `seq-koffer-packen`, das die Gegenstände als Bilder zeigt.
 * Hier wird die Liste vorgesprochen – so, wie das Spiel am Tisch gespielt
 * wird, und damit als Hörtest verwertbar.
 *
 * Kumulativ wie die Bildfassung: der Koffer wächst und schrumpft, wird aber
 * nie neu gewürfelt. Bei einem Fehler fällt genau das zuletzt hinzugekommene
 * Ding wieder heraus, der Rest bleibt.
 */
import { createSpanTest } from '../core/adaptive.js';
import { sample, randInt, color, jsArg, esc, lang } from '../core/html.js';
import { audio, audioReady } from '../core/audio.js';
import { hasVoice } from '../core/audio-assets.js';
import { mutedHint, removeHint } from '../core/shell.js';
import { voiceLang, preloadKeys, stepFor, ready, speak } from '../core/speech.js';
import * as settings from '../core/settings.js';
import listen from '../data/wordlists.json' with { type: 'json' };

const ID = 'seq-koffer-packen-audio';
const ITEMS = listen.items;
const byKey = k => ITEMS.find(i => i.key === k) || ITEMS[0];
const nameOf = k => { const l = lang(); const i = byKey(k); return i[l] || i.de; };
const aKey = k => 'i:' + k;
// Eigene Ansage: beim Kofferpacken gehoert die Spielformel dazu,
// ein neutrales Wiederhole wuerde das Spiel verfremden.
const LEAD = 'lead-koffer';

const test = createSpanTest({
  id: ID,
  minN: 2,
  maxN: 10,
  levelCap: 12,
  factor: 1.6,
  answerFactor: 3,
  showPadMs: 2000,   // die Koffer-Ansage ist deutlich länger als „Wiederhole"
  labelOf: k => nameOf(k),
  instruction: {
    de: 'Du <b>hörst</b>, was in den Koffer gepackt wird – bei jeder Runde kommt ein Ding dazu. Merke dir alles und tippe es danach in derselben Reihenfolge an. Der Ton muss eingeschaltet sein.',
    ru: 'Ты <b>услышишь</b>, что кладут в чемодан — с каждым кругом добавляется одна вещь. Запомни всё и потом нажми в том же порядке. Звук должен быть включён.',
    en: 'You will <b>hear</b> what goes into the suitcase – each round one more item is added. Remember everything, then tap it in the same order. Sound must be on.'
  },

  /** Der Koffer wächst und schrumpft, wird aber nie neu gewürfelt. */
  genItems: (level, gd) => {
    let koffer = gd.suitcase || [];
    if (koffer.length > level) koffer = koffer.slice(0, level);
    while (koffer.length < level) {
      const used = new Set(koffer);
      const rest = ITEMS.filter(i => !used.has(i.key));
      if (!rest.length) break;
      koffer.push(rest[randInt(0, rest.length - 1)].key);
    }
    gd.suitcase = koffer;
    return koffer.slice(0, level);
  },

  genOptions: (gd) => {
    const inCase = new Set(gd.sequence);
    const distractors = sample(ITEMS.filter(i => !inCase.has(i.key)),
                               Math.max(3, Math.ceil(gd.sequence.length / 2)));
    gd.optionKeys = sample([...gd.sequence, ...distractors.map(d => d.key)], 99);
    return gd.optionKeys;
  },

  onInit: () => { audio(); preloadKeys(voiceLang(), ITEMS.map(i => aKey(i.key)), LEAD); },

  onShow: (gd) => {
    if (!settings.get('sound')) return;
    const stamp = gd.phaseStart;
    const l = voiceLang();
    const keys = gd.sequence.map(aKey);
    preloadKeys(l, keys, LEAD).then(() => {
      if (gd.phase !== 'show' || gd.phaseStart !== stamp) return;
      if (!ready(l, keys)) return;
      speak(l, keys, stepFor(l, keys, settings.get('tempo') * 0.8), { leadKey: LEAD });
    });
  },

  renderShow: () => {
    const stumm = !settings.get('sound') || !audioReady() || !hasVoice(voiceLang());
    return `<div style="font-size:calc(4.4em * var(--pic));line-height:1.1">${stumm ? '🔇' : '🧳'}</div>
      ${stumm ? mutedHint() : ''}`;
  },

  renderSolution: (gd) => `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    ${gd.sequence.map((k, i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="width:calc(40px * var(--pic) / 2 + 20px);height:calc(40px * var(--pic) / 2 + 20px);border-radius:12px;background:${color(i)};display:flex;align-items:center;justify-content:center;font-size:21px">${byKey(k).emoji}</div>
      <span style="font-size:.62em;color:var(--text-light);max-width:56px;text-align:center;line-height:1.2">${esc(nameOf(k))}</span>
    </div>`).join('')}
  </div>`,

  renderAnswer: (gd, ctx) => `
    <div style="display:flex;gap:10px;min-height:50px;align-items:center;justify-content:center;margin:0 0 22px;flex-wrap:wrap">
      ${ctx.selected.map((k, i) =>
        `<div class="pick-target" onclick="G('remove',${i})" title="${removeHint()}" style="width:calc(46px * var(--pic) / 2 + 23px);height:calc(46px * var(--pic) / 2 + 23px);border-radius:12px;background:${color(i)};display:flex;align-items:center;justify-content:center;font-size:calc(1.5em * var(--pic));cursor:pointer">${byKey(k).emoji}</div>`
      ).join('')}
      ${Array(ctx.slotsLeft).fill(0).map(() =>
        `<div style="width:calc(46px * var(--pic) / 2 + 23px);height:calc(46px * var(--pic) / 2 + 23px);border-radius:12px;border:2px dashed #D8D4EE"></div>`
      ).join('')}
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
      ${(gd.optionKeys || []).map(k =>
        `<div class="pick-target" onclick="G('pick',${jsArg(k)})" title="${esc(nameOf(k))}" style="width:calc(58px * var(--pic) / 2 + 29px);height:calc(58px * var(--pic) / 2 + 29px);border-radius:14px;background:var(--bg);border:2px solid #D0CDE8;display:flex;align-items:center;justify-content:center;font-size:calc(1.8em * var(--pic));cursor:pointer">${byKey(k).emoji}</div>`
      ).join('')}
    </div>`
});

export const { init, render, dispose, actions, scoring, chrome, instruction,
               getFactor, setFactor } = test;
