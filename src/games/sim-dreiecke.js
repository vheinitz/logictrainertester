/**
 * Dreiecke legen (KABC-II: Dreiecke)
 *
 * Das Kind legt einfarbige gleichschenklige Dreiecke auf ein festes Gitter,
 * bis die Vorlage entsteht. Keine freie Pixel-Geometrie – jede Zelle hat
 * Orientierung (▲/▼) und Farbe. Drehen dreht um 180°: auf diesem Gitter
 * kippt das Plättchen zwischen Spitze-oben und Spitze-unten; 60°-Schritte
 * würden Zellen erzeugen, die nirgends hineinpassen.
 *
 * Bedienung wie bei den Geschichten: Antippen (Stück, dann Platz) oder
 * Ziehen. Occupied slot: Bewohner zurück in den Vorrat, nicht tauschen.
 */
import { engine } from '../core/engine.js';
import { shuffle, pick, esc, jsArg } from '../core/html.js';
import { countRound, resultScreen } from '../core/session.js';
import { registerModuleSettings, modGet } from '../core/settings.js';
import { bar, pictogram } from '../core/shell.js';
import { inDerHand, dragAufraeumen } from '../core/drag.js';
import * as settings from '../core/settings.js';

const ID = 'sim-dreiecke';

export const settingsSchema = {
  sekProTeil: {
    def: 12, min: 5, max: 60, step: 1, unit: 's',
    de: 'Zeit je Plättchen', ru: 'Время на пластинку', en: 'Time per tile',
    hintDe: 'Die Gesamtzeit ergibt sich aus der Zahl der Pflichtplätze. Läuft sie ab, zählt die Aufgabe als nicht gelöst.',
    hintRu: 'Общее время складывается из числа обязательных мест. Если оно истекло, задание считается нерешённым.',
    hintEn: 'Total time follows from the number of required slots. When it runs out, the task counts as unsolved.'
  }
};
registerModuleSettings(ID, settingsSchema);

const UI = {
  frage: { de: '🔺 Lege die Dreiecke wie in der Vorlage', ru: '🔺 Выложи треугольники как на образце', en: '🔺 Place the triangles to match the model' },
  nimm: {
    de: 'Tippe ein Dreieck an, dann den Platz – oder zieh es hinüber. Drehen: der Knopf am aufgenommenen Stück.',
    ru: 'Нажми на треугольник, потом на место — или перетащи. Поворот: кнопка на взятой пластинке.',
    en: 'Tap a triangle, then a slot – or drag it. Rotate with the button on the piece you picked up.'
  },
  legZurueck: { de: 'Nochmal antippen legt es zurück.', ru: 'Нажми ещё раз, чтобы вернуть.', en: 'Tap again to put it back.' },
  vorrat: { de: 'Plättchen', ru: 'Пластинки', en: 'Tiles' },
  vorlage: { de: 'Vorlage', ru: 'Образец', en: 'Model' },
  feld: { de: 'Dein Bild', ru: 'Твоя картина', en: 'Your picture' },
  drehen: { de: 'Drehen', ru: 'Повернуть', en: 'Rotate' },
  richtig: { de: 'So sollte es aussehen:', ru: 'Так это должно выглядеть:', en: 'It should look like this:' }
};
const u = k => pick(UI[k]);

const FARBEN = {
  1: ['#4D96FF'],
  2: ['#4D96FF'],
  3: ['#4D96FF', '#FF6B6B'],
  4: ['#4D96FF', '#FF6B6B'],
  5: ['#4D96FF', '#FF6B6B', '#FFD93D']
};

/** Mehrere Anordnungen je Teilezahl – sonst sieht jede Runde gleich aus. */
const FORMEN = {
  2: [[2], [1, 1]],
  3: [[3], [2, 1], [1, 2]],
  4: [[2, 2], [4], [1, 2, 1], [3, 1]],
  6: [[3, 3], [2, 2, 2], [4, 2], [1, 2, 3]],
  8: [[4, 4], [3, 2, 3], [2, 4, 2]],
  10: [[4, 3, 3], [5, 5], [3, 4, 3]]
};
const ZELLEN = { 1: [2, 3], 2: [4], 3: [6], 4: [8], 5: [10] };

