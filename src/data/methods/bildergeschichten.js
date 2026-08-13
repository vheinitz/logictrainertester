/**
 * Bildergeschichten ordnen und nacherzählen
 *
 * Format siehe README.md im selben Verzeichnis.
 */
export default {
  id: 'bildergeschichten',
  icon: '🖼️',
  category: 'sprache',
  ages: '4-12',

  title: {
    de: 'Bildergeschichten ordnen und nacherzählen',
    ru: 'Истории в картинках: расставить и пересказать',
    en: 'Sorting and retelling picture stories'
  },

  short: {
    de: 'Durcheinandergelegte Bildfolgen in die richtige Reihenfolge bringen und dann in eigenen Worten erzählen.',
    ru: 'Перемешанные картинки расставить по порядку, а потом рассказать историю своими словами.',
    en: 'Put jumbled picture sequences into the right order and then tell the story in your own words.'
  },

  what: {
    de: 'Vier bis acht Bilder erzählen zusammen eine kleine Geschichte – jemand backt einen Kuchen, ' +
        'ein Hund büxt aus. Das Kind legt sie zuerst in die richtige Reihenfolge und erzählt sie dann. ' +
        'Das Ordnen zwingt dazu, Ursache und Folge zu erkennen; das Erzählen setzt genau da an, wo ' +
        'freies Sprechen sonst scheitert: Der Inhalt steht schon fest und liegt sichtbar auf dem Tisch, ' +
        'also bleibt der ganze Kopf für Satzbau, Zeitformen und Verknüpfungswörter frei. In der ' +
        'Sprachtherapie ist das seit Jahrzehnten ein Standardverfahren, weil es sich fein abstufen ' +
        'lässt – von zwei Bildern und einem Satz je Bild bis zur zusammenhängenden Erzählung aus dem ' +
        'Gedächtnis. Geeignet ab etwa vier Jahren, mit anspruchsvolleren Vorlagen bis ins Schulalter.',
    ru: 'Четыре-восемь картинок вместе рассказывают маленькую историю: кто-то печёт пирог, убегает ' +
        'собака. Ребёнок сначала раскладывает их по порядку, а потом рассказывает. Раскладывание ' +
        'заставляет увидеть причину и следствие; пересказ помогает именно там, где обычно ломается ' +
        'свободная речь: содержание уже задано и лежит на столе, поэтому вся голова свободна для ' +
        'построения фраз, времён и слов-связок. В логопедии это десятилетиями остаётся базовым ' +
        'приёмом, потому что его легко дозировать — от двух картинок и одной фразы к каждой до ' +
        'связного рассказа по памяти. Подходит примерно с четырёх лет, а с более сложными сериями — ' +
        'и в школьном возрасте.',
    en: 'Four to eight pictures together tell a small story – someone bakes a cake, a dog runs off. ' +
        'The child first puts them in the right order and then tells the story. Sorting them forces ' +
        'the child to recognize cause and consequence; telling the story starts exactly where free ' +
        'speech otherwise fails: the content is already fixed and lies visibly on the table, so the ' +
        'whole mind is free for sentence structure, tenses and connecting words. In speech therapy ' +
        'this has been a standard procedure for decades, because it can be graded finely – from two ' +
        'pictures and one sentence per picture to a coherent narrative from memory. Suitable from ' +
        'about four years of age, and with more demanding material well into school age.'
  },

  steps: {
    de: [
      'Eine Folge von vier bis sechs Bildern aussuchen, mischen und verdeckt auf den Tisch legen. Mehr Bilder heißt nicht schwerer, sondern nur länger – erst bei sechs bleiben, bis es rund läuft.',
      'Alle Bilder umdrehen. Das Kind sagt zu jedem einzelnen Bild einen Satz, ohne sich um die Reihenfolge zu kümmern: „Hier steht ein Junge am Fenster."',
      'Jetzt ordnen lassen, von links nach rechts. Nicht eingreifen, auch wenn es falsch aussieht.',
      'Nachfragen statt korrigieren: „Woran siehst du, dass das zuerst kommt?" Oft antwortet das Kind selbst mit dem Detail – die Tasse ist noch voll, der Schnee liegt noch.',
      'Die ganze Geschichte am Stück erzählen lassen, während der Zeigefinger von Bild zu Bild wandert. Nicht unterbrechen, nicht verbessern.',
      'Zweiter Durchgang mit Auftrag: „Erzähl es noch einmal und benutze zuerst, dann, plötzlich, deshalb, am Ende." Die fünf Wörter dabei sichtbar auf einen Zettel schreiben.',
      'Bilder umdrehen und die Geschichte aus dem Gedächtnis erzählen lassen. Das ist der eigentliche Schritt – ab hier trägt die Sprache allein.',
      'Ab der zweiten Klasse dasselbe schriftlich: die Geschichte in vier bis sechs Sätzen aufschreiben, ein Satz je Bild. Vorher immer erst mündlich.'
    ],
    ru: [
      'Выбрать серию из четырёх-шести картинок, перемешать и положить на стол рубашкой вверх. Больше картинок — не сложнее, а просто дольше; сначала держаться шести, пока не пойдёт легко.',
      'Перевернуть все картинки. Ребёнок говорит по одной фразе к каждой отдельной картинке, не думая о порядке: «Здесь мальчик стоит у окна».',
      'Теперь разложить по порядку, слева направо. Не вмешиваться, даже если кажется, что неверно.',
      'Спрашивать, а не исправлять: «По чему видно, что это было раньше?» Часто ребёнок сам называет деталь — чашка ещё полная, снег ещё лежит.',
      'Пусть расскажет всю историю целиком, ведя пальцем от картинки к картинке. Не перебивать, не поправлять.',
      'Второй заход с заданием: «Расскажи ещё раз и используй слова сначала, потом, вдруг, поэтому, в конце». Эти пять слов написать на видном листке.',
      'Перевернуть картинки и попросить рассказать по памяти. Это и есть главный шаг — дальше речь держится сама.',
      'Со второго класса то же письменно: записать историю в четырёх-шести предложениях, по одному на картинку. Всегда сначала устно.'
    ],
    en: [
      'Pick a sequence of four to six pictures, shuffle them and lay them face down on the table. More pictures does not mean harder, only longer – stay with six at first until it runs smoothly.',
      'Turn all the pictures over. The child says one sentence about each individual picture, without worrying about the order: "Here a boy is standing at the window."',
      'Now let the child sort them, from left to right. Do not intervene, even if it looks wrong.',
      'Ask instead of correcting: "How can you tell that this one comes first?" Often the child answers with the detail itself – the cup is still full, the snow is still lying.',
      'Have the whole story told in one go, while the index finger travels from picture to picture. Do not interrupt, do not correct.',
      'A second round with an assignment: "Tell it again and use first, then, suddenly, that is why, in the end." Write these five words visibly on a slip of paper.',
      'Turn the pictures over and have the story told from memory. That is the real step – from here on language carries it alone.',
      'From second grade on, the same thing in writing: write the story down in four to six sentences, one sentence per picture. Always do it orally first.'
    ]
  },

  tips: {
    de: [
      'Fünf Sekunden Pause aushalten, bevor man hilft. Die meisten Erwachsenen reden dem Kind die Geschichte weg.',
      'Eine falsche Reihenfolge nicht wegnehmen, sondern erzählen lassen. Beim Erzählen fällt der Bruch fast immer selbst auf – und das Umlegen ist dann die eigentliche Denkleistung.',
      'Nicht die Grammatik korrigieren, sondern richtig wiederholen: Sagt das Kind „er hat gegeht", antwortet man „ja, er ist gegangen" und erzählt weiter.',
      'Bei mehrsprachigen Kindern dieselbe Folge in beiden Sprachen erzählen lassen, an verschiedenen Tagen. Die Bilder bleiben gleich, nur die Sprache wechselt.'
    ],
    ru: [
      'Выдержать пять секунд паузы, прежде чем помогать. Большинство взрослых просто перехватывают рассказ у ребёнка.',
      'Неверный порядок не убирать, а дать рассказать. При рассказе несостыковка почти всегда обнаруживается сама — и перекладывание становится настоящей работой мысли.',
      'Не поправлять грамматику, а повторять правильно: если ребёнок говорит «он ложил», взрослый отвечает «да, он положил» и продолжает историю.',
      'С двуязычными детьми проходить одну и ту же серию на обоих языках, в разные дни. Картинки те же, меняется только язык.'
    ],
    en: [
      'Endure five seconds of silence before helping. Most adults talk the story away from the child.',
      'Do not take a wrong order away; let the child tell it anyway. While telling, the break in the story is almost always noticed by the child – and rearranging the cards is then the real mental work.',
      'Do not correct the grammar, but repeat it correctly: if the child says "he goed away", you answer "yes, he went away" and carry on with the story.',
      'With multilingual children, have the same sequence told in both languages, on different days. The pictures stay the same, only the language changes.'
    ]
  },

  links: [
    { url: 'https://www.westermann.de/schubi/', kind: 'hersteller',
      label: { de: 'SCHUBI (Westermann): Bilderboxen und Sprachfördermaterial', ru: 'SCHUBI (Westermann): наборы картинок для развития речи', en: 'SCHUBI (Westermann): picture boxes and language support material (German)' } },
    { url: 'https://globi.ch/ueber-papa-moll', kind: 'hersteller',
      label: { de: 'Papa Moll beim Globi Verlag – Herkunft der Figur und Bücher', ru: 'Папа Молль в издательстве Globi — о персонаже и книгах', en: 'Papa Moll at Globi Verlag – the origin of the character and the books (German)' } },
    { url: 'https://logoped.name/rasskaz-po-serii-syuzhetnyh-kartin/', kind: 'anleitung',
      label: { de: 'Ausführliche Anleitung (russisch): Erzählen nach Bildserien', ru: 'Подробная методика: рассказ по серии сюжетных картин', en: 'Detailed guide (Russian): telling stories from picture series' } },
    { url: 'https://de.wikipedia.org/wiki/Nacherz%C3%A4hlung', kind: 'wiki',
      label: { de: 'Wikipedia: Nacherzählung', ru: 'Википедия (нем.): пересказ', en: 'Wikipedia (German): retelling' } }
  ],

  products: [
    {
      name: 'Papa Moll – Bilderbox',
      maker: 'SCHUBI / Westermann',
      url: 'https://www.westermann.de/artikel/L12050/Papa-Moll-Bilderbox',
      price: 'ca. 42 €',
      note: {
        de: '22 Geschichten mit je 5–9 Bildkarten (10 × 9,2 cm), zusammen 149 Karten. Der Klassiker der ' +
            'Sprachförderung: gezeichnet, ohne Text, mit viel Slapstick, den Kinder von selbst ' +
            'kommentieren wollen. Gedacht für 1.–4. Klasse. Beim Verlag zeitweise nicht lieferbar – dann ' +
            'lohnt der Blick auf „Abenteuer mit Papa Moll" (20 Folgen, ab 7 Jahren) oder auf das ' +
            'ProLog-Paket.',
        ru: '22 истории по 5–9 карточек (10 × 9,2 см), всего 149 карточек. Классика речевого развития: ' +
            'рисованные картинки без текста, много комичного — детям самим хочется это комментировать. ' +
            'Рассчитано на 1–4 класс. У издательства временами нет в наличии; тогда стоит посмотреть ' +
            '«Abenteuer mit Papa Moll» (20 серий, с 7 лет) или комплект ProLog.',
        en: '22 stories with 5–9 picture cards each (10 × 9.2 cm), 149 cards in total. The classic of ' +
            'language support: drawn, without text, with plenty of slapstick that children want to ' +
            'comment on by themselves. Intended for grades 1–4. Temporarily unavailable from the ' +
            'publisher at times – in that case it is worth looking at "Abenteuer mit Papa Moll" ' +
            '(20 episodes, from age 7) or at the ProLog package.'
      }
    },
    {
      name: 'Papa Moll – Kombipaket (Bilderbox und Kopiervorlagen)',
      maker: 'ProLog Therapie- und Lernmittel',
      url: 'https://www.prolog-shop.de/shop/kindliche-sprachentwicklung-und-sprachentwicklungsstoerungen/bild-foto-und-geschichtenboxen-kindersprache/1406/papa-moll-kombipaket',
      price: 'ca. 50 €',
      note: {
        de: 'Dieselben 22 Geschichten plus ein Heft mit Kopiervorlagen der zehn beliebtesten Folgen in ' +
            'Schwarz-Weiß. Die Kopien sind der eigentliche Gewinn: Das Kind darf hineinschreiben, ' +
            'ausmalen, ausschneiden und die Geschichte mit nach Hause nehmen.',
        ru: 'Те же 22 истории плюс тетрадь с чёрно-белыми копируемыми образцами десяти самых любимых ' +
            'серий. Копии — главная польза: ребёнок может в них писать, раскрашивать, вырезать и ' +
            'забрать историю домой.',
        en: 'The same 22 stories plus a booklet with photocopiable versions of the ten most popular ' +
            'episodes in black and white. The copies are the real gain: the child may write on them, ' +
            'color them in, cut them out and take the story home.'
      }
    },
    {
      name: 'Bildfolgen aus Zeitungscomics (Eigenbau)',
      maker: 'Selbstbau',
      price: 'ca. 0 €',
      note: {
        de: 'Kostenloses und unerschöpfliches Material. Wortlose Strips eignen sich am besten – ' +
            '„Vater und Sohn" von e.o.plauen, Katzenjammer- oder Peanuts-Strips ohne Sprechblasen, ' +
            'auch Anleitungspiktogramme aus Möbelbauplänen.',
        ru: 'Бесплатный и неисчерпаемый материал. Лучше всего подходят полоски без слов: «Отец и сын» ' +
            'e.o.plauen, комиксы без реплик, а также пиктограммы из инструкций по сборке мебели.',
        en: 'Free and inexhaustible material. Wordless strips work best – "Vater und Sohn" by ' +
            'e.o.plauen, Katzenjammer or Peanuts strips without speech bubbles, and also the ' +
            'instruction pictograms from furniture assembly plans.'
      },
      diy: {
        de: 'Comicstreifen aus Zeitung oder Zeitschrift ausschneiden, Sprechblasen mit Korrekturroller ' +
            'weißen. Den Streifen in die Einzelbilder zerschneiden und jedes auf ein Stück feste Pappe ' +
            'von 7 × 7 cm kleben (gleiche Größe für alle, sonst verrät das Format die Reihenfolge). ' +
            'Auf die Rückseite jedes Kärtchens denselben Buchstaben für die Geschichte und die Nummer ' +
            'der richtigen Position schreiben – so lassen sich vermischte Sätze wieder sortieren und ' +
            'das Kind kann allein kontrollieren. In Klarsichthüllen oder Briefumschlägen aufbewahren, ' +
            'je ein Umschlag pro Geschichte. Zwanzig Geschichten sind in einem Nachmittag beisammen.',
        ru: 'Вырезать комикс-полоску из газеты или журнала, реплики закрасить корректором. Разрезать ' +
            'полоску на отдельные кадры и наклеить каждый на кусок плотного картона 7 × 7 см ' +
            '(размер одинаковый для всех, иначе формат подскажет порядок). На обороте каждой карточки ' +
            'написать одну и ту же букву истории и номер правильной позиции — так перемешавшиеся ' +
            'наборы легко разобрать, а ребёнок может проверить себя сам. Хранить в файлах или ' +
            'конвертах, по конверту на историю. Двадцать историй собираются за один вечер.',
        en: 'Cut comic strips out of a newspaper or magazine and white out the speech bubbles with ' +
            'correction tape. Cut the strip into its single panels and glue each one onto a piece of ' +
            'stiff cardboard measuring 7 × 7 cm (the same size for all of them, otherwise the format ' +
            'gives away the order). On the back of each card write the same letter for the story and ' +
            'the number of the correct position – this way mixed-up sets can be sorted out again and ' +
            'the child can check itself. Keep them in clear sleeves or envelopes, one envelope per ' +
            'story. Twenty stories are ready in a single afternoon.'
      }
    }
  ],

  // Schemazeichnung: drei Bildkarten, die dritte noch unsortiert
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="6" y="18" width="30" height="30" rx="3" fill="#fff" stroke="var(--primary)" stroke-width="2.5"/>
    <circle cx="21" cy="30" r="5" fill="var(--gold)"/>
    <path d="M11 44 L18 36 L26 44 Z" fill="#D0CDE8"/>
    <rect x="44" y="18" width="30" height="30" rx="3" fill="#fff" stroke="var(--primary)" stroke-width="2.5"/>
    <circle cx="59" cy="30" r="5" fill="var(--orange)"/>
    <path d="M49 44 L59 32 L69 44 Z" fill="#D0CDE8"/>
    <rect x="82" y="22" width="30" height="30" rx="3" fill="#fff" stroke="#B9B5D6"
          stroke-width="2.5" stroke-dasharray="4 3" transform="rotate(9 97 37)"/>
    <text x="97" y="43" text-anchor="middle" font-size="14" fill="#8A85B0" font-weight="700">?</text>
    <path d="M38 33 H42 M76 33 H80" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round"/>
    <text x="21" y="62" text-anchor="middle" font-size="9" fill="#2D2A4A" font-weight="700">1</text>
    <text x="59" y="62" text-anchor="middle" font-size="9" fill="#2D2A4A" font-weight="700">2</text>
  </svg>`
};
