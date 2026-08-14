/**
 * Gesichter-Merkspiel – adaptive Merkspanne für Gesichter
 * (KABC-II: „Wiedererkennen von Gesichtern")
 *
 * Kurz mehrere Gesichter zeigen, danach dieselben Gesichter in der gezeigten
 * Reihenfolge aus einer größeren Auswahl heraussuchen. Die Ablenker stammen
 * aus derselben Emoji-Familie, damit tatsächlich das Gesicht erinnert werden
 * muss und nicht nur ein auffälliges Merkmal.
 */
import { createSpanTest } from '../core/adaptive.js';
import { removeHint } from '../core/shell.js';
import { sample, shuffle, jsArg } from '../core/html.js';

const FACES = [
  '👦','👧','🧒','👨','👩','🧑','👴','👵','🧔','👱',
  '👲','🧕','👳','👮','👷','💂','🕵️','👨‍🌾','👩‍🍳','👨‍🎨',
  '👩‍🚀','👨‍🚒','🧑‍🎓','👩‍⚕️','🧑‍🏫','👨‍🔧','👩‍🎤','🧑‍🔬'
];

/** Zeile aus Gesichtern – für Zeigephase und Lösung. */
function row(items, size) {
  return `<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
    ${items.map(f =>
      `<div style="width:${size}px;height:${size}px;border-radius:50%;background:var(--bg);border:3px solid var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.55)}px">${f}</div>`
    ).join('')}
  </div>`;
}

const test = createSpanTest({
  id: 'sim-gesichter',
  minN: 2,
  maxN: 8,
  scoreMap: { 2: 0, 3: 25, 4: 45, 5: 65, 6: 85, 7: 105, 8: 125 },
  bonus: 150,
  factor: 2.5,        // Gesichter brauchen etwas länger als Ziffern
  answerFactor: 2,
  instruction: {
    de: 'Es erscheinen Gesichter. Merke sie dir – und tippe sie danach in derselben Reihenfolge an.',
    ru: 'Появляются лица. Запомни их — и потом нажми их в том же порядке.',
    en: 'Faces appear. Remember them – then tap them in the same order.'
  },

  genItems: (level) => sample(FACES, Math.min(level, FACES.length)),

  genOptions: (gd) => {
    const shown = new Set(gd.sequence);
    const distractors = sample(FACES.filter(f => !shown.has(f)), Math.max(4, gd.sequence.length));
    gd.optionFaces = shuffle([...gd.sequence, ...distractors]);
    return gd.optionFaces;
  },

  renderShow: (gd) => row(gd.sequence, 68),
  renderSolution: (gd) => row(gd.sequence, 44),

  renderAnswer: (gd, ctx) => `
    <div style="display:flex;gap:10px;min-height:50px;align-items:center;justify-content:center;margin:0 0 22px;flex-wrap:wrap">
      ${ctx.selected.map((f, i) =>
        `<div class="pick-target" onclick="G('remove',${i})" title="${removeHint()}" style="width:calc(48px * var(--pic) / 2 + 24px);height:calc(48px * var(--pic) / 2 + 24px);border-radius:50%;background:var(--primary-light);display:flex;align-items:center;justify-content:center;font-size:calc(1.6em * var(--pic));cursor:pointer">${f}</div>`
      ).join('')}
      ${Array(ctx.slotsLeft).fill(0).map(() =>
        `<div style="width:calc(48px * var(--pic) / 2 + 24px);height:calc(48px * var(--pic) / 2 + 24px);border-radius:50%;border:2px dashed #D8D4EE"></div>`
      ).join('')}
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
      ${(gd.optionFaces || []).map(f =>
        `<div class="pick-target" onclick="G('pick',${jsArg(f)})" style="width:calc(58px * var(--pic) / 2 + 29px);height:calc(58px * var(--pic) / 2 + 29px);border-radius:50%;background:var(--bg);border:2px solid #D0CDE8;display:flex;align-items:center;justify-content:center;font-size:calc(1.9em * var(--pic));cursor:pointer">${f}</div>`
      ).join('')}
    </div>`
});

export const { init, render, dispose, actions, scoring, chrome, instruction,
               getFactor, setFactor } = test;
