/* Smoke-Test: lädt die App im jsdom, spielt eine Runde durch und übt Import,
   Bearbeiten und Export. Aufruf:  node test/smoke.mjs  (aus apps/wimmelbilder) */

import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { JSDOM } from '../../../node_modules/jsdom/lib/api.js';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
let fehler = 0;
let gruppe = '';

function abschnitt(name) { gruppe = name; console.log('\n' + name); }

function pruefe(bedingung, text) {
  if (bedingung) {
    console.log('  ok   ' + text);
  } else {
    console.log('  FEHL ' + text);
    fehler++;
  }
}

/* --- Aufbau ------------------------------------------------------------ */

const html = readFileSync(join(wurzel, 'index.html'), 'utf8');
const dom = new JSDOM(html, {
  pretendToBeVisual: true,
  runScripts: 'outside-only', // eigene Skripte per window.eval, keine aus dem HTML
  url: 'https://beispiel.test/'
});
const { window } = dom;
const dok = window.document;

// Kein echtes Layout im jsdom – Bühnengröße vortäuschen, damit einpassen() rechnet.
window.Element.prototype.getBoundingClientRect = function () {
  return { left: 0, top: 0, width: 1000, height: 700, right: 1000, bottom: 700, x: 0, y: 0 };
};
window.Element.prototype.setPointerCapture = function () {};
window.Element.prototype.scrollIntoView = function () {};
window.URL.createObjectURL = () => 'blob:test';
window.URL.revokeObjectURL = () => {};

function laden(datei) { window.eval(readFileSync(join(wurzel, datei), 'utf8')); }

const datendateien = readdirSync(join(wurzel, 'data')).filter((f) => f.endsWith('.js'));
['js/hilfen.js', 'js/wimmelbild.js', 'js/bild.js', 'js/ansicht.js']
  .concat(datendateien.map((f) => 'data/' + f))
  .concat(['js/aufnahme.js', 'js/editor.js', 'js/app.js'])
  .forEach(laden);

const { Wimmelbild, Editor, H } = window;

/* --- Datensätze -------------------------------------------------------- */

abschnitt('Datensätze aus data/');
pruefe(Wimmelbild.alle().length === datendateien.length,
  datendateien.length + ' Datei(en), ' + Wimmelbild.alle().length + ' Sätze angemeldet');

const dorf = Wimmelbild.alle()[0];
pruefe(dorf.fragen.length > 0, dorf.fragen.length + ' Fragen in "' + dorf.id + '"');
pruefe(dorf.fragen.every((f) => f.frage && f.ziel), 'jede Frage hat Text und Zielnamen');
pruefe(dorf.fragen.every((f) => f.gesetzt === dorf.koordinatenGeprueft),
  'gesetzt folgt koordinatenGeprueft (' + dorf.koordinatenGeprueft + ')');
const radius = Wimmelbild.radius(dorf, dorf.fragen[0]);
pruefe(radius > 0 && radius < Math.min(dorf.bildGroesse.breite, dorf.bildGroesse.hoehe) / 2,
  'Trefferradius plausibel (' + Math.round(radius) + ' px)');

/* --- Fragen aus Text lesen --------------------------------------------- */

abschnitt('Fragen aus Text lesen');

