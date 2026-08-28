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

// Skripte manuell ausführen – jsdom lädt lokale <script src> nicht von selbst.
// Reihenfolge wie in index.html: erst die Sprachaufnahmen, dann die App.
for (const l of ['de', 'ru']) {
  window.eval(readFileSync(root + `dist/audio-${l}.js`, 'utf8'));
}
window.eval(readFileSync(root + 'dist/logik-trainer.min.js', 'utf8'));
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

// Ohne hinterlegtes Geburtsjahr fragt die App zuerst danach – ohne Alter
// ließe sich kein Ergebnis einordnen und die Altersfilterung griffe nicht.
// Für die übrigen Prüfungen wird ein Schulkind angenommen, damit alle
// Module im Angebot sind.
{
  const S = window.LOGIK_SETTINGS;
  // Die App öffnet mit der Einführung, und zwar bei JEDEM Start: sie wird in
  // Abständen von Wochen benutzt, bis dahin ist der Ablauf meist wieder
  // vergessen. Wer weiterarbeiten will, ist mit einem Klick in der Leiste dort.
  if (!/vier Schritten|four steps|четырёх шагов/.test(main.textContent)) {
    problems.push('Beim Öffnen erscheint nicht die Einführung, sondern: ' +
                  main.textContent.replace(/\s+/g, ' ').trim().slice(0, 60));
  }
  if (window.LOGIK_ENGINE.view !== 'intro') {
    problems.push(`Die Startansicht ist "${window.LOGIK_ENGINE.view}" statt "intro"`);
  }
  // Sobald es ans Testen geht, wird nach dem Alter gefragt.
  window.navigateTo('groups');
  await sleep(150);
  if (!main.textContent.includes('Wie alt')) {
    problems.push('Ohne Geburtsjahr erscheint beim Testen die Altersabfrage nicht');
  }
  S.set('birthYear', new Date().getFullYear() - 9);
  S.set('birthMonth', 7);
  window.navigateTo('menu');
  await sleep(120);
  if (main.textContent.includes('Wie alt')) {
    problems.push('Die Altersabfrage bleibt stehen, obwohl ein Geburtsjahr gesetzt wurde');
  }
}

let adaptiveSeen = 0;
const clickTest = [];
const phaseTest = [];
const dupTest = [];
const starTest = [];
const rhythmTest = [];
const audioTest = [];
const kofferTest = [];
const methodTest = [];
const resetTest = [];
const einstellTest = [];
const ablaufTest = [];
const umfangTest = [];
const verlaufTest = [];
const sudokuTest = [];
const planTest = [];
const navTest = [];
const ziehTest = [];
// Diese Module laufen mit der Minimal-Hülle: im Spiel nur die Aufgabe.
const MINIMAL = ['seq-zahlenfolgen', 'seq-zahlenfolgen-audio', 'seq-wortreihe',
                 'seq-wortreihe-audio', 'seq-handbewegungen', 'seq-koffer-packen',
                 'seq-koffer-packen-audio', 'sim-gesichter', 'seq-rhythmus'];
// Merkspannen-Tests mit Auswahl-Eingabe (Rhythmus klopft stattdessen)
const ADAPTIVE = MINIMAL.filter(id => id !== 'seq-rhythmus');

function check(cond, msg) { if (!cond) problems.push(msg); }

// ─── Menü ─────────────────────────────────────────────────────────────
check(!main.innerHTML.includes('Bundle fehlt'),
      'Der „Bundle fehlt"-Hinweis erscheint, obwohl der Bundle geladen ist');
check(typeof window.navigateTo === 'function',
      'Der Bundle installiert window.navigateTo nicht');
check(main.innerHTML.length > 300, 'Startseite wurde nicht gerendert');

// Die Startseite zeigt die fünf Gruppen, die vollständige Liste steht unter
// „Testen › Alle Aufgaben". Vorher stand beides untereinander auf einer Seite.
{
  const gruppen = main.querySelectorAll('.card');
  check(gruppen.length === 5, `Gruppenseite zeigt ${gruppen.length} Karten statt 5`);
  window.navigateTo('modules');
  await sleep(200);
}
const cards = main.querySelectorAll('.card');
check(cards.length >= 29, `Aufgabenliste zeigt nur ${cards.length} Karten`);

// Cache-Kennung: das Script-Tag muss ein ?v= tragen und das Menü es anzeigen,
// damit erkennbar bleibt, welcher Stand im Browser läuft.
const tag = window.document.querySelector('script[src*="logik-trainer"]');
const vm = tag && (tag.getAttribute('src') || '').match(/[?&]v=([0-9a-f]{8})/);
check(!!vm, 'Das Script-Tag in index.html trägt keine Build-Kennung (?v=…)');
check(vm && main.textContent.includes(vm[1]),
      'Das Menü zeigt die Build-Kennung nicht an');

// Sprachaufnahmen: als eigene Dateien geladen, nicht im Bundle. Sie stehen
// fest in index.html, damit sie beim Speichern der Seite mitkommen.
check(!!window.LOGIK_AUDIO, 'window.LOGIK_AUDIO fehlt – Sprachaufnahmen nicht geladen');
for (const l of ['de', 'ru']) {
  check(window.LOGIK_AUDIO && window.LOGIK_AUDIO[l], `Aufnahmen für "${l}" fehlen`);
  const tag2 = window.document.querySelector(`script[src^="dist/audio-${l}.js"]`);
  check(!!tag2, `index.html bindet dist/audio-${l}.js nicht ein`);
  check(tag2 && /\?v=[0-9a-f]{8}/.test(tag2.getAttribute('src')),
        `dist/audio-${l}.js ohne Cache-Kennung eingebunden`);
}
// ─── Jedes Modul öffnen und anspielen ─────────────────────────────────
const { modules } = await import('../src/data/modules.js');

