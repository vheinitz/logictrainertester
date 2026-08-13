/**
 * Gemeinsame Bausteine des Minimal-Spielbildschirms.
 *
 * Alle Tests, die „nur die Aufgabe" zeigen, verwenden dieselben vier
 * Elemente: Ablaufbalken, Pausenring, Beenden-Knopf und die Sternenreihe für
 * das beste Niveau. Sie stehen hier einmal, damit ein neues Modul die Hülle
 * nicht nachbaut und dabei leicht abweicht.
 *
 * Balken und Ring sind reine CSS-Animationen. Der negative animation-delay
 * ist der Kniff: nach einem Neuaufbau (etwa weil etwas angetippt wurde)
 * startet die Animation nicht von vorn, sondern springt an die Stelle, die
 * der bereits verstrichenen Zeit entspricht.
 */
import { lang } from './html.js';

/** Ablaufbalken ohne Beschriftung. */
export function bar(total, elapsed) {
  return `<div style="background:#F0EFF8;border-radius:4px;height:8px;overflow:hidden;width:100%;max-width:420px;margin:0 auto 18px">
    <div class="adv-bar" style="animation-duration:${total}ms;animation-delay:-${Math.max(0, elapsed)}ms"></div>
  </div>`;
}

/** Kreisring, etwa für eine kurze Pause. */
export function ring(total, elapsed) {
  return `<svg width="76" height="76" viewBox="0 0 76 76" style="display:block;margin:12px auto">
    <circle cx="38" cy="38" r="30" fill="none" stroke="#F0EFF8" stroke-width="8"/>
    <circle class="adv-ring" cx="38" cy="38" r="30" fill="none" stroke="var(--primary)"
      stroke-width="8" stroke-linecap="round" transform="rotate(-90 38 38)"
      style="animation-duration:${total}ms;animation-delay:-${Math.max(0, elapsed)}ms"/>
  </svg>`;
}

const SHELL_UI = {
  beenden: { de: 'Beenden', ru: 'Завершить', en: 'Stop' },
  bestes:  { de: 'Bestes Niveau', ru: 'Лучший уровень', en: 'Best level' },
  entfernen: { de: 'Zurücknehmen', ru: 'Убрать', en: 'Undo' },
  stumm:   { de: 'Für dieses Spiel muss der Ton eingeschaltet sein (⚙️ Einstellungen).',
             ru: 'Для этого задания нужен звук (⚙️ Настройки).',
             en: 'This exercise needs sound to be on (⚙️ Settings).' }
};
const shu = k => { const l = lang(); return SHELL_UI[k][l] || SHELL_UI[k].de; };

/** Beenden – nur das Symbol, Beschriftung für Screenreader. */
export function stopButton() {
  return `<div style="margin-top:16px">
    <button class="btn btn-secondary btn-small" onclick="G('stop')"
            title="${shu('beenden')}" aria-label="${shu('beenden')}"
            style="padding:6px 14px;font-size:1em">⏹️</button>
  </div>`;
}

/**
 * Hinweis der Hör-Tests, wenn kein Ton möglich ist – zentral, damit die
 * Formulierung nicht in fünf Modulen auseinanderläuft.
 */
export function mutedHint() {
  return `<p style="color:var(--secondary);font-size:.9em;max-width:340px;margin:8px auto 0">${shu('stumm')}</p>`;
}

/** Beschriftung für den „Eingabe zurücknehmen"-Knopf (als title/aria). */
export function removeHint() {
  return shu('entfernen');
}

/** Bestes Niveau als Sternenreihe – ein Stern je Stufe, ohne Beschriftung. */
export function starRow(best) {
  const n = best || 0;
  if (n <= 0) return '';
  return `<div aria-label="${shu('bestes')} ${n}" title="${shu('bestes')} ${n}"
    style="margin-top:18px;font-size:1.15em;letter-spacing:1px;line-height:1.4;max-width:340px">
    ${'⭐'.repeat(n)}
  </div>`;
}

/** Rückmeldung als großes Piktogramm statt als Satz. */
export function pictogram(sym) {
  return `<div style="font-size:4.4em;line-height:1.1">${sym}</div>`;
}
