/**
 * Muster- und Kombinationsspiele (SET, Qwirkle, Rummikub).
 * Format siehe README.md im selben Verzeichnis.
 */
export default {
  id: 'muster-kombinationsspiele',
  icon: '🃏',
  category: 'logik-denken',
  ages: '6-18',

  title: {
    de: 'Muster- und Kombinationsspiele (SET, Qwirkle, Rummikub)',
    ru: 'Игры на узоры и комбинации (SET, Qwirkle, Rummikub)',
    en: ''
  },

  short: {
    de: 'Karten- und Legespiele, bei denen Reihen nach mehreren Merkmalen gleichzeitig gebildet werden.',
    ru: 'Карточные и настольные игры, где ряды строят сразу по нескольким признакам.',
    en: ''
  },

  what: {
    de: 'In diesen Spielen zählt nie nur ein Merkmal: Bei SET müssen Farbe, Form, Anzahl und ' +
        'Füllung gleichzeitig stimmen, bei Qwirkle Farbe und Form, bei Rummikub Zahlenfolge und ' +
        'Farbe. Das Kind muss eine Regel im Kopf behalten, das ganze Feld danach absuchen und ' +
        'nach jedem Zug umschalten, weil sich die Lage geändert hat. Ein Übertrag auf Schulnoten ' +
        'ist nicht belegt und sollte auch nicht erwartet werden; der Wert liegt darin, dass ' +
        'Kinder hier freiwillig eine halbe Stunde an einer Denkaufgabe bleiben und Regeln ' +
        'ausprobieren, statt sie erklärt zu bekommen.',
    ru: 'В этих играх никогда не важен один-единственный признак: в SET одновременно должны ' +
        'сойтись цвет, форма, количество и заливка, в Qwirkle — цвет и форма, в «Руммикубе» — ' +
        'последовательность чисел и цвет. Ребёнку нужно удерживать правило в голове, просматривать ' +
        'по нему всё поле и после каждого хода перестраиваться, потому что расклад изменился. ' +
        'Перенос на школьные оценки не доказан, и ждать его не стоит; ценность в том, что ребёнок ' +
        'добровольно проводит полчаса над мыслительной задачей и нащупывает правила сам, а не ' +
        'получает их в виде объяснения.',
    en: ''
  },

  steps: {
    de: [
      'Mit SET anfangen, aber abgespeckt: nur die 27 roten Karten nehmen und davon neun offen auslegen. Damit fällt die Farbe als viertes Merkmal weg und es bleiben Anzahl, Form und Füllung.',
      'Die Regel nicht erklären, sondern zeigen: drei Karten hinlegen, die zusammenpassen, und für jedes Merkmal laut sagen „alle gleich" oder „alle verschieden". Dann drei Karten hinlegen, die kein Set sind, und sagen, woran es scheitert.',
      'Ohne Zeitdruck spielen: Wer ein Set sieht, legt die Hand darauf und erklärt es merkmalsweise. Erst wenn das sicher sitzt, alle 81 Karten und zwölf offene Karten benutzen.',
      'Qwirkle als zweites Spiel: 108 Steine, sechs Farben und sechs Formen. Eine Reihe darf entweder gleiche Farbe mit lauter verschiedenen Formen sein oder gleiche Form mit lauter verschiedenen Farben – und kein Stein darf in einer Reihe doppelt vorkommen. Sechs Steine in einer Reihe („Qwirkle") geben zwölf Punkte.',
      'Bei Qwirkle die ersten Partien ohne Punktezählen spielen: nur anlegen, bis die Steine alle sind. Das Rechnen kommt dazu, wenn das Legen sitzt.',
      'Rummikub für Kinder ab etwa acht: 106 Steine mit den Zahlen 1 bis 13 in vier Farben, jede Zahl doppelt. Gelegt werden entweder Folgen einer Farbe (5-6-7 blau) oder Gruppen gleicher Zahl in verschiedenen Farben. Der erste Auslegezug muss zusammen mindestens 30 Punkte ergeben.',
      'Nach dem Spiel eine Minute nachbesprechen, immer dieselbe Frage: „Welche Kombination hast du zuerst gesehen – und woran?" Das macht aus dem Zufallstreffer eine Suchstrategie.'
    ],
    ru: [
      'Начать с SET, но в облегчённом виде: взять только 27 красных карт и выложить из них девять. Цвет как четвёртый признак выпадает, остаются количество, форма и заливка.',
      'Правило не объяснять, а показать: выложить три подходящие карты и по каждому признаку вслух сказать «все одинаковые» или «все разные». Потом выложить три карты, которые сетом не являются, и назвать, из-за чего.',
      'Играть без спешки: увидел сет — накрыл рукой и объяснил по признакам. Только когда это уверенно получается, брать все 81 карту и выкладывать двенадцать.',
      'Qwirkle как вторая игра: 108 фишек, шесть цветов и шесть форм. Ряд — это либо один цвет с разными формами, либо одна форма с разными цветами, и ни одна фишка в ряду не повторяется. Шесть фишек в ряду («квиркл») дают двенадцать очков.',
      'Первые партии в Qwirkle играть без подсчёта очков: просто выкладывать, пока фишки не кончатся. Счёт добавляют, когда выкладывание освоено.',
      '«Руммикуб» — примерно с восьми лет: 106 фишек с числами от 1 до 13 в четырёх цветах, каждое число дважды. Выкладывают либо ряды одного цвета (5-6-7 синие), либо группы одинаковых чисел разного цвета. Первый выход должен давать в сумме не меньше 30 очков.',
      'После игры минута разбора, всегда один и тот же вопрос: «Какую комбинацию ты увидел первой — и по какому признаку?» Так случайная находка превращается в стратегию поиска.'
    ],
    en: []
  },

  tips: {
    de: [
      'Erwachsene spielen nicht auf Sieg. Bei SET ist ein einfacher Ausgleich: Das Kind darf drei Karten sammeln, bevor der Erwachsene überhaupt mitsuchen darf.',
      'Schnelligkeit ist bei SET nicht das Ziel. Wer hetzt, greift blind zu; wer ruhig ein Merkmal nach dem anderen prüft, findet mehr.',
      'Bei Rummikub die Zeituhr weglassen und die eigenen Steine offen vor sich hinstellen. Verdeckt halten kostet Arbeitsgedächtnis, das zum Kombinieren fehlt.',
      'Nach einem Fehlzug den Zug zurücknehmen lassen und gemeinsam ansehen, warum es nicht passt. Ein erklärter Fehler bringt mehr als ein gewonnenes Spiel.'
    ],
    ru: [
      'Взрослый не играет на победу. В SET простой способ уравнять: ребёнок собирает три карты, прежде чем взрослому вообще разрешается искать.',
      'Скорость в SET — не цель. Кто торопится, хватает наугад; кто спокойно проверяет признак за признаком, находит больше.',
      'В «Руммикубе» убрать таймер и держать свои фишки открыто на подставке. Прятать их — лишняя нагрузка на рабочую память, которой не хватит на комбинации.',
      'После неверного хода разрешить его вернуть и вместе разобрать, почему не подходит. Разобранная ошибка полезнее выигранной партии.'
    ],
    en: []
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Set_(Spiel)', kind: 'wiki',
      label: { de: 'Wikipedia: SET – Regeln und Kartenaufbau', ru: 'Википедия (нем.): SET, правила и устройство колоды', en: '' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%A1%D0%B5%D1%82_(%D0%B8%D0%B3%D1%80%D0%B0)', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): SET', ru: 'Википедия: Сет (игра)', en: '' } },
    { url: 'https://de.wikipedia.org/wiki/Qwirkle', kind: 'wiki',
      label: { de: 'Wikipedia: Qwirkle', ru: 'Википедия (нем.): Qwirkle', en: '' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%A0%D1%83%D0%BC%D0%BC%D0%B8%D0%BA%D1%83%D0%B1', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Rummikub', ru: 'Википедия: Руммикуб', en: '' } },
    { url: 'https://rummikub.com/rules/', kind: 'anleitung',
      label: { de: 'Offizielle Rummikub-Spielregeln (englisch)', ru: 'Официальные правила «Руммикуба» (на английском)', en: '' } }
  ],

  products: [
    {
      name: 'SET – Das Familienspiel',
      maker: 'Set Enterprises / PlayMonster (deutsche Ausgabe lange bei AMIGO)',
      url: 'https://www.playmonster.com/brands/set/',
      price: 'ca. 12–16 €',
      note: {
        de: '81 Karten, eine Regel, kein Spielbrett – passt in die Jackentasche. Angegeben ab ' +
            'acht Jahren; mit der reduzierten Einfarb-Variante geht es schon ab etwa sechs. ' +
            'Die deutsche AMIGO-Ausgabe steht dort derzeit nicht mehr im Katalog, die ' +
            'internationale Ausgabe hat mehrsprachige Regeln und identische Karten.',
        ru: '81 карта, одно правило, без игрового поля — помещается в карман. Указано «с восьми ' +
            'лет»; в облегчённом одноцветном варианте можно примерно с шести. Немецкое издание ' +
            'AMIGO сейчас отсутствует в их каталоге, международное издание идёт с правилами на ' +
            'нескольких языках и с теми же картами.',
        en: ''
      },
      // Drei Karten: ein gültiges Set (Anzahl verschieden, Form gleich, Farbe gleich)
      svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
        <rect x="6" y="14" width="30" height="52" rx="4" fill="#FFFFFF" stroke="#D0CDE8" stroke-width="2"/>
        <rect x="45" y="14" width="30" height="52" rx="4" fill="#FFFFFF" stroke="#D0CDE8" stroke-width="2"/>
        <rect x="84" y="14" width="30" height="52" rx="4" fill="#FFFFFF" stroke="#D0CDE8" stroke-width="2"/>
        <ellipse cx="21" cy="40" rx="8" ry="4.5" fill="var(--primary)"/>
        <ellipse cx="60" cy="32" rx="8" ry="4.5" fill="var(--primary)"/>
        <ellipse cx="60" cy="48" rx="8" ry="4.5" fill="var(--primary)"/>
        <ellipse cx="99" cy="26" rx="8" ry="4.5" fill="var(--primary)"/>
        <ellipse cx="99" cy="40" rx="8" ry="4.5" fill="var(--primary)"/>
        <ellipse cx="99" cy="54" rx="8" ry="4.5" fill="var(--primary)"/>
      </svg>`
    },
    {
      name: 'Qwirkle',
      maker: 'Schmidt Spiele',
      url: 'https://www.schmidtspiele.de/details/produkt/qwirkle.html',
      price: 'ca. 25–30 €',
      note: {
        de: '108 dicke Holzsteine, sechs Farben in sechs Formen. Angegeben ab sechs Jahren, und ' +
            'das stimmt: Ohne Punktezählen können Vorschulkinder mitlegen, das Rechnen kommt ' +
            'später dazu. Spiel des Jahres 2011. Es gibt eine Reisefassung mit kleineren ' +
            'Steinen – für kleine Hände und zum Sortieren ist die große Ausgabe besser.',
        ru: '108 толстых деревянных фишек, шесть цветов в шести формах. Указано «с шести лет», и ' +
            'это честно: без подсчёта очков выкладывать может и дошкольник, счёт добавляется ' +
            'позже. Игра года 2011 (Германия). Есть дорожная версия с мелкими фишками — для ' +
            'маленьких рук и для раскладки лучше большое издание.',
        en: ''
      }
    },
    {
      name: 'Rummikub (Original)',
      maker: 'Jumbo Group / Lemada Light Industries',
      url: 'https://rummikub.com/',
      price: 'ca. 20–28 €',
      note: {
        de: '106 Steine, vier Ablagebänke, Zahlen 1–13 in vier Farben. Angegeben ab sieben ' +
            'Jahren, sinnvoll wird es mit sicherem Zahlenraum bis 13 – meist ab acht. Für ' +
            'jüngere Kinder gibt es „Rummikub Junior" mit Bildern statt Zahlen. Auf die ' +
            'Original-Ausgabe achten: Billigkopien haben rutschige, zu dünne Steine.',
        ru: '106 фишек, четыре подставки, числа 1–13 в четырёх цветах. Указано «с семи лет», ' +
            'реально имеет смысл при уверенном счёте до 13 — обычно с восьми. Для младших есть ' +
            '«Rummikub Junior» с картинками вместо чисел. Стоит брать оригинальное издание: у ' +
            'дешёвых копий фишки слишком тонкие и скользят.',
        en: ''
      }
    },
    {
      name: 'Zwei Blatt Romméekarten als Ersatz',
      maker: '',
      price: 'ca. 3 €',
      note: {
        de: 'Wer kein Rummikub kaufen will, kommt mit zwei gewöhnlichen Kartenspielen sehr weit: ' +
            'Folgen und Gruppen lassen sich genauso legen, nur bleiben die Karten liegen statt ' +
            'auf Bänkchen zu stehen.',
        ru: 'Если покупать «Руммикуб» не хочется, вполне хватит двух обычных колод: ряды и группы ' +
            'выкладываются точно так же, только карты лежат на столе, а не стоят на подставке.',
        en: ''
      },
      diy: {
        de: 'Aus zwei Blatt Romméekarten alle Bilder und Joker aussortieren, sodass die Werte 1 ' +
            'bis 10 in vier Farben doppelt übrig bleiben – das ist ein kleines Rummikub mit 80 ' +
            'Karten. Jeder zieht 14 Karten, der erste Auslegezug muss 30 Punkte ergeben, gelegt ' +
            'werden Folgen einer Farbe oder Gruppen gleicher Zahl. Als Ablagebank ein Stück ' +
            'Wellpappe 30 × 6 cm längs zur Hälfte knicken, dann stehen die Karten. Für eine ' +
            'SET-Nachbildung reichen 27 Karteikarten (A7), auf die man mit drei Filzstiften ein, ' +
            'zwei oder drei Kreise, Dreiecke oder Quadrate malt – jede Kombination genau einmal.',
        ru: 'Из двух колод для реми убрать все картинки и джокеры, останутся значения от 1 до 10 ' +
            'в четырёх мастях по два раза — это маленький «Руммикуб» из 80 карт. Каждый берёт 14 ' +
            'карт, первый выход должен давать 30 очков, выкладывают ряды одной масти или группы ' +
            'одинаковых чисел. Вместо подставки — полоса гофрокартона 30 × 6 см, согнутая вдоль ' +
            'пополам, тогда карты стоят. Для самодельного SET хватит 27 карточек формата A7: ' +
            'тремя фломастерами рисуют один, два или три круга, треугольника или квадрата — ' +
            'каждое сочетание ровно один раз.',
        en: ''
      }
    }
  ],

  // Legereihe: gleiche Form in verschiedenen Farben, gleiche Farbe in verschiedenen Formen
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="8" y="10" width="20" height="20" rx="3" fill="var(--primary)"/>
    <rect x="32" y="10" width="20" height="20" rx="3" fill="var(--accent)"/>
    <rect x="56" y="10" width="20" height="20" rx="3" fill="var(--orange)"/>
    <rect x="80" y="10" width="20" height="20" rx="3" fill="var(--green)"/>
    <circle cx="18" cy="44" r="9" fill="var(--primary)"/>
    <polygon points="42,53 33,53 42,35 51,53" fill="var(--primary)"/>
    <polygon points="66,35 75,44 66,53 57,44" fill="var(--primary)"/>
    <rect x="80" y="35" width="18" height="18" rx="9" fill="none" stroke="var(--primary)" stroke-width="3" stroke-dasharray="4 3"/>
    <rect x="8" y="62" width="92" height="6" rx="3" fill="#EDEBF8"/>
  </svg>`
};
