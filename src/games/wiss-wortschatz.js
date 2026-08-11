/**
 * Wortschatz-Quiz – rezeptiver Wortschatz
 * (KABC-II: „Wortschatz")
 *
 * Ein Wort wird genannt, das passende Bild soll angetippt werden. Rezeptiv
 * statt produktiv, weil das ohne Mikrofon und ohne Erwachsenen am Gerät
 * funktioniert.
 *
 * Die Wörter sind nach Häufigkeit gestaffelt: Niveau 1 Alltagsgegenstände,
 * Niveau 5 seltenere Begriffe. Die Ablenker stammen aus derselben Stufe,
 * damit nicht schon das Vertrautheitsgefälle die Lösung verrät.
 */
import { createChoiceGame } from '../core/choice.js';
import { sample, shuffle } from '../core/html.js';

const WORDS = [
  // tier 1 – ganz alltäglich
  { w: 'der Apfel', e: '🍎', t: 1 }, { w: 'der Hund', e: '🐕', t: 1 },
  { w: 'das Auto', e: '🚗', t: 1 }, { w: 'der Ball', e: '⚽', t: 1 },
  { w: 'das Haus', e: '🏠', t: 1 }, { w: 'die Katze', e: '🐈', t: 1 },
  { w: 'der Baum', e: '🌳', t: 1 }, { w: 'die Blume', e: '🌸', t: 1 },
  { w: 'das Buch', e: '📕', t: 1 }, { w: 'der Schuh', e: '👟', t: 1 },
  // tier 2
  { w: 'der Löffel', e: '🥄', t: 2 }, { w: 'die Schere', e: '✂️', t: 2 },
  { w: 'der Schlüssel', e: '🔑', t: 2 }, { w: 'die Kerze', e: '🕯️', t: 2 },
  { w: 'der Regenschirm', e: '☂️', t: 2 }, { w: 'die Brücke', e: '🌉', t: 2 },
  { w: 'der Koffer', e: '🧳', t: 2 }, { w: 'die Leiter', e: '🪜', t: 2 },
  { w: 'das Zelt', e: '⛺', t: 2 }, { w: 'der Anker', e: '⚓', t: 2 },
  // tier 3
  { w: 'der Kompass', e: '🧭', t: 3 }, { w: 'das Mikroskop', e: '🔬', t: 3 },
  { w: 'der Leuchtturm', e: '🗼', t: 3 }, { w: 'die Sanduhr', e: '⌛', t: 3 },
  { w: 'das Fernrohr', e: '🔭', t: 3 }, { w: 'der Amboss', e: '🪨', t: 3 },
  { w: 'die Harfe', e: '🪕', t: 3 }, { w: 'das Zahnrad', e: '⚙️', t: 3 },
  { w: 'der Magnet', e: '🧲', t: 3 }, { w: 'die Waage', e: '⚖️', t: 3 },
  // tier 4 – Tiere, die man benennen können sollte
  { w: 'das Gürteltier', e: '🦔', t: 4 }, { w: 'der Reiher', e: '🦩', t: 4 },
  { w: 'das Faultier', e: '🦥', t: 4 }, { w: 'der Dachs', e: '🦡', t: 4 },
  { w: 'das Chamäleon', e: '🦎', t: 4 }, { w: 'der Tintenfisch', e: '🦑', t: 4 },
  { w: 'das Nashorn', e: '🦏', t: 4 }, { w: 'der Skorpion', e: '🦂', t: 4 },
  { w: 'das Stachelschwein', e: '🦔', t: 4 }, { w: 'der Waschbär', e: '🦝', t: 4 }
];

const game = createChoiceGame({
  id: 'wiss-wortschatz',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 1,

  genRound: (gd) => {
    const tier = Math.min(4, Math.ceil(gd.level * 0.9));
    const pool = WORDS.filter(x => x.t === tier);
    const usable = pool.length >= 4 ? pool : WORDS;
    const target = usable[Math.floor(Math.random() * usable.length)];
    const optionCount = gd.level >= 4 ? 5 : 4;
    const distractors = sample(usable.filter(x => x.e !== target.e), optionCount - 1);
    const choices = shuffle([target, ...distractors]);

    return {
      prompt: `<div style="text-align:center">
        <p style="font-size:.95em;color:var(--text-light)">Zeig mir …</p>
        <p style="font-size:1.6em;font-weight:800;margin:6px 0 14px">${target.w}</p>
      </div>`,
      options: choices.map(x => ({ html: x.e, label: x.w })),
      correct: choices.findIndex(x => x.e === target.e && x.w === target.w),
      columns: Math.min(choices.length, 5),
      explain: `${target.e} ist ${target.w}.`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
