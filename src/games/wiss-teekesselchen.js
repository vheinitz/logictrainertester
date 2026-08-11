/**
 * Teekesselchen – ein Wort, zwei Bedeutungen
 *
 * Zwei Hinweise beschreiben dasselbe Wort in völlig verschiedenen Bedeutungen.
 * Gesucht ist der gemeinsame Begriff. Das prüft Flexibilität im sprachlichen
 * Denken: die erste Bedeutung muss losgelassen werden, um die zweite zu finden.
 *
 * Anders als die übrigen Module dieser Gruppe läuft das hier ohne Begleitperson,
 * weil die Lösung eindeutig ist und sich sauber als Auswahl stellen lässt.
 */
import { createChoiceGame } from '../core/choice.js';
import { shuffle } from '../core/html.js';

const PUZZLES = [
  { t: 1, a: 'Der Ball',    m: ['Damit spielt man Fußball.', 'Dort tanzen Menschen in schönen Kleidern.'], w: ['Der Reifen','Das Fest','Der Tanz'] },
  { t: 1, a: 'Die Maus',    m: ['Ein kleines graues Tier.', 'Damit klickt man am Computer.'], w: ['Die Katze','Die Taste','Der Käse'] },
  { t: 1, a: 'Der Hahn',    m: ['Er kräht am Morgen.', 'Aus ihm kommt Wasser.'], w: ['Das Huhn','Der Eimer','Die Uhr'] },
  { t: 2, a: 'Die Bank',    m: ['Darauf kann man im Park sitzen.', 'Dort wird Geld aufbewahrt.'], w: ['Der Stuhl','Die Kasse','Der Tresor'] },
  { t: 2, a: 'Der Flügel',  m: ['Damit fliegt ein Vogel.', 'Darauf spielt man Musik.'], w: ['Die Feder','Das Klavier','Die Geige'] },
  { t: 2, a: 'Das Schloss', m: ['Darin wohnte früher ein König.', 'Damit wird eine Tür verschlossen.'], w: ['Die Burg','Der Schlüssel','Das Tor'] },
  { t: 3, a: 'Der Kiefer',  m: ['Ein Knochen im Gesicht.', 'Ein Nadelbaum im Wald.'], w: ['Die Wange','Die Tanne','Die Rippe'] },
  { t: 3, a: 'Die Birne',   m: ['Eine Frucht am Baum.', 'Sie leuchtet in der Lampe.'], w: ['Der Apfel','Die Kerze','Die Sonne'] },
  { t: 3, a: 'Der Strauß',  m: ['Ein sehr großer Vogel.', 'Ein Bund Blumen.'], w: ['Der Adler','Der Kranz','Die Vase'] },
  { t: 4, a: 'Der Zug',     m: ['Er fährt auf Schienen.', 'Man macht ihn beim Schachspiel.'], w: ['Der Bus','Der Wurf','Das Brett'] },
  { t: 4, a: 'Das Blatt',   m: ['Es wächst am Baum.', 'Darauf kann man schreiben.'], w: ['Die Rinde','Das Heft','Der Zweig'] },
  { t: 4, a: 'Der Läufer',  m: ['Eine Figur beim Schach.', 'Ein schmaler Teppich im Flur.'], w: ['Der Turm','Die Matte','Der Sportler'] },
  { t: 5, a: 'Die Note',    m: ['Sie steht im Zeugnis.', 'Sie steht auf einem Notenblatt.'], w: ['Die Zensur','Der Ton','Das Zeugnis'] },
  { t: 5, a: 'Der Absatz',  m: ['Er sitzt unten am Schuh.', 'Er ist ein Abschnitt in einem Text.'], w: ['Die Sohle','Der Satz','Die Zeile'] },
  { t: 5, a: 'Die Kapelle', m: ['Eine kleine Kirche.', 'Eine Gruppe von Musikern.'], w: ['Der Dom','Der Chor','Das Orchester'] }
];

const game = createChoiceGame({
  id: 'wiss-teekesselchen',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 2,

  genRound: (gd) => {
    gd.asked = gd.asked || [];
    let pool = PUZZLES.filter(p => p.t === gd.level && !gd.asked.includes(p.a));
    if (!pool.length) {
      gd.asked = gd.asked.filter(x => !PUZZLES.some(p => p.t === gd.level && p.a === x));
      pool = PUZZLES.filter(p => p.t === gd.level);
    }
    const p = pool[Math.floor(Math.random() * pool.length)];
    gd.asked.push(p.a);
    const choices = shuffle([p.a, ...p.w]);

    return {
      prompt: `<div style="text-align:center">
        <div style="font-size:2.2em;margin-bottom:6px">🫖</div>
        <p style="font-size:1.02em;font-weight:700;margin-bottom:10px">Mein Teekesselchen …</p>
        <div style="display:flex;flex-direction:column;gap:8px;align-items:center;margin-bottom:8px">
          ${p.m.map((m, i) => `<div style="background:var(--bg);border-radius:14px;padding:9px 18px;max-width:420px">
            <b style="color:var(--primary)">${i + 1}.</b> ${m}</div>`).join('')}
        </div>
        <p style="font-size:.95em;font-weight:700">Welches Wort ist gemeint?</p>
      </div>`,
      options: choices.map(c => ({ html: c, label: c })),
      correct: choices.indexOf(p.a),
      layout: 'list',
      explain: `„${p.a}" passt zu beiden Bedeutungen.`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
