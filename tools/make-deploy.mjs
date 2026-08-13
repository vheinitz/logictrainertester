/**
 * Stellt das Auslieferungsverzeichnis zusammen: genau die Dateien, die die
 * App zum Laufen braucht, und nichts sonst.
 *
 *   node tools/make-deploy.mjs [zielordner]     (Vorgabe: deploy/)
 *
 * Warum nicht einfach das ganze Verzeichnis hochladen: darin liegen
 * node_modules (hunderte MB), der Quellcode, die Tests und das
 * KABC-Skript. Für die Tester ist davon nichts nötig, und das Skript soll
 * ohnehin nirgends hin.
 *
 * GitHub Pages braucht das nicht – dort liefert der Repo-Wurzelordner
 * direkt aus, und was nicht eingecheckt ist, wird auch nicht veröffentlicht.
 * Für Netlify ist es nötig, weil die Befehlszeile den angegebenen Ordner
 * vollständig hochlädt.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ZIEL = process.argv[2] || 'deploy';

// Die Liste stammt nicht aus einer gepflegten Konstante, sondern aus
// index.html selbst – sonst vergisst man beim nächsten Zusatz eine Datei
// und merkt es erst, wenn ein Tester eine halbe App sieht.
const html = readFileSync('index.html', 'utf8');
const referenziert = [...html.matchAll(/(?:src|href)="([^"?]+)(?:\?[^"]*)?"/g)]
  .map(m => m[1])
  .filter(p => !/^(https?:)?\/\//.test(p));

const dateien = ['index.html', ...new Set(referenziert)];

const fehlend = dateien.filter(f => !existsSync(f));
if (fehlend.length) {
  console.error('Fehlt im Arbeitsverzeichnis: ' + fehlend.join(', '));
  console.error('Erst bauen:  npm run build');
  process.exit(1);
}

rmSync(ZIEL, { recursive: true, force: true });
for (const f of dateien) {
  const ziel = join(ZIEL, f);
  mkdirSync(dirname(ziel), { recursive: true });
  copyFileSync(f, ziel);
}

// Für die Testphase soll die Seite nicht in Suchmaschinen auftauchen. Das
// ist kein Zugriffsschutz – wer die Adresse hat, kommt rein –, aber es
// verhindert, dass sie über eine Suche gefunden wird.
writeFileSync(join(ZIEL, 'robots.txt'), 'User-agent: *\nDisallow: /\n');

// GitHub Pages schickt alles durch Jekyll und schluckt dabei Ordner mit
// führendem Unterstrich. Die Datei schaltet das ab.
writeFileSync(join(ZIEL, '.nojekyll'), '');

const groesse = dateien.reduce((s, f) => s + readFileSync(f).length, 0);
console.log(`${ZIEL}/  ${dateien.length} Dateien, ${(groesse / 1048576).toFixed(1)} MB`);
for (const f of dateien) console.log('  ' + f);
