/**
 * Rhythmus-Klopfer – selbständig, ohne Begleitperson
 *
 * Das Programm klopft ein Muster vor (Töne per WebAudio), das Kind klopft es
 * mit der Leertaste oder auf die Tippfläche nach.
 *
 * Bewertet werden die **Verhältnisse** der Abstände, nicht deren absolute
 * Länge: wer dasselbe Muster gleichmäßig langsamer nachklopft, hat den
 * Rhythmus verstanden. Deshalb wird die Eingabe auf die Gesamtdauer des
 * Musters normiert, bevor verglichen wird. Nur ein grob abweichendes
 * Grundtempo (unter 0,4× oder über 2,5×) gilt als Fehler.
 *
 * Warum kein Ende-Knopf: das Kind klopft und hört auf. Nach einer kurzen
 * Stille wird ausgewertet. Ein „Fertig"-Knopf mitten im Klopfen würde den
 * Rhythmus zerstören.
 *
 * Warum die Anzahl der Schläge nicht angezeigt wird: sie ist Teil der
 * Aufgabe. Sichtbare leere Plätze wie bei den Zahlenfolgen würden die
 * Lösung halb verraten.
 */
import { engine } from '../core/engine.js';
import { randInt } from '../core/html.js';
import { audio, audioReady, now, beep, beepNow } from '../core/audio.js';
import { bar, stopButton, starRow, pictogram, mutedHint } from '../core/shell.js';
import { nextBestLevel } from '../core/adaptive.js';

const ID = 'seq-rhythmus';
const UNIT = 380;            // Grundeinheit in ms
const MIN_N = 3;             // Schläge
const MAX_N = 8;
const SILENCE_MS = 1600;     // Stille nach dem letzten Schlag → auswerten
const NO_INPUT_MS = 7000;    // gar kein Schlag → Fehlversuch
const SCORE_MAP = { 3: 0, 4: 25, 5: 45, 6: 70, 7: 90, 8: 110 };
const BONUS = 130;

let timer = null;
let listening = false;
let onKey = null, onTap = null;

function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }
function isActive() { return !!(engine.activeGame && engine.activeGame.id === ID); }
function computeScore(level) { return level > MAX_N ? BONUS : (SCORE_MAP[level] || 0); }

/**
 * Muster als Folge von Abständen (ms) zwischen `level` Schlägen.
 * Niedrige Stufen nur mit ganzen und doppelten Einheiten, höhere zusätzlich
 * mit halben – erst dadurch entsteht ein Rhythmus statt eines Metronoms.
 */
function genPattern(level) {
  const choices = level <= 4 ? [1, 2]
    : level <= 6 ? [1, 1, 2]
    : [0.5, 1, 1, 2];
  for (let versuch = 0; versuch < 20; versuch++) {
    const iv = [];
    for (let i = 0; i < level - 1; i++) iv.push(Math.round(UNIT * choices[randInt(0, choices.length - 1)]));
    // Ab 4 Schlägen mindestens ein ungleicher Abstand, sonst ist es kein Muster
    if (level < 4 || new Set(iv).size > 1) return iv;
  }
  return Array(level - 1).fill(UNIT);
}

/**
 * Vergleicht geklopfte Zeitpunkte mit dem Muster.
 * Exportiert, damit die Regel ohne Browser prüfbar ist.
 *
 * @param {number[]} pattern  Abstände des Musters in ms
 * @param {number[]} taps     Zeitpunkte der Schläge in ms
 * @returns {{ok:boolean, reason?:string, tempo?:number}}
 */
