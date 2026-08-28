/**
 * Dieselbe Übung ohne Bildschirm.
 *
 * Der Bildschirm ist hier der Notbehelf, nicht das Ziel. Eine Aufgabe am
 * Tisch – mit Kärtchen, Bausteinen, Münzen, den eigenen Händen – ist der
 * App in fast allem überlegen:
 *
 *   • Ein Mensch sitzt gegenüber. Er sieht, ob das Kind rät, aufgibt, sich
 *     verzettelt oder nur die Aufgabe nicht verstanden hat. Kein Programm
 *     bemerkt das.
 *   • Das Kind greift an. Was in der Hand liegt, wird anders behalten als
 *     was auf Glas erscheint.
 *   • Es ist beliebig anpassbar. Zu schwer? Ein Kärtchen weniger. Langweilig?
 *     Nimm die Lieblingstiere. Eine App kann das nur, wo es eingebaut wurde.
 *   • Es kostet nichts und geht überall: im Wartezimmer, im Auto, beim
 *     Warten aufs Essen.
 *
 * Wozu dann die App? Für die Fälle, in denen das Material fehlt, niemand Zeit
 * hat, oder eine Messung vergleichbar sein soll – die App misst Zeiten und
 * Stufen gleichmäßig, das gelingt am Küchentisch nicht. Sie ersetzt das Üben
 * nicht, sie hält es am Laufen und macht es nachvollziehbar.
 *
 * Aufbau eines Eintrags:
 *   material  was gebraucht wird – möglichst was ohnehin im Haus ist
 *   so        wie es abläuft, in zwei bis drei Sätzen
 */
