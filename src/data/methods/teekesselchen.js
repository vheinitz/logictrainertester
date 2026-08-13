/**
 * Teekesselchen und Mehrdeutigkeiten
 *
 * Wörter mit zwei Bedeutungen werden umschrieben und erraten. Braucht kein
 * Material, funktioniert im Auto, beim Warten und am Küchentisch.
 */
export default {
  id: 'teekesselchen',
  icon: '🫖',
  category: 'sprache',
  ages: '5-14',

  title: {
    de: 'Teekesselchen und Mehrdeutigkeiten',
    ru: '«Чайничек»: игры с многозначными словами',
    en: 'Teakettle: playing with words that have two meanings'
  },

  short: {
    de: 'Ein Wort mit zwei Bedeutungen wird umschrieben und erraten – Sprachbewusstheit im Spiel.',
    ru: 'Слово с двумя значениями описывают и отгадывают — языковое чутьё в игре.',
    en: 'A word with two meanings is described and guessed – language awareness in the form of a game.'
  },

  what: {
    de: 'Beim Teekesselchen einigen sich zwei Spieler heimlich auf ein Wort mit zwei Bedeutungen ' +
        '– „Bank", „Birne", „Schloss" – und beschreiben es abwechselnd, wobei sie das Wort selbst ' +
        'durch „mein Teekesselchen" ersetzen. Die anderen raten. Das Spiel wirkt, weil das Kind ' +
        'für einen Moment vom Inhalt einer Aussage auf das Wort selbst umschalten muss – diese ' +
        'Fähigkeit, Sprache als Gegenstand zu betrachten, nennt man Sprachbewusstheit und sie ' +
        'gilt als eine Voraussetzung für sicheres Lesen und Schreiben. Nebenbei übt es Umschreiben ' +
        'ohne das eigentliche Wort, was Kindern mit Wortfindungsschwierigkeiten sehr entgegenkommt.',
    ru: 'В «чайничке» двое игроков тайно договариваются о слове с двумя значениями — «ключ», ' +
        '«коса», «лук» — и по очереди его описывают, заменяя само слово на «мой чайничек». ' +
        'Остальные отгадывают. Игра работает потому, что ребёнку приходится на время переключиться ' +
        'с содержания высказывания на само слово: эту способность рассматривать язык как предмет ' +
        'называют языковым осознанием, и она считается одной из предпосылок уверенного чтения и ' +
        'письма. Попутно тренируется описание предмета без называния — это очень кстати детям, ' +
        'которым трудно подбирать слова.',
    en: 'In this game two players secretly agree on a word with two meanings – German “Bank”, ' +
        '“Birne”, “Schloss”, or English “bat”, “trunk”, “bark” – and describe it in turn, replacing ' +
        'the word itself with “my teakettle”. The others guess. The game works because for a moment ' +
        'the child has to switch from the content of a statement to the word itself – this ability ' +
        'to look at language as an object is called language awareness and counts as one of the ' +
        'prerequisites for confident reading and writing. On top of that it practises paraphrasing ' +
        'without using the actual word, which suits children with word-finding difficulties very well.'
  },

  steps: {
    de: [
      'Das Prinzip an einem Beispiel zeigen, nicht erklären: „Mein Teekesselchen steht im Park und man kann sich daraufsetzen. Mein Teekesselchen bewahrt Geld auf." – Lösung: die Bank.',
      'Mit dem Kind gemeinsam sammeln, welche Wörter zwei Bedeutungen haben. Fünf reichen für den Anfang: Bank, Birne, Maus, Schloss, Blatt.',
      'Zu zweit spielen: Sie nennen abwechselnd mit dem Kind je eine Umschreibung, ein Dritter rät. Sind Sie nur zu zweit, übernimmt einer beide Bedeutungen und der andere rät.',
      'Regel einführen: Das gesuchte Wort darf nicht vorkommen, auch nicht in Zusammensetzungen. Wer „Parkbank" sagt, hat verraten – dann ist der andere dran.',
      'Punkte vergeben, die den Ehrgeiz in die richtige Richtung lenken: Wer nach nur einem Hinweis errät, bekommt drei Punkte, nach zweien zwei, danach einen.',
      'Schwerer machen, sobald es leicht fällt: Wörter mit drei Bedeutungen (Zug, Ball, Flügel) oder Umschreibungen, die keine Handlung nennen, sondern nur Aussehen und Ort.',
      'Aufschreiben, was gespielt wurde: ein kleines Heft mit den gefundenen Teekesselchen. Nach ein paar Wochen entdeckt das Kind neue von selbst und bringt sie mit.',
      'Auf Russisch mitspielen, wenn zu Hause zwei Sprachen gesprochen werden: „ключ", „коса", „лук", „ручка", „кисть". Die Mehrdeutigkeiten decken sich meist nicht – gerade das macht es interessant.'
    ],
    ru: [
      'Показать принцип на примере, а не объяснять: «Мой чайничек стоит в парке, на него можно сесть. Мой чайничек хранит деньги». Отгадка — «банк / скамейка» (по-немецки одно слово Bank).',
      'Вместе с ребёнком собрать слова с двумя значениями. Для начала хватит пяти: ключ, коса, лук, ручка, кисть.',
      'Играть вдвоём: вы и ребёнок по очереди даёте по одному описанию, третий отгадывает. Если вас только двое, один берёт оба значения, другой отгадывает.',
      'Ввести правило: искомое слово называть нельзя, в том числе в составе других слов. Сказал «ключевая вода» — выдал, ход переходит к другому.',
      'Ввести очки так, чтобы азарт шёл в нужную сторону: отгадал с одной подсказки — три очка, с двух — два, дальше — одно.',
      'Усложнять, как только станет легко: слова с тремя значениями (ключ, кисть, коса) или описания без действий — только внешний вид и место.',
      'Записывать сыгранное: небольшая тетрадь с найденными «чайничками». Через несколько недель ребёнок начнёт находить новые сам и приносить их.',
      'Играть и по-немецки, если дома звучат два языка: Bank, Birne, Schloss, Maus, Blatt. Многозначности в языках почти не совпадают — этим и интересно.'
    ],
    en: [
      'Show the principle with an example instead of explaining it: “My teakettle stands in the park and you can sit on it. My teakettle keeps money safe.” – the answer is the German word Bank, which means both bench and bank; in English the same works with bat, trunk or bark.',
      'Collect words with two meanings together with the child. Five are enough to begin with: bat, trunk, bark, ring, leaf – in German Bank, Birne, Maus, Schloss, Blatt.',
      'Play in pairs: you and the child take turns giving one description each, a third person guesses. If there are only two of you, one takes both meanings and the other guesses.',
      'Introduce the rule: the word being sought must not be spoken, not even inside a compound. Whoever says “baseball bat” has given it away – then it is the other player’s turn.',
      'Award points that steer the ambition in the right direction: whoever guesses after only one clue gets three points, after two clues two points, after that one.',
      'Make it harder as soon as it comes easily: words with three meanings (spring, pitch, ring) or descriptions that name no action at all, only appearance and place.',
      'Write down what has been played: a small notebook with the words found. After a few weeks the child starts discovering new ones by itself and bringing them along.',
      'Play in Russian as well if two languages are spoken at home: “ключ”, “коса”, “лук”, “ручка”, “кисть”. The ambiguities usually do not match up between languages – and that is exactly what makes it interesting.'
    ]
  },

  tips: {
    de: [
      'Erst ab etwa fünf Jahren sinnvoll, und dann nur mit Wörtern, deren beide Bedeutungen das Kind wirklich kennt. „Kiefer" scheitert nicht am Spiel, sondern am Wortschatz.',
      'Nicht auflösen, sondern nachhelfen: einen dritten, leichteren Hinweis geben. Ein aufgelöstes Rätsel ist für das Kind kein gewonnenes.',
      'Homonyme (zufällig gleich, etwa „Bank") und mehrdeutige Wörter (verwandte Bedeutungen, etwa „Blatt") nicht trennen – für das Spiel ist der Unterschied ohne Belang.',
      'Gut geeignet für unterwegs: im Auto, in der Schlange, beim Warten auf das Essen. Genau dann, wenn sonst das Telefon herauskommt.'
    ],
    ru: [
      'Имеет смысл примерно с пяти лет и только со словами, оба значения которых ребёнок действительно знает. «Гриф» проваливается не из-за игры, а из-за словарного запаса.',
      'Не выдавать ответ, а помогать: дать третью, более лёгкую подсказку. Разгаданная за ребёнка загадка для него не выиграна.',
      'Не разделять омонимы (совпали случайно, например «ключ») и многозначные слова (значения связаны, например «кисть») — для игры разница несущественна.',
      'Хорошо подходит для дороги: в машине, в очереди, в ожидании еды. Ровно тогда, когда иначе достают телефон.'
    ],
    en: [
      'Only worthwhile from about five years, and then only with words whose two meanings the child really knows. A word like “crane” fails not because of the game but because of vocabulary.',
      'Do not give the answer away, help along instead: offer a third, easier clue. A puzzle that has been solved for the child is not one the child has won.',
      'Do not separate homonyms (identical by chance, such as “bat”) from polysemous words (related meanings, such as “leaf”) – for the game the difference is irrelevant.',
      'Well suited to being out and about: in the car, in a queue, while waiting for food. Precisely when the phone would otherwise come out.'
    ]
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Teekesselchen', kind: 'wiki',
      label: { de: 'Wikipedia: Teekesselchen – Regeln, Varianten, Geschichte',
               ru: 'Википедия (нем.): игра «Teekesselchen» — правила и варианты', en: 'Wikipedia (German): Teekesselchen – rules, variants, history' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%9E%D0%BC%D0%BE%D0%BD%D0%B8%D0%BC%D1%8B', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Homonyme – viele Beispiele als Wortvorrat',
               ru: 'Википедия: омонимы — много примеров, готовый запас слов', en: 'Wikipedia (Russian): homonyms – plenty of examples as a stock of words' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BB%D0%B8%D1%81%D0%B5%D0%BC%D0%B8%D1%8F', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Polysemie – Wörter mit verwandten Mehrfachbedeutungen',
               ru: 'Википедия: полисемия — слова с несколькими связанными значениями', en: 'Wikipedia (Russian): polysemy – words with several related meanings' } }
  ],

  products: [
    {
      name: 'Teekesselchen – Die Kinderedition (Kartenspiel)',
      maker: 'riva Verlag',
      url: 'https://www.m-vg.de/riva/shop/article/23992-teekesselchen-die-kinderedition/',
      price: 'ca. 9 €',
      note: {
        de: 'Kartenspiel mit fertigen Teekesselchen, ab 6 Jahren, für 2 und mehr Spieler. Nimmt ' +
            'einem das Sammeln der Wörter ab und ist damit vor allem für den Anfang praktisch. ' +
            'Achtung: Das Spiel wird häufig als HABA-Titel gehandelt, im aktuellen HABA-Programm ' +
            'ist es aber nicht mehr geführt – die lieferbare Ausgabe kommt vom riva Verlag.',
        ru: 'Карточная игра с готовыми «чайничками», с 6 лет, для двух и более игроков. Избавляет ' +
            'от необходимости самим собирать слова и потому удобна прежде всего на старте. ' +
            'Внимание: игру часто приписывают издательству HABA, но в текущем ассортименте HABA её ' +
            'нет — доступное издание выпускает riva Verlag.',
        en: 'A card game with ready-made ambiguous words (in German), from 6 years, for 2 or more ' +
            'players. It takes the collecting of words off your hands and is therefore useful above ' +
            'all at the start. Note: the game is often traded as a HABA title, but it is no longer ' +
            'listed in the current HABA range – the edition available comes from riva Verlag.'
      }
    },
    {
      name: 'Teekesselchen – Die Familienedition (Kartenspiel)',
      maker: 'riva Verlag',
      url: 'https://www.m-vg.de/riva/shop/article/23993-teekesselchen-die-familienedition/',
      price: 'ca. 9 €',
      note: {
        de: 'Dieselbe Spielidee mit schwierigeren Wörtern, gedacht für gemischte Runden aus ' +
            'Erwachsenen und älteren Kindern. Sinnvoll erst, wenn die Kinderedition zu leicht ' +
            'geworden ist; für Erstklässler ist der Wortschatz zu weit weg.',
        ru: 'Та же идея, но со словами потруднее, для смешанных компаний из взрослых и детей ' +
            'постарше. Имеет смысл только тогда, когда детское издание стало слишком лёгким; для ' +
            'первоклассника словарь здесь далековат.',
        en: 'The same idea with harder words, intended for mixed rounds of adults and older children. ' +
            'Only worthwhile once the children’s edition has become too easy; for a first-year pupil ' +
            'the vocabulary is too far away.'
      }
    },
    {
      name: 'Wortkarten mit Doppelbedeutungen (Eigenbau)',
      maker: 'Selbstgemacht',
      price: 'Materialkosten unter 3 €',
      note: {
        de: 'Selbstgemachte Karten haben einen Vorteil gegenüber jedem gekauften Spiel: Sie ' +
            'enthalten nur Wörter, die dieses Kind kennt, und lassen sich zweisprachig anlegen. ' +
            'Neue Karten schreibt das Kind mit der Zeit selbst – das ist bereits die halbe Übung.',
        ru: 'У самодельных карточек есть преимущество перед любой покупной игрой: в них только те ' +
            'слова, которые этот ребёнок знает, и их можно вести на двух языках. Со временем новые ' +
            'карточки ребёнок пишет сам — а это уже половина упражнения.',
        en: 'Home-made cards have an advantage over any bought game: they contain only words this ' +
            'particular child knows, and they can be set up bilingually. In time the child writes new ' +
            'cards itself – and that is already half the exercise.'
      },
      diy: {
        de: 'Karteikarten A7 (7,4 × 10,5 cm) oder halbierte Postkarten. Vorderseite: das Wort. ' +
            'Rückseite: beide Bedeutungen in Stichworten, damit auch ein Geschwisterkind die ' +
            'Runde leiten kann. Deutsch: Bank, Birne, Maus, Schloss, Blatt, Zug, Ball, Hahn, ' +
            'Flügel, Decke, Läufer, Kiefer, Schimmel, Golf, Kiwi. Russisch: ключ, коса, лук, ' +
            'ручка, кисть, норка, лисичка, мышка, гриф, кран, свет, язык, острый, лист. Rote Ecke ' +
            'für leicht, blaue für schwer – dann kann man die Schwierigkeit ohne Sortieren wählen. ' +
            'Aufbewahrung in einer Zigarrenkiste oder einem Gefrierbeutel.',
        ru: 'Карточки формата A7 (7,4 × 10,5 см) или разрезанные пополам открытки. Лицевая сторона — ' +
            'слово. Оборот — оба значения тезисами, чтобы вести кон мог и старший брат или сестра. ' +
            'По-русски: ключ, коса, лук, ручка, кисть, норка, лисичка, мышка, гриф, кран, свет, ' +
            'язык, острый, лист. По-немецки: Bank, Birne, Maus, Schloss, Blatt, Zug, Ball, Hahn, ' +
            'Flügel, Decke, Läufer, Kiefer, Schimmel, Golf, Kiwi. Красный уголок — лёгкие, синий — ' +
            'трудные: так уровень выбирается без перебора. Хранить в коробке из-под сигар или в ' +
            'пакете с зип-застёжкой.',
        en: 'A7 index cards (7.4 × 10.5 cm) or postcards cut in half. Front: the word. Back: both ' +
            'meanings in key words, so that a sibling can run the round as well. English: bat, bark, ' +
            'trunk, ring, leaf, spring, pitch, match, seal, light, crane, palm, nail, wave. German: ' +
            'Bank, Birne, Maus, Schloss, Blatt, Zug, Ball, Hahn, Flügel, Decke, Läufer, Kiefer, ' +
            'Schimmel, Golf, Kiwi. Russian: ключ, коса, лук, ручка, кисть, норка, лисичка, мышка, ' +
            'гриф, кран, свет, язык, острый, лист. A red corner for easy, a blue one for hard – then ' +
            'the difficulty can be chosen without sorting. Keep them in a cigar box or a freezer bag.'
      }
    }
  ],

  // Schemazeichnung: ein Wort, zwei Bedeutungen
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="40" y="6" width="40" height="20" rx="6" fill="var(--primary)"/>
    <text x="60" y="20" text-anchor="middle" font-size="9" fill="#fff" font-weight="700">Wort</text>
    <path d="M52 28 L28 44 M68 28 L92 44" fill="none" stroke="#D0CDE8"
          stroke-width="2.5" stroke-linecap="round" stroke-dasharray="4 3"/>
    <rect x="6" y="46" width="44" height="26" rx="6" fill="#fff" stroke="var(--green)" stroke-width="2.5"/>
    <rect x="14" y="56" width="28" height="4" rx="2" fill="var(--green)"/>
    <rect x="14" y="63" width="18" height="4" rx="2" fill="var(--green)"/>
    <rect x="70" y="46" width="44" height="26" rx="6" fill="#fff" stroke="var(--orange)" stroke-width="2.5"/>
    <rect x="78" y="56" width="28" height="4" rx="2" fill="var(--orange)"/>
    <rect x="78" y="63" width="18" height="4" rx="2" fill="var(--orange)"/>
  </svg>`
};
