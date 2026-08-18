/**
 * Tanz-Challenge – Bewegungsfolgen nachmachen (Dance Challenge).
 * idee-db: 106
 *
 * Aus der Ideen-DB (Beitrag 106, Carol Vorderman/Craig Steele/Claire Quigley:
 * „Dance Challenge“, S. 138–140, Spielprinzip und Ablaufplan).
 *
 * Eine Figur tanzt eine Folge aus vier Bewegungen vor (vier farbige Felder,
 * jede Farbe hat einen eigenen Ton). Das Kind tippt die Folge nach; danach
 * tanzt die Figur die Folge noch einmal langsam vor, damit das Kind selbst
 * vergleichen kann. Ohne Wertung – reines Nachmachen und Kontrollieren.
 * Im Modus „Vorspielen“ denkt sich das Kind selbst eine Folge aus und die
 * Figur tanzt sie nach (Kind wird selbst zum Anleiter).
 *
 * Die Figur ist aus einzeln gezeichneten Gliedern (mit und ohne Beugung)
 * zusammengesetzt – so lassen sich die Bewegungen gut darstellen.
 */
import { MiniApp } from '../_framework/framework.js';

// ─── Vier Bewegungen / farbige Felder ────────────────────────────────
const PADS = [
  { pose: 0, farbe: '#ef5350', freq: 262, name: { de: 'Arme hoch', ru: 'Руки вверх', en: 'Arms up' } },
  { pose: 1, farbe: '#42a5f5', freq: 330, name: { de: 'Arme seitlich', ru: 'Руки в стороны', en: 'Arms out' } },
  { pose: 2, farbe: '#66bb6a', freq: 392, name: { de: 'Kniebeuge', ru: 'Приседание', en: 'Squat' } },
  { pose: 3, farbe: '#ffca28', freq: 523, name: { de: 'Sprung', ru: 'Прыжок', en: 'Jump' } },
];

// Glieder je Bewegung: Ober-/Unterarm und Ober-/Unterschenkel als Punkte
// (relativ zum Hüft-Mittelpunkt der Figur) – dadurch sind Beugungen sichtbar.
const POSEN = {
  0: { armL: { elbow: [-14, -72], hand: [-22, -96] }, armR: { elbow: [14, -72], hand: [22, -96] }, legL: { knee: [-4, 46], foot: [-6, 80] }, legR: { knee: [4, 46], foot: [6, 80] } },
  1: { armL: { elbow: [-36, -40], hand: [-60, -40] }, armR: { elbow: [36, -40], hand: [60, -40] }, legL: { knee: [-4, 46], foot: [-6, 80] }, legR: { knee: [4, 46], foot: [6, 80] } },
  2: { armL: { elbow: [-12, -2], hand: [-14, 28] }, armR: { elbow: [12, -2], hand: [14, 28] }, legL: { knee: [-26, 42], foot: [-32, 60] }, legR: { knee: [26, 42], foot: [32, 60] } },
  3: { armL: { elbow: [-14, -72], hand: [-22, -96] }, armR: { elbow: [14, -72], hand: [22, -96] }, legL: { knee: [-22, 44], foot: [-36, 76] }, legR: { knee: [22, 44], foot: [36, 76] } },
};
const NEUTRAL = { armL: { elbow: [-10, -2], hand: [-12, 26] }, armR: { elbow: [10, -2], hand: [14, 26] }, legL: { knee: [-4, 46], foot: [-6, 80] }, legR: { knee: [4, 46], foot: [6, 80] } };

const VIEW_W = 600;
const VIEW_H = 640;

const PAD_W = 128;
const PAD_H = 172;
const PAD_Y = 436;
const PAD_X = [20, 164, 308, 452];

const MODE_BTNS = [
  { id: 'merken', x: 20, y: 14, w: 272, h: 40, label: { de: '🎓 Nachmachen', ru: '🎓 Повторить', en: '🎓 Copy' } },
  { id: 'frei', x: 308, y: 14, w: 272, h: 40, label: { de: '🎤 Vorspielen', ru: '🎤 Показать', en: '🎤 Perform' } },
];

