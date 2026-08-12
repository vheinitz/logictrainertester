/**
 * Build mit Kennung gegen den Browser-Cache.
 *
 * Der Browser hält `dist/logik-trainer.min.js` unter demselben Pfad hartnäckig
 * fest – nach einem Rebuild lief im Browser weiter der alte Stand, und man
 * sucht den Fehler im Code statt im Cache. Deshalb bekommt jeder Build eine
 * Kennung aus dem Inhalt aller Quelldateien; sie landet als `?v=` im
 * Script-Tag von index.html. Ändert sich der Code, ändert sich die URL, und
 * der Browser lädt zwingend neu.
 *
 *   node tools/build.mjs            Produktionsbuild
 *   node tools/build.mjs --dev      mit Sourcemap, unkomprimiert
 *   node tools/build.mjs --watch    baut bei jeder Änderung neu
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import * as esbuild from 'esbuild';
import { generate as generateMethodIndex } from './gen-method-index.mjs';

const dev = process.argv.includes('--dev') || process.argv.includes('--watch');
const watch = process.argv.includes('--watch');
const OUT = 'dist/logik-trainer.min.js';

/** Kennung aus dem Inhalt aller Quelldateien – gleicher Code, gleiche Kennung. */
function sourceStamp(dir = 'src') {
  const h = createHash('sha1');
  const walk = d => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (p.endsWith('.js')) { h.update(p); h.update(readFileSync(p)); }
    }
  };
  walk(dir);
  return h.digest('hex').slice(0, 8);
}

/** Script-Tag in index.html auf die aktuelle Kennung setzen. */
function stampHtml(stamp) {
  const file = 'index.html';
  const html = readFileSync(file, 'utf8');
  const next = html.replace(
    /(<script src="dist\/logik-trainer\.min\.js)(\?v=[^"]*)?(")/,
    `$1?v=${stamp}$3`
  );
  if (next !== html) writeFileSync(file, next);
  return next !== html;
}

const options = {
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: !dev,
  sourcemap: dev,
  format: 'iife',
  target: 'es2020',
  outfile: OUT,
  logLevel: 'warning'
};

async function once() {
  // Methoden-Index zuerst: neue Seiten sollen ohne Handeintrag wirksam werden
  generateMethodIndex({ quiet: true });
  await esbuild.build(options);
  const stamp = sourceStamp();
  const changed = stampHtml(stamp);
  const kb = (statSync(OUT).size / 1024).toFixed(1);
  console.log(`  ${OUT}  ${kb}kb  ·  Build ${stamp}${changed ? '  (index.html aktualisiert)' : ''}`);
  return stamp;
}

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
  console.log('esbuild beobachtet src/ …');
  // Die Kennung mitziehen, wenn sich der Quelltext ändert
  generateMethodIndex({ quiet: true });
  let last = sourceStamp();
  stampHtml(last);
  setInterval(() => {
    const now = sourceStamp();
    if (now !== last) { last = now; stampHtml(now); console.log(`  neu gebaut · Build ${now}`); }
  }, 700);
} else {
  await once();
}
