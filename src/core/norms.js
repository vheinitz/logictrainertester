/**
 * Altersnormierte Auswertung von Merkspannen.
 *
 * Warum überhaupt
 * ───────────────
 * Eine rohe Spanne ist ohne Alter nicht deutbar. Spanne 6 ist bei einem
 * Sechsjährigen weit überdurchschnittlich und bei einer Fünfzehnjährigen
 * leicht unterdurchschnittlich. Vorher zeigte die App für beide dieselbe
 * Sternenreihe und dieselbe Prozentzahl aus einer festen Punkttabelle –
 * das ist keine Auswertung, das ist eine Umbenennung des Rohwerts.
 *
 * Nicht nur der Mittelwert verschiebt sich mit dem Alter, auch die
 * Streuung: bei jüngeren Kindern ist die Standardabweichung kleiner, eine
 * Ziffer mehr oder weniger wiegt dort also schwerer. Ein fester Punktwert
 * je Ziffer würde Kinder deshalb systematisch falsch einordnen. Aus dem
 * Grund wird hier über den z-Wert gerechnet und nicht über einen Zuschlag.
 *
 *   z      = (Spanne − Mittelwert(Alter)) / Streuung(Alter)
 *   Index  = 100 + 15 · z      (Skala wie bei Intelligenztests)
 *   Skalenwert = 10 + 3 · z    (Subtest-Skala der KABC-II)
 *
 * Beide kommen aus derselben Größe; welche man anzeigt, ist Geschmack.
 *
 * WICHTIG – was diese Zahlen nicht sind
 * ─────────────────────────────────────
 * Die Tabellen sind Richtwerte aus der Literatur zur Ziffernspanne, keine
 * an einer Stichprobe geeichten Normen. Genau daraus bezieht ein Verfahren
 * wie die KABC-II seine Aussagekraft, und genau das fehlt hier. Der Index
 * ist eine orientierende Einordnung, kein Testwert. Die Oberfläche muss das
 * mitsagen – bei Kindern wird ein niedriger Wert sonst schnell
 * überinterpretiert, obwohl Tagesform, Konzentration und Verständnis der
 * Anweisung bei einem Sechsjährigen stärker wirken als die Kapazität.
 *
 * Und noch eine Einschränkung, die man nicht wegrechnen kann: gemessen wird
 * nie die reine Kapazität, sondern Kapazität plus Gruppierungsstrategie plus
 * inneres Mitsprechen. Wer in Zweier- und Dreierblöcken bündelt, kommt weit
 * über das hinaus, was ohne Strategie geht.
 */
import { get } from './settings.js';
import { lang } from './html.js';

/**
 * Richtwerte: Mittelwert und Streuung der Spanne je Lebensjahr.
 *
 * Rückwärts beginnt erst bei 5. Bei Vierjährigen herrscht Bodeneffekt – die
 * meisten verstehen die Aufgabe noch nicht zuverlässig, und eine 0 oder 1
 * sagt dort nichts über die Kapazität aus.
 */
export const NORMEN = {
  ziffernVorwaerts: {
    de: 'Ziffernspanne vorwärts', ru: 'Ряд чисел вперёд', en: 'Digit span forward',
    tabelle: {
      4: [3.4, 0.9],  5: [3.9, 1.0],  6: [4.4, 1.0],  7: [4.9, 1.1],
      8: [5.2, 1.1],  9: [5.5, 1.1], 10: [5.8, 1.2], 11: [6.0, 1.2],
      12: [6.2, 1.2], 13: [6.3, 1.2], 14: [6.4, 1.3], 15: [6.5, 1.3],
      16: [6.5, 1.3], 17: [6.6, 1.3], 18: [6.6, 1.3]
    }
  },
  // Kein Modul erzeugt derzeit Rückwärts-Spannen. Die Tabelle steht hier,
  // weil sie zur Vorwärts-Tabelle gehört und ein Rückwärts-Modul sonst
  // wieder bei null anfinge. gesamtIndex() kann sie bereits verrechnen.
  ziffernRueckwaerts: {
    de: 'Ziffernspanne rückwärts', ru: 'Ряд чисел назад', en: 'Digit span backward',
    tabelle: {
      5: [2.2, 0.8],  6: [2.7, 0.8],  7: [3.0, 0.9],  8: [3.3, 0.9],
      9: [3.5, 1.0], 10: [3.7, 1.0], 11: [3.9, 1.0], 12: [4.1, 1.1],
      13: [4.3, 1.1], 14: [4.4, 1.1], 15: [4.5, 1.2], 16: [4.6, 1.2],
      17: [4.7, 1.2], 18: [4.8, 1.2]
    }
  }
};