// ─── Mehrsprachigkeit (wie Haupt-App, erweiterbar) ────────────────────
function lang() {
  try { return localStorage.getItem('miniapp-lang') || 'de'; }
  catch { return 'de'; }
}
function T(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang()] || obj.de || '';
}

// ─── SVG-Bausteine ────────────────────────────────────────────────────

/** Einzeln zusammengesetzte Gliederfigur. `pose` = -1 → neutrale Haltung. */
function figurSvg(pose, cx, cy, s, farbe) {
  const p = (pose == null || pose < 0) ? NEUTRAL : POSEN[pose];
  const X = (x) => cx + x * s;
  const Y = (y) => cy + y * s;
  const linie = (x1, y1, x2, y2, w, color) =>
    `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${color}" stroke-width="${(w * s).toFixed(2)}" stroke-linecap="round"/>`;
  const hemd = farbe || '#8a8aa0';
  const dunkel = '#4a4a5e';
  const glieder =
    linie(0, -44, 0, 12, 11, hemd) +
    linie(-10, -40, p.armL.elbow[0], p.armL.elbow[1], 6, dunkel) +
    linie(p.armL.elbow[0], p.armL.elbow[1], p.armL.hand[0], p.armL.hand[1], 6, dunkel) +
    linie(10, -40, p.armR.elbow[0], p.armR.elbow[1], 6, dunkel) +
    linie(p.armR.elbow[0], p.armR.elbow[1], p.armR.hand[0], p.armR.hand[1], 6, dunkel) +
    linie(-8, 12, p.legL.knee[0], p.legL.knee[1], 6, dunkel) +
    linie(p.legL.knee[0], p.legL.knee[1], p.legL.foot[0], p.legL.foot[1], 6, dunkel) +
    linie(8, 12, p.legR.knee[0], p.legR.knee[1], 6, dunkel) +
    linie(p.legR.knee[0], p.legR.knee[1], p.legR.foot[0], p.legR.foot[1], 6, dunkel);
  const kopf =
    `<circle cx="${X(0)}" cy="${Y(-62)}" r="${(18 * s).toFixed(2)}" fill="#ffd9c0" stroke="${dunkel}" stroke-width="${(3 * s).toFixed(2)}"/>` +
    `<circle cx="${X(-6)}" cy="${Y(-66)}" r="${(2.2 * s).toFixed(2)}" fill="${dunkel}"/>` +
    `<circle cx="${X(6)}" cy="${Y(-66)}" r="${(2.2 * s).toFixed(2)}" fill="${dunkel}"/>` +
    `<path d="M ${X(-8)} ${Y(-58)} Q ${X(0)} ${Y(-52)} ${X(8)} ${Y(-58)}" stroke="${dunkel}" stroke-width="${(2.4 * s).toFixed(2)}" fill="none" stroke-linecap="round"/>`;
  return glieder + kopf;
}

/** Welche Punkte die Punktreihe (Folgen-Anzeige) zeigen soll. */
function punkteZeile(state) {
  let L, dots;
  if (state.modus === 'merken') {
    L = state.laenge;
    dots = [];
    for (let i = 0; i < L; i++) {
      let val = null;
      if (state.phase === 'nachmachen') {
        val = i < state.eingabe.length ? state.eingabe[i] : null;
      } else if (state.phase === 'zeigen' || state.phase === 'checken') {
        val = i <= state.stepIndex ? state.seq[i] : null;
      } else if (state.phase === 'geschafft') {
        val = state.seq[i] != null ? state.seq[i] : null;
      }
      dots.push(val);
    }
  } else {
    L = state.seq.length;
    dots = state.seq.map((v, i) => (state.phase === 'abspielen' && i > state.stepIndex) ? null : v);
  }
  return { L, dots };
}

function punkteSvg(state) {
  const z = punkteZeile(state);
  if (!z.L) return '';
  const cy = 82, r = 12, gap = 34;
  const x0 = VIEW_W / 2 - (z.L - 1) * gap / 2;
  return z.dots.map((v, i) => {
    const cx = x0 + i * gap;
    if (v == null) return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" stroke="#b9b9c8" stroke-width="2"/>`;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PADS[v].farbe}" stroke="#00000033" stroke-width="2"/>`;
  }).join('');
}

