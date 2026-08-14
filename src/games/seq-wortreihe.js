/**
 * Wörter-Kette – adaptiver Merkspannen-Test mit Wörtern
 * (KABC-II: „Wortreihe")
 *
 * Gleiche Hülle wie die Zahlenfolgen: auf dem Spielbildschirm stehen nur die
 * Wörter. Damit sind verbaler und numerischer Merkspann direkt vergleichbar –
 * genau dieser Vergleich ist diagnostisch interessant.
 */
import { createSpanTest } from '../core/adaptive.js';
import { removeHint } from '../core/shell.js';
import { sample, shuffle, color, jsArg, esc, lang } from '../core/html.js';
import listen from '../data/wordlists.json' with { type: 'json' };

// Schlüssel ist immer die deutsche Form – angezeigt wird die eingestellte
// Sprache. Vorher standen im russischen Modus deutsche Wörter auf dem Schirm.
const ALL_WORDS = listen.words.map(w => w.de);
const TEXT = Object.fromEntries(listen.words.map(w => [w.de, w]));
const zeige = k => { const l = lang(); return (TEXT[k] && TEXT[k][l]) || k; };
// Bild neben dem Wort: ohne das ist der Test für Kinder, die noch nicht
// lesen, gar nicht durchführbar. Wer liest, nutzt das Wort und ignoriert es.
const bild = k => (TEXT[k] && TEXT[k].emoji) || '';

/** Zeile aus farbigen Wortchips – für Zeigephase und Lösung. */
function row(items, pad, fs) {
  return `<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
    ${items.map((w, i) =>
      `<div style="padding:${pad};border-radius:20px;background:${color(i)};color:#fff;font-weight:700;font-size:${fs};display:flex;align-items:center;gap:7px"><span style="font-size:calc(1.3em * var(--pic))">${bild(w)}</span>${esc(zeige(w))}</div>`
    ).join('')}
  </div>`;
}

const test = createSpanTest({
  id: 'seq-wortreihe',
  minN: 2,
  maxN: 10,
  levelCap: 12,
  factor: 2,
  instruction: {
    de: 'Es erscheinen Wörter. Merke sie dir – und tippe sie danach in derselben Reihenfolge an.',
    ru: 'Появляются слова. Запомни их — и потом нажми их в том же порядке.',
    en: 'Words appear. Remember them – then tap them in the same order.'
  },

  genItems: (level) => sample(ALL_WORDS, Math.min(level, ALL_WORDS.length)),

  genOptions: (gd) => {
    const used = new Set(gd.sequence);
    const distractors = sample(ALL_WORDS.filter(w => !used.has(w)), Math.max(4, gd.sequence.length));
    gd.optionWords = shuffle([...gd.sequence, ...distractors]);
    return gd.optionWords;
  },

  renderShow: (gd) => row(gd.sequence, '11px 18px', '1.15em'),
  renderSolution: (gd) => row(gd.sequence, '6px 13px', '.92em'),

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
