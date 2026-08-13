/**
 * Atlantis: Fisch-Namen – Paar-Assoziations-Lernen mit Interferenz
 * (KABC-II: „Atlantis" / „Atlantis Abruf")
 *
 * Fantasienamen für Fische, Pflanzen und Muscheln lernen und wiedererkennen.
 * Die Namen sind bewusst erfunden: gemessen werden soll die Lernfähigkeit für
 * Neues, nicht vorhandenes Vokabular. Deshalb taugt hier auch kein
 * Wortschatz-Vorteil – anders als bei den Wissens-Modulen.
 *
 * Ablauf: Lernphase mit N Paaren, danach Abfrage. Die falschen Antworten sind
 * die anderen gerade gelernten Namen, sonst wäre die Aufgabe durch bloßes
 * Wiedererkennen lösbar.
 */
import { createChoiceGame } from '../core/choice.js';
import { sample, shuffle, color, pick } from '../core/html.js';

const UI = {
  intro: { de: '🌊 Willkommen in Atlantis!', ru: '🌊 Добро пожаловать в Атлантиду!', en: '🌊 Welcome to Atlantis!' },
  merke: { de: 'Merke dir, wie die Bewohner heißen.', ru: 'Запомни, как зовут жителей.', en: 'Remember what the inhabitants are called.' },
  frage: { de: '❓ Wie heißt dieser Bewohner?', ru: '❓ Как зовут этого жителя?', en: '❓ What is this inhabitant called?' },
  heisst:{ de: 'heißt', ru: 'зовут', en: 'is called' }
};

const CREATURES = [
  { e: '🐠', k: 'Fisch' }, { e: '🐟', k: 'Fisch' }, { e: '🐡', k: 'Fisch' },
  { e: '🦈', k: 'Fisch' }, { e: '🐙', k: 'Tier' },  { e: '🦑', k: 'Tier' },
  { e: '🦐', k: 'Tier' },  { e: '🦀', k: 'Tier' },  { e: '🐚', k: 'Muschel' },
  { e: '🪸', k: 'Pflanze' },{ e: '🌿', k: 'Pflanze' },{ e: '🍀', k: 'Pflanze' },
  { e: '🐳', k: 'Tier' },  { e: '🐬', k: 'Tier' },  { e: '🐢', k: 'Tier' },
  { e: '⭐', k: 'Seestern' }
];

/** Aussprechbare Fantasienamen – zwei Silben, klar unterscheidbar. */
const NAMES = [
  'Malu','Tirok','Wesa','Panux','Fimbo','Larik','Nodel','Suvi',
  'Gorbi','Ketal','Ziru','Hamsi','Bolek','Nuria','Trask','Ovin',
  'Perlu','Yando','Kimsa','Delor'
];

const game = createChoiceGame({
  id: 'lern-atlantis',
  minLevel: 2,
  maxLevel: 6,
  startLevel: 2,
  upAfter: 3,
  downAfter: 2,

  genRound: (gd) => {
    const n = gd.level;
    const creatures = sample(CREATURES, n);
    const names = sample(NAMES, n);
    const pairs = creatures.map((c, i) => ({ ...c, name: names[i] }));

    const target = pairs[Math.floor(Math.random() * pairs.length)];
    const others = pairs.filter(p => p.name !== target.name).map(p => p.name);
    const extra = sample(NAMES.filter(x => !names.includes(x)), Math.max(0, 3 - others.length));
    const choices = shuffle([target.name, ...sample(others, 3), ...extra].slice(0, 4));

    return {
      study: {
        seconds: Math.round(3 * n),
        html: `
          <p style="font-size:1.05em;margin-bottom:4px">${pick(UI.intro)}</p>
          <p style="font-size:.88em;color:var(--text-light);margin-bottom:12px">${pick(UI.merke)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
            ${pairs.map((p, i) => `
              <div style="display:flex;flex-direction:column;align-items:center;background:var(--bg);border-radius:14px;padding:10px 14px;min-width:96px;border-bottom:3px solid ${color(i)}">
                <span style="font-size:2.2em">${p.e}</span>
                <span style="font-weight:800;font-size:1.02em;margin-top:2px">${p.name}</span>
              </div>`).join('')}
          </div>`
      },
      prompt: `<div style="text-align:center">
        <p style="font-size:1.05em">${pick(UI.frage)}</p>
        <div style="font-size:3.6em;margin:10px 0">${target.e}</div>
      </div>`,
      options: choices.map(x => ({ html: x, label: x })),
      correct: choices.indexOf(target.name),
      layout: 'list',
      explain: `${target.e} ${pick(UI.heisst)} ${target.name}.`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
