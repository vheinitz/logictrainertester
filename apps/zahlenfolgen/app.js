/**
 * Zahlenfolgen – die nächste Zahl finden.
 * idee-db: 16
 *
 * Aus der Ideen-DB (Beitrag 16, 5-6-Matematika-Zadachi-na-smekalku-1995,
 * S. 10–11, „Числа / Другие задачи“, Aufgaben 24–30).
 *
 * Jede Aufgabe zeigt vier Zahlen einer Reihe und ein leeres Kästchen; das Kind
 * tippt die fünfte Zahl über ein Tastenfeld. Drei einfache Regeln:
 *   • plus  – immer dieselbe Zahl dazuzählen (+x)
 *   • mal   – immer mit derselben Zahl malnehmen (×x)
 *   • summe – die beiden Zahlen davor zusammenzählen (a_i = a_{i-1} + a_{i-2})
 *
 * Zwei gestaffelte Hinweise (erst „Abstände anschauen“, dann wird ein Teil der
 * Regel aufgedeckt) und eine Hör-Variante, die die Zahlen nacheinander
 * vorliest. Wenige Hinweise und Fehlversuche bringen mehr Punkte.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 600;
const VIEW_H = 560;

const BOX_W = 76;
const BOX_H = 84;
const BOX_Y = 66;
const BOX_X = [100, 200, 300, 400, 500];

const KEY_W = 60;
const KEY_H = 58;
const KEY_GAP = 8;
const KEY_X0 = (VIEW_W - (3 * KEY_W + 2 * KEY_GAP)) / 2;
const KEY_Y0 = 300;
const KEY_ROWS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['del', '0', 'ok']];
const KEYS = [];
KEY_ROWS.forEach((row, r) => row.forEach((id, c) => {
  KEYS.push({ id, x: KEY_X0 + c * (KEY_W + KEY_GAP), y: KEY_Y0 + r * (KEY_H + KEY_GAP) });
}));

const BTNS = [
  { id: 'vorlesen', x: 18, y: 172, w: 180, h: 40, label: { de: '🔊 Vorlesen', ru: '🔊 Прочитать', en: '🔊 Read' } },
  { id: 'hinweis', x: 210, y: 172, w: 180, h: 40, label: { de: '💡 Hinweis', ru: '💡 Подсказка', en: '💡 Hint' } },
  { id: 'mehr', x: 402, y: 172, w: 180, h: 40, label: { de: '🔍 Mehr', ru: '🔍 Ещё', en: '🔍 More' } },
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Aufgaben-Generatoren ────────────────────────────────────────────

/** Immer +x. */
function machPlus() {
  const d = 2 + rnd(11);          // 2..12
  const a = 1 + rnd(20);          // 1..20
  return {
    regel: 'plus',
    zahlen: [a, a + d, a + 2 * d, a + 3 * d],
    antwort: a + 4 * d,
    regelText: { de: `Immer plus ${d}.`, ru: `Всё время плюс ${d}.`, en: `Always plus ${d}.` },
    hinweis1: { de: 'Schau auf die Abstände zwischen den Zahlen.', ru: 'Посмотри на промежутки между числами.', en: 'Look at the gaps between the numbers.' },
    hinweis2: { de: `${a} → ${a + d}: plus ${d}`, ru: `${a} → ${a + d}: плюс ${d}`, en: `${a} → ${a + d}: plus ${d}` },
  };
}

/** Immer ×x. */
function machMal() {
  const r = 2 + rnd(2);           // 2..3
  const a = 2 + rnd(7);           // 2..8
  return {
    regel: 'mal',
    zahlen: [a, a * r, a * r * r, a * r * r * r],
    antwort: a * r * r * r * r,
    regelText: { de: `Immer mal ${r}.`, ru: `Всё время умножить на ${r}.`, en: `Always times ${r}.` },
    hinweis1: { de: 'Schau, wie jede Zahl aus der vorigen entsteht.', ru: 'Посмотри, как каждое число получается из предыдущего.', en: 'Look at how each number comes from the one before.' },
    hinweis2: { de: `${a} → ${a * r}: mal ${r}`, ru: `${a} → ${a * r}: умножить на ${r}`, en: `${a} → ${a * r}: times ${r}` },
  };
}

