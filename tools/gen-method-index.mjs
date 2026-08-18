/**
 * Erzeugt src/data/methods/index.js aus den Dateien im selben Verzeichnis.
 *
 * Der Index wird generiert statt von Hand gepflegt, damit mehrere Leute (oder
 * Agenten) gleichzeitig Methodenseiten anlegen können, ohne sich an einer
 * gemeinsamen Datei in die Quere zu kommen. Datei hinlegen genügt.
 *
 * Läuft automatisch als erster Schritt von `npm run build`.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/data/methods';
const OUT = join(DIR, 'index.js');

export function generate({ quiet = false } = {}) {
  if (!existsSync(DIR)) mkdirSync(DIR, { recursive: true });

  const files = readdirSync(DIR)
    .filter(f => f.endsWith('.js') && f !== 'index.js')
    .sort();

  // Grobe Prüfung: id im Modul muss zum Dateinamen passen, sonst zeigen
  // Verweise ins Leere und man sucht lange.
  const ids = [];
  for (const f of files) {
    const src = readFileSync(join(DIR, f), 'utf8');
    const m = src.match(/id:\s*'([a-z0-9-]+)'/);
    const want = f.replace(/\.js$/, '');
    if (!m) throw new Error(`${f}: kein id-Feld gefunden`);
    if (m[1] !== want) throw new Error(`${f}: id ist '${m[1]}', erwartet '${want}'`);
    ids.push(want);
  }

  const body = `/**
 * ERZEUGTE DATEI – nicht von Hand bearbeiten.
 * Neu erzeugen mit:  node tools/gen-method-index.mjs   (läuft bei npm run build mit)
 *
 * Sammelt die Fördermethoden aus diesem Verzeichnis. Format: siehe README.md.
 */
${ids.map((id, i) => `import m${i} from './${id}.js';`).join('\n')}

/** Alle Methoden in Dateireihenfolge. */
export const methods = [${ids.map((_, i) => `m${i}`).join(', ')}];

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
`;

  writeFileSync(OUT, body);
  if (!quiet) console.log(`  ${OUT}  ·  ${ids.length} Methoden`);
  return ids;
}

// Direkt aufgerufen?
if (import.meta.url === `file://${process.argv[1]}`) generate();
