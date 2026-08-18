/**
 * Wolf, Ziege und Kohl – Flussüberquerung mit Boot.
 * idee-db: 28
 *
 * Klassisches Rätsel (Buch 5-6-Matematika-Zadachi-na-smekalku-1995, S. 64,
 * „Смесь“, Nr. 275). Der Bauer bringt Wolf, Ziege und Kohl über den Fluss;
 * pro Fahrt darf höchstens einer mit. Lässt er Wolf+Ziege oder Ziege+Kohl
 * allein, wird gefressen – die App zeigt das grafisch (Fress-Banner, Kreuz,
 * pulsierender Ring) und lässt den Zug rückgängig machen. Gezählt werden die
 * Überfahrten, Minimum sind 7.
 *
 * Bedienung: erst ein Tier/den Kohl am Ufer antippen (steigt ins Boot), dann
 * „Fahren“. Ohne Auswahl fährt der Bauer allein. „Rückgängig“ nimmt den
 * letzten Zug zurück.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 600, VIEW_H = 410;
const OPTIMAL = 7;

const ITEMS = {
  wolf:  { e: '🐺', name: { de: 'Wolf', ru: 'Волк', en: 'Wolf' } },
  ziege: { e: '🐐', name: { de: 'Ziege', ru: 'Коза', en: 'Goat' } },
  kohl:  { e: '🥬', name: { de: 'Kohl', ru: 'Капуста', en: 'Cabbage' } },
};
const BAUER = '🧑‍🌾';
const REIHENFOLGE = ['wolf', 'ziege', 'kohl'];

const UFER = {
  links:  { items: [45, 100, 155] },
  rechts: { items: [445, 500, 555] },
};
const DOCK = { links: 255, rechts: 345 };
const BOOT_Y = 300;

const T = {
  fahren:       { de: 'Fahren', ru: 'Плыть', en: 'Sail' },
  rueckgaengig: { de: 'Rückgängig', ru: 'Отменить', en: 'Undo' },
  ueberfahrten: { de: 'Überfahrten', ru: 'переправ', en: 'crossings' },
  mindestens:   { de: 'mind.', ru: 'мин.', en: 'min.' },
  start:        { de: 'Start', ru: 'Старт', en: 'Start' },
  ziel:         { de: 'Ziel', ru: 'Цель', en: 'Goal' },
};

const GEFRESSEN_TEXTE = {
  wolf_ziege: { de: 'Der Wolf frisst die Ziege!', ru: 'Волк ест козу!', en: 'The wolf eats the goat!' },
  ziege_kohl: { de: 'Die Ziege frisst den Kohl!', ru: 'Коза ест капусту!', en: 'The goat eats the cabbage!' },
  beide:      { de: 'Wolf frisst Ziege – Ziege frisst Kohl!', ru: 'Волк ест козу, коза ест капусту!', en: 'Wolf eats goat, goat eats cabbage!' },
};

const UNDO = { x: 16, y: 16, w: 150, h: 40 };
const FAHREN = { x: 225, y: 360, w: 150, h: 44 };
const BANNER_BTN = { x: 220, y: 228, w: 160, h: 46 };

/** Lokalisierter Text – nutzt die globale Sprach-Einstellung der App. */
function tt(app, o) {
  const l = (app && typeof app.get === 'function') ? (app.get('sprache') || 'de') : 'de';
  return (o && (o[l] || o.de)) || '';
}

function bankItems(state, ufer) {
  return REIHENFOLGE.filter(k => state.bank[ufer].includes(k));
}

function verbotenePaare(items) {
  const p = [];
  if (items.includes('wolf') && items.includes('ziege')) p.push(['wolf', 'ziege']);
  if (items.includes('ziege') && items.includes('kohl')) p.push(['ziege', 'kohl']);
  return p;
}

/** Text mit Blink-Animation (SVG <animate> als Kind des Textes). */
function animText(x, y, s, extra = {}, values = '1;0.2;1', dur = '0.6s') {
  const anim = `<animate attributeName="opacity" values="${values}" dur="${dur}" repeatCount="indefinite"/>`;
  return svg.el('text', { x, y, ...extra }, s + anim);
}

function blinkCircle(cx, cy, r) {
  return svg.el('circle', { cx, cy, r, fill: 'none', stroke: '#e03131', 'stroke-width': 4 },
    '<animate attributeName="opacity" values="1;0.2;1" dur="0.6s" repeatCount="indefinite"/>');
}