/** Die beiden Zahlen davor zusammenzählen (a_i = a_{i-1} + a_{i-2}). */
function machSumme() {
  let a = 1 + rnd(9);
  let b = 1 + rnd(9);
  if (a === 1 && b === 1) b = 2;  // klassische 1,1,2,3,5-Reihe vermeiden
  return {
    regel: 'summe',
    zahlen: [a, b, a + b, a + 2 * b],
    antwort: 2 * a + 3 * b,
    regelText: { de: 'Zähl die beiden Zahlen davor zusammen.', ru: 'Сложи два предыдущих числа.', en: 'Add the two numbers before.' },
    hinweis1: { de: 'Schau, wie zwei Nachbarn die nächste Zahl bilden.', ru: 'Посмотри, как два соседних числа образуют следующее.', en: 'Look at how two neighbours form the next number.' },
    hinweis2: { de: `${a} + ${b} = ${a + b}`, ru: `${a} + ${b} = ${a + b}`, en: `${a} + ${b} = ${a + b}` },
  };
}

function poolFuer(stufe) {
  const pool = ['plus'];
  if (stufe >= 2) pool.push('mal');
  if (stufe >= 3) pool.push('summe');
  return pool;
}

function machAufgabe(regel) {
  if (regel === 'plus') return machPlus();
  if (regel === 'mal') return machMal();
  return machSumme();
}

// ─── SVG-Bausteine ───────────────────────────────────────────────────

function box(cx, y, w, h, fill, stroke, txt, color) {
  return svg.group(
    svg.rect(cx - w / 2, y, w, h, fill, { rx: 10, stroke, 'stroke-width': 2 }) +
    svg.text(cx, y + h / 2 + 11, txt, { 'font-size': 30, 'font-weight': 'bold', fill: color, 'text-anchor': 'middle' })
  );
}

