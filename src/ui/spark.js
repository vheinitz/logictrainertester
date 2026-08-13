/**
 * Balkenreihe für den Verlauf eines Moduls („Sparkline").
 *
 * Warum so klein
 * ──────────────
 * Die Balken sind kein Diagramm zum Ablesen, sondern eine Formangabe: steigt
 * es, fällt es, schwankt es? Deshalb ist die volle Höhe genau eine
 * Schriftzeile der Beschreibung daneben – die Reihe sitzt in derselben Zeile
 * wie der Modulname und macht aus der Liste keine Diagrammsammlung. Wer den
 * genauen Wert will, liest die Zahl am Ende.
 *
 * Warum ein laufender Mittelwert am Ende und nicht der letzte Wert
 * ───────────────────────────────────────────────────────────────
 * Ein einzelner Durchgang schwankt stark mit Tagesform und Konzentration.
 * Der letzte Wert wäre deshalb die unzuverlässigste Zahl von allen. Der
 * Mittelwert über alle bisherigen Messungen ist die stabile Größe; die
 * Streuung darum herum zeigen die Balken.
 *
 * Fester Maßstab
 * ──────────────
 * 0 bis 100 gilt für alle Zeilen gleich. Ein Maßstab je Zeile würde die
 * Balken zwar besser ausnutzen, aber eine Zeile mit lauter 20ern sähe dann
 * aus wie eine mit lauter 90ern. Werte über 100 – die adaptiven Tests
 * vergeben bis 130 – werden für die Balkenhöhe gekappt; die Zahl daneben
 * bleibt ungekappt.
 */

/** Mehr Balken als das passen in eine Zeile nicht mehr erkennbar hinein. */
const MAX_BALKEN = 28;

/**
 * Reihe auf höchstens `n` Werte eindampfen, indem benachbarte gemittelt
 * werden. Wegwerfen wäre falsch: bei 200 Antworten sähe man sonst nur den
 * Anfang oder nur das Ende, nicht die Entwicklung dazwischen.
 */
export function verdichten(werte, n = MAX_BALKEN) {
  if (werte.length <= n) return werte.slice();
  const raus = [];
  for (let i = 0; i < n; i++) {
    const von = Math.floor(i * werte.length / n);
    const bis = Math.max(von + 1, Math.floor((i + 1) * werte.length / n));
    const teil = werte.slice(von, bis);
    raus.push(teil.reduce((a, b) => a + b, 0) / teil.length);
  }
  return raus;
}

/** Mittelwert, 0 bei leerer Reihe. */
export function mittel(werte) {
  if (!werte.length) return 0;
  return werte.reduce((a, b) => a + b, 0) / werte.length;
}

const FARBE = w => w >= 80 ? 'var(--green)' : w >= 50 ? 'var(--gold)' : 'var(--secondary)';

/**
 * @param {number[]} werte    Momentanwerte in zeitlicher Reihenfolge, 0–100
 * @param {object}   opt      { titel } für die Sprachausgabe
 * @returns {string} HTML – Balkenreihe plus Mittelwert als Zahl
 */
export function sparkline(werte, opt = {}) {
  if (!werte || !werte.length) return '';
  const balken = verdichten(werte);
  const schnitt = mittel(werte);
  const beschriftung = `${opt.titel || ''} ${werte.length}× , ⌀ ${Math.round(schnitt)}`.trim();

  // Balkenbreite schrumpft mit der Anzahl, damit die Reihe gleich breit
  // bleibt und die Zahl dahinter nicht wandert.
  const breite = balken.length > 20 ? 3 : balken.length > 12 ? 4 : 5;

  const stuecke = balken.map(w => {
    const h = Math.max(6, Math.min(100, w));       // 6 % Sockel: 0 bliebe unsichtbar
    return `<span style="display:inline-block;width:${breite}px;height:${h}%;
      background:${FARBE(w)};border-radius:1px;vertical-align:bottom;opacity:.85"></span>`;
  }).join('');

  return `<span role="img" aria-label="${beschriftung}" title="${beschriftung}"
      style="display:inline-flex;align-items:flex-end;gap:1px;height:1.15em;line-height:1">
      ${stuecke}
    </span>
    <span style="font-weight:800;color:${FARBE(schnitt)};margin-left:8px;min-width:2.2em;
      display:inline-block;text-align:right">${Math.round(schnitt)}</span>`;
}

/**
 * Momentanwerte eines Moduls aus der Historie, älteste zuerst.
 *
 * Beide Bewertungsarten werden auf dieselbe 0–100-Achse gebracht:
 *   percent  – der geschriebene Wert ist bereits die Bewertung
 *   count    – Anteil richtiger Antworten des jeweiligen Eintrags
 *
 * Bei `count` steht je Eintrag oft nur eine einzelne Antwort, also 0 oder
 * 100. Für sich genommen ist das nichts wert; erst das Verdichten in
 * `sparkline` macht daraus eine ablesbare Linie.
 */
export function serieAusHistorie(history, moduleId) {
  return history
    .filter(h => h.moduleId === moduleId)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(h => h.kind === 'percent'
      ? (h.score || 0)
      : ((h.total || 0) ? (h.score || 0) / h.total * 100 : 0));
}
