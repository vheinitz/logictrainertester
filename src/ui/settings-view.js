/**
 * Einstellungsseite.
 *
 * Baut sich vollständig aus dem SCHEMA in core/settings.js auf – eine neue
 * Einstellung braucht dort einen Eintrag und erscheint hier von selbst. Zwei
 * gepflegte Listen würden sonst auseinanderlaufen.
 */
import { SCHEMA, GROUPS, get, set, reset, veraendert, moduleGroups } from '../core/settings.js';
import { registry } from '../games/index.js';
import { getModule } from '../data/modules.js';
import { engine } from '../core/engine.js';
import { esc, lang } from '../core/html.js';

const MONATE = {
  de: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
  ru: ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December']
};

const UI = {
  titel:   { de: 'Einstellungen', ru: 'Настройки', en: 'Settings' },
  unter:   { de: 'Gelten für alle Module. Änderungen wirken sofort.',
             ru: 'Действуют для всех модулей. Изменения вступают в силу сразу.',
             en: 'Apply to all modules. Changes take effect immediately.' },
  standard:{ de: 'Voreinstellung', ru: 'По умолчанию', en: 'Default' },
  zuruecksetzen: { de: '↺ Auf Voreinstellung zurücksetzen', ru: '↺ Вернуть значения по умолчанию', en: '↺ Restore defaults' },
  zurueck: { de: '← Zurück', ru: '← Назад', en: '← Back' },
  an:      { de: 'an', ru: 'вкл', en: 'on' },
  aus:     { de: 'aus', ru: 'выкл', en: 'off' },
  unbekannt: { de: 'nicht angegeben', ru: 'не указан', en: 'not given' },
  alterHinweis: { de: 'Ohne Geburtsjahr gibt es keine altersnormierte Einordnung, und Aufgaben mit Schrift oder Ziffern werden nicht gefiltert.',
                  ru: 'Без года рождения нет возрастной оценки, и задания с текстом и цифрами не фильтруются.',
                  en: 'Without a year of birth there is no age-normed rating, and tasks with text or digits are not filtered.' },
  hinweis: { de: 'Diese Werte betreffen nur den Ablauf, nicht die Ergebnisse. Das Zurücksetzen der Statistik lässt sie stehen.',
             ru: 'Эти значения влияют только на ход занятия, не на результаты. Сброс статистики их не затрагивает.',
             en: 'These values only affect pacing, not results. Resetting the statistics leaves them untouched.' }
};
const u = k => { const l = lang(); return UI[k][l] || UI[k].de; };
/** hintDe/hintRu/hintEn bzw. de/ru/en aus einem SCHEMA-Eintrag. */
const tx = (o, feld) => {
  const l = lang();
  const suffix = l.charAt(0).toUpperCase() + l.slice(1);
  return o[feld + suffix] || o[feld + 'De'] || o[l] || o.de;
};

/**
 * Module melden ihre eigenen Einstellungen beim Laden an. Damit die Seite
 * alle zeigt und nicht nur die der zuletzt gespielten, werden hier einmal
 * alle Module geladen. Sie liegen ohnehin im selben Bundle – das kostet nur
 * das Ausführen, keinen weiteren Netzzugriff.
 */
let alleGeladen = null;
async function ladeAlleModule() {
  if (!alleGeladen) {
    alleGeladen = Promise.all(Object.values(registry).map(load => load().catch(() => null)));
  }
  return alleGeladen;
}

/** Ein Regler mit Beschriftung, Wert und – falls verstellt – der Voreinstellung. */
function reglerZeile(key, s, l) {
  const v = get(key);
  const istStandard = v === s.def;
  return `<div class="setting-row">
      <div class="setting-label">
        <b>${esc(s[l] || s.de)}</b>
        <span>${esc(tx(s, 'hint'))}</span>
      </div>
      <div style="display:flex;align-items:center;gap:10px;flex:0 0 auto">
        <input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${v}"
               aria-label="${esc(s[l] || s.de)}"
               oninput="window._setSetting('${key}', this.value)"
               style="width:150px">
        <span style="min-width:62px;text-align:right;font-weight:800;color:var(--primary)">
          ${v}${s.unit ? ' ' + s.unit : ''}</span>
      </div>
    </div>
    ${istStandard ? '' : `<div style="text-align:right;font-size:.75em;color:var(--text-light);margin:-6px 0 6px">
        ${u('standard')}: ${s.def}${s.unit ? ' ' + s.unit : ''}</div>`}`;
}

