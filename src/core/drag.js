/**
 * Aufnehmen – bewegen – ablegen.
 *
 * Genutzt von Bildergeschichte, Dreiecke legen und Tangram. Rover plant den
 * Weg per Antippen, ohne Ziehen. Das Greifen gehört einmal hierher und nicht
 * in jedes Modul.
 *
 * Zwei Wege zum selben Ziel
 * ─────────────────────────
 * ANTIPPEN: erst das Stück, dann den Platz. Das ist der verlässliche Weg –
 * er funktioniert mit Maus, Finger und Tastatur, er verträgt zittrige Hände,
 * und er geht nicht kaputt, wenn zwischendurch neu gezeichnet wird. Für ein
 * Kind mit motorischen Schwierigkeiten ist er oft der einzig gangbare.
 *
 * ZIEHEN: Stück gedrückt halten und hinüberschieben. Das ist die Zugabe für
 * alle, denen Antippen zu umständlich ist. Es endet in genau derselben
 * Handlung, deshalb gibt es keine zweite Logik, die auseinanderlaufen könnte.
 *
 * Warum das Aufheben hier liegt und nicht im Modul
 * ───────────────────────────────────────────────
 * „Was habe ich gerade in der Hand" ist ein Zustand der Bedienung, nicht des
 * Spiels. Läge er im Modul, müsste ihn jedes Modul einzeln führen, und der
 * Spielstand enthielte plötzlich Angaben darüber, wo ein Finger war. Das
 * Modul erfährt nur das Ergebnis: dieses Stück soll dorthin.
 *
 * Warum während des Ziehens nicht neu gezeichnet wird
 * ──────────────────────────────────────────────────
 * Aus demselben Grund, aus dem Countdowns den Spielbereich nicht neu bauen
 * dürfen: ein ausgetauschtes Element verliert die Zeigerverfolgung, und die
 * Bewegung reißt ab. Das Schattenbild hängt deshalb am Dokument, nicht im
 * Spielbereich, und angefasst wird der Spielbereich erst beim Ablegen.
 */
import { engine } from './engine.js';

/** Was gerade in der Hand ist – Kennung des aufgenommenen Stücks. */
let aufgenommen = null;

/** Schattenbild, das dem Zeiger folgt. */
let schatten = null;
let zieht = false;
let startX = 0, startY = 0;

/** Ab dieser Strecke ist es ein Ziehen und kein Antippen mehr. */
const SCHWELLE_PX = 8;

/** Kennung des Stücks, das gerade aufgenommen ist – für die Anzeige. */
export function inDerHand() {
  return aufgenommen;
}

/** Alles fallen lassen, ohne etwas zu bewegen. */
export function zuruecklegen(neuZeichnen = true) {
  const gab = aufgenommen !== null;
  aufgenommen = null;
  schattenWeg();
  if (gab && neuZeichnen) engine.renderGame();
  return gab;
}

function schattenWeg() {
  if (schatten && schatten.parentNode) schatten.parentNode.removeChild(schatten);
  schatten = null;
  zieht = false;
}

function stueckVon(el) {
  const t = el && el.closest && el.closest('[data-zieh]');
  return t ? t.getAttribute('data-zieh') : null;
}

function ablageVon(el) {
  const t = el && el.closest && el.closest('[data-ablage]');
  return t ? t.getAttribute('data-ablage') : null;
}

/**
 * Der eigentliche Zug: das Modul bekommt, was passieren soll.
 *
 * Es erfährt nur Ausgangs- und Zielkennung. Ob dorthin geschoben, getauscht
 * oder abgelehnt wird, entscheidet das Modul – nur dort ist bekannt, was die
 * Aufgabe erlaubt.
 */
function ausfuehren(ziel) {
  const stueck = aufgenommen;
  aufgenommen = null;
  schattenWeg();
  if (stueck === null) return;
  engine.dispatch('verschiebe', stueck, ziel);
}

// ─── Antippen ─────────────────────────────────────────────────────────

