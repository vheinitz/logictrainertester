/**
 * Suchbild-Vergleich – systematisches Absuchen
 *
 * Ein Raster gleicher Bilder, genau eines weicht ab. Gefragt ist nicht
 * Schnelligkeit im Erkennen eines auffälligen Reizes, sondern systematisches
 * Absuchen: die Abweichung wird mit steigendem Niveau ähnlicher und das
 * Raster größer.
 */
import { createChoiceGame } from '../core/choice.js';
import { randInt } from '../core/html.js';

/** Paare von Bildern, die sich mit steigendem Index immer stärker ähneln. */
const PAIRS = [
  { a: '🍎', b: '🍏', hint: 'roter und grüner Apfel' },
  { a: '🐶', b: '🐺', hint: 'Hund und Wolf' },
  { a: '🌕', b: '🌖', hint: 'Vollmond und abnehmender Mond' },
  { a: '😀', b: '😃', hint: 'zwei ähnliche Smileys' },
  { a: '🔵', b: '🔷', hint: 'Kreis und Raute' },
  { a: '⭐', b: '🌟', hint: 'Stern mit und ohne Funkeln' },
  { a: '🌲', b: '🌳', hint: 'Nadelbaum und Laubbaum' },
  { a: '🚗', b: '🚙', hint: 'zwei Autos' },
  { a: '✋', b: '🤚', hint: 'zwei Handflächen' },
  { a: '🥚', b: '🪺', hint: 'Ei und Nest' }
];

const game = createChoiceGame({
  id: 'sim-suchbild',
  minLevel: 1,
  maxLevel: 6,
  startLevel: 1,

  genRound: (gd) => {
    const L = gd.level;
    const cols = Math.min(3 + Math.floor(L / 2), 6);
    const rows = Math.min(3 + Math.floor((L - 1) / 2), 6);
    const n = cols * rows;

    // Bei höherem Niveau die ähnlicheren Paare bevorzugen
    const maxPair = Math.min(PAIRS.length, 3 + L);
    const pair = PAIRS[randInt(Math.max(0, maxPair - 4), maxPair - 1)];
    const oddIdx = randInt(0, n - 1);

    const options = [...Array(n).keys()].map(i => ({
      html: i === oddIdx ? pair.b : pair.a,
      label: `Feld ${i + 1}`
    }));

    return {
      prompt: `<div style="text-align:center">
        <p style="font-size:1.05em">🔍 <b>Ein Bild ist anders als die übrigen.</b></p>
        <p style="font-size:.85em;color:var(--text-light);margin-bottom:6px">Tippe es an.</p>
      </div>`,
      options,
      correct: oddIdx,
      columns: cols,
      explain: `Gesucht war ${pair.b} zwischen lauter ${pair.a} (${pair.hint}).`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
