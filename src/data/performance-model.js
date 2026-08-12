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
    scale:'sequential', subtestRef:'Zahlen nachsprechen (Variante am Bildschirm)',
    whatItMeasures:{de:'Visuelles Kurzzeitgedächtnis, Konzentrationsfähigkeit, Seriation. Die Ziffern werden gezeigt, nicht gesprochen – gehörbezogene Erklärungen greifen hier nicht.',ru:'Зрительная кратковременная память, концентрация, сериация. Цифры показываются, а не произносятся.'},
    einfluesse:{de:['Visuelles Kurzzeitgedächtnis','Geläufigkeit im Umgang mit Zahlen','Fokussierung der Aufmerksamkeit','Fähigkeit zur Rhythmisierung','Seriation (Reihenfolge einhalten)'],ru:['Зрительная кратковременная память','Свободное владение числами','Фокусировка внимания','Способность к ритмизации','Сериация (соблюдение порядка)']},
    hypothesen:{de:['Ermüdung / Belastbarkeit','Konzentrationsfähigkeit','Rhythmisierung gelingt gut/nicht','Auditives Kurzzeitgedächtnis','Sicherheit im Umgang mit Zahlen','Stärken/Schwächen des einzelheitlichen Denkens','Sehschärfe / visuelle Unterscheidung','Verarbeitungsgeschwindigkeit','Eigenständige Strategie (Gruppierung, Rhythmisierung)'],ru:['Утомляемость / выносливость','Концентрация внимания','Ритмизация удаётся/не удаётся','Слуховая кратковременная память','Уверенность в числах','Последовательное мышление','Острота зрения / зрительное различение','Скорость обработки','Собственная стратегия (группировка, ритмизация)']},
    foerderung:{de:['Merkspiele: Koffer packen, Memory, Kim-Spiele','Lieder, Gedichte auswendig lernen','Kopfrechnen mit "LOBO 77"','Merkaufträge im Alltag','Motorische Unterstützung: Klatschen, Bewegungen','Visuelle Hilfen: Mitlesen','Konzentrations- und Entspannungsübungen','Rhythmisch-musikalische Erziehung'],ru:['Игры на память: «Чемодан», Memory','Заучивание песен и стихов','Устный счёт с «LOBO 77»','Поручения на запоминание','Моторная поддержка: хлопки, движения','Визуальные подсказки: чтение вместе','Упражнения на концентрацию','Ритмически-музыкальное воспитание']}
  },
  'seq-zahlenfolgen-audio': {
    scale:'sequential', subtestRef:'Zahlen nachsprechen (Variante mit Ansage)',
    whatItMeasures:{de:'Akustisches Kurzzeitgedächtnis, Konzentrationsfähigkeit, Seriation. Diese Variante entspricht dem Originalsubtest: die Ziffern werden vorgesprochen',ru:'Слуховая кратковременная память, концентрация, сериация'},
    einfluesse:{de:['Akustisches Kurzzeitgedächtnis','Geläufigkeit im Umgang mit Zahlen','Fokussierung der Aufmerksamkeit','Fähigkeit zur Rhythmisierung','Seriation (Reihenfolge einhalten)'],ru:['Слуховая кратковременная память','Свободное владение числами','Фокусировка внимания','Способность к ритмизации','Сериация (соблюдение порядка)']},
    hypothesen:{de:['Ermüdung / Belastbarkeit','Konzentrationsfähigkeit','Rhythmisierung gelingt gut/nicht','Auditives Kurzzeitgedächtnis','Sicherheit im Umgang mit Zahlen','Stärken/Schwächen des einzelheitlichen Denkens','Sprachprobleme / auditive Diskriminierung','Hörprobleme','Verarbeitungsgeschwindigkeit','Eigenständige Strategie (Gruppierung, Rhythmisierung)'],ru:['Утомляемость / выносливость','Концентрация внимания','Ритмизация удаётся/не удаётся','Слуховая кратковременная память','Уверенность в числах','Последовательное мышление','Языковые проблемы','Проблемы со слухом','Скорость обработки','Собственная стратегия (группировка, ритмизация)']},
    foerderung:{de:['Merkspiele: Koffer packen, Memory, Kim-Spiele','Lieder, Gedichte auswendig lernen','Kopfrechnen mit "LOBO 77"','Merkaufträge im Alltag','Motorische Unterstützung: Klatschen, Bewegungen','Visuelle Hilfen: Mitlesen','Konzentrations- und Entspannungsübungen','Rhythmisch-musikalische Erziehung'],ru:['Игры на память: «Чемодан», Memory','Заучивание песен и стихов','Устный счёт с «LOBO 77»','Поручения на запоминание','Моторная поддержка: хлопки, движения','Визуальные подсказки: чтение вместе','Упражнения на концентрацию','Ритмически-музыкальное воспитание']}
  },

  'seq-wortreihe': {
    scale:'sequential', subtestRef:'Wortreihe',
    whatItMeasures:{de:'Sequenzielle Verarbeitung, Kurzzeitgedächtnis (auditorisch-motorisch)',ru:'Последовательная обработка, кратковременная память (слухо-моторная)'},
    einfluesse:{de:['Akustisches Kurzzeitgedächtnis','Akustisch-motorisches Gedächtnis','Konzentrationsfähigkeit, Fokussierung','Intermodalität: Hören-Sehen-Bewegen','Visuelle Wahrnehmung bedeutungshaltiger Reize','Okularleistungen: Fixieren, Augenfolgebewegungen'],ru:['Слуховая кратковременная память','Слухо-моторная память','Концентрация, фокусировка','Интермодальность: слух-зрение-движение','Визуальное восприятие значимых стимулов','Глазодвигательные функции']},
    hypothesen:{de:['Anstrengungsbereitschaft','Konzentration, Aufmerksamkeit, Ablenkbarkeit','Merkspanne auditiver Reize','Motorik: Überkreuzen der Körpermittellinie','Sensorische Integration','Auditive und visuelle Wahrnehmung','Umgang mit Stress'],ru:['Готовность к усилию','Концентрация, внимание, отвлекаемость','Объём слуховой памяти','Моторика: пересечение средней линии','Сенсорная интеграция','Слуховое и зрительное восприятие','Реакция на стресс']},
    foerderung:{de:['Kombination Sehen-Hören-Bewegen: Boomwhacker','Merkspiele: Memory, Kim-Spiele, Hörbücher','Intermodalität: "Activity" von Piatnik','Loci-Methode für Memorisierung','Körperteile nach Anweisung berühren','Psychomotorik, Ergotherapie'],ru:['Комбинация вижу-слышу-двигаюсь: ритмика','Игры на память: Memory, аудиокниги','Развитие интермодальности: «Activity»','Метод локусов для запоминания','Касаться частей тела по инструкции','Психомоторика, эрготерапия']}
  },
  'seq-wortreihe-audio': {
    scale:'sequential', subtestRef:'Wortreihe (Variante mit Ansage)',
    whatItMeasures:{de:'Sequenzielle Verarbeitung, Kurzzeitgedächtnis (auditorisch-motorisch)',ru:'Последовательная обработка, кратковременная память (слухо-моторная)'},
    einfluesse:{de:['Akustisches Kurzzeitgedächtnis','Akustisch-motorisches Gedächtnis','Konzentrationsfähigkeit, Fokussierung','Intermodalität: Hören-Sehen-Bewegen','Visuelle Wahrnehmung bedeutungshaltiger Reize','Okularleistungen: Fixieren, Augenfolgebewegungen'],ru:['Слуховая кратковременная память','Слухо-моторная память','Концентрация, фокусировка','Интермодальность: слух-зрение-движение','Визуальное восприятие значимых стимулов','Глазодвигательные функции']},
    hypothesen:{de:['Anstrengungsbereitschaft','Konzentration, Aufmerksamkeit, Ablenkbarkeit','Merkspanne auditiver Reize','Motorik: Überkreuzen der Körpermittellinie','Sensorische Integration','Auditive und visuelle Wahrnehmung','Umgang mit Stress'],ru:['Готовность к усилию','Концентрация, внимание, отвлекаемость','Объём слуховой памяти','Моторика: пересечение средней линии','Сенсорная интеграция','Слуховое и зрительное восприятие','Реакция на стресс']},
    foerderung:{de:['Kombination Sehen-Hören-Bewegen: Boomwhacker','Merkspiele: Memory, Kim-Spiele, Hörbücher','Intermodalität: "Activity" von Piatnik','Loci-Methode für Memorisierung','Körperteile nach Anweisung berühren','Psychomotorik, Ergotherapie'],ru:['Комбинация вижу-слышу-двигаюсь: ритмика','Игры на память: Memory, аудиокниги','Развитие интермодальности: «Activity»','Метод локусов для запоминания','Касаться частей тела по инструкции','Психомоторика, эрготерапия']}
  },

  'seq-handbewegungen': {
    scale:'sequential', subtestRef:'Handbewegungen',
    whatItMeasures:{de:'Visuell-motorisches Kurzzeitgedächtnis, Gedächtnisspanne',ru:'Зрительно-моторная кратковременная память, объём памяти'},
    einfluesse:{de:['Konzentration, Fokussierung','Motorische Fähigkeiten der Hand','Visuelles Kurzzeitgedächtnis','Visuell-motorische Koordination','Rhythmische Fähigkeiten','Taktil-kinästhetische Anforderungen','Reproduktion eines Modells','Flüssige Bewegungsfähigkeit der Hand'],ru:['Концентрация, фокусировка','Моторные способности руки','Зрительная кратковременная память','Зрительно-моторная координация','Ритмические способности','Тактильно-кинестетические требования','Воспроизведение модели','Плавность движений руки']},
    hypothesen:{de:['Ermüdung / Belastbarkeit','Konzentrationsfähigkeit','Rhythmisierung gelingt gut/nicht','Visuelles Kurzzeitgedächtnis','Motorische Schwächen/Stärken','Ausdauer/Durchhaltevermögen','Taktil-kinästhetische Fähigkeiten','Visuell-motorische Fähigkeiten','Verbalisierung von Strategien'],ru:['Утомляемость / выносливость','Концентрация','Ритмизация удаётся/не удаётся','Зрительная кратковременная память','Моторные слабости/силы','Выносливость/настойчивость','Тактильно-кинестетические способности','Зрительно-моторные способности','Вербализация стратегий']},
    foerderung:{de:['Nachklopfen eines Rhythmus','Hand- und Fingerbeweglichkeit: Fadenspiele','Bewegungen grobmotorisch nachmachen','Erweiterung der Merkspanne durch Mitsprechen','Ganzkörperbewegungen nachmachen','Rhythmisierung der Bewegungen','Psychomotorische Übungsbehandlung'],ru:['Повторение ритма стуком','Подвижность рук и пальцев','Повторение крупномоторных движений','Расширение объёма памяти через проговаривание','Повторение движений всего тела','Ритмизация движений','Психомоторная терапия']}
  },

  // ===== SIMULTAN / Gv =====
  'sim-konzeptbildung': {
    scale:'simultan', subtestRef:'Konzeptbildung',
    whatItMeasures:{de:'Schlussfolgerndes Denken, Visualisierung, Konzentration',ru:'Логическое мышление, визуализация, концентрация'},
    einfluesse:{de:['Induktives/Logisches Denken','Visuelle Differenzierungsfähigkeit','Fähigkeit zur Klassifikation','Flexibilität im Denken','Konzentration, Aufmerksamkeit','Fokussierung auf bedeutungsrelevante Merkmale'],ru:['Индуктивное/логическое мышление','Визуальная дифференциация','Способность к классификации','Гибкость мышления','Концентрация, внимание','Фокусировка на значимых признаках']},
    hypothesen:{de:['Allgemeine Denkfähigkeit','Entwickeln von Strategien','Analogiefähigkeit','Visuelle Wahrnehmung (Figur-Grund, Raum-Lage)','Numerische Kompetenz','Durchhaltevermögen','Bilden von Kategorien und Konzepten'],ru:['Общая мыслительная способность','Разработка стратегий','Способность к аналогиям','Визуальное восприятие','Числовая компетенция','Настойчивость','Формирование категорий и концепций']},
    foerderung:{de:['Denksportaufgaben','Sortieren nach Merkmalen: Form, Farbe, Kategorien','Spiele: "Die Logik-Piraten", "Logofix", "TwinFit"','Ober- und Unterbegriffe mit Bildmaterial','Konzentrationsübungen (Marburger Training)','Förderung visuelle Wahrnehmung nach Sindelar'],ru:['Задачи на логику','Сортировка по признакам','Игры: «Логические пираты», «Logofix», «TwinFit»','Обобщающие и частные понятия','Тренировка концентрации','Развитие зрительного восприятия']}
  },

  'sim-gesichter': {
    scale:'simultan', subtestRef:'Wiedererkennen von Gesichtern',
    whatItMeasures:{de:'Visuelles Gedächtnis, Wiedererkennungsfähigkeit',ru:'Зрительная память, способность к узнаванию'},
    einfluesse:{de:['Visuelles Kurzzeitgedächtnis','Detailgenauigkeit der Wahrnehmung','Aufmerksamkeit bei der Darbietung','Strategie der Merkmalserkennung'],ru:['Зрительная кратковременная память','Детальность восприятия','Внимание при показе','Стратегия распознавания признаков']},
    hypothesen:{de:['Visuelles Gedächtnis','Aufmerksamkeit für Details','Beobachtungsgabe','Gesichtererkennung als soziale Fähigkeit'],ru:['Зрительная память','Внимание к деталям','Наблюдательность','Распознавание лиц как социальный навык']},
    foerderung:{de:['Memory-Spiele mit Gesichtern','Suchbilder, Wimmelbilder','Kim-Spiele (Gegenstände erinnern)','"Differix" von Ravensburger'],ru:['Memory с лицами','Поиск отличий, виммельбухи','Игры Кима (запомнить предметы)','«Differix» от Ravensburger']}
  },

  'sim-rover': {
    scale:'simultan', subtestRef:'Rover',
    whatItMeasures:{de:'Simultane/visuelle Verarbeitung, Entscheidungsfindung, räumliches Denken',ru:'Симультанная/зрительная обработка, принятие решений, пространственное мышление'},
    einfluesse:{de:['Wahrnehmungsgebundenes logisches Schlussfolgern','Räumliches Vorstellungsvermögen','Planungsfähigkeit und Strategieentwicklung','Visuell-motorische Koordination','Konzentration und Aufmerksamkeit'],ru:['Логическое мышление, связанное с восприятием','Пространственное воображение','Планирование и стратегия','Зрительно-моторная координация','Концентрация и внимание']},
    hypothesen:{de:['Räumlich-visuelles Denken','Problemlöseverhalten','Strategisch-analytisches Vorgehen','Vorausschauendes Planen','Flexibilität beim Strategiewechsel'],ru:['Пространственно-зрительное мышление','Решение проблем','Стратегически-аналитический подход','Предусмотрительное планирование','Гибкость при смене стратегии']},
    foerderung:{de:['"Rush Hour" von HCM Kinzel','Strategiespiele: Mühle, Dame, 4 Gewinnt','Lego, Holzbausteine, Konstruktionsspiele','"Architecto" von Huch & Friends','Pläne und Skizzen anfertigen'],ru:['«Rush Hour»','Стратегические игры: мельница, шашки','Lego, деревянные кубики','«Architecto»','Черчение планов и эскизов']}
  },

  'sim-dreiecke': {
    scale:'simultan', subtestRef:'Dreiecke',
    whatItMeasures:{de:'Visuell-räumliche Verarbeitung, Konstruktionsfähigkeit',ru:'Зрительно-пространственная обработка, конструктивные способности'},
    einfluesse:{de:['Räumliches Vorstellungsvermögen','Visuell-motorische Koordination','Erkennen von Teil-Ganzes-Beziehungen','Konzentration, Ausdauer'],ru:['Пространственное воображение','Зрительно-моторная координация','Распознавание часть-целое','Концентрация, выносливость']},
    hypothesen:{de:['Räumlich-konstruktive Fähigkeiten','Visuell-motorische Integration','Problemlöseverhalten bei Konstruktionsaufgaben','Frustrationstoleranz bei komplexen Aufgaben'],ru:['Пространственно-конструктивные способности','Зрительно-моторная интеграция','Решение конструктивных задач','Устойчивость к фрустрации']},
    foerderung:{de:['Tangram, geometrische Puzzles','Nikitin-Material: Musterwürfel, Uniwürfel','"PotzKlotz" von Kallmeyer','Lego, Holzbausteine','Nachzeichnen von Figuren und Mustern'],ru:['Танграм, геометрические пазлы','Материалы Никитина: узорные кубики','«PotzKlotz»','Lego, деревянные кубики','Срисовывание фигур и узоров']}
  },

  'sim-bausteine': {
    scale:'simultan', subtestRef:'Bausteine zählen',
    whatItMeasures:{de:'Räumliches Vorstellungsvermögen, mentale Rotation',ru:'Пространственное воображение, ментальное вращение'},
    einfluesse:{de:['Räumliches Vorstellungsvermögen','Mentale Rotationsfähigkeit','Verständnis von Verdeckung/Verborgenem','Konzentration'],ru:['Пространственное воображение','Способность к ментальному вращению','Понимание скрытых объектов','Концентрация']},
    hypothesen:{de:['Räumlich-visuelle Fähigkeiten','Mathematisches Grundverständnis','Abstraktionsvermögen','Systematisches Vorgehen'],ru:['Пространственно-зрительные способности','Базовое математическое понимание','Способность к абстракции','Систематический подход']},
    foerderung:{de:['Bauklötze zählen (auch versteckte)','Würfelgebäude bauen und nachbauen','Nikitin-Material: Bausteine, Geowürfel','Cubus / PotzKlotz','Technisches Zeichnen'],ru:['Подсчёт кубиков (включая скрытые)','Постройка кубиковых конструкций','Материалы Никитина','Cubus / PotzKlotz','Техническое черчение']}
  },

  'sim-gestaltschliessen': {
    scale:'simultan', subtestRef:'Gestaltschließen',
    whatItMeasures:{de:'Visuelle Ergänzungsfähigkeit, Erkennen aus Teilinformationen',ru:'Визуальное дополнение, узнавание по частичной информации'},
    einfluesse:{de:['Visuelle Wahrnehmung und Organisation','Fähigkeit zur mentalen Vervollständigung','Erfahrung mit Objekten','Konzentration'],ru:['Зрительное восприятие и организация','Способность к мысленному завершению','Опыт с объектами','Концентрация']},
    hypothesen:{de:['Visuelle Synthesefähigkeit','Wahrnehmungsorganisation','Allgemeinwissen über Objekte','Abstraktionsvermögen'],ru:['Способность к зрительному синтезу','Организация восприятия','Общие знания об объектах','Способность к абстракции']},
    foerderung:{de:['Suchbilder, Wimmelbilder','Puzzles mit steigender Teilezahl','"Differix" von Ravensburger','Halbierte Bilder ergänzen lassen','Kim-Spiele'],ru:['Поиск отличий, виммельбухи','Пазлы с увеличением деталей','«Differix» от Ravensburger','Дополнение половинчатых изображений','Игры Кима']}
  },

  'sim-tangram': {
    scale:'simultan', subtestRef:'Tangram (ergänzend)',
    whatItMeasures:{de:'Räumliches Denken, Formerkennung, visuelle Organisation',ru:'Пространственное мышление, распознавание форм, визуальная организация'},
    einfluesse:{de:['Räumliches Vorstellungsvermögen','Formerkennung und -kombination','Strategisches Vorgehen','Visuell-motorische Koordination'],ru:['Пространственное воображение','Распознавание и комбинирование форм','Стратегический подход','Зрительно-моторная координация']},
    hypothesen:{de:['Räumlich-konstruktive Fähigkeiten','Flexibilität im Denken','Problemlöseverhalten'],ru:['Пространственно-конструктивные способности','Гибкость мышления','Решение задач']},
    foerderung:{de:['Tangram in verschiedenen Schwierigkeitsstufen','"Ubongo" von Kosmos','"Make n Break" von Ravensburger','Nikitin-Material: Quadrate','Geometrische Puzzles'],ru:['Танграм разных уровней сложности','«Ubongo» от Kosmos','«Make n Break» от Ravensburger','Материалы Никитина: квадраты','Геометрические пазлы']}
  },

  'sim-suchbild': {
    scale:'simultan', subtestRef:'Suchbild (ergänzend)',
    whatItMeasures:{de:'Visuelle Differenzierung, Detailwahrnehmung, Konzentration',ru:'Зрительная дифференциация, восприятие деталей, концентрация'},
    einfluesse:{de:['Visuelle Differenzierungsfähigkeit','Aufmerksamkeit für Details','Konzentration über längere Zeit','Systematisches Absuchen'],ru:['Зрительная дифференциация','Внимание к деталям','Длительная концентрация','Систематический поиск']},
    hypothesen:{de:['Visuelle Wahrnehmungsgenauigkeit','Konzentrationsfähigkeit','Systematische Arbeitsweise'],ru:['Точность зрительного восприятия','Концентрация','Систематический подход']},
    foerderung:{de:['Suchbilder in Zeitschriften/Zeitungen','"Differix" von Ravensburger','Wimmelbilder/-bücher','Fehlersuche in eigenen Arbeiten'],ru:['Поиск отличий в журналах','«Differix» от Ravensburger','Виммельбухи','Поиск ошибок в своих работах']}
  },

  // ===== LERNEN / Glr =====
  'lern-atlantis': {
    scale:'lernen', subtestRef:'Atlantis',
    whatItMeasures:{de:'Assoziatives Gedächtnis, Lernen neuer Informationen',ru:'Ассоциативная память, изучение новой информации'},
    einfluesse:{de:['Verbindungen zwischen Einzelinformationen herstellen','Visuelles und auditives Kurzzeitgedächtnis','Arbeitsgedächtnis','Aufmerksamkeitsfokussierung','Visuelle Differenzierungsfähigkeit','Stressresistenz, Durchhaltevermögen','Flexibilität'],ru:['Связывание единиц информации','Зрительная и слуховая память','Рабочая память','Фокусировка внимания','Зрительная дифференциация','Стрессоустойчивость','Гибкость']},
    hypothesen:{de:['Visuelles Kurzzeitgedächtnis','Auditiv-visueller Kurzzeitspeicher','Arbeitsgedächtnis','Konzentrationsfähigkeit','Belastbarkeit/Ermüdung','Frustrationstoleranz','Merkstrategien vorhanden/fehlend','Flexibilität/Perseveration'],ru:['Зрительная память','Слухо-зрительное хранение','Рабочая память','Концентрация','Выносливость/утомляемость','Устойчивость к фрустрации','Стратегии запоминания','Гибкость/персеверация']},
    foerderung:{de:['Merkstrategien: Eselsbrücken, Assoziationen','Merkspiele: "Plumpsack", "Ratz-Fatz", Memory','Bildergeschichten nacherzählen','Perlenketten auffädeln nach Vorlage','Marburger Konzentrationstraining','Entspannungstraining'],ru:['Мнемоники, ассоциативные стратегии','Игры на память: Memory','Пересказ историй по картинкам','Нанизывание бусин по образцу','Тренировка концентрации','Тренировка расслабления']}
  },

  'lern-symbole': {
    scale:'lernen', subtestRef:'Symbole',
    whatItMeasures:{de:'Assoziatives Gedächtnis mit abstrakten Reizen, Lernfähigkeit',ru:'Ассоциативная память с абстрактными стимулами, обучаемость'},
    einfluesse:{de:['Abstraktionsvermögen','Assoziative Lernfähigkeit','Visuelles Gedächtnis','Aufmerksamkeit und Konzentration','Merkstrategien'],ru:['Способность к абстракции','Ассоциативная обучаемость','Зрительная память','Внимание и концентрация','Стратегии запоминания']},
    hypothesen:{de:['Lernfähigkeit für abstraktes Material','Assoziatives Gedächtnis','Strategieentwicklung','Konzentrationsvermögen'],ru:['Обучаемость абстрактному материалу','Ассоциативная память','Разработка стратегий','Способность к концентрации']},
    foerderung:{de:['Symbole und Bedeutung lernen','Eselsbrücken für abstrakte Konzepte','Memory mit Symbolen','"SET" von Amigo (ab 8)','Lernen lernen: Leitner-System'],ru:['Изучение символов и значений','Мнемоники для абстрактных концепций','Memory с символами','«SET» от Amigo','Умение учиться: система Лейтнера']}
  },

  'lern-memory': {
    scale:'lernen', subtestRef:'Memory (ergänzend)',
    whatItMeasures:{de:'Visuelles Gedächtnis, Merkfähigkeit, Konzentration',ru:'Зрительная память, запоминание, концентрация'},
    einfluesse:{de:['Visuelles Kurzzeitgedächtnis','Räumliches Gedächtnis','Konzentration und Aufmerksamkeit','Merkstrategien'],ru:['Зрительная память','Пространственная память','Концентрация и внимание','Стратегии запоминания']},
    hypothesen:{de:['Visuelles Gedächtnis','Konzentrationsfähigkeit','Strategisches Vorgehen'],ru:['Зрительная память','Концентрация','Стратегический подход']},
    foerderung:{de:['Klassisches Memory in Varianten','"Nanu?" von Ravensburger','"Zicke Zacke Hühnerkacke" von Zoch','Kim-Spiele','Koffer packen'],ru:['Классическое Memory','«Nanu?» от Ravensburger','Игры на запоминание','Игры Кима','«Я собираю чемодан»']}
  },

  // ===== PLANUNG / Gf =====
  'plan-geschichten': {
    scale:'planung', subtestRef:'Geschichten ergänzen',
    whatItMeasures:{de:'Schlussfolgerndes Denken, Planungsfähigkeit, Zusammenhänge erkennen',ru:'Логическое мышление, планирование, распознавание связей'},
    einfluesse:{de:['Erkennen von Mustern und Zusammenhängen','Erfassen und logisches Verknüpfen von Alltagssituationen','Induktives und deduktives Denken','Alltagswissen','Visuelle Wahrnehmung und Organisation','Aufmerksamkeit und Konzentration'],ru:['Распознавание закономерностей','Логическое связывание ситуаций','Индуктивное и дедуктивное мышление','Бытовые знания','Зрительное восприятие','Внимание и концентрация']},
    hypothesen:{de:['Planungsfähigkeit','Abstraktionsfähigkeit','Visuelle Wahrnehmung','Seriationsfähigkeit','Schlussfolgerndes Denken','Alltagswissen'],ru:['Способность к планированию','Абстрактное мышление','Зрительное восприятие','Сериация','Логическое мышление','Бытовые знания']},
    foerderung:{de:['Bildergeschichten ordnen und verbalisieren','Kochrezepte, Bastelanleitungen','Zaubertricks: Schritt-für-Schritt','Handlungsfolgen üben','"Papa Moll" Bildergeschichten','Selbstständigkeit in Alltagsaufgaben'],ru:['Расстановка историй по картинкам','Рецепты, инструкции по шагам','Фокусы: пошаговые инструкции','Отработка последовательностей','Истории в картинках','Развитие самостоятельности']}
  },

  'plan-muster': {
    scale:'planung', subtestRef:'Muster ergänzen',
    whatItMeasures:{de:'Abstraktionsfähigkeit, analytisches Denken, schlussfolgerndes Denken',ru:'Абстрактное мышление, аналитическое мышление, логика'},
    einfluesse:{de:['Abstraktionsvermögen','Analytisches Denken','Visuelle Mustererkennung','Konzentration','Flexibilität'],ru:['Абстрактное мышление','Аналитическое мышление','Распознавание узоров','Концентрация','Гибкость']},
    hypothesen:{de:['Fluide Intelligenz','Abstraktionsfähigkeit','Analytisches Denken','Konzentrationsfähigkeit'],ru:['Флюидный интеллект','Абстрактное мышление','Аналитическое мышление','Концентрация']},
    foerderung:{de:['"SET" von Amigo (ab 8)','Muster zeichnen und fortsetzen','Sudoku in verschiedenen Stufen','"Qwirkle" von Schmidt Spiele','Denksportaufgaben'],ru:['«SET» от Amigo','Рисование и продолжение узоров','Судоку разных уровней','«Qwirkle» от Schmidt Spiele','Задачи на логику']}
  },

  'plan-sudoku': {
    scale:'planung', subtestRef:'Sudoku (ergänzend)',
    whatItMeasures:{de:'Logisches Denken, Kombinatorik, systematisches Vorgehen',ru:'Логическое мышление, комбинаторика, систематический подход'},
    einfluesse:{de:['Logisches Denken','Kombinatorische Fähigkeiten','Konzentration','Systematisches Vorgehen'],ru:['Логическое мышление','Комбинаторные способности','Концентрация','Систематический подход']},
    hypothesen:{de:['Logisch-analytisches Denken','Problemlösestrategien','Konzentrationsfähigkeit','Flexibilität'],ru:['Логико-аналитическое мышление','Стратегии решения задач','Концентрация','Гибкость']},
    foerderung:{de:['Sudoku in altersgerechten Stufen','Zahlenspiele und Rätselhefte','"Rummikub" von Hasbro','Denksportaufgaben'],ru:['Судоку по возрастам','Числовые игры и головоломки','«Rummikub»','Задачи на логику']}
  },

  // ===== WISSEN / Gc =====
  'wiss-wortschatz': {
    scale:'wissen', subtestRef:'Wortschatz',
    whatItMeasures:{de:'Lexikalisches Wissen, Sprachentwicklung, passiver/aktiver Wortschatz',ru:'Лексические знания, развитие речи, пассивный/активный словарь'},
    einfluesse:{de:['Sprachentwicklung','Lexikalisches Wissen','Auditives Kurzzeitgedächtnis','Sprachverständnis','Abrufbarkeit des Wortspeichers','Konzentration'],ru:['Развитие речи','Лексические знания','Слуховая память','Понимание речи','Доступ к словарному запасу','Концентрация']},
    hypothesen:{de:['Sprachstand','Wortschatzumfang','Sozio-kultureller Hintergrund','Langzeitgedächtnis','Sprechhemmung'],ru:['Уровень речи','Объём словаря','Социокультурный фон','Долговременная память','Речевая заторможенность']},
    foerderung:{de:['Täglich 5 Min. Sprachförderung','"Der kleine Sprechdachs"','Bildkarten zur Begriffszuordnung','"TwinFit" von ProLog','Vorlesen und Bilderbücher'],ru:['Ежедневная речевая поддержка','«Маленький речевой барсук»','Карточки для понятий','«TwinFit» от ProLog','Чтение вслух и книги с картинками']}
  },

  'wiss-sachwissen': {
    scale:'wissen', subtestRef:'Wort- und Sachwissen',
    whatItMeasures:{de:'Allgemeinwissen, kristalline Fähigkeiten, Bildung',ru:'Общие знания, кристаллизованные способности, образование'},
    einfluesse:{de:['Allgemeinwissen','Bildung und kultureller Hintergrund','Sprachverständnis','Auditives Kurzzeitgedächtnis','Konzentration, Durchhaltevermögen'],ru:['Общие знания','Образование и культура','Понимание речи','Слуховая память','Концентрация, выносливость']},
    hypothesen:{de:['Alltagswissen und Allgemeinbildung','Sozio-kultureller Hintergrund','Sprachstand','Langzeitgedächtnis','Aufmerksamkeit'],ru:['Бытовые и общие знания','Социокультурный фон','Уровень речи','Долговременная память','Внимание']},
    foerderung:{de:['"Was ist was?" Bücher, Hörspiele','Wissenssendungen: Sendung mit der Maus','"Activity" von Piatnik','Quizspiele','Museumsbesuche, Naturerfahrungen'],ru:['Энциклопедии и аудиокниги','Познавательные передачи','«Activity» от Piatnik','Викторины','Музеи, опыт природы']}
  },

  'wiss-raetsel': {
    scale:'wissen', subtestRef:'Rätsel',
    whatItMeasures:{de:'Verbales Schlussfolgern, Sprachverständnis, Problemlösen',ru:'Вербальное логическое мышление, понимание речи, решение задач'},
    einfluesse:{de:['Verbales Schlussfolgern','Sprachverständnis','Auditives Kurzzeitgedächtnis','Konzentration','Entscheidungsfähigkeit'],ru:['Вербальное мышление','Понимание речи','Слуховая память','Концентрация','Способность к решениям']},
    hypothesen:{de:['Sprachverständnis','Schlussfolgerndes Denken','Konzentration bei längeren Texten','Allgemeinwissen'],ru:['Понимание речи','Логическое мышление','Концентрация при длинных текстах','Общие знания']},
    foerderung:{de:['Rätselbücher für Kinder','"Das Dings" von Kallmeyer','"Teekesselchen" von HABA','Denksportaufgaben mit Sprache','Geschichten mit Rätselfragen'],ru:['Книги загадок для детей','«Das Dings» от Kallmeyer','«Чайничек» от HABA','Языковые задачи','Истории с загадками']}
  },

  'wiss-oberbegriffe': {
    scale:'wissen', subtestRef:'Oberbegriffe (ergänzend)',
    whatItMeasures:{de:'Kategorisierung, lexikalisches Wissen, begriffliches Denken',ru:'Категоризация, лексические знания, понятийное мышление'},
    einfluesse:{de:['Kategorisierungsfähigkeit','Lexikalisches Wissen','Abstraktionsvermögen','Sprachverständnis'],ru:['Способность к категоризации','Лексические знания','Абстрактное мышление','Понимание речи']},
    hypothesen:{de:['Begriffliche Organisation','Wortschatzumfang','Abstraktionsfähigkeit'],ru:['Понятийная организация','Объём словаря','Абстрактное мышление']},
    foerderung:{de:['"Logofix" von Ravensburger','Sortierspiele nach Kategorien','"TwinFit" Serien von ProLog','Oberbegriffe im Alltag benennen','Wortschätzchen von Persen Verlag'],ru:['«Logofix» от Ravensburger','Сортировка по категориям','Серии «TwinFit» от ProLog','Обобщающие понятия в быту','Словарные игры']}
  },

  'wiss-teekesselchen': {
    scale:'wissen', subtestRef:'Teekesselchen (ergänzend)',
    whatItMeasures:{de:'Sprachliches Denken, Wortschatz, flexible Bedeutungszuordnung',ru:'Языковое мышление, словарный запас, гибкое значение слов'},
    einfluesse:{de:['Sprachliches Denken','Wortschatzbreite','Flexibilität im sprachlichen Denken','Abstraktionsvermögen'],ru:['Языковое мышление','Широта словаря','Гибкость языкового мышления','Абстрактное мышление']},
    hypothesen:{de:['Wortschatztiefe','Sprachliche Flexibilität','Kreatives sprachliches Denken'],
ru:['Глубина словаря','Языковая гибкость','Креативное языковое мышление']},
    foerderung:{de:['"Teekesselchen" von HABA','"Das Dings" von Kallmeyer','Sprachspiele mit Mehrdeutigkeiten','Wortschatzspiele'],ru:['«Чайничек» от HABA','«Das Dings» от Kallmeyer','Языковые игры с многозначностью','Словарные игры']}
  },

  // ===== TUTOR + GEMISCHT =====
  'seq-koffer-packen': {
    scale:'sequential', subtestRef:'Koffer packen (ergänzend)',
    whatItMeasures:{de:'Auditives Gedächtnis, Merkspanne, sequentielle Verarbeitung',ru:'Слуховая память, объём памяти, последовательная обработка'},
    einfluesse:{de:['Auditives Kurzzeitgedächtnis','Konzentration','Merkstrategien','Seriation'],ru:['Слуховая память','Концентрация','Стратегии запоминания','Сериация']},
    hypothesen:{de:['Auditive Merkspanne','Konzentrationsfähigkeit','Strategienutzung'],ru:['Объём слуховой памяти','Концентрация','Использование стратегий']},
    foerderung:{de:['Täglich Koffer packen spielen','Memory, Kim-Spiele','Merkaufträge im Alltag','Loci-Methode'],ru:['Ежедневно играть в «Чемодан»','Memory, игры Кима','Поручения на запоминание','Метод локусов']}
  },
  'seq-koffer-packen-audio': {
    scale:'sequential', subtestRef:'Koffer packen (Variante mit Ansage)',
    whatItMeasures:{de:'Auditives Gedächtnis, Merkspanne, sequentielle Verarbeitung',ru:'Слуховая память, объём памяти, последовательная обработка'},
    einfluesse:{de:['Auditives Kurzzeitgedächtnis','Konzentration','Merkstrategien','Seriation'],ru:['Слуховая память','Концентрация','Стратегии запоминания','Сериация']},
    hypothesen:{de:['Auditive Merkspanne','Konzentrationsfähigkeit','Strategienutzung'],ru:['Объём слуховой памяти','Концентрация','Использование стратегий']},
    foerderung:{de:['Täglich Koffer packen spielen','Memory, Kim-Spiele','Merkaufträge im Alltag','Loci-Methode'],ru:['Ежедневно играть в «Чемодан»','Memory, игры Кима','Поручения на запоминание','Метод локусов']}
  },

  'seq-rhythmus': {
    scale:'sequential', subtestRef:'Rhythmus (ergänzend)',
    whatItMeasures:{de:'Rhythmisches Gedächtnis, auditive Seriation',ru:'Ритмическая память, слуховая сериация'},
    einfluesse:{de:['Rhythmisches Gefühl','Auditive Wahrnehmung','Motorische Umsetzung'],ru:['Чувство ритма','Слуховое восприятие','Моторное воплощение']},
    hypothesen:{de:['Rhythmusgefühl','Auditiv-motorische Integration'],ru:['Чувство ритма','Слухо-моторная интеграция']},
    foerderung:{de:['Rhythmisch-musikalische Erziehung','Boomwhacker, Trommeln','Klatschen und Stampfen','Lieder mit Bewegungen'],ru:['Ритмически-музыкальное воспитание','Бумвхакеры, барабаны','Хлопки и топанье','Песни с движениями']}
  },

  'lern-storycubes': {
    scale:'lernen', subtestRef:'Story Cubes (ergänzend)',
    whatItMeasures:{de:'Merkfähigkeit, sprachlicher Ausdruck, Kreativität',ru:'Память, речевое выражение, креативность'},
    einfluesse:{de:['Visuelles Gedächtnis','Sprachlicher Ausdruck','Kreativität','Erzählfähigkeit'],ru:['Зрительная память','Речевое выражение','Креативность','Повествовательные способности']},
    hypothesen:{de:['Merkfähigkeit für Bilder','Sprachliche Produktion','Kreativität'],ru:['Память на картинки','Речевая продукция','Креативность']},
    foerderung:{de:['Story Cubes (9 Würfel mit 54 Bildern)','Bildergeschichten erfinden','Reihum-Geschichten erzählen','"Der kleine Sprechdachs"'],ru:['Story Cubes (9 кубиков, 54 картинки)','Придумывание историй','Рассказы по кругу','«Маленький речевой барсук»']}
  },

  'plan-zaubertricks': {
    scale:'planung', subtestRef:'Zaubertricks (ergänzend)',
    whatItMeasures:{de:'Sequentielles Planen, Handlungsfolgen, Merkfähigkeit',ru:'Последовательное планирование, цепочки действий, память'},
    einfluesse:{de:['Sequentielles Gedächtnis','Motorische Umsetzung','Planungsfähigkeit'],ru:['Последовательная память','Моторное исполнение','Планирование']},
    hypothesen:{de:['Sequentielles Planen','Motorische Fähigkeiten','Selbstvertrauen'],ru:['Последовательное планирование','Моторные навыки','Уверенность в себе']},
    foerderung:{de:['Zaubertricks üben','Kochrezepte Schritt für Schritt','Bastelanleitungen befolgen','Vorgangsbeschreibungen'],ru:['Тренировка фокусов','Рецепты по шагам','Инструкции по поделкам','Описания процессов']}
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
