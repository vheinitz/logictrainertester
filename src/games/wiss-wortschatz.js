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
import { sample, shuffle, pick } from '../core/html.js';

const UI = {
  zeig: { de: 'Zeig mir …', ru: 'Покажи …', en: 'Show me …' },
  ist:  { de: 'ist', ru: '– это', en: 'is' }
};

const WORDS = [
  // tier 1 – ganz alltäglich
  { w: { de: 'der Apfel', ru: 'яблоко', en: 'the apple' }, e: '🍎', t: 1 },
  { w: { de: 'der Hund', ru: 'собака', en: 'the dog' }, e: '🐕', t: 1 },
  { w: { de: 'das Auto', ru: 'машина', en: 'the car' }, e: '🚗', t: 1 },
  { w: { de: 'der Ball', ru: 'мяч', en: 'the ball' }, e: '⚽', t: 1 },
  { w: { de: 'das Haus', ru: 'дом', en: 'the house' }, e: '🏠', t: 1 },
  { w: { de: 'die Katze', ru: 'кошка', en: 'the cat' }, e: '🐈', t: 1 },
  { w: { de: 'der Baum', ru: 'дерево', en: 'the tree' }, e: '🌳', t: 1 },
  { w: { de: 'die Blume', ru: 'цветок', en: 'the flower' }, e: '🌸', t: 1 },
  { w: { de: 'das Buch', ru: 'книга', en: 'the book' }, e: '📕', t: 1 },
  { w: { de: 'der Schuh', ru: 'ботинок', en: 'the shoe' }, e: '👟', t: 1 },
  // tier 2
  { w: { de: 'der Löffel', ru: 'ложка', en: 'the spoon' }, e: '🥄', t: 2 },
  { w: { de: 'die Schere', ru: 'ножницы', en: 'the scissors' }, e: '✂️', t: 2 },
  { w: { de: 'der Schlüssel', ru: 'ключ', en: 'the key' }, e: '🔑', t: 2 },
  { w: { de: 'die Kerze', ru: 'свеча', en: 'the candle' }, e: '🕯️', t: 2 },
  { w: { de: 'der Regenschirm', ru: 'зонт', en: 'the umbrella' }, e: '☂️', t: 2 },
  { w: { de: 'die Brücke', ru: 'мост', en: 'the bridge' }, e: '🌉', t: 2 },
  { w: { de: 'der Koffer', ru: 'чемодан', en: 'the suitcase' }, e: '🧳', t: 2 },
  { w: { de: 'die Leiter', ru: 'лестница', en: 'the ladder' }, e: '🪜', t: 2 },
  { w: { de: 'das Zelt', ru: 'палатка', en: 'the tent' }, e: '⛺', t: 2 },
  { w: { de: 'der Anker', ru: 'якорь', en: 'the anchor' }, e: '⚓', t: 2 },
  // tier 3
  { w: { de: 'der Kompass', ru: 'компас', en: 'the compass' }, e: '🧭', t: 3 },
  { w: { de: 'das Mikroskop', ru: 'микроскоп', en: 'the microscope' }, e: '🔬', t: 3 },
  { w: { de: 'der Leuchtturm', ru: 'маяк', en: 'the lighthouse' }, e: '🗼', t: 3 },
  { w: { de: 'die Sanduhr', ru: 'песочные часы', en: 'the hourglass' }, e: '⌛', t: 3 },
  { w: { de: 'das Fernrohr', ru: 'подзорная труба', en: 'the telescope' }, e: '🔭', t: 3 },
  { w: { de: 'der Amboss', ru: 'наковальня', en: 'the anvil' }, e: '🪨', t: 3 },
  { w: { de: 'die Harfe', ru: 'арфа', en: 'the harp' }, e: '🪕', t: 3 },
  { w: { de: 'das Zahnrad', ru: 'шестерня', en: 'the gear' }, e: '⚙️', t: 3 },
  { w: { de: 'der Magnet', ru: 'магнит', en: 'the magnet' }, e: '🧲', t: 3 },
  { w: { de: 'die Waage', ru: 'весы', en: 'the scale' }, e: '⚖️', t: 3 },
  // tier 4 – Tiere, die man benennen können sollte
  { w: { de: 'das Gürteltier', ru: 'броненосец', en: 'the armadillo' }, e: '🦔', t: 4 },
  { w: { de: 'der Reiher', ru: 'цапля', en: 'the heron' }, e: '🦩', t: 4 },
  { w: { de: 'das Faultier', ru: 'ленивец', en: 'the sloth' }, e: '🦥', t: 4 },
  { w: { de: 'der Dachs', ru: 'барсук', en: 'the badger' }, e: '🦡', t: 4 },
  { w: { de: 'das Chamäleon', ru: 'хамелеон', en: 'the chameleon' }, e: '🦎', t: 4 },
  { w: { de: 'der Tintenfisch', ru: 'осьминог', en: 'the octopus' }, e: '🦑', t: 4 },
  { w: { de: 'das Nashorn', ru: 'носорог', en: 'the rhinoceros' }, e: '🦏', t: 4 },
  { w: { de: 'der Skorpion', ru: 'скорпион', en: 'the scorpion' }, e: '🦂', t: 4 },
  { w: { de: 'das Stachelschwein', ru: 'дикобраз', en: 'the porcupine' }, e: '🦔', t: 4 },
  { w: { de: 'der Waschbär', ru: 'енот', en: 'the raccoon' }, e: '🦝', t: 4 }
];

const game = createChoiceGame({
  id: 'wiss-wortschatz',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 1,

  // Ein Wort erkennt man oder nicht. Wer das Bild nach fünf Sekunden nicht
  // gefunden hat, findet es auch nach dreißig nicht – die übrige Zeit wäre
  // Leerlauf, in dem die Aufmerksamkeit wegdriftet.
  answerSeconds: 5,

  // Kein Wort zweimal im selben Durchgang: beim zweiten Mal misst die Frage
  // die Erinnerung an die vorige Antwort, nicht den Wortschatz.
  roundKey: r => r.zielWort,

  genRound: (gd) => {
    const tier = Math.min(4, Math.ceil(gd.level * 0.9));
    const pool = WORDS.filter(x => x.t === tier);
    const usable = pool.length >= 4 ? pool : WORDS;
    const target = usable[Math.floor(Math.random() * usable.length)];
    const optionCount = gd.level >= 4 ? 5 : 4;
    const distractors = sample(usable.filter(x => x.e !== target.e), optionCount - 1);
    const choices = shuffle([target, ...distractors]);

    const w = pick(target.w);
    return {
      // Kennung für die Wiederholungssperre – der deutsche Eintrag, damit
      // sie beim Sprachwechsel dieselbe Aufgabe erkennt.
      zielWort: target.w.de,
      prompt: `<div style="text-align:center">
        <p style="font-size:.95em;color:var(--text-light)">${pick(UI.zeig)}</p>
        <p style="font-size:1.6em;font-weight:800;margin:6px 0 14px">${w}</p>
      </div>`,
      options: choices.map(x => ({ html: x.e, label: pick(x.w) })),
      correct: choices.findIndex(x => x.e === target.e && x.w.de === target.w.de),
      columns: Math.min(choices.length, 5),
      explain: `${target.e} ${pick(UI.ist)} ${w}.`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
