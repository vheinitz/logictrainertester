/**
 * Oberbegriffe: Tiere sortieren.
 * idee-db: 39
 *
 * Buch: Adaptatsia_Uchebnykh_Materialov_Dlya_Obuchayuschikhsya_S_Ras,
 * S. 61–63, Teil III, 3.2.4 „Окружающий мир“, Пример № 17.
 *
 * Kernspiel des Moduls „Oberbegriffe“: Tierbilder werden auf Felder für
 * Insekten, Fische, Vögel und Säugetiere verteilt. Jede Gruppe zeigt als
 * Anker ein großes, festes Beispielbild (ohne Text). Das Kind zieht (oder
 * tippt) jedes Tier in die richtige Gruppe und bekommt sofort Rückmeldung,
 * die erklärt, WARUM das Tier dorthin gehört.
 *
 * Leichte Stufe (⚙️): statt der Tierkarten werden vorgegebene
 * Gruppen-Beispielbilder auf die Tierbilder gezogen – das Kind muss die Namen
 * nicht selbst kennen.
 *
 * Bilder: `img` ist pro Tier vorerst `null`. Solange kein Bild hinterlegt ist,
 * zeigt die App das feste Emoji-Bild des Tiers (ohne Text) als Kartenbild.
 * Später können echte Bilder ergänzt werden (Konvention: `bilder/<tierId>.png`).
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 620, VIEW_H = 560;

/** Die übergeordneten Klassen (Gruppen). `anker` = Beispielbild je Gruppe. */
const GROUPS = [
  {
    id: 'insekten',
    anker: 'schmetterling',
    name: { de: 'Insekten', ru: 'Насекомые', en: 'Insects' },
    merkmal: {
      de: 'sie haben 6 Beine',
      ru: 'у них 6 ног',
      en: 'they have 6 legs'
    }
  },
  {
    id: 'fische',
    anker: 'fisch',
    name: { de: 'Fische', ru: 'Рыбы', en: 'Fish' },
    merkmal: {
      de: 'sie leben im Wasser und atmen mit Kiemen',
      ru: 'они живут в воде и дышат жабрами',
      en: 'they live in water and breathe with gills'
    }
  },
  {
    id: 'voegel',
    anker: 'adler',
    name: { de: 'Vögel', ru: 'Птицы', en: 'Birds' },
    merkmal: {
      de: 'sie haben Federn und Flügel',
      ru: 'у них есть перья и крылья',
      en: 'they have feathers and wings'
    }
  },
  {
    id: 'saeugetiere',
    anker: 'hund',
    name: { de: 'Säugetiere', ru: 'Млекопитающие', en: 'Mammals' },
    merkmal: {
      de: 'ihre Babys trinken Milch und sie haben Fell',
      ru: 'их детёныши пьют молоко, и у них есть шерсть',
      en: 'their babies drink milk and they have fur'
    }
  }
];

/**
 * Tierpool – 6 je Gruppe, damit auch 12 Tiere mit nur 2 Gruppen möglich sind.
 * `img` bleibt `null`, bis echte Bilder vorliegen (Platzhalter s. o.).
 */
