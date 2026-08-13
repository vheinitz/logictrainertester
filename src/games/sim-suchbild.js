/**
 * Suchbild-Vergleich – systematisches Absuchen
 *
 * Ein Raster gleicher Bilder, genau eines weicht ab. Gefragt ist nicht
 * Schnelligkeit im Erkennen eines auffälligen Reizes, sondern systematisches
 * Absuchen: die Abweichung wird mit steigendem Niveau ähnlicher und das
 * Raster größer.
 */
import { createChoiceGame } from '../core/choice.js';
import { randInt, pick } from '../core/html.js';

const UI = {
  frage: { de: '🔍 Ein Bild ist anders als die übrigen.', ru: '🔍 Одна картинка отличается от остальных.', en: '🔍 One picture is different from the rest.' },
  tipp:  { de: 'Tippe es an.', ru: 'Нажми на неё.', en: 'Tap it.' },
  gesucht: { de: 'Gesucht war', ru: 'Искомое', en: 'The answer was' },
  zwischen: { de: 'zwischen lauter', ru: 'среди множества', en: 'among many' },
  feld:  { de: 'Feld', ru: 'Поле', en: 'Field' }
};

/** Paare von Bildern, die sich mit steigendem Index immer stärker ähneln. */
const PAIRS = [
  { a: '🍎', b: '🍏', hint: { de: 'roter und grüner Apfel', ru: 'красное и зелёное яблоко', en: 'red and green apple' } },
  { a: '🐶', b: '🐺', hint: { de: 'Hund und Wolf', ru: 'собака и волк', en: 'dog and wolf' } },
  { a: '🌕', b: '🌖', hint: { de: 'Vollmond und abnehmender Mond', ru: 'полная и убывающая луна', en: 'full moon and waning moon' } },
  { a: '😀', b: '😃', hint: { de: 'zwei ähnliche Smileys', ru: 'два похожих смайлика', en: 'two similar smileys' } },
  { a: '🔵', b: '🔷', hint: { de: 'Kreis und Raute', ru: 'круг и ромб', en: 'circle and diamond' } },
  { a: '⭐', b: '🌟', hint: { de: 'Stern mit und ohne Funkeln', ru: 'звезда с сиянием и без', en: 'star with and without sparkle' } },
  { a: '🌲', b: '🌳', hint: { de: 'Nadelbaum und Laubbaum', ru: 'хвойное и лиственное дерево', en: 'conifer and deciduous tree' } },
  { a: '🚗', b: '🚙', hint: { de: 'zwei Autos', ru: 'две машины', en: 'two cars' } },
  { a: '✋', b: '🤚', hint: { de: 'zwei Handflächen', ru: 'две ладони', en: 'two palms' } },
  { a: '🥚', b: '🪺', hint: { de: 'Ei und Nest', ru: 'яйцо и гнездо', en: 'egg and nest' } }
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

    const feld = pick(UI.feld);
    const options = [...Array(n).keys()].map(i => ({
      html: i === oddIdx ? pair.b : pair.a,
      label: `${feld} ${i + 1}`
    }));

    return {
      prompt: `<div style="text-align:center">
        <p style="font-size:1.05em">${pick(UI.frage)}</p>
        <p style="font-size:.85em;color:var(--text-light);margin-bottom:6px">${pick(UI.tipp)}</p>
      </div>`,
      options,
      correct: oddIdx,
      columns: cols,
      explain: `${pick(UI.gesucht)} ${pair.b} ${pick(UI.zwischen)} ${pair.a} (${pick(pair.hint)}).`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
