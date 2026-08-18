/**
 * Follow the Numbers – Punkte per Programm verbinden.
 * idee-db: 107
 *
 * Carol Vorderman, Craig Steele, Claire Quigley, David … – S. 70–72,
 * Kapitel „Follow the Numbers“ (Spielprinzip und Ablaufplan).
 *
 * Zusatzanweisung (hat Vorrang vor der ursprünglichen Idee): Das Kind schreibt
 * ein Programm aus Pfeilen (↑ ↓ ← →) und drückt dann „▶ Los“. Entsprechend dem
 * Programm werden die Punkte im Raster verbunden. Anschließend wird geprüft, ob
 * die gewünschte Zielfigur entstanden ist.
 *
 * Trainiert Planen (Folge von Schritten im Voraus), serielles Ordnen, das
 * Halten der aktuellen Position im Arbeitsgedächtnis und das Übersetzen einer
 * gesehenen Figur in eine Handlungsfolge.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 600;
const VIEW_H = 620;

// Punktraster (alle Gitterpunkte sind tippbare Punkte).
const GRID_X0 = 70;
const GRID_Y0 = 58;
const GRID_W = 460;
const GRID_H = 256;

// Programmleiste (Slots für die Pfeil-Folge).
const PROG_SLOTS = 20;
const SLOT_W = 26;
const SLOT_H = 44;
const SLOT_GAP = 2;
const SLOT_X0 = (VIEW_W - (PROG_SLOTS * SLOT_W + (PROG_SLOTS - 1) * SLOT_GAP)) / 2;
const SLOT_Y = 344;

// Richtungen (interne Schlüssel → Verschiebung und Anzeige-Symbol).
const RICHTUNGEN = {
  up:    { dx: 0, dy: -1, zeichen: '↑' },
  down:  { dx: 0, dy: 1,  zeichen: '↓' },
  left:  { dx: -1, dy: 0, zeichen: '←' },
  right: { dx: 1, dy: 0,  zeichen: '→' },
};

// Pfeil-D-Pad.
const DPAD = {
  up:    { x: 170, y: 428, w: 56, h: 56 },
  left:  { x: 108, y: 490, w: 56, h: 56 },
  right: { x: 232, y: 490, w: 56, h: 56 },
  down:  { x: 170, y: 552, w: 56, h: 56 },
};

// Aktions-Tasten (Los/Weiter, Löschen, Leeren).
const BTNS = [
  { id: 'run',   x: 340, y: 428, w: 160, h: 56 },
  { id: 'del',   x: 340, y: 490, w: 76,  h: 56 },
  { id: 'clear', x: 424, y: 490, w: 76,  h: 56 },
];

/** Aktive Sprache (global geteilt wie in der Haupt-App). */
function lang() {
  try { return localStorage.getItem('miniapp-lang') || 'de'; }
  catch { return 'de'; }
}
/** Mehrsprachigen Text auflösen. */
function T(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang()] || obj.de || '';
}

function rnd(n) { return Math.floor(Math.random() * n); }

/** Kanonischer Schlüssel für eine ungerichtete Kante zwischen zwei Punkten. */
function kanteSchluessel(a, b) {
  const [x1, y1] = a, [x2, y2] = b;
  if (x1 < x2 || (x1 === x2 && y1 < y2)) return `${x1},${y1}-${x2},${y2}`;
  return `${x2},${y2}-${x1},${y1}`;
}

/** Nachbarn eines Gitterpunkts (innerhalb des Rasters). */
function nachbarn(x, y, W, H) {
  const list = [];
  if (y > 0) list.push([x, y - 1]);
  if (y < H - 1) list.push([x, y + 1]);
  if (x > 0) list.push([x - 1, y]);
  if (x < W - 1) list.push([x + 1, y]);
  return list;
}

/**
 * Zufällige einfache Zielfigur: ein zusammenhängender Linienzug ohne
 * Selbstüberschneidung (kein Punkt wird zweimal besucht). Dadurch ist die
 * Figur eindeutig als Pfeil-Folge vom Startpunkt aus nachfahrbar.
 */