const app = new MiniApp({
  id: 'ziege-wolf-kohl',
  icon: '🚣',
  titel: { de: 'Ziege, Wolf und Kohl', ru: 'Коза, волк и капуста', en: 'Goat, Wolf and Cabbage' },
  anweisung: {
    de: 'Bringe Wolf, Ziege und Kohl mit dem Boot ans andere Ufer. Nimm pro Fahrt höchstens einen mit – sonst wird gefressen!',
    ru: 'Перевези волка, козу и капусту на другой берег. Бери с собой не больше одного — иначе кого-то съедят!',
    en: 'Ferry the wolf, goat and cabbage across. Take at most one with you per trip – or someone gets eaten!'
  },
  hilfe: {
    de: 'Antippen: erst ein Tier/den Kohl am Ufer auswählen (es steigt ins Boot), dann „Fahren“. Ohne Auswahl fährst du allein. Achtung: Lässt du Wolf und Ziege allein, frisst der Wolf die Ziege; lässt du Ziege und Kohl allein, frisst die Ziege den Kohl. Überlege, wann Rückfahrten nötig sind. Mindestens 7 Überfahrten.',
    ru: 'Коснись волка/козы/капусты на берегу (она сядет в лодку), затем «Плыть». Без выбора ты плывёшь один. Осторожно: если оставить волка с козой, волк съест козу; если козу с капустой — коза съест капусту. Подумай, когда нужно возвращаться. Минимум 7 переправ.',
    en: 'Tap: first choose an animal/cabbage on the bank (it boards the boat), then "Sail". Without a choice you sail alone. Careful: leave wolf and goat alone and the wolf eats the goat; leave goat and cabbage alone and the goat eats the cabbage. Think about when return trips are needed. At least 7 crossings.'
  },
  settingsSchema: {},
  auswertung: 'zuege',

  init(state, app) {
    state.bank = { links: ['wolf', 'ziege', 'kohl'], rechts: [] };
    state.bootUfer = 'links';
    state.ladung = null;
    state.zuege = 0;
    state.fertig = false;
    state.gefressen = null;
    state.historie = [];
  },

  // ─── Rendering ────────────────────────────────────────────────────
  render(state, app) {
    const p = [];

    // Himmel, Ufer, Fluss
    p.push(svg.rect(0, 0, VIEW_W, 300, '#eaf6ff'));
    p.push(svg.rect(0, 300, 200, 110, '#cfeabd'));
    p.push(svg.rect(400, 300, 200, 110, '#cfeabd'));
    p.push(svg.rect(200, 300, 200, 110, '#9fd4f5'));
    p.push(svg.rect(198, 300, 4, 110, '#a7cfe8'));
    p.push(svg.rect(398, 300, 4, 110, '#a7cfe8'));
    p.push(svg.text(20, 32, tt(app, T.start), { fill: '#557a46', 'font-size': 16, 'font-weight': 'bold' }));
    p.push(svg.text(580, 32, tt(app, T.ziel), { fill: '#557a46', 'font-size': 16, 'font-weight': 'bold', 'text-anchor': 'end' }));

    // Gegenstände an beiden Ufern (gegessen = blass + Kreuz)
    const opferUfer = state.gefressen ? state.gefressen[0].ufer : null;
    const opfer = new Set(state.gefressen ? state.gefressen.map(e => e.opfer) : []);
    for (const ufer of ['links', 'rechts']) {
      const items = this._bankAnzeige(state, ufer);
      const slots = UFER[ufer].items;
      items.forEach((kind, i) => {
        const x = slots[i];
        const istOpfer = ufer === opferUfer && opfer.has(kind);
        const attrs = { 'font-size': 42, 'text-anchor': 'middle' };
        if (istOpfer) attrs.opacity = 0.35;
        p.push(svg.text(x, 296, ITEMS[kind].e, attrs));
        if (istOpfer) {
          p.push(animText(x, 296, '✖', { 'font-size': 36, 'text-anchor': 'middle', fill: '#e03131', 'font-weight': 'bold' }));
        }
      });
    }

    // Fresser hervorheben (pulsierender roter Ring)
    if (state.gefressen) {
      const ufer = state.gefressen[0].ufer;
      const raeuber = new Set(state.gefressen.map(e => e.raeuber));
      const items = this._bankAnzeige(state, ufer);
      const slots = UFER[ufer].items;
      items.forEach((kind, i) => {
        if (raeuber.has(kind)) p.push(blinkCircle(slots[i], 270, 30));
      });
    }

    // Boot mit Bauer und ggf. Mitfahrer
    p.push(this._boot(DOCK[state.bootUfer], BOOT_Y, state.ladung));

    // Fahren-Knopf
    const dir = state.bootUfer === 'links' ? '→' : '←';
    p.push(svg.rect(FAHREN.x, FAHREN.y, FAHREN.w, FAHREN.h, '#5b4fcf', { rx: 12 }));
    p.push(svg.text(300, FAHREN.y + 29, `⛵ ${tt(app, T.fahren)} ${dir}`,
      { fill: '#fff', 'font-size': 20, 'font-weight': 'bold', 'text-anchor': 'middle' }));

    // Rückgängig-Knopf (sobald es einen Zug gibt)
    if (state.historie.length) {
      p.push(svg.rect(UNDO.x, UNDO.y, UNDO.w, UNDO.h, '#fff', { rx: 10, stroke: '#c8c8d8', 'stroke-width': 1 }));
      p.push(svg.text(UNDO.x + UNDO.w / 2, UNDO.y + 26, `↩ ${tt(app, T.rueckgaengig)}`,
        { fill: '#444', 'font-size': 16, 'font-weight': 'bold', 'text-anchor': 'middle' }));
    }

    // Fress-Banner mit Rückgängig-Knopf
    if (state.gefressen) {
      p.push(svg.rect(150, 140, 300, 150, '#fff', { rx: 14, stroke: '#e03131', 'stroke-width': 3 }));
      p.push(svg.text(300, 178, '😱', { 'font-size': 34, 'text-anchor': 'middle' }));
      p.push(svg.text(300, 214, this._gefressenText(state, app),
        { 'font-size': 16, 'text-anchor': 'middle', fill: '#c92a2a', 'font-weight': 'bold' }));
      p.push(svg.rect(BANNER_BTN.x, BANNER_BTN.y, BANNER_BTN.w, BANNER_BTN.h, '#e03131', { rx: 10 }));
      p.push(svg.text(300, BANNER_BTN.y + 29, `↩ ${tt(app, T.rueckgaengig)}`,
        { fill: '#fff', 'font-size': 17, 'font-weight': 'bold', 'text-anchor': 'middle' }));
    }

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">${p.join('')}</svg>`;
  },

  // Gegenstände am Ufer, die aktuell angezeigt werden (Mitfahrer steht im Boot).
  _bankAnzeige(state, ufer) {
    const items = bankItems(state, ufer);
    if (state.bootUfer === ufer && state.ladung) {
      return items.filter(k => k !== state.ladung);
    }
    return items;
  },

  _boot(cx, cy, ladung) {
    const hull = svg.el('path', {
      d: `M${cx - 50} ${cy - 4} L${cx + 50} ${cy - 4} L${cx + 32} ${cy + 18} L${cx - 32} ${cy + 18} Z`,
      fill: '#8a5a2b', stroke: '#5e3a1a', 'stroke-width': 2
    });
    const rand = svg.rect(cx - 50, cy - 10, 100, 8, '#6d4420', { rx: 3 });
    const bx = ladung ? cx - 18 : cx;
    const bauer = svg.text(bx, cy - 8, BAUER, { 'font-size': 34, 'text-anchor': 'middle' });
    let pass = '';
    if (ladung) {
      pass = svg.circle(cx + 18, cy - 14, 22, '#ffd93d', { opacity: 0.55 });
      pass += svg.text(cx + 18, cy - 8, ITEMS[ladung].e, { 'font-size': 34, 'text-anchor': 'middle' });
    }
    return hull + rand + bauer + pass;
  },

  _gefressenText(state, app) {
    const ev = state.gefressen;
    if (!ev) return '';
    if (ev.length >= 2) return tt(app, GEFRESSEN_TEXTE.beide);
    return tt(app, GEFRESSEN_TEXTE[`${ev[0].raeuber}_${ev[0].opfer}`]);
  },

  _hit(x, y, r) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; },

  _hitBoot(state, x, y) {
    const cx = DOCK[state.bootUfer];
    return x >= cx - 52 && x <= cx + 52 && y >= 250 && y <= 335;
  },

  // ─── Interaktion ──────────────────────────────────────────────────
  onTap(state, x, y, app) {
    if (state.fertig) return;
    if (state.historie.length && this._hit(x, y, UNDO)) { this._undo(app); return; }
    if (state.gefressen) {
      if (this._hit(x, y, BANNER_BTN)) this._undo(app);
      return;
    }
    if (this._hit(x, y, FAHREN)) { this._fahren(app); return; }
    if (state.ladung && this._hitBoot(state, x, y)) { state.ladung = null; app.rerender(); return; }

    // Gegenstand am eigenen Ufer auswählen/abwählen
    const ufer = state.bootUfer;
    const items = this._bankAnzeige(state, ufer);
    const slots = UFER[ufer].items;
    for (let i = 0; i < items.length; i++) {
      if (Math.abs(x - slots[i]) < 32 && y > 250 && y < 335) {
        const kind = items[i];
        state.ladung = state.ladung === kind ? null : kind;
        app.rerender();
        return;
      }
    }
  },

  _fahren(app) {
    const s = app.state;
    if (s.fertig || s.gefressen) return;
    s.historie.push(this._snapshot(s));

    const von = s.bootUfer;
    const nach = von === 'links' ? 'rechts' : 'links';
    if (s.ladung) {
      s.bank[von] = s.bank[von].filter(k => k !== s.ladung);
      s.bank[nach].push(s.ladung);
      s.ladung = null;
    }
    s.bootUfer = nach;
    s.zuege++;

    const paare = verbotenePaare(s.bank[von]);
    if (paare.length) {
      s.gefressen = paare.map(([raeuber, opfer]) => ({ raeuber, opfer, ufer: von }));
    } else if (nach === 'rechts' && s.bank.rechts.length === 3) {
      s.fertig = true;
    }
    app.rerender();
  },

  _snapshot(s) {
    return {
      bank: { links: [...s.bank.links], rechts: [...s.bank.rechts] },
      bootUfer: s.bootUfer,
      ladung: s.ladung,
      zuege: s.zuege,
      fertig: s.fertig,
      gefressen: s.gefressen
    };
  },

  _undo(app) {
    const s = app.state;
    if (!s.historie.length) return;
    Object.assign(s, s.historie.pop());
    app.rerender();
  },

  // ─── Auswertung ───────────────────────────────────────────────────
  evaluate(state, app) {
    if (state.fertig) {
      const perfekt = state.zuege === OPTIMAL;
      return {
        fertig: true,
        optimal: OPTIMAL,
        text: perfekt
          ? { de: 'Perfekt!', ru: 'Идеально!', en: 'Perfect!' }
          : { de: 'Geschafft!', ru: 'Получилось!', en: 'You made it!' },
        wert: `${state.zuege} ${tt(app, T.ueberfahrten)} · ${tt(app, T.mindestens)} ${OPTIMAL}`
      };
    }
    return null;
  },

  statusHtml(state, app) {
    if (state.gefressen) {
      return `<div class="ma-result" style="background:#ffe8e8;border:1px solid #f2b8b8">😱 ${this._gefressenText(state, app)} – ${tt(app, T.rueckgaengig)} ↩</div>`;
    }
    const l = this._bankAnzeige(state, 'links').map(k => ITEMS[k].e).join('');
    const r = this._bankAnzeige(state, 'rechts').map(k => ITEMS[k].e).join('');
    const boot = `🚣${state.ladung ? ITEMS[state.ladung].e : ''}`;
    const links = state.bootUfer === 'links' ? `${l} ${boot}`.trim() : (l || '·');
    const rechts = state.bootUfer === 'rechts' ? `${r} ${boot}`.trim() : (r || '·');
    return `<div class="ma-result">${state.zuege} ${tt(app, T.ueberfahrten)} · ⬅ ${links} | ➡ ${rechts} · ${tt(app, T.mindestens)} ${OPTIMAL}</div>`;
  },

  actions: {
    fahren(state, ...args) { const app = args[args.length - 1]; this._fahren(app); },
    rueckgaengig(state, ...args) { const app = args[args.length - 1]; this._undo(app); }
  }
});

export default app;

export function mount(root) { app.mount(root); }
