/**
 * Smoke-Test für das Mini-App-Framework + eine Beispiel-App (Hanoi).
 *
 * Läuft ohne Browser: jsdom stellt document/window bereit, wie bei den
 * anderen Tests des Projekts.
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost/'
});
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = {
  _s: {},
  getItem(k) { return this._s[k] ?? null; },
  setItem(k, v) { this._s[k] = String(v); }
};

const problems = [];
const check = (cond, msg) => { if (!cond) problems.push(msg); };

const { MiniApp, svg } = await import('../apps/_framework/framework.js');
const mod = await import('../apps/hanoi/app.js');
const app = mod.default;

check(typeof MiniApp === 'function', 'MiniApp fehlt');
check(typeof app.mount === 'function', 'app.mount fehlt');

app.mount(document.getElementById('app'));

// Shell vorhanden?
check(app.root.querySelector('.ma-canvas') !== null, 'Canvas fehlt');
check(app.root.querySelector('svg') !== null, 'SVG fehlt');
check(app.root.querySelector('[data-ma="hilfe"]') !== null, 'Hilfe-Knopf fehlt');
check(app.root.querySelector('[data-ma="settings"]') !== null, 'Einstellungs-Knopf fehlt');

// 3 Scheiben optimal in 7 Zügen lösen
const s = app.state;
check(s.pegs.length === 3 && s.pegs[0].length === 3, 'Startaufbau falsch: ' + JSON.stringify(s.pegs));
const zug = [[0,2],[0,1],[2,1],[0,2],[1,0],[1,2],[0,2]];
for (const [a, b] of zug) app.dispatch('bewege', a, b);
check(s.fertig === true, 'Nach 7 Zügen nicht gewonnen');
check(s.zuege === 7, `Züge=${s.zuege}, erwartet 7`);
check(app.cfg.evaluate(s).optimal === 7, 'Optimalwert falsch');

// Regelverstoß wird blockiert
app.reset();
app.dispatch('bewege', 0, 2);
app.dispatch('bewege', 0, 1);
app.dispatch('bewege', 2, 1);   // 1 auf 2 → verboten
check(JSON.stringify(s.pegs) === JSON.stringify([[3],[2,1],[]]),
  'Regelverstoß nicht blockiert: ' + JSON.stringify(s.pegs));
check(s.zuege === 3, `Züge nach Verstoß=${s.zuege}, erwartet 3`);

// Einstellung ändern und Neustart (max jetzt 5)
app.set('scheiben', 5);
app.reset();
check(app.state.scheiben === 5, 'Scheiben-Einstellung wirkt nicht');
check(app.state.pegs[0].length === 5, 'Neustart mit 5 Scheiben falsch');

// Sprache umschalten (de → ru) und prüfen, dass pick() mitzieht
app.set('sprache', 'ru');
check(localStorage.getItem('miniapp-lang') === 'ru', 'Sprache nicht gespeichert');
const titelRu = app.root.querySelector('h1').textContent;
check(/Ханойская/.test(titelRu), 'Titel nicht auf RU umgeschaltet: ' + titelRu);
app.set('sprache', 'de');

// Zeitmessung
check(typeof app.elapsedSek() === 'number' && app.elapsedSek() >= 0, 'elapsedSek() fehlt');

// svg-Helfer
const r = svg.rect(0, 0, 10, 10, '#f00');
check(r.startsWith('<rect'), 'svg.rect kaputt');

if (problems.length) {
  console.error('✗ ' + problems.length + ' Probleme:');
  for (const p of problems) console.error('  • ' + p);
  process.exit(1);
}
console.log('✓ Mini-App-Framework + Hanoi: ' + 'alles ok');