const TIERE = [
  // Insekten
  { id: 'schmetterling', gruppe: 'insekten', e: '🦋', img: null, name: { de: 'Schmetterling', ru: 'Бабочка', en: 'Butterfly' } },
  { id: 'biene',         gruppe: 'insekten', e: '🐝', img: null, name: { de: 'Biene', ru: 'Пчела', en: 'Bee' } },
  { id: 'ameise',        gruppe: 'insekten', e: '🐜', img: null, name: { de: 'Ameise', ru: 'Муравей', en: 'Ant' } },
  { id: 'marienkaefer',  gruppe: 'insekten', e: '🐞', img: null, name: { de: 'Marienkäfer', ru: 'Божья коровка', en: 'Ladybug' } },
  { id: 'heuschrecke',   gruppe: 'insekten', e: '🦗', img: null, name: { de: 'Heuschrecke', ru: 'Кузнечик', en: 'Grasshopper' } },
  { id: 'kaefer',        gruppe: 'insekten', e: '🪲', img: null, name: { de: 'Käfer', ru: 'Жук', en: 'Beetle' } },

  // Fische
  { id: 'fisch',      gruppe: 'fische', e: '🐟', img: null, name: { de: 'Fisch', ru: 'Рыба', en: 'Fish' } },
  { id: 'goldfisch',  gruppe: 'fische', e: '🐠', img: null, name: { de: 'Goldfisch', ru: 'Золотая рыбка', en: 'Goldfish' } },
  { id: 'hai',        gruppe: 'fische', e: '🦈', img: null, name: { de: 'Hai', ru: 'Акула', en: 'Shark' } },
  { id: 'kugelfisch', gruppe: 'fische', e: '🐡', img: null, name: { de: 'Kugelfisch', ru: 'Рыба-ёж', en: 'Pufferfish' } },
  { id: 'lachs',      gruppe: 'fische', e: '🐟', img: null, name: { de: 'Lachs', ru: 'Лосось', en: 'Salmon' } },
  { id: 'hecht',      gruppe: 'fische', e: '🐟', img: null, name: { de: 'Hecht', ru: 'Щука', en: 'Pike' } },

  // Vögel
  { id: 'adler',   gruppe: 'voegel', e: '🦅', img: null, name: { de: 'Adler', ru: 'Орёл', en: 'Eagle' } },
  { id: 'eule',    gruppe: 'voegel', e: '🦉', img: null, name: { de: 'Eule', ru: 'Сова', en: 'Owl' } },
  { id: 'ente',    gruppe: 'voegel', e: '🦆', img: null, name: { de: 'Ente', ru: 'Утка', en: 'Duck' } },
  { id: 'papagei', gruppe: 'voegel', e: '🦜', img: null, name: { de: 'Papagei', ru: 'Попугай', en: 'Parrot' } },
  { id: 'pinguin', gruppe: 'voegel', e: '🐧', img: null, name: { de: 'Pinguin', ru: 'Пингвин', en: 'Penguin' } },
  { id: 'taube',   gruppe: 'voegel', e: '🕊️', img: null, name: { de: 'Taube', ru: 'Голубь', en: 'Pigeon' } },

  // Säugetiere
  { id: 'hund',    gruppe: 'saeugetiere', e: '🐶', img: null, name: { de: 'Hund', ru: 'Собака', en: 'Dog' } },
  { id: 'katze',   gruppe: 'saeugetiere', e: '🐱', img: null, name: { de: 'Katze', ru: 'Кошка', en: 'Cat' } },
  { id: 'loewe',   gruppe: 'saeugetiere', e: '🦁', img: null, name: { de: 'Löwe', ru: 'Лев', en: 'Lion' } },
  { id: 'elefant', gruppe: 'saeugetiere', e: '🐘', img: null, name: { de: 'Elefant', ru: 'Слон', en: 'Elephant' } },
  { id: 'pferd',   gruppe: 'saeugetiere', e: '🐴', img: null, name: { de: 'Pferd', ru: 'Лошадь', en: 'Horse' } },
  { id: 'wal',     gruppe: 'saeugetiere', e: '🐋', img: null, name: { de: 'Wal', ru: 'Кит', en: 'Whale' } }
];

const T = {
  tiere:    { de: 'Tiere', ru: 'животных', en: 'animals' },
  fehler:   { de: 'Fehler', ru: 'ошибки', en: 'mistakes' },
  geschafft: { de: 'Geschafft!', ru: 'Получилось!', en: 'You did it!' }
};

function sprache(app) {
  return (app && typeof app.get === 'function') ? (app.get('sprache') || 'de') : 'de';
}
function tt(app, o) {
  const l = sprache(app);
  return (o && (o[l] || o.de)) || '';
}
function tierVonId(id) { return TIERE.find(t => t.id === id); }
function gruppeVonId(id) { return GROUPS.find(g => g.id === id); }

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Rückmeldung, die erklärt, WARUM ein Tier in die Gruppe gehört. */
function gutText(app, tier, gruppe) {
  const l = sprache(app);
  const t = tt(app, tier.name), g = tt(app, gruppe.name), m = tt(app, gruppe.merkmal);
  if (l === 'ru') return `${t} — правильно! Это «${g}», так как ${m}.`;
  if (l === 'en') return `${t} — correct! It belongs to ${g}, because ${m}.`;
  return `${t} — richtig! Gehört zu „${g}“, denn ${m}.`;
}
function falschText(app, tier, versuch, richtig) {
  const l = sprache(app);
  const t = tt(app, tier.name), v = tt(app, versuch.name), r = tt(app, richtig.name);
  if (l === 'ru') return `${t} — нет. Это не «${v}», а «${r}».`;
  if (l === 'en') return `${t} — no. Not ${v}, but ${r}.`;
  return `${t} — nein. Gehört nicht zu „${v}“, sondern zu „${r}“.`;
}

