/**
 * Ansichten für die Fördermethoden.
 *
 *   'methods'  Übersicht nach Kategorien
 *   'method'   Einzelseite: was es ist, Anleitung, Links, Material
 *
 * Anders als die Spielbildschirme sind das reine Lesetexte für Erwachsene –
 * hier ist ausführlicher Text richtig, nicht sparsamer.
 */
import { methods, CATEGORIES, getMethod, methodsInCategory } from '../data/methods/index.js';
import { engine } from '../core/engine.js';
import { esc, lang, jsArg } from '../core/html.js';
import { getMiniapp } from '../data/miniapps.js';
import { appsZuMethode } from '../data/miniapp-zuordnung.js';

/** Mehrsprachiges Feld auflösen; fällt auf Deutsch zurück, solange EN fehlt. */
function tx(field, fallback = '') {
  if (!field) return fallback;
  if (typeof field === 'string') return field;
  const l = lang();
  return field[l] || field.de || field.ru || fallback;
}

/** Mehrsprachige Liste auflösen. */
function txList(field) {
  if (!field) return [];
  const l = lang();
  const v = (field[l] && field[l].length) ? field[l] : (field.de || field.ru || []);
  return Array.isArray(v) ? v : [];
}

const KIND_ICON = {
  wiki: '📖', anleitung: '📋', hersteller: '🏭', community: '👥', video: '▶️'
};

/**
 * Oberflächentexte dieser Ansicht.
 *
 * Bewusst hier und nicht in i18n-core.js: das ist ein geschlossener Satz von
 * gut einem Dutzend Begriffen, die nur diese beiden Seiten brauchen. In der
 * zentralen Tabelle wären sie schwerer zu finden als hier daneben.
 */
const UI = {
  titel:      { de: 'Fördermethoden', ru: 'Методы развития', en: 'Training methods' },
  untertitel: { de: 'Wege, die getesteten Fähigkeiten im Alltag zu stärken',
                ru: 'Способы развивать проверяемые способности в повседневной жизни',
                en: 'Ways to strengthen the tested abilities in everyday life' },
  alter:      { de: 'Alter', ru: 'Возраст', en: 'Age' },
  ueben:      { de: 'So wird geübt', ru: 'Как заниматься', en: 'How to practise' },
  ankommt:    { de: 'Worauf es ankommt', ru: 'На что обратить внимание', en: 'What matters' },
  material:   { de: 'Material', ru: 'Материалы', en: 'Materials' },
  selbstbau:  { de: 'Selbst herstellen', ru: 'Сделать самому', en: 'Make it yourself' },
  bezug:      { de: 'Hersteller / Bezug', ru: 'Производитель / где купить', en: 'Maker / where to buy' },
  weiterlesen:{ de: 'Weiterlesen', ru: 'Читать дальше', en: 'Read more' },
  zurueck:    { de: '← Zurück', ru: '← Назад', en: '← Back' },
  alle:       { de: 'Alle Methoden', ru: 'Все методы', en: 'All methods' },
  amGeraet:   { de: 'Dieselbe Übung am Bildschirm', ru: 'То же упражнение на экране', en: 'The same exercise on screen' },
  amGeraetHinweis: {
    de: 'Für Abende ohne Material oder ohne Ruhe zum Aufbauen. Mit echten Dingen in der Hand lernt ein Kind mehr – die Seite oben beschreibt, wie es geht.',
    ru: 'Для вечеров, когда нет материала или времени всё разложить. С настоящими предметами в руках ребёнок усваивает больше — как это делать, описано выше.',
    en: 'For evenings without materials or without the calm to set them up. A child learns more with real things in hand – the page above describes how.'
  },
  oeffnen:    { de: 'öffnen', ru: 'открыть', en: 'open' }
};

const ui = k => { const l = lang(); return UI[k][l] || UI[k].de; };

/** Karte einer Methode für Listen. */
export function methodCard(m) {
  return `<div class="card" role="button" tabindex="0" style="border-left:4px solid var(--primary-light)"
       onclick="navigateTo('method',{methodId:${jsArg(m.id)}})">
    <div class="card-icon">${m.icon || '📌'}</div>
    <div class="card-title">${esc(tx(m.title))}</div>
    <div class="card-desc">${esc(tx(m.short))}</div>
    ${m.ages ? `<div class="card-badges"><span class="badge badge-age">${ui('alter')} ${esc(m.ages)}</span></div>` : ''}
  </div>`;
}

/** Übersicht aller Methoden, nach Kategorien gruppiert. */
export function renderMethods(main) {
  const l = lang();
  let html = `<h2 class="page-title">🧰 ${ui('titel')}</h2>
    <p class="page-subtitle">${methods.length} · ${ui('untertitel')}</p>`;

  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const list = methodsInCategory(key);
    if (!list.length) continue;
    html += `<h3 class="section-title">${cat.icon} ${esc(cat[l] || cat.de)} (${list.length})</h3>
      <div class="card-grid">${list.map(methodCard).join('')}</div>`;
  }

  main.innerHTML = html;
}

