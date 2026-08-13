import { t } from '../i18n/i18n-core.js';
import { registry } from '../games/index.js';

/**
 * Engine – zentraler State, Navigation und Spiel-Lifecycle.
 *
 * Neu gegenüber der ersten Fassung:
 *   - activeGame: genau ein geladenes Spielmodul, mit dispose() beim Verlassen.
 *     Damit können Spiele Timer besitzen, ohne dass sie nach dem Wegnavigieren
 *     weiterlaufen und fremden State mutieren.
 *   - dispatch(): eine einzige Bridge statt window._xyz pro Spiel.
 *   - renderGame(): rendert nur den Spielbereich neu. Ein Countdown, der 4×/s
 *     tickt, baut sonst 4×/s die komplette Seite neu auf.
 */
export const engine = {
  view: 'menu',
  history: [],
  gameState: {},
  ageFilter: null,
  scaleFilter: null,
  activeGame: null,   // { id, mod }

  // ─── Navigation ───────────────────────────────────────
  navigateTo(view, data) {
    this.disposeActiveGame();
    this.history.push({ view: this.view, data: cloneState(this.gameState) });
    // History begrenzen – sie wuchs vorher unbegrenzt mit jedem Klick
    if (this.history.length > 20) this.history.shift();
    this.view = view;
    if (data !== undefined) this.gameState = data;
    this.render();
    this.updateBackButton();
    window.scrollTo(0, 0);
  },

  goBack() {
    if (!this.history.length) return;
    this.disposeActiveGame();
    const prev = this.history.pop();
    this.view = prev.view;
    this.gameState = prev.data || {};
    this.render();
    this.updateBackButton();
    window.scrollTo(0, 0);
  },

  updateBackButton() {
    const btn = document.getElementById('btnBack');
    if (btn) btn.style.display = this.history.length > 0 ? 'inline-flex' : 'none';
  },

  // ─── Spiel-Lifecycle ──────────────────────────────────
  /** Lädt das Spielmodul (einmal) und macht es zum aktiven Spiel. */
  async ensureGame(id) {
    if (this.activeGame && this.activeGame.id === id) return this.activeGame.mod;
    this.disposeActiveGame();
    const load = registry[id];
    if (!load) throw new Error('Unbekanntes Spielmodul: ' + id);
    const mod = await load();
    this.activeGame = { id, mod };
    return mod;
  },

  disposeActiveGame() {
    const g = this.activeGame;
    if (!g) return;
    this.activeGame = null;
    try { if (typeof g.mod.dispose === 'function') g.mod.dispose(this.gameState); }
    catch (e) { /* dispose darf die Navigation nie blockieren */ }
  },

  /**
   * Einziger Einstiegspunkt für Klicks aus dem Spiel-HTML.
   * Das Spiel exportiert `actions = { name(gs, ...args) {} }`.
   * Gibt eine Action `false` zurück, wird nicht neu gerendert.
   */
  dispatch(action, ...args) {
    const g = this.activeGame;
    if (!g || !g.mod || !g.mod.actions) return;
    const fn = g.mod.actions[action];
    if (typeof fn !== 'function') return;
    let result;
    try { result = fn(this.gameState, ...args); }
    catch (e) { console.error('[game action] ' + g.id + '.' + action, e); return; }
    if (result !== false) this.renderGame();
  },

  // ─── Rendering ────────────────────────────────────────
  render() {
    const titleEl = document.getElementById('headerTitle');
    if (titleEl) titleEl.textContent = t('appHeader');
    const backBtn = document.getElementById('btnBack');
    if (backBtn) backBtn.textContent = t('back');

    const lang = localStorage.getItem('logik-lang') || 'de';
    ['de', 'ru', 'en'].forEach(l => {
      const el = document.getElementById('lang' + l.toUpperCase());
      if (el) el.style.background = lang === l ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)';
    });

    import('../ui/views.js').then(m => m.renderView(engine.view));
  },

  /**
   * Nur den Spielbereich neu zeichnen. Fällt auf den vollen Render zurück,
   * wenn der Bereich (noch) nicht im DOM ist.
   */
  renderGame() {
    const g = this.activeGame;
    const area = document.getElementById('gameArea');
    if (!g || !area) { this.render(); return; }
    try {
      area.innerHTML = g.mod.render(this.gameState);
    } catch (e) {
      console.error('[game render] ' + g.id, e);
      return;
    }
    import('../ui/views.js').then(m => {
      if (typeof m.updateScoreLine === 'function') m.updateScoreLine();
      if (typeof m.autoPersist === 'function') m.autoPersist();
    });
  }
};

/** structuredClone kann an Nicht-Klonbarem scheitern – dann flach kopieren. */
function cloneState(s) {
  try { return structuredClone(s); }
  catch (e) { return { ...s }; }
}

// Globale Bridge für onclick-Handler im generierten HTML
// LOGIK_ENGINE liegt daneben, wie LOGIK_SETTINGS: für die Konsole beim
// Suchen eines Fehlers und für Tests, die den Spielzustand brauchen, ohne
// ihn über den Bildschirm erraten zu müssen.
window.LOGIK_ENGINE = engine;
window.navigateTo = (view, data) => engine.navigateTo(view, data);
window.goBack = () => engine.goBack();
window.G = (action, ...args) => engine.dispatch(action, ...args);
