/**
 * Ich packe meinen Koffer – kumulative Merkspanne
 *
 * Unterschied zu den anderen Span-Tests: die Liste wird nicht jede Runde neu
 * gewürfelt, sondern wächst. Bei Niveau N+1 stehen dieselben N Dinge wie eben
 * plus ein neues. Genau das macht das Spiel im Original aus – und es misst
 * etwas anderes als eine frische Zufallsfolge, nämlich das Halten und
 * Erweitern einer Liste über mehrere Durchgänge.
 *
 * Die Namen unter den Bildern bleiben stehen: sie sind Teil der Aufgabe, nicht
 * Beiwerk – ohne sie wäre bei ähnlichen Symbolen unklar, was gemeint ist.
 * Das neu hinzugekommene Ding wird umrandet statt beschriftet.
 */
import { createSpanTest } from '../core/adaptive.js';
import { sample, randInt, color, jsArg, esc, lang } from '../core/html.js';
import listen from '../data/wordlists.json' with { type: 'json' };

// Gegenstände aus der gemeinsamen Liste – dieselbe Quelle, aus der auch die
// Sprachaufnahmen erzeugt werden, damit Bild und Ansage nicht auseinanderlaufen.
const ITEMS = listen.items;

const byKey = k => ITEMS.find(i => i.key === k) || ITEMS[0];
/** Anzeigename in der eingestellten Sprache. */
const nameOf = k => { const l = lang(); const i = byKey(k); return i[l] || i.de; };

/** Zeile aus Gegenständen mit Namen; das letzte optional hervorgehoben. */
function row(items, size, markLast) {
  return `<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    ${items.map((k, i) => {
      const last = markLast && i === items.length - 1 && items.length > 1;
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:3px">
        <div style="width:${size}px;height:${size}px;border-radius:14px;background:${color(i)};display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.52)}px;${last ? 'box-shadow:0 0 0 4px var(--primary)' : ''}">${byKey(k).emoji}</div>
        <span style="font-size:${size > 50 ? '.7em' : '.62em'};color:var(--text-light);max-width:${size + 12}px;text-align:center;line-height:1.2">${esc(nameOf(k))}</span>
      </div>`;
    }).join('')}
  </div>`;
}

const test = createSpanTest({
  id: 'seq-koffer-packen',
  minN: 2,
  maxN: 10,
  levelCap: 12,
  factor: 2,
  labelOf: k => nameOf(k),
  instruction: 'Der Koffer wird gepackt und bei jeder Runde kommt ein Ding dazu ' +
               '(umrandet). Merke dir alles – und tippe es danach in derselben ' +
               'Reihenfolge an.',

  /**
   * Der Koffer wächst und schrumpft – er wird nie neu gewürfelt.
   *
   * Vorher packte jede Stufe, die nicht genau um eins gewachsen war, einen
   * komplett neuen Zufallskoffer. Nach dem ersten Fehler standen deshalb lauter
   * fremde Dinge da: das Spiel fühlte sich an, als hätte es von vorn begonnen,
   * und der kumulative Charakter – der eigentliche Kern von „Ich packe meinen
   * Koffer" – war weg.
   *
   * Jetzt: bei einem Fehler fällt genau das zuletzt hinzugekommene Ding wieder
   * heraus, der Rest bleibt stehen. Geht es wieder hoch, kommt ein NEUES Ding
   * dazu – die Aufgabe wiederholt sich also nicht wörtlich.
   */
  genItems: (level, gd) => {
    let koffer = gd.suitcase || [];

    // Zu viele Dinge (Niveau gesunken): hinten abschneiden, vorne bleibt alles
    if (koffer.length > level) koffer = koffer.slice(0, level);

    // Zu wenige (Niveau gestiegen oder Start): auffüllen, ohne Wiederholung
    while (koffer.length < level) {
      const used = new Set(koffer);
      const rest = ITEMS.filter(i => !used.has(i.key));
      if (!rest.length) break;                 // Vorrat erschöpft
      koffer.push(rest[randInt(0, rest.length - 1)].key);
    }

    gd.suitcase = koffer;
    return koffer.slice(0, level);
  },

  renderShow: (gd) => row(gd.sequence, 60, true),
  renderSolution: (gd) => row(gd.sequence, 40, false),

  renderAnswer: (gd, ctx) => `
    <div style="display:flex;gap:10px;min-height:50px;align-items:center;justify-content:center;margin:0 0 22px;flex-wrap:wrap">
      ${ctx.selected.map((k, i) =>
        `<div class="pick-target" onclick="G('remove',${i})" title="Zurücknehmen" style="width:46px;height:46px;border-radius:12px;background:${color(i)};display:flex;align-items:center;justify-content:center;font-size:1.5em;cursor:pointer">${byKey(k).emoji}</div>`
      ).join('')}
      ${Array(ctx.slotsLeft).fill(0).map(() =>
        `<div style="width:46px;height:46px;border-radius:12px;border:2px dashed #D8D4EE"></div>`
      ).join('')}
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
      ${(gd.optionKeys || []).map(k =>
        `<div class="pick-target" onclick="G('pick',${jsArg(k)})" title="${esc(nameOf(k))}" style="width:58px;height:58px;border-radius:14px;background:var(--bg);border:2px solid #D0CDE8;display:flex;align-items:center;justify-content:center;font-size:1.8em;cursor:pointer">${byKey(k).emoji}</div>`
      ).join('')}
    </div>`,

  genOptions: (gd) => {
    const inCase = new Set(gd.sequence);
    const distractors = sample(ITEMS.filter(i => !inCase.has(i.key)), Math.max(3, Math.ceil(gd.sequence.length / 2)));
    gd.optionKeys = sample([...gd.sequence, ...distractors.map(d => d.key)], 99);
    return gd.optionKeys;
  }
});

export const { init, render, dispose, actions, scoring, chrome, instruction,
               getFactor, setFactor } = test;