function phasenText(state) {
  switch (state.phase) {
    case 'bereit':
      return T({
        de: `Runde ${state.runde} – ich zeige dir eine Folge mit ${state.laenge} Schritten.`,
        ru: `Раунд ${state.runde} — я покажу последовательность из ${state.laenge} шагов.`,
        en: `Round ${state.runde} – I'll show you a sequence of ${state.laenge} steps.`,
      });
    case 'zeigen': return T({ de: 'Schau genau zu …', ru: 'Смотри внимательно …', en: 'Watch closely …' });
    case 'nachmachen': return T({ de: 'Jetzt du! Tippe die Folge nach.', ru: 'Теперь ты! Нажми последовательность.', en: 'Your turn! Tap the sequence.' });
    case 'checken': return T({ de: 'Ich zeige es noch einmal langsam – vergleiche selbst.', ru: 'Я покажу ещё раз медленно — сравни.', en: "I'll show it again slowly – compare." });
    case 'geschafft':
      return T({
        de: `Fertig! Das war die Folge mit ${state.laenge} Schritten.`,
        ru: `Готово! Это была последовательность из ${state.laenge} шагов.`,
        en: `Done! That was the sequence of ${state.laenge} steps.`,
      });
    case 'aufnehmen': return T({ de: 'Tippe deine eigene Folge. Mit ▶ tanzt die Figur sie nach.', ru: 'Нажми свою последовательность. С ▶ фигурка её станцует.', en: 'Tap your own sequence. Press ▶ and the figure will dance it.' });
    case 'abspielen': return T({ de: 'Ich tanze deine Folge nach …', ru: 'Я танцую твою последовательность …', en: 'I dance your sequence …' });
    default: return '';
  }
}

function aktionsButtons(state) {
  const y = 382, h = 44;
  if (state.modus === 'merken') {
    if (state.phase === 'bereit') return [{ id: 'start', x: 230, y, w: 140, h, label: { de: '▶ Los', ru: '▶ Начать', en: '▶ Start' } }];
    if (state.phase === 'nachmachen') return [{ id: 'nochmal', x: 230, y, w: 140, h, label: { de: '🔁 Nochmal zeigen', ru: '🔁 Ещё раз', en: '🔁 Show again' } }];
    if (state.phase === 'geschafft') return [{ id: 'weiter', x: 230, y, w: 140, h, label: { de: '➡ Weiter', ru: '➡ Дальше', en: '➡ Next' } }];
    return [];
  }
  if (state.phase === 'aufnehmen') {
    const leer = state.seq.length === 0;
    return [
      { id: 'abspielen', x: 60, y, w: 150, h, disabled: leer, label: { de: '▶ Abspielen', ru: '▶ Проиграть', en: '▶ Play' } },
      { id: 'undo', x: 225, y, w: 150, h, disabled: leer, label: { de: '⌫ Letzten', ru: '⌫ Последний', en: '⌫ Last' } },
      { id: 'neu', x: 390, y, w: 150, h, label: { de: '🗑 Neu', ru: '🗑 Сначала', en: '🗑 New' } },
    ];
  }
  return [];
}

function aktionSvg(b) {
  const disabled = b.disabled;
  const fill = disabled ? '#e8e8ee' : '#ffffff';
  const stroke = disabled ? '#cccccc' : '#5b4fcf';
  const color = disabled ? '#b0b0b8' : '#333333';
  return `<g>
    <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <text x="${b.x + b.w / 2}" y="${b.y + b.h / 2 + 7}" font-size="18" font-weight="bold" fill="${color}" text-anchor="middle">${T(b.label)}</text>
  </g>`;
}

function modeBtnSvg(b, state) {
  const aktiv = state.modus === b.id;
  const fill = aktiv ? '#5b4fcf' : '#ffffff';
  const stroke = aktiv ? '#5b4fcf' : '#c9c3f0';
  const color = aktiv ? '#ffffff' : '#333333';
  return `<g>
    <rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
    <text x="${b.x + b.w / 2}" y="${b.y + b.h / 2 + 7}" font-size="18" font-weight="bold" fill="${color}" text-anchor="middle">${T(b.label)}</text>
  </g>`;
}

