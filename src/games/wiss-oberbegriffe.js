/**
 * Oberbegriffe finden – Kategorisierungsfähigkeit
 *
 * Migriert auf core/choice.js; die Optionen werden jetzt gemischt und die
 * Fragen sind nach Abstraktionsgrad gestaffelt (Niveau 4/5 verlangen
 * Oberbegriffe, die nicht mehr am Aussehen ablesbar sind).
 */
import { createChoiceGame } from '../core/choice.js';
import { shuffle } from '../core/html.js';

const QUESTIONS = [
  { t: 1, items: '🍎 Apfel, 🍌 Banane, 🍊 Orange', a: 'Obst', w: ['Gemüse','Süßigkeiten','Getränke'],
    de: 'Obst – alles sind Früchte', ru: 'Фрукты – всё это фрукты' },
  { t: 1, items: '🐕 Hund, 🐈 Katze, 🐇 Hase', a: 'Tiere', w: ['Pflanzen','Fahrzeuge','Möbel'],
    de: 'Tiere – alles sind Haustiere', ru: 'Животные – всё это домашние животные' },
  { t: 1, items: '🚗 Auto, 🚌 Bus, 🚲 Fahrrad', a: 'Fahrzeuge', w: ['Tiere','Gebäude','Werkzeuge'],
    de: 'Fahrzeuge – alles fährt', ru: 'Транспорт – всё это ездит' },
  { t: 2, items: '🪑 Stuhl, 🛏️ Bett, 📦 Schrank', a: 'Möbel', w: ['Spielzeug','Kleidung','Essen'],
    de: 'Möbel – alles sind Einrichtungsgegenstände', ru: 'Мебель – всё это предметы интерьера' },
  { t: 2, items: '👚 T-Shirt, 👖 Hose, 🧥 Jacke', a: 'Kleidung', w: ['Möbel','Spielzeug','Schuhe'],
    de: 'Kleidung – alles zieht man an', ru: 'Одежда – всё это надевают' },
  { t: 2, items: '⚽ Fußball, 🏀 Basketball, 🎾 Tennis', a: 'Sport', w: ['Musik','Essen','Filme'],
    de: 'Sport – alles sind Sportarten', ru: 'Спорт – всё это виды спорта' },
  { t: 3, items: '🥁 Trommel, 🎸 Gitarre, 🎹 Klavier', a: 'Musikinstrumente', w: ['Sport','Werkzeuge','Essen'],
    de: 'Musikinstrumente – alle machen Musik', ru: 'Музыкальные инструменты – все издают музыку' },
  { t: 3, items: '🔨 Hammer, 🪚 Säge, 🔧 Schraubenzieher', a: 'Werkzeuge', w: ['Spielzeug','Küchengeräte','Möbel'],
    de: 'Werkzeuge – alle benutzt man zum Bauen', ru: 'Инструменты – всё для строительства' },
  { t: 3, items: '🌧️ Regen, ❄️ Schnee, ☀️ Sonne', a: 'Wetter', w: ['Tiere','Essen','Farben'],
    de: 'Wetter – alles sind Wettererscheinungen', ru: 'Погода – всё это погодные явления' },
  { t: 3, items: '🥛 Milch, 🧃 Saft, ☕ Tee', a: 'Getränke', w: ['Speisen','Suppen','Soßen'],
    de: 'Getränke – alles kann man trinken', ru: 'Напитки – всё это можно пить' },
  // Höhere Stufen: der Oberbegriff ist nicht mehr sichtbar, sondern funktional
  { t: 4, items: '⏰ Wecker, 📅 Kalender, ⌛ Sanduhr', a: 'Zeitmesser', w: ['Möbel','Schmuck','Werkzeuge'],
    de: 'Alle drei haben mit dem Messen oder Einteilen von Zeit zu tun', ru: 'Всё это связано со временем' },
  { t: 4, items: '🐋 Wal, 🦇 Fledermaus, 🐘 Elefant', a: 'Säugetiere', w: ['Meerestiere','Fliegende Tiere','Große Tiere'],
    de: 'Alle drei sind Säugetiere – trotz Wasser, Luft und Land', ru: 'Все трое – млекопитающие' },
  { t: 4, items: '💧 Wasser, 🥛 Milch, 🍯 Honig', a: 'Flüssigkeiten', w: ['Getränke','Lebensmittel','Süßes'],
    de: 'Honig trinkt man nicht – gemeinsam ist der flüssige Zustand', ru: 'Общее – жидкое состояние' },
  { t: 5, items: '📕 Buch, 📻 Radio, 💬 Gespräch', a: 'Informationsquellen', w: ['Unterhaltung','Technik','Sprache'],
    de: 'Über alle drei bekommt man Informationen', ru: 'Через всё это получают информацию' },
  { t: 5, items: '🔑 Schlüssel, 🎫 Eintrittskarte, 🔐 Passwort', a: 'Zugangsmittel', w: ['Wertsachen','Papiere','Metallteile'],
    de: 'Alle drei verschaffen Zugang zu etwas', ru: 'Всё это даёт доступ' },
  { t: 5, items: '🌡️ Thermometer, ⚖️ Waage, 📏 Lineal', a: 'Messgeräte', w: ['Werkzeuge','Küchengeräte','Schulsachen'],
    de: 'Alle drei messen eine Größe', ru: 'Все три измеряют величину' }
];

const game = createChoiceGame({
  id: 'wiss-oberbegriffe',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 1,

  genRound: (gd) => {
    const pool = QUESTIONS.filter(q => q.t === gd.level);
    const list = pool.length ? pool : QUESTIONS;
    const q = list[Math.floor(Math.random() * list.length)];
    const choices = shuffle([q.a, ...q.w]);

    return {
      prompt: `<div style="text-align:center">
        <p style="font-size:1.12em"><b>🏷️ Was haben diese gemeinsam?</b></p>
        <div style="font-size:1.2em;margin:16px 0;padding:16px;background:var(--bg);border-radius:var(--radius-sm);letter-spacing:1px">
          ${q.items}
        </div>
        <p style="color:var(--text-light);font-size:.95em">Sie sind alle …</p>
      </div>`,
      options: choices.map(c => ({ html: c, label: c })),
      correct: choices.indexOf(q.a),
      layout: 'list',
      explain: { de: q.de, ru: q.ru }
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