export function evaluateRhythm(pattern, taps, opt = {}) {
  // Die Toleranz muss deutlich unter der halben Lücke zwischen zwei
  // Notenwerten bleiben, sonst überlappen sich die Bänder: bei ±34 % reichte
  // das Band um 400 ms bis 536 und das um 800 ms ab 528 – gleichmäßiges
  // Metronom-Klopfen wäre als „kurz–lang–kurz" durchgegangen.
  // Mit ±25 % (Untergrenze 100 ms) bleiben 190/380/760 ms sauber getrennt.
  const tolMs = opt.tolMs ?? 100;
  const tolRel = opt.tolRel ?? 0.25;
  const want = pattern.length + 1;
  if (!taps || taps.length !== want) {
    return { ok: false, reason: 'anzahl', got: taps ? taps.length : 0, want };
  }
  const iv = [];
  for (let i = 1; i < taps.length; i++) iv.push(taps[i] - taps[i - 1]);
  if (iv.some(x => x <= 0)) return { ok: false, reason: 'zeitfolge' };

  const sumP = pattern.reduce((a, b) => a + b, 0);
  const sumT = iv.reduce((a, b) => a + b, 0);
  if (sumT <= 0) return { ok: false, reason: 'zeitfolge' };

  // Grundtempo: >1 heißt langsamer nachgeklopft als vorgegeben
  const tempo = sumT / sumP;
  if (tempo < 0.4 || tempo > 2.5) return { ok: false, reason: 'tempo', tempo };

  // Auf die Musterdauer normieren – bewertet werden die Verhältnisse
  const s = sumP / sumT;
  for (let i = 0; i < pattern.length; i++) {
    const abweichung = Math.abs(iv[i] * s - pattern[i]);
    if (abweichung > Math.max(tolMs, pattern[i] * tolRel)) {
      return { ok: false, reason: 'muster', at: i, tempo };
    }
  }
  return { ok: true, tempo };
}

// ─── Phasen ───────────────────────────────────────────────────────────
function enterListen(gs) {
  const gd = gs.gd;
  gd.pattern = genPattern(gd.level);
  gd.taps = [];
  gd.phase = 'listen';
  gd.phaseStart = Date.now();

  const total = gd.pattern.reduce((a, b) => a + b, 0);
  gd.listenDuration = total + 500;

  // Töne über die Audio-Uhr planen – exakt, anders als setTimeout
  const a = audio();
  if (a) {
    let t = a.currentTime + 0.35;      // kurzer Vorlauf
    beep(t, { freq: 880 });
    for (const iv of gd.pattern) { t += iv / 1000; beep(t, { freq: 880 }); }
  }

  clearTimer();
  timer = setTimeout(() => { if (isActive()) enterTap(gs); }, gd.listenDuration + 350);
  if (document.getElementById('gameArea')) engine.renderGame();
}

function enterTap(gs) {
  const gd = gs.gd;
  gd.phase = 'tap';
  gd.phaseStart = Date.now();
  gd.taps = [];
  clearTimer();
  timer = setTimeout(() => { if (isActive()) evaluate(gs); }, NO_INPUT_MS);
  engine.renderGame();
}

/** Ein Schlag – bewusst OHNE Neuaufbau des Spielbereichs. */
function registerTap(gs) {
  const gd = gs.gd;
  if (!gd || gd.phase !== 'tap') return;
  gd.taps.push(performance.now());
  beepNow({ freq: 523, dur: 0.05, gain: 0.22 });

  // Nur den Punkte-Zähler anfassen. Ein voller Neuaufbau würde die
  // Tippfläche zwischen den Schlägen austauschen und Eingaben verschlucken.
  const dots = document.getElementById('rhyDots');
  if (dots) dots.textContent = '●'.repeat(gd.taps.length);

  clearTimer();
  timer = setTimeout(() => { if (isActive()) evaluate(gs); }, SILENCE_MS);
}

