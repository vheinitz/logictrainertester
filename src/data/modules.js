/**
 * Modul-Registry – alle Trainingsmodule mit Skala, Altersband und KABC-Bezug.
 *
 * Titel, Skalennamen und Subtest-Bezüge sind dreisprachig. Die englischen
 * kabcRef-Namen sind die offiziellen Subtest-Titel der KABC-II (Number
 * Recall, Word Order, …); die russischen sind beschreibende Übersetzungen.
 * Aufgelöst wird über pick() aus core/html.js.
 */
export const scales = [
  { id:'sequential', icon:'🔢', color:'sequential',
    name:{ de:'Sequentiell / Kurzzeitgedächtnis (Gsm)',
           ru:'Последовательная обработка / кратковременная память (Gsm)',
           en:'Sequential / Short-Term Memory (Gsm)' },
    kabcSubtests:['Zahlen nachsprechen','Wortreihe','Handbewegungen'] },
  { id:'simultan', icon:'👁️', color:'simultan',
    name:{ de:'Simultan / Visuelle Verarbeitung (Gv)',
           ru:'Симультанная обработка / визуальное восприятие (Gv)',
           en:'Simultaneous / Visual Processing (Gv)' },
    kabcSubtests:['Konzeptbildung','Gesichter','Rover','Dreiecke','Bausteine','Gestaltschließen','Muster ergänzen','Geschichten ergänzen'] },
  { id:'lernen', icon:'🧩', color:'lernen',
    name:{ de:'Lernen / Langzeitgedächtnis (Glr)',
           ru:'Обучение / долговременная память (Glr)',
           en:'Learning / Long-Term Storage (Glr)' },
    kabcSubtests:['Atlantis','Symbole','Atlantis Abruf','Symbole Abruf'] },
  { id:'planung', icon:'💡', color:'planung',
    name:{ de:'Planung / Fluide Intelligenz (Gf)',
           ru:'Планирование / подвижный интеллект (Gf)',
           en:'Planning / Fluid Reasoning (Gf)' },
    kabcSubtests:['Geschichten ergänzen','Muster ergänzen'] },
  { id:'wissen', icon:'📚', color:'wissen',
    name:{ de:'Wissen / Kristalline Fähigkeiten (Gc)',
           ru:'Знания / кристаллизованный интеллект (Gc)',
           en:'Knowledge / Crystallized Ability (Gc)' },
    kabcSubtests:['Wortschatz','Wort- und Sachwissen','Rätsel'] }
];

/** KABC-Subtest-Bezüge, einmal zentral statt je Modul wiederholt. */
const REF = {
  zahlen:      { de:'Zahlen nachsprechen', ru:'Повторение чисел',      en:'Number Recall' },
  wortreihe:   { de:'Wortreihe',           ru:'Порядок слов',          en:'Word Order' },
  hand:        { de:'Handbewegungen',      ru:'Движения рук',          en:'Hand Movements' },
  konzept:     { de:'Konzeptbildung',      ru:'Формирование понятий',  en:'Conceptual Thinking' },
  gesichter:   { de:'Wiedererkennen von Gesichtern', ru:'Узнавание лиц', en:'Face Recognition' },
  rover:       { de:'Rover',               ru:'Ровер',                 en:'Rover' },
  dreiecke:    { de:'Dreiecke',            ru:'Треугольники',          en:'Triangles' },
  bausteine:   { de:'Bausteine zählen',    ru:'Счёт кубиков',          en:'Block Counting' },
  gestalt:     { de:'Gestaltschließen',    ru:'Гештальт-замыкание',    en:'Gestalt Closure' },
  atlantis:    { de:'Atlantis',            ru:'Атлантида',             en:'Atlantis' },
  symbole:     { de:'Symbole',             ru:'Символы (ребус)',       en:'Rebus' },
  atlantisAbruf:{ de:'Atlantis Abruf',    ru:'Атлантида: отсроченное воспроизведение', en:'Atlantis Delayed Recall' },
  symboleAbruf: { de:'Symbole Abruf',     ru:'Символы: отсроченное воспроизведение',  en:'Rebus Delayed Recall' },
  geschichten: { de:'Geschichten ergänzen',ru:'Дополнение историй',    en:'Story Completion' },
  muster:      { de:'Muster ergänzen',     ru:'Дополнение узоров',     en:'Pattern Reasoning' },
  wortschatz:  { de:'Wortschatz',          ru:'Словарный запас',       en:'Expressive Vocabulary' },
  sachwissen:  { de:'Wort- und Sachwissen',ru:'Вербальные знания',     en:'Verbal Knowledge' },
  raetsel:     { de:'Rätsel',              ru:'Загадки',               en:'Riddles' }
};