const app = new MiniApp({
  id: 'zahlenfolgen',
  icon: '🔢',
  titel: { de: 'Zahlenfolgen', ru: 'Числовые ряды', en: 'Number sequences' },
  anweisung: {
    de: 'Sieh dir die vier Zahlen an. Welche Zahl kommt als Nächstes? Tippe sie mit den Tasten ein.',
    ru: 'Посмотри на четыре числа. Какое число будет следующим? Набери его кнопками.',
    en: 'Look at the four numbers. Which number comes next? Type it with the keys.'
  },
  hilfe: {
    de: 'Jede Reihe folgt einer einfachen Regel: immer dieselbe Zahl dazuzählen, immer mit derselben Zahl malnehmen oder die beiden Zahlen davor zusammenzählen. Tippe die fehlende Zahl und drücke ✓. 💡 Hinweis hilft dir, 🔍 Mehr zeigt einen Teil der Regel. 🔊 liest die Zahlen vor. Je weniger Hinweise und Fehlversuche, desto mehr Punkte.',
    ru: 'Каждый ряд следует простому правилу: всё время прибавлять одно и то же число, всё время умножать на одно и то же число или складывать два предыдущих числа. Набери пропущенное число и нажми ✓. 💡 Подсказка помогает, 🔍 Ещё показывает часть правила. 🔊 читает числа вслух. Чем меньше подсказок и ошибок, тем больше очков.',
    en: 'Each sequence follows a simple rule: always add the same number, always multiply by the same number, or add the two previous numbers. Type the missing number and press ✓. 💡 Hint helps you, 🔍 More reveals part of the rule. 🔊 reads the numbers aloud. The fewer hints and wrong tries, the more points.'
  },
  settingsSchema: {
    stufe: { def: 1, min: 1, max: 3, step: 1, label: { de: 'Stufe', ru: 'Уровень', en: 'Level' } },
    runden: { def: 5, min: 3, max: 8, step: 1, label: { de: 'Aufgaben', ru: 'Задания', en: 'Tasks' } },
    tempo: { def: 1, min: 0.7, max: 1.3, step: 0.1, label: { de: 'Tempo (Vorlesen)', ru: 'Темп (чтение)', en: 'Pace (read-aloud)' } }
  },
  auswertung: 'punkte',

  // Stufe/Aufgaben wirken erst nach Neustart, Tempo sofort.
  onSettingsChange(app) {
    const s = app.state;
    if (s && (s.stufe !== app.get('stufe') || s.runden !== app.get('runden'))) {
      app.reset();
    }
  },

  init(state, app) {
    state.stufe = app.get('stufe');
    state.runden = app.get('runden');
    const pool = poolFuer(state.stufe);
    const aufgaben = [];
    for (let i = 0; i < state.runden; i++) {
      aufgaben.push(machAufgabe(pool[i % pool.length]));
    }
    state.aufgaben = shuffle(aufgaben);
    state.index = 0;
    state.eingabe = '';
    state.hinweise = 0;
    state.falsch = 0;
    state.punkte = 0;
    state.geloest = false;      // richtig gelöst
    state.aufgedeckt = false;   // nach 3 Fehlversuchen aufgedeckt
    state.meldung = '';
    state.meldungFarbe = '#5b4fcf';
    state.fertig = false;
  },

  render(state, app) {
    const s = state;
    // Nach der letzten Aufgabe steht index auf aufgaben.length – letzte Karte behalten.
    const task = s.aufgaben[Math.min(s.index, s.aufgaben.length - 1)];
    const fertigAufgabe = s.geloest || s.aufgedeckt;
    const nr = Math.min(s.index + 1, s.runden);

    const oben =
      svg.text(20, 40, T({ de: `Aufgabe ${nr} von ${s.runden}`, ru: `Задание ${nr} из ${s.runden}`, en: `Task ${nr} of ${s.runden}` }),
        { 'font-size': 22, 'font-weight': 'bold', fill: '#444' }) +
      svg.text(580, 40, `⭐ ${s.punkte}`, { 'font-size': 22, 'font-weight': 'bold', fill: '#b8860b', 'text-anchor': 'end' });

    const zahlen = task.zahlen
      .map((z, i) => box(BOX_X[i], BOX_Y, BOX_W, BOX_H, '#ffffff', '#c9c3f0', String(z), '#222'))
      .join('');

    const antwortText = s.eingabe || '?';
    const antwortFill = s.geloest ? '#d9f2d9' : (s.aufgedeckt ? '#fdebd0' : '#eef0ff');
    const antwortStroke = s.geloest ? '#2a8a2a' : (s.aufgedeckt ? '#e67e22' : '#5b4fcf');
    const antwortColor = s.geloest ? '#2a8a2a' : (s.aufgedeckt ? '#e67e22' : '#5b4fcf');
    const antwortBox = box(BOX_X[4], BOX_Y, BOX_W, BOX_H, antwortFill, antwortStroke, antwortText, antwortColor);

    const tasten = BTNS.map(b => {
      let aus = false;
      if (b.id === 'hinweis') aus = s.hinweise >= 1 || fertigAufgabe || s.fertig;
      if (b.id === 'mehr') aus = s.hinweise >= 2 || fertigAufgabe || s.fertig;
      const fill = aus ? '#eeeeee' : '#ffffff';
      const stroke = aus ? '#cccccc' : '#5b4fcf';
      const color = aus ? '#aaaaaa' : '#333333';
      return svg.group(
        svg.rect(b.x, b.y, b.w, b.h, fill, { rx: 10, stroke, 'stroke-width': 2 }) +
        svg.text(b.x + b.w / 2, b.y + b.h / 2 + 7, T(b.label), { 'font-size': 19, 'font-weight': 'bold', fill: color, 'text-anchor': 'middle' })
      );
    }).join('');

    const meldung = svg.text(300, 252, s.meldung || '', { 'font-size': 20, fill: s.meldungFarbe || '#5b4fcf', 'text-anchor': 'middle' });

    const tastenfeld = KEYS.map(k => {
      const isOk = k.id === 'ok';
      const isDel = k.id === 'del';
      const label = isOk ? (fertigAufgabe ? '➜' : '✓') : (isDel ? '⌫' : k.id);
      const fill = isOk ? (fertigAufgabe ? '#34d399' : '#5b4fcf') : '#ffffff';
      const color = isOk ? '#ffffff' : '#333333';
      return svg.group(
        svg.rect(k.x, k.y, KEY_W, KEY_H, fill, { rx: 10, stroke: '#c9c3f0', 'stroke-width': 2 }) +
        svg.text(k.x + KEY_W / 2, k.y + KEY_H / 2 + 8, label, { 'font-size': 24, 'font-weight': 'bold', fill: color, 'text-anchor': 'middle' })
      );
    }).join('');

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">
      ${oben}${zahlen}${antwortBox}${tasten}${meldung}${tastenfeld}
    </svg>`;
  },

  // ─── Interaktion ───────────────────────────────────────────────────

  _buttonBei(x, y) {
    for (const b of BTNS) {
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b.id;
    }
    return null;
  },

  _keyBei(x, y) {
    for (const k of KEYS) {
      if (x >= k.x && x <= k.x + KEY_W && y >= k.y && y <= k.y + KEY_H) return k.id;
    }
    return null;
  },

  onTap(state, x, y, app) {
    if (state.fertig) return;
    const b = this._buttonBei(x, y);
    if (b === 'vorlesen') { this._vorlesen(app); return; }
    if (b === 'hinweis') { this._hinweis(1, app); app.rerender(); return; }
    if (b === 'mehr') { this._hinweis(2, app); app.rerender(); return; }
    const k = this._keyBei(x, y);
    if (k) { this._taste(k, app); app.rerender(); }
  },

  _taste(k, app) {
    const s = app.state;
    if (s.fertig) return;
    const fertigAufgabe = s.geloest || s.aufgedeckt;
    if (k === 'del') {
      if (!fertigAufgabe) s.eingabe = s.eingabe.slice(0, -1);
      return;
    }
    if (k === 'ok') {
      if (fertigAufgabe) this._weiter(app);
      else this._pruefen(app);
      return;
    }
    if (/^[0-9]$/.test(k)) {
      if (fertigAufgabe) return;
      if (k === '0' && s.eingabe === '') return;
      if (s.eingabe.length < 4) s.eingabe += k;
    }
  },

  _pruefen(app) {
    const s = app.state;
    const task = s.aufgaben[s.index];
    const wert = parseInt(s.eingabe, 10);
    if (Number.isNaN(wert)) return;
    if (wert === task.antwort) {
      const punkte = Math.max(1, 10 - 3 * s.hinweise - 2 * s.falsch);
      s.punkte += punkte;
      s.geloest = true;
      s.eingabe = String(task.antwort);
      s.meldung = T({ de: 'Richtig!', ru: 'Верно!', en: 'Correct!' }) + ' ' + T(task.regelText);
      s.meldungFarbe = '#2a8a2a';
    } else {
      s.falsch++;
      if (s.falsch >= 3) {
        s.aufgedeckt = true;
        s.eingabe = String(task.antwort);
        s.meldung = T({ de: 'Die Antwort ist', ru: 'Ответ:', en: 'The answer is' }) + ' ' + task.antwort + '. ' + T(task.regelText);
        s.meldungFarbe = '#c0392b';
      } else {
        s.meldung = T({ de: 'Noch nicht – versuch es noch einmal.', ru: 'Пока нет — попробуй ещё раз.', en: 'Not yet – try again.' });
        s.meldungFarbe = '#c0392b';
        s.eingabe = '';
      }
    }
  },

  _weiter(app) {
    const s = app.state;
    s.index++;
    if (s.index >= s.aufgaben.length) {
      s.fertig = true;
      s.meldung = '';
      return;
    }
    s.eingabe = '';
    s.hinweise = 0;
    s.falsch = 0;
    s.geloest = false;
    s.aufgedeckt = false;
    s.meldung = '';
  },

  _hinweis(stufe, app) {
    const s = app.state;
    const task = s.aufgaben[s.index];
    if (s.geloest || s.aufgedeckt || s.fertig) return;
    if (stufe === 1) {
      if (s.hinweise >= 1) return;
      s.hinweise = 1;
      s.meldung = T(task.hinweis1);
    } else {
      if (s.hinweise >= 2) return;
      s.hinweise = 2;
      s.meldung = T(task.hinweis2);
    }
    s.meldungFarbe = '#5b4fcf';
  },

  // ─── Hör-Variante ──────────────────────────────────────────────────

  _vorlesen(app) {
    const s = app.state;
    const task = s.aufgaben[s.index];
    if (!('speechSynthesis' in window) || !window.speechSynthesis) {
      s.meldung = T({ de: 'Vorlesen ist hier nicht möglich.', ru: 'Озвучивание здесь недоступно.', en: 'Read-aloud is not available here.' });
      s.meldungFarbe = '#c0392b';
      app.rerender();
      return;
    }
    const tempo = Number(app.get('tempo')) || 1;
    const sprache = { de: 'de-DE', ru: 'ru-RU', en: 'en-US' }[lang()] || 'de-DE';
    const pause = Math.round(300 + (1.3 - tempo) * 1200);
    const rate = tempo;
    const zahlen = task.zahlen.slice();
    const frage = T({ de: 'Welche Zahl kommt als Nächstes?', ru: 'Какое число следующее?', en: 'Which number comes next?' });

    s.meldung = T({ de: 'Ich lese vor …', ru: 'Читаю …', en: 'Reading …' });
    s.meldungFarbe = '#5b4fcf';
    app.rerender();

    window.speechSynthesis.cancel();
    let i = 0;
    const sprechen = (text, danach) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = sprache;
      u.rate = rate;
      if (danach) u.onend = danach;
      window.speechSynthesis.speak(u);
    };
    const weiter = () => {
      if (i < zahlen.length) {
        const text = String(zahlen[i]);
        i++;
        sprechen(text, () => setTimeout(weiter, pause));
      } else {
        sprechen(frage, () => { s.meldung = ''; app.rerender(); });
      }
    };
    weiter();
  },

  evaluate(state, app) {
    if (state.fertig) {
      const max = state.runden * 10;
      return {
        fertig: true,
        text: { de: 'Geschafft!', ru: 'Готово!', en: 'Well done!' },
        wert: `${state.punkte} / ${max} ${T({ de: 'Punkte', ru: 'очков', en: 'points' })}`
      };
    }
    return null;
  }
});

export default app;

// Direkt einbinden (apps/zahlenfolgen/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
