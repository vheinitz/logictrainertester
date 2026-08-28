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

    // ── Drag-Module: Stücke auf Plätze ──
    } else if (mod.actions.verschiebe) {
      html(mod, gs, id, 'legen');
      const gd = gs.gd;
      if (gd.loesung && gd.plaetze) {
        gd.loesung.forEach((x, i) => mod.actions.verschiebe(gs, x.id, 'platz:' + i));
      } else if (gd.zellen && gd.stuecke) {
        const sollO = z => (gd.spiegle ? 1 - z.orient : z.orient);
        const frei = new Set(Object.keys(gd.stuecke));
        gd.zellen.forEach((z, i) => {
          const id = [...frei].find(k => {
            const st = gd.stuecke[k];
            return st.pflicht !== false && st.farbe === z.farbe;
          });
          if (!id) return;
          frei.delete(id);
          const st = gd.stuecke[id];
          if (st.orient !== sollO(z) && mod.actions.drehe) mod.actions.drehe(gs, id);
          mod.actions.verschiebe(gs, id, 'platz:' + i);
        });
      } else if (gd.figur && gd.plaetze) {
        const frei = [...gd.vorrat];
        gd.figur.slots.forEach((s, i) => {
          for (let t = 0; t < frei.length; t++) {
            const k = frei[t];
            if (mod.actions.drehe && s.okRot) {
              let n = 0;
              while (n < 8 && !s.okRot.includes(((gd.rot[k] % 360) + 360) % 360)) {
                mod.actions.drehe(gs, k); n++;
              }
            }
            if (s.okFlip && mod.actions.spiegle && !s.okFlip.includes(gd.flip[k] || 0)) {
              mod.actions.spiegle(gs, k);
            }
            mod.actions.verschiebe(gs, k, 'slot:' + i);
            if (gd.plaetze[i] === k) { frei.splice(t, 1); break; }
          }
        });
      }
      html(mod, gs, id, gd.phase || 'nach-legen');
      check(id, (gs.total || 0) >= 1 || gd.phase === 'feedback' || gd.phase === 'legen',
            'Drag-Modul hat nach dem Legen keinen Zustand');

    // ── Rover: Felder antippen (nicht Rhythmus) ──
    } else if (mod.actions.tap && mod.actions.undo) {
      html(mod, gs, id, 'play');
      const m = gs.gd.map;
      const blocked = new Set(m.blocked);
      const key = (r, c) => r + ',' + c;
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      const q = [[m.start[0], m.start[1]]];
      const parent = new Map();
      const seen = new Set([key(m.start[0], m.start[1])]);
      while (q.length) {
        const [r, c] = q.shift();
        if (r === m.goal[0] && c === m.goal[1]) break;
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc, kk = key(nr, nc);
          if (nr < 0 || nc < 0 || nr >= m.rows || nc >= m.cols) continue;
          if (blocked.has(kk) || seen.has(kk)) continue;
          seen.add(kk); parent.set(kk, [r, c]); q.push([nr, nc]);
        }
      }
      const weg = [];
      let cur = m.goal;
      while (cur && !(cur[0] === m.start[0] && cur[1] === m.start[1])) {
        weg.push(cur);
        cur = parent.get(key(cur[0], cur[1]));
      }
      weg.reverse();
      if (m.waypoint && !weg.some(([r, c]) => r === m.waypoint[0] && c === m.waypoint[1])) {
        // Zwischenziel nicht auf dem kürzesten Weg: zuerst hin, dann zum Ziel
        // (Stufe 5). Smoke tippt trotzdem den kürzesten; Auswertung darf fehlschlagen.
      }
      for (const [r, c] of weg) mod.actions.tap(gs, r, c);
      html(mod, gs, id, gs.gd.phase);
      check(id, (gs.total || 0) >= 1, 'Rover wertet den Weg nicht aus');

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
        // Kein „Prüfen"-Knopf mehr: das letzte gesetzte Symbol wertet aus.
        check(id, gs.gd.phase === 'feedback',
              `volles Gitter löst keine Auswertung aus (Phase "${gs.gd.phase}")`);
        check(id, gs.gd.geloest === true,
              `korrekt gefülltes Gitter gilt nicht als gelöst (wrong=${gs.gd.wrongCells ? gs.gd.wrongCells.size : 0})`);
        html(mod, gs, id, 'feedback');
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

