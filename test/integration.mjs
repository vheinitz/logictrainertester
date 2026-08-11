/**
 * Integrationstest gegen ein echtes DOM (jsdom) und eine echte IndexedDB.
 *
 * Lädt index.html samt gebautem Bundle, klickt sich durch alle Module und
 * prüft, dass dabei kein Fehler in der Konsole landet und tatsächlich etwas
 * gerendert wird. Der Smoke-Test prüft die Spielmodule isoliert – hier geht es
 * um das Zusammenspiel: Engine-Navigation, Action-Bridge G(), Spielbereich,
 * Score-Zeile und die Persistenz.
 *
 * Voraussetzung: npm run build
 */
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import 'fake-indexeddb/auto';

const root = new URL('..', import.meta.url).pathname;
if (!existsSync(root + 'dist/logik-trainer.min.js')) {
  console.error('✗ dist/logik-trainer.min.js fehlt – bitte "npm run build" ausführen');
  process.exit(1);
}

const errors = [];
const dom = new JSDOM(readFileSync(root + 'index.html', 'utf8'), {
  runScripts: 'dangerously',
  url: 'http://localhost/',
  resources: {
    fetch(url) {
      const path = root + url.pathname.replace(/^\//, '');
      return Promise.resolve(Buffer.from(readFileSync(path)));
    }
  },
  virtualConsole: new (await import('jsdom')).VirtualConsole()
    .on('jsdomError', e => errors.push('jsdomError: ' + e.message))
    .on('error', (...a) => errors.push('console.error: ' + a.join(' ')))
});

const { window } = dom;
window.indexedDB = globalThis.indexedDB;
window.IDBKeyRange = globalThis.IDBKeyRange;
window.scrollTo = () => {};   // von jsdom nicht implementiert

// Bundle manuell ausführen – jsdom lädt lokale <script src> nicht von selbst
const bundle = readFileSync(root + 'dist/logik-trainer.min.js', 'utf8');
window.eval(bundle);
window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

const sleep = ms => new Promise(r => setTimeout(r, ms));
await sleep(150);

// load kommt nach DOMContentLoaded – daran hängt der „Bundle fehlt"-Wächter
// in index.html. Er muss stumm bleiben, wenn der Bundle geladen ist; eine
// frühere Fassung überschrieb hier das bereits aufgebaute Menü.
window.dispatchEvent(new window.Event('load'));
await sleep(60);

const main = window.document.getElementById('mainContent');
const problems = [];
let adaptiveSeen = 0;
const clickTest = [];
const phaseTest = [];
const dupTest = [];
const starTest = [];
const rhythmTest = [];
// Diese Module laufen mit der Minimal-Hülle: im Spiel nur die Aufgabe.
const MINIMAL = ['seq-zahlenfolgen', 'seq-wortreihe', 'seq-handbewegungen',
                 'seq-koffer-packen', 'sim-gesichter', 'seq-rhythmus'];
// Merkspannen-Tests mit Auswahl-Eingabe (Rhythmus klopft stattdessen)
const ADAPTIVE = MINIMAL.filter(id => id !== 'seq-rhythmus');

function check(cond, msg) { if (!cond) problems.push(msg); }

// ─── Menü ─────────────────────────────────────────────────────────────
check(!main.innerHTML.includes('Bundle fehlt'),
      'Der „Bundle fehlt"-Hinweis erscheint, obwohl der Bundle geladen ist');
check(typeof window.navigateTo === 'function',
      'Der Bundle installiert window.navigateTo nicht');
check(main.innerHTML.length > 500, 'Menü wurde nicht gerendert');
const cards = main.querySelectorAll('.card');
check(cards.length >= 26, `Menü zeigt nur ${cards.length} Karten`);

// Cache-Kennung: das Script-Tag muss ein ?v= tragen und das Menü es anzeigen,
// damit erkennbar bleibt, welcher Stand im Browser läuft.
const tag = window.document.querySelector('script[src*="logik-trainer"]');
const vm = tag && (tag.getAttribute('src') || '').match(/[?&]v=([0-9a-f]{8})/);
check(!!vm, 'Das Script-Tag in index.html trägt keine Build-Kennung (?v=…)');
check(vm && main.textContent.includes(vm[1]),
      'Das Menü zeigt die Build-Kennung nicht an');

// ─── Jedes Modul öffnen und anspielen ─────────────────────────────────
const { modules } = await import('../src/data/modules.js');

for (const m of modules) {
  errors.length = 0;
  window.startModule(m.id);
  await sleep(60);

  const intro = main.innerHTML;
  check(intro.includes('training-container'), `${m.id}: Intro nicht gerendert`);

  window._startGame();
  await sleep(120);

  const area = window.document.getElementById('gameArea');
  check(!!area, `${m.id}: #gameArea fehlt nach Spielstart`);
  check(area && area.innerHTML.trim().length > 0, `${m.id}: Spielbereich ist leer`);
  const scoreEl = window.document.getElementById('gameScore');
  const isMinimal = MINIMAL.includes(m.id);

  if (isMinimal) {
    // Minimal-Hülle: im Spiel nur die Aufgabe – keine Kopfzeile, kein
    // Punktestand, keine Anweisung, kein Niveau, keine Prozente.
    adaptiveSeen++;
    check(!scoreEl, `${m.id}: Punktestand wird im Spiel angezeigt`);
    check(!main.querySelector('.training-header'),
          `${m.id}: Kopfzeile wird im Spiel angezeigt`);
    const txt = area ? area.textContent : '';
    for (const wort of ['Niveau', 'Bewertung', 'Tempo', 'Klicke', 'Merke', 'Klopfe']) {
      check(!txt.includes(wort), `${m.id}: „${wort}" steht im Spielbildschirm`);
    }
    // Anleitung gehört auf den Startbildschirm – dort als eigener Block.
    // `intro` ist der Stand VOR dem Spielstart; `main` zeigt bereits das Spiel.
    check(/data-role="instruction"/.test(intro),
          `${m.id}: Anleitung fehlt auf dem Startbildschirm`);
  } else {
    check(!!scoreEl, `${m.id}: Score-Zeile fehlt`);
  }

  // Mehrere Runden durchklicken: immer das erste Element antippen, das eine
  // Action auslöst. Das reicht, um jede Phase eines Moduls einmal zu treffen.
  let clicks = 0;
  for (let i = 0; i < 14; i++) {
    const a = window.document.getElementById('gameArea');
    if (!a) break;
    const el = a.querySelector('[onclick^="G("]');
    if (!el) break;
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    clicks++;
    await sleep(70);
  }
  check(clicks > 0 || m.id === 'sim-rover' || m.id === 'sim-dreiecke'
        || m.id === 'sim-tangram' || m.id === 'plan-geschichten',
        `${m.id}: kein anklickbares Element im Spielbereich gefunden`);
  check(window.document.getElementById('gameArea') !== null,
        `${m.id}: Spielbereich nach ${clicks} Klicks verschwunden`);

  check(errors.length === 0, `${m.id}: Fehler in der Konsole – ${errors.join(' | ')}`);

  window.goBack();
  await sleep(40);
  window.navigateTo('menu');
  await sleep(40);
}

// ─── Klick-Zuverlässigkeit während laufender Uhr ──────────────────────
// Ein echter Klick besteht aus mousedown und mouseup auf DEMSELBEN Element.
// Wird der Spielbereich dazwischen neu aufgebaut, ist das Element weg und der
// Browser löst gar kein click-Event aus – das war der Grund, weshalb man
// mehrfach tippen musste. Hier wird genau das nachgestellt: langsamer Klick
// (180 ms zwischen down und up) mitten in der laufenden Antwortphase.
const PICK_SEL = '[onclick^="G(\'pick\'"]';

/** Wartet, bis in der Antwortphase Knöpfe stehen. */
async function waitForPicks(maxMs = 9000) {
  for (let t = 0; t < maxMs; t += 100) {
    const a = window.document.getElementById('gameArea');
    const btn = a && a.querySelector(PICK_SEL);
    if (btn) return btn;
    await sleep(100);
  }
  return null;
}

for (const id of ['seq-zahlenfolgen', 'seq-wortreihe', 'seq-handbewegungen']) {
  window.startModule(id);
  await sleep(60);
  window._startGame();

  const first = await waitForPicks();
  check(!!first, `${id}: Antwortphase nicht erreicht`);
  if (!first) { window.navigateTo('menu'); await sleep(40); continue; }

  // (a) Überlebt ein Knopf 800 ms Uhrlauf, ohne ersetzt zu werden?
  //     Das ist der eigentliche Regressionstest: vorher wurde der
  //     Spielbereich alle 250 ms komplett neu gebaut.
  await sleep(800);
  const survived = window.document.contains(first);
  check(survived, `${id}: Knopf wurde während der laufenden Uhr aus dem DOM ` +
                  `entfernt – Klicks gehen dadurch verloren`);

  // (b) Kommen langsame Klicks (180 ms zwischen down und up) an?
  //     Über mehrere Runden hinweg, weil eine Runde nur „Niveau" Slots hat.
  // Gemessen wird der erste Klick einer Runde: die Antwortreihe ist dann
  // garantiert leer, also kann weder eine Dublette noch eine schon volle Reihe
  // die Eingabe zu Recht abweisen. Bleibt als einzige Erklärung für einen
  // verschluckten Klick der Neuaufbau des Spielbereichs.
  let accepted = 0, attempted = 0;
  for (let round = 0; round < 5; round++) {
    let a = null, btn = null;
    for (let t = 0; t < 12000; t += 100) {
      a = window.document.getElementById('gameArea');
      btn = a && a.querySelector(PICK_SEL);
      if (btn && a.querySelectorAll('[onclick^="G(\'remove\'"]').length === 0) break;
      btn = null;
      await sleep(100);
    }
    if (!btn) break;
    attempted++;

    btn.dispatchEvent(new window.MouseEvent('mousedown', { bubbles: true }));
    await sleep(180);
    // Im Browser entsteht ein click nur, wenn das Element noch dasselbe ist.
    if (window.document.contains(btn)) {
      btn.dispatchEvent(new window.MouseEvent('mouseup', { bubbles: true }));
      btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    }
    await sleep(60);

    const a2 = window.document.getElementById('gameArea');
    const filled = a2 ? a2.querySelectorAll('[onclick^="G(\'remove\'"]').length : 0;
    if (filled > 0) accepted++;

    // Rest der Runde zügig abschließen, damit die nächste Runde beginnt
    for (let k = 0; k < 12; k++) {
      const aa = window.document.getElementById('gameArea');
      const opts = aa ? aa.querySelectorAll(PICK_SEL) : [];
      const f = aa ? aa.querySelectorAll('[onclick^="G(\'remove\'"]').length : 0;
      if (!opts.length || f === 0) break;
      opts[f % opts.length].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
      await sleep(50);
    }
  }
  check(attempted > 0 && accepted === attempted,
        `${id}: nur ${accepted} von ${attempted} langsamen Klicks kamen an`);
  clickTest.push(`${id}: ${accepted}/${attempted}`);

  window.navigateTo('menu');
  await sleep(40);
}

// ─── Jede Eingabe muss angenommen werden, auch Wiederholungen ─────────
// Die „keine Dubletten"-Regel gilt für das ERZEUGEN der Aufgabe, nicht für
// die Eingabe. Eine Eingabe stillschweigend zu verweigern sieht für das Kind
// aus wie ein defekter Knopf.
for (const id of ['seq-zahlenfolgen', 'seq-wortreihe', 'sim-gesichter']) {
  window.startModule(id);
  await sleep(60);
  window._startGame();
  if (!await waitForPicks(12000)) { check(false, `${id}: Antwortphase nicht erreicht`); continue; }

  // Dieselbe Auswahl mehrfach antippen und zählen, wie viele Slots sich füllen
  const a = window.document.getElementById('gameArea');
  const first = a.querySelectorAll(PICK_SEL)[0];
  const slots = () => {
    const g = window.document.getElementById('gameArea');
    return g ? g.querySelectorAll('[onclick^="G(\'remove\'"]').length : 0;
  };
  first.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await sleep(60);
  const afterFirst = slots();
  const again = window.document.getElementById('gameArea').querySelectorAll(PICK_SEL)[0];
  again.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await sleep(60);
  const afterSecond = slots();

  check(afterFirst === 1, `${id}: erste Eingabe wurde nicht angenommen`);
  check(afterSecond === 2 || !window.document.getElementById('gameArea').querySelector(PICK_SEL),
        `${id}: dieselbe Auswahl ein zweites Mal wurde abgewiesen ` +
        `(${afterFirst} → ${afterSecond} Felder)`);
  dupTest.push(`${id}: ${afterFirst}→${afterSecond}`);

  window.navigateTo('menu');
  await sleep(40);
}

// ─── Sternenreihe zeigt das beste Niveau, ohne Text ───────────────────
// Deterministisch: die gezeigte Folge wird aus dem DOM gelesen und korrekt
// eingegeben. Damit ist zugleich der Weg „richtige Antwort" abgedeckt.
{
  window.startModule('seq-zahlenfolgen');
  await sleep(60);
  window._startGame();
  await sleep(120);
  check(!window.document.getElementById('gameArea').textContent.includes('⭐'),
        'Vor der ersten gelösten Runde werden bereits Sterne gezeigt');

  // Zeigephase abwarten und die Ziffern ablesen
  let shown = null;
  for (let t = 0; t < 12000; t += 60) {
    const a = window.document.getElementById('gameArea');
    const el = a && a.querySelector('[data-phase="show"]');
    if (el) {
      const digits = el.textContent.replace(/[^0-9]/g, '');
      if (digits) { shown = digits.split('').map(Number); break; }
    }
    await sleep(60);
  }
  check(!!shown, 'Zeigephase lieferte keine ablesbare Zahlenfolge');

  if (shown) {
    if (!await waitForPicks(12000)) check(false, 'Antwortphase nicht erreicht');
    for (const n of shown) {
      const a = window.document.getElementById('gameArea');
      const btn = a && [...a.querySelectorAll(PICK_SEL)]
        .find(e => e.getAttribute('onclick') === `G('pick',${n})`);
      if (!btn) { check(false, `Ziffer ${n} nicht anklickbar`); break; }
      btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
      await sleep(60);
    }
    await sleep(700);   // Auswertung + Rückmeldung abwarten

    const a = window.document.getElementById('gameArea');
    check(a.textContent.includes('✅'),
          `Korrekt eingegebene Folge ${shown.join('')} wurde nicht als richtig gewertet`);

    const starEl = a.querySelector('[aria-label^="Bestes Niveau"]');
    check(!!starEl, 'Nach einer gelösten Runde fehlt die Sternenreihe');
    if (starEl) {
      const n = (starEl.textContent.match(/⭐/g) || []).length;
      const claimed = Number(starEl.getAttribute('aria-label').replace(/\D+/g, ''));
      check(n === shown.length,
            `${n} Sterne für ein gelöstes Niveau ${shown.length}`);
      check(n === claimed, `Sternenzahl ${n} passt nicht zum Bestwert ${claimed}`);
      check(starEl.textContent.replace(/[⭐\s]/g, '') === '',
            'Die Sternenreihe enthält Text');
      starTest.push(`Niveau ${shown.length} gelöst → ${n} Sterne`);
    }
  }
  window.navigateTo('menu');
  await sleep(40);
}

// ─── Rhythmus: hören, nachklopfen, bewertet werden ────────────────────
// Das Muster wird deterministisch gemacht (Math.random → 0), damit die
// Schlagzeitpunkte im Voraus bekannt sind: Niveau 3 ergibt dann zwei gleiche
// Abstände von einer Grundeinheit.
{
  const echtesRandom = window.Math.random;
  window.Math.random = () => 0;
  const UNIT = 380;

  window.startModule('seq-rhythmus');
  await sleep(60);
  window._startGame();
  await sleep(80);

  const phaseOf = () => {
    const a = window.document.getElementById('gameArea');
    const p = a && a.querySelector('[data-phase]');
    return p ? p.getAttribute('data-phase') : null;
  };

  check(phaseOf() === 'listen', `Rhythmus startet in Phase "${phaseOf()}" statt "listen"`);

  // Klopfphase abwarten
  for (let t = 0; t < 9000; t += 100) {
    if (phaseOf() === 'tap') break;
    await sleep(100);
  }
  check(phaseOf() === 'tap', 'Klopfphase wurde nicht erreicht');
  check(!!window.document.getElementById('rhyPad'), 'Tippfläche fehlt');

  // Eine Taste ohne Leerzeichen-Code darf nicht als Schlag zählen
  window.document.dispatchEvent(new window.KeyboardEvent('keydown', { code: 'KeyA', bubbles: true }));
  await sleep(30);
  const dots = () => (window.document.getElementById('rhyDots') || { textContent: '' }).textContent;
  check(dots() === '', 'Eine beliebige Taste wurde als Schlag gezählt');

  // Muster korrekt nachklopfen: drei Schläge im Abstand einer Grundeinheit
  for (let i = 0; i < 3; i++) {
    window.document.dispatchEvent(new window.KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
    if (i < 2) await sleep(UNIT);
  }
  check(dots() === '●●●', `Nach drei Schlägen zeigt der Zähler "${dots()}"`);

  // Nach der Stille wird ausgewertet
  for (let t = 0; t < 5000; t += 100) {
    if (phaseOf() === 'feedback') break;
    await sleep(100);
  }
  const a = window.document.getElementById('gameArea');
  check(phaseOf() === 'feedback', 'Nach dem Klopfen folgt keine Rückmeldung');
  check(a && a.textContent.includes('✅'),
        `Korrekt nachgeklopftes Muster wurde nicht als richtig gewertet ` +
        `(Rückmeldung: ${a ? JSON.stringify(a.textContent.trim()) : '–'})`);

  const st = a && a.querySelector('[aria-label^="Bestes Niveau"]');
  const sterne = st ? (st.textContent.match(/⭐/g) || []).length : 0;
  check(sterne === 3, `Nach gelöstem Niveau 3 zeigt die Sternenreihe ${sterne} Sterne`);
  rhythmTest.push(`Niveau 3 nachgeklopft → ${sterne} Sterne`);

  window.Math.random = echtesRandom;
  window.navigateTo('menu');
  await sleep(40);
}

// ─── Jede Runde muss die Aufgabe auch zeigen ──────────────────────────
// Nach einer Antwort folgen Feedback → Zeigen → Pause → Antworten. Wird eine
// dieser Phasen nicht gezeichnet, läuft sie unsichtbar ab und am Ende wird
// eine Folge abgefragt, die nie zu sehen war.
for (const id of ['seq-zahlenfolgen', 'seq-wortreihe', 'sim-gesichter']) {
  window.startModule(id);
  await sleep(60);
  window._startGame();
  await sleep(60);

  const seen = { show: 0, answer: 0 };
  let rounds = 0, missedShow = 0;

  for (let round = 0; round < 3; round++) {
    // auf die Antwortphase warten
    let btn = null;
    for (let t = 0; t < 15000; t += 100) {
      const a = window.document.getElementById('gameArea');
      btn = a && a.querySelector(PICK_SEL);
      if (btn) break;
      await sleep(100);
    }
    if (!btn) break;
    seen.answer++;

    // absichtlich falsch antworten: rückwärts anklicken, bis die Reihe voll ist
    for (let k = 0; k < 12; k++) {
      const a = window.document.getElementById('gameArea');
      const opts = a ? [...a.querySelectorAll(PICK_SEL)] : [];
      if (!opts.length) break;
      opts[opts.length - 1 - (k % opts.length)]
        .dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
      await sleep(60);
      const a2 = window.document.getElementById('gameArea');
      if (!a2 || !a2.querySelector(PICK_SEL)) break;   // Runde vorbei
    }
    rounds++;

    // Wird die nächste Aufgabe sichtbar gezeigt, bevor wieder geantwortet wird?
    let sawShow = false;
    for (let t = 0; t < 15000; t += 100) {
      const a = window.document.getElementById('gameArea');
      if (a && a.querySelector('[data-phase="show"]')) { sawShow = true; seen.show++; break; }
      if (a && a.querySelector(PICK_SEL)) break;   // schon wieder Antwortphase
      await sleep(100);
    }
    if (!sawShow) missedShow++;
  }

  check(rounds > 0, `${id}: keine Runde abgeschlossen`);
  check(missedShow === 0,
        `${id}: in ${missedShow} von ${rounds} Runden wurde die Aufgabe nie ` +
        `angezeigt, aber die Antwort verlangt`);
  phaseTest.push(`${id}: ${seen.show}/${rounds} Aufgaben gezeigt`);

  window.navigateTo('menu');
  await sleep(40);
}

// ─── Statistik und Profil öffnen ──────────────────────────────────────
errors.length = 0;
window.navigateTo('stats');
await sleep(250);
check(main.innerHTML.includes('training-container') || main.innerHTML.length > 200,
      'Statistik-Ansicht ist leer');

window.navigateTo('radar');
await sleep(250);
check(main.innerHTML.includes('Kognitives Profil'), 'Profil-Ansicht ist leer');
check(errors.length === 0, `Auswertungsansichten: ${errors.join(' | ')}`);

// Balkenbreiten dürfen nie über 100% laufen – das war der sichtbare Effekt
// des kaputten Score-Modells.
const overflow = [...main.querySelectorAll('[style*="width:"]')]
  .map(el => (el.getAttribute('style').match(/width:(\d+(?:\.\d+)?)%/) || [])[1])
  .filter(w => w !== undefined && Number(w) > 100);
check(overflow.length === 0, `Balken über 100%: ${overflow.join(', ')}`);

// ─── Persistenz ───────────────────────────────────────────────────────
const storage = await import('../src/core/storage.js');
const scores = await storage.loadAllScores();
check(scores.length > 0, 'Es wurde kein einziger Spielstand gespeichert');
for (const s of scores) {
  check(s.accuracy >= 0 && s.accuracy <= 100,
        `${s.moduleId}: accuracy=${s.accuracy} liegt außerhalb von 0–100`);
  check(s.kind === 'count' || s.kind === 'percent',
        `${s.moduleId}: kind="${s.kind}" ist ungültig`);
  if (s.kind === 'count') {
    check(s.cumScore <= s.cumTotal,
          `${s.moduleId}: mehr Treffer (${s.cumScore}) als Versuche (${s.cumTotal})`);
  }
}
check(adaptiveSeen === MINIMAL.length,
      `Es wurden ${adaptiveSeen} Module mit Minimal-Hülle erkannt, erwartet ${MINIMAL.length}`);
console.log(`   ${scores.length} Modul-Spielstände gespeichert, alle mit gültiger accuracy`);
console.log(`   ${adaptiveSeen} Module mit Minimal-Hülle`);
console.log(`   Langsame Klicks während laufender Uhr: ${clickTest.join(', ')}`);
console.log(`   Sichtbarkeit der Aufgabe pro Runde: ${phaseTest.join(', ')}`);
console.log(`   Wiederholte Eingabe angenommen: ${dupTest.join(', ')}`);
console.log(`   Sternenreihe: ${starTest.join(', ')}`);
console.log(`   Rhythmus: ${rhythmTest.join(', ') || 'nicht geprüft'}`);
// Der Punktestand darf auch nicht als leere Hülle zurückbleiben
check(adaptiveSeen === MINIMAL.length, `Es wurden ${adaptiveSeen} Module mit Minimal-Hülle geprüft, erwartet ${MINIMAL.length}`);

// ─── Ergebnis ─────────────────────────────────────────────────────────
if (problems.length) {
  console.error(`\n✗ ${problems.length} Problem(e):\n`);
  problems.forEach(p => console.error('   • ' + p));
  process.exit(1);
}
console.log(`\n✓ Alle ${modules.length} Module im DOM geöffnet, angespielt und ohne Konsolenfehler beendet`);
console.log('✓ Statistik und kognitives Profil rendern sauber\n');
process.exit(0);
