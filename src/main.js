import { engine } from './core/engine.js';
import { setLanguage, t } from './i18n/i18n-core.js';
import { anwenden as einstellungenAnwenden } from './core/settings.js';
import { initZiehen } from './core/drag.js';

/**
 * Die App öffnet mit der Einführung, nicht mit der Aufgabenliste.
 *
 * Wer die App startet, soll zuerst lesen, worum es geht: erst alles
 * durchtesten, dann das Fehlende üben, später erneut messen. Ohne diese
 * Seite wirken 29 Kacheln wie eine Spielesammlung, und der Ablauf – der den
 * Zweck der App ausmacht – bleibt unsichtbar.
 *
 * Bewusst bei jedem Start und nicht nur beim ersten Mal: Die App wird nicht
 * täglich benutzt, sondern in Abständen von Wochen. Bis zum nächsten Mal ist
 * der Ablauf meist wieder vergessen, und ein Merker im Speicher hätte ihn
 * dann gerade dann verborgen, wenn er gebraucht wird. Wer weiterarbeiten
 * will, ist mit einem Klick in der Leiste dort.
 */
const STARTSEITE = 'intro';

document.addEventListener('DOMContentLoaded', () => {
  einstellungenAnwenden();
  initZiehen();
  engine.view = STARTSEITE;
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
