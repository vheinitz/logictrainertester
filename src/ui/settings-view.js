/**
 * Einstellungsseite.
 *
 * Baut sich vollständig aus dem SCHEMA in core/settings.js auf – eine neue
 * Einstellung braucht dort einen Eintrag und erscheint hier von selbst. Zwei
 * gepflegte Listen würden sonst auseinanderlaufen.
 */
import { SCHEMA, GROUPS, get, set, reset, veraendert } from '../core/settings.js';
import { engine } from '../core/engine.js';
import { esc, lang } from '../core/html.js';

const UI = {
  titel:   { de: 'Einstellungen', ru: 'Настройки' },
  unter:   { de: 'Gelten für alle Module. Änderungen wirken sofort.',
             ru: 'Действуют для всех модулей. Изменения вступают в силу сразу.' },
  standard:{ de: 'Voreinstellung', ru: 'По умолчанию' },
  zuruecksetzen: { de: '↺ Auf Voreinstellung zurücksetzen', ru: '↺ Вернуть значения по умолчанию' },
  zurueck: { de: '← Zurück', ru: '← Назад' },
  an:      { de: 'an', ru: 'вкл' },
  aus:     { de: 'aus', ru: 'выкл' },
  hinweis: { de: 'Diese Werte betreffen nur den Ablauf, nicht die Ergebnisse. Das Zurücksetzen der Statistik lässt sie stehen.',
             ru: 'Эти значения влияют только на ход занятия, не на результаты. Сброс статистики их не затрагивает.' }
};
const u = k => { const l = lang(); return UI[k][l] || UI[k].de; };
const tx = (o, feld) => { const l = lang(); return o[feld + (l === 'ru' ? 'Ru' : 'De')] || o[l] || o.de; };

export function renderSettings(main) {
  const l = lang();
  let html = `<h2 class="page-title">⚙️ ${u('titel')}</h2>
    <p class="page-subtitle">${u('unter')}</p>
    <div class="training-container"><div class="training-area" style="align-items:stretch">`;

  for (const [gid, g] of Object.entries(GROUPS)) {
    const felder = Object.entries(SCHEMA).filter(([, s]) => s.group === gid);
    if (!felder.length) continue;
    html += `<h3 class="section-title">${g.icon} ${esc(g[l] || g.de)}</h3>`;

    for (const [key, s] of felder) {
      const v = get(key);
      const istStandard = v === s.def;

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

      html += `<div class="setting-row">
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
  }

  html += `<p style="font-size:.85em;color:var(--text-light);margin-top:18px">${u('hinweis')}</p>`;
  html += `</div></div>
    <div style="text-align:center;margin-top:16px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-secondary" onclick="goBack()">${u('zurueck')}</button>
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
