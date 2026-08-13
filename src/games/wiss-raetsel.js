/**
 * Rätsel-Raten – verbales Schlussfolgern
 * (KABC-II: „Rätsel")
 *
 * Mehrere Hinweise beschreiben einen Gegenstand, gesucht ist der Begriff.
 * Anders als beim Sachwissen zählt hier nicht, ob man eine Tatsache kennt,
 * sondern ob man mehrere Teilinformationen zu einer Lösung zusammenzieht.
 *
 * Deshalb werden die Hinweise nacheinander aufgedeckt: wer nach dem ersten
 * Hinweis löst, hat mehr geschlossen als wer alle drei braucht.
 */
import { createChoiceGame } from '../core/choice.js';
import { shuffle, pick } from '../core/html.js';

const UI = {
  noch:  { de: '💡 Noch ein Hinweis', ru: '💡 Ещё одна подсказка', en: '💡 Another hint' },
  alle:  { de: 'Alle Hinweise sind aufgedeckt', ru: 'Все подсказки открыты', en: 'All hints revealed' },
  frage: { de: 'Was ist gemeint?', ru: 'Что имеется в виду?', en: 'What is meant?' },
  war:   { de: 'Gesucht war:', ru: 'Искомое:', en: 'The answer was:' }
};

const RIDDLES = [
  { t: 1,
    a: { de: 'Die Uhr', ru: 'Часы', en: 'The clock' }, e: '🕐',
    h: { de: ['Ich habe Zeiger, aber keine Hände.', 'Ich ticke.', 'Ich sage dir, wie spät es ist.'],
         ru: ['У меня есть стрелки, но нет рук.', 'Я тикаю.', 'Я говорю тебе, который час.'],
         en: ['I have hands but no arms.', 'I tick.', 'I tell you the time.'] },
    w: { de: ['Der Spiegel','Das Radio','Der Kalender'], ru: ['Зеркало','Радио','Календарь'], en: ['The mirror','The radio','The calendar'] } },
  { t: 1,
    a: { de: 'Der Schuh', ru: 'Ботинок', en: 'The shoe' }, e: '👟',
    h: { de: ['Es gibt mich immer im Paar.', 'Ich habe eine Zunge, aber rede nicht.', 'Du ziehst mich an die Füße.'],
         ru: ['Я всегда в паре.', 'У меня есть язычок, но я не говорю.', 'Меня надевают на ноги.'],
         en: ['I always come in pairs.', 'I have a tongue but do not speak.', 'You put me on your feet.'] },
    w: { de: ['Der Handschuh','Die Mütze','Die Brille'], ru: ['Перчатка','Шапка','Очки'], en: ['The glove','The cap','The glasses'] } },
  { t: 1,
    a: { de: 'Der Apfel', ru: 'Яблоко', en: 'The apple' }, e: '🍎',
    h: { de: ['Ich wachse an einem Baum.', 'Ich bin rot oder grün.', 'Ich habe ein Kerngehäuse.'],
         ru: ['Я расту на дереве.', 'Я красное или зелёное.', 'У меня есть сердцевина.'],
         en: ['I grow on a tree.', 'I am red or green.', 'I have a core.'] },
    w: { de: ['Die Kartoffel','Die Möhre','Die Nuss'], ru: ['Картофель','Морковь','Орех'], en: ['The potato','The carrot','The nut'] } },
  { t: 2,
    a: { de: 'Der Schlüssel', ru: 'Ключ', en: 'The key' }, e: '🔑',
    h: { de: ['Ich habe Zähne, aber beiße nicht.', 'Ich passe in ein Loch.', 'Mit mir öffnest du Türen.'],
         ru: ['У меня есть зубцы, но я не кусаюсь.', 'Я вхожу в отверстие.', 'Мной открывают двери.'],
         en: ['I have teeth but do not bite.', 'I fit into a hole.', 'You open doors with me.'] },
    w: { de: ['Der Kamm','Die Säge','Die Gabel'], ru: ['Расчёска','Пила','Вилка'], en: ['The comb','The saw','The fork'] } },
  { t: 2,
    a: { de: 'Der Schatten', ru: 'Тень', en: 'The shadow' }, e: '🌑',
    h: { de: ['Ich folge dir überall hin.', 'Bei Dunkelheit bin ich weg.', 'Anfassen kannst du mich nicht.'],
         ru: ['Я следую за тобой повсюду.', 'В темноте меня нет.', 'Меня нельзя потрогать.'],
         en: ['I follow you everywhere.', 'In the dark I am gone.', 'You cannot touch me.'] },
    w: { de: ['Der Spiegel','Das Echo','Der Wind'], ru: ['Зеркало','Эхо','Ветер'], en: ['The mirror','The echo','The wind'] } },
  { t: 2,
    a: { de: 'Das Ei', ru: 'Яйцо', en: 'The egg' }, e: '🥚',
    h: { de: ['Ich bin außen hart und innen weich.', 'Ich zerbreche leicht.', 'Aus mir kann ein Küken schlüpfen.'],
         ru: ['Снаружи я твёрдое, внутри мягкое.', 'Меня легко разбить.', 'Из меня может вылупиться цыплёнок.'],
         en: ['I am hard outside and soft inside.', 'I break easily.', 'A chick can hatch from me.'] },
    w: { de: ['Die Nuss','Der Stein','Die Muschel'], ru: ['Орех','Камень','Ракушка'], en: ['The nut','The stone','The shell'] } },
  { t: 3,
    a: { de: 'Das Echo', ru: 'Эхо', en: 'The echo' }, e: '🔊',
    h: { de: ['Ich spreche, ohne einen Mund zu haben.', 'Ich antworte nur, wenn du rufst.', 'In den Bergen hörst du mich oft.'],
         ru: ['Я говорю, хотя у меня нет рта.', 'Я отвечаю только когда ты зовёшь.', 'В горах меня часто слышно.'],
         en: ['I speak without a mouth.', 'I answer only when you call.', 'You often hear me in the mountains.'] },
    w: { de: ['Der Schatten','Das Radio','Der Papagei'], ru: ['Тень','Радио','Попугай'], en: ['The shadow','The radio','The parrot'] } },
  { t: 3,
    a: { de: 'Der Fluss', ru: 'Река', en: 'The river' }, e: '🏞️',
    h: { de: ['Ich habe ein Bett, schlafe aber nie.', 'Ich habe ein Ufer, aber keine Bank.', 'Ich fließe ins Meer.'],
         ru: ['У меня есть русло, но я не сплю.', 'У меня есть берег, но нет скамейки.', 'Я теку в море.'],
         en: ['I have a bed but never sleep.', 'I have banks but no bench.', 'I flow into the sea.'] },
    w: { de: ['Der See','Die Straße','Die Wolke'], ru: ['Озеро','Дорога','Облако'], en: ['The lake','The road','The cloud'] } },
  { t: 3,
    a: { de: 'Die Kerze', ru: 'Свеча', en: 'The candle' }, e: '🕯️',
    h: { de: ['Je länger ich lebe, desto kürzer werde ich.', 'Ich gebe Licht.', 'Wasser ist mein Ende.'],
         ru: ['Чем дольше я живу, тем короче становлюсь.', 'Я даю свет.', 'Вода – мой конец.'],
         en: ['The longer I live, the shorter I become.', 'I give light.', 'Water is my end.'] },
    w: { de: ['Der Bleistift','Die Lampe','Das Streichholz'], ru: ['Карандаш','Лампа','Спичка'], en: ['The pencil','The lamp','The match'] } },
  { t: 4,
    a: { de: 'Der Buchstabe', ru: 'Буква', en: 'The letter' }, e: '🔤',
    h: { de: ['Ich bin klein, aber ohne mich gibt es kein Wort.', 'Es gibt 26 von mir im Alphabet.', 'Aus vielen von mir wird ein Buch.'],
         ru: ['Я маленькая, но без меня нет слова.', 'Нас 26 в алфавите.', 'Из многих нас получается книга.'],
         en: ['I am small, but without me there is no word.', 'There are 26 of me in the alphabet.', 'Many of me make a book.'] },
    w: { de: ['Die Zahl','Der Punkt','Die Seite'], ru: ['Цифра','Точка','Страница'], en: ['The number','The dot','The page'] } },
  { t: 4,
    a: { de: 'Das Loch', ru: 'Дыра', en: 'The hole' }, e: '🕳️',
    h: { de: ['Je mehr man von mir wegnimmt, desto größer werde ich.', 'Ich bestehe aus nichts.', 'Im Käse findest du mich oft.'],
         ru: ['Чем больше из меня убирают, тем больше я становлюсь.', 'Я состою из ничего.', 'В сыре меня часто находят.'],
         en: ['The more you take from me, the bigger I grow.', 'I consist of nothing.', 'You often find me in cheese.'] },
    w: { de: ['Der Berg','Der Schwamm','Der Staub'], ru: ['Гора','Губка','Пыль'], en: ['The mountain','The sponge','The dust'] } },
  { t: 4,
    a: { de: 'Der Buchstabe M', ru: 'Буква М', en: 'The letter M' }, e: 'Ⓜ️',
    h: { de: ['Ich komme einmal in der Minute vor.', 'Zweimal im Moment.', 'Aber nie in hundert Jahren.'],
         ru: ['Я встречаюсь один раз в минуте.', 'Дважды в моменте.', 'Но никогда в сотне лет.'],
         en: ['I appear once in a minute.', 'Twice in a moment.', 'But never in a hundred years.'] },
    w: { de: ['Die Sekunde','Die Zahl 2','Der Zeiger'], ru: ['Секунда','Число 2','Стрелка'], en: ['The second','The number 2','The hand'] } },
  { t: 5,
    a: { de: 'Die Landkarte', ru: 'Карта', en: 'The map' }, e: '🗺️',
    h: { de: ['Ich habe Städte ohne Häuser.', 'Ich habe Wälder ohne Bäume.', 'Und Flüsse ohne Wasser.'],
         ru: ['У меня есть города без домов.', 'У меня есть леса без деревьев.', 'И реки без воды.'],
         en: ['I have cities without houses.', 'I have forests without trees.', 'And rivers without water.'] },
    w: { de: ['Das Gemälde','Der Traum','Das Modell'], ru: ['Картина','Сон','Модель'], en: ['The painting','The dream','The model'] } },
  { t: 5,
    a: { de: 'Der Atem', ru: 'Дыхание', en: 'The breath' }, e: '💨',
    h: { de: ['Du hast mich immer bei dir, siehst mich aber selten.', 'Im Winter werde ich sichtbar.', 'Ohne mich lebst du keine Minute.'],
         ru: ['Я всегда с тобой, но меня редко видно.', 'Зимой я становлюсь видимым.', 'Без меня ты не проживёшь и минуты.'],
         en: ['You always have me with you but rarely see me.', 'In winter I become visible.', 'Without me you do not live a minute.'] },
    w: { de: ['Der Schatten','Der Puls','Der Gedanke'], ru: ['Тень','Пульс','Мысль'], en: ['The shadow','The pulse','The thought'] } },
  { t: 5,
    a: { de: 'Das Versprechen', ru: 'Обещание', en: 'The promise' }, e: '🤝',
    h: { de: ['Man gibt mich, ohne etwas herzugeben.', 'Man kann mich brechen, ohne mich anzufassen.', 'Man kann mich halten, ohne Hände.'],
         ru: ['Меня дают, ничего не отдавая.', 'Меня можно нарушить, не прикасаясь.', 'Меня можно держать без рук.'],
         en: ['You give me without giving anything away.', 'You can break me without touching me.', 'You can keep me without hands.'] },
    w: { de: ['Das Geheimnis','Der Gruß','Die Meinung'], ru: ['Секрет','Приветствие','Мнение'], en: ['The secret','The greeting','The opinion'] } }
];