function machFigur(W, H, kanten) {
  for (let versuch = 0; versuch < 300; versuch++) {
    const start = [rnd(W), rnd(H)];
    const punkte = [start];
    const besucht = new Set([`${start[0]},${start[1]}`]);
    let ok = true;
    while (punkte.length - 1 < kanten) {
      const [cx, cy] = punkte[punkte.length - 1];
      const kandidaten = nachbarn(cx, cy, W, H)
        .filter(([nx, ny]) => !besucht.has(`${nx},${ny}`));
      if (!kandidaten.length) { ok = false; break; }
      const [nx, ny] = kandidaten[rnd(kandidaten.length)];
      besucht.add(`${nx},${ny}`);
      punkte.push([nx, ny]);
    }
    if (!ok || punkte.length - 1 !== kanten) continue;
    const kantenListe = [];
    for (let i = 0; i + 1 < punkte.length; i++) kantenListe.push([punkte[i], punkte[i + 1]]);
    return { W, H, punkte, kanten: kantenListe };
  }
  // Fallback: einfache waagerechte Linie.
  const y = Math.floor(H / 2);
  const punkte = [];
  for (let i = 0; i <= kanten && i < W; i++) punkte.push([i, y]);
  const kantenListe = [];
  for (let i = 0; i + 1 < punkte.length; i++) kantenListe.push([punkte[i], punkte[i + 1]]);
  return { W, H, punkte, kanten: kantenListe };
}

function stufenKonfig(stufe) {
  if (stufe <= 1) return { W: 4, H: 3, kantenMin: 3, kantenMax: 4 };
  if (stufe === 2) return { W: 4, H: 4, kantenMin: 5, kantenMax: 7 };
  return { W: 5, H: 4, kantenMin: 7, kantenMax: 9 };
}

/** Aktuelle Stift-Position als [x,y], ausgehend vom Startpunkt. */
function penPos(state) {
  const fig = state.aufgaben[Math.min(state.index, state.aufgaben.length - 1)];
  let x = fig.punkte[0][0];
  let y = fig.punkte[0][1];
  for (const d of state.programm) {
    const r = RICHTUNGEN[d];
    x += r.dx;
    y += r.dy;
    if (x < 0 || x >= fig.W || y < 0 || y >= fig.H) return null;
  }
  return [x, y];
}

/** Kleiner Ton für Rückmeldungen (respektiert die globale Ton-Einstellung). */
let audioCtx = null;
function ton(freq, dauer, typ = 'sine', laut = 0.05) {
  try {
    const g = JSON.parse(localStorage.getItem('miniapp-global-settings') || '{}');
    if ((g.ton ?? 1) !== 1) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const o = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    o.type = typ;
    o.frequency.value = freq;
    gain.gain.value = laut;
    o.connect(gain);
    gain.connect(audioCtx.destination);
    o.start();
    o.stop(audioCtx.currentTime + dauer);
  } catch { /* Ton optional – Fehler nie werfen. */ }
}

/** SVG-Taste (Rechteck + zentrierter Text). */
function taste(x, y, w, h, fill, stroke, txt, txtColor, fontSize = 22) {
  return svg.group(
    svg.rect(x, y, w, h, fill, { rx: 10, stroke, 'stroke-width': 2 }) +
    svg.text(x + w / 2, y + h / 2 + fontSize * 0.34, txt,
      { 'font-size': fontSize, 'font-weight': 'bold', fill: txtColor, 'text-anchor': 'middle' })
  );
}

