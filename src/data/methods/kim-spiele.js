/**
 * Kim-Spiele – Gegenstände zeigen, abdecken, erinnern.
 *
 * Schwerpunkt der Seite ist der Selbstbau: das Material ist Alltagskram,
 * entscheidend sind die vier Sinnesvarianten und ihre Durchführung.
 */
export default {
  id: 'kim-spiele',
  icon: '🫖',
  category: 'gedaechtnis',
  ages: '4-14',

  title: {
    de: 'Kim-Spiele',
    ru: 'Игры Кима',
    en: 'Kim\'s Game'
  },

  short: {
    de: 'Gegenstände kurz zeigen, abdecken – und erinnern lassen, was da lag oder was fehlt.',
    ru: 'Показать предметы на короткое время, накрыть — и вспомнить, что лежало или чего не хватает.',
    en: 'Show objects briefly, cover them up – and have the child recall what was there or what is missing.'
  },

  what: {
    de: 'Der Name stammt aus Rudyard Kiplings Roman „Kim", in dem der Junge Steine auf einem ' +
        'Tablett einprägen muss; die Pfadfinder haben daraus eine feste Übung gemacht. Ein ' +
        'Tablett mit Gegenständen wird kurz gezeigt und abgedeckt, danach wird aufgezählt, ' +
        'ergänzt oder gesucht, was sich verändert hat. Es wirkt, weil das Kind in den wenigen ' +
        'Sekunden gezwungen ist, sich selbst eine Merkhilfe zu bauen – benennen, gruppieren, ' +
        'eine Geschichte daraus machen –, und weil man diese Strategie hinterher besprechen ' +
        'kann. Dass Kinder darin besser werden, ist gut zu beobachten; ein Übertrag auf ' +
        'Schulnoten ist damit nicht versprochen. Es gibt die Übung für alle Sinne: sehen, ' +
        'tasten, hören, riechen.',
    ru: 'Название пришло из романа Редьярда Киплинга «Ким», где мальчик должен запоминать ' +
        'камни на подносе; скауты превратили это в постоянное упражнение. Поднос с предметами ' +
        'показывают на несколько секунд и накрывают, а затем ребёнок перечисляет их, называет ' +
        'пропавший или находит, что изменилось. Работает потому, что за эти секунды ребёнок ' +
        'вынужден сам построить себе опору для запоминания — назвать, сгруппировать, придумать ' +
        'историю, — и потому что эту стратегию можно потом обсудить. То, что дети становятся в ' +
        'этом лучше, хорошо видно; перенос на школьные оценки при этом не обещан. Упражнение ' +
        'существует для всех чувств: зрение, осязание, слух, обоняние.',
    en: 'The name comes from Rudyard Kipling\'s novel "Kim", in which the boy has to memorise ' +
        'stones on a tray; the scouts turned this into a standard exercise. A tray with objects ' +
        'on it is shown briefly and then covered, after which the child lists them, names the ' +
        'missing one or works out what has changed. It works because in those few seconds the ' +
        'child is forced to build a memory aid for itself – naming, grouping, making a story out ' +
        'of it – and because that strategy can be discussed afterwards. That children get better ' +
        'at it is easy to observe; no transfer to school grades is promised with that. There is a ' +
        'version of the exercise for every sense: sight, touch, hearing, smell.'
  },

  steps: {
    de: [
      'Fünf Alltagsgegenstände auf ein Tablett legen, die nichts miteinander zu tun haben: Löffel, Radiergummi, Spielzeugauto, Schlüssel, Muschel.',
      'Zwanzig Sekunden ansehen lassen. Lautes Benennen ausdrücklich erlauben – das ist keine Mogelei, sondern die erste Merkstrategie.',
      'Ein Geschirrtuch darüberlegen. Das Kind zählt auf, was darunter liegt; ein Erwachsener hakt auf einem Zettel ab.',
      'Zweite Runde, gleiche Gegenstände: unter dem Tuch einen wegnehmen, aufdecken, fragen „Was fehlt?".',
      'Dritte Runde: nichts wegnehmen, sondern zwei Gegenstände vertauschen und fragen „Was hat sich verändert?".',
      'Schwierigkeit anpassen: alle fünf richtig erinnert – einen Gegenstand dazulegen. Weniger als drei – einen wegnehmen. Die Anzeigezeit bleibt bei zwanzig Sekunden.',
      'Sinne wechseln: Tast-Kim (Gegenstände im Stoffbeutel ertasten und benennen), Hör-Kim (Geräuschdosen schütteln und Paare finden), Riech-Kim (Duftgläser der Reihe nach riechen und wiedererkennen).',
      'Nach spätestens zehn Minuten aufhören, solange es noch Spaß macht. Zum Schluss fragen: „Wie hast du es dir gemerkt?"'
    ],
    ru: [
      'Положить на поднос пять бытовых предметов, не связанных друг с другом: ложку, ластик, игрушечную машинку, ключ, ракушку.',
      'Дать смотреть двадцать секунд. Проговаривать вслух прямо разрешить — это не жульничество, а первая стратегия запоминания.',
      'Накрыть кухонным полотенцем. Ребёнок перечисляет, что лежит под ним; взрослый отмечает на листке.',
      'Второй заход, те же предметы: под полотенцем убрать один, открыть и спросить: «Чего не хватает?»',
      'Третий заход: ничего не убирать, а поменять местами два предмета и спросить: «Что изменилось?»',
      'Подстроить сложность: вспомнил все пять — добавить один предмет. Меньше трёх — убрать один. Время показа остаётся двадцать секунд.',
      'Менять органы чувств: осязательный Ким (нащупать и назвать предметы в мешочке), слуховой Ким (потрясти шумовые баночки и найти пары), обонятельный Ким (по очереди понюхать баночки с запахами и узнать их).',
      'Заканчивать не позже чем через десять минут, пока ещё интересно. В конце спросить: «Как ты это запомнил?»'
    ],
    en: [
      'Put five everyday objects on a tray that have nothing to do with one another: a spoon, an eraser, a toy car, a key, a shell.',
      'Let the child look at them for twenty seconds. Expressly allow naming them out loud – that is not cheating but the first memory strategy.',
      'Lay a tea towel over them. The child lists what is underneath; an adult ticks the items off on a slip of paper.',
      'Second round, same objects: remove one from under the cloth, uncover it and ask "What is missing?".',
      'Third round: take nothing away, but swap two objects around and ask "What has changed?".',
      'Adjust the difficulty: all five remembered correctly – add one object. Fewer than three – take one away. The viewing time stays at twenty seconds.',
      'Change the senses: touch Kim (feel objects in a fabric bag and name them), sound Kim (shake noise tins and find the pairs), smell Kim (sniff scent jars one after another and recognise them again).',
      'Stop after ten minutes at the latest, while it is still fun. At the end ask: "How did you memorise it?"'
    ]
  },

  tips: {
    de: [
      'Die eigentliche Übung ist das Gespräch danach. „Wie hast du es dir gemerkt?" – wer antwortet „ich hab die drei Küchensachen zusammengetan", hat verstanden, worum es geht.',
      'Gegenstände, die zusammenpassen (Gabel, Löffel, Messer), sind leicht; für mehr Schwierigkeit möglichst unähnliche wählen, die sich nicht gruppieren lassen.',
      'Bei Tast-, Hör- und Riech-Kim die Augen mit einem weichen Tuch verbinden, statt „nicht gucken!" zu rufen. Das erspart den Streit ums Schummeln.',
      'Nicht als Prüfung aufziehen und keine Note vergeben. Wer sich sechs von sieben Dingen merkt, hat gut gearbeitet – die Sieben ist die Ausnahme, nicht die Norm.'
    ],
    ru: [
      'Настоящее упражнение — это разговор после. «Как ты это запомнил?» Тот, кто отвечает «я объединил три кухонные вещи», понял суть.',
      'Предметы, подходящие друг к другу (вилка, ложка, нож), запоминаются легко; для усложнения берите как можно более разные, которые не сгруппировать.',
      'При осязательном, слуховом и обонятельном Киме завязывайте глаза мягким платком, а не кричите «не подглядывай!». Это избавит от споров о жульничестве.',
      'Не превращать в экзамен и не ставить оценок. Кто запомнил шесть предметов из семи, поработал хорошо — семь это исключение, а не норма.'
    ],
    en: [
      'The real exercise is the conversation afterwards. "How did you memorise it?" – a child who answers "I put the three kitchen things together" has understood what it is about.',
      'Objects that belong together (fork, spoon, knife) are easy; for more difficulty choose ones as dissimilar as possible that cannot be grouped.',
      'For touch, sound and smell Kim, blindfold the child with a soft cloth instead of shouting "no looking!". That saves the argument about cheating.',
      'Do not set it up as a test and do not give marks. A child who remembers six things out of seven has worked well – seven is the exception, not the norm.'
    ]
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Kim-Spiel', kind: 'wiki',
      label: { de: 'Wikipedia: Kim-Spiel mit allen Sinnesvarianten', ru: 'Википедия (нем.): игра Кима и её варианты', en: 'Wikipedia (German): Kim\'s Game with all the sensory variants' } },
    { url: 'https://en.wikipedia.org/wiki/Kim%27s_Game', kind: 'wiki',
      label: { de: 'Wikipedia (englisch): Herkunft bei Kipling und den Pfadfindern', ru: 'Википедия (англ.): происхождение у Киплинга и скаутов', en: 'Wikipedia (English): origins in Kipling and the scouts' } },
    { url: 'https://nsportal.ru/detskiy-sad/raznoe/2015/03/28/kollektsiya-didakticheskih-igr-na-razvitie-pamyati-u-doshkolnikov', kind: 'anleitung',
      label: { de: 'Russische Spielesammlung: „Чего не стало?" und verwandte Übungen', ru: 'Картотека игр на развитие памяти: «Чего не стало?» и другие', en: 'Russian collection of games: "What is gone?" and related exercises' } }
  ],

  products: [
    {
      name: 'Tablett, Tuch und eine Kiste Alltagsgegenstände',
      maker: 'Eigenbau',
      price: '0 €',
      note: {
        de: 'Das Grundmaterial für Seh-Kim. Mehr braucht die Methode nicht – gekaufte ' +
            'Merkspiele bieten nichts, was ein Backblech und ein Geschirrtuch nicht auch ' +
            'können, und die eigenen Gegenstände lassen sich beliebig schwer machen.',
        ru: 'Основной материал для зрительного Кима. Больше методу ничего не нужно — покупные ' +
            'игры на запоминание не дают ничего, чего не даст противень и кухонное полотенце, ' +
            'а свои предметы можно сделать сколь угодно сложными.',
        en: 'The basic material for visual Kim. The method needs nothing more – bought memory ' +
            'games offer nothing that a baking tray and a tea towel cannot do as well, and your ' +
            'own objects can be made as difficult as you like.'
      },
      diy: {
        de: 'Tablett: jedes Backblech oder ein Holzbrett ab 30 × 40 cm mit Rand, damit nichts ' +
            'herunterrollt. Tuch: ein blickdichtes Geschirrtuch von mindestens 50 × 50 cm; ' +
            'dünne Küchentücher taugen nicht, man sieht die Umrisse durch. Vorrat: fünfzehn bis ' +
            'zwanzig Gegenstände in einem Schuhkarton sammeln, alle zwischen 3 und 8 cm groß, ' +
            'jeder mit einem eindeutigen Namen (Korken, Wäscheklammer, Würfel, Haargummi, ' +
            'Streichholzschachtel, Legostein, Batterie, Muschel, Teelicht, Schlüssel, Löffel, ' +
            'Radiergummi, Knopf, Murmel, Spielzeugauto). Nichts Zerbrechliches und nichts ' +
            'Verschluckbares für Kinder unter drei. Der Karton bleibt zu und kommt nur zum ' +
            'Spielen heraus – dann sind die Sachen jedes Mal wieder interessant.',
        ru: 'Поднос: любой противень или деревянная доска от 30 × 40 см с бортиком, чтобы ничего ' +
            'не скатывалось. Полотенце: непрозрачное кухонное полотенце не меньше 50 × 50 см; ' +
            'тонкие салфетки не годятся — сквозь них видны очертания. Запас: собрать в коробку ' +
            'из-под обуви пятнадцать-двадцать предметов размером от 3 до 8 см, каждый с ' +
            'однозначным названием (пробка, прищепка, кубик, резинка для волос, спичечный ' +
            'коробок, деталь Лего, батарейка, ракушка, чайная свеча, ключ, ложка, ластик, ' +
            'пуговица, шарик, машинка). Ничего бьющегося и ничего мелкого для детей младше трёх ' +
            'лет. Коробка стоит закрытой и достаётся только для игры — тогда предметы каждый ' +
            'раз снова интересны.',
        en: 'Tray: any baking tray or a wooden board from 30 × 40 cm upwards with a rim so that ' +
            'nothing rolls off. Cloth: an opaque tea towel of at least 50 × 50 cm; thin kitchen ' +
            'towels are no good, you can see the outlines through them. Stock: collect fifteen to ' +
            'twenty objects in a shoe box, all between 3 and 8 cm in size, each with an ' +
            'unambiguous name (cork, clothes peg, dice, hair tie, matchbox, Lego brick, battery, ' +
            'shell, tea light, key, spoon, eraser, button, marble, toy car). Nothing breakable ' +
            'and nothing swallowable for children under three. The box stays closed and only ' +
            'comes out to play – then the things are interesting again every time.'
      },
      svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
        <rect x="6" y="50" width="108" height="20" rx="5" fill="#EFEDF9" stroke="#D0CDE8" stroke-width="2"/>
        <circle cx="20" cy="42" r="8" fill="var(--primary)"/>
        <rect x="34" y="34" width="16" height="16" rx="2" fill="var(--gold)"/>
        <polygon points="62,32 72,50 52,50" fill="var(--green)"/>
        <path d="M78 16 L114 16 L114 52 Q108 57 102 52 Q96 47 90 52 Q84 57 78 52 Z"
              fill="var(--accent)" opacity="0.9"/>
        <text x="96" y="42" text-anchor="middle" font-size="20" fill="#fff" font-weight="700">?</text>
      </svg>`
    },
    {
      name: 'Fühlbeutel für Tast-Kim',
      maker: 'Eigenbau',
      price: '0 €',
      note: {
        de: 'Für Tast-Kim: Das Kind greift blind in den Beutel, ertastet einen Gegenstand, ' +
            'benennt ihn und holt ihn erst dann heraus. Zweite Stufe: acht Gegenstände nur ' +
            'durch Tasten in der Reihenfolge erinnern, in der sie hineingelegt wurden.',
        ru: 'Для осязательного Кима: ребёнок вслепую лезет в мешочек, нащупывает предмет, ' +
            'называет его и только потом достаёт. Вторая ступень: восемь предметов только на ' +
            'ощупь вспомнить в том порядке, в каком их туда клали.',
        en: 'For touch Kim: the child reaches blindly into the bag, feels an object, names it and ' +
            'only then pulls it out. Second level: remember eight objects by touch alone, in the ' +
            'order in which they were put in.'
      },
      diy: {
        de: 'Variante Beutel: aus einem alten Kissenbezug ein Rechteck von 30 × 55 cm ' +
            'schneiden, in der Mitte falten, die beiden Seiten zunähen, oben 3 cm umschlagen ' +
            'und eine Schnur einziehen. Fertig ist ein Beutel von etwa 25 × 30 cm. Variante ' +
            'Tastkiste, blickdicht und ohne Nähen: in einen Schuhkarton mit Deckel an der ' +
            'Schmalseite ein Loch von 12 cm Durchmesser schneiden und den abgeschnittenen ' +
            'Ärmel eines alten Pullis (Länge ca. 20 cm) von innen mit Heißkleber als Manschette ' +
            'einkleben – so kann die Hand hinein, das Auge nicht. Inhalt: acht bis zehn ' +
            'Gegenstände mit deutlich unterschiedlicher Oberfläche – Tannenzapfen, Schwamm, ' +
            'Löffel, Wattebausch, Schraube, Walnuss, Radiergummi, Schlüssel.',
        ru: 'Вариант «мешочек»: из старой наволочки вырезать прямоугольник 30 × 55 см, сложить ' +
            'пополам, прошить два бока, сверху подвернуть 3 см и вдеть шнурок. Получается ' +
            'мешочек примерно 25 × 30 см. Вариант «ящик для ощупывания», непрозрачный и без ' +
            'шитья: в коробке из-под обуви с крышкой вырезать на торце отверстие диаметром ' +
            '12 см и вклеить изнутри термоклеем отрезанный рукав от старого свитера (длиной ' +
            'около 20 см) как манжету — рука проходит, глаз нет. Содержимое: восемь-десять ' +
            'предметов с явно разной поверхностью — шишка, губка, ложка, ватный шарик, шуруп, ' +
            'грецкий орех, ластик, ключ.',
        en: 'Bag version: cut a rectangle of 30 × 55 cm from an old pillowcase, fold it in half, ' +
            'sew up both sides, turn over 3 cm at the top and thread a cord through. The result ' +
            'is a bag of about 25 × 30 cm. Feely-box version, opaque and without sewing: cut a ' +
            'hole 12 cm across in the narrow end of a shoe box with a lid and glue in the ' +
            'cut-off sleeve of an old jumper (about 20 cm long) from the inside with hot glue as ' +
            'a cuff – that way the hand can get in but the eye cannot. Contents: eight to ten ' +
            'objects with clearly different surfaces – pine cone, sponge, spoon, cotton wool ' +
            'ball, screw, walnut, eraser, key.'
      }
    },
    {
      name: 'Geräuschdosen für Hör-Kim',
      maker: 'Eigenbau',
      price: 'ca. 3 €',
      note: {
        de: 'Für Hör-Kim: acht Dosen, die paarweise gleich klingen. Das Kind schüttelt und ' +
            'sucht die Paare; anschließend schüttelt der Erwachsene hinter dem Rücken vier ' +
            'Dosen in einer Reihenfolge, die das Kind nachlegen soll.',
        ru: 'Для слухового Кима: восемь баночек, попарно звучащих одинаково. Ребёнок трясёт их ' +
            'и ищет пары; затем взрослый за спиной трясёт четыре баночки в определённом ' +
            'порядке, а ребёнок должен выложить их в том же порядке.',
        en: 'For sound Kim: eight tins that sound the same in pairs. The child shakes them and ' +
            'looks for the pairs; afterwards the adult shakes four tins behind their back in a ' +
            'particular order, which the child has to lay out again.'
      },
      diy: {
        de: 'Acht gleiche undurchsichtige Döschen nehmen: Überraschungsei-Kapseln, leere ' +
            'Filmdosen oder kleine Gewürzgläser, die mit Tonpapier beklebt werden. Je zwei ' +
            'Dosen gleich befüllen, jeweils etwa einen Teelöffel: Reis, getrocknete Linsen, ' +
            'Sand, Büroklammern. Der Unterschied liegt in der Korngröße – Reis und Linsen ' +
            'klingen ähnlich genug, dass genau hingehört werden muss. Deckel mit einem Tropfen ' +
            'Heißkleber sichern. Auf den Boden jedes Paares denselben Farbpunkt malen: so kann ' +
            'das Kind selbst kontrollieren, ohne dass jemand die Lösung sagen muss. Für die ' +
            'nächste Stufe zwei weitere Paare mit Sand und Salz ergänzen.',
        ru: 'Взять восемь одинаковых непрозрачных баночек: капсулы от киндер-сюрприза, пустые ' +
            'коробочки от фотоплёнки или маленькие банки от специй, оклеенные цветной бумагой. ' +
            'Наполнять попарно одинаково, примерно по чайной ложке: рис, сухая чечевица, песок, ' +
            'скрепки. Разница в размере крупинок — рис и чечевица звучат достаточно похоже, ' +
            'чтобы пришлось вслушиваться. Крышки закрепить каплей термоклея. На дне каждой пары ' +
            'нарисовать одинаковую цветную точку: так ребёнок проверяет себя сам, и никому не ' +
            'нужно называть ответ. Для следующей ступени добавить ещё две пары — с песком и ' +
            'солью.',
        en: 'Take eight identical opaque containers: chocolate-egg capsules, empty film ' +
            'canisters or small spice jars covered with construction paper. Fill two tins alike ' +
            'each time, about a teaspoon each: rice, dried lentils, sand, paper clips. The ' +
            'difference lies in the grain size – rice and lentils sound similar enough that you ' +
            'have to listen closely. Secure the lids with a drop of hot glue. Paint the same ' +
            'coloured dot on the bottom of each pair: that way the child can check itself ' +
            'without anyone having to say the answer. For the next level, add two more pairs ' +
            'with sand and salt.'
      }
    },
    {
      name: 'Duftgläser für Riech-Kim',
      maker: 'Eigenbau',
      price: 'ca. 5 €',
      note: {
        de: 'Für Riech-Kim: sechs Gläser der Reihe nach riechen lassen, dann in anderer ' +
            'Reihenfolge noch einmal anbieten und benennen lassen. Gerüche sind für Kinder ' +
            'schwerer zu benennen als Bilder – das Suchen nach dem passenden Wort ist hier ' +
            'ausdrücklich Teil der Übung.',
        ru: 'Для обонятельного Кима: дать понюхать шесть баночек по очереди, затем предложить ' +
            'их в другом порядке и попросить назвать. Запахи детям называть труднее, чем ' +
            'картинки, — поиск подходящего слова здесь намеренно часть упражнения.',
        en: 'For smell Kim: let the child smell six jars one after another, then offer them again ' +
            'in a different order and have them named. Smells are harder for children to name ' +
            'than pictures – searching for the right word is expressly part of the exercise here.'
      },
      diy: {
        de: 'Sechs kleine Schraubgläser nehmen (Babygläschen sind ideal), außen mit Tonpapier ' +
            'bekleben, damit man den Inhalt nicht sieht. In jedes ein Wattepad legen und ' +
            'beträufeln beziehungsweise befüllen: Zimt (eine Prise), Kaffeepulver (ein ' +
            'Teelöffel), Vanillezucker, Pfefferminztee (zerbröselt), abgeriebene Orangenschale, ' +
            'getrockneter Lavendel. In jeden Deckel mit einem Nagel fünf Löcher schlagen, damit ' +
            'nicht hineingegriffen wird. Nummer auf den Boden schreiben, Lösungsliste separat ' +
            'aufheben. Dunkel lagern und die Füllung alle vier bis sechs Wochen erneuern – ' +
            'abgestandene Düfte riechen alle gleich. Keine ätherischen Öle unverdünnt ' +
            'verwenden, sie reizen die Schleimhaut.',
        ru: 'Взять шесть маленьких банок с завинчивающейся крышкой (идеальны баночки из-под ' +
            'детского питания), обклеить снаружи цветной бумагой, чтобы содержимого не было ' +
            'видно. В каждую положить ватный диск и капнуть или насыпать: корицу (щепотку), ' +
            'молотый кофе (чайную ложку), ванильный сахар, раскрошенный мятный чай, тёртую ' +
            'апельсиновую цедру, сушёную лаванду. В каждой крышке гвоздём пробить пять ' +
            'отверстий, чтобы нельзя было залезть внутрь. Номер написать на дне, список ответов ' +
            'хранить отдельно. Держать в темноте и обновлять наполнение каждые четыре-шесть ' +
            'недель — выдохшиеся запахи пахнут одинаково. Не использовать неразбавленные ' +
            'эфирные масла, они раздражают слизистую.',
        en: 'Take six small screw-top jars (baby food jars are ideal) and cover the outside with ' +
            'construction paper so the contents cannot be seen. Put a cotton pad in each and add ' +
            'a few drops or a filling: cinnamon (a pinch), ground coffee (a teaspoon), vanilla ' +
            'sugar, peppermint tea (crumbled), grated orange peel, dried lavender. Punch five ' +
            'holes in each lid with a nail so that nobody can reach inside. Write a number on ' +
            'the bottom and keep the answer list separately. Store in the dark and renew the ' +
            'filling every four to six weeks – stale scents all smell the same. Do not use ' +
            'undiluted essential oils, they irritate the mucous membranes.'
      }
    },
    {
      name: 'Tactilo Loto',
      maker: 'Djeco',
      url: 'https://www.djeco.com/en/',
      price: 'ca. 20 €',
      note: {
        de: 'Gekaufte Fassung des Tast-Kim: fünfzehn Holzformen in einem Beutel, eine ' +
            'Drehscheibe gibt vor, was ertastet werden soll. Ab drei Jahren, sauber ' +
            'verarbeitet. Wer den Fühlbeutel selbst baut, hat dasselbe für nichts – der ' +
            'Kaufvorteil liegt in den gut unterscheidbaren Formen und in der Drehscheibe, die ' +
            'die Aufgabe stellt, ohne dass ein Erwachsener dabeisitzen muss.',
        ru: 'Покупной вариант осязательного Кима: пятнадцать деревянных фигурок в мешочке, ' +
            'вертушка задаёт, что нужно нащупать. С трёх лет, аккуратное исполнение. Кто ' +
            'сделает мешочек сам, получит то же самое даром — плюс покупки в хорошо ' +
            'различимых формах и в вертушке, которая задаёт задание без участия взрослого.',
        en: 'A bought version of touch Kim: fifteen wooden shapes in a bag, with a spinner ' +
            'specifying what is to be felt for. From three years, cleanly made. Anyone who builds ' +
            'the feely bag themselves gets the same thing for nothing – the advantage of buying ' +
            'lies in the clearly distinguishable shapes and in the spinner, which sets the task ' +
            'without an adult having to sit alongside.'
      }
    }
  ],

  // Schemazeichnung: Tablett mit Gegenständen, rechts das Tuch darüber
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="6" y="50" width="108" height="20" rx="5" fill="#EFEDF9" stroke="#D0CDE8" stroke-width="2"/>
    <circle cx="20" cy="42" r="8" fill="var(--primary)"/>
    <rect x="34" y="34" width="16" height="16" rx="2" fill="var(--gold)"/>
    <polygon points="62,32 72,50 52,50" fill="var(--green)"/>
    <rect x="80" y="36" width="14" height="14" rx="7" fill="var(--orange)"/>
    <path d="M74 14 L116 14 L116 52 Q109 58 102 52 Q95 46 88 52 Q81 58 74 52 Z"
          fill="var(--accent)" opacity="0.9"/>
    <text x="95" y="41" text-anchor="middle" font-size="20" fill="#fff" font-weight="700">?</text>
  </svg>`
};
