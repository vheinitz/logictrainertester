/**
 * Muster fortsetzen – visuelle Mustererkennung
 * (KABC-II: „Muster ergänzen")
 *
 * Migriert auf core/choice.js. Inhaltlich eine Änderung: die Antwortoptionen
 * werden gemischt. Vorher stand die richtige Lösung in 11 von 12 Mustern an
 * erster Stelle – wer das bemerkt, löst die Aufgabe ohne hinzusehen.
 *
 * Zusätzlich sind längere Musterperioden dazugekommen (ABC-, AABB- und
 * Wachstumsmuster), damit es oberhalb von ABAB überhaupt eine Steigerung gibt.
 */
import { createChoiceGame } from '../core/choice.js';
import { shuffle, pick } from '../core/html.js';

const UI = {
  frage: { de: '🔲 Was kommt als Nächstes?', ru: '🔲 Что дальше?', en: '🔲 What comes next?' },
  erklär: { de: 'Das Muster wiederholt sich:', ru: 'Узор повторяется:', en: 'The pattern repeats:' }
};

const PATTERNS = [
  // Niveau 1 – ABAB
  { t: 1, seq: ['🔴','🔵','🔴','🔵'], next: '🔴', opts: ['🔵','🟢','🟡'] },
  { t: 1, seq: ['🌞','🌙','🌞','🌙'], next: '🌞', opts: ['🌙','⭐','☁️'] },
  { t: 1, seq: ['🐕','🐈','🐕','🐈'], next: '🐕', opts: ['🐈','🐇','🐘'] },
  { t: 1, seq: ['❄️','☀️','❄️','☀️'], next: '❄️', opts: ['☀️','🌧️','🌈'] },
  // Niveau 2 – AABB / AAB
  { t: 2, seq: ['🍎','🍎','🍌','🍎'], next: '🍎', opts: ['🍌','🍇','🍊'] },
  { t: 2, seq: ['🔺','🔺','⬛','🔺'], next: '🔺', opts: ['⬛','🔵','🔷'] },
  { t: 2, seq: ['🟥','🟥','🟦','🟦'], next: '🟥', opts: ['🟦','🟨','🟪'] },
  // Niveau 3 – ABC
  { t: 3, seq: ['🟥','🟦','🟩','🟥'], next: '🟦', opts: ['🟩','🟨','🟪'] },
  { t: 3, seq: ['🌱','🌿','🌳','🌱'], next: '🌿', opts: ['🌳','🍀','🌵'] },
  { t: 3, seq: ['🚗','🚌','🚲','🚗'], next: '🚌', opts: ['🚲','✈️','🚂'] },
  // Niveau 4 – Zahlen und Schrittweiten
  { t: 4, seq: ['1','2','3','4'], next: '5', opts: ['3','4','6'] },
  { t: 4, seq: ['2','4','6','8'], next: '10', opts: ['9','11','12'] },
  { t: 4, seq: ['1','3','5','7'], next: '9', opts: ['8','10','11'] },
  // Niveau 5 – ABBA / wachsende Gruppen
  { t: 5, seq: ['⭐','🌟','🌟','⭐'], next: '🌟', opts: ['⭐','💫','✨'] },
  { t: 5, seq: ['🔵','🔵','🔴','🔵','🔵','🔵'], next: '🔴', opts: ['🔵','🟢','🟡'] },
  { t: 5, seq: ['1','2','4','8'], next: '16', opts: ['10','12','14'] }
];

const game = createChoiceGame({
  id: 'plan-muster',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 1,

  genRound: (gd) => {
    const pool = PATTERNS.filter(p => p.t === gd.level);
    const p = (pool.length ? pool : PATTERNS)[Math.floor(Math.random() * (pool.length || PATTERNS.length))];
    const choices = shuffle([p.next, ...p.opts]);

    return {
      prompt: `<div style="text-align:center">
        <p style="font-size:1.15em"><b>${pick(UI.frage)}</b></p>
        <div style="display:flex;gap:8px;justify-content:center;align-items:center;margin:20px 0;flex-wrap:wrap">
          ${p.seq.map(s => `<div style="width:54px;height:54px;border-radius:var(--radius-sm);background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:1.9em;font-weight:700">${s}</div>`).join('')}
          <div style="font-size:1.5em;color:var(--text-light)">→</div>
          <div style="width:54px;height:54px;border-radius:var(--radius-sm);border:2px dashed var(--gold);display:flex;align-items:center;justify-content:center;font-size:1.9em">❓</div>
        </div>
      </div>`,
      options: choices.map(o => ({ html: o, label: o })),
      correct: choices.indexOf(p.next),
      columns: 4,
      explain: `${pick(UI.erklär)} ${p.seq.join(' ')} → ${p.next}`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
