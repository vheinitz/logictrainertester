/**
 * Bausteine zählen – verdeckte Mengen erschließen
 * (KABC-II: „Bausteine zählen")
 *
 * Gezeigt wird eine vollständige rechteckige Mauer, von der ein Stück durch
 * ein Tuch verdeckt ist. Gefragt ist die Gesamtzahl der Steine. Genau das ist
 * der Kern des Subtests: nicht abzählen, was man sieht, sondern erschließen,
 * was hinter der Verdeckung weitergehen muss.
 *
 * Niveau steuert Mauergröße und Größe der verdeckten Fläche.
 */
import { createChoiceGame } from '../core/choice.js';
import { randInt, shuffle, pick } from '../core/html.js';

const UI = {
  frage: { de: '🧱 Wie viele Bausteine sind es insgesamt?', ru: '🧱 Сколько всего кубиков?', en: '🧱 How many blocks are there in total?' },
  tuch:  { de: 'Das graue Tuch verdeckt einen Teil der Mauer – die Mauer ist überall gleich dicht.',
           ru: 'Серая ткань закрывает часть стены – стена везде одинаково плотная.',
           en: 'The grey cloth covers part of the wall – the wall is equally dense everywhere.' },
  breite: { de: 'in der Breite', ru: 'в ширину', en: 'in width' },
  hoehe:  { de: 'in der Höhe', ru: 'в высоту', en: 'in height' },
  steine: { de: 'Steine', ru: 'кубиков', en: 'blocks' },
  sichtbar: { de: 'sichtbar', ru: 'видно', en: 'visible' },
  verdeckt: { de: 'verdeckt', ru: 'скрыто', en: 'covered' }
};

const game = createChoiceGame({
  id: 'sim-bausteine',
  minLevel: 1,
  maxLevel: 6,
  startLevel: 1,

  // Keine Aufgabe zweimal im selben Durchgang – beim zweiten Mal misst
  // sie die Erinnerung an die vorige Antwort, nicht die Fähigkeit.
  roundKey: r => r._key,

  genRound: (gd) => {
    const L = gd.level;
    // Auch die Mauergröße wandert innerhalb einer Stufe. Vorher war sie je
    // Stufe fest – auf Stufe 1 gab es dadurch nur eine einzige 3×2-Mauer und
    // damit zehn unterscheidbare Rätsel, weniger als ein Durchgang lang ist.
    const w = randInt(3, Math.min(8, 3 + L));
    const h = randInt(2, Math.min(5, 2 + Math.ceil(L / 2)));
    const total = w * h;

    // verdecktes Rechteck – nie die ganze Mauer, sonst ist nichts erschließbar
    const cw = Math.max(1, Math.min(w - 1, randInt(1, Math.ceil(w / 2))));
    const ch = Math.max(1, Math.min(h - 1, randInt(1, Math.ceil(h / 2))));
    const cx = randInt(0, w - cw);
    const cy = randInt(0, h - ch);

    const covered = (x, y) => x >= cx && x < cx + cw && y >= cy && y < cy + ch;

    let cells = '';
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        cells += covered(x, y)
          ? `<div style="aspect-ratio:1.3;border-radius:4px;background:repeating-linear-gradient(45deg,#B8B4D8,#B8B4D8 6px,#A9A5CC 6px,#A9A5CC 12px)"></div>`
          : `<div style="aspect-ratio:1.3;border-radius:4px;background:#D97757;border:1px solid #C4634A;display:flex;align-items:center;justify-content:center;font-size:.8em"></div>`;
      }
    }

    // Ablenker: typische Fehler – nur Sichtbares gezählt, Zeile/Spalte vertan
    const visible = total - cw * ch;
    const wrong = new Set([visible, total + h, total - h, total + 1, total - 1, w + h]);
    wrong.delete(total);
    const picks = shuffle([...wrong].filter(n => n > 0)).slice(0, 3);
    const choices = shuffle([total, ...picks]);

    return {
      prompt: `<div style="text-align:center">
        <p style="font-size:1.05em">${pick(UI.frage)}</p>
        <p style="font-size:.85em;color:var(--text-light);margin-bottom:10px">${pick(UI.tuch)}</p>
        <div style="display:grid;grid-template-columns:repeat(${w},1fr);gap:3px;max-width:${Math.min(w * 46, 380)}px;margin:0 auto;padding:10px;background:#F4F2FB;border-radius:10px">
          ${cells}
        </div>
      </div>`,
      options: choices.map(n => ({ html: String(n), label: String(n) })),
      // Die Lage des verdeckten Rechtecks gehört in die Kennung: dieselbe
      // Mauer mit anderswo liegender Abdeckung ist eine andere Aufgabe.
      // Ohne cx/cy blieben auf Stufe 1 nur zwei unterscheidbare Rätsel.
      _key: `${w}x${h}-${cw}x${ch}@${cx},${cy}`,
      correct: choices.indexOf(total),
      columns: 4,
      explain: `${w} ${pick(UI.breite)} × ${h} ${pick(UI.hoehe)} = ${total} ${pick(UI.steine)} (${visible} ${pick(UI.sichtbar)}, ${cw * ch} ${pick(UI.verdeckt)}).`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