const game = createChoiceGame({
  id: 'wiss-raetsel',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 2,

  genRound: (gd) => {
    gd.asked = gd.asked || [];
    let pool = RIDDLES.filter(r => r.t === gd.level && !gd.asked.includes(r.a.de));
    if (!pool.length) {
      gd.asked = gd.asked.filter(x => !RIDDLES.some(r => r.t === gd.level && r.a.de === x));
      pool = RIDDLES.filter(r => r.t === gd.level);
    }
    const r = pool[Math.floor(Math.random() * pool.length)];
    gd.asked.push(r.a.de);
    gd.hintsShown = 1;
    gd.riddle = r;
    const a = pick(r.a);
    const choices = shuffle([a, ...pick(r.w).map(w => w)]);

    return {
      prompt: renderPrompt(r, 1),
      options: choices.map(c => ({ html: c, label: c })),
      correct: choices.indexOf(a),
      layout: 'list',
      explain: `${pick(UI.war)} ${a} ${r.e}`
    };
  },

  // Zusätzliche Action: nächsten Hinweis aufdecken
  extraActions: {
    hint(gs) {
      const gd = gs.gd;
      if (!gd.riddle || gd.phase !== 'ask') return false;
      gd.hintsShown = Math.min(gd.hintsShown + 1, gd.riddle.h.de.length);
      gd.round.prompt = renderPrompt(gd.riddle, gd.hintsShown);
    }
  }
});

function renderPrompt(r, shown) {
  const hints = pick(r.h);
  return `<div style="text-align:center">
    <div style="font-size:2.4em;margin-bottom:8px">🤔</div>
    <div style="display:flex;flex-direction:column;gap:6px;align-items:center;margin-bottom:10px">
      ${hints.slice(0, shown).map((h, i) =>
        `<div style="background:var(--bg);border-radius:14px;padding:8px 16px;max-width:420px;font-size:1.02em">
          <b style="color:var(--primary)">${i + 1}.</b> ${h}
        </div>`).join('')}
    </div>
    ${shown < hints.length
      ? `<button class="btn btn-secondary btn-small" onclick="G('hint')">${pick(UI.noch)} (${hints.length - shown})</button>`
      : `<div style="font-size:.8em;color:var(--text-light)">${pick(UI.alle)}</div>`}
    <p style="font-size:.95em;font-weight:700;margin-top:10px">${pick(UI.frage)}</p>
  </div>`;
}

export const { init, render, dispose, actions, scoring } = game;
