/**
 * Smoke-Test ohne Browser.
 *
 * Fährt jedes Spielmodul durch init → render → Actions → dispose und prüft,
 * dass dabei HTML herauskommt und nichts wirft. Das fängt genau die Fehler,
 * die man sonst erst beim Anklicken des 23. Moduls bemerkt: Tippfehler in
 * Feldnamen, vergessene Exporte, kaputte Templates.
 *
 * Zusätzlich: Registry ↔ modules.js ↔ Faktorenmodell auf Konsistenz prüfen.
 */

// ─── Minimale Browser-Stubs ───────────────────────────────────────────
const store = {};
globalThis.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};

const fakeEl = () => ({
  innerHTML: '', textContent: '', style: {},
  classList: { add() {}, remove() {} },
  appendChild() {}
});

globalThis.document = {
  documentElement: { lang: 'de' },
  getElementById: () => fakeEl(),
  querySelectorAll: () => [],
  createElement: () => fakeEl(),
  addEventListener() {},
  removeEventListener() {},
  body: { appendChild() {} }
};

globalThis.window = globalThis;
globalThis.scrollTo = () => {};
globalThis.indexedDB = { open: () => ({}) };   // Promise bleibt hängen, das ist ok
globalThis.structuredClone = globalThis.structuredClone || (o => JSON.parse(JSON.stringify(o)));

// ─── Testlauf ─────────────────────────────────────────────────────────
const { registry } = await import('../src/games/index.js');
const { engine } = await import('../src/core/engine.js');
const { modules } = await import('../src/data/modules.js');
const { cognitiveFactors } = await import('../src/data/cognitive-factors.js');

const problems = [];
const ok = [];

function check(id, cond, msg) {
  if (!cond) problems.push(`${id}: ${msg}`);
  return cond;
}

function html(mod, gs, id, phase) {
  const out = mod.render(gs);
  check(id, typeof out === 'string', `render() in Phase "${phase}" lieferte ${typeof out} statt String`);
  check(id, !/undefined|\[object Object\]|NaN/.test(out),
        `render() in Phase "${phase}" enthält undefined/NaN/[object Object]`);
  return out;
}

