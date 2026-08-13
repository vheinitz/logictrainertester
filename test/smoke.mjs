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

// ─── Koffer packen bleibt kumulativ ───────────────────────────────────
// Der Koffer darf nur wachsen und schrumpfen, nie neu gewürfelt werden.
// Vorher wurde nach jedem Fehler ein komplett neuer Zufallskoffer gepackt –
// das Spiel fühlte sich an, als hätte es von vorn begonnen.
{
  const mod = await registry['seq-koffer-packen']();
  const gs = { moduleId: 'seq-koffer-packen', step: 'game', gd: {} };
  engine.activeGame = { id: 'seq-koffer-packen', mod };
  engine.gameState = gs;
  mod.init(gs);

  // Niveaus durchfahren: hoch, hoch, Fehler (runter), wieder hoch, hoch.
  // init() erzeugt jeweils eine neue Zeigephase auf gs.gd.level.
  const folgen = [];
  for (const lvl of [2, 3, 4, 3, 4, 5]) {
    gs.gd.level = lvl;
    gs.gd._ready = false;
    mod.init(gs);
    folgen.push([...gs.gd.sequence]);
  }

  const [a2, a3, a4, b3, b4, b5] = folgen;
  check('koffer', a3.slice(0, 2).join() === a2.join(),
        `beim Wachsen 2→3 änderten sich die ersten Dinge: ${a2} → ${a3}`);
  check('koffer', a4.slice(0, 3).join() === a3.join(),
        `beim Wachsen 3→4 änderten sich die ersten Dinge: ${a3} → ${a4}`);
  check('koffer', b3.join() === a4.slice(0, 3).join(),
        `nach dem Fehler (4→3) wurde der Koffer neu gewürfelt: ${a4} → ${b3}`);
  check('koffer', b4.slice(0, 3).join() === b3.join(),
        `beim erneuten Wachsen 3→4 änderten sich die ersten Dinge: ${b3} → ${b4}`);
  check('koffer', new Set(b5).size === b5.length,
        `der Koffer enthält doppelte Dinge: ${b5}`);
  check('koffer', b5.length === 5, `Niveau 5 zeigt ${b5.length} Dinge`);

  mod.dispose(gs);
  engine.activeGame = null;
}