function beiKlick(ev) {
  // Nach einem Ziehen kommt noch ein Klick hinterher – der ist schon erledigt.
  if (ev.defaultPrevented) return;

  const ziel = ablageVon(ev.target);
  const stueck = stueckVon(ev.target);

  if (aufgenommen !== null) {
    // Dasselbe Stück noch einmal: zurücklegen statt bewegen.
    if (stueck !== null && stueck === aufgenommen) { zuruecklegen(); return; }
    if (ziel !== null) { ausfuehren(ziel); return; }
    // Daneben getippt: liegen lassen, nicht heimlich fallen lassen. Sonst
    // verliert man das Stück durch eine unbedachte Berührung.
    return;
  }

  if (stueck !== null) {
    aufgenommen = stueck;
    engine.renderGame();
  }
}

// ─── Ziehen ───────────────────────────────────────────────────────────

function beiZeigerAb(ev) {
  const stueck = stueckVon(ev.target);
  if (stueck === null) return;
  aufgenommen = stueck;
  startX = ev.clientX; startY = ev.clientY;
  zieht = false;
  // Noch nicht neu zeichnen: erst muss sich zeigen, ob gezogen oder getippt
  // wird. Ein Neuaufbau hier nähme dem Zeiger das Element unter der Hand weg.
}

function beiZeigerBewegt(ev) {
  if (aufgenommen === null) return;
  const weit = Math.hypot(ev.clientX - startX, ev.clientY - startY);
  if (!zieht && weit < SCHWELLE_PX) return;

  if (!zieht) {
    zieht = true;
    const quelle = document.querySelector(`[data-zieh="${CSS.escape(aufgenommen)}"]`);
    if (quelle) {
      schatten = quelle.cloneNode(true);
      schatten.removeAttribute('data-zieh');
      // Eigene Kennzeichnung: „irgendein fest sitzendes Element" ist zu
      // unscharf – die Speichermeldung sitzt ebenfalls fest im Dokument.
      schatten.setAttribute('data-schatten', '1');
      schatten.style.position = 'fixed';
      schatten.style.pointerEvents = 'none';
      schatten.style.zIndex = '9999';
      schatten.style.opacity = '.85';
      schatten.style.transform = 'scale(1.1)';
      schatten.style.margin = '0';
      document.body.appendChild(schatten);
      quelle.style.opacity = '.35';
    }
  }
  if (schatten) {
    const b = schatten.getBoundingClientRect();
    schatten.style.left = (ev.clientX - (b.width || 40) / 2) + 'px';
    schatten.style.top = (ev.clientY - (b.height || 40) / 2) + 'px';
  }
}

function beiZeigerAuf(ev) {
  if (aufgenommen === null) return;

  if (!zieht) {
    // Es war ein Antippen – der Klick kommt gleich und übernimmt. Damit
    // beiKlick nicht sofort wieder aufnimmt, bleibt der Zustand stehen.
    return;
  }

  // Was liegt unter dem Zeiger? Das Schattenbild nimmt keine Ereignisse an,
  // stört also nicht.
  let ziel = null;
  if (typeof document.elementFromPoint === 'function') {
    const unten = document.elementFromPoint(ev.clientX, ev.clientY);
    ziel = ablageVon(unten);
  }
  // Ein Klick folgt auf das Loslassen; er darf nicht noch einmal greifen.
  ev.preventDefault();

  if (ziel !== null) ausfuehren(ziel);
  else zuruecklegen();
}

// ─── Anmelden ─────────────────────────────────────────────────────────

let angemeldet = false;

/**
 * Einmal beim Laden anmelden. Die Zuhörer hängen am Dokument, nicht am
 * Spielbereich – der wird bei jeder Runde ausgetauscht, und Zuhörer daran
 * wären nach dem ersten Neuzeichnen verschwunden.
 */
export function initZiehen() {
  if (angemeldet || typeof document === 'undefined') return;
  angemeldet = true;

  document.addEventListener('click', beiKlick);

  if (typeof window !== 'undefined' && 'PointerEvent' in window) {
    document.addEventListener('pointerdown', beiZeigerAb);
    document.addEventListener('pointermove', beiZeigerBewegt);
    document.addEventListener('pointerup', beiZeigerAuf);
    document.addEventListener('pointercancel', () => zuruecklegen());
  }

  // Esc legt zurück – der Weg zurück muss ohne Zielsuche gehen.
  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') zuruecklegen();
  });
}

/** Beim Verlassen eines Moduls darf nichts in der Hand bleiben. */
export function dragAufraeumen() {
  aufgenommen = null;
  schattenWeg();
}
