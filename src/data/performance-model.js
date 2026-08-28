/**
 * Kognitives Leistungsmodell
 * 
 * Ordnet jedem Trainings-Modul die zugehörigen kognitiven Faktoren zu:
 *   - einfluesse:   Was beeinflusst die Testleistung?
 *   - hypothesen:   Was bedeuten Stärken/Schwächen?
 *   - foerderung:   Konkrete Fördermaßnahmen und Spiele
 * 
 * Basierend auf den Arbeitsmaterialien (2016), zweisprachig DE/RU
 */
export const performanceModel = {

  // ===== SEQUENTIAL / Gsm =====
  'seq-zahlenfolgen': {
    scale:'sequential', subtestRef:{de:'Zahlen nachsprechen (Variante am Bildschirm)',ru:'Повторение чисел (вариант на экране)',en:'Number Recall (on-screen variant)'},
    whatItMeasures:{de:'Visuelles Kurzzeitgedächtnis, Konzentrationsfähigkeit, Seriation. Die Ziffern werden gezeigt, nicht gesprochen – gehörbezogene Erklärungen greifen hier nicht.',ru:'Зрительная кратковременная память, концентрация, сериация. Цифры показываются, а не произносятся.',en:'Visual short-term memory, concentration, seriation. The digits are shown, not spoken – hearing-related explanations do not apply here.'},
    einfluesse:{de:['Visuelles Kurzzeitgedächtnis','Geläufigkeit im Umgang mit Zahlen','Fokussierung der Aufmerksamkeit','Fähigkeit zur Rhythmisierung','Seriation (Reihenfolge einhalten)'],ru:['Зрительная кратковременная память','Свободное владение числами','Фокусировка внимания','Способность к ритмизации','Сериация (соблюдение порядка)'],en:['Visual short-term memory','Fluency with numbers','Focus of attention','Ability to rhythmise','Seriation (keeping order)']},
    hypothesen:{de:['Ermüdung / Belastbarkeit','Konzentrationsfähigkeit','Rhythmisierung gelingt gut/nicht','Auditives Kurzzeitgedächtnis','Sicherheit im Umgang mit Zahlen','Stärken/Schwächen des einzelheitlichen Denkens','Sehschärfe / visuelle Unterscheidung','Verarbeitungsgeschwindigkeit','Eigenständige Strategie (Gruppierung, Rhythmisierung)'],ru:['Утомляемость / выносливость','Концентрация внимания','Ритмизация удаётся/не удаётся','Слуховая кратковременная память','Уверенность в числах','Последовательное мышление','Острота зрения / зрительное различение','Скорость обработки','Собственная стратегия (группировка, ритмизация)'],en:['Fatigue / resilience','Concentration','Rhythmising works well or not','Auditory short-term memory','Confidence with numbers','Strengths/weaknesses of sequential thinking','Visual acuity / visual discrimination','Processing speed','Own strategy (grouping, rhythmising)']},
    foerderung:{de:['Merkspiele: Koffer packen, Memory, Kim-Spiele','Lieder, Gedichte auswendig lernen','Kopfrechnen mit "LOBO 77"','Merkaufträge im Alltag','Motorische Unterstützung: Klatschen, Bewegungen','Visuelle Hilfen: Mitlesen','Konzentrations- und Entspannungsübungen','Rhythmisch-musikalische Erziehung'],ru:['Игры на память: «Чемодан», Memory','Заучивание песен и стихов','Устный счёт с «LOBO 77»','Поручения на запоминание','Моторная поддержка: хлопки, движения','Визуальные подсказки: чтение вместе','Упражнения на концентрацию','Ритмически-музыкальное воспитание'],en:['Memory games: packing the suitcase, Memory, Kim games','Learning songs and poems by heart','Mental arithmetic with "LOBO 77"','Memory errands in everyday life','Motor support: clapping, movements','Visual aids: reading along','Concentration and relaxation exercises','Rhythmic-musical education']}
  },
  'seq-zahlenfolgen-audio': {
    scale:'sequential', subtestRef:{de:'Zahlen nachsprechen (Variante mit Ansage)',ru:'Повторение чисел (вариант с озвучкой)',en:'Number Recall (spoken variant)'},
    whatItMeasures:{de:'Akustisches Kurzzeitgedächtnis, Konzentrationsfähigkeit, Seriation. Diese Variante entspricht dem Originalsubtest: die Ziffern werden vorgesprochen',ru:'Слуховая кратковременная память, концентрация, сериация',en:'Auditory short-term memory, concentration, seriation. This variant matches the original subtest: the digits are spoken aloud.'},
    einfluesse:{de:['Akustisches Kurzzeitgedächtnis','Geläufigkeit im Umgang mit Zahlen','Fokussierung der Aufmerksamkeit','Fähigkeit zur Rhythmisierung','Seriation (Reihenfolge einhalten)'],ru:['Слуховая кратковременная память','Свободное владение числами','Фокусировка внимания','Способность к ритмизации','Сериация (соблюдение порядка)'],en:['Auditory short-term memory','Fluency with numbers','Focus of attention','Ability to rhythmise','Seriation (keeping order)']},
    hypothesen:{de:['Ermüdung / Belastbarkeit','Konzentrationsfähigkeit','Rhythmisierung gelingt gut/nicht','Auditives Kurzzeitgedächtnis','Sicherheit im Umgang mit Zahlen','Stärken/Schwächen des einzelheitlichen Denkens','Sprachprobleme / auditive Diskriminierung','Hörprobleme','Verarbeitungsgeschwindigkeit','Eigenständige Strategie (Gruppierung, Rhythmisierung)'],ru:['Утомляемость / выносливость','Концентрация внимания','Ритмизация удаётся/не удаётся','Слуховая кратковременная память','Уверенность в числах','Последовательное мышление','Языковые проблемы','Проблемы со слухом','Скорость обработки','Собственная стратегия (группировка, ритмизация)'],en:['Fatigue / resilience','Concentration','Rhythmising works well or not','Auditory short-term memory','Confidence with numbers','Strengths/weaknesses of sequential thinking','Language problems / auditory discrimination','Hearing problems','Processing speed','Own strategy (grouping, rhythmising)']},
    foerderung:{de:['Merkspiele: Koffer packen, Memory, Kim-Spiele','Lieder, Gedichte auswendig lernen','Kopfrechnen mit "LOBO 77"','Merkaufträge im Alltag','Motorische Unterstützung: Klatschen, Bewegungen','Visuelle Hilfen: Mitlesen','Konzentrations- und Entspannungsübungen','Rhythmisch-musikalische Erziehung'],ru:['Игры на память: «Чемодан», Memory','Заучивание песен и стихов','Устный счёт с «LOBO 77»','Поручения на запоминание','Моторная поддержка: хлопки, движения','Визуальные подсказки: чтение вместе','Упражнения на концентрацию','Ритмически-музыкальное воспитание'],en:['Memory games: packing the suitcase, Memory, Kim games','Learning songs and poems by heart','Mental arithmetic with "LOBO 77"','Memory errands in everyday life','Motor support: clapping, movements','Visual aids: reading along','Concentration and relaxation exercises','Rhythmic-musical education']}
  },

  'seq-zahlen-rueckwaerts': {
    scale:'sequential', subtestRef:{de:'Zahlen nachsprechen rückwärts (nicht KABC-II, aus der Wechsler-Reihe)',ru:'Повторение чисел в обратном порядке (не KABC-II, из линейки Векслера)',en:'Digit span backward (not KABC-II, from the Wechsler tradition)'},
    whatItMeasures:{de:'Arbeitsgedächtnis im engeren Sinn: die Reihe muss gehalten UND dabei umgedreht werden. Vorwärts ist reines Behalten, rückwärts kommt das Hantieren im Kopf dazu.',ru:'Рабочая память в узком смысле: ряд нужно удержать И одновременно перевернуть. Вперёд — только запоминание, назад — ещё и действие в уме.',en:'Working memory in the narrow sense: the row must be held AND reversed at the same time. Forward is pure retention; backward adds manipulation in the head.'},
    einfluesse:{de:['Arbeitsgedächtnis (Halten und Verarbeiten zugleich)','Innere Vorstellung der Reihe','Geläufigkeit im Umgang mit Zahlen','Hemmung des naheliegenden Vorwärts-Ablesens','Fokussierung der Aufmerksamkeit'],ru:['Рабочая память (удержание и обработка одновременно)','Внутреннее представление ряда','Свободное владение числами','Торможение привычного чтения вперёд','Фокусировка внимания'],en:['Working memory (holding and processing at once)','Inner image of the row','Fluency with numbers','Inhibiting the obvious forward readout','Focus of attention']},
    hypothesen:{de:['Vorwärts altersgemäß, rückwärts deutlich schwächer: kein Gedächtnis-, sondern ein Verarbeitungsproblem','Beide Richtungen schwach: die Merkspanne selbst ist knapp','Ermüdung / Belastbarkeit','Eigenständige Strategie (Vorstellungsbild, Aufschreiben im Kopf)','Sicherheit im Umgang mit Zahlen','Impulsivität: die Reihe wird vorwärts herausgesagt, bevor umgedreht wurde'],ru:['Вперёд по возрасту, назад заметно хуже: дело не в памяти, а в обработке','Слабо в обе стороны: мал сам объём памяти','Утомляемость / выносливость','Собственная стратегия (образ, «запись» в уме)','Уверенность в числах','Импульсивность: ряд называют вперёд, не успев перевернуть'],en:['Forward age-appropriate, backward clearly weaker: not a memory problem but a processing one','Weak in both directions: the span itself is short','Fatigue / resilience','Own strategy (mental image, writing in the head)','Confidence with numbers','Impulsivity: the row is said forwards before it was reversed']},
    foerderung:{de:['Merkspiele: Koffer packen, Memory, Kim-Spiele','Kopfrechenspiele mit Zwischenschritten','Merkaufträge im Alltag','Rückwärts zählen, rückwärts buchstabieren','Eselsbrücken und Assoziationen','Konzentrations- und Entspannungsübungen'],ru:['Игры на память: «Чемодан», Memory','Устный счёт с промежуточными шагами','Поручения на запоминание','Счёт назад, слова наоборот','Мнемотехники и ассоциации','Упражнения на концентрацию'],en:['Memory games: packing the suitcase, Memory, Kim games','Mental arithmetic with intermediate steps','Memory errands in everyday life','Counting backwards, spelling backwards','Mnemonics and associations','Concentration and relaxation exercises']}
  },

  'seq-wortreihe': {
    scale:'sequential', subtestRef:{de:'Wortreihe',ru:'Порядок слов',en:'Word Order'},
    whatItMeasures:{de:'Sequenzielle Verarbeitung, Kurzzeitgedächtnis (auditorisch-motorisch)',ru:'Последовательная обработка, кратковременная память (слухо-моторная)',en:'Sequential processing, short-term memory (auditory-motor).'},
    einfluesse:{de:['Akustisches Kurzzeitgedächtnis','Akustisch-motorisches Gedächtnis','Konzentrationsfähigkeit, Fokussierung','Intermodalität: Hören-Sehen-Bewegen','Visuelle Wahrnehmung bedeutungshaltiger Reize','Okularleistungen: Fixieren, Augenfolgebewegungen'],ru:['Слуховая кратковременная память','Слухо-моторная память','Концентрация, фокусировка','Интермодальность: слух-зрение-движение','Визуальное восприятие значимых стимулов','Глазодвигательные функции'],en:['Auditory short-term memory','Auditory-motor memory','Concentration, focus','Intermodality: hearing-seeing-moving','Visual perception of meaningful stimuli','Ocular skills: fixation, eye tracking']},
    hypothesen:{de:['Anstrengungsbereitschaft','Konzentration, Aufmerksamkeit, Ablenkbarkeit','Merkspanne auditiver Reize','Motorik: Überkreuzen der Körpermittellinie','Sensorische Integration','Auditive und visuelle Wahrnehmung','Umgang mit Stress'],ru:['Готовность к усилию','Концентрация, внимание, отвлекаемость','Объём слуховой памяти','Моторика: пересечение средней линии','Сенсорная интеграция','Слуховое и зрительное восприятие','Реакция на стресс'],en:['Willingness to make an effort','Concentration, attention, distractibility','Span of auditory stimuli','Motor skills: crossing the body midline','Sensory integration','Auditory and visual perception','Coping with stress']},
    foerderung:{de:['Kombination Sehen-Hören-Bewegen: Boomwhacker','Merkspiele: Memory, Kim-Spiele, Hörbücher','Intermodalität: "Activity" von Piatnik','Loci-Methode für Memorisierung','Körperteile nach Anweisung berühren','Psychomotorik, Ergotherapie'],ru:['Комбинация вижу-слышу-двигаюсь: ритмика','Игры на память: Memory, аудиокниги','Развитие интермодальности: «Activity»','Метод локусов для запоминания','Касаться частей тела по инструкции','Психомоторика, эрготерапия'],en:['Combining see-hear-move: boomwhackers','Memory games: Memory, Kim games, audiobooks','Intermodality: "Activity" by Piatnik','Method of loci for memorising','Touching body parts on instruction','Psychomotor therapy, occupational therapy']}
  },
  'seq-wortreihe-audio': {
    scale:'sequential', subtestRef:{de:'Wortreihe (Variante mit Ansage)',ru:'Порядок слов (вариант с озвучкой)',en:'Word Order (spoken variant)'},
    whatItMeasures:{de:'Sequenzielle Verarbeitung, Kurzzeitgedächtnis (auditorisch-motorisch)',ru:'Последовательная обработка, кратковременная память (слухо-моторная)',en:'Sequential processing, short-term memory (auditory-motor).'},
    einfluesse:{de:['Akustisches Kurzzeitgedächtnis','Akustisch-motorisches Gedächtnis','Konzentrationsfähigkeit, Fokussierung','Intermodalität: Hören-Sehen-Bewegen','Visuelle Wahrnehmung bedeutungshaltiger Reize','Okularleistungen: Fixieren, Augenfolgebewegungen'],ru:['Слуховая кратковременная память','Слухо-моторная память','Концентрация, фокусировка','Интермодальность: слух-зрение-движение','Визуальное восприятие значимых стимулов','Глазодвигательные функции'],en:['Auditory short-term memory','Auditory-motor memory','Concentration, focus','Intermodality: hearing-seeing-moving','Visual perception of meaningful stimuli','Ocular skills: fixation, eye tracking']},
    hypothesen:{de:['Anstrengungsbereitschaft','Konzentration, Aufmerksamkeit, Ablenkbarkeit','Merkspanne auditiver Reize','Motorik: Überkreuzen der Körpermittellinie','Sensorische Integration','Auditive und visuelle Wahrnehmung','Umgang mit Stress'],ru:['Готовность к усилию','Концентрация, внимание, отвлекаемость','Объём слуховой памяти','Моторика: пересечение средней линии','Сенсорная интеграция','Слуховое и зрительное восприятие','Реакция на стресс'],en:['Willingness to make an effort','Concentration, attention, distractibility','Span of auditory stimuli','Motor skills: crossing the body midline','Sensory integration','Auditory and visual perception','Coping with stress']},
    foerderung:{de:['Kombination Sehen-Hören-Bewegen: Boomwhacker','Merkspiele: Memory, Kim-Spiele, Hörbücher','Intermodalität: "Activity" von Piatnik','Loci-Methode für Memorisierung','Körperteile nach Anweisung berühren','Psychomotorik, Ergotherapie'],ru:['Комбинация вижу-слышу-двигаюсь: ритмика','Игры на память: Memory, аудиокниги','Развитие интермодальности: «Activity»','Метод локусов для запоминания','Касаться частей тела по инструкции','Психомоторика, эрготерапия'],en:['Combining see-hear-move: boomwhackers','Memory games: Memory, Kim games, audiobooks','Intermodality: "Activity" by Piatnik','Method of loci for memorising','Touching body parts on instruction','Psychomotor therapy, occupational therapy']}
  },

  'seq-handbewegungen': {
    scale:'sequential', subtestRef:{de:'Handbewegungen',ru:'Движения рук',en:'Hand Movements'},
    whatItMeasures:{de:'Visuell-motorisches Kurzzeitgedächtnis, Gedächtnisspanne',ru:'Зрительно-моторная кратковременная память, объём памяти',en:'Visual-motor short-term memory, memory span.'},
    einfluesse:{de:['Konzentration, Fokussierung','Motorische Fähigkeiten der Hand','Visuelles Kurzzeitgedächtnis','Visuell-motorische Koordination','Rhythmische Fähigkeiten','Taktil-kinästhetische Anforderungen','Reproduktion eines Modells','Flüssige Bewegungsfähigkeit der Hand'],ru:['Концентрация, фокусировка','Моторные способности руки','Зрительная кратковременная память','Зрительно-моторная координация','Ритмические способности','Тактильно-кинестетические требования','Воспроизведение модели','Плавность движений руки'],en:['Concentration, focus','Motor skills of the hand','Visual short-term memory','Visual-motor coordination','Rhythmic abilities','Tactile-kinesthetic demands','Reproducing a model','Fluid movement of the hand']},
    hypothesen:{de:['Ermüdung / Belastbarkeit','Konzentrationsfähigkeit','Rhythmisierung gelingt gut/nicht','Visuelles Kurzzeitgedächtnis','Motorische Schwächen/Stärken','Ausdauer/Durchhaltevermögen','Taktil-kinästhetische Fähigkeiten','Visuell-motorische Fähigkeiten','Verbalisierung von Strategien'],ru:['Утомляемость / выносливость','Концентрация','Ритмизация удаётся/не удаётся','Зрительная кратковременная память','Моторные слабости/силы','Выносливость/настойчивость','Тактильно-кинестетические способности','Зрительно-моторные способности','Вербализация стратегий'],en:['Fatigue / resilience','Concentration','Rhythmising works well or not','Visual short-term memory','Motor weaknesses/strengths','Endurance/persistence','Tactile-kinesthetic abilities','Visual-motor abilities','Verbalising strategies']},
    foerderung:{de:['Nachklopfen eines Rhythmus','Hand- und Fingerbeweglichkeit: Fadenspiele','Bewegungen grobmotorisch nachmachen','Erweiterung der Merkspanne durch Mitsprechen','Ganzkörperbewegungen nachmachen','Rhythmisierung der Bewegungen','Psychomotorische Übungsbehandlung'],ru:['Повторение ритма стуком','Подвижность рук и пальцев','Повторение крупномоторных движений','Расширение объёма памяти через проговаривание','Повторение движений всего тела','Ритмизация движений','Психомоторная терапия'],en:['Tapping back a rhythm','Hand and finger dexterity: string figures','Imitating gross motor movements','Extending memory span by speaking along','Imitating whole-body movements','Rhythmising the movements','Psychomotor therapy']}
  },

  // ===== SIMULTAN / Gv =====
  'sim-konzeptbildung': {
    scale:'simultan', subtestRef:{de:'Konzeptbildung',ru:'Формирование понятий',en:'Conceptual Thinking'},
    whatItMeasures:{de:'Schlussfolgerndes Denken, Visualisierung, Konzentration',ru:'Логическое мышление, визуализация, концентрация',en:'Reasoning, visualisation, concentration.'},
    einfluesse:{de:['Induktives/Logisches Denken','Visuelle Differenzierungsfähigkeit','Fähigkeit zur Klassifikation','Flexibilität im Denken','Konzentration, Aufmerksamkeit','Fokussierung auf bedeutungsrelevante Merkmale'],ru:['Индуктивное/логическое мышление','Визуальная дифференциация','Способность к классификации','Гибкость мышления','Концентрация, внимание','Фокусировка на значимых признаках'],en:['Inductive/logical thinking','Visual discrimination','Ability to classify','Flexibility in thinking','Concentration, attention','Focusing on meaning-relevant features']},
    hypothesen:{de:['Allgemeine Denkfähigkeit','Entwickeln von Strategien','Analogiefähigkeit','Visuelle Wahrnehmung (Figur-Grund, Raum-Lage)','Numerische Kompetenz','Durchhaltevermögen','Bilden von Kategorien und Konzepten'],ru:['Общая мыслительная способность','Разработка стратегий','Способность к аналогиям','Визуальное восприятие','Числовая компетенция','Настойчивость','Формирование категорий и концепций'],en:['General thinking ability','Developing strategies','Analogy ability','Visual perception (figure-ground, spatial position)','Numerical competence','Persistence','Forming categories and concepts']},
    foerderung:{de:['Denksportaufgaben','Sortieren nach Merkmalen: Form, Farbe, Kategorien','Spiele: "Die Logik-Piraten", "Logofix", "TwinFit"','Ober- und Unterbegriffe mit Bildmaterial','Konzentrationsübungen (Marburger Training)','Förderung visuelle Wahrnehmung nach Sindelar'],ru:['Задачи на логику','Сортировка по признакам','Игры: «Логические пираты», «Logofix», «TwinFit»','Обобщающие и частные понятия','Тренировка концентрации','Развитие зрительного восприятия'],en:['Brain-teasers','Sorting by features: shape, colour, categories','Games: "Die Logik-Piraten", "Logofix", "TwinFit"','Superordinate and subordinate terms with pictures','Concentration exercises (Marburg training)','Visual perception training after Sindelar']}
  },

  'sim-gesichter': {
    scale:'simultan', subtestRef:{de:'Wiedererkennen von Gesichtern',ru:'Узнавание лиц',en:'Face Recognition'},
    whatItMeasures:{de:'Visuelles Gedächtnis, Wiedererkennungsfähigkeit',ru:'Зрительная память, способность к узнаванию',en:'Visual memory, recognition ability.'},
    einfluesse:{de:['Visuelles Kurzzeitgedächtnis','Detailgenauigkeit der Wahrnehmung','Aufmerksamkeit bei der Darbietung','Strategie der Merkmalserkennung'],ru:['Зрительная кратковременная память','Детальность восприятия','Внимание при показе','Стратегия распознавания признаков'],en:['Visual short-term memory','Detail accuracy of perception','Attention during presentation','Feature-recognition strategy']},
    hypothesen:{de:['Visuelles Gedächtnis','Aufmerksamkeit für Details','Beobachtungsgabe','Gesichtererkennung als soziale Fähigkeit'],ru:['Зрительная память','Внимание к деталям','Наблюдательность','Распознавание лиц как социальный навык'],en:['Visual memory','Attention to detail','Powers of observation','Face recognition as a social skill']},
    foerderung:{de:['Memory-Spiele mit Gesichtern','Suchbilder, Wimmelbilder','Kim-Spiele (Gegenstände erinnern)','"Differix" von Ravensburger'],ru:['Memory с лицами','Поиск отличий, виммельбухи','Игры Кима (запомнить предметы)','«Differix» от Ravensburger'],en:['Memory games with faces','Spot-the-difference, hidden-object pictures','Kim games (remembering objects)','"Differix" by Ravensburger']}
  },

  'sim-rover': {
    scale:'simultan', subtestRef:{de:'Rover',ru:'Ровер',en:'Rover'},
    whatItMeasures:{de:'Simultane/visuelle Verarbeitung, Entscheidungsfindung, räumliches Denken',ru:'Симультанная/зрительная обработка, принятие решений, пространственное мышление',en:'Simultaneous/visual processing, decision making, spatial reasoning.'},
    einfluesse:{de:['Wahrnehmungsgebundenes logisches Schlussfolgern','Räumliches Vorstellungsvermögen','Planungsfähigkeit und Strategieentwicklung','Visuell-motorische Koordination','Konzentration und Aufmerksamkeit'],ru:['Логическое мышление, связанное с восприятием','Пространственное воображение','Планирование и стратегия','Зрительно-моторная координация','Концентрация и внимание'],en:['Perception-bound logical reasoning','Spatial imagination','Planning and strategy development','Visual-motor coordination','Concentration and attention']},
    hypothesen:{de:['Räumlich-visuelles Denken','Problemlöseverhalten','Strategisch-analytisches Vorgehen','Vorausschauendes Planen','Flexibilität beim Strategiewechsel'],ru:['Пространственно-зрительное мышление','Решение проблем','Стратегически-аналитический подход','Предусмотрительное планирование','Гибкость при смене стратегии'],en:['Spatial-visual thinking','Problem-solving behaviour','Strategic-analytical approach','Forward-looking planning','Flexibility in switching strategies']},
    foerderung:{de:['"Rush Hour" von HCM Kinzel','Strategiespiele: Mühle, Dame, 4 Gewinnt','Lego, Holzbausteine, Konstruktionsspiele','"Architecto" von Huch & Friends','Pläne und Skizzen anfertigen'],ru:['«Rush Hour»','Стратегические игры: мельница, шашки','Lego, деревянные кубики','«Architecto»','Черчение планов и эскизов'],en:['"Rush Hour" by HCM Kinzel','Strategy games: mills, draughts, Connect Four','Lego, wooden blocks, construction games','"Architecto" by Huch & Friends','Making plans and sketches']}
  },

  'sim-dreiecke': {
    scale:'simultan', subtestRef:{de:'Dreiecke',ru:'Треугольники',en:'Triangles'},
    whatItMeasures:{de:'Visuell-räumliche Verarbeitung, Konstruktionsfähigkeit',ru:'Зрительно-пространственная обработка, конструктивные способности',en:'Visual-spatial processing, construction ability.'},
    einfluesse:{de:['Räumliches Vorstellungsvermögen','Visuell-motorische Koordination','Erkennen von Teil-Ganzes-Beziehungen','Konzentration, Ausdauer'],ru:['Пространственное воображение','Зрительно-моторная координация','Распознавание часть-целое','Концентрация, выносливость'],en:['Spatial imagination','Visual-motor coordination','Recognising part-whole relations','Concentration, endurance']},
    hypothesen:{de:['Räumlich-konstruktive Fähigkeiten','Visuell-motorische Integration','Problemlöseverhalten bei Konstruktionsaufgaben','Frustrationstoleranz bei komplexen Aufgaben'],ru:['Пространственно-конструктивные способности','Зрительно-моторная интеграция','Решение конструктивных задач','Устойчивость к фрустрации'],en:['Spatial-constructive abilities','Visual-motor integration','Problem-solving in construction tasks','Frustration tolerance with complex tasks']},
    foerderung:{de:['Tangram, geometrische Puzzles','Nikitin-Material: Musterwürfel, Uniwürfel','"PotzKlotz" von Kallmeyer','Lego, Holzbausteine','Nachzeichnen von Figuren und Mustern'],ru:['Танграм, геометрические пазлы','Материалы Никитина: узорные кубики','«PotzKlotz»','Lego, деревянные кубики','Срисовывание фигур и узоров'],en:['Tangram, geometric puzzles','Nikitin material: pattern cubes, uni cubes','"PotzKlotz" by Kallmeyer','Lego, wooden blocks','Tracing figures and patterns']}
  },

  'sim-bausteine': {
    scale:'simultan', subtestRef:{de:'Bausteine zählen',ru:'Счёт кубиков',en:'Block Counting'},
    whatItMeasures:{de:'Räumliches Vorstellungsvermögen, mentale Rotation',ru:'Пространственное воображение, ментальное вращение',en:'Spatial imagination, mental rotation.'},
    einfluesse:{de:['Räumliches Vorstellungsvermögen','Mentale Rotationsfähigkeit','Verständnis von Verdeckung/Verborgenem','Konzentration'],ru:['Пространственное воображение','Способность к ментальному вращению','Понимание скрытых объектов','Концентрация'],en:['Spatial imagination','Mental rotation ability','Understanding of occlusion/hidden objects','Concentration']},
    hypothesen:{de:['Räumlich-visuelle Fähigkeiten','Mathematisches Grundverständnis','Abstraktionsvermögen','Systematisches Vorgehen'],ru:['Пространственно-зрительные способности','Базовое математическое понимание','Способность к абстракции','Систематический подход'],en:['Spatial-visual abilities','Basic mathematical understanding','Abstraction ability','Systematic approach']},
    foerderung:{de:['Bauklötze zählen (auch versteckte)','Würfelgebäude bauen und nachbauen','Nikitin-Material: Bausteine, Geowürfel','Cubus / PotzKlotz','Technisches Zeichnen'],ru:['Подсчёт кубиков (включая скрытые)','Постройка кубиковых конструкций','Материалы Никитина','Cubus / PotzKlotz','Техническое черчение'],en:['Counting blocks (including hidden ones)','Building and rebuilding cube structures','Nikitin material: blocks, geo cubes','Cubus / PotzKlotz','Technical drawing']}
  },

  'sim-gestaltschliessen': {
    scale:'simultan', subtestRef:{de:'Gestaltschließen',ru:'Гештальт-замыкание',en:'Gestalt Closure'},
    whatItMeasures:{de:'Visuelle Ergänzungsfähigkeit, Erkennen aus Teilinformationen',ru:'Визуальное дополнение, узнавание по частичной информации',en:'Visual completion, recognising from partial information.'},
    einfluesse:{de:['Visuelle Wahrnehmung und Organisation','Fähigkeit zur mentalen Vervollständigung','Erfahrung mit Objekten','Konzentration'],ru:['Зрительное восприятие и организация','Способность к мысленному завершению','Опыт с объектами','Концентрация'],en:['Visual perception and organisation','Ability for mental completion','Experience with objects','Concentration']},
    hypothesen:{de:['Visuelle Synthesefähigkeit','Wahrnehmungsorganisation','Allgemeinwissen über Objekte','Abstraktionsvermögen'],ru:['Способность к зрительному синтезу','Организация восприятия','Общие знания об объектах','Способность к абстракции'],en:['Visual synthesis ability','Perceptual organisation','General knowledge about objects','Abstraction ability']},
    foerderung:{de:['Suchbilder, Wimmelbilder','Puzzles mit steigender Teilezahl','"Differix" von Ravensburger','Halbierte Bilder ergänzen lassen','Kim-Spiele'],ru:['Поиск отличий, виммельбухи','Пазлы с увеличением деталей','«Differix» от Ravensburger','Дополнение половинчатых изображений','Игры Кима'],en:['Spot-the-difference, hidden-object pictures','Puzzles with increasing piece counts','"Differix" by Ravensburger','Completing halved pictures','Kim games']}
  },

  'sim-tangram': {
    scale:'simultan', subtestRef:{de:'Tangram (ergänzend)',ru:'Танграм (дополнительно)',en:'Tangram (supplementary)'},
    whatItMeasures:{de:'Räumliches Denken, Formerkennung, visuelle Organisation',ru:'Пространственное мышление, распознавание форм, визуальная организация',en:'Spatial reasoning, shape recognition, visual organisation.'},
    einfluesse:{de:['Räumliches Vorstellungsvermögen','Formerkennung und -kombination','Strategisches Vorgehen','Visuell-motorische Koordination'],ru:['Пространственное воображение','Распознавание и комбинирование форм','Стратегический подход','Зрительно-моторная координация'],en:['Spatial imagination','Shape recognition and combination','Strategic approach','Visual-motor coordination']},
    hypothesen:{de:['Räumlich-konstruktive Fähigkeiten','Flexibilität im Denken','Problemlöseverhalten'],ru:['Пространственно-конструктивные способности','Гибкость мышления','Решение задач'],en:['Spatial-constructive abilities','Flexibility in thinking','Problem-solving behaviour']},
    foerderung:{de:['Tangram in verschiedenen Schwierigkeitsstufen','"Ubongo" von Kosmos','"Make n Break" von Ravensburger','Nikitin-Material: Quadrate','Geometrische Puzzles'],ru:['Танграм разных уровней сложности','«Ubongo» от Kosmos','«Make n Break» от Ravensburger','Материалы Никитина: квадраты','Геометрические пазлы'],en:['Tangram at various difficulty levels','"Ubongo" by Kosmos','"Make n Break" by Ravensburger','Nikitin material: squares','Geometric puzzles']}
  },

  'sim-suchbild': {
    scale:'simultan', subtestRef:{de:'Suchbild (ergänzend)',ru:'Найди отличие (дополнительно)',en:'Spot the Difference (supplementary)'},
    whatItMeasures:{de:'Visuelle Differenzierung, Detailwahrnehmung, Konzentration',ru:'Зрительная дифференциация, восприятие деталей, концентрация',en:'Visual discrimination, detail perception, concentration.'},
    einfluesse:{de:['Visuelle Differenzierungsfähigkeit','Aufmerksamkeit für Details','Konzentration über längere Zeit','Systematisches Absuchen'],ru:['Зрительная дифференциация','Внимание к деталям','Длительная концентрация','Систематический поиск'],en:['Visual discrimination ability','Attention to detail','Concentration over longer periods','Systematic scanning']},
    hypothesen:{de:['Visuelle Wahrnehmungsgenauigkeit','Konzentrationsfähigkeit','Systematische Arbeitsweise'],ru:['Точность зрительного восприятия','Концентрация','Систематический подход'],en:['Visual perceptual accuracy','Concentration','Systematic working method']},
    foerderung:{de:['Suchbilder in Zeitschriften/Zeitungen','"Differix" von Ravensburger','Wimmelbilder/-bücher','Fehlersuche in eigenen Arbeiten'],ru:['Поиск отличий в журналах','«Differix» от Ravensburger','Виммельбухи','Поиск ошибок в своих работах'],en:['Spot-the-difference in magazines/newspapers','"Differix" by Ravensburger','Hidden-object pictures/books','Finding mistakes in one\'s own work']}
  },

  // ===== LERNEN / Glr =====
  'lern-atlantis': {
    scale:'lernen', subtestRef:{de:'Atlantis',ru:'Атлантида',en:'Atlantis'},
    whatItMeasures:{de:'Assoziatives Gedächtnis, Lernen neuer Informationen',ru:'Ассоциативная память, изучение новой информации',en:'Associative memory, learning new information.'},
    einfluesse:{de:['Verbindungen zwischen Einzelinformationen herstellen','Visuelles und auditives Kurzzeitgedächtnis','Arbeitsgedächtnis','Aufmerksamkeitsfokussierung','Visuelle Differenzierungsfähigkeit','Stressresistenz, Durchhaltevermögen','Flexibilität'],ru:['Связывание единиц информации','Зрительная и слуховая память','Рабочая память','Фокусировка внимания','Зрительная дифференциация','Стрессоустойчивость','Гибкость'],en:['Linking individual pieces of information','Visual and auditory short-term memory','Working memory','Focusing attention','Visual discrimination','Stress resistance, persistence','Flexibility']},
    hypothesen:{de:['Visuelles Kurzzeitgedächtnis','Auditiv-visueller Kurzzeitspeicher','Arbeitsgedächtnis','Konzentrationsfähigkeit','Belastbarkeit/Ermüdung','Frustrationstoleranz','Merkstrategien vorhanden/fehlend','Flexibilität/Perseveration'],ru:['Зрительная память','Слухо-зрительное хранение','Рабочая память','Концентрация','Выносливость/утомляемость','Устойчивость к фрустрации','Стратегии запоминания','Гибкость/персеверация'],en:['Visual short-term memory','Auditory-visual short-term store','Working memory','Concentration','Resilience/fatigue','Frustration tolerance','Memorising strategies present/absent','Flexibility/perseveration']},
    foerderung:{de:['Merkstrategien: Eselsbrücken, Assoziationen','Merkspiele: "Plumpsack", "Ratz-Fatz", Memory','Bildergeschichten nacherzählen','Perlenketten auffädeln nach Vorlage','Marburger Konzentrationstraining','Entspannungstraining'],ru:['Мнемоники, ассоциативные стратегии','Игры на память: Memory','Пересказ историй по картинкам','Нанизывание бусин по образцу','Тренировка концентрации','Тренировка расслабления'],en:['Memory strategies: mnemonics, associations','Memory games: "Plumpsack", "Ratz-Fatz", Memory','Retelling picture stories','Threading beads after a model','Marburg concentration training','Relaxation training']}
  },

  'lern-symbole': {
    scale:'lernen', subtestRef:{de:'Symbole',ru:'Символы (ребус)',en:'Rebus'},
    whatItMeasures:{de:'Assoziatives Gedächtnis mit abstrakten Reizen, Lernfähigkeit',ru:'Ассоциативная память с абстрактными стимулами, обучаемость',en:'Associative memory with abstract stimuli, learning ability.'},
    einfluesse:{de:['Abstraktionsvermögen','Assoziative Lernfähigkeit','Visuelles Gedächtnis','Aufmerksamkeit und Konzentration','Merkstrategien'],ru:['Способность к абстракции','Ассоциативная обучаемость','Зрительная память','Внимание и концентрация','Стратегии запоминания'],en:['Abstraction ability','Associative learning ability','Visual memory','Attention and concentration','Memorising strategies']},
    hypothesen:{de:['Lernfähigkeit für abstraktes Material','Assoziatives Gedächtnis','Strategieentwicklung','Konzentrationsvermögen'],ru:['Обучаемость абстрактному материалу','Ассоциативная память','Разработка стратегий','Способность к концентрации'],en:['Learning ability for abstract material','Associative memory','Strategy development','Concentration capacity']},
    foerderung:{de:['Symbole und Bedeutung lernen','Eselsbrücken für abstrakte Konzepte','Memory mit Symbolen','"SET" von Amigo (ab 8)','Lernen lernen: Leitner-System'],ru:['Изучение символов и значений','Мнемоники для абстрактных концепций','Memory с символами','«SET» от Amigo','Умение учиться: система Лейтнера'],en:['Learning symbols and their meaning','Mnemonics for abstract concepts','Memory with symbols','"SET" by Amigo (from 8)','Learning to learn: Leitner system']}
  },

  'lern-memory': {
    scale:'lernen', subtestRef:{de:'Memory (ergänzend)',ru:'Мемори (дополнительно)',en:'Memory (supplementary)'},
    whatItMeasures:{de:'Visuelles Gedächtnis, Merkfähigkeit, Konzentration',ru:'Зрительная память, запоминание, концентрация',en:'Visual memory, memorisation, concentration.'},
    einfluesse:{de:['Visuelles Kurzzeitgedächtnis','Räumliches Gedächtnis','Konzentration und Aufmerksamkeit','Merkstrategien'],ru:['Зрительная память','Пространственная память','Концентрация и внимание','Стратегии запоминания'],en:['Visual short-term memory','Spatial memory','Concentration and attention','Memorising strategies']},
    hypothesen:{de:['Visuelles Gedächtnis','Konzentrationsfähigkeit','Strategisches Vorgehen'],ru:['Зрительная память','Концентрация','Стратегический подход'],en:['Visual memory','Concentration','Strategic approach']},
    foerderung:{de:['Klassisches Memory in Varianten','"Nanu?" von Ravensburger','"Zicke Zacke Hühnerkacke" von Zoch','Kim-Spiele','Koffer packen'],ru:['Классическое Memory','«Nanu?» от Ravensburger','Игры на запоминание','Игры Кима','«Я собираю чемодан»'],en:['Classic Memory in variants','"Nanu?" by Ravensburger','"Zicke Zacke Hühnerkacke" by Zoch','Kim games','Packing the suitcase']}
  },

  // ===== PLANUNG / Gf =====
  'plan-geschichten': {
    scale:'planung', subtestRef:{de:'Geschichten ergänzen',ru:'Дополнение историй',en:'Story Completion'},
    whatItMeasures:{de:'Schlussfolgerndes Denken, Planungsfähigkeit, Zusammenhänge erkennen',ru:'Логическое мышление, планирование, распознавание связей',en:'Reasoning, planning ability, recognising connections.'},
    einfluesse:{de:['Erkennen von Mustern und Zusammenhängen','Erfassen und logisches Verknüpfen von Alltagssituationen','Induktives und deduktives Denken','Alltagswissen','Visuelle Wahrnehmung und Organisation','Aufmerksamkeit und Konzentration'],ru:['Распознавание закономерностей','Логическое связывание ситуаций','Индуктивное и дедуктивное мышление','Бытовые знания','Зрительное восприятие','Внимание и концентрация'],en:['Recognising patterns and connections','Grasping and logically linking everyday situations','Inductive and deductive thinking','Everyday knowledge','Visual perception and organisation','Attention and concentration']},
    hypothesen:{de:['Planungsfähigkeit','Abstraktionsfähigkeit','Visuelle Wahrnehmung','Seriationsfähigkeit','Schlussfolgerndes Denken','Alltagswissen'],ru:['Способность к планированию','Абстрактное мышление','Зрительное восприятие','Сериация','Логическое мышление','Бытовые знания'],en:['Planning ability','Abstraction ability','Visual perception','Seriation ability','Reasoning','Everyday knowledge']},
    foerderung:{de:['Bildergeschichten ordnen und verbalisieren','Kochrezepte, Bastelanleitungen','Zaubertricks: Schritt-für-Schritt','Handlungsfolgen üben','"Papa Moll" Bildergeschichten','Selbstständigkeit in Alltagsaufgaben'],ru:['Расстановка историй по картинкам','Рецепты, инструкции по шагам','Фокусы: пошаговые инструкции','Отработка последовательностей','Истории в картинках','Развитие самостоятельности'],en:['Ordering and verbalising picture stories','Cooking recipes, craft instructions','Magic tricks: step by step','Practising action sequences','"Papa Moll" picture stories','Independence in everyday tasks']}
  },

  'plan-muster': {
    scale:'planung', subtestRef:{de:'Muster ergänzen',ru:'Дополнение узоров',en:'Pattern Reasoning'},
    whatItMeasures:{de:'Abstraktionsfähigkeit, analytisches Denken, schlussfolgerndes Denken',ru:'Абстрактное мышление, аналитическое мышление, логика',en:'Abstraction ability, analytical thinking, reasoning.'},
    einfluesse:{de:['Abstraktionsvermögen','Analytisches Denken','Visuelle Mustererkennung','Konzentration','Flexibilität'],ru:['Абстрактное мышление','Аналитическое мышление','Распознавание узоров','Концентрация','Гибкость'],en:['Abstraction ability','Analytical thinking','Visual pattern recognition','Concentration','Flexibility']},
    hypothesen:{de:['Fluide Intelligenz','Abstraktionsfähigkeit','Analytisches Denken','Konzentrationsfähigkeit'],ru:['Флюидный интеллект','Абстрактное мышление','Аналитическое мышление','Концентрация'],en:['Fluid intelligence','Abstraction ability','Analytical thinking','Concentration']},
    foerderung:{de:['"SET" von Amigo (ab 8)','Muster zeichnen und fortsetzen','Sudoku in verschiedenen Stufen','"Qwirkle" von Schmidt Spiele','Denksportaufgaben'],ru:['«SET» от Amigo','Рисование и продолжение узоров','Судоку разных уровней','«Qwirkle» от Schmidt Spiele','Задачи на логику'],en:['"SET" by Amigo (from 8)','Drawing and continuing patterns','Sudoku at various levels','"Qwirkle" by Schmidt Spiele','Brain-teasers']}
  },

  'plan-sudoku': {
    scale:'planung', subtestRef:{de:'Sudoku (ergänzend)',ru:'Судоку (дополнительно)',en:'Sudoku (supplementary)'},
    whatItMeasures:{de:'Logisches Denken, Kombinatorik, systematisches Vorgehen',ru:'Логическое мышление, комбинаторика, систематический подход',en:'Logical thinking, combinatorics, systematic approach.'},
    einfluesse:{de:['Logisches Denken','Kombinatorische Fähigkeiten','Konzentration','Systematisches Vorgehen'],ru:['Логическое мышление','Комбинаторные способности','Концентрация','Систематический подход'],en:['Logical thinking','Combinatorial abilities','Concentration','Systematic approach']},
    hypothesen:{de:['Logisch-analytisches Denken','Problemlösestrategien','Konzentrationsfähigkeit','Flexibilität'],ru:['Логико-аналитическое мышление','Стратегии решения задач','Концентрация','Гибкость'],en:['Logical-analytical thinking','Problem-solving strategies','Concentration','Flexibility']},
    foerderung:{de:['Sudoku in altersgerechten Stufen','Zahlenspiele und Rätselhefte','"Rummikub" von Hasbro','Denksportaufgaben'],ru:['Судоку по возрастам','Числовые игры и головоломки','«Rummikub»','Задачи на логику'],en:['Sudoku at age-appropriate levels','Number games and puzzle books','"Rummikub" by Hasbro','Brain-teasers']}
  },

  // ===== WISSEN / Gc =====
  'wiss-wortschatz': {
    scale:'wissen', subtestRef:{de:'Wortschatz',ru:'Словарный запас',en:'Expressive Vocabulary'},
    whatItMeasures:{de:'Lexikalisches Wissen, Sprachentwicklung, passiver/aktiver Wortschatz',ru:'Лексические знания, развитие речи, пассивный/активный словарь',en:'Lexical knowledge, language development, passive/active vocabulary.'},
    einfluesse:{de:['Sprachentwicklung','Lexikalisches Wissen','Auditives Kurzzeitgedächtnis','Sprachverständnis','Abrufbarkeit des Wortspeichers','Konzentration'],ru:['Развитие речи','Лексические знания','Слуховая память','Понимание речи','Доступ к словарному запасу','Концентрация'],en:['Language development','Lexical knowledge','Auditory short-term memory','Language comprehension','Retrievability of word store','Concentration']},
    hypothesen:{de:['Sprachstand','Wortschatzumfang','Sozio-kultureller Hintergrund','Langzeitgedächtnis','Sprechhemmung'],ru:['Уровень речи','Объём словаря','Социокультурный фон','Долговременная память','Речевая заторможенность'],en:['Language level','Vocabulary size','Socio-cultural background','Long-term memory','Speech inhibition']},
    foerderung:{de:['Täglich 5 Min. Sprachförderung','"Der kleine Sprechdachs"','Bildkarten zur Begriffszuordnung','"TwinFit" von ProLog','Vorlesen und Bilderbücher'],ru:['Ежедневная речевая поддержка','«Маленький речевой барсук»','Карточки для понятий','«TwinFit» от ProLog','Чтение вслух и книги с картинками'],en:['5 minutes of language support daily','"Der kleine Sprechdachs"','Picture cards for concept matching','"TwinFit" by ProLog','Reading aloud and picture books']}
  },

  'wiss-sachwissen': {
    scale:'wissen', subtestRef:{de:'Wort- und Sachwissen',ru:'Вербальные знания',en:'Verbal Knowledge'},
    whatItMeasures:{de:'Allgemeinwissen, kristalline Fähigkeiten, Bildung',ru:'Общие знания, кристаллизованные способности, образование',en:'General knowledge, crystallised abilities, education.'},
    einfluesse:{de:['Allgemeinwissen','Bildung und kultureller Hintergrund','Sprachverständnis','Auditives Kurzzeitgedächtnis','Konzentration, Durchhaltevermögen'],ru:['Общие знания','Образование и культура','Понимание речи','Слуховая память','Концентрация, выносливость'],en:['General knowledge','Education and cultural background','Language comprehension','Auditory short-term memory','Concentration, persistence']},
    hypothesen:{de:['Alltagswissen und Allgemeinbildung','Sozio-kultureller Hintergrund','Sprachstand','Langzeitgedächtnis','Aufmerksamkeit'],ru:['Бытовые и общие знания','Социокультурный фон','Уровень речи','Долговременная память','Внимание'],en:['Everyday knowledge and general education','Socio-cultural background','Language level','Long-term memory','Attention']},
    foerderung:{de:['"Was ist was?" Bücher, Hörspiele','Wissenssendungen: Sendung mit der Maus','"Activity" von Piatnik','Quizspiele','Museumsbesuche, Naturerfahrungen'],ru:['Энциклопедии и аудиокниги','Познавательные передачи','«Activity» от Piatnik','Викторины','Музеи, опыт природы'],en:['"Was ist was?" books, audio plays','Educational shows','"Activity" by Piatnik','Quiz games','Museum visits, nature experiences']}
  },

  'wiss-raetsel': {
    scale:'wissen', subtestRef:{de:'Rätsel',ru:'Загадки',en:'Riddles'},
    whatItMeasures:{de:'Verbales Schlussfolgern, Sprachverständnis, Problemlösen',ru:'Вербальное логическое мышление, понимание речи, решение задач',en:'Verbal reasoning, language comprehension, problem solving.'},
    einfluesse:{de:['Verbales Schlussfolgern','Sprachverständnis','Auditives Kurzzeitgedächtnis','Konzentration','Entscheidungsfähigkeit'],ru:['Вербальное мышление','Понимание речи','Слуховая память','Концентрация','Способность к решениям'],en:['Verbal reasoning','Language comprehension','Auditory short-term memory','Concentration','Decision-making ability']},
    hypothesen:{de:['Sprachverständnis','Schlussfolgerndes Denken','Konzentration bei längeren Texten','Allgemeinwissen'],ru:['Понимание речи','Логическое мышление','Концентрация при длинных текстах','Общие знания'],en:['Language comprehension','Reasoning','Concentration with longer texts','General knowledge']},
    foerderung:{de:['Rätselbücher für Kinder','"Das Dings" von Kallmeyer','"Teekesselchen" von HABA','Denksportaufgaben mit Sprache','Geschichten mit Rätselfragen'],ru:['Книги загадок для детей','«Das Dings» от Kallmeyer','«Чайничек» от HABA','Языковые задачи','Истории с загадками'],en:['Riddle books for children','"Das Dings" by Kallmeyer','"Teekesselchen" by HABA','Brain-teasers with language','Stories with riddle questions']}
  },

  'wiss-oberbegriffe': {
    scale:'wissen', subtestRef:{de:'Oberbegriffe (ergänzend)',ru:'Обобщающие понятия (дополнительно)',en:'Categories (supplementary)'},
    whatItMeasures:{de:'Kategorisierung, lexikalisches Wissen, begriffliches Denken',ru:'Категоризация, лексические знания, понятийное мышление',en:'Categorisation, lexical knowledge, conceptual thinking.'},
    einfluesse:{de:['Kategorisierungsfähigkeit','Lexikalisches Wissen','Abstraktionsvermögen','Sprachverständnis'],ru:['Способность к категоризации','Лексические знания','Абстрактное мышление','Понимание речи'],en:['Categorisation ability','Lexical knowledge','Abstraction ability','Language comprehension']},
    hypothesen:{de:['Begriffliche Organisation','Wortschatzumfang','Abstraktionsfähigkeit'],ru:['Понятийная организация','Объём словаря','Абстрактное мышление'],en:['Conceptual organisation','Vocabulary size','Abstraction ability']},
    foerderung:{de:['"Logofix" von Ravensburger','Sortierspiele nach Kategorien','"TwinFit" Serien von ProLog','Oberbegriffe im Alltag benennen','Wortschätzchen von Persen Verlag'],ru:['«Logofix» от Ravensburger','Сортировка по категориям','Серии «TwinFit» от ProLog','Обобщающие понятия в быту','Словарные игры'],en:['"Logofix" by Ravensburger','Sorting games by category','"TwinFit" series by ProLog','Naming superordinate terms in everyday life','Vocabulary games']}
  },

  'wiss-teekesselchen': {
    scale:'wissen', subtestRef:{de:'Teekesselchen (ergänzend)',ru:'Слова-двойники (дополнительно)',en:'Double Meanings (supplementary)'},
    whatItMeasures:{de:'Sprachliches Denken, Wortschatz, flexible Bedeutungszuordnung',ru:'Языковое мышление, словарный запас, гибкое значение слов',en:'Linguistic thinking, vocabulary, flexible meaning assignment.'},
    einfluesse:{de:['Sprachliches Denken','Wortschatzbreite','Flexibilität im sprachlichen Denken','Abstraktionsvermögen'],ru:['Языковое мышление','Широта словаря','Гибкость языкового мышления','Абстрактное мышление'],en:['Linguistic thinking','Vocabulary breadth','Flexibility in linguistic thinking','Abstraction ability']},
    hypothesen:{de:['Wortschatztiefe','Sprachliche Flexibilität','Kreatives sprachliches Denken'],
ru:['Глубина словаря','Языковая гибкость','Креативное языковое мышление'],en:['Vocabulary depth','Linguistic flexibility','Creative linguistic thinking']},
    foerderung:{de:['"Teekesselchen" von HABA','"Das Dings" von Kallmeyer','Sprachspiele mit Mehrdeutigkeiten','Wortschatzspiele'],ru:['«Чайничек» от HABA','«Das Dings» от Kallmeyer','Языковые игры с многозначностью','Словарные игры'],en:['"Teekesselchen" by HABA','"Das Dings" by Kallmeyer','Language games with ambiguity','Vocabulary games']}
  },

  // ===== TUTOR + GEMISCHT =====
  'seq-koffer-packen': {
    scale:'sequential', subtestRef:{de:'Koffer packen (ergänzend)',ru:'Собираем чемодан (дополнительно)',en:'Packing the Suitcase (supplementary)'},
    whatItMeasures:{de:'Auditives Gedächtnis, Merkspanne, sequentielle Verarbeitung',ru:'Слуховая память, объём памяти, последовательная обработка',en:'Auditory memory, memory span, sequential processing.'},
    einfluesse:{de:['Auditives Kurzzeitgedächtnis','Konzentration','Merkstrategien','Seriation'],ru:['Слуховая память','Концентрация','Стратегии запоминания','Сериация'],en:['Auditory short-term memory','Concentration','Memorising strategies','Seriation']},
    hypothesen:{de:['Auditive Merkspanne','Konzentrationsfähigkeit','Strategienutzung'],ru:['Объём слуховой памяти','Концентрация','Использование стратегий'],en:['Auditory memory span','Concentration','Strategy use']},
    foerderung:{de:['Täglich Koffer packen spielen','Memory, Kim-Spiele','Merkaufträge im Alltag','Loci-Methode'],ru:['Ежедневно играть в «Чемодан»','Memory, игры Кима','Поручения на запоминание','Метод локусов'],en:['Playing packing-the-suitcase daily','Memory, Kim games','Memory errands in everyday life','Method of loci']}
  },
  'seq-koffer-packen-audio': {
    scale:'sequential', subtestRef:{de:'Koffer packen (Variante mit Ansage)',ru:'Собираем чемодан (вариант с озвучкой)',en:'Packing the Suitcase (spoken variant)'},
    whatItMeasures:{de:'Auditives Gedächtnis, Merkspanne, sequentielle Verarbeitung',ru:'Слуховая память, объём памяти, последовательная обработка',en:'Auditory memory, memory span, sequential processing.'},
    einfluesse:{de:['Auditives Kurzzeitgedächtnis','Konzentration','Merkstrategien','Seriation'],ru:['Слуховая память','Концентрация','Стратегии запоминания','Сериация'],en:['Auditory short-term memory','Concentration','Memorising strategies','Seriation']},
    hypothesen:{de:['Auditive Merkspanne','Konzentrationsfähigkeit','Strategienutzung'],ru:['Объём слуховой памяти','Концентрация','Использование стратегий'],en:['Auditory memory span','Concentration','Strategy use']},
    foerderung:{de:['Täglich Koffer packen spielen','Memory, Kim-Spiele','Merkaufträge im Alltag','Loci-Methode'],ru:['Ежедневно играть в «Чемодан»','Memory, игры Кима','Поручения на запоминание','Метод локусов'],en:['Playing packing-the-suitcase daily','Memory, Kim games','Memory errands in everyday life','Method of loci']}
  },

  'seq-rhythmus': {
    scale:'sequential', subtestRef:{de:'Rhythmus (ergänzend)',ru:'Ритм (дополнительно)',en:'Rhythm (supplementary)'},
    whatItMeasures:{de:'Rhythmisches Gedächtnis, auditive Seriation',ru:'Ритмическая память, слуховая сериация',en:'Rhythmic memory, auditory seriation.'},
    einfluesse:{de:['Rhythmisches Gefühl','Auditive Wahrnehmung','Motorische Umsetzung'],ru:['Чувство ритма','Слуховое восприятие','Моторное воплощение'],en:['Sense of rhythm','Auditory perception','Motor realisation']},
    hypothesen:{de:['Rhythmusgefühl','Auditiv-motorische Integration'],ru:['Чувство ритма','Слухо-моторная интеграция'],en:['Sense of rhythm','Auditory-motor integration']},
    foerderung:{de:['Rhythmisch-musikalische Erziehung','Boomwhacker, Trommeln','Klatschen und Stampfen','Lieder mit Bewegungen'],ru:['Ритмически-музыкальное воспитание','Бумвхакеры, барабаны','Хлопки и топанье','Песни с движениями'],en:['Rhythmic-musical education','Boomwhackers, drums','Clapping and stamping','Songs with movement']}
  },

  'lern-storycubes': {
    scale:'lernen', subtestRef:{de:'Story Cubes (ergänzend)',ru:'Кубики историй (дополнительно)',en:'Story Cubes (supplementary)'},
    whatItMeasures:{de:'Merkfähigkeit, sprachlicher Ausdruck, Kreativität',ru:'Память, речевое выражение, креативность',en:'Memorisation, verbal expression, creativity.'},
    einfluesse:{de:['Visuelles Gedächtnis','Sprachlicher Ausdruck','Kreativität','Erzählfähigkeit'],ru:['Зрительная память','Речевое выражение','Креативность','Повествовательные способности'],en:['Visual memory','Verbal expression','Creativity','Narrative ability']},
    hypothesen:{de:['Merkfähigkeit für Bilder','Sprachliche Produktion','Kreativität'],ru:['Память на картинки','Речевая продукция','Креативность'],en:['Memory for pictures','Verbal production','Creativity']},
    foerderung:{de:['Story Cubes (9 Würfel mit 54 Bildern)','Bildergeschichten erfinden','Reihum-Geschichten erzählen','"Der kleine Sprechdachs"'],ru:['Story Cubes (9 кубиков, 54 картинки)','Придумывание историй','Рассказы по кругу','«Маленький речевой барсук»'],en:['Story Cubes (9 dice, 54 pictures)','Inventing picture stories','Round-robin storytelling','"Der kleine Sprechdachs"']}
  },

  'plan-zaubertricks': {
    scale:'planung', subtestRef:{de:'Zaubertricks (ergänzend)',ru:'Фокусы (дополнительно)',en:'Magic Tricks (supplementary)'},
    whatItMeasures:{de:'Sequentielles Planen, Handlungsfolgen, Merkfähigkeit',ru:'Последовательное планирование, цепочки действий, память',en:'Sequential planning, action sequences, memorisation.'},
    einfluesse:{de:['Sequentielles Gedächtnis','Motorische Umsetzung','Planungsfähigkeit'],ru:['Последовательная память','Моторное исполнение','Планирование'],en:['Sequential memory','Motor realisation','Planning ability']},
    hypothesen:{de:['Sequentielles Planen','Motorische Fähigkeiten','Selbstvertrauen'],ru:['Последовательное планирование','Моторные навыки','Уверенность в себе'],en:['Sequential planning','Motor skills','Self-confidence']},
    foerderung:{de:['Zaubertricks üben','Kochrezepte Schritt für Schritt','Bastelanleitungen befolgen','Vorgangsbeschreibungen'],ru:['Тренировка фокусов','Рецепты по шагам','Инструкции по поделкам','Описания процессов'],en:['Practising magic tricks','Cooking recipes step by step','Following craft instructions','Process descriptions']}
  }
};

/** Get performance model for a module in current language */
export function getPerformanceData(moduleId, lang) {
  const data = performanceModel[moduleId];
  if (!data) return null;
  return {
    whatItMeasures: data.whatItMeasures[lang] || data.whatItMeasures.de,
    einfluesse: data.einfluesse[lang] || data.einfluesse.de,
    hypothesen: data.hypothesen[lang] || data.hypothesen.de,
    foerderung: data.foerderung[lang] || data.foerderung.de,
    subtestRef: data.subtestRef,
    scale: data.scale
  };
}
