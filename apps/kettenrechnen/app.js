/**
 * Kettenrechnen – Rechenschritte im Kopf behalten und das Endergebnis nennen.
 * idee-db: 64
 *
 * Aus der Ideen-DB (Beitrag 64, Pchyolko/Polyak „Арифметика“, 3. Klasse,
 * S. 132, „Устные примеры и задачи“, Nr. 1172–1175 – Kettenrechnen).
 *
 * Die App liest eine Kette von Rechenschritten einzeln vor (oder blitzt sie
 * als Perlenkette kurz auf). Das Kind behält die Zwischenergebnisse im Kopf
 * und tippt am Ende das Endergebnis ein. Nach einer falschen Antwort lassen
 * sich die Zwischenergebnisse an jeder Stelle aufdecken, damit das Kind den
 * Fehlerort selbst findet.
 *
 * Alle Zahlen in den Ketten (Startzahl und jede einzelne Rechenzahl) liegen
 * zwischen 1 und 15. Drei Schwierigkeitsstufen verlängern die Kette und
 * erweitern die Rechenarten.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 600;
const VIEW_H = 600;

// Perlenkette
const BEAD_Y = 82;
const BEAD_R = 24;
const STEP_Y = 126;   // Untertitel „Start“
const WERT_Y = 148;   // aufgedecktes Zwischenergebnis
const MSG_Y = 172;    // Meldung

// Bedienknöpfe
const BTN_Y = 188;
const BTN_H = 44;
const BTNS = [
  { id: 'abspielen', x: 16,  y: BTN_Y, w: 180, h: BTN_H, label: { de: '▶ Abspielen', ru: '▶ Играть', en: '▶ Play' } },
  { id: 'modus',     x: 210, y: BTN_Y, w: 180, h: BTN_H },
  { id: 'zwischen',  x: 404, y: BTN_Y, w: 180, h: BTN_H, label: { de: '💡 Zwischenschritte', ru: '💡 Промежутки', en: '💡 Steps' } },
];

// Tastenfeld
const KEY_W = 60;
const KEY_H = 54;
const KEY_GAP = 8;
const KEY_X0 = (VIEW_W - (3 * KEY_W + 2 * KEY_GAP)) / 2;
const KEY_Y0 = 308;
const KEY_ROWS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['del', '0', 'ok']];
const KEYS = [];
KEY_ROWS.forEach((row, r) => row.forEach((id, c) => {
  KEYS.push({ id, x: KEY_X0 + c * (KEY_W + KEY_GAP), y: KEY_Y0 + r * (KEY_H + KEY_GAP) });
}));

const OP_ZEICHEN = { '+': '+', '-': '−', '*': '×', '/': '÷' };
const OP_FARBE = { '+': '#4D96FF', '-': '#FB923C', '*': '#C084FC', '/': '#F472B6' };
const START_FARBE = '#34D399';

/** Aktive Sprache (global geteilt, wie in der Haupt-App). */
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
function zufall(min, max) { return min + rnd(max - min + 1); }

function opZeichen(op) { return OP_ZEICHEN[op] || op; }

function opWort(op) {
  return {
    '+': { de: 'plus', ru: 'плюс', en: 'plus' },
    '-': { de: 'minus', ru: 'минус', en: 'minus' },
    '*': { de: 'mal', ru: 'умножить на', en: 'times' },
    '/': { de: 'geteilt durch', ru: 'разделить на', en: 'divided by' },
  }[op];
}

function rechne(cur, op, n) {
  if (op === '+') return cur + n;
  if (op === '-') return cur - n;
  if (op === '*') return cur * n;
  if (op === '/') return cur / n;
  return cur;
}

// ─── Ketten-Generator ───────────────────────────────────────────────
// Alle Rechenzahlen und die Startzahl liegen zwischen 1 und 15.
// '+' ist immer erlaubt, damit die gewünschte Kettenlänge sicher erreicht wird.

