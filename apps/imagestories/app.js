/**
 * Bildgeschichten ordnen – Reihenfolge einer Bilderfolge erkennen.
 *
 * Grundlage sind 5×5-Blätter (apps/imagestories/img/): jede Zeile ist eine
 * Geschichte, jede Kachel ein Bild daraus. Welche Kacheln brauchbar sind und
 * in welcher Reihenfolge sie stehen, legt tools/annotieren.py fest und
 * schreibt es nach data/bildgeschichten.js.
 *
 * Beim Laden wird einmal eine zufällige Runde über ALLE Geschichten gemischt;
 * „Weiter“ geht darin zur nächsten. So kommt ohne Neuladen keine Geschichte
 * zweimal vor. Gezeigt werden genau die Kacheln der Geschichte – Auswahl und
 * Reihenfolge stehen in den Daten, die App kürzt oder sortiert nichts um.
 *
 * Unten liegen die Bilder gemischt, oben stehen leere Rahmen (Schablonen) mit
 * den Nummern 1…n. Das Kind zieht (oder tippt) die Bilder in die richtige
 * Reihenfolge; sind alle Rahmen belegt, wird geprüft. Falschversuche werden je
 * Geschichte und über die ganze Runde gezählt.
 */
import { MiniApp } from '../_framework/framework.js';
import { BILDGESCHICHTEN } from './data/bildgeschichten.js';

const VIEW_W = 600, VIEW_H = 380;
const KACHEL = 104;          // Kantenlänge einer Kachel in viewBox-Einheiten
const LUECKE = 10;           // Abstand zwischen den Kacheln
const Y_RAHMEN = 46;         // obere Reihe: Schablonen
const Y_POOL = 232;          // untere Reihe: gemischte Bilder

/** Alle Geschichten aller Blätter als flache Liste. */
function alleGeschichten() {
  const liste = [];
  for (const blatt of Object.values(BILDGESCHICHTEN.bilder || {})) {
    for (const g of blatt.geschichten || []) {
      if ((g.kacheln || []).length >= 2) {
        liste.push({ datei: blatt.datei, breite: blatt.breite, hoehe: blatt.hoehe, ...g });
      }
    }
  }
  return liste;
}

