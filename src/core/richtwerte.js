/**
 * Richtwerte: was in einem Alter ungefähr zu erwarten ist.
 *
 * Warum überhaupt etwas Neues neben der Trefferquote
 * ─────────────────────────────────────────────────
 * Der Plan hat bisher nach der Trefferquote entschieden: unter 60 Prozent
 * galt ein Bereich als übungsbedürftig. Das kann nicht funktionieren. Alle
 * Module stellen sich auf das Kind ein – nach zwei richtigen Antworten wird
 * es schwerer, nach zwei falschen leichter. Die Quote pendelt sich dadurch
 * bauartbedingt um die Mitte ein, ganz gleich wie stark das Kind ist. Ein
 * Achtjähriger auf Stufe 5 und ein Achtjähriger auf Stufe 2 stehen am Ende
 * beide bei ungefähr 60 Prozent.
 *
 * Die Auskunft steckt im **erreichten Niveau**, nicht in der Quote. Die Quote
 * sagt nur noch, wie sicher das Kind auf diesem Niveau steht.
 *
 * Richtwert, nicht Norm
 * ─────────────────────
 * Ein Normwert setzt eine Eichstichprobe voraus: hunderte Kinder je
 * Altersjahr, unter gleichen Bedingungen getestet. Die gibt es hier nicht und
 * wird es nicht geben. Was hier steht, ist ein **Richtwert** – eine
 * begründete Erwartung, kein gemessener Durchschnitt. Der Unterschied ist
 * kein Wortspiel: ein Normwert erlaubt die Aussage „unterdurchschnittlich",
 * ein Richtwert nur „weniger, als wir hier erwartet hätten". Deshalb heißt
 * das Ergebnis in der Oberfläche überall Richtwert, und deshalb steht bei
 * jeder Einordnung, worauf sie beruht.
 *
 * Woher der Richtwert kommt
 * ─────────────────────────
 * Zwei Quellen, in dieser Reihenfolge:
 *
 *   1. TABELLE  – für die Ziffernspanne liegen Literaturwerte je Altersjahr
 *                 vor (core/norms.js). Wo es sie gibt, gelten sie.
 *   2. LEITER   – sonst wird aus dem Aufbau des Moduls abgeleitet: die
 *                 unterste Stufe ist für das jüngste vorgesehene Alter
 *                 gemacht, die oberste für das älteste. Dazwischen wird
 *                 linear interpoliert.
 *
 * Die zweite Quelle ist grob, und sie ist ehrlicher als eine erfundene
 * Tabelle mit Kommastellen: sie behauptet nichts, was nicht schon in der
 * Gestaltung des Moduls steckt. Wer die Stufen eines Moduls für ein Alter
 * von 6 bis 18 entworfen hat, hat damit gesagt, dass Stufe 1 für Sechs- und
 * die oberste Stufe für Achtzehnjährige gedacht ist.
 *
 * Warum die Abweichung und nicht das Niveau verglichen wird
 * ────────────────────────────────────────────────────────
 * Über Module hinweg sind Niveaus unvergleichbar – Stufe 4 heißt bei den
 * Ziffern etwas anderes als beim Tangram. Die **Abweichung vom Richtwert**
 * ist vergleichbar, weil der Richtwert die Steilheit jeder Leiter bereits
 * enthält. Erst dadurch lässt sich sagen, wo ein Kind im Verhältnis zu sich
 * selbst stark und wo es schwach ist.
 */
import { modules, getModule } from '../data/modules.js';
import { NORMEN, alterJahre } from './norms.js';
import { lang } from './html.js';

/**
 * Einordnungsstufen, von schwach nach stark.
 *
 * Vier statt drei: „deutlich darunter" und „etwas darunter" verlangen
 * verschiedene Antworten. Beim ersten ist der Bereich der Schwerpunkt der
 * nächsten Wochen, beim zweiten übt man nebenher mit.
 */
