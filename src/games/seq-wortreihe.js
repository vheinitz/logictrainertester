/**
 * Wörter-Kette – adaptiver Merkspannen-Test mit Wörtern
 * (KABC-II: „Wortreihe")
 *
 * Gleiche Hülle wie die Zahlenfolgen: auf dem Spielbildschirm stehen nur die
 * Wörter. Damit sind verbaler und numerischer Merkspann direkt vergleichbar –
 * genau dieser Vergleich ist diagnostisch interessant.
 */
import { createSpanTest } from '../core/adaptive.js';
import { sample, shuffle, color, jsArg, esc } from '../core/html.js';

const ALL_WORDS = [
  'Haus','Baum','Sonne','Mond','Blume','Fisch','Auto','Buch',
  'Tisch','Stuhl','Katze','Hund','Ball','Apfel','Schuh','Uhr',
  'Bett','Lampe','Vogel','Brot','Milch','Regen','Schnee','Wind',
  'Feuer','Stein','Wolke','Stern','Herz','Tür'
];

/** Zeile aus farbigen Wortchips – für Zeigephase und Lösung. */
function row(items, pad, fs) {
  return `<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
    ${items.map((w, i) =>
      `<div style="padding:${pad};border-radius:20px;background:${color(i)};color:#fff;font-weight:700;font-size:${fs}">${esc(w)}</div>`
    ).join('')}
  </div>`;
}

const test = createSpanTest({
  id: 'seq-wortreihe',
  minN: 2,
  maxN: 10,
  levelCap: 12,
  factor: 2,
  instruction: 'Es erscheinen Wörter. Merke sie dir – und tippe sie danach in ' +
               'derselben Reihenfolge an.',

  genItems: (level) => sample(ALL_WORDS, Math.min(level, ALL_WORDS.length)),

  genOptions: (gd) => {
    const used = new Set(gd.sequence);
    const distractors = sample(ALL_WORDS.filter(w => !used.has(w)), Math.max(4, gd.sequence.length));
    gd.optionWords = shuffle([...gd.sequence, ...distractors]);
    return gd.optionWords;
  },

  renderShow: (gd) => row(gd.sequence, '11px 20px', '1.15em'),
  renderSolution: (gd) => row(gd.sequence, '6px 13px', '.92em'),

  renderAnswer: (gd, ctx) => `
    <div style="display:flex;gap:8px;min-height:44px;flex-wrap:wrap;align-items:center;justify-content:center;margin:0 0 20px">
      ${ctx.selected.map((w, i) =>
        `<div class="pick-target" onclick="G('remove',${i})" title="Zurücknehmen" style="padding:7px 16px;border-radius:18px;background:${color(i)};color:#fff;font-weight:700;cursor:pointer;font-size:1em">${esc(w)}</div>`
      ).join('')}
      ${Array(ctx.slotsLeft).fill(0).map(() =>
        `<div style="padding:7px 16px;border-radius:18px;border:2px dashed #D8D4EE;min-width:62px">&nbsp;</div>`
      ).join('')}
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
      ${(gd.optionWords || []).map(w =>
        `<div class="pick-target" onclick="G('pick',${jsArg(w)})" style="padding:9px 17px;border-radius:18px;background:var(--bg);color:var(--text);border:2px solid #D0CDE8;cursor:pointer;font-weight:600;font-size:1em">${esc(w)}</div>`
      ).join('')}
    </div>`
});

export const { init, render, dispose, actions, scoring, chrome, instruction,
               getFactor, setFactor } = test;