export const modules = [
  { id:'seq-zahlenfolgen', requires:'zahlen', norm:'ziffernVorwaerts', scale:'sequential', icon:'🔢', ages:'4-18', stufen:[2,10], mode:'self', kabcRef:REF.zahlen,
    title:{ de:'Zahlenfolgen sehen', ru:'Ряд чисел — смотреть', en:'Number sequence — watch' } },
  { id:'seq-zahlenfolgen-audio', requires:'zahlen', norm:'ziffernVorwaerts', scale:'sequential', icon:'🔊', ages:'4-18', stufen:[2,10], mode:'self', kabcRef:REF.zahlen,
    title:{ de:'Zahlenfolgen hören', ru:'Ряд чисел — слушать', en:'Number sequence — listen' } },
  { id:'seq-zahlen-rueckwaerts', requires:'zahlen', norm:'ziffernRueckwaerts', scale:'sequential', icon:'🔁', ages:'5-18', stufen:[2,8], mode:'self',
    title:{ de:'Zahlenfolge rückwärts', ru:'Ряд чисел наоборот', en:'Number sequence backwards' } },
  { id:'seq-wortreihe', scale:'sequential', icon:'🔗', ages:'3-18', stufen:[2,10], mode:'self', kabcRef:REF.wortreihe,
    title:{ de:'Wörter-Kette sehen', ru:'Цепочка слов — смотреть', en:'Word chain — watch' } },
  { id:'seq-wortreihe-audio', scale:'sequential', icon:'🔊', ages:'4-18', stufen:[2,10], mode:'self', kabcRef:REF.wortreihe,
    title:{ de:'Wörter-Kette hören', ru:'Цепочка слов — слушать', en:'Word chain — listen' } },
  { id:'seq-handbewegungen', scale:'sequential', icon:'✋', ages:'4-18', stufen:[2,8], mode:'self', kabcRef:REF.hand,
    title:{ de:'Händchen-Folge', ru:'Жесты по порядку', en:'Hand moves in order' } },
  { id:'seq-koffer-packen', scale:'sequential', icon:'🧳', ages:'3-18', stufen:[2,10], mode:'self',
    title:{ de:'Koffer packen sehen', ru:'Собираем чемодан — смотреть', en:'Packing the suitcase — watch' } },
  { id:'seq-koffer-packen-audio', scale:'sequential', icon:'🔊', ages:'4-18', stufen:[2,10], mode:'self',
    title:{ de:'Koffer packen hören', ru:'Собираем чемодан — слушать', en:'Packing the suitcase — listen' } },
  { id:'seq-rhythmus', scale:'sequential', icon:'🥁', ages:'4-18', stufen:[3,8], mode:'self',
    title:{ de:'Rhythmus-Klopfer', ru:'Простучи ритм', en:'Tap the rhythm' } },
  { id:'sim-konzeptbildung', scale:'simultan', icon:'❓', ages:'3-6', stufen:[1,5], mode:'self', kabcRef:REF.konzept,
    title:{ de:'Was passt nicht?', ru:'Что лишнее?', en:'Odd one out' } },
  { id:'sim-gesichter', scale:'simultan', icon:'😀', ages:'4-18', stufen:[2,8], mode:'self', kabcRef:REF.gesichter,
    title:{ de:'Gesichter-Merkspiel', ru:'Запомни лица', en:'Remember the faces' } },
  { id:'sim-rover', scale:'simultan', icon:'🤖', ages:'6-18', stufen:[1,5], mode:'self', kabcRef:REF.rover,
    title:{ de:'Rover im Labyrinth', ru:'Ровер в лабиринте', en:'Rover in the maze' } },
  { id:'sim-dreiecke', scale:'simultan', icon:'🔺', ages:'3-12', stufen:[1,5], mode:'mixed', kabcRef:REF.dreiecke,
    title:{ de:'Dreiecke legen', ru:'Сложи треугольники', en:'Build with triangles' } },
  { id:'sim-bausteine', requires:'zahlen', scale:'simultan', icon:'🧱', ages:'5-18', stufen:[1,6], mode:'self', kabcRef:REF.bausteine,
    title:{ de:'Bausteine zählen', ru:'Сосчитай кубики', en:'Count the blocks' } },
  { id:'sim-gestaltschliessen', requires:'lesen', scale:'simultan', icon:'🧐', ages:'3-18', stufen:[1,6], mode:'self', kabcRef:REF.gestalt,
    title:{ de:'Was ist das?', ru:'Что это?', en:'What is it?' } },
  { id:'sim-tangram', scale:'simultan', icon:'🔷', ages:'6-18', stufen:[1,5], mode:'self',
    title:{ de:'Tangram-Puzzle', ru:'Танграм', en:'Tangram puzzle' } },
  { id:'sim-suchbild', scale:'simultan', icon:'🔍', ages:'4-18', stufen:[1,6], mode:'self',
    title:{ de:'Suchbild-Vergleich', ru:'Найди отличие', en:'Spot the difference' } },
  { id:'lern-atlantis', requires:'lesen', scale:'lernen', icon:'🐠', ages:'3-18', stufen:[2,6], mode:'self', kabcRef:REF.atlantis,
    title:{ de:'Atlantis: Fisch-Namen', ru:'Атлантида: имена рыб', en:'Atlantis: fish names' } },
  { id:'lern-symbole', requires:'lesen', scale:'lernen', icon:'⭐', ages:'4-18', stufen:[2,7], mode:'self', kabcRef:REF.symbole,
    title:{ de:'Symbole merken', ru:'Запомни символы', en:'Remember the symbols' } },
  { id:'lern-atlantis-abruf', abrufVon:'lern-atlantis', requires:'lesen', scale:'lernen', icon:'🐠', ages:'3-18', mode:'self', kabcRef:REF.atlantisAbruf,
    title:{ de:'Atlantis: Namen erinnern', ru:'Атлантида: вспомнить имена', en:'Atlantis: recall the names' } },
  { id:'lern-symbole-abruf', abrufVon:'lern-symbole', requires:'lesen', scale:'lernen', icon:'⭐', ages:'4-18', mode:'self', kabcRef:REF.symboleAbruf,
    title:{ de:'Symbole erinnern', ru:'Вспомнить символы', en:'Recall the symbols' } },
  { id:'lern-memory', scale:'lernen', icon:'🃏', ages:'3-18', mode:'self',
    title:{ de:'Memory', ru:'Мемори', en:'Memory' } },
  { id:'lern-storycubes', scale:'lernen', icon:'🎲', ages:'6-18', stufen:[1,6], mode:'tutor',
    title:{ de:'Geschichten-Würfel', ru:'Кубики историй', en:'Story cubes' } },
  { id:'plan-geschichten', scale:'planung', icon:'📖', ages:'7-18', stufen:[1,5], mode:'self', kabcRef:REF.geschichten,
    title:{ de:'Bildergeschichte ordnen', ru:'Разложи историю по порядку', en:'Order the picture story' } },
  { id:'plan-muster', scale:'planung', icon:'🔲', ages:'7-18', stufen:[1,5], mode:'self', kabcRef:REF.muster,
    title:{ de:'Muster fortsetzen', ru:'Продолжи узор', en:'Continue the pattern' } },
  { id:'plan-sudoku', scale:'planung', icon:'🧮', ages:'8-18', stufen:[1,6], mode:'self',
    title:{ de:'Bilder-Sudoku', ru:'Судоку с картинками', en:'Picture sudoku' } },
  { id:'plan-zaubertricks', scale:'planung', icon:'🪄', ages:'7-18', stufen:[1,5], mode:'tutor',
    title:{ de:'Zaubertrick nachmachen', ru:'Повтори фокус', en:'Repeat the magic trick' } },
  { id:'wiss-wortschatz', requires:'lesen', scale:'wissen', icon:'💬', ages:'3-6', stufen:[1,5], mode:'self', kabcRef:REF.wortschatz,
    title:{ de:'Wortschatz-Quiz', ru:'Словарная викторина', en:'Vocabulary quiz' } },
  { id:'wiss-sachwissen', requires:'lesen', scale:'wissen', icon:'🌍', ages:'7-18', stufen:[1,5], mode:'self', kabcRef:REF.sachwissen,
    title:{ de:'Was weißt du?', ru:'Что ты знаешь?', en:'What do you know?' } },
  { id:'wiss-raetsel', requires:'lesen', scale:'wissen', icon:'🤔', ages:'3-18', stufen:[1,5], mode:'self', kabcRef:REF.raetsel,
    title:{ de:'Rätsel-Raten', ru:'Отгадай загадку', en:'Guess the riddle' } },
  { id:'wiss-oberbegriffe', requires:'lesen', scale:'wissen', icon:'🏷️', ages:'6-18', stufen:[1,5], mode:'self',
    title:{ de:'Oberbegriffe finden', ru:'Назови одним словом', en:'Find the category' } },
  { id:'wiss-teekesselchen', requires:'lesen', scale:'wissen', icon:'🫖', ages:'6-18', stufen:[1,5], mode:'self',
    title:{ de:'Teekesselchen', ru:'Слова-двойники', en:'Double meanings' } }
];

