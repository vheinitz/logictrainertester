import { engine } from './core/engine.js';
import { setLanguage, t } from './i18n/i18n-core.js';
import { anwenden as einstellungenAnwenden } from './core/settings.js';

/**
 * Beim allerersten Öffnen die Einführung zeigen, nicht die Aufgabenliste.
 *
 * Ohne sie sieht man 29 Kacheln und hält die App für eine Spielesammlung.
 * Der Ablauf – erst durchtesten, dann üben, später wiederholen – macht aber
 * den Zweck aus. Danach startet die App wie gewohnt bei den Gruppen; die
 * Einführung bleibt über den Kopfbereich erreichbar.
 */
const ERSTBESUCH = 'logik-intro-gesehen';

document.addEventListener('DOMContentLoaded', () => {
  einstellungenAnwenden();
  let ersteMal = false;
  try { ersteMal = !localStorage.getItem(ERSTBESUCH); } catch (e) { /* ohne Speicher eben nicht */ }
  if (ersteMal) {
    try { localStorage.setItem(ERSTBESUCH, '1'); } catch (e) { /* egal */ }
    engine.view = 'intro';
  }
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
