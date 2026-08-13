/**
 * Sprachprüfung für ein einzelnes Spielmodul.
 *
 *   node tools/check-lang.mjs src/games/wiss-sachwissen.js [weitere …]
 *   node tools/check-lang.mjs --alle
 *
 * Rendert die Hauptphasen des Moduls in RU und EN und schlägt an, wenn
 * deutscher Text durchschlägt. Marker: Umlaute/ß sowie häufige deutsche
 * Wörter, die weder im Russischen noch im Englischen vorkommen.
 *
 * Das ist bewusst eine Heuristik: sie findet nicht jede Lücke, aber genau
 * die Sorte, die im Screenshot des Nutzers zu sehen war – deutsche Sätze
 * mitten in der russischen Oberfläche.
 */
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// ── Browser-Stubs (wie test/smoke.mjs) ──
const store = {};
globalThis.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
const fakeEl = () => ({ innerHTML:'', textContent:'', style:{}, classList:{add(){},remove(){}}, appendChild(){} });
globalThis.document = {
  documentElement: { lang: 'de' },
  getElementById: () => fakeEl(), querySelectorAll: () => [],
  createElement: () => fakeEl(), addEventListener(){}, removeEventListener(){},
  body: { appendChild(){} }
};
globalThis.window = globalThis;
globalThis.scrollTo = () => {};
globalThis.indexedDB = { open: () => ({}) };
globalThis.structuredClone = globalThis.structuredClone || (o => JSON.parse(JSON.stringify(o)));
globalThis.performance = globalThis.performance || { now: () => Date.now() };

const { engine } = await import('../src/core/engine.js');

const MARKER = [
  /[äöüßÄÖÜ]/,
  /\b(und|nicht|wird|eine[mnrs]?|Aufgabe|Runde|Klicke|Merke|Weiter|Niveau|Bewertung|passt|Welche[sr]?|Wie viele|Richtig|Falsch|Zeit abgelaufen|Gib|Tippe|Finde|Beenden)\b/,
  /\b(Zeig mir|heißt|gehörte|zusammen|Gesucht war|Was ist das|Was haben diese|Welches Wort|Wie heißt|Bewohner|Obst|Mauer|Bausteine|Tuch|Jahreszeit|Frühling|Herbst|Sommer|Sieben|Acht|Richtig ist|Es war|gemeinsam|anders sein|Tippe es|mein Teekesselchen|Züge|Würfel|Schritte|Muster|Bedeutung|Fische|Tiere|Sonne|Woche|Paare)\b/
];

function german(text) {
  for (const m of MARKER) {
    const hit = text.match(m);
    if (hit) return hit[0];
  }
  return null;
}

const strip = html => String(html)
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ').trim();

/** Hauptphasen eines Moduls rendern und Texte einsammeln. */
function collect(mod, id) {
  const gs = { moduleId: id, step: 'game', round: 1, score: 0, total: 0, gd: {} };
  engine.activeGame = { id, mod };
  engine.gameState = gs;
  const out = [];
  const grab = tag => { try { out.push([tag, strip(mod.render(gs))]); } catch (e) { out.push([tag, 'RENDER-FEHLER: ' + e.message]); } };

  try {
    mod.init(gs);
    if (mod.actions.pick) {                       // Merkspann
      grab('show');
      gs.gd.phase = 'answer'; gs.gd.phaseStart = Date.now(); gs.gd.userAnswer = [];
      grab('answer');
    } else if (mod.actions.tap) {                 // Rhythmus
      grab('listen');
      gs.gd.phase = 'tap'; gs.gd.phaseStart = Date.now();
      grab('tap');
    } else if (mod.actions.choose) {              // Auswahl
      for (let i = 0; i < 4; i++) {               // mehrere Runden: Inhalte rotieren
        if (gs.gd.phase === 'study') { grab('study'); mod.actions.skipStudy(gs); }
        grab('ask');
        const r = gs.gd.round;
        mod.actions.choose(gs, (r.correct + 1) % r.options.length);  // falsch → explain sichtbar
        grab('feedback');
        mod.actions.next(gs);
      }
    } else if (mod.actions.rate) {                // Tutor
      for (let i = 0; i < 3; i++) {
        grab('task');
        mod.actions.rate(gs, 1);
        grab('rated');
        mod.actions.next(gs);
      }
    } else {                                      // Sudoku, Memory, Stub …
      grab('play');
    }
    mod.dispose(gs);
  } finally {
    engine.activeGame = null;
  }
  return out;
}

const args = process.argv.slice(2);
const dateien = args.includes('--alle')
  ? readdirSync('src/games').filter(f => f.endsWith('.js') && f !== 'index.js').map(f => 'src/games/' + f)
  : args;

if (!dateien.length) {
  console.error('Aufruf: node tools/check-lang.mjs <datei…> | --alle');
  process.exit(2);
}

let fehler = 0;
for (const datei of dateien) {
  const kurz = datei.replace(/^.*\//, '');
  const id = kurz.replace(/\.js$/, '');
  let mod;
  try { mod = await import(pathToFileURL(resolve(datei)).href); }
  catch (e) { console.error(`✗ ${kurz}: lädt nicht – ${e.message}`); fehler++; continue; }

  const probleme = [];
  for (const l of ['ru', 'en']) {
    store['logik-lang'] = l;
    document.documentElement.lang = l;
    for (const [phase, text] of collect(mod, id)) {
      if (text.startsWith('RENDER-FEHLER')) { probleme.push(`${l}/${phase}: ${text}`); continue; }
      const hit = german(text);
      if (hit) probleme.push(`${l}/${phase}: deutsch „${hit}" in: ${text.slice(0, 90)}…`);
      if (/undefined|\[object Object\]/.test(text)) probleme.push(`${l}/${phase}: unaufgelöster Platzhalter`);
    }
  }
  store['logik-lang'] = 'de';

  if (probleme.length) {
    console.error(`✗ ${kurz}`);
    [...new Set(probleme)].slice(0, 8).forEach(p => console.error('    ' + p));
    fehler += probleme.length;
  } else {
    console.log(`✓ ${kurz}`);
  }
}

if (fehler) { console.error(`\n${fehler} Fund(e).`); process.exit(1); }
console.log(`\n${dateien.length} Modul(e) ohne deutsche Spuren in RU/EN.`);
