/**
 * Tangram: sieben Standardteile auf feste Slots einer Silhouette legen.
 *
 * Die Figur ist nur als dunkle Gesamtkontur zu sehen – keine Kreise, keine
 * Innenlinien, die verraten, welches Teil wohin gehört. Gelegt wird weiter
 * auf unsichtbare Slots (kein freies Pixel-Schieben).
 */
import { engine } from '../core/engine.js';
import { shuffle, pick, esc } from '../core/html.js';
import { countRound, resultScreen } from '../core/session.js';
import { registerModuleSettings, modGet } from '../core/settings.js';
import { bar } from '../core/shell.js';
import { inDerHand, dragAufraeumen } from '../core/drag.js';
import * as settings from '../core/settings.js';

const ID = 'sim-tangram';

export const settingsSchema = {
  sekProTeil: {
    def: 20, min: 8, max: 60, step: 1, unit: 's',
    de: 'Zeit je Teil', ru: 'Время на деталь', en: 'Time per piece',
    hintDe: 'Gesamtzeit = 7 × dieser Wert. Läuft sie ab, zählt die Figur als ungelöst.',
    hintRu: 'Общее время = 7 × это значение. По истечении фигура не решена.',
    hintEn: 'Total time is 7 × this value. When it runs out the figure counts as unsolved.'
  }
};
registerModuleSettings(ID, settingsSchema);

const UI = {
  frage: { de: 'Lege die sieben Teile auf die Figur', ru: 'Сложи семь деталей на фигуру', en: 'Place the seven pieces on the figure' },
  nimm:  { de: 'Tippe ein Teil an, drehe es bei Bedarf, dann den passenden Platz.',
           ru: 'Нажми деталь, при необходимости поверни, затем нужное место.',
           en: 'Tap a piece, rotate if needed, then the matching slot.' },
  zurueck:{ de: 'Nochmal antippen oder auf den Vorrat legen gibt es zurück.',
            ru: 'Повторное нажатие или склад возвращает деталь.',
            en: 'Tap again or drop on the tray to put it back.' },
  vorrat: { de: 'Teile', ru: 'Детали', en: 'Pieces' },
  drehe:  { de: 'Drehen 45°', ru: 'Поворот 45°', en: 'Rotate 45°' },
  spiegle:{ de: 'Spiegeln', ru: 'Отразить', en: 'Flip' },
  figur:  { de: 'Figur', ru: 'Фигура', en: 'Figure' }
};
const u = k => pick(UI[k]);

/** Lokale Geometrie der sieben Typen (viewBox 0 0 40 40, Spitze/Kante sinnvoll). */
const GEO = {
  LT: { pts: '2,38 38,38 20,2', color: '#5B4FCF' },
  MT: { pts: '4,36 36,36 20,8', color: '#7C73E0' },
  ST: { pts: '6,34 34,34 20,12', color: '#9B94EA' },
  SQ: { pts: '8,8 32,8 32,32 8,32', color: '#E07A3D' },
  PA: { pts: '4,28 20,8 36,8 20,28', color: '#3DA87C' }
};

const TYPEN = ['LT', 'LT', 'MT', 'ST', 'ST', 'SQ', 'PA'];
const IDS = ['lt1', 'lt2', 'mt1', 'st1', 'st2', 'sq1', 'pa1'];
const TYP_VON = Object.fromEntries(IDS.map((id, i) => [id, TYPEN[i]]));

/**
 * Figuren: slots = { typ, rot, okRot, x, y } in viewBox 0 0 200 160.
 * x/y ist die Slot-Mitte. rot in 45°-Schritten. Parallelogramm: flip 0|1.
 */
function S(typ, rot, x, y, okRot, flip, okFlip) {
  const o = { typ, rot, x, y, okRot: okRot || [rot] };
  if (typ === 'PA') {
    o.flip = flip || 0;
    o.okFlip = okFlip || [o.flip];
  }
  return o;
}

