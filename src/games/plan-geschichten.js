/**
 * Reihenfolge legen (KABC-II: „Geschichten ergänzen")
 *
 * Der Platzhalter hier hatte einen berechtigten Einwand: mit Emoji lässt
 * sich keine *erzählte* Geschichte eindeutig ordnen. „Kind weint – Mutter
 * kommt – Kind lacht" ließe sich ebenso gut umgekehrt lesen, und dann misst
 * die Aufgabe, ob jemand dieselbe Geschichte im Kopf hat wie der Autor.
 *
 * Bei Abläufen, die in der Welt eine Richtung haben, gilt das nicht: eine
 * Raupe wird zum Schmetterling und nicht umgekehrt, der Mond nimmt in einer
 * Richtung zu, ein Kind wird älter. Genau solche Folgen stehen unten – die
 * Reihenfolge ist dann keine Auslegung, sondern nachprüfbar.
 *
 * Bedient wird mit core/drag.js: ein Bild aufnehmen, an einen Platz legen,
 * bei Bedarf wieder zurück in den Vorrat. Das ist zugleich das erste Modul,
 * das diese Bedienung benutzt.
 */
import { engine } from '../core/engine.js';
import { shuffle, sample, pick, lang, esc } from '../core/html.js';
import { countRound, resultScreen } from '../core/session.js';
import { registerModuleSettings, modGet } from '../core/settings.js';
import { bar, pictogram } from '../core/shell.js';
import { inDerHand, dragAufraeumen } from '../core/drag.js';
import * as settings from '../core/settings.js';

const ID = 'plan-geschichten';

export const settingsSchema = {
  sekProBild: {
    def: 15, min: 5, max: 60, step: 1, unit: 's',
    de: 'Zeit je Bild', ru: 'Время на картинку', en: 'Time per picture',
    hintDe: 'Die Gesamtzeit ergibt sich aus der Zahl der Bilder. Läuft sie ab, zählt die Aufgabe als nicht gelöst.',
    hintRu: 'Общее время складывается из числа картинок. Если оно истекло, задание считается нерешённым.',
    hintEn: 'Total time follows from the number of pictures. When it runs out, the task counts as unsolved.'
  }
};
registerModuleSettings(ID, settingsSchema);

const UI = {
  frage:    { de: '📖 Bring die Bilder in die richtige Reihenfolge', ru: '📖 Расставь картинки по порядку', en: '📖 Put the pictures in the right order' },
  nimm:     { de: 'Tippe ein Bild an, dann den Platz – oder zieh es hinüber.',
              ru: 'Нажми на картинку, потом на место — или перетащи её.',
              en: 'Tap a picture, then a slot – or drag it across.' },
  legZurueck:{ de: 'Nochmal antippen legt es zurück.', ru: 'Нажми ещё раз, чтобы вернуть.', en: 'Tap again to put it back.' },
  vorrat:   { de: 'Bilder', ru: 'Картинки', en: 'Pictures' },
  reihe:    { de: 'Reihenfolge', ru: 'Порядок', en: 'Order' },
  richtig:  { de: 'So gehört es:', ru: 'Правильный порядок:', en: 'The right order is:' }
};
const u = k => pick(UI[k]);

/**
 * Folgen mit einer Richtung, die in der Welt liegt und nicht in der Deutung.
 * `t` ist die Stufe, `bilder` steht in der richtigen Reihenfolge.
 */
