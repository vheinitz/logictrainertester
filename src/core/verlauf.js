/**
 * Verlauf innerhalb eines Durchgangs: Ausdauer und Gleichmäßigkeit.
 *
 * Gespeichert wird jede einzelne Antwort. Für die Anzeige ist das zu fein –
 * dort steht je Durchgang ein Mittelwert. Die Einzelwerte bleiben aber
 * erhalten, weil in ihrer *Reihenfolge* etwas steckt, das im Mittelwert
 * verschwindet: hält die Leistung bis zum Schluss, oder bricht sie ein?
 *
 * Zwei Größen, die verschiedene Dinge messen
 * ──────────────────────────────────────────
 * AUSDAUER fragt nach der Richtung: ist die zweite Hälfte des Durchgangs
 * schlechter als die erste? Ein Kind, das gleichmäßig 60 % hält, hat gute
 * Ausdauer bei mittlerem Können. Eines, das mit 90 % beginnt und mit 40 %
 * endet, kann mehr – hält es aber nicht durch.
 *
 * GLEICHMÄSSIGKEIT fragt nach dem Auf und Ab um diese Richtung herum. Und
 * zwar bereinigt: wer im Mittel die Hälfte richtig hat, muss zwangsläufig
 * wechseln. Ein rohes Schwankungsmaß würde deshalb Können mit Konzentration
 * verwechseln und jedem mittelmäßigen Kind schlechte Konzentration
 * bescheinigen. Verglichen wird darum mit dem, was bei rein zufälliger
 * Reihenfolge derselben Werte herauskäme (von-Neumann-Verhältnis):
 *
 *   δ² = Σ(vᵢ − vᵢ₋₁)² / (n−1)
 *   s² = Σ(v − v̄)²    / (n−1)
 *   η  = δ² / s²   geteilt durch den Erwartungswert 2n/(n−1)
 *
 *   η ≈ 1   Reihenfolge wie zufällig – nichts Auffälliges
 *   η > 1   mehr Wechsel als Zufall – Aussetzer, Unaufmerksamkeit
 *   η < 1   ruhiger als Zufall – längere gleichbleibende Strecken
 *
 * Die Teilung durch 2n/(n−1) ist nicht Kosmetik. Ohne sie hängt der
 * Bezugspunkt von der Länge des Durchgangs ab: bei zehn Werten liegt der
 * Erwartungswert einer zufälligen Folge nicht bei 2, sondern bei 2,47.
 * Eine völlig unauffällige Folge wurde damit als „sprunghaft" gemeldet.
 *
 * Was das nicht kann
 * ──────────────────
 * Bei Übungsspielen ist jede Antwort 0 oder 100. Aus acht solchen Werten
 * lässt sich nichts Belastbares über Konzentration sagen – die Streuung
 * eines so kurzen Abschnitts ist selbst reiner Zufall. Deshalb die
 * Mindestmengen unten, und deshalb wird über mehrere Durchgänge gemittelt.
 * Auch dann bleibt es ein Hinweis, keine Messung.
 */
import { lang } from './html.js';

/** Weniger Werte je Durchgang tragen keine Aussage über den Verlauf. */
export const MIN_WERTE = 8;
/** Weniger Durchgänge lassen den Zufall überwiegen. */
export const MIN_SITZUNGEN = 3;

/**
 * Historie in Durchgänge zerlegen, älteste zuerst.
 *
 * Vorrang hat die beim Schreiben vergebene `sessionId`. Ältere Einträge
 * haben keine – für die wird der Bruch daran erkannt, dass der Zähler
 * `round` nicht weiterläuft, denn er beginnt je Durchgang wieder bei vorn.
 */
export function sitzungen(history, moduleId = null) {
  const eintraege = history
    .filter(h => !moduleId || h.moduleId === moduleId)
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp);

  const raus = [];
  let aktuell = null;
  let vorigeRunde = Infinity;
  let vorigeKennung = null;

  for (const h of eintraege) {
    const kennung = h.sessionId || null;
    const neuerDurchgang = aktuell === null
      || aktuell.moduleId !== h.moduleId
      || (kennung ? kennung !== vorigeKennung : (h.round || 0) <= vorigeRunde);

    if (neuerDurchgang) {
      aktuell = { moduleId: h.moduleId, scale: h.scale, sessionId: kennung,
                  timestamp: h.timestamp, werte: [] };
      raus.push(aktuell);
    }
    aktuell.werte.push(wertVon(h));
    vorigeRunde = h.round || 0;
    vorigeKennung = kennung;
  }
  return raus;
}

/** Einen Historieneintrag auf die 0–100-Achse bringen. */
function wertVon(h) {
  if (h.kind === 'percent') return h.score || 0;
  return (h.total || 0) ? (h.score || 0) / h.total * 100 : 0;
}

/** Mittelwert eines Durchgangs – das, was in der Balkenreihe landet. */
export function sitzungsMittel(s) {
  if (!s.werte.length) return 0;
  return s.werte.reduce((a, b) => a + b, 0) / s.werte.length;
}

const mittelwert = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;

/**
 * Reihe für die Balkenanzeige: ein Wert je Durchgang, nicht je Antwort.
 *
 * Eine einzelne Antwort ist 0 oder 100 und für sich wertlos; als Balken
 * wäre sie nur Rauschen. Der Durchgangsmittelwert ist die kleinste Einheit,
 * die für sich etwas aussagt.
 *
 * Mehrere Modul-Kennungen ergeben eine verschmolzene Reihe – so entsteht
 * der Verlauf eines kognitiven Faktors, der keine eigene Messung hat.
 */
