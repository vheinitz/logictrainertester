/**
 * Wörter-Kette mit Ansage – adaptiver Merkspannen-Test, auditiv
 * (KABC-II: „Wortreihe" – so wie im Original, wo die Testleitung vorspricht.)
 *
 * Gegenstück zu `seq-wortreihe`, das die Wörter am Bildschirm zeigt. Erst
 * diese Fassung misst tatsächlich akustisches Kurzzeitgedächtnis; die
 * Bildschirmfassung misst das visuelle. Genau diese Verwechslung steckte
 * vorher im Faktorenmodell: die Textfassung war den auditiven Faktoren
 * zugeordnet, obwohl nichts zu hören war.
 *
 * Der Vergleich beider Fassungen ist das eigentlich Interessante – dieselbe
 * Aufgabe einmal über die Augen, einmal über die Ohren.
 */
import { createSpanTest } from '../core/adaptive.js';
import { sample, shuffle, color, jsArg, esc, lang } from '../core/html.js';
import { audio, audioReady } from '../core/audio.js';
import { hasVoice } from '../core/audio-assets.js';
import { mutedHint, removeHint } from '../core/shell.js';
import { voiceLang, preloadKeys, stepFor, ready, speak } from '../core/speech.js';
import * as settings from '../core/settings.js';
import listen from '../data/wordlists.json' with { type: 'json' };

const ID = 'seq-wortreihe-audio';
const ALL_WORDS = listen.words.map(w => w.de);
const TEXT = Object.fromEntries(listen.words.map(w => [w.de, w]));
const zeige = k => { const l = lang(); return (TEXT[k] && TEXT[k][l]) || k; };
// Bild neben dem Wort in der Antwortphase: gehört wird gesprochen, geantwortet
// wird angetippt – ohne Bild könnten Vorschüler die Auswahl nicht lesen.
const bild = k => (TEXT[k] && TEXT[k].emoji) || '';
const aKey = w => 'w:' + w;

const test = createSpanTest({
  id: ID,
  minN: 2,
  maxN: 10,
  levelCap: 12,
  factor: 1.6,          // gesprochene Wörter brauchen mehr Luft als Ziffern
  answerFactor: 3,
  showPadMs: 1600,
  instruction: {
    de: 'Du <b>hörst</b> Wörter, eines nach dem anderen. Merke sie dir – und tippe sie danach in derselben Reihenfolge an. Der Ton muss eingeschaltet sein.',
    ru: 'Ты <b>услышишь</b> слова, одно за другим. Запомни их — и потом нажми их в том же порядке. Звук должен быть включён.',
    en: 'You will <b>hear</b> words, one after another. Remember them – then tap them in the same order. Sound must be on.'
  },

  genItems: (level) => sample(ALL_WORDS, Math.min(level, ALL_WORDS.length)),

  genOptions: (gd) => {
    const used = new Set(gd.sequence);
    const distractors = sample(ALL_WORDS.filter(w => !used.has(w)), Math.max(4, gd.sequence.length));
    gd.optionWords = shuffle([...gd.sequence, ...distractors]);
    return gd.optionWords;
  },

  onInit: () => { audio(); preloadKeys(voiceLang(), ALL_WORDS.map(aKey)); },

  onShow: (gd) => {
    if (!settings.get('sound')) return;
    const stamp = gd.phaseStart;
    const l = voiceLang();
    const keys = gd.sequence.map(aKey);
    preloadKeys(l, keys).then(() => {
      if (gd.phase !== 'show' || gd.phaseStart !== stamp) return;
      if (!ready(l, keys)) return;
      speak(l, keys, stepFor(l, keys, settings.get('tempo') * 0.8));
    });
  },

  // Während der Ansage bleibt der Bildschirm leer – sonst wäre es kein Hörtest.
  renderShow: () => {
    const stumm = !settings.get('sound') || !audioReady() || !hasVoice(voiceLang());
    return `<div style="font-size:calc(4.4em * var(--pic));line-height:1.1">${stumm ? '🔇' : '👂'}</div>
      ${stumm ? mutedHint() : ''}`;
  },

  renderSolution: (gd) => `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
    ${gd.sequence.map((w, i) =>
      `<div style="padding:6px 12px;border-radius:18px;background:${color(i)};color:#fff;font-weight:700;font-size:.92em;display:flex;align-items:center;gap:5px"><span style="font-size:1.2em">${bild(w)}</span>${esc(zeige(w))}</div>`
    ).join('')}
  </div>`,

  renderAnswer: (gd, ctx) => `
    <div style="display:flex;gap:8px;min-height:44px;flex-wrap:wrap;align-items:center;justify-content:center;margin:0 0 20px">
      ${ctx.selected.map((w, i) =>
        `<div class="pick-target" onclick="G('remove',${i})" title="${removeHint()}" style="padding:7px 14px;border-radius:18px;background:${color(i)};color:#fff;font-weight:700;cursor:pointer;font-size:1em;display:flex;align-items:center;gap:6px"><span style="font-size:calc(1.25em * var(--pic))">${bild(w)}</span>${esc(zeige(w))}</div>`
      ).join('')}
      ${Array(ctx.slotsLeft).fill(0).map(() =>
        `<div style="padding:7px 16px;border-radius:18px;border:2px dashed #D8D4EE;min-width:62px">&nbsp;</div>`
      ).join('')}
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
      ${(gd.optionWords || []).map(w =>
        `<div class="pick-target" onclick="G('pick',${jsArg(w)})" style="padding:9px 15px;border-radius:18px;background:var(--bg);color:var(--text);border:2px solid #D0CDE8;cursor:pointer;font-weight:600;font-size:1em;display:flex;align-items:center;gap:6px"><span style="font-size:calc(1.3em * var(--pic))">${bild(w)}</span>${esc(zeige(w))}</div>`
      ).join('')}
    </div>`
});

export const { init, render, dispose, actions, scoring, chrome, instruction,
               getFactor, setFactor } = test;
