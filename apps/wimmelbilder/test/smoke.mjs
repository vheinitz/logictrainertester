/* Smoke-Test: lädt Kern und Datensätze im jsdom, spielt eine Runde durch und
   prüft den Export. Aufruf:  node test/smoke.mjs  (aus apps/wimmelbilder) */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { JSDOM } from '../../../node_modules/jsdom/lib/api.js';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
let fehler = 0;

function pruefe(bedingung, text) {
  if (bedingung) {
    console.log('  ok   ' + text);
  } else {
    console.log('  FEHL ' + text);
    fehler++;
  }
}

/* --- Aufbau: index.html im jsdom, Skripte selbst nachladen ------------- */

const html = readFileSync(join(wurzel, 'index.html'), 'utf8');
const dom = new JSDOM(html, {
  pretendToBeVisual: true,
  runScripts: 'outside-only', // eigene Skripte per window.eval, keine aus dem HTML
  url: 'https://beispiel.test/'
});
const { window } = dom;

// Kein echtes Layout im jsdom – Bühnengröße vortäuschen, damit einpassen() rechnet.
window.Element.prototype.getBoundingClientRect = function () {
  return { left: 0, top: 0, width: 1000, height: 700, right: 1000, bottom: 700, x: 0, y: 0 };
};
window.Element.prototype.setPointerCapture = function () {};
window.Element.prototype.scrollIntoView = function () {};

function laden(datei) {
  const quelle = readFileSync(join(wurzel, datei), 'utf8');
  window.eval(quelle);
}

console.log('Kern und Daten laden');
laden('js/wimmelbild.js');
const datendateien = readdirSync(join(wurzel, 'data')).filter((f) => f.endsWith('.js'));
datendateien.forEach((f) => laden('data/' + f));
laden('js/app.js');

const Wimmelbild = window.Wimmelbild;
pruefe(datendateien.length > 0, datendateien.length + ' Datendatei(en) gefunden');
pruefe(Wimmelbild.alle().length === datendateien.length,
  'alle Datensätze angenommen (' + Wimmelbild.alle().length + ')');

/* --- Datensätze prüfen ------------------------------------------------- */

for (const satz of Wimmelbild.alle()) {
  console.log('\nDatensatz "' + satz.id + '"');
  pruefe(satz.fragen.length > 0, satz.fragen.length + ' Fragen');

  const nummern = new Set(satz.fragen.map((f) => f.nr));
  pruefe(nummern.size === satz.fragen.length, 'Fragennummern eindeutig');
  pruefe(satz.fragen.every((f) => f.frage && f.ziel), 'jede Frage hat Text und Zielnamen');

  const ausserhalb = satz.fragen.filter((f) => Wimmelbild.ziel(satz, f, {}).ausserhalb);
  console.log('  info ' + ausserhalb.length + ' Ziel(e) außerhalb des Bildes'
    + (ausserhalb.length ? ' (Nr. ' + ausserhalb.map((f) => f.nr).join(', ') + ')' : ''));

  const r = Wimmelbild.radius(satz, satz.fragen[0]);
  pruefe(r > 0 && r < Math.min(satz.bildGroesse.breite, satz.bildGroesse.hoehe) / 2,
    'Trefferradius plausibel (' + Math.round(r) + ' px)');
}

/* --- Runde durchspielen ------------------------------------------------ */

const satz = Wimmelbild.alle()[0];
console.log('\nRunde spielen');

const runde = Wimmelbild.runde(satz, { anzahl: 5, zufall: true }).starten();
pruefe(runde.fragen.length === 5, 'Runde auf 5 Fragen begrenzt');

// Erste Frage exakt treffen, zweite weit daneben, dritte überspringen.
const z0 = runde.ziel();
const a0 = runde.pruefen(z0.px, z0.py);
pruefe(a0.richtig === true, 'Klick auf das Ziel zählt als Treffer');

const z1 = runde.ziel();
const a1 = runde.pruefen(
  z1.px > satz.bildGroesse.breite / 2 ? 0 : satz.bildGroesse.breite,
  z1.py > satz.bildGroesse.hoehe / 2 ? 0 : satz.bildGroesse.hoehe);
