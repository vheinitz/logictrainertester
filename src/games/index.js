/**
 * Spiel-Registry.
 *
 * Kontrakt jedes Spielmoduls:
 *   init(gs)      → Zustand aufbauen, gs.gd._ready = true setzen
 *   render(gs)    → HTML-String für den Spielbereich
 *   dispose(gs)   → eigene Timer abräumen, _ready zurücksetzen
 *   actions       → { name(gs, ...args) }, aufgerufen über G('name', …)
 *   scoring       → 'count' (richtig/beantwortet) oder 'percent' (Score-Map)
 *
 * Nur lazy Thunks hier – kein statischer Import, sonst entsteht ein
 * Importzyklus mit core/engine.js, das diese Registry benutzt.
 */
export const registry = {
  'seq-zahlenfolgen':     () => import('./seq-zahlenfolgen.js'),
  'seq-wortreihe':        () => import('./seq-wortreihe.js'),
  'seq-handbewegungen':   () => import('./seq-handbewegungen.js'),
  'seq-koffer-packen':    () => import('./seq-koffer-packen.js'),
  'seq-rhythmus':         () => import('./seq-rhythmus.js'),
  'sim-konzeptbildung':   () => import('./sim-konzeptbildung.js'),
  'sim-gesichter':        () => import('./sim-gesichter.js'),
  'sim-rover':            () => import('./sim-rover.js'),
  'sim-dreiecke':         () => import('./sim-dreiecke.js'),
  'sim-bausteine':        () => import('./sim-bausteine.js'),
  'sim-gestaltschliessen':() => import('./sim-gestaltschliessen.js'),
  'sim-tangram':          () => import('./sim-tangram.js'),
  'sim-suchbild':         () => import('./sim-suchbild.js'),
  'lern-atlantis':        () => import('./lern-atlantis.js'),
  'lern-symbole':         () => import('./lern-symbole.js'),
  'lern-memory':          () => import('./lern-memory.js'),
  'lern-storycubes':      () => import('./lern-storycubes.js'),
  'plan-geschichten':     () => import('./plan-geschichten.js'),
  'plan-muster':          () => import('./plan-muster.js'),
  'plan-sudoku':          () => import('./plan-sudoku.js'),
  'plan-zaubertricks':    () => import('./plan-zaubertricks.js'),
  'wiss-wortschatz':      () => import('./wiss-wortschatz.js'),
  'wiss-sachwissen':      () => import('./wiss-sachwissen.js'),
  'wiss-raetsel':         () => import('./wiss-raetsel.js'),
  'wiss-oberbegriffe':    () => import('./wiss-oberbegriffe.js'),
  'wiss-teekesselchen':   () => import('./wiss-teekesselchen.js')
};
