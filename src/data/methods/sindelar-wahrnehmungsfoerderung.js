/**
 * Wahrnehmungsförderung nach Sindelar
 *
 * Kommerzielles Trainingsprogramm. Der Text hält sich bewusst an das, was
 * belegt ist, und benennt die Grenzen der Studienlage.
 */
export default {
  id: 'sindelar-wahrnehmungsfoerderung',
  icon: '👁️',
  category: 'wahrnehmung',
  ages: '4-12',

  title: {
    de: 'Wahrnehmungsförderung nach Sindelar',
    ru: 'Развитие восприятия по методу Синделар',
    en: ''
  },

  short: {
    de: 'Programm, das nach einer Testung täglich zehn Minuten genau eine schwache Teilleistung übt.',
    ru: 'Программа: после диагностики каждый день десять минут отрабатывается одна конкретная слабая функция.',
    en: ''
  },

  what: {
    de: 'Ein Verfahren der Wiener Psychologin Brigitte Sindelar. Zuerst prüft eine Testung ' +
        'einzelne Grundfunktionen der Informationsverarbeitung – visuelle und auditive ' +
        'Unterscheidung, Figur-Grund-Wahrnehmung, Merkfähigkeit, Reihenfolgen, Raumorientierung, ' +
        'die Verbindung zwischen Sehen und Hören. Danach wird täglich rund zehn Minuten genau ' +
        'die schwächste Funktion geübt, in sehr kleinen Schritten und ohne Bezug zum Schulstoff. ' +
        'Zur Wirksamkeit ist die Lage dünn: Es gibt Evaluationen aus dem Umfeld der Autorin, aber ' +
        'kaum unabhängige kontrollierte Studien. Für Wahrnehmungs- und Funktionstrainings ' +
        'allgemein gilt: Die geübte Funktion verbessert sich, ein Übertrag auf Lesen, Schreiben ' +
        'oder Rechnen ist nicht belegt. Die medizinische Leitlinie zur Lese-Rechtschreibstörung ' +
        'empfiehlt deshalb Förderung am Lesen und Schreiben selbst. Als Ergänzung möglich, als ' +
        'Ersatz für eine Lese- oder Rechenförderung nicht.',
    ru: 'Метод венского психолога Бригитты Синделар. Сначала диагностика проверяет отдельные ' +
        'базовые функции переработки информации — зрительное и слуховое различение, восприятие ' +
        '«фигура-фон», запоминание, последовательности, ориентацию в пространстве, связь между ' +
        'зрением и слухом. Затем ежедневно около десяти минут отрабатывается именно самая слабая ' +
        'функция, очень маленькими шагами и без связи со школьным материалом. С доказательствами ' +
        'дело обстоит скудно: есть оценочные исследования из окружения автора, но почти нет ' +
        'независимых контролируемых работ. Для тренингов восприятия и отдельных функций в целом ' +
        'верно: тренируемая функция улучшается, а перенос на чтение, письмо или счёт не доказан. ' +
        'Поэтому медицинские рекомендации при дислексии советуют заниматься самим чтением и ' +
        'письмом. Как дополнение — возможно, как замена занятиям по чтению или математике — нет.',
    en: ''
  },

  steps: {
    de: [
      'Vor allem anderen die Testung: Ohne das Profil aus der Untersuchung weiß niemand, welche Funktion überhaupt schwach ist – und dann übt man wochenlang das Falsche. Die Testung machen dafür ausgebildete Psychologinnen oder Therapeutinnen.',
      'Feste Regel aufstellen: zehn Minuten, sechs Tage die Woche, immer zur gleichen Tageszeit, immer nur eine Übungsart. Danach wird das Material weggeräumt und nicht mehr darüber gesprochen.',
      'Beispiel visuelle Unterscheidung: zwei Reihen mit je zwölf ähnlichen Zeichen untereinander schreiben, in der unteren Reihe drei Zeichen leicht verändern. Das Kind streicht die Abweichungen an. Schwieriger wird es über die Ähnlichkeit der Zeichen – erst O/X, später b/d und ei/ie.',
      'Beispiel auditive Merkfähigkeit: fünf Wörter langsam und ohne Betonung vorsprechen, das Kind wiederholt sie in derselben Reihenfolge. Erst wenn das an drei Tagen sicher gelingt, kommt ein sechstes Wort dazu.',
      'Beispiel Reihenfolge: eine Perlenkette nach Vorlage auffädeln, die Vorlage nach fünf Sekunden mit einem Blatt abdecken. Länge der Folge langsam von vier auf acht Perlen steigern.',
      'Beispiel Sehen und Hören verbinden: Sie klopfen ein kurzes Muster auf den Tisch, auf dem Blatt liegen drei Punktreihen (etwa • •• • und •• • •). Das Kind zeigt auf die passende.',
      'Die Aufgaben so leicht halten, dass etwa neun von zehn gelingen. Wenn es öfter schiefgeht, war der Schritt zu groß – dann zurück auf die vorige Stufe, ohne Kommentar.',
      'Alle sechs bis acht Wochen einen Kontrolltermin. Erst dort wird entschieden, ob die Übungsart wechselt. Parallel weiterhin am eigentlichen Problem arbeiten: Lesen übt man mit Lesen.'
    ],
    ru: [
      'Прежде всего — диагностика: без профиля, полученного при обследовании, никто не знает, какая функция слаба, и тогда неделями тренируется не то. Обследование проводят специально обученные психологи или терапевты.',
      'Установить твёрдое правило: десять минут, шесть дней в неделю, всегда в одно и то же время дня, всегда только один вид упражнения. После этого материал убирается, и разговор о нём заканчивается.',
      'Пример зрительного различения: написать одну под другой две строки по двенадцать похожих знаков, в нижней строке три знака слегка изменить. Ребёнок отмечает отличия. Сложность повышается через сходство знаков — сначала О/Х, позже б/д и «ей»/«ие».',
      'Пример слуховой памяти: медленно и без выделения голосом произнести пять слов, ребёнок повторяет их в том же порядке. Шестое слово добавляется только тогда, когда три дня подряд получается уверенно.',
      'Пример последовательности: нанизать бусины по образцу, образец через пять секунд закрыть листом. Длину ряда медленно поднимать с четырёх бусин до восьми.',
      'Пример связи зрения и слуха: вы отстукиваете по столу короткий ритм, на листе лежат три ряда точек (например, • •• • и •• • •). Ребёнок показывает подходящий.',
      'Держать задания настолько лёгкими, чтобы получалось примерно девять раз из десяти. Если ошибок больше, шаг был слишком велик — вернуться на предыдущую ступень, без комментариев.',
      'Каждые шесть-восемь недель контрольная встреча. Только там решают, менять ли вид упражнения. Параллельно продолжать работать над самой проблемой: чтение тренируют чтением.'
    ],
    en: []
  },

  tips: {
    de: [
      'Das tägliche Kurzformat ist der Kern. Einmal wöchentlich eine Stunde bringt nach der Logik des Programms nichts – dann lieber gar nicht anfangen.',
      'Die Übungen sind absichtlich inhaltsleer und langweilig. Sie mit Schulstoff „sinnvoller" zu machen, hebelt die Idee aus und macht aus zehn Minuten einen Hausaufgabenkampf.',
      'Vorsicht bei Versprechen, ein Wahrnehmungstraining behebe Legasthenie oder Rechenschwäche. Dafür gibt es keinen Beleg; wer das zusagt, verkauft mehr, als er halten kann.',
      'Wenn das Kind in der Schule konkret hängt, gehört die Lese- oder Rechenförderung an die erste Stelle. Ein Funktionstraining kann daneben laufen, nicht davor.'
    ],
    ru: [
      'Ежедневный короткий формат — суть метода. Один час раз в неделю по логике программы не даёт ничего: тогда лучше вовсе не начинать.',
      'Упражнения намеренно бессодержательны и скучны. Попытка сделать их «осмысленнее» школьным материалом разрушает идею и превращает десять минут в борьбу за уроки.',
      'Осторожно с обещаниями, что тренинг восприятия устранит дислексию или дискалькулию. Доказательств этому нет; кто это обещает, продаёт больше, чем может дать.',
      'Если ребёнок конкретно застревает в школе, на первом месте должны стоять занятия чтением или математикой. Тренинг функций может идти рядом, но не вместо.'
    ],
    en: []
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Brigitte_Sindelar', kind: 'wiki',
      label: { de: 'Wikipedia: Brigitte Sindelar', ru: 'Википедия (нем.): Бригитта Синделар', en: '' } },
    { url: 'https://www.sindelarverlag.at/', kind: 'hersteller',
      label: { de: 'Sindelar Verlag: Test- und Trainingsmaterial', ru: 'Издательство Синделар: диагностические и тренировочные материалы', en: '' } },
    { url: 'https://www.sindelarcenter.at/angebot/sindelar-methode/', kind: 'anleitung',
      label: { de: 'Sindelar Center: wie Testung und Training ablaufen', ru: 'Sindelar Center: как проходят диагностика и тренинг', en: '' } },
    { url: 'https://www.sindelar.at/trainer/', kind: 'community',
      label: { de: 'Verzeichnis ausgebildeter Trainerinnen und Trainer', ru: 'Каталог обученных тренеров', en: '' } },
    { url: 'https://register.awmf.org/de/leitlinien/detail/028-044', kind: 'anleitung',
      label: { de: 'AWMF-Leitlinie Lese-/Rechtschreibstörung: was empfohlen wird', ru: 'Немецкие клинические рекомендации при дислексии: что рекомендуется', en: '' } }
  ],

  products: [
    {
      name: 'Sindelar-Trainingsprogramme und Testverfahren',
      maker: 'Sindelar Verlag, Wien',
      url: 'https://www.sindelarverlag.at/',
      price: 'Testverfahren und Trainingsmappen je nach Baustein, meist zweistellig',
      note: {
        de: 'Das Material besteht aus einem Untersuchungsverfahren und dazu passenden ' +
            'Übungsmappen je Teilfunktion; die Programme sind aufeinander aufgebaut und werden ' +
            'nach dem Testergebnis ausgewählt. Der Verlag verkauft überwiegend an Fachleute. ' +
            'Einzeln gekauft und ohne Testprofil ist das Material wenig wert – man weiß dann ' +
            'nicht, welche Mappe die richtige ist.',
        ru: 'Материал состоит из диагностической методики и подходящих к ней тренировочных папок ' +
            'по каждой функции; программы выстроены друг за другом и подбираются по результатам ' +
            'теста. Издательство продаёт преимущественно специалистам. Купленный по отдельности ' +
            'и без профиля диагностики материал мало что даёт — непонятно, какая папка нужна.',
        en: ''
      }
    },
    {
      name: 'Untersuchung und Begleitung durch eine ausgebildete Trainerin',
      maker: 'Sindelar-Trainerinnen und -Trainer',
      url: 'https://www.sindelar.at/trainer/',
      price: 'Testung ca. 150–300 €, Kontrolltermine je nach Praxis',
      note: {
        de: 'Ohne Testung kein sinnvolles Training – das ist der Punkt, an dem sich Geld sparen ' +
            'nicht lohnt. Das Verzeichnis führt Fachleute in Österreich, daneben gibt es ' +
            'ausgebildete Trainerinnen in Deutschland und der Slowakei. Vor der Anmeldung ' +
            'nachfragen, wie oft Kontrolltermine stattfinden und ob das Übungsmaterial im Preis ' +
            'enthalten ist. Krankenkassen zahlen in der Regel nicht.',
        ru: 'Без диагностики нет осмысленного тренинга — это то место, где экономить не стоит. ' +
            'Каталог перечисляет специалистов в Австрии, кроме того обученные тренеры есть в ' +
            'Германии и Словакии. Перед записью спросите, как часто проводятся контрольные ' +
            'встречи и входит ли тренировочный материал в цену. Страховые кассы обычно не платят.',
        en: ''
      }
    },
    {
      name: 'Übungsmaterial aus dem Haushalt',
      maker: 'Eigenbau',
      price: '0 €',
      note: {
        de: 'Die einzelnen Übungstypen brauchen kein gekauftes Material: karierte Blätter für ' +
            'Zeichenreihen, Holzperlen und Schnur für Reihenfolgen, ein Klopfstift für ' +
            'Rhythmusaufgaben, Bildkarten aus einem doppelten Memory-Spiel für Figur-Grund. Was ' +
            'sich nicht ersetzen lässt, ist die Testung, die sagt, welche dieser Übungen ' +
            'überhaupt an der Reihe ist.',
        ru: 'Отдельные типы упражнений не требуют покупного материала: листы в клетку для рядов ' +
            'знаков, деревянные бусины и шнурок для последовательностей, карандаш для ' +
            'простукивания ритма, карточки из лишнего набора «мемори» для «фигура-фон». Чего ' +
            'заменить нельзя — так это диагностики, которая говорит, какое из этих упражнений ' +
            'вообще сейчас нужно.',
        en: ''
      }
    }
  ],

  // Zwei fast gleiche Zeichenreihen, eine Abweichung markiert
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <g fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round">
      <circle cx="16" cy="22" r="7"/>
      <path d="M36 15 L50 29 M50 15 L36 29"/>
      <circle cx="72" cy="22" r="7"/>
      <path d="M92 15 L106 29 M106 15 L92 29"/>
    </g>
    <g fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round">
      <circle cx="16" cy="58" r="7"/>
      <path d="M36 51 L50 65 M50 51 L36 65"/>
      <path d="M65 51 L79 65 M79 51 L65 65"/>
      <path d="M92 51 L106 65 M106 51 L92 65"/>
    </g>
    <circle cx="72" cy="58" r="14" fill="none" stroke="var(--secondary)" stroke-width="3"/>
    <line x1="6" y1="40" x2="114" y2="40" stroke="#D0CDE8" stroke-width="2" stroke-dasharray="4 4"/>
  </svg>`
};