pruefe(a1.richtig === false, 'Klick in die gegenüberliegende Ecke zählt nicht');

const a2 = runde.ueberspringen();
pruefe(a2.uebersprungen === true && a2.richtig === false, 'Überspringen wird als Fehler gewertet');

// Rand des Trefferradius: knapp innen trifft, knapp außen nicht.
const z3 = runde.ziel();
const rad = runde.radius();
const innen = runde.pruefen(z3.px + rad * 0.95, z3.py);
pruefe(innen.richtig === true, 'knapp innerhalb des Radius trifft');

const z4 = runde.ziel();
const rad4 = runde.radius();
const aussen = runde.pruefen(z4.px + rad4 * 1.05, z4.py);
pruefe(aussen.richtig === false, 'knapp außerhalb des Radius trifft nicht');

pruefe(runde.fertig(), 'Runde nach 5 Antworten beendet');

const auswertung = runde.auswertung();
pruefe(auswertung.gesamt === 5, 'Auswertung zählt 5 Antworten');
pruefe(auswertung.richtig === 2, 'Auswertung zählt 2 Treffer (ist ' + auswertung.richtig + ')');
pruefe(auswertung.falsch === 2, 'Auswertung zählt 2 Fehlklicks (ist ' + auswertung.falsch + ')');
pruefe(auswertung.uebersprungen === 1, 'Auswertung zählt 1 Auslassung');
pruefe(Math.abs(auswertung.quote - 0.4) < 1e-9, 'Quote 40 %');
pruefe(auswertung.antworten.every((a) => a.dauer >= 0), 'Zeiten gemessen');

/* --- Zufallsreihenfolge ------------------------------------------------ */

const folgen = new Set();
for (let i = 0; i < 20; i++) {
  folgen.add(Wimmelbild.runde(satz, {}).fragen.map((f) => f.nr).join(','));
}
pruefe(folgen.size > 1, 'Reihenfolge wird gemischt (' + folgen.size + ' verschiedene bei 20 Runden)');
const ohne = Wimmelbild.runde(satz, { zufall: false }).fragen.map((f) => f.nr);
pruefe(ohne.join(',') === satz.fragen.map((f) => f.nr).join(','), 'zufall:false behält die Reihenfolge');
pruefe(new Set(Wimmelbild.runde(satz, {}).fragen).size === satz.fragen.length,
  'volle Runde enthält jede Frage genau einmal');

/* --- Kalibrierung und Export ------------------------------------------- */

console.log('\nKalibrierung und Export');
Wimmelbild.kalibrierungLoeschen(satz.id);
Wimmelbild.kalibrierungSetzen(satz.id, satz.fragen[0].nr, 123, 456);
const kal = Wimmelbild.kalibrierungLesen(satz.id);
pruefe(kal['' + satz.fragen[0].nr].x === 123, 'Kalibrierung gespeichert');

const zielKal = Wimmelbild.ziel(satz, satz.fragen[0], kal);
pruefe(Math.abs(zielKal.rx - 123 / satz.koordinatenRaum.breite) < 1e-9,
  'kalibriertes Ziel überschreibt den Tabellenwert');
pruefe(zielKal.geprueft === true, 'kalibriertes Ziel gilt als geprüft');

const quelltext = Wimmelbild.alsQuelltext(satz, kal);
pruefe(quelltext.includes('x:  123, y:  456'), 'Export enthält den kalibrierten Wert');
pruefe(quelltext.includes("id: '" + satz.id + "'"), 'Export enthält die Kennung');
pruefe(quelltext.includes('koordinatenGeprueft: false'),
  'Export markiert unvollständige Kalibrierung');

// Export muss sich wieder einlesen lassen.
const zweitDom = new JSDOM('', { runScripts: 'outside-only' });
zweitDom.window.eval(readFileSync(join(wurzel, 'js/wimmelbild.js'), 'utf8'));
zweitDom.window.eval(quelltext);
const neu = zweitDom.window.Wimmelbild.alle()[0];
pruefe(!!neu && neu.fragen.length === satz.fragen.length, 'Export ist wieder ladbar');
pruefe(neu.fragen[0].x === 123 && neu.fragen[0].y === 456, 'Werte überstehen den Umlauf');
pruefe(neu.fragen.every((f, i) => f.frage === satz.fragen[i].frage),
  'Fragentexte überstehen den Umlauf (Apostrophe, Umlaute)');