for (const m of modules) {
  errors.length = 0;
  window.startModule(m.id);
  await sleep(60);

  const intro = main.innerHTML;
  check(intro.includes('training-container'), `${m.id}: Intro nicht gerendert`);

  // Der Startbildschirm zeigt nur, was zum Loslegen nötig ist. Alles
  // Erklärende liegt hinter dem Symbol-Link auf einer eigenen Seite.
  const introTxt = main.textContent.replace(/\s+/g, ' ');
  for (const wort of ['Einflüsse', 'Hypothesen', 'Kognitive Faktoren']) {
    check(!introTxt.includes(wort),
          `${m.id}: „${wort}" steht auf dem Startbildschirm statt hinter dem Symbol`);
  }
  check(introTxt.length < 1400,
        `${m.id}: Startbildschirm ist mit ${introTxt.length} Zeichen überladen`);
  check(!!main.querySelector('.info-link'),
        `${m.id}: Symbol-Link zu den Schwerpunkten fehlt`);

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
  // Drag-Module bedienen über data-zieh, nicht über onclick=G(…).
  // Rover hat G('tap'); Drehen bei Dreiecken hat G('drehe'), aber nur mit Stück in der Hand.
  check(clicks > 0 || m.id === 'sim-dreiecke' || m.id === 'sim-tangram'
        || m.id === 'plan-geschichten',
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

// ─── Zahlenfolgen mit Ansage: nichts zu sehen, alles zu hören ─────────
// Der Kern der Variante: während der Ansage dürfen keine Ziffern auf dem
// Schirm stehen, sonst wäre es doch wieder ein Sehtest.
{
  window.startModule('seq-zahlenfolgen-audio');
  await sleep(60);
  const intro = main.innerHTML;
  check(/data-role="instruction"/.test(intro), 'Ansage-Variante ohne Anleitung');
  check(/hörst/.test(intro), 'Die Anleitung erwähnt das Hören nicht');

  window._startGame();
  await sleep(150);
  const a = window.document.getElementById('gameArea');
  const showEl = a && a.querySelector('[data-phase="show"]');
  check(!!showEl, 'Ansage-Variante erreicht die Zeigephase nicht');
  if (showEl) {
    const ziffern = showEl.textContent.replace(/[^0-9]/g, '');
    check(ziffern === '',
          `Während der Ansage stehen Ziffern auf dem Schirm: "${ziffern}"`);
  }

  // Antwortphase: die Zifferntastatur muss trotzdem da sein
  const btn = await waitForPicks(14000);
  check(!!btn, 'Ansage-Variante erreicht die Antwortphase nicht');
  const a2 = window.document.getElementById('gameArea');
  check(a2 && a2.querySelectorAll(PICK_SEL).length === 10,
        `Antwortphase zeigt ${a2 ? a2.querySelectorAll(PICK_SEL).length : 0} statt 10 Ziffern`);
  audioTest.push('Ansage ohne sichtbare Ziffern, 10 Eingabetasten');

  window.navigateTo('menu');
  await sleep(40);
}

// ─── Koffer packen bleibt beim Fehler derselbe Koffer ─────────────────
{
  window.startModule('seq-koffer-packen');
  await sleep(60);
  window._startGame();

  const gezeigt = async () => {
    for (let t = 0; t < 14000; t += 100) {
      const a = window.document.getElementById('gameArea');
      const el = a && a.querySelector('[data-phase="show"]');
      if (el) return [...el.querySelectorAll('span')].map(s => s.textContent.trim())
                 .filter(Boolean);
      await sleep(100);
    }
    return null;
  };

  const runde1 = await gezeigt();
  check(!!runde1 && runde1.length >= 2, 'Koffer zeigt keine Dinge');

  // absichtlich falsch antworten und die nächste Zeigephase abwarten
  if (await waitForPicks(14000)) {
    for (let k = 0; k < 12; k++) {
      const a = window.document.getElementById('gameArea');
      const opts = a ? [...a.querySelectorAll(PICK_SEL)] : [];
      if (!opts.length) break;
      opts[opts.length - 1].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
      await sleep(60);
      const b = window.document.getElementById('gameArea');
      if (!b || !b.querySelector(PICK_SEL)) break;
    }
  }
  await sleep(2900);                       // Rückmeldung abwarten
  const runde2 = await gezeigt();
  check(!!runde2, 'Nach dem Fehler folgt keine neue Zeigephase');

  if (runde1 && runde2) {
    const gemeinsam = runde2.filter(x => runde1.includes(x)).length;
    check(gemeinsam >= Math.min(runde1.length, runde2.length),
          `Nach dem Fehler wurde der Koffer neu gepackt: ` +
          `[${runde1}] → [${runde2}] (nur ${gemeinsam} gemeinsam)`);
    kofferTest.push(`[${runde1.join(',')}] → [${runde2.join(',')}]`);
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

// ─── Fördermethoden: Übersicht, Einzelseite, Verlinkung ───────────────
{
  // Der Zugang liegt jetzt in der Kopfleiste, nicht mehr als Knopf auf der
  // Startseite: wer in der Statistik war, musste vorher erst zurück.
  const leiste = window.document.getElementById('mainNav');
  check(!!leiste, 'Es gibt keine Navigationsleiste');
  check(leiste && /_nav\('methods'/.test(leiste.innerHTML),
        'Die Navigationsleiste führt nicht zu den Fördermethoden');

  window.navigateTo('methods');
  await sleep(150);
  const karten = main.querySelectorAll('[onclick*="methodId"]');
  check(karten.length > 0, 'Die Methodenübersicht ist leer');

  // Jede Methodenseite einmal öffnen und auf Vollständigkeit prüfen
  const { methods } = await import('../src/data/methods/index.js');
  let mitLinks = 0, mitMaterial = 0, mitBild = 0;
  for (const m of methods) {
    window.navigateTo('method', { methodId: m.id });
    await sleep(60);
    const txt = main.textContent.replace(/\s+/g, ' ');
    check(txt.includes('So wird geübt'), `${m.id}: Anleitung fehlt auf der Seite`);
    check(main.querySelectorAll('a[target="_blank"]').length > 0 || !(m.links || []).length,
          `${m.id}: Links werden nicht dargestellt`);
    check(!/undefined|\[object Object\]/.test(txt), `${m.id}: unaufgelöste Platzhalter im Text`);
    if ((m.links || []).length) mitLinks++;
    if ((m.products || []).length) mitMaterial++;
    if (m.svg) mitBild++;
  }
  methodTest.push(`${methods.length} Seiten · ${mitLinks} mit Links · ` +
                  `${mitMaterial} mit Material · ${mitBild} mit Zeichnung`);

  // Eine unbekannte id darf nicht ins Leere laufen
  window.navigateTo('method', { methodId: 'gibt-es-nicht' });
  await sleep(80);
  check(main.textContent.includes('Fördermethoden'),
        'Eine unbekannte Methoden-id führt nicht zurück zur Übersicht');

  // Verlinkung aus dem Info-Panel eines Moduls heraus
  // Die Förderpunkte stehen seit dem Umbau nicht mehr im Startbildschirm,
  // sondern auf der Schwerpunkte-Seite hinter dem Symbol.
  const { FOERDERUNG_LINKS } = await import('../src/data/foerderung-links.js');
  let verlinkteModule = 0;
  const { modules: alleModule } = await import('../src/data/modules.js');
  for (const mod of alleModule) {
    window.navigateTo('insights', { moduleId: mod.id, step: 'intro' });
    await sleep(60);
    if (main.querySelector('a[onclick*="methodId"]')) verlinkteModule++;
    window.navigateTo('menu');
    await sleep(30);
  }
  methodTest.push(`${Object.keys(FOERDERUNG_LINKS).length} Förderpunkte zugeordnet, ` +
                  `Links in ${verlinkteModule}/${alleModule.length} Modulen`);
}

// ─── Sudoku ohne Prüfen-Knopf ─────────────────────────────────────────
// Das letzte gesetzte Symbol wertet aus. Ein zusätzlicher Klick sagt nichts
// aus, was das volle Gitter nicht schon sagt – und der Radiergummi gehört
// in die Symbolreihe, nicht unter das Gitter.
{
  const S = window.LOGIK_SETTINGS;
  S.set('rounds', 3); S.set('feedbackOk', 0.3); S.set('feedbackWrong', 0.3);
  window.startModule('plan-sudoku');
  await sleep(120);
  window._startGame();
  await sleep(300);

  const area = window.document.getElementById('gameArea');
  const html = area.innerHTML;
  check(!/G\('check'\)/.test(html), 'Sudoku zeigt weiterhin einen Prüfen-Knopf');
  check(!/G\('nextPuzzle'\)/.test(html), 'Sudoku zeigt weiterhin einen Knopf für ein neues Rätsel');
  check(/G\('clearCell'\)/.test(html) && /dashed/.test(html),
        'in der Symbolreihe fehlt das leere Feld zum Löschen');
  check(/adv-bar|adv-ring/.test(html), 'Sudoku zeigt keine ablaufende Zeit');

  // Vollständig und richtig füllen – muss von selbst auswerten
  const gd = window.LOGIK_ENGINE.gameState.gd;
  const p = gd.puzzle;
  for (let r = 0; r < p.n; r++) {
    for (let c = 0; c < p.n; c++) {
      if (p.given[r][c] === null) {
        window.G('selectCell', r, c);
        window.G('placeSymbol', p.solution[r][c]);
      }
    }
  }
  await sleep(60);
  check(gd.phase === 'feedback',
        `volles Gitter löst keine Auswertung aus (Phase "${gd.phase}")`);
  check(gd.geloest === true, 'richtig gefülltes Gitter gilt nicht als gelöst');
  sudokuTest.push('letztes Symbol wertet aus, Radiergummi in der Symbolreihe');
  window.navigateTo('menu');
  await sleep(120);
  S.reset();
}

// ─── Aufnehmen, bewegen, ablegen ──────────────────────────────────────
// Vier Module warten auf diese Bedienung. Sie hat zwei Wege zum selben Ziel:
// Antippen (verlässlich, auch mit zittriger Hand) und Ziehen (bequemer).
// Beide enden in derselben Handlung – geprüft wird, dass beide ankommen.
{
  const S = window.LOGIK_SETTINGS;
  S.set('rounds', 9); S.set('feedbackOk', 0.3); S.set('feedbackWrong', 0.3);
  window.startModule('plan-geschichten');
  await sleep(150);
  window._startGame();
  await sleep(400);

  const area = () => window.document.getElementById('gameArea');
  const klick = el => el && el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  const gd = () => window.LOGIK_ENGINE.gameState.gd;

  check(!!gd().loesung && gd().loesung.length >= 3,
        'Die Reihenfolge-Aufgabe erzeugt keine Bildfolge');
  const anzahl = gd().loesung.length;

  // Antippen: erst das Bild, dann der Platz
  klick(area().querySelector('[data-zieh]'));
  await sleep(120);
  klick(area().querySelector('[data-ablage^="platz:"]'));
  await sleep(150);
  check(gd().plaetze.filter(Boolean).length === 1,
        'Antippen von Bild und Platz legt das Bild nicht ab');
  check(gd().vorrat.length === anzahl - 1,
        'Das abgelegte Bild verschwindet nicht aus dem Vorrat');

  // Zurückstellen in den Vorrat
  klick(area().querySelector('[data-zieh]'));
  await sleep(100);
  klick(area().querySelector('[data-ablage="vorrat"]'));
  await sleep(150);
  check(gd().plaetze.filter(Boolean).length === 0 && gd().vorrat.length === anzahl,
        'Ein abgelegtes Bild lässt sich nicht zurückstellen');

  // Zweimal dasselbe Bild antippen hebt nur die Auswahl auf. Das ist etwas
  // anderes als „in den Vorrat legen": ein Zug würde das Bild ans Ende der
  // Reihe schieben. An der Anzahl allein wäre der Unterschied nicht zu sehen –
  // deshalb wird die Reihenfolge verglichen.
  const vorher = gd().vorrat.join(',');
  const kid = gd().vorrat[0];
  klick(area().querySelector(`[data-zieh="${kid}"]`));
  await sleep(100);
  klick(area().querySelector(`[data-zieh="${kid}"]`));
  await sleep(150);
  check(gd().vorrat.join(',') === vorher,
        `Zweimal Antippen verschiebt das Bild statt nur die Auswahl aufzuheben: ` +
        `${vorher} → ${gd().vorrat.join(',')}`);

  // Ziehen: Schattenbild folgt dem Zeiger und landet auf dem Ziel
  if (typeof window.PointerEvent === 'function') {
    const q = area().querySelector('[data-zieh]');
    q.dispatchEvent(new window.PointerEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10 }));
    window.document.dispatchEvent(new window.PointerEvent('pointermove', { bubbles: true, clientX: 90, clientY: 70 }));
    await sleep(60);
    check(!!window.document.querySelector('[data-schatten]'),
          'Beim Ziehen erscheint kein Schattenbild');
    // jsdom kennt elementFromPoint nicht – das Ziel wird hier vorgegeben
    window.document.elementFromPoint = () => area().querySelector('[data-ablage^="platz:"]');
    window.document.dispatchEvent(new window.PointerEvent('pointerup', { bubbles: true, clientX: 90, clientY: 70 }));
    await sleep(200);
    check(gd().plaetze.filter(Boolean).length === 1, 'Ziehen legt das Bild nicht ab');
    check(!window.document.querySelector('[data-schatten]'),
          'Das Schattenbild bleibt nach dem Ablegen liegen');
    delete window.document.elementFromPoint;
  }

  // Richtig legen wird als gelöst erkannt
  window.G('restart');
  await sleep(300);
  const soll = gd().loesung.map(x => x.id);
  for (let i = 0; i < soll.length; i++) {
    klick(area().querySelector(`[data-zieh="${soll[i]}"]`));
    await sleep(60);
    klick(area().querySelector(`[data-ablage="platz:${i}"]`));
    await sleep(80);
  }
  await sleep(250);
  check(gd().geloest === true, 'Die richtige Reihenfolge wird nicht als gelöst erkannt');

  ziehTest.push(`Antippen, Zurückstellen und Ziehen führen zum selben Zug (${anzahl} Bilder)`);
  window.navigateTo('menu');
  await sleep(200);
  S.reset();
}

// ─── Kopfnavigation ───────────────────────────────────────────────────
// Neun Seiten brauchen eine Leiste. Vorher lagen sie als Knopfreihe auf der
// Startseite: wer in der Statistik war, musste erst zurück, um in die
// Einstellungen zu kommen.
{
  const leiste = window.document.getElementById('mainNav');
  check(!!leiste, 'Es gibt keine Navigationsleiste');

  // Die Leiste führt zu allen Arbeitsseiten. „Über die App" steht bewusst
  // nicht darin: der Titel im Kopf führt schon dorthin, und ein Eintrag, der
  // dasselbe tut wie das direkt daneben, kostet nur Breite.
  const ziele = ['plan', 'groups', 'modules', 'methods', 'stats', 'radar', 'settings'];
  const fehlend = ziele.filter(v => !new RegExp("_nav\\('" + v + "'").test(leiste.innerHTML));
  check(fehlend.length === 0, `Die Leiste führt nicht zu: ${fehlend.join(', ')}`);

  // Der aktive Eintrag muss die aktuelle Seite anzeigen, sonst weiß niemand,
  // wo er ist – die Seiten haben bewusst keine Überschrift mehr.
  for (const v of ziele) {
    window.navigateTo(v);
    await sleep(220);
    const aktiv = window.document.querySelectorAll('#mainNav .nav-active');
    check(aktiv.length > 0, `Auf "${v}" ist kein Eintrag der Leiste als aktiv markiert`);
  }

  // Die beiden Seiten ohne Leisteneintrag müssen anders erreichbar sein,
  // sonst sind sie tot.
  window.navigateTo('intro');
  await sleep(300);
  check(/navigateTo\('background'\)/.test(main.innerHTML),
        'Von der Einführung führt kein Weg zur Seite über die Herkunft');

  // Die Leiste sitzt im Kopf, nicht als eigene Zeile darunter
  check(!!window.document.querySelector('header #mainNav'),
        'Die Navigationsleiste sitzt nicht im Kopfbereich');

  // Aufklappen muss wirklich funktionieren. Vorher prüfte der Test nur, dass
  // die Ziele im HTML stehen – das Menü ging beim Klick auf und im selben
  // Augenblick wieder zu, weil der Außenklick-Wächter den ausgetauschten
  // Knopf für „daneben" hielt. Im HTML sah alles richtig aus.
  const gruppenZahl = window.document.querySelectorAll('#mainNav .nav-group').length;
  for (let i = 0; i < gruppenZahl; i++) {
    // Über den Platz suchen, nicht über den Text: beim Aufklappen wechselt
    // der Pfeil von ▾ auf ▴, und die Leiste wird dabei neu gezeichnet.
    const gruppe = window.document.querySelectorAll('#mainNav .nav-group')[i];
    const knopf = gruppe.querySelector('.nav-item');
    const name = knopf.querySelector('.nav-label').textContent.trim();
    knopf.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await sleep(120);

    const frisch = window.document.querySelectorAll('#mainNav .nav-group')[i];
    const drop = frisch && frisch.querySelector('.nav-drop');
    check(drop && drop.style.display !== 'none', `Das Untermenü "${name}" klappt beim Klick nicht auf`);
    if (drop && drop.style.display !== 'none') {
      check(drop.querySelectorAll('.nav-sub').length >= 2,
            `Das Untermenü "${name}" ist leer`);
    }
    // Ein Klick daneben schließt wieder
    window.document.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await sleep(100);
  }

  // Ein Eintrag im Untermenü muss auch tatsächlich hinführen – aufklappen
  // allein nützt nichts, wenn der Klick darauf ins Leere geht.
  {
    const gruppe = window.document.querySelector('#mainNav .nav-group');
    gruppe.querySelector('.nav-item')
      .dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await sleep(120);
    const eintrag = [...window.document.querySelectorAll('#mainNav .nav-sub')]
      .filter(b => b.offsetParent !== null || (b.closest('.nav-drop') || {}).style?.display !== 'none')
      .pop();
    const ziel = eintrag.querySelector('.nav-label').textContent.trim();
    eintrag.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await sleep(250);
    check(main.querySelectorAll('.card').length >= 29,
          `Der Untermenü-Eintrag "${ziel}" führt nicht zur Aufgabenliste`);
    const offene = [...window.document.querySelectorAll('#mainNav .nav-drop')]
      .filter(d => d.style.display !== 'none');
    check(offene.length === 0, 'Nach dem Klick im Untermenü bleibt es offen stehen');
  }

  // Jeder Eintrag trägt Text, nicht nur ein Symbol
  const ohneText = [...window.document.querySelectorAll('#mainNav .nav-item')]
    .filter(b => !(b.querySelector('.nav-label') || {}).textContent);
  check(ohneText.length === 0, `${ohneText.length} Leisteneinträge ohne Beschriftung`);

  // Keine Seite trägt unten noch Navigationsknöpfe – die Leiste ist immer da
  for (const v of ['intro', 'background', 'plan', 'groups', 'methods', 'stats', 'radar']) {
    window.navigateTo(v);
    await sleep(300);
    const nav = [...main.querySelectorAll('button')]
      .map(b => b.textContent.trim())
      .filter(b => /Zurück|Zum Menü|Zum Plan|Alle Methoden|Ganzes Profil|Назад|В меню|Back to|To the menu/.test(b));
    check(nav.length === 0,
          `Seite "${v}" hat unten noch Navigationsknöpfe: ${nav.join(', ')}`);
  }

  // Genau ein Gehirn im Kopf – appHeader trug bis eben ein zweites
  const h1 = window.document.querySelector('header h1');
  const hirne = (h1.textContent.match(/🧠/g) || []).length;
  check(hirne === 1, `Der Kopfbereich zeigt ${hirne} Gehirn-Symbole statt einem`);
  check(/navigateTo\('intro'\)/.test(h1.getAttribute('onclick') || ''),
        'Der Titel im Kopf führt nicht zur Einführung');

  navTest.push(`${ziele.length} Seiten in der Leiste im Kopf, keine Navigationsknöpfe am Seitenende`);
  window.navigateTo('groups');
  await sleep(200);
}

// ─── Einführung, Plan und der Weg von der Schwäche zur Übung ──────────
// Die App hatte alles, was man braucht, aber nichts, was es verbindet. Wer
// 29 Module und ein Profil mit 89 Faktoren vor sich hat, weiß nicht, womit
// er anfangen soll.
{
  window.navigateTo('intro');
  await sleep(300);
  check(/vier Schritten|четырёх шагов|four steps/.test(main.textContent),
        'Die Einführungsseite beschreibt den Ablauf nicht');
  check(/Stunden|часов|hours/.test(main.textContent),
        'Die Einführung sagt nicht, dass die Tests Zeit brauchen');

  window.navigateTo('plan');
  await sleep(500);
  check(main.textContent.length > 120, 'Die Plan-Ansicht ist leer');

  // Aus dem Plan muss ein Weg in die Übung führen – sonst endet er bei der
  // Feststellung, so wie das Profil vorher.
  const wege = [...main.querySelectorAll('[onclick]')]
    .map(e => e.getAttribute('onclick'))
    .filter(o => /factor|startModule|navigateTo/.test(o));
  check(wege.length > 0, 'Der Plan bietet keinen einzigen weiterführenden Schritt');

  // Faktorseite: sie muss die Module nennen, die den Faktor trainieren
  const { cognitiveFactors } = await import('../src/data/cognitive-factors.js');
  const mitModulen = Object.entries(cognitiveFactors).find(([, f]) => (f.modules || []).length);
  if (mitModulen) {
    window.navigateTo('factor', { factorId: mitModulen[0] });
    await sleep(400);
    check(main.querySelectorAll('[onclick^="startModule"]').length > 0,
          `Faktorseite ${mitModulen[0]} nennt kein Modul zum Üben`);
    planTest.push(`Einführung, Plan und Faktorseite erreichbar, ${wege.length} Wege aus dem Plan`);
  }
  window.navigateTo('menu');
  await sleep(300);
}

// ─── Fortschritt auch bei den Gruppen ─────────────────────────────────
// Vorher stand auf den Skalenkarten nur die Zahl der Module – die ist jeden
// Tag dieselbe. Gerade beim ersten Durchgang ist die wichtigste Frage:
// welche Gruppe fehlt noch?
{
  window.navigateTo('groups');
  await sleep(400);
  const gruppen = [...main.querySelectorAll('.card')]
    .filter(c => (c.getAttribute('onclick') || '').includes("navigateTo('scale'"));
  check(gruppen.length > 0, 'Das Menü zeigt keine Gruppenkarten');
  const mitStand = gruppen.filter(c => /\d+\/\d+/.test(c.textContent));
  check(mitStand.length === gruppen.length,
        `${gruppen.length - mitStand.length} Gruppenkarten ohne Angabe, wie viel davon erledigt ist`);
  planTest.push(`${gruppen.length} Gruppen mit Fortschrittsangabe`);
}

// ─── Kennzeichnung im Aufgabenmenü ────────────────────────────────────
// Ohne Marke sehen 29 Karten gleich aus, und nach zwei Wochen weiß niemand
// mehr, was schon dran war. Gespielte Module zeigen ihren Verlauf, noch
// nicht gespielte sagen das ausdrücklich – der Unterschied „noch nie"
// gegenüber „einmal schlecht" muss sichtbar bleiben.
{
  window.navigateTo('modules');
  await sleep(400);
  const karten = [...main.querySelectorAll('.card')];
  const mitVerlauf = karten.filter(c => c.querySelector('[role="img"]'));
  const offen = karten.filter(c => /noch nicht gespielt|ещё не играли|not played yet/.test(c.textContent));
  check(karten.length > 0, 'Aufgabenliste zeigt keine Karten');
  check(mitVerlauf.length > 0, 'kein gespieltes Modul im Menü als gespielt gekennzeichnet');
  check(offen.length > 0, 'kein ungespieltes Modul im Menü als offen gekennzeichnet');
  check(mitVerlauf.length + offen.length >= karten.length - 5,
        `${karten.length - mitVerlauf.length - offen.length} Karten ohne jede Kennzeichnung`);
  verlaufTest.push(`Aufgaben: ${mitVerlauf.length} gespielt, ${offen.length} offen gekennzeichnet`);
}

// ─── Statistik und Profil öffnen ──────────────────────────────────────
errors.length = 0;
window.navigateTo('stats');
await sleep(250);
check(main.innerHTML.includes('training-container') || main.innerHTML.length > 200,
      'Statistik-Ansicht ist leer');

// Der Verlauf je Modul ist der eigentliche Zweck der Seite: Balken für die
// einzelnen Durchgänge, dahinter der laufende Mittelwert als Zahl. Vorher
// stand dort ein einzelner Balken mit dem Bestwert – der zeigt keine
// Entwicklung, sondern nur den besten Tag.
{
  const reihen = [...main.querySelectorAll('[role="img"][aria-label]')];
  check(reihen.length > 0, 'Statistik zeigt keinen Verlauf je Modul');
  if (reihen.length) {
    const balken = reihen[0].querySelectorAll('span').length;
    check(balken > 0, 'Verlaufsreihe enthält keine Balken');
    const zahl = reihen[0].nextElementSibling;
    check(zahl && /^\d+$/.test(zahl.textContent.trim()),
          `hinter der Balkenreihe steht kein Mittelwert, sondern "${zahl ? zahl.textContent.trim() : '–'}"`);
    verlaufTest.push(`${reihen.length} Module mit Verlauf, erste Reihe ${balken} Balken`);
  }
}

window.navigateTo('radar');
await sleep(300);
check(main.innerHTML.includes('Kognitives Profil'), 'Profil-Ansicht ist leer');

// Auch im Profil gehört der Verlauf hin, nicht nur ein Zustandswert – und
// die Reihen müssen dieselbe feste Breite haben wie in der Statistik, sonst
// stehen die Zahlen dahinter nicht in einer Spalte.
{
  const { BALKEN } = await import('../src/ui/spark.js');
  const reihen = [...main.querySelectorAll('[role="img"][aria-label]')];
  check(reihen.length > 0, 'Kognitives Profil zeigt keinen Verlauf');
  const breiten = new Set(reihen.map(z => z.querySelectorAll('span').length));
  check(breiten.size <= 1, `Verlaufsreihen im Profil sind verschieden breit: ${[...breiten].join('/')}`);
  if (reihen.length) {
    check([...breiten][0] === BALKEN,
          `Reihen haben ${[...breiten][0]} Plätze statt der festen ${BALKEN}`);
    verlaufTest.push(`Profil: ${reihen.length} Reihen à ${BALKEN} Plätze`);
  }
}
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
console.log(`   Zahlen mit Ansage: ${audioTest.join(', ') || 'nicht geprüft'}`);
console.log(`   Koffer nach Fehler: ${kofferTest.join(' ') || 'nicht geprüft'}`);
methodTest.forEach(x => console.log(`   Fördermethoden: ${x}`));
// Der Punktestand darf auch nicht als leere Hülle zurückbleiben
check(adaptiveSeen === MINIMAL.length, `Es wurden ${adaptiveSeen} Module mit Minimal-Hülle geprüft, erwartet ${MINIMAL.length}`);

// ─── Einstellungen wirken und überleben ───────────────────────────────
{
  window.navigateTo('settings');
  await sleep(200);
  const regler = main.querySelectorAll('input[type=range]');
  check(regler.length >= 6, `Einstellungsseite zeigt nur ${regler.length} Regler`);
  check(!!main.querySelector('[aria-pressed]'), 'Ton-Schalter fehlt');

  const S = window.LOGIK_SETTINGS;
  const vorher = S.get('tempo');
  window._setSetting('tempo', 3.5);
  await sleep(120);
  check(S.get('tempo') === 3.5, `tempo ist ${S.get('tempo')} statt 3.5`);
  check(/logik-settings/.test(Object.keys(window.localStorage).join(',')) ||
        !!window.localStorage.getItem('logik-settings'),
        'Einstellung wurde nicht gesichert');

  // Grenzen werden eingehalten
  window._setSetting('tempo', 99);
  check(S.get('tempo') === 5, `tempo ${S.get('tempo')} statt auf 5 begrenzt`);
  window._resetSettings();
  await sleep(120);
  check(S.get('tempo') === 2, `Zurücksetzen ergab tempo ${S.get('tempo')} statt 2`);
  void vorher;
  einstellTest.push(`${regler.length} Regler, Grenzen und Zurücksetzen greifen`);

  window.navigateTo('menu');
  await sleep(60);
}

// ─── Auswahlaufgaben laufen ohne „Weiter" ─────────────────────────────
{
  window.startModule('sim-konzeptbildung');
  await sleep(60);
  window._startGame();
  await sleep(200);
  const bereich = () => window.document.getElementById('gameArea');
  const phase = () => { const p = bereich() && bereich().querySelector('[data-phase]');
                        return p ? p.getAttribute('data-phase') : null; };

  check(phase() === 'ask', `Auswahlaufgabe startet in Phase "${phase()}"`);
  check(!!bereich().querySelector('.adv-bar'), 'Antwortphase ohne Ablaufbalken');

  const opt = bereich().querySelector('[onclick^="G(\'choose\'"]');
  check(!!opt, 'keine Auswahlmöglichkeit gefunden');
  opt.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await sleep(150);
  check(phase() === 'feedback', `nach der Antwort Phase "${phase()}"`);
  check(!bereich().querySelector('[onclick*="next"]'),
        'Es gibt weiterhin einen Weiter-Knopf');

  // von selbst weiter, ohne Zutun
  for (let t = 0; t < 6000 && phase() !== 'ask'; t += 100) await sleep(100);
  check(phase() === 'ask', 'Die Rückmeldung läuft nicht von selbst weiter');
  ablaufTest.push('Antwort → Rückmeldung → nächste Aufgabe ohne Klick');

  window.navigateTo('menu');
  await sleep(60);
}

// ─── Durchgang endet nach der eingestellten Zahl von Übungen ──────────
{
  const S = window.LOGIK_SETTINGS;
  S.set('rounds', 3); S.set('feedbackOk', 0.4); S.set('feedbackWrong', 0.4);

  const bereich = () => window.document.getElementById('gameArea');
  const phase = () => { const p = bereich() && bereich().querySelector('[data-phase]');
                        return p ? p.getAttribute('data-phase') : null; };
  const fortschritt = () => {
    const p = window.document.getElementById('gameProgress');
    const d = p && p.querySelector('div');
    return d ? d.getAttribute('aria-label') : null;
  };

  window.startModule('sim-konzeptbildung');
  await sleep(60);
  window._startGame();
  await sleep(250);

  check(fortschritt() === '0 von 3', `Fortschritt zeigt "${fortschritt()}" statt "0 von 3"`);

  for (let i = 0; i < 3; i++) {
    for (let t = 0; t < 9000 && phase() !== 'ask'; t += 100) await sleep(100);
    if (phase() !== 'ask') break;
    bereich().querySelector('[onclick^="G(\'choose\'"]')
      .dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await sleep(700);
  }
  for (let t = 0; t < 5000 && phase() !== 'done'; t += 100) await sleep(100);

  check(phase() === 'done', `Nach 3 Übungen ist die Phase "${phase()}" statt "done"`);
  check(fortschritt() === '3 von 3', `Fortschritt zeigt "${fortschritt()}"`);
  check(/Geschafft|Готово/.test(main.textContent), 'Keine Ergebnisseite am Ende');

  // Zurück zur Gruppe muss zur Skala des Moduls führen, nicht ins Menü
  const zurGruppe = bereich().querySelector('[onclick*="scale"]');
  check(!!zurGruppe, 'Auf der Ergebnisseite fehlt der Weg zurück zur Gruppe');
  check(zurGruppe && /simultan/.test(zurGruppe.getAttribute('onclick')),
        'Der Weg zurück führt nicht zur richtigen Gruppe');

  // Die Rundenknöpfe des Rahmens dürfen daneben nicht stehen bleiben
  const rb = window.document.getElementById('roundButtons');
  check(!rb || rb.style.display === 'none',
        'Neben der Ergebnisseite stehen weiterhin die Rundenknöpfe');

  // Noch eine Runde setzt den Zähler zurück und zeichnet neu
  bereich().querySelector('[onclick*="restart"]')
    .dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  await sleep(400);
  check(phase() === 'ask' || phase() === 'study',
        `„Noch eine Runde" führt in Phase "${phase()}"`);
  check(fortschritt() === '0 von 3', `Nach dem Neustart steht der Zähler auf "${fortschritt()}"`);

  umfangTest.push(`3 Übungen → Ergebnis → zurück zur Gruppe, Neustart setzt zurück`);
  S.reset();
  window.navigateTo('menu');
  await sleep(60);
}

// ─── Der Plan für Eltern: Sitzung, Einordnung, Übung am Tisch ─────────
/**
 * Das ist die Seite, für die die App gebaut ist. Ein Elternteil, das ratlos
 * vor einem Kind sitzt, soll hier drei Dinge finden: was heute Abend dran
 * ist, wie lange es dauert, und – wenn etwas zurückliegt – was man dagegen
 * tut, und zwar zuerst ohne Bildschirm.
 */
{
  // Quellmodule laufen hier in Node, nicht im jsdom-Fenster: sie finden
  // localStorage und document sonst nicht, sobald sie einen Text übersetzen.
  globalThis.localStorage = globalThis.localStorage || window.localStorage;
  globalThis.document = globalThis.document || window.document;

  const R = await import('../src/core/richtwerte.js');
  const P = await import('../src/ui/plan-view.js');
  const { ANALOG } = await import('../src/data/analog.js');

  // ── Sitzungsvorschlag ──────────────────────────────────────────────
  window.navigateTo('plan');
  await sleep(500);
  const planText = main.textContent.replace(/\s+/g, ' ');

  check(/Minuten|мин\.|minutes/.test(planText),
        'Der Plan sagt nicht, wie lange die nächste Sitzung dauert');
  check(main.querySelectorAll('[onclick^="startModule"]').length > 0,
        'Der Plan bietet keine Aufgabe zum direkten Starten an');

  // Eine Sitzung darf nicht aus vier Aufgaben derselben Gruppe bestehen –
  // viermal hintereinander Merkspanne ermüdet mehr als vier verschiedene.
  {
    const alle = (await import('../src/data/modules.js')).modules;
    const v = P.sitzungVorschlag(alle.slice());
    check(v.module.length >= 2, `Der Sitzungsvorschlag umfasst nur ${v.module.length} Aufgabe(n)`);
    const skalen = new Set(v.module.map(m => m.scale));
    check(skalen.size >= Math.min(3, v.module.length),
          `Der Sitzungsvorschlag nimmt nur ${skalen.size} Gruppe(n) – er mischt nicht`);
    check(v.minuten <= P.SITZUNG_MINUTEN,
          `Der Sitzungsvorschlag dauert ${v.minuten} Minuten und sprengt die Grenze von ${P.SITZUNG_MINUTEN}`);
    planTest.push(`Sitzung: ${v.module.length} Aufgaben aus ${skalen.size} Gruppen, ${v.minuten} Minuten`);
  }

  // ── Von der Einordnung zur Übung ───────────────────────────────────
  // Ein Modul künstlich auf das unterste Niveau setzen. Danach muss der Plan
  // es benennen UND die Anleitung für den Küchentisch zeigen – der Verweis
  // auf die App allein wäre genau der Weg, den die App nicht empfehlen soll.
  {
    const scores = await storage.loadAllScores();
    const { getModule } = await import('../src/data/modules.js');
    const treffer = scores.find(s => {
      const m = getModule(s.moduleId);
      return m && m.stufen && ANALOG[s.moduleId];
    });
    check(!!treffer, 'Kein gespieltes Modul mit Niveauleiter gefunden – die Prüfung liefe ins Leere');

    if (treffer) {
      const mod = getModule(treffer.moduleId);
      const vorher = { ...treffer };
      await storage.saveScore({ ...treffer, bestLevel: 1 });

      const b = R.bewerte(mod, 1, 9);
      check(b && (b.stufe === 'weitDarunter' || b.stufe === 'darunter'),
            `Niveau 1 bei "${mod.id}" gilt mit 9 Jahren als "${b && b.stufe}" – dann greift der Übungsplan nie`);

      window.navigateTo('groups');
      await sleep(120);
      window.navigateTo('plan');
      await sleep(600);
      const txt = main.textContent.replace(/\s+/g, ' ');

      const titel = (mod.title && (mod.title.de || mod.title.ru)) || mod.id;
      check(txt.includes(titel),
            `Der Plan nennt "${titel}" nicht, obwohl das Modul auf dem untersten Niveau steht`);

      // Die Anleitung ohne Bildschirm, an ihrem ersten Satzstück erkannt
      const anleitung = ANALOG[mod.id].so.de;
      const anfang = anleitung.slice(0, 28);
      check(txt.includes(anfang),
            `Der Übungsvorschlag für "${titel}" zeigt die Anleitung ohne Bildschirm nicht`);
      check(/Besser ohne Bildschirm|Лучше без экрана|Better without a screen/.test(txt),
            'Im Übungsplan fehlt die Überschrift für den Weg ohne Bildschirm');

      // Und die Reihenfolge: der Tisch zuerst, die App danach.
      //
      // Innerhalb EINES Übungsblocks vergleichen, nicht über den ganzen
      // Seitentext: bei drei Blöcken steht der App-Verweis des ersten
      // natürlich vor der Tisch-Anleitung des dritten. Der erste Anlauf
      // dieser Prüfung ist genau daran hängengeblieben.
      const kaesten = [...main.querySelectorAll('[data-role="analog"]')];
      check(kaesten.length > 0, 'Im Plan steht kein Kasten „ohne Bildschirm"');
      for (const kasten of kaesten) {
        const block = kasten.parentElement;
        const appLink = [...block.querySelectorAll('a[onclick]')]
          .find(a => (a.getAttribute('onclick') || '').startsWith('startModule'));
        check(!!appLink, 'Ein Übungsblock verweist gar nicht auf die Aufgabe in der App');
        if (appLink) {
          check((kasten.compareDocumentPosition(appLink) & 4) !== 0,
                'Der Verweis auf die App steht vor der Übung am Tisch statt dahinter');
        }
      }

      planTest.push(`Übungsplan: "${titel}" auf Niveau 1 → ${b.text}, Anleitung für den Tisch zuerst`);
      await storage.saveScore(vorher);
    }
  }

  // ── Der Kasten steht auch am Modul selbst, vor dem Startknopf ──────
  {
    const mitAnleitung = Object.keys(ANALOG)[0];
    window.startModule(mitAnleitung);
    await sleep(250);
    const kasten = main.querySelector('[data-role="analog"]');
    check(!!kasten, `Der Startbildschirm von "${mitAnleitung}" zeigt keinen Kasten „ohne Bildschirm"`);

    const knopf = [...main.querySelectorAll('button')]
      .find(b => (b.getAttribute('onclick') || '').includes('_startGame'));
    check(!!knopf, 'Auf dem Startbildschirm fehlt der Startknopf');
    if (kasten && knopf) {
      // compareDocumentPosition: 4 = das Argument folgt dem Knoten
      const folgt = (kasten.compareDocumentPosition(knopf) & 4) !== 0;
      check(folgt, 'Der Kasten „ohne Bildschirm" steht hinter dem Startknopf – dort liest ihn niemand');
    }
    planTest.push(`Ohne Bildschirm: Kasten auf dem Startbildschirm, vor dem Startknopf`);
  }

  window.navigateTo('menu');
  await sleep(200);
}

// ─── Fortschritt zurücksetzen ─────────────────────────────────────────
// Löschen ist endgültig, deshalb wird hier beides geprüft: dass Abbrechen
// wirklich nichts anfasst, und dass Einstellungen das Löschen überleben.
{
  const vorher = (await storage.loadAllScores()).length;
  check(vorher > 0, 'Für den Reset-Test liegen gar keine Spielstände vor');
  window.localStorage.setItem('logik-factors', '{"seq-zahlenfolgen":1.5}');

  window.navigateTo('stats');
  await sleep(250);
  check(/zurücksetzen|Сбросить/i.test(main.textContent),
        'Die Statistik bietet kein Zurücksetzen an');

  // Abbrechen darf nichts löschen
  window._askReset();
  await sleep(120);
  check(/Wirklich|Точно/.test(main.textContent), 'Die Sicherheitsabfrage erscheint nicht');
  window._cancelReset();
  await sleep(120);
  check((await storage.loadAllScores()).length === vorher,
        'Abbrechen hat trotzdem Daten gelöscht');

  // Löschen
  window._askReset();
  await sleep(80);
  await window._doReset();
  await sleep(250);
  const nachher = await storage.loadAllScores();
  const verlauf = await storage.loadAllHistory(9999);
  check(nachher.length === 0, `Nach dem Reset sind noch ${nachher.length} Spielstände da`);
  check(verlauf.length === 0, `Nach dem Reset sind noch ${verlauf.length} Verlaufseinträge da`);
  check(/gelöscht|удалены/.test(main.textContent), 'Keine Rückmeldung nach dem Löschen');
  check(window.localStorage.getItem('logik-factors') === '{"seq-zahlenfolgen":1.5}',
        'Das Zurücksetzen hat die Tempo-Einstellung mitgelöscht');

  // Profil und Statistik zeigen den leeren Zustand
  window.navigateTo('radar');
  await sleep(250);
  check(/0\/89|0 Module/.test(main.textContent),
        'Das kognitive Profil zeigt nach dem Reset noch Werte');

  // Die Erfolgsmeldung darf nicht kleben bleiben
  window.navigateTo('menu');
  await sleep(120);
  window.navigateTo('stats');
  await sleep(250);
  check(!/wurden gelöscht|результаты удалены/.test(main.textContent),
        'Die Reset-Meldung bleibt nach dem Verlassen stehen');
  resetTest.push(`${vorher} Spielstände gelöscht, Einstellungen erhalten`);
}

einstellTest.forEach(x => console.log(`   Einstellungen: ${x}`));
ablaufTest.forEach(x => console.log(`   Ablauf: ${x}`));
umfangTest.forEach(x => console.log(`   Durchgang: ${x}`));
verlaufTest.forEach(x => console.log(`   Verlauf: ${x}`));
sudokuTest.forEach(x => console.log(`   Sudoku: ${x}`));
planTest.forEach(x => console.log(`   Plan: ${x}`));
navTest.forEach(x => console.log(`   Navigation: ${x}`));
ziehTest.forEach(x => console.log(`   Ziehen: ${x}`));
resetTest.forEach(x => console.log(`   Zurücksetzen: ${x}`));

// ─── Ergebnis ─────────────────────────────────────────────────────────
if (problems.length) {
  console.error(`\n✗ ${problems.length} Problem(e):\n`);
  problems.forEach(p => console.error('   • ' + p));
  process.exit(1);
}
console.log(`\n✓ Alle ${modules.length} Module im DOM geöffnet, angespielt und ohne Konsolenfehler beendet`);
console.log('✓ Statistik und kognitives Profil rendern sauber\n');
process.exit(0);