export const INDEX_MIN = 40;
export const INDEX_MAX = 160;

/**
 * Ab diesem z-Wert ist das Ergebnis kein Messwert mehr.
 *
 * Spanne 10 bei einem Sechsjährigen ergäbe z ≈ 5,6 und damit Index 184.
 * So etwas entsteht durch eine Merktechnik, durch Vorsagen oder durch einen
 * Fehler im Ablauf – nicht durch Kapazität. Solche Fälle werden markiert
 * statt kommentarlos ausgegeben.
 */
export const Z_AUFFAELLIG = 3.5;

// ─── Alter ────────────────────────────────────────────────────────────

/**
 * Alter in Dezimaljahren aus dem hinterlegten Geburtsdatum.
 *
 * Gespeichert wird das Geburtsdatum, nicht das Alter – sonst müsste man es
 * jedes Jahr von Hand nachziehen und vergäße es.
 *
 * Ist der Monat unbekannt, wird Juli angenommen. Das ist die Jahresmitte
 * und hält den größtmöglichen Fehler bei ±6 Monaten; nähme man Januar, wäre
 * er bis zu 12 Monate groß. Bei Vierjährigen liegt zwischen 4;0 und 4;11
 * fast eine halbe Ziffer, das ist kein vernachlässigbarer Unterschied.
 *
 * @returns {number|null} Alter in Jahren, null wenn kein Geburtsjahr hinterlegt
 */
export function alterJahre(jetzt = new Date()) {
  const jahr = get('birthYear');
  if (!jahr) return null;
  const monat = get('birthMonth') || 7;
  const monate = (jetzt.getFullYear() - jahr) * 12 + (jetzt.getMonth() + 1 - monat);
  return monate <= 0 ? 0 : monate / 12;
}

/** Ist ein Geburtsjahr hinterlegt? */
export function alterBekannt() {
  return !!get('birthYear');
}

// ─── Normwerte ────────────────────────────────────────────────────────

/**
 * Mittelwert und Streuung für ein Alter, linear zwischen den Stützstellen.
 *
 * Außerhalb der Tabelle wird auf den Rand geklemmt: unter dem jüngsten
 * Eintrag ist die Aufgabe nicht sinnvoll erhebbar, über 18 ändert sich der
 * Wert praktisch nicht mehr.
 *
 * @returns {{m:number, s:number}|null}
 */
export function normFuer(alter, tabellenName) {
  const eintrag = NORMEN[tabellenName];
  if (!eintrag || alter == null) return null;
  const tabelle = eintrag.tabelle;
  const jahre = Object.keys(tabelle).map(Number).sort((a, b) => a - b);
  const min = jahre[0], max = jahre[jahre.length - 1];

  const a = Math.min(max, Math.max(min, alter));
  const unten = Math.floor(a);
  const oben = Math.min(max, unten + 1);
  const anteil = a - unten;

  const [mU, sU] = tabelle[unten];
  const [mO, sO] = tabelle[oben] || tabelle[unten];
  return { m: mU + anteil * (mO - mU), s: sU + anteil * (sO - sU) };
}

/**
 * Spanne in einen altersnormierten Index umrechnen.
 *
 * @param {number} spanne        erreichte Spanne
 * @param {number} alter         Alter in Dezimaljahren
 * @param {string} tabellenName  Schlüssel aus NORMEN
 * @returns {{index:number, skalenwert:number, z:number, m:number, s:number,
 *            auffaellig:boolean, unterAltersgrenze:boolean}|null}
 */
