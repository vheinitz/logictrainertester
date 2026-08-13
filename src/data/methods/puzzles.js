/**
 * Puzzles mit steigender Teilezahl.
 * Format siehe README.md im selben Verzeichnis.
 */
export default {
  id: 'puzzles',
  icon: '🧩',
  category: 'wahrnehmung',
  ages: '3-14',

  title: {
    de: 'Puzzles mit steigender Teilezahl',
    ru: 'Пазлы с возрастающим числом деталей',
    en: 'Jigsaw puzzles with increasing piece counts'
  },

  short: {
    de: 'Puzzeln verbindet Teil-Ganzes-Wahrnehmung, Formvergleich und ausdauerndes Probieren.',
    ru: 'Пазлы соединяют восприятие «часть — целое», сравнение форм и терпеливый перебор.',
    en: 'Puzzling combines part-whole perception, shape comparison, and persistent trial and error.'
  },

  what: {
    de: 'Beim Puzzeln wechselt das Kind ständig zwischen Detail und Gesamtbild: Es merkt sich ' +
        'eine Kantenform oder einen Farbverlauf, sucht damit im Haufen und prüft das Ergebnis am ' +
        'Vorlagenbild. Wer nur wahllos Teile aneinanderhält, kommt bei 100 Teilen nicht weit – ' +
        'deshalb entsteht fast von selbst eine Suchstrategie (erst Rand, dann Farbgruppen). Ob ' +
        'sich das auf andere Bereiche überträgt, ist offen; gesichert ist nur, dass Kinder, die ' +
        'viel puzzeln und bauen, in räumlichen Aufgaben besser abschneiden – Ursache und Wirkung ' +
        'sind dabei nicht getrennt. Als ruhige, genau dosierbare Übung mit sichtbarem Ende ist ' +
        'es trotzdem eine der praktischsten Beschäftigungen überhaupt.',
    ru: 'Собирая пазл, ребёнок постоянно переключается между деталью и целым: запоминает форму ' +
        'выступа или переход цвета, ищет по этому признаку в куче и сверяется с картинкой на ' +
        'коробке. Кто просто прикладывает детали наугад, на ста элементах далеко не уедет — ' +
        'поэтому стратегия поиска возникает почти сама (сначала рамка, потом цветовые группы). ' +
        'Переносится ли это на другие области, неизвестно; надёжно установлено лишь, что дети, ' +
        'которые много собирают пазлы и строят, лучше справляются с пространственными задачами, ' +
        'причём причина и следствие тут не разделены. Но как спокойное, точно дозируемое занятие ' +
        'с видимым концом пазл остаётся одним из самых практичных.',
    en: 'While puzzling, the child constantly switches between detail and overall picture: they memorize ' +
        'an edge shape or a color gradient, search the pile with it, and check the result against the ' +
        'reference image. Anyone who just holds pieces together at random will not get far with 100 pieces – ' +
        'which is why a search strategy emerges almost by itself (edge first, then color groups). Whether ' +
        'this transfers to other areas is an open question; all that is established is that children who ' +
        'puzzle and build a lot perform better on spatial tasks – cause and effect are not separated ' +
        'there. As a calm, precisely adjustable exercise with a visible end, it is nevertheless one of ' +
        'the most practical activities of all.'
  },

  steps: {
    de: [
      'Die Teilezahl so wählen, dass eine Sitzung reicht: Beim Einstieg soll das Kind in 15 bis 20 Minuten fertig werden. Lieber eine Stufe zu leicht anfangen – ein liegengebliebenes Puzzle wird selten wieder angefasst.',
      'Das Deckelbild aufstellen, gut sichtbar neben der Unterlage. Nach der Vorlage zu arbeiten ist kein Schummeln, sondern genau die Übung: Ausschnitt im Bild suchen, Teil dazu finden.',
      'Immer dieselbe Reihenfolge einhalten: alle Teile mit der Bildseite nach oben drehen, dann die Randteile mit gerader Kante aussortieren, dann den Rahmen legen. Diese drei Schritte sind das eigentlich Lernbare.',
      'Die Innenteile in kleine Häufchen nach Farbe oder Motiv sortieren und die Häufchen benennen: „Himmel", „rotes Dach", „Wiese". Wer sortiert hat, sucht danach in zwanzig statt in achtzig Teilen.',
      'Regel gegen das Drücken: Ein Teil, das nicht nach zwei ruhigen Versuchen passt, kommt zurück in sein Häufchen. Gewaltsam gesteckte Teile zerstören das Bild und die Geduld.',
      'Erst dann die nächste Stufe, wenn ein Puzzle zweimal ohne Hilfe fertig wurde. Eine brauchbare Leiter ist 24 → 35 → 48 → 60 → 100 → 200 → 300 Teile.',
      'Größere Puzzles auf eine Unterlage legen – ein Stück Wellpappe oder eine Filzmatte –, damit die Arbeit weggeräumt und am nächsten Tag fortgesetzt werden kann.',
      'Für Fortgeschrittene schwerer machen, ohne mehr Teile zu kaufen: Deckelbild wegnehmen, oder das Puzzle mit der Bildseite nach unten legen, sodass nur noch die Form entscheidet.'
    ],
    ru: [
      'Число деталей подбирать так, чтобы хватило одного захода: на старте ребёнок должен закончить за 15–20 минут. Лучше взять на ступень легче — брошенный на середине пазл редко возвращают на стол.',
      'Поставить картинку с коробки на видное место рядом с подложкой. Работать по образцу — не подсказка, а само упражнение: найти участок на картинке и подобрать к нему деталь.',
      'Всегда соблюдать один и тот же порядок: перевернуть все детали картинкой вверх, отобрать краевые с ровной стороной, выложить рамку. Именно эти три шага и есть то, чему учатся.',
      'Внутренние детали разложить кучками по цвету или мотиву и назвать кучки: «небо», «красная крыша», «трава». После сортировки поиск идёт среди двадцати деталей, а не восьмидесяти.',
      'Правило против нажима: деталь, которая не подошла после двух спокойных попыток, возвращается в свою кучку. Вдавленные силой детали портят и картину, и терпение.',
      'Переходить на следующую ступень только после того, как пазл дважды собран без помощи. Рабочая лестница: 24 → 35 → 48 → 60 → 100 → 200 → 300 деталей.',
      'Большие пазлы собирать на подложке — куске гофрокартона или войлочном коврике, — чтобы работу можно было убрать и продолжить назавтра.',
      'Усложнять без покупки новых наборов: убрать картинку-образец или собирать пазл изнанкой вверх, когда решает только форма.'
    ],
    en: [
      'Choose the piece count so that one session is enough: at the start, the child should finish in 15 to 20 minutes. Better to begin one level too easy – an abandoned puzzle is rarely picked up again.',
      'Set up the box-lid picture clearly visible next to the work surface. Working from the reference is not cheating but exactly the exercise: find the section in the picture, then find the matching piece.',
      'Always keep the same sequence: turn all pieces picture-side up, then sort out the edge pieces with a straight side, then lay the frame. These three steps are what is actually being learned.',
      'Sort the inner pieces into small piles by color or motif and name the piles: "sky", "red roof", "meadow". Whoever has sorted then searches among twenty pieces instead of eighty.',
      'A rule against forcing: a piece that does not fit after two calm attempts goes back to its pile. Pieces jammed in by force ruin both the picture and the patience.',
      'Move to the next level only after a puzzle has been completed twice without help. A workable ladder is 24 → 35 → 48 → 60 → 100 → 200 → 300 pieces.',
      'Lay larger puzzles on a base – a piece of corrugated cardboard or a felt mat – so the work can be put away and continued the next day.',
      'For advanced puzzlers, make it harder without buying more pieces: remove the box-lid picture, or lay the puzzle picture-side down so that only the shape decides.'
    ]
  },

  tips: {
    de: [
      'Nicht danebensitzen und auf Teile zeigen. Wenn Hilfe nötig ist, nur den Bereich eingrenzen: „Das Teil gehört in die obere Hälfte."',
      'Fehlende Teile verderben alles. Nach jeder Sitzung die Teile zählen oder wenigstens in einen Zip-Beutel geben – lose Kartons verlieren immer eines unter dem Sofa.',
      'Für die Kleinen zuerst Einlege- und Greifpuzzles aus Holz mit 4 bis 9 Teilen; Kartonpuzzles lohnen ab etwa vier Jahren, weil die Teile dann nicht mehr geknickt werden.',
      'Kein Zeitdruck und keine Stoppuhr. Puzzeln ist eine der wenigen Übungen, bei denen Langsamkeit kein Nachteil ist.'
    ],
    ru: [
      'Не сидеть рядом и не показывать пальцем на деталь. Если помощь нужна, ограничивайте область: «Эта деталь из верхней половины».',
      'Потерянные детали портят всё. После каждого захода пересчитывать детали или хотя бы ссыпать их в зип-пакет — из открытых коробок всегда что-то уезжает под диван.',
      'Малышам сначала деревянные вкладыши и пазлы с ручками на 4–9 деталей; картонные имеют смысл примерно с четырёх лет, когда детали перестают заламывать.',
      'Никакой спешки и секундомера. Пазл — одно из немногих занятий, где медлительность не является недостатком.'
    ],
    en: [
      'Do not sit next to the child pointing at pieces. If help is needed, only narrow down the area: "That piece belongs in the top half."',
      'Missing pieces spoil everything. Count the pieces after each session or at least put them in a zip bag – loose boxes always lose one under the sofa.',
      'For the little ones, start with wooden inset and peg puzzles with 4 to 9 pieces; cardboard puzzles are worthwhile from about age four, when the pieces no longer get bent.',
      'No time pressure and no stopwatch. Puzzling is one of the few exercises where slowness is not a disadvantage.'
    ]
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Puzzle', kind: 'wiki',
      label: { de: 'Wikipedia: Puzzle – Geschichte, Teileformen, Größen', ru: 'Википедия (нем.): пазл — история, формы деталей, размеры', en: 'Wikipedia (German): Jigsaw puzzle – history, piece shapes, sizes' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%9F%D0%B0%D0%B7%D0%BB', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Puzzle', ru: 'Википедия: пазл', en: 'Wikipedia (Russian): Jigsaw puzzle' } },
    { url: 'https://www.ravensburger.de/produkte/puzzle/index.html', kind: 'hersteller',
      label: { de: 'Ravensburger: Puzzles nach Alter und Teilezahl', ru: 'Ravensburger: пазлы по возрасту и числу деталей', en: 'Ravensburger: puzzles by age and piece count' } },
    { url: 'https://www.goki.eu/de/puzzles/', kind: 'hersteller',
      label: { de: 'goki: Holz- und Einlegepuzzles für die Kleinen', ru: 'goki: деревянные пазлы и вкладыши для малышей', en: 'goki: wooden and inset puzzles for the little ones' } }
  ],

  products: [
    {
      name: 'Kinderpuzzles nach Teilezahl (24 / 35 / 48 / 60 / 100 Teile)',
      maker: 'Ravensburger',
      url: 'https://www.ravensburger.de/produkte/puzzle/index.html',
      price: 'ca. 8–15 €',
      note: {
        de: 'Der Hersteller staffelt sauber nach Teilezahl, das erleichtert die nächste Stufe. ' +
            'Die Teile sind stabil und passen spürbar ein – wichtig, weil das Klicken die ' +
            'Rückmeldung für „richtig" ist. Auf die Größe der Einzelteile achten: Die ' +
            'XXL-Reihen haben bei gleicher Teilezahl größere Teile und sind für kleine Hände ' +
            'besser.',
        ru: 'Производитель чётко градуирует наборы по числу деталей — так проще выбрать следующую ' +
            'ступень. Детали прочные и ощутимо защёлкиваются, а это важно: щелчок и есть сигнал ' +
            '«правильно». Смотрите на размер деталей: серии XXL при том же количестве имеют ' +
            'крупные детали и удобнее для маленьких рук.',
        en: 'The manufacturer grades its sets cleanly by piece count, which makes the next level easy ' +
            'to pick. The pieces are sturdy and click in noticeably – important, because the click is ' +
            'the feedback for "correct". Pay attention to the size of the individual pieces: the ' +
            'XXL lines have larger pieces at the same piece count and are better for small hands.'
      }
    },
    {
      name: 'Kinderpuzzles und Rahmenpuzzles',
      maker: 'Schmidt Spiele',
      url: 'https://www.schmidtspiele.de/',
      price: 'ca. 6–14 €',
      note: {
        de: 'Vergleichbares Sortiment, oft etwas günstiger. Rahmenpuzzles – das Bild liegt in ' +
            'einem festen Rahmen – sind der gute Zwischenschritt zwischen Holzeinlegepuzzle und ' +
            'freiem Kartonpuzzle, weil der Rahmen den Rand schon vorgibt.',
        ru: 'Похожий ассортимент, часто немного дешевле. Пазлы в рамке — картинка лежит в жёсткой ' +
            'рамке — хороший промежуточный шаг между деревянным вкладышем и свободным картонным ' +
            'пазлом: рамка уже задаёт границу.',
        en: 'A comparable range, often somewhat cheaper. Frame puzzles – the picture sits inside a ' +
            'rigid frame – are the good intermediate step between wooden inset puzzles and free ' +
            'cardboard puzzles, because the frame already defines the border.'
      }
    },
    {
      name: 'Holz-, Greif- und Einlegepuzzles',
      maker: 'HABA, goki',
      url: 'https://www.goki.eu/de/puzzles/',
      price: 'ca. 8–20 €',
      note: {
        de: 'Für zwei- bis vierjährige Kinder der richtige Anfang: dicke Holzteile mit Knöpfen, ' +
            'die in vorgefräste Vertiefungen gehören. Hier zählt nur die Form, nicht das ' +
            'Zusammenfügen – ein deutlich leichterer Schritt. HABA-Puzzles finden sich unter ' +
            'haba-play.com, goki hat die günstigeren Einlegepuzzles.',
        ru: 'Правильное начало для детей двух-четырёх лет: толстые деревянные детали с ручками, ' +
            'вставляющиеся в готовые выемки. Здесь важна только форма, а не соединение деталей — ' +
            'заметно более лёгкий шаг. Пазлы HABA сейчас на haba-play.com, у goki — более ' +
            'дешёвые вкладыши.',
        en: 'The right start for two- to four-year-olds: thick wooden pieces with knobs that belong ' +
            'in pre-cut recesses. Here only the shape counts, not the joining – a much easier step. ' +
            'HABA puzzles can be found at haba-play.com; goki has the cheaper inset puzzles.'
      }
    },
    {
      name: 'Selbstgemachtes Fotopuzzle',
      maker: '',
      price: 'ca. 2 €',
      note: {
        de: 'Ein Puzzle aus dem eigenen Familienfoto wird oft zäher gepuzzelt als ein gekauftes, ' +
            'weil das Kind das Motiv kennt. Zugleich lässt sich die Schwierigkeit genau ' +
            'einstellen: Man schneidet einfach gröber oder feiner.',
        ru: 'Пазл из собственной семейной фотографии часто собирают упорнее покупного, потому что ' +
            'сюжет знаком. При этом сложность настраивается точно: режут крупнее или мельче.',
        en: 'A puzzle made from the family\'s own photo is often worked at more doggedly than a bought one, ' +
            'because the child knows the motif. At the same time the difficulty can be set precisely: ' +
            'you simply cut coarser or finer.'
      },
      diy: {
        de: 'Ein Foto in A4 (210 × 297 mm) ausdrucken und mit Klebestift vollflächig auf ' +
            'Fotokarton (mindestens 300 g/m²) kleben, unter einem Stapel Bücher eine Stunde ' +
            'trocknen lassen, sonst wellt es sich. Auf der Rückseite mit Lineal und Bleistift ein ' +
            'Raster anzeichnen: für den Anfang 4 Spalten × 3 Zeilen, das ergibt 12 Teile von ' +
            'je 52 × 99 mm; später 6 × 5 = 30 Teile. Mit Schere oder Cutter am Lineal schneiden, ' +
            'Ecken leicht abrunden. Wer echte Puzzlenasen will, zeichnet an jeder Schnittlinie ' +
            'abwechselnd einen kleinen Halbkreis von 8 mm Durchmesser hinein und schneidet ihn ' +
            'mit der Nagelschere aus. Alles in einen Beutel und die Teilezahl außen notieren.',
        ru: 'Распечатать фотографию на A4 (210 × 297 мм) и клеем-карандашом наклеить по всей ' +
            'площади на фотокартон (не менее 300 г/м²), час подержать под стопкой книг, иначе ' +
            'покоробится. На обороте линейкой и карандашом разметить сетку: для начала 4 столбца ' +
            '× 3 строки — это 12 деталей по 52 × 99 мм; позже 6 × 5 = 30 деталей. Резать ножницами ' +
            'или ножом по линейке, углы слегка скруглить. Кому нужны настоящие «замочки», тот ' +
            'дорисовывает на каждой линии реза попеременно полукруг диаметром 8 мм и вырезает его ' +
            'маникюрными ножницами. Всё сложить в пакет и написать снаружи число деталей.',
        en: 'Print a photo in A4 (210 × 297 mm) and glue it over its whole surface onto photo card ' +
            '(at least 300 g/m²) with a glue stick, then let it dry for an hour under a stack of books, ' +
            'otherwise it warps. On the back, draw a grid with a ruler and pencil: to start, 4 columns × ' +
            '3 rows, which gives 12 pieces of 52 × 99 mm each; later 6 × 5 = 30 pieces. Cut with scissors ' +
            'or a craft knife along the ruler and round the corners slightly. For real interlocking tabs, ' +
            'draw a small semicircle 8 mm across alternately along each cut line and cut it out with nail ' +
            'scissors. Put everything in a bag and note the number of pieces on the outside.'
      }
    }
  ],

  // Rahmen gelegt, ein Teil fehlt und liegt daneben
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="10" y="10" width="72" height="60" rx="3" fill="#F0EDFF" stroke="#D0CDE8" stroke-width="2"/>
    <line x1="34" y1="10" x2="34" y2="70" stroke="#D0CDE8" stroke-width="2"/>
    <line x1="58" y1="10" x2="58" y2="70" stroke="#D0CDE8" stroke-width="2"/>
    <line x1="10" y1="30" x2="82" y2="30" stroke="#D0CDE8" stroke-width="2"/>
    <line x1="10" y1="50" x2="82" y2="50" stroke="#D0CDE8" stroke-width="2"/>
    <rect x="10" y="10" width="24" height="20" fill="var(--accent)"/>
    <rect x="34" y="30" width="24" height="20" fill="var(--gold)"/>
    <rect x="58" y="50" width="24" height="20" fill="var(--green)"/>
    <rect x="34" y="50" width="24" height="20" fill="#FFFFFF" stroke="var(--secondary)" stroke-width="2" stroke-dasharray="4 3"/>
    <rect x="92" y="46" width="22" height="18" rx="2" fill="var(--secondary)"/>
    <circle cx="103" cy="46" r="4" fill="var(--secondary)"/>
  </svg>`
};