const a = Wimmelbild.fragenAusText(`
Nr.   Frage                        Koordinaten (x,y)
1. Wo ist der rote Luftballon? (210,80)
2) Wo ist die Katze?   80 ; 120
Wo ist der Pilz?;50;1290
Wo ist die Eule?
`);
pruefe(a.fragen.length === 4, 'vier Fragen erkannt (sind ' + a.fragen.length + ')');
pruefe(a.uebergangen.length === 1, 'Kopfzeile übergangen');
pruefe(a.fragen[0].x === 210 && a.fragen[0].y === 80, 'geklammerte Koordinaten');
pruefe(a.fragen[1].x === 80 && a.fragen[1].y === 120, 'Koordinaten mit Semikolon und Leerzeichen');
pruefe(a.fragen[2].x === 50 && a.fragen[2].y === 1290, 'Koordinaten ohne Klammern');
pruefe(a.fragen[3].gesetzt === false && a.fragen[3].x === 0, 'Frage ohne Koordinaten bleibt offen');
pruefe(a.fragen.map((f) => f.nr).join(',') === '1,2,3,4', 'durchnummeriert');
pruefe(a.fragen[0].ziel === 'roter Luftballon', 'Zielname abgeleitet: ' + a.fragen[0].ziel);
pruefe(a.fragen[3].frage === 'Wo ist die Eule?', 'Fragezeichen bleibt erhalten');
pruefe(a.ohneKoordinaten === 1, 'eine Frage ohne Koordinaten gezählt');

const zweispaltig = Wimmelbild.fragenAusText(
  '1. Wo ist der Hut? (280,340)   26. Wo ist der Hydrant? (930,870)');
pruefe(zweispaltig.fragen.length === 2, 'zweispaltige Tabellenzeile ergibt zwei Fragen');
pruefe(zweispaltig.fragen[1].x === 930, 'zweite Spalte richtig gelesen');

pruefe(Wimmelbild.zielAusFrage('Wo ist die Gießkanne?') === 'Gießkanne', 'Artikel entfällt');
pruefe(Wimmelbild.zielAusFrage('Wo ist der Hut auf dem Kopf einer Person?')
  === 'Hut auf dem Kopf einer Person', 'längerer Zielname bleibt ganz');
pruefe(Wimmelbild.zielAusFrage('Regenschirm') === 'Regenschirm', 'nackter Name bleibt stehen');
pruefe(Wimmelbild.fragenAusText('').fragen.length === 0, 'leerer Text ergibt nichts');

/* --- Anlegen, speichern, verwerfen -------------------------------------- */

abschnitt('Anlegen und speichern');

const eigen = Wimmelbild.neuerSatz({
  id: 'test-bild',
  titel: 'Testbild',
  bild: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
  bildGroesse: { breite: 800, hoehe: 600 },
  fragen: a.fragen
});
pruefe(eigen.koordinatenRaum.breite === 800, 'Koordinatenraum folgt der Bildgröße');
pruefe(eigen.bildDatei === 'images/test-bild.jpg', 'Bildpfad für den Export abgeleitet');
pruefe(Wimmelbild.speichern(eigen) === null, 'Satz gespeichert');
pruefe(Wimmelbild.alle().length === datendateien.length + 1, 'Satz taucht in der Liste auf');
pruefe(Wimmelbild.istLokal('test-bild'), 'als lokal erkannt');
pruefe(Wimmelbild.get('test-bild').herkunft === 'lokal', 'Herkunft lokal');
pruefe(Wimmelbild.offeneZiele(Wimmelbild.get('test-bild')) === 1, 'ein Ziel noch offen');

pruefe(Wimmelbild.speichern({ id: 'Groß Falsch', bild: 'x' }) !== null, 'krumme Kennung abgelehnt');
pruefe(Wimmelbild.speichern({ id: 'ok', bild: 'x' }) !== null, 'fehlende Bildgröße abgelehnt');

// Lokale Fassung eines Datei-Satzes verdeckt diesen und lässt sich zurücknehmen.
const kopie = Wimmelbild.kopieren(dorf);
kopie.titel = 'Dorfplatz (geändert)';
kopie.fragen[0].gesetzt = true;
kopie.fragen[0].x = 111;
Wimmelbild.speichern(kopie);
pruefe(Wimmelbild.get(dorf.id).titel === 'Dorfplatz (geändert)', 'lokale Fassung verdeckt die Datei');
pruefe(Wimmelbild.alle().length === datendateien.length + 1, 'kein doppelter Eintrag');
Wimmelbild.verwerfen(dorf.id);
pruefe(Wimmelbild.get(dorf.id).titel === dorf.titel, 'Verwerfen stellt die Datei-Fassung her');

