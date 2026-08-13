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
import { shuffle, pick, sample, randInt } from '../core/html.js';

const UI = {
  frage: { de: '🔲 Was kommt als Nächstes?', ru: '🔲 Что дальше?', en: '🔲 What comes next?' },
  erklär: { de: 'Das Muster wiederholt sich:', ru: 'Узор повторяется:', en: 'The pattern repeats:' }
};

/**
 * Muster werden erzeugt, nicht aufgezählt.
 *
 * Vorher standen sechzehn Muster fest im Code – drei bis vier je Stufe. Ein
 * Durchgang hat zehn Aufgaben, also sah man dieselbe Reihe mehrfach, und
 * beim zweiten Mal erinnert man sich an die Antwort, statt das Muster zu
 * erkennen. Eine Liste zu verlängern hilft nur bis zur nächsten Beschwerde:
 * jede feste Liste ist irgendwann durchgespielt.
 *
 * Die Struktur eines Musters (ABAB, AABB, ABC …) ist von den verwendeten
 * Symbolen unabhängig. Aus einer Handvoll Bauformen und einem Vorrat an
 * Symbolgruppen entstehen dadurch hunderte Aufgaben je Stufe.
 */

/**
 * Symbolgruppen. Innerhalb einer Gruppe passen die Symbole zusammen, damit
 * ein Muster nicht aus Apfel, Auto und Dreieck besteht – das lenkt vom
 * Muster ab, um das es geht.
 */
const GRUPPEN = [
  ['🔴','🔵','🟢','🟡','🟠','🟣'],
  ['🟥','🟦','🟩','🟨','🟧','🟪'],
  ['⭐','🌙','☀️','☁️','⚡','🌈'],
  ['🐕','🐈','🐇','🐘','🦊','🐼'],
  ['🍎','🍌','🍇','🍊','🍓','🍐'],
  ['🚗','🚌','🚲','🚂','✈️','🚀'],
  ['🌱','🌿','🌳','🌵','🍀','🌸'],
  ['🔺','🔷','⬛','⬜','🔶','🔸'],
  ['😀','😢','😴','😡','😍','😎'],
  ['⚽','🏀','🎾','🏈','🏐','⚾']
];

/**
 * Bauformen je Stufe. `bau` bekommt die gewählten Symbole und liefert die
 * gezeigte Reihe samt der richtigen Fortsetzung.
 *
 * Die Anzahl der benötigten Symbole steht dabei, damit die Auswahl nicht
 * raten muss.
 */
const FORMEN = {
  1: [
    { n: 2, name: 'ABAB', bau: ([a, b]) => ({ seq: [a, b, a, b], next: a }) },
    { n: 2, name: 'AABB', bau: ([a, b]) => ({ seq: [a, a, b, b], next: a }) },
    { n: 2, name: 'AAB',  bau: ([a, b]) => ({ seq: [a, a, b, a], next: a }) }
  ],
  2: [
    { n: 2, name: 'AABAB',  bau: ([a, b]) => ({ seq: [a, a, b, a, a], next: b }) },
    { n: 2, name: 'ABBA',   bau: ([a, b]) => ({ seq: [a, b, b, a, a], next: b }) },
    { n: 3, name: 'ABAC',   bau: ([a, b, c]) => ({ seq: [a, b, a, c, a], next: b }) }
  ],
  3: [
    { n: 3, name: 'ABC',    bau: ([a, b, c]) => ({ seq: [a, b, c, a], next: b }) },
    { n: 3, name: 'ABCC',   bau: ([a, b, c]) => ({ seq: [a, b, c, c, a], next: b }) },
    { n: 3, name: 'AABBCC', bau: ([a, b, c]) => ({ seq: [a, a, b, b, c], next: c }) }
  ],
  4: [
    { n: 4, name: 'ABCD',   bau: ([a, b, c, d]) => ({ seq: [a, b, c, d, a], next: b }) },
    { n: 3, name: 'ABACBA', bau: ([a, b, c]) => ({ seq: [a, b, a, c, b], next: a }) },
    { n: 3, name: 'wachsend', bau: ([a, b, c]) => ({ seq: [a, b, b, c, c, c], next: c }) }
  ],
  5: [
    { n: 4, name: 'ABCDCB', bau: ([a, b, c, d]) => ({ seq: [a, b, c, d, c], next: b }) },
    { n: 3, name: 'Spiegel', bau: ([a, b, c]) => ({ seq: [a, b, c, c, b], next: a }) },
    { n: 4, name: 'ABBCCC', bau: ([a, b, c, d]) => ({ seq: [a, b, b, c, c, c], next: d === a ? b : d }) }
  ]
};

