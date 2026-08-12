/**
 * Adaptive Span-Test-Engine
 * ─────────────────────────
 * Extrahiert aus seq-zahlenfolgen.js, damit die Merkspannen-Tests
 * (Zahlen, Handzeichen, Koffer packen, Gesichter, Wörter) sich eine
 * Ablauflogik teilen statt sie je Datei zu kopieren.
 *
 * Ablauf pro Durchgang:
 *   show     N Items zeigen           N × f Sekunden
 *   wait     feste Pause              PAUSE_S Sekunden
 *   answer   Eingabe per Klick        N × answerFactor × f Sekunden
 *   feedback kurze Rückmeldung        1,2 s (richtig) / 2,5 s (falsch)
 *
 * Richtig → N++, falsch/Timeout → N--  (nie unter minN).
 *
 * Gestaltungsprinzip des Spielbildschirms: **nur die Aufgabe**.
 * Keine Anweisung, kein Niveau, keine Prozente, keine Sekundenzahl. Was das
 * Kind zum Spielen nicht braucht, lenkt es ab und verfälscht die Messung –
 * eine sichtbare Niveauanzeige macht aus dem Test einen Wettbewerb. Die
 * Anleitung steht einmal auf dem Startbildschirm, das Ergebnis am Ende.
 * Rückmeldung ist ein Piktogramm, kein Satz. Einzige Ausnahme: die
 * Sternenreihe ganz unten zeigt das beste Niveau, wortlos.
 *
 * Zwei Dinge sind hier bewusst anders gelöst als in der ersten Fassung:
 *
 *  1. Phasenwechsel hängen an eigenen Timern, nicht am Render-Aufruf, und
 *     JEDER Übergang zeichnet selbst neu. Fehlt das an einer Stelle, läuft
 *     die Phase unsichtbar ab.
 *  2. Während einer Phase wird gar nicht neu gezeichnet. Ablaufbalken und
 *     Pausenring sind reine CSS-Animationen. Ein Neuaufbau zwischen mousedown
 *     und mouseup verschluckt sonst den Klick.
 */
import { engine } from './engine.js';
import { esc } from './html.js';
import { bar, ring, stopButton, starRow, pictogram } from './shell.js';
import * as settings from './settings.js';

/** testId → { deadline } */
const RUNNING = new Map();

export const DEFAULT_SCORE_MAP = { 2: 0, 3: 20, 4: 30, 5: 50, 6: 75, 7: 90, 8: 100, 9: 120, 10: 130 };
export const DEFAULT_BONUS = 150;
export const PAUSE_S = 1;

/**
 * Fortschreibung des besten Niveaus nach einem Durchgang.
 *
 * Gewertet wird das höchste Niveau, das zuletzt fehlerfrei stand. Ein Fehler
 * auf gleicher oder niedrigerer Stufe entwertet den bisherigen Bestwert –
 * denn wer 6 nicht mehr schafft, kann 6 offenbar nicht sicher. Ein Fehler
 * oberhalb des Bestwerts ändert nichts, das war nur ein Versuch nach oben.
 *
 *   richtig auf L        → best = max(best, L)
 *   falsch  auf L > best → best bleibt
 *   falsch  auf L ≤ best → best = L − 1
 *
 * Beispiel: 6 richtig → 6 · 7 falsch → 6 · 6 falsch → 5
 */
export function nextBestLevel(best, level, correct) {
  if (correct) return Math.max(best, level);
  if (level > best) return best;
  return Math.max(0, level - 1);
}

// ─── Tempo ────────────────────────────────────────────────────────────
// Die Zeiten kommen aus den zentralen Einstellungen (⚙️), nicht aus
// Konstanten in jedem Modul. Der modul-eigene `factor` wirkt dabei relativ:
// Bei der Voreinstellung 2 s ergibt er genau seinen eigenen Wert, und wer
// global langsamer stellt, verlangsamt alle Module im selben Verhältnis.
const STANDARD_TEMPO = 2;

export function getFactor(id, fallback = STANDARD_TEMPO) {
  return settings.get('tempo') * (fallback / STANDARD_TEMPO);
}

export function setFactor(id, val) {
  return settings.set('tempo', val);
}

// ─── Timerverwaltung ──────────────────────────────────────────────────
function stopTimers(id) {
  const s = RUNNING.get(id);
  if (!s) return;
  clearTimeout(s.deadline);
  RUNNING.delete(id);
}

/**
 * Nach `ms` `fn` ausführen. Ist der Test nicht mehr das aktive Spiel, passiert
 * nichts – die Absicherung gegen Timer, die einen alten gameState mutieren.
 * Während der Wartezeit läuft kein JavaScript: die Anzeige ist CSS.
 */
function schedule(id, ms, fn) {
  stopTimers(id);
  const s = {};
  s.deadline = setTimeout(() => {
    RUNNING.delete(id);
    if (!isActive(id)) return;
    fn();
  }, ms);
  RUNNING.set(id, s);
}