/**
 * Ab diesem Alter werden Module mit Schrift oder Ziffern angeboten.
 *
 * Darunter misst so ein Test nicht die gemeinte Fähigkeit, sondern ob das
 * Kind schon lesen oder Ziffern erkennen kann. Ein Fünfjähriger scheitert
 * an „Was macht ein Tierarzt?" nicht am Sachwissen, sondern am Text.
 *
 * `requires` steht am Modul selbst: 'lesen' für Wortoptionen ohne Bildstütze,
 * 'zahlen' für Ziffern. Module mit Bildern neben dem Wort – die Wörter-Kette
 * etwa – brauchen die Sperre nicht, dafür sind die Bilder da.
 */
/**
 * `stufen: [von, bis]` – die Niveauleiter des Moduls.
 *
 * Die Module messen auf sehr verschiedenen Leitern: die Ziffernspanne läuft
 * von 2 bis 10, ein Auswahlspiel von 1 bis 5. Ohne diese Angabe lässt sich
 * ein erreichtes Niveau nicht einordnen – „Stufe 4" ist bei den Ziffern
 * schwach und beim Tangram stark.
 *
 * Ausgelesen wird sie aus den Modulen selbst (minN/maxN bei den Spannen,
 * minLevel/maxLevel bei den Auswahlspielen). Steht sie nicht dabei, hat das
 * Modul keine Niveauleiter – Memory etwa misst nur Züge, nicht Schwierigkeit.
 */

