/**
 * Zugriff auf die vorbereiteten Sprachaufnahmen.
 *
 * Die Aufnahmen liegen NICHT im App-Bundle, sondern in `dist/audio-de.js` und
 * `dist/audio-ru.js`, die index.html per <script> lädt und die
 * `window.LOGIK_AUDIO` füllen. Gründe:
 *
 *   * Das App-Bundle bleibt klein und ändert sich unabhängig von den Aufnahmen.
 *   * Der Browser lädt beide parallel und hält sie getrennt im Cache.
 *   * Weil sie fest in index.html stehen, sind sie beim Speichern der Seite
 *     mit dabei – die App bleibt offline vollständig. Erst im Test nachladen
 *     würde das brechen.
 *   * Klassische <script>-Dateien funktionieren auch per Doppelklick von
 *     file://, wo fetch und ES-Module blockiert sind.
 *
 * Schlüssel der Aufnahmen:
 *   d0 … d9      Ziffern
 *   lead         Ansage vor einer Folge („Wiederhole:")
 *   w:<Wort>     Wort aus wordlists.json, Schlüssel ist immer die deutsche Form
 *   i:<key>      Gegenstand aus wordlists.json
 */

const leer = { clips: {}, meta: {} };

function bank(lang) {
  const alle = (typeof window !== 'undefined' && window.LOGIK_AUDIO) || {};
  return alle[lang] || null;
}

/** Sind für diese Sprache Aufnahmen geladen? */
export function hasVoice(lang) {
  return !!bank(lang);
}

/** Sprachen, für die Aufnahmen vorliegen. */
export function voices() {
  const alle = (typeof window !== 'undefined' && window.LOGIK_AUDIO) || {};
  return Object.keys(alle);
}

/** base64-Clip zu einem Schlüssel, oder null. */
export function clip(lang, key) {
  const b = bank(lang) || leer;
  return b.clips[key] || null;
}

/** Sprechdauer in ms, 0 wenn unbekannt. */
export function clipMs(lang, key) {
  const b = bank(lang) || leer;
  return (b.meta[key] && b.meta[key].ms) || 0;
}

/** Gesprochener Text zu einem Schlüssel – für Tests und Fehlersuche. */
export function clipText(lang, key) {
  const b = bank(lang) || leer;
  return (b.meta[key] && b.meta[key].text) || '';
}

/** Längste Sprechdauer unter den angegebenen Schlüsseln. */
export function longestMs(lang, keys) {
  let max = 0;
  for (const k of keys) max = Math.max(max, clipMs(lang, k));
  return max || 600;
}

/** Liegen alle Schlüssel als Aufnahme vor? */
export function haveAll(lang, keys) {
  return keys.every(k => !!clip(lang, k));
}
