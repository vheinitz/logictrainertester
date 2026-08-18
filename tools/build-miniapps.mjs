/**
 * Mini-Apps bundlen, damit sie von file:// laufen.
 *
 * ES-Module sind bei file:// blockiert (deshalb ist auch die Haupt-App
 * gebündelt). Jede App unter apps/ (außer _framework) wird zu einem
 * klassischen IIFE-Skript `app.bundle.js` gebündelt; die Exporte landen auf
 * `window.<ID>` (z. B. window.HANOI.default = App-Instanz).
 *
 *   node tools/build-miniapps.mjs
 */
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import * as esbuild from 'esbuild';

const APPS = 'apps';
const dirs = readdirSync(APPS, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name !== '_framework' && existsSync(join(APPS, d.name, 'app.js')))
  .map(d => d.name);

for (const id of dirs) {
  const globalName = id.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
  await esbuild.build({
    entryPoints: [join(APPS, id, 'app.js')],
    bundle: true,
    minify: true,
    format: 'iife',
    globalName,
    target: 'es2020',
    outfile: join(APPS, id, 'app.bundle.js'),
    logLevel: 'warning'
  });
  console.log(`  ${APPS}/${id}/app.bundle.js  →  window.${globalName}`);
}
