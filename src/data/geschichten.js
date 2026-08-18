/**
 * Bildfolgen für „Geschichte ordnen".
 *
 * Eine Datei, damit neue Geschichten nur hier dazu kommen – das Spielmodul
 * kennt nur das Schema. Jeder Eintrag:
 *
 *   id      eindeutig, kebab-case
 *   t       Stufe 1–5 (mehr Bilder, bekanntere aber längere Handlung)
 *   quelle  woher die Reihenfolge kommt (Märchen, Natur, Film …)
 *   titel   {de,ru,en}
 *   bilder  3–10 Emoji in der richtigen Reihenfolge
 *   warum   {de,ru,en} – ein Satz, warum es so und nicht anders läuft
 *
 * Nur Folgen, deren Richtung festliegt: Naturablauf oder eine allgemein
 * bekannte Handlung (Rübe, Aschenputtel, Kolobok). Keine freien Mini-Dramen,
 * die man ebenso gut rückwärts lesen könnte.
 */
export const MAX_BILDER = 10;

export const FOLGEN = [
  // ── Stufe 1: drei Bilder ───────────────────────────────────────────
  { id: 'zahlen-3', t: 1, quelle: 'zahlen',
    titel: { de: 'Zählen', ru: 'Счёт', en: 'Counting' },
    bilder: ['1️⃣', '2️⃣', '3️⃣'],
    warum: { de: 'Die Zahlen zählen aufwärts.', ru: 'Числа идут по возрастанию.', en: 'The numbers count upwards.' } },
  { id: 'kueken', t: 1, quelle: 'natur',
    titel: { de: 'Vom Ei zum Huhn', ru: 'От яйца к курице', en: 'From egg to hen' },
    bilder: ['🥚', '🐣', '🐔'],
    warum: { de: 'Aus dem Ei schlüpft das Küken, daraus wird das Huhn.', ru: 'Из яйца вылупляется цыплёнок, из него вырастает курица.', en: 'The chick hatches from the egg and becomes a hen.' } },
  { id: 'baum-3', t: 1, quelle: 'natur',
    titel: { de: 'Der Baum wächst', ru: 'Дерево растёт', en: 'The tree grows' },
    bilder: ['🌱', '🌿', '🌳'],
    warum: { de: 'Aus dem Keim wird die Pflanze, daraus der Baum.', ru: 'Из ростка вырастает растение, затем дерево.', en: 'The sprout becomes a plant, then a tree.' } },
  { id: 'falter-3', t: 1, quelle: 'natur',
    titel: { de: 'Raupe und Falter', ru: 'Гусеница и бабочка', en: 'Caterpillar and butterfly' },
    bilder: ['🐛', '🛌', '🦋'],
    warum: { de: 'Die Raupe verpuppt sich und wird zum Schmetterling.', ru: 'Гусеница окукливается и становится бабочкой.', en: 'The caterpillar pupates and becomes a butterfly.' } },
  { id: 'tag-3', t: 1, quelle: 'natur',
    titel: { de: 'Ein Tag', ru: 'Один день', en: 'A day' },
    bilder: ['🌅', '☀️', '🌙'],
    warum: { de: 'Morgen, Tag, Nacht.', ru: 'Утро, день, ночь.', en: 'Morning, day, night.' } },
  { id: 'eis-3', t: 1, quelle: 'natur',
    titel: { de: 'Eis wird Dampf', ru: 'Лёд становится паром', en: 'Ice to vapour' },
    bilder: ['🧊', '💧', '💨'],
    warum: { de: 'Eis schmilzt zu Wasser, Wasser wird zu Dampf.', ru: 'Лёд тает в воду, вода превращается в пар.', en: 'Ice melts into water, water turns into vapour.' } },

  // ── Stufe 2: vier Bilder ───────────────────────────────────────────
  { id: 'mensch-alt', t: 2, quelle: 'natur',
    titel: { de: 'Ein Leben', ru: 'Жизнь человека', en: 'A lifetime' },
    bilder: ['👶', '🧒', '🧑', '🧓'],
    warum: { de: 'Ein Mensch wird älter.', ru: 'Человек становится старше.', en: 'A person grows older.' } },
  { id: 'tag-4', t: 2, quelle: 'natur',
    titel: { de: 'Der Tag vergeht', ru: 'День проходит', en: 'The day passes' },
    bilder: ['🌅', '☀️', '🌇', '🌙'],
    warum: { de: 'So läuft ein Tag ab.', ru: 'Так проходит день.', en: 'That is how a day goes.' } },
  { id: 'zahlen-4', t: 2, quelle: 'zahlen',
    titel: { de: 'Bis vier', ru: 'До четырёх', en: 'Up to four' },
    bilder: ['1️⃣', '2️⃣', '3️⃣', '4️⃣'],
    warum: { de: 'Die Zahlen zählen aufwärts.', ru: 'Числа идут по возрастанию.', en: 'The numbers count upwards.' } },
  { id: 'tiere-gross', t: 2, quelle: 'natur',
    titel: { de: 'Immer größer', ru: 'Всё крупнее', en: 'Bigger and bigger' },
    bilder: ['🐜', '🐁', '🐕', '🐘'],
    warum: { de: 'Die Tiere werden größer.', ru: 'Животные становятся крупнее.', en: 'The animals get bigger.' } },
  { id: 'haessliches-entenkueken', t: 2, quelle: 'maerchen',
    titel: { de: 'Das hässliche Entlein', ru: 'Гадкий утёнок', en: 'The Ugly Duckling' },
    bilder: ['🥚', '🐣', '😢', '🦢'],
    warum: { de: 'Das Küken wird ausgelacht und wächst zum Schwan.', ru: 'Птенца дразнят, он вырастает в лебедя.', en: 'The chick is mocked and grows into a swan.' } },
  { id: 'froschkoenig', t: 2, quelle: 'maerchen',
    titel: { de: 'Der Froschkönig', ru: 'Царевна-лягушка', en: 'The Frog Prince' },
    bilder: ['👸', '⚽', '🐸', '🤴'],
    warum: { de: 'Die Prinzessin verliert den Ball, der Frosch holt ihn, daraus wird der Prinz.', ru: 'Царевна теряет мяч, лягушка помогает, становится царевичем.', en: 'The princess loses the ball, the frog helps, and becomes a prince.' } },

  // ── Stufe 3: fünf Bilder ───────────────────────────────────────────
  { id: 'mond-zu-ab', t: 3, quelle: 'natur',
    titel: { de: 'Der Mond', ru: 'Луна', en: 'The moon' },
    bilder: ['🌑', '🌓', '🌕', '🌗', '🌑'],
    warum: { de: 'Der Mond nimmt zu und wieder ab.', ru: 'Луна прибывает и убывает.', en: 'The moon waxes and wanes.' } },
  { id: 'apfelkuchen', t: 3, quelle: 'alltag',
    titel: { de: 'Apfelkuchen', ru: 'Яблочный пирог', en: 'Apple pie' },
    bilder: ['🌸', '🍏', '🍎', '🥧', '😋'],
    warum: { de: 'Aus der Blüte wird die Frucht, daraus der Kuchen, dann wird er gegessen.', ru: 'Из цветка плод, из него пирог, потом его едят.', en: 'Blossom to fruit to pie to eating it.' } },
  { id: 'brot', t: 3, quelle: 'alltag',
    titel: { de: 'Vom Korn zum Brot', ru: 'От зерна к хлебу', en: 'From grain to bread' },
    bilder: ['🌱', '🌾', '🍞', '🥪', '😋'],
    warum: { de: 'Korn wächst, wird Brot, dann ein belegtes Brot.', ru: 'Зерно растёт, становится хлебом, затем бутербродом.', en: 'Grain grows, becomes bread, then a sandwich.' } },
  { id: 'dornroeschen', t: 3, quelle: 'maerchen',
    titel: { de: 'Dornröschen', ru: 'Спящая красавица', en: 'Sleeping Beauty' },
    bilder: ['👸', '🪡', '😴', '💋', '😊'],
    warum: { de: 'Die Prinzessin sticht sich, schläft, der Kuss weckt sie.', ru: 'Царевна колется, засыпает, поцелуй будит её.', en: 'The princess pricks her finger, sleeps, a kiss wakes her.' } },
  { id: 'rapunzel', t: 3, quelle: 'maerchen',
    titel: { de: 'Rapunzel', ru: 'Рапунцель', en: 'Rapunzel' },
    bilder: ['🔒', '💇', '🤴', '⬇️', '🏃'],
    warum: { de: 'Im Turm, am Haar steigt der Prinz, dann die Flucht.', ru: 'В башне, принц по волосам, потом побег.', en: 'In the tower, the prince climbs the hair, then they flee.' } },
  { id: 'kolobok', t: 3, quelle: 'maerchen',
    titel: { de: 'Kolobok', ru: 'Колобок', en: 'Kolobok' },
    bilder: ['🌾', '🍞', '🌲', '🦊', '😮'],
    warum: { de: 'Aus Mehl der Kloß, er rollt in den Wald, der Fuchs frisst ihn.', ru: 'Из муки колобок, катится в лес, лиса его съедает.', en: 'From flour the bun, it rolls to the woods, the fox eats it.' } },

  // ── Stufe 4: sechs bis sieben Bilder ───────────────────────────────
  { id: 'mond-zu', t: 4, quelle: 'natur',
    titel: { de: 'Mond nimmt zu', ru: 'Луна растёт', en: 'Waxing moon' },
    bilder: ['🌑', '🌒', '🌓', '🌔', '🌕'],
    warum: { de: 'Der Mond nimmt Schritt für Schritt zu.', ru: 'Луна прибывает шаг за шагом.', en: 'The moon waxes step by step.' } },
  { id: 'aschenputtel', t: 4, quelle: 'maerchen',
    titel: { de: 'Aschenputtel', ru: 'Золушка', en: 'Cinderella' },
    bilder: ['🧹', '👗', '🕛', '👠', '💍'],
    warum: { de: 'Putzen, Ball, Mitternacht, der Schuh, die Hochzeit.', ru: 'Уборка, бал, полночь, туфелька, свадьба.', en: 'Chores, the ball, midnight, the shoe, the wedding.' } },
  { id: 'rotkaeppchen', t: 4, quelle: 'maerchen',
    titel: { de: 'Rotkäppchen', ru: 'Красная Шапочка', en: 'Little Red Riding Hood' },
    bilder: ['👧', '🧺', '🌲', '🐺', '👵'],
    warum: { de: 'Das Mädchen nimmt den Korb, geht in den Wald, der Wolf kommt vor der Großmutter an.', ru: 'Девочка берёт корзину, идёт в лес, волк опережает бабушку.', en: 'The girl takes the basket, goes to the woods, the wolf reaches granny first.' } },
  { id: 'schneewittchen', t: 4, quelle: 'maerchen',
    titel: { de: 'Schneewittchen', ru: 'Белоснежка', en: 'Snow White' },
    bilder: ['🪞', '🍎', '😴', '💋', '👑'],
    warum: { de: 'Der Spiegel, der Apfel, der Schlaf, der Kuss, die Krone.', ru: 'Зеркало, яблоко, сон, поцелуй, корона.', en: 'The mirror, the apple, the sleep, the kiss, the crown.' } },
  { id: 'haensel-gretel', t: 4, quelle: 'maerchen',
    titel: { de: 'Hänsel und Gretel', ru: 'Гензель и Гретель', en: 'Hansel and Gretel' },
    bilder: ['🍞', '🌲', '🏠', '🍬', '🔥'],
    warum: { de: 'Brotkrumen, Wald, das Pfefferkuchenhaus, dann der Ofen.', ru: 'Крошки, лес, пряничный домик, потом печь.', en: 'Breadcrumbs, the woods, the gingerbread house, then the oven.' } },
  { id: 'drei-schweinchen', t: 4, quelle: 'maerchen',
    titel: { de: 'Die drei kleinen Schweinchen', ru: 'Три поросёнка', en: 'The Three Little Pigs' },
    bilder: ['🐷', '🌾', '🪵', '🧱', '🐺'],
    warum: { de: 'Drei Häuser: Stroh, Holz, Stein – dann kommt der Wolf.', ru: 'Три дома: солома, дерево, камень — потом волк.', en: 'Three houses: straw, wood, brick – then the wolf.' } },
  { id: 'nuess-baum-holz', t: 4, quelle: 'natur',
    titel: { de: 'Von der Nuss zum Holz', ru: 'От ореха к бревну', en: 'From nut to timber' },
    bilder: ['🌰', '🌱', '🌿', '🌳', '🪵'],
    warum: { de: 'Aus der Nuss der Baum, aus dem Baum das Holz.', ru: 'Из ореха дерево, из дерева древесина.', en: 'The nut becomes a tree, the tree becomes timber.' } },

  // ── Stufe 5: acht bis zehn Bilder ──────────────────────────────────
  { id: 'ruebe', t: 5, quelle: 'maerchen',
    titel: { de: 'Die Rübe', ru: 'Репка', en: 'The Turnip' },
    bilder: ['🌱', '👴', '👵', '👧', '🐕', '🐈', '🐁', '🎉'],
    warum: { de: 'An der Rübe ziehen Großvater, Großmutter, Enkelin, Hund, Katze und Maus – dann sitzt sie.', ru: 'Репку тянут дед, бабка, внучка, Жучка, кошка и мышка — потом вытянули.', en: 'Grandfather, grandmother, granddaughter, dog, cat and mouse pull the turnip – then it comes out.' } },
  { id: 'bremer', t: 5, quelle: 'maerchen',
    titel: { de: 'Die Bremer Stadtmusikanten', ru: 'Бременские музыканты', en: 'Town Musicians of Bremen' },
    bilder: ['🫏', '🐕', '🐈', '🐓', '🏠', '🎵', '🐺', '🌙'],
    warum: { de: 'Esel, Hund, Katze, Hahn kommen zusammen, singen am Haus, die Räuber fliehen in die Nacht.', ru: 'Осёл, пёс, кот, петух сходятся, поют у дома, разбойники бегут в ночь.', en: 'Donkey, dog, cat, rooster join, sing at the house, the robbers flee into the night.' } },
  { id: 'falter-kreis', t: 5, quelle: 'natur',
    titel: { de: 'Kreis der Falter', ru: 'Круг бабочки', en: 'Butterfly cycle' },
    bilder: ['🥚', '🐛', '🛌', '🦋', '🌸', '🥚'],
    warum: { de: 'Der Kreislauf beginnt von vorn.', ru: 'Круг начинается заново.', en: 'The cycle starts over.' } },
  { id: 'winnie', t: 5, quelle: 'film',
    titel: { de: 'Puuh und der Honig', ru: 'Винни и мёд', en: 'Pooh and the honey' },
    bilder: ['🐻', '🍯', '🐝', '🎈', '🌳', '😅'],
    warum: { de: 'Puuh will Honig, die Bienen kommen, der Ballon hebt ihn zum Baum.', ru: 'Винни хочет мёд, пчёлы, шар поднимает к дереву.', en: 'Pooh wants honey, the bees come, the balloon lifts him to the tree.' } },
  { id: 'nemo', t: 5, quelle: 'film',
    titel: { de: 'Findet Nemo', ru: 'В поисках Немо', en: 'Finding Nemo' },
    bilder: ['🐠', '🌊', '🤿', '🦈', '🐢', '🏠'],
    warum: { de: 'Nemo schwimmt fort, wird gefangen, Hai und Schildkröte, dann nach Hause.', ru: 'Немо уплывает, его ловят, акула и черепаха, потом домой.', en: 'Nemo swims off, is caught, shark and turtle, then home.' } },
  { id: 'eiskoenigin', t: 5, quelle: 'film',
    titel: { de: 'Die Eiskönigin', ru: 'Холодное сердце', en: 'Frozen' },
    bilder: ['👑', '❄️', '🚪', '⛄', '💔', '☀️', '🤗'],
    warum: { de: 'Elsa friert das Land ein, Olaf, die Schwester taut alles mit Liebe auf.', ru: 'Эльза замораживает край, Олаф, сестра всё оттаивает любовью.', en: 'Elsa freezes the land, Olaf, the sister thaws it with love.' } },
  { id: 'koenig-der-loewen', t: 5, quelle: 'film',
    titel: { de: 'Der König der Löwen', ru: 'Король Лев', en: 'The Lion King' },
    bilder: ['🌅', '🦁', '💔', '🐗', '🌍', '⚔️', '👑'],
    warum: { de: 'Sonnenaufgang, der Vater stirbt, Flucht, die Erde, der Kampf, die Krone.', ru: 'Рассвет, отец гибнет, бегство, земля, бой, корона.', en: 'Sunrise, the father dies, exile, the land, the fight, the crown.' } }
];

export function pruefeFolgen() {
  const ids = new Set();
  for (const f of FOLGEN) {
    if (!f.id || ids.has(f.id)) throw new Error('geschichte: id fehlt oder doppelt: ' + f.id);
    ids.add(f.id);
    if (!f.t || f.t < 1 || f.t > 5) throw new Error(f.id + ': Stufe');
    if (!f.bilder || f.bilder.length < 3 || f.bilder.length > MAX_BILDER) {
      throw new Error(f.id + ': 3–' + MAX_BILDER + ' Bilder');
    }
    if (!f.titel?.de || !f.warum?.de) throw new Error(f.id + ': titel/warum');
  }
}
pruefeFolgen();