for (const [id, load] of Object.entries(registry)) {
  let mod;
  try { mod = await load(); }
  catch (e) { problems.push(`${id}: Modul lädt nicht – ${e.message}`); continue; }

  for (const fn of ['init', 'render', 'dispose']) {
    check(id, typeof mod[fn] === 'function', `Export ${fn}() fehlt`);
  }
  check(id, mod.actions && typeof mod.actions === 'object', 'Export actions fehlt');
  check(id, mod.scoring === 'count' || mod.scoring === 'percent', `scoring ist "${mod.scoring}"`);
  if (typeof mod.init !== 'function' || typeof mod.render !== 'function') continue;

  const gs = { moduleId: id, step: 'game', round: 1, score: 0, total: 0, gd: {} };
  engine.activeGame = { id, mod };
  engine.gameState = gs;

  try {
    mod.init(gs);
    check(id, gs.gd && gs.gd._ready === true, 'init() setzt gd._ready nicht');

    // ── Adaptive Span-Tests (Auswahl aus Optionen) ──
    if (mod.actions.pick) {
      html(mod, gs, id, 'show');
      gs.gd.phase = 'wait'; gs.gd.phaseStart = Date.now();
      html(mod, gs, id, 'wait');

      // Antwortphase direkt betreten und die Sequenz korrekt eingeben
      gs.gd.phase = 'answer'; gs.gd.phaseStart = Date.now(); gs.gd.userAnswer = [];
      html(mod, gs, id, 'answer');
      const seq = [...gs.gd.sequence];
      for (const item of seq) mod.actions.pick(gs, item);
      check(id, gs.gd.userAnswer.length === seq.length,
            `pick() nahm nur ${gs.gd.userAnswer.length} von ${seq.length} Elementen an`);

      // Rückgängig machen und zurücksetzen
      mod.actions.remove(gs, 0);
      mod.actions.reset(gs);
      check(id, gs.gd.userAnswer.length === 0, 'reset() leert die Antwort nicht');

      gs.gd.phase = 'feedback'; gs.gd.feedback = '<i>x</i>';
      html(mod, gs, id, 'feedback');
      mod.actions.stop(gs);
      check(id, gs.percent !== undefined, 'stop() schreibt keinen Prozentwert nach gs');
      html(mod, gs, id, 'done');

    // ── Rhythmus: Eingabe über Zeitpunkte statt Auswahl ──
    } else if (mod.actions.tap) {
      html(mod, gs, id, 'listen');
      gs.gd.phase = 'tap'; gs.gd.phaseStart = Date.now();
      html(mod, gs, id, 'tap');
      mod.actions.tap(gs); mod.actions.tap(gs); mod.actions.tap(gs);
      check(id, gs.gd.taps.length === 3, `tap() zählte ${gs.gd.taps.length} statt 3 Schläge`);
      check(id, gs.gd.pattern.length === gs.gd.level - 1,
            `Muster hat ${gs.gd.pattern.length} Abstände bei Niveau ${gs.gd.level}`);
      gs.gd.phase = 'feedback'; gs.gd.feedback = '<i>x</i>';
      html(mod, gs, id, 'feedback');
      mod.actions.stop(gs);
      check(id, gs.percent !== undefined, 'stop() schreibt keinen Prozentwert nach gs');
      html(mod, gs, id, 'done');

    // ── Auswahl-Aufgaben ──
    } else if (mod.actions.choose) {
      for (let round = 0; round < 12; round++) {
        if (gs.gd.phase === 'study') { html(mod, gs, id, 'study'); mod.actions.skipStudy(gs); }
        html(mod, gs, id, 'ask');
        const r = gs.gd.round;
        check(id, Number.isInteger(r.correct) && r.correct >= 0 && r.correct < r.options.length,
              `correct=${r.correct} liegt außerhalb von ${r.options.length} Optionen`);
        // abwechselnd richtig und falsch antworten, damit beide Zweige laufen
        mod.actions.choose(gs, round % 2 ? r.correct : (r.correct + 1) % r.options.length);
        html(mod, gs, id, 'feedback');
        mod.actions.next(gs);
      }
      check(id, gs.total === 12, `gs.total ist ${gs.total}, erwartet 12`);

    // ── Tutor-Module ──
    } else if (mod.actions.rate) {
      for (let round = 0; round < 8; round++) {
        html(mod, gs, id, 'task');
        mod.actions.rate(gs, round % 3);
        html(mod, gs, id, 'rated');
        mod.actions.next(gs);
      }
      check(id, gs.total === 8, `gs.total ist ${gs.total}, erwartet 8`);

    // ── Sudoku und sonstige Eigenbauten ──
    } else if (mod.actions.selectCell) {
      for (let puzzle = 0; puzzle < 4; puzzle++) {
        html(mod, gs, id, 'play');
        const p = gs.gd.puzzle;
        for (let r = 0; r < p.n; r++) {
          for (let c = 0; c < p.n; c++) {
            if (p.given[r][c] === null) {
              mod.actions.selectCell(gs, r, c);
              mod.actions.placeSymbol(gs, p.solution[r][c]);
            }
          }
        }
        check(id, p.grid.flat().every(v => v !== null), 'Gitter wurde nicht vollständig gefüllt');
        mod.actions.check(gs);
        check(id, gs.gd.phase === 'done',
              `korrekt gefülltes Gitter wurde nicht als gelöst erkannt (wrong=${gs.gd.wrongCells ? gs.gd.wrongCells.size : 0})`);
        html(mod, gs, id, 'done');
        mod.actions.nextPuzzle(gs);
      }

    } else if (mod.actions.flip) {
      html(mod, gs, id, 'play');
      // alle Paare aufdecken
      const seen = new Map();
      gs.gd.cards.forEach((card, i) => {
        if (seen.has(card.emoji)) {
          mod.actions.flip(gs, seen.get(card.emoji));
          mod.actions.flip(gs, i);
        } else seen.set(card.emoji, i);
      });
      check(id, gs.gd.cards.every(c => c.matched), 'nicht alle Paare wurden erkannt');
      html(mod, gs, id, 'done');
      mod.actions.nextBoard(gs);
      html(mod, gs, id, 'next board');

    } else {
      html(mod, gs, id, 'stub');
    }

    mod.dispose(gs);
    check(id, gs.gd._ready === false, 'dispose() setzt _ready nicht zurück');
    ok.push(id);
  } catch (e) {
    problems.push(`${id}: ${e.message}\n      ${(e.stack || '').split('\n')[1] || ''}`);
  } finally {
    engine.activeGame = null;
  }
}