function cap(stufe) { return stufe === 2 ? 200 : 300; }
function maxFaktor(stufe) { return stufe === 2 ? 5 : 9; }

function erlaubteOps(stufe) {
  if (stufe === 1) return ['+', '-'];
  if (stufe === 2) return ['+', '-', '*'];
  return ['+', '-', '*', '/'];
}

function divisorOptionen(cur) {
  const out = [];
  for (let d = 2; d <= 9; d++) if (cur % d === 0) out.push(d);
  return out;
}

function moeglicheOps(stufe, cur) {
  return erlaubteOps(stufe).filter(op => {
    if (op === '+') return true;
    if (op === '-') return cur > 1;
    if (op === '*') return cur * 2 <= cap(stufe);
    if (op === '/') return divisorOptionen(cur).length > 0;
    return false;
  });
}

function operandFuer(op, cur, stufe) {
  if (op === '+') return zufall(1, 15);
  if (op === '-') return zufall(1, Math.min(15, cur - 1));
  if (op === '*') {
    const f = [];
    for (let m = 2; m <= maxFaktor(stufe); m++) if (cur * m <= cap(stufe)) f.push(m);
    return f[rnd(f.length)];
  }
  if (op === '/') {
    const d = divisorOptionen(cur);
    return d[rnd(d.length)];
  }
  return 1;
}

function machKette(stufe) {
  const laenge = stufe === 1 ? 3 : stufe === 2 ? 4 : 5;
  const start = zufall(1, 15);
  let cur = start;
  const schritte = [];
  for (let i = 0; i < laenge; i++) {
    const ops = moeglicheOps(stufe, cur);
    const op = ops[rnd(ops.length)];
    const n = operandFuer(op, cur, stufe);
    schritte.push({ op, n });
    cur = rechne(cur, op, n);
  }
  return { start, schritte, ergebnis: cur };
}

function laufWerte(task) {
  const werte = [task.start];
  let cur = task.start;
  for (const st of task.schritte) {
    cur = rechne(cur, st.op, st.n);
    werte.push(cur);
  }
  return werte;
}

function beadX(i, n) { return (VIEW_W / (n + 1)) * (i + 1); }

// ─── SVG-Bausteine ──────────────────────────────────────────────────

function buttonSvg(b, label, aus) {
  const fill = aus ? '#eeeeee' : '#ffffff';
  const stroke = aus ? '#cccccc' : '#5b4fcf';
  const color = aus ? '#aaaaaa' : '#333333';
  return svg.group(
    svg.rect(b.x, b.y, b.w, b.h, fill, { rx: 10, stroke, 'stroke-width': 2 }) +
    svg.text(b.x + b.w / 2, b.y + b.h / 2 + 7, label,
      { 'font-size': 16, 'font-weight': 'bold', fill: color, 'text-anchor': 'middle' })
  );
}

