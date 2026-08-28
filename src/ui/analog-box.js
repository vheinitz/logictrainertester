/**
 * Der Kasten „so geht es ohne Bildschirm".
 *
 * Er steht bewusst *vor* dem Startknopf und nicht hinter einem Aufklapper.
 * Die App ist der Notbehelf: sie misst gleichmäßig und ist immer da, aber
 * gelernt wird am Tisch. Wer die App öffnet und sofort losspielt, hat den
 * wertvolleren Weg nie gesehen – deshalb steht er im Weg.
 *
 * Zwei Fassungen:
 *   analogBox()   ausführlich, mit Material und Anleitung – Startbildschirm
 *   analogZeile() eine Zeile – überall dort, wo Module nur aufgelistet sind
 */
import { analogFuer } from '../data/analog.js';
import { esc, lang } from '../core/html.js';

const T = {
  titel: { de: 'Besser ohne Bildschirm', ru: 'Лучше без экрана', en: 'Better without a screen' },
  material: { de: 'Material', ru: 'Материал', en: 'Materials' },
  warum: {
    de: 'Am Tisch sieht man, ob das Kind rät, aufgibt oder die Aufgabe nur nicht verstanden hat – das erkennt kein Programm. Die App ist der Notbehelf für unterwegs und für den Vergleich über die Zeit.',
    ru: 'За столом видно, угадывает ли ребёнок, сдаётся или просто не понял задание — программа этого не заметит. Приложение — запасной путь: для дороги и для сравнения во времени.',
    en: 'At the table you can see whether the child is guessing, giving up, or simply did not understand the task – no program notices that. The app is the fallback: for on the move and for comparison over time.'
  },
  kurz: { de: 'Geht auch ohne Bildschirm', ru: 'Можно и без экрана', en: 'Works without a screen too' }
};
const t = k => { const l = lang(); return T[k][l] || T[k].de; };
const px = (feld) => { const l = lang(); return (feld && (feld[l] || feld.de)) || ''; };

/**
 * Ausführlicher Kasten für ein Modul. Leerer String, wenn es für das Modul
 * keine Anleitung gibt – lieber nichts als eine leere Überschrift.
 */
export function analogBox(moduleId, opt = {}) {
  const a = analogFuer(moduleId);
  if (!a) return '';
  return `<div data-role="analog" style="text-align:left;background:#F4FAF4;border-left:4px solid var(--green);
      border-radius:var(--radius-sm);padding:14px 16px;margin:${opt.margin || '18px 0'}">
    <div style="font-weight:800;font-size:1em;margin-bottom:6px">🧺 ${esc(t('titel'))}</div>
    <div style="font-size:.84em;color:var(--text-light);margin-bottom:6px">
      ${esc(t('material'))}: ${esc(px(a.material))}</div>
    <p style="line-height:1.65;font-size:.95em;margin:0">${esc(px(a.so))}</p>
    ${opt.warum === false ? '' : `<p style="line-height:1.55;font-size:.8em;color:var(--text-light);margin:10px 0 0">
      ${esc(t('warum'))}</p>`}
  </div>`;
}

/** Eine Zeile für Listen – verweist auf den ausführlichen Kasten im Modul. */
export function analogZeile(moduleId) {
  const a = analogFuer(moduleId);
  if (!a) return '';
  return `<div style="font-size:.8em;color:var(--green);margin-top:2px">🧺 ${esc(t('kurz'))}: ${esc(px(a.material))}</div>`;
}

/** Nur die Anleitung als Text – für Stellen mit eigenem Rahmen. */
export function analogText(moduleId) {
  const a = analogFuer(moduleId);
  return a ? px(a.so) : '';
}

export const analogTitel = () => t('titel');