/**
 * Zahlenreihen ab Stufe 4 – dieselbe Aufgabe, aber ohne Symbole. Sie
 * kommen zusätzlich zu den Bauformen dazu, nicht statt ihrer.
 */
function zahlenreihe(level) {
  const start = randInt(1, level >= 5 ? 12 : 6);
  const arten = level >= 5
    ? [
        { schritt: s => s * 2, name: 'verdoppeln' },
        { schritt: s => s * 3, name: 'verdreifachen' },
        { d: randInt(3, 9), name: 'plus' }
      ]
    : [
        { d: randInt(1, 5), name: 'plus' },
        { d: randInt(2, 6), name: 'plus' }
      ];
  const art = arten[randInt(0, arten.length - 1)];
  const seq = [start];
  for (let i = 0; i < 3; i++) {
    seq.push(art.schritt ? art.schritt(seq[seq.length - 1]) : seq[seq.length - 1] + art.d);
  }
  const next = art.schritt ? art.schritt(seq[seq.length - 1]) : seq[seq.length - 1] + art.d;
  // Ablenker: typische Fehler – ein Schritt zu wenig, zu viel, falsche Rechnung
  const falsch = new Set([next + 1, next - 1, next + (art.d || 2),
                          seq[seq.length - 1] + 1].filter(x => x > 0 && x !== next));
  return {
    seq: seq.map(String),
    next: String(next),
    opts: [...falsch].slice(0, 3).map(String)
  };
}

/** Ein Muster für die gewünschte Stufe würfeln. */
function genPattern(level) {
  const stufe = Math.max(1, Math.min(5, level));

  // Ab Stufe 4 gelegentlich eine Zahlenreihe statt einer Symbolreihe
  if (stufe >= 4 && Math.random() < 0.4) return zahlenreihe(stufe);

  const formen = FORMEN[stufe];
  const form = formen[randInt(0, formen.length - 1)];
  const gruppe = GRUPPEN[randInt(0, GRUPPEN.length - 1)];
  const symbole = sample(gruppe, form.n);
  const { seq, next } = form.bau(symbole);

  // Ablenker aus derselben Gruppe: andere Symbole der Reihe zuerst, dann
  // unbenutzte. Ein Ablenker aus einer fremden Gruppe wäre zu leicht zu
  // erkennen, ohne das Muster verstanden zu haben.
  const inReihe = [...new Set(seq)].filter(x => x !== next);
  const rest = gruppe.filter(x => !seq.includes(x) && x !== next);
  const opts = [...inReihe, ...sample(rest, 3)].slice(0, 3);
  return { seq, next, opts };
}


const game = createChoiceGame({
  id: 'plan-muster',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 1,

  // Keine Aufgabe zweimal im selben Durchgang – beim zweiten Mal misst
  // sie die Erinnerung an die vorige Antwort, nicht die Fähigkeit.
  roundKey: r => r._key,

  genRound: (gd) => {
    const p = genPattern(gd.level);
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
      _key: p.seq.join('') + '>' + p.next,
      correct: choices.indexOf(p.next),
      columns: 4,
      explain: `${pick(UI.erklär)} ${p.seq.join(' ')} → ${p.next}`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