export const STUFEN = {
  weitDarunter: {
    rang: 0, farbe: 'var(--secondary)', icon: '🔴',
    de: 'deutlich unter dem Richtwert', ru: 'заметно ниже ориентира', en: 'clearly below the guide value'
  },
  darunter: {
    rang: 1, farbe: 'var(--gold)', icon: '🟡',
    de: 'etwas unter dem Richtwert', ru: 'немного ниже ориентира', en: 'somewhat below the guide value'
  },
  erwartet: {
    rang: 2, farbe: 'var(--primary)', icon: '🟢',
    de: 'im erwarteten Bereich', ru: 'в ожидаемых пределах', en: 'within the expected range'
  },
  darueber: {
    rang: 3, farbe: 'var(--green)', icon: '🔵',
    de: 'über dem Richtwert', ru: 'выше ориентира', en: 'above the guide value'
  }
};

const HERKUNFT = {
  tabelle: {
    de: 'Richtwert aus Literaturangaben zur Merkspanne',
    ru: 'Ориентир по литературным данным об объёме памяти',
    en: 'Guide value from published figures on memory span'
  },
  leiter: {
    de: 'Richtwert aus dem Aufbau der Stufen, nicht an Kindern geeicht',
    ru: 'Ориентир выведен из устройства уровней, не выверен на детях',
    en: 'Guide value derived from how the levels are built, not calibrated on children'
  }
};

const T = {
  ohneAlter: { de: 'ohne Alter nicht einzuordnen', ru: 'без возраста истолковать нельзя', en: 'cannot be placed without an age' },
  ohneLeiter: { de: 'Übungsspiel ohne Niveaustufen', ru: 'упражнение без уровней', en: 'practice game without levels' },
  erwartetKurz: { de: 'erwartet', ru: 'ожидается', en: 'expected' },
  erreicht: { de: 'erreicht', ru: 'достигнуто', en: 'reached' }
};
const t = k => { const l = lang(); return (T[k] && (T[k][l] || T[k].de)) || ''; };
export const herkunftText = k => { const l = lang(); return (HERKUNFT[k] && (HERKUNFT[k][l] || HERKUNFT[k].de)) || ''; };
export const stufenText = s => { const l = lang(); return (STUFEN[s] && (STUFEN[s][l] || STUFEN[s].de)) || ''; };

/** Altersband eines Moduls als Zahlenpaar, z. B. '4-18' → [4, 18]. */
export function altersband(mod) {
  const m = /^(\d+)\s*-\s*(\d+)$/.exec(String(mod && mod.ages || ''));
  return m ? [Number(m[1]), Number(m[2])] : null;
}

/**
 * Erwartetes Niveau für ein Alter.
 *
 * @returns {{ niveau:number, herkunft:'tabelle'|'leiter' }|null}
 */
export function erwartetesNiveau(mod, alter) {
  if (!mod || alter == null) return null;

  // 1. Literaturtabelle, wo vorhanden
  if (mod.norm && NORMEN[mod.norm]) {
    const tab = NORMEN[mod.norm].tabelle;
    const jahre = Object.keys(tab).map(Number).sort((a, b) => a - b);
    const a = Math.max(jahre[0], Math.min(jahre[jahre.length - 1], alter));
    const unten = jahre.filter(j => j <= a).pop();
    const oben = jahre.find(j => j >= a);
    const [mu] = tab[unten];
    if (unten === oben) return { niveau: mu, herkunft: 'tabelle' };
    const [mo] = tab[oben];
    const p = (a - unten) / (oben - unten);
    return { niveau: mu + (mo - mu) * p, herkunft: 'tabelle' };
  }

  // 2. Aus der Leiter des Moduls
  const band = altersband(mod);
  if (!band || !mod.stufen) return null;
  const [vonAlter, bisAlter] = band;
  const [vonStufe, bisStufe] = mod.stufen;
  if (bisAlter <= vonAlter) return { niveau: vonStufe, herkunft: 'leiter' };
  const p = Math.max(0, Math.min(1, (alter - vonAlter) / (bisAlter - vonAlter)));
  return { niveau: vonStufe + (bisStufe - vonStufe) * p, herkunft: 'leiter' };
}