const FIGUREN = [
  // Stufe 1 — konvex, Innenlinien sichtbar
  { id: 'quadrat', t: 1, name: { de: 'Quadrat', ru: 'Квадрат', en: 'Square' },
    slots: [
      S('LT', 0, 70, 90, [0, 180]), S('LT', 180, 130, 70, [180, 0]),
      S('MT', 90, 150, 110, [90, 270]), S('ST', 0, 50, 50, [0, 180]),
      S('ST', 180, 90, 50, [180, 0]), S('SQ', 0, 70, 50, [0, 90, 180, 270]),
      S('PA', 0, 130, 120, [0, 180], 0, [0, 1])
    ] },
  { id: 'rechteck', t: 1, name: { de: 'Rechteck', ru: 'Прямоугольник', en: 'Rectangle' },
    slots: [
      S('LT', 45, 55, 80, [45, 225]), S('LT', 225, 145, 80, [225, 45]),
      S('MT', 0, 100, 50, [0, 180]), S('ST', 90, 40, 50, [90, 270]),
      S('ST', 270, 160, 50, [270, 90]), S('SQ', 45, 100, 110, [45, 135]),
      S('PA', 0, 100, 80, [0, 180], 0, [0, 1])
    ] },
  { id: 'drache', t: 1, name: { de: 'Drachen', ru: 'Ромб', en: 'Kite' },
    slots: [
      S('LT', 0, 100, 50, [0]), S('LT', 180, 100, 120, [180]),
      S('MT', 45, 60, 85, [45, 225]), S('ST', 0, 140, 70, [0, 180]),
      S('ST', 180, 140, 110, [180, 0]), S('SQ', 45, 70, 50, [45, 135]),
      S('PA', 45, 70, 120, [45, 225], 0, [0, 1])
    ] },
  { id: 'haus', t: 1, name: { de: 'Haus', ru: 'Дом', en: 'House' },
    slots: [
      S('LT', 0, 100, 40, [0]), S('LT', 180, 70, 110, [180]),
      S('MT', 90, 140, 110, [90]), S('ST', 0, 50, 70, [0]),
      S('ST', 90, 150, 70, [90]), S('SQ', 0, 100, 90, [0, 90]),
      S('PA', 0, 130, 140, [0, 180], 0, [0])
    ] },

  // Stufe 2 — einfache Motive, Linien noch da
  { id: 'boot', t: 2, name: { de: 'Boot', ru: 'Лодка', en: 'Boat' },
    slots: [
      S('LT', 180, 80, 110, [180]), S('LT', 0, 130, 70, [0]),
      S('MT', 45, 50, 90, [45]), S('ST', 0, 160, 100, [0]),
      S('ST', 180, 40, 120, [180]), S('SQ', 0, 100, 90, [0, 90]),
      S('PA', 0, 120, 130, [0, 180], 0, [0, 1])
    ] },
  { id: 'katze', t: 2, name: { de: 'Katze', ru: 'Кошка', en: 'Cat' },
    slots: [
      S('LT', 45, 90, 100, [45, 225]), S('LT', 225, 130, 70, [225]),
      S('MT', 0, 50, 80, [0]), S('ST', 45, 150, 40, [45]),
      S('ST', 315, 170, 50, [315]), S('SQ', 0, 70, 50, [0, 90]),
      S('PA', 45, 60, 120, [45, 225], 1, [1])
    ] },
  { id: 'vogel', t: 2, name: { de: 'Vogel', ru: 'Птица', en: 'Bird' },
    slots: [
      S('LT', 90, 80, 80, [90]), S('LT', 270, 130, 80, [270]),
      S('MT', 45, 160, 50, [45]), S('ST', 0, 50, 50, [0]),
      S('ST', 180, 50, 110, [180]), S('SQ', 45, 100, 50, [45]),
      S('PA', 0, 110, 120, [0], 0, [0, 1])
    ] },
  { id: 'fisch', t: 2, name: { de: 'Fisch', ru: 'Рыба', en: 'Fish' },
    slots: [
      S('LT', 0, 90, 80, [0, 180]), S('LT', 180, 140, 80, [180]),
      S('MT', 90, 50, 80, [90]), S('ST', 45, 170, 60, [45]),
      S('ST', 315, 170, 100, [315]), S('SQ', 0, 70, 50, [0]),
      S('PA', 0, 110, 120, [0, 180], 0, [0])
    ] },
  { id: 'kerze', t: 2, name: { de: 'Kerze', ru: 'Свеча', en: 'Candle' },
    slots: [
      S('LT', 0, 100, 50, [0]), S('LT', 180, 100, 120, [180]),
      S('MT', 0, 100, 85, [0, 180]), S('ST', 45, 70, 40, [45]),
      S('ST', 315, 130, 40, [315]), S('SQ', 0, 100, 150, [0]),
      S('PA', 90, 70, 150, [90, 270], 0, [0, 1])
    ] },

  // Stufe 3 — Silhouette ohne Innenlinien, konvex/einfach
  { id: 'segel', t: 3, name: { de: 'Segel', ru: 'Парус', en: 'Sail' },
    slots: [
      S('LT', 0, 100, 70, [0]), S('LT', 180, 70, 120, [180]),
      S('MT', 90, 140, 110, [90, 270]), S('ST', 0, 50, 90, [0]),
      S('ST', 180, 150, 70, [180]), S('SQ', 45, 120, 50, [45, 135]),
      S('PA', 0, 130, 140, [0], 0, [0])
    ] },
  { id: 'raute', t: 3, name: { de: 'Raute', ru: 'Ромб', en: 'Diamond' },
    slots: [
      S('LT', 45, 80, 70, [45]), S('LT', 225, 120, 110, [225]),
      S('MT', 135, 130, 60, [135]), S('ST', 45, 60, 110, [45]),
      S('ST', 225, 150, 90, [225]), S('SQ', 45, 100, 90, [45, 135]),
      S('PA', 45, 70, 50, [45, 225], 0, [0, 1])
    ] },
  { id: 'zelt', t: 3, name: { de: 'Zelt', ru: 'Палатка', en: 'Tent' },
    slots: [
      S('LT', 0, 80, 90, [0]), S('LT', 0, 120, 90, [0]),
      S('MT', 180, 100, 130, [180]), S('ST', 0, 60, 50, [0]),
      S('ST', 0, 140, 50, [0]), S('SQ', 0, 100, 50, [0, 90]),
      S('PA', 0, 100, 70, [0, 180], 0, [0])
    ] },
  { id: 'mond', t: 3, name: { de: 'Mond', ru: 'Луна', en: 'Moon' },
    slots: [
      S('LT', 90, 90, 80, [90]), S('LT', 270, 130, 90, [270]),
      S('MT', 45, 60, 50, [45]), S('ST', 0, 50, 110, [0]),
      S('ST', 180, 150, 50, [180]), S('SQ', 0, 80, 120, [0]),
      S('PA', 45, 110, 130, [45], 1, [1])
    ] },

  // Stufe 4 — konkav
  { id: 'hund', t: 4, name: { de: 'Hund', ru: 'Собака', en: 'Dog' },
    slots: [
      S('LT', 45, 90, 90, [45]), S('LT', 180, 140, 110, [180]),
      S('MT', 90, 50, 80, [90]), S('ST', 0, 160, 50, [0]),
      S('ST', 270, 170, 80, [270]), S('SQ', 0, 70, 50, [0, 90]),
      S('PA', 0, 50, 120, [0, 180], 1, [1])
    ] },
  { id: 'schwan', t: 4, name: { de: 'Schwan', ru: 'Лебедь', en: 'Swan' },
    slots: [
      S('LT', 135, 110, 100, [135]), S('LT', 315, 70, 80, [315]),
      S('MT', 0, 140, 60, [0]), S('ST', 45, 50, 40, [45]),
      S('ST', 90, 40, 70, [90]), S('SQ', 45, 90, 50, [45]),
      S('PA', 45, 150, 120, [45, 225], 0, [0])
    ] },
  { id: 'hase', t: 4, name: { de: 'Hase', ru: 'Заяц', en: 'Hare' },
    slots: [
      S('LT', 0, 100, 100, [0]), S('LT', 90, 140, 70, [90]),
      S('MT', 270, 60, 90, [270]), S('ST', 0, 70, 40, [0]),
      S('ST', 45, 90, 30, [45]), S('SQ', 0, 80, 70, [0]),
      S('PA', 90, 50, 130, [90], 0, [0, 1])
    ] },
  { id: 'baum', t: 4, name: { de: 'Baum', ru: 'Дерево', en: 'Tree' },
    slots: [
      S('LT', 0, 90, 60, [0]), S('LT', 0, 120, 90, [0]),
      S('MT', 180, 105, 130, [180]), S('ST', 45, 70, 40, [45]),
      S('ST', 315, 140, 40, [315]), S('SQ', 0, 105, 150, [0]),
      S('PA', 0, 80, 110, [0], 0, [0])
    ] },

  // Stufe 5 — schwer, Slots unsichtbar
  { id: 'taenzer', t: 5, name: { de: 'Tänzer', ru: 'Танцор', en: 'Dancer' },
    slots: [
      S('LT', 45, 100, 90, [45]), S('LT', 225, 70, 130, [225]),
      S('MT', 0, 130, 50, [0]), S('ST', 90, 150, 40, [90]),
      S('ST', 270, 160, 80, [270]), S('SQ', 45, 80, 50, [45]),
      S('PA', 45, 50, 70, [45, 225], 1, [1])
    ] },
  { id: 'kamel', t: 5, name: { de: 'Kamel', ru: 'Верблюд', en: 'Camel' },
    slots: [
      S('LT', 0, 80, 90, [0]), S('LT', 180, 130, 100, [180]),
      S('MT', 45, 50, 60, [45]), S('ST', 0, 160, 70, [0]),
      S('ST', 180, 40, 100, [180]), S('SQ', 0, 100, 60, [0]),
      S('PA', 0, 150, 120, [0], 1, [1])
    ] },
  { id: 'reiter', t: 5, name: { de: 'Reiter', ru: 'Всадник', en: 'Rider' },
    slots: [
      S('LT', 90, 90, 100, [90]), S('LT', 270, 140, 90, [270]),
      S('MT', 0, 60, 70, [0]), S('ST', 45, 50, 40, [45]),
      S('ST', 225, 160, 50, [225]), S('SQ', 45, 80, 50, [45]),
      S('PA', 0, 110, 130, [0, 180], 0, [0, 1])
    ] },
  { id: 'fuchs', t: 5, name: { de: 'Fuchs', ru: 'Лиса', en: 'Fox' },
    slots: [
      S('LT', 135, 100, 90, [135]), S('LT', 315, 140, 110, [315]),
      S('MT', 90, 60, 80, [90]), S('ST', 0, 50, 50, [0]),
      S('ST', 45, 170, 70, [45]), S('SQ', 0, 80, 50, [0]),
      S('PA', 45, 70, 120, [45], 1, [1])
    ] }
];

