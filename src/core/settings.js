/**
 * Zentrale Einstellungen.
 *
 * Alles, was den Ablauf steuert, steht hier an einer Stelle statt als Konstante
 * in jedem Modul. Vorher lagen Tempo, Pause und Rückmeldedauer verstreut in
 * adaptive.js, choice.js und einzelnen Spielen – eine Änderung musste man an
 * mehreren Orten nachziehen und übersah leicht eine.
 *
 * Gespeichert wird in localStorage, damit die Werte einen Neustart überleben,
 * ohne dass die IndexedDB dafür geöffnet werden muss. Ein Zurücksetzen der
 * Ergebnisse lässt sie ausdrücklich stehen: Einstellungen sind keine Ergebnisse.
 */

const KEY = 'logik-settings';

/**
 * Voreinstellungen. Jeder Eintrag beschreibt sich selbst, damit die
 * Einstellungsseite ohne zweite Tabelle auskommt.
 *
 *   min/max/step  Grenzen des Reglers
 *   unit          Einheit für die Anzeige
 *   group         Abschnitt auf der Seite
 */
export const SCHEMA = {
  rounds: {
    def: 10, min: 3, max: 40, step: 1, unit: '', group: 'umfang',
    de: 'Übungen je Durchgang', ru: 'Заданий за подход',
    hintDe: 'Danach kommt das Ergebnis und es geht zurück zur Gruppe. Ein absehbares Ende hilft dem Kind – und macht Werte vergleichbar.',
    hintRu: 'После этого показывается результат и возврат к группе. Понятный конец помогает ребёнку и делает результаты сопоставимыми.'
  },
  tempo: {
    def: 2, min: 0.5, max: 5, step: 0.5, unit: 's', group: 'merken',
    de: 'Anzeigedauer je Element', ru: 'Время показа одного элемента',
    hintDe: 'Wie lange ein Element gezeigt oder gesprochen wird. Die Merkzeit ist Anzahl × dieser Wert.',
    hintRu: 'Как долго показывается или произносится элемент. Время запоминания = количество × это значение.'
  },
  answerFactor: {
    def: 2, min: 1, max: 5, step: 0.5, unit: '×', group: 'merken',
    de: 'Antwortzeit (Vielfaches der Merkzeit)', ru: 'Время ответа (кратно времени показа)',
    hintDe: 'Bei 2 hat das Kind doppelt so lange Zeit zum Antworten wie zum Merken.',
    hintRu: 'При 2 на ответ даётся вдвое больше времени, чем на запоминание.'
  },
  pause: {
    def: 1, min: 0, max: 5, step: 0.5, unit: 's', group: 'merken',
    de: 'Pause vor der Antwort', ru: 'Пауза перед ответом',
    hintDe: 'Ruhe zwischen Zeigen und Antworten.',
    hintRu: 'Тишина между показом и ответом.'
  },
  choiceAnswer: {
    def: 30, min: 5, max: 120, step: 5, unit: 's', group: 'auswahl',
    de: 'Antwortzeit bei Auswahlaufgaben', ru: 'Время ответа в заданиях с выбором',
    hintDe: 'Nach dieser Zeit gilt die Aufgabe als nicht gelöst. Großzügig wählen – Nachdenken soll nicht bestraft werden.',
    hintRu: 'По истечении задание считается нерешённым. Выбирайте с запасом — думать не должно быть наказуемо.'
  },
  studyFactor: {
    def: 1, min: 0.5, max: 3, step: 0.5, unit: '×', group: 'auswahl',
    de: 'Lernzeit bei Merkaufgaben', ru: 'Время заучивания',
    hintDe: 'Streckt oder kürzt die Zeit, in der Paare zum Einprägen gezeigt werden.',
    hintRu: 'Растягивает или сокращает время показа пар для запоминания.'
  },
  feedbackOk: {
    def: 1.2, min: 0.5, max: 5, step: 0.1, unit: 's', group: 'rueckmeldung',
    de: 'Rückmeldung bei richtig', ru: 'Обратная связь при верном ответе',
    hintDe: 'Wie lange ✅ stehen bleibt, bevor es weitergeht.',
    hintRu: 'Как долго держится ✅ до продолжения.'
  },
  feedbackWrong: {
    def: 2.5, min: 0.5, max: 8, step: 0.5, unit: 's', group: 'rueckmeldung',
    de: 'Rückmeldung bei falsch', ru: 'Обратная связь при ошибке',
    hintDe: 'Länger als bei richtig – hier wird die Lösung gezeigt und die will gelesen werden.',
    hintRu: 'Дольше, чем при верном ответе — здесь показывается решение.'
  },
  sound: {
    def: 1, min: 0, max: 1, step: 1, unit: '', group: 'ton', bool: true,
    de: 'Ton', ru: 'Звук',
    hintDe: 'Aus geschaltet bleiben die Tests mit Ansage stumm und melden das auch.',
    hintRu: 'При выключении задания с озвучкой молчат и сообщают об этом.'
  }
};

export const GROUPS = {
  umfang:       { icon: '🎯', de: 'Umfang', ru: 'Объём' },
  merken:       { icon: '🧠', de: 'Merkspannen-Tests', ru: 'Тесты на запоминание' },
  auswahl:      { icon: '👆', de: 'Auswahlaufgaben', ru: 'Задания с выбором' },
  rueckmeldung: { icon: '💬', de: 'Rückmeldung', ru: 'Обратная связь' },
  ton:          { icon: '🔊', de: 'Ton', ru: 'Звук' }
};

let werte = laden();

function laden() {
  try {
    const roh = JSON.parse(localStorage.getItem(KEY)) || {};
    const out = {};
    for (const [k, s] of Object.entries(SCHEMA)) {
      const v = Number(roh[k]);
      out[k] = Number.isFinite(v) ? klemmen(k, v) : s.def;
    }
    return out;
  } catch (e) {
    return Object.fromEntries(Object.entries(SCHEMA).map(([k, s]) => [k, s.def]));
  }
}

function klemmen(k, v) {
  const s = SCHEMA[k];
  return Math.min(s.max, Math.max(s.min, v));
}

/** Einen Wert lesen. Unbekannte Schlüssel liefern undefined statt zu werfen. */
export function get(k) {
  return werte[k];
}

/** Alle Werte als Kopie. */
export function all() {
  return { ...werte };
}

/** Einen Wert setzen und sichern. Gibt den tatsächlich gespeicherten Wert zurück. */
export function set(k, v) {
  if (!SCHEMA[k]) return undefined;
  werte[k] = klemmen(k, Number(v));
  sichern();
  return werte[k];
}

/** Auf die Voreinstellungen zurücksetzen. */
export function reset() {
  werte = Object.fromEntries(Object.entries(SCHEMA).map(([k, s]) => [k, s.def]));
  sichern();
}

/** Weicht mindestens ein Wert von der Voreinstellung ab? */
export function veraendert() {
  return Object.entries(SCHEMA).some(([k, s]) => werte[k] !== s.def);
}

function sichern() {
  try { localStorage.setItem(KEY, JSON.stringify(werte)); } catch (e) { /* egal */ }
}

// Für die Konsole, wie _setTempo: settings.set('tempo', 1.5)
if (typeof window !== 'undefined') window.LOGIK_SETTINGS = { get, set, all, reset };
