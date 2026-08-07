import { t } from '../i18n/i18n-core.js';
import { engine } from '../core/engine.js';

const sets = [
  {items:['🐕','🐈','🐇','🐘','🐟'], odd:4, explain_de:'Fisch lebt im Wasser, die anderen an Land', explain_ru:'Рыба живёт в воде, остальные на суше'},
  {items:['🍎','🍌','🍇','🍞','🍊'], odd:3, explain_de:'Brot ist kein Obst', explain_ru:'Хлеб — не фрукт'},
  {items:['🚗','🚌','🏍️','🚲','✈️'], odd:4, explain_de:'Flugzeug fliegt, die anderen fahren', explain_ru:'Самолёт летает, остальные ездят'},
  {items:['🔴','🔵','🟢','⬛','🔺'], odd:4, explain_de:'Dreieck ist eine Form, keine Farbe', explain_ru:'Треугольник — форма, а не цвет'},
  {items:['👁️','👂','👃','👄','🦶'], odd:4, explain_de:'Fuß ist kein Sinnesorgan im Kopf', explain_ru:'Ступня — не орган чувств на голове'}
];

export function init(gs) {
  const gd = gs.gd || {};
  if (!gd.setIdx) gd.setIdx = 0;
  gd.current = sets[gd.setIdx % sets.length];
  gd.answered = false;
  gs.gd = gd;
  return gs;
}

export function render(gs) {
  const gd = gs.gd;
  if (!gd || !gd.current) { init(gs); return render(gs); }
  if (!gd.answered) {
    return `<p style="font-size:1.1em">❓ <b>${t('findOddOne') || 'Welches Bild passt NICHT zu den anderen?'}</b></p>
      <div class="game-grid">${gd.current.items.map((item,i) => 
        `<div class="game-card-item" onclick="window._checkKonzept(${i},this)">${item}</div>`
      ).join('')}</div>`;
  }
  return gd.feedback || '';
}

window._checkKonzept = function(idx, el) {
  const gs = engine.gameState;
  const gd = gs.gd;
  gs.total = (gs.total || 0) + 1;
  const ok = idx === gd.current.odd;
  const lang = document.documentElement.lang || 'de';
  const explain = lang === 'ru' ? gd.current.explain_ru : gd.current.explain_de;
  if (ok) {
    gs.score = (gs.score || 0) + 1;
    gd.feedback = `<div class="feedback-banner feedback-correct">${t('correct')} ${explain}</div>`;
    el.classList.add('correct');
  } else {
    gd.feedback = `<div class="feedback-banner feedback-wrong">${t('wrong')} ${explain}</div>`;
    el.classList.add('wrong');
  }
  gd.answered = true;
  gd.setIdx++;
  engine.render();
};