// ─── Zwei Zahlenfolgen-Varianten, getrennt zugeordnet ─────────────────
// Die Ansage-Variante misst Hören, die Bildschirm-Variante Sehen. Stünde die
// Bildschirm-Variante bei den auditiven Faktoren, wäre das kognitive Profil
// falsch: ein Kind mit Hörproblem sähe dort einen guten Wert.
{
  const { cognitiveFactors: KF } = await import('../src/data/cognitive-factors.js');
  const inFaktor = (kf, id) => KF[kf].modules.includes(id);
  const auditiv = Object.entries(KF)
    .filter(([, f]) => f.category === 'auditive_wahrnehmung')
    .map(([id]) => id);

  for (const kf of auditiv) {
    check('faktoren', !inFaktor(kf, 'seq-zahlenfolgen'),
          `${kf} (${KF[kf].de}) führt die Bildschirm-Variante als auditiv`);
  }
  check('faktoren', inFaktor('KF004', 'seq-zahlenfolgen-audio'),
        'Die Ansage-Variante fehlt beim akustischen Kurzzeitgedächtnis');
  check('faktoren', inFaktor('KF086', 'seq-zahlenfolgen'),
        'Die Bildschirm-Variante fehlt beim visuellen Kurzzeitgedächtnis');
  check('faktoren', !inFaktor('KF086', 'seq-zahlenfolgen-audio'),
        'Die Ansage-Variante steht beim visuellen Kurzzeitgedächtnis');

  // Sprachaufnahmen liegen jetzt als eigene Dateien neben dem Bundle und
  // füllen window.LOGIK_AUDIO. Der Smoke-Test lädt sie wie der Browser.
  const { readFileSync: lies } = await import('node:fs');
  for (const l of ['de', 'ru']) {
    // eslint-disable-next-line no-eval
    (0, eval)(lies(`dist/audio-${l}.js`, 'utf8'));
  }
  const A = await import('../src/core/audio-assets.js');

  for (const l of ['de', 'ru']) {
    check('audio', A.hasVoice(l), `Aufnahmen für "${l}" fehlen`);
    for (let n = 0; n <= 9; n++) {
      const b64 = A.clip(l, 'd' + n);
      check('audio', typeof b64 === 'string' && b64.length > 500,
            `${l}/Ziffer ${n}: Aufnahme fehlt oder ist zu kurz`);
      const ms = A.clipMs(l, 'd' + n);
      check('audio', ms > 120 && ms < 1500, `${l}/Ziffer ${n}: Dauer ${ms} ms ist unplausibel`);
      check('audio', !!A.clipText(l, 'd' + n), `${l}/Ziffer ${n}: Text fehlt`);
    }
    check('audio', !!A.clip(l, 'lead'), `Ansage für "${l}" fehlt`);
    check('audio', A.clipMs(l, 'lead') > 300 && A.clipMs(l, 'lead') < 1500,
          `Ansage "${l}" dauert ${A.clipMs(l, 'lead')} ms`);
  }

  // Wörter und Kofferdinge: für jeden Listeneintrag eine Aufnahme
  const listen = JSON.parse(lies('src/data/wordlists.json', 'utf8'));
  for (const l of ['de', 'ru']) {
    for (const w of listen.words) {
      check('audio', !!A.clip(l, 'w:' + w.de), `${l}: Aufnahme für Wort "${w.de}" fehlt`);
    }
    for (const it of listen.items) {
      check('audio', !!A.clip(l, 'i:' + it.key), `${l}: Aufnahme für "${it.key}" fehlt`);
    }
  }

  // Die gesprochene Folge muss in die Zeigephase passen – für JEDES Modul mit
  // Ansage. Ohne diese Prüfung schneidet ein späteres Tempo-Feintuning oder
  // eine längere Ansage die letzte Aufnahme ab, und das merkt man erst beim
  // Zuhören. Genau das passierte, als die Koffer-Ansage von „Wiederhole:"
  // auf „Ich packe in meinen Koffer:" wechselte.
  const VORLAUF = 150, GAP = 400, MIN_LUECKE = 220, TEMPO = 2;
  const module = [
    { name: 'Zahlen',  praefix: 'd',  lead: 'lead',        factor: 1.3, pad: 1400, takt: TEMPO * 0.65 },
    { name: 'Wörter',  praefix: 'w:', lead: 'lead',        factor: 1.6, pad: 1600, takt: TEMPO * 0.8 },
    { name: 'Koffer',  praefix: 'i:', lead: 'lead-koffer', factor: 1.6, pad: 2000, takt: TEMPO * 0.8 }
  ];
  for (const m of module) {
    for (const l of ['de', 'ru']) {
      const keys = Object.keys(window.LOGIK_AUDIO[l].meta).filter(k => k.startsWith(m.praefix));
      check('audio', keys.length > 0, `${m.name}/${l}: keine Aufnahmen gefunden`);
      const laengste = A.longestMs(l, keys);
      const takt = Math.max(m.takt * 1000, laengste + MIN_LUECKE);
      const f = TEMPO * (m.factor / 2);
      for (const N of [2, 5, 10]) {
        const ende = VORLAUF + A.clipMs(l, m.lead) + GAP + (N - 1) * takt + laengste;
        const phase = N * f * 1000 + m.pad;
        check('audio', ende <= phase,
              `${m.name}/${l}, N=${N}: die Ansage endet bei ${Math.round(ende)} ms, ` +
              `die Zeigephase schon bei ${Math.round(phase)} ms`);
      }
    }
  }

  // Jedes Wort braucht ein Bild – sonst ist der Test für Kinder, die noch
  // nicht lesen, nicht durchführbar.
  for (const w of listen.words) {
    check('audio', !!w.emoji, `Wort "${w.de}" hat kein Bild`);
  }

  // Die Sprache muss der Einstellung folgen
  const audioMod = await registry['seq-zahlenfolgen-audio']();
  globalThis.localStorage.setItem('logik-lang', 'ru');
  check('audio', audioMod._voice().lang === 'ru',
        `Bei Einstellung RU spricht das Modul "${audioMod._voice().lang}"`);
  check('audio', audioMod._voice().words[7] === 'семь',
        `RU-Wort für 7 ist "${audioMod._voice().words[7]}"`);
  globalThis.localStorage.setItem('logik-lang', 'de');
  check('audio', audioMod._voice().words[7] === 'sieben',
        `DE-Wort für 7 ist "${audioMod._voice().words[7]}"`);
}

