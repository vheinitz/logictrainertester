/**
 * Suchbilder, Wimmelbilder und Fehlersuche
 *
 * Format siehe README.md im selben Verzeichnis.
 */
export default {
  id: 'suchbilder-wimmelbilder',
  icon: '🔍',
  category: 'wahrnehmung',
  ages: '3-12',

  title: {
    de: 'Suchbilder, Wimmelbilder und Fehlersuche',
    ru: 'Поиск отличий, виммельбухи и картинки-искалки',
    en: 'Hidden-object pictures, busy pictures and spot-the-difference'
  },

  short: {
    de: 'Im Bildergewimmel gezielt Details finden oder Unterschiede zwischen zwei Bildern entdecken.',
    ru: 'Находить нужные детали в перенасыщенной картинке или различия между двумя изображениями.',
    en: 'Finding particular details in a crowded picture, or spotting the differences between two images.'
  },

  what: {
    de: 'Ein Wimmelbild zeigt hundert Dinge gleichzeitig, ein Fehlersuchbild zwei fast gleiche Szenen. ' +
        'In beiden Fällen muss das Kind sein Auge steuern, statt sich vom Bild treiben zu lassen – und ' +
        'genau das ist der Kern: nicht das Finden, sondern das planvolle Absuchen. Wer wahllos hin und ' +
        'her springt, findet die letzten zwei Unterschiede nie; wer Zeile für Zeile vorgeht, schon. ' +
        'Nebenbei liefert ein Wimmelbild endlos Gesprächsstoff, was es zu einem der besten ' +
        'Sprachanlässe für kleine Kinder macht. Einschränkung, die dazugehört: Solche Übungen ' +
        'verbessern das Suchen in Bildern; dass sich davon Lesen, Rechtschreibung oder allgemeine ' +
        'Konzentration bessern, ist trotz verbreiteter Werbeaussagen nicht belegt – klassische ' +
        'Wahrnehmungstrainings sind in dieser Hinsicht seit langem umstritten.',
    ru: 'Виммельбух показывает сто вещей сразу, картинка на поиск отличий — две почти одинаковые ' +
        'сцены. И там, и там ребёнку приходится управлять взглядом, а не поддаваться картинке, — в ' +
        'этом и суть: важно не само нахождение, а планомерный осмотр. Кто мечется по картинке ' +
        'наугад, последние два отличия не найдёт никогда; кто идёт полоса за полосой — найдёт. ' +
        'Вдобавок виммельбух даёт бесконечный повод для разговора, и это один из лучших речевых ' +
        'стимулов для малышей. Оговорка, которую нужно назвать: такие упражнения улучшают поиск в ' +
        'картинках; что от них становится лучше чтение, правописание или внимание в целом, — вопреки ' +
        'частым рекламным обещаниям не доказано, эффективность классических тренингов восприятия ' +
        'давно оспаривается.',
    en: 'A busy picture shows a hundred things at once, a spot-the-difference puzzle two almost ' +
        'identical scenes. In both cases the child has to steer its eye instead of letting the ' +
        'picture take over – and that is the heart of the matter: not the finding, but the ' +
        'methodical scanning. Whoever jumps back and forth at random will never find the last two ' +
        'differences; whoever works line by line will. Along the way a busy picture provides endless ' +
        'material for conversation, which makes it one of the best language prompts for young ' +
        'children. The limitation that belongs with it: such exercises improve searching in ' +
        'pictures; that reading, spelling or general concentration improve as a result is not proven, ' +
        'despite widespread advertising claims – classic perceptual training has long been disputed ' +
        'in this respect.'
  },

  steps: {
    de: [
      'Ein Wimmelbild aufschlagen und eine Minute nur gemeinsam anschauen, ohne Auftrag. Das Kind zeigt, was ihm auffällt, der Erwachsene fragt nach.',
      'Dann genau einen Suchauftrag geben, präzise formuliert: „Finde den Hund mit dem roten Halsband." Nicht drei Aufträge auf einmal.',
      'Systematisches Suchen vorzeigen: mit dem Finger oben links beginnen und die Seite streifenweise abfahren, wie beim Lesen. Beim zweiten Auftrag das Kind laut mitsprechen lassen, wo es gerade ist.',
      'Rollen tauschen: Das Kind sucht sich ein Detail aus und beschreibt es so, dass der Erwachsene es findet. Beschreiben ist schwerer als Suchen und lohnt sich doppelt.',
      'Fehlersuchbild: beide Bilder nebeneinander legen und mit dem Lineal gedanklich in vier Streifen teilen. Streifen für Streifen vergleichen, jeden gefundenen Unterschied sofort in beiden Bildern einkreisen.',
      'Die Anzahl vorher nennen („acht Unterschiede") und mitzählen. Wenn nur noch einer fehlt, den Streifen benennen, in dem er liegt – nicht die Stelle.',
      'Bei Wimmelbüchern eine Figur über mehrere Seiten verfolgen – die Frau, die den Bus verpasst, den entflogenen Vogel – und ihre Geschichte erzählen lassen.',
      'Nach fünf bis zehn Minuten aufhören, solange es noch Spaß macht. Das Buch bleibt liegen; Kinder kommen von selbst wieder.'
    ],
    ru: [
      'Открыть виммельбух и минуту просто рассматривать вместе, без задания. Ребёнок показывает, что заметил, взрослый расспрашивает.',
      'Затем дать ровно одно задание на поиск, сформулированное точно: «Найди собаку в красном ошейнике». Не три задания сразу.',
      'Показать, как искать по системе: начать пальцем сверху слева и проходить страницу полосами, как при чтении. Во втором задании пусть ребёнок вслух говорит, где он сейчас находится.',
      'Поменяться ролями: ребёнок выбирает деталь и описывает её так, чтобы взрослый её нашёл. Описывать труднее, чем искать, и пользы вдвое больше.',
      'Поиск отличий: положить обе картинки рядом и мысленно разделить линейкой на четыре полосы. Сравнивать полосу за полосой, каждое найденное отличие сразу обводить на обеих картинках.',
      'Число называть заранее («восемь отличий») и считать вслух. Если осталось одно, подсказать полосу, в которой оно находится, — но не место.',
      'В виммельбухах прослеживать одного персонажа через несколько разворотов — женщину, которая опаздывает на автобус, улетевшую птицу — и просить рассказать её историю.',
      'Заканчивать через пять-десять минут, пока ещё интересно. Книга остаётся лежать; дети возвращаются к ней сами.'
    ],
    en: [
      'Open a busy picture book and just look at it together for a minute, with no task attached. The child points out what it notices, the adult asks about it.',
      'Then give exactly one search task, precisely worded: “Find the dog with the red collar.” Not three tasks at once.',
      'Demonstrate systematic searching: start with a finger at the top left and work down the page in strips, as when reading. On the second task, let the child say out loud where it currently is.',
      'Swap roles: the child picks a detail and describes it so that the adult can find it. Describing is harder than searching and is worth twice as much.',
      'Spot-the-difference: lay both pictures side by side and divide them mentally into four strips with a ruler. Compare strip by strip and circle every difference found immediately in both pictures.',
      'Say the number in advance (“eight differences”) and count along. When only one is missing, name the strip it lies in – not the spot.',
      'In busy picture books, follow one figure across several spreads – the woman who misses the bus, the escaped bird – and have the child tell her story.',
      'Stop after five to ten minutes, while it is still fun. The book stays out; children come back to it by themselves.'
    ]
  },

  tips: {
    de: [
      'Wenn es stockt, nicht zeigen, sondern eingrenzen: „Es ist in der unteren Hälfte." Das Kind sucht weiter selbst – darum geht es.',
      'Das Ziel ist die Suchstrategie, nicht die Trefferzahl. Ein Kind, das ordentlich streifenweise abgesucht und sechs von acht gefunden hat, hat mehr geübt als eines, das acht zufällig entdeckte.',
      'Bei Frust die Aufgabe kleiner machen, statt anzufeuern: nur die obere Bildhälfte, nur drei Unterschiede.',
      'Für kleine Kinder ist das Wimmelbuch vor allem ein Sprachanlass. Fragen wie „Was macht der wohl gleich?" bringen mehr als noch ein Suchauftrag.'
    ],
    ru: [
      'Если поиск застопорился, не показывать, а сужать область: «Это в нижней половине». Ребёнок продолжает искать сам — в этом весь смысл.',
      'Цель — стратегия поиска, а не число находок. Ребёнок, который аккуратно прошёл картинку полосами и нашёл шесть из восьми, потренировался больше того, кто случайно наткнулся на восемь.',
      'При досаде уменьшать задание, а не подбадривать: только верхняя половина картинки, только три отличия.',
      'Для малышей виммельбух — прежде всего повод поговорить. Вопрос «Как думаешь, что он сейчас сделает?» даёт больше, чем ещё одно задание на поиск.'
    ],
    en: [
      'When it stalls, do not point – narrow it down: “It is in the lower half.” The child goes on searching by itself, and that is what this is about.',
      'The aim is the search strategy, not the number of hits. A child who has scanned neatly strip by strip and found six out of eight has practised more than one who came across eight by chance.',
      'If frustration builds, make the task smaller instead of cheering it on: only the upper half of the picture, only three differences.',
      'For young children the busy picture book is above all an occasion to talk. Questions such as “What do you think he is going to do next?” achieve more than another search task.'
    ]
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Wimmelbild', kind: 'wiki',
      label: { de: 'Wikipedia: Wimmelbild – Geschichte des Genres', ru: 'Википедия (нем.): виммельбильд, история жанра', en: 'Wikipedia (German): Wimmelbild – history of the genre' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%92%D0%B8%D0%BC%D0%BC%D0%B5%D0%BB%D1%8C%D0%B1%D1%83%D1%85', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Wimmelbuch', ru: 'Википедия: виммельбух', en: 'Wikipedia (Russian): Wimmelbuch' } },
    { url: 'https://de.wikipedia.org/wiki/Vexierbild', kind: 'wiki',
      label: { de: 'Wikipedia: Vexierbild – Suchbilder und Kippbilder erklärt', ru: 'Википедия (нем.): картинки-обманки и искалки', en: 'Wikipedia (German): puzzle pictures – hidden-object and ambiguous images explained' } },
    { url: 'https://www.ravensburger.de/de-DE/produkte/spiele/kinderspiele/differix-24930', kind: 'hersteller',
      label: { de: 'Ravensburger: Differix, Herstellerseite mit Spielinhalt', ru: 'Ravensburger: Differix, страница производителя', en: 'Ravensburger: Differix, manufacturer page with game contents' } }
  ],

  products: [
    {
      name: 'Differix',
      maker: 'Ravensburger',
      url: 'https://www.ravensburger.de/de-DE/produkte/spiele/kinderspiele/differix-24930',
      price: 'ca. 18 €',
      note: {
        de: 'Vier doppelseitige Legetafeln, 36 doppelseitige Kärtchen, eine Kontrollfolie; 4 bis 8 Jahre, ' +
            'auch allein spielbar. Jedes Kärtchen unterscheidet sich nur in einer Kleinigkeit vom ' +
            'Nachbarn, das Kind muss es der richtigen Stelle zuordnen. Die vier Tafeln sind gestuft: ' +
            'Elefant leicht, dann Schweinchen, Clown, Frosch. Die Kontrollfolie erlaubt es, ohne ' +
            'Erwachsenen zu prüfen – das ist der eigentliche Wert.',
        ru: 'Четыре двусторонние доски, 36 двусторонних карточек, контрольная плёнка; 4–8 лет, можно ' +
            'играть и одному. Каждая карточка отличается от соседней всего одной мелочью, ребёнок ' +
            'должен положить её на нужное место. Доски по возрастанию сложности: слон — самый лёгкий, ' +
            'затем поросёнок, клоун, лягушка. Контрольная плёнка позволяет проверять себя без ' +
            'взрослого — в этом и главная ценность.',
        en: 'Four double-sided boards, 36 double-sided cards, one control transparency; 4 to 8 years, ' +
            'can also be played alone. Each card differs from its neighbour in only one small detail, ' +
            'and the child has to place it in the right spot. The four boards are graded: elephant ' +
            'easy, then piglet, clown, frog. The control transparency allows checking without an ' +
            'adult – that is the real value.'
      }
    },
    {
      name: 'Winter-Wimmelbuch (Midi-Ausgabe)',
      maker: 'Rotraut Susanne Berner / Gerstenberg Verlag',
      url: 'https://www.gerstenberg-verlag.de/Kinderbuch/Wimmlingen/Winter-Wimmelbuch-Midi.html',
      price: 'ca. 8 €',
      note: {
        de: 'Pappbilderbuch ohne Text, sieben große Szenen aus dem Städtchen Wimmlingen, 2 bis 6 Jahre. ' +
            'Der Reiz liegt in den durchlaufenden Nebengeschichten: dieselben Figuren tauchen auf jeder ' +
            'Seite wieder auf, und über die vier Jahreszeitenbände hinweg altern sie sogar. Ideal, um ' +
            'eine Figur zu verfolgen und ihre Geschichte erzählen zu lassen.',
        ru: 'Картонная книжка без текста, семь больших сцен городка Виммлинген, 2–6 лет. Главная ' +
            'прелесть — сквозные побочные истории: одни и те же персонажи появляются на каждом ' +
            'развороте, а через четыре книги по временам года они даже взрослеют. Идеально, чтобы ' +
            'прослеживать одного героя и просить рассказать его историю.',
        en: 'A wordless board book, seven large scenes from the small town of Wimmlingen, 2 to 6 years. ' +
            'The appeal lies in the running side stories: the same figures reappear on every spread, ' +
            'and across the four seasonal volumes they even grow older. Ideal for following one ' +
            'figure and having the child tell its story.'
      }
    },
    {
      name: 'Wo ist Walter? (Buchreihe)',
      maker: 'Martin Handford / Fischer Sauerländer',
      url: 'https://www.fischer-sauerlaender.de/buch/reihe/wo-ist-walter',
      price: 'ca. 10–18 €',
      note: {
        de: 'Der Suchbild-Klassiker, ab etwa acht Jahren. Anders als beim Wimmelbuch gibt es hier ein ' +
            'festes Ziel und eine echte Schwierigkeit – das Absuchen nach System zahlt sich sofort aus. ' +
            'Die Reihe umfasst rund ein Dutzend Bände, dazu Rätselblöcke im gleichen Stil. Für jüngere ' +
            'Kinder zu voll; da ist ein Wimmelbuch besser.',
        ru: 'Классика жанра «найди героя», примерно с восьми лет. В отличие от виммельбуха здесь есть ' +
            'чёткая цель и настоящая трудность — систематический осмотр окупается сразу. В серии ' +
            'около десятка книг, а также блоки с заданиями в том же стиле. Для младших слишком плотно; ' +
            'им лучше подойдёт виммельбух.',
        en: 'The hidden-object classic, from about eight years on. Unlike a busy picture book there is ' +
            'a fixed goal here and a real difficulty – scanning by system pays off immediately. The ' +
            'series comprises around a dozen volumes, plus puzzle pads in the same style. Too crowded ' +
            'for younger children; a busy picture book suits them better.'
      }
    },
    {
      name: 'Fehlersuchbild aus einer Zeitschrift (Eigenbau)',
      maker: 'Selbstbau',
      price: 'ca. 0 €',
      note: {
        de: 'Selbstgemachte Fehlersuchbilder haben einen Vorteil, den kein Heft bietet: Der Erwachsene ' +
            'bestimmt die Schwierigkeit genau – zwei große Unterschiede für ein Vierjähriges, zwölf ' +
            'winzige für ein Zehnjähriges.',
        ru: 'У самодельных картинок на поиск отличий есть преимущество, которого нет ни у одной ' +
            'книжки: взрослый точно задаёт сложность — два крупных отличия для четырёхлетнего, ' +
            'двенадцать крошечных для десятилетнего.',
        en: 'Home-made spot-the-difference pictures have one advantage no booklet offers: the adult ' +
            'sets the difficulty exactly – two large differences for a four-year-old, twelve tiny ' +
            'ones for a ten-year-old.'
      },
      diy: {
        de: 'Eine detailreiche Seite aus einer Zeitschrift oder ein Foto zweimal ausdrucken bzw. ' +
            'kopieren, am besten in A5. Auf einer der beiden Kopien Details verändern: fünf bis acht ' +
            'kleine Dinge mit Korrekturroller wegnehmen (ein Knopf, ein Fenster, der Henkel einer ' +
            'Tasse), zwei bis drei mit Buntstift hinzufügen. Beide Blätter nebeneinander auf ein A4-Blatt ' +
            'kleben, oben die Anzahl der Unterschiede notieren, hinten die Auflösung als kleine Skizze. ' +
            'Laminieren oder in eine Klarsichthülle stecken, dann kann das Kind mit abwischbarem Stift ' +
            'einkreisen und das Blatt bleibt mehrfach brauchbar. Ein Wimmelbild lässt sich ähnlich ' +
            'bauen: A3-Bogen, 30 bis 40 Aufkleber und ein paar gezeichnete Häuser und Wege dazwischen – ' +
            'die Aufträge schreibt man auf Zettel und zieht sie aus einem Becher.',
        ru: 'Насыщенную деталями страницу из журнала или фотографию распечатать или скопировать дважды, ' +
            'лучше в формате A5. На одной из копий изменить детали: пять-восемь мелочей убрать ' +
            'корректором (пуговицу, окно, ручку чашки), две-три дорисовать цветным карандашом. Оба ' +
            'листа наклеить рядом на лист A4, сверху записать число отличий, на обороте — ответ в виде ' +
            'маленькой схемы. Заламинировать или вложить в файл: тогда ребёнок обводит смываемым ' +
            'маркером, и лист служит много раз. Виммельбух делается похоже: лист A3, 30–40 наклеек и ' +
            'несколько нарисованных между ними домов и дорожек, а задания пишут на бумажках и тянут ' +
            'из стаканчика.',
        en: 'Print or copy a detail-rich page from a magazine or a photo twice, ideally in A5. Change ' +
            'details on one of the two copies: remove five to eight small things with correction tape ' +
            '(a button, a window, the handle of a cup), add two or three with a coloured pencil. Glue ' +
            'both sheets side by side onto an A4 sheet, note the number of differences at the top and ' +
            'the solution as a small sketch on the back. Laminate it or slip it into a clear pocket, ' +
            'then the child can circle with a wipeable pen and the sheet stays usable several times. ' +
            'A busy picture can be built in a similar way: an A3 sheet, 30 to 40 stickers and a few ' +
            'drawn houses and paths in between – the tasks are written on slips of paper and drawn ' +
            'from a cup.'
      }
    }
  ],

  // Schemazeichnung: Lupe ueber einem Feld gleicher Formen, eine weicht ab
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="4" y="6" width="112" height="68" rx="4" fill="#F4F3FA"/>
    <circle cx="18" cy="20" r="5" fill="#D0CDE8"/>
    <circle cx="40" cy="20" r="5" fill="#D0CDE8"/>
    <circle cx="62" cy="20" r="5" fill="#D0CDE8"/>
    <circle cx="84" cy="20" r="5" fill="#D0CDE8"/>
    <circle cx="106" cy="20" r="5" fill="#D0CDE8"/>
    <circle cx="18" cy="42" r="5" fill="#D0CDE8"/>
    <circle cx="40" cy="42" r="5" fill="#D0CDE8"/>
    <rect x="57" y="37" width="10" height="10" rx="2" fill="var(--orange)"/>
    <circle cx="84" cy="42" r="5" fill="#D0CDE8"/>
    <circle cx="106" cy="42" r="5" fill="#D0CDE8"/>
    <circle cx="18" cy="64" r="5" fill="#D0CDE8"/>
    <circle cx="40" cy="64" r="5" fill="#D0CDE8"/>
    <circle cx="62" cy="64" r="5" fill="#D0CDE8"/>
    <circle cx="84" cy="64" r="5" fill="#D0CDE8"/>
    <circle cx="106" cy="64" r="5" fill="#D0CDE8"/>
    <circle cx="62" cy="42" r="17" fill="none" stroke="var(--primary)" stroke-width="3.5"/>
    <path d="M74 54 L88 68" stroke="var(--primary)" stroke-width="5" stroke-linecap="round"/>
  </svg>`
};