/* --- Export und Wiedereinlesen ----------------------------------------- */

abschnitt('Export und Wiedereinlesen');

const gespeichert = Wimmelbild.get('test-bild');

const modul = Wimmelbild.alsQuelltext(gespeichert);
pruefe(modul.includes("id: 'test-bild'"), 'Modul enthält die Kennung');
pruefe(modul.includes("bild: 'images/test-bild.jpg'"),
  'Modul zeigt auf die Bilddatei, nicht auf den data:-URI');
pruefe(modul.includes('koordinatenGeprueft: false'), 'offene Ziele werden vermerkt');
const zurueck = Wimmelbild.ausModulQuelltext(modul).satz;
pruefe(zurueck.fragen.length === gespeichert.fragen.length, 'Modul wieder einlesbar');
pruefe(zurueck.fragen[0].frage === gespeichert.fragen[0].frage,
  'Fragetexte überstehen den Umlauf (Umlaute, Apostrophe)');
pruefe(zurueck.fragen[0].x === gespeichert.fragen[0].x, 'Koordinaten überstehen den Umlauf');

const json = Wimmelbild.alsJson(gespeichert);
const ausJson = Wimmelbild.ausJson(json).satz;
pruefe(ausJson.bild === gespeichert.bild, 'JSON trägt das Bild eingebettet mit');
pruefe(ausJson.fragen.length === gespeichert.fragen.length, 'JSON trägt alle Fragen');
pruefe(ausJson.titel === gespeichert.titel, 'JSON trägt den Titel');

const text = Wimmelbild.alsText(gespeichert);
const ausText = Wimmelbild.fragenAusText(text).fragen;
pruefe(ausText.length === gespeichert.fragen.length, 'Textform wieder einlesbar');
pruefe(ausText[0].x === gespeichert.fragen[0].x, 'Koordinaten überstehen die Textform');

let gemeckert = false;
try { Wimmelbild.ausJson('{"unsinn":1}'); } catch (e) { gemeckert = true; }
pruefe(gemeckert, 'unbekanntes JSON wird abgelehnt');
gemeckert = false;
try { Wimmelbild.ausModulQuelltext('var x = 1;'); } catch (e) { gemeckert = true; }
pruefe(gemeckert, 'Modul ohne register wird abgelehnt');

/* --- Runde spielen ------------------------------------------------------ */

abschnitt('Runde spielen');

const spielsatz = Wimmelbild.kopieren(dorf);
spielsatz.fragen.forEach((f) => { f.gesetzt = true; });
const runde = Wimmelbild.runde(spielsatz, { anzahl: 5 }).starten();
pruefe(runde.fragen.length === 5, 'Runde auf 5 Fragen begrenzt');

const z0 = runde.ziel();
pruefe(runde.pruefen(z0.px, z0.py).richtig === true, 'Klick auf das Ziel zählt als Treffer');

const z1 = runde.ziel();
pruefe(runde.pruefen(
  z1.px > spielsatz.bildGroesse.breite / 2 ? 0 : spielsatz.bildGroesse.breite,
  z1.py > spielsatz.bildGroesse.hoehe / 2 ? 0 : spielsatz.bildGroesse.hoehe
).richtig === false, 'Klick in die gegenüberliegende Ecke zählt nicht');

pruefe(runde.ueberspringen().uebersprungen === true, 'Überspringen wird als Fehler gewertet');

const z3 = runde.ziel(), r3 = runde.radius();
pruefe(runde.pruefen(z3.px + r3 * 0.95, z3.py).richtig === true, 'knapp innerhalb trifft');
const z4 = runde.ziel(), r4 = runde.radius();
pruefe(runde.pruefen(z4.px + r4 * 1.05, z4.py).richtig === false, 'knapp außerhalb trifft nicht');

