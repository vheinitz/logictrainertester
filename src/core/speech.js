/**
 * Eine Folge vorsprechen.
 *
 * Gemeinsame Ablauflogik der Tests mit Ansage (Zahlen, Wörter, Koffer):
 * Aufnahmen dekodieren, Takt bestimmen, „Wiederhole:" voranstellen, Elemente
 * im festen Abstand über die Audio-Uhr planen.
 *
 * Warum über die Audio-Uhr und nicht per setTimeout: letzteres verrutscht um
 * zweistellige Millisekunden. Bei einer Merkspanne, die im gleichmäßigen Takt
 * dargeboten werden muss, ist das hörbar und verändert, was gemessen wird.
 */
import { audio, loadClip, clipsReady, playClip } from './audio.js';
import { clip, longestMs, hasVoice } from './audio-assets.js';
import { lang } from './html.js';

const VORLAUF_S = 0.15;      // Ruhe vor der Ansage
const GAP_NACH_ANSAGE = 400; // ms zwischen Ansage und erstem Element
const MIN_LUECKE = 220;      // ms Ruhe zwischen zwei Elementen

/** Sprache der App, auf vorhandene Aufnahmen eingeschränkt. */
export function voiceLang() {
  const l = lang();
  return hasVoice(l) ? l : (hasVoice('de') ? 'de' : l);
}

/** Dekodier-Schlüssel: Sprache + Aufnahme-Schlüssel, damit sich DE und RU nicht überschreiben. */
const ck = (l, k) => l + '|' + k;

/** Aufnahmen dekodieren. Fehlende Schlüssel werden übersprungen. */
export function preloadKeys(l, keys) {
  return Promise.all([...keys, 'lead']
    .filter(k => clip(l, k))
    .map(k => loadClip(ck(l, k), clip(l, k))));
}

/**
 * Abstand von Elementbeginn zu Elementbeginn.
 * Folgt dem gewünschten Tempo, bleibt aber immer weit genug, dass die längste
 * Aufnahme nicht in die nächste läuft.
 */
export function stepFor(l, keys, tempoSekunden) {
  return Math.max(tempoSekunden * 1000, longestMs(l, keys) + MIN_LUECKE);
}

/** Sind alle Aufnahmen dekodiert und abspielbar? */
export function ready(l, keys) {
  return clipsReady(keys.map(k => ck(l, k)));
}

/**
 * Ansage und Folge sprechen.
 * @returns {number} geschätzte Gesamtdauer in ms, 0 wenn nichts abgespielt wurde
 */
export function speak(l, keys, stepMs, { lead = true } = {}) {
  const a = audio();
  if (!a) return 0;
  let t = a.currentTime + VORLAUF_S;
  const start = t;
  if (lead && clip(l, 'lead')) {
    const d = playClip(ck(l, 'lead'), t);
    t += (d || 0) + GAP_NACH_ANSAGE / 1000;
  }
  for (const k of keys) {
    playClip(ck(l, k), t);
    t += stepMs / 1000;
  }
  return Math.round((t - start) * 1000);
}

/** Wie lange die Ansage insgesamt dauert – für die Länge der Zeigephase. */
export function totalMs(l, keys, stepMs) {
  const lead = clip(l, 'lead') ? longestMs(l, ['lead']) + GAP_NACH_ANSAGE : 0;
  return VORLAUF_S * 1000 + lead + Math.max(0, keys.length - 1) * stepMs + longestMs(l, keys);
}