/** Tierkarte: zeigt immer das feste Bild (Emoji oder echtes Bild), ohne Text. */
function tierKarte(app, tier, x, y, w, h, extra = {}) {
  const p = [];
  const fill = extra.falsch ? '#ffe3e3'
    : extra.done ? '#f4f4f4'
    : extra.selected ? '#eef0ff'
    : '#fff';
  const stroke = extra.falsch ? '#e03131'
    : extra.selected ? '#5b4fcf'
    : extra.done ? '#e5e5e5'
    : '#d8d4f0';
  const sw = (extra.falsch || extra.selected) ? 3 : 1.5;
  p.push(svg.rect(x, y, w, h, fill, { rx: 10, stroke, 'stroke-width': sw }));

  if (tier.img) {
    p.push(svg.el('image', {
      href: tier.img, x: x + 3, y: y + 3, width: w - 6, height: h - 6,
      preserveAspectRatio: 'xMidYMid meet'
    }));
  } else {
    // Festes Bild: großes, zentriertes Emoji – bewusst ohne Namenstext.
    const emojiSize = Math.round(Math.min(w, h) * 0.62);
    p.push(svg.text(x + w / 2, y + h / 2 + Math.round(emojiSize * 0.33), tier.e,
      { 'font-size': emojiSize, 'text-anchor': 'middle',
        opacity: extra.done ? 0.45 : 1 }));
  }

  if (extra.check) {
    p.push(svg.text(x + w - 8, y + 16, '✓',
      { 'font-size': 13, fill: '#2a8a2a', 'font-weight': 'bold', 'text-anchor': 'end' }));
  }
  return p.join('');
}

function hit(rects, x, y) {
  if (!rects) return null;
  for (const r of rects) {
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r;
  }
  return null;
}

/** Raster für Tierkarten (Modus A: Pool unten, Modus B: Bilder oben). */
function layoutKarten(n, topY) {
  const cols = n <= 6 ? 3 : 4;
  const cW = 96, cH = 96, gap = 12;
  const gridW = cols * cW + (cols - 1) * gap;
  const startX = Math.round((VIEW_W - gridW) / 2);
  const rects = [];
  for (let i = 0; i < n; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    rects.push({ index: i, x: startX + col * (cW + gap), y: topY + row * (cH + gap), w: cW, h: cH });
  }
  return { cols, cW, cH, rects };
}

function layoutGruppen(n) {
  const w = 138, h = 200, gap = 10;
  const total = n * w + (n - 1) * gap;
  const startX = Math.round((VIEW_W - total) / 2);
  const rects = [];
  for (let i = 0; i < n; i++) {
    rects.push({ index: i, x: startX + i * (w + gap), y: 10, w, h });
  }
  return rects;
}

function layoutGruppenKarten(n) {
  const w = 138, h = 96, gap = 10;
  const total = n * w + (n - 1) * gap;
  const startX = Math.round((VIEW_W - total) / 2);
  const y = VIEW_H - h - 14;
  const rects = [];
  for (let i = 0; i < n; i++) {
    rects.push({ index: i, x: startX + i * (w + gap), y, w, h });
  }
  return rects;
}

