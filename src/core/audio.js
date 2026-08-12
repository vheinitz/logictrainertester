/**
 * Kurze Töne per WebAudio.
 *
 * Bewusst erzeugt statt geladen: keine .wav-Datei, die mitgeliefert, gecacht
 * und beim Offline-Start gefunden werden müsste. Ein Oszillator mit kurzer
 * Hüllkurve klingt für einen Klopfton so gut wie ein Sample.
 *
 * Für Rhythmus zählt Präzision: Töne werden über die Uhr des AudioContext
 * geplant (`osc.start(zeit)`), nicht über setTimeout. setTimeout kann um
 * zweistellige Millisekunden verrutschen – hörbar als schleppender Takt.
 */

let ctx = null;
let unavailable = false;

/** Liefert den AudioContext oder null, wenn Audio nicht verfügbar ist. */
export function audio() {
  if (unavailable) return null;
  if (!ctx) {
    const C = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!C) { unavailable = true; return null; }
    try { ctx = new C(); } catch (e) { unavailable = true; return null; }
  }
  // Browser starten den Context erst nach einer Nutzergeste angehalten.
  if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* egal */ } }
  return ctx;
}

export function audioReady() {
  const a = audio();
  return !!a && a.state === 'running';
}

/** Jetzt-Zeit der Audio-Uhr in Sekunden (0, wenn kein Audio). */
export function now() {
  const a = audio();
  return a ? a.currentTime : 0;
}

/**
 * Einen kurzen Ton zum Zeitpunkt `at` (Audio-Uhr, Sekunden) planen.
 * @param {number} at    Startzeit auf der Audio-Uhr
 * @param {object} opt   { freq, dur, gain, type }
 */
export function beep(at, opt = {}) {
  const a = audio();
  if (!a) return false;
  const freq = opt.freq ?? 880;
  const dur = opt.dur ?? 0.07;
  const peak = opt.gain ?? 0.3;
  try {
    const osc = a.createOscillator();
    const g = a.createGain();
    osc.type = opt.type || 'sine';
    osc.frequency.setValueAtTime(freq, at);
    // Weiche Flanken – ein harter Ein-/Ausschaltvorgang knackt hörbar.
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    osc.connect(g);
    g.connect(a.destination);
    osc.start(at);
    osc.stop(at + dur + 0.03);
    return true;
  } catch (e) {
    return false;
  }
}

/** Ton sofort abspielen (etwa als Quittung für einen Tastendruck). */
export function beepNow(opt) {
  const a = audio();
  if (!a) return false;
  return beep(a.currentTime + 0.001, opt);
}

// ─── Vorbereitete Sprachaufnahmen ─────────────────────────────────────
// base64 → AudioBuffer. Bewusst ohne fetch: von file:// aus blockiert der
// Browser fetch/XHR, decodeAudioData auf nachgeladene Dateien schlägt dort
// fehl. Die Daten stecken deshalb im Bundle.

const decoded = new Map();      // key → AudioBuffer
const pending = new Map();      // key → Promise

function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Einen base64-Clip dekodieren und unter `key` merken. */
export function loadClip(key, b64) {
  if (decoded.has(key)) return Promise.resolve(decoded.get(key));
  if (pending.has(key)) return pending.get(key);
  const a = audio();
  if (!a) return Promise.resolve(null);

  const p = new Promise(resolve => {
    let bytes;
    try { bytes = base64ToBytes(b64); }
    catch (e) { resolve(null); return; }
    // Callback-Form, weil ältere Safari-Versionen kein Promise zurückgeben
    try {
      a.decodeAudioData(bytes.buffer,
        buf => { decoded.set(key, buf); resolve(buf); },
        () => resolve(null));
    } catch (e) { resolve(null); }
  });
  pending.set(key, p);
  return p;
}

/** Sind alle Clips dieser Schlüssel bereits dekodiert? */
export function clipsReady(keys) {
  return keys.every(k => decoded.has(k));
}

/**
 * Einen dekodierten Clip zum Zeitpunkt `at` (Audio-Uhr) starten.
 * Gibt die Dauer in Sekunden zurück, 0 wenn nicht abspielbar.
 */
export function playClip(key, at) {
  const a = audio();
  const buf = decoded.get(key);
  if (!a || !buf) return 0;
  try {
    const src = a.createBufferSource();
    src.buffer = buf;
    src.connect(a.destination);
    src.start(at);
    return buf.duration;
  } catch (e) {
    return 0;
  }
}