// ─── Herkunft jedes kognitiven Faktors ────────────────────────────────
// Die App lehnt sich an ein Skript an, das sie nicht ersetzt. Ein Leser muss
// unterscheiden können, was dort steht und was wir ergänzt haben – sonst
// wirkt jede Zeile gleich belegt.
{
  const { cognitiveFactors } = await import('../src/data/cognitive-factors.js');
  const erlaubt = new Set(['skript', 'sinngemaess', 'eigen']);
  const zaehl = {};
  for (const [id, f] of Object.entries(cognitiveFactors)) {
    check('herkunft', erlaubt.has(f.quelle),
          `Faktor ${id} hat die Herkunft "${f.quelle}" – erlaubt sind ${[...erlaubt].join(', ')}`);
    zaehl[f.quelle] = (zaehl[f.quelle] || 0) + 1;
  }
  // Kippt das Verhältnis, ist das Modell von der Vorlage weggelaufen
  const gesamt = Object.keys(cognitiveFactors).length;
  check('herkunft', (zaehl.skript || 0) / gesamt > 0.6,
        `nur ${zaehl.skript || 0} von ${gesamt} Faktoren stehen wörtlich im Skript`);
  console.log(`   Faktoren: ${zaehl.skript} wörtlich im Skript, ${zaehl.sinngemaess} sinngemäß, ${zaehl.eigen} eigene`);
}

