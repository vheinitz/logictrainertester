/**
 * Kleine HTML-Helfer.
 *
 * Die Spiele bauen ihr UI als HTML-String zusammen und übergeben Werte an
 * onclick-Handler. Sobald Inhalte aus Datenlisten kommen (Wörter mit
 * Apostroph, Umlaute, später evtl. RU-Texte), zerlegt naives
 * `onclick="G('pick','${wort}')"` das Markup. Deshalb hier einmal richtig.
 */

const ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Text für den Fließtext escapen. */
export function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ENT[c]);
}

/**
 * Wert als JS-Literal in ein doppelt gequotetes HTML-Attribut einbetten:
 *   `onclick="G('pick',${jsArg(wort)})"`
 */
export function jsArg(v) {
  return JSON.stringify(v === undefined ? null : v)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');
}

/** Fisher-Yates, liefert eine neue Liste. */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** n zufällige, verschiedene Elemente. */
export function sample(arr, n) {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

export function randInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/** Aktuelle Sprache ('de' | 'ru'). */
export function lang() {
  return localStorage.getItem('logik-lang') || document.documentElement.lang || 'de';
}

/** Wählt aus einem {de:…, ru:…}-Objekt den passenden Text. */
export function pick(obj, fallback = '') {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  const l = lang();
  return obj[l] || obj.de || fallback;
}

export const PALETTE = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#4D96FF', '#FF8A5C',
                        '#C084FC', '#FB923C', '#34D399', '#F472B6', '#60A5FA'];

export function color(i) { return PALETTE[i % PALETTE.length]; }
