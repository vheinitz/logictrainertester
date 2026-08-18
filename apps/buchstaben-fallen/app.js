/**
 * Buchstaben fangen – Reaktionsspiel: fallende Buchstaben, passende Taste
 * drücken, bevor sie den Boden berühren.
 * idee-db: 120
 *
 * Aus der Ideen-DB (Beitrag 120, Dal_E_N_-_Elektronika_Dlya_Detey_-_2017,
 * S. 251–270, Kap. 12 „Давайте создадим игру!“, Projekt № 23
 * „Игра на быстроту реакции“ – Reaktionsspiel).
 *
 * Ein Buchstabe fällt langsam von oben nach unten. Das Kind muss die
 * passende Taste auf der Tastatur drücken, bevor der Buchstabe den Boden
 * berührt. Ein Treffer zählt als richtig; berührt der Buchstabe den Boden,
 * gibt es einen Fehlpunkt. Nach 5 Fehlpunkten ist das Spiel vorbei. Gewonnen
 * ist, wenn je nach Stufe 20, 100 oder 200 Buchstaben richtig getroffen
 * wurden. Die Fallgeschwindigkeit steigt mit der Stufe und lässt sich über
 * den Tempo-Regler zusätzlich anpassen.
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 600;
const VIEW_H = 400;
const GROUND_Y = 352;
const CARD_R = 42;
const SPAWN_Y = 80;
const MAX_FEHLER = 5;

const ZIELE = { 1: 20, 2: 100, 3: 200 };
const SPEED = { 1: 40, 2: 60, 3: 85 };

const STUFEN_NAME = {
  1: { de: 'Leicht', ru: 'Лёгкий', en: 'Easy' },
  2: { de: 'Mittel', ru: 'Средний', en: 'Medium' },
  3: { de: 'Schwer', ru: 'Сложный', en: 'Hard' },
};

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

/** Buchstaben passend zur aktiven Sprache (Tastaturlayout beachten). */
function alphabet() {
  if (lang() === 'ru') {
    return 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');
  }
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
}

