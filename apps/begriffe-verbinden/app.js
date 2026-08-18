/**
 * Wort & Bedeutung – Zuordnungsspiel für Sprachverständnis.
 * idee-db: 37
 *
 * Quelle: Adaptatsia_Uchebnykh_Materialov_Dlya_Obuchayuschikhsya_S_Ras,
 * S. 57–58, Teil III, 3.2.3 „Литературное чтение“, Beispiel № 15.
 *
 * Links stehen schwierige Wörter (nummeriert), rechts ihre Erklärungen in
 * gemischter Reihenfolge. Das Kind zieht von jedem Wort eine Linie zur
 * passenden Bedeutung (oder tippt Wort → Bedeutung) und bekommt sofort
 * Rückmeldung: richtig wird grün verbunden, falsch blinkt kurz rot.
 *
 * 300 Begriffe aus 10 Gebieten (daten.js), von gegenständlich (Stufe 1) bis
 * bildhaft/abstrakt (Stufe 5). Fehlt ein Bild, zeigt ein Rechteck das Wort als
 * Platzhalter – die Bilder lassen sich später anhand der Platzhalter erstellen.
 * Dazu pro Begriff optional `bild: 'bilder/<datei>.png'` in daten.js ergänzen
 * und die Bilddatei ablegen; die App rendert dann das Bild links im Kästchen.
 */
import { MiniApp } from '../_framework/framework.js';
import { BEGRIFFE } from './daten.js';

