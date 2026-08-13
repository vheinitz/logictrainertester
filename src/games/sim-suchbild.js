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
  { a: '🥚', b: '🪺', hint: { de: 'Ei und Nest', ru: 'яйцо и гнездо', en: 'egg and nest' } },

  // ── mittel ──
  { a: '🌛', b: '🌜', hint: { de: 'Mond nach links und nach rechts', ru: 'месяц влево и вправо', en: 'moon facing left and right' } },
  { a: '🐢', b: '🐊', hint: { de: 'Schildkröte und Krokodil', ru: 'черепаха и крокодил', en: 'turtle and crocodile' } },
  { a: '🍋', b: '🍈', hint: { de: 'Zitrone und Melone', ru: 'лимон и дыня', en: 'lemon and melon' } },
  { a: '🎾', b: '🏀', hint: { de: 'Tennisball und Basketball', ru: 'теннисный и баскетбольный мяч', en: 'tennis ball and basketball' } },
  { a: '🐟', b: '🐠', hint: { de: 'grauer und bunter Fisch', ru: 'серая и пёстрая рыба', en: 'grey and colourful fish' } },
  { a: '🌻', b: '🌼', hint: { de: 'Sonnenblume und Gänseblümchen', ru: 'подсолнух и ромашка', en: 'sunflower and daisy' } },
  { a: '🚲', b: '🛵', hint: { de: 'Fahrrad und Roller', ru: 'велосипед и мотороллер', en: 'bicycle and scooter' } },
  { a: '☁️', b: '⛅', hint: { de: 'Wolke mit und ohne Sonne', ru: 'облако с солнцем и без', en: 'cloud with and without sun' } },
  { a: '🌵', b: '🌴', hint: { de: 'Kaktus und Palme', ru: 'кактус и пальма', en: 'cactus and palm tree' } },
  { a: '🐮', b: '🐷', hint: { de: 'Kuh und Schwein', ru: 'корова и свинья', en: 'cow and pig' } },

  // ── sehr ähnlich ──
  { a: '🔺', b: '🔻', hint: { de: 'Dreieck nach oben und nach unten', ru: 'треугольник вверх и вниз', en: 'triangle pointing up and down' } },
  { a: '🔶', b: '🔸', hint: { de: 'große und kleine Raute', ru: 'большой и маленький ромб', en: 'large and small diamond' } },
  { a: '🐇', b: '🐁', hint: { de: 'Hase und Maus', ru: 'заяц и мышь', en: 'hare and mouse' } },
  { a: '🥔', b: '🥥', hint: { de: 'Kartoffel und Kokosnuss', ru: 'картофель и кокос', en: 'potato and coconut' } },
  { a: '😊', b: '😌', hint: { de: 'lächelndes und zufriedenes Gesicht', ru: 'улыбающееся и довольное лицо', en: 'smiling and content face' } },
  { a: '🍐', b: '🍏', hint: { de: 'Birne und grüner Apfel', ru: 'груша и зелёное яблоко', en: 'pear and green apple' } },
  { a: '🟠', b: '🟡', hint: { de: 'oranger und gelber Kreis', ru: 'оранжевый и жёлтый круг', en: 'orange and yellow circle' } },
  { a: '😐', b: '😑', hint: { de: 'Gesicht mit offenen und geschlossenen Augen', ru: 'лицо с открытыми и закрытыми глазами', en: 'face with open and closed eyes' } },
  { a: '🌗', b: '🌘', hint: { de: 'Halbmond und schmale Sichel', ru: 'полумесяц и узкий серп', en: 'half moon and thin crescent' } },
  { a: '🕐', b: '🕑', hint: { de: 'ein Uhr und zwei Uhr', ru: 'час и два часа', en: 'one o clock and two o clock' } },
  { a: '🟦', b: '🟪', hint: { de: 'blaues und violettes Quadrat', ru: 'синий и фиолетовый квадрат', en: 'blue and purple square' } },
  { a: '▪️', b: '◾', hint: { de: 'kleines und etwas größeres Quadrat', ru: 'маленький и чуть больший квадрат', en: 'small and slightly larger square' } }
];

/** Höchste Stufe – zugleich Bezug für das Fenster über die Paarliste. */
const MAX_LEVEL = 6;

const game = createChoiceGame({
  id: 'sim-suchbild',
  minLevel: 1,
  maxLevel: MAX_LEVEL,
  startLevel: 1,

  // Keine Aufgabe zweimal im selben Durchgang – beim zweiten Mal misst
  // sie die Erinnerung an die vorige Antwort, nicht die Fähigkeit.
  roundKey: r => r._key,

  genRound: (gd) => {
    const L = gd.level;
    const cols = Math.min(3 + Math.floor(L / 2), 6);
    const rows = Math.min(3 + Math.floor((L - 1) / 2), 6);
    const n = cols * rows;

    // Das Fenster wandert mit dem Niveau über die nach Schwierigkeit
    // sortierte Liste: Stufe 1 nimmt die leicht unterscheidbaren Paare vorne,
    // die höchste Stufe die ähnlichsten hinten.
    //
    // Vorher war das Fenster an eine feste Zahl gekoppelt (3 + Niveau) und
    // endete bei Index 8 – neue Paare am Listenende wurden nie erreicht.
    const spanne = Math.min(8, PAIRS.length);
    const maxStart = Math.max(0, PAIRS.length - spanne);
    const start = MAX_LEVEL > 1
      ? Math.round((Math.min(L, MAX_LEVEL) - 1) / (MAX_LEVEL - 1) * maxStart)
      : 0;
    const pair = PAIRS[randInt(start, start + spanne - 1)];
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
      // Die Lage des abweichenden Feldes gehört in die Kennung: dasselbe
      // Paar an anderer Stelle ist eine andere Suchaufgabe.
      _key: `${pair.a}/${pair.b}@${oddIdx}`,
      options,
      correct: oddIdx,
      columns: cols,
      explain: `${pick(UI.gesucht)} ${pair.b} ${pick(UI.zwischen)} ${pair.a} (${pick(pair.hint)}).`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