const app = new MiniApp({
  id: 'tiere-sortieren',
  icon: '🐾',
  titel: {
    de: 'Oberbegriffe: Tiere sortieren',
    ru: 'Обобщения: сортируем животных',
    en: 'Categories: Sorting Animals'
  },
  anweisung: {
    de: 'Ziehe jedes Tier in die passende Gruppe. Tippe zuerst ein Tier an oder ziehe es direkt in die Gruppe. Oben in jeder Gruppe siehst du das große Beispielbild.',
    ru: 'Перетащи каждое животное в нужную группу. Сначала коснись животного или сразу перетащи его в группу. Вверху каждой группы — большая картинка-пример.',
    en: 'Drag each animal to the matching group. First tap an animal or drag it directly into the group. Each group shows a large example picture at the top.'
  },
  hilfe: {
    de: 'Es gibt 4 Tiergruppen: Insekten (6 Beine), Fische (leben im Wasser und atmen mit Kiemen), Vögel (Federn und Flügel) und Säugetiere (Babys trinken Milch, Fell). Jede Gruppe erkennst du an ihrem großen Beispielbild oben. Lege jedes Tier in die richtige Gruppe. Bei einem Fehler erklärt dir die Rückmeldung, warum das Tier woanders hingehört. In der leichten Stufe (⚙️) ziehst du das Gruppen-Beispielbild auf das Tier.',
    ru: 'Есть 4 группы: насекомые (6 ног), рыбы (живут в воде, дышат жабрами), птицы (перья и крылья) и млекопитающие (детёныши пьют молоко, есть шерсть). Каждую группу можно узнать по большой картинке-примеру вверху. Положи каждое животное в нужную группу. При ошибке подсказка объяснит, почему. В лёгком уровне (⚙️) перетаскивай картинку-пример группы на животное.',
    en: 'There are 4 groups: insects (6 legs), fish (live in water, breathe with gills), birds (feathers and wings) and mammals (babies drink milk, fur). Each group is marked by a large example picture at the top. Put each animal into the right group. If you make a mistake, the feedback explains why it belongs elsewhere. In the easy level (⚙️) you drag the group example picture onto the animal instead.'
  },
  settingsSchema: {
    gruppen: {
      def: 4, min: 2, max: 4, step: 1,
      label: { de: 'Gruppen', ru: 'Группы', en: 'Groups' }
    },
    tiere: {
      def: 8, min: 6, max: 12, step: 1,
      label: { de: 'Tiere', ru: 'Животные', en: 'Animals' }
    },
    leicht: {
      def: 0, bool: true,
      label: { de: 'Leichte Stufe (Gruppenkarten)', ru: 'Лёгкий уровень (карточки групп)', en: 'Easy level (group cards)' }
    }
  },
  auswertung: 'zuege',

  // ─── Zustand ───────────────────────────────────────────────────────
  init(state, app) {
    state.modus = app.get('leicht') ? 'gruppenkarten' : 'sortieren';
    state.anzahlGruppen = app.get('gruppen');
    state.anzahlTiere = app.get('tiere');
    state.gruppen = GROUPS.slice(0, state.anzahlGruppen);
    state.tiere = this._tiereAuswaehlen(state.anzahlTiere, state.gruppen);
    state.gewaehlt = null;
    state.gewaehltGruppe = null;
    state.falsch = null;
    state.fehler = 0;
    state.platz = {};      // tierId -> gruppeId (Modus A)
    state.zuordnung = {};  // tierId -> gruppeId (Modus B)
    state.rueckmeldung = null;
    state.fertig = false;
  },

  _tiereAuswaehlen(n, gruppen) {
    const auswahl = [];
    const per = Math.floor(n / gruppen.length);
    let rest = n % gruppen.length;
    for (const g of gruppen) {
      const kandidaten = TIERE.filter(t => t.gruppe === g.id);
      const k = per + (rest > 0 ? 1 : 0);
      if (rest > 0) rest--;
      auswahl.push(...shuffle(kandidaten).slice(0, k));
    }
    return shuffle(auswahl);
  },

  onSettingsChange(app) { app.reset(); },

  // ─── Rendering ────────────────────────────────────────────────────
  render(state, app) {
    return state.modus === 'gruppenkarten'
      ? this._renderGruppenkarten(state, app)
      : this._renderSortieren(state, app);
  },

  _renderSortieren(state, app) {
    const p = [svg.rect(0, 0, VIEW_W, VIEW_H, '#fafaff')];

    // Gruppenfelder (Drop-Zonen) oben, mit großem festem Anker-Bild (ohne Text).
    const gruppen = layoutGruppen(state.gruppen.length);
    state.gruppenRects = [];
    state.gruppen.forEach((g, i) => {
      const r = gruppen[i];
      state.gruppenRects.push({ gruppeId: g.id, index: i, x: r.x, y: r.y, w: r.w, h: r.h });
      p.push(svg.rect(r.x, r.y, r.w, r.h, '#f4f2ff', { rx: 12, stroke: '#c9c2f2', 'stroke-width': 2 }));

      // Großes Beispielbild als einziger Gruppen-Anker (bewusst ohne Namenstext).
      const anker = tierVonId(g.anker);
      const aW = 96;
      p.push(tierKarte(app, anker, r.x + Math.round((r.w - aW) / 2), r.y + 12, aW, aW, {}));

      const platziert = state.tiere.filter(t => state.platz[t.id] === g.id);
      platziert.forEach((t, k) => {
        const col = k % 3, row = Math.floor(k / 3);
        p.push(tierKarte(app, t, r.x + 8 + col * 44, r.y + 116 + row * 44, 40, 40, { check: true }));
      });
    });

    // Tierkarten-Pool unten. Platzierte Karten behalten ihr festes Bild.
    const karten = layoutKarten(state.tiere.length, 225);
    state.kartenRects = [];
    state.tiere.forEach((t, i) => {
      const k = karten.rects[i];
      if (state.platz[t.id]) {
        p.push(tierKarte(app, t, k.x, k.y, k.w, k.h, { done: true, check: true }));
      } else {
        state.kartenRects.push({ tierId: t.id, index: i, x: k.x, y: k.y, w: k.w, h: k.h });
        p.push(tierKarte(app, t, k.x, k.y, k.w, k.h,
          { selected: state.gewaehlt === i, falsch: state.falsch === i }));
      }
    });

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">${p.join('')}</svg>`;
  },

  _renderGruppenkarten(state, app) {
    const p = [svg.rect(0, 0, VIEW_W, VIEW_H, '#fafaff')];

    // Tierbilder oben (Drop-Zonen für die Gruppen-Bilder).
    const karten = layoutKarten(state.tiere.length, 60);
    state.tierRects = [];
    state.tiere.forEach((t, i) => {
      const k = karten.rects[i];
      state.tierRects.push({ tierId: t.id, index: i, x: k.x, y: k.y, w: k.w, h: k.h });
      const zu = state.zuordnung[t.id];
      p.push(tierKarte(app, t, k.x, k.y, k.w, k.h,
        { check: !!zu, falsch: state.falsch === i }));
    });

    // Vorgegebene Gruppen-Bilder unten (ziehen) – groß und ohne Text.
    const gk = layoutGruppenKarten(state.gruppen.length);
    state.gruppenKartenRects = [];
    state.gruppen.forEach((g, i) => {
      const r = gk[i];
      state.gruppenKartenRects.push({ gruppeId: g.id, index: i, x: r.x, y: r.y, w: r.w, h: r.h });
      const sel = state.gewaehltGruppe === i;
      p.push(svg.rect(r.x, r.y, r.w, r.h, sel ? '#eef0ff' : '#fff',
        { rx: 10, stroke: sel ? '#5b4fcf' : '#c9c2f2', 'stroke-width': sel ? 3 : 2 }));
      const anker = tierVonId(g.anker);
      p.push(svg.text(r.x + r.w / 2, r.y + r.h / 2 + 20, anker.e,
        { 'font-size': 56, 'text-anchor': 'middle' }));
    });

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">${p.join('')}</svg>`;
  },

  // ─── Interaktion ──────────────────────────────────────────────────
  onTap(state, x, y, app) {
    if (state.fertig) return;
    if (state.modus === 'gruppenkarten') { this._tapGruppenkarten(state, x, y, app); return; }
    this._tapSortieren(state, x, y, app);
  },

  _tapSortieren(state, x, y, app) {
    const g = hit(state.gruppenRects, x, y);
    if (g && state.gewaehlt != null) { this._platziere(app, state.gewaehlt, g.gruppeId); return; }

    const k = hit(state.kartenRects, x, y);
    if (k) {
      if (state.gewaehlt === k.index) {
        state.gewaehlt = null;
        state.falsch = null;
      } else {
        state.gewaehlt = k.index;
        state.falsch = null;
        state.rueckmeldung = null;
      }
      app.rerender();
      return;
    }

    if (state.gewaehlt != null) { state.gewaehlt = null; state.falsch = null; app.rerender(); }
  },

  _tapGruppenkarten(state, x, y, app) {
    const t = hit(state.tierRects, x, y);
    if (t && state.gewaehltGruppe != null) { this._ordneZu(app, t.index, state.gewaehltGruppe); return; }

    const g = hit(state.gruppenKartenRects, x, y);
    if (g) {
      state.gewaehltGruppe = state.gewaehltGruppe === g.index ? null : g.index;
      state.falsch = null;
      state.rueckmeldung = null;
      app.rerender();
      return;
    }

    if (state.gewaehltGruppe != null) { state.gewaehltGruppe = null; state.falsch = null; app.rerender(); }
  },

  onDrop(state, x0, y0, x1, y1, app) {
    if (state.fertig) return;
    if (state.modus === 'gruppenkarten') {
      const g = hit(state.gruppenKartenRects, x0, y0);
      const t = hit(state.tierRects, x1, y1);
      if (g && t) { this._ordneZu(app, t.index, g.index); return; }
      app.rerender();
      return;
    }
    const k = hit(state.kartenRects, x0, y0);
    const g = hit(state.gruppenRects, x1, y1);
    if (k && g) { this._platziere(app, k.index, g.gruppeId); return; }
    app.rerender();
  },

  _platziere(app, tierIndex, gruppeId) {
    const s = app.state;
    const tier = s.tiere[tierIndex];
    s.gewaehlt = null;
    if (tier.gruppe === gruppeId) {
      s.platz[tier.id] = gruppeId;
      s.falsch = null;
      s.rueckmeldung = { gut: true, tierId: tier.id, gruppeId };
    } else {
      s.fehler++;
      s.falsch = tierIndex;
      s.rueckmeldung = { gut: false, tierId: tier.id, versuchId: gruppeId, richtigId: tier.gruppe };
    }
    if (Object.keys(s.platz).length === s.tiere.length) s.fertig = true;
    app.rerender();
  },

  _ordneZu(app, tierIndex, gruppenIndex) {
    const s = app.state;
    const tier = s.tiere[tierIndex];
    const gruppe = s.gruppen[gruppenIndex];
    s.gewaehltGruppe = null;
    if (tier.gruppe === gruppe.id) {
      s.zuordnung[tier.id] = gruppe.id;
      s.falsch = null;
      s.rueckmeldung = { gut: true, tierId: tier.id, gruppeId: gruppe.id };
    } else {
      s.fehler++;
      s.falsch = tierIndex;
      s.rueckmeldung = { gut: false, tierId: tier.id, versuchId: gruppe.id, richtigId: tier.gruppe };
    }
    if (Object.keys(s.zuordnung).length === s.tiere.length) s.fertig = true;
    app.rerender();
  },

  // ─── Auswertung ───────────────────────────────────────────────────
  statusHtml(state, app) {
    const n = state.tiere.length;
    const fertig = state.modus === 'gruppenkarten'
      ? Object.keys(state.zuordnung).length
      : Object.keys(state.platz).length;
    let line = `✔ ${fertig}/${n} ${tt(app, T.tiere)} · ${tt(app, T.fehler)}: ${state.fehler}`;
    if (state.rueckmeldung) {
      const r = state.rueckmeldung;
      const tier = tierVonId(r.tierId);
      const txt = r.gut
        ? gutText(app, tier, gruppeVonId(r.gruppeId))
        : falschText(app, tier, gruppeVonId(r.versuchId), gruppeVonId(r.richtigId));
      line += `<br>${txt}`;
    }
    return `<div class="ma-result">${line}</div>`;
  },

  evaluate(state, app) {
    if (state.fertig) {
      return {
        fertig: true,
        text: T.geschafft,
        wert: `${state.tiere.length} ${tt(app, T.tiere)} · ${tt(app, T.fehler)}: ${state.fehler}`
      };
    }
    return null;
  },

  actions: {
    // Programmatisch/Test: Tier `tierIndex` in Gruppe `gruppenIndex` legen.
    platziere(state, tierIndex, gruppenIndex, app) {
      const g = state.gruppen[gruppenIndex];
      if (g) this._platziere(app, tierIndex, g.id);
    },
    ordneZu(state, tierIndex, gruppenIndex, app) {
      if (state.gruppen[gruppenIndex]) this._ordneZu(app, tierIndex, gruppenIndex);
    }
  }
});

export default app;

export function mount(root) { app.mount(root); }