// ─── Mehrsprachigkeit (wie die Haupt-App) ────────────────────────────
function L(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  const lang = (typeof localStorage !== 'undefined' && localStorage.getItem('miniapp-lang')) || 'de';
  return obj[lang] || obj.de || '';
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Ein Daten-Array-Eintrag → Objekt mit {de,ru,en}. */
function begriff(e) {
  return {
    w: { de: e[0], ru: e[1], en: e[2] },
    b: { de: e[3], ru: e[4], en: e[5] },
    k: e[6],
    s: e[7],
    bild: e[8] || null,
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Text in maximal `max` Zeichen pro Zeile umbrechen (max. 3 Zeilen). */
function wrap(s, max) {
  const woerter = String(s).split(/\s+/).filter(Boolean);
  const zeilen = [];
  let zeile = '';
  for (const w of woerter) {
    const test = zeile ? zeile + ' ' + w : w;
    if (test.length > max && zeile) { zeilen.push(zeile); zeile = w; }
    else zeile = test;
  }
  if (zeile) zeilen.push(zeile);
  if (!zeilen.length) zeilen.push('');
  return zeilen.slice(0, 3);
}

/** Mehrzeiligen Text senkrecht um y zentrieren. */
function textZeilen(x, y, zeilen, font, fill = '#222', anchor = 'middle') {
  const dy = font * 1.2;
  const top = y - ((zeilen.length - 1) * dy) / 2;
  return zeilen.map((z, i) =>
    `<text x="${x}" y="${(top + i * dy + font * 0.35).toFixed(1)}" text-anchor="${anchor}" font-size="${font}" fill="${fill}">${esc(z)}</text>`
  ).join('');
}

// ─── Layout ──────────────────────────────────────────────────────────
const VIEW_W = 760;
const PAD_TOP = 56;
const ROW_H = 84;
const BOX_H = 60;
const WORD_X = 44, WORD_W = 280;      // linke Spalte (Wörter)
const BED_X = 440, BED_W = 280;       // rechte Spalte (Bedeutungen)
const ANKER_L = WORD_X + WORD_W;      // Linie startet rechts am Wort
const ANKER_R = BED_X;                // Linie endet links an der Bedeutung

const TEXT = {
  ueberschriftWort: { de: 'Wort', ru: 'Слово', en: 'Word' },
  ueberschriftBedeutung: { de: 'Bedeutung', ru: 'Значение', en: 'Meaning' },
  falsch: { de: 'Das passt nicht – probier es noch einmal.', ru: 'Не подходит — попробуй ещё раз.', en: "That doesn't match – try again." },
  vergeben: { de: 'Diese Bedeutung ist schon vergeben.', ru: 'Это значение уже занято.', en: 'That meaning is already taken.' },
};

function zeilenY(i) { return PAD_TOP + i * ROW_H + BOX_H / 2; }

const app = new MiniApp({
  id: 'begriffe-verbinden',
  icon: '🔗',
  titel: { de: 'Wort & Bedeutung', ru: 'Слово и значение', en: 'Word & meaning' },
  anweisung: {
    de: 'Ziehe von jedem Wort eine Linie zur passenden Bedeutung. Oder tippe erst das Wort, dann die Bedeutung an.',
    ru: 'Проведи линию от каждого слова к подходящему значению. Или коснись сначала слова, потом значения.',
    en: 'Draw a line from each word to its matching meaning. Or tap the word first, then the meaning.'
  },
  hilfe: {
    de: 'Links stehen die Wörter (1, 2, 3 …), rechts die Erklärungen in gemischter Reihenfolge. Ziehe die Linie oder tippe Wort → Bedeutung. Richtige Paare werden grün verbunden, falsche zeigen eine kurze rote Linie. Die Stufe reicht von gegenständlichen (1) bis zu bildhaften Wörtern (5). Fehlt ein Bild, zeigt ein Rechteck das Wort als Platzhalter.',
    ru: 'Слева слова (1, 2, 3 …), справа объяснения в перемешанном порядке. Проведи линию или коснись «слово → значение». Правильные пары соединяются зелёной линией, неправильные показывают короткую красную линию. Уровень — от наглядных (1) до образных слов (5). Если картинки нет, прямоугольник показывает слово как заготовку.',
    en: 'Words are on the left (1, 2, 3 …), explanations on the right in mixed order. Drag the line or tap word → meaning. Correct pairs are connected in green, wrong ones show a short red line. The level goes from concrete (1) to figurative words (5). If an image is missing, a rectangle shows the word as a placeholder.'
  },
  settingsSchema: {
    stufe: {
      def: 2, min: 1, max: 5, step: 1,
      label: { de: 'Stufe', ru: 'Уровень', en: 'Level' },
      hint: { de: '1 = gegenständlich, 5 = bildhaft/abstrakt.', ru: '1 = наглядные, 5 = образные/абстрактные.', en: '1 = concrete, 5 = figurative/abstract.' }
    },
    paare: {
      def: 6, min: 3, max: 8, step: 1,
      label: { de: 'Paare', ru: 'Пары', en: 'Pairs' },
      hint: { de: 'Wie viele Wortpaare pro Runde.', ru: 'Сколько пар слов за раунд.', en: 'How many word pairs per round.' }
    }
  },
  auswertung: 'punkte',

  onSettingsChange(app) { app.reset(); },

  init(state, app) {
    const stufe = app.get('stufe');
    const anzahl = app.get('paare');
    const woerter = shuffle(BEGRIFFE.filter(e => e[7] <= stufe).map(begriff)).slice(0, anzahl);
    const bedeutungen = shuffle(woerter.map((w, idx) => ({ wortIdx: idx, b: w.b, geloest: false })));

    state.stufe = stufe;
    state.woerter = woerter;
    state.bedeutungen = bedeutungen;
    state.geloest = woerter.map(() => false);
    state.paare = [];
    state.richtig = 0;
    state.versuche = 0;
    state.fehler = 0;
    state.gewaehlt = null;      // per Tippen gewähltes Wort
    state._linie = null;        // laufende Zieh-Linie { wortIdx, x, y }
    state.fehlerLinie = null;   // kurze rote Fehler-Linie { wi, bi }
    state.hinweis = null;
    state.fertig = false;
    if (state._fehlerTimer) clearTimeout(state._fehlerTimer);
  },

  dispose(state) {
    if (state._fehlerTimer) clearTimeout(state._fehlerTimer);
  },

  render(state, app) {
    const s = state;
    const N = s.woerter.length;
    const viewH = PAD_TOP + N * ROW_H + 16;

    // Verbindungslinien (hinter den Kästchen)
    const linien = [];
    for (const p of s.paare) {
      linien.push(`<line x1="${ANKER_L}" y1="${zeilenY(p.wi)}" x2="${ANKER_R}" y2="${zeilenY(p.bi)}" stroke="#2a8a2a" stroke-width="4" stroke-linecap="round"/>`);
    }
    if (s.fehlerLinie) {
      linien.push(`<line x1="${ANKER_L}" y1="${zeilenY(s.fehlerLinie.wi)}" x2="${ANKER_R}" y2="${zeilenY(s.fehlerLinie.bi)}" stroke="#d33" stroke-width="3" stroke-dasharray="8 6" stroke-linecap="round"/>`);
    }
    if (s._linie && !s.geloest[s._linie.wortIdx]) {
      linien.push(`<line x1="${ANKER_L}" y1="${zeilenY(s._linie.wortIdx)}" x2="${s._linie.x.toFixed(1)}" y2="${s._linie.y.toFixed(1)}" stroke="#5b4fcf" stroke-width="3" stroke-dasharray="5 5" stroke-linecap="round"/>`);
    }

    // Kästchen
    const kaestchen = [];
    for (let i = 0; i < N; i++) {
      const y = PAD_TOP + i * ROW_H;
      const geloest = s.geloest[i];
      const gewaehlt = s.gewaehlt === i;
      const wFill = geloest ? '#e6f5e6' : '#ffffff';
      const wStroke = geloest ? '#2a8a2a' : (gewaehlt ? '#5b4fcf' : '#a9a4d8');
      const wSw = geloest ? 2 : (gewaehlt ? 3 : 1);
      kaestchen.push(`<rect x="${WORD_X}" y="${y}" width="${WORD_W}" height="${BOX_H}" rx="10" fill="${wFill}" stroke="${wStroke}" stroke-width="${wSw}"/>`);

      const m = s.bedeutungen[i];
      const mFill = m.geloest ? '#e6f5e6' : '#f4f3ff';
      const mStroke = m.geloest ? '#2a8a2a' : '#a9a4d8';
      kaestchen.push(`<rect x="${BED_X}" y="${y}" width="${BED_W}" height="${BOX_H}" rx="10" fill="${mFill}" stroke="${mStroke}" stroke-width="${m.geloest ? 2 : 1}"/>`);
    }

    // Nummern der Spalten
    const zahlen = [];
    for (let i = 0; i < N; i++) {
      const cy = zeilenY(i);
      zahlen.push(`<circle cx="24" cy="${cy}" r="13" fill="#5b4fcf"/><text x="24" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="#fff">${i + 1}</text>`);
      zahlen.push(`<circle cx="736" cy="${cy}" r="13" fill="#9b96d4"/><text x="736" y="${cy + 5}" text-anchor="middle" font-size="14" font-weight="bold" fill="#fff">${i + 1}</text>`);
    }

    // Texte
    const texte = [];
    for (let i = 0; i < N; i++) {
      const cy = zeilenY(i);
      const w = s.woerter[i];
      const wZeilen = wrap(L(w.w), 20);
      const wFont = wZeilen.length > 1 ? 14 : 16;
      if (w.bild) {
        texte.push(`<image href="${esc(w.bild)}" x="${WORD_X + 10}" y="${cy - 20}" width="40" height="40" preserveAspectRatio="xMidYMid meet"/>`);
        texte.push(textZeilen(WORD_X + 60 + (WORD_W - 70) / 2, cy, wZeilen, wFont));
      } else {
        texte.push(textZeilen(WORD_X + WORD_W / 2, cy, wZeilen, wFont));
      }

      const m = s.bedeutungen[i];
      texte.push(textZeilen(BED_X + BED_W / 2, cy, wrap(L(m.b), 36), 13, '#333'));
    }

    return `<svg viewBox="0 0 ${VIEW_W} ${viewH}" xmlns="http://www.w3.org/2000/svg">
      <text x="${WORD_X}" y="28" font-size="14" font-weight="bold" fill="#5b4fcf">${esc(L(TEXT.ueberschriftWort))}</text>
      <text x="${BED_X + BED_W}" y="28" text-anchor="end" font-size="14" font-weight="bold" fill="#5b4fcf">${esc(L(TEXT.ueberschriftBedeutung))}</text>
      ${linien.join('')}${kaestchen.join('')}${zahlen.join('')}${texte.join('')}
    </svg>`;
  },

  _wortBei(x, y) {
    const s = app.state;
    for (let i = 0; i < s.woerter.length; i++) {
      if (s.geloest[i]) continue;
      if (x >= WORD_X && x <= WORD_X + WORD_W && y >= PAD_TOP + i * ROW_H && y <= PAD_TOP + i * ROW_H + BOX_H) return i;
    }
    return null;
  },

  _bedeutungBei(x, y) {
    const s = app.state;
    for (let i = 0; i < s.bedeutungen.length; i++) {
      if (s.bedeutungen[i].geloest) continue;
      if (x >= BED_X && x <= BED_X + BED_W && y >= PAD_TOP + i * ROW_H && y <= PAD_TOP + i * ROW_H + BOX_H) return i;
    }
    return null;
  },

  _versuch(app, wi, bi) {
    const s = app.state;
    if (s.fertig || s.geloest[wi]) return;
    const m = s.bedeutungen[bi];
    if (m.geloest) { s.hinweis = TEXT.vergeben; return; }
    s.versuche++;
    if (m.wortIdx === wi) {
      s.geloest[wi] = true;
      m.geloest = true;
      s.paare.push({ wi, bi });
      s.richtig++;
      s.hinweis = null;
      s.fehlerLinie = null;
      if (s.richtig === s.woerter.length) s.fertig = true;
    } else {
      s.fehler++;
      s.fehlerLinie = { wi, bi };
      s.hinweis = TEXT.falsch;
      clearTimeout(s._fehlerTimer);
      s._fehlerTimer = setTimeout(() => { s.fehlerLinie = null; app.rerender(); }, 900);
    }
  },

  // Tippen: erst Wort wählen, dann Bedeutung.
  onTap(state, x, y, app) {
    const wi = this._wortBei(x, y);
    const bi = this._bedeutungBei(x, y);
    if (wi != null) { state.gewaehlt = wi; app.rerender(); return; }
    if (bi != null && state.gewaehlt != null) {
      this._versuch(app, state.gewaehlt, bi);
      state.gewaehlt = null;
      app.rerender();
      return;
    }
    state.gewaehlt = null;
    app.rerender();
  },

  // Ziehen: Linie folgt dem Zeiger.
  onDrag(state, x0, y0, x, y, app) {
    const wi = state._linie?.wortIdx ?? this._wortBei(x0, y0);
    if (wi == null) return;
    state._linie = { wortIdx: wi, x, y };
    app.rerender();
  },

  onDrop(state, x0, y0, x1, y1, app) {
    const wi = state._linie?.wortIdx ?? this._wortBei(x0, y0);
    const bi = this._bedeutungBei(x1, y1);
    state._linie = null;
    if (wi == null || bi == null) { app.rerender(); return; }
    this._versuch(app, wi, bi);
    app.rerender();
  },

  actions: {
    // Programmatisch/Test: Wort wi mit Bedeutung bi verbinden.
    verbinde(state, wi, bi, app) {
      this._versuch(app, wi, bi);
    },
    neu(state, ...args) {
      const app = args[args.length - 1];
      app.init(state, app);
      app.rerender();
    }
  },

  evaluate(state, app) {
    if (state.fertig) {
      const sek = app.elapsedSek();
      return {
        fertig: true,
        text: { de: 'Geschafft!', ru: 'Молодец!', en: 'Well done!' },
        wert: `${state.richtig}/${state.woerter.length} · ${sek} s · ❌ ${state.fehler}`
      };
    }
    return null;
  },

  // Live-Status: Fortschritt + Rückmeldung.
  statusHtml(state, app) {
    const hinweis = state.hinweis ? `<div class="ma-hinweis" style="color:#b32;font-size:.9rem;margin-top:.3rem">${esc(L(state.hinweis))}</div>` : '';
    return `<div class="ma-result">✅ ${state.richtig}/${state.woerter.length} · 🔁 ${state.versuche}${hinweis}</div>`;
  }
});

export default app;

export function mount(root) { app.mount(root); }
