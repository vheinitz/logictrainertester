/**
 * Erzeugt src/data/foerderung-links.js: Förderpunkt → Methodenseite.
 *
 * Die Zuordnung wird nicht geraten, sondern aus der Konsolidierung übernommen:
 * jede Methode führt in `quellen_de` genau die Roh-Strings, die auf sie
 * abgebildet wurden. Deterministisch erzeugt heißt: vollständig, ohne
 * erfundene Verweise, und jederzeit reproduzierbar.
 *
 *   node tools/gen-foerderung-links.mjs <methoden.json>
 *
 * Prüft dabei zweierlei und bricht sonst ab:
 *   - jeder Roh-String aus performance-model.js ist genau einmal zugeordnet
 *   - jede Ziel-id hat eine Seite unter src/data/methods/
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const OUT = 'src/data/foerderung-links.js';
const quelle = process.argv[2];
if (!quelle) {
  console.error('Aufruf: node tools/gen-foerderung-links.mjs <methoden.json>');
  process.exit(2);
}

// ── Roh-Strings aus dem Performance-Modell ──
const pm = readFileSync('src/data/performance-model.js', 'utf8');
const rohStrings = new Set();
// Das abschließende `\n  }` ohne Komma nicht vergessen: der letzte Eintrag im
// Objekt hat keins, und ein Regex, der eines verlangt, überspringt ihn
// stillschweigend – so fielen vier Förderpunkte von plan-zaubertricks heraus.
for (const [, , body] of pm.matchAll(/'([a-z-]+)': \{([\s\S]*?)\n  \}[,;\n]/g)) {
  const m = body.match(/foerderung:\{de:\[([\s\S]*?)\],ru:/);
  if (!m) continue;
  for (const s of m[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)) {
    rohStrings.add(s[1].replace(/\\'/g, "'"));
  }
}

// ── Methoden ──
const methoden = JSON.parse(readFileSync(quelle, 'utf8'));
const seiten = new Set(readdirSync('src/data/methods')
  .filter(f => f.endsWith('.js') && f !== 'index.js')
  .map(f => f.replace(/\.js$/, '')));

const paare = [];
const zugeordnet = new Set();
const fehler = [];

for (const m of methoden) {
  if (!seiten.has(m.id)) { fehler.push(`Methode "${m.id}" hat keine Seite`); continue; }
  for (const q of (m.quellen_de || [])) {
    if (zugeordnet.has(q)) { fehler.push(`"${q}" ist mehrfach zugeordnet`); continue; }
    zugeordnet.add(q);
    paare.push([q, m.id]);
  }
}

const offen = [...rohStrings].filter(s => !zugeordnet.has(s));
const erfunden = [...zugeordnet].filter(s => !rohStrings.has(s));
if (offen.length) fehler.push(`${offen.length} Förderpunkte ohne Seite: ${offen.slice(0, 5).join(' | ')}${offen.length > 5 ? ' …' : ''}`);
if (erfunden.length) fehler.push(`${erfunden.length} zugeordnete Strings kommen im Modell nicht vor: ${erfunden.slice(0, 5).join(' | ')}`);

if (fehler.length) {
  console.error('✗ Zuordnung unvollständig:');
  fehler.forEach(f => console.error('    ' + f));
  process.exit(1);
}

paare.sort((a, b) => a[0].localeCompare(b[0], 'de'));
const esc = s => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

writeFileSync(OUT, `/**
 * ERZEUGTE DATEI – nicht von Hand bearbeiten.
 * Neu erzeugen mit:  node tools/gen-foerderung-links.mjs <methoden.json>
 *
 * Zuordnung: Förderpunkt aus performance-model.js → Methodenseite.
 *
 * Die Punkte im Info-Panel sind freie Textzeilen ("Merkspiele: Koffer packen,
 * Memory, Kim-Spiele"). Diese Tabelle sagt, welche Methodenseite dahinter
 * steckt. Ein Punkt ohne Eintrag bleibt einfacher Text – die App funktioniert
 * also auch, wenn eine Seite fehlt.
 *
 * ${paare.length} Förderpunkte, ${new Set(paare.map(p => p[1])).size} Methoden.
 */
export const FOERDERUNG_LINKS = {
${paare.map(([k, v]) => `  ${esc(k)}: '${v}'`).join(',\n')}
};

/**
 * Methodenseite zu einem Förderpunkt, oder null.
 * Vergleicht zuerst exakt, dann ohne Groß-/Kleinschreibung und Randzeichen –
 * die Texte im Modell sind von Hand gepflegt und nicht immer einheitlich.
 */
export function methodLinkFor(text) {
  if (!text) return null;
  if (FOERDERUNG_LINKS[text]) return FOERDERUNG_LINKS[text];
  const norm = s => String(s).toLowerCase().replace(/[„“"'.,:;()]/g, '').trim();
  const ziel = norm(text);
  for (const [k, v] of Object.entries(FOERDERUNG_LINKS)) {
    if (norm(k) === ziel) return v;
  }
  return null;
}
`);

console.log(`  ${OUT}  ·  ${paare.length} Förderpunkte → ${new Set(paare.map(p => p[1])).size} Methoden`);
