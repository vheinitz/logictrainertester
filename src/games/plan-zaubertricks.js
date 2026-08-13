/**
 * Zaubertrick nachmachen – Tutor-Modul
 *
 * Ein Trick wird vorgeführt, das Kind macht ihn nach. Gefragt sind
 * sequentielles Gedächtnis und Handlungsplanung: die Schritte müssen in der
 * richtigen Reihenfolge und vollständig kommen, sonst funktioniert der Trick
 * sichtbar nicht – eine Rückmeldung, die das Kind selbst bemerkt.
 */
import { createTutorModule } from '../core/tutor.js';
import { pick } from '../core/html.js';

const UI = {
  schritte: { de: 'Schritte', ru: 'шагов', en: 'steps' },
  fuehren: {
    de: 'Führen Sie ihn einmal vollständig vor, ohne die Schritte zu erklären. Danach macht das Kind ihn nach.',
    ru: 'Покажите его один раз полностью, не объясняя шаги. Потом ребёнок повторяет.',
    en: 'Perform it once in full without explaining the steps. Afterwards the child imitates it.'
  },
  noteFallback: {
    de: 'Beim Nachmachen nicht soufflieren – Auslassungen sind das eigentliche Ergebnis.',
    ru: 'При повторении не подсказывайте – пропуски и есть настоящий результат.',
    en: 'Do not prompt during imitation – omissions are the real result.'
  }
};

