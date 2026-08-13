/**
 * Was ist das? – Gestaltschließen
 * (KABC-II: „Gestaltschließen")
 *
 * Ein Bild wird nur teilweise gezeigt; der Rest ist von Kacheln verdeckt.
 * Das Kind soll aus den Bruchstücken das Ganze erkennen – die „Fähigkeit zur
 * mentalen Vervollständigung".
 *
 * Niveau steuert, wie viel sichtbar bleibt: Niveau 1 zeigt gut die Hälfte,
 * Niveau 6 nur noch einzelne Ausschnitte.
 */
import { createChoiceGame } from '../core/choice.js';
import { sample, shuffle, pick } from '../core/html.js';

const UI = {
  frage: { de: '🧐 Was ist das?', ru: '🧐 Что это?', en: '🧐 What is this?' },
  war:   { de: 'Es war', ru: 'Это было', en: 'It was' }
};

const PICTURES = [
  { emoji: '🐘', name: { de: 'Elefant', ru: 'Слон', en: 'Elephant' } },
  { emoji: '🚲', name: { de: 'Fahrrad', ru: 'Велосипед', en: 'Bicycle' } },
  { emoji: '🌳', name: { de: 'Baum', ru: 'Дерево', en: 'Tree' } },
  { emoji: '🏠', name: { de: 'Haus', ru: 'Дом', en: 'House' } },
  { emoji: '⛵', name: { de: 'Segelboot', ru: 'Парусник', en: 'Sailboat' } },
  { emoji: '🦋', name: { de: 'Schmetterling', ru: 'Бабочка', en: 'Butterfly' } },
  { emoji: '🍓', name: { de: 'Erdbeere', ru: 'Клубника', en: 'Strawberry' } },
  { emoji: '🐢', name: { de: 'Schildkröte', ru: 'Черепаха', en: 'Turtle' } },
  { emoji: '🎸', name: { de: 'Gitarre', ru: 'Гитара', en: 'Guitar' } },
  { emoji: '☂️', name: { de: 'Regenschirm', ru: 'Зонт', en: 'Umbrella' } },
  { emoji: '🚂', name: { de: 'Lokomotive', ru: 'Паровоз', en: 'Locomotive' } },
  { emoji: '🐧', name: { de: 'Pinguin', ru: 'Пингвин', en: 'Penguin' } },
  { emoji: '🌻', name: { de: 'Sonnenblume', ru: 'Подсолнух', en: 'Sunflower' } },
  { emoji: '⌛', name: { de: 'Sanduhr', ru: 'Песочные часы', en: 'Hourglass' } },
  { emoji: '🪁', name: { de: 'Drachen', ru: 'Воздушный змей', en: 'Kite' } },
  { emoji: '🦒', name: { de: 'Giraffe', ru: 'Жираф', en: 'Giraffe' } },
  { emoji: '🍄', name: { de: 'Pilz', ru: 'Гриб', en: 'Mushroom' } },
  { emoji: '🔑', name: { de: 'Schlüssel', ru: 'Ключ', en: 'Key' } },
  { emoji: '🧦', name: { de: 'Socke', ru: 'Носок', en: 'Sock' } },
  { emoji: '🥁', name: { de: 'Trommel', ru: 'Барабан', en: 'Drum' } }
];

const GRID = 6;   // 6×6 Kacheln über dem Bild

const game = createChoiceGame({
  id: 'sim-gestaltschliessen',
  minLevel: 1,
  maxLevel: 6,
  startLevel: 2,

  // Keine Aufgabe zweimal im selben Durchgang – beim zweiten Mal misst
  // sie die Erinnerung an die vorige Antwort, nicht die Fähigkeit.
  roundKey: r => r._key,

  genRound: (gd) => {
    const target = PICTURES[Math.floor(Math.random() * PICTURES.length)];
    const distractors = sample(PICTURES.filter(p => p.name.de !== target.name.de), 3);
    const choices = shuffle([target, ...distractors]);

    // Anteil sichtbarer Kacheln: Niveau 1 ≈ 55%, Niveau 6 ≈ 18%
    const visibleRatio = Math.max(0.18, 0.62 - gd.level * 0.075);
    const cellCount = GRID * GRID;
    const openCount = Math.max(3, Math.round(cellCount * visibleRatio));
    const open = new Set(sample([...Array(cellCount).keys()], openCount));

    const tiles = [...Array(cellCount).keys()].map(i =>
      open.has(i) ? '<div></div>'
                  : '<div style="background:var(--card-bg)"></div>'
    ).join('');

    const name = pick(target.name);
    return {
      prompt: `<div style="text-align:center">
        <p style="font-size:1.05em;margin-bottom:10px">${pick(UI.frage)}</p>
        <div style="position:relative;width:200px;height:200px;margin:0 auto 14px;background:var(--card-bg);border-radius:14px;overflow:hidden">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:9em;line-height:1">${target.emoji}</div>
          <div style="position:absolute;inset:0;display:grid;grid-template-columns:repeat(${GRID},1fr);grid-template-rows:repeat(${GRID},1fr)">${tiles}</div>
        </div>
      </div>`,
      options: choices.map(p => ({ html: pick(p.name), label: pick(p.name) })),
      _key: target.name.de,
      correct: choices.findIndex(p => p.name.de === target.name.de),
      layout: 'list',
      explain: `${pick(UI.war)} ${target.emoji} – ${name}.`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
