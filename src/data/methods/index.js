/**
 * ERZEUGTE DATEI – nicht von Hand bearbeiten.
 * Neu erzeugen mit:  node tools/gen-method-index.mjs   (läuft bei npm run build mit)
 *
 * Sammelt die Fördermethoden aus diesem Verzeichnis. Format: siehe README.md.
 */
import m0 from './bauen-nach-vorlage.js';
import m1 from './bauklotz-zaehlen.js';
import m2 from './bewegungen-nachmachen.js';
import m3 from './bewegungslieder.js';
import m4 from './bildergeschichten.js';
import m5 from './denksportaufgaben.js';
import m6 from './entspannung-konzentration.js';
import m7 from './erklaerspiele-activity.js';
import m8 from './eselsbruecken-assoziationen.js';
import m9 from './fadenspiele-fingergeschick.js';
import m10 from './fehlersuche-eigene-arbeiten.js';
import m11 from './geschichten-erfinden.js';
import m12 from './gestaltschliessen.js';
import m13 from './handlungsfolgen-alltag.js';
import m14 from './kim-spiele.js';
import m15 from './klassische-strategiespiele.js';
import m16 from './koffer-packen.js';
import m17 from './konstruktionsspiel-bausteine.js';
import m18 from './kopfrechenspiele.js';
import m19 from './leitner-system.js';
import m20 from './lieder-gedichte-auswendig.js';
import m21 from './loci-methode.js';
import m22 from './logik-knobelspiele.js';
import m23 from './marburger-konzentrationstraining.js';
import m24 from './memory-spiele.js';
import m25 from './merkauftraege-alltag.js';
import m26 from './multisensorische-merkhilfen.js';
import m27 from './museum-naturerfahrung.js';
import m28 from './muster-kombinationsspiele.js';
import m29 from './muster-nachzeichnen-fortsetzen.js';
import m30 from './nikitin-material.js';
import m31 from './oberbegriffe.js';
import m32 from './perlenketten-auffaedeln.js';
import m33 from './plaene-skizzen-zeichnen.js';
import m34 from './psychomotorik-ergotherapie.js';
import m35 from './puzzles.js';
import m36 from './quizspiele.js';
import m37 from './rhythmisch-musikalische-erziehung.js';
import m38 from './rhythmus-nachklatschen.js';
import m39 from './sachbuecher-hoerspiele.js';
import m40 from './sindelar-wahrnehmungsfoerderung.js';
import m41 from './sortieren-kategorisieren.js';
import m42 from './sprachraetsel.js';
import m43 from './suchbilder-wimmelbilder.js';
import m44 from './sudoku.js';
import m45 from './symbole-lernen.js';
import m46 from './taegliche-sprachfoerderung.js';
import m47 from './tangram.js';
import m48 from './teekesselchen.js';
import m49 from './vorlesen-bilderbuecher.js';
import m50 from './wissenssendungen.js';
import m51 from './wortschatzspiele.js';
import m52 from './zaubertricks.js';
import m53 from './zuordnungsspiele.js';

/** Alle Methoden in Dateireihenfolge. */
export const methods = [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20, m21, m22, m23, m24, m25, m26, m27, m28, m29, m30, m31, m32, m33, m34, m35, m36, m37, m38, m39, m40, m41, m42, m43, m44, m45, m46, m47, m48, m49, m50, m51, m52, m53];

/** Kategorien für die Übersicht, in Anzeigereihenfolge. */
export const CATEGORIES = {
  'gedaechtnis':       { icon: '🧠', de: 'Gedächtnis & Merkstrategien', ru: 'Память и мнемотехники', en: '' },
  'aufmerksamkeit':    { icon: '🎯', de: 'Aufmerksamkeit & Konzentration', ru: 'Внимание и концентрация', en: '' },
  'wahrnehmung':       { icon: '👁️', de: 'Wahrnehmung', ru: 'Восприятие', en: '' },
  'logik-denken':      { icon: '💡', de: 'Logik & Denken', ru: 'Логика и мышление', en: '' },
  'raum-konstruktion': { icon: '📐', de: 'Raum & Konstruktion', ru: 'Пространство и конструирование', en: '' },
  'sprache':           { icon: '💬', de: 'Sprache', ru: 'Речь', en: '' },
  'motorik-rhythmus':  { icon: '🥁', de: 'Motorik & Rhythmus', ru: 'Моторика и ритм', en: '' },
  'wissen-alltag':     { icon: '🌍', de: 'Wissen & Alltag', ru: 'Знания и повседневность', en: '' },
  'erziehung':         { icon: '🤝', de: 'Erziehung & Verhalten', ru: 'Воспитание и поведение', en: '' }
};

const byId = new Map(methods.map(m => [m.id, m]));

/** Eine Methode holen, oder null. */
export function getMethod(id) {
  return byId.get(id) || null;
}

/** Methoden einer Kategorie. */
export function methodsInCategory(cat) {
  return methods.filter(m => m.category === cat);
}