/** Einzelseite einer Methode. */
export function renderMethod(main) {
  const m = getMethod(engine.gameState.methodId);
  if (!m) { renderMethods(main); return; }

  const steps = txList(m.steps);
  const tips = txList(m.tips);

  let html = `<div class="training-container">
    <div class="training-header">
      <span class="icon">${m.icon || '📌'}</span>
      <div>
        <h2>${esc(tx(m.title))}</h2>
        <div class="meta">${esc(tx(m.short))}${m.ages ? ' | ' + ui('alter') + ' ' + esc(m.ages) : ''}</div>
      </div>
    </div>
    <div style="width:100%">`;

  if (m.svg) {
    html += `<div style="max-width:240px;margin:0 auto 18px">${m.svg}</div>`;
  }

  html += `<p style="line-height:1.65">${esc(tx(m.what))}</p>`;

  if (steps.length) {
    html += `<h3 class="section-title" style="margin-top:22px">📋 ${ui('ueben')}</h3>
      <ol style="margin-left:20px;line-height:1.7">
        ${steps.map(s => `<li style="margin-bottom:6px">${esc(s)}</li>`).join('')}
      </ol>`;
  }

  if (tips.length) {
    html += `<div class="tutor-guide" style="max-width:none;margin-top:20px">
      <h3>💡 ${ui('ankommt')}</h3>
      <ul style="margin-left:18px;line-height:1.7">
        ${tips.map(t => `<li>${esc(t)}</li>`).join('')}
      </ul></div>`;
  }

  if (m.products && m.products.length) {
    html += `<h3 class="section-title" style="margin-top:22px">🧩 ${ui('material')}</h3>`;
    for (const p of m.products) {
      html += `<div style="background:var(--bg);border-radius:var(--radius-sm);padding:14px 16px;margin-bottom:12px">
        <div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">
          ${p.svg ? `<div style="width:110px;flex:0 0 110px">${p.svg}</div>` : ''}
          <div style="flex:1;min-width:200px">
            <div style="font-weight:700">${esc(p.name)}${p.maker ? ` <span style="font-weight:400;color:var(--text-light)">· ${esc(p.maker)}</span>` : ''}</div>
            ${p.price ? `<div style="font-size:.85em;color:var(--text-light)">${esc(p.price)}</div>` : ''}
            ${p.note ? `<p style="font-size:.92em;margin-top:6px;line-height:1.6">${esc(tx(p.note))}</p>` : ''}
            ${p.diy ? `<p style="font-size:.9em;margin-top:8px;line-height:1.6;padding-left:10px;border-left:3px solid var(--green)">
              <b>🔨 ${ui('selbstbau')}:</b> ${esc(tx(p.diy))}</p>` : ''}
            ${p.url ? `<div style="margin-top:8px"><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer"
              style="color:var(--primary);font-size:.9em;font-weight:600">🏭 ${ui('bezug')} ↗</a></div>` : ''}
          </div>
        </div></div>`;
    }
  }

  if (m.links && m.links.length) {
    html += `<h3 class="section-title" style="margin-top:22px">🔗 ${ui('weiterlesen')}</h3>
      <ul style="list-style:none;line-height:2">
        ${m.links.map(k => `<li>${KIND_ICON[k.kind] || '🔗'}
          <a href="${esc(k.url)}" target="_blank" rel="noopener noreferrer"
             style="color:var(--primary);font-weight:600">${esc(tx(k.label) || k.url)} ↗</a></li>`).join('')}
      </ul>`;
  }

  // Die Apps ganz unten: die Anleitung mit echtem Material steht darüber,
  // und was oben steht, wird gemacht. Verlinkt statt eingebettet – eine App
  // in einem Rahmen innerhalb der Seite bricht bei file:// je nach Browser
  // weg, ein Verweis nicht.
  const apps = appsZuMethode(m.id).map(getMiniapp).filter(Boolean);
  if (apps.length) {
    html += `<h3 class="section-title" style="margin-top:22px">💻 ${ui('amGeraet')}</h3>
      <p style="color:var(--text-light);font-size:.88em;line-height:1.6;margin-bottom:10px">
        ${esc(ui('amGeraetHinweis'))}</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${apps.map(a => `<a href="${esc(a.pfad)}" target="_blank" rel="noopener noreferrer"
            data-role="miniapp" data-app="${esc(a.id)}"
            style="display:flex;align-items:center;gap:10px;text-decoration:none;color:inherit;
                   background:var(--bg);border-radius:var(--radius-sm);padding:10px 14px;
                   border:1px solid #E4E0F4">
            <span style="font-size:1.5em">${a.icon}</span>
            <span><span style="font-weight:700">${esc(tx(a.titel))}</span>
              <span style="color:var(--text-light);font-size:.85em"> · ${ui('oeffnen')} ↗</span></span>
          </a>`).join('')}
      </div>`;
  }

  html += `</div></div>
`;

  main.innerHTML = html;
}
