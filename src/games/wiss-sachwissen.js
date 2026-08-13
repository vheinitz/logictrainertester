/**
 * Was weißt du? – Wort- und Sachwissen
 * (KABC-II: „Wort- und Sachwissen")
 *
 * Kristalline Fähigkeiten (Gc): Wissen, das über Jahre aus Schule, Familie und
 * Umfeld zusammenkommt. Ergebnisse hier sagen entsprechend mehr über
 * Lerngelegenheiten als über Verarbeitungsgeschwindigkeit – das steht auch so
 * in den Hypothesen des Performance-Modells.
 *
 * Fragen sind nach Alter gestaffelt (Niveau 1 ≈ Vorschule, Niveau 5 ≈ ab 12).
 */
import { createChoiceGame } from '../core/choice.js';
import { shuffle, pick } from '../core/html.js';

const UI = {
  richtig: { de: 'Richtig ist:', ru: 'Правильный ответ:', en: 'The answer is:' }
};

const QUESTIONS = [
  // Niveau 1
  { t: 1,
    q: { de: 'Welches Tier gibt Milch?', ru: 'Какое животное даёт молоко?', en: 'Which animal gives milk?' },
    a: { de: 'Die Kuh', ru: 'Корова', en: 'The cow' },
    w: { de: ['Das Huhn', 'Der Frosch', 'Die Biene'], ru: ['Курица', 'Лягушка', 'Пчела'], en: ['The hen', 'The frog', 'The bee'] } },
  { t: 1,
    q: { de: 'Wo wohnen Fische?', ru: 'Где живут рыбы?', en: 'Where do fish live?' },
    a: { de: 'Im Wasser', ru: 'В воде', en: 'In the water' },
    w: { de: ['Im Baum', 'In der Erde', 'In der Luft'], ru: ['На дереве', 'В земле', 'В воздухе'], en: ['In a tree', 'In the ground', 'In the air'] } },
  { t: 1,
    q: { de: 'Was benutzt man zum Schneiden?', ru: 'Чем режут?', en: 'What do you use for cutting?' },
    a: { de: 'Die Schere', ru: 'Ножницы', en: 'Scissors' },
    w: { de: ['Der Löffel', 'Der Kamm', 'Die Gabel'], ru: ['Ложка', 'Расчёска', 'Вилка'], en: ['The spoon', 'The comb', 'The fork'] } },
  { t: 1,
    q: { de: 'Welche Farbe hat eine reife Banane?', ru: 'Какого цвета спелый банан?', en: 'What colour is a ripe banana?' },
    a: { de: 'Gelb', ru: 'Жёлтый', en: 'Yellow' },
    w: { de: ['Blau', 'Lila', 'Schwarz'], ru: ['Синий', 'Фиолетовый', 'Чёрный'], en: ['Blue', 'Purple', 'Black'] } },
  { t: 1,
    q: { de: 'Wann gehen die meisten Kinder schlafen?', ru: 'Когда большинство детей ложится спать?', en: 'When do most children go to sleep?' },
    a: { de: 'Am Abend', ru: 'Вечером', en: 'In the evening' },
    w: { de: ['Am Morgen', 'Am Mittag', 'Am Vormittag'], ru: ['Утром', 'В полдень', 'До полудня'], en: ['In the morning', 'At noon', 'In the late morning'] } },
  // Niveau 2
  { t: 2,
    q: { de: 'Wie viele Beine hat eine Spinne?', ru: 'Сколько ног у паука?', en: 'How many legs does a spider have?' },
    a: { de: 'Acht', ru: 'Восемь', en: 'Eight' },
    w: { de: ['Sechs', 'Vier', 'Zehn'], ru: ['Шесть', 'Четыре', 'Десять'], en: ['Six', 'Four', 'Ten'] } },
  { t: 2,
    q: { de: 'Welche Jahreszeit kommt nach dem Winter?', ru: 'Какое время года наступает после зимы?', en: 'Which season comes after winter?' },
    a: { de: 'Der Frühling', ru: 'Весна', en: 'Spring' },
    w: { de: ['Der Sommer', 'Der Herbst', 'Der Winter nochmal'], ru: ['Лето', 'Осень', 'Снова зима'], en: ['Summer', 'Autumn', 'Winter again'] } },
  { t: 2,
    q: { de: 'Woraus wird Brot gemacht?', ru: 'Из чего делают хлеб?', en: 'What is bread made from?' },
    a: { de: 'Aus Mehl', ru: 'Из муки', en: 'From flour' },
    w: { de: ['Aus Reis', 'Aus Milch', 'Aus Kartoffeln'], ru: ['Из риса', 'Из молока', 'Из картофеля'], en: ['From rice', 'From milk', 'From potatoes'] } },
  { t: 2,
    q: { de: 'Was macht ein Tierarzt?', ru: 'Что делает ветеринар?', en: 'What does a vet do?' },
    a: { de: 'Er behandelt Tiere', ru: 'Он лечит животных', en: 'He treats animals' },
    w: { de: ['Er verkauft Tiere', 'Er fängt Tiere', 'Er malt Tiere'], ru: ['Он продаёт животных', 'Он ловит животных', 'Он рисует животных'], en: ['He sells animals', 'He catches animals', 'He paints animals'] } },
  { t: 2,
    q: { de: 'Wie viele Tage hat eine Woche?', ru: 'Сколько дней в неделе?', en: 'How many days are in a week?' },
    a: { de: 'Sieben', ru: 'Семь', en: 'Seven' },
    w: { de: ['Fünf', 'Zehn', 'Zwölf'], ru: ['Пять', 'Десять', 'Двенадцать'], en: ['Five', 'Ten', 'Twelve'] } },
  // Niveau 3
  { t: 3,
    q: { de: 'Welcher Planet ist der Sonne am nächsten?', ru: 'Какая планета ближе всего к Солнцу?', en: 'Which planet is closest to the sun?' },
    a: { de: 'Merkur', ru: 'Меркурий', en: 'Mercury' },
    w: { de: ['Venus', 'Erde', 'Mars'], ru: ['Венера', 'Земля', 'Марс'], en: ['Venus', 'Earth', 'Mars'] } },
  { t: 3,
    q: { de: 'Was ist die Hauptstadt von Deutschland?', ru: 'Столица Германии?', en: 'What is the capital of Germany?' },
    a: { de: 'Berlin', ru: 'Берлин', en: 'Berlin' },
    w: { de: ['München', 'Hamburg', 'Köln'], ru: ['Мюнхен', 'Гамбург', 'Кёльн'], en: ['Munich', 'Hamburg', 'Cologne'] } },
  { t: 3,
    q: { de: 'Wie nennt man ein Tier, das nur Pflanzen frisst?', ru: 'Как называют животное, которое ест только растения?', en: 'What do you call an animal that eats only plants?' },
    a: { de: 'Pflanzenfresser', ru: 'Травоядное', en: 'A herbivore' },
    w: { de: ['Fleischfresser', 'Allesfresser', 'Aasfresser'], ru: ['Хищник', 'Всеядное', 'Падальщик'], en: ['A carnivore', 'An omnivore', 'A scavenger'] } },
  { t: 3,
    q: { de: 'Woher kommt Honig?', ru: 'Откуда берётся мёд?', en: 'Where does honey come from?' },
    a: { de: 'Von Bienen', ru: 'От пчёл', en: 'From bees' },
    w: { de: ['Von Ameisen', 'Von Schmetterlingen', 'Aus Blüten direkt'], ru: ['От муравьёв', 'От бабочек', 'Прямо из цветов'], en: ['From ants', 'From butterflies', 'Directly from flowers'] } },
  { t: 3,
    q: { de: 'Bei wie viel Grad gefriert Wasser?', ru: 'При какой температуре замерзает вода?', en: 'At what temperature does water freeze?' },
    a: { de: '0 Grad', ru: '0 градусов', en: '0 degrees' },
    w: { de: ['10 Grad', '32 Grad', '100 Grad'], ru: ['10 градусов', '32 градуса', '100 градусов'], en: ['10 degrees', '32 degrees', '100 degrees'] } },
  // Niveau 4
  { t: 4,
    q: { de: 'Welches Organ pumpt das Blut durch den Körper?', ru: 'Какой орган качает кровь по телу?', en: 'Which organ pumps blood through the body?' },
    a: { de: 'Das Herz', ru: 'Сердце', en: 'The heart' },
    w: { de: ['Die Lunge', 'Die Leber', 'Der Magen'], ru: ['Лёгкие', 'Печень', 'Желудок'], en: ['The lungs', 'The liver', 'The stomach'] } },
  { t: 4,
    q: { de: 'Was misst man mit einem Thermometer?', ru: 'Что измеряют термометром?', en: 'What do you measure with a thermometer?' },
    a: { de: 'Die Temperatur', ru: 'Температуру', en: 'Temperature' },
    w: { de: ['Das Gewicht', 'Die Länge', 'Die Lautstärke'], ru: ['Вес', 'Длину', 'Громкость'], en: ['Weight', 'Length', 'Loudness'] } },
  { t: 4,
    q: { de: 'Welcher Kontinent ist der größte?', ru: 'Какой континент самый большой?', en: 'Which continent is the largest?' },
    a: { de: 'Asien', ru: 'Азия', en: 'Asia' },
    w: { de: ['Afrika', 'Europa', 'Nordamerika'], ru: ['Африка', 'Европа', 'Северная Америка'], en: ['Africa', 'Europe', 'North America'] } },
  { t: 4,
    q: { de: 'Wie heißt der Vorgang, bei dem Wasser zu Dampf wird?', ru: 'Как называется процесс, когда вода становится паром?', en: 'What is the process called when water becomes vapour?' },
    a: { de: 'Verdunsten', ru: 'Испарение', en: 'Evaporation' },
    w: { de: ['Gefrieren', 'Schmelzen', 'Kondensieren'], ru: ['Замерзание', 'Плавление', 'Конденсация'], en: ['Freezing', 'Melting', 'Condensation'] } },
  { t: 4,
    q: { de: 'Was ist ein Vulkan?', ru: 'Что такое вулкан?', en: 'What is a volcano?' },
    a: { de: 'Ein Berg, aus dem Lava kommt', ru: 'Гора, из которой выходит лава', en: 'A mountain from which lava comes' },
    w: { de: ['Ein sehr tiefer See', 'Ein Erdbeben', 'Eine große Welle'], ru: ['Очень глубокое озеро', 'Землетрясение', 'Большая волна'], en: ['A very deep lake', 'An earthquake', 'A big wave'] } },
  // Niveau 5
  { t: 5,
    q: { de: 'Welches Gas atmen Pflanzen zum Wachsen ein?', ru: 'Какой газ растения вдыхают для роста?', en: 'Which gas do plants breathe in to grow?' },
    a: { de: 'Kohlendioxid', ru: 'Углекислый газ', en: 'Carbon dioxide' },
    w: { de: ['Sauerstoff', 'Stickstoff', 'Wasserstoff'], ru: ['Кислород', 'Азот', 'Водород'], en: ['Oxygen', 'Nitrogen', 'Hydrogen'] } },
  { t: 5,
    q: { de: 'Wie nennt man die Lehre von den Lebewesen?', ru: 'Как называется наука о живых организмах?', en: 'What is the study of living things called?' },
    a: { de: 'Biologie', ru: 'Биология', en: 'Biology' },
    w: { de: ['Geologie', 'Physik', 'Chemie'], ru: ['Геология', 'Физика', 'Химия'], en: ['Geology', 'Physics', 'Chemistry'] } },
  { t: 5,
    q: { de: 'Was bezeichnet der Begriff „Demokratie"?', ru: 'Что означает слово «демократия»?', en: 'What does the term "democracy" mean?' },
    a: { de: 'Herrschaft des Volkes', ru: 'Власть народа', en: 'Rule by the people' },
    w: { de: ['Herrschaft eines Königs', 'Herrschaft der Reichen', 'Herrschaft des Militärs'], ru: ['Власть короля', 'Власть богатых', 'Власть военных'], en: ['Rule by a king', 'Rule by the rich', 'Rule by the military'] } },
  { t: 5,
    q: { de: 'Welcher Ozean liegt zwischen Europa und Amerika?', ru: 'Какой океан находится между Европой и Америкой?', en: 'Which ocean lies between Europe and America?' },
    a: { de: 'Der Atlantik', ru: 'Атлантический океан', en: 'The Atlantic' },
    w: { de: ['Der Pazifik', 'Der Indische Ozean', 'Das Mittelmeer'], ru: ['Тихий океан', 'Индийский океан', 'Средиземное море'], en: ['The Pacific', 'The Indian Ocean', 'The Mediterranean Sea'] } },
  { t: 5,
    q: { de: 'Wodurch entstehen Ebbe und Flut?', ru: 'Из-за чего возникают приливы и отливы?', en: 'What causes the tides?' },
    a: { de: 'Durch die Anziehung des Mondes', ru: 'Из-за притяжения Луны', en: 'Through the pull of the moon' },
    w: { de: ['Durch den Wind', 'Durch die Erdrotation allein', 'Durch Regen'], ru: ['Из-за ветра', 'Только из-за вращения Земли', 'Из-за дождя'], en: ['Through the wind', 'Through the earth\'s rotation alone', 'Through rain'] } }
];

const game = createChoiceGame({
  id: 'wiss-sachwissen',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 2,

  genRound: (gd) => {
    gd.asked = gd.asked || [];
    let pool = QUESTIONS.filter(q => q.t === gd.level && !gd.asked.includes(q.q.de));
    if (!pool.length) {
      // Stufe erschöpft – Gedächtnis für diese Stufe leeren statt zu wiederholen
      gd.asked = gd.asked.filter(x => !QUESTIONS.some(q => q.t === gd.level && q.q.de === x));
      pool = QUESTIONS.filter(q => q.t === gd.level);
    }
    const q = pool[Math.floor(Math.random() * pool.length)];
    gd.asked.push(q.q.de);
    const a = pick(q.a);
    const choices = shuffle([a, ...pick(q.w)]);

    return {
      prompt: `<div style="text-align:center">
        <div style="font-size:2.4em;margin-bottom:6px">🌍</div>
        <p style="font-size:1.15em;font-weight:700;margin-bottom:4px">${pick(q.q)}</p>
      </div>`,
      options: choices.map(c => ({ html: c, label: c })),
      correct: choices.indexOf(a),
      layout: 'list',
      explain: `${pick(UI.richtig)} ${a}.`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
