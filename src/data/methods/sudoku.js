/**
 * Sudoku in altersgerechten Stufen
 *
 * Format siehe README.md im selben Verzeichnis.
 */
export default {
  id: 'sudoku',
  icon: '🔢',
  category: 'logik-denken',
  ages: '5-18',

  title: {
    de: 'Sudoku in altersgerechten Stufen',
    ru: 'Судоку по возрастам',
    en: 'Sudoku in age-appropriate stages'
  },

  short: {
    de: 'Zahlen- oder Symbolraster von 4×4 bis 9×9, die durch reines Ausschlussdenken gefüllt werden.',
    ru: 'Сетки из цифр или символов от 4×4 до 9×9, которые заполняются чистым методом исключения.',
    en: 'Number or symbol grids from 4×4 to 9×9 that are filled in by pure elimination reasoning.'
  },

  what: {
    de: 'Ein Sudoku ist ein Raster, in dem jedes Zeichen in jeder Zeile, jeder Spalte und jedem Kasten ' +
        'genau einmal vorkommen muss. Gelöst wird es nicht durch Rechnen, sondern durch Ausschließen: ' +
        '„Hier kann keine 4 stehen, denn in der Spalte ist schon eine." Genau das ist der Nutzen – das ' +
        'Kind übt, eine Regel systematisch anzuwenden, mehrere Bedingungen gleichzeitig im Kopf zu ' +
        'behalten und nicht zu raten. Mit Bildsymbolen und einem 4×4-Raster geht das schon ab etwa fünf ' +
        'Jahren, das klassische 9×9 lohnt sich meist ab neun oder zehn. Ehrlich dazugesagt: Sudoku ' +
        'trainiert vor allem Sudoku – dass sich davon Schulnoten oder allgemeines Denkvermögen ändern, ' +
        'ist nicht belegt. Es ist eine gute Übung im geduldigen, regelgeleiteten Vorgehen, kein Wundermittel.',
    ru: 'Судоку — это сетка, в которой каждый знак должен встречаться ровно один раз в каждой строке, ' +
        'каждом столбце и каждом блоке. Решается оно не счётом, а исключением: «Здесь не может быть ' +
        '4, потому что четвёрка уже есть в столбце». В этом и польза: ребёнок учится систематически ' +
        'применять правило, удерживать в голове сразу несколько условий и не угадывать. С картинками ' +
        'вместо цифр и сеткой 4×4 это возможно примерно с пяти лет, классическое 9×9 обычно имеет ' +
        'смысл с девяти-десяти. Скажем честно: судоку тренирует прежде всего судоку — то, что от него ' +
        'меняются школьные оценки или общий уровень мышления, не доказано. Это хорошее упражнение в ' +
        'терпеливой работе по правилу, а не чудо-средство.',
    en: 'A sudoku is a grid in which each symbol must appear exactly once in every row, every column ' +
        'and every box. It is solved not by arithmetic but by elimination: "A 4 cannot go here, ' +
        'because there is already one in this column." That is exactly the benefit – the child ' +
        'practices applying a rule systematically, holding several conditions in mind at once and ' +
        'not guessing. With picture symbols and a 4×4 grid this works from about age five; the ' +
        'classic 9×9 is usually worthwhile from nine or ten. To be honest: sudoku mainly trains ' +
        'sudoku – there is no evidence that it improves school grades or general reasoning ability. ' +
        'It is a good exercise in patient, rule-guided work, not a miracle cure.'
  },

  steps: {
    de: [
      'Mit einem 4×4-Raster und vier Bildsymbolen anfangen – Hund, Katze, Fisch, Vogel. Zahlen erst, wenn die Regel sitzt; sonst versucht das Kind zu rechnen.',
      'Die Regel in einem Satz sagen und mit dem Finger zeigen: „In jeder Zeile, in jeder Spalte und in jedem 2×2-Kasten kommt jedes Tier genau einmal vor."',
      'Das erste Rätsel gemeinsam lösen und dabei laut denken: „In dieser Zeile fehlt noch die Katze. Passt sie hier hin? Nein, in der Spalte ist schon eine. Also dort."',
      'Immer mit Bleistift und Radiergummi arbeiten. Ab 6×6 die noch möglichen Zeichen klein in die Ecke des Feldes schreiben und einzeln durchstreichen, sobald sie ausgeschlossen sind.',
      'Feste Regel: nie raten. Wenn nichts mehr eindeutig ist, gemeinsam das eine Feld suchen, in dem nur noch eine Möglichkeit übrig ist – zur Not zeilenweise durchgehen.',
      'Erst wenn zwei 4×4 hintereinander ohne Hilfe gelingen, auf 6×6 wechseln, danach auf 9×9 mit vielen Vorgaben („leicht").',
      'Das fertige Rätsel vom Kind selbst prüfen lassen: jede Zeile, jede Spalte, jeden Kasten abfahren. Die Lösung im Heft erst danach aufschlagen.',
      'Auf zehn bis fünfzehn Minuten begrenzen und aufhören, solange es noch Spaß macht. Ein angefangenes Rätsel darf liegen bleiben.'
    ],
    ru: [
      'Начинать с сетки 4×4 и четырёх картинок — собака, кошка, рыба, птица. Цифры только тогда, когда правило усвоено, иначе ребёнок пытается считать.',
      'Сказать правило одной фразой и показать пальцем: «В каждой строке, в каждом столбце и в каждом квадрате 2×2 каждое животное встречается ровно один раз».',
      'Первое задание решить вместе, рассуждая вслух: «В этой строке не хватает кошки. Подходит сюда? Нет, в столбце кошка уже есть. Значит, туда».',
      'Всегда работать карандашом и ластиком. С 6×6 выписывать мелко в углу клетки ещё возможные знаки и вычёркивать их по одному, как только они исключены.',
      'Твёрдое правило: никогда не угадывать. Если однозначных ходов не видно, вместе найти ту клетку, где остался всего один вариант, — при необходимости пройти строку за строкой.',
      'Переходить на 6×6 только после того, как две сетки 4×4 подряд решены без помощи, затем на 9×9 с большим числом подсказок («лёгкий» уровень).',
      'Готовое задание пусть ребёнок проверит сам: пройти каждую строку, каждый столбец, каждый блок. Ответ в конце книжки открывать только после этого.',
      'Ограничивать десятью-пятнадцатью минутами и заканчивать, пока ещё интересно. Начатую сетку можно отложить.'
    ],
    en: [
      'Start with a 4×4 grid and four picture symbols – dog, cat, fish, bird. Introduce numbers only once the rule is solid; otherwise the child will try to calculate.',
      'State the rule in one sentence and point with your finger: "In every row, in every column and in every 2×2 box, each animal appears exactly once."',
      'Solve the first puzzle together, thinking aloud: "This row is still missing the cat. Does it fit here? No, there is already one in this column. So it goes there."',
      'Always work with pencil and eraser. From 6×6 on, write the still-possible symbols small in the corner of a cell and cross them out one by one as soon as they are ruled out.',
      'Fixed rule: never guess. When nothing is unambiguous any more, look together for the one cell where only a single possibility remains – if necessary, go through it row by row.',
      'Only move up to 6×6 once two 4×4 puzzles in a row succeed without help, then to 9×9 with many given numbers ("easy").',
      'Have the child check the finished puzzle themselves: run through every row, every column, every box. Open the solution in the book only afterwards.',
      'Limit sessions to ten to fifteen minutes and stop while it is still fun. An unfinished puzzle may be left lying around.'
    ]
  },

  tips: {
    de: [
      'Kein Zeitmessen, kein Wettrennen mit Geschwistern. Sudoku belohnt Langsamkeit; Tempo erzeugt genau das Raten, das die Übung verhindern soll.',
      'Bei einem Fehler nicht neu anfangen lassen, sondern zurückverfolgen: „Ab welchem Feld stimmt es nicht mehr?" Das ist der lehrreichere Teil.',
      'Scheitert das Kind zweimal hintereinander, ist die Stufe zu hoch – eine Größe zurück, ohne Kommentar.',
      'Selbst mitlösen, aber ein eigenes Rätsel. Nebeneinander knobeln wirkt besser als über die Schulter schauen.'
    ],
    ru: [
      'Никакого секундомера и соревнования с братьями и сёстрами. Судоку награждает медлительность; спешка порождает именно то угадывание, от которого упражнение и должно отучать.',
      'При ошибке не начинать заново, а проследить назад: «С какой клетки перестало сходиться?» Это самая полезная часть.',
      'Если ребёнок не справился два раза подряд, уровень слишком высок — вернуться на размер назад, без комментариев.',
      'Решайте вместе, но каждый своё задание. Сидеть рядом и думать полезнее, чем заглядывать через плечо.'
    ],
    en: [
      'No timing, no racing against siblings. Sudoku rewards slowness; speed produces exactly the guessing the exercise is meant to prevent.',
      'After a mistake, do not have the child start over – trace it back instead: "From which cell does it stop working?" That is the more instructive part.',
      'If the child fails twice in a row, the level is too high – go one size back, without comment.',
      'Solve along yourself, but on your own puzzle. Puzzling side by side works better than looking over the child\'s shoulder.'
    ]
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Sudoku', kind: 'wiki',
      label: { de: 'Wikipedia: Sudoku – Regeln, Varianten, Lösetechniken', ru: 'Википедия (нем.): судоку, правила и техники', en: 'Wikipedia (German): Sudoku – rules, variants, solving techniques' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%A1%D1%83%D0%B4%D0%BE%D0%BA%D1%83', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Sudoku', ru: 'Википедия: судоку', en: 'Wikipedia (Russian): Sudoku' } },
    { url: 'https://sudoku.com/de/', kind: 'anleitung',
      label: { de: 'Kostenlos online spielen, sechs Schwierigkeitsstufen und Regelteil', ru: 'Бесплатно онлайн, шесть уровней сложности и раздел с правилами', en: 'Play free online, six difficulty levels and a rules section' } },
    { url: 'https://progolovolomki.ru/sudoku/dlya-detej/', kind: 'anleitung',
      label: { de: 'Kinder-Sudoku 4×4 und 6×6 zum Ausdrucken (russisch)', ru: 'Детские судоку 4×4 и 6×6: играть и распечатать', en: 'Children\'s sudoku 4×4 and 6×6 to print out (Russian)' } }
  ],

  products: [
    {
      name: 'Super Rätselblock ab 5 Jahren',
      maker: 'Tessloff (Stefan Heine)',
      url: 'https://tessloff.com/produkt/super-raetselblock-ab-5-jahren-erstes-zaehlen-fehlersuche-paare-finden-und-viele-andere-raetsel-9783788645052/',
      price: 'ca. 7 €',
      note: {
        de: 'Enthält unter 25 Rätselarten auch 4×4-Sudokus – der bequemste Einstieg, weil zwischen den ' +
            'Sudokus andere Aufgaben stehen und nichts eintönig wird. 128 Seiten. Vergleichbare Bände ' +
            'gibt es ab 7, 8 und 12 Jahren.',
        ru: 'Среди 25 типов заданий есть и судоку 4×4 — самый удобный старт, потому что между судоку ' +
            'идут другие задачи и не возникает однообразия. 128 страниц. Есть такие же выпуски ' +
            'с 7, 8 и 12 лет.',
        en: ''
      }
    },
    {
      name: '365 Sudokus für Kinder',
      maker: 'moses. Verlag',
      url: 'https://www.moses-verlag.de/365-Sudokus-fuer-Kinder/108375',
      price: 'ca. 10 €',
      note: {
        de: 'Abreißblock, 15 × 15 cm, 736 Seiten, drei Schwierigkeitsstufen mit Lösungen. Ab etwa acht ' +
            'Jahren und erst sinnvoll, wenn 6×6 sicher gelingt – der Block enthält keine Bildsymbol-Sudokus.',
        ru: 'Отрывной блок 15 × 15 см, 736 страниц, три уровня сложности с ответами. Примерно с восьми ' +
            'лет и только тогда, когда 6×6 решается уверенно, — судоку с картинками в блоке нет.',
        en: ''
      }
    },
    {
      name: 'Sudoku-Kassette aus Holz (Art. 3139)',
      maker: 'Philos',
      url: 'https://philosshop.de/Sudoku-mit-Aufbewahrungsfaecher-FSC-100/3139',
      price: 'ca. 36 €',
      note: {
        de: 'Buchenholzbrett 298 × 298 mm mit 81 Zahlenchips, 90 kleinen Notizchips und zwei Schubfächern. ' +
            'Der Vorteil gegenüber dem Heft: Chips lassen sich umlegen, also kann das Kind eine Annahme ' +
            'ausprobieren und wieder zurücknehmen, ohne zu radieren. Aufgaben muss man sich aus einem ' +
            'Heft oder dem Netz holen; das Brett selbst bringt nur wenige mit.',
        ru: 'Буковая доска 298 × 298 мм, 81 фишка с цифрами, 90 маленьких фишек для пометок и два ' +
            'выдвижных ящика. Преимущество перед книжкой: фишки переставляются, поэтому ребёнок может ' +
            'проверить предположение и вернуть всё назад, ничего не стирая. Сами задания надо брать из ' +
            'сборника или из интернета — в комплекте их мало.',
        en: ''
      }
    },
    {
      name: 'Symbol-Sudoku 4×4 (Eigenbau)',
      maker: 'Selbstbau',
      price: 'ca. 2 €',
      note: {
        de: 'Für den Anfang das beste Material, weil man die Symbole nimmt, die das Kind mag, und die ' +
            'Aufgabe beliebig oft neu stellen kann, ohne ein neues Heft zu kaufen.',
        ru: 'Для начала это лучший материал: символы берутся те, что нравятся ребёнку, и задание можно ' +
            'составлять заново сколько угодно раз, не покупая новую книжку.',
        en: ''
      },
      diy: {
        de: 'Ein Quadrat von 12 × 12 cm auf feste Pappe zeichnen, in 16 Felder à 3 × 3 cm teilen; die ' +
            'Trennlinien zwischen den vier 2×2-Kästen mit dickem Filzstift nachziehen, die übrigen dünn. ' +
            'Als Spielsteine 16 Pappscheiben von 25 mm Durchmesser oder Flaschendeckel, je vier mit ' +
            'demselben Aufkleber (Hund, Katze, Fisch, Vogel). Eine Aufgabe stellt man so: das Raster ' +
            'zuerst vollständig richtig legen, dann sechs bis acht Steine wieder wegnehmen – der Rest ' +
            'ist die Aufgabe. Ein Foto mit dem Handy dient als Lösung. Für 6×6 dasselbe mit 18 × 12 cm, ' +
            'sechs Symbolen und Kästen von 3 × 2 Feldern.',
        ru: 'Нарисовать на плотном картоне квадрат 12 × 12 см и разделить на 16 клеток по 3 × 3 см; ' +
            'линии между четырьмя квадратами 2×2 обвести толстым маркером, остальные оставить тонкими. ' +
            'Фишки — 16 картонных кружков диаметром 25 мм или пробки от бутылок, по четыре с одной и ' +
            'той же наклейкой (собака, кошка, рыба, птица). Задание составляют так: сначала выложить ' +
            'сетку полностью и правильно, затем убрать шесть-восемь фишек — остальное и есть задание. ' +
            'Фото на телефон служит ответом. Для 6×6 то же самое на поле 18 × 12 см, шесть символов, ' +
            'блоки 3 × 2 клетки.',
        en: ''
      },
      svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
        <rect x="30" y="6" width="60" height="60" rx="2" fill="#fff" stroke="#2D2A4A" stroke-width="2.5"/>
        <path d="M60 6 V66 M30 36 H90" stroke="#2D2A4A" stroke-width="2.5"/>
        <path d="M45 6 V66 M75 6 V66 M30 21 H90 M30 51 H90" stroke="#B9B5D6" stroke-width="1"/>
        <circle cx="37.5" cy="13.5" r="5" fill="var(--primary)"/>
        <circle cx="67.5" cy="13.5" r="5" fill="var(--gold)"/>
        <circle cx="52.5" cy="43.5" r="5" fill="var(--orange)"/>
        <circle cx="82.5" cy="58.5" r="5" fill="var(--green)"/>
      </svg>`
    }
  ],

  // Schemazeichnung: 4x4-Raster mit dick abgesetzten 2x2-Kaesten, teilweise gefuellt
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="28" y="4" width="64" height="64" rx="2" fill="#fff" stroke="#2D2A4A" stroke-width="3"/>
    <path d="M60 4 V68 M28 36 H92" stroke="#2D2A4A" stroke-width="3"/>
    <path d="M44 4 V68 M76 4 V68 M28 20 H92 M28 52 H92" stroke="#B9B5D6" stroke-width="1.2"/>
    <rect x="30" y="6" width="12" height="12" rx="2" fill="var(--primary)"/>
    <rect x="62" y="6" width="12" height="12" rx="2" fill="var(--gold)"/>
    <rect x="46" y="38" width="12" height="12" rx="2" fill="var(--orange)"/>
    <rect x="78" y="54" width="12" height="12" rx="2" fill="var(--green)"/>
    <rect x="46" y="22" width="12" height="12" rx="2" fill="#EDEBF7"/>
    <text x="52" y="32" text-anchor="middle" font-size="11" fill="#8A85B0" font-weight="700">?</text>
  </svg>`
};
