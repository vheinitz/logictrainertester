/**
 * Zahlenfolge rückwärts – adaptiver Merkspannen-Test.
 *
 * Nicht aus der KABC-II
 * ─────────────────────
 * „Zahlen nachsprechen" der KABC-II geht nur vorwärts. Die Rückwärtsspanne
 * stammt aus der Wechsler-Reihe (HAWIK/WISC, „Zahlen nachsprechen rückwärts")
 * und ist hier bewusst als eigenes Modul geführt und nicht als Variante des
 * KABC-Subtests ausgegeben – sie misst etwas anderes.
 *
 * Vorwärts ist reines Behalten: die Reihe wird gespeichert und wieder
 * ausgegeben. Rückwärts muss dieselbe Reihe zusätzlich im Kopf umgedreht
 * werden, während sie gehalten wird. Das ist Arbeitsgedächtnis im engeren
 * Sinn: Speichern und gleichzeitiges Verarbeiten. Ein Kind, das vorwärts
 * altersgemäß liegt und rückwärts deutlich abfällt, hat kein
 * Gedächtnisproblem, sondern eines mit dem Hantieren im Kopf – und das führt
 * zu anderen Übungen.
 *
 * Warum dieses Modul überhaupt entstanden ist: die Richtwerttabelle für die
 * Rückwärtsspanne lag seit Langem in core/norms.js, ohne dass ein Modul sie
 * je gefüllt hätte. Ein Richtwert ohne Messung nützt niemandem.
 *
 * Erst ab fünf Jahren: darunter herrscht Bodeneffekt. Die meisten Vierjährigen
 * verstehen die Umkehrung noch nicht zuverlässig, und eine 0 sagt dort nichts
 * über die Kapazität aus (siehe die Begründung an der Tabelle in norms.js).
 *
 * Höchstens Stufe 8: die Rückwärtsspanne liegt rund zwei Stellen unter der
 * Vorwärtsspanne, der Richtwert erreicht mit achtzehn Jahren 4,8. Eine Leiter
 * bis 10 hätte oben nur unerreichbare Sprossen.
 */
import { createSpanTest } from '../core/adaptive.js';
import { removeHint, bildPx } from '../core/shell.js';
import { shuffle, color } from '../core/html.js';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const bg = n => (n === 0 ? '#94A3B8' : color(n - 1));

/** Zeile aus farbigen Zahlenkreisen – für Zeigephase und Lösung. */
function row(items, rohSize) {
  const size = bildPx(rohSize);
  return `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    ${items.map(n =>
      `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg(n)};color:#fff;display:flex;align-items:center;justify-content:center;font-size:${size * 0.5}px;font-weight:800">${n}</div>`
    ).join('')}
  </div>`;
}

const test = createSpanTest({
  id: 'seq-zahlen-rueckwaerts',
  minN: 2,
  maxN: 8,
  levelCap: 8,
  factor: 2,
  instruction: {
    de: 'Es erscheinen Zahlen, eine nach der anderen. Merke sie dir – und tippe sie danach RÜCKWÄRTS an: die letzte zuerst.',
    ru: 'Появляются числа, одно за другим. Запомни их — и потом нажми их В ОБРАТНОМ ПОРЯДКЕ: последнее первым.',
    en: 'Numbers appear one after another. Remember them – then tap them BACKWARDS: the last one first.'
  },

  genItems: (level) => shuffle(DIGITS).slice(0, Math.min(level, DIGITS.length)),

  /**
   * Richtig ist die umgekehrte Reihe.
   *
   * Die Prüfung steckt hier und nicht in der Ablauf-Engine: für die Engine
   * ist „gezeigte Reihe" und „erwartete Antwort" dasselbe, und das gilt bei
   * genau diesem Modul nicht.
   */
  equals: (antwort, folge) =>
    antwort.length === folge.length &&
    antwort.every((x, i) => x === folge[folge.length - 1 - i]),

  renderShow: (gd) => row(gd.sequence, 58),

  // Gezeigt wird bei einem Fehler, was richtig gewesen wäre – also die
  // umgedrehte Reihe. Die Originalreihe noch einmal zu zeigen wäre für ein
  // Kind die falsche Auskunft.
  renderSolution: (gd) => row(gd.sequence.slice().reverse(), 40),

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

export const { init, render, dispose, actions, scoring, chrome, instruction,
               getFactor, setFactor } = test;