function isActive(id) {
  return !!(engine.activeGame && engine.activeGame.id === id);
}

// ─── Test-Fabrik ──────────────────────────────────────────────────────
/**
 * @param {object} cfg
 *   id            Modul-ID (muss zur Registry passen)
 *   minN/maxN     Niveaugrenzen
 *   levelCap      Obergrenze fürs Hochstufen (default maxN + 2)
 *   scoreMap      { niveau: prozent }
 *   bonus         Prozentwert oberhalb von maxN
 *   factor        Standard-Sekunden pro Item
 *   answerFactor  Antwortzeit = level × answerFactor × f
 *   pauseS        Pause zwischen Zeigen und Antworten
 *   instruction   Einzeiler für den Startbildschirm (nicht im Spiel!)
 *   genItems(level, gd)   → Ziel-Sequenz (Array)
 *   genOptions(gd)        → Auswahlangebot (Array)
 *   renderShow(gd)        → HTML der Zeigephase, ohne Text
 *   renderAnswer(gd, ctx) → HTML der Antwortphase, ohne Text
 *   renderSolution(gd)    → Lösung als Bildzeile für die Fehlermeldung
 *   labelOf(item)         → Textfassung, nur als Rückfallebene
 */
export function createSpanTest(cfg) {
  const id = cfg.id;
  const minN = cfg.minN ?? 2;
  const maxN = cfg.maxN ?? 10;
  const scoreMap = cfg.scoreMap || DEFAULT_SCORE_MAP;
  const bonus = cfg.bonus ?? DEFAULT_BONUS;
  // Modulwerte wirken relativ zu den globalen Einstellungen
  const answerFactor = () => settings.get('answerFactor') * ((cfg.answerFactor ?? 2) / 2);
  const pauseS = () => (cfg.pauseS !== undefined ? cfg.pauseS : settings.get('pause'));
  const labelOf = cfg.labelOf || (x => String(x));
  const levelCap = cfg.levelCap ?? (maxN + 2);

  const f = () => getFactor(id, cfg.factor ?? STANDARD_TEMPO);

  function computeScore(level) {
    if (level > maxN) return bonus;
    return scoreMap[level] || 0;
  }

  // ─── Phasenübergänge ────────────────────────────────
  // Jeder Übergang zeichnet selbst neu. Fehlt das an einer Stelle, läuft die
  // Phase unsichtbar ab: der Bildschirm zeigt weiter die vorige Phase, die
  // Uhr läuft aber – und am Ende wird eine nie sichtbare Folge abgefragt.
  function enterShow(gs) {
    const gd = gs.gd;
    gd.sequence = cfg.genItems(gd.level, gd);
    gd.options = cfg.genOptions ? cfg.genOptions(gd) : null;
    gd.userAnswer = [];
    gd.phase = 'show';
    gd.phaseStart = Date.now();
    // showPadMs: Zuschlag für Module, die vor der Aufgabe noch etwas
    // unterbringen müssen – etwa eine gesprochene Ansage.
    gd.showDuration = Math.round(gd.sequence.length * f() * 1000) + (cfg.showPadMs || 0);
    gd.answerDuration = Math.round(gd.sequence.length * answerFactor() * f() * 1000);
    schedule(id, gd.showDuration, () => enterWait(gs));
    // Beim allerersten Durchgang aus init() heraus gibt es den Spielbereich
    // noch nicht – dann rendert views.js gleich im Anschluss.
    if (document.getElementById('gameArea')) engine.renderGame();
    // Nach dem Zeichnen: hier gehören Seiteneffekte der Zeigephase hin, etwa
    // eine Sprachansage. In renderShow() wären sie falsch aufgehoben – render
    // kann mehrfach laufen, die Ansage käme dann doppelt.
    if (cfg.onShow) cfg.onShow(gd, gs);
  }

  function enterWait(gs) {
    const gd = gs.gd;
    gd.phase = 'wait';
    gd.phaseStart = Date.now();
    schedule(id, pauseS() * 1000, () => enterAnswer(gs));
    engine.renderGame();
  }

  function enterAnswer(gs) {
    const gd = gs.gd;
    gd.phase = 'answer';
    gd.phaseStart = Date.now();
    gd.userAnswer = [];
    schedule(id, gd.answerDuration, () => finish(gs, false, true));
    engine.renderGame();
  }

  /** Auswertung. `timeout` unterscheidet nur das Piktogramm. */
  function finish(gs, correct, timeout) {
    const gd = gs.gd;
    stopTimers(id);
    const solvedLevel = gd.level;

    gd.attempts = (gd.attempts || 0) + 1;
    gd.bestLevel = nextBestLevel(gd.bestLevel || 0, solvedLevel, correct);

    if (correct) {
      gd.solved = (gd.solved || 0) + 1;
      gd.level = Math.min(gd.level + 1, levelCap);
      gd.feedback = pictogram('✅');
    } else {
      gd.level = Math.max(minN, gd.level - 1);
      // Die richtige Lösung wird gezeigt – aber als Bild, nicht als Satz.
      gd.feedback = pictogram(timeout ? '⏰' : '❌') +
        `<div style="margin-top:14px;opacity:.85">${solution(gd)}</div>`;
    }

    gd.phase = 'feedback';
    publish(gs);
    engine.renderGame();
    schedule(id, Math.round((correct ? settings.get('feedbackOk') : settings.get('feedbackWrong')) * 1000),
             () => enterShow(gs));
  }

  function solution(gd) {
    if (cfg.renderSolution) return cfg.renderSolution(gd);
    return `<div style="font-size:1.1em;font-weight:700">${esc(gd.sequence.map(labelOf).join(' → '))}</div>`;
  }

  /** Ergebnis in den gameState schreiben – von dort holt es die Persistenz. */
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

  function stop(gs) {
    stopTimers(id);
    gs.gd.phase = 'done';
    publish(gs);
  }

  // ─── Öffentliches Modul-Interface ───────────────────
  function init(gs) {
    const gd = gs.gd || {};
    gs.gd = gd;
    if (!gd.level) gd.level = cfg.startLevel ?? minN;
    gd.bestLevel = gd.bestLevel ?? 0;
    gd.attempts = gd.attempts || 0;
    gd.solved = gd.solved || 0;
    gd._ready = true;
    if (cfg.onInit) cfg.onInit(gd, gs);
    enterShow(gs);
    return gs;
  }

  function dispose(gs) {
    stopTimers(id);
    if (gs && gs.gd) gs.gd._ready = false;
  }

  function render(gs) {
    let gd = gs.gd;
    if (!gd || !gd._ready) { init(gs); gd = gs.gd; }

    const elapsed = Date.now() - gd.phaseStart;

    if (gd.phase === 'show') {
      return `<div data-phase="show" style="text-align:center;width:100%">
        ${bar(gd.showDuration, elapsed)}
        ${cfg.renderShow(gd)}
        ${stopButton()}
        ${starRow(gd.bestLevel)}
      </div>`;
    }

    if (gd.phase === 'wait') {
      return `<div data-phase="wait" style="text-align:center;width:100%">
        ${ring(pauseS() * 1000, elapsed)}
        ${stopButton()}
        ${starRow(gd.bestLevel)}
      </div>`;
    }

    if (gd.phase === 'answer') {
      const selected = gd.userAnswer || [];
      const slotsLeft = Math.max(0, gd.sequence.length - selected.length);
      return `<div data-phase="answer" style="width:100%;max-width:520px">
        ${bar(gd.answerDuration, elapsed)}
        ${cfg.renderAnswer(gd, { selected, slotsLeft, level: gd.sequence.length })}
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

    // ─── done: hier ist Text richtig, das ist das Ergebnis ───
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

  // ─── Actions ────────────────────────────────────────
  const actions = {
    pick(gs, item) {
      const gd = gs.gd;
      if (!gd || gd.phase !== 'answer') return false;
      if (gd.userAnswer.length >= gd.sequence.length) return false;
      // Jede Eingabe wird angenommen, auch eine Wiederholung. Geprüft wird
      // erst, wenn die Reihe voll ist. Ob eine Aufgabe überhaupt
      // Wiederholungen enthält, entscheidet genItems im jeweiligen Spiel –
      // eine Eingabe stillschweigend zu verweigern sähe für das Kind wie ein
      // defekter Knopf aus.
      gd.userAnswer.push(item);
      if (gd.userAnswer.length === gd.sequence.length) {
        // Kurz stehen lassen, damit das Kind die letzte Eingabe noch sieht
        const correct = matches(gd);
        schedule(id, 350, () => finish(gs, correct, false));
      }
    },

    remove(gs, idx) {
      const gd = gs.gd;
      if (!gd || gd.phase !== 'answer') return false;
      gd.userAnswer.splice(idx, 1);
    },

    reset(gs) {
      const gd = gs.gd;
      if (!gd || gd.phase !== 'answer') return false;
      gd.userAnswer = [];
    },

    stop(gs) {
      stop(gs);
    },

    restart(gs) {
      gs.gd = { level: minN };
      gs.score = 0; gs.total = 0; gs.percent = 0; gs.level = 0;
      init(gs);
      return false;
    }
  };

  function same(a, b) {
    return typeof a === 'object' ? JSON.stringify(a) === JSON.stringify(b) : a === b;
  }

  function matches(gd) {
    if (cfg.equals) return cfg.equals(gd.userAnswer, gd.sequence, gd);
    if (gd.userAnswer.length !== gd.sequence.length) return false;
    return gd.userAnswer.every((x, i) => same(x, gd.sequence[i]));
  }

  return {
    init, render, dispose, actions,
    scoring: 'percent',
    chrome: 'minimal',              // views.js blendet Kopfzeile und Punktestand aus
    instruction: cfg.instruction || '',
    computeScore,
    getFactor: () => f(),
    setFactor: v => setFactor(id, v)
  };
}
