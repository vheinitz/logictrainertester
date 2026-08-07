import { t } from '../i18n/i18n-core.js';

/**
 * Engine – central state & navigation
 * Singleton that orchestrates views, games, and lifecycle
 */
export const engine = {
  view: 'menu',
  history: [],
  gameState: {},
  ageFilter: null,
  scaleFilter: null,
  persistentScores: {},

  navigateTo(view, data) {
    this.history.push({ view: this.view, data: structuredClone(this.gameState) });
    this.view = view;
    if (data !== undefined) this.gameState = data;
    this.render();
    const btn = document.getElementById('btnBack');
    if (btn) btn.style.display = this.history.length > 0 ? 'inline-flex' : 'none';
    window.scrollTo(0, 0);
  },

  goBack() {
    if (!this.history.length) return;
    const prev = this.history.pop();
    this.view = prev.view;
    this.gameState = prev.data || {};
    this.render();
    const btn = document.getElementById('btnBack');
    if (btn) btn.style.display = this.history.length > 0 ? 'inline-flex' : 'none';
    window.scrollTo(0, 0);
  },

  render() {
    // Update header
    const titleEl = document.getElementById('headerTitle');
    if (titleEl) titleEl.textContent = t('appHeader');
    const backBtn = document.getElementById('btnBack');
    if (backBtn) backBtn.textContent = t('back');

    // Highlight language
    const lang = localStorage.getItem('logik-lang') || 'de';
    ['de', 'ru'].forEach(l => {
      const el = document.getElementById('lang' + l.toUpperCase());
      if (el) el.style.background = lang === l ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)';
    });

    // Dispatch view
    import('../ui/views.js').then(m => {
      m.renderView(engine.view);
    });
  }
};

// Global bridge for onclick handlers in HTML
window.navigateTo = (view, data) => engine.navigateTo(view, data);
window.goBack = () => engine.goBack();
