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

/** Laufendes Jahr – Bezug für die Grenzen des Geburtsjahrs. */
const JAHR_JETZT = new Date().getFullYear();

/**
 * Voreinstellungen. Jeder Eintrag beschreibt sich selbst, damit die
 * Einstellungsseite ohne zweite Tabelle auskommt.
 *
 *   min/max/step  Grenzen des Reglers
 *   unit          Einheit für die Anzeige
 *   group         Abschnitt auf der Seite
 */
export const SCHEMA = {
  // Ohne Alter ist eine Merkspanne nicht deutbar (siehe core/norms.js).
  // Gespeichert wird das Geburtsdatum, nicht das Alter – sonst müsste man
  // es jedes Jahr nachziehen. 0 heißt „nicht angegeben".
  birthYear: {
    // Grenzen ergeben sich aus dem laufenden Jahr, damit sie nicht veralten.
    // Die App richtet sich an 3- bis 18-Jährige, ein Jahr Luft nach beiden
    // Seiten fängt Tippfehler und Nachzügler ab.
    def: 0, min: JAHR_JETZT - 19, max: JAHR_JETZT - 2, step: 1, kind: 'jahr', group: 'kind',
    de: 'Geburtsjahr', ru: 'Год рождения', en: 'Year of birth',
    hintDe: 'Nötig, um die Ergebnisse mit dem Alter zu vergleichen. Ohne Angabe gibt es nur die rohe Spanne.',
    hintRu: 'Нужен, чтобы сравнивать результаты с возрастом. Без него показывается только сырой результат.',
    hintEn: 'Needed to compare results against age. Without it, only the raw span is shown.'
  },
  birthMonth: {
    def: 0, min: 0, max: 12, step: 1, kind: 'monat', group: 'kind',
    de: 'Geburtsmonat', ru: 'Месяц рождения', en: 'Month of birth',
    hintDe: 'Genauer, aber nicht zwingend. Ohne Angabe wird die Jahresmitte angenommen – bei kleinen Kindern macht ein halbes Jahr fast eine halbe Ziffer aus.',
    hintRu: 'Точнее, но не обязательно. Без него берётся середина года — у малышей полгода дают почти пол-цифры.',
    hintEn: 'More precise, but optional. Without it, mid-year is assumed – for small children half a year is worth almost half a digit.'
  },
  rounds: {
    def: 10, min: 3, max: 40, step: 1, unit: '', group: 'umfang',
    de: 'Übungen je Durchgang', ru: 'Заданий за подход',
    hintDe: 'Danach kommt das Ergebnis und es geht zurück zur Gruppe. Ein absehbares Ende hilft dem Kind – und macht Werte vergleichbar.',
    hintRu: 'После этого показывается результат и возврат к группе. Понятный конец помогает ребёнку и делает результаты сопоставимыми.',
    en: 'Exercises per session', hintEn: 'After that, the result is shown and you return to the group. A foreseeable end helps the child – and makes results comparable.'
  },
  bildGroesse: {
    def: 2, min: 1, max: 3, step: 0.25, unit: '×', group: 'darstellung',
    de: 'Größe der Bilder', ru: 'Размер картинок', en: 'Picture size',
    hintDe: 'Betrifft alle Bilder in den Aufgaben. 1× ist die ursprüngliche Größe; für kleine Kinder und auf Tablets ist größer meist besser.',
    hintRu: 'Касается всех картинок в заданиях. 1× — исходный размер; для малышей и на планшетах обычно лучше крупнее.',
    hintEn: 'Applies to every picture in the tasks. 1× is the original size; for small children and on tablets bigger is usually better.'
  },
  tempo: {
    def: 2, min: 0.5, max: 5, step: 0.5, unit: 's', group: 'merken',
    de: 'Anzeigedauer je Element', ru: 'Время показа одного элемента',
    hintDe: 'Wie lange ein Element gezeigt oder gesprochen wird. Die Merkzeit ist Anzahl × dieser Wert.',
    hintRu: 'Как долго показывается или произносится элемент. Время запоминания = количество × это значение.',
    en: 'Display time per element', hintEn: 'How long an element is shown or spoken. Memorising time is count × this value.'
  },
  answerFactor: {
    def: 2, min: 1, max: 5, step: 0.5, unit: '×', group: 'merken',
    de: 'Antwortzeit (Vielfaches der Merkzeit)', ru: 'Время ответа (кратно времени показа)',
    hintDe: 'Bei 2 hat das Kind doppelt so lange Zeit zum Antworten wie zum Merken.',
    hintRu: 'При 2 на ответ даётся вдвое больше времени, чем на запоминание.',
    en: 'Answer time (multiple of memorising time)', hintEn: 'At 2, the child has twice as long to answer as to memorise.'
  },
  pause: {
    def: 1, min: 0, max: 5, step: 0.5, unit: 's', group: 'merken',
    de: 'Pause vor der Antwort', ru: 'Пауза перед ответом',
    hintDe: 'Ruhe zwischen Zeigen und Antworten.',
    hintRu: 'Тишина между показом и ответом.',
    en: 'Pause before answering', hintEn: 'Quiet between showing and answering.'
  },
  choiceLevelFactor: {
    def: 0.15, min: 0, max: 0.6, step: 0.05, unit: '×', group: 'auswahl',
    de: 'Zeitzuschlag je Niveaustufe', ru: 'Прибавка времени за уровень', en: 'Extra time per level',
    hintDe: 'Höhere Stufen brauchen mehr Bedenkzeit. Bei 0,15 hat Stufe 3 rund 30 % mehr Zeit als Stufe 1. Auf 0 gestellt gilt für alle Stufen dieselbe Zeit.',
    hintRu: 'Более высокие уровни требуют больше времени на раздумья. При 0,15 уровень 3 получает примерно на 30 % больше времени, чем уровень 1. При 0 время одинаково для всех уровней.',
    hintEn: 'Higher levels need more thinking time. At 0.15, level 3 gets roughly 30 % more time than level 1. Set to 0, every level gets the same time.'
  },
  choiceAnswer: {
    def: 30, min: 5, max: 120, step: 5, unit: 's', group: 'auswahl',
    de: 'Antwortzeit bei Auswahlaufgaben', ru: 'Время ответа в заданиях с выбором',
    hintDe: 'Nach dieser Zeit gilt die Aufgabe als nicht gelöst. Großzügig wählen – Nachdenken soll nicht bestraft werden.',
    hintRu: 'По истечении задание считается нерешённым. Выбирайте с запасом — думать не должно быть наказуемо.',
    en: 'Answer time in choice tasks', hintEn: 'After this time the task counts as unsolved. Be generous – thinking should not be punished.'
  },
  studyFactor: {
    def: 1, min: 0.5, max: 3, step: 0.5, unit: '×', group: 'auswahl',
    de: 'Lernzeit bei Merkaufgaben', ru: 'Время заучивания',
    hintDe: 'Streckt oder kürzt die Zeit, in der Paare zum Einprägen gezeigt werden.',
    hintRu: 'Растягивает или сокращает время показа пар для запоминания.',
    en: 'Study time in memorising tasks', hintEn: 'Stretches or shortens the time pairs are shown for memorising.'
  },
  feedbackOk: {
    def: 1.2, min: 0.5, max: 5, step: 0.1, unit: 's', group: 'rueckmeldung',
    de: 'Rückmeldung bei richtig', ru: 'Обратная связь при верном ответе',
    hintDe: 'Wie lange ✅ stehen bleibt, bevor es weitergeht.',
    hintRu: 'Как долго держится ✅ до продолжения.',
    en: 'Feedback when correct', hintEn: 'How long ✅ stays before moving on.'
  },
  feedbackWrong: {
    def: 2.5, min: 0.5, max: 8, step: 0.5, unit: 's', group: 'rueckmeldung',
    de: 'Rückmeldung bei falsch', ru: 'Обратная связь при ошибке',
    hintDe: 'Länger als bei richtig – hier wird die Lösung gezeigt und die will gelesen werden.',
    hintRu: 'Дольше, чем при верном ответе — здесь показывается решение.',
    en: 'Feedback when wrong', hintEn: 'Longer than for correct – the solution is shown and needs to be read.'
  },
  sound: {
    def: 1, min: 0, max: 1, step: 1, unit: '', group: 'ton', bool: true,
    de: 'Ton', ru: 'Звук',
    hintDe: 'Aus geschaltet bleiben die Tests mit Ansage stumm und melden das auch.',
    hintRu: 'При выключении задания с озвучкой молчат и сообщают об этом.',
    en: 'Sound', hintEn: 'When off, the spoken tests stay silent and say so.'
  }
};