function evaluate(gs) {
  const gd = gs.gd;
  clearTimer();
  const res = evaluateRhythm(gd.pattern, gd.taps);
  const level = gd.level;

  gd.attempts = (gd.attempts || 0) + 1;
  gd.bestLevel = nextBestLevel(gd.bestLevel || 0, level, res.ok);

  if (res.ok) {
    gd.solved = (gd.solved || 0) + 1;
    gd.level = Math.min(gd.level + 1, MAX_N);
    gd.feedback = pictogram('✅');
  } else {
    gd.level = Math.max(MIN_N, gd.level - 1);
    // Wortlose Rückmeldung: das Muster als Punktreihe, Abstände maßstäblich
    gd.feedback = pictogram(res.reason === 'anzahl' && gd.taps.length === 0 ? '🔇' : '❌') +
      `<div style="margin-top:16px;opacity:.9">${patternStrip(gd.pattern)}</div>`;
  }

  gd.phase = 'feedback';
  publish(gs);
  engine.renderGame();
  clearTimer();
  timer = setTimeout(() => { if (isActive()) enterListen(gs); }, res.ok ? 1200 : 2600);
}

/** Muster als Punkte mit maßstäblichen Abständen – zeigt den Rhythmus wortlos. */
function patternStrip(pattern) {
  const total = pattern.reduce((a, b) => a + b, 0) || 1;
  const w = 260;
  let x = 0;
  const dots = [`<circle cx="6" cy="12" r="6" fill="var(--primary)"/>`];
  for (const iv of pattern) {
    x += (iv / total) * (w - 12);
    dots.push(`<circle cx="${(6 + x).toFixed(1)}" cy="12" r="6" fill="var(--primary)"/>`);
  }
  return `<svg width="${w}" height="24" viewBox="0 0 ${w} 24" style="display:block;margin:0 auto">
    <line x1="6" y1="12" x2="${w - 6}" y2="12" stroke="#E0DDF5" stroke-width="2"/>
    ${dots.join('')}
  </svg>`;
}

function publish(gs) {
  const gd = gs.gd;
  const best = gd.bestLevel || 0;
  gd.currentScore = computeScore(best);
  gs.percent = gd.currentScore;
  gs.level = best;
  gs.attempts = gd.attempts || 0;
  gs.solved = gd.solved || 0;
  gs.total = gd.attempts || 0;
  gs.score = gd.solved || 0;
}

// ─── Eingabe: Leertaste und Tippfläche ────────────────────────────────
// Die Zuhörer hängen am Dokument, nicht an einem Element im Spielbereich:
// dessen innerHTML wird bei jedem Phasenwechsel ersetzt, Element-Zuhörer
// wären danach weg.
function attachInput(gs) {
  if (listening) return;
  listening = true;

  onKey = e => {
    if (e.code !== 'Space' && e.key !== ' ') return;
    if (!isActive()) return;
    e.preventDefault();          // sonst scrollt die Seite
    if (e.repeat) return;        // gedrückt gehalten ist kein neuer Schlag
    registerTap(gs);
  };

  const evName = (typeof window !== 'undefined' && window.PointerEvent) ? 'pointerdown' : 'mousedown';
  onTap = e => {
    if (!isActive()) return;
    const pad = e.target && e.target.closest && e.target.closest('#rhyPad');
    if (!pad) return;
    e.preventDefault();
    registerTap(gs);
  };

  document.addEventListener('keydown', onKey);
  document.addEventListener(evName, onTap);
  onTap._name = evName;
}

function detachInput() {
  if (!listening) return;
  listening = false;
  if (onKey) document.removeEventListener('keydown', onKey);
  if (onTap) document.removeEventListener(onTap._name || 'pointerdown', onTap);
  onKey = onTap = null;
}

// ─── Modul-Interface ──────────────────────────────────────────────────
export function init(gs) {
  const gd = gs.gd || {};
  gs.gd = gd;
  if (!gd.level) gd.level = MIN_N;
  gd.bestLevel = gd.bestLevel ?? 0;
  gd.attempts = gd.attempts || 0;
  gd.solved = gd.solved || 0;
  gd._ready = true;
  audio();                    // Ton freischalten – wir kommen aus einem Klick
  attachInput(gs);
  enterListen(gs);
  return gs;
}

