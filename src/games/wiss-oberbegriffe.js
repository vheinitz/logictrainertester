/**
 * Oberbegriffe finden – Kategorisierungsfähigkeit
 *
 * Migriert auf core/choice.js; die Optionen werden jetzt gemischt und die
 * Fragen sind nach Abstraktionsgrad gestaffelt (Niveau 4/5 verlangen
 * Oberbegriffe, die nicht mehr am Aussehen ablesbar sind).
 */
import { createChoiceGame } from '../core/choice.js';
import { shuffle, pick } from '../core/html.js';

const UI = {
  frage: { de: '🏷️ Was haben diese gemeinsam?', ru: '🏷️ Что у них общего?', en: '🏷️ What do these have in common?' },
  alle:  { de: 'Sie sind alle …', ru: 'Все они …', en: 'They are all …' }
};

const QUESTIONS = [
  { t: 1,
    items: { de: '🍎 Apfel, 🍌 Banane, 🍊 Orange', ru: '🍎 яблоко, 🍌 банан, 🍊 апельсин', en: '🍎 apple, 🍌 banana, 🍊 orange' },
    a: { de: 'Obst', ru: 'Фрукты', en: 'Fruit' },
    w: { de: ['Gemüse','Süßigkeiten','Getränke'], ru: ['Овощи','Сладости','Напитки'], en: ['Vegetables','Sweets','Drinks'] },
    explain: { de: 'Obst – alles sind Früchte', ru: 'Фрукты – всё это фрукты', en: 'Fruit – all of them are fruits' } },
  { t: 1,
    items: { de: '🐕 Hund, 🐈 Katze, 🐇 Hase', ru: '🐕 собака, 🐈 кошка, 🐇 заяц', en: '🐕 dog, 🐈 cat, 🐇 rabbit' },
    a: { de: 'Tiere', ru: 'Животные', en: 'Animals' },
    w: { de: ['Pflanzen','Fahrzeuge','Möbel'], ru: ['Растения','Транспорт','Мебель'], en: ['Plants','Vehicles','Furniture'] },
    explain: { de: 'Tiere – alles sind Haustiere', ru: 'Животные – всё это домашние животные', en: 'Animals – all of them are pets' } },
  { t: 1,
    items: { de: '🚗 Auto, 🚌 Bus, 🚲 Fahrrad', ru: '🚗 машина, 🚌 автобус, 🚲 велосипед', en: '🚗 car, 🚌 bus, 🚲 bicycle' },
    a: { de: 'Fahrzeuge', ru: 'Транспорт', en: 'Vehicles' },
    w: { de: ['Tiere','Gebäude','Werkzeuge'], ru: ['Животные','Здания','Инструменты'], en: ['Animals','Buildings','Tools'] },
    explain: { de: 'Fahrzeuge – alles fährt', ru: 'Транспорт – всё это ездит', en: 'Vehicles – they all move' } },
  { t: 2,
    items: { de: '🪑 Stuhl, 🛏️ Bett, 📦 Schrank', ru: '🪑 стул, 🛏️ кровать, 📦 шкаф', en: '🪑 chair, 🛏️ bed, 📦 wardrobe' },
    a: { de: 'Möbel', ru: 'Мебель', en: 'Furniture' },
    w: { de: ['Spielzeug','Kleidung','Essen'], ru: ['Игрушки','Одежда','Еда'], en: ['Toys','Clothing','Food'] },
    explain: { de: 'Möbel – alles sind Einrichtungsgegenstände', ru: 'Мебель – всё это предметы интерьера', en: 'Furniture – all are household items' } },
  { t: 2,
    items: { de: '👚 T-Shirt, 👖 Hose, 🧥 Jacke', ru: '👚 футболка, 👖 брюки, 🧥 куртка', en: '👚 t-shirt, 👖 trousers, 🧥 jacket' },
    a: { de: 'Kleidung', ru: 'Одежда', en: 'Clothing' },
    w: { de: ['Möbel','Spielzeug','Schuhe'], ru: ['Мебель','Игрушки','Обувь'], en: ['Furniture','Toys','Shoes'] },
    explain: { de: 'Kleidung – alles zieht man an', ru: 'Одежда – всё это надевают', en: 'Clothing – you wear all of them' } },
  { t: 2,
    items: { de: '⚽ Fußball, 🏀 Basketball, 🎾 Tennis', ru: '⚽ футбол, 🏀 баскетбол, 🎾 теннис', en: '⚽ football, 🏀 basketball, 🎾 tennis' },
    a: { de: 'Sport', ru: 'Спорт', en: 'Sport' },
    w: { de: ['Musik','Essen','Filme'], ru: ['Музыка','Еда','Фильмы'], en: ['Music','Food','Films'] },
    explain: { de: 'Sport – alles sind Sportarten', ru: 'Спорт – всё это виды спорта', en: 'Sport – all are kinds of sport' } },
  { t: 3,
    items: { de: '🥁 Trommel, 🎸 Gitarre, 🎹 Klavier', ru: '🥁 барабан, 🎸 гитара, 🎹 пианино', en: '🥁 drum, 🎸 guitar, 🎹 piano' },
    a: { de: 'Musikinstrumente', ru: 'Музыкальные инструменты', en: 'Musical instruments' },
    w: { de: ['Sport','Werkzeuge','Essen'], ru: ['Спорт','Инструменты','Еда'], en: ['Sport','Tools','Food'] },
    explain: { de: 'Musikinstrumente – alle machen Musik', ru: 'Музыкальные инструменты – все издают музыку', en: 'Musical instruments – they all make music' } },
  { t: 3,
    items: { de: '🔨 Hammer, 🪚 Säge, 🔧 Schraubenzieher', ru: '🔨 молоток, 🪚 пила, 🔧 отвёртка', en: '🔨 hammer, 🪚 saw, 🔧 screwdriver' },
    a: { de: 'Werkzeuge', ru: 'Инструменты', en: 'Tools' },
    w: { de: ['Spielzeug','Küchengeräte','Möbel'], ru: ['Игрушки','Кухонные приборы','Мебель'], en: ['Toys','Kitchen appliances','Furniture'] },
    explain: { de: 'Werkzeuge – alle benutzt man zum Bauen', ru: 'Инструменты – всё для строительства', en: 'Tools – you use them all for building' } },
  { t: 3,
    items: { de: '🌧️ Regen, ❄️ Schnee, ☀️ Sonne', ru: '🌧️ дождь, ❄️ снег, ☀️ солнце', en: '🌧️ rain, ❄️ snow, ☀️ sunshine' },
    a: { de: 'Wetter', ru: 'Погода', en: 'Weather' },
    w: { de: ['Tiere','Essen','Farben'], ru: ['Животные','Еда','Цвета'], en: ['Animals','Food','Colours'] },
    explain: { de: 'Wetter – alles sind Wettererscheinungen', ru: 'Погода – всё это погодные явления', en: 'Weather – all are weather phenomena' } },
  { t: 3,
    items: { de: '🥛 Milch, 🧃 Saft, ☕ Tee', ru: '🥛 молоко, 🧃 сок, ☕ чай', en: '🥛 milk, 🧃 juice, ☕ tea' },
    a: { de: 'Getränke', ru: 'Напитки', en: 'Drinks' },
    w: { de: ['Speisen','Suppen','Soßen'], ru: ['Блюда','Супы','Соусы'], en: ['Dishes','Soups','Sauces'] },
    explain: { de: 'Getränke – alles kann man trinken', ru: 'Напитки – всё это можно пить', en: 'Drinks – you can drink them all' } },
  // Höhere Stufen: der Oberbegriff ist nicht mehr sichtbar, sondern funktional
  { t: 4,
    items: { de: '⏰ Wecker, 📅 Kalender, ⌛ Sanduhr', ru: '⏰ будильник, 📅 календарь, ⌛ песочные часы', en: '⏰ alarm clock, 📅 calendar, ⌛ hourglass' },
    a: { de: 'Zeitmesser', ru: 'Измерители времени', en: 'Timekeepers' },
    w: { de: ['Möbel','Schmuck','Werkzeuge'], ru: ['Мебель','Украшения','Инструменты'], en: ['Furniture','Jewellery','Tools'] },
    explain: { de: 'Alle drei haben mit dem Messen oder Einteilen von Zeit zu tun', ru: 'Всё это связано со временем', en: 'All three have to do with measuring or dividing time' } },
  { t: 4,
    items: { de: '🐋 Wal, 🦇 Fledermaus, 🐘 Elefant', ru: '🐋 кит, 🦇 летучая мышь, 🐘 слон', en: '🐋 whale, 🦇 bat, 🐘 elephant' },
    a: { de: 'Säugetiere', ru: 'Млекопитающие', en: 'Mammals' },
    w: { de: ['Meerestiere','Fliegende Tiere','Große Tiere'], ru: ['Морские животные','Летающие животные','Большие животные'], en: ['Sea animals','Flying animals','Large animals'] },
    explain: { de: 'Alle drei sind Säugetiere – trotz Wasser, Luft und Land', ru: 'Все трое – млекопитающие', en: 'All three are mammals – despite water, air and land' } },
  { t: 4,
    items: { de: '💧 Wasser, 🥛 Milch, 🍯 Honig', ru: '💧 вода, 🥛 молоко, 🍯 мёд', en: '💧 water, 🥛 milk, 🍯 honey' },
    a: { de: 'Flüssigkeiten', ru: 'Жидкости', en: 'Liquids' },
    w: { de: ['Getränke','Lebensmittel','Süßes'], ru: ['Напитки','Продукты','Сладкое'], en: ['Drinks','Food','Sweets'] },
    explain: { de: 'Honig trinkt man nicht – gemeinsam ist der flüssige Zustand', ru: 'Общее – жидкое состояние', en: 'You do not drink honey – what they share is the liquid state' } },
  { t: 5,
    items: { de: '📕 Buch, 📻 Radio, 💬 Gespräch', ru: '📕 книга, 📻 радио, 💬 разговор', en: '📕 book, 📻 radio, 💬 conversation' },
    a: { de: 'Informationsquellen', ru: 'Источники информации', en: 'Sources of information' },
    w: { de: ['Unterhaltung','Technik','Sprache'], ru: ['Развлечение','Техника','Язык'], en: ['Entertainment','Technology','Language'] },
    explain: { de: 'Über alle drei bekommt man Informationen', ru: 'Через всё это получают информацию', en: 'You receive information through all three' } },
  { t: 5,
    items: { de: '🔑 Schlüssel, 🎫 Eintrittskarte, 🔐 Passwort', ru: '🔑 ключ, 🎫 билет, 🔐 пароль', en: '🔑 key, 🎫 ticket, 🔐 password' },
    a: { de: 'Zugangsmittel', ru: 'Средства доступа', en: 'Means of access' },
    w: { de: ['Wertsachen','Papiere','Metallteile'], ru: ['Ценности','Бумаги','Металлические детали'], en: ['Valuables','Papers','Metal parts'] },
    explain: { de: 'Alle drei verschaffen Zugang zu etwas', ru: 'Всё это даёт доступ', en: 'All three grant access to something' } },
  { t: 5,
    items: { de: '🌡️ Thermometer, ⚖️ Waage, 📏 Lineal', ru: '🌡️ термометр, ⚖️ весы, 📏 линейка', en: '🌡️ thermometer, ⚖️ scale, 📏 ruler' },
    a: { de: 'Messgeräte', ru: 'Измерительные приборы', en: 'Measuring instruments' },
    w: { de: ['Werkzeuge','Küchengeräte','Schulsachen'], ru: ['Инструменты','Кухонные приборы','Школьные принадлежности'], en: ['Tools','Kitchen appliances','School supplies'] },
    explain: { de: 'Alle drei messen eine Größe', ru: 'Все три измеряют величину', en: 'All three measure a quantity' } }
];