const app = new MiniApp({
  id: 'pfeil-programm',
  icon: '🎯',
  titel: {
    de: 'Follow the Numbers',
    ru: 'По следам чисел',
    en: 'Follow the Numbers'
  },
  anweisung: {
    de: 'Sieh dir die graue Zielfigur an. Schreibe darunter ein Programm aus Pfeilen (↑ ↓ ← →) und drücke ▶ Los. Der Stift startet am grünen Punkt und verbindet die Punkte genau wie dein Programm.',
    ru: 'Посмотри на серую фигуру-цель. Составь под ней программу из стрелок (↑ ↓ ← →) и нажми ▶ Пуск. Карандаш стартует с зелёной точки и соединяет точки точно по твоей программе.',
    en: 'Look at the grey target figure. Below it, write a program of arrows (↑ ↓ ← →) and press ▶ Go. The pen starts at the green dot and connects the dots exactly as your program says.'
  },
  hilfe: {
    de: 'Der Stift beginnt immer am grünen Startpunkt. Jeder Pfeil bedeutet einen Schritt zum nächsten Punkt in diese Richtung. Mit ⌫ löschst du den letzten Pfeil, mit 🗑 die ganze Folge. ▶ Los fährt dein Programm ab und zeichnet orange Linien. Stimmt die orange Figur mit der grauen Zielfigur überein, hast du gewonnen. Je kürzer dein Programm und je weniger Fehlversuche, desto mehr Punkte.',
    ru: 'Карандаш всегда начинает с зелёной стартовой точки. Каждая стрелка — это один шаг к следующей точке в этом направлении. ⌫ удаляет последнюю стрелку, 🗑 — всю последовательность. ▶ Пуск выполняет программу и рисует оранжевые линии. Если оранжевая фигура совпадает с серой целью, ты выиграл. Чем короче программа и чем меньше неудачных попыток, тем больше очков.',
    en: 'The pen always starts at the green starting dot. Each arrow means one step to the next dot in that direction. ⌫ deletes the last arrow, 🗑 clears the whole sequence. ▶ Go runs your program and draws orange lines. If the orange figure matches the grey target figure, you win. The shorter your program and the fewer failed attempts, the more points.'
  },
  settingsSchema: {
    stufe: { def: 1, min: 1, max: 3, step: 1, label: { de: 'Stufe', ru: 'Уровень', en: 'Level' } },
    runden: { def: 4, min: 2, max: 6, step: 1, label: { de: 'Figuren', ru: 'Фигуры', en: 'Figures' } }
  },
  auswertung: 'punkte',

  // Stufe/Figuren wirken erst nach Neustart.
  onSettingsChange(app) {
    const s = app.state;
    if (s && (s.stufe !== app.get('stufe') || s.runden !== app.get('runden'))) {
      app.reset();
    }
  },

  init(state, app) {
    if (state._timer) { clearTimeout(state._timer); state._timer = null; }
    state.stufe = app.get('stufe');
    state.runden = app.get('runden');
    const konf = stufenKonfig(state.stufe);
    const aufgaben = [];
    for (let i = 0; i < state.runden; i++) {
      aufgaben.push(machFigur(konf.W, konf.H,
        konf.kantenMin + rnd(konf.kantenMax - konf.kantenMin + 1)));
    }
    state.aufgaben = aufgaben;
    state.index = 0;
    state.programm = [];
    state.lauf = null;        // { i, pos, linien } während/nach der Ausführung
    state.laeuft = false;
    state.geloest = false;    // aktuelle Figur korrekt nachgefahren
    state.fehlversuche = 0;
    state.fehlerGesamt = 0;
    state.punkte = 0;
    state.meldung = '';
    state.meldungFarbe = '#5b4fcf';
    state.fertig = false;
  },

  dispose(state) {
    if (state._timer) { clearTimeout(state._timer); state._timer = null; }
  },

  render(state, app) {
    const s = state;
    const fig = s.aufgaben[Math.min(s.index, s.aufgaben.length - 1)];
    const nr = Math.min(s.index + 1, s.runden);
    const px = (x) => GRID_X0 + x * (GRID_W / (fig.W - 1));
    const py = (y) => GRID_Y0 + y * (GRID_H / (fig.H - 1));

    const kopf =
      svg.text(20, 40, T({ de: `Figur ${nr} von ${s.runden}`, ru: `Фигура ${nr} из ${s.runden}`, en: `Figure ${nr} of ${s.runden}` }),
        { 'font-size': 22, 'font-weight': 'bold', fill: '#444' }) +
      svg.text(580, 40, `⭐ ${s.punkte}`, { 'font-size': 22, 'font-weight': 'bold', fill: '#b8860b', 'text-anchor': 'end' });

    // Zielfigur (gestrichelt, grau).
    let ziel = '';
    for (const [a, b] of fig.kanten) {
      ziel += svg.el('line', {
        x1: px(a[0]), y1: py(a[1]), x2: px(b[0]), y2: py(b[1]),
        stroke: '#b9b3dd', 'stroke-width': 7, 'stroke-dasharray': '9 8', 'stroke-linecap': 'round'
      });
    }

    // Gezeichnete Linien (Ergebnis der Programm-Ausführung).
    let linien = '';
    if (s.lauf && s.lauf.linien.length) {
      for (const [a, b] of s.lauf.linien) {
        linien += svg.el('line', {
          x1: px(a[0]), y1: py(a[1]), x2: px(b[0]), y2: py(b[1]),
          stroke: s.geloest ? '#2a8a2a' : '#f39c12', 'stroke-width': 7, 'stroke-linecap': 'round'
        });
      }
    }

    // Punkte (Startpunkt grün).
    let punkte = '';
    for (let x = 0; x < fig.W; x++) {
      for (let y = 0; y < fig.H; y++) {
        const start = fig.punkte[0][0] === x && fig.punkte[0][1] === y;
        punkte += svg.circle(px(x), py(y), 11, start ? '#2ecc71' : '#ffffff',
          { stroke: start ? '#1e8449' : '#8a85b8', 'stroke-width': 2.5 });
      }
    }
    // Start-Markierung (kleiner Pfeil im grünen Startpunkt).
    punkte += svg.text(px(fig.punkte[0][0]), py(fig.punkte[0][1]) + 5, '▶',
      { 'font-size': 13, 'font-weight': 'bold', fill: '#ffffff', 'text-anchor': 'middle' });

    // Aktuelle Stift-Position (Planungs-Geist bzw. während der Ausführung).
    let stift = '';
    if (!s.laeuft && !s.geloest && s.programm.length) {
      const pos = penPos(s);
      if (pos) stift = svg.circle(px(pos[0]), py(pos[1]), 16, 'none',
        { stroke: '#2f7cf6', 'stroke-width': 3, 'stroke-dasharray': '4 3' });
    } else if (s.laeuft && s.lauf) {
      stift = svg.circle(px(s.lauf.pos[0]), py(s.lauf.pos[1]), 16, 'none',
        { stroke: '#2f7cf6', 'stroke-width': 3, 'stroke-dasharray': '4 3' });
    }

    // Programmleiste.
    const label = svg.text(SLOT_X0, SLOT_Y - 8,
      T({ de: 'Dein Programm', ru: 'Твоя программа', en: 'Your program' }),
      { 'font-size': 14, 'font-weight': 'bold', fill: '#777' });
    let slots = '';
    for (let i = 0; i < PROG_SLOTS; i++) {
      const x = SLOT_X0 + i * (SLOT_W + SLOT_GAP);
      const gefuellt = i < s.programm.length;
      slots += svg.rect(x, SLOT_Y, SLOT_W, SLOT_H, gefuellt ? '#ffffff' : '#f0effb',
        { rx: 6, stroke: gefuellt ? '#5b4fcf' : '#ddd', 'stroke-width': 1.5 }) +
        svg.text(x + SLOT_W / 2, SLOT_Y + SLOT_H / 2 + 9,
          gefuellt ? RICHTUNGEN[s.programm[i]].zeichen : '',
          { 'font-size': 22, 'font-weight': 'bold', fill: '#5b4fcf', 'text-anchor': 'middle' });
    }

    // Pfeil-D-Pad.
    const pos = penPos(s);
    let dpad = '';
    for (const [dir, b] of Object.entries(DPAD)) {
      const r = RICHTUNGEN[dir];
      const erlaubt = pos &&
        pos[0] + r.dx >= 0 && pos[0] + r.dx < fig.W &&
        pos[1] + r.dy >= 0 && pos[1] + r.dy < fig.H;
      const aus = s.laeuft || s.geloest || s.fertig || !erlaubt;
      dpad += taste(b.x, b.y, b.w, b.h,
        aus ? '#eeeeee' : '#ffffff', aus ? '#cccccc' : '#5b4fcf',
        r.zeichen, aus ? '#bbbbbb' : '#333333', 26);
    }

    // Los/Weiter-Taste.
    const runAus = s.laeuft || (!s.geloest && s.programm.length === 0);
    const runLabel = s.geloest
      ? '➜ ' + T({ de: 'Weiter', ru: 'Дальше', en: 'Next' })
      : T({ de: '▶ Los', ru: '▶ Пуск', en: '▶ Go' });
    const runBtn = taste(BTNS[0].x, BTNS[0].y, BTNS[0].w, BTNS[0].h,
      s.geloest ? '#34d399' : (runAus ? '#eeeeee' : '#5b4fcf'),
      s.geloest ? '#0e9f6e' : (runAus ? '#cccccc' : '#5b4fcf'),
      runLabel, s.geloest ? '#ffffff' : (runAus ? '#bbbbbb' : '#ffffff'), 21);

    // Löschen / Leeren.
    const delAus = s.laeuft || s.geloest || s.fertig || s.programm.length === 0;
    const delBtn = taste(BTNS[1].x, BTNS[1].y, BTNS[1].w, BTNS[1].h,
      delAus ? '#eeeeee' : '#ffffff', delAus ? '#cccccc' : '#5b4fcf',
      '⌫', delAus ? '#bbbbbb' : '#333333', 24);

    const clearAus = s.laeuft || s.geloest || s.fertig || s.programm.length === 0;
    const clearBtn = taste(BTNS[2].x, BTNS[2].y, BTNS[2].w, BTNS[2].h,
      clearAus ? '#eeeeee' : '#ffffff', clearAus ? '#cccccc' : '#5b4fcf',
      '🗑', clearAus ? '#bbbbbb' : '#333333', 22);

    const meldung = svg.text(300, 412, s.meldung || '',
      { 'font-size': 17, fill: s.meldungFarbe || '#5b4fcf', 'text-anchor': 'middle' });

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">
      ${kopf}${ziel}${linien}${punkte}${stift}${label}${slots}${dpad}${runBtn}${delBtn}${clearBtn}${meldung}
    </svg>`;
  },

  // ─── Interaktion ───────────────────────────────────────────────────

  _btnBei(x, y) {
    for (const b of BTNS) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b.id;
    }
    return null;
  },

  _pfeilBei(x, y) {
    for (const [dir, b] of Object.entries(DPAD)) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return dir;
    }
    return null;
  },

  onTap(state, x, y, app) {
    if (state.fertig) return;
    const b = this._btnBei(x, y);
    if (b === 'run') { this._run(app); return; }
    if (b === 'del') { this._del(app); return; }
    if (b === 'clear') { this._clear(app); return; }
    const dir = this._pfeilBei(x, y);
    if (dir) this._pfeil(dir, app);
  },

  _pfeil(dir, app) {
    const s = app.state;
    if (s.laeuft || s.geloest || s.fertig) return;
    if (s.programm.length >= PROG_SLOTS) return;
    const fig = s.aufgaben[s.index];
    const pos = penPos(s);
    if (!pos) return;
    const r = RICHTUNGEN[dir];
    const nx = pos[0] + r.dx, ny = pos[1] + r.dy;
    if (nx < 0 || nx >= fig.W || ny < 0 || ny >= fig.H) return;
    s.programm.push(dir);
    this._laufLeeren(s);
    s.meldung = '';
    app.rerender();
  },

  _del(app) {
    const s = app.state;
    if (s.laeuft || s.geloest || s.fertig) return;
    if (!s.programm.length) return;
    s.programm.pop();
    this._laufLeeren(s);
    s.meldung = '';
    app.rerender();
  },

  _clear(app) {
    const s = app.state;
    if (s.laeuft || s.geloest || s.fertig) return;
    if (!s.programm.length) return;
    s.programm = [];
    this._laufLeeren(s);
    s.meldung = '';
    app.rerender();
  },

  _laufLeeren(s) {
    s.lauf = null;
    s.laeuft = false;
  },

  _run(app) {
    const s = app.state;
    if (s.laeuft) return;
    if (s.geloest) { this._weiter(app); app.rerender(); return; }
    if (!s.programm.length) return;
    if (s._timer) { clearTimeout(s._timer); s._timer = null; }
    const fig = s.aufgaben[s.index];
    s.lauf = { i: 0, pos: [fig.punkte[0][0], fig.punkte[0][1]], linien: [] };
    s.laeuft = true;
    s.meldung = '';
    this._schritt(app);   // erste Bewegung sofort, Rest per Timer
  },

  _schritt(app) {
    const s = app.state;
    if (!s.laeuft || !s.lauf) return;
    const fig = s.aufgaben[s.index];
    if (s.lauf.i >= s.programm.length) { this._ende(app); return; }
    const dir = s.programm[s.lauf.i];
    const r = RICHTUNGEN[dir];
    const [x, y] = s.lauf.pos;
    const nx = x + r.dx, ny = y + r.dy;
    if (nx < 0 || nx >= fig.W || ny < 0 || ny >= fig.H) {
      s.laeuft = false;
      s.fehlversuche++;
      s.meldung = T({ de: 'Der Weg führt aus dem Feld!', ru: 'Путь выходит за поле!', en: 'The path leaves the grid!' });
      s.meldungFarbe = '#c0392b';
      ton(220, 0.25, 'sawtooth', 0.04);
      app.rerender();
      return;
    }
    s.lauf.linien.push([[x, y], [nx, ny]]);
    s.lauf.pos = [nx, ny];
    s.lauf.i++;
    ton(520, 0.05);
    app.rerender();
    s._timer = setTimeout(() => this._schritt(app), 340);
  },

  _ende(app) {
    const s = app.state;
    s.laeuft = false;
    const fig = s.aufgaben[s.index];
    const ziel = new Set(fig.kanten.map(([a, b]) => kanteSchluessel(a, b)));
    const gezeichnet = new Set((s.lauf?.linien || []).map(([a, b]) => kanteSchluessel(a, b)));
    const ok = ziel.size === gezeichnet.size && [...ziel].every(k => gezeichnet.has(k));
    if (ok) {
      s.geloest = true;
      const optimal = fig.kanten.length;
      const punkte = Math.max(1, 10 - (s.programm.length - optimal) - 2 * s.fehlversuche);
      s.punkte += punkte;
      s.meldung = T({ de: 'Super! Die Figur stimmt.', ru: 'Отлично! Фигура верная.', en: 'Great! The figure is correct.' });
      s.meldungFarbe = '#2a8a2a';
      ton(660, 0.12);
      setTimeout(() => ton(880, 0.16), 130);
    } else {
      s.fehlversuche++;
      s.meldung = T({ de: 'Noch nicht die Zielfigur – ändere dein Programm.', ru: 'Пока не та фигура — измени программу.', en: 'Not the target figure yet – change your program.' });
      s.meldungFarbe = '#c0392b';
      ton(200, 0.3, 'sawtooth', 0.04);
    }
    app.rerender();
  },

  _weiter(app) {
    const s = app.state;
    s.fehlerGesamt += s.fehlversuche;
    s.index++;
    s.programm = [];
    s.lauf = null;
    s.laeuft = false;
    s.geloest = false;
    s.fehlversuche = 0;
    s.meldung = '';
    if (s.index >= s.aufgaben.length) s.fertig = true;
  },

  // Live-Statuszeile (Zeit + Fehler der aktuellen Figur).
  statusHtml(state, app) {
    if (state.fertig) return '';
    const z = app.elapsedSek();
    return `<div class="ma-result">⏱ ${z}s · ${T({ de: 'Fehler', ru: 'Ошибки', en: 'Mistakes' })}: ${state.fehlversuche}</div>`;
  },

  evaluate(state, app) {
    if (state.fertig) {
      return {
        fertig: true,
        text: { de: 'Geschafft!', ru: 'Готово!', en: 'Well done!' },
        wert: `${state.punkte} ${T({ de: 'Punkte', ru: 'очков', en: 'points' })} · ⏱ ${app.elapsedSek()}s · ${T({ de: 'Fehler', ru: 'Ошибки', en: 'Mistakes' })}: ${state.fehlerGesamt}`
      };
    }
    return null;
  }
});

export default app;

// Direkt einbinden (apps/s-70-72-follow-the-numbers/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