export function dispose(gs) {
  clearTimer();
  detachInput();
  if (gs && gs.gd) gs.gd._ready = false;
}

export function render(gs) {
  let gd = gs.gd;
  if (!gd || !gd._ready) { init(gs); gd = gs.gd; }
  const elapsed = Date.now() - gd.phaseStart;

  if (gd.phase === 'listen') {
    const stumm = !audioReady();
    return `<div data-phase="listen" style="text-align:center;width:100%">
      ${bar(gd.listenDuration, elapsed)}
      <div style="font-size:4.4em;line-height:1.1">${stumm ? '🔇' : '👂'}</div>
      ${stumm ? mutedHint() : ''}
      ${stopButton()}
      ${starRow(gd.bestLevel)}
    </div>`;
  }

  if (gd.phase === 'tap') {
    return `<div data-phase="tap" style="text-align:center;width:100%">
      ${bar(NO_INPUT_MS, elapsed)}
      <div id="rhyPad" class="pick-target" role="button" tabindex="0"
           aria-label="Hier klopfen"
           style="width:190px;height:190px;border-radius:50%;margin:0 auto;
                  background:var(--primary);color:#fff;display:flex;
                  align-items:center;justify-content:center;font-size:4em;
                  cursor:pointer;box-shadow:var(--shadow)">👆</div>
      <div id="rhyDots" style="min-height:26px;margin-top:12px;font-size:1.3em;
           color:var(--primary);letter-spacing:3px"></div>
      ${stopButton()}
      ${starRow(gd.bestLevel)}
    </div>`;
  }

  if (gd.phase === 'feedback') {
    return `<div data-phase="feedback" style="text-align:center;width:100%">
      ${gd.feedback || ''}
      ${starRow(gd.bestLevel)}
    </div>`;
  }

  const best = gd.bestLevel || 0;
  return `<div data-phase="done" style="text-align:center;width:100%">
    <div style="font-size:3.4em;line-height:1.1">🏁</div>
    <div style="font-size:2.6em;font-weight:800;color:var(--primary)">${computeScore(best)}%</div>
    <div style="font-size:.9em;color:var(--text-light);margin-bottom:16px">
      Bestes Niveau ${best || '–'} • ${gd.solved || 0} von ${gd.attempts || 0} gelöst
    </div>
    <button class="btn btn-primary btn-small" onclick="G('restart')">🔁</button>
    <button class="btn btn-secondary btn-small" onclick="navigateTo('menu')">🏠</button>
  </div>`;
}

export const actions = {
  stop(gs) {
    clearTimer();
    gs.gd.phase = 'done';
    publish(gs);
  },
  restart(gs) {
    clearTimer();
    gs.gd = { level: MIN_N };
    gs.score = 0; gs.total = 0; gs.percent = 0; gs.level = 0;
    init(gs);
    return false;
  },
  /** Nur für Tests: einen Schlag ohne echtes Eingabegerät auslösen. */
  tap(gs) {
    registerTap(gs);
    return false;
  }
};

export const scoring = 'percent';
export const chrome = 'minimal';
export const instruction = {
  de: 'Du hörst ein Klopfmuster. Klopfe es genauso nach – mit der <b>Leertaste</b> oder mit dem Finger auf den großen Kreis. Wichtig ist der Rhythmus, nicht die Geschwindigkeit. Hör auf zu klopfen, wenn du fertig bist.',
  ru: 'Ты услышишь ритм. Простучи его так же — <b>пробелом</b> или пальцем по большому кругу. Важен ритм, а не скорость. Закончил — просто перестань стучать.',
  en: 'You will hear a tapping pattern. Tap it back the same way – with the <b>space bar</b> or your finger on the big circle. The rhythm matters, not the speed. When you are done, just stop tapping.'
};