// ─── Fördermethoden-Seiten ────────────────────────────────────────────
// Jede Seite wird gegen das Schema aus src/data/methods/README.md geprüft.
// Bei vielen Seiten, die nebenläufig entstehen, ist das die einzige Art,
// Lücken zuverlässig zu finden – von Hand übersieht man die dritte fehlende
// russische Übersetzung sicher.
{
  const { methods, CATEGORIES, getMethod } = await import('../src/data/methods/index.js');
  const { FOERDERUNG_LINKS } = await import('../src/data/foerderung-links.js');

  check('methoden', methods.length > 0, 'keine einzige Methodenseite vorhanden');

  const { validateMethod } = await import('../tools/method-schema.mjs');
  const gesehen = new Set();
  for (const m of methods) {
    check('methoden', !gesehen.has(m.id), `Methode "${m.id}": id doppelt vergeben`);
    gesehen.add(m.id);
    for (const p of validateMethod(m)) check('methoden', false, p);
  }

  // Die Zuordnungstabelle darf nur auf vorhandene Seiten zeigen
  for (const [text, id] of Object.entries(FOERDERUNG_LINKS)) {
    check('methoden', !!getMethod(id),
          `Förderpunkt "${text}" verweist auf fehlende Seite "${id}"`);
  }

  // Jede Seite muss in allen drei Sprachen vollständig sein. Bei 54 Seiten,
  // die nebenläufig entstehen, übersieht man von Hand sicher die dritte
  // fehlende Übersetzung.
  {
    const luecken = [];
    const leer = v => v === '' || v === undefined || (Array.isArray(v) && !v.length);
    const pruefe = (o, wo) => {
      if (!o || typeof o !== 'object') return;
      for (const l of ['de', 'ru', 'en']) if (l in o && leer(o[l])) luecken.push(`${wo}.${l}`);
    };
    for (const m of methods) {
      pruefe(m.title, m.id + '.title');
      pruefe(m.short, m.id + '.short');
      pruefe(m.what, m.id + '.what');
      pruefe(m.steps, m.id + '.steps');
      pruefe(m.tips, m.id + '.tips');
      (m.links || []).forEach((k, i) => pruefe(k.label, `${m.id}.links[${i}]`));
      (m.products || []).forEach((p, i) => {
        pruefe(p.note, `${m.id}.products[${i}].note`);
        pruefe(p.diy, `${m.id}.products[${i}].diy`);
      });
      // Schritte und Tipps müssen je Sprache gleich viele sein – sonst fehlt
      // in einer Sprache ein Arbeitsschritt, ohne dass etwas leer aussieht.
      for (const f of ['steps', 'tips']) {
        const o = m[f];
        if (!o || !Array.isArray(o.de)) continue;
        for (const l of ['ru', 'en']) {
          if (!Array.isArray(o[l])) continue;
          check('methoden', o[l].length === o.de.length,
                `${m.id}.${f}: ${o.de.length} auf Deutsch, aber ${o[l].length} auf ${l}`);
        }
      }
    }
    check('methoden', !luecken.length,
          `${luecken.length} leere Übersetzungsfelder: ${luecken.slice(0, 6).join(', ')}${luecken.length > 6 ? ' …' : ''}`);
    console.log(`   Fördermethoden: ${methods.length} Seiten × 3 Sprachen lückenlos`);
  }

  // Sprachhinweise sind immer aus Sicht des Lesers formuliert. „Die Seite
  // gibt es nur auf Englisch" ist eine Warnung für deutsche und russische
  // Leser – im englischen Text steht dann eine Einschränkung, die für den
  // Leser keine ist. Genau das war zweimal wörtlich mitübersetzt worden.
  {
    const leserbezug = /only (available )?in English/i;
    const treffer = [];
    const suche = (o, wo) => {
      if (!o || typeof o !== 'object') return;
      if (typeof o.en === 'string' && leserbezug.test(o.en)) treffer.push(wo);
      if (Array.isArray(o.en)) o.en.forEach((t, i) => {
        if (typeof t === 'string' && leserbezug.test(t)) treffer.push(`${wo}[${i}]`);
      });
    };
    for (const m of methods) {
      suche(m.what, m.id + '.what');
      suche(m.steps, m.id + '.steps');
      suche(m.tips, m.id + '.tips');
      (m.products || []).forEach((p, i) => {
        suche(p.note, `${m.id}.products[${i}].note`);
        suche(p.diy, `${m.id}.products[${i}].diy`);
      });
    }
    check('methoden', !treffer.length,
          `Englischer Text warnt englische Leser vor englischen Quellen: ${treffer.join(', ')}`);
  }
}

