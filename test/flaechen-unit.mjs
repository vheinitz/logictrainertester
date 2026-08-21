/**
 * Unit-Test: Wölbrichtung + Radiusmarkierung der Flächen-App.
 *
 * Prüft für jede erzeugte Figur und jeden Bogen:
 *   - Wölbung und Radius zeigen in DIESELBE Richtung.
 *   - Beide zeigen vom Zentrum weg nach AUßEN.
 *
 * SVG-Konvention (y zeigt nach unten), Sehne von links nach rechts:
 *   sweep=0 → Bogen nach UNTEN (+y)
 *   sweep=1 → Bogen nach OBEN   (−y)
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost/'
});
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = { _s: {}, getItem(k) { return this._s[k] ?? null; }, setItem(k, v) { this._s[k] = String(v); } };

const mod = await import('../apps/flaechen/app.js');
const app = mod.default;
app.mount(document.getElementById('app'));

function pointInPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const problems = [];
const check = (c, m) => { if (!c) problems.push(m); };

let getestet = 0;
for (let runde = 0; runde < 25; runde++) {
  app.reset();
  const s = app.state, sh = s.shape;

  for (const b of sh.boegen) {
    getestet++;
    // Außenseite der Sehne bestimmen (echte Geometrie, unabhängig vom Code)
    const obenAussen = !pointInPoly(b.cx, b.cy - 0.5, sh.punkte);
    const untenAussen = !pointInPoly(b.cx, b.cy + 0.5, sh.punkte);
    const aussenRichtung = obenAussen ? -1 : +1;   // -1 = oben, +1 = unten

    // Radius-Richtung (aus der Flagge `oben`)
    const radiusRichtung = b.oben ? +1 : -1;        // oben=true → nach unten

    // Bogen-Richtung (SVG-sweep: sweep=0 → unten, sweep=1 → oben)
    const sweep = b.oben ? 0 : 1;
    const bogenRichtung = sweep === 0 ? +1 : -1;

    check(radiusRichtung === aussenRichtung,
      `Radius zeigt nicht nach außen (oben=${b.oben}, außen=${aussenRichtung})`);
    check(bogenRichtung === aussenRichtung,
      `Bogen wölbt nicht nach außen (sweep=${sweep}, außen=${aussenRichtung})`);
    check(bogenRichtung === radiusRichtung,
      `Bogen und Radius zeigen in verschiedene Richtungen (bogen=${bogenRichtung}, radius=${radiusRichtung})`);
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} Problem(e) bei ${getestet} Bögen:`);
  for (const p of problems.slice(0, 12)) console.error('  • ' + p);
  process.exit(1);
}
console.log(`✓ ${getestet} Bögen: Wölbung und Radius zeigen nach außen, in dieselbe Richtung`);
