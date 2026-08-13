/**
 * Logik- und Knobelspiele (Brettspiele)
 *
 * Einzelspieler-Puzzles mit Aufgabenkarten in Schwierigkeitsstufen.
 * Format siehe README.md.
 */
export default {
  id: 'logik-knobelspiele',
  icon: '🧩',
  category: 'logik-denken',
  ages: '5-18',

  title: {
    de: 'Logik- und Knobelspiele (Brettspiele)',
    ru: 'Логические и головоломные настольные игры',
    en: 'Logic and puzzle games (board games)'
  },

  short: {
    de: 'Einzel- oder Familienspiele mit Aufgabenkarten in Schwierigkeitsstufen, bei denen man vorausdenken statt raten muss.',
    ru: 'Игры для одного или для семьи с карточками заданий по уровням сложности, где нужно продумывать ходы, а не угадывать.',
    en: 'Single-player or family games with challenge cards in graded difficulty levels, where you have to think ahead instead of guessing.'
  },

  what: {
    de: 'Ein Brett, ein Satz Steine und ein Heft mit Aufgaben, die von „in zwei Zügen" bis ' +
        '„Experte" durchnummeriert sind. Die Lösung steht hinten im Heft, deshalb kontrolliert ' +
        'sich das Kind selbst und braucht keinen Erwachsenen, der bewertet. Der Reiz liegt darin, ' +
        'dass Probieren irgendwann nicht mehr reicht: ab Stufe drei muss man zwei, drei Züge im ' +
        'Kopf vorausrechnen und einen naheliegenden Zug bewusst zurückhalten. Dass sich das auf ' +
        'Mathematik oder Schulnoten überträgt, ist nicht belegt – was verlässlich wächst, sind ' +
        'Ausdauer vor einem ungelösten Problem und der Umgang mit Fehlversuchen.',
    ru: 'Поле, набор фишек и брошюра с задачами, пронумерованными от «в два хода» до «эксперт». ' +
        'Решение напечатано в конце, поэтому ребёнок проверяет себя сам, и взрослый-оценщик ему ' +
        'не нужен. Соль в том, что перебор в какой-то момент перестаёт работать: начиная с ' +
        'третьего уровня нужно просчитывать два-три хода в уме и сознательно удерживаться от ' +
        'напрашивающегося хода. Перенос на математику или школьные оценки не доказан — надёжно ' +
        'растут выдержка перед нерешённой задачей и отношение к неудачным попыткам.',
    en: 'A board, a set of pieces and a booklet of challenges numbered from "in two moves" to ' +
        '"expert". The solution is printed at the back, so the child checks itself and needs no ' +
        'adult to pass judgement. The appeal lies in the fact that trial and error stops working ' +
        'at some point: from level three onwards you have to calculate two or three moves ahead ' +
        'in your head and deliberately hold back an obvious move. That this transfers to ' +
        'mathematics or school grades is not proven – what does reliably grow is stamina in the ' +
        'face of an unsolved problem and the ability to deal with failed attempts.'
  },

  steps: {
    de: [
      'Ein Spiel mit Aufgabenheft wählen, nicht ein Spiel mit Würfel und Glück. Ab fünf Jahren Rush Hour Junior oder Katamino, ab acht Rush Hour, Solitaire Chess, IQ Puzzler Pro.',
      'Bei Aufgabe 1 anfangen, auch wenn sie lächerlich leicht wirkt. Die ersten zehn Aufgaben sind der Regelunterricht, nicht die Aufwärmrunde.',
      'Aufgabe aufbauen und vom Kind gegenlesen lassen: „Steht alles genau wie auf der Karte?" Ein falsch gestellter Startaufbau ist der häufigste Grund für unlösbare Aufgaben.',
      'Vor dem ersten Zug fragen: „Welcher Stein muss am Ende weg sein – und was steht ihm im Weg?" Diese eine Frage macht aus Schieben Planen.',
      'Höchstens zwanzig Minuten an einer Aufgabe. Danach weglegen und morgen wieder hinsehen; Knobelaufgaben lösen sich mit Abstand oft in zwei Minuten.',
      'Die Lösung erst aufschlagen, wenn das Kind es verlangt – und dann nur den ersten Zug zeigen, nie die ganze Folge.',
      'Gelöste Aufgabennummern abhaken. Sichtbarer Fortschritt hält bei der Stange, wenn die Stufen härter werden.',
      'Wenn drei Aufgaben in Folge scheitern, eine Stufe zurückgehen. Die Spiele sind so gebaut, dass jede Stufe die vorherige voraussetzt.'
    ],
    ru: [
      'Выбирать игру с брошюрой заданий, а не игру с кубиком и везением. С пяти лет — Rush Hour Junior или Katamino, с восьми — Rush Hour, Solitaire Chess, IQ Puzzler Pro.',
      'Начинать с задачи № 1, даже если она кажется до смешного лёгкой. Первые десять заданий — это обучение правилам, а не разминка.',
      'Расставить задание и попросить ребёнка сверить: «Всё стоит точно как на карточке?» Неверная стартовая расстановка — самая частая причина «нерешаемых» задач.',
      'Перед первым ходом спросить: «Какая фишка должна в конце уехать — и что ей мешает?» Один этот вопрос превращает двигание в планирование.',
      'Не больше двадцати минут на одну задачу. Потом отложить и вернуться завтра; на свежую голову головоломки часто решаются за две минуты.',
      'Открывать решение только по требованию ребёнка — и показывать лишь первый ход, никогда всю цепочку.',
      'Отмечать номера решённых заданий. Видимый прогресс держит интерес, когда уровни становятся жёстче.',
      'Если три задания подряд не выходят, вернуться на уровень назад. Игры построены так, что каждый уровень опирается на предыдущий.'
    ],
    en: [
      'Choose a game with a challenge booklet, not a game with dice and luck. From five years Rush Hour Junior or Katamino, from eight Rush Hour, Solitaire Chess, IQ Puzzler Pro.',
      'Start with challenge 1, even if it looks ridiculously easy. The first ten challenges are the rules lesson, not the warm-up round.',
      'Set up the challenge and have the child check it: "Is everything exactly as on the card?" A wrongly set up starting position is the most common reason for unsolvable challenges.',
      'Before the first move, ask: "Which piece has to be gone at the end – and what is in its way?" This one question turns pushing into planning.',
      'No more than twenty minutes on one challenge. After that put it away and look at it again tomorrow; with some distance, puzzles often solve themselves in two minutes.',
      'Only open the solutions when the child asks for it – and then show only the first move, never the whole sequence.',
      'Tick off the numbers of solved challenges. Visible progress keeps children going when the levels get harder.',
      'If three challenges in a row fail, go back one level. The games are built so that each level assumes the previous one.'
    ]
  },

  tips: {
    de: [
      'Nicht mitspielen und nicht zusehen und mitdenken. Ein Erwachsener, der neben dem Brett sitzt und die Augenbraue hebt, nimmt dem Kind die Lösung weg.',
      'Aufgabenhefte nicht durcheinanderwerfen: Wer die Expertenaufgaben vorzieht, verliert nach zwei Fehlschlägen die Lust am ganzen Spiel.',
      'Ein Spiel reicht für Monate. Fünf Kartons im Regal führen dazu, dass keiner über Stufe zwei hinauskommt.'
    ],
    ru: [
      'Не играть вместе и не сидеть рядом, думая за ребёнка. Взрослый у поля, поднимающий бровь, отбирает у ребёнка решение.',
      'Не перемешивать уровни: тот, кто забегает к экспертным заданиям, после двух провалов теряет интерес ко всей игре.',
      'Одной игры хватает на месяцы. Пять коробок на полке приводят к тому, что ни в одной не проходят дальше второго уровня.'
    ],
    en: [
      'Do not play along and do not sit watching and thinking along. An adult who sits next to the board and raises an eyebrow takes the solution away from the child.',
      'Do not mix up the levels: anyone who jumps ahead to the expert challenges loses interest in the whole game after two failures.',
      'One game lasts for months. Five boxes on the shelf lead to nobody getting past level two in any of them.'
    ]
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Rush_Hour_(Spiel)', kind: 'wiki',
      label: { de: 'Wikipedia: Rush Hour – Regeln und Hintergrund', ru: 'Википедия (нем.): Rush Hour — правила и история', en: 'Wikipedia (German): Rush Hour – rules and background' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D0%BB%D0%BE%D0%B2%D0%BE%D0%BB%D0%BE%D0%BC%D0%BA%D0%B0', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Knobelspiele im Überblick', ru: 'Википедия: головоломка — виды и обзор', en: 'Wikipedia (Russian): puzzles – types and overview' } },
    { url: 'https://www.ravensburger.de/de-DE/thinkfun', kind: 'hersteller',
      label: { de: 'ThinkFun bei Ravensburger: alle Logikspiele', ru: 'ThinkFun у Ravensburger: все логические игры', en: 'ThinkFun at Ravensburger: all logic games' } },
    { url: 'https://www.smartgames.eu/uk/our-games', kind: 'hersteller',
      label: { de: 'SmartGames: Ein-Spieler-Logikspiele', ru: 'SmartGames: логические игры для одного игрока', en: 'SmartGames: single-player logic games' } }
  ],

  products: [
    {
      name: 'Rush Hour',
      maker: 'ThinkFun / Ravensburger',
      url: 'https://www.ravensburger.de/de-DE/produkte/spiele/denkspiele/rush-hour-76599',
      price: 'ca. 23 €',
      note: {
        de: 'Der Klassiker: das rote Auto aus dem Stau befreien, indem man die anderen fünfzehn ' +
            'Fahrzeuge zur Seite schiebt. 40 Aufgabenkarten in vier Stufen, ab 8 Jahren, für ' +
            'einen Spieler. Für Fünf- bis Siebenjährige gibt es Rush Hour Junior mit ' +
            'Eiswagen-Motiv und leichteren Aufgaben. Erweiterungssets mit zusätzlichen Karten ' +
            'sind einzeln erhältlich, lohnen aber erst, wenn alle 40 Aufgaben durch sind.',
        ru: 'Классика: вывести красную машину из пробки, отодвигая остальные пятнадцать ' +
            'автомобилей. 40 карточек заданий в четырёх уровнях, с 8 лет, для одного игрока. Для ' +
            'пяти-семилетних есть Rush Hour Junior с фургончиком мороженого и более лёгкими ' +
            'заданиями. Дополнительные наборы карточек продаются отдельно, но имеют смысл лишь ' +
            'после того, как пройдены все 40 задач.',
        en: 'The classic: free the red car from the traffic jam by sliding the other fifteen ' +
            'vehicles out of the way. 40 challenge cards in four levels, from 8 years, for one ' +
            'player. For five- to seven-year-olds there is Rush Hour Junior with an ice cream ' +
            'van theme and easier challenges. Expansion sets with additional cards are ' +
            'available separately, but only pay off once all 40 challenges are done.'
      },
      svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
        <rect x="24" y="4" width="72" height="72" rx="4" fill="#F3F1FA" stroke="#D0CDE8" stroke-width="2"/>
        <g stroke="#D0CDE8" stroke-width="1">
          <path d="M36 4V76M48 4V76M60 4V76M72 4V76M84 4V76"/>
          <path d="M24 16H96M24 28H96M24 40H96M24 52H96M24 64H96"/>
        </g>
        <rect x="38" y="42" width="34" height="8" rx="3" fill="#E05252"/>
        <rect x="26" y="6" width="8" height="22" rx="3" fill="var(--primary)"/>
        <rect x="62" y="18" width="22" height="8" rx="3" fill="var(--accent)"/>
        <rect x="86" y="30" width="8" height="34" rx="3" fill="var(--gold)"/>
        <rect x="38" y="66" width="22" height="8" rx="3" fill="var(--green)"/>
        <path d="M96 46h8" stroke="#E05252" stroke-width="3" stroke-linecap="round"/>
      </svg>`
    },
    {
      name: 'Solitaire Chess',
      maker: 'ThinkFun / Ravensburger',
      price: 'ca. 20 €',
      note: {
        de: 'Schachfiguren nach Vorlage aufstellen und dann schlagen, bis nur eine übrig ist – ' +
            'jeder Zug muss ein Schlagzug sein. Es gilt der normale Gangart der Figuren, ' +
            'Schachkenntnisse braucht man aber nicht: Wer den Springer-Zug kennt, kann sofort ' +
            'anfangen. Aufgaben in vier Stufen, ab 8 Jahren. Auf der deutschen Ravensburger-Seite ' +
            'unter der Marke ThinkFun gelistet, mal als Kartonspiel, mal als magnetische ' +
            'Reisefassung; die Artikelnummern wechseln, der Spielinhalt bleibt gleich.',
        ru: 'Расставить шахматные фигуры по образцу и снимать их, пока не останется одна — каждый ' +
            'ход обязан быть взятием. Фигуры ходят по обычным правилам, но знать шахматы не ' +
            'нужно: кто знает ход коня, может начинать сразу. Задания в четырёх уровнях, с 8 ' +
            'лет. На немецком сайте Ravensburger числится под маркой ThinkFun — то в картонной ' +
            'коробке, то в магнитной дорожной версии; артикулы меняются, содержание игры прежнее.',
        en: 'Set up the chess pieces according to a card and then capture them until only one is ' +
            'left – every move has to be a capture. The pieces move by the normal rules, but no ' +
            'chess knowledge is needed: anyone who knows the knight\'s move can start right ' +
            'away. Challenges in four levels, from 8 years. On the German Ravensburger site it ' +
            'is listed under the ThinkFun brand, sometimes as a cardboard box game, sometimes ' +
            'as a magnetic travel version; the article numbers change, the game content stays ' +
            'the same.'
      }
    },
    {
      name: 'IQ Puzzler Pro',
      maker: 'SmartGames',
      url: 'https://www.smartgames.eu/uk/one-player-games/iq-puzzler-pro-0',
      price: 'ca. 13 €',
      note: {
        de: '12 Kunststoffteile, ein Brett in Handygröße mit Klappdeckel, 120 Aufgaben in drei ' +
            'Spielarten: flach legen, auf der Rückseite anders flach legen, als Pyramide bauen. ' +
            'Ab 6 Jahren, aber die hinteren Aufgaben beschäftigen auch Erwachsene. Das beste ' +
            'Reisespiel der Reihe – alles bleibt im Deckel, nichts geht im Auto verloren.',
        ru: '12 пластиковых деталей, поле размером с телефон с откидной крышкой, 120 заданий в ' +
            'трёх режимах: выложить плоско, на обратной стороне выложить иначе, собрать ' +
            'пирамидой. С 6 лет, но задания из конца брошюры занимают и взрослых. Лучшая ' +
            'дорожная игра серии — всё держится под крышкой, в машине ничего не теряется.',
        en: '12 plastic pieces, a board the size of a mobile phone with a hinged lid, 120 ' +
            'challenges in three modes: lay flat, lay differently flat on the reverse side, ' +
            'build as a pyramid. From 6 years, but the later challenges keep adults busy too. ' +
            'The best travel game in the series – everything stays under the lid, nothing gets ' +
            'lost in the car.'
      }
    },
    {
      name: 'Katamino',
      maker: 'Gigamic',
      url: 'https://en.gigamic.com/family-games/104-katamino.html',
      price: 'ca. 30 €',
      note: {
        de: '12 Pentominos aus Holz und ein Schieber, mit dem man das Spielfeld schmaler oder ' +
            'breiter macht – so wächst die Schwierigkeit stufenlos mit dem Kind mit, von drei ' +
            'Steinen bis zu allen zwölf. Über 500 Aufgaben, ab 6 Jahren, dazu ein Zwei-Personen-' +
            'Modus. Robustes Holz, das auch von jüngeren Geschwistern überlebt wird.',
        ru: '12 деревянных пентамино и планка-ползунок, которой поле делается уже или шире, — так ' +
            'сложность плавно растёт вместе с ребёнком, от трёх деталей до всех двенадцати. ' +
            'Более 500 заданий, с 6 лет, плюс режим на двоих. Прочное дерево, которое переживёт ' +
            'и младших братьев-сестёр.',
        en: '12 wooden pentominoes and a slider that makes the playing field narrower or wider – ' +
            'so the difficulty grows continuously with the child, from three pieces up to all ' +
            'twelve. Over 500 challenges, from 6 years, plus a two-player mode. Sturdy wood ' +
            'that also survives younger siblings.'
      }
    }
  ],

  // Aufgabenkarte mit Stufen und Spielbrett
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="6" y="10" width="46" height="60" rx="4" fill="#F3F1FA" stroke="#D0CDE8" stroke-width="2"/>
    <rect x="12" y="17" width="34" height="4" rx="2" fill="var(--primary)"/>
    <rect x="12" y="26" width="26" height="4" rx="2" fill="#D0CDE8"/>
    <rect x="12" y="35" width="30" height="4" rx="2" fill="#D0CDE8"/>
    <circle cx="16" cy="55" r="4" fill="var(--green)"/>
    <circle cx="27" cy="55" r="4" fill="var(--gold)"/>
    <circle cx="38" cy="55" r="4" fill="var(--orange)"/>
    <rect x="62" y="10" width="52" height="60" rx="4" fill="#fff" stroke="#D0CDE8" stroke-width="2"/>
    <g stroke="#D0CDE8" stroke-width="1">
      <path d="M75 10V70M88 10V70M101 10V70"/>
      <path d="M62 25H114M62 40H114M62 55H114"/>
    </g>
    <rect x="65" y="42" width="23" height="9" rx="3" fill="#E05252"/>
    <rect x="91" y="13" width="9" height="22" rx="3" fill="var(--accent)"/>
    <rect x="65" y="58" width="22" height="9" rx="3" fill="var(--primary)"/>
  </svg>`
};