export const GROUPS = {
  kind:         { icon: '🎂', de: 'Kind', ru: 'Ребёнок', en: 'Child' },
  umfang:       { icon: '🎯', de: 'Umfang', ru: 'Объём', en: 'Scope' },
  darstellung:  { icon: '🔍', de: 'Darstellung', ru: 'Отображение', en: 'Display' },
  merken:       { icon: '🧠', de: 'Merkspannen-Tests', ru: 'Тесты на запоминание', en: 'Memory-span tests' },
  auswahl:      { icon: '👆', de: 'Auswahlaufgaben', ru: 'Задания с выбором', en: 'Choice tasks' },
  rueckmeldung: { icon: '💬', de: 'Rückmeldung', ru: 'Обратная связь', en: 'Feedback' },
  ton:          { icon: '🔊', de: 'Ton', ru: 'Звук', en: 'Sound' }
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
  if (!Number.isFinite(v)) return s.def;
  // 0 heißt bei Geburtsjahr und -monat „nicht angegeben" und liegt bewusst
  // unterhalb von min. Ohne diese Ausnahme klemmte das Zurücksetzen den
  // Wert auf das älteste Jahrgangsjahr – und die App behauptete ein Alter,
  // das nie jemand eingegeben hat.
  if (v === 0 && (s.kind === 'jahr' || s.kind === 'monat')) return 0;
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
  anwenden();
  return werte[k];
}

