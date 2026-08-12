/**
 * Schemaprüfung für eine Fördermethoden-Seite.
 *
 * Steht bewusst hier und nicht im Test: der Smoke-Test prüft damit alle
 * Seiten auf einmal, `tools/check-method.mjs` prüft einzelne Dateien. Zwei
 * Kopien derselben Regeln würden auseinanderlaufen.
 */

export const KATEGORIEN = [
  'gedaechtnis', 'aufmerksamkeit', 'wahrnehmung', 'logik-denken',
  'raum-konstruktion', 'sprache', 'motorik-rhythmus', 'wissen-alltag'
];

export const LINK_ARTEN = ['wiki', 'anleitung', 'hersteller', 'community', 'video'];

/**
 * @param {object} m  Methodenobjekt (default export einer Seite)
 * @returns {string[]} Liste der Beanstandungen, leer = in Ordnung
 */
export function validateMethod(m) {
  const p = [];
  const wo = `"${(m && m.id) || '?'}"`;
  const sagt = t => p.push(`${wo}: ${t}`);

  if (!m || typeof m !== 'object') return [`${wo}: kein Objekt`];

  if (!/^[a-z0-9-]+$/.test(m.id || '')) sagt('id fehlt oder enthält Unerlaubtes');
  if (!KATEGORIEN.includes(m.category)) sagt(`unbekannte Kategorie "${m.category}"`);
  if (!m.icon) sagt('icon fehlt');
  if (m.ages && !/^\d{1,2}-\d{1,2}$/.test(m.ages)) sagt(`ages "${m.ages}" nicht im Format 6-18`);

  // Pflichttexte
  for (const feld of ['title', 'short', 'what']) {
    if (!m[feld] || typeof m[feld] !== 'object') { sagt(`${feld} fehlt`); continue; }
    for (const l of ['de', 'ru']) {
      const v = m[feld][l];
      if (typeof v !== 'string' || v.trim().length < 4) sagt(`${feld}.${l} fehlt oder ist zu kurz`);
    }
    if (!('en' in m[feld])) sagt(`${feld}.en fehlt (darf leer sein, muss aber da sein)`);
  }
  if (m.what && typeof m.what.de === 'string' && m.what.de.length < 120) {
    sagt('what.de ist sehr knapp – zwei bis vier Sätze erwartet');
  }

  // Anleitung
  for (const l of ['de', 'ru']) {
    const s = m.steps && m.steps[l];
    if (!Array.isArray(s) || s.length < 3) { sagt(`steps.${l}: mindestens 3 Schritte erwartet`); continue; }
    if (!s.every(x => typeof x === 'string' && x.trim().length > 10)) {
      sagt(`steps.${l} enthält leere oder sehr kurze Schritte`);
    }
  }
  const nDe = (m.steps && m.steps.de || []).length;
  const nRu = (m.steps && m.steps.ru || []).length;
  if (nDe && nRu && nDe !== nRu) sagt(`${nDe} Schritte auf Deutsch, ${nRu} auf Russisch`);

  if (m.tips) {
    const tDe = (m.tips.de || []).length, tRu = (m.tips.ru || []).length;
    if (tDe !== tRu) sagt(`tips: ${tDe} deutsch, ${tRu} russisch`);
  }

  // Links
  if (!Array.isArray(m.links) || m.links.length < 2) sagt('mindestens 2 Links erwartet');
  for (const k of (m.links || [])) {
    if (!/^https:\/\/[^\s"'<>]+$/.test(k.url || '')) sagt(`unbrauchbare URL "${k.url}"`);
    if (!LINK_ARTEN.includes(k.kind)) sagt(`unbekannte Linkart "${k.kind}" (${k.url})`);
    for (const l of ['de', 'ru']) {
      if (!k.label || !String(k.label[l] || '').trim()) sagt(`Linkbeschriftung ${l} fehlt (${k.url})`);
    }
  }

  // Material
  if (!Array.isArray(m.products) || !m.products.length) sagt('products fehlt');
  for (const q of (m.products || [])) {
    if (!q.name || !String(q.name).trim()) sagt('Produkt ohne Namen');
    if (q.url && !/^https:\/\/[^\s"'<>]+$/.test(q.url)) sagt(`Produkt "${q.name}": unbrauchbare URL`);
    for (const feld of ['note', 'diy']) {
      if (!q[feld]) continue;
      for (const l of ['de', 'ru']) {
        if (typeof q[feld][l] !== 'string' || q[feld][l].trim().length < 10) {
          sagt(`Produkt "${q.name}": ${feld}.${l} fehlt oder ist zu kurz`);
        }
      }
    }
  }

  // SVG muss offline funktionieren
  const svgs = [['svg', m.svg], ...(m.products || []).map(q => [`Produkt "${q.name}"`, q.svg])];
  for (const [feld, svg] of svgs) {
    if (!svg) continue;
    if (!svg.includes('viewBox')) sagt(`${feld}: SVG ohne viewBox`);
    if (/<image|xlink:href|https?:\/\//.test(svg)) sagt(`${feld}: SVG lädt etwas nach – bricht offline`);
    if (/\bwidth=|\bheight=/.test(svg.slice(0, svg.indexOf('>') + 1))) {
      sagt(`${feld}: SVG hat feste width/height, soll sich anpassen`);
    }
  }

  return p;
}
