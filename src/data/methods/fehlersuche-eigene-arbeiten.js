/**
 * Fehlersuche in eigenen Arbeiten – Selbstkontrolle als eigener Arbeitsschritt.
 * Format siehe README.md im selben Verzeichnis.
 */
export default {
  id: 'fehlersuche-eigene-arbeiten',
  icon: '🔍',
  category: 'aufmerksamkeit',
  ages: '7-16',

  title: {
    de: 'Fehlersuche in eigenen Arbeiten',
    ru: 'Поиск ошибок в собственных работах',
    en: 'Finding errors in one\'s own work'
  },

  short: {
    de: 'Das Kind kontrolliert eigene Hefte und Aufgaben systematisch nach, statt sie sofort abzugeben.',
    ru: 'Ребёнок систематически проверяет свои тетради и задания, а не сдаёт их сразу.',
    en: 'The child systematically checks their own notebooks and assignments instead of handing them in right away.'
  },

  what: {
    de: 'Viele Fehler in Heften sind keine Wissenslücken, sondern Flüchtigkeitsfehler: ' +
        'abgeschriebene Zahlen, vergessene Rechenzeichen, ausgelassene Wörter. Kinder finden ' +
        'sie nicht, weil sie beim Durchlesen dasselbe sehen, was sie schreiben wollten. Deshalb ' +
        'wird die Kontrolle zu einem eigenen Arbeitsschritt gemacht: mit Abstand, mit anderem ' +
        'Stift, mit einer kurzen festen Liste und in anderer Richtung als beim Schreiben. Das ' +
        'wirkt nicht, weil das Kind länger hinschaut, sondern weil es etwas anderes tut als vorher.',
    ru: 'Многие ошибки в тетрадях — не пробелы в знаниях, а невнимательность: неправильно ' +
        'списанное число, забытый знак действия, пропущенное слово. Ребёнок их не находит, ' +
        'потому что при перечитывании видит то, что собирался написать. Поэтому проверку делают ' +
        'отдельным этапом работы: с паузой, другой ручкой, по короткому фиксированному списку и ' +
        'в другом направлении, чем при письме. Работает это не оттого, что ребёнок дольше ' +
        'смотрит, а оттого, что он делает нечто иное, чем прежде.',
    en: 'Many errors in notebooks are not gaps in knowledge but careless slips: miscopied numbers, ' +
        'forgotten operation signs, omitted words. Children do not find them because, when reading ' +
        'through, they see what they meant to write. That is why checking is made a separate work ' +
        'step: with a pause, with a different pen, with a short fixed list, and in a different ' +
        'direction than when writing. This works not because the child looks longer, but because it ' +
        'does something different than before.'
  },

  steps: {
    de: [
      'Mit etwas anfangen, das das Kind sicher kann – zehn Rechenaufgaben oder ein abgeschriebener Satz. Kontrolliert wird nur, gelernt wird gerade nichts.',
      'Zwischen Schreiben und Kontrollieren zwei Minuten Abstand: aufstehen, Wasser holen, Fenster aufmachen. Ohne Pause liest das Kind den eigenen Fehler mit.',
      'Stift wechseln: gerechnet wird mit Bleistift, kontrolliert mit einem grünen Stift. Jede geprüfte Zeile bekommt am Rand einen grünen Punkt – so sieht man, wie weit man ist.',
      'Von unten nach oben durchgehen, bei der letzten Aufgabe anfangen. Rückwärts liest man, was dasteht, nicht, was gemeint war.',
      'Genau drei Fragen stellen, immer dieselben: „Sind alle Aufgaben da?", „Stimmt das Rechenzeichen?", „Ist die Zahl richtig abgeschrieben?" Bei Texten: halblaut lesen und mit dem Finger Wort für Wort mitgehen.',
      'Gefundene Fehler auf einer Strichliste zählen – aber nur die selbst gefundenen. Diese Zahl ist das Ergebnis der Übung, nicht die Note.',
      'Nach einer Woche die drei häufigsten eigenen Fehler heraussuchen und auf eine Karte am Schreibtisch schreiben. Mehr als fünf Zeilen darf die Karte nie haben.',
      'Die Kontrolle endet nach zwei Durchgängen, auch wenn noch etwas drin sein könnte. Danach wird abgegeben.'
    ],
    ru: [
      'Начать с того, что ребёнок точно умеет — десять примеров или списанное предложение. Мы только проверяем, ничего нового сейчас не учим.',
      'Между письмом и проверкой — две минуты паузы: встать, налить воды, открыть окно. Без паузы ребёнок «дочитывает» ошибку правильной.',
      'Сменить ручку: считаем карандашом, проверяем зелёной ручкой. Каждая проверенная строка получает на полях зелёную точку — видно, докуда дошли.',
      'Идти снизу вверх, начиная с последнего примера. В обратном порядке читаешь то, что написано, а не то, что имелось в виду.',
      'Задавать ровно три вопроса, всегда одни и те же: «Все ли задания на месте?», «Верный ли знак действия?», «Правильно ли списано число?» Для текста: читать вполголоса и вести пальцем по каждому слову.',
      'Считать найденные ошибки палочками — но только найденные самостоятельно. Это число и есть результат упражнения, а не оценка.',
      'Через неделю выбрать три свои самые частые ошибки и записать их на карточку у письменного стола. Больше пяти строк на карточке быть не должно.',
      'Проверка заканчивается после двух проходов, даже если что-то ещё могло остаться. После этого работу сдают.'
    ],
    en: [
      'Start with something the child can do reliably – ten arithmetic problems or a copied sentence. This is only about checking; nothing new is being learned right now.',
      'Put two minutes between writing and checking: stand up, get some water, open the window. Without a pause the child reads its own error along as correct.',
      'Switch pens: calculations are done in pencil, checking with a green pen. Every checked line gets a green dot in the margin – that shows how far you have gotten.',
      'Go through from bottom to top, starting with the last problem. Backwards, you read what is actually there, not what was meant.',
      'Ask exactly three questions, always the same ones: "Are all the problems there?", "Is the operation sign correct?", "Is the number copied correctly?" For texts: read in a low voice and follow along word by word with a finger.',
      'Count the errors found with tally marks – but only the ones found by the child itself. This number is the result of the exercise, not the grade.',
      'After a week, pick out the child\'s three most frequent errors and write them on a card at the desk. The card must never have more than five lines.',
      'Checking ends after two passes, even if something might still be in there. After that, the work is handed in.'
    ]
  },

  tips: {
    de: [
      'Nicht mitkorrigieren. Wer „da ist noch einer" sagt, nimmt dem Kind genau den Schritt ab, um den es geht. Höchstens die Zeile nennen: „In Zeile 4 ist etwas."',
      'Die Checkliste schreibt das Kind selbst und mit eigenen Worten. Eine fremde Liste wird abgehakt, die eigene wird gelesen.',
      'Belohnt wird das Finden, nicht die Fehlerfreiheit. Wer für gefundene Fehler Ärger bekommt, hört auf zu suchen.',
      'Bei Hausaufgaben nur eine Aufgabe pro Tag kontrollieren lassen, nicht alles. Ein sauber geprüftes Blatt bringt mehr als fünf flüchtig überflogene.'
    ],
    ru: [
      'Не исправлять вместе с ребёнком. Фраза «вот тут ещё одна» отнимает у него именно тот шаг, ради которого всё делается. Максимум — назвать строку: «В четвёртой строке что-то не так».',
      'Список для проверки ребёнок пишет сам и своими словами. Чужой список отмечают галочкой, свой — читают.',
      'Хвалят за находку, а не за отсутствие ошибок. Если за найденные ошибки ругают, ребёнок перестаёт их искать.',
      'В домашних заданиях проверять по одному заданию в день, а не всё подряд. Один аккуратно проверенный лист полезнее пяти бегло просмотренных.'
    ],
    en: [
      'Do not correct along with the child. Saying "there\'s another one" takes away exactly the step this is all about. At most, name the line: "There is something in line 4."',
      'The child writes the checklist itself and in its own words. Someone else\'s list gets ticked off; one\'s own list gets read.',
      'What is rewarded is finding errors, not being error-free. A child who gets in trouble for found errors stops looking.',
      'For homework, have only one task checked per day, not everything. One carefully checked sheet is worth more than five skimmed ones.'
    ]
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Selbstinstruktionstraining', kind: 'wiki',
      label: { de: 'Wikipedia: Selbstinstruktionstraining (Meichenbaum)', ru: 'Википедия (нем.): тренинг самоинструкций', en: '' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%A1%D0%B0%D0%BC%D0%BE%D0%BA%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C', kind: 'wiki',
      label: { de: 'Wikipedia (russisch): Selbstkontrolle', ru: 'Википедия: самоконтроль', en: '' } },
    { url: 'https://de.wikipedia.org/wiki/Metakognition', kind: 'wiki',
      label: { de: 'Wikipedia: Metakognition – das eigene Denken überwachen', ru: 'Википедия (нем.): метапознание', en: '' } },
    { url: 'https://de.wikipedia.org/wiki/Korrekturlesen', kind: 'wiki',
      label: { de: 'Wikipedia: Korrekturlesen – wie Profis Texte prüfen', ru: 'Википедия (нем.): корректура текста', en: '' } }
  ],

  products: [
    {
      name: 'Kein Material nötig',
      maker: '',
      note: {
        de: 'Die Methode braucht nichts als das vorhandene Heft und einen zweiten Stift in einer ' +
            'auffälligen Farbe. Alles Weitere ist Beiwerk.',
        ru: 'Методу нужны только уже имеющаяся тетрадь и вторая ручка заметного цвета. Всё ' +
            'остальное — дополнение.',
        en: ''
      }
    },
    {
      name: 'Kontroll-Checkliste für den Schreibtisch (Eigenbau)',
      maker: '',
      price: 'unter 1 €',
      note: {
        de: 'Eine kurze Karte, die immer sichtbar am Arbeitsplatz steht. Sie enthält nur die ' +
            'Fehler, die dieses Kind tatsächlich macht – keine allgemeinen Ratschläge.',
        ru: 'Короткая карточка, которая всегда на виду на рабочем месте. На ней только те ' +
            'ошибки, которые действительно делает этот ребёнок, — никаких общих советов.',
        en: ''
      },
      diy: {
        de: 'Ein Stück fester Karton im Format A6 (105 × 148 mm) zuschneiden. Oben in Druckbuchstaben ' +
            '„Bevor ich abgebe", darunter höchstens fünf Zeilen mit je einer Frage, vom Kind ' +
            'geschrieben. Die Karte in eine Klarsichthülle stecken oder laminieren, dann lassen ' +
            'sich die Zeilen mit einem abwischbaren Folienstift ändern, wenn sich die typischen ' +
            'Fehler ändern. Zum Aufstellen den unteren Rand 25 mm umknicken oder die Karte mit ' +
            'zwei Streifen Klebeband an die Schreibtischkante heften. Für zwei Fächer zwei Karten ' +
            'in verschiedenen Farben – Mathe grün, Deutsch blau.',
        ru: 'Вырезать кусок плотного картона формата A6 (105 × 148 мм). Сверху печатными буквами ' +
            '«Прежде чем сдать», ниже — не больше пяти строк, по одному вопросу в каждой, ' +
            'написанных самим ребёнком. Вложить карточку в файл или заламинировать: тогда строки ' +
            'можно менять смываемым маркером, когда меняются типичные ошибки. Чтобы карточка ' +
            'стояла, отогнуть нижний край на 25 мм или закрепить её двумя полосками скотча на краю ' +
            'стола. Для двух предметов — две карточки разного цвета: математика зелёная, язык синяя.',
        en: ''
      }
    },
    {
      name: 'Grüner Fineliner oder Farbstift zum Kontrollieren',
      maker: 'STAEDTLER / Stabilo u. a.',
      url: 'https://www.staedtler.com/de/de/',
      price: 'ca. 1–3 € je Stift',
      note: {
        de: 'Ein Stift, der nur zum Kontrollieren benutzt wird – bewusst nicht Rot, das ist die ' +
            'Farbe der Lehrerin. Grün oder Orange machen sichtbar, wie viel das Kind selbst ' +
            'gefunden hat.',
        ru: 'Ручка, которой пользуются только для проверки, — намеренно не красная, красный цвет ' +
            'принадлежит учителю. Зелёный или оранжевый показывают, сколько ребёнок нашёл сам.',
        en: ''
      }
    }
  ],

  // Blatt mit Zeilen, drei grüne Kontrollpunkte am Rand, Lupe über einer Zeile
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <rect x="18" y="8" width="66" height="64" rx="4" fill="#FFFFFF" stroke="#D0CDE8" stroke-width="2"/>
    <line x1="27" y1="22" x2="74" y2="22" stroke="#D0CDE8" stroke-width="3" stroke-linecap="round"/>
    <line x1="27" y1="34" x2="74" y2="34" stroke="#D0CDE8" stroke-width="3" stroke-linecap="round"/>
    <line x1="27" y1="46" x2="62" y2="46" stroke="var(--secondary)" stroke-width="3" stroke-linecap="round"/>
    <line x1="27" y1="58" x2="74" y2="58" stroke="#D0CDE8" stroke-width="3" stroke-linecap="round"/>
    <circle cx="22" cy="22" r="2.6" fill="var(--green)"/>
    <circle cx="22" cy="34" r="2.6" fill="var(--green)"/>
    <circle cx="22" cy="58" r="2.6" fill="var(--green)"/>
    <circle cx="82" cy="44" r="15" fill="none" stroke="var(--primary)" stroke-width="4"/>
    <line x1="93" y1="55" x2="106" y2="68" stroke="var(--primary)" stroke-width="5" stroke-linecap="round"/>
  </svg>`
};
