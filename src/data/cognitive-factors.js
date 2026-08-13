/**
 * Kognitives Faktoren-Modell – 89 Fähigkeiten in 14 Kategorien
 * Master-Liste aus cognitive_competences.txt
 * Jeder Faktor hat eine Liste von trainierenden Test-Modulen
 */

export const FACTOR_CATEGORIES = {
  auditive_wahrnehmung: { de:"Auditive Wahrnehmung", ru:"Слуховое восприятие", en:"Auditory perception", icon:"👂" },
  visuelle_wahrnehmung: { de:"Visuelle Wahrnehmung", ru:"Зрительное восприятие", en:"Visual perception", icon:"👁️" },
  gedaechtnis: { de:"Gedächtnis", ru:"Память", en:"Memory", icon:"🧠" },
  aufmerksamkeit_konzentration: { de:"Aufmerksamkeit & Konzentration", ru:"Внимание и концентрация", en:"Attention & concentration", icon:"🎯" },
  exekutive_funktionen: { de:"Exekutive Funktionen", ru:"Управляющие функции", en:"Executive functions", icon:"💡" },
  motorik: { de:"Motorik", ru:"Моторика", en:"Motor skills", icon:"🖐️" },
  sprache: { de:"Sprache", ru:"Речь", en:"Language", icon:"💬" },
  belastbarkeit_ausdauer: { de:"Belastbarkeit & Ausdauer", ru:"Выносливость", en:"Resilience & endurance", icon:"💪" },
  abstraktion: { de:"Abstraktion & Kategorisierung", ru:"Абстракция и категоризация", en:"Abstraction & categorization", icon:"🔮" },
  raeumlich: { de:"Räumliches Denken", ru:"Пространственное мышление", en:"Spatial reasoning", icon:"📐" },
  lernfaehigkeit: { de:"Lernfähigkeit", ru:"Обучаемость", en:"Learning ability", icon:"📖" },
  sozial_kulturell: { de:"Sozial & Kulturell", ru:"Социум и культура", en:"Social & cultural", icon:"🌍" },
  selbstregulation: { de:"Selbstregulation", ru:"Саморегуляция", en:"Self-regulation", icon:"🧘" },
  sonstige: { de:"Sonstige Faktoren", ru:"Прочие факторы", en:"Other factors", icon:"📋" },
};

