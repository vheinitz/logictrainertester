/**
 * Kopfnavigation.
 *
 * Vorher lagen die Seiten als Knopfreihe auf der Startseite: wer in der
 * Statistik war, musste erst zurück, um in die Einstellungen zu kommen. Mit
 * inzwischen neun Seiten trägt das nicht mehr.
 *
 * Die Gliederung folgt dem Ablauf, den die Einführung beschreibt – erst
 * verstehen, dann planen, dann testen, dann üben, dann auswerten. Wer die
 * Leiste liest, sieht den Weg durch die App, ohne ihn erklärt zu bekommen.
 *
 * Aufklappen per Klick, nicht beim Überfahren mit der Maus: auf einem Tablet
 * gibt es kein Überfahren, und die App läuft überwiegend auf Tablets.
 *
 * „Über die App" steht bewusst nicht in der Leiste: der Titel im Kopf führt
 * schon dorthin, und ein Eintrag, der dasselbe tut wie das, was direkt
 * daneben steht, kostet nur Breite. Die Seite zur Herkunft ist von dort
 * verlinkt.
 */
import { lang, esc } from '../core/html.js';
import { engine } from '../core/engine.js';

const T = {
  hintergrund:{ de: 'Herkunft und Hintergrund', ru: 'Истоки и предыстория', en: 'Origin and background' },
  plan:       { de: 'Plan', ru: 'План', en: 'Plan' },
  testen:     { de: 'Testen', ru: 'Тестирование', en: 'Testing' },
  gruppen:    { de: 'Gruppen', ru: 'Группы', en: 'Groups' },
  alle:       { de: 'Alle Aufgaben', ru: 'Все задания', en: 'All tasks' },
  lernen:     { de: 'Lernen', ru: 'Занятия', en: 'Learning' },
  methoden:   { de: 'Methoden', ru: 'Методы', en: 'Methods' },
  ideen:      { de: '50 Buch-Ideen', ru: '50 идей из книг', en: '50 book ideas' },
  auswertung: { de: 'Auswertung', ru: 'Результаты', en: 'Results' },
  statistik:  { de: 'Statistik', ru: 'Статистика', en: 'Statistics' },
  profil:     { de: 'Kognitives Profil', ru: 'Когнитивный профиль', en: 'Cognitive profile' },
  einstell:   { de: 'Einstellungen', ru: 'Настройки', en: 'Settings' }
};
const t = k => { const l = lang(); return T[k][l] || T[k].de; };

/**
 * Aufbau der Leiste. Einträge mit `kinder` klappen auf, die übrigen
 * navigieren sofort. `views` sagt, bei welchen Ansichten der Eintrag als
 * aktiv gilt – der Plan gehört zu 'plan', „Testen" zu allem, was mit dem
 * Durchführen zu tun hat.
 */
function aufbau() {
  return [
    { id: 'plan', icon: '🗺️', label: t('plan'), view: 'plan', views: ['plan', 'factor'] },
    { id: 'testen', icon: '🧪', label: t('testen'), views: ['groups', 'modules', 'menu', 'scale', 'training'], kinder: [
      { icon: '📊', label: t('gruppen'), view: 'groups' },
      { icon: '🎯', label: t('alle'), view: 'modules' }
    ] },
    { id: 'lernen', icon: '🧰', label: t('lernen'), views: ['methods', 'method', 'ideen'], kinder: [
      { icon: '🧰', label: t('methoden'), view: 'methods' },
      { icon: '📚', label: t('ideen'), view: 'ideen' }
    ] },
    { id: 'auswertung', icon: '📈', label: t('auswertung'), views: ['stats', 'radar'], kinder: [
      { icon: '📊', label: t('statistik'), view: 'stats' },
      { icon: '🎯', label: t('profil'), view: 'radar' }
    ] },
    { id: 'einstell', icon: '⚙️', label: t('einstell'), view: 'settings', views: ['settings'], rechts: true }
  ];
}

/** Welcher Eintrag ist offen? Nur einer zur Zeit. */
let offen = null;

export function renderNav(aktuelleView) {
  const el = document.getElementById('mainNav');
  if (!el) return;

  el.innerHTML = aufbau().map(e => {
    const aktiv = (e.views || []).includes(aktuelleView);
    const klasse = 'nav-item' + (aktiv ? ' nav-active' : '') + (e.rechts ? ' nav-rechts' : '');

    if (!e.kinder) {
      return `<button class="${klasse}" onclick="window._nav('${e.view}', event)">
        <span class="nav-icon">${e.icon}</span><span class="nav-label">${esc(e.label)}</span></button>`;
    }
    const auf = offen === e.id;
    return `<div class="nav-group${e.rechts ? ' nav-rechts' : ''}">
      <button class="${klasse}" aria-expanded="${auf}" onclick="window._navToggle('${e.id}', event)">
        <span class="nav-icon">${e.icon}</span><span class="nav-label">${esc(e.label)}</span>
        <span class="nav-pfeil">${auf ? '▴' : '▾'}</span></button>
      <div class="nav-drop" style="display:${auf ? 'block' : 'none'}">
        ${e.kinder.map(k => `<button class="nav-sub${(k.view === aktuelleView) ? ' nav-active' : ''}"
          onclick="window._nav('${k.view}', event)">${k.icon} <span class="nav-label">${esc(k.label)}</span></button>`).join('')}
      </div>
    </div>`;
  }).join('');
}

/**
 * Auf- und zuklappen.
 *
 * `stopPropagation` ist hier nicht Vorsicht, sondern nötig: der Klick wird
 * unten am Knopf behandelt, dabei zeichnet renderNav die Leiste neu und
 * tauscht den Knopf aus. Wenn das Ereignis danach beim Wächter unten ankommt,
 * ist sein Ziel nicht mehr Teil der Leiste – der Wächter hielte es für einen
 * Klick daneben und machte sofort wieder zu. Genau das passierte: das Menü
 * ging auf und im selben Augenblick wieder zu, es sah aus wie „nichts".
 */
window._navToggle = (id, ev) => {
  if (ev) ev.stopPropagation();
  offen = offen === id ? null : id;
  renderNav(engine.view);
};

window._nav = (view, ev) => {
  if (ev) ev.stopPropagation();
  offen = null;
  engine.navigateTo(view);
};

// Ein Klick irgendwo sonst schließt das Aufgeklappte. Ohne das bleibt es
// stehen, wenn man daneben tippt, und verdeckt den Seiteninhalt.
if (typeof document !== 'undefined') {
  document.addEventListener('click', () => {
    if (!offen) return;
    offen = null;
    renderNav(engine.view);
  });
}