Wimmelbild.kalibrierungLoeschen(satz.id);
pruefe(Object.keys(Wimmelbild.kalibrierungLesen(satz.id)).length === 0, 'Kalibrierung löschbar');

/* --- Fehlerhafte Datensätze werden abgewiesen -------------------------- */

console.log('\nFehlerhafte Datensätze');
const vorher = Wimmelbild.alle().length;
const stillesLog = window.console.error;
window.console.error = () => {};
Wimmelbild.register({ id: 'kaputt' });
Wimmelbild.register({ id: 'kaputt2', bild: 'x.jpg', bildGroesse: { breite: 10, hoehe: 10 }, fragen: [] });
Wimmelbild.register({
  id: 'kaputt3', bild: 'x.jpg', bildGroesse: { breite: 10, hoehe: 10 },
  fragen: [{ frage: 'ohne Koordinaten' }]
});
Wimmelbild.register(satz); // doppelte id
window.console.error = stillesLog;
pruefe(Wimmelbild.alle().length === vorher, 'unvollständige Datensätze werden verworfen');

/* --- Oberfläche -------------------------------------------------------- */

console.log('\nOberfläche');
const dok = window.document;
pruefe(dok.querySelectorAll('#satzliste .karte').length === Wimmelbild.alle().length,
  'für jeden Datensatz eine Karte');
pruefe(dok.getElementById('warnung-kalibrierung').hidden === satz.koordinatenGeprueft,
  'Warnung erscheint genau bei ungeprüften Koordinaten');

dok.getElementById('opt-anzahl').value = '10';
dok.getElementById('knopf-start').click();
pruefe(dok.getElementById('spiel').hidden === false, 'Start öffnet den Spielbildschirm');
pruefe(dok.getElementById('bild').getAttribute('src') === satz.bild, 'Bild wird gesetzt');
pruefe(dok.getElementById('spiel-zaehler').textContent === '1 / 10', 'Zähler steht auf 1 / 10');
pruefe(dok.getElementById('spiel-frage').textContent.length > 0, 'Frage steht im Kopf');

const ersteFrage = dok.getElementById('spiel-frage').textContent;
dok.getElementById('knopf-ueberspringen').click();
pruefe(dok.getElementById('spiel-falsch').textContent === '1', 'Überspringen zählt hoch');
// Rückmeldung mit gezeigter Auflösung steht 1600 ms, danach kommt die nächste.
await new Promise((r) => setTimeout(r, 1800));
pruefe(dok.getElementById('spiel-frage').textContent !== ersteFrage, 'nächste Frage erscheint');
pruefe(dok.getElementById('spiel-zaehler').textContent === '2 / 10', 'Zähler steht auf 2 / 10');

dok.getElementById('knopf-abbrechen').click();
pruefe(dok.getElementById('start').hidden === false, 'Abbrechen führt zurück zur Auswahl');

dok.getElementById('knopf-kalibrieren').click();
pruefe(dok.getElementById('kalib').hidden === false, 'Kalibrier-Modus öffnet');
pruefe(dok.querySelectorAll('#kalib-liste button').length === satz.fragen.length,
  'Kalibrier-Liste zeigt alle Fragen');
dok.getElementById('kalib-export').click();
pruefe(dok.getElementById('dialog').hidden === false, 'Export-Dialog öffnet');
pruefe(dok.getElementById('dialog-text-feld').value.includes('Wimmelbild.register'),
  'Dialog enthält den Quelltext');
dok.getElementById('dialog-schliessen').click();
dok.getElementById('kalib-fertig').click();

/* ----------------------------------------------------------------------- */

console.log('\n' + (fehler ? fehler + ' Prüfung(en) fehlgeschlagen' : 'alle Prüfungen bestanden'));
process.exit(fehler ? 1 : 0);
