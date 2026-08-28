/**
 * ERZEUGTE DATEI – nicht von Hand bearbeiten.
 * Neu erzeugen mit:  node tools/gen-miniapps.mjs   (läuft bei npm run build mit)
 *
 * Die eigenständigen Übungs-Apps unter apps/. Sie laufen für sich, mit
 * eigenem Bündel, und werden von den Methodenseiten aus verlinkt statt
 * eingebettet: ein Rahmen innerhalb der Seite bricht bei file:// je nach
 * Browser weg, ein Verweis nicht.
 *
 * Zuordnung Methode → App: src/data/miniapp-zuordnung.js
 */
export const MINIAPPS = [
  {
    id: "abakus",
    icon: "🧮",
    titel: {
      de: "Stein-Abakus",
      ru: "Каменный абак",
      en: "Stone abacus"
    },
    pfad: "apps/abakus/index.html"
  },
  {
    id: "begriffe-verbinden",
    icon: "🔗",
    titel: {
      de: "Wort & Bedeutung",
      ru: "Слово и значение",
      en: "Word & meaning"
    },
    pfad: "apps/begriffe-verbinden/index.html"
  },
  {
    id: "bildhafte-sprache",
    icon: "💬",
    titel: {
      de: "Bildhafte Sprache: wörtlich oder gemeint?",
      ru: "Образный язык: буквально или по смыслу?",
      en: "Figurative language: literal or meant?"
    },
    pfad: "apps/bildhafte-sprache/index.html"
  },
  {
    id: "bit-zahl",
    icon: "💡",
    titel: {
      de: "Null-Eins-Wandler",
      ru: "Ноль-один-преобразователь",
      en: "Zero-One Converter"
    },
    pfad: "apps/bit-zahl/index.html"
  },
  {
    id: "buchstaben-fallen",
    icon: "⌨️",
    titel: {
      de: "Buchstaben fangen",
      ru: "Поймай букву",
      en: "Catch the Letter"
    },
    pfad: "apps/buchstaben-fallen/index.html"
  },
  {
    id: "falschmuenzen",
    icon: "⚖️",
    titel: {
      de: "Falschmünzen-Waage",
      ru: "Фальшивая монета",
      en: "Counterfeit Coins"
    },
    pfad: "apps/falschmuenzen/index.html"
  },
  {
    id: "flaechen",
    icon: "📐",
    titel: {
      de: "Flächen selbst teilen",
      ru: "Площадь фигур",
      en: "Split the area yourself"
    },
    pfad: "apps/flaechen/index.html"
  },
  {
    id: "hanoi",
    icon: "🗼",
    titel: {
      de: "Türme von Hanoi",
      ru: "Ханойская башня",
      en: "Tower of Hanoi"
    },
    pfad: "apps/hanoi/index.html"
  },
  {
    id: "imagestories",
    icon: "🖼️",
    titel: {
      de: "Bildgeschichte ordnen",
      ru: "Собери историю",
      en: "Sort the story"
    },
    pfad: "apps/imagestories/index.html"
  },
  {
    id: "kettenrechnen",
    icon: "🔗",
    titel: {
      de: "Kettenrechnen",
      ru: "Цепочки вычислений",
      en: "Chain arithmetic"
    },
    pfad: "apps/kettenrechnen/index.html"
  },
  {
    id: "pfeil-programm",
    icon: "🎯",
    titel: {
      de: "Follow the Numbers",
      ru: "По следам чисел",
      en: "Follow the Numbers"
    },
    pfad: "apps/pfeil-programm/index.html"
  },
  {
    id: "polyomino",
    icon: "🧩",
    titel: {
      de: "Vielecke einsetzen",
      ru: "Многоугольники",
      en: "Fit the polygons"
    },
    pfad: "apps/polyomino/index.html"
  },
  {
    id: "schiebepuzzle",
    icon: "🧩",
    titel: {
      de: "Das Fünfzehner-Spiel",
      ru: "Игра в пятнадцать",
      en: "The Fifteen Puzzle"
    },
    pfad: "apps/schiebepuzzle/index.html"
  },
  {
    id: "streichholz-spiele",
    icon: "🥢",
    titel: {
      de: "Stäbchen-Knobelei",
      ru: "Головоломки со спичками",
      en: "Matchstick Puzzles"
    },
    pfad: "apps/streichholz-spiele/index.html"
  },
  {
    id: "symmetrie",
    icon: "🦋",
    titel: {
      de: "Symmetrie: Finde die Figur",
      ru: "Симметрия: найди фигуру",
      en: "Symmetry: Find the Shape"
    },
    pfad: "apps/symmetrie/index.html"
  },
  {
    id: "tanz-challenge",
    icon: "💃",
    titel: {
      de: "Tanz-Challenge",
      ru: "Танцевальный вызов",
      en: "Dance Challenge"
    },
    pfad: "apps/tanz-challenge/index.html"
  },
  {
    id: "tiere-sortieren",
    icon: "🐾",
    titel: {
      de: "Oberbegriffe: Tiere sortieren",
      ru: "Обобщения: сортируем животных",
      en: "Categories: Sorting Animals"
    },
    pfad: "apps/tiere-sortieren/index.html"
  },
  {
    id: "wimmelbilder",
    icon: "🧩",
    titel: {
      de: "Wimmelbild-Suche",
      ru: "Wimmelbild-Suche",
      en: "Wimmelbild-Suche"
    },
    pfad: "apps/wimmelbilder/index.html"
  },
  {
    id: "zahlenfolgen",
    icon: "🔢",
    titel: {
      de: "Zahlenfolgen",
      ru: "Числовые ряды",
      en: "Number sequences"
    },
    pfad: "apps/zahlenfolgen/index.html"
  },
  {
    id: "ziege-wolf-kohl",
    icon: "🚣",
    titel: {
      de: "Ziege, Wolf und Kohl",
      ru: "Коза, волк и капуста",
      en: "Goat, Wolf and Cabbage"
    },
    pfad: "apps/ziege-wolf-kohl/index.html"
  }
];

/** Eine App über ihre Kennung. */
export function getMiniapp(id) {
  return MINIAPPS.find(a => a.id === id) || null;
}
