/**
 * Türme von Hanoi – Planungs- und Sequenzspiel.
 * idee-db: 1
 *
 * Aus der Ideen-DB (Beitrag 1, Gardner: „Ikosaeder-Spiel und Turm von Hanoi“).
 * Drei Stäbe, N Scheiben; nur die oberste darf bewegt werden, größere nie auf
 * kleinere. Ziel: alle Scheiben auf den rechten Stab. Gezählt werden die Züge,
 * optimal sind 2^N − 1.
 *
 * Bedienung: erst einen Stab antippen (oberste Scheibe aufnehmen), dann den
 * Zielstab – oder eine Scheibe direkt zum Zielstab ziehen.
 */
import { MiniApp, svg, resultScreen } from '../_framework/framework.js';

const PEG_X = [100, 300, 500];
const BASE_Y = 250;
const PEG_H = 150;
const DISK_H = 24;
const VIEW_W = 600, VIEW_H = 330;
const FARBEN = ['#FF6B6B', '#FFD93D', '#4D96FF', '#34D399', '#C084FC', '#FB923C'];

function diskWidth(size) { return 44 + size * 36; }
function optimal(n) { return Math.pow(2, n) - 1; }

const app = new MiniApp({
  id: 'hanoi',
  icon: '🗼',
  titel: { de: 'Türme von Hanoi', ru: 'Ханойская башня', en: 'Tower of Hanoi' },
  anweisung: {
    de: 'Lege alle Scheiben auf den rechten Stab. Nur die oberste Scheibe darf bewegt werden, eine größere darf nie auf einer kleineren liegen.',
    ru: 'Перенеси все диски на правый стержень. Можно двигать только верхний диск, больший нельзя класть на меньший.',
    en: 'Move all disks to the right peg. Only the top disk may be moved, and a larger disk may never sit on a smaller one.'
  },
  hilfe: {
    de: 'Antippen: erst der Stab, von dem du nimmst, dann der Zielstab. Oder: die oberste Scheibe direkt zum Zielstab ziehen. Mit 3 Scheiben brauchst du mindestens 7 Züge, mit 4 mindestens 15.',
    ru: 'Коснись стержня, откуда берёшь, затем целевого. Или перетащи верхний диск. Для 3 дисков нужно минимум 7 ходов, для 4 — 15.',
    en: 'Tap the peg you take from, then the target peg. Or drag the top disk. With 3 disks you need at least 7 moves, with 4 at least 15.'
  },
  settingsSchema: {
    scheiben: {
      def: 3, min: 3, max: 5, step: 1,
      label: { de: 'Scheiben', ru: 'Диски', en: 'Disks' },
      hint: { de: 'Mehr Scheiben = mehr Vorausplanung.', ru: 'Больше дисков — больше планирования.', en: 'More disks mean more planning.' }
    }
  },
  auswertung: 'zuege',

  // Einstellung sofort wirken lassen (sonst „ohne Wirkung“).
  onSettingsChange(app) { app.reset(); },

  init(state, app) {
    state.scheiben = app.get('scheiben');
    state.pegs = [[], [], []];
    for (let s = state.scheiben; s >= 1; s--) state.pegs[0].push(s);
    state.zuege = 0;
    state.fertig = false;
    state.gewaehlt = null;
  },

  render(state, app) {
    const stangen = PEG_X.map((x, i) => {
      const gewaehlt = state.gewaehlt === i;
      const stab = svg.rect(x - 12, BASE_Y - PEG_H, 24, PEG_H, '#9b96d4',
        { rx: 6, stroke: gewaehlt ? '#5b4fcf' : 'none', 'stroke-width': 3 });
      const fuss = svg.rect(x - 40, BASE_Y, 80, 10, '#7b76b4', { rx: 4 });
      return svg.group(stab + fuss);
    }).join('');

    // Schrittanzeige in großer Schrift
    const schritte = svg.text(24, 38, `Züge: ${state.zuege}`,
      { 'font-size': 30, 'font-weight': 'bold', fill: '#5b4fcf' });

    const scheiben = state.pegs.flatMap((peg, p) =>
      peg.map((size, k) => {
        const x = PEG_X[p] - diskWidth(size) / 2;
        const y = BASE_Y - (k + 1) * DISK_H;
        const oben = state.gewaehlt === p && k === peg.length - 1;
        return svg.rect(x, y, diskWidth(size), DISK_H - 3, FARBEN[(size - 1) % FARBEN.length],
          { rx: 6, stroke: oben ? '#5b4fcf' : '#333', 'stroke-width': oben ? 3 : 1 });
      })
    ).join('');

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">
      ${schritte}${stangen}${scheiben}
    </svg>`;
  },

  // Tippen: erst Quellstab, dann Zielstab.
  onTap(state, x, y, app) {
    const peg = this._pegBei(x, y);
    if (peg == null) { state.gewaehlt = null; app.rerender(); return; }
    if (state.gewaehlt == null) {
      if (state.pegs[peg].length) state.gewaehlt = peg;
      app.rerender();
      return;
    }
    this._bewegen(app, state.gewaehlt, peg);
  },

  // Ziehen: von einem Stab auf einen anderen fallen lassen.
  onDrop(state, x0, y0, x1, y1, app) {
    const von = this._pegBei(x0, y0);
    const nach = this._pegBei(x1, y1);
    if (von == null || nach == null) { state.gewaehlt = null; app.rerender(); return; }
    this._bewegen(app, von, nach);
  },

  onDrag(state, x0, y0, x, y, app) {
    // einfache Rückmeldung: Quelle markieren
    const von = this._pegBei(x0, y0);
    if (von != null && state.pegs[von].length) state.gewaehlt = von;
  },

  _pegBei(x, y) {
    // x,y in viewBox-Einheiten (onTap rechnet Pixel schon um)
    for (let i = 0; i < PEG_X.length; i++) {
      if (Math.abs(x - PEG_X[i]) < 70 && y > BASE_Y - PEG_H - 30 && y < BASE_Y + 20) return i;
    }
    return null;
  },

  _bewegen(app, von, nach) {
    const s = app.state;
    s.gewaehlt = null;
    if (von === nach || s.fertig) { app.rerender(); return; }
    const quelle = s.pegs[von], ziel = s.pegs[nach];
    if (!quelle.length) { app.rerender(); return; }
    const scheibe = quelle[quelle.length - 1];
    const obenZiel = ziel[ziel.length - 1];
    if (obenZiel !== undefined && scheibe > obenZiel) {
      // Regelverstoß: sanft abweisen, kein Zug.
      app.rerender();
      return;
    }
    quelle.pop();
    ziel.push(scheibe);
    s.zuege++;
    if (s.pegs[2].length === s.scheiben) s.fertig = true;
    app.rerender();
  },

  actions: {
    // Programmatisch/Test: eine Scheibe von Stab `von` nach `nach`.
    bewege(state, von, nach, app) {
      this._bewegen(app, von, nach);
    },
    neu(state, ...args) {
      const app = args[args.length - 1];
      app.init(state, app);
      app.rerender();
    }
  },

  evaluate(state, app) {
    if (state.fertig) {
      const o = optimal(state.scheiben);
      const sek = app ? app.elapsedSek() : 0;
      return {
        fertig: true,
        optimal: o,
        text: { de: 'Alle Scheiben sind drüben!', ru: 'Все диски перенесены!', en: 'All disks moved!' },
        wert: `${state.zuege} Züge in ${sek} s (optimal ${o})`,
      };
    }
    return { text: { de: `${state.zuege} Züge`, ru: `${state.zuege} ходов`, en: `${state.zuege} moves` } };
  }
});

export default app;

// Direkt einbinden (apps/hanoi/index.html) oder als Modul:
export function mount(root) { app.mount(root); }