/**
 * Werte, die nicht der Code liest, sondern das Stylesheet.
 *
 * Die Bildgröße als CSS-Variable statt als Zahl im Code: sonst müsste jede
 * der vierzig Stellen, die ein Bild darstellen, den Wert einzeln abfragen
 * und bei jeder Änderung neu zeichnen.
 */
export function anwenden() {
  try {
    document.documentElement.style.setProperty('--pic', String(get('bildGroesse')));
  } catch (e) { /* ohne DOM egal */ }
}

/** Auf die Voreinstellungen zurücksetzen. */
/**
 * Auf Voreinstellung zurücksetzen.
 *
 * Das Geburtsdatum bleibt stehen: es ist keine Ablauf-Vorliebe, sondern eine
 * Angabe über das Kind. Wer die Tempo-Regler zurückdreht, will nicht die
 * Altersnormierung verlieren und danach unbemerkt uneingeordnete Ergebnisse
 * bekommen. Zum Ändern gibt es die Auswahllisten direkt daneben.
 */
export function reset() {
  // anwenden() steht am Ende, nachdem werte neu gesetzt wurde
  werte = Object.fromEntries(Object.entries(SCHEMA).map(
    ([k, s]) => [k, (s.kind === 'jahr' || s.kind === 'monat') ? werte[k] : s.def]));
  sichern();
  anwenden();
}

/** Weicht mindestens ein Wert von der Voreinstellung ab? */
export function veraendert() {
  return Object.entries(SCHEMA).some(([k, s]) => werte[k] !== s.def);
}

/** Alle angemeldeten Modul-Einstellungen, nach Modul gruppiert. */
export function moduleGroups() {
  const raus = {};
  for (const [k, s] of Object.entries(SCHEMA)) {
    if (!s.modul) continue;
    (raus[s.modul] = raus[s.modul] || []).push([k, s]);
  }
  return raus;
}

/**
 * Eigene Einstellungen eines Spielmoduls anmelden.
 *
 * Ein Modul weiß am besten, welche Stellschrauben es hat – die Zeit je
 * leerem Feld beim Sudoku gehört nicht in eine zentrale Liste, die bei
 * jedem neuen Modul wächst und irgendwann niemand mehr überblickt. Das
 * Modul exportiert stattdessen `settings` und erscheint damit von selbst
 * auf der Einstellungsseite.
 *
 * Die Schlüssel werden mit der Modulkennung vorangestellt, damit zwei
 * Module dieselbe Bezeichnung verwenden dürfen. Angemeldet wird beim Laden
 * des Moduls; gespeicherte Werte werden dabei nachgezogen, weil laden()
 * beim Start noch nichts von diesen Schlüsseln wusste.
 */
export function registerModuleSettings(moduleId, schema) {
  let roh = {};
  try { roh = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { /* egal */ }

  for (const [k, def] of Object.entries(schema || {})) {
    const key = moduleId + '.' + k;
    if (SCHEMA[key]) continue;                       // schon angemeldet
    SCHEMA[key] = { ...def, group: 'mod:' + moduleId, modul: moduleId };
    const v = Number(roh[key]);
    werte[key] = Number.isFinite(v) ? klemmen(key, v) : def.def;
  }
}

/** Eigener Wert eines Moduls. */
export function modGet(moduleId, k) {
  return get(moduleId + '.' + k);
}

function sichern() {
  try { localStorage.setItem(KEY, JSON.stringify(werte)); } catch (e) { /* egal */ }
}

// Für die Konsole, wie _setTempo: settings.set('tempo', 1.5)
if (typeof window !== 'undefined') window.LOGIK_SETTINGS = { get, set, all, reset, modGet };
