/**
 * Geschichten-Würfel – Tutor-/Kreativmodul
 *
 * Das Programm würfelt Bilder, das Kind erzählt daraus eine Geschichte.
 * Bewertet wird von der Begleitperson, denn eine automatische Bewertung von
 * Erzählfähigkeit wäre hier reine Behauptung.
 *
 * Niveau steuert die Anzahl der Würfel und ob eine Zusatzbedingung gilt
 * (Reihenfolge einhalten, bestimmte Figur einbauen).
 */
import { createTutorModule } from '../core/tutor.js';
import { sample, randInt } from '../core/html.js';

const FACES = [
  '🏰','🐉','🚀','🌊','🔑','👑','🐈','🌙','⛵','🎁',
  '🌋','🕯️','🦉','🎪','🧭','🪄','🐝','🍄','🚂','🗝️',
  '👻','🎻','🏔️','🦕','🌻','🧊','🪁','🐢'
];

const TWISTS = [
  'Die Geschichte muss die Bilder in genau dieser Reihenfolge verwenden.',
  'In der Geschichte muss jemand vorkommen, der Angst hat.',
  'Die Geschichte muss gut ausgehen – obwohl zwischendurch etwas schiefgeht.',
  'Die Geschichte darf nur an einem einzigen Ort spielen.',
  'Am Ende muss erklärt sein, warum das erste Bild wichtig war.'
];

const game = createTutorModule({
  id: 'lern-storycubes',
  minLevel: 1,
  maxLevel: 6,
  startLevel: 2,

  genTask: (gd) => {
    const count = Math.min(2 + gd.level, 7);
    const dice = sample(FACES, count);
    const twist = gd.level >= 3 ? TWISTS[randInt(0, TWISTS.length - 1)] : null;

    return {
      title: `${count} Würfel${twist ? ' – mit Zusatzregel' : ''}`,
      instruction: 'Zeigen Sie dem Kind die Bilder und lassen Sie daraus eine zusammenhängende Geschichte erzählen. Alle Bilder müssen vorkommen.',
      material: `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
        ${dice.map(d => `<div style="width:64px;height:64px;border-radius:14px;background:#fff;border:2px solid #D0CDE8;box-shadow:var(--shadow);display:flex;align-items:center;justify-content:center;font-size:2.1em">${d}</div>`).join('')}
      </div>`,
      steps: [
        'Bilder gemeinsam anschauen und benennen lassen – das ist noch nicht die Geschichte.',
        'Kurz überlegen lassen (etwa eine halbe Minute), ohne Vorschläge zu machen.',
        'Erzählen lassen, ohne zu unterbrechen.',
        twist ? `<b>Zusatzregel:</b> ${twist}` : 'Am Ende nachfragen: „Und wie ging es aus?"'
      ].filter(Boolean),
      note: 'Nicht die Fantasie bewerten, sondern den Zusammenhang: Werden die Bilder verknüpft oder nur nacheinander aufgezählt?'
    };
  },

  observe: [
    'Entsteht ein Zusammenhang oder eine Aufzählung („und dann … und dann …")?',
    'Kommen alle Bilder vor?',
    'Gibt es einen Anfang, eine Verwicklung und einen Schluss?',
    'Wird frei erzählt oder nur auf Nachfragen geantwortet?'
  ]
});

export const { init, render, dispose, actions, scoring } = game;