let timer = null;
const clearTimer = () => { if (timer) { clearTimeout(timer); timer = null; } };
const aktiv = () => !!(engine.activeGame && engine.activeGame.id === ID);

function neueAufgabe(gs) {
  const gd = gs.gd;
  const stufe = Math.max(1, Math.min(5, gd.level || 1));
  const pool = FIGUREN.filter(f => f.t === stufe);
  const f = (pool.length ? pool : FIGUREN)[Math.floor(Math.random() * (pool.length || FIGUREN.length))];

  gd.figur = f;
  gd.vorrat = shuffle(IDS.slice());
  gd.plaetze = Array(7).fill(null);
  gd.rot = Object.fromEntries(IDS.map(id => [id, 0]));
  gd.flip = Object.fromEntries(IDS.map(id => [id, 0]));
  gd.wahl = null;
  gd.phase = 'legen';
  gd.phaseStart = Date.now();
  gd.frist = 7 * modGet(ID, 'sekProTeil') * 1000;

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

function poly(typ, rot, flip, w, h) {
  const g = GEO[typ];
  const fl = (typ === 'PA' && flip) ? 'scale(-1,1) translate(-40,0)' : '';
  return `<svg viewBox="0 0 40 40" width="${w}" height="${h}" style="display:block;overflow:visible">
    <g transform="rotate(${rot} 20 20) ${fl}">
      <polygon points="${g.pts}" fill="${g.color}" stroke="#2a2458" stroke-width="1.2"/>
    </g>
  </svg>`;
}

/** Ein Teil in der großen Ansicht: gleiche Geometrie wie im Vorrat. */
function figurTeil(s, fill, extra) {
  const g = GEO[s.typ];
  const fl = (s.typ === 'PA' && s.flip) ? 'scale(-1,1) translate(-40,0)' : '';
  return `<g transform="translate(${s.x - 20},${s.y - 20}) rotate(${s.rot} 20 20) ${fl}"${extra || ''}>
    <polygon points="${g.pts}" fill="${fill}" stroke="none"/>
  </g>`;
}

export function render(gs) {
  let gd = gs.gd;
  if (!gd || !gd._ready) { init(gs); gd = gs.gd; }

  if (gd.phase === 'fertig') return resultScreen(gs, { score: gs.score, total: gs.total });

  if (gd.phase === 'feedback') {
    const ok = gd.geloest;
    return `<div data-phase="feedback" style="text-align:center;width:100%">
      <div style="font-size:calc(2.4em * var(--pic))">${ok ? '✅' : '❌'}</div>
      <p style="color:var(--text-light);margin-top:8px">${esc(pick(gd.figur.name))}</p>
    </div>`;
  }

  const hand = inDerHand();
  const fig = gd.figur;
  const gewaehlt = hand || gd.wahl;

  // Eine Fläche: alle Zielteile in derselben Farbe, ohne Innenkanten.
  const kontur = fig.slots.map(s => figurTeil(s, '#3A3568')).join('');

  const slotsSvg = fig.slots.map((s, i) => {
    const id = gd.plaetze[i];
    if (id) {
      const pose = { typ: TYP_VON[id], rot: gd.rot[id], x: s.x, y: s.y, flip: gd.flip[id] };
      return figurTeil(pose, GEO[TYP_VON[id]].color,
        ` class="pick-target" data-zieh="${id}" style="cursor:grab;touch-action:none"`);
    }
    // Trefferfläche unsichtbar – Form des Zielteils, kein Kreis, kein Schatten.
    return figurTeil(s, 'transparent',
      ` class="pick-target" data-ablage="slot:${i}" style="cursor:pointer;touch-action:none"`);
  }).join('');

  const vorrat = gd.vorrat.map(id => {
    const on = hand === id || gd.wahl === id;
    return `<div class="pick-target" data-zieh="${id}" style="
      width:52px;height:52px;border-radius:12px;padding:4px;
      background:${on ? '#EBE9FF' : 'var(--bg)'};
      border:2px solid ${on ? 'var(--primary)' : '#D0CDE8'};
      cursor:grab;touch-action:none;user-select:none">${poly(TYP_VON[id], gd.rot[id], gd.flip[id], 44, 44)}</div>`;
  }).join('');

  const knoepfe = gewaehlt ? `<div style="display:flex;gap:8px;justify-content:center;margin:8px 0">
    <button type="button" class="btn" onclick="G('drehe',${JSON.stringify(gewaehlt)})"
      title="${esc(u('drehe'))}" aria-label="${esc(u('drehe'))}"
      style="min-height:44px;min-width:44px;font-size:calc(1.4em * var(--pic));line-height:1">↻</button>
    ${TYP_VON[gewaehlt] === 'PA' ? `<button type="button" class="btn" onclick="G('spiegle',${JSON.stringify(gewaehlt)})"
      title="${esc(u('spiegle'))}" aria-label="${esc(u('spiegle'))}"
      style="min-height:44px;min-width:44px;font-size:calc(1.3em * var(--pic));line-height:1">⇄</button>` : ''}
  </div>` : '';

  return `<div data-phase="legen" style="width:100%;max-width:560px">
    <p style="font-size:1.05em;text-align:center">${esc(u('frage'))} — ${esc(pick(fig.name))}</p>
    <p style="font-size:.82em;color:var(--text-light);text-align:center;margin-bottom:8px">
      ${esc(hand ? u('zurueck') : u('nimm'))}
    </p>
    <svg viewBox="0 0 200 160" style="width:100%;max-height:280px;background:#F8F7FF;border-radius:14px;touch-action:none">
      ${kontur}
      ${slotsSvg}
    </svg>
    ${knoepfe}
    <div style="font-size:.75em;color:var(--text-light);margin:6px 0 4px">${esc(u('vorrat'))}</div>
    <div data-ablage="vorrat" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;
                min-height:60px;padding:10px;border-radius:14px;
                border:2px dashed ${hand ? 'var(--primary)' : 'transparent'};
                background:${hand ? '#F6F5FF' : 'transparent'}">${vorrat}</div>
    ${bar(gd.frist || 1, Date.now() - (gd.phaseStart || Date.now()))}
  </div>`;
}

function nimmHeraus(gd, stueck) {
  const i = gd.plaetze.indexOf(stueck);
  if (i >= 0) gd.plaetze[i] = null;
  gd.vorrat = gd.vorrat.filter(x => x !== stueck);
}

export const actions = {
  verschiebe(gs, stueck, ziel) {
    const gd = gs.gd;
    if (!gd || gd.phase !== 'legen') return false;
    if (!TYP_VON[stueck]) return false;

    nimmHeraus(gd, stueck);
    gd.wahl = stueck;

    if (ziel === 'vorrat') {
      gd.vorrat.push(stueck);
      return;
    }
    const i = Number(String(ziel).split(':')[1]);
    if (!Number.isInteger(i) || i < 0 || i >= 7) { gd.vorrat.push(stueck); return; }
    const slot = gd.figur.slots[i];
    if (slot.typ !== TYP_VON[stueck]) {
      // Falsche Form: zurück in den Vorrat, nicht erzwingen.
      gd.vorrat.push(stueck);
      return;
    }
    const bewohner = gd.plaetze[i];
    if (bewohner) gd.vorrat.push(bewohner);
    gd.plaetze[i] = stueck;

    if (gd.plaetze.every(x => x !== null)) auswerten(gs);
  },

  drehe(gs, stueck) {
    const gd = gs.gd;
    if (!gd || gd.phase !== 'legen' || !TYP_VON[stueck]) return false;
    gd.rot[stueck] = (gd.rot[stueck] + 45) % 360;
    gd.wahl = stueck;
  },

  spiegle(gs, stueck) {
    const gd = gs.gd;
    if (!gd || gd.phase !== 'legen' || TYP_VON[stueck] !== 'PA') return false;
    gd.flip[stueck] = gd.flip[stueck] ? 0 : 1;
    gd.wahl = stueck;
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

  const voll = gd.plaetze.every(x => x !== null);
  let geloest = voll;
  if (voll) {
    for (let i = 0; i < 7; i++) {
      const id = gd.plaetze[i];
      const s = gd.figur.slots[i];
      if (TYP_VON[id] !== s.typ) { geloest = false; break; }
      const r = ((gd.rot[id] % 360) + 360) % 360;
      if (!s.okRot.includes(r)) { geloest = false; break; }
      if (s.typ === 'PA' && s.okFlip && !s.okFlip.includes(gd.flip[id] || 0)) {
        geloest = false; break;
      }
    }
  }

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
  }, Math.round(settings.get(geloest ? 'feedbackOk' : 'feedbackWrong') * 1000) + (geloest ? 0 : 800));
}

export const scoring = 'count';
export const instruction = {
  de: 'Sieben Tangram-Teile gehören auf die Figur. Tippe ein Teil an und dann den passenden Platz – oder zieh es hinüber. Mit „Drehen“ drehst du es um 45°. Das Parallelogramm kannst du zusätzlich spiegeln. Zurück in den Vorrat geht jederzeit.',
  ru: 'Семь деталей танграма нужно положить на фигуру. Нажми деталь и затем подходящее место — или перетащи. «Поворот» крутит на 45°. Параллелограмм можно ещё отразить. На склад можно вернуть в любой момент.',
  en: 'Seven tangram pieces belong on the figure. Tap a piece and then the matching slot – or drag it. Rotate turns it by 45°. The parallelogram can also be flipped. You can always put a piece back on the tray.'
};