// ─── Keine Aufgabe zweimal im selben Durchgang ────────────────────────
// Dieselbe Frage zweimal wirkt wie ein Fehler und misst beim zweiten Mal
// etwas anderes: die Erinnerung an die vorige Antwort statt der Fähigkeit.
{
  const RUNDEN = 10;                       // Voreinstellung eines Durchgangs
  const mitSperre = [];
  for (const id of Object.keys(registry)) {
    let mod;
    try { mod = await registry[id](); } catch (e) { continue; }
    if (!mod || !mod.actions || !mod.actions.next || !mod.init) continue;

    const gs = { moduleId: id, step: 'game', score: 0, total: 0, gd: {} };
    engine.activeGame = { id, mod };
    engine.gameState = gs;
    try {
      mod.init(gs);
      const r0 = gs.gd && gs.gd.round;
      if (!r0 || r0._key == null) continue;          // Modul ohne Kennung
      mitSperre.push(id);

      const keys = [];
      for (let i = 0; i < RUNDEN; i++) {
        keys.push(gs.gd.round._key);
        mod.actions.next(gs);
      }

      // Direkt hintereinander darf sich nie etwas wiederholen. Ist der
      // Vorrat einer Stufe kleiner als der Durchgang, sind Wiederholungen
      // unvermeidlich – aber nicht Schlag auf Schlag.
      let direkt = 0;
      for (let i = 1; i < keys.length; i++) if (keys[i] === keys[i - 1]) direkt++;
      check('wiederholung', direkt === 0,
            `${id}: ${direkt}× dieselbe Aufgabe direkt hintereinander`);
    } catch (e) {
      check('wiederholung', false, `${id}: ${e.message}`);
    } finally {
      try { mod.dispose(gs); } catch (e) { /* egal */ }
      engine.activeGame = null;
    }
  }
  check('wiederholung', mitSperre.length >= 8,
        `nur ${mitSperre.length} Module haben eine Wiederholungssperre`);

  // Die Sperre nützt nichts, wenn eine Stufe weniger Aufgaben kennt als ein
  // Durchgang lang ist. Dann sind Wiederholungen unvermeidlich, und zwar
  // schon innerhalb einer Sitzung.
  const VORRAT_MIN = 20;
  for (const id of mitSperre) {
    const mod = await registry[id]();
    for (const stufe of [1, 3, 5]) {
      const gs = { moduleId: id, step: 'game', score: 0, total: 0, gd: {} };
      engine.activeGame = { id, mod };
      engine.gameState = gs;
      mod.init(gs);
      const keys = new Set();
      // Genug Ziehungen, um einen kleinen Vorrat sicher auszuschöpfen
      for (let i = 0; i < 400; i++) {
        gs.gd.level = stufe;
        mod.actions.next(gs);
        if (gs.gd.round && gs.gd.round._key != null) keys.add(gs.gd.round._key);
      }
      try { mod.dispose(gs); } catch (e) { /* egal */ }
      engine.activeGame = null;
      check('vorrat', keys.size >= VORRAT_MIN,
            `${id} Stufe ${stufe}: nur ${keys.size} verschiedene Aufgaben, ` +
            `mindestens ${VORRAT_MIN} nötig für einen Durchgang von 10`);
    }
  }
  // Beim Wortschatz-Quiz IST das Bild die Antwort. Zwei gleiche Bilder in
  // einer Stufe machen die Aufgabe unlösbar, ein Bild das nicht zum Wort
  // passt macht sie falsch. Beides war vorhanden: 🔭 zweimal, 🦔 zweimal,
  // und 🦛 (Nilpferd) stand für „Tapir".
  {
    const { readFileSync } = await import('node:fs');
    const quelle = readFileSync('src/games/wiss-wortschatz.js', 'utf8');
    const eintraege = [...quelle.matchAll(/w: \{ de: '([^']+)'[\s\S]*?e: '([^']+)', t: (\d)/g)]
      .map(m => ({ wort: m[1], emoji: m[2], stufe: m[3] }));
    check('vorrat', eintraege.length >= 60,
          `Wortschatz-Quiz hat nur ${eintraege.length} Wörter`);

    const proStufe = {};
    for (const e of eintraege) (proStufe[e.stufe] = proStufe[e.stufe] || []).push(e);
    for (const [stufe, liste] of Object.entries(proStufe)) {
      check('vorrat', liste.length >= 20,
            `Wortschatz-Quiz Stufe ${stufe}: nur ${liste.length} Wörter`);
      const bilder = liste.map(e => e.emoji);
      const doppelt = [...new Set(bilder.filter((b, i) => bilder.indexOf(b) !== i))];
      check('vorrat', doppelt.length === 0,
            `Wortschatz-Quiz Stufe ${stufe}: Bild mehrfach vergeben (${doppelt.join(' ')}) – ` +
            `als Antwortoption nicht unterscheidbar`);
    }
  }

  console.log(`   Wiederholungssperre: ${mitSperre.length} Module, keine Aufgabe direkt doppelt`);
}

// ─── Womit die App öffnet ─────────────────────────────────────────────
// Diese Entscheidung ist schon zweimal umgekippt – einmal davon still, weil
// gleichzeitig der Test mitgedreht wurde und dann niemand mehr etwas merkte.
// Sie steht deshalb an einer benannten Stelle und wird hier festgehalten.
{
  const { readFileSync } = await import('node:fs');
  const quelle = readFileSync('src/main.js', 'utf8');

  const m = quelle.match(/const STARTSEITE = '([a-z]+)'/);
  check('start', !!m, 'src/main.js benennt keine Startseite');
  check('start', m && m[1] === 'intro',
        `Die App öffnet mit "${m && m[1]}" statt mit der Einführung`);
  check('start', /engine\.view = STARTSEITE/.test(quelle),
        'Die Startseite wird nirgends gesetzt – die App öffnet mit der Vorgabe der Engine');

  // Kein Merker im Speicher: die App wird in Abständen von Wochen benutzt,
  // bis dahin ist der Ablauf meist wieder vergessen. Ein „schon gesehen"
  // verbärge die Einführung gerade dann, wenn sie gebraucht wird.
  check('start', !/logik-intro-gesehen|ERSTBESUCH/.test(quelle),
        'Die Einführung wird nur beim ersten Mal gezeigt statt bei jedem Start');

  console.log(`   Start: die App öffnet mit "${m ? m[1] : '?'}", bei jedem Mal`);
}

// ─── Das Stylesheet in index.html ─────────────────────────────────────
// Beim Umbauen der Leiste blieben zweimal Reste zerschnittener @media-Blöcke
// stehen. Deren Regeln galten dadurch immer statt nur auf schmalen
// Bildschirmen – die Beschriftungen der Leiste waren überall versteckt, und
// es sah aus wie ein Entwurfsfehler.
{
  const { readFileSync } = await import('node:fs');
  const html = readFileSync('index.html', 'utf8');
  const css = html.slice(html.indexOf('<style'), html.indexOf('</style>'));

  const auf = (css.match(/\{/g) || []).length;
  const zu = (css.match(/\}/g) || []).length;
  check('css', auf === zu, `Klammern im Stylesheet stehen ${auf} zu ${zu}`);

  // Eine Regel darf nur innerhalb eines @media-Blocks stehen, wenn sie
  // eingerückt ist – ein nicht eingerücktes Fragment nach einem } ist ein Rest.
  const zeilen = css.split('\n');
  let tiefe = 0;
  const verdaechtig = [];
  for (const z of zeilen) {
    const trimmed = z.trim();
    if (trimmed.startsWith('@media')) { tiefe++; continue; }
    if (trimmed === '}') { if (tiefe > 0) tiefe--; continue; }
    // Eingerückte Regel ohne offenen @media-Block = Rest eines zerschnittenen
    if (tiefe === 0 && /^\s{2,}\.[a-z#]/i.test(z) && z.includes('{')) verdaechtig.push(trimmed);
  }
  check('css', verdaechtig.length === 0,
        `${verdaechtig.length} Regel(n) außerhalb ihres @media-Blocks: ${verdaechtig.slice(0, 3).join(' ')}`);

  // Die Beschriftungen der Leiste dürfen nirgends versteckt werden: bloße
  // Symbole sind nicht zu verstehen, „Testen" und „Auswertung" sehen als
  // Piktogramm gleich aus.
  check('css', !/\.nav-label\{display:none\}/.test(css),
        'Die Beschriftungen der Navigationsleiste werden versteckt');

  // Die Leiste darf keinen Rollbereich aufmachen: overflow schneidet die
  // Untermenüs ab, die absolut darunter hängen. Sie gehen dann zwar auf –
  // Pfeil klappt um, aria-expanded steht auf true – sind aber nicht zu sehen
  // und nicht zu treffen. Auf schmalen Geräten war die Leiste damit nutzlos.
  for (const regel of css.matchAll(/#mainNav\{([^}]*)\}/g)) {
    check('css', !/overflow/.test(regel[1]),
          `#mainNav bekommt "overflow" – das schneidet die Untermenüs ab: ${regel[1].trim()}`);
  }

  // Grundlegende Regeln, die beim Aufräumen leicht mit verschwinden
  for (const regel of ['main{max-width', '.card-grid{', 'header{background']) {
    check('css', css.includes(regel), `Regel "${regel}…" fehlt im Stylesheet`);
  }
  console.log('   Stylesheet: Klammern ausgeglichen, keine Reste, Beschriftungen sichtbar, ' +
              'Untermenüs nicht abgeschnitten');
}

// ─── Bildgröße ────────────────────────────────────────────────────────
// Die Bilder sind die Aufgabe, nicht Schmuck. Für kleine Kinder und auf
// Tablets waren sie zu klein; sie hängen jetzt an einer Einstellung.
{
  const settings = await import('../src/core/settings.js');
  const { readFileSync } = await import('node:fs');

  const sch = settings.SCHEMA.bildGroesse;
  check('bild', !!sch, 'Es gibt keine Einstellung für die Bildgröße');
  check('bild', sch && sch.def >= 2,
        `Bildgröße ist auf ${sch && sch.def}× voreingestellt – gewünscht war mindestens doppelt`);
  check('bild', sch && sch.min <= 1,
        'Die ursprüngliche Größe (1×) lässt sich nicht mehr einstellen');

  // Der Wert muss als CSS-Variable ankommen, sonst wirkt er nirgends
  check('bild', /--pic:/.test(readFileSync('index.html', 'utf8')),
        'index.html setzt keine Vorgabe für --pic');
  check('bild', typeof settings.anwenden === 'function',
        'settings.anwenden() fehlt – der Wert erreicht das Stylesheet nicht');

  // Jede Stelle, die ein Bild darstellt, muss mitwachsen. Eine Größe, die
  // fest in em oder px steht, bleibt beim Vergrößern zurück und zerreißt
  // die Kachel.
  const dateien = ['src/core/choice.js', 'src/core/adaptive.js']
    .concat((await import('node:fs')).readdirSync('src/games')
      .filter(f => f.endsWith('.js') && f !== 'index.js').map(f => 'src/games/' + f));
  const starr = [];
  for (const d of dateien) {
    const quelle = readFileSync(d, 'utf8');
    for (const m of quelle.matchAll(/font-size:([0-9.]+)em(?!\s*\*)/g)) {
      if (Number(m[1]) >= 1.25) starr.push(`${d.replace(/^.*\//, '')}:${m[1]}em`);
    }
  }
  check('bild', starr.length === 0,
        `${starr.length} Bildgrößen wachsen nicht mit: ${starr.slice(0, 5).join(', ')}`);

  console.log(`   Bilder: ${sch.def}× voreingestellt, ${sch.min}–${sch.max}× einstellbar, keine starren Größen`);
}

// ─── Module bringen ihre eigenen Einstellungen mit ────────────────────
// Ein Modul weiß am besten, welche Stellschrauben es hat. Eine zentrale
// Liste wüchse bei jedem neuen Modul und würde irgendwann unübersichtlich.
{
  const settings = await import('../src/core/settings.js');
  const { registry } = await import('../src/games/index.js');
  await Promise.all(Object.values(registry).map(load => load().catch(() => null)));

  const gruppen = settings.moduleGroups();
  const anzahl = Object.values(gruppen).reduce((n, f) => n + f.length, 0);
  check('modconf', anzahl > 0, 'kein einziges Modul meldet eigene Einstellungen an');

  for (const [modId, felder] of Object.entries(gruppen)) {
    for (const [key, sch] of felder) {
      check('modconf', key.startsWith(modId + '.'),
            `Schlüssel "${key}" trägt die Modulkennung nicht – zwei Module könnten kollidieren`);
      check('modconf', typeof sch.def === 'number' && sch.def >= sch.min && sch.def <= sch.max,
            `${key}: Voreinstellung ${sch.def} liegt außerhalb von ${sch.min}–${sch.max}`);
      for (const l of ['de', 'ru', 'en']) {
        check('modconf', !!sch[l], `${key}: Beschriftung fehlt auf ${l}`);
      }
      // Lesen und Schreiben über die verkürzte Form muss dasselbe treffen
      const kurz = key.slice(modId.length + 1);
      check('modconf', settings.modGet(modId, kurz) === settings.get(key),
            `${key}: modGet() und get() liefern Verschiedenes`);
      const vorher = settings.get(key);
      settings.set(key, sch.max + 999);
      check('modconf', settings.get(key) === sch.max, `${key}: Obergrenze greift nicht`);
      settings.set(key, vorher);
    }
  }
  // Das Wortschatz-Quiz braucht eine kurze Antwortzeit: ein Wort erkennt man
  // oder nicht. Dreißig Sekunden Grundzeit sind dort keine Großzügigkeit,
  // sondern Leerlauf, in dem die Aufmerksamkeit wegdriftet.
  const kurz = settings.SCHEMA['wiss-wortschatz.antwortzeit'];
  check('modconf', !!kurz, 'das Wortschatz-Quiz hat keine eigene Antwortzeit');
  check('modconf', kurz && kurz.def <= 8,
        `Antwortzeit des Wortschatz-Quiz ist auf ${kurz && kurz.def}s voreingestellt – zu lang für eine Worterkennung`);
  check('modconf', kurz && kurz.def < settings.SCHEMA.choiceAnswer.def,
        'die eigene Antwortzeit ist nicht kürzer als die allgemeine');

  console.log(`   Modul-Einstellungen: ${anzahl} aus ${Object.keys(gruppen).length} Modul(en) angemeldet, Wortschatz ${kurz ? kurz.def : '?'}s`);
}

// ─── Bedenkzeit wächst mit dem Niveau ─────────────────────────────────
// Auf Stufe 5 ist die Aufgabe schwerer, die Uhr lief aber gleich schnell –
// wer weiter kam, wurde mit knapperer Zeit bestraft.
{
  const settings = await import('../src/core/settings.js');
  const basis = settings.get('choiceAnswer');
  const f = settings.get('choiceLevelFactor');
  check('zeit', f > 0, 'der Zeitzuschlag je Niveaustufe ist auf 0 voreingestellt');
  const zeit = stufe => basis * (1 + (stufe - 1) * f);
  check('zeit', zeit(1) === basis, 'Stufe 1 bekommt bereits einen Zuschlag');
  check('zeit', zeit(5) > zeit(3) && zeit(3) > zeit(1),
        `Bedenkzeit wächst nicht mit dem Niveau: ${zeit(1)}/${zeit(3)}/${zeit(5)}`);
  console.log(`   Bedenkzeit: Stufe 1 ${zeit(1).toFixed(0)}s → Stufe 5 ${zeit(5).toFixed(0)}s`);
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

// ─── Richtwerte: Einordnung statt Trefferquote ────────────────────────
/**
 * Die Trefferquote kann Starke und Schwache nicht unterscheiden, weil alle
 * Module mitwachsen. Diese Prüfungen sichern die Ablösung ab: dass jedes
 * Modul mit Niveauleiter einen Richtwert liefert, dass der Richtwert mit dem
 * Alter steigt und in der Leiter bleibt, und dass die vier Einordnungen
 * tatsächlich auseinanderfallen.
 */
{
  const R = await import('../src/core/richtwerte.js');
  const mitLeiter = modules.filter(m => m.stufen);

  check('richtwerte', mitLeiter.length >= 25,
        `nur ${mitLeiter.length} Module haben eine Niveauleiter – die Einordnung liefe weitgehend ins Leere`);

  // Namentlich, nicht nur der Zahl nach: ein fehlendes `stufen` an einem
  // einzelnen Modul verschwindet sonst in der Gesamtzahl, und genau dieses
  // Modul ließe sich dann nie einordnen.
  const OHNE_LEITER = ['lern-memory'];   // misst Züge, nicht Schwierigkeit
  for (const m of modules) {
    if (OHNE_LEITER.includes(m.id)) continue;
    check('richtwerte', m.stufen && m.stufen.length === 2,
          `Modul "${m.id}" hat keine Niveauleiter (stufen) – es kann nicht eingeordnet werden`);
  }

  for (const m of mitLeiter) {
    const band = R.altersband(m);
    check('richtwerte', band, `Modul "${m.id}" hat kein lesbares Altersband ("${m.ages}")`);
    if (!band) continue;
    const [von, bis] = band;
    const [sVon, sBis] = m.stufen;

    const unten = R.erwartetesNiveau(m, von);
    const oben = R.erwartetesNiveau(m, bis);
    check('richtwerte', unten && oben, `Modul "${m.id}" liefert keinen Richtwert für sein eigenes Altersband`);
    if (!unten || !oben) continue;

    check('richtwerte', oben.niveau > unten.niveau,
          `Modul "${m.id}": der Richtwert steigt mit dem Alter nicht (${unten.niveau} → ${oben.niveau})`);

    // Der Richtwert darf die Leiter nicht verlassen – sonst wäre er auch bei
    // bester Leistung unerreichbar und jedes Kind stünde „darunter".
    for (let a = von; a <= bis; a++) {
      const e = R.erwartetesNiveau(m, a);
      check('richtwerte', e && e.niveau >= sVon - 0.01 && e.niveau <= sBis + 0.01,
            `Modul "${m.id}": Richtwert ${e && e.niveau} mit ${a} Jahren liegt außerhalb der Leiter [${sVon}, ${sBis}]`);
    }
  }

  // Die vier Einordnungen müssen bei denselben Daten verschieden ausfallen
  {
    const m = modules.find(x => x.id === 'plan-muster');
    const alter = 12;
    const e = R.erwartetesNiveau(m, alter);
    check('richtwerte', e, 'Für plan-muster mit 12 Jahren kommt kein Richtwert heraus');
    const erw = e ? e.niveau : 0;
    const s = R.schwelle(m);
    const stufen = [
      [erw - 2.5 * s, 'weitDarunter'],
      [erw - 1.2 * s, 'darunter'],
      [erw, 'erwartet'],
      [erw + 1.5 * s, 'darueber']
    ];
    for (const [niveau, erwartet] of (e ? stufen : [])) {
      const b = R.bewerte(m, Math.max(0.1, niveau), alter);
      check('richtwerte', b && b.stufe === erwartet,
            `Niveau ${niveau.toFixed(1)} bei Richtwert ${erw.toFixed(1)} ergibt "${b && b.stufe}" statt "${erwartet}"`);
    }
  }

  // Die Schwelle absolut prüfen, nicht nur relativ.
  //
  // Die vier Punkte oben liegen bei erw ± Vielfachen der Schwelle – damit
  // fällt eine kaputte Schwelle nicht auf, weil die Prüfpunkte mit ihr
  // mitwandern. Gegenprobe „schwelle() liefert 0,0001" blieb genau deshalb
  // stumm. Was hier steht, hängt nicht von der Schwelle ab:
  for (const m of mitLeiter) {
    const sch = R.schwelle(m);
    check('richtwerte', sch >= 1,
          `Modul "${m.id}": Schwelle ${sch} ist kleiner als eine ganze Stufe – Niveaus sind ganze Zahlen`);
    check('richtwerte', sch <= (m.stufen[1] - m.stufen[0]) / 2 + 1,
          `Modul "${m.id}": Schwelle ${sch} deckt mehr als die halbe Leiter ab – nichts fiele je auf`);
  }
  {
    // Eine ganze Stufe unter dem Richtwert ist keine Punktlandung mehr.
    const m = modules.find(x => x.id === 'seq-zahlenfolgen');
    const erw = R.erwartetesNiveau(m, 10).niveau;
    const genau = R.bewerte(m, erw, 10);
    const knapp = R.bewerte(m, erw - 1.01 * R.schwelle(m), 10);
    check('richtwerte', genau && genau.stufe === 'erwartet',
          `Genau auf dem Richtwert ergibt "${genau && genau.stufe}" statt "erwartet"`);
    check('richtwerte', knapp && knapp.stufe !== 'erwartet',
          'Eine volle Schwelle unter dem Richtwert gilt immer noch als erwartet');
  }

  // Ohne Alter darf nichts eingeordnet werden – lieber keine Aussage als eine
  // falsche. Dieselbe Leistung ist mit sechs stark und mit fünfzehn schwach.
  check('richtwerte', R.bewerte(modules[0], 4, null) === null,
        'Ohne Alter wird trotzdem eingeordnet');

  // Die Literaturtabelle hat Vorrang vor der abgeleiteten Leiter
  {
    const ziffern = modules.find(x => x.id === 'seq-zahlenfolgen');
    const e = R.erwartetesNiveau(ziffern, 9);
    check('richtwerte', e && e.herkunft === 'tabelle',
          `Ziffernspanne nimmt "${e && e.herkunft}" statt der vorhandenen Literaturtabelle`);
    check('richtwerte', e && Math.abs(e.niveau - 5.5) < 0.2,
          `Ziffernspanne mit 9 Jahren: Richtwert ${e && e.niveau} statt der Tabellenangabe 5,5`);
  }
  console.log(`   Richtwerte: ${mitLeiter.length} Module mit Niveauleiter, Richtwert steigt mit dem Alter und bleibt in der Leiter`);
}

// ─── Übung ohne Bildschirm ────────────────────────────────────────────
/**
 * Der Bildschirm ist der Notbehelf. Wenn zu einem Modul die Anleitung für den
 * Küchentisch fehlt, bleibt genau der Weg unsichtbar, der dem Kind mehr
 * bringt – deshalb ist Vollständigkeit hier Pflicht und nicht Kür.
 */
{
  const { ANALOG } = await import('../src/data/analog.js');
  const SPRACHEN = ['de', 'ru', 'en'];

  for (const m of modules) {
    const a = ANALOG[m.id];
    if (!check('analog', a, `Modul "${m.id}" hat keine Anleitung ohne Bildschirm`)) continue;
    for (const l of SPRACHEN) {
      check('analog', a.material && typeof a.material[l] === 'string' && a.material[l].length > 2,
            `"${m.id}": Materialangabe fehlt auf ${l}`);
      check('analog', a.so && typeof a.so[l] === 'string' && a.so[l].length > 40,
            `"${m.id}": Anleitung auf ${l} fehlt oder ist zu kurz, um brauchbar zu sein`);
    }
  }
  for (const id of Object.keys(ANALOG)) {
    check('analog', modules.some(m => m.id === id),
          `Anleitung für unbekanntes Modul "${id}"`);
  }
  console.log(`   Ohne Bildschirm: ${modules.length} Module mit Anleitung für den Tisch, dreisprachig`);
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
