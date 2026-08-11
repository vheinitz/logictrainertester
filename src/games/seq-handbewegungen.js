/**
 * Händchen-Folge – adaptiver Merkspannen-Test
 * (KABC-II: „Handbewegungen", hier bildschirmtauglich als Handzeichen-Folge)
 *
 * Statt Faust/Handkante/Handfläche vorzumachen, zeigt das Programm eine Folge
 * von Handzeichen. Das Kind tippt sie in derselben Reihenfolge nach.
 * Es gibt nur 6 Zeichen, Wiederholungen sind daher erlaubt – wie beim
 * Original, wo dieselbe Bewegung mehrfach vorkommen darf.
 */
import { createSpanTest } from '../core/adaptive.js';
import { randInt, color, jsArg } from '../core/html.js';

const SIGNS = [
  { key: 'faust',  emoji: '✊', name: 'Faust' },
  { key: 'flach',  emoji: '✋', name: 'Flache Hand' },
  { key: 'kante',  emoji: '🤚', name: 'Handkante' },
  { key: 'sieg',   emoji: '✌️', name: 'Zwei Finger' },
  { key: 'ok',     emoji: '👌', name: 'OK' },
  { key: 'daumen', emoji: '👍', name: 'Daumen hoch' }
];

const byKey = k => SIGNS.find(s => s.key === k) || SIGNS[0];

/** Zeile aus Handzeichen-Kacheln – für Zeigephase und Lösung. */
function row(items, size) {
  return `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    ${items.map((k, i) =>
      `<div style="width:${size}px;height:${size}px;border-radius:16px;background:${color(i)};display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.55)}px">${byKey(k).emoji}</div>`
    ).join('')}
  </div>`;
}

const test = createSpanTest({
  id: 'seq-handbewegungen',
  minN: 2,
  maxN: 8,
  scoreMap: { 2: 0, 3: 25, 4: 45, 5: 65, 6: 85, 7: 100, 8: 125 },
  bonus: 150,
  factor: 2,
  labelOf: k => byKey(k).emoji,
  instruction: 'Es erscheinen Handzeichen. Merke sie dir – und tippe sie danach ' +
               'in derselben Reihenfolge an.',

  // Kein direktes Wiederholen desselben Zeichens – sonst verschwimmt die Folge
  genItems: (level) => {
    const out = [];
    while (out.length < level) {
      const s = SIGNS[randInt(0, SIGNS.length - 1)].key;
      if (out.length && out[out.length - 1] === s) continue;
      out.push(s);
    }
    return out;
  },

  renderShow: (gd) => row(gd.sequence, 64),
  renderSolution: (gd) => row(gd.sequence, 42),

  renderAnswer: (gd, ctx) => `
    <div style="display:flex;gap:10px;min-height:50px;align-items:center;justify-content:center;margin:0 0 22px;flex-wrap:wrap">
      ${ctx.selected.map((k, i) =>
        `<div class="pick-target" onclick="G('remove',${i})" title="Zurücknehmen" style="width:48px;height:48px;border-radius:14px;background:${color(i)};display:flex;align-items:center;justify-content:center;font-size:1.6em;cursor:pointer">${byKey(k).emoji}</div>`
      ).join('')}
      ${Array(ctx.slotsLeft).fill(0).map(() =>
        `<div style="width:48px;height:48px;border-radius:14px;border:2px dashed #D8D4EE"></div>`
      ).join('')}
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:300px;margin:0 auto">
      ${SIGNS.map(s =>
        `<div class="pick-target" onclick="G('pick',${jsArg(s.key)})" title="${s.name}" style="width:66px;height:66px;border-radius:16px;background:var(--bg);border:2px solid #D0CDE8;display:flex;align-items:center;justify-content:center;font-size:2.1em;cursor:pointer">${s.emoji}</div>`
      ).join('')}
    </div>`
});

export const { init, render, dispose, actions, scoring, chrome, instruction,
               getFactor, setFactor } = test;