export function indexFuer(spanne, alter, tabellenName) {
  const norm = normFuer(alter, tabellenName);
  if (!norm || typeof spanne !== 'number') return null;

  const z = (spanne - norm.m) / norm.s;
  const jahre = Object.keys(NORMEN[tabellenName].tabelle).map(Number);

  return {
    z,
    m: norm.m,
    s: norm.s,
    index: Math.round(Math.min(INDEX_MAX, Math.max(INDEX_MIN, 100 + 15 * z))),
    skalenwert: Math.round(Math.min(19, Math.max(1, 10 + 3 * z))),
    auffaellig: z > Z_AUFFAELLIG,
    // Unterhalb der jüngsten Stützstelle ist die Tabelle geraten, nicht
    // interpoliert – der Wert wird gezeigt, aber als unsicher markiert.
    unterAltersgrenze: alter < Math.min(...jahre)
  };
}

/**
 * Gesamtwert aus Vorwärts- und Rückwärtsspanne.
 *
 * Rückwärts wiegt schwerer, weil dort zusätzlich im Kopf umgestellt werden
 * muss – das ist die anspruchsvollere Leistung. Fehlt der Rückwärtswert
 * oder ist das Kind zu jung dafür, zählt nur vorwärts.
 */
export function gesamtIndex(spanneVor, spanneZurueck, alter) {
  const v = indexFuer(spanneVor, alter, 'ziffernVorwaerts');
  if (!v) return null;
  const z = indexFuer(spanneZurueck, alter, 'ziffernRueckwaerts');
  if (!z || spanneZurueck == null || alter < 5) return v;

  const zGesamt = 0.4 * v.z + 0.6 * z.z;
  return {
    z: zGesamt,
    index: Math.round(Math.min(INDEX_MAX, Math.max(INDEX_MIN, 100 + 15 * zGesamt))),
    skalenwert: Math.round(Math.min(19, Math.max(1, 10 + 3 * zGesamt))),
    auffaellig: v.auffaellig || z.auffaellig,
    unterAltersgrenze: v.unterAltersgrenze
  };
}

// ─── Einordnung in Worte ──────────────────────────────────────────────

const STUFEN = [
  { bis: 69,  de: 'weit unter dem Alterswert', ru: 'намного ниже возрастной нормы', en: 'far below the age norm' },
  { bis: 84,  de: 'unter dem Alterswert',      ru: 'ниже возрастной нормы',         en: 'below the age norm' },
  { bis: 115, de: 'im Bereich des Alterswerts', ru: 'в пределах возрастной нормы',   en: 'within the age norm' },
  { bis: 130, de: 'über dem Alterswert',       ru: 'выше возрастной нормы',         en: 'above the age norm' },
  { bis: 999, de: 'weit über dem Alterswert',  ru: 'намного выше возрастной нормы',  en: 'far above the age norm' }
];

/** Wortlaut zur Einordnung – bewusst als Vergleich zum Alter, nicht als Urteil. */
export function einordnung(index) {
  const l = lang();
  const stufe = STUFEN.find(s => index <= s.bis) || STUFEN[STUFEN.length - 1];
  return stufe[l] || stufe.de;
}

const HINWEIS = {
  orientierung: {
    de: 'Orientierende Einordnung nach Literaturrichtwerten – kein normiertes Testverfahren.',
    ru: 'Ориентировочная оценка по литературным данным — не стандартизированный тест.',
    en: 'Orientation based on published reference values – not a standardised test.'
  },
  auffaellig: {
    de: 'Ungewöhnlich hoher Wert. Das spricht eher für eine Merktechnik oder Hilfe von außen als für die Merkspanne selbst.',
    ru: 'Необычно высокий результат. Скорее говорит о приёме запоминания или подсказке, чем о самой памяти.',
    en: 'Unusually high result. That points to a memorising technique or outside help rather than to span itself.'
  },
  jung: {
    de: 'Für dieses Alter gibt es keine Richtwerte – der Wert ist grob geschätzt.',
    ru: 'Для этого возраста ориентиров нет — значение оценено грубо.',
    en: 'No reference values exist for this age – the value is a rough estimate.'
  }
};

export function hinweis(k) {
  const l = lang();
  return HINWEIS[k][l] || HINWEIS[k].de;
}
