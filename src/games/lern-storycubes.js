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
import { sample, randInt, pick } from '../core/html.js';

const FACES = [
  '🏰','🐉','🚀','🌊','🔑','👑','🐈','🌙','⛵','🎁',
  '🌋','🕯️','🦉','🎪','🧭','🪄','🐝','🍄','🚂','🗝️',
  '👻','🎻','🏔️','🦕','🌻','🧊','🪁','🐢'
];

const UI = {
  wuerfel: { de: 'Würfel', ru: 'кубиков', en: 'dice' },
  zusatz:  { de: 'mit Zusatzregel', ru: 'с дополнительным правилом', en: 'with an extra rule' },
  zusatzregel: { de: 'Zusatzregel', ru: 'Дополнительное правило', en: 'Extra rule' },
  ausklang: { de: 'Am Ende nachfragen: „Und wie ging es aus?"', ru: 'В конце спросить: «И чем всё закончилось?»', en: 'At the end ask: "And how did it end?"' }
};

const TWISTS = [
  { de: 'Die Geschichte muss die Bilder in genau dieser Reihenfolge verwenden.',
    ru: 'В истории картинки должны идти именно в этом порядке.',
    en: 'The story must use the pictures in exactly this order.' },
  { de: 'In der Geschichte muss jemand vorkommen, der Angst hat.',
    ru: 'В истории должен быть кто-то, кто боится.',
    en: 'The story must include someone who is afraid.' },
  { de: 'Die Geschichte muss gut ausgehen – obwohl zwischendurch etwas schiefgeht.',
    ru: 'История должна хорошо закончиться – хотя по пути что-то идёт не так.',
    en: 'The story must end well – even though something goes wrong along the way.' },
  { de: 'Die Geschichte darf nur an einem einzigen Ort spielen.',
    ru: 'История должна происходить в одном-единственном месте.',
    en: 'The story may only take place in one single location.' },
  { de: 'Am Ende muss erklärt sein, warum das erste Bild wichtig war.',
    ru: 'В конце должно быть объяснено, почему первая картинка была важна.',
    en: 'At the end it must be explained why the first picture mattered.' }
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
      title: `${count} ${pick(UI.wuerfel)}${twist ? ` – ${pick(UI.zusatz)}` : ''}`,
      instruction: {
        de: 'Zeigen Sie dem Kind die Bilder und lassen Sie daraus eine zusammenhängende Geschichte erzählen. Alle Bilder müssen vorkommen.',
        ru: 'Покажите ребёнку картинки и попросите рассказать связную историю. Все картинки должны быть использованы.',
        en: 'Show the child the pictures and have them tell a connected story from them. All pictures must appear.'
      },
      material: `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px">
        ${dice.map(d => `<div style="width:calc(64px * var(--pic) / 2 + 32px);height:calc(64px * var(--pic) / 2 + 32px);border-radius:14px;background:#fff;border:2px solid #D0CDE8;box-shadow:var(--shadow);display:flex;align-items:center;justify-content:center;font-size:calc(2.1em * var(--pic))">${d}</div>`).join('')}
      </div>`,
      steps: [
        { de: 'Bilder gemeinsam anschauen und benennen lassen – das ist noch nicht die Geschichte.',
          ru: 'Вместе рассмотреть картинки и назвать их – это ещё не история.',
          en: 'Look at the pictures together and name them – this is not yet the story.' },
        { de: 'Kurz überlegen lassen (etwa eine halbe Minute), ohne Vorschläge zu machen.',
          ru: 'Дать немного подумать (примерно полминуты), не подсказывая.',
          en: 'Let them think briefly (about half a minute) without making suggestions.' },
        { de: 'Erzählen lassen, ohne zu unterbrechen.',
          ru: 'Дать рассказывать, не перебивая.',
          en: 'Let them tell it without interrupting.' },
        twist ? { de: `<b>Zusatzregel:</b> ${twist.de}`,
                  ru: `<b>Дополнительное правило:</b> ${twist.ru}`,
                  en: `<b>Extra rule:</b> ${twist.en}` }
              : { ...UI.ausklang }
      ].filter(Boolean),
      note: {
        de: 'Nicht die Fantasie bewerten, sondern den Zusammenhang: Werden die Bilder verknüpft oder nur nacheinander aufgezählt?',
        ru: 'Оценивайте не фантазию, а связность: картинки связаны или просто перечисляются одна за другой?',
        en: 'Do not judge the imagination but the connection: are the pictures linked or merely listed one after another?'
      }
    };
  },

  observe: [
    { de: 'Entsteht ein Zusammenhang oder eine Aufzählung („und dann … und dann …")?',
      ru: 'Возникает связь или просто перечисление («и потом… и потом…»)?',
      en: 'Does a connection emerge or just a list ("and then … and then …")?' },
    { de: 'Kommen alle Bilder vor?',
      ru: 'Все ли картинки использованы?',
      en: 'Do all the pictures appear?' },
    { de: 'Gibt es einen Anfang, eine Verwicklung und einen Schluss?',
      ru: 'Есть ли начало, развитие и конец?',
      en: 'Is there a beginning, a complication and an ending?' },
    { de: 'Wird frei erzählt oder nur auf Nachfragen geantwortet?',
      ru: 'Рассказывает свободно или только отвечает на вопросы?',
      en: 'Does the child tell freely or only answer questions?' }
  ]
});

export const { init, render, dispose, actions, scoring } = game;
