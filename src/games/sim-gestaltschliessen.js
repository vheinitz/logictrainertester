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
import { sample, shuffle } from '../core/html.js';

const PICTURES = [
  { emoji: '🐘', name: 'Elefant' }, { emoji: '🚲', name: 'Fahrrad' },
  { emoji: '🌳', name: 'Baum' },    { emoji: '🏠', name: 'Haus' },
  { emoji: '⛵', name: 'Segelboot' },{ emoji: '🦋', name: 'Schmetterling' },
  { emoji: '🍓', name: 'Erdbeere' }, { emoji: '🐢', name: 'Schildkröte' },
  { emoji: '🎸', name: 'Gitarre' },  { emoji: '☂️', name: 'Regenschirm' },
  { emoji: '🚂', name: 'Lokomotive' },{ emoji: '🐧', name: 'Pinguin' },
  { emoji: '🌻', name: 'Sonnenblume' },{ emoji: '⌛', name: 'Sanduhr' },
  { emoji: '🪁', name: 'Drachen' },  { emoji: '🦒', name: 'Giraffe' },
  { emoji: '🍄', name: 'Pilz' },     { emoji: '🔑', name: 'Schlüssel' },
  { emoji: '🧦', name: 'Socke' },    { emoji: '🥁', name: 'Trommel' }
];

const GRID = 6;   // 6×6 Kacheln über dem Bild

const game = createChoiceGame({
  id: 'sim-gestaltschliessen',
  minLevel: 1,
  maxLevel: 6,
  startLevel: 2,

  genRound: (gd) => {
    const target = PICTURES[Math.floor(Math.random() * PICTURES.length)];
    const distractors = sample(PICTURES.filter(p => p.name !== target.name), 3);
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

    return {
      prompt: `<div style="text-align:center">
        <p style="font-size:1.05em;margin-bottom:10px">🧐 <b>Was ist das?</b></p>
        <div style="position:relative;width:200px;height:200px;margin:0 auto 14px;background:var(--card-bg);border-radius:14px;overflow:hidden">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:9em;line-height:1">${target.emoji}</div>
          <div style="position:absolute;inset:0;display:grid;grid-template-columns:repeat(${GRID},1fr);grid-template-rows:repeat(${GRID},1fr)">${tiles}</div>
        </div>
      </div>`,
      options: choices.map(p => ({ html: p.name, label: p.name })),
      correct: choices.findIndex(p => p.name === target.name),
      layout: 'list',
      explain: `Es war ${target.emoji} – ${target.name}.`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