function zufall(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

const app = new MiniApp({
  id: 'buchstaben-fallen',
  icon: '⌨️',
  titel: { de: 'Buchstaben fangen', ru: 'Поймай букву', en: 'Catch the Letter' },
  anweisung: {
    de: 'Buchstaben fallen herunter. Drücke die passende Taste, bevor der Buchstabe den Boden berührt.',
    ru: 'Буквы падают вниз. Нажми нужную клавишу, пока буква не коснулась земли.',
    en: 'Letters fall down. Press the matching key before the letter touches the ground.'
  },
  hilfe: {
    de: 'Ein Buchstabe fällt langsam von oben nach unten. Drücke die passende Taste auf der Tastatur, bevor der Buchstabe den Boden berührt. Richtig getroffen zählt als Treffer. Berührt der Buchstabe den Boden, gibt es einen Fehlpunkt – nach 5 Fehlpunkten ist das Spiel vorbei. Du gewinnst, wenn du alle Zielbuchstaben getroffen hast: Stufe 1 = 20, Stufe 2 = 100, Stufe 3 = 200. Stufe 1 fällt langsam, Stufe 3 schnell. Mit dem Tempo-Regler kannst du die Fallgeschwindigkeit zusätzlich verändern. Stelle die Tastatur auf die Sprache der App ein (lateinische Buchstaben A–Z bzw. kyrillische А–Я).',
    ru: 'Буква медленно падает сверху вниз. Нажми нужную клавишу на клавиатуре, пока буква не коснулась земли. Верное нажатие засчитывается как попадание. Если буква коснулась земли — это ошибка, после 5 ошибок игра заканчивается. Ты выиграешь, когда наберёшь все буквы цели: уровень 1 — 20, уровень 2 — 100, уровень 3 — 200. На уровне 1 буквы падают медленно, на уровне 3 — быстро. Регулятором «Темп» можно дополнительно менять скорость. Переключи раскладку клавиатуры на язык приложения (латинские A–Z или кириллические А–Я).',
    en: 'A letter falls slowly from top to bottom. Press the matching key on the keyboard before the letter touches the ground. A correct press counts as a hit. If the letter touches the ground, that is a miss – after 5 misses the game is over. You win by reaching the target number of letters: level 1 = 20, level 2 = 100, level 3 = 200. Level 1 falls slowly, level 3 fast. Use the speed slider to adjust the falling speed further. Set the keyboard layout to match the app language (Latin A–Z or Cyrillic А–Я).'
  },
  settingsSchema: {
    stufe: { def: 1, min: 1, max: 3, step: 1, label: { de: 'Stufe', ru: 'Уровень', en: 'Level' } },
    tempo: { def: 1, min: 0.7, max: 2, step: 0.1, label: { de: 'Tempo', ru: 'Темп', en: 'Speed' } }
  },
  auswertung: 'punkte',

  // Stufe wirkt erst nach Neustart (neues Ziel + Grundtempo), Tempo sofort.
  onSettingsChange(app) {
    const s = app.state;
    if (s && s.stufe !== app.get('stufe')) app.reset();
  },

  // ─── Zustand ───────────────────────────────────────────────────────
  init(state, app) {
    this._stopLoop(state);
    this._entferneTasten();

    state.stufe = app.get('stufe');
    state.ziel = ZIELE[state.stufe] || 20;
    state.richtig = 0;
    state.fehler = 0;
    state.fertig = false;
    state.gameover = false;
    state.buchstabe = null;
    state.feedback = null;
    state.wrongBlitz = 0;
    state.letzte = Date.now();
    this._neuerBuchstabe(state);

    this._keyHandler = (e) => this._onKey(e, app);
    if (typeof window !== 'undefined') window.addEventListener('keydown', this._keyHandler);

    state.loop = setInterval(() => this._tick(app), 1000 / 60);
    if (state.loop && typeof state.loop.unref === 'function') state.loop.unref();
  },

  dispose(state) {
    this._stopLoop(state);
    this._entferneTasten();
  },

  _stopLoop(state) {
    if (state && state.loop) { clearInterval(state.loop); state.loop = null; }
  },

  _entferneTasten() {
    if (typeof window !== 'undefined' && this._keyHandler) {
      window.removeEventListener('keydown', this._keyHandler);
    }
    this._keyHandler = null;
  },

  _geschwindigkeit(app) {
    const stufe = app.get('stufe') || 1;
    const base = SPEED[stufe] || SPEED[1];
    const tempo = Number(app.get('tempo')) || 1;
    return base * tempo;
  },

  _neuerBuchstabe(state) {
    const pool = alphabet();
    state.buchstabe = {
      ch: pool[Math.floor(Math.random() * pool.length)],
      x: zufall(90, VIEW_W - 90),
      y: SPAWN_Y
    };
  },

  // ─── Spielschleife ─────────────────────────────────────────────────
  _tick(app) {
    const s = app.state;
    if (!s || s.fertig || s.gameover) { this._stopLoop(s); return; }
    if (!s.buchstabe) this._neuerBuchstabe(s);

    const now = Date.now();
    const dt = Math.min(0.05, (now - (s.letzte || now)) / 1000);
    s.letzte = now;

    s.buchstabe.y += this._geschwindigkeit(app) * dt;
    if (s.buchstabe.y + CARD_R >= GROUND_Y) this._fehler(app);

    app.rerender();
  },

  _onKey(e, app) {
    const s = app.state;
    if (!s || s.fertig || s.gameover || !s.buchstabe) return;
    const taste = String(e.key || '').toUpperCase();
    if (taste.length !== 1) return;
    if (taste === s.buchstabe.ch) {
      this._treffer(app);
    } else {
      s.wrongBlitz = Date.now() + 250;
    }
    app.rerender();
  },

  _treffer(app) {
    const s = app.state;
    s.richtig++;
    const b = s.buchstabe;
    if (s.richtig >= s.ziel) {
      s.fertig = true;
      s.buchstabe = null;
      s.feedback = null;
      this._stopLoop(s);
    } else {
      s.feedback = { art: 'gut', x: b.x, y: b.y, bis: Date.now() + 320 };
      this._neuerBuchstabe(s);
    }
  },

  _fehler(app) {
    const s = app.state;
    s.fehler++;
    const b = s.buchstabe;
    s.buchstabe = null;
    if (s.fehler >= MAX_FEHLER) {
      s.gameover = true;
      s.feedback = null;
      this._stopLoop(s);
    } else {
      s.feedback = { art: 'fehl', x: b.x, y: GROUND_Y, bis: Date.now() + 420 };
      this._neuerBuchstabe(s);
    }
  },

  // ─── Rendering ────────────────────────────────────────────────────
  render(state, app) {
    const s = state;
    const teile = [];

    // Himmel + Boden
    teile.push(svg.rect(0, 0, VIEW_W, GROUND_Y, '#fafaff'));
    teile.push(svg.rect(0, GROUND_Y, VIEW_W, VIEW_H - GROUND_Y, '#e3f3e3'));
    teile.push(svg.rect(0, GROUND_Y, VIEW_W, 6, '#43a047', { rx: 3 }));

    // Kopfzeile
    teile.push(svg.text(20, 34,
      `⭐ ${T({ de: 'Richtig', ru: 'Верно', en: 'Right' })}: ${s.richtig} / ${s.ziel}`,
      { 'font-size': 18, 'font-weight': 'bold', fill: '#444' }));
    teile.push(svg.text(300, 34, T(STUFEN_NAME[s.stufe] || STUFEN_NAME[1]),
      { 'font-size': 16, fill: '#777', 'text-anchor': 'middle' }));
    teile.push(svg.text(580, 34,
      `❌ ${T({ de: 'Fehler', ru: 'Ошибки', en: 'Misses' })}: ${s.fehler} / ${MAX_FEHLER}`,
      { 'font-size': 18, 'font-weight': 'bold', fill: '#b23333', 'text-anchor': 'end' }));

    // Fallender Buchstabe
    if (s.buchstabe) {
      const b = s.buchstabe;
      const blitz = Date.now() < s.wrongBlitz;
      teile.push(svg.circle(b.x, b.y, CARD_R, blitz ? '#ffe3e3' : '#ffffff', {
        stroke: blitz ? '#e03131' : '#5b4fcf',
        'stroke-width': 3
      }));
      teile.push(svg.text(b.x, b.y + 17, b.ch, {
        'font-size': 52, 'font-weight': 'bold',
        fill: blitz ? '#c92a2a' : '#333333', 'text-anchor': 'middle'
      }));
    }

    // Kurzes Feedback (✓ / ✗)
    if (s.feedback && Date.now() < s.feedback.bis) {
      const f = s.feedback;
      if (f.art === 'gut') {
        teile.push(svg.text(f.x, f.y - CARD_R - 8, '✓',
          { 'font-size': 40, 'font-weight': 'bold', fill: '#2a8a2a', 'text-anchor': 'middle' }));
      } else {
        teile.push(svg.text(f.x, GROUND_Y - 14, '✗',
          { 'font-size': 40, 'font-weight': 'bold', fill: '#e03131', 'text-anchor': 'middle' }));
      }
    }

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">${teile.join('')}</svg>`;
  },

  // ─── Auswertung / Status ───────────────────────────────────────────
  evaluate(state, app) {
    if (state.fertig) {
      return {
        fertig: true,
        text: { de: 'Geschafft!', ru: 'Готово!', en: 'Well done!' },
        wert: `${state.richtig} ${T({ de: 'Buchstaben', ru: 'букв', en: 'letters' })} · ${app.elapsedSek()} s`
      };
    }
    return null;
  },

  statusHtml(state, app) {
    if (state.gameover) {
      return `<div class="ma-result" style="background:#fff0f0;border:1px solid #ecc;color:#a33;text-align:center">
        💥 ${T({ de: 'Spiel vorbei', ru: 'Игра окончена', en: 'Game over' })} —
        ${T({
          de: '5 Fehlpunkte erreicht. Drücke oben auf 🔁 für einen neuen Versuch.',
          ru: 'Набрано 5 ошибок. Нажми 🔁 вверху для новой попытки.',
          en: '5 misses reached. Press 🔁 above to try again.'
        })}
      </div>`;
    }
    return `<div class="ma-result">⭐ ${T({ de: 'Richtig', ru: 'Верно', en: 'Right' })}: ${state.richtig} / ${state.ziel} · ❌ ${T({ de: 'Fehler', ru: 'Ошибки', en: 'Misses' })}: ${state.fehler} / ${MAX_FEHLER}</div>`;
  },

  // ─── Aktionen (auch für Tests) ─────────────────────────────────────
  actions: {
    druecke(state, ch, app) {
      const taste = String(ch).toUpperCase();
      if (state.fertig || state.gameover || !state.buchstabe) return;
      if (taste === state.buchstabe.ch) this._treffer(app);
      else state.wrongBlitz = Date.now() + 250;
    },
    boden(state, app) {
      if (state.fertig || state.gameover || !state.buchstabe) return;
      this._fehler(app);
    },
    neu(state, ...args) {
      args[args.length - 1].reset();
    }
  }
});

export default app;

// Direkt einbinden (apps/s-251-270-kap-12-projekt-23/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