// ─── Bewertungsregel für das beste Niveau ─────────────────────────────
// Gewertet wird das höchste Niveau, das zuletzt fehlerfrei stand. Ein Fehler
// auf gleicher oder niedrigerer Stufe entwertet den Bestwert.
{
  const { nextBestLevel } = await import('../src/core/adaptive.js');
  const cases = [
    // [best, level, correct, erwartet, Beschreibung]
    [0, 2, true,  2, 'erste Lösung setzt den Bestwert'],
    [2, 3, true,  3, 'höhere Lösung hebt den Bestwert'],
    [6, 5, true,  6, 'niedrigere Lösung senkt nichts'],
    [6, 7, false, 6, 'Fehler oberhalb des Bestwerts ändert nichts'],
    [6, 6, false, 5, 'Fehler auf Bestwert-Höhe senkt um eins'],
    [6, 5, false, 4, 'Fehler unterhalb senkt auf Stufe minus eins'],
    [0, 2, false, 0, 'Fehler ohne Bestwert bleibt bei 0'],
    [2, 2, false, 1, 'Fehler auf der untersten Stufe'],
    [1, 2, false, 1, 'Fehler oberhalb eines niedrigen Bestwerts']
  ];
  for (const [best, level, correct, want, desc] of cases) {
    const got = nextBestLevel(best, level, correct);
    check('nextBestLevel', got === want,
          `${desc}: (best=${best}, N=${level}, ${correct ? 'richtig' : 'falsch'}) → ${got}, erwartet ${want}`);
  }

  // Die vom Nutzer genannte Abfolge am Stück
  let b = 0;
  b = nextBestLevel(b, 6, true);   // 6 richtig
  check('nextBestLevel', b === 6, `nach „6 richtig" ist der Bestwert ${b}, erwartet 6`);
  b = nextBestLevel(b, 7, false);  // 7 falsch
  check('nextBestLevel', b === 6, `nach „7 falsch" ist der Bestwert ${b}, erwartet 6`);
  b = nextBestLevel(b, 6, false);  // 6 falsch
  check('nextBestLevel', b === 5, `nach „6 falsch" ist der Bestwert ${b}, erwartet 5`);
}

// ─── Rhythmus-Auswertung ──────────────────────────────────────────────
// Bewertet werden die Verhältnisse der Abstände, nicht ihre absolute Länge.
{
  const { evaluateRhythm } = await import('../src/games/seq-rhythmus.js');
  const P = [400, 800, 400];               // Muster: kurz – lang – kurz
  const von = (t0, ...iv) => { const a = [t0]; for (const x of iv) a.push(a[a.length-1] + x); return a; };

  const faelle = [
    ['exakt nachgeklopft',        von(0, 400, 800, 400),  true],
    ['gleichmäßig halb so schnell', von(0, 800, 1600, 800), true],
    ['gleichmäßig schneller',      von(0, 260, 520, 260),  true],
    ['leicht ungenau, im Rahmen',  von(0, 440, 760, 430),  true],
    ['Rhythmus vertauscht',        von(0, 800, 400, 400),  false],
    ['alles gleich lang',          von(0, 530, 530, 530),  false],
    ['ein Schlag zu wenig',        von(0, 400, 800),       false],
    ['ein Schlag zu viel',         von(0, 400, 800, 400, 400), false],
    ['gar nichts geklopft',        [],                     false],
    ['absurd langsam',             von(0, 3000, 6000, 3000), false]
  ];
  for (const [desc, taps, want] of faelle) {
    const r = evaluateRhythm(P, taps);
    check('evaluateRhythm', r.ok === want,
          `${desc}: ok=${r.ok}${r.reason ? ' (' + r.reason + ')' : ''}, erwartet ${want}`);
  }
}

// ─── Konsistenz der Registrierungen ───────────────────────────────────
for (const m of modules) {
  check('modules.js', registry[m.id], `Modul "${m.id}" hat keinen Registry-Eintrag`);
}
for (const id of Object.keys(registry)) {
  check('registry', modules.some(m => m.id === id), `Registry-Eintrag "${id}" fehlt in modules.js`);
}
for (const [fid, f] of Object.entries(cognitiveFactors)) {
  for (const mid of f.modules) {
    check('cognitive-factors.js', modules.some(m => m.id === mid),
          `Faktor ${fid} verweist auf unbekanntes Modul "${mid}"`);
  }
}

// ─── Ergebnis ─────────────────────────────────────────────────────────
console.log(`\n✓ ${ok.length}/${Object.keys(registry).length} Module durchlaufen`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} Problem(e):\n`);
  problems.forEach(p => console.error('   • ' + p));
  process.exit(1);
}
console.log('✓ Registry, modules.js und Faktorenmodell sind konsistent\n');
process.exit(0);