/**
 * Wie weit darf ein Ergebnis vom Richtwert abweichen, bevor es auffällt?
 *
 * Ein Fünftel der Leiter, mindestens aber eine ganze Stufe. Das Fünftel hält
 * lange und kurze Leitern vergleichbar; die Mindeststufe verhindert, dass bei
 * einer Leiter mit fünf Stufen schon ein halber Schritt als Auffälligkeit
 * gilt – Niveaus sind ganze Zahlen, weniger als ein Schritt ist nicht messbar.
 */
export function schwelle(mod) {
  if (!mod || !mod.stufen) return 1;
  const [von, bis] = mod.stufen;
  return Math.max(1, (bis - von) / 5);
}

/**
 * Ein erreichtes Niveau einordnen.
 *
 * @param {object} mod       Moduleintrag aus modules.js
 * @param {number} niveau    erreichtes Niveau (bestLevel)
 * @param {number} alter     Alter in Jahren
 * @returns {{stufe, erwartet, erreicht, abweichung, herkunft, farbe, icon, text}|null}
 */
export function bewerte(mod, niveau, alter) {
  const erw = erwartetesNiveau(mod, alter);
  if (!erw || typeof niveau !== 'number' || !niveau) return null;

  const abw = niveau - erw.niveau;
  const s = schwelle(mod);
  const stufe = abw <= -2 * s ? 'weitDarunter'
    : abw <= -s ? 'darunter'
      : abw >= s ? 'darueber'
        : 'erwartet';

  return {
    stufe,
    erwartet: Math.round(erw.niveau * 10) / 10,
    erreicht: niveau,
    abweichung: Math.round(abw * 10) / 10,
    herkunft: erw.herkunft,
    farbe: STUFEN[stufe].farbe,
    icon: STUFEN[stufe].icon,
    text: stufenText(stufe)
  };
}

/**
 * Alle vorliegenden Ergebnisse einordnen, schwächste zuerst.
 *
 * `scores` ist die Liste aus storage.loadAllScores(). Verwendet wird
 * `bestLevel`; Module ohne Niveauleiter und Module ohne Ergebnis fallen
 * heraus, statt mit einem erfundenen Wert dazustehen.
 *
 * @returns {Array<{mod, bewertung}>}
 */
export function profil(scores, alter = alterJahre()) {
  const out = [];
  for (const s of scores || []) {
    const mod = getModule(s.moduleId);
    if (!mod) continue;
    const b = bewerte(mod, s.bestLevel || 0, alter);
    if (b) out.push({ mod, score: s, bewertung: b });
  }
  out.sort((a, b) => (a.bewertung.abweichung / schwelle(a.mod)) - (b.bewertung.abweichung / schwelle(b.mod)));
  return out;
}

/** Die Module, die auffällig zurückliegen – Grundlage des Übungsplans. */
export function schwachePunkte(scores, alter = alterJahre()) {
  return profil(scores, alter).filter(p => p.bewertung.stufe === 'weitDarunter' || p.bewertung.stufe === 'darunter');
}

/**
 * Kurzform für eine Zeile: „Stufe 3 · erwartet 4,5".
 * Ohne Alter oder ohne Leiter bleibt sie leer – lieber nichts als Zahlen,
 * die niemand einordnen kann.
 */
export function kurzText(mod, niveau, alter) {
  const b = bewerte(mod, niveau, alter);
  if (!b) return alter == null ? t('ohneAlter') : (mod && !mod.stufen ? t('ohneLeiter') : '');
  const komma = n => String(n).replace('.', ',');
  return `${t('erreicht')} ${komma(b.erreicht)} · ${t('erwartetKurz')} ${komma(b.erwartet)}`;
}

/**
 * Schwelle für die Faktorenliste im kognitiven Profil.
 *
 * Dort wird weiter mit der Trefferquote gearbeitet: ein Faktor fasst mehrere
 * Module zusammen, deren Niveauleitern verschieden lang sind, und eine
 * gemittelte Quote ist dort das einzige, was sich ohne weitere Annahmen
 * bilden lässt. Für die Entscheidung „hier üben" ist sie nicht die
 * Grundlage – das macht der Plan über bewerte().
 */
export const FAKTOR_SCHWACH_UNTER = 60;

/** Alle Module mit Niveauleiter – für Prüfungen und Übersichten. */
export const modulesMitLeiter = () => modules.filter(m => m.stufen);