// ─── Verlaufsdarstellung ──────────────────────────────────────────────
// Die Balken zeigen die Entwicklung, die Zahl dahinter den laufenden
// Mittelwert. Der letzte Wert wäre die unzuverlässigste Zahl von allen –
// ein einzelner Durchgang schwankt zu stark, um für sich zu stehen.
{
  const { sparkline, verdichten, mittel, BALKEN } = await import('../src/ui/spark.js');
  const V = await import('../src/core/verlauf.js');

  // Verdichten darf nicht abschneiden: bei 200 Antworten sähe man sonst nur
  // den Anfang oder nur das Ende, nicht die Entwicklung dazwischen.
  const steigend = Array.from({ length: 200 }, (_, i) => i / 2);
  const v = verdichten(steigend);
  check('verlauf', v.length <= BALKEN, `verdichten liefert ${v.length} Balken, erlaubt sind ${BALKEN}`);
  check('verlauf', v.every((x, i) => i === 0 || x >= v[i - 1]),
        'verdichten zerstört die zeitliche Reihenfolge');
  check('verlauf', v[0] < 10 && v[v.length - 1] > 90,
        `verdichten schneidet ab: ${v[0].toFixed(1)} … ${v[v.length - 1].toFixed(1)} statt ~0 … ~99`);
  check('verlauf', verdichten([10, 20, 30]).length === 3, 'kurze Reihen werden unnötig verdichtet');

  // Der Wert am Ende ist der Mittelwert, nicht der letzte Messwert
  const schwank = [90, 10, 90, 10, 90, 10];
  check('verlauf', mittel(schwank) === 50, `Mittelwert ${mittel(schwank)} statt 50`);
  const htmlSchwank = sparkline(schwank);
  check('verlauf', />50<\/span>\s*$/.test(htmlSchwank),
        'am Ende der Reihe steht nicht der Mittelwert');

  const html = sparkline([20, 50, 80]);
  // Volle Höhe ist genau eine Schriftzeile – die Reihe soll in der Zeile des
  // Modulnamens sitzen und die Liste nicht zur Diagrammsammlung machen.
  check('verlauf', /height:1\.15em/.test(html), 'Balkenreihe ist nicht eine Textzeile hoch');
  check('verlauf', /height:20%/.test(html) && /height:80%/.test(html),
        'Balkenhöhen bilden die Werte nicht ab');
  // Fester Maßstab: 0–100 für alle Zeilen, damit Zeilen vergleichbar bleiben
  check('verlauf', /height:100%/.test(sparkline([130])), 'Werte über 100 werden nicht gekappt');
  check('verlauf', />130<\/span>/.test(sparkline([130])), 'die Zahl wird mitgekappt – sie soll ungekappt bleiben');
  check('verlauf', /height:6%/.test(sparkline([0])), 'ein Nullwert ist unsichtbar statt als Sockel erkennbar');
  check('verlauf', sparkline([]) === '', 'leere Reihe erzeugt trotzdem Ausgabe');

  // Feste Breite: nur so stehen die Zahlen dahinter in einer Spalte und
  // zwei Zeilen lassen sich nebeneinander lesen. Wenige Messungen füllen
  // die Reihe noch nicht aus – auch das ist eine Information.
  const plaetze = h => (h.match(/width:3px/g) || []).length;
  const kurz = sparkline([50, 80]);
  const lang2 = sparkline(steigend);
  check('verlauf', plaetze(kurz) === BALKEN && plaetze(lang2) === BALKEN,
        `Reihen sind verschieden breit: ${plaetze(kurz)} gegenüber ${plaetze(lang2)} Plätzen`);
  // Die freien Plätze müssen als solche erkennbar bleiben, nicht als Messwert
  check('verlauf', (kurz.match(/background:#E8E5F5/g) || []).length === BALKEN - 2,
        'freie Plätze sind nicht von gemessenen Balken unterscheidbar');

  // Beide Bewertungsarten landen auf derselben 0–100-Achse, älteste zuerst
  // Wie echte Einträge: mit laufendem Zähler, damit sich Durchgänge
  // trennen lassen. Absichtlich unsortiert abgelegt.
  const hist = [
    { moduleId: 'a', kind: 'count', score: 1, total: 1, round: 3, timestamp: 3 },
    { moduleId: 'a', kind: 'count', score: 0, total: 1, round: 1, timestamp: 1 },
    { moduleId: 'a', kind: 'count', score: 1, total: 2, round: 2, timestamp: 2 },
    { moduleId: 'b', kind: 'percent', score: 70, total: 100, round: 1, timestamp: 9 }
  ];
  // Ein Balken ist ein DURCHGANG, keine Einzelantwort. Eine einzelne
  // Antwort ist 0 oder 100 und für sich wertlos; als Balken wäre sie nur
  // Rauschen. Drei Antworten desselben Durchgangs ergeben deshalb einen Wert.
  const einDurchgang = V.mittelReihe(hist, ['a']);
  check('verlauf', einDurchgang.length === 1,
        `${einDurchgang.length} Balken für einen Durchgang statt 1`);
  check('verlauf', Math.abs(einDurchgang[0] - 50) < 1e-9,
        `Durchgangsmittel ${einDurchgang[0]} statt 50`);

  // Ein kognitiver Faktor hat keine eigene Messung – seine Reihe entsteht aus
  // allen Modulen, die auf ihn einzahlen, zeitlich verschmolzen.
  const zusammen = V.mittelReihe(hist, ['a', 'b']);
  check('verlauf', zusammen.length === 2,
        `verschmolzene Reihe hat ${zusammen.length} Durchgänge statt 2`);
  check('verlauf', zusammen[zusammen.length - 1] === 70,
        'die verschmolzene Reihe ist nicht zeitlich sortiert');

  console.log(`   Verlauf: 200 Werte → ${BALKEN} feste Plätze ohne Abschneiden, Zahl am Ende ist der Mittelwert`);
}

// ─── Ausdauer und Gleichmäßigkeit aus den Einzelantworten ─────────────
// Der Mittelwert eines Durchgangs verschweigt, wie er zustande kam: 60 %
// können gleichmäßig 60 % sein oder erst 90 % und dann 30 %. Genau das
// steht in der Reihenfolge der Einzelwerte, die ohnehin gespeichert werden.
{
  const V = await import('../src/core/verlauf.js');
  const bin = s => s.split('').map(c => (c === '1' ? 100 : 0));

  // Ausdauer: zweite Hälfte gegen erste
  check('ausdauer', V.ausdauer(Array(12).fill(60)).delta === 0,
        'gleichbleibende Leistung ergibt keinen Ausdauerwert von 0');
  const faellt = V.ausdauer([100, 100, 90, 90, 80, 70, 50, 40, 30, 20, 10, 0]).delta;
  check('ausdauer', faellt < -40, `abfallender Verlauf ergibt nur ${faellt.toFixed(1)}`);
  check('ausdauer', /nach$/.test(V.ausdauerText(faellt)), 'abfallender Verlauf wird nicht benannt');
  check('ausdauer', V.ausdauer([1, 2, 3, 4, 5, 6, 7]) === null,
        'aus sieben Werten wird eine Aussage abgeleitet');

  // Gleichmäßigkeit muss um das Können bereinigt sein. Wer im Mittel die
  // Hälfte richtig hat, MUSS wechseln – ein rohes Schwankungsmaß würde
  // jedem mittelmäßigen Kind schlechte Konzentration bescheinigen.
  const bloecke = V.gleichmaessigkeit(bin('1111100000')).eta;
  const wechsel = V.gleichmaessigkeit(bin('1010101010')).eta;
  check('ausdauer', bloecke < wechsel,
        `Blockfolge (${bloecke.toFixed(2)}) gilt nicht als ruhiger als Dauerwechsel (${wechsel.toFixed(2)})`);
  check('ausdauer', V.ruheText(wechsel) !== V.ruheText(bloecke),
        'Dauerwechsel und Blockfolge werden gleich benannt');

  // Der Bezugspunkt darf nicht von der Länge des Durchgangs abhängen. Ohne
  // Normierung lag der Erwartungswert bei 10 Werten bei 2,47 statt bei 2 –
  // eine unauffällige Zufallsfolge wurde dadurch als sprunghaft gemeldet.
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  for (const n of [8, 10, 20, 40, 100]) {
    const r = Array.from({ length: n }, () => (rnd() < 0.5 ? 100 : 0));
    const e = V.gleichmaessigkeit(r).eta;
    check('ausdauer', e > 0.7 && e < 1.35,
          `Zufallsfolge der Länge ${n} ergibt η=${e.toFixed(2)} – erwartet um 1,0`);
  }

  // Durchgänge trennen: über die Kennung, bei Altbeständen über den Zähler
  const bauen = mitKennung => {
    const h = [];
    for (let d = 0; d < 3; d++) for (let i = 1; i <= 10; i++) {
      const e = { moduleId: 'm', kind: 'count', score: i % 2, total: 1, round: i, timestamp: d * 1000 + i };
      if (mitKennung) e.sessionId = 500 + d;
      h.push(e);
    }
    return h;
  };
  check('ausdauer', V.sitzungen(bauen(true), 'm').length === 3,
        'Durchgänge werden über die Kennung nicht getrennt');
  check('ausdauer', V.sitzungen(bauen(false), 'm').length === 3,
        'Altbestand ohne Kennung wird nicht in Durchgänge getrennt');

  // Aus zu wenigen Durchgängen wird nichts behauptet
  check('ausdauer', V.verlaufsProfil(V.sitzungen(bauen(true), 'm').slice(0, 2)) === null,
        `aus weniger als ${V.MIN_SITZUNGEN} Durchgängen wird ein Profil abgeleitet`);
  const profil = V.verlaufsProfil(V.sitzungen(bauen(true), 'm'));
  check('ausdauer', profil && profil.sitzungen === 3, 'Profil über drei Durchgänge fehlt');

  console.log('   Ausdauer/Gleichmäßigkeit: um das Können bereinigt, längenunabhängig, ab 3 Durchgängen');
}

// ─── Altersnormierte Auswertung ───────────────────────────────────────
// Eine rohe Spanne ist ohne Alter nicht deutbar: Spanne 6 ist mit sechs
// Jahren weit überdurchschnittlich und mit fünfzehn leicht unterdurch-
// schnittlich. Geprüft wird die Rechnung, die Deckelung und dass ohne
// Geburtsjahr gar keine Einordnung erscheint.
{
  const norms = await import('../src/core/norms.js');
  const settings = await import('../src/core/settings.js');
  const { resultScreen } = await import('../src/core/session.js');

  // Stützstellen exakt treffen
  const f = norms.normFuer(6, 'ziffernVorwaerts');
  check('normen', Math.abs(f.m - 4.4) < 1e-9 && Math.abs(f.s - 1.0) < 1e-9,
        `Norm bei 6 Jahren: ${f.m}/${f.s} statt 4.4/1.0`);

  // Zwischen zwei Stützstellen linear interpolieren
  const h = norms.normFuer(6.5, 'ziffernVorwaerts');
  check('normen', Math.abs(h.m - 4.65) < 1e-9,
        `Interpolation bei 6;6: ${h.m} statt 4.65`);

  // Dieselbe Spanne, verschiedenes Alter → verschiedener Index
  const jung = norms.indexFuer(6, 6, 'ziffernVorwaerts');
  const alt  = norms.indexFuer(6, 15, 'ziffernVorwaerts');
  check('normen', jung.index === 124, `Spanne 6 mit 6 Jahren: ${jung.index} statt 124`);
  check('normen', alt.index === 94,  `Spanne 6 mit 15 Jahren: ${alt.index} statt 94`);

  // Bei jüngeren Kindern ist die Streuung kleiner, eine Ziffer wiegt schwerer
  const schrittJung = jung.index - norms.indexFuer(5, 6, 'ziffernVorwaerts').index;
  const schrittAlt  = alt.index  - norms.indexFuer(5, 15, 'ziffernVorwaerts').index;
  check('normen', schrittJung > schrittAlt,
        `Eine Ziffer wiegt bei 6 Jahren ${schrittJung}, bei 15 Jahren ${schrittAlt} Punkte – erwartet: jung mehr`);

  // Unmögliche Werte werden gedeckelt UND markiert
  const extrem = norms.indexFuer(10, 6, 'ziffernVorwaerts');
  check('normen', extrem.index === norms.INDEX_MAX,
        `Spanne 10 mit 6 Jahren: ${extrem.index}, erwartet Deckel ${norms.INDEX_MAX}`);
  check('normen', extrem.auffaellig,
        'Spanne 10 mit 6 Jahren wird nicht als auffällig markiert');

  // Außerhalb der Tabelle auf den Rand klemmen statt NaN liefern
  for (const a of [2, 30]) {
    const r = norms.indexFuer(5, a, 'ziffernVorwaerts');
    check('normen', r && Number.isFinite(r.index), `Alter ${a}: kein endlicher Index`);
  }

  // Der Index gehört nur auf die Ergebnisseite von Modulen mit Normtabelle
  const jahr = new Date().getFullYear();
  const vorher = { y: settings.get('birthYear'), m: settings.get('birthMonth') };
  settings.set('birthYear', jahr - 7); settings.set('birthMonth', 7);

  // Erwartet wird der Index zum tatsächlich hinterlegten Alter – eine feste
  // Zahl hier wäre vom laufenden Monat abhängig und würde irgendwann grundlos
  // rot. Die Rechnung selbst ist oben geprüft, hier geht es um die Verdrahtung.
  const erwartet = norms.indexFuer(6, norms.alterJahre(), 'ziffernVorwaerts').index;
  const mitNorm = resultScreen({ moduleId: 'seq-zahlenfolgen' }, { percent: 45, level: 6 });
  check('normen', new RegExp('>' + erwartet + '<').test(mitNorm),
        `Ergebnisseite der Zahlenfolge zeigt den Index ${erwartet} nicht`);
  check('normen', /Literaturrichtwerte|Ориентировочная|reference values/.test(mitNorm),
        'Ergebnisseite zeigt einen Index ohne den Hinweis, dass er nicht geeicht ist');

  const ohneNorm = resultScreen({ moduleId: 'seq-koffer-packen' }, { percent: 45, level: 6 });
  check('normen', !/Literaturrichtwerte/.test(ohneNorm),
        'Modul ohne Normtabelle zeigt trotzdem eine normierte Einordnung');

  settings.set('birthYear', 0);
  const ohneAlter = resultScreen({ moduleId: 'seq-zahlenfolgen' }, { percent: 45, level: 6 });
  check('normen', !/Literaturrichtwerte/.test(ohneAlter),
        'Ohne Geburtsjahr erscheint trotzdem eine Einordnung');

  // Das Geburtsdatum ist keine Ablauf-Vorliebe, sondern eine Angabe über das
  // Kind. „Auf Voreinstellung zurücksetzen" darf es nicht mitnehmen – sonst
  // liefert die App danach stillschweigend uneingeordnete Ergebnisse.
  settings.set('birthYear', jahr - 8); settings.set('birthMonth', 3);
  settings.set('tempo', 4);
  settings.reset();
  check('normen', settings.get('birthYear') === jahr - 8 && settings.get('birthMonth') === 3,
        `Zurücksetzen der Einstellungen löscht das Geburtsdatum: ${settings.get('birthYear')}/${settings.get('birthMonth')}`);
  check('normen', settings.get('tempo') === settings.SCHEMA.tempo.def,
        'Zurücksetzen stellt das Tempo nicht auf die Voreinstellung zurück');

  settings.set('birthYear', vorher.y); settings.set('birthMonth', vorher.m);
  console.log('   Normierung: Spanne 6 → Index 124 (6 J) / 94 (15 J), Deckel und Markierung greifen');
}

// ─── Lesen und Ziffern erst ab sechs ──────────────────────────────────
// Ein Fünfjähriger scheitert an „Was macht ein Tierarzt?" nicht am
// Sachwissen, sondern am Text. Solche Module gehören dort nicht ins Angebot.
{
  const { modules, moduleFreigegeben, MIN_ALTER_SCHRIFT } = await import('../src/data/modules.js');
  const mitSchrift = modules.filter(m => m.requires);
  check('alter', mitSchrift.length > 0, 'kein einziges Modul als schrift- oder zahlenpflichtig markiert');

  for (const m of mitSchrift) {
    check('alter', !moduleFreigegeben(m, MIN_ALTER_SCHRIFT - 1),
          `${m.id} (${m.requires}) wird schon unter ${MIN_ALTER_SCHRIFT} angeboten`);
    check('alter', moduleFreigegeben(m, MIN_ALTER_SCHRIFT),
          `${m.id} wird ab ${MIN_ALTER_SCHRIFT} nicht angeboten`);
  }
  // Ohne bekanntes Alter darf nichts verschwinden – gefragt wird vorher
  check('alter', modules.every(m => moduleFreigegeben(m, null)),
        'ohne bekanntes Alter werden Module ausgeblendet statt nachzufragen');

  const frei5 = modules.filter(m => moduleFreigegeben(m, 5)).length;
  console.log(`   Altersfreigabe: ${mitSchrift.length} Module erst ab ${MIN_ALTER_SCHRIFT}, für Fünfjährige bleiben ${frei5}/${modules.length}`);
}

// ─── Auditive Faktoren nur für Module mit Ton ─────────────────────────
// Genau hier lag ein Fehler: die Zuordnung stammte aus der Original-
// Darbietung, bei der die Testleitung vorspricht. Unsere Textmodule geben
// keinen Ton aus – trotzdem hoben sie „Auditive Wahrnehmung" auf 30 %.
{
  const { readFileSync } = await import('node:fs');
  const gibtTonAus = id => {
    try { return /core\/audio\.js/.test(readFileSync(`src/games/${id}.js`, 'utf8')); }
    catch (e) { return false; }
  };
  const auditiv = Object.entries(cognitiveFactors)
    .filter(([, f]) => f.category === 'auditive_wahrnehmung' || /Hören|auditiv|akustisch/i.test(f.de));

  for (const [id, f] of auditiv) {
    for (const mid of f.modules) {
      check('faktoren', gibtTonAus(mid),
            `${id} „${f.de}" führt "${mid}" – das Modul gibt aber keinen Ton aus`);
    }
  }

  // Umgekehrt: kein Modul darf in einer Kategorie stehen, die es nicht bedient
  const tonModule = modules.map(m => m.id).filter(gibtTonAus);
  check('faktoren', tonModule.length >= 2,
        `nur ${tonModule.length} Modul(e) mit Tonausgabe gefunden – Prüfung liefe ins Leere`);
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