function mische(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Eine Runde = alle Geschichten in zufälliger Reihenfolge. Sie lebt außerhalb
 * des App-Zustands, damit 🔁 (Neustart) nur die aktuelle Geschichte neu legt
 * und nicht die Reihenfolge neu würfelt.
 */
let lauf = null;

function neueRunde() {
  return { folge: mische(alleGeschichten()), pos: 0, geloest: 0, fehler: 0, fertig: false };
}

/** x-Position der i-ten Kachel einer Reihe mit n Kacheln (zentriert). */
function spaltenX(i, n) {
  const breite = n * KACHEL + (n - 1) * LUECKE;
  return Math.round((VIEW_W - breite) / 2 + i * (KACHEL + LUECKE));
}

function inRechteck(x, y, rx, ry, w = KACHEL, h = KACHEL) {
  return x >= rx && x <= rx + w && y >= ry && y <= ry + h;
}

const app = new MiniApp({
  id: 'imagestories',
  icon: '🖼️',
  titel: { de: 'Bildgeschichte ordnen', ru: 'Собери историю', en: 'Sort the story' },
  anweisung: {
    de: 'Die Bilder unten gehören zu einer Geschichte, aber sie sind durcheinander. Ziehe sie in die Rahmen – von links nach rechts, so wie die Geschichte abläuft.',
    ru: 'Картинки внизу — одна история, но они перепутаны. Перетащи их в рамки слева направо, по порядку событий.',
    en: 'The pictures below belong to one story, but they are mixed up. Drag them into the frames from left to right, in the order the story happens.'
  },
  hilfe: {
    de: 'Ein Bild mit Maus oder Finger in einen Rahmen ziehen – oder einfach antippen, dann rutscht es in den nächsten freien Rahmen. Ein Bild im Rahmen antippen legt es zurück nach unten; zwei Rahmen kannst du durch Ziehen tauschen. Sind alle Rahmen voll, wird geprüft: falsch gelegte Bilder bekommen einen roten Rand. Stimmt alles, geht es mit „Weiter“ zur nächsten Geschichte – jede kommt nur einmal vor. Mit 🔁 legst du die aktuelle Geschichte noch einmal.',
    ru: 'Перетащи картинку в рамку — или просто коснись её, тогда она встанет в следующую свободную рамку. Коснись картинки в рамке, чтобы вернуть её вниз; рамки можно менять местами перетаскиванием. Когда все рамки заполнены, идёт проверка: неверные получают красную рамку. Если всё верно, кнопка «Дальше» ведёт к следующей истории — каждая встречается один раз. 🔁 — сложить ту же историю заново.',
    en: 'Drag a picture into a frame – or just tap it and it moves into the next free frame. Tap a picture in a frame to send it back down; drag one frame onto another to swap them. When every frame is full it is checked: wrongly placed pictures get a red border. If it is right, “Next” moves on to the following story – each one appears only once. 🔁 restarts the current story.'
  },
  settingsSchema: {},
  auswertung: 'punkte',
  keinErfolgText: true,

  init(state) {
    if (!lauf || lauf.fertig) lauf = neueRunde();   // 🔁 nach Rundenende: neue Runde
    const g = lauf.folge[lauf.pos] || null;

    // Welche Kacheln zur Geschichte gehören und in welcher Reihenfolge, steht
    // vollständig in data/bildgeschichten.js – hier wird nichts ausgewählt.
    const kacheln = g ? [...g.kacheln].sort((a, b) => a.nr - b.nr) : [];

    state.datei = g ? g.datei : '';
    state.bildBreite = g ? g.breite : 800;
    state.bildHoehe = g ? g.hoehe : 800;
    state.kacheln = kacheln;
    state.n = kacheln.length;
    state.slots = new Array(state.n).fill(null);
    state.pool = mische(kacheln.map((_, i) => i));
    state.falsch = new Array(state.n).fill(false);
    state.fehler = 0;
    state.fertig = false;
    state.rundeFertig = false;
    state.nummer = lauf.pos + 1;
    state.gesamt = lauf.folge.length;
    state._drag = null;
  },

  render(state, app) {
    if (state.rundeFertig) {
      return `<svg viewBox="0 0 ${VIEW_W} 160"><text x="${VIEW_W / 2}" y="70"
        text-anchor="middle" font-size="46">🎉</text><text x="${VIEW_W / 2}" y="115"
        text-anchor="middle" font-size="18" fill="#5b4fcf">${pickText({
          de: 'Alle Geschichten geschafft!',
          ru: 'Все истории собраны!',
          en: 'All stories done!' })}</text></svg>`;
    }
    if (!state.n) {
      return `<svg viewBox="0 0 ${VIEW_W} 120"><text x="${VIEW_W / 2}" y="60"
        text-anchor="middle" font-size="16" fill="#777">Keine Bildgeschichten in data/bildgeschichten.js</text></svg>`;
    }
    const teile = [];
    const defs = [];

    /** Eine Kachel als Bildausschnitt zeichnen. */
    const kachelBild = (ki, px, py, id, opacity = 1) => {
      const k = state.kacheln[ki];
      const sx = KACHEL / k.w, sy = KACHEL / k.h;
      defs.push(`<clipPath id="${id}"><rect x="${px}" y="${py}" width="${KACHEL}" height="${KACHEL}" rx="8"/></clipPath>`);
      return `<g clip-path="url(#${id})" opacity="${opacity}">
        <image href="${state.datei}" x="${px - k.x * sx}" y="${py - k.y * sy}"
          width="${state.bildBreite * sx}" height="${state.bildHoehe * sy}" preserveAspectRatio="none"/></g>
      <rect x="${px}" y="${py}" width="${KACHEL}" height="${KACHEL}" rx="8"
        fill="none" stroke="#3a3560" stroke-width="2"/>`;
    };

    // Obere Reihe: Rahmen mit Nummer, ggf. gefüllt
    for (let i = 0; i < state.n; i++) {
      const px = spaltenX(i, state.n);
      teile.push(`<text x="${px + KACHEL / 2}" y="${Y_RAHMEN - 12}" text-anchor="middle"
        font-size="18" font-weight="bold" fill="#5b4fcf">${i + 1}</text>`);
      const ki = state.slots[i];
      const zieht = state._drag && state._drag.typ === 'slot' && state._drag.i === i;
      if (ki === null || zieht) {
        teile.push(`<rect x="${px}" y="${Y_RAHMEN}" width="${KACHEL}" height="${KACHEL}" rx="8"
          fill="#fff" stroke="#a9a4d8" stroke-width="2" stroke-dasharray="6 5"/>`);
      } else {
        teile.push(kachelBild(ki, px, Y_RAHMEN, `${app.id}-s${i}`));
        if (state.falsch[i]) {
          teile.push(`<rect x="${px - 3}" y="${Y_RAHMEN - 3}" width="${KACHEL + 6}" height="${KACHEL + 6}"
            rx="10" fill="none" stroke="#e04040" stroke-width="3"/>`);
        }
      }
    }

    // Trennlinie zwischen Schablonen und Vorrat
    const yLinie = (Y_RAHMEN + KACHEL + Y_POOL) / 2;
    teile.push(`<line x1="30" y1="${yLinie}" x2="${VIEW_W - 30}" y2="${yLinie}"
      stroke="#e2e0f0" stroke-width="2"/>`);

    // Untere Reihe: gemischter Vorrat
    for (let i = 0; i < state.n; i++) {
      const px = spaltenX(i, state.n);
      const ki = state.pool[i];
      const zieht = state._drag && state._drag.typ === 'pool' && state._drag.i === i;
      if (ki === null || zieht) {
        teile.push(`<rect x="${px}" y="${Y_POOL}" width="${KACHEL}" height="${KACHEL}" rx="8"
          fill="#f2f1fa" stroke="#e2e0f0" stroke-width="2"/>`);
      } else {
        teile.push(kachelBild(ki, px, Y_POOL, `${app.id}-p${i}`));
      }
    }

    // Gezogenes Bild folgt dem Zeiger (zuletzt gezeichnet = obenauf)
    if (state._drag && state._drag.ki !== null) {
      teile.push(kachelBild(state._drag.ki, state._drag.x - KACHEL / 2,
        state._drag.y - KACHEL / 2, `${app.id}-drag`, 0.92));
    }

    return `<svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" xmlns="http://www.w3.org/2000/svg">
      <defs>${defs.join('')}</defs>${teile.join('')}</svg>`;
  },

  // ─── Hilfsfunktionen für Treffer und Umlagern ────────────────────────
  _ortBei(state, x, y) {
    for (let i = 0; i < state.n; i++) {
      if (inRechteck(x, y, spaltenX(i, state.n), Y_RAHMEN)) return { typ: 'slot', i };
      if (inRechteck(x, y, spaltenX(i, state.n), Y_POOL)) return { typ: 'pool', i };
    }
    return null;
  },

  _lies(state, ort) { return ort.typ === 'slot' ? state.slots[ort.i] : state.pool[ort.i]; },
  _setze(state, ort, ki) {
    if (ort.typ === 'slot') state.slots[ort.i] = ki; else state.pool[ort.i] = ki;
  },

  /** Zwei Plätze tauschen (ein leerer Platz ist erlaubt). */
  _tausche(state, a, b) {
    const va = this._lies(state, a), vb = this._lies(state, b);
    this._setze(state, a, vb);
    this._setze(state, b, va);
    state.falsch = new Array(state.n).fill(false);
    this._pruefe(state);
  },

  _ersterFreier(state, typ) {
    const reihe = typ === 'slot' ? state.slots : state.pool;
    const i = reihe.indexOf(null);
    return i < 0 ? null : { typ, i };
  },

  /** Sind alle Rahmen belegt, Reihenfolge prüfen. */
  _pruefe(state) {
    if (state.slots.some(v => v === null)) return;
    const falsch = state.slots.map((ki, i) => ki !== i);
    if (falsch.some(Boolean)) {
      state.falsch = falsch;
      state.fehler++;
      lauf.fehler++;
    } else {
      state.falsch = new Array(state.n).fill(false);
      state.fertig = true;
      lauf.geloest++;
    }
  },

  // ─── Bedienung ───────────────────────────────────────────────────────
  onTap(state, x, y, app) {
    if (state.fertig) return;
    const ort = this._ortBei(state, x, y);
    if (!ort) return;
    const ki = this._lies(state, ort);
    if (ki === null) return;
    const ziel = this._ersterFreier(state, ort.typ === 'pool' ? 'slot' : 'pool');
    if (ziel) this._tausche(state, ort, ziel);
    app.rerender();
  },

  onDrag(state, x0, y0, x, y, app) {
    if (state.fertig) return;
    if (!state._drag) {
      const ort = this._ortBei(state, x0, y0);
      const ki = ort ? this._lies(state, ort) : null;
      if (ki === null) return;
      state._drag = { ...ort, ki };
    }
    state._drag.x = x;
    state._drag.y = y;
    app.rerender();
  },

  onDrop(state, x0, y0, x1, y1, app) {
    const von = state._drag;
    state._drag = null;
    if (!von) { app.rerender(); return; }
    const ziel = this._ortBei(state, x1, y1)
      || this._ersterFreier(state, von.typ === 'pool' ? 'slot' : 'pool');
    if (ziel && !(ziel.typ === von.typ && ziel.i === von.i)) this._tausche(state, von, ziel);
    app.rerender();
  },

  evaluate(state, app) {
    if (state.rundeFertig) {
      return {
        fertig: true,
        wert: `${lauf.geloest}/${lauf.folge.length} · ❌ ${lauf.fehler}
          <div style="margin-top:.6rem"><button class="ma-btn" onclick="window.__bgNeueRunde()">🔁 ${
            pickText({ de: 'Neue Runde', ru: 'Новый круг', en: 'New round' })}</button></div>`,
      };
    }
    if (state.fertig) {
      const letzte = lauf.pos + 1 >= lauf.folge.length;
      return {
        fertig: true,
        wert: `${app ? app.elapsedSek() : 0} s · ❌ ${state.fehler}
          <div style="margin-top:.6rem"><button class="ma-btn" onclick="window.__bgWeiter()">${
            letzte ? '🏁 ' + pickText({ de: 'Abschluss', ru: 'Итог', en: 'Finish' })
                   : '➡️ ' + pickText({ de: 'Weiter', ru: 'Дальше', en: 'Next' })}</button></div>`,
      };
    }
    return null;
  },

  statusHtml(state, app) {
    const gelegt = state.slots.filter(v => v !== null).length;
    return `<div class="ma-result">📖 ${state.nummer}/${state.gesamt} · 🖼️ ${gelegt}/${state.n}
      · ❌ ${state.fehler} (${lauf ? lauf.fehler : 0}) · ⏱ ${app.elapsedSek()} s</div>`;
  },
});

/** Kurzform für mehrsprachige Texte (das Framework hält pick() intern). */
function pickText(obj) {
  const l = (typeof localStorage !== 'undefined' && localStorage.getItem('miniapp-lang')) || 'de';
  return obj[l] || obj.de;
}

// Knöpfe der Ergebniszeile (das Framework rendert sie als HTML).
if (typeof window !== 'undefined') {
  window.__bgWeiter = () => {
    lauf.pos++;
    if (lauf.pos >= lauf.folge.length) {
      lauf.fertig = true;
      app.state.rundeFertig = true;
      app.rerender();
    } else {
      app.reset();
    }
  };
  window.__bgNeueRunde = () => { lauf = null; app.reset(); };
}

export default app;
export function mount(root) { app.mount(root); }