function layout(n, formIdx) {
  const formen = FORMEN[n] || [[n]];
  const rows = formen[((formIdx % formen.length) + formen.length) % formen.length];
  const cells = [];
  let i = 0;
  rows.forEach((count, r) => {
    for (let c = 0; c < count; c++) {
      cells.push({ i, r, c });
      i++;
    }
  });
  return cells;
}

function musterSchluessel(zellen) {
  return zellen.map(z => z.r + ',' + z.c + ':' + z.orient + z.farbe).join('|');
}

function svgDreieck(farbe, orient, size) {
  const s = size || 44;
  const pts = orient === 0
    ? `${s / 2},4 ${s - 3},${s - 3} 3,${s - 3}`
    : `3,4 ${s - 3},4 ${s / 2},${s - 3}`;
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" aria-hidden="true">
    <polygon points="${pts}" fill="${farbe}" stroke="#3a3560" stroke-width="1.5"/>
  </svg>`;
}

function gitterHtml(zellen, belegung, opt) {
  const { hand, interaktiv, klein } = opt;
  const size = klein ? 28 : 48;
  const byRow = {};
  zellen.forEach(z => {
    (byRow[z.r] || (byRow[z.r] = [])).push(z);
  });
  const rows = Object.keys(byRow).sort((a, b) => a - b).map(r => {
    const zs = byRow[r];
    const tiles = zs.map(z => {
      const id = belegung[z.i];
      if (id) {
        const st = opt.stuecke[id];
        const gewaehlt = hand === id;
        const inner = svgDreieck(st.farbe, st.orient, size);
        if (!interaktiv) {
          return `<div style="width:${size}px;height:${size}px">${inner}</div>`;
        }
        return `<div class="pick-target" data-zieh="${esc(id)}" style="
          width:${size}px;height:${size}px;border-radius:8px;
          background:${gewaehlt ? '#EBE9FF' : 'transparent'};
          outline:2px solid ${gewaehlt ? 'var(--primary)' : 'transparent'};
          cursor:grab;touch-action:none;user-select:none">${inner}</div>`;
      }
      if (!interaktiv) {
        return `<div style="width:${size}px;height:${size}px"></div>`;
      }
      return `<div class="pick-target" data-ablage="platz:${z.i}" style="
        width:${size}px;height:${size}px;border-radius:8px;
        border:2px dashed ${hand ? 'var(--primary)' : '#D8D4EE'};
        background:${hand ? '#F6F5FF' : '#F3F1FA'}">
      </div>`;
    }).join('');
    return `<div style="display:flex;gap:4px;justify-content:center">${tiles}</div>`;
  }).join('');
  return `<div style="display:flex;flex-direction:column;gap:2px">${rows}</div>`;
}

function baueAufgabe(stufe, verboten) {
  const nPool = ZELLEN[stufe] || [3];
  const farben = FARBEN[stufe] || FARBEN[1];
  const gesperrt = verboten || new Set();

  for (let versuch = 0; versuch < 80; versuch++) {
    const n = nPool[versuch % nPool.length];
    const zellen = layout(n, versuch);
    zellen.forEach((z, idx) => {
      z.farbe = farben[(idx + versuch * 3) % farben.length];
      // Richtung ist Teil der Aufgabe, nicht vom Raster festgenagelt.
      z.orient = (idx + versuch + ((z.r * 3 + z.c) % 2)) % 2;
    });
    const key = musterSchluessel(zellen);
    if (gesperrt.has(key)) continue;

    const stuecke = {};
    const vorrat = [];
    zellen.forEach(z => {
      const id = 't' + z.i;
      // Vorrat enthält genau die nötigen Farben und Richtungen.
      // Ab Stufe 2 einzelne Plättchen umgedreht – dann muss man drehen.
      let orient = z.orient;
      if (stufe >= 2 && z.i < Math.min(stufe - 1, zellen.length)) orient = 1 - orient;
      stuecke[id] = { id, farbe: z.farbe, orient, pflicht: true };
      vorrat.push(id);
    });
    if (stufe === 5) {
      const id = 'd0';
      stuecke[id] = { id, farbe: farben[versuch % farben.length], orient: versuch % 2, pflicht: false };
      vorrat.push(id);
    }
    return {
      zellen, stuecke, vorrat: shuffle(vorrat),
      plaetze: Array(zellen.length).fill(null),
      _muster: key
    };
  }
  return baueAufgabe(stufe, new Set());
}