export const ANALOG = {
  'seq-zahlenfolgen': {
    material: { de: 'Zettel und Stift', ru: 'Листок и карандаш', en: 'Paper and pencil' },
    so: {
      de: 'Sag drei Zahlen langsam vor, eine Sekunde Abstand: „4 – 7 – 2". Das Kind sagt sie nach. Klappt es zweimal, nimm eine Zahl mehr dazu; klappt es nicht, eine weniger. Die längste Reihe, die zweimal sicher saß, ist das Ergebnis.',
      ru: 'Медленно назови три числа с паузой в секунду: «4 – 7 – 2». Ребёнок повторяет. Получилось дважды — добавь ещё одно число, не получилось — убери одно. Самый длинный ряд, который дважды вышел уверенно, и есть результат.',
      en: 'Say three numbers slowly, a second apart: "4 – 7 – 2". The child repeats them. If it works twice, add one more; if not, take one away. The longest row that held twice is the result.'
    }
  },
  'seq-zahlenfolgen-audio': {
    material: { de: 'Nichts – nur Sprechen und Zuhören', ru: 'Ничего — только говорить и слушать', en: 'Nothing – just speaking and listening' },
    so: {
      de: 'Wie die Zahlenfolge, aber ohne etwas hinzulegen: nur vorsprechen, das Kind sieht dabei weg oder schließt die Augen. Das ist die eigentliche Merkspannen-Aufgabe – ohne Bild gibt es keine Stütze.',
      ru: 'Как ряд чисел, но ничего не выкладывая: только произносить, ребёнок отворачивается или закрывает глаза. Это и есть настоящая проверка объёма памяти — без картинки нет опоры.',
      en: 'Like the number row, but with nothing laid out: only spoken, with the child looking away or eyes closed. That is the real memory-span task – without a picture there is no crutch.'
    }
  },
  'seq-zahlen-rueckwaerts': {
    material: { de: 'Nichts', ru: 'Ничего', en: 'Nothing' },
    so: {
      de: 'Zwei Zahlen vorsprechen, das Kind sagt sie rückwärts: „3 – 8" wird zu „8 – 3". Mit zwei anfangen, auch bei größeren Kindern. Wenn es hakt: die Zahlen auf Kärtchen legen, umdrehen lassen, dann vorlesen – so wird das Umdrehen sichtbar, bevor es im Kopf gelingen muss.',
      ru: 'Назвать два числа, ребёнок повторяет их наоборот: «3 – 8» превращается в «8 – 3». Начинать с двух даже со старшими. Если не идёт: выложить числа карточками, дать перевернуть порядок руками, потом прочитать — так переворот виден до того, как он получится в уме.',
      en: 'Say two numbers, the child says them backwards: "3 – 8" becomes "8 – 3". Start with two even for older children. If it stalls: lay the numbers out as cards, let the child reverse them by hand, then read – that makes the reversal visible before it has to happen in the head.'
    }
  },
  'seq-wortreihe': {
    material: { de: 'Bildkarten oder Spielzeugtiere', ru: 'Карточки с картинками или игрушечные животные', en: 'Picture cards or toy animals' },
    so: {
      de: 'Leg drei Bilder in einer Reihe aus, benenne sie und deck sie zu. Das Kind holt sie aus einem größeren Stapel in derselben Reihenfolge wieder. Mit vier, fünf Bildern weitermachen, solange es hält.',
      ru: 'Выложи в ряд три картинки, назови их и накрой. Ребёнок достаёт их из большей стопки в том же порядке. Дальше — четыре, пять, пока получается.',
      en: 'Lay out three pictures in a row, name them and cover them. The child picks them from a larger pile in the same order. Continue with four, five, as long as it holds.'
    }
  },
  'seq-wortreihe-audio': {
    material: { de: 'Nichts', ru: 'Ничего', en: 'Nothing' },
    so: {
      de: 'Sprich eine Wörterkette vor – „Hund, Tisch, Apfel" – und lass sie nachsprechen. Nur Alltagswörter nehmen, keine Fantasienamen: gemessen wird das Behalten, nicht das Verstehen.',
      ru: 'Произнеси цепочку слов — «собака, стол, яблоко» — и попроси повторить. Только обычные слова, без выдуманных: проверяется запоминание, а не понимание.',
      en: 'Say a chain of words – "dog, table, apple" – and have it repeated. Use everyday words only, no invented names: what is measured is retention, not comprehension.'
    }
  },
  'seq-handbewegungen': {
    material: { de: 'Nur die Hände', ru: 'Только руки', en: 'Just your hands' },
    so: {
      de: 'Drei Handzeichen nacheinander vormachen – Faust, flache Hand, Handkante – und das Kind macht sie in derselben Reihenfolge nach. Langsam vormachen, ohne zu sprechen: gemeint ist das Nachahmen einer Bewegungsfolge, nicht das Befolgen einer Ansage.',
      ru: 'Покажи три жеста подряд — кулак, ладонь, ребро ладони — ребёнок повторяет их в том же порядке. Показывай медленно и молча: речь о повторении последовательности движений, а не о выполнении команды.',
      en: 'Show three hand signs in a row – fist, flat hand, edge of hand – and the child copies them in the same order. Demonstrate slowly and without speaking: this is about copying a sequence of movements, not following an instruction.'
    }
  },
  'seq-koffer-packen': {
    material: { de: 'Eine Tasche und Gegenstände aus dem Haus', ru: 'Сумка и вещи из дома', en: 'A bag and things from around the house' },
    so: {
      de: '„Ich packe in meinen Koffer: eine Zahnbürste." Der Nächste wiederholt alles und legt einen Gegenstand dazu. Mit echten Dingen in einer echten Tasche – dann sieht man am Ende gemeinsam nach.',
      ru: '«Я беру с собой в чемодан: зубную щётку». Следующий повторяет всё и добавляет свой предмет. С настоящими вещами в настоящей сумке — в конце вместе проверяете.',
      en: '"I am packing in my suitcase: a toothbrush." The next player repeats everything and adds one item. With real things in a real bag – then you check together at the end.'
    }
  },
  'seq-koffer-packen-audio': {
    material: { de: 'Nichts', ru: 'Ничего', en: 'Nothing' },
    so: {
      de: 'Dasselbe Spiel, aber nur gesprochen, ohne Gegenstände. So spielt man es unterwegs – im Auto, an der Bushaltestelle, beim Warten.',
      ru: 'Та же игра, но только на слух, без предметов. Так в неё играют в дороге — в машине, на остановке, в очереди.',
      en: 'The same game, spoken only, without objects. That is how it is played on the move – in the car, at the bus stop, while waiting.'
    }
  },
  'seq-rhythmus': {
    material: { de: 'Ein Tisch oder zwei Kochlöffel', ru: 'Стол или две деревянные ложки', en: 'A table or two wooden spoons' },
    so: {
      de: 'Klopf einen kurzen Rhythmus, das Kind klopft ihn nach. Erst drei Schläge gleichmäßig, dann mit Pausen dazwischen. Nicht mitzählen lassen – es geht um das Hören, nicht um das Rechnen.',
      ru: 'Простучи короткий ритм, ребёнок повторяет. Сначала три ровных удара, потом с паузами. Не давай считать вслух — важно услышать, а не посчитать.',
      en: 'Tap a short rhythm, the child taps it back. First three even beats, then with pauses. Do not let them count along – this is about hearing, not arithmetic.'
    }
  },
  'sim-konzeptbildung': {
    material: { de: 'Vier Gegenstände oder Bildkarten', ru: 'Четыре предмета или карточки', en: 'Four objects or picture cards' },
    so: {
      de: 'Leg vier Dinge hin, von denen drei zusammengehören: Apfel, Banane, Birne, Schuh. „Was passt nicht dazu?" Danach immer die wichtigste Frage: „Warum?" – die Begründung sagt mehr als die Wahl.',
      ru: 'Положи четыре предмета, три из которых связаны: яблоко, банан, груша, ботинок. «Что лишнее?» И сразу самый важный вопрос: «Почему?» — объяснение говорит больше, чем сам выбор.',
      en: 'Lay out four things, three of which belong together: apple, banana, pear, shoe. "Which one does not fit?" Then always the key question: "Why?" – the reason says more than the choice.'
    }
  },
  'sim-gesichter': {
    material: { de: 'Fotos aus dem Familienalbum oder einer Zeitschrift', ru: 'Фотографии из семейного альбома или журнала', en: 'Photos from a family album or a magazine' },
    so: {
      de: 'Zeig ein Gesicht fünf Sekunden lang, dann leg es zwischen drei andere. Das Kind zeigt auf das eben gesehene. Zeitschriftenfotos sind besser als bekannte Gesichter – Verwandte erkennt man auch ohne Merken.',
      ru: 'Покажи лицо на пять секунд, потом положи его среди трёх других. Ребёнок показывает то, которое видел. Фото из журнала лучше знакомых лиц — родственника узнают и без запоминания.',
      en: 'Show a face for five seconds, then place it among three others. The child points to the one just seen. Magazine photos work better than familiar faces – a relative is recognised without any remembering.'
    }
  },
  'sim-rover': {
    material: { de: 'Karopapier oder Fliesenboden', ru: 'Клетчатая бумага или кафельный пол', en: 'Squared paper or a tiled floor' },
    so: {
      de: 'Male ein Gitter, setze Hindernisse und ein Ziel. Das Kind zeichnet den kürzesten Weg mit dem Finger, bevor es ihn mit dem Stift zieht. Auf Fliesen geht es auch in groß: das Kind läuft den Weg selbst.',
      ru: 'Нарисуй сетку, расставь препятствия и цель. Ребёнок сначала проводит кратчайший путь пальцем, потом карандашом. На плитке можно в полный рост: ребёнок сам проходит маршрут.',
      en: 'Draw a grid, set obstacles and a goal. The child traces the shortest path with a finger before drawing it. On tiles it works life-size: the child walks the route.'
    }
  },
  'sim-dreiecke': {
    material: { de: 'Aus Pappe geschnittene Dreiecke, beidseitig verschieden gefärbt', ru: 'Треугольники из картона, разные с двух сторон', en: 'Cardboard triangles, coloured differently on each side' },
    so: {
      de: 'Schneide acht gleiche Dreiecke, male jede Seite in einer anderen Farbe an. Leg eine Figur vor, das Kind baut sie nach. Das Wenden der Teile ist der Kern der Übung – deshalb müssen die Seiten verschieden sein.',
      ru: 'Вырежи восемь одинаковых треугольников, раскрась стороны в разные цвета. Выложи фигуру, ребёнок повторяет. Переворачивание деталей — суть упражнения, поэтому стороны должны отличаться.',
      en: 'Cut eight identical triangles and colour each side differently. Lay out a figure, the child rebuilds it. Turning the pieces over is the point of the exercise – that is why the sides must differ.'
    }
  },
  'sim-bausteine': {
    material: { de: 'Bauklötze', ru: 'Кубики', en: 'Building blocks' },
    so: {
      de: 'Bau einen Stapel, bei dem hintere Klötze verdeckt sind, und lass zählen. Danach abbauen und gemeinsam nachzählen – das Auseinandernehmen ist der Moment, in dem das Kind versteht, warum es einen mehr waren.',
      ru: 'Сложи горку, где задние кубики не видны, и попроси сосчитать. Потом разбери и пересчитайте вместе — именно при разборке ребёнок понимает, почему кубиков было на один больше.',
      en: 'Build a stack in which rear blocks are hidden and ask for a count. Then take it apart and count together – dismantling is the moment the child sees why there was one more.'
    }
  },
  'sim-gestaltschliessen': {
    material: { de: 'Zeitschriftenbilder und ein Blatt Papier', ru: 'Картинки из журнала и лист бумаги', en: 'Magazine pictures and a sheet of paper' },
    so: {
      de: 'Deck ein Bild zum größten Teil ab und schieb das Papier langsam weg. Bei welchem Ausschnitt erkennt das Kind, was es ist? Auch mit dem Schattenriss eines Gegenstands hinter einem Tuch.',
      ru: 'Закрой картинку почти целиком и медленно сдвигай бумагу. На каком кусочке ребёнок понимает, что это? Можно и через силуэт предмета под тканью.',
      en: 'Cover a picture almost completely and slide the paper away slowly. At which fragment does the child recognise it? A silhouette of an object under a cloth works too.'
    }
  },
  'sim-tangram': {
    material: { de: 'Ein Tangram aus Pappe – ein Quadrat, sieben Schnitte', ru: 'Танграм из картона — квадрат и семь разрезов', en: 'A cardboard tangram – one square, seven cuts' },
    so: {
      de: 'Selbst herstellen dauert zehn Minuten und ist Teil der Übung. Erst Vorlagen in Originalgröße mit Trennlinien, dann nur der Umriss, zuletzt der Umriss verkleinert auf einer Karte.',
      ru: 'Сделать его — десять минут, и это уже часть упражнения. Сначала образцы в натуральную величину с линиями, потом только контур, затем контур уменьшенный на карточке.',
      en: 'Making one takes ten minutes and is part of the exercise. First templates at full size with dividing lines, then the outline only, finally a shrunk outline on a card.'
    }
  },
  'sim-suchbild': {
    material: { de: 'Zwei Kopien desselben Bildes', ru: 'Две копии одной картинки', en: 'Two copies of the same picture' },
    so: {
      de: 'Kopiere ein Wimmelbild zweimal und ändere auf einer Kopie fünf Kleinigkeiten mit dem Stift. Oder ohne Papier: einen Tisch decken, das Kind wegschauen lassen und zwei Dinge vertauschen.',
      ru: 'Скопируй картинку дважды и на одной копии измени карандашом пять мелочей. Или без бумаги: накрыть стол, попросить отвернуться и поменять местами два предмета.',
      en: 'Copy a busy picture twice and change five small details on one copy with a pen. Or without paper: set a table, have the child look away, and swap two things.'
    }
  },
  'lern-atlantis': {
    material: { de: 'Bildkarten mit Fantasienamen auf der Rückseite', ru: 'Карточки с выдуманными именами на обороте', en: 'Picture cards with invented names on the back' },
    so: {
      de: 'Gib drei Tieren ausgedachte Namen – „das ist ein Wumo" – und wiederhole sie zweimal. Dann abfragen. Nach zehn Minuten anderer Beschäftigung noch einmal fragen: das ist der eigentliche Test.',
      ru: 'Дай трём животным выдуманные имена — «это вумо» — и повтори дважды. Потом спроси. Через десять минут другого занятия спроси ещё раз: вот это и есть настоящая проверка.',
      en: 'Give three animals invented names – "this is a wumo" – and repeat them twice. Then ask. After ten minutes of something else, ask again: that is the real test.'
    }
  },
  'lern-atlantis-abruf': {
    material: { de: 'Dieselben Bildkarten wie vorhin', ru: 'Те же карточки, что и раньше', en: 'The same picture cards as before' },
    so: {
      de: 'Nach etwa zwanzig Minuten, in denen etwas anderes passiert ist, die Karten noch einmal zeigen – ohne die Namen. „Weißt du noch, wie der hieß?" Genau das ist der eigentliche Test: nicht ob es aufgenommen wurde, sondern ob es liegen geblieben ist.',
      ru: 'Примерно через двадцать минут, занятых чем-то другим, показать карточки снова — уже без имён. «Помнишь, как его звали?» Именно это и есть настоящая проверка: не усвоил ли, а осталось ли.',
      en: 'After about twenty minutes filled with something else, show the cards again – without the names. "Do you still remember what this one was called?" That is the real test: not whether it went in, but whether it stayed.'
    }
  },
  'lern-symbole-abruf': {
    material: { de: 'Dieselben Zeichen-Kärtchen wie vorhin', ru: 'Те же карточки со знаками', en: 'The same sign cards as before' },
    so: {
      de: 'Nach zwanzig Minuten Pause die Zeichen einzeln zeigen und nach dem Wort fragen. Wenn nichts mehr kommt: nicht auflösen, sondern die erste Silbe vorsagen. Was mit einem Anstoß wiederkommt, war da – es fehlte nur der Weg dorthin.',
      ru: 'Через двадцать минут показать знаки по одному и спросить слово. Если ничего не всплывает — не подсказывать ответ, а назвать первый слог. То, что возвращается с подсказкой, было в памяти — не хватало только пути к нему.',
      en: 'After a twenty-minute break, show the signs one at a time and ask for the word. If nothing comes: do not give the answer, say the first syllable. What comes back with a nudge was there – only the way to it was missing.'
    }
  },
  'lern-symbole': {
    material: { de: 'Kärtchen mit selbstgemalten Zeichen', ru: 'Карточки с самодельными знаками', en: 'Cards with hand-drawn signs' },
    so: {
      de: 'Male einfache Zeichen und lege für jedes ein Wort fest: Kringel = Katze, Strich = läuft. Dann legst du „Kringel Strich" und das Kind liest „Katze läuft". Das ist Lesenlernen im Kleinen.',
      ru: 'Нарисуй простые знаки и назначь каждому слово: кружок = кошка, палочка = бежит. Выкладываешь «кружок палочка», ребёнок читает «кошка бежит». Это чтение в миниатюре.',
      en: 'Draw simple signs and fix a word for each: circle = cat, line = runs. Then you lay out "circle line" and the child reads "cat runs". That is learning to read in miniature.'
    }
  },
  'lern-memory': {
    material: { de: 'Ein Memory-Spiel oder Karten in Paaren', ru: 'Игра «мемори» или парные карточки', en: 'A memory game or cards in pairs' },
    so: {
      de: 'Mit acht Paaren anfangen, nicht mit dreißig. Wichtig ist die Frage nach jedem Zug: „Wo hast du den anderen gesehen?" – erst dadurch wird aus Glück ein Merken.',
      ru: 'Начинать с восьми пар, а не с тридцати. Важен вопрос после каждого хода: «Где ты видел вторую такую?» — только так везение превращается в запоминание.',
      en: 'Start with eight pairs, not thirty. What matters is the question after each turn: "Where did you see the other one?" – only that turns luck into remembering.'
    }
  },
  'lern-storycubes': {
    material: { de: 'Würfel mit aufgeklebten Bildern oder gezogene Bildkarten', ru: 'Кубики с наклеенными картинками или вытянутые карточки', en: 'Dice with pictures glued on, or drawn picture cards' },
    so: {
      de: 'Drei Bilder ziehen, eine Geschichte erfinden, in der alle drei vorkommen. Reihum: jeder setzt einen Satz fort. Aufschreiben lohnt sich – die Geschichten werden nach Wochen noch gelesen.',
      ru: 'Вытянуть три картинки и придумать историю, где есть все три. По кругу: каждый добавляет предложение. Стоит записывать — такие истории перечитывают и через недели.',
      en: 'Draw three pictures and invent a story containing all three. Take turns: each adds one sentence. Writing them down pays off – such stories are still read weeks later.'
    }
  },
  'plan-geschichten': {
    material: { de: 'Ausgeschnittene Bildergeschichten oder eigene Fotos', ru: 'Вырезанные истории в картинках или свои фотографии', en: 'Cut-out picture stories or your own photos' },
    so: {
      de: 'Schneide eine Bildergeschichte auseinander, misch die Teile, das Kind legt sie in eine Reihe. Am besten mit eigenen Fotos: Teig anrühren, backen, essen. Danach erzählen lassen – das Erzählen ist die halbe Übung.',
      ru: 'Разрежь историю в картинках, перемешай, ребёнок выкладывает по порядку. Лучше всего свои фотографии: замесили, испекли, съели. Потом пусть расскажет — рассказ и есть половина упражнения.',
      en: 'Cut a picture story apart, shuffle it, the child lays it out in order. Best with your own photos: mixing dough, baking, eating. Then have it retold – the retelling is half the exercise.'
    }
  },
  'plan-muster': {
    material: { de: 'Knöpfe, Perlen, Bausteine', ru: 'Пуговицы, бусины, кубики', en: 'Buttons, beads, blocks' },
    so: {
      de: 'Leg eine Reihe: rot, blau, rot, blau … und lass fortsetzen. Später schwerer: rot, rot, blau, rot, rot, blau. Frag immer nach der Regel – wer sie aussprechen kann, hat sie verstanden.',
      ru: 'Выложи ряд: красный, синий, красный, синий… — пусть продолжит. Потом сложнее: красный, красный, синий. Всегда спрашивай правило — кто может его назвать, тот его понял.',
      en: 'Lay out a row: red, blue, red, blue … and have it continued. Later harder: red, red, blue. Always ask for the rule – whoever can say it out loud has understood it.'
    }
  },
  'plan-sudoku': {
    material: { de: 'Papier mit einem 4×4-Gitter und vier Sorten Aufkleber', ru: 'Лист с сеткой 4×4 и четыре вида наклеек', en: 'Paper with a 4×4 grid and four kinds of stickers' },
    so: {
      de: 'Mit einem Vierer-Gitter und Bildern statt Ziffern anfangen – Sonne, Mond, Stern, Blume. Regel: jedes Bild einmal je Zeile, Spalte und Block. Aufkleber lassen sich verschieben, Ziffern nicht.',
      ru: 'Начать с сетки 4×4 и картинок вместо цифр — солнце, луна, звезда, цветок. Правило: каждая картинка по разу в строке, столбце и блоке. Наклейки можно передвинуть, цифры — нет.',
      en: 'Start with a four-by-four grid and pictures instead of digits – sun, moon, star, flower. Rule: each picture once per row, column and block. Stickers can be moved, digits cannot.'
    }
  },
  'plan-zaubertricks': {
    material: { de: 'Münzen, Becher, ein Kartenspiel', ru: 'Монеты, стаканчики, колода карт', en: 'Coins, cups, a deck of cards' },
    so: {
      de: 'Einen einfachen Trick vorführen, dann gemeinsam herausfinden, wie er geht, dann übt das Kind ihn ein und führt ihn jemandem vor. Das Vorführen gehört dazu: es zwingt zur festen Reihenfolge.',
      ru: 'Показать простой фокус, вместе разобраться, как он устроен, потом ребёнок его отрабатывает и показывает кому-нибудь. Показ обязателен: он заставляет держать порядок действий.',
      en: 'Perform a simple trick, work out together how it is done, then the child rehearses it and performs it for someone. The performance matters: it forces a fixed sequence.'
    }
  },
  'wiss-wortschatz': {
    material: { de: 'Ein Bilderbuch', ru: 'Книжка с картинками', en: 'A picture book' },
    so: {
      de: 'Auf ein Bild zeigen: „Was ist das?" Kommt keine Antwort, das Wort sagen und beim nächsten Mal wieder fragen. Nicht abfragen wie eine Prüfung – im Vorbeigehen, beim Anschauen.',
      ru: 'Показать на картинку: «Что это?» Нет ответа — назвать слово и спросить снова в следующий раз. Не устраивать экзамен — мимоходом, за разглядыванием.',
      en: 'Point at a picture: "What is that?" If no answer comes, say the word and ask again next time. Not as an examination – in passing, while looking at the book.'
    }
  },
  'wiss-sachwissen': {
    material: { de: 'Nichts – Gespräch beim Essen oder unterwegs', ru: 'Ничего — разговор за едой или в дороге', en: 'Nothing – conversation at meals or on the way' },
    so: {
      de: '„Was macht ein Tierarzt?", „Warum tragen Bauarbeiter Helme?" Bei Nichtwissen nicht die Antwort geben, sondern eine Spur: „Wo hast du schon mal einen gesehen?"',
      ru: '«Чем занимается ветеринар?», «Почему строители носят каски?» Если не знает — не давать ответ, а дать след: «Где ты такого видел?»',
      en: '"What does a vet do?", "Why do builders wear helmets?" When the answer is missing, do not supply it – give a trail: "Where have you seen one?"'
    }
  },
  'wiss-raetsel': {
    material: { de: 'Nichts', ru: 'Ничего', en: 'Nothing' },
    so: {
      de: '„Es hat vier Beine und bellt." Erst wenige Hinweise, dann mehr. Umgekehrt ist es noch besser: das Kind denkt sich ein Rätsel aus und du rätst – dabei muss es die wichtigen Merkmale selbst finden.',
      ru: '«У него четыре ноги, и оно лает». Сначала мало подсказок, потом больше. Ещё лучше наоборот: ребёнок загадывает, а ты отгадываешь — тогда ему приходится самому найти главные признаки.',
      en: '"It has four legs and it barks." Few clues first, then more. Better still the other way round: the child makes up a riddle and you guess – then they have to find the essential features themselves.'
    }
  },
  'wiss-oberbegriffe': {
    material: { de: 'Der Einkauf beim Auspacken', ru: 'Покупки при разборе сумок', en: 'The shopping while unpacking' },
    so: {
      de: 'Beim Einräumen sortieren: „Was davon ist Obst?", „Wie heißt alles zusammen?" Kein Extra-Material nötig – die Küche ist voll von Kategorien.',
      ru: 'Раскладывая покупки, сортировать: «Что здесь фрукты?», «Как назвать всё это одним словом?» Ничего специально не нужно — кухня полна категорий.',
      en: 'Sort while putting things away: "Which of these are fruit?", "What is the word for all of them?" No extra material needed – a kitchen is full of categories.'
    }
  },
  'wiss-teekesselchen': {
    material: { de: 'Nichts', ru: 'Ничего', en: 'Nothing' },
    so: {
      de: 'Ein Wort mit zwei Bedeutungen umschreiben: „Mein Teekesselchen steht am Fluss – und mein Teekesselchen ist im Sparschwein." Wer errät es? Danach tauschen.',
      ru: 'Описать слово с двумя значениями: «Мой предмет открывает дверь — и мой предмет бьёт из-под земли». Кто угадает? Потом поменяться ролями.',
      en: 'Describe a word with two meanings: "My word is by the river – and my word is in the piggy bank." Who guesses it? Then swap roles.'
    }
  }
};

/** Analog-Anleitung eines Moduls oder null. */
export function analogFuer(moduleId) {
  return ANALOG[moduleId] || null;
}

/** Wie viele Module eine Anleitung ohne Bildschirm haben. */
export const analogAnzahl = () => Object.keys(ANALOG).length;
