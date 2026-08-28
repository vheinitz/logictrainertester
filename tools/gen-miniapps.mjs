/**
 * Erzeugt src/data/miniapps.js aus den Apps unter apps/.
 *
 * Titel und Symbol stehen in der App selbst (apps/<id>/app.js). Sie hier
 * noch einmal von Hand einzutragen hieße, sie zweimal zu pflegen – und beim
 * ersten Umbenennen stimmt eine der beiden Stellen nicht mehr. Deshalb
 * ausgelesen statt abgeschrieben.
 *
 * Nicht erzeugt wird die Zuordnung zu den Methodenseiten: welche App zu
 * welcher Methode passt, steht nicht in der App und lässt sich nicht
 * ableiten. Die steht von Hand in src/data/miniapp-zuordnung.js.
 *
 * Läuft bei `npm run build` mit.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'apps';
const OUT = 'src/data/miniapps.js';

/** Ein dreisprachiges Feld aus dem Quelltext lesen. */
function dreisprachig(src, feld) {
  const m = src.match(new RegExp(`${feld}:\\s*\\{([^}]*)\\}`));
  if (!m) return null;
  const out = {};
  for (const l of ['de', 'ru', 'en']) {
    const t = m[1].match(new RegExp(`${l}:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
    if (t) out[l] = t[1].replace(/\\'/g, "'");
  }
  return out.de ? out : null;
}

export function generate({ quiet = false } = {}) {
  const apps = [];

  for (const id of readdirSync(DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== '_framework')
    .map(d => d.name).sort()) {

    const seite = join(DIR, id, 'index.html');
    if (!existsSync(seite)) continue;          // ohne Seite nicht aufrufbar

    const appJs = join(DIR, id, 'app.js');
    let titel = null, icon = '';
    if (existsSync(appJs)) {
      const src = readFileSync(appJs, 'utf8');
      titel = dreisprachig(src, 'titel');
      icon = (src.match(/icon:\s*'([^']*)'/) || [])[1] || '';
    }
    if (!titel) {
      // Apps ohne Framework-Kopf (eigene Seite): Titel aus dem <title>-Tag.
      const html = readFileSync(seite, 'utf8');
      const tt = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
      if (tt) titel = { de: tt.trim(), ru: tt.trim(), en: tt.trim() };
    }
    if (!titel) throw new Error(`apps/${id}: weder titel in app.js noch <title> in index.html`);

    apps.push({ id, icon: icon || '🧩', titel, pfad: `${DIR}/${id}/index.html` });
  }

  const body = `/**
 * ERZEUGTE DATEI – nicht von Hand bearbeiten.
 * Neu erzeugen mit:  node tools/gen-miniapps.mjs   (läuft bei npm run build mit)
 *
 * Die eigenständigen Übungs-Apps unter apps/. Sie laufen für sich, mit
 * eigenem Bündel, und werden von den Methodenseiten aus verlinkt statt
 * eingebettet: ein Rahmen innerhalb der Seite bricht bei file:// je nach
 * Browser weg, ein Verweis nicht.
 *
 * Zuordnung Methode → App: src/data/miniapp-zuordnung.js
 */
export const MINIAPPS = ${JSON.stringify(apps, null, 2).replace(/"([a-z]+)":/g, '$1:')};

/** Eine App über ihre Kennung. */
export function getMiniapp(id) {
  return MINIAPPS.find(a => a.id === id) || null;
}
`;

  writeFileSync(OUT, body);
  if (!quiet) console.log(`  ${OUT}  ·  ${apps.length} Apps`);
  return apps.length;
}

if (import.meta.url === `file://${process.argv[1]}`) generate();