export function mittelReihe(history, moduleIds) {
  const menge = new Set(moduleIds);
  return sitzungen(history)
    .filter(s => menge.has(s.moduleId))
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(sitzungsMittel);
}

/**
 * Ausdauer: Unterschied zwischen zweiter und erster Hälfte, in Punkten.
 *
 * Negativ heißt: es lässt gegen Ende nach. Die Halbierung ist robuster als
 * eine Regressionsgerade, wenn nur zehn Werte vorliegen – und sie lässt sich
 * jemandem erklären, der keine Statistik gelernt hat.
 *
 * @returns {{delta:number}|null} null, wenn zu wenige Werte vorliegen
 */
export function ausdauer(werte) {
  if (!werte || werte.length < MIN_WERTE) return null;
  const mitte = Math.floor(werte.length / 2);
  return { delta: mittelwert(werte.slice(werte.length - mitte)) - mittelwert(werte.slice(0, mitte)) };
}

/**
 * Gleichmäßigkeit als von-Neumann-Verhältnis (siehe Kopf der Datei).
 *
 * Ohne Streuung – alle Werte gleich – ist das Verhältnis nicht definiert.
 * Das ist der ruhigstmögliche Verlauf, deshalb 0 statt einer Division
 * durch null.
 *
 * @returns {{eta:number}|null}
 */
export function gleichmaessigkeit(werte) {
  if (!werte || werte.length < MIN_WERTE) return null;
  const n = werte.length;
  const m = mittelwert(werte);
  const varianz = werte.reduce((s, v) => s + (v - m) ** 2, 0) / (n - 1);
  if (varianz === 0) return { eta: 0 };

  let summe = 0;
  for (let i = 1; i < n; i++) summe += (werte[i] - werte[i - 1]) ** 2;
  const roh = (summe / (n - 1)) / varianz;

  // Auf den Erwartungswert einer zufälligen Reihenfolge normieren, damit
  // die Zahl nicht von der Länge des Durchgangs abhängt.
  return { eta: roh / (2 * n / (n - 1)) };
}

/**
 * Beides über mehrere Durchgänge gemittelt.
 *
 * Ein einzelner Durchgang schwankt zu stark; erst über mehrere hinweg wird
 * ein wiederkehrendes Muster sichtbar.
 *
 * @returns {{delta:number, eta:number, sitzungen:number}|null}
 */
export function verlaufsProfil(alleSitzungen) {
  const brauchbar = alleSitzungen.filter(s => s.werte.length >= MIN_WERTE);
  if (brauchbar.length < MIN_SITZUNGEN) return null;

  const deltas = brauchbar.map(s => ausdauer(s.werte).delta);
  const etas = brauchbar.map(s => gleichmaessigkeit(s.werte).eta);
  return { delta: mittelwert(deltas), eta: mittelwert(etas), sitzungen: brauchbar.length };
}

// ─── In Worte fassen ──────────────────────────────────────────────────

const TEXTE = {
  ausdauerGut:    { de: 'hält bis zum Schluss durch',      ru: 'держится до конца',            en: 'holds up to the end' },
  ausdauerLeicht: { de: 'lässt gegen Ende etwas nach',     ru: 'к концу немного слабеет',      en: 'drops off slightly towards the end' },
  ausdauerSchwach:{ de: 'lässt gegen Ende deutlich nach',  ru: 'к концу заметно слабеет',      en: 'drops off clearly towards the end' },
  ausdauerBesser: { de: 'wird gegen Ende besser',          ru: 'к концу становится лучше',     en: 'gets better towards the end' },
  ruhig:          { de: 'gleichmäßig',                     ru: 'ровно',                        en: 'steady' },
  normal:         { de: 'unauffällig',                     ru: 'без особенностей',             en: 'unremarkable' },
  unruhig:        { de: 'auffällig sprunghaft',            ru: 'заметно скачкообразно',        en: 'noticeably erratic' },
  titelAusdauer:  { de: 'Ausdauer',                        ru: 'Выносливость',                 en: 'Endurance' },
  titelRuhe:      { de: 'Gleichmäßigkeit',                 ru: 'Ровность',                     en: 'Steadiness' },
  zuWenig:        { de: 'Noch zu wenige Durchgänge für eine Aussage.',
                    ru: 'Пока слишком мало подходов для вывода.',
                    en: 'Not enough sessions yet for a statement.' }
};
const w = k => { const l = lang(); return TEXTE[k][l] || TEXTE[k].de; };
export const text = w;

/** Ausdauer in Worte. Die Schwellen sind gesetzt, nicht gemessen. */
export function ausdauerText(delta) {
  if (delta > 8) return w('ausdauerBesser');
  if (delta >= -6) return w('ausdauerGut');
  if (delta >= -18) return w('ausdauerLeicht');
  return w('ausdauerSchwach');
}

/** Gleichmäßigkeit in Worte – gemessen am Zufall, nicht am Ideal. */
export function ruheText(eta) {
  if (eta < 0.7) return w('ruhig');
  if (eta <= 1.35) return w('normal');
  return w('unruhig');
}