let timer = null;
const clearTimer = () => { if (timer) { clearTimeout(timer); timer = null; } };
const aktiv = () => !!(engine.activeGame && engine.activeGame.id === ID);

function neueAufgabe(gs) {
  const gd = gs.gd;
  const stufe = Math.max(1, Math.min(5, gd.level || 1));
  gd._gestellt = gd._gestellt || [];
  const aufg = baueAufgabe(stufe, new Set(gd._gestellt));
  gd._gestellt = gd._gestellt.concat(aufg._muster).slice(-12);
  Object.assign(gd, aufg);
  gd.spiegle = false;
  gd.phase = 'legen';
  gd.phaseStart = Date.now();
  gd.frist = aufg.zellen.length * modGet(ID, 'sekProTeil') * 1000;
  gd.geloest = false;
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

export function render(gs) {
  let gd = gs.gd;
  if (!gd || !gd._ready) { init(gs); gd = gs.gd; }

  if (gd.phase === 'fertig') return resultScreen(gs, { score: gs.score, total: gs.total });

  const vorlageZellen = gd.zellen.map(z => ({ ...z }));
  const vorlageBelegung = {};
  const vorlageStuecke = {};
  vorlageZellen.forEach(z => {
    const id = 'v' + z.i;
    vorlageBelegung[z.i] = id;
    vorlageStuecke[id] = { farbe: z.farbe, orient: z.orient };
  });

  if (gd.phase === 'feedback') {
    return `<div data-phase="feedback" style="text-align:center;width:100%">
      ${pictogram(gd.geloest ? '✅' : '❌')}
      ${gd.geloest ? '' : `<div style="margin-top:14px">
        <div style="font-size:.85em;color:var(--text-light);margin-bottom:6px">${esc(u('richtig'))}</div>
        ${gitterHtml(vorlageZellen, vorlageBelegung, { hand: null, interaktiv: false, klein: false, stuecke: vorlageStuecke })}
      </div>`}
    </div>`;
  }

  const hand = inDerHand();
  const belegung = {};
  gd.plaetze.forEach((id, i) => { if (id) belegung[i] = id; });

  const vorratKacheln = gd.vorrat.map(id => {
    const st = gd.stuecke[id];
    const gewaehlt = hand === id;
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">
      <div class="pick-target" data-zieh="${esc(id)}" style="
        width:52px;height:52px;border-radius:12px;
        display:flex;align-items:center;justify-content:center;
        background:${gewaehlt ? '#EBE9FF' : 'var(--bg)'};
        border:2px solid ${gewaehlt ? 'var(--primary)' : '#D0CDE8'};
        ${gewaehlt ? 'transform:scale(1.06);box-shadow:0 4px 14px rgba(91,79,207,.3)' : ''}
        cursor:grab;touch-action:none;user-select:none">${svgDreieck(st.farbe, st.orient, 44)}</div>
      <button type="button" class="btn-ghost" onclick="G('drehe',${jsArg(id)})"
        title="${esc(u('drehen'))}" aria-label="${esc(u('drehen'))}"
        style="min-height:36px;min-width:36px;padding:0;font-size:calc(1.25em * var(--pic));line-height:1">↻</button>
    </div>`;
  }).join('');

  const drehKnopf = hand
    ? `<div style="text-align:center;margin:8px 0">
        <button type="button" class="btn" onclick="G('drehe',${jsArg(hand)})"
          title="${esc(u('drehen'))}" aria-label="${esc(u('drehen'))}"
          style="min-height:44px;min-width:44px;font-size:calc(1.4em * var(--pic));line-height:1">↻</button>
      </div>`
    : '';

  return `<div data-phase="legen" style="width:100%;max-width:560px">
    <p style="font-size:1.05em;text-align:center">${esc(u('frage'))}</p>
    <p style="font-size:.82em;color:var(--text-light);text-align:center;margin-bottom:10px">
      ${esc(hand ? u('legZurueck') : u('nimm'))}
    </p>

    <div style="font-size:.75em;color:var(--text-light);margin-bottom:4px">${esc(u('vorlage'))}</div>
    <div style="padding:10px;background:#F8F7FF;border-radius:14px;margin-bottom:12px">
      ${gitterHtml(vorlageZellen, vorlageBelegung, { hand: null, interaktiv: false, klein: true, stuecke: vorlageStuecke })}
    </div>

    <div style="font-size:.75em;color:var(--text-light);margin-bottom:4px">${esc(u('feld'))}</div>
    <div style="padding:10px;background:#F8F7FF;border-radius:14px">
      ${gitterHtml(gd.zellen, belegung, { hand, interaktiv: true, klein: false, stuecke: gd.stuecke })}
    </div>

    ${drehKnopf}

    <div style="font-size:.75em;color:var(--text-light);margin:14px 0 4px">${esc(u('vorrat'))}</div>
    <div data-ablage="vorrat" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;
                min-height:56px;padding:10px;border-radius:14px;
                border:2px dashed ${hand ? 'var(--primary)' : 'transparent'};
                background:${hand ? '#F6F5FF' : 'transparent'}">${vorratKacheln}</div>

    ${bar(gd.frist || 1, Date.now() - (gd.phaseStart || Date.now()))}
  </div>`;
}

export const actions = {
  verschiebe(gs, stueck, ziel) {
    const gd = gs.gd;
    if (!gd || gd.phase !== 'legen') return false;
    if (!gd.stuecke[stueck]) return false;

    const vorIndex = gd.plaetze.indexOf(stueck);
    if (vorIndex >= 0) gd.plaetze[vorIndex] = null;
    gd.vorrat = gd.vorrat.filter(x => x !== stueck);

    if (ziel === 'vorrat') {
      gd.vorrat.push(stueck);
    } else {
      const i = Number(String(ziel).split(':')[1]);
      if (!Number.isInteger(i) || i < 0 || i >= gd.plaetze.length) {
        gd.vorrat.push(stueck);
        return;
      }
      const bewohner = gd.plaetze[i];
      if (bewohner) gd.vorrat.push(bewohner);
      gd.plaetze[i] = stueck;
    }

    const pflicht = gd.zellen.length;
    const voll = gd.plaetze.every(x => x !== null);
    if (voll && gd.plaetze.length === pflicht) auswerten(gs);
  },

  drehe(gs, stueck) {
    const gd = gs.gd;
    if (!gd || gd.phase !== 'legen') return false;
    const st = gd.stuecke[stueck];
    if (!st) return false;
    // 180°: Spitze wechselt oben/unten – passt zum gleichseitigen Raster.
    st.orient = 1 - st.orient;
  },

  restart(gs) {
    clearTimer();
    dragAufraeumen();
    gs.gd = { level: 1 };
    gs.score = 0; gs.total = 0; gs.rounds = 0; gs.level = 0;
    init(gs);
  }
};

function passt(gd) {
  return gd.zellen.every((z, i) => {
    const id = gd.plaetze[i];
    if (!id) return false;
    const st = gd.stuecke[id];
    return st.farbe === z.farbe && st.orient === z.orient;
  });
}

function auswerten(gs) {
  const gd = gs.gd;
  if (!gd || gd.phase !== 'legen') return;
  clearTimer();
  dragAufraeumen();

  const vollstaendig = gd.plaetze.every(x => x !== null);
  const geloest = vollstaendig && passt(gd);

  gs.total = (gs.total || 0) + 1;
  if (geloest) {
    gs.score = (gs.score || 0) + 1;
    // Höchstes gelöstes Niveau – die Auswertung braucht es, weil die
    // Trefferquote bei mitwachsender Schwierigkeit nichts unterscheidet.
    gs.level = Math.max(gs.level || 0, gd.level);
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
  de: 'Lege die farbigen Dreiecke so, dass sie genau wie die Vorlage aussehen. Tippe ein Plättchen an und dann den Platz – oder zieh es hinüber. Mit „Drehen“ kippst du das aufgenommene Stück (180°, Spitze oben/unten). Nochmal antippen legt es zurück.',
  ru: 'Выложи цветные треугольники точно как на образце. Нажми на пластинку, потом на место — или перетащи. «Повернуть» опрокидывает взятую пластинку (180°, остриё вверх/вниз). Нажми ещё раз, чтобы вернуть.',
  en: 'Place the coloured triangles so they match the model. Tap a tile and then a slot – or drag it. Rotate flips the picked-up piece (180°, tip up or down). Tap again to put it back.'
};
