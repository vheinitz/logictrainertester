/**
 * Klassische Strategiespiele – Mühle, Dame, 4 Gewinnt
 */
export default {
  id: 'klassische-strategiespiele',
  icon: '♟️',
  category: 'logik-denken',
  ages: '5-14',

  title: {
    de: 'Klassische Strategiespiele (Mühle, Dame, 4 Gewinnt)',
    ru: 'Классические стратегические игры (мельница, шашки, «четыре в ряд»)',
    en: ''
  },

  short: {
    de: 'Mühle, Dame und 4 Gewinnt üben, Züge vorauszudenken und die Absicht des Gegenübers zu erkennen.',
    ru: 'Мельница, шашки и «четыре в ряд» учат просчитывать ходы и разгадывать замысел соперника.',
    en: ''
  },

  what: {
    de: 'Drei alte Brettspiele mit sehr wenigen Regeln, aber echtem Planungsbedarf: Wer gewinnen ' +
        'will, muss den eigenen Zug zu Ende denken und dabei den Zug des anderen mitdenken. ' +
        'Genau das ist die Übung – nicht das Auswendiglernen von Eröffnungen, sondern die Frage ' +
        '„und was machst du dann?". 4 Gewinnt geht ab etwa fünf Jahren, Mühle ab sechs, Dame ab ' +
        'sieben. Dass sich solches Spielen auf Schulleistungen überträgt, ist nicht belegt; ' +
        'belegbar ist nur, dass Kinder im Spiel selbst zunehmend planvoller ziehen – und das ist ' +
        'Grund genug.',
    ru: 'Три старинные настольные игры с минимумом правил, но с настоящей потребностью в ' +
        'планировании: чтобы выиграть, надо додумать собственный ход до конца и одновременно ' +
        'учесть ход соперника. Именно это и тренируется — не заучивание дебютов, а вопрос «а ты ' +
        'тогда что сделаешь?». «Четыре в ряд» подходит примерно с пяти лет, мельница — с шести, ' +
        'шашки — с семи. Что такая игра переносится на школьные успехи, не доказано; доказуемо ' +
        'лишь то, что внутри самой игры ребёнок ходит всё осмысленнее — и этого достаточно.',
    en: ''
  },

  steps: {
    de: [
      'Mit 4 Gewinnt anfangen: sieben Spalten, sechs Reihen, wer vier in einer Linie hat, gewinnt. Die Regel ist in einer halben Minute erklärt.',
      'Die erste Partie ohne jeden Ratschlag spielen. Erst wenn das Kind die Regel sicher kann, wird über Taktik geredet.',
      'Ab der zweiten Partie laut denken – aber nur der Erwachsene: „Wenn ich hier einwerfe, habe ich unten drei. Dann musst du oben blocken."',
      'Vor jedem Zug des Kindes eine einzige Frage stellen: „Was mache ich, wenn du das legst?" Antwort abwarten, dann ziehen lassen.',
      'Statt schwach zu spielen ein Handicap nehmen: bei Mühle mit sieben statt neun Steinen anfangen, bei Dame zwei Steine vom Brett nehmen.',
      'Fallen ankündigen statt sie zuschnappen zu lassen: „Achtung, ich habe gerade eine Zwickmühle vorbereitet – findest du sie?"',
      'Nach der Partie eine Minute zurückschauen: welcher einzelne Zug hat entschieden? Das Brett dafür stehen lassen.',
      'Kurz halten: zwei bis drei Partien, 10 bis 15 Minuten, aufhören solange es noch Spaß macht.'
    ],
    ru: [
      'Начать с «четырёх в ряд»: семь столбцов, шесть рядов, побеждает тот, кто выстроит четыре фишки в линию. Правило объясняется за полминуты.',
      'Первую партию сыграть без единого совета. О тактике говорить только тогда, когда ребёнок уверенно усвоил правило.',
      'Со второй партии рассуждать вслух — но только взрослому: «Если я брошу сюда, внизу у меня будет три. Значит, тебе придётся закрыть сверху».',
      'Перед каждым ходом ребёнка задавать один-единственный вопрос: «А что я сделаю, если ты походишь так?» Дождаться ответа и только потом дать сходить.',
      'Не поддаваться, а брать гандикап: в мельнице начинать семью камнями вместо девяти, в шашках убрать с доски две свои шашки.',
      'Ловушки объявлять, а не захлопывать: «Внимание, я только что подготовил двойную мельницу — найдёшь её?»',
      'После партии минуту разобрать: какой один ход всё решил? Доску для этого не разбирать.',
      'Играть недолго: две-три партии, 10–15 минут, заканчивать, пока ещё интересно.'
    ],
    en: []
  },

  tips: {
    de: [
      'Nicht heimlich verlieren. Kinder merken das und der Sieg wird wertlos. Ein offenes Handicap ist ehrlicher und wirkt stärker.',
      'Eine Rücknahme pro Partie vereinbaren – aber nur, wenn das Kind vorher sagt, warum der Zug schlecht war.',
      'Die Zwickmühle bei Mühle ist der häufigste Frustpunkt. Sie einmal in Ruhe aufbauen und erklären, statt sie im Spiel zu benutzen.',
      'Bei Wut über eine Niederlage die Partie nicht wiederholen, sondern das Spiel wechseln. Am nächsten Tag steht das Brett wieder da.'
    ],
    ru: [
      'Не поддаваться тайком. Дети это замечают, и победа обесценивается. Открытый гандикап честнее и работает лучше.',
      'Договориться об одном возврате хода за партию — но только если ребёнок сначала скажет, чем ход был плох.',
      'Двойная мельница — самая частая причина обиды. Лучше один раз спокойно построить её и объяснить, чем применить в бою.',
      'Если проигрыш вызвал злость, не переигрывать партию, а сменить игру. Назавтра доска снова на месте.'
    ],
    en: []
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/M%C3%BChle_(Spiel)', kind: 'wiki',
      label: { de: 'Wikipedia: Mühle – Regeln und Strategie', ru: 'Википедия (нем.): мельница — правила и стратегия', en: '' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D0%BB%D1%8C%D0%BD%D0%B8%D1%86%D0%B0_(%D0%B8%D0%B3%D1%80%D0%B0)', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Mühle', ru: 'Википедия: мельница (игра)', en: '' } },
    { url: 'https://de.wikipedia.org/wiki/Vier_gewinnt', kind: 'wiki',
      label: { de: 'Wikipedia: Vier gewinnt', ru: 'Википедия (нем.): «четыре в ряд»', en: '' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%A7%D0%B5%D1%82%D1%8B%D1%80%D0%B5_%D0%B2_%D1%80%D1%8F%D0%B4', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Vier gewinnt', ru: 'Википедия: четыре в ряд', en: '' } },
    { url: 'https://de.wikipedia.org/wiki/Dame_(Spiel)', kind: 'wiki',
      label: { de: 'Wikipedia: Dame – Varianten und Regeln', ru: 'Википедия (нем.): шашки — варианты и правила', en: '' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%A8%D0%B0%D1%88%D0%BA%D0%B8', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Dame/Schaschki', ru: 'Википедия: шашки', en: '' } },
    { url: 'https://instructions.hasbro.com/en-us/instruction/Connect-4-Game', kind: 'hersteller',
      label: { de: 'Hasbro: Originalanleitung 4 Gewinnt (PDF, englisch)', ru: 'Hasbro: оригинальная инструкция Connect 4 (PDF, англ.)', en: '' } }
  ],

  products: [
    {
      name: 'Mühle, Holzkassette (Art. 3135)',
      maker: 'Philos',
      url: 'https://www.philosshop.de/Muehle',
      price: 'ca. 30 €',
      note: {
        de: 'Klappkassette aus Holz, 18 Spielsteine, Brett 29,5 × 14,8 cm, ab 6 Jahren. Der Vorteil ' +
            'gegenüber einem Papierbrett: Die Steine bleiben liegen, wenn jemand an den Tisch stößt, ' +
            'und die Partie lässt sich zugeklappt bis morgen aufheben.',
        ru: 'Складная деревянная кассета, 18 фишек, доска 29,5 × 14,8 см, с 6 лет. Преимущество перед ' +
            'бумажной доской: фишки не сдвигаются, если кто-то заденет стол, а партию можно закрыть ' +
            'и сохранить до завтра.',
        en: ''
      },
      diy: {
        de: 'Ein Mühlebrett ist in zehn Minuten gemacht: Auf Karton oder ein Holzbrett 24 × 24 cm drei ' +
            'ineinanderliegende Quadrate zeichnen – 24, 16 und 8 cm Kantenlänge, alle mittig. Dann die ' +
            'Mittelpunkte gegenüberliegender Seiten mit vier geraden Strichen verbinden. Die 24 ' +
            'Schnitt- und Eckpunkte als Kreise von 1 cm markieren. Als Steine dienen 9 + 9 Kronkorken, ' +
            'Knöpfe oder Wäscheklammern in zwei Farben.',
        ru: 'Доску для мельницы можно сделать за десять минут: на картоне или деревянной дощечке ' +
            '24 × 24 см начертить три вложенных квадрата со сторонами 24, 16 и 8 см, все с общим ' +
            'центром. Затем четырьмя прямыми соединить середины противоположных сторон. Все 24 ' +
            'угловые и пересекающиеся точки обвести кружками диаметром 1 см. Фишки — 9 + 9 крышек от ' +
            'бутылок, пуговиц или прищепок двух цветов.',
        en: ''
      },
      // Mühlebrett: drei ineinanderliegende Quadrate mit Verbindungslinien
      svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
        <g fill="none" stroke="#8C86C4" stroke-width="1.6">
          <rect x="22" y="6" width="76" height="68"/>
          <rect x="34" y="17" width="52" height="46"/>
          <rect x="46" y="28" width="28" height="24"/>
          <path d="M22 40 H46 M74 40 H98 M60 6 V28 M60 52 V74"/>
        </g>
        <circle cx="22" cy="6" r="4.5" fill="var(--primary)"/>
        <circle cx="22" cy="40" r="4.5" fill="var(--primary)"/>
        <circle cx="22" cy="74" r="4.5" fill="var(--primary)"/>
        <circle cx="60" cy="17" r="4.5" fill="var(--orange)"/>
        <circle cx="86" cy="40" r="4.5" fill="var(--orange)"/>
      </svg>`
    },
    {
      name: 'Dame-Set, Klappbrett (Art. 3144)',
      maker: 'Philos',
      url: 'https://www.philosshop.de/Dame-Set/3144',
      price: 'ca. 13 €',
      note: {
        de: 'Klappbrett 23 × 23 cm mit 12 hellen und 12 dunklen Steinen, ab 6 Jahren. Anleitung liegt ' +
            'in mehreren Sprachen bei, darunter Russisch. Für den Anfang die einfache Regel spielen: ' +
            'Schlagen ist erlaubt, aber kein Schlagzwang.',
        ru: 'Складная доска 23 × 23 см, 12 светлых и 12 тёмных шашек, с 6 лет. Инструкция вложена на ' +
            'нескольких языках, в том числе на русском. Для начала играть по упрощённому правилу: ' +
            'бить можно, но бой не обязателен.',
        en: ''
      }
    },
    {
      name: '4 gewinnt (Connect 4, Art. A5640)',
      maker: 'Hasbro',
      url: 'https://instructions.hasbro.com/en-us/instruction/Connect-4-Game',
      price: 'ca. 15–20 €',
      note: {
        de: 'Das Original mit stehendem Gitter, zwei Spieler, ab 6 Jahren – praktisch klappt es schon ' +
            'ab fünf. Über den Link gibt es die Originalanleitung als PDF, allerdings nur auf Englisch; ' +
            'die Regeln stehen ausführlich auch im Wikipedia-Artikel oben.',
        ru: 'Оригинал с вертикальной решёткой, два игрока, с 6 лет — на практике получается уже с пяти. ' +
            'По ссылке лежит оригинальная инструкция в PDF, но только на английском; правила подробно ' +
            'описаны и в статье Википедии выше.',
        en: ''
      },
      diy: {
        de: 'Selbstbau als Flachversion: Auf Karton ein Raster von 7 Spalten × 6 Reihen mit 4 cm ' +
            'großen Feldern zeichnen (28 × 24 cm). Gespielt wird mit Münzen oder Knöpfen in zwei ' +
            'Farben, 21 je Farbe. Wichtig ist die Schwerkraftregel: Ein Stein darf nur auf das ' +
            'unterste freie Feld einer Spalte gelegt werden – sonst ist es ein anderes Spiel.',
        ru: 'Самодельный плоский вариант: на картоне начертить сетку 7 столбцов × 6 рядов с клетками ' +
            '4 см (28 × 24 см). Играют монетами или пуговицами двух цветов, по 21 штуке. Главное — ' +
            'правило тяжести: фишку кладут только на самую нижнюю свободную клетку столбца, иначе это ' +
            'уже другая игра.',
        en: ''
      }
    },
    {
      name: 'Holz-Spielesammlung 100 (Art. 3102)',
      maker: 'Philos',
      url: 'https://www.philosshop.de/Holz-Spielesammlung-100-FSC-100/3102',
      price: 'ca. 50 €',
      note: {
        de: 'Holzkiste mit Schach, Dame, Mühle, Halma, Backgammon, Domino, Mikado und Würfeln, ab ' +
            '6 Jahren. Lohnt sich, wenn mehrere Kinder verschieden alt sind. War zuletzt zeitweise ' +
            'ausverkauft – vor der Bestellung die Verfügbarkeit prüfen.',
        ru: 'Деревянный ящик с шахматами, шашками, мельницей, халмой, нардами, домино, микадо и ' +
            'кубиками, с 6 лет. Имеет смысл, если дети разного возраста. В последнее время временами ' +
            'отсутствовал на складе — перед заказом проверьте наличие.',
        en: ''
      }
    }
  ],

  // Vier-Gewinnt-Gitter mit fallenden Steinen
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="14" y="14" width="92" height="58" rx="5" fill="#EDEBF7" stroke="#8C86C4" stroke-width="1.5"/>
    <g fill="#FFFFFF">
      <circle cx="27" cy="26" r="5"/><circle cx="46" cy="26" r="5"/><circle cx="65" cy="26" r="5"/><circle cx="84" cy="26" r="5"/><circle cx="99" cy="26" r="5"/>
      <circle cx="27" cy="43" r="5"/><circle cx="46" cy="43" r="5"/><circle cx="84" cy="43" r="5"/><circle cx="99" cy="43" r="5"/>
      <circle cx="99" cy="60" r="5"/>
    </g>
    <circle cx="65" cy="43" r="5" fill="var(--orange)"/>
    <circle cx="27" cy="60" r="5" fill="var(--primary)"/>
    <circle cx="46" cy="60" r="5" fill="var(--primary)"/>
    <circle cx="65" cy="60" r="5" fill="var(--primary)"/>
    <circle cx="84" cy="60" r="5" fill="var(--primary)"/>
    <circle cx="65" cy="6" r="5" fill="var(--orange)"/>
  </svg>`
};
