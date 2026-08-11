/**
 * Rätsel-Raten – verbales Schlussfolgern
 * (KABC-II: „Rätsel")
 *
 * Mehrere Hinweise beschreiben einen Gegenstand, gesucht ist der Begriff.
 * Anders als beim Sachwissen zählt hier nicht, ob man eine Tatsache kennt,
 * sondern ob man mehrere Teilinformationen zu einer Lösung zusammenzieht.
 *
 * Deshalb werden die Hinweise nacheinander aufgedeckt: wer nach dem ersten
 * Hinweis löst, hat mehr geschlossen als wer alle drei braucht.
 */
import { createChoiceGame } from '../core/choice.js';
import { shuffle } from '../core/html.js';

const RIDDLES = [
  { t: 1, a: 'Die Uhr',      e: '🕐', h: ['Ich habe Zeiger, aber keine Hände.', 'Ich ticke.', 'Ich sage dir, wie spät es ist.'], w: ['Der Spiegel','Das Radio','Der Kalender'] },
  { t: 1, a: 'Der Schuh',    e: '👟', h: ['Es gibt mich immer im Paar.', 'Ich habe eine Zunge, aber rede nicht.', 'Du ziehst mich an die Füße.'], w: ['Der Handschuh','Die Mütze','Die Brille'] },
  { t: 1, a: 'Der Apfel',    e: '🍎', h: ['Ich wachse an einem Baum.', 'Ich bin rot oder grün.', 'Ich habe ein Kerngehäuse.'], w: ['Die Kartoffel','Die Möhre','Die Nuss'] },
  { t: 2, a: 'Der Schlüssel',e: '🔑', h: ['Ich habe Zähne, aber beiße nicht.', 'Ich passe in ein Loch.', 'Mit mir öffnest du Türen.'], w: ['Der Kamm','Die Säge','Die Gabel'] },
  { t: 2, a: 'Der Schatten', e: '🌑', h: ['Ich folge dir überall hin.', 'Bei Dunkelheit bin ich weg.', 'Anfassen kannst du mich nicht.'], w: ['Der Spiegel','Das Echo','Der Wind'] },
  { t: 2, a: 'Das Ei',       e: '🥚', h: ['Ich bin außen hart und innen weich.', 'Ich zerbreche leicht.', 'Aus mir kann ein Küken schlüpfen.'], w: ['Die Nuss','Der Stein','Die Muschel'] },
  { t: 3, a: 'Das Echo',     e: '🔊', h: ['Ich spreche, ohne einen Mund zu haben.', 'Ich antworte nur, wenn du rufst.', 'In den Bergen hörst du mich oft.'], w: ['Der Schatten','Das Radio','Der Papagei'] },
  { t: 3, a: 'Der Fluss',    e: '🏞️', h: ['Ich habe ein Bett, schlafe aber nie.', 'Ich habe ein Ufer, aber keine Bank.', 'Ich fließe ins Meer.'], w: ['Der See','Die Straße','Die Wolke'] },
  { t: 3, a: 'Die Kerze',    e: '🕯️', h: ['Je länger ich lebe, desto kürzer werde ich.', 'Ich gebe Licht.', 'Wasser ist mein Ende.'], w: ['Der Bleistift','Die Lampe','Das Streichholz'] },
  { t: 4, a: 'Der Buchstabe','e': '🔤', h: ['Ich bin klein, aber ohne mich gibt es kein Wort.', 'Es gibt 26 von mir im Alphabet.', 'Aus vielen von mir wird ein Buch.'], w: ['Die Zahl','Der Punkt','Die Seite'] },
  { t: 4, a: 'Das Loch',     e: '🕳️', h: ['Je mehr man von mir wegnimmt, desto größer werde ich.', 'Ich bestehe aus nichts.', 'Im Käse findest du mich oft.'], w: ['Der Berg','Der Schwamm','Der Staub'] },
  { t: 4, a: 'Der Buchstabe M','e': 'Ⓜ️', h: ['Ich komme einmal in der Minute vor.', 'Zweimal im Moment.', 'Aber nie in hundert Jahren.'], w: ['Die Sekunde','Die Zahl 2','Der Zeiger'] },
  { t: 5, a: 'Die Landkarte',e: '🗺️', h: ['Ich habe Städte ohne Häuser.', 'Ich habe Wälder ohne Bäume.', 'Und Flüsse ohne Wasser.'], w: ['Das Gemälde','Der Traum','Das Modell'] },
  { t: 5, a: 'Der Atem',     e: '💨', h: ['Du hast mich immer bei dir, siehst mich aber selten.', 'Im Winter werde ich sichtbar.', 'Ohne mich lebst du keine Minute.'], w: ['Der Schatten','Der Puls','Der Gedanke'] },
  { t: 5, a: 'Das Versprechen', e: '🤝', h: ['Man gibt mich, ohne etwas herzugeben.', 'Man kann mich brechen, ohne mich anzufassen.', 'Man kann mich halten, ohne Hände.'], w: ['Das Geheimnis','Der Gruß','Die Meinung'] }
];

const game = createChoiceGame({
  id: 'wiss-raetsel',
  minLevel: 1,
  maxLevel: 5,
  startLevel: 2,

  genRound: (gd) => {
    gd.asked = gd.asked || [];
    let pool = RIDDLES.filter(r => r.t === gd.level && !gd.asked.includes(r.a));
    if (!pool.length) {
      gd.asked = gd.asked.filter(x => !RIDDLES.some(r => r.t === gd.level && r.a === x));
      pool = RIDDLES.filter(r => r.t === gd.level);
    }
    const r = pool[Math.floor(Math.random() * pool.length)];
    gd.asked.push(r.a);
    gd.hintsShown = 1;
    gd.riddle = r;
    const choices = shuffle([r.a, ...r.w]);

    return {
      prompt: renderPrompt(r, 1),
      options: choices.map(c => ({ html: c, label: c })),
      correct: choices.indexOf(r.a),
      layout: 'list',
      explain: `Gesucht war: ${r.a} ${r.e}`
    };
  },

  // Zusätzliche Action: nächsten Hinweis aufdecken
  extraActions: {
    hint(gs) {
      const gd = gs.gd;
      if (!gd.riddle || gd.phase !== 'ask') return false;
      gd.hintsShown = Math.min(gd.hintsShown + 1, gd.riddle.h.length);
      gd.round.prompt = renderPrompt(gd.riddle, gd.hintsShown);
    }
  }
});

function renderPrompt(r, shown) {
  return `<div style="text-align:center">
    <div style="font-size:2.4em;margin-bottom:8px">🤔</div>
    <div style="display:flex;flex-direction:column;gap:6px;align-items:center;margin-bottom:10px">
      ${r.h.slice(0, shown).map((h, i) =>
        `<div style="background:var(--bg);border-radius:14px;padding:8px 16px;max-width:420px;font-size:1.02em">
          <b style="color:var(--primary)">${i + 1}.</b> ${h}
        </div>`).join('')}
    </div>
    ${shown < r.h.length
      ? `<button class="btn btn-secondary btn-small" onclick="G('hint')">💡 Noch ein Hinweis (${r.h.length - shown})</button>`
      : `<div style="font-size:.8em;color:var(--text-light)">Alle Hinweise sind aufgedeckt</div>`}
    <p style="font-size:.95em;font-weight:700;margin-top:10px">Was ist gemeint?</p>
  </div>`;
}

export const { init, render, dispose, actions, scoring } = game;
