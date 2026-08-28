/**
 * Verzögerter Abruf – was nach einer Pause noch da ist.
 *
 * Warum das ein eigener Test ist
 * ──────────────────────────────
 * „Atlantis" und „Symbole" prüfen, ob ein Kind eine neue, willkürliche
 * Verknüpfung überhaupt aufnehmen kann: Bild ↔ Name, gleich nach dem Zeigen.
 * Das ist Aufnahme, nicht Behalten. Ob die Verknüpfung liegen bleibt, zeigt
 * sich erst nach zwanzig Minuten, in denen etwas anderes passiert ist.
 *
 * Der Unterschied hat Folgen für die Förderung. Ein Kind, das gleich nach dem
 * Zeigen alles weiß und zwanzig Minuten später nichts mehr, braucht andere
 * Hilfe (Wiederholung in Abständen, Eselsbrücken) als eines, das schon beim
 * ersten Abfragen scheitert (weniger Paare, mehr Zeit, mehr Sinnbezug).
 *
 * In den Skalen der App stehen „Atlantis Abruf" und „Symbole Abruf" seit
 * Anfang an als Subtests – Module dazu gab es nicht. Das ist die Lücke, die
 * hier geschlossen wird.
 *
 * Wie das Gelernte den Weg hierher findet
 * ───────────────────────────────────────
 * Das Lernmodul meldet nach jeder Runde, welche Paare es gezeigt hat. Die
 * liegen in localStorage – synchron lesbar (init() eines Moduls ist synchron)
 * und einen Neustart überdauernd, denn zwischen Lernen und Abruf kann die
 * Seite geschlossen werden.
 *
 * Drei Zeitgrenzen
 * ────────────────
 *   MIN_MINUTEN   Vorher ist es kein verzögerter Abruf, sondern immer noch
 *                 der Lerntest. Wer sofort abfragt, misst das Kurzzeit-
 *                 gedächtnis ein zweites Mal.
 *   SOLL_MINUTEN  Der angepeilte Abstand, wie im Verfahren üblich.
 *   MAX_STUNDEN   Danach ist der Abruf kein Abruf mehr: was nach zwei Tagen
 *                 noch da ist, ist etwas anderes als das, was nach zwanzig
 *                 Minuten hängengeblieben ist – und die Bedingungen dazwischen
 *                 kennt niemand.
 */
const KEY = 'logik-abruf';

export const MIN_MINUTEN = 15;
export const SOLL_MINUTEN = 20;
export const MAX_STUNDEN = 8;

/** Wie viele Paare höchstens gemerkt werden. */
const MAX_PAARE = 12;

function alles() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch (e) { return {}; }
}

function schreibe(daten) {
  try { localStorage.setItem(KEY, JSON.stringify(daten)); } catch (e) { /* egal */ }
}

/**
 * Ein Lernmodul meldet, was es gezeigt hat.
 *
 * @param {string} modulId  das LERNENDE Modul (nicht das abrufende)
 * @param {Array<{schluessel:string, bild:string, name:string}>} paare
 */
export function merken(modulId, paare) {
  if (!Array.isArray(paare) || !paare.length) return;
  const daten = alles();
  const alt = daten[modulId] && daten[modulId].paare || [];

  // Nach Schlüssel zusammenführen: dasselbe Bild darf nicht zweimal
  // abgefragt werden, und das zuletzt gezeigte Paar gilt.
  const nachSchluessel = new Map();
  for (const p of alt) nachSchluessel.set(p.schluessel, p);
  for (const p of paare) {
    if (!p || !p.schluessel || !p.name) continue;
    nachSchluessel.set(p.schluessel, { schluessel: p.schluessel, bild: p.bild || '', name: p.name });
  }

  daten[modulId] = {
    paare: [...nachSchluessel.values()].slice(-MAX_PAARE),
    zeit: Date.now()
  };
  schreibe(daten);
}

/** Was ein Lernmodul zuletzt gezeigt hat – oder null. */
export function gelernt(modulId) {
  const d = alles()[modulId];
  return d && Array.isArray(d.paare) && d.paare.length ? d : null;
}

/** Minuten seit dem Lernen, oder null. */
export function minutenSeit(modulId) {
  const d = gelernt(modulId);
  return d ? Math.floor((Date.now() - d.zeit) / 60000) : null;
}

/**
 * Ist der Abruf jetzt sinnvoll?
 *
 * @returns {{ bereit:boolean, grund:'nichts'|'zufrueh'|'zualt'|null, minuten:number|null, paare:Array }}
 */
export function stand(modulId) {
  const d = gelernt(modulId);
  if (!d) return { bereit: false, grund: 'nichts', minuten: null, paare: [] };
  const min = Math.floor((Date.now() - d.zeit) / 60000);
  if (min < MIN_MINUTEN) return { bereit: false, grund: 'zufrueh', minuten: min, paare: d.paare };
  if (min > MAX_STUNDEN * 60) return { bereit: false, grund: 'zualt', minuten: min, paare: d.paare };
  return { bereit: true, grund: null, minuten: min, paare: d.paare };
}

/** Nach dem Abruf: das Gelernte ist verbraucht, ein zweiter Abruf misst nichts Neues. */
export function verbrauchen(modulId) {
  const daten = alles();
  delete daten[modulId];
  schreibe(daten);
}

/** Alles vergessen – gehört zum Zurücksetzen des Fortschritts. */
export function abrufZuruecksetzen() {
  try { localStorage.removeItem(KEY); } catch (e) { /* egal */ }
}
