/**
 * Oberbegriffe finden – 3 Wörter, 4 Optionen, Multiple-Choice per Klick
 */
import { t } from '../i18n/i18n-core.js';
import { engine } from '../core/engine.js';

const QUESTIONS = [
  { items:'🍎 Apfel, 🍌 Banane, 🍊 Orange', opts:['Obst','Gemüse','Süßigkeiten','Getränke'], answer:0,
    de:'Obst – alles sind Früchte', ru:'Фрукты – всё это фрукты' },
  { items:'🐕 Hund, 🐈 Katze, 🐇 Hase', opts:['Pflanzen','Tiere','Fahrzeuge','Möbel'], answer:1,
    de:'Tiere – alles sind Haustiere', ru:'Животные – всё это домашние животные' },
  { items:'🚗 Auto, 🚌 Bus, 🚲 Fahrrad', opts:['Tiere','Gebäude','Fahrzeuge','Werkzeuge'], answer:2,
    de:'Fahrzeuge – alles fährt', ru:'Транспорт – всё это ездит' },
  { items:'🪑 Stuhl, 🛏️ Bett, 📦 Schrank', opts:['Spielzeug','Kleidung','Essen','Möbel'], answer:3,
    de:'Möbel – alles sind Einrichtungsgegenstände', ru:'Мебель – всё это предметы интерьера' },
  { items:'👚 T-Shirt, 👖 Hose, 🧥 Jacke', opts:['Möbel','Kleidung','Spielzeug','Schuhe'], answer:1,
    de:'Kleidung – alles zieht man an', ru:'Одежда – всё это надевают' },
  { items:'⚽ Fußball, 🏀 Basketball, 🎾 Tennis', opts:['Musik','Essen','Sport','Filme'], answer:2,
    de:'Sport – alles sind Sportarten', ru:'Спорт – всё это виды спорта' },
  { items:'🥁 Trommel, 🎸 Gitarre, 🎹 Klavier', opts:['Sport','Musikinstrumente','Werkzeuge','Essen'], answer:1,
    de:'Musikinstrumente – alle machen Musik', ru:'Музыкальные инструменты – все издают музыку' },
  { items:'🔨 Hammer, 🪚 Säge, 🔧 Schraubenzieher', opts:['Spielzeug','Küchengeräte','Werkzeuge','Möbel'], answer:2,
    de:'Werkzeuge – alle benutzt man zum Bauen', ru:'Инструменты – всё для строительства' },
  { items:'🌧️ Regen, ❄️ Schnee, ☀️ Sonne', opts:['Tiere','Essen','Farben','Wetter'], answer:3,
    de:'Wetter – alles sind Wettererscheinungen', ru:'Погода – всё это погодные явления' },
  { items:'🥛 Milch, 🧃 Saft, ☕ Tee', opts:['Speisen','Getränke','Suppen','Soßen'], answer:1,
    de:'Getränke – alles kann man trinken', ru:'Напитки – всё это можно пить' },
];

export function init(gs) {
  const gd = gs.gd || {};
  if (gd.qIdx === undefined) gd.qIdx = 0;
  gd.current = QUESTIONS[gd.qIdx % QUESTIONS.length];
  gd.answered = false;
  gd.userPick = null;
  gs.gd = gd;
  return gs;
}

export function render(gs) {
  const gd = gs.gd;
  if (!gd || !gd.current) { init(gs); return render(gs); }

  if (!gd.answered) {
    return `<div style="width:100%;max-width:500px">
      <p style="font-size:1.2em">🏷️ <b>Was haben diese gemeinsam?</b></p>
      <div style="font-size:1.3em;margin:16px 0;padding:16px;background:var(--bg);border-radius:var(--radius-sm);text-align:center;letter-spacing:2px">
        ${gd.current.items}
      </div>
      <p style="color:var(--text-light);font-size:0.95em">Sie sind alle...</p>
      <div class="options-vertical">
        ${gd.current.opts.map((o, i) => {
          const sel = gd.userPick === i;
          return `<button class="option-btn${sel?' option-correct':''}" onclick="window._pickOberbegriff(${i},this)">${o}</button>`;
        }).join('')}
      </div>
      <button class="btn btn-primary btn-small" onclick="window._checkOberbegriff()" style="margin-top:8px" ${gd.userPick===null?'disabled':''}>✅ Das ist es!</button>
    </div>`;
  }

  return gd.feedback || '';
}

window._pickOberbegriff = function(idx, el) {
  engine.gameState.gd.userPick = idx;
  engine.render();
};

window._checkOberbegriff = function() {
  const gs = engine.gameState;
  const gd = gs.gd;
  if (gd.userPick === null) return;
  
  gs.total = (gs.total || 0) + 1;
  const correct = gd.userPick === gd.current.answer;
  const lang = document.documentElement.lang || 'de';
  const explain = lang === 'ru' ? gd.current.ru : gd.current.de;
  
  if (correct) {
    gs.score = (gs.score || 0) + 1;
    gd.feedback = `<div class="feedback-banner feedback-correct">🎉 Richtig! ${explain}</div>`;
  } else {
    gd.feedback = `<div class="feedback-banner feedback-wrong">😔 ${explain}</div>`;
  }
  gd.answered = true;
  gd.qIdx++;
  engine.render();
};
