/**
 * Prüft einzelne Methodenseiten gegen das Schema, ohne den Index anzufassen.
 *
 *   node tools/check-method.mjs src/data/methods/tangram.js [weitere …]
 *   node tools/check-method.mjs --alle
 *
 * Bewusst ohne Index: mehrere Leute können so gleichzeitig an eigenen Seiten
 * arbeiten, ohne dass die Prüfung an der halbfertigen Datei eines anderen
 * scheitert.
 */
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateMethod } from './method-schema.mjs';

const args = process.argv.slice(2);
const dateien = args.includes('--alle')
  ? readdirSync('src/data/methods')
      .filter(f => f.endsWith('.js') && f !== 'index.js')
      .map(f => `src/data/methods/${f}`)
  : args;

if (!dateien.length) {
  console.error('Aufruf: node tools/check-method.mjs <datei…> | --alle');
  process.exit(2);
}

let fehler = 0;
for (const datei of dateien) {
  const kurz = datei.replace(/^.*\//, '');
  let m;
  try {
    m = (await import(pathToFileURL(resolve(datei)).href)).default;
  } catch (e) {
    console.error(`✗ ${kurz}: lädt nicht – ${e.message}`);
    fehler++;
    continue;
  }

  const erwarteteId = kurz.replace(/\.js$/, '');
  const probleme = validateMethod(m);
  if (m && m.id !== erwarteteId) {
    probleme.unshift(`id ist "${m.id}", muss zum Dateinamen "${erwarteteId}" passen`);
  }

  if (probleme.length) {
    console.error(`✗ ${kurz}`);
    probleme.forEach(p => console.error(`    ${p}`));
    fehler += probleme.length;
  } else {
    const links = (m.links || []).length;
    const prod = (m.products || []).length;
    const schritte = (m.steps.de || []).length;
    console.log(`✓ ${kurz}  ${schritte} Schritte · ${links} Links · ${prod} Material` +
                `${m.svg ? ' · Zeichnung' : ''}`);
  }
}

if (fehler) {
  console.error(`\n${fehler} Beanstandung(en).`);
  process.exit(1);
}
console.log(`\n${dateien.length} Seite(n) in Ordnung.`);