const aus = runde.auswertung();
pruefe(runde.fertig(), 'Runde nach 5 Antworten beendet');
pruefe(aus.richtig === 2 && aus.falsch === 2 && aus.uebersprungen === 1,
  'Auswertung zählt 2 / 2 / 1 (ist ' + [aus.richtig, aus.falsch, aus.uebersprungen] + ')');
pruefe(Math.abs(aus.quote - 0.4) < 1e-9, 'Quote 40 %');

const folgen = new Set();
for (let i = 0; i < 20; i++) folgen.add(Wimmelbild.runde(dorf, {}).fragen.map((f) => f.nr).join(','));
pruefe(folgen.size > 1, 'Reihenfolge wird gemischt (' + folgen.size + ' von 20 verschieden)');
pruefe(Wimmelbild.runde(dorf, { zufall: false }).fragen.map((f) => f.nr).join(',')
  === dorf.fragen.map((f) => f.nr).join(','), 'zufall:false behält die Reihenfolge');
pruefe(Wimmelbild.runde(dorf, { nurGesetzte: true }).fragen.length === 0,
  'nurGesetzte lässt ungeprüfte Fragen weg');

/* --- Oberfläche: Auswahl und Spiel -------------------------------------- */

abschnitt('Oberfläche: Auswahl und Spiel');

window.App.startAufbauen();
pruefe(dok.querySelectorAll('#satzliste .karte').length === Wimmelbild.alle().length,
  'für jeden Satz eine Karte');
pruefe(dok.getElementById('warnung').hidden === false, 'Warnung bei ungesicherten Stellen');

dok.getElementById('opt-anzahl').value = '10';
dok.getElementById('knopf-start').click();
pruefe(dok.getElementById('spiel').hidden === false, 'Start öffnet den Spielbildschirm');
pruefe(dok.getElementById('spiel-zaehler').textContent === '1 / 10', 'Zähler steht auf 1 / 10');

const ersteFrage = dok.getElementById('spiel-frage').textContent;
dok.getElementById('knopf-ueberspringen').click();
pruefe(dok.getElementById('spiel-falsch').textContent === '1', 'Überspringen zählt hoch');
await new Promise((r) => setTimeout(r, 1000));
pruefe(dok.getElementById('spiel-frage').textContent !== ersteFrage, 'nächste Frage erscheint');
dok.getElementById('knopf-abbrechen').click();
pruefe(dok.getElementById('start').hidden === false, 'Abbrechen führt zurück');

/* --- Oberfläche: Editor -------------------------------------------------- */

abschnitt('Oberfläche: Editor');

Editor.oeffnen(Wimmelbild.get('test-bild'));
pruefe(dok.getElementById('editor').hidden === false, 'Editor öffnet');
pruefe(dok.getElementById('ed-titel').value === 'Testbild', 'Titel im Kopf');
pruefe(dok.querySelectorAll('#ed-fragen li').length === 4, 'vier Fragen in der Liste');
pruefe(dok.querySelectorAll('#ed-marker .marke').length === 3,
  'drei gesetzte Ziele als Marken (die vierte Frage hat keine)');

// Frage anlegen und beschriften
dok.getElementById('ed-neu-frage').click();
pruefe(dok.querySelectorAll('#ed-fragen li').length === 5, 'Frage angelegt');
const eingabe = dok.querySelector('#ed-fragen [aria-current="true"] input');
eingabe.value = 'Wo ist der blaue Drachen?';
eingabe.dispatchEvent(new window.Event('input', { bubbles: true }));
const angelegt = Editor.offenerSatz().fragen[4];
pruefe(angelegt.frage === 'Wo ist der blaue Drachen?', 'Fragetext übernommen');
pruefe(angelegt.ziel === 'blauer Drachen', 'Zielname zieht mit: ' + angelegt.ziel);

