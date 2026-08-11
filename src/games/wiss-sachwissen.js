/**
 * Was weißt du? – Wort- und Sachwissen
 * (KABC-II: „Wort- und Sachwissen")
 *
 * Kristalline Fähigkeiten (Gc): Wissen, das über Jahre aus Schule, Familie und
 * Umfeld zusammenkommt. Ergebnisse hier sagen entsprechend mehr über
 * Lerngelegenheiten als über Verarbeitungsgeschwindigkeit – das steht auch so
 * in den Hypothesen des Performance-Modells.
 *
 * Fragen sind nach Alter gestaffelt (Niveau 1 ≈ Vorschule, Niveau 5 ≈ ab 12).
 */
import { createChoiceGame } from '../core/choice.js';
import { shuffle } from '../core/html.js';

const QUESTIONS = [
  // Niveau 1
  { t: 1, q: 'Welches Tier gibt Milch?', a: 'Die Kuh', w: ['Das Huhn', 'Der Frosch', 'Die Biene'] },
  { t: 1, q: 'Wo wohnen Fische?', a: 'Im Wasser', w: ['Im Baum', 'In der Erde', 'In der Luft'] },
  { t: 1, q: 'Was benutzt man zum Schneiden?', a: 'Die Schere', w: ['Der Löffel', 'Der Kamm', 'Die Gabel'] },
  { t: 1, q: 'Welche Farbe hat eine reife Banane?', a: 'Gelb', w: ['Blau', 'Lila', 'Schwarz'] },
  { t: 1, q: 'Wann gehen die meisten Kinder schlafen?', a: 'Am Abend', w: ['Am Morgen', 'Am Mittag', 'Am Vormittag'] },
  // Niveau 2
  { t: 2, q: 'Wie viele Beine hat eine Spinne?', a: 'Acht', w: ['Sechs', 'Vier', 'Zehn'] },
  { t: 2, q: 'Welche Jahreszeit kommt nach dem Winter?', a: 'Der Frühling', w: ['Der Sommer', 'Der Herbst', 'Der Winter nochmal'] },
  { t: 2, q: 'Woraus wird Brot gemacht?', a: 'Aus Mehl', w: ['Aus Reis', 'Aus Milch', 'Aus Kartoffeln'] },
  { t: 2, q: 'Was macht ein Tierarzt?', a: 'Er behandelt Tiere', w: ['Er verkauft Tiere', 'Er fängt Tiere', 'Er malt Tiere'] },
  { t: 2, q: 'Wie viele Tage hat eine Woche?', a: 'Sieben', w: ['Fünf', 'Zehn', 'Zwölf'] },
  // Niveau 3
  { t: 3, q: 'Welcher Planet ist der Sonne am nächsten?', a: 'Merkur', w: ['Venus', 'Erde', 'Mars'] },
  { t: 3, q: 'Was ist die Hauptstadt von Deutschland?', a: 'Berlin', w: ['München', 'Hamburg', 'Köln'] },
  { t: 3, q: 'Wie nennt man ein Tier, das nur Pflanzen frisst?', a: 'Pflanzenfresser', w: ['Fleischfresser', 'Allesfresser', 'Aasfresser'] },
  { t: 3, q: 'Woher kommt Honig?', a: 'Von Bienen', w: ['Von Ameisen', 'Von Schmetterlingen', 'Aus Blüten direkt'] },
  { t: 3, q: 'Bei wie viel Grad gefriert Wasser?', a: '0 Grad', w: ['10 Grad', '32 Grad', '100 Grad'] },
  // Niveau 4
  { t: 4, q: 'Welches Organ pumpt das Blut durch den Körper?', a: 'Das Herz', w: ['Die Lunge', 'Die Leber', 'Der Magen'] },
  { t: 4, q: 'Was misst man mit einem Thermometer?', a: 'Die Temperatur', w: ['Das Gewicht', 'Die Länge', 'Die Lautstärke'] },
  { t: 4, q: 'Welcher Kontinent ist der größte?', a: 'Asien', w: ['Afrika', 'Europa', 'Nordamerika'] },
  { t: 4, q: 'Wie heißt der Vorgang, bei dem Wasser zu Dampf wird?', a: 'Verdunsten', w: ['Gefrieren', 'Schmelzen', 'Kondensieren'] },
  { t: 4, q: 'Was ist ein Vulkan?', a: 'Ein Berg, aus dem Lava kommt', w: ['Ein sehr tiefer See', 'Ein Erdbeben', 'Eine große Welle'] },
  // Niveau 5
  { t: 5, q: 'Welches Gas atmen Pflanzen zum Wachsen ein?', a: 'Kohlendioxid', w: ['Sauerstoff', 'Stickstoff', 'Wasserstoff'] },
  { t: 5, q: 'Wie nennt man die Lehre von den Lebewesen?', a: 'Biologie', w: ['Geologie', 'Physik', 'Chemie'] },
  { t: 5, q: 'Was bezeichnet der Begriff „Demokratie"?', a: 'Herrschaft des Volkes', w: ['Herrschaft eines Königs', 'Herrschaft der Reichen', 'Herrschaft des Militärs'] },
  { t: 5, q: 'Welcher Ozean liegt zwischen Europa und Amerika?', a: 'Der Atlantik', w: ['Der Pazifik', 'Der Indische Ozean', 'Das Mittelmeer'] },
  { t: 5, q: 'Wodurch entstehen Ebbe und Flut?', a: 'Durch die Anziehung des Mondes', w: ['Durch den Wind', 'Durch die Erdrotation allein', 'Durch Regen'] }
];

const game = createChoiceGame({
  id: 'wiss-sachwissen',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 2,

  genRound: (gd) => {
    gd.asked = gd.asked || [];
    let pool = QUESTIONS.filter(q => q.t === gd.level && !gd.asked.includes(q.q));
    if (!pool.length) {
      // Stufe erschöpft – Gedächtnis für diese Stufe leeren statt zu wiederholen
      gd.asked = gd.asked.filter(x => !QUESTIONS.some(q => q.t === gd.level && q.q === x));
      pool = QUESTIONS.filter(q => q.t === gd.level);
    }
    const q = pool[Math.floor(Math.random() * pool.length)];
    gd.asked.push(q.q);
    const choices = shuffle([q.a, ...q.w]);

    return {
      prompt: `<div style="text-align:center">
        <div style="font-size:2.4em;margin-bottom:6px">🌍</div>
        <p style="font-size:1.15em;font-weight:700;margin-bottom:4px">${q.q}</p>
      </div>`,
      options: choices.map(c => ({ html: c, label: c })),
      correct: choices.indexOf(q.a),
      layout: 'list',
      explain: `Richtig ist: ${q.a}.`
    };
  }
});

export const { init, render, dispose, actions, scoring } = game;