function padSvg(i, state) {
  const p = PADS[i];
  const x = PAD_X[i], y = PAD_Y;
  const aktiv = state.aktiverPad === i;
  const s = aktiv ? 0.52 : 0.46;
  const cx = x + PAD_W / 2;
  return `<g>
    <rect x="${x}" y="${y}" width="${PAD_W}" height="${PAD_H}" rx="16" fill="${p.farbe}" stroke="${aktiv ? '#222222' : '#00000033'}" stroke-width="${aktiv ? 5 : 2}"/>
    ${aktiv ? `<rect x="${x}" y="${y}" width="${PAD_W}" height="${PAD_H}" rx="16" fill="#ffffff" opacity="0.28"/>` : ''}
    ${figurSvg(i, cx, y + 70, s, p.farbe)}
    <rect x="${x + 10}" y="${y + 128}" width="${PAD_W - 20}" height="34" rx="12" fill="#000000" opacity="0.30"/>
    <text x="${cx}" y="${y + 151}" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">${T(p.name)}</text>
  </g>`;
}

// ─── App ──────────────────────────────────────────────────────────────
const app = new MiniApp({
  id: 'tanz-challenge',
  icon: '💃',
  titel: { de: 'Tanz-Challenge', ru: 'Танцевальный вызов', en: 'Dance Challenge' },
  anweisung: {
    de: 'Sieh zu, wie die Figur eine Folge vortanzt, und tippe die Farben danach in derselben Reihenfolge nach.',
    ru: 'Смотри, как фигурка танцует последовательность, и нажми цвета в том же порядке.',
    en: 'Watch the figure dance a sequence, then tap the colours in the same order.'
  },
  hilfe: {
    de: 'Vier farbige Felder, vier Bewegungen – jede Farbe hat einen eigenen Ton. Drücke ▶ Los: Die Figur tanzt eine Folge vor. Danach tippst du die Folge nach; anschließend tanzt die Figur sie noch einmal langsam vor, damit du selbst vergleichen kannst. Mit jeder Runde wird die Folge einen Schritt länger. Im Modus „Vorspielen“ denkst du dir selbst eine Folge aus, und die Figur tanzt sie nach. Es gibt keine Wertung – nur üben und zuschauen.',
    ru: 'Четыре цветных поля, четыре движения – у каждого цвета свой звук. Нажми ▶: фигурка станцует последовательность. Потом нажми её сам; затем фигурка станцует её ещё раз медленно, чтобы ты мог сравнить. С каждым раундом последовательность становится на шаг длиннее. В режиме «Показать» придумай свою последовательность, и фигурка её станцует. Без оценок – только тренировка и наблюдение.',
    en: 'Four coloured pads, four movements – each colour has its own sound. Press ▶ Start: the figure dances a sequence. Then tap it yourself; afterwards the figure dances it once more slowly so you can compare. With each round the sequence grows one step longer. In "Perform" mode you invent your own sequence and the figure dances it. There is no score – just practise and watch.'
  },
  settingsSchema: {
    startlaenge: { def: 3, min: 2, max: 5, step: 1, label: { de: 'Startlänge', ru: 'Стартовая длина', en: 'Start length' } },
    maxlaenge: { def: 7, min: 3, max: 8, step: 1, label: { de: 'Längste Folge', ru: 'Макс. длина', en: 'Max length' } },
    tempo: { def: 1, min: 0.6, max: 1.4, step: 0.1, label: { de: 'Tempo', ru: 'Темп', en: 'Speed' } },
  },

  onSettingsChange(app) {
    const s = app.state;
    if (s && (s.laenge !== app.get('startlaenge') || s.max !== app.get('maxlaenge'))) {
      app.reset();
    }
  },

  init(state, app) {
    if (state._timer) { clearTimeout(state._timer); state._timer = null; }
    state.modus = 'merken';
    state.phase = 'bereit';
    state.laenge = app.get('startlaenge');
    state.max = app.get('maxlaenge');
    state.runde = 1;
    state.seq = [];
    state.eingabe = [];
    state.stepIndex = 0;
    state.aktiverPad = -1;
  },

  dispose(state) {
    if (state._timer) { clearTimeout(state._timer); state._timer = null; }
  },

  render(state, app) {
    const s = state;
    const aktivFarbe = s.aktiverPad != null && s.aktiverPad >= 0 ? PADS[s.aktiverPad].farbe : null;
    const modeBtns = MODE_BTNS.map(b => modeBtnSvg(b, s)).join('');
    const punkte = punkteSvg(s);
    const boden = `<ellipse cx="300" cy="348" rx="120" ry="14" fill="#00000012"/>`;
    const figur = figurSvg(s.aktiverPad, 300, 240, 1.15, aktivFarbe);
    const text = phasenText(s);
    const actions = aktionsButtons(s).map(b => aktionSvg(b)).join('');
    const pads = PADS.map((p, i) => padSvg(i, s)).join('');
    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">
      ${modeBtns}${punkte}${boden}${figur}
      <text x="300" y="370" font-size="19" fill="#333333" text-anchor="middle">${text}</text>
      ${actions}${pads}
    </svg>`;
  },

  // ─── Interaktion ───────────────────────────────────────────────────

  onTap(state, x, y, app) {
    for (const b of MODE_BTNS) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        this._setzeModus(app, b.id);
        return;
      }
    }
    for (const b of aktionsButtons(state)) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        if (!b.disabled) this._aktion(app, b.id);
        return;
      }
    }
    const pad = this._padBei(x, y);
    if (pad >= 0) this._padTipp(app, pad);
  },

  _padBei(x, y) {
    for (let i = 0; i < PADS.length; i++) {
      if (x >= PAD_X[i] && x <= PAD_X[i] + PAD_W && y >= PAD_Y && y <= PAD_Y + PAD_H) return i;
    }
    return -1;
  },

  _setzeModus(app, modus) {
    const s = app.state;
    if (modus === s.modus) return;
    this._klarTimer(s);
    s.modus = modus;
    s.aktiverPad = -1;
    s.stepIndex = 0;
    s.eingabe = [];
    if (modus === 'merken') {
      s.laenge = app.get('startlaenge');
      s.max = app.get('maxlaenge');
      s.runde = 1;
      s.seq = [];
      s.phase = 'bereit';
    } else {
      s.seq = [];
      s.phase = 'aufnehmen';
    }
    app.rerender();
  },

  _aktion(app, id) {
    const s = app.state;
    this._audioBereit(app);
    if (id === 'start') this._starteDemo(app);
    else if (id === 'nochmal') this._nochmalZeigen(app);
    else if (id === 'weiter') this._weiter(app);
    else if (id === 'abspielen') this._freiAbspielen(app);
    else if (id === 'undo') { s.seq.pop(); s.aktiverPad = -1; app.rerender(); }
    else if (id === 'neu') { s.seq = []; s.aktiverPad = -1; app.rerender(); }
  },

  _padTipp(app, pad) {
    const s = app.state;
    this._audioBereit(app);
    if (s.modus === 'merken') {
      if (s.phase !== 'nachmachen') return;
      if (s.eingabe.length >= s.seq.length) return; // schon komplett – auf Kontrolle warten
      s.aktiverPad = pad;
      this._ton(PADS[pad].freq, app);
      s.eingabe.push(pad);
      app.rerender();
      if (s.eingabe.length >= s.seq.length) {
        this._klarTimer(s);
        s._timer = setTimeout(() => { s._timer = null; this._checkenStarten(app); }, 650);
      }
    } else {
      if (s.phase !== 'aufnehmen') return;
      if (s.seq.length >= 12) return;
      s.aktiverPad = pad;
      this._ton(PADS[pad].freq, app);
      s.seq.push(pad);
      app.rerender();
    }
  },

  // ─── Ablauf Nachmachen ─────────────────────────────────────────────

  _starteDemo(app) {
    const s = app.state;
    this._klarTimer(s);
    s.seq = machSeq(s.laenge);
    s.stepIndex = 0;
    s.eingabe = [];
    s.aktiverPad = -1;
    s.phase = 'zeigen';
    app.rerender();
    s._timer = setTimeout(() => { s._timer = null; this._demoSchritt(app); }, 500);
  },

  _nochmalZeigen(app) {
    const s = app.state;
    this._klarTimer(s);
    s.stepIndex = 0;
    s.eingabe = [];
    s.aktiverPad = -1;
    s.phase = 'zeigen';
    app.rerender();
    s._timer = setTimeout(() => { s._timer = null; this._demoSchritt(app); }, 500);
  },

  _checkenStarten(app) {
    const s = app.state;
    this._klarTimer(s);
    s.stepIndex = 0;
    s.aktiverPad = -1;
    s.phase = 'checken';
    app.rerender();
    s._timer = setTimeout(() => { s._timer = null; this._demoSchritt(app); }, 600);
  },

  _freiAbspielen(app) {
    const s = app.state;
    if (!s.seq.length) return;
    this._klarTimer(s);
    s.stepIndex = 0;
    s.aktiverPad = -1;
    s.phase = 'abspielen';
    app.rerender();
    s._timer = setTimeout(() => { s._timer = null; this._demoSchritt(app); }, 500);
  },

  _weiter(app) {
    const s = app.state;
    this._klarTimer(s);
    s.runde++;
    s.laenge = Math.min(s.laenge + 1, s.max);
    s.seq = [];
    s.eingabe = [];
    s.stepIndex = 0;
    s.aktiverPad = -1;
    s.phase = 'bereit';
    app.rerender();
  },

  /** Einen Schritt vorführen (normal oder langsam je nach Phase). */
  _demoSchritt(app) {
    const s = app.state;
    if (s.stepIndex >= s.seq.length) { this._demoEnde(app); return; }
    const pad = s.seq[s.stepIndex];
    s.aktiverPad = pad;
    this._ton(PADS[pad].freq, app);
    s.stepIndex++;
    app.rerender();
    const langsam = s.phase === 'checken';
    const delay = langsam ? this._checkDelay(app) : this._zeigeDelay(app);
    s._timer = setTimeout(() => { s._timer = null; this._demoSchritt(app); }, delay);
  },

  _demoEnde(app) {
    const s = app.state;
    s.aktiverPad = -1;
    if (s.phase === 'zeigen') {
      s.phase = 'nachmachen';
      s.eingabe = [];
    } else if (s.phase === 'checken') {
      s.phase = 'geschafft';
      s.eingabe = [];
    } else if (s.phase === 'abspielen') {
      s.phase = 'aufnehmen';
    }
    s.stepIndex = 0;
    app.rerender();
  },

  _zeigeDelay(app) { return Math.max(420, Math.round(820 / (Number(app.get('tempo')) || 1))); },
  _checkDelay(app) { return Math.max(800, Math.round(1500 / (Number(app.get('tempo')) || 1))); },

  // ─── Ton ───────────────────────────────────────────────────────────

  _audioBereit(app) {
    if (!app.get('ton')) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!app._audio) app._audio = new AC();
      if (app._audio.state === 'suspended') app._audio.resume();
    } catch (e) { /* Ton ist optional. */ }
  },

  _ton(freq, app) {
    if (!app.get('ton')) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!app._audio) app._audio = new AC();
      const ctx = app._audio;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(g);
      g.connect(ctx.destination);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.28, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
      osc.start(t);
      osc.stop(t + 0.46);
    } catch (e) { /* Ton ist optional – im Test/ohne Audio einfach still. */ }
  },

  _klarTimer(s) {
    if (s._timer) { clearTimeout(s._timer); s._timer = null; }
  },
});

/** Zufällige Folge ohne unmittelbare Wiederholung derselben Farbe. */
function machSeq(n) {
  const seq = [];
  let vorher = -1;
  for (let i = 0; i < n; i++) {
    let p;
    do { p = Math.floor(Math.random() * 4); } while (p === vorher);
    seq.push(p);
    vorher = p;
  }
  return seq;
}

export default app;

// Direkt einbinden (apps/s-138-140-dance-challenge/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
