/**
 * Leitner-System (Lernkartei)
 *
 * Format siehe README.md im selben Verzeichnis.
 */
export default {
  id: 'leitner-system',
  icon: '🗂️',
  category: 'gedaechtnis',
  ages: '8-18',

  title: {
    de: 'Leitner-System (Lernkartei)',
    ru: 'Система Лейтнера (картотека)',
    en: ''
  },

  short: {
    de: 'Karteikarten wandern je nach Erfolg durch fünf Fächer – Schwieriges kommt oft dran, Gekonntes selten.',
    ru: 'Карточки перемещаются по пяти отделениям: трудное спрашивают часто, усвоенное — редко.',
    en: ''
  },

  what: {
    de: 'Ein Kasten mit fünf Fächern, in dem Karteikarten wandern: Was das Kind konnte, rückt ein Fach ' +
        'weiter nach hinten und wird seltener abgefragt; was es nicht konnte, geht zurück in Fach 1 und ' +
        'kommt am nächsten Tag wieder dran. Sebastian Leitner hat das 1972 beschrieben; dahinter steckt ' +
        'der gut belegte Befund, dass verteiltes Wiederholen und aktives Abrufen deutlich mehr hängen ' +
        'lässt als mehrfaches Durchlesen. Geeignet für alles, was Paare bildet – Vokabeln, Formeln, ' +
        'Jahreszahlen, Hauptstädte – und ab etwa acht Jahren, sobald das Kind selbst lesen und schreiben kann.',
    ru: 'Коробка с пятью отделениями, по которым перемещаются карточки: то, что ребёнок вспомнил, ' +
        'переходит на отделение дальше и спрашивается реже; то, что не вспомнил, возвращается в первое ' +
        'отделение и повторяется уже на следующий день. Себастьян Лейтнер описал это в 1972 году; в ' +
        'основе лежит хорошо подтверждённый факт: распределённое повторение и активное припоминание ' +
        'дают гораздо больше, чем многократное перечитывание. Годится для всего, что образует пары — ' +
        'слова, формулы, даты, столицы — примерно с восьми лет, когда ребёнок сам читает и пишет.',
    en: ''
  },

  steps: {
    de: [
      'Karten beschriften: vorne die Frage, hinten die Antwort, eine Information je Karte. Zum Anfang reichen 20 bis 30 Karten – das Kind schreibt sie selbst.',
      'Alle Karten in Fach 1 stellen. Die Fächer werden von vorn nach hinten mit 1 bis 5 beschriftet.',
      'Wiederholungsintervalle auf den Deckel schreiben und einhalten: Fach 1 täglich, Fach 2 alle 2 Tage, Fach 3 alle 4 Tage, Fach 4 alle 9 Tage, Fach 5 alle 14 Tage.',
      'Abfragen: Karte ziehen, die Antwort laut sagen, erst dann umdrehen. Richtig – die Karte kommt hinten in das nächsthöhere Fach. Falsch – zurück nach ganz vorn in Fach 1, ohne Ausnahme.',
      'Eine Runde dauert 10 bis 15 Minuten oder bis Fach 1 leer ist, je nachdem was zuerst eintritt.',
      'Neue Karten erst nachlegen, wenn in Fach 1 weniger als 15 Karten stehen. Sonst staut sich alles vorn.',
      'Eine Karte, die Fach 5 zweimal hintereinander richtig übersteht, kommt in einen Umschlag „Kann ich" und einmal im Monat noch einmal zur Kontrolle.',
      'Einmal pro Woche fünf Minuten aufräumen: Karten, die dreimal aus Fach 3 zurückgefallen sind, neu formulieren oder in zwei einfachere Karten aufteilen.'
    ],
    ru: [
      'Подписать карточки: спереди вопрос, сзади ответ, одна единица информации на карточку. Для начала хватит 20–30 карточек — пишет их сам ребёнок.',
      'Все карточки поставить в отделение 1. Отделения подписываются спереди назад числами от 1 до 5.',
      'Интервалы повторения написать на крышке и соблюдать: отделение 1 — ежедневно, отделение 2 — раз в 2 дня, отделение 3 — раз в 4 дня, отделение 4 — раз в 9 дней, отделение 5 — раз в 14 дней.',
      'Опрос: вытянуть карточку, произнести ответ вслух и только потом перевернуть. Верно — карточка уходит в конец следующего отделения. Неверно — обратно в самое начало отделения 1, без исключений.',
      'Один заход длится 10–15 минут или до тех пор, пока не опустеет отделение 1, — что наступит раньше.',
      'Новые карточки добавлять только тогда, когда в отделении 1 осталось меньше 15 штук. Иначе всё скапливается впереди.',
      'Карточка, дважды подряд успешно прошедшая отделение 5, откладывается в конверт «знаю» и проверяется ещё раз раз в месяц.',
      'Раз в неделю пять минут на уборку: карточки, трижды выпавшие из отделения 3, переформулировать или разделить на две более простые.'
    ],
    en: []
  },

  tips: {
    de: [
      'Eine Karte = eine Information. „drei Vokabeln auf einer Karte" ist der häufigste Anfängerfehler und macht das ganze System stumpf.',
      'Die Antwort muss laut gesagt werden, bevor die Karte umgedreht wird. Nur hinschauen und nicken täuscht Können vor.',
      'Verpasste Tage werden nicht nachgeholt. Einfach am nächsten Tag dort weitermachen, wo der Plan gerade steht – sonst wird aus dem Kasten eine Schuldenverwaltung.',
      'Das Kind sortiert selbst um. Das Wandern der Karten sichtbar zu erleben ist der halbe Motivationsgewinn.'
    ],
    ru: [
      'Одна карточка — одна единица информации. «Три слова на одной карточке» — самая частая ошибка новичка, она обесценивает всю систему.',
      'Ответ надо произнести вслух до того, как карточку перевернут. Просто посмотреть и кивнуть — это иллюзия знания.',
      'Пропущенные дни не наверстывают. Просто продолжают на следующий день с того места, где стоит план, — иначе коробка превращается в список долгов.',
      'Перекладывает карточки сам ребёнок. Видеть, как карточки движутся вперёд, — половина мотивации.'
    ],
    en: []
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Lernkartei', kind: 'wiki',
      label: { de: 'Wikipedia: Lernkartei (Leitner-System)', ru: 'Википедия (нем.): учебная картотека', en: '' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%B2%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5_%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80%D0%B5%D0%BD%D0%B8%D1%8F', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Intervallwiederholung, mit Abschnitt zu Leitner', ru: 'Википедия: интервальные повторения (раздел о системе Лейтнера)', en: '' } },
    { url: 'https://en.wikipedia.org/wiki/Leitner_system', kind: 'wiki',
      label: { de: 'Wikipedia (englisch): Originalmaße der Fächer, 1–2–5–8–14 cm', ru: 'Википедия (англ.): исходные размеры отделений, 1–2–5–8–14 см', en: '' } },
    { url: 'https://apps.ankiweb.net/', kind: 'hersteller',
      label: { de: 'Anki – kostenlose Software nach demselben Prinzip', ru: 'Anki — бесплатная программа по тому же принципу', en: '' } }
  ],

  products: [
    {
      name: 'Karteikasten Colour Code A8, gefüllt',
      maker: 'Brunnen / Baier & Schneider',
      url: 'https://shop.brunnen.de/products/102058054',
      price: 'ca. 6 €',
      note: {
        de: 'Fertiger Kasten für A8-Karten (85 × 75 × 48 mm, fasst 200 Karten), mit 100 linierten Karten ' +
            'und A–Z-Register. Das Alphabetregister für das Leitner-System herausnehmen und stattdessen ' +
            'fünf eigene Trennkarten mit 1 bis 5 beschriften. Es gibt ihn in mehreren Farben; im ' +
            'Herstellershop ist er zeitweise vergriffen, im Schreibwarenladen liegt er praktisch immer.',
        ru: 'Готовая коробка под карточки A8 (85 × 75 × 48 мм, вмещает 200 штук), со 100 линованными ' +
            'карточками и разделителем А–Я. Для системы Лейтнера алфавитный разделитель вынимают и ' +
            'ставят вместо него пять собственных перегородок с номерами от 1 до 5. Есть в разных цветах; ' +
            'в фирменном магазине временами отсутствует, в канцелярском магазине лежит почти всегда.',
        en: ''
      }
    },
    {
      name: 'Karteikarten A8 blanko, 100 Stück',
      maker: 'Brunnen / Baier & Schneider',
      url: 'https://shop.brunnen.de/products/102282000',
      price: 'ca. 1,80 €',
      note: {
        de: 'Format 74 × 52 mm, 190 g/m². Blanko ist liniertem vorzuziehen – dann passen auch kleine ' +
            'Zeichnungen und Formeln darauf. Karten in zwei bis drei Farben kaufen und je Fach eine ' +
            'Farbe für ein Schulfach verwenden, dann lässt sich ein Kasten für Vokabeln und Mathe teilen.',
        ru: 'Формат 74 × 52 мм, 190 г/м². Нелинованные лучше линованных — на них помещаются и рисунки, ' +
            'и формулы. Стоит взять карточки двух-трёх цветов и отвести каждому школьному предмету свой ' +
            'цвет: тогда одну коробку можно делить между иностранным языком и математикой.',
        en: ''
      }
    },
    {
      name: 'Karteikasten aus einem Schuhkarton (Eigenbau)',
      maker: '',
      price: 'unter 2 €',
      note: {
        de: 'Der Selbstbau ist dem Kaufkasten in einer Hinsicht überlegen: Die fünf Fächer haben ' +
            'unterschiedliche Breite, und dadurch sieht das Kind auf einen Blick, wo es steht. Ein volles ' +
            'Fach 1 und ein leeres Fach 5 sagen mehr als jede Ermahnung.',
        ru: 'Самодельная коробка в одном отношении лучше покупной: пять отделений разной ширины, и ребёнок ' +
            'с одного взгляда видит, где он находится. Полное первое отделение и пустое пятое говорят ' +
            'больше любого напоминания.',
        en: ''
      },
      diy: {
        de: 'Schuhkarton mit mindestens 32 cm Innenlänge, 8 cm Innenbreite und 7 cm Höhe nehmen (Kinder-' +
            'Stiefelkarton passt gut). Vier Trennwände aus 2 mm Graupappe oder der Kartondeckel-Pappe ' +
            'schneiden, je 8 cm breit und 6,5 cm hoch. Von der vorderen Innenkante aus messen und die ' +
            'Wände bei 1 cm, 3 cm, 8 cm und 16 cm senkrecht einkleben (Heißkleber oder Gewebeband an ' +
            'beiden Seiten). So entstehen fünf Fächer mit 1, 2, 5, 8 und 14 cm Tiefe – genau die ' +
            'Staffelung aus Leitners Buch. Ist der Karton kürzer, alles halbieren: 1, 2, 4, 6 und 10 cm ' +
            'ergeben 23 cm. Fächer vorn mit 1 bis 5 beschriften, auf den Deckel innen den Wiederholplan ' +
            'schreiben (täglich – alle 2 Tage – alle 4 Tage – alle 9 Tage – alle 14 Tage). Karten im ' +
            'A8-Format (74 × 52 mm) stehen darin hochkant und lassen sich mit dem Daumen durchblättern.',
        ru: 'Взять обувную коробку с внутренней длиной не менее 32 см, шириной 8 см и высотой 7 см ' +
            '(хорошо подходит коробка от детских сапог). Вырезать четыре перегородки из картона 2 мм ' +
            'или из крышки коробки, каждая 8 см шириной и 6,5 см высотой. Отмерить от передней внутренней ' +
            'кромки и вклеить перегородки вертикально на отметках 1 см, 3 см, 8 см и 16 см (термоклей ' +
            'или тканевый скотч с обеих сторон). Получаются пять отделений глубиной 1, 2, 5, 8 и 14 см — ' +
            'ровно та градация, что описана у Лейтнера. Если коробка короче, всё уменьшают вдвое: 1, 2, ' +
            '4, 6 и 10 см дают 23 см. Отделения подписать спереди цифрами от 1 до 5, на внутренней ' +
            'стороне крышки написать план повторений (ежедневно — раз в 2 дня — раз в 4 дня — раз в 9 ' +
            'дней — раз в 14 дней). Карточки формата A8 (74 × 52 мм) стоят в такой коробке вертикально, ' +
            'и их удобно перебирать большим пальцем.',
        en: ''
      },
      svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
        <rect x="4" y="20" width="112" height="52" rx="3" fill="none" stroke="#2D2A4A" stroke-width="2"/>
        <line x1="8" y1="24" x2="8" y2="68" stroke="#D0CDE8" stroke-width="2"/>
        <line x1="15" y1="24" x2="15" y2="68" stroke="#D0CDE8" stroke-width="2"/>
        <line x1="32" y1="24" x2="32" y2="68" stroke="#D0CDE8" stroke-width="2"/>
        <line x1="59" y1="24" x2="59" y2="68" stroke="#D0CDE8" stroke-width="2"/>
        <text x="6" y="16" font-size="7" fill="#2D2A4A">1</text>
        <text x="11" y="16" font-size="7" fill="#2D2A4A">2</text>
        <text x="22" y="16" font-size="7" fill="#2D2A4A">5</text>
        <text x="43" y="16" font-size="7" fill="#2D2A4A">8</text>
        <text x="84" y="16" font-size="7" fill="#2D2A4A">14</text>
      </svg>`
    },
    {
      name: 'Anki (Software, kostenlos)',
      maker: 'Ankitects',
      url: 'https://apps.ankiweb.net/',
      price: '0 € (Windows, macOS, Linux, Android)',
      note: {
        de: 'Dasselbe Prinzip als Programm, mit automatisch berechneten Intervallen. Für Jüngere trotzdem ' +
            'erst der Pappkasten: das Anfassen und Umsortieren macht das Verfahren begreifbar, und der ' +
            'Kasten lenkt nicht ab. Ab etwa zwölf Jahren, bei großen Kartenmengen, lohnt der Umstieg.',
        ru: 'Тот же принцип в виде программы, интервалы рассчитываются автоматически. Младшим всё же ' +
            'сначала картонная коробка: возможность потрогать и переложить делает метод понятным, и ' +
            'коробка не отвлекает. Примерно с двенадцати лет, при больших объёмах, переход оправдан.',
        en: ''
      }
    }
  ],

  // Schemazeichnung: fünf Fächer wachsender Breite, Karte wandert nach rechts
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <path d="M14 18 Q60 2 106 18" fill="none" stroke="#D0CDE8" stroke-width="2" stroke-dasharray="4 3"/>
    <path d="M104 12 L107 19 L100 19 Z" fill="#D0CDE8"/>
    <rect x="6" y="40" width="10" height="30" rx="2" fill="var(--primary)"/>
    <rect x="19" y="40" width="13" height="30" rx="2" fill="var(--accent)"/>
    <rect x="35" y="40" width="16" height="30" rx="2" fill="var(--gold)"/>
    <rect x="54" y="40" width="19" height="30" rx="2" fill="var(--orange)"/>
    <rect x="76" y="40" width="22" height="30" rx="2" fill="var(--green)"/>
    <rect x="8" y="24" width="12" height="9" rx="1" fill="#fff" stroke="#2D2A4A" stroke-width="1.5"/>
    <rect x="100" y="24" width="12" height="9" rx="1" fill="#fff" stroke="#2D2A4A" stroke-width="1.5"/>
    <text x="11" y="78" font-size="7" fill="#2D2A4A">1</text>
    <text x="24" y="78" font-size="7" fill="#2D2A4A">2</text>
    <text x="41" y="78" font-size="7" fill="#2D2A4A">3</text>
    <text x="61" y="78" font-size="7" fill="#2D2A4A">4</text>
    <text x="85" y="78" font-size="7" fill="#2D2A4A">5</text>
  </svg>`
};