const game = createChoiceGame({
  id: 'wiss-oberbegriffe',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 1,

  // Keine Aufgabe zweimal im selben Durchgang – beim zweiten Mal misst
  // sie die Erinnerung an die vorige Antwort, nicht die Fähigkeit.
  roundKey: r => r._key,

  genRound: (gd) => {
    const pool = QUESTIONS.filter(q => q.t === gd.level);
    const list = pool.length ? pool : QUESTIONS;
    const q = list[Math.floor(Math.random() * list.length)];
    const a = pick(q.a);
    const wrong = (q.w ? pick(q.w) : []).map(String);
    const choices = shuffle([a, ...wrong]);

    return {
      prompt: `<div style="text-align:center">
        <p style="font-size:1.12em"><b>${pick(UI.frage)}</b></p>
        <div style="font-size:1.2em;margin:16px 0;padding:16px;background:var(--bg);border-radius:var(--radius-sm);letter-spacing:1px">
          ${pick(q.items)}
        </div>
        <p style="color:var(--text-light);font-size:.95em">${pick(UI.alle)}</p>
      </div>`,
      options: choices.map(c => ({ html: c, label: c })),
      _key: (q.items && q.items.de) || String(a),
      correct: choices.indexOf(a),
      layout: 'list',
      explain: q.explain
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
