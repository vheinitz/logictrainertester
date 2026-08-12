import { engine } from './core/engine.js';
import { setLanguage, t } from './i18n/i18n-core.js';

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  engine.render();
});

/**
 * Karten sind <div> mit onclick – per Maus bedienbar, per Tastatur nicht.
 * Dieser eine Zuhörer macht alles, was role="button" trägt, mit Enter und
 * Leertaste auslösbar, ohne jede Karte einzeln zu verdrahten.
 */
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
  const el = e.target && e.target.closest && e.target.closest('[role="button"][tabindex]');
  if (!el || el.tagName === 'BUTTON' || el.tagName === 'A') return;
  e.preventDefault();
  el.click();
});

// Expose key functions globally
window.setLanguage = setLanguage;
window.navigateTo = (view, data) => engine.navigateTo(view, data);
window.goBack = () => engine.goBack();