export async function renderSettings(main) {
  await ladeAlleModule();
  const l = lang();
  let html = `<h2 class="page-title">⚙️ ${u('titel')}</h2>
    <p class="page-subtitle">${u('unter')}</p>
    <div class="training-container"><div class="training-area" style="align-items:stretch">`;

  for (const [gid, g] of Object.entries(GROUPS)) {
    const felder = Object.entries(SCHEMA).filter(([, s]) => s.group === gid);
    if (!felder.length) continue;
    html += `<h3 class="section-title">${g.icon} ${esc(g[l] || g.de)}</h3>`;

    // Ohne Geburtsjahr fehlt beides: die Einordnung und die Altersfilterung.
    // Das gehört sichtbar dorthin, wo man es nachtragen kann.
    if (gid === 'kind' && !get('birthYear')) {
      html += `<p style="font-size:.85em;color:var(--secondary);margin:-4px 0 12px;line-height:1.5">${u('alterHinweis')}</p>`;
    }

    for (const [key, s] of felder) {
      const v = get(key);
      const istStandard = v === s.def;

      // Geburtsjahr und -monat sind Auswahllisten, keine Regler: an einem
      // Schieber trifft man ein bestimmtes Jahr kaum, und „nicht angegeben"
      // ließe sich damit gar nicht ausdrücken.
      if (s.kind === 'jahr' || s.kind === 'monat') {
        const werte = s.kind === 'jahr'
          ? Array.from({ length: s.max - s.min + 1 }, (_, i) => s.max - i)
          : Array.from({ length: 12 }, (_, i) => i + 1);
        const beschriften = n => s.kind === 'jahr' ? String(n) : (MONATE[l] || MONATE.de)[n - 1];
        html += `<div class="setting-row">
          <div class="setting-label">
            <b>${esc(s[l] || s.de)}</b>
            <span>${esc(tx(s, 'hint'))}</span>
          </div>
          <select onchange="window._setSetting('${key}', this.value)"
                  aria-label="${esc(s[l] || s.de)}"
                  style="padding:8px 10px;border-radius:10px;border:2px solid #D0CDE8;font-size:1em;min-width:140px">
            <option value="0"${v ? '' : ' selected'}>${s.kind === 'jahr' ? '—' : esc(u('unbekannt'))}</option>
            ${werte.map(n => `<option value="${n}"${n === v ? ' selected' : ''}>${esc(beschriften(n))}</option>`).join('')}
          </select>
        </div>`;
        continue;
      }

      if (s.bool) {
        html += `<div class="setting-row">
          <div class="setting-label">
            <b>${esc(s[l] || s.de)}</b>
            <span>${esc(tx(s, 'hint'))}</span>
          </div>
          <button class="btn btn-small ${v ? 'btn-primary' : 'btn-secondary'}"
            onclick="window._setSetting('${key}', ${v ? 0 : 1})"
            aria-pressed="${v ? 'true' : 'false'}"
            style="min-width:92px">${v ? '🔊 ' + u('an') : '🔇 ' + u('aus')}</button>
        </div>`;
        continue;
      }

      html += reglerZeile(key, s, l);
    }
  }

  // Einstellungen einzelner Module, je Modul ein Abschnitt. Sie stehen hinter
  // den allgemeinen, weil sie nur eine Aufgabe betreffen.
  for (const [modId, felder] of Object.entries(moduleGroups())) {
    const mod = getModule(modId);
    const titel = mod ? ((mod.title && (mod.title[l] || mod.title.de)) || modId) : modId;
    html += `<h3 class="section-title">${mod ? mod.icon : '🎲'} ${esc(titel)}</h3>`;
    for (const [key, s] of felder) html += reglerZeile(key, s, l);
  }

  html += `<p style="font-size:.85em;color:var(--text-light);margin-top:18px">${u('hinweis')}</p>`;
  html += `</div></div>
    <div style="text-align:center;margin-top:16px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
      ${veraendert() ? `<button class="btn btn-secondary" onclick="window._resetSettings()">${u('zuruecksetzen')}</button>` : ''}
    </div>`;

  main.innerHTML = html;
}

window._setSetting = (key, val) => {
  set(key, val);
  // Nur die Anzeige auffrischen; ein voller Neuaufbau würde den Regler
  // mitten im Ziehen unter dem Finger austauschen.
  const main = document.getElementById('mainContent');
  if (main) renderSettings(main);
};

window._resetSettings = () => {
  reset();
  engine.render();
};
