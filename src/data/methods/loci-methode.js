/**
 * Loci-Methode (Gedächtnispalast)
 *
 * VORLAGE für weitere Methodenseiten – Format siehe README.md im selben
 * Verzeichnis. Sie zeigt alles, was eine gute Seite ausmacht: knappe
 * Erklärung, konkrete Schritte statt Allgemeinplätzen, geprüfte Links,
 * Material mit Bezugs- und Selbstbauhinweis, eigene Schemazeichnung.
 */
export default {
  id: 'loci-methode',
  icon: '🏛️',
  category: 'gedaechtnis',
  ages: '8-18',

  title: {
    de: 'Loci-Methode (Gedächtnispalast)',
    ru: 'Метод локусов (дворец памяти)',
    en: 'The Method of Loci (Memory Palace)'
  },

  short: {
    de: 'Dinge merken, indem man sie an feste Orte eines vertrauten Weges legt.',
    ru: 'Запоминание через размещение образов вдоль знакомого маршрута.',
    en: 'Remembering things by placing them at fixed points along a familiar route.'
  },

  what: {
    de: 'Die älteste bekannte Merktechnik: Man geht in Gedanken einen vertrauten Weg ab – ' +
        'vom Bett bis zur Haustür – und legt an jede Station ein Bild dessen, was man behalten ' +
        'will. Beim Abrufen geht man den Weg noch einmal und findet die Bilder dort wieder. ' +
        'Sie wirkt, weil das Gehirn Orte und Wege mühelos speichert, abstrakte Listen dagegen ' +
        'nicht. Für Kinder ab etwa acht Jahren geeignet; jüngere brauchen einen sehr kurzen Weg ' +
        'mit höchstens fünf Stationen.',
    ru: 'Древнейшая мнемотехника: мысленно проходят знакомый маршрут — от кровати до входной ' +
        'двери — и на каждой остановке размещают образ того, что нужно запомнить. При ' +
        'припоминании маршрут проходят снова и находят образы на месте. Работает потому, что ' +
        'мозг легко запоминает места и пути, но плохо — абстрактные списки. Подходит примерно ' +
        'с восьми лет; младшим нужен очень короткий маршрут, максимум пять остановок.',
    en: 'The oldest known memory technique: you walk a familiar route in your mind – from the bed to ' +
        'the front door – and place at every station an image of what you want to retain. To recall ' +
        'it, you walk the route once more and find the images there again. It works because the ' +
        'brain stores places and routes effortlessly, but abstract lists it does not. Suitable for ' +
        'children from about eight years of age; younger ones need a very short route with at most ' +
        'five stations.'
  },

  steps: {
    de: [
      'Einen Weg festlegen, den das Kind blind kennt: Bett → Tür → Bad → Küchentisch → Haustür. Fünf Stationen reichen zum Anfang.',
      'Den Weg zweimal laut durchgehen lassen, immer in derselben Richtung. Die Reihenfolge muss sitzen, bevor etwas hineingelegt wird.',
      'Für jeden zu merkenden Begriff ein Bild erfinden – je alberner, desto besser. „Milch" wird zur Kuh, die im Bett liegt.',
      'Das Bild an die Station legen und dabei die Bewegung mitsprechen: „Im Bett liegt eine Kuh und muht."',
      'Den Weg einmal in Gedanken abgehen und die Bilder aufzählen.',
      'Später am Tag noch einmal abfragen – erst dann zeigt sich, ob es hält.',
      'Denselben Weg für die nächste Liste wiederverwenden. Die alten Bilder verblassen von selbst.'
    ],
    ru: [
      'Выбрать маршрут, который ребёнок знает наизусть: кровать → дверь → ванная → кухонный стол → входная дверь. Для начала хватит пяти остановок.',
      'Дважды пройти маршрут вслух, всегда в одном направлении. Порядок должен закрепиться до того, как в него что-то помещают.',
      'Для каждого слова придумать образ — чем нелепее, тем лучше. «Молоко» превращается в корову, лежащую в кровати.',
      'Поместить образ на остановку и проговорить действие: «В кровати лежит корова и мычит».',
      'Мысленно пройти маршрут и перечислить образы.',
      'Спросить ещё раз позже в тот же день — только тогда видно, держится ли запоминание.',
      'Для следующего списка использовать тот же маршрут. Старые образы бледнеют сами.'
    ],
    en: [
      'Fix a route the child knows blindfolded: bed → door → bathroom → kitchen table → front door. Five stations are enough to start with.',
      'Have the child walk the route through out loud twice, always in the same direction. The order has to be secure before anything is put into it.',
      'Invent an image for every item to be remembered – the sillier, the better. "Milk" becomes a cow lying in the bed.',
      'Place the image at the station and say the action out loud as you do so: "There is a cow lying in the bed, mooing."',
      'Walk the route through once in your mind and list the images.',
      'Test again later the same day – only then does it show whether it holds.',
      'Reuse the same route for the next list. The old images fade of their own accord.'
    ]
  },

  tips: {
    de: [
      'Nicht mit Schulstoff anfangen, sondern mit dem Einkaufszettel. Erfolg zuerst, Nutzen später.',
      'Bilder müssen sich bewegen und Lärm machen – stille Bilder verblassen schneller.',
      'Wenn ein Bild nicht einfällt, war der Begriff zu abstrakt. Dann erst den Begriff bildhaft machen, dann ablegen.'
    ],
    ru: [
      'Начинать не со школьного материала, а со списка покупок. Сначала успех, польза потом.',
      'Образы должны двигаться и шуметь — тихие образы забываются быстрее.',
      'Если образ не придумывается, слово слишком абстрактное. Сначала сделать его наглядным, потом размещать.'
    ],
    en: [
      'Do not start with school material, but with the shopping list. Success first, usefulness later.',
      'Images have to move and make noise – silent images fade faster.',
      'If no image comes to mind, the term was too abstract. Then make the term vivid first, and only then place it.'
    ]
  },

  links: [
    { url: 'https://de.wikipedia.org/wiki/Loci-Methode', kind: 'wiki',
      label: { de: 'Wikipedia: Loci-Methode', ru: 'Википедия (нем.): метод локусов', en: 'Wikipedia (German): method of loci' } },
    { url: 'https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4_%D0%BB%D0%BE%D0%BA%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8', kind: 'wiki',
      label: { de: 'Wikipedia (russisch)', ru: 'Википедия: метод локализации', en: 'Wikipedia (Russian): method of loci' } },
    { url: 'https://www.gedaechtnis.org/', kind: 'community',
      label: { de: 'Gedächtnissport-Verband: Übungen und Wettbewerbe', ru: 'Союз мнемоспорта: упражнения', en: 'German memory sport association: exercises and competitions' } }
  ],

  products: [
    {
      name: 'Kein Material nötig',
      maker: '',
      note: {
        de: 'Die Methode braucht nichts als einen bekannten Weg. Wer mag, zeichnet ihn einmal ' +
            'als Grundriss auf ein Blatt und hängt ihn auf – das hilft in den ersten Wochen.',
        ru: 'Методу не нужно ничего, кроме знакомого маршрута. При желании один раз нарисуйте ' +
            'его план на листе и повесьте на стену — это помогает в первые недели.',
        en: 'The method needs nothing but a familiar route. If you like, draw it once as a floor ' +
            'plan on a sheet of paper and hang it up – that helps during the first few weeks.'
      },
      diy: {
        de: 'Grundriss der Wohnung auf A4 zeichnen, die Stationen nummerieren, laminieren oder ' +
            'in eine Klarsichthülle stecken. Mit abwischbarem Stift lassen sich die Bilder je ' +
            'Runde eintragen und wieder löschen.',
        ru: 'Нарисуйте план квартиры на A4, пронумеруйте остановки, заламинируйте или вложите в ' +
            'файл. Смываемым маркером можно вписывать образы и стирать их после каждого раза.',
        en: 'Draw a floor plan of the flat on A4, number the stations, and laminate it or slip it ' +
            'into a clear plastic sleeve. With a wipeable pen the images can be entered for each ' +
            'round and erased again.'
      }
    }
  ],

  // Schemazeichnung: Weg mit nummerierten Stationen
  svg: `<svg viewBox="0 0 120 80" role="img" aria-hidden="true">
    <path d="M12 62 L34 26 L60 52 L86 22 L108 46" fill="none"
          stroke="#D0CDE8" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 4"/>
    <circle cx="12" cy="62" r="7" fill="var(--primary)"/>
    <circle cx="34" cy="26" r="7" fill="var(--accent)"/>
    <circle cx="60" cy="52" r="7" fill="var(--gold)"/>
    <circle cx="86" cy="22" r="7" fill="var(--orange)"/>
    <circle cx="108" cy="46" r="7" fill="var(--green)"/>
    <text x="12" y="65" text-anchor="middle" font-size="8" fill="#fff" font-weight="700">1</text>
    <text x="34" y="29" text-anchor="middle" font-size="8" fill="#fff" font-weight="700">2</text>
    <text x="60" y="55" text-anchor="middle" font-size="8" fill="#2D2A4A" font-weight="700">3</text>
    <text x="86" y="25" text-anchor="middle" font-size="8" fill="#fff" font-weight="700">4</text>
    <text x="108" y="49" text-anchor="middle" font-size="8" fill="#fff" font-weight="700">5</text>
  </svg>`
};