/**
 * `abrufVon` – dieses Modul fragt ab, was ein anderes gelehrt hat.
 *
 * Der Abstand zwischen beiden ist der Test (siehe core/abruf.js). Der Plan
 * braucht die Angabe, um den Abruf zum richtigen Zeitpunkt vorzuschlagen und
 * ihn nicht als gewöhnliche offene Aufgabe in eine Sitzung zu packen – dort
 * stünde er, solange die Wartezeit läuft, nur mit einer Auskunft da.
 */

export const MIN_ALTER_SCHRIFT = 6;

/**
 * `norm` benennt die Normtabelle in core/norms.js, gegen die die erreichte
 * Spanne verrechnet wird. Nur Module mit dieser Angabe bekommen einen
 * altersnormierten Index; alle anderen zeigen weiter die rohe Spanne.
 *
 * Gesetzt ist sie bislang nur bei den beiden Ziffernspannen, weil nur dafür
 * Richtwerte vorliegen. Für Wörter, Kofferpacken, Handzeichen und Gesichter
 * wäre je eine eigene Tabelle nötig – die Mittelwerte liegen dort anders.
 * Beim Kofferpacken zum Beispiel höher, weil die Gegenstände semantisch
 * verknüpfbar sind und jede Runde die vorigen wiederholt. Die Ziffernnorm
 * darauf anzuwenden hieße, allen Kindern denselben falschen Wert zu geben.
 *
 * Einschränkung auch bei den Ziffern: die Richtwerte stammen aus der
 * gesprochenen Darbietung. Für die Bildschirmfassung ist das eine Näherung.
 */

/** Frühestes sinnvolles Alter für ein Modul. */
export function minAlter(mod) {
  return mod && mod.requires ? MIN_ALTER_SCHRIFT : 0;
}

/**
 * Darf das Modul angeboten werden?
 * Ohne bekanntes Alter wird nichts versteckt – gefragt wird vorher.
 */
export function moduleFreigegeben(mod, alter) {
  if (alter == null) return true;
  return alter >= minAlter(mod);
}

export function getModule(id) { return modules.find(m => m.id === id); }
export function getScale(id) { return scales.find(s => s.id === id); }
