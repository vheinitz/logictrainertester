import { engine } from './core/engine.js';
import { setLanguage, t } from './i18n/i18n-core.js';

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  engine.render();
});

// Expose key functions globally
window.setLanguage = setLanguage;
window.navigateTo = (view, data) => engine.navigateTo(view, data);
window.goBack = () => engine.goBack();
