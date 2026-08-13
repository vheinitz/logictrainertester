/**
 * Teekesselchen – ein Wort, zwei Bedeutungen
 *
 * Zwei Hinweise beschreiben dasselbe Wort in völlig verschiedenen Bedeutungen.
 * Gesucht ist der gemeinsame Begriff. Das prüft Flexibilität im sprachlichen
 * Denken: die erste Bedeutung muss losgelassen werden, um die zweite zu finden.
 *
 * Anders als die übrigen Module dieser Gruppe läuft das hier ohne Begleitperson,
 * weil die Lösung eindeutig ist und sich sauber als Auswahl stellen lässt.
 */
import { createChoiceGame } from '../core/choice.js';
import { shuffle, pick } from '../core/html.js';

const UI = {
  intro: { de: 'Mein Teekesselchen …', ru: 'Моё загадочное словечко …', en: 'My two-word riddle …' },
  frage: { de: 'Welches Wort ist gemeint?', ru: 'Какое слово имеется в виду?', en: 'Which word is meant?' },
  passt: { de: 'passt zu beiden Bedeutungen.', ru: 'подходит к обоим значениям.', en: 'fits both meanings.' }
};

const PUZZLES = [
  { t: 1,
    a: { de: 'Der Ball', ru: 'Мяч', en: 'The ball' },
    m: { de: ['Damit spielt man Fußball.', 'Dort tanzen Menschen in schönen Kleidern.'],
         ru: ['Им играют в футбол.', 'Там люди танцуют в красивых нарядах.'],
         en: ['You play football with it.', 'People dance there in fine clothes.'] },
    w: { de: ['Der Reifen','Das Fest','Der Tanz'], ru: ['Шина','Праздник','Танец'], en: ['The tyre','The party','The dance'] } },
  { t: 1,
    a: { de: 'Die Maus', ru: 'Мышь', en: 'The mouse' },
    m: { de: ['Ein kleines graues Tier.', 'Damit klickt man am Computer.'],
         ru: ['Маленький серый зверёк.', 'Ей щёлкают на компьютере.'],
         en: ['A small grey animal.', 'You click on the computer with it.'] },
    w: { de: ['Die Katze','Die Taste','Der Käse'], ru: ['Кошка','Клавиша','Сыр'], en: ['The cat','The key','The cheese'] } },
  { t: 1,
    a: { de: 'Der Hahn', ru: 'Петух / кран', en: 'The cock / tap' },
    m: { de: ['Er kräht am Morgen.', 'Aus ihm kommt Wasser.'],
         ru: ['Он кукарекает утром.', 'Из него течёт вода.'],
         en: ['It crows in the morning.', 'Water comes out of it.'] },
    w: { de: ['Das Huhn','Der Eimer','Die Uhr'], ru: ['Курица','Ведро','Часы'], en: ['The hen','The bucket','The clock'] } },
  { t: 2,
    a: { de: 'Die Bank', ru: 'Скамейка / банк', en: 'The bench / bank' },
    m: { de: ['Darauf kann man im Park sitzen.', 'Dort wird Geld aufbewahrt.'],
         ru: ['На ней можно сидеть в парке.', 'Там хранят деньги.'],
         en: ['You can sit on it in the park.', 'Money is kept there.'] },
    w: { de: ['Der Stuhl','Die Kasse','Der Tresor'], ru: ['Стул','Касса','Сейф'], en: ['The chair','The till','The safe'] } },
  { t: 2,
    a: { de: 'Der Flügel', ru: 'Крыло / рояль', en: 'The wing / grand piano' },
    m: { de: ['Damit fliegt ein Vogel.', 'Darauf spielt man Musik.'],
         ru: ['Им птица летает.', 'На нём играют музыку.'],
         en: ['A bird flies with it.', 'You play music on it.'] },
    w: { de: ['Die Feder','Das Klavier','Die Geige'], ru: ['Перо','Пианино','Скрипка'], en: ['The feather','The piano','The violin'] } },
  { t: 2,
    a: { de: 'Das Schloss', ru: 'Замок / замок', en: 'The castle / lock' },
    m: { de: ['Darin wohnte früher ein König.', 'Damit wird eine Tür verschlossen.'],
         ru: ['В нём раньше жил король.', 'Им запирают дверь.'],
         en: ['A king used to live in it.', 'A door is locked with it.'] },
    w: { de: ['Die Burg','Der Schlüssel','Das Tor'], ru: ['Крепость','Ключ','Ворота'], en: ['The fortress','The key','The gate'] } },
  { t: 3,
    a: { de: 'Der Kiefer', ru: 'Челюсть / сосна', en: 'The jaw / pine' },
    m: { de: ['Ein Knochen im Gesicht.', 'Ein Nadelbaum im Wald.'],
         ru: ['Кость на лице.', 'Хвойное дерево в лесу.'],
         en: ['A bone in the face.', 'A conifer in the forest.'] },
    w: { de: ['Die Wange','Die Tanne','Die Rippe'], ru: ['Щека','Пихта','Ребро'], en: ['The cheek','The fir','The rib'] } },
  { t: 3,
    a: { de: 'Die Birne', ru: 'Груша', en: 'The pear' },
    m: { de: ['Eine Frucht am Baum.', 'Sie leuchtet in der Lampe.'],
         ru: ['Фрукт на дереве.', 'Она светится в лампе.'],
         en: ['A fruit on a tree.', 'It glows in the lamp.'] },
    w: { de: ['Der Apfel','Die Kerze','Die Sonne'], ru: ['Яблоко','Свеча','Солнце'], en: ['The apple','The candle','The sun'] } },
  { t: 3,
    a: { de: 'Der Strauß', ru: 'Страус / букет', en: 'The ostrich / bouquet' },
    m: { de: ['Ein sehr großer Vogel.', 'Ein Bund Blumen.'],
         ru: ['Очень большая птица.', 'Букет цветов.'],
         en: ['A very big bird.', 'A bunch of flowers.'] },
    w: { de: ['Der Adler','Der Kranz','Die Vase'], ru: ['Орёл','Венок','Ваза'], en: ['The eagle','The wreath','The vase'] } },
  { t: 4,
    a: { de: 'Der Zug', ru: 'Поезд / ход', en: 'The train / move' },
    m: { de: ['Er fährt auf Schienen.', 'Man macht ihn beim Schachspiel.'],
         ru: ['Он едет по рельсам.', 'Его делают в шахматах.'],
         en: ['It runs on rails.', 'You make one in chess.'] },
    w: { de: ['Der Bus','Der Wurf','Das Brett'], ru: ['Автобус','Бросок','Доска'], en: ['The bus','The throw','The board'] } },
  { t: 4,
    a: { de: 'Das Blatt', ru: 'Лист', en: 'The leaf / sheet' },
    m: { de: ['Es wächst am Baum.', 'Darauf kann man schreiben.'],
         ru: ['Он растёт на дереве.', 'На нём можно писать.'],
         en: ['It grows on a tree.', 'You can write on it.'] },
    w: { de: ['Die Rinde','Das Heft','Der Zweig'], ru: ['Кора','Тетрадь','Ветка'], en: ['The bark','The notebook','The twig'] } },
  { t: 4,
    a: { de: 'Der Läufer', ru: 'Слон / ковровая дорожка', en: 'The bishop / runner' },
    m: { de: ['Eine Figur beim Schach.', 'Ein schmaler Teppich im Flur.'],
         ru: ['Фигура в шахматах.', 'Узкий ковёр в коридоре.'],
         en: ['A piece in chess.', 'A narrow carpet in the hallway.'] },
    w: { de: ['Der Turm','Die Matte','Der Sportler'], ru: ['Ладья','Коврик','Спортсмен'], en: ['The rook','The mat','The athlete'] } },
  { t: 5,
    a: { de: 'Die Note', ru: 'Оценка / нота', en: 'The mark / note' },
    m: { de: ['Sie steht im Zeugnis.', 'Sie steht auf einem Notenblatt.'],
         ru: ['Она стоит в табеле.', 'Она стоит на нотном листе.'],
         en: ['It is in a report card.', 'It is on a sheet of music.'] },
    w: { de: ['Die Zensur','Der Ton','Das Zeugnis'], ru: ['Оценка','Звук','Табель'], en: ['The grade','The tone','The report'] } },
  { t: 5,
    a: { de: 'Der Absatz', ru: 'Каблук / абзац', en: 'The heel / paragraph' },
    m: { de: ['Er sitzt unten am Schuh.', 'Er ist ein Abschnitt in einem Text.'],
         ru: ['Он внизу ботинка.', 'Это часть текста.'],
         en: ['It is at the bottom of a shoe.', 'It is a section in a text.'] },
    w: { de: ['Die Sohle','Der Satz','Die Zeile'], ru: ['Подошва','Предложение','Строка'], en: ['The sole','The sentence','The line'] } },
  { t: 5,
    a: { de: 'Die Kapelle', ru: 'Часовня / оркестр', en: 'The chapel / band' },
    m: { de: ['Eine kleine Kirche.', 'Eine Gruppe von Musikern.'],
         ru: ['Маленькая церковь.', 'Группа музыкантов.'],
         en: ['A small church.', 'A group of musicians.'] },
    w: { de: ['Der Dom','Der Chor','Das Orchester'], ru: ['Собор','Хор','Оркестр'], en: ['The cathedral','The choir','The orchestra'] } }
];

