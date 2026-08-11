/**
 * Zahlenfolgen – adaptiver Merkspannen-Test (KABC-II: „Zahlen nachsprechen")
 *
 * Der Spielbildschirm zeigt ausschließlich Zahlen, den Ablaufbalken und den
 * Beenden-Knopf. Die Anleitung steht einmal auf dem Startbildschirm, das
 * Ergebnis am Ende – dazwischen nichts, was ablenkt.
 *
 * Bewertung: N=2:0% 3:20% 4:30% 5:50% 6:75% 7:90% 8:100% 9:120% 10:130%
 * Es gibt genau 10 verschiedene Ziffern, also ist Niveau 10 das Maximum –
 * der 150%-Bonus der Score-Map ist hier bauartbedingt nicht erreichbar.
 */
import { createSpanTest } from '../core/adaptive.js';
import { shuffle, color } from '../core/html.js';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const bg = n => (n === 0 ? '#94A3B8' : color(n - 1));

/** Zeile aus farbigen Zahlenkreisen – für Zeigephase und Lösung. */
function row(items, size) {
  return `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    ${items.map(n =>
      `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg(n)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:${size * 0.5}px;font-weight:800">${n}</div>`
    ).join('')}
  </div>`;
}

const test = createSpanTest({
  id: 'seq-zahlenfolgen',
  minN: 2,
  maxN: 10,
  levelCap: 10,          // mehr als 10 verschiedene Ziffern gibt es nicht
  factor: 2,
  instruction: 'Es erscheinen Zahlen, eine nach der anderen. Merke sie dir – ' +
               'und tippe sie danach in derselben Reihenfolge an.',

  genItems: (level) => shuffle(DIGITS).slice(0, Math.min(level, DIGITS.length)),

  renderShow: (gd) => row(gd.sequence, 58),
  renderSolution: (gd) => row(gd.sequence, 40),

  renderAnswer: (gd, ctx) => `
    <div style="display:flex;gap:10px;min-height:52px;align-items:center;justify-content:center;margin:0 0 22px;flex-wrap:wrap">
      ${ctx.selected.map((n, i) =>
        `<div class="pick-target" onclick="G('remove',${i})" title="Zurücknehmen" style="width:46px;height:46px;border-radius:50%;background:${bg(n)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.25em;font-weight:800;cursor:pointer">${n}</div>`
      ).join('')}
      ${Array(ctx.slotsLeft).fill(0).map(() =>
        `<div style="width:46px;height:46px;border-radius:50%;border:2px dashed #D8D4EE"></div>`
      ).join('')}
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;max-width:380px;margin:0 auto">
      ${DIGITS.map(n =>
        `<div class="pick-target" onclick="G('pick',${n})" style="width:56px;height:56px;border-radius:50%;background:${bg(n)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.4em;font-weight:700;cursor:pointer">${n}</div>`
      ).join('')}
    </div>`
});

export const { init, render, dispose, actions, scoring, chrome, instruction,
               getFactor, setFactor } = test;