const app = new MiniApp({
  id: 'kettenrechnen',
  icon: '🔗',
  titel: { de: 'Kettenrechnen', ru: 'Цепочки вычислений', en: 'Chain arithmetic' },
  anweisung: {
    de: 'Höre (oder sieh) die Rechenschritte. Behalte die Zwischenergebnisse im Kopf und tippe am Ende das Endergebnis ein.',
    ru: 'Послушай (или посмотри) действия. Держи промежуточные результаты в уме и набери в конце итоговый ответ.',
    en: 'Listen to (or watch) the steps. Keep the intermediate results in mind and type the final result at the end.'
  },
  hilfe: {
    de: 'Drücke ▶ Abspielen: Die App liest die Kette Schritt für Schritt vor – z. B. „15, mal 4, geteilt durch 5, mal 7, plus 15“. Rechne im Kopf mit und tippe das Endergebnis ein. Mit dem Knopf 🔊/👁 wählst du Hören, Sehen (die Perlen blitzen kurz auf) oder beides. Nach einer falschen Antwort zeigt 💡 Zwischenschritte die Zwischenergebnisse unter jeder Perle, damit du den Fehlerort findest. Alle Zahlen in der Kette liegen zwischen 1 und 15. Stufe 1: kurze Ketten mit plus/minus · Stufe 2: länger, auch malnehmen · Stufe 3: am längsten, auch teilen. Im Alltag geht das auch als „Der Einkaufszettel im Kopf“.',
    ru: 'Нажми ▶ Играть: приложение читает цепочку шаг за шагом — например, «15, умножить на 4, разделить на 5, умножить на 7, плюс 15». Считай в уме и набери итог. Кнопкой 🔊/👁 выбери слушать, смотреть (бусины кратко вспыхивают) или оба. После ошибки 💡 Промежутки покажет промежуточные результаты под каждой бусиной, чтобы ты нашёл место ошибки. Все числа в цепочке от 1 до 15. Уровень 1: короткие цепочки с плюсом/минусом · Уровень 2: длиннее, ещё умножение · Уровень 3: самые длинные, ещё деление. В жизни это игра «Список покупок в уме».',
    en: 'Press ▶ Play: the app reads the chain step by step – e.g. “15, times 4, divided by 5, times 7, plus 15”. Work it out in your head and type the final result. The 🔊/👁 button switches between hearing, seeing (the beads flash briefly) or both. After a wrong answer, 💡 Steps reveals the intermediate results under each bead so you can find where the mistake was. All numbers in the chain are between 1 and 15. Level 1: short chains with plus/minus · Level 2: longer, also multiplication · Level 3: longest, also division. In everyday life this works as “the shopping list in your head”.'
  },
  settingsSchema: {
    stufe: { def: 1, min: 1, max: 3, step: 1, label: { de: 'Stufe', ru: 'Уровень', en: 'Level' } },
    runden: { def: 5, min: 3, max: 8, step: 1, label: { de: 'Aufgaben', ru: 'Задания', en: 'Tasks' } },
    tempo: { def: 1, min: 0.7, max: 1.3, step: 0.1, label: { de: 'Tempo (Abspielen)', ru: 'Темп (воспроизведение)', en: 'Pace (playback)' } }
  },
  auswertung: 'punkte',

  // Stufe/Aufgaben wirken erst nach Neustart, Tempo sofort.
  onSettingsChange(app) {
    const s = app.state;
    if (s && (s.stufe !== app.get('stufe') || s.runden !== app.get('runden'))) app.reset();
  },

  init(state, app) {
    state.stufe = app.get('stufe');
    state.runden = app.get('runden');
    state.modus = 'hoeren';
    state.aufgaben = [];
    for (let i = 0; i < state.runden; i++) state.aufgaben.push(machKette(state.stufe));
    state.index = 0;
    state.eingabe = '';
    state.falsch = 0;
    state.punkte = 0;
    state.geloest = false;      // richtig gelöst
    state.aufgedeckt = false;   // nach 3 Fehlversuchen aufgedeckt
    state.zwischen = 0;         // 0 = aus, -1 = alle, i = nur Perle i
    state.aktiv = -1;           // gerade aufleuchtende Perle
    state.laeuft = false;       // Abspielen läuft
    state.laufToken = (state.laufToken || 0) + 1;
    state.meldung = '';
    state.meldungFarbe = '#5b4fcf';
    state.fertig = false;
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
  },

  dispose(state) {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
  },

  // ─── Rendering ────────────────────────────────────────────────────

  _beadLabel(step, s, aktiv) {
    const z = opZeichen(step.op);
    if (s.geloest || s.aufgedeckt) return `${z} ${step.n}`;
    if (s.modus === 'hoeren') return z;
    return aktiv ? `${z} ${step.n}` : z;
  },

  _modusLabel(modus) {
    return {
      hoeren: T({ de: '🔊 Hören', ru: '🔊 Слушать', en: '🔊 Hear' }),
      sehen: T({ de: '👁 Sehen', ru: '👁 Смотреть', en: '👁 See' }),
      beides: T({ de: '🔊👁 Beides', ru: '🔊👁 Оба', en: '🔊👁 Both' }),
    }[modus] || '🔊';
  },

  _zeigeWert(s, i) {
    return s.zwischen === -1 || s.zwischen === i;
  },

  render(state, app) {
    const s = state;
    const task = s.aufgaben[Math.min(s.index, s.aufgaben.length - 1)];
    const fertigAufgabe = s.geloest || s.aufgedeckt;
    const nr = Math.min(s.index + 1, s.runden);
    const total = task.schritte.length + 1;
    const werte = laufWerte(task);

    const oben =
      svg.text(20, 36, T({ de: `Aufgabe ${nr} von ${s.runden}`, ru: `Задание ${nr} из ${s.runden}`, en: `Task ${nr} of ${s.runden}` }),
        { 'font-size': 22, 'font-weight': 'bold', fill: '#444' }) +
      svg.text(580, 36, `⭐ ${s.punkte}`, { 'font-size': 22, 'font-weight': 'bold', fill: '#b8860b', 'text-anchor': 'end' });

    // Perlenkette: Perle 0 = Startzahl, danach je eine Perle pro Rechenschritt.
    let perlen = '';
    for (let i = 0; i < total; i++) {
      const cx = beadX(i, total);
      const istStart = i === 0;
      const step = istStart ? null : task.schritte[i - 1];
      const aktiv = s.aktiv === i;
      const label = istStart ? String(task.start) : this._beadLabel(step, s, aktiv);
      const fill = istStart ? START_FARBE : (OP_FARBE[step.op] || '#5b4fcf');
      perlen += svg.circle(cx, BEAD_Y, BEAD_R, fill, {
        stroke: aktiv ? '#f59e0b' : '#333333',
        'stroke-width': aktiv ? 4 : 1.5,
      });
      perlen += svg.text(cx, BEAD_Y + 7, label, {
        'font-size': istStart ? 24 : 18,
        'font-weight': 'bold', fill: '#ffffff', 'text-anchor': 'middle',
      });
      if (istStart) {
        perlen += svg.text(cx, STEP_Y, T({ de: 'Start', ru: 'Старт', en: 'Start' }),
          { 'font-size': 13, fill: '#777', 'text-anchor': 'middle' });
      }
      if (!istStart && this._zeigeWert(s, i)) {
        perlen += svg.text(cx, WERT_Y, '= ' + werte[i],
          { 'font-size': 14, 'font-weight': 'bold', fill: '#5b4fcf', 'text-anchor': 'middle' });
      }
    }

    const meldung = svg.text(300, MSG_Y, s.meldung || '', {
      'font-size': 18, fill: s.meldungFarbe || '#5b4fcf', 'text-anchor': 'middle',
    });

    const knoepfe = BTNS.map(b => {
      let label;
      let aus = false;
      if (b.id === 'abspielen') {
        label = s.laeuft ? T({ de: '⏹ Stopp', ru: '⏹ Стоп', en: '⏹ Stop' }) : T(b.label);
        aus = fertigAufgabe || s.fertig;
      } else if (b.id === 'modus') {
        label = this._modusLabel(s.modus);
        aus = s.laeuft || s.fertig;
      } else {
        const ausZ = fertigAufgabe || s.fertig;
        label = !ausZ && s.zwischen !== 0
          ? T({ de: '🙈 Verbergen', ru: '🙈 Скрыть', en: '🙈 Hide' })
          : T(b.label);
        aus = ausZ;
      }
      return buttonSvg(b, label, aus);
    }).join('');

    const antwortText = s.eingabe || '?';
    const antwortFill = s.geloest ? '#d9f2d9' : s.aufgedeckt ? '#fdebd0' : '#eef0ff';
    const antwortStroke = s.geloest ? '#2a8a2a' : s.aufgedeckt ? '#e67e22' : '#5b4fcf';
    const antwortColor = s.geloest ? '#2a8a2a' : s.aufgedeckt ? '#e67e22' : '#5b4fcf';
    const antwort =
      svg.text(300, 246, T({ de: 'Deine Antwort', ru: 'Твой ответ', en: 'Your answer' }),
        { 'font-size': 14, fill: '#777', 'text-anchor': 'middle' }) +
      svg.group(
        svg.rect(190, 252, 220, 44, antwortFill, { rx: 10, stroke: antwortStroke, 'stroke-width': 2 }) +
        svg.text(300, 281, antwortText, { 'font-size': 28, 'font-weight': 'bold', fill: antwortColor, 'text-anchor': 'middle' })
      );

    const tastenfeld = KEYS.map(k => {
      const isOk = k.id === 'ok';
      const isDel = k.id === 'del';
      const label = isOk ? (fertigAufgabe ? '➜' : '✓') : (isDel ? '⌫' : k.id);
      const fill = isOk ? (fertigAufgabe ? '#34d399' : '#5b4fcf') : '#ffffff';
      const color = isOk ? '#ffffff' : '#333333';
      return svg.group(
        svg.rect(k.x, k.y, KEY_W, KEY_H, fill, { rx: 10, stroke: '#c9c3f0', 'stroke-width': 2 }) +
        svg.text(k.x + KEY_W / 2, k.y + KEY_H / 2 + 8, label,
          { 'font-size': 24, 'font-weight': 'bold', fill: color, 'text-anchor': 'middle' })
      );
    }).join('');

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">
      ${oben}${perlen}${meldung}${knoepfe}${antwort}${tastenfeld}
    </svg>`;
  },

  // ─── Interaktion ──────────────────────────────────────────────────

  _btnBei(x, y) {
    return BTNS.find(b => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) || null;
  },

  _keyBei(x, y) {
    const k = KEYS.find(k => x >= k.x && x <= k.x + KEY_W && y >= k.y && y <= k.y + KEY_H);
    return k ? k.id : null;
  },

  _perleBei(state, x, y) {
    const task = state.aufgaben[Math.min(state.index, state.aufgaben.length - 1)];
    const total = task.schritte.length + 1;
    for (let i = 0; i < total; i++) {
      const dx = x - beadX(i, total);
      const dy = y - BEAD_Y;
      if (Math.hypot(dx, dy) <= BEAD_R + 6) return i;
    }
    return null;
  },

  onTap(state, x, y, app) {
    if (state.fertig) return;
    const b = this._btnBei(x, y);
    if (b) {
      if (b.id === 'abspielen') {
        if (!state.geloest && !state.aufgedeckt) this._abspielen(app);
        return;
      }
      if (b.id === 'modus') {
        if (!state.laeuft) { this._zyklusModus(app); app.rerender(); }
        return;
      }
      if (b.id === 'zwischen') {
        if (!state.geloest && !state.aufgedeckt) { this._toggleZwischen(app); app.rerender(); }
        return;
      }
      return;
    }
    // Perle antippen: einzelnes Zwischenergebnis aufdecken.
    const i = this._perleBei(state, x, y);
    if (i != null && i > 0 && !state.geloest && !state.aufgedeckt && !state.laeuft) {
      state.zwischen = state.zwischen === i ? 0 : i;
      app.rerender();
      return;
    }
    const k = this._keyBei(x, y);
    if (k) { this._taste(k, app); app.rerender(); }
  },

  _zyklusModus(app) {
    const s = app.state;
    const reihe = ['hoeren', 'sehen', 'beides'];
    s.modus = reihe[(reihe.indexOf(s.modus) + 1) % reihe.length];
  },

  _toggleZwischen(app) {
    const s = app.state;
    s.zwischen = s.zwischen === -1 ? 0 : -1;
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
    if (wert === task.ergebnis) {
      const punkte = Math.max(1, 10 - 2 * s.falsch - (s.zwischen !== 0 ? 3 : 0));
      s.punkte += punkte;
      s.geloest = true;
      s.eingabe = String(task.ergebnis);
      s.zwischen = -1; // Lösungsweg zeigen
      s.meldung = T({ de: 'Richtig!', ru: 'Верно!', en: 'Correct!' });
      s.meldungFarbe = '#2a8a2a';
    } else {
      s.falsch++;
      if (s.falsch >= 3) {
        s.aufgedeckt = true;
        s.eingabe = String(task.ergebnis);
        s.zwischen = -1;
        s.meldung = T({ de: 'Das Ergebnis ist', ru: 'Ответ:', en: 'The result is' }) + ' ' + task.ergebnis + '.';
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
    s.falsch = 0;
    s.geloest = false;
    s.aufgedeckt = false;
    s.zwischen = 0;
    s.aktiv = -1;
    s.meldung = '';
  },

  // ─── Abspielen (Hören und/oder Sehen) ─────────────────────────────

  _kannSprechen() {
    return typeof window !== 'undefined' && window.speechSynthesis;
  },

  _abspielen(app) {
    const s = app.state;
    if (s.laeuft) { this._stopp(app); return; }
    if (s.geloest || s.aufgedeckt || s.fertig) return;

    const brauchtAudio = s.modus === 'hoeren' || s.modus === 'beides';
    if (brauchtAudio && !this._kannSprechen()) {
      s.meldung = T({ de: 'Vorlesen ist hier nicht möglich.', ru: 'Озвучивание здесь недоступно.', en: 'Read-aloud is not available here.' });
      s.meldungFarbe = '#c0392b';
      app.rerender();
      return;
    }

    const token = s.laufToken;
    const tempo = Number(app.get('tempo')) || 1;
    const pause = Math.round(300 + (1.3 - tempo) * 1200);
    const sprache = { de: 'de-DE', ru: 'ru-RU', en: 'en-US' }[lang()] || 'de-DE';
    const task = s.aufgaben[s.index];
    const kette = [String(task.start), ...task.schritte.map(st => `${T(opWort(st.op))} ${st.n}`)];
    const frage = T({ de: 'Wie lautet das Ergebnis?', ru: 'Какой ответ?', en: 'What is the result?' });

    const sprechen = (text, danach) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = sprache;
      u.rate = tempo;
      if (danach) u.onend = danach;
      window.speechSynthesis.speak(u);
    };

    s.laeuft = true;
    s.aktiv = -1;
    s.meldung = T({ de: 'Ich lese vor …', ru: 'Читаю …', en: 'Reading …' });
    s.meldungFarbe = '#5b4fcf';
    app.rerender();

    let i = 0;
    const schritt = () => {
      if (s.laufToken !== token || !s.laeuft) return;
      if (i >= kette.length) {
        const fertig = () => {
          if (s.laufToken !== token) return;
          s.laeuft = false;
          s.aktiv = -1;
          s.meldung = '';
          app.rerender();
        };
        if (brauchtAudio) sprechen(frage, fertig);
        else fertig();
        return;
      }
      s.aktiv = i;
      app.rerender();
      if (brauchtAudio) {
        sprechen(kette[i], () => {
          if (s.laufToken !== token || !s.laeuft) return;
          i++;
          setTimeout(schritt, pause);
        });
      } else {
        i++;
        setTimeout(schritt, pause);
      }
    };
    schritt();
  },

  _stopp(app) {
    const s = app.state;
    s.laeuft = false;
    s.aktiv = -1;
    s.laufToken = (s.laufToken || 0) + 1;
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    s.meldung = '';
    app.rerender();
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

// Direkt einbinden (apps/s-132-nr-1172-1175-kettenrechnen/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
