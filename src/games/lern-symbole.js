/**
 * Symbole merken – Paar-Assoziations-Lernen
 * (KABC-II: „Symbole" / „Symbole Abruf")
 *
 * Erst werden Symbol-Wort-Paare gezeigt, danach wird abgefragt, welches Wort
 * zu einem Symbol gehört. Das ist bewusst kein Merkspannen-Test: geprüft wird
 * nicht, wie viel gleichzeitig gehalten werden kann, sondern ob eine neue,
 * willkürliche Verknüpfung gelernt wurde (assoziative Lernfähigkeit, Glr).
 *
 * Die Ablenker sind die *anderen* gerade gelernten Wörter. Sonst ließe sich
 * die Frage lösen, ohne das Paar gelernt zu haben – man müsste nur erkennen,
 * welches Wort überhaupt vorkam.
 *
 * Niveau steuert die Anzahl der Paare (2–7) und damit die Interferenz.
 */
import { createChoiceGame } from '../core/choice.js';
import { sample, shuffle, color, pick } from '../core/html.js';
import { merken } from '../core/abruf.js';

const UI = {
  merke: { de: '🧠 Merke dir, was zusammengehört!', ru: '🧠 Запомни, что к чему относится!', en: '🧠 Remember what goes together!' },
  frage: { de: '❓ Welches Wort gehört zu diesem Symbol?', ru: '❓ Какое слово относится к этому символу?', en: '❓ Which word belongs to this symbol?' },
  war:   { de: 'gehörte zu', ru: 'относилось к', en: 'belonged to' }
};

const SYMBOLS = ['⭐','🔔','🌙','🍀','⚡','❤️','🔷','🎈','🔥','🌈','🎵','🦋','🌸','🍄','🔑','⛵'];

const WORDS = [
  { de: 'Nase', ru: 'Нос', en: 'Nose' },
  { de: 'Tisch', ru: 'Стол', en: 'Table' },
  { de: 'Wolke', ru: 'Облако', en: 'Cloud' },
  { de: 'Igel', ru: 'Ёж', en: 'Hedgehog' },
  { de: 'Löffel', ru: 'Ложка', en: 'Spoon' },
  { de: 'Fenster', ru: 'Окно', en: 'Window' },
  { de: 'Berg', ru: 'Гора', en: 'Mountain' },
  { de: 'Wiese', ru: 'Луг', en: 'Meadow' },
  { de: 'Pinsel', ru: 'Кисть', en: 'Brush' },
  { de: 'Kissen', ru: 'Подушка', en: 'Pillow' },
  { de: 'Nebel', ru: 'Туман', en: 'Fog' },
  { de: 'Krone', ru: 'Корона', en: 'Crown' },
  { de: 'Anker', ru: 'Якорь', en: 'Anchor' },
  { de: 'Feder', ru: 'Перо', en: 'Feather' },
  { de: 'Trommel', ru: 'Барабан', en: 'Drum' },
  { de: 'Laterne', ru: 'Фонарь', en: 'Lantern' },
  // Acht weitere, damit der Vorrat länger reicht als ein Durchgang: bei
  // sechzehn Wörtern und zehn Runden war fast jedes zweite schon dran.
  { de: 'Brücke', ru: 'Мост', en: 'Bridge' },
  { de: 'Schlüssel', ru: 'Ключ', en: 'Key' },
  { de: 'Muschel', ru: 'Ракушка', en: 'Shell' },
  { de: 'Leiter', ru: 'Лестница', en: 'Ladder' },
  { de: 'Nadel', ru: 'Игла', en: 'Needle' },
  { de: 'Teppich', ru: 'Ковёр', en: 'Carpet' },
  { de: 'Schaukel', ru: 'Качели', en: 'Swing' },
  { de: 'Brunnen', ru: 'Колодец', en: 'Well' }
];

const game = createChoiceGame({
  id: 'lern-symbole',
  minLevel: 2,
  maxLevel: 7,
  startLevel: 3,

  // Keine Aufgabe zweimal im selben Durchgang – beim zweiten Mal misst
  // sie die Erinnerung an die vorige Antwort, nicht die Fähigkeit.
  roundKey: r => r._key,
  upAfter: 3,
  downAfter: 2,

  genRound: (gd) => {
    const n = gd.level;
    const syms = sample(SYMBOLS, n);
    const words = sample(WORDS, n);
    const pairs = syms.map((s, i) => ({ sym: s, word: words[i] }));

    // Für den verzögerten Abruf festhalten, was gezeigt wurde. Der Schlüssel
    // ist das Symbol: dasselbe Symbol darf nicht zweimal abgefragt werden.
    merken('lern-symbole', pairs.map(p => ({ schluessel: p.sym, bild: p.sym, name: pick(p.word) })));

    const target = pairs[Math.floor(Math.random() * pairs.length)];
    const others = pairs.filter(p => p.word.de !== target.word.de).map(p => p.word);
    const extra = sample(WORDS.filter(w => !words.includes(w)), Math.max(0, 3 - others.length));
    const choices = shuffle([target.word, ...sample(others, 3), ...extra].slice(0, 4));

    const word = pick(target.word);
    return {
      study: {
        seconds: Math.round(2.5 * n),
        html: `
          <p style="font-size:1.05em;margin-bottom:10px">${pick(UI.merke)}</p>
          <div style="display:flex;flex-direction:column;gap:8px;align-items:center">
            ${pairs.map((p, i) => `
              <div style="display:flex;align-items:center;gap:12px;background:var(--bg);border-radius:14px;padding:8px 18px;min-width:220px">
                <span style="font-size:calc(1.9em * var(--pic))">${p.sym}</span>
                <span style="width:3px;height:24px;background:${color(i)};border-radius:2px"></span>
                <span style="font-weight:700;font-size:1.05em">${pick(p.word)}</span>
              </div>`).join('')}
          </div>`
      },
      prompt: `<div style="text-align:center">
        <p style="font-size:1.05em">${pick(UI.frage)}</p>
        <div style="font-size:calc(3.4em * var(--pic));margin:12px 0">${target.sym}</div>
      </div>`,
      _key: target.word.de,
      options: choices.map(w => ({ html: pick(w), label: pick(w) })),
      correct: choices.findIndex(w => w.de === target.word.de),
      explain: `${target.sym} ${pick(UI.war)} „${word}".`,
      layout: 'list'
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;

/** Für die Ablenker im Abruf-Modul: alle Wörter in der aktiven Sprache. */
export const WOERTER_VORRAT = () => WORDS.map(w => pick(w));