const FOLGEN = [
  { t: 1, bilder: ['1️⃣','2️⃣','3️⃣'], warum: { de: 'Die Zahlen zählen aufwärts.', ru: 'Числа идут по возрастанию.', en: 'The numbers count upwards.' } },
  { t: 1, bilder: ['🥚','🐣','🐔'], warum: { de: 'Aus dem Ei schlüpft das Küken, daraus wird das Huhn.', ru: 'Из яйца вылупляется цыплёнок, из него вырастает курица.', en: 'The chick hatches from the egg and becomes a hen.' } },
  { t: 1, bilder: ['🌱','🌿','🌳'], warum: { de: 'Aus dem Keim wird die Pflanze, daraus der Baum.', ru: 'Из ростка вырастает растение, затем дерево.', en: 'The sprout becomes a plant, then a tree.' } },
  { t: 1, bilder: ['🐛','🛌','🦋'], warum: { de: 'Die Raupe verpuppt sich und wird zum Schmetterling.', ru: 'Гусеница окукливается и становится бабочкой.', en: 'The caterpillar pupates and becomes a butterfly.' } },
  { t: 1, bilder: ['🌰','🌱','🌳'], warum: { de: 'Aus der Nuss wächst der Keim, daraus der Baum.', ru: 'Из ореха прорастает росток, затем дерево.', en: 'The nut sprouts and grows into a tree.' } },

  { t: 2, bilder: ['👶','🧒','🧑','🧓'], warum: { de: 'Ein Mensch wird älter.', ru: 'Человек становится старше.', en: 'A person grows older.' } },
  { t: 2, bilder: ['🌅','☀️','🌇','🌙'], warum: { de: 'So läuft ein Tag ab.', ru: 'Так проходит день.', en: 'That is how a day goes.' } },
  { t: 2, bilder: ['1️⃣','2️⃣','3️⃣','4️⃣'], warum: { de: 'Die Zahlen zählen aufwärts.', ru: 'Числа идут по возрастанию.', en: 'The numbers count upwards.' } },
  { t: 2, bilder: ['🧊','💧','💨'], warum: { de: 'Eis schmilzt zu Wasser, Wasser wird zu Dampf.', ru: 'Лёд тает в воду, вода превращается в пар.', en: 'Ice melts into water, water turns into vapour.' } },
  { t: 2, bilder: ['🐜','🐁','🐕','🐘'], warum: { de: 'Die Tiere werden größer.', ru: 'Животные становятся крупнее.', en: 'The animals get bigger.' } },

  { t: 3, bilder: ['🌑','🌓','🌕','🌗'], warum: { de: 'So nimmt der Mond zu und wieder ab.', ru: 'Так луна прибывает и убывает.', en: 'That is how the moon waxes and wanes.' } },
  { t: 3, bilder: ['🌸','🍏','🍎','🥧'], warum: { de: 'Aus der Blüte wird die Frucht, daraus der Kuchen.', ru: 'Из цветка получается плод, из него пирог.', en: 'The blossom becomes fruit, the fruit becomes a pie.' } },
  { t: 3, bilder: ['🕐','🕒','🕕','🕘'], warum: { de: 'Die Uhr geht vorwärts.', ru: 'Часы идут вперёд.', en: 'The clock moves forward.' } },
  { t: 3, bilder: ['🌾','🌾','🍞','🥪'], warum: { de: 'Aus Korn wird Brot, daraus das Brot mit Belag.', ru: 'Из зерна получается хлеб, из него бутерброд.', en: 'Grain becomes bread, bread becomes a sandwich.' } },
  { t: 3, bilder: ['🥚','🐛','🦋','🌸'], warum: { de: 'Ei, Raupe, Falter – und der Falter besucht die Blüte.', ru: 'Яйцо, гусеница, бабочка — и бабочка садится на цветок.', en: 'Egg, caterpillar, butterfly – and the butterfly visits the blossom.' } },

  { t: 4, bilder: ['🌑','🌒','🌓','🌔','🌕'], warum: { de: 'Der Mond nimmt Schritt für Schritt zu.', ru: 'Луна прибывает шаг за шагом.', en: 'The moon waxes step by step.' } },
  { t: 4, bilder: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'], warum: { de: 'Die Zahlen zählen aufwärts.', ru: 'Числа идут по возрастанию.', en: 'The numbers count upwards.' } },
  { t: 4, bilder: ['🐜','🐁','🐈','🐕','🐘'], warum: { de: 'Die Tiere werden größer.', ru: 'Животные становятся крупнее.', en: 'The animals get bigger.' } },
  { t: 4, bilder: ['🌰','🌱','🌿','🌳','🪵'], warum: { de: 'Aus der Nuss wird der Baum, aus dem Baum das Holz.', ru: 'Из ореха вырастает дерево, из дерева получается древесина.', en: 'The nut becomes a tree, the tree becomes timber.' } },

  { t: 5, bilder: ['🥚','🐛','🛌','🦋','🌸','🥚'], warum: { de: 'Der Kreislauf beginnt von vorn.', ru: 'Круг начинается заново.', en: 'The cycle starts over.' } },
  { t: 5, bilder: ['🌱','🌿','🌳','🍎','🥧','😋'], warum: { de: 'Vom Keim bis zum aufgegessenen Kuchen.', ru: 'От ростка до съеденного пирога.', en: 'From sprout to the eaten pie.' } },
  { t: 5, bilder: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣'], warum: { de: 'Die Zahlen zählen aufwärts.', ru: 'Числа идут по возрастанию.', en: 'The numbers count upwards.' } }
];

let timer = null;
const clearTimer = () => { if (timer) { clearTimeout(timer); timer = null; } };
const aktiv = () => !!(engine.activeGame && engine.activeGame.id === ID);

function neueAufgabe(gs) {
  const gd = gs.gd;
  const stufe = Math.max(1, Math.min(5, gd.level || 1));
  const pool = FOLGEN.filter(f => f.t === stufe);
  const f = (pool.length ? pool : FOLGEN)[Math.floor(Math.random() * (pool.length || FOLGEN.length))];

  // Jedes Bild bekommt eine eigene Kennung: dieselbe Frucht darf zweimal
  // vorkommen (der Kreislauf endet, wo er anfing), und zwei gleiche Bilder
  // wären sonst nicht auseinanderzuhalten.
  gd.loesung = f.bilder.map((b, i) => ({ id: 'b' + i, bild: b }));
  gd.warum = f.warum;
  gd.vorrat = shuffle(gd.loesung.map(x => x.id));
  gd.plaetze = Array(gd.loesung.length).fill(null);
  gd.phase = 'legen';
  gd.phaseStart = Date.now();
  gd.frist = gd.loesung.length * modGet(ID, 'sekProBild') * 1000;

  clearTimer();
  timer = setTimeout(() => { if (aktiv()) auswerten(gs); }, gd.frist);
}

export function init(gs) {
  const gd = gs.gd || {};
  gs.gd = gd;
  gd.level = gd.level || 1;
  gd._ready = true;
  neueAufgabe(gs);
  return gs;
}

export function dispose(gs) {
  clearTimer();
  dragAufraeumen();
  if (gs && gs.gd) gs.gd._ready = false;
}

const bildVon = (gd, id) => (gd.loesung.find(x => x.id === id) || {}).bild || '';

export function render(gs) {
  let gd = gs.gd;
  if (!gd || !gd._ready) { init(gs); gd = gs.gd; }

  if (gd.phase === 'fertig') return resultScreen(gs, { score: gs.score, total: gs.total });

  if (gd.phase === 'feedback') {
    return `<div data-phase="feedback" style="text-align:center;width:100%">
      ${pictogram(gd.geloest ? '✅' : '❌')}
      ${gd.geloest ? '' : `<div style="margin-top:14px">
        <div style="font-size:.85em;color:var(--text-light);margin-bottom:6px">${esc(u('richtig'))}</div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          ${gd.loesung.map(x => `<span style="font-size:calc(2em * var(--pic))">${x.bild}</span>`).join('')}
        </div>
        <p style="font-size:.85em;color:var(--text-light);margin-top:10px;max-width:340px;
                  margin-left:auto;margin-right:auto">${esc(pick(gd.warum))}</p>
      </div>`}
    </div>`;
  }

  const hand = inDerHand();
  const kachel = (id, extra) => {
    const gewaehlt = hand === id;
    return `<div class="pick-target" data-zieh="${id}" style="
      width:calc(34px * var(--pic));height:calc(34px * var(--pic));border-radius:14px;
      display:flex;align-items:center;justify-content:center;font-size:calc(1.7em * var(--pic));
      background:${gewaehlt ? '#EBE9FF' : 'var(--bg)'};
      border:2px solid ${gewaehlt ? 'var(--primary)' : '#D0CDE8'};
      ${gewaehlt ? 'transform:scale(1.06);box-shadow:0 4px 14px rgba(91,79,207,.3)' : ''}
      cursor:grab;touch-action:none;user-select:none;${extra || ''}">${bildVon(gd, id)}</div>`;
  };

  const vorrat = gd.vorrat.map(id => kachel(id)).join('');
  const plaetze = gd.plaetze.map((id, i) => id
    ? kachel(id)
    : `<div class="pick-target" data-ablage="platz:${i}" style="
        width:calc(34px * var(--pic));height:calc(34px * var(--pic));border-radius:14px;
        border:2px dashed ${hand ? 'var(--primary)' : '#D8D4EE'};
        background:${hand ? '#F6F5FF' : 'transparent'};
        display:flex;align-items:center;justify-content:center;
        font-size:calc(.9em * var(--pic));color:var(--text-light)">${i + 1}</div>`
  ).join('');

  return `<div data-phase="legen" style="width:100%;max-width:560px">
    <p style="font-size:1.05em;text-align:center">${esc(u('frage'))}</p>
    <p style="font-size:.82em;color:var(--text-light);text-align:center;margin-bottom:14px">
      ${esc(hand ? u('legZurueck') : u('nimm'))}
    </p>

    <div style="font-size:.75em;color:var(--text-light);margin-bottom:4px">${esc(u('reihe'))}</div>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;
                padding:10px;background:#F8F7FF;border-radius:14px;min-height:52px">${plaetze}</div>

    <div style="font-size:.75em;color:var(--text-light);margin:14px 0 4px">${esc(u('vorrat'))}</div>
    <div data-ablage="vorrat" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;
                min-height:52px;padding:10px;border-radius:14px;
                border:2px dashed ${hand ? 'var(--primary)' : 'transparent'};
                background:${hand ? '#F6F5FF' : 'transparent'}">${vorrat}</div>

    ${bar(Date.now() - (gd.phaseStart || Date.now()), gd.frist || 1)}
  </div>`;
}

/**
 * Ein Zug: Bild von dort, wo es liegt, nach `ziel`.
 *
 * Die Bedienung sagt nur, was wohin soll; wo das Bild gerade steckt, weiß
 * allein dieses Modul. Ist der Zielplatz besetzt, wandert der Bewohner in den
 * Vorrat zurück – Tauschen wäre für ein Kind schwerer nachzuvollziehen als
 * „das andere kommt zurück in die Kiste".
 */
export const actions = {
  verschiebe(gs, stueck, ziel) {
    const gd = gs.gd;
    if (!gd || gd.phase !== 'legen') return false;

    // Herausnehmen, wo immer es liegt
    const vorIndex = gd.plaetze.indexOf(stueck);
    if (vorIndex >= 0) gd.plaetze[vorIndex] = null;
    gd.vorrat = gd.vorrat.filter(x => x !== stueck);

    if (ziel === 'vorrat') {
      gd.vorrat.push(stueck);
    } else {
      const i = Number(String(ziel).split(':')[1]);
      if (!Number.isInteger(i) || i < 0 || i >= gd.plaetze.length) { gd.vorrat.push(stueck); return; }
      const bewohner = gd.plaetze[i];
      if (bewohner) gd.vorrat.push(bewohner);
      gd.plaetze[i] = stueck;
    }

    // Alle Plätze belegt: das ist die Antwort, ein zusätzlicher Knopf sagt
    // nichts, was das volle Feld nicht schon sagt.
    if (gd.plaetze.every(x => x !== null)) auswerten(gs);
  },

  restart(gs) {
    clearTimer();
    dragAufraeumen();
    gs.gd = { level: 1 };
    gs.score = 0; gs.total = 0; gs.rounds = 0;
    init(gs);
  }
};

function auswerten(gs) {
  const gd = gs.gd;
  if (!gd || gd.phase !== 'legen') return;
  clearTimer();
  dragAufraeumen();

  const vollstaendig = gd.plaetze.every(x => x !== null);
  const geloest = vollstaendig && gd.plaetze.every((id, i) => id === gd.loesung[i].id);

  gs.total = (gs.total || 0) + 1;
  if (geloest) {
    gs.score = (gs.score || 0) + 1;
    if (gd.level < 5) gd.level++;
  } else if (gd.level > 1) {
    gd.level--;
  }

  gd.geloest = geloest;
  gd.phase = 'feedback';
  const vorbei = countRound(gs);
  engine.renderGame();

  timer = setTimeout(() => {
    if (!aktiv()) return;
    if (vorbei) gd.phase = 'fertig';
    else neueAufgabe(gs);
    engine.renderGame();
  }, Math.round(settings.get(geloest ? 'feedbackOk' : 'feedbackWrong') * 1000) + (geloest ? 0 : 1200));
}

export const scoring = 'count';
export const instruction = {
  de: 'Die Bilder gehören in eine bestimmte Reihenfolge. Tippe ein Bild an und dann den Platz, wohin es soll – oder zieh es einfach hinüber. Nochmal antippen legt es zurück.',
  ru: 'Картинки должны стоять в определённом порядке. Нажми на картинку, потом на место, куда она пойдёт, — или просто перетащи её. Нажми ещё раз, чтобы вернуть.',
  en: 'The pictures belong in a particular order. Tap a picture and then the slot it should go to – or simply drag it across. Tap it again to put it back.'
};