export const cognitiveFactors = {
  KF001: { category:'gedaechtnis', de:'Abrufbarkeit des Wortspeichers', ru:'Доступность словарного запаса (извлечение слов)', en:'Lexical retrieval', modules:['wiss-wortschatz'] },
  KF002: { category:'abstraktion', de:'Abstraktionsvermögen', ru:'Способность к абстракции', en:'Abstraction ability', modules:['sim-bausteine','sim-gestaltschliessen','lern-symbole','plan-muster','wiss-oberbegriffe','wiss-teekesselchen'] },
  KF003: { category:'auditive_wahrnehmung', de:'Akustisch-motorisches Gedächtnis', ru:'Слухомоторная память', en:'Auditory-motor memory', modules:['seq-rhythmus','seq-wortreihe-audio'] },
  KF004: { category:'auditive_wahrnehmung', de:'Akustisches Kurzzeitgedächtnis', ru:'Акустическая кратковременная память', en:'Acoustic short-term memory', modules:['seq-zahlenfolgen-audio','seq-wortreihe-audio'] },
  KF005: { category:'sozial_kulturell', de:'Allgemeinwissen', ru:'Общие знания (эрудиция)', en:'General knowledge', modules:['wiss-raetsel','wiss-sachwissen'] },
  KF006: { category:'sozial_kulturell', de:'Alltagswissen', ru:'Житейские знания', en:'Everyday knowledge', modules:['plan-geschichten'] },
  KF007: { category:'exekutive_funktionen', de:'Analytisches Denken', ru:'Аналитическое мышление', en:'Analytical thinking', modules:['plan-muster','plan-sudoku'] },
  KF008: { category:'gedaechtnis', de:'Arbeitsgedächtnis', ru:'Рабочая память', en:'Working memory', modules:['lern-atlantis'] },
  KF009: { category:'lernfaehigkeit', de:'Assoziative Lernfähigkeit', ru:'Способность к ассоциативному обучению', en:'Associative learning ability', modules:['lern-symbole'] },
  KF010: { category:'auditive_wahrnehmung', de:'Auditive Wahrnehmung', ru:'Слуховое восприятие', en:'Auditory perception', modules:['seq-rhythmus','seq-zahlenfolgen-audio','seq-wortreihe-audio'] },
  KF011: { category:'auditive_wahrnehmung', de:'Auditives Kurzzeitgedächtnis', ru:'Слуховая кратковременная память', en:'Auditory short-term memory', modules:['seq-zahlenfolgen-audio','seq-wortreihe-audio','seq-koffer-packen-audio'] },
  KF012: { category:'aufmerksamkeit_konzentration', de:'Aufmerksamkeit', ru:'Внимание', en:'Attention', modules:['wiss-sachwissen','sim-gesichter','sim-suchbild'] },
  KF013: { category:'aufmerksamkeit_konzentration', de:'Aufmerksamkeit bei der Darbietung', ru:'Внимание при предъявлении материала', en:'Attention during presentation', modules:['sim-gesichter'] },
  KF014: { category:'aufmerksamkeit_konzentration', de:'Aufmerksamkeit für Details', ru:'Внимание к деталям', en:'Attention to detail', modules:['sim-gesichter','sim-suchbild'] },
  KF015: { category:'aufmerksamkeit_konzentration', de:'Aufmerksamkeit und Konzentration', ru:'Внимание и концентрация', en:'Attention and concentration', modules:['lern-symbole','plan-geschichten'] },
  KF016: { category:'aufmerksamkeit_konzentration', de:'Aufmerksamkeitsfokussierung', ru:'Фокусировка внимания', en:'Attentional focusing', modules:['lern-atlantis'] },
  KF017: { category:'visuelle_wahrnehmung', de:'Augenfolgebewegungen', ru:'Следящие движения глаз', en:'Pursuit eye movements', modules:['seq-wortreihe'] },
  KF018: { category:'belastbarkeit_ausdauer', de:'Ausdauer', ru:'Выносливость', en:'Endurance', modules:['seq-handbewegungen','sim-konzeptbildung','sim-dreiecke'] },
  KF019: { category:'sozial_kulturell', de:'Bildung und kultureller Hintergrund', ru:'Образование и культурный фон', en:'Education and cultural background', modules:['wiss-sachwissen'] },
  KF020: { category:'visuelle_wahrnehmung', de:'Detailgenauigkeit der Wahrnehmung', ru:'Точность восприятия деталей', en:'Perceptual accuracy for details', modules:['sim-gesichter'] },
  KF021: { category:'belastbarkeit_ausdauer', de:'Durchhaltevermögen', ru:'Настойчивость (упорство)', en:'Perseverance', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio','lern-atlantis','wiss-sachwissen'] },
  KF022: { category:'exekutive_funktionen', de:'Entscheidungsfähigkeit', ru:'Способность принимать решения', en:'Decision-making ability', modules:['wiss-raetsel'] },
  KF023: { category:'sozial_kulturell', de:'Erfahrung mit Objekten', ru:'Опыт обращения с предметами', en:'Experience with objects', modules:['sim-gestaltschliessen'] },
  KF024: { category:'exekutive_funktionen', de:'Erfassen und logisches Verknüpfen von Alltagssituationen', ru:'Понимание и логическое связывание бытовых ситуаций', en:'Grasping and logically linking everyday situations', modules:['plan-geschichten'] },
  KF025: { category:'exekutive_funktionen', de:'Erkennen von Mustern und Zusammenhängen', ru:'Распознавание закономерностей и взаимосвязей', en:'Recognition of patterns and relationships', modules:['plan-geschichten'] },
  KF026: { category:'raeumlich', de:'Erkennen von Teil-Ganzes-Beziehungen', ru:'Распознавание отношений «часть – целое»', en:'Recognition of part-whole relationships', modules:['sim-dreiecke'] },
  KF027: { category:'sonstige', de:'Erzählfähigkeit', ru:'Нарративные способности (умение рассказывать)', en:'Narrative ability', modules:['lern-storycubes'] },
  KF028: { category:'exekutive_funktionen', de:'Flexibilität', ru:'Гибкость', en:'Flexibility', modules:['lern-atlantis','plan-muster','plan-sudoku','sim-konzeptbildung','sim-tangram'] },
  KF029: { category:'exekutive_funktionen', de:'Flexibilität im Denken', ru:'Гибкость мышления', en:'Cognitive flexibility', modules:['sim-konzeptbildung','sim-tangram'] },
  KF030: { category:'exekutive_funktionen', de:'Flexibilität im sprachlichen Denken', ru:'Гибкость вербального мышления', en:'Flexibility in verbal thinking', modules:['wiss-teekesselchen'] },
  KF031: { category:'motorik', de:'Flüssige Bewegungsfähigkeit der Hand', ru:'Плавность движений руки', en:'Fluent hand movement', modules:['seq-handbewegungen'] },
  KF032: { category:'aufmerksamkeit_konzentration', de:'Fokussierung', ru:'Сосредоточенность', en:'Focusing', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio','seq-handbewegungen','sim-konzeptbildung'] },
  KF033: { category:'aufmerksamkeit_konzentration', de:'Fokussierung auf bedeutungsrelevante Merkmale', ru:'Сосредоточение на значимых признаках', en:'Focusing on meaning-relevant features', modules:['sim-konzeptbildung'] },
  KF034: { category:'aufmerksamkeit_konzentration', de:'Fokussierung der Aufmerksamkeit', ru:'Сосредоточение внимания', en:'Focusing of attention', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio'] },
  KF035: { category:'sonstige', de:'Formerkennung und -kombination', ru:'Распознавание и комбинирование форм', en:'Shape recognition and combination', modules:['sim-tangram'] },
  KF036: { category:'abstraktion', de:'Fähigkeit zur Klassifikation', ru:'Способность к классификации', en:'Classification ability', modules:['sim-konzeptbildung'] },
  KF037: { category:'sonstige', de:'Fähigkeit zur Rhythmisierung', ru:'Способность к ритмизации', en:'Rhythmization ability', modules:['seq-rhythmus','seq-zahlenfolgen-audio'] },
  KF038: { category:'sonstige', de:'Fähigkeit zur mentalen Vervollständigung', ru:'Способность к мысленному достраиванию (гештальт-завершению)', en:'Mental completion (closure) ability', modules:['sim-gestaltschliessen'] },
  KF039: { category:'selbstregulation', de:'Geläufigkeit im Umgang mit Zahlen', ru:'Беглость обращения с числами', en:'Number fluency', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio'] },
  KF040: { category:'exekutive_funktionen', de:'Induktives und deduktives Denken', ru:'Индуктивное и дедуктивное мышление', en:'Inductive and deductive reasoning', modules:['plan-geschichten'] },
  KF041: { category:'exekutive_funktionen', de:'Induktives/Logisches Denken', ru:'Индуктивное/логическое мышление', en:'Inductive/logical reasoning', modules:['sim-konzeptbildung','plan-sudoku'] },
  KF042: { category:'auditive_wahrnehmung', de:'Intermodalität: Hören-Sehen-Bewegen', ru:'Интермодальность: слух – зрение – движение', en:'Intermodality: hearing-seeing-moving', modules:['seq-rhythmus'] },
  KF043: { category:'abstraktion', de:'Kategorisierungsfähigkeit', ru:'Способность к категоризации', en:'Categorization ability', modules:['wiss-oberbegriffe'] },
  KF044: { category:'exekutive_funktionen', de:'Kombinatorische Fähigkeiten', ru:'Комбинаторные способности', en:'Combinatorial abilities', modules:['plan-sudoku'] },
  KF045: { category:'aufmerksamkeit_konzentration', de:'Konzentration', ru:'Концентрация', en:'Concentration', modules:['sim-bausteine','sim-gestaltschliessen','plan-muster','plan-sudoku','seq-koffer-packen','wiss-wortschatz','wiss-raetsel'] },
  KF046: { category:'aufmerksamkeit_konzentration', de:'Konzentration und Aufmerksamkeit', ru:'Концентрация и внимание', en:'Concentration and attention', modules:['sim-rover','lern-memory'] },
  KF047: { category:'aufmerksamkeit_konzentration', de:'Konzentration über längere Zeit', ru:'Длительная концентрация', en:'Sustained concentration', modules:['sim-suchbild'] },
  KF048: { category:'aufmerksamkeit_konzentration', de:'Konzentrationsfähigkeit', ru:'Способность к концентрации', en:'Ability to concentrate', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio','seq-wortreihe','seq-handbewegungen','seq-koffer-packen','sim-suchbild','lern-atlantis','lern-memory','plan-muster','plan-sudoku','seq-wortreihe-audio','seq-koffer-packen-audio'] },
  KF049: { category:'sonstige', de:'Kreativität', ru:'Креативность', en:'Creativity', modules:['lern-storycubes'] },
  KF050: { category:'sprache', de:'Lexikalisches Wissen', ru:'Лексические знания', en:'Lexical knowledge', modules:['wiss-wortschatz','wiss-oberbegriffe'] },
  KF051: { category:'exekutive_funktionen', de:'Logisches Denken', ru:'Логическое мышление', en:'Logical reasoning', modules:['sim-konzeptbildung','plan-sudoku','sim-rover'] },
  KF052: { category:'raeumlich', de:'Mentale Rotationsfähigkeit', ru:'Способность к мысленному вращению', en:'Mental rotation ability', modules:['sim-bausteine'] },
  KF053: { category:'exekutive_funktionen', de:'Merkstrategien', ru:'Мнемонические стратегии', en:'Memorization strategies', modules:['lern-symbole','lern-memory','seq-koffer-packen','lern-atlantis','seq-koffer-packen-audio'] },
  KF054: { category:'motorik', de:'Motorische Fähigkeiten der Hand', ru:'Моторные навыки руки', en:'Manual motor skills', modules:['seq-handbewegungen','plan-zaubertricks'] },
  KF055: { category:'motorik', de:'Motorische Umsetzung', ru:'Моторная реализация', en:'Motor execution', modules:['seq-rhythmus','plan-zaubertricks'] },
  KF056: { category:'visuelle_wahrnehmung', de:'Okularleistungen: Fixieren', ru:'Окуломоторные функции: фиксация', en:'Oculomotor functions: fixation', modules:['seq-wortreihe'] },
  KF057: { category:'exekutive_funktionen', de:'Planungsfähigkeit', ru:'Способность к планированию', en:'Planning ability', modules:['sim-rover','plan-geschichten','plan-zaubertricks'] },
  KF058: { category:'exekutive_funktionen', de:'Planungsfähigkeit und Strategieentwicklung', ru:'Планирование и разработка стратегий', en:'Planning and strategy development', modules:['sim-rover','plan-geschichten','plan-zaubertricks','lern-symbole'] },
  KF059: { category:'sonstige', de:'Reproduktion eines Modells', ru:'Воспроизведение образца', en:'Reproduction of a model', modules:['seq-handbewegungen'] },
  KF060: { category:'sonstige', de:'Rhythmische Fähigkeiten', ru:'Ритмические способности', en:'Rhythmic abilities', modules:['seq-handbewegungen'] },
  KF061: { category:'sonstige', de:'Rhythmisches Gefühl', ru:'Чувство ритма', en:'Sense of rhythm', modules:['seq-rhythmus'] },
  KF062: { category:'gedaechtnis', de:'Räumliches Gedächtnis', ru:'Пространственная память', en:'Spatial memory', modules:['lern-memory'] },
  KF063: { category:'raeumlich', de:'Räumliches Vorstellungsvermögen', ru:'Пространственное воображение', en:'Spatial visualization', modules:['sim-rover','sim-dreiecke','sim-bausteine','sim-tangram'] },
  KF064: { category:'gedaechtnis', de:'Sequentielles Gedächtnis', ru:'Память на последовательности', en:'Sequential memory', modules:['plan-zaubertricks','seq-wortreihe','seq-koffer-packen','seq-wortreihe-audio','seq-koffer-packen-audio'] },
  KF065: { category:'sonstige', de:'Seriation', ru:'Сериация', en:'Seriation', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio','seq-koffer-packen','plan-geschichten','seq-koffer-packen-audio'] },
  KF066: { category:'sonstige', de:'Seriation (Reihenfolge einhalten)', ru:'Сериация (соблюдение порядка)', en:'Seriation (maintaining order)', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio'] },
  KF067: { category:'sprache', de:'Sprachentwicklung', ru:'Речевое развитие', en:'Language development', modules:['wiss-wortschatz'] },
  KF068: { category:'sprache', de:'Sprachlicher Ausdruck', ru:'Речевое выражение', en:'Verbal expression', modules:['lern-storycubes'] },
  KF069: { category:'sprache', de:'Sprachliches Denken', ru:'Вербальное мышление', en:'Verbal thinking', modules:['wiss-teekesselchen'] },
  KF070: { category:'sprache', de:'Sprachverständnis', ru:'Понимание речи', en:'Language comprehension', modules:['wiss-wortschatz','wiss-sachwissen','wiss-raetsel','wiss-oberbegriffe'] },
  KF071: { category:'exekutive_funktionen', de:'Strategie der Merkmalserkennung', ru:'Стратегия распознавания признаков', en:'Feature recognition strategy', modules:['sim-gesichter'] },
  KF072: { category:'exekutive_funktionen', de:'Strategisches Vorgehen', ru:'Стратегический подход', en:'Strategic approach', modules:['sim-tangram','lern-memory'] },
  KF073: { category:'belastbarkeit_ausdauer', de:'Stressresistenz', ru:'Стрессоустойчивость', en:'Stress resistance', modules:['lern-atlantis','seq-wortreihe','seq-wortreihe-audio'] },
  KF074: { category:'exekutive_funktionen', de:'Systematisches Absuchen', ru:'Систематический визуальный поиск', en:'Systematic scanning', modules:['sim-suchbild'] },
  KF075: { category:'exekutive_funktionen', de:'Systematisches Vorgehen', ru:'Систематический подход', en:'Systematic approach', modules:['sim-bausteine','plan-sudoku'] },
  KF076: { category:'motorik', de:'Taktil-kinästhetische Anforderungen', ru:'Тактильно-кинестетические требования', en:'Tactile-kinesthetic demands', modules:['seq-handbewegungen'] },
  KF077: { category:'exekutive_funktionen', de:'Verbales Schlussfolgern', ru:'Вербальные умозаключения', en:'Verbal reasoning', modules:['wiss-raetsel'] },
  KF078: { category:'exekutive_funktionen', de:'Verbindungen zwischen Einzelinformationen herstellen', ru:'Установление связей между отдельными сведениями', en:'Linking individual pieces of information', modules:['lern-atlantis'] },
  KF079: { category:'raeumlich', de:'Verständnis von Verdeckung/Verborgenem', ru:'Понимание перекрытия и скрытых объектов', en:'Understanding of occlusion/hidden objects', modules:['sim-bausteine'] },
  KF080: { category:'visuelle_wahrnehmung', de:'Visuell-motorische Koordination', ru:'Зрительно-моторная координация', en:'Visual-motor coordination', modules:['seq-handbewegungen','sim-rover','sim-dreiecke','sim-tangram'] },
  KF081: { category:'visuelle_wahrnehmung', de:'Visuelle Differenzierungsfähigkeit', ru:'Способность к зрительной дифференциации', en:'Visual discrimination ability', modules:['sim-konzeptbildung','lern-atlantis','sim-suchbild'] },
  KF082: { category:'visuelle_wahrnehmung', de:'Visuelle Mustererkennung', ru:'Зрительное распознавание паттернов', en:'Visual pattern recognition', modules:['plan-muster'] },
  KF083: { category:'visuelle_wahrnehmung', de:'Visuelle Wahrnehmung bedeutungshaltiger Reize', ru:'Зрительное восприятие значимых стимулов', en:'Visual perception of meaningful stimuli', modules:['seq-wortreihe','plan-geschichten'] },
  KF084: { category:'visuelle_wahrnehmung', de:'Visuelle Wahrnehmung und Organisation', ru:'Зрительное восприятие и организация', en:'Visual perception and organization', modules:['plan-geschichten','sim-gestaltschliessen'] },
  KF085: { category:'visuelle_wahrnehmung', de:'Visuelles Gedächtnis', ru:'Зрительная память', en:'Visual memory', modules:['sim-gesichter','lern-memory','lern-symbole','lern-storycubes'] },
  KF086: { category:'visuelle_wahrnehmung', de:'Visuelles Kurzzeitgedächtnis', ru:'Зрительная кратковременная память', en:'Visual short-term memory', modules:['seq-zahlenfolgen','seq-wortreihe','seq-koffer-packen','seq-handbewegungen','lern-atlantis','lern-memory','sim-gesichter'] },
  KF087: { category:'visuelle_wahrnehmung', de:'Visuelles und auditives Kurzzeitgedächtnis', ru:'Зрительная и слуховая кратковременная память', en:'Visual and auditory short-term memory', modules:[] },
  KF088: { category:'exekutive_funktionen', de:'Wahrnehmungsgebundenes logisches Schlussfolgern', ru:'Логические умозаключения на перцептивной основе', en:'Perception-based logical reasoning', modules:['sim-rover'] },
  KF089: { category:'sprache', de:'Wortschatzbreite', ru:'Широта словарного запаса', en:'Breadth of vocabulary', modules:['wiss-teekesselchen'] },
};

export function getFactorsByModule(moduleId) {
  const r = [];
  for (const [id, f] of Object.entries(cognitiveFactors)) {
    if (f.modules.includes(moduleId)) r.push({id, ...f});
  }
  return r;
}

export function aggregateFactorScores(scoresByModule) {
  const fs = {};
  for (const [fid, f] of Object.entries(cognitiveFactors)) {
    let acc = 0, cnt = 0;
    for (const mid of f.modules) {
      if (scoresByModule[mid]) { acc += scoresByModule[mid].accuracy||0; cnt++; }
    }
    fs[fid] = {...f, testedModules:cnt, totalModules:f.modules.length, accuracy:cnt>0?Math.min(100, Math.round(acc/cnt)):null};
  }
  return fs;
}
