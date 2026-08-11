/**
 * Zaubertrick nachmachen – Tutor-Modul
 *
 * Ein Trick wird vorgeführt, das Kind macht ihn nach. Gefragt sind
 * sequentielles Gedächtnis und Handlungsplanung: die Schritte müssen in der
 * richtigen Reihenfolge und vollständig kommen, sonst funktioniert der Trick
 * sichtbar nicht – eine Rückmeldung, die das Kind selbst bemerkt.
 */
import { createTutorModule } from '../core/tutor.js';

const TRICKS = [
  {
    level: 1,
    title: 'Der wandernde Daumen',
    material: 'nur die eigenen Hände',
    instruction: 'Der Daumen scheint abzugehen und wieder anzuwachsen.',
    steps: [
      'Linken Daumen anwinkeln, Zeigefinger der rechten Hand daneben legen.',
      'Rechte Hand darüberschieben, sodass der Übergang verdeckt ist.',
      'Rechte Hand nach rechts ziehen – der „Daumen" wandert mit.',
      'Zurückschieben und beide Hände öffnen.'
    ],
    note: 'Vier Schritte, keine Hilfsmittel – guter Einstieg.'
  },
  {
    level: 2,
    title: 'Die verschwundene Münze',
    material: 'eine Münze, ein Tuch',
    instruction: 'Eine Münze verschwindet unter einem Tuch.',
    steps: [
      'Münze offen auf die flache Hand legen und zeigen.',
      'Tuch darüberlegen und dabei die Münze in die andere Hand gleiten lassen.',
      'Kurz warten, damit alle auf das Tuch schauen.',
      'Tuch wegziehen – die Hand ist leer.',
      'Münze aus der Hosentasche „wiederfinden".'
    ]
  },
  {
    level: 3,
    title: 'Die vorhergesagte Karte',
    material: 'ein Kartenspiel, ein Zettel',
    instruction: 'Die gezogene Karte steht vorher schon auf einem Zettel.',
    steps: [
      'Vorher heimlich die unterste Karte ansehen und aufschreiben.',
      'Zettel verdeckt auf den Tisch legen.',
      'Kartenspiel abheben lassen und die untere Hälfte oben aufsetzen.',
      'Die Karte an der Schnittstelle ziehen lassen – es ist die gemerkte.',
      'Zettel umdrehen.'
    ],
    note: 'Fünf Schritte, einer davon muss vorbereitet werden – Planung im Voraus.'
  },
  {
    level: 4,
    title: 'Der schwebende Becher',
    material: 'ein Becher, ein Tuch, ein Stift',
    instruction: 'Ein Becher scheint frei zu schweben.',
    steps: [
      'Stift unbemerkt hinter dem Becher festhalten.',
      'Tuch über Becher und Hand legen.',
      'Becher am Stift langsam anheben.',
      'Kurz halten, dabei die Finger sichtbar bewegen.',
      'Wieder absenken, Tuch abnehmen und Stift wegstecken.'
    ]
  },
  {
    level: 5,
    title: 'Die Gedankenzahl',
    material: 'Papier und Stift',
    instruction: 'Eine gedachte Zahl wird erraten – über eine Rechenkette.',
    steps: [
      'Zahl zwischen 1 und 10 denken lassen.',
      'Verdoppeln lassen.',
      '8 dazuzählen lassen.',
      'Halbieren lassen.',
      'Die ursprüngliche Zahl abziehen lassen.',
      'Das Ergebnis ist immer 4 – laut „erraten".'
    ],
    note: 'Sechs Schritte in fester Reihenfolge. Das Kind soll den Trick anschließend selbst anleiten – erst dann zeigt sich, ob die Folge wirklich sitzt.'
  }
];

const game = createTutorModule({
  id: 'plan-zaubertricks',
  minLevel: 1,
  maxLevel: TRICKS.length,
  startLevel: 1,

  genTask: (gd) => {
    const t = TRICKS[Math.min(gd.level, TRICKS.length) - 1];
    return {
      title: `${t.title} (${t.steps.length} Schritte)`,
      instruction: t.instruction + ' Führen Sie ihn einmal vollständig vor, ohne die Schritte zu erklären. Danach macht das Kind ihn nach.',
      material: t.material,
      steps: t.steps,
      note: t.note || 'Beim Nachmachen nicht soufflieren – Auslassungen sind das eigentliche Ergebnis.'
    };
  },

  observe: [
    'Kommen alle Schritte vor?',
    'Stimmt die Reihenfolge?',
    'Wird der verdeckende Schritt verstanden oder nur die sichtbare Bewegung kopiert?',
    'Kann das Kind den Trick danach jemand anderem erklären?'
  ]
});

export const { init, render, dispose, actions, scoring } = game;
