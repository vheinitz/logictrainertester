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
import { sample, shuffle, color } from '../core/html.js';

const SYMBOLS = ['⭐','🔔','🌙','🍀','⚡','❤️','🔷','🎈','🔥','🌈','🎵','🦋','🌸','🍄','🔑','⛵'];

const WORDS = [
  'Nase','Tisch','Wolke','Igel','Löffel','Fenster','Berg','Wiese',
  'Pinsel','Kissen','Nebel','Krone','Anker','Feder','Trommel','Laterne'
];

const game = createChoiceGame({
  id: 'lern-symbole',
  minLevel: 2,
  maxLevel: 7,
  startLevel: 3,
  upAfter: 3,
  downAfter: 2,

  genRound: (gd) => {
    const n = gd.level;
    const syms = sample(SYMBOLS, n);
    const words = sample(WORDS, n);
    const pairs = syms.map((s, i) => ({ sym: s, word: words[i] }));

    const target = pairs[Math.floor(Math.random() * pairs.length)];
    const others = pairs.filter(p => p.word !== target.word).map(p => p.word);
    const extra = sample(WORDS.filter(w => !words.includes(w)), Math.max(0, 3 - others.length));
    const choices = shuffle([target.word, ...sample(others, 3), ...extra].slice(0, 4));

    return {
      study: {
        seconds: Math.round(2.5 * n),
        html: `
          <p style="font-size:1.05em;margin-bottom:10px">🧠 <b>Merke dir, was zusammengehört!</b></p>
          <div style="display:flex;flex-direction:column;gap:8px;align-items:center">
            ${pairs.map((p, i) => `
              <div style="display:flex;align-items:center;gap:12px;background:var(--bg);border-radius:14px;padding:8px 18px;min-width:220px">
                <span style="font-size:1.9em">${p.sym}</span>
                <span style="width:3px;height:24px;background:${color(i)};border-radius:2px"></span>
                <span style="font-weight:700;font-size:1.05em">${p.word}</span>
              </div>`).join('')}
          </div>`
      },
      prompt: `<div style="text-align:center">
        <p style="font-size:1.05em">❓ <b>Welches Wort gehört zu diesem Symbol?</b></p>
        <div style="font-size:3.4em;margin:12px 0">${target.sym}</div>
      </div>`,
      options: choices.map(w => ({ html: w, label: w })),
      correct: choices.indexOf(target.word),
      explain: `${target.sym} gehörte zu „${target.word}".`,
      layout: 'list'
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