// Stelle im Bild setzen
function klickInsBild(x, y) {
  const b = dok.getElementById('ed-buehne');
  ['pointerdown', 'pointerup'].forEach((typ) => {
    b.dispatchEvent(new window.MouseEvent(typ, { clientX: x, clientY: y, bubbles: true }));
  });
}
klickInsBild(500, 350);
pruefe(angelegt.gesetzt === true, 'Klick ins Bild setzt die Stelle');
pruefe(angelegt.x > 0 && angelegt.y > 0,
  'Koordinate im Koordinatenraum: ' + angelegt.x + ',' + angelegt.y);
pruefe(dok.querySelectorAll('#ed-marker .marke').length === 4, 'Marke erscheint');

// Der Klick trifft die Bildmitte – die Bühne ist 1000x700, das Bild 800x600.
const mitte = Wimmelbild.ausBildpixel(Editor.offenerSatz(), 400, 300);
pruefe(Math.abs(angelegt.x - mitte.x) < 40 && Math.abs(angelegt.y - mitte.y) < 40,
  'Klick landet nahe der erwarteten Stelle (' + mitte.x + ',' + mitte.y + ')');

await new Promise((r) => setTimeout(r, 800)); // Verzögerung fürs Speichern
pruefe(Wimmelbild.get('test-bild').fragen.length === 5, 'Änderung gespeichert');

// Frage löschen
const zeile = dok.querySelector('#ed-fragen [aria-current="true"]');
[...zeile.querySelectorAll('button')].find((b) => b.textContent === 'Frage löschen').click();
pruefe(Editor.offenerSatz().fragen.length === 4, 'Frage gelöscht');
pruefe(Editor.offenerSatz().fragen.map((f) => f.nr).join(',') === '1,2,3,4', 'neu nummeriert');

// Export-Dialog
dok.getElementById('ed-export').click();
pruefe(!!dok.querySelector('.dialog'), 'Export-Dialog offen');
pruefe(dok.querySelector('.dialog textarea').value.includes('Wimmelbild.register'),
  'Vorschau zeigt das Modul');
const jsonWahl = [...dok.querySelectorAll('.dialog input[type="radio"]')][1];
jsonWahl.checked = true;
jsonWahl.dispatchEvent(new window.Event('change', { bubbles: true }));
pruefe(dok.querySelector('.dialog textarea').value.includes('"format": "wimmelbild/1"'),
  'Umschalten auf JSON ändert die Vorschau');
H.schliessen();

// Import-Dialog
dok.getElementById('ed-import').click();
const feld = dok.querySelector('.dialog textarea');
feld.value = '99. Wo ist der Anker? (10,20)';
feld.dispatchEvent(new window.Event('input', { bubbles: true }));
pruefe(dok.querySelector('.dialog .vorschau').textContent.includes('1 Fragen erkannt'),
  'Import-Vorschau meldet die erkannte Frage');
[...dok.querySelectorAll('.dialog button')].find((b) => b.textContent === 'Übernehmen').click();
pruefe(Editor.offenerSatz().fragen.length === 5, 'importierte Frage angehängt');
pruefe(Editor.offenerSatz().fragen[4].ziel === 'Anker', 'importierte Frage benannt');
pruefe(Editor.offenerSatz().fragen[4].nr === 5, 'importierte Frage neu nummeriert');

dok.getElementById('ed-fertig').click();
pruefe(dok.getElementById('start').hidden === false, 'Fertig führt zurück zur Auswahl');

Wimmelbild.verwerfen('test-bild');
pruefe(!Wimmelbild.get('test-bild'), 'Testsatz wieder entfernt');

/* ------------------------------------------------------------------------ */

void gruppe;
console.log('\n' + (fehler ? fehler + ' Prüfung(en) fehlgeschlagen' : 'alle Prüfungen bestanden'));
process.exit(fehler ? 1 : 0);
