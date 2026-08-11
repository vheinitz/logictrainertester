/**
 * Was passt nicht? – Klassifikation und Fokussierung auf relevante Merkmale
 * (KABC-II: „Konzeptbildung")
 *
 * Migriert auf core/choice.js. Zwei inhaltliche Änderungen gegenüber der
 * ersten Fassung: die Bilder werden gemischt (vorher lag der Ausreißer in 11
 * von 12 Sets an letzter Stelle) und es gibt Sets mit mehreren möglichen
 * Sortierlogiken für die höheren Niveaus.
 */
import { createChoiceGame } from '../core/choice.js';
import { shuffle } from '../core/html.js';

const SETS = [
  { t: 1, items: ['🐕','🐈','🐇','🐘','🐟'], odd: '🐟',
    de: 'Der Fisch 🐟 lebt im Wasser – die anderen an Land',
    ru: 'Рыба 🐟 живёт в воде – остальные на суше' },
  { t: 1, items: ['🍎','🍌','🍇','🍞','🍊'], odd: '🍞',
    de: 'Das Brot 🍞 ist kein Obst', ru: 'Хлеб 🍞 – не фрукт' },
  { t: 1, items: ['🚗','🚌','🏍️','🚲','✈️'], odd: '✈️',
    de: 'Das Flugzeug ✈️ fliegt – die anderen fahren', ru: 'Самолёт ✈️ летает – остальные ездят' },
  { t: 1, items: ['👚','👖','🧥','👗','🍔'], odd: '🍔',
    de: 'Der Burger 🍔 ist keine Kleidung', ru: 'Бургер 🍔 – не одежда' },
  { t: 2, items: ['🔴','🔵','🟢','⬛','🔺'], odd: '🔺',
    de: 'Das Dreieck 🔺 ist eine Form, keine Farbe', ru: 'Треугольник 🔺 – форма, а не цвет' },
  { t: 2, items: ['👁️','👂','👃','👄','🦶'], odd: '🦶',
    de: 'Der Fuß 🦶 ist kein Sinnesorgan im Kopf', ru: 'Ступня 🦶 – не орган чувств на голове' },
  { t: 2, items: ['🎸','🥁','🎹','🎺','📕'], odd: '📕',
    de: 'Das Buch 📕 ist kein Musikinstrument', ru: 'Книга 📕 – не музыкальный инструмент' },
  { t: 2, items: ['🥛','☕','🍵','🧃','🧦'], odd: '🧦',
    de: 'Die Socke 🧦 ist kein Getränk', ru: 'Носок 🧦 – не напиток' },
  { t: 3, items: ['🌲','🌿','🌻','🍄','🐍'], odd: '🐍',
    de: 'Die Schlange 🐍 ist ein Tier, keine Pflanze', ru: 'Змея 🐍 – животное, а не растение' },
  { t: 3, items: ['🛏️','🪑','📺','🛁','🍦'], odd: '🍦',
    de: 'Das Eis 🍦 ist kein Möbelstück', ru: 'Мороженое 🍦 – не мебель' },
  { t: 3, items: ['🌞','🌙','⭐','☁️','🐟'], odd: '🐟',
    de: 'Der Fisch 🐟 gehört nicht zum Himmel', ru: 'Рыба 🐟 не относится к небу' },
  { t: 3, items: ['⚽','🏀','🎾','🏈','🍕'], odd: '🍕',
    de: 'Die Pizza 🍕 ist kein Sportgerät', ru: 'Пицца 🍕 – не спортивный предмет' },
  // Ab hier greift die naheliegende Kategorie nicht mehr – man muss das
  // relevante Merkmal erst finden.
  { t: 4, items: ['🐝','🦋','🐞','🕷️','🐜'], odd: '🕷️',
    de: 'Die Spinne 🕷️ hat acht Beine – die anderen sechs (Insekten)',
    ru: 'У паука 🕷️ восемь ног – у остальных шесть' },
  { t: 4, items: ['🚗','🚲','🛴','🛹','⛵'], odd: '⛵',
    de: 'Das Segelboot ⛵ hat keine Räder', ru: 'У парусника ⛵ нет колёс' },
  { t: 4, items: ['🍅','🥒','🌽','🥕','🍓'], odd: '🍓',
    de: 'Die Erdbeere 🍓 ist süß – die anderen isst man im Salat',
    ru: 'Клубника 🍓 сладкая – остальное идёт в салат' },
  { t: 5, items: ['🐋','🦇','🐬','🦅','🐘'], odd: '🦅',
    de: 'Der Adler 🦅 ist ein Vogel – alle anderen sind Säugetiere, auch Wal und Fledermaus',
    ru: 'Орёл 🦅 – птица, остальные млекопитающие' },
  { t: 5, items: ['⌛','⏰','📅','🌡️','⏳'], odd: '🌡️',
    de: 'Das Thermometer 🌡️ misst Wärme – die anderen Zeit',
    ru: 'Термометр 🌡️ измеряет тепло – остальные время' },
  { t: 5, items: ['🔑','🎫','🔐','🗝️','🔨'], odd: '🔨',
    de: 'Der Hammer 🔨 verschafft keinen Zugang – die anderen schon',
    ru: 'Молоток 🔨 не даёт доступа – остальные дают' }
];

const game = createChoiceGame({
  id: 'sim-konzeptbildung',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 1,

  genRound: (gd) => {
    const pool = SETS.filter(s => s.t === gd.level);
    const list = pool.length ? pool : SETS;
    const s = list[Math.floor(Math.random() * list.length)];
    const items = shuffle(s.items);

    return {
      prompt: `<div style="text-align:center">
        <p style="font-size:1.15em"><b>❓ Welches Bild passt NICHT zu den anderen?</b></p>
        <p style="color:var(--text-light);font-size:.9em;margin-bottom:4px">Tippe auf das Bild, das anders ist</p>
      </div>`,
      options: items.map(i => ({ html: i, label: i })),
      correct: items.indexOf(s.odd),
      columns: 5,
      explain: { de: s.de, ru: s.ru }
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