const TRICKS = [
  {
    level: 1,
    title: { de: 'Der wandernde Daumen', ru: 'Блуждающий большой палец', en: 'The wandering thumb' },
    material: { de: 'nur die eigenen Hände', ru: 'только собственные руки', en: 'only your own hands' },
    instruction: { de: 'Der Daumen scheint abzugehen und wieder anzuwachsen.',
                   ru: 'Большой палец будто отделяется и снова прирастает.',
                   en: 'The thumb seems to come off and grow back on.' },
    steps: [
      { de: 'Linken Daumen anwinkeln, Zeigefinger der rechten Hand daneben legen.',
        ru: 'Согнуть большой палец левой руки, рядом положить указательный палец правой.',
        en: 'Bend the left thumb, place the right index finger beside it.' },
      { de: 'Rechte Hand darüberschieben, sodass der Übergang verdeckt ist.',
        ru: 'Протянуть правую руку, чтобы скрыть переход.',
        en: 'Slide the right hand over so the join is hidden.' },
      { de: 'Rechte Hand nach rechts ziehen – der „Daumen" wandert mit.',
        ru: 'Потянуть правую руку вправо – «большой палец» движется вместе с ней.',
        en: 'Move the right hand to the right – the "thumb" moves along.' },
      { de: 'Zurückschieben und beide Hände öffnen.',
        ru: 'Вернуть назад и раскрыть обе руки.',
        en: 'Slide back and open both hands.' }
    ],
    note: { de: 'Vier Schritte, keine Hilfsmittel – guter Einstieg.',
            ru: 'Четыре шага, без реквизита – хорошее начало.',
            en: 'Four steps, no props – a good start.' }
  },
  {
    level: 2,
    title: { de: 'Die verschwundene Münze', ru: 'Исчезнувшая монета', en: 'The vanished coin' },
    material: { de: 'eine Münze, ein Tuch', ru: 'монета, платок', en: 'a coin, a cloth' },
    instruction: { de: 'Eine Münze verschwindet unter einem Tuch.',
                   ru: 'Монета исчезает под платком.',
                   en: 'A coin disappears under a cloth.' },
    steps: [
      { de: 'Münze offen auf die flache Hand legen und zeigen.',
        ru: 'Положить монету на ладонь и показать.',
        en: 'Place the coin openly on the flat palm and show it.' },
      { de: 'Tuch darüberlegen und dabei die Münze in die andere Hand gleiten lassen.',
        ru: 'Накрыть платком, незаметно переложив монету в другую руку.',
        en: 'Cover it with the cloth while sliding the coin into the other hand.' },
      { de: 'Kurz warten, damit alle auf das Tuch schauen.',
        ru: 'Немного подождать, чтобы все смотрели на платок.',
        en: 'Wait briefly so everyone looks at the cloth.' },
      { de: 'Tuch wegziehen – die Hand ist leer.',
        ru: 'Снять платок – рука пуста.',
        en: 'Pull the cloth away – the hand is empty.' },
      { de: 'Münze aus der Hosentasche „wiederfinden".',
        ru: '«Найти» монету в кармане.',
        en: '"Find" the coin in the trouser pocket.' }
    ],
    note: { ...UI.noteFallback }
  },
  {
    level: 3,
    title: { de: 'Die vorhergesagte Karte', ru: 'Предсказанная карта', en: 'The predicted card' },
    material: { de: 'ein Kartenspiel, ein Zettel', ru: 'колода карт, листок', en: 'a deck of cards, a slip of paper' },
    instruction: { de: 'Die gezogene Karte steht vorher schon auf einem Zettel.',
                   ru: 'Вытащенная карта заранее записана на листке.',
                   en: 'The drawn card is already on a slip of paper beforehand.' },
    steps: [
      { de: 'Vorher heimlich die unterste Karte ansehen und aufschreiben.',
        ru: 'Заранее тайком посмотреть нижнюю карту и записать.',
        en: 'Secretly look at the bottom card and write it down beforehand.' },
      { de: 'Zettel verdeckt auf den Tisch legen.',
        ru: 'Положить листок на стол надписью вниз.',
        en: 'Place the slip face down on the table.' },
      { de: 'Kartenspiel abheben lassen und die untere Hälfte oben aufsetzen.',
        ru: 'Дать снять колоду и положить нижнюю половину наверх.',
        en: 'Have the deck cut and put the lower half on top.' },
      { de: 'Die Karte an der Schnittstelle ziehen lassen – es ist die gemerkte.',
        ru: 'Дать вытянуть карту в месте среза – это и есть запомненная.',
        en: 'Have the card at the cut drawn – it is the memorised one.' },
      { de: 'Zettel umdrehen.',
        ru: 'Перевернуть листок.',
        en: 'Turn the slip over.' }
    ],
    note: { de: 'Fünf Schritte, einer davon muss vorbereitet werden – Planung im Voraus.',
            ru: 'Пять шагов, один нужно подготовить заранее – планирование наперёд.',
            en: 'Five steps, one of which must be prepared in advance – planning ahead.' }
  },
  {
    level: 4,
    title: { de: 'Der schwebende Becher', ru: 'Парящий стакан', en: 'The floating cup' },
    material: { de: 'ein Becher, ein Tuch, ein Stift', ru: 'стакан, платок, карандаш', en: 'a cup, a cloth, a pen' },
    instruction: { de: 'Ein Becher scheint frei zu schweben.',
                   ru: 'Стакан будто свободно парит.',
                   en: 'A cup seems to float freely.' },
    steps: [
      { de: 'Stift unbemerkt hinter dem Becher festhalten.',
        ru: 'Незаметно держать карандаш за стаканом.',
        en: 'Hold the pen unnoticed behind the cup.' },
      { de: 'Tuch über Becher und Hand legen.',
        ru: 'Накрыть стакан и руку платком.',
        en: 'Lay the cloth over the cup and hand.' },
      { de: 'Becher am Stift langsam anheben.',
        ru: 'Медленно поднять стакан за карандаш.',
        en: 'Slowly lift the cup by the pen.' },
      { de: 'Kurz halten, dabei die Finger sichtbar bewegen.',
        ru: 'Немного подержать, заметно шевеля пальцами.',
        en: 'Hold briefly while visibly moving the fingers.' },
      { de: 'Wieder absenken, Tuch abnehmen und Stift wegstecken.',
        ru: 'Опустить, снять платок и убрать карандаш.',
        en: 'Lower again, remove the cloth and put the pen away.' }
    ],
    note: { ...UI.noteFallback }
  },
  {
    level: 5,
    title: { de: 'Die Gedankenzahl', ru: 'Задуманное число', en: 'The thought-of number' },
    material: { de: 'Papier und Stift', ru: 'бумага и карандаш', en: 'paper and pen' },
    instruction: { de: 'Eine gedachte Zahl wird erraten – über eine Rechenkette.',
                   ru: 'Задуманное число угадывают – через цепочку вычислений.',
                   en: 'A thought-of number is guessed – via a chain of calculations.' },
    steps: [
      { de: 'Zahl zwischen 1 und 10 denken lassen.',
        ru: 'Попросить задумать число от 1 до 10.',
        en: 'Have them think of a number between 1 and 10.' },
      { de: 'Verdoppeln lassen.',
        ru: 'Попросить удвоить.',
        en: 'Have them double it.' },
      { de: '8 dazuzählen lassen.',
        ru: 'Попросить прибавить 8.',
        en: 'Have them add 8.' },
      { de: 'Halbieren lassen.',
        ru: 'Попросить разделить пополам.',
        en: 'Have them halve it.' },
      { de: 'Die ursprüngliche Zahl abziehen lassen.',
        ru: 'Попросить вычесть исходное число.',
        en: 'Have them subtract the original number.' },
      { de: 'Das Ergebnis ist immer 4 – laut „erraten".',
        ru: 'Результат всегда 4 – «угадать» вслух.',
        en: 'The result is always 4 – "guess" it aloud.' }
    ],
    note: { de: 'Sechs Schritte in fester Reihenfolge. Das Kind soll den Trick anschließend selbst anleiten – erst dann zeigt sich, ob die Folge wirklich sitzt.',
            ru: 'Шесть шагов в строгом порядке. Ребёнок должен потом сам провести фокус – только тогда видно, усвоена ли последовательность.',
            en: 'Six steps in a fixed order. The child should then lead the trick themselves – only then is it clear whether the sequence really sticks.' }
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
      title: `${pick(t.title)} (${t.steps.length} ${pick(UI.schritte)})`,
      instruction: { de: t.instruction.de + ' ' + UI.fuehren.de,
                     ru: t.instruction.ru + ' ' + UI.fuehren.ru,
                     en: t.instruction.en + ' ' + UI.fuehren.en },
      material: t.material,
      steps: t.steps,
      note: t.note || UI.noteFallback
    };
  },

  observe: [
    { de: 'Kommen alle Schritte vor?', ru: 'Все ли шаги выполнены?', en: 'Do all the steps occur?' },
    { de: 'Stimmt die Reihenfolge?', ru: 'Верна ли последовательность?', en: 'Is the order correct?' },
    { de: 'Wird der verdeckende Schritt verstanden oder nur die sichtbare Bewegung kopiert?',
      ru: 'Понят ли скрывающий шаг или копируется только видимое движение?',
      en: 'Is the concealing step understood or only the visible movement copied?' },
    { de: 'Kann das Kind den Trick danach jemand anderem erklären?',
      ru: 'Может ли ребёнок потом объяснить фокус кому-то другому?',
      en: 'Can the child explain the trick to someone else afterwards?' }
  ]
});

export const { init, render, dispose, actions, scoring } = game;
