/**
 * Was passt nicht? – 5 Bilder, eins passt nicht. Per Klick auswählen.
 * 12 Sets rotierend, kindgerechte Emoji-Bilder.
 */
import { t } from '../i18n/i18n-core.js';
import { engine } from '../core/engine.js';

const SETS = [
  { items:['🐕','🐈','🐇','🐘','🐟'], odd:4,
    de:'Der Fisch 🐟 lebt im Wasser – die anderen an Land',
    ru:'Рыба 🐟 живёт в воде – остальные на суше' },
  { items:['🍎','🍌','🍇','🍞','🍊'], odd:3,
    de:'Das Brot 🍞 ist kein Obst',
    ru:'Хлеб 🍞 – не фрукт' },
  { items:['🚗','🚌','🏍️','🚲','✈️'], odd:4,
    de:'Das Flugzeug ✈️ fliegt – die anderen fahren',
    ru:'Самолёт ✈️ летает – остальные ездят' },
  { items:['🔴','🔵','🟢','⬛','🔺'], odd:4,
    de:'Das Dreieck 🔺 ist eine Form, keine Farbe',
    ru:'Треугольник 🔺 – форма, а не цвет' },
  { items:['👁️','👂','👃','👄','🦶'], odd:4,
    de:'Der Fuß 🦶 ist kein Sinnesorgan im Kopf',
    ru:'Ступня 🦶 – не орган чувств на голове' },
  { items:['🌞','🌙','⭐','☁️','🐟'], odd:4,
    de:'Der Fisch 🐟 gehört nicht zum Himmel',
    ru:'Рыба 🐟 не относится к небу' },
  { items:['🎸','🥁','🎹','🎺','📕'], odd:4,
    de:'Das Buch 📕 ist kein Musikinstrument',
    ru:'Книга 📕 – не музыкальный инструмент' },
  { items:['⚽','🏀','🎾','🏈','🍕'], odd:4,
    de:'Die Pizza 🍕 ist kein Sportgerät',
    ru:'Пицца 🍕 – не спортивный предмет' },
  { items:['🥛','☕','🍵','🧃','🧦'], odd:4,
    de:'Die Socke 🧦 ist kein Getränk',
    ru:'Носок 🧦 – не напиток' },
  { items:['🌲','🌿','🌻','🍄','🐍'], odd:4,
    de:'Die Schlange 🐍 ist ein Tier, keine Pflanze',
    ru:'Змея 🐍 – животное, а не растение' },
  { items:['👚','👖','🧥','👗','🍔'], odd:4,
    de:'Der Burger 🍔 ist keine Kleidung',
    ru:'Бургер 🍔 – не одежда' },
  { items:['🛏️','🪑','📺','🛁','🍦'], odd:4,
    de:'Das Eis 🍦 ist kein Möbelstück',
    ru:'Мороженое 🍦 – не мебель' },
];

export function init(gs) {
  const gd = gs.gd || {};
  if (gd.setIdx === undefined) gd.setIdx = 0;
  gd.current = SETS[gd.setIdx % SETS.length];
  gd.answered = false;
  gd.userPick = null;
  gs.gd = gd;
  return gs;
}

export function render(gs) {
  const gd = gs.gd;
  if (!gd || !gd.current) { init(gs); return render(gs); }

  if (!gd.answered) {
    return `<div style="width:100%;max-width:550px">
      <p style="font-size:1.2em">❓ <b>Welches Bild passt NICHT zu den anderen?</b></p>
      <p style="color:var(--text-light);font-size:0.9em;margin-bottom:12px">Tippe auf das Bild, das anders ist</p>
      
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:16px 0">
        ${gd.current.items.map((item, i) => {
          const selected = gd.userPick === i;
          return `<div onclick="window._pickKonzept(${i},this)" style="width:80px;height:80px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:2.5em;cursor:pointer;border:3px solid ${selected?'var(--primary)':'#E0DDF5'};background:${selected?'#EBE9FF':'#fff'};transition:all 0.2s">${item}</div>`;
        }).join('')}
      </div>

      <button class="btn btn-primary btn-small" onclick="window._checkKonzeptGame()" ${gd.userPick===null?'disabled style="opacity:0.5"':''}>✅ Diese${gd.userPick!==null?'s':'s'} Bild passt nicht!</button>
    </div>`;
  }

  return gd.feedback || '';
}

window._pickKonzept = function(idx, el) {
  engine.gameState.gd.userPick = idx;
  engine.render();
};

window._checkKonzeptGame = function() {
  const gs = engine.gameState;
  const gd = gs.gd;
  if (gd.userPick === null) return;
  
  gs.total = (gs.total || 0) + 1;
  const correct = gd.userPick === gd.current.odd;
  const lang = document.documentElement.lang || 'de';
  const explain = lang === 'ru' ? gd.current.ru : gd.current.de;
  
  if (correct) {
    gs.score = (gs.score || 0) + 1;
    gd.feedback = `<div class="feedback-banner feedback-correct">🎉 Richtig! ${explain}</div>`;
  } else {
    gd.feedback = `<div class="feedback-banner feedback-wrong">😔 ${explain}</div>`;
  }
  gd.answered = true;
  gd.setIdx++;
  engine.render();
};