const game = createChoiceGame({
  id: 'wiss-teekesselchen',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 2,

  genRound: (gd) => {
    gd.asked = gd.asked || [];
    let pool = PUZZLES.filter(p => p.t === gd.level && !gd.asked.includes(p.a.de));
    if (!pool.length) {
      gd.asked = gd.asked.filter(x => !PUZZLES.some(p => p.t === gd.level && p.a.de === x));
      pool = PUZZLES.filter(p => p.t === gd.level);
    }
    const p = pool[Math.floor(Math.random() * pool.length)];
    gd.asked.push(p.a.de);
    const a = pick(p.a);
    const choices = shuffle([a, ...pick(p.w)]);

    return {
      prompt: `<div style="text-align:center">
        <div style="font-size:2.2em;margin-bottom:6px">🫖</div>
        <p style="font-size:1.02em;font-weight:700;margin-bottom:10px">${pick(UI.intro)}</p>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:center;margin-bottom:8px">
          ${pick(p.m).map((m, i) => `<div style="background:var(--bg);border-radius:14px;padding:9px 18px;max-width:420px">
            <b style="color:var(--primary)">${i + 1}.</b> ${m}</div>`).join('')}
        </div>
        <p style="font-size:.95em;font-weight:700">${pick(UI.frage)}</p>
      </div>`,
      options: choices.map(c => ({ html: c, label: c })),
      correct: choices.indexOf(a),
      layout: 'list',
      explain: `„${a}" ${pick(UI.passt)}`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
