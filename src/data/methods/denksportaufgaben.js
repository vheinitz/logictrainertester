/**
 * Denksportaufgaben und Rätselhefte
 *
 * Format siehe README.md im selben Verzeichnis.
 */
export default {
  id: 'denksportaufgaben',
  icon: '🧩',
  category: 'logik-denken',
  ages: '7-16',

  title: {
    de: 'Denksportaufgaben und Rätselhefte',
    ru: 'Логические задачи и сборники головоломок',
    en: ''
  },

  short: {
    de: 'Kurze Knobelaufgaben und Zahlenrätsel, die schlussfolgerndes Denken verlangen.',
    ru: 'Короткие головоломки и числовые задачи, требующие умозаключений.',
    en: ''
  },

  what: {
    de: 'Ein Logical, ein Streichholzrätsel, ein Zahlenrätsel: Aufgaben, bei denen aus wenigen ' +
        'Angaben eine eindeutige Lösung folgt – ohne Raten. Sie wirken, weil das Kind gezwungen ' +
        'ist, Angaben zu ordnen, Möglichkeiten auszuschließen und die eigene Lösung zu prüfen; ' +
        'genau das ist schlussfolgerndes Denken. Der Nutzen zeigt sich vor allem in ähnlichen ' +
        'Aufgaben – ein allgemeiner „Denktrainingseffekt" auf Schulnoten oder Intelligenz ist ' +
        'nicht belegt. Für Kinder ab etwa sieben Jahren, sobald sie flüssig genug lesen, um die ' +
        'Angaben selbst aufzunehmen.',
    ru: 'Логическая задача на соответствия, головоломка со спичками, числовой ребус — задания, ' +
        'где из нескольких условий однозначно следует единственный ответ, без угадывания. Они ' +
        'работают потому, что ребёнок вынужден упорядочивать условия, отсекать невозможные ' +
        'варианты и проверять собственное решение — это и есть умозаключение. Польза заметна ' +
        'прежде всего на похожих задачах; общий «эффект тренировки ума» на школьные оценки или ' +
        'интеллект не доказан. Примерно с семи лет, как только ребёнок читает достаточно бегло, ' +
        'чтобы сам воспринимать условия.',
    en: ''
  },

  steps: {
    de: [
      'Eine Aufgabe heraussuchen, die das Kind in fünf bis zehn Minuten schafft. Lieber eine Stufe zu leicht anfangen als zu schwer.',
      'Die Aufgabe zweimal lesen lassen. Beim zweiten Mal unterstreicht das Kind jede Angabe, die eine feste Tatsache ist: „Anna trägt keine Mütze."',
      'Ein Raster auf ein Blatt zeichnen: links untereinander die Namen, oben nebeneinander die Merkmale. Für jede Angabe ein ✗ in das ausgeschlossene Feld, ein ✓ in das sichere.',
      'Nach jedem Eintrag fragen: „Was weißt du jetzt zusätzlich?" Steht in einer Zeile ein ✓, werden alle anderen Felder dieser Zeile und Spalte zu ✗.',
      'Wenn das Kind feststeckt, nicht die Lösung sagen, sondern auf einen unbenutzten Hinweis zeigen: „Satz drei hast du noch nicht eingetragen."',
      'Am Schluss selbst gegenprüfen lassen: jeden Satz der Aufgabe der Reihe nach am fertigen Raster kontrollieren. Erst dann in die Lösungen schauen.',
      'Drei bis vier Aufgaben pro Woche, je 10 bis 15 Minuten. Danach aufhören, auch wenn es gerade gut läuft.'
    ],
    ru: [
      'Выбрать задачу, с которой ребёнок справится за пять–десять минут. Лучше начать на ступень легче, чем на ступень труднее.',
      'Дать прочитать условие дважды. На втором чтении ребёнок подчёркивает каждое утверждение, которое является твёрдым фактом: «На Анне нет шапки».',
      'Начертить на листе таблицу: слева столбиком имена, сверху строкой признаки. По каждому условию ставить ✗ в исключённую клетку и ✓ в достоверную.',
      'После каждой отметки спрашивать: «Что ты теперь узнал дополнительно?» Если в строке появилось ✓, все остальные клетки этой строки и этого столбца становятся ✗.',
      'Если ребёнок застрял, не называть ответ, а указать на неиспользованную подсказку: «Третье предложение ты ещё не занёс в таблицу».',
      'В конце дать проверить самому: пройти по условиям задачи подряд и сверить каждое с готовой таблицей. Только потом заглядывать в ответы.',
      'Три–четыре задачи в неделю по 10–15 минут. После этого заканчивать, даже если сейчас всё получается.'
    ],
    en: []
  },

  tips: {
    de: [
      'Keine Stoppuhr. Unter Zeitdruck wird Hektik trainiert, nicht Denken.',
      'Nicht alles in einem Rätselheft ist Denksport. Suchbilder und Ausmalseiten sind Pausenfüller; für schlussfolgerndes Denken taugen Logicals, Zahlenrätsel, Streichholzaufgaben.',
      'Scheitern drei Aufgaben hintereinander, ist das Heft zu schwer. Eine Stufe zurück – sonst geht die Lust verloren, und ohne Lust bringt es nichts.',
      'Selbst mitknobeln und auch mal laut in die Irre gehen. Das Kind sieht dann, dass Umwege zum Denken dazugehören.'
    ],
    ru: [
      'Никакого секундомера. Под давлением времени тренируется суетливость, а не мышление.',
      'Не всё в сборнике головоломок — логика. Картинки-искалки и раскраски заполняют паузу; для умозаключений годятся задачи на соответствия, числовые ребусы, головоломки со спичками.',
      'Если подряд не выходят три задачи, сборник слишком трудный. Шаг назад — иначе пропадёт интерес, а без интереса пользы не будет.',
      'Решать вместе и иногда вслух заходить в тупик. Ребёнок увидит, что окольные пути — нормальная часть мышления.'
    ],
    en: []
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Denksport', kind: 'wiki',
      label: { de: 'Wikipedia: Denksport – Überblick über die Aufgabenarten',
               ru: 'Википедия (нем.): виды задач на смекалку', en: '' } },
    { url: 'https://de.wikipedia.org/wiki/Logical', kind: 'wiki',
      label: { de: 'Wikipedia: Logical – mit zwei durchgerechneten Beispielen',
               ru: 'Википедия (нем.): задача на соответствия, с разбором примеров', en: '' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%9B%D0%BE%D0%B3%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B0%D1%8F_%D0%B3%D0%BE%D0%BB%D0%BE%D0%B2%D0%BE%D0%BB%D0%BE%D0%BC%D0%BA%D0%B0', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Logikrätsel', ru: 'Википедия: логическая головоломка', en: '' } },
    { url: 'https://www.janko.at/Raetsel/', kind: 'anleitung',
      label: { de: 'janko.at: über 300 Rätselarten, Regeln und Lösungstechniken, kostenlos',
               ru: 'janko.at: свыше 300 видов головоломок с правилами, бесплатно (нем.)', en: '' } }
  ],

  products: [
    {
      name: 'Knobel-Kids – Logikrätsel für kluge Köpfe',
      maker: 'moses. Verlag',
      url: 'https://www.moses-verlag.de/Knobel-Kids-Logikraetsel-fuer-kluge-Koepfe/052846',
      price: 'ca. 10 €',
      note: {
        de: 'Rätselbuch ab 8 Jahren, gemischte Schwierigkeit von leichten Suchaufgaben bis zu ' +
            'echten Logicals. Gut zum Einstieg, weil eine Aufgabe je Seite steht und das Kind ' +
            'selbst blättern darf. Erst die Lösungsseiten hinten abkleben, sonst wird gespickt.',
        ru: 'Сборник задач с 8 лет, от лёгких заданий на поиск до настоящих логических задач. ' +
            'Хорош для начала: одна задача на страницу, ребёнок сам выбирает. Ответы в конце ' +
            'лучше сразу заклеить, иначе будут подглядывать.',
        en: ''
      }
    },
    {
      name: 'Knobel-Kids – Matherätsel für Zahlenjongleure',
      maker: 'moses. Verlag',
      url: 'https://www.moses-verlag.de/Knobel-Kids-Matheraetsel-fuer-Zahlenjongleure/052860',
      price: 'ca. 10 €',
      note: {
        de: 'Gleiche Reihe, Schwerpunkt Zahlen: Rechenmauern, Zahlenpyramiden, Streichholz- und ' +
            'Wiegeaufgaben. Sinnvoll als zweites Heft, wenn das Kind Worträtsel schon mag, das ' +
            'Rechnen aber meidet.',
        ru: 'Та же серия с упором на числа: числовые пирамиды, задачи со спичками и с весами. ' +
            'Разумно взять вторым сборником, если словесные задачи ребёнку уже нравятся, а счёт ' +
            'он избегает.',
        en: ''
      }
    },
    {
      name: 'Lese-Logicals (Kopiervorlagen, mehrere Klassenstufen)',
      maker: 'Persen Verlag / Auer Verlag',
      price: 'ca. 20–25 € je Band',
      note: {
        de: 'Schulmaterial als Kopiervorlagen, nach Klassenstufe gestaffelt (1./2., 3./4., 5./6. ' +
            'Klasse). Vorteil gegenüber Kaufheften: gleicher Aufgabentyp in vielen Varianten, so ' +
            'dass sich das Raster-Vorgehen wirklich einschleift. Über den Verlag oder den ' +
            'Buchhandel; die Verlagsseiten lassen sich nicht direkt verlinken.',
        ru: 'Школьный материал в виде листов для копирования, разбитый по классам (1–2, 3–4, ' +
            '5–6). Преимущество перед обычными сборниками: один и тот же тип задачи во множестве ' +
            'вариантов, так что приём с таблицей действительно закрепляется. Заказ через ' +
            'издательство или книжный магазин.',
        en: ''
      }
    },
    {
      name: 'Selbstgeschriebenes Logical-Set',
      maker: 'Eigenbau',
      note: {
        de: 'Kostet nichts und lässt sich genau auf das Kind zuschneiden – eigene Namen, eigenes ' +
            'Haustier, eigene Klasse. Erfahrungsgemäß der Punkt, an dem Kinder vom Lösen zum ' +
            'Verstehen wechseln: wer selbst eines schreibt, muss die Logik von innen kennen.',
        ru: 'Ничего не стоит и точно подгоняется под ребёнка — свои имена, своё домашнее ' +
            'животное, свой класс. Как правило, именно здесь ребёнок переходит от решения к ' +
            'пониманию: чтобы составить задачу, надо знать её логику изнутри.',
        en: ''
      },
      diy: {
        de: 'Material: Karton A4, Lineal, Bleistift, Klarsichthülle, abwischbarer Folienstift. ' +
            'Vorgehen: Auf den Karton ein Raster mit 4 Zeilen und 4 Spalten zeichnen, Felder ' +
            '2 × 2 cm, links ein 4 cm breiter Streifen für die Namen, oben ein 2 cm hoher ' +
            'Streifen für die Merkmale – dieses Blankoraster in die Klarsichthülle stecken, es ' +
            'wird für alle Aufgaben wiederverwendet. Die Aufgabe selbst: vier Namen und vier ' +
            'Merkmale festlegen (z. B. vier Kinder, vier Lieblingstiere), die richtige Zuordnung ' +
            'zuerst auf einen Zettel schreiben, dann fünf bis sechs Sätze formulieren, von denen ' +
            'die Hälfte Ausschlüsse sind („Ben mag nicht die Katze"). Zum Schluss selbst lösen: ' +
            'Ist die Lösung nicht eindeutig, fehlt ein Satz; braucht man einen Satz nie, kann er weg.',
        ru: 'Материалы: картон A4, линейка, карандаш, файл-вкладыш, смываемый маркер для плёнки. ' +
            'Как делать: начертить на картоне таблицу 4 строки × 4 столбца, клетки 2 × 2 см, ' +
            'слева полоса шириной 4 см для имён, сверху полоса высотой 2 см для признаков; ' +
            'вложить пустую таблицу в файл — она пойдёт на все задачи. Сама задача: взять четыре ' +
            'имени и четыре признака (например, четверо детей и четыре любимых животных), ' +
            'сначала записать правильное соответствие на отдельный листок, затем составить ' +
            'пять–шесть предложений, половина из которых — исключения («Бен не любит кошку»). В ' +
            'конце решить самому: если решение неоднозначно, не хватает предложения; если какое-то ' +
            'предложение ни разу не понадобилось, его можно убрать.',
        en: ''
      }
    }
  ],

  // Schemazeichnung: Logical-Raster mit Häkchen und Kreuzen
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="6" y="10" width="22" height="6" rx="3" fill="#D0CDE8"/>
    <rect x="6" y="28" width="22" height="6" rx="3" fill="#D0CDE8"/>
    <rect x="6" y="46" width="22" height="6" rx="3" fill="#D0CDE8"/>
    <rect x="6" y="64" width="22" height="6" rx="3" fill="#D0CDE8"/>
    <rect x="34" y="2" width="76" height="5" rx="2.5" fill="#D0CDE8"/>
    <rect x="34" y="10" width="76" height="60" rx="3" fill="none" stroke="var(--primary)" stroke-width="2"/>
    <path d="M53 10 V70 M72 10 V70 M91 10 V70 M34 25 H110 M34 40 H110 M34 55 H110"
          stroke="#D0CDE8" stroke-width="1.5"/>
    <path d="M39 17 l3 4 l6 -8" fill="none" stroke="var(--green)" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M96 32 l7 7 M103 32 l-7 7" stroke="var(--orange)" stroke-width="3" stroke-linecap="round"/>
    <path d="M58 32 l7 7 M65 32 l-7 7" stroke="var(--orange)" stroke-width="3" stroke-linecap="round"/>
    <path d="M77 47 l3 4 l6 -8" fill="none" stroke="var(--green)" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M39 62 l7 7 M46 62 l-7 7" stroke="var(--orange)" stroke-width="3" stroke-linecap="round"/>
  </svg>`
};
