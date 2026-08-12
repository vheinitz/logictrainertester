/**
 * Kognitives Faktoren-Modell – 89 Fähigkeiten in 14 Kategorien
 * Master-Liste aus cognitive_competences.txt
 * Jeder Faktor hat eine Liste von trainierenden Test-Modulen
 */

export const FACTOR_CATEGORIES = {
  auditive_wahrnehmung: { de:"Auditive Wahrnehmung", ru:"Слуховое восприятие", icon:"👂" },
  visuelle_wahrnehmung: { de:"Visuelle Wahrnehmung", ru:"Зрительное восприятие", icon:"👁️" },
  gedaechtnis: { de:"Gedächtnis", ru:"Память", icon:"🧠" },
  aufmerksamkeit_konzentration: { de:"Aufmerksamkeit & Konzentration", ru:"Внимание и концентрация", icon:"🎯" },
  exekutive_funktionen: { de:"Exekutive Funktionen", ru:"Управляющие функции", icon:"💡" },
  motorik: { de:"Motorik", ru:"Моторика", icon:"🖐️" },
  sprache: { de:"Sprache", ru:"Речь", icon:"💬" },
  belastbarkeit_ausdauer: { de:"Belastbarkeit & Ausdauer", ru:"Выносливость", icon:"💪" },
  abstraktion: { de:"Abstraktion & Kategorisierung", ru:"Абстракция и категоризация", icon:"🔮" },
  raeumlich: { de:"Räumliches Denken", ru:"Пространственное мышление", icon:"📐" },
  lernfaehigkeit: { de:"Lernfähigkeit", ru:"Обучаемость", icon:"📖" },
  sozial_kulturell: { de:"Sozial & Kulturell", ru:"Социум и культура", icon:"🌍" },
  selbstregulation: { de:"Selbstregulation", ru:"Саморегуляция", icon:"🧘" },
  sonstige: { de:"Sonstige Faktoren", ru:"Прочие факторы", icon:"📋" },
};

export const cognitiveFactors = {
  KF001: { category:'gedaechtnis', de:'Abrufbarkeit des Wortspeichers', ru:'', modules:['wiss-wortschatz'] },
  KF002: { category:'abstraktion', de:'Abstraktionsvermögen', ru:'', modules:['sim-bausteine','sim-gestaltschliessen','lern-symbole','plan-muster','wiss-oberbegriffe','wiss-teekesselchen'] },
  KF003: { category:'auditive_wahrnehmung', de:'Akustisch-motorisches Gedächtnis', ru:'', modules:['seq-wortreihe'] },
  KF004: { category:'auditive_wahrnehmung', de:'Akustisches Kurzzeitgedächtnis', ru:'', modules:['seq-zahlenfolgen-audio','seq-wortreihe'] },
  KF005: { category:'sozial_kulturell', de:'Allgemeinwissen', ru:'', modules:['wiss-raetsel','wiss-sachwissen'] },
  KF006: { category:'sozial_kulturell', de:'Alltagswissen', ru:'', modules:['plan-geschichten'] },
  KF007: { category:'exekutive_funktionen', de:'Analytisches Denken', ru:'', modules:['plan-muster','plan-sudoku'] },
  KF008: { category:'gedaechtnis', de:'Arbeitsgedächtnis', ru:'', modules:['lern-atlantis'] },
  KF009: { category:'lernfaehigkeit', de:'Assoziative Lernfähigkeit', ru:'', modules:['lern-symbole'] },
  KF010: { category:'auditive_wahrnehmung', de:'Auditive Wahrnehmung', ru:'', modules:['seq-rhythmus','seq-wortreihe'] },
  KF011: { category:'auditive_wahrnehmung', de:'Auditives Kurzzeitgedächtnis', ru:'', modules:['seq-zahlenfolgen-audio','lern-atlantis','seq-koffer-packen','wiss-raetsel','wiss-sachwissen','wiss-wortschatz'] },
  KF012: { category:'aufmerksamkeit_konzentration', de:'Aufmerksamkeit', ru:'', modules:['wiss-sachwissen','sim-gesichter','sim-suchbild'] },
  KF013: { category:'aufmerksamkeit_konzentration', de:'Aufmerksamkeit bei der Darbietung', ru:'', modules:['sim-gesichter'] },
  KF014: { category:'aufmerksamkeit_konzentration', de:'Aufmerksamkeit für Details', ru:'', modules:['sim-gesichter','sim-suchbild'] },
  KF015: { category:'aufmerksamkeit_konzentration', de:'Aufmerksamkeit und Konzentration', ru:'', modules:['lern-symbole','plan-geschichten'] },
  KF016: { category:'aufmerksamkeit_konzentration', de:'Aufmerksamkeitsfokussierung', ru:'', modules:['lern-atlantis'] },
  KF017: { category:'visuelle_wahrnehmung', de:'Augenfolgebewegungen', ru:'', modules:['seq-wortreihe'] },
  KF018: { category:'belastbarkeit_ausdauer', de:'Ausdauer', ru:'', modules:['seq-handbewegungen','sim-konzeptbildung','sim-dreiecke'] },
  KF019: { category:'sozial_kulturell', de:'Bildung und kultureller Hintergrund', ru:'', modules:['wiss-sachwissen'] },
  KF020: { category:'visuelle_wahrnehmung', de:'Detailgenauigkeit der Wahrnehmung', ru:'', modules:['sim-gesichter'] },
  KF021: { category:'belastbarkeit_ausdauer', de:'Durchhaltevermögen', ru:'', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio','lern-atlantis','wiss-sachwissen'] },
  KF022: { category:'exekutive_funktionen', de:'Entscheidungsfähigkeit', ru:'', modules:['wiss-raetsel'] },
  KF023: { category:'sozial_kulturell', de:'Erfahrung mit Objekten', ru:'', modules:['sim-gestaltschliessen'] },
  KF024: { category:'exekutive_funktionen', de:'Erfassen und logisches Verknüpfen von Alltagssituationen', ru:'', modules:['plan-geschichten'] },
  KF025: { category:'exekutive_funktionen', de:'Erkennen von Mustern und Zusammenhängen', ru:'', modules:['plan-geschichten'] },
  KF026: { category:'raeumlich', de:'Erkennen von Teil-Ganzes-Beziehungen', ru:'', modules:['sim-dreiecke'] },
  KF027: { category:'sonstige', de:'Erzählfähigkeit', ru:'', modules:['lern-storycubes'] },
  KF028: { category:'exekutive_funktionen', de:'Flexibilität', ru:'', modules:['lern-atlantis','plan-muster','plan-sudoku','sim-konzeptbildung','sim-tangram'] },
  KF029: { category:'exekutive_funktionen', de:'Flexibilität im Denken', ru:'', modules:['sim-konzeptbildung','sim-tangram'] },
  KF030: { category:'exekutive_funktionen', de:'Flexibilität im sprachlichen Denken', ru:'', modules:['wiss-teekesselchen'] },
  KF031: { category:'motorik', de:'Flüssige Bewegungsfähigkeit der Hand', ru:'', modules:['seq-handbewegungen'] },
  KF032: { category:'aufmerksamkeit_konzentration', de:'Fokussierung', ru:'', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio','seq-handbewegungen','sim-konzeptbildung'] },
  KF033: { category:'aufmerksamkeit_konzentration', de:'Fokussierung auf bedeutungsrelevante Merkmale', ru:'', modules:['sim-konzeptbildung'] },
  KF034: { category:'aufmerksamkeit_konzentration', de:'Fokussierung der Aufmerksamkeit', ru:'', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio'] },
  KF035: { category:'sonstige', de:'Formerkennung und -kombination', ru:'', modules:['sim-tangram'] },
  KF036: { category:'abstraktion', de:'Fähigkeit zur Klassifikation', ru:'', modules:['sim-konzeptbildung'] },
  KF037: { category:'sonstige', de:'Fähigkeit zur Rhythmisierung', ru:'', modules:['seq-rhythmus','seq-zahlenfolgen-audio'] },
  KF038: { category:'sonstige', de:'Fähigkeit zur mentalen Vervollständigung', ru:'', modules:['sim-gestaltschliessen'] },
  KF039: { category:'selbstregulation', de:'Geläufigkeit im Umgang mit Zahlen', ru:'', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio'] },
  KF040: { category:'exekutive_funktionen', de:'Induktives und deduktives Denken', ru:'', modules:['plan-geschichten'] },
  KF041: { category:'exekutive_funktionen', de:'Induktives/Logisches Denken', ru:'', modules:['sim-konzeptbildung','plan-sudoku'] },
  KF042: { category:'auditive_wahrnehmung', de:'Intermodalität: Hören-Sehen-Bewegen', ru:'', modules:['seq-wortreihe'] },
  KF043: { category:'abstraktion', de:'Kategorisierungsfähigkeit', ru:'', modules:['wiss-oberbegriffe'] },
  KF044: { category:'exekutive_funktionen', de:'Kombinatorische Fähigkeiten', ru:'', modules:['plan-sudoku'] },
  KF045: { category:'aufmerksamkeit_konzentration', de:'Konzentration', ru:'', modules:['sim-bausteine','sim-gestaltschliessen','plan-muster','plan-sudoku','seq-koffer-packen','wiss-wortschatz','wiss-raetsel'] },
  KF046: { category:'aufmerksamkeit_konzentration', de:'Konzentration und Aufmerksamkeit', ru:'', modules:['sim-rover','lern-memory'] },
  KF047: { category:'aufmerksamkeit_konzentration', de:'Konzentration über längere Zeit', ru:'', modules:['sim-suchbild'] },
  KF048: { category:'aufmerksamkeit_konzentration', de:'Konzentrationsfähigkeit', ru:'', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio','seq-wortreihe','seq-handbewegungen','seq-koffer-packen','sim-suchbild','lern-atlantis','lern-memory','plan-muster','plan-sudoku'] },
  KF049: { category:'sonstige', de:'Kreativität', ru:'', modules:['lern-storycubes'] },
  KF050: { category:'sprache', de:'Lexikalisches Wissen', ru:'', modules:['wiss-wortschatz','wiss-oberbegriffe'] },
  KF051: { category:'exekutive_funktionen', de:'Logisches Denken', ru:'', modules:['sim-konzeptbildung','plan-sudoku','sim-rover'] },
  KF052: { category:'raeumlich', de:'Mentale Rotationsfähigkeit', ru:'', modules:['sim-bausteine'] },
  KF053: { category:'exekutive_funktionen', de:'Merkstrategien', ru:'', modules:['lern-symbole','lern-memory','seq-koffer-packen','lern-atlantis'] },
  KF054: { category:'motorik', de:'Motorische Fähigkeiten der Hand', ru:'', modules:['seq-handbewegungen','plan-zaubertricks'] },
  KF055: { category:'motorik', de:'Motorische Umsetzung', ru:'', modules:['seq-rhythmus','plan-zaubertricks'] },
  KF056: { category:'visuelle_wahrnehmung', de:'Okularleistungen: Fixieren', ru:'', modules:['seq-wortreihe'] },
  KF057: { category:'exekutive_funktionen', de:'Planungsfähigkeit', ru:'', modules:['sim-rover','plan-geschichten','plan-zaubertricks'] },
  KF058: { category:'exekutive_funktionen', de:'Planungsfähigkeit und Strategieentwicklung', ru:'', modules:['sim-rover','plan-geschichten','plan-zaubertricks','lern-symbole'] },
  KF059: { category:'sonstige', de:'Reproduktion eines Modells', ru:'', modules:['seq-handbewegungen'] },
  KF060: { category:'sonstige', de:'Rhythmische Fähigkeiten', ru:'', modules:['seq-handbewegungen'] },
  KF061: { category:'sonstige', de:'Rhythmisches Gefühl', ru:'', modules:['seq-rhythmus'] },
  KF062: { category:'gedaechtnis', de:'Räumliches Gedächtnis', ru:'', modules:['lern-memory'] },
  KF063: { category:'raeumlich', de:'Räumliches Vorstellungsvermögen', ru:'', modules:['sim-rover','sim-dreiecke','sim-bausteine','sim-tangram'] },
  KF064: { category:'gedaechtnis', de:'Sequentielles Gedächtnis', ru:'', modules:['plan-zaubertricks'] },
  KF065: { category:'sonstige', de:'Seriation', ru:'', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio','seq-koffer-packen','plan-geschichten'] },
  KF066: { category:'sonstige', de:'Seriation (Reihenfolge einhalten)', ru:'', modules:['seq-zahlenfolgen','seq-zahlenfolgen-audio'] },
  KF067: { category:'sprache', de:'Sprachentwicklung', ru:'', modules:['wiss-wortschatz'] },
  KF068: { category:'sprache', de:'Sprachlicher Ausdruck', ru:'', modules:['lern-storycubes'] },
  KF069: { category:'sprache', de:'Sprachliches Denken', ru:'', modules:['wiss-teekesselchen'] },
  KF070: { category:'sprache', de:'Sprachverständnis', ru:'', modules:['wiss-wortschatz','wiss-sachwissen','wiss-raetsel','wiss-oberbegriffe'] },
  KF071: { category:'exekutive_funktionen', de:'Strategie der Merkmalserkennung', ru:'', modules:['sim-gesichter'] },
  KF072: { category:'exekutive_funktionen', de:'Strategisches Vorgehen', ru:'', modules:['sim-tangram','lern-memory'] },
  KF073: { category:'belastbarkeit_ausdauer', de:'Stressresistenz', ru:'', modules:['lern-atlantis','seq-wortreihe'] },
  KF074: { category:'exekutive_funktionen', de:'Systematisches Absuchen', ru:'', modules:['sim-suchbild'] },
  KF075: { category:'exekutive_funktionen', de:'Systematisches Vorgehen', ru:'', modules:['sim-bausteine','plan-sudoku'] },
  KF076: { category:'motorik', de:'Taktil-kinästhetische Anforderungen', ru:'', modules:['seq-handbewegungen'] },
  KF077: { category:'exekutive_funktionen', de:'Verbales Schlussfolgern', ru:'', modules:['wiss-raetsel'] },
  KF078: { category:'exekutive_funktionen', de:'Verbindungen zwischen Einzelinformationen herstellen', ru:'', modules:['lern-atlantis'] },
  KF079: { category:'raeumlich', de:'Verständnis von Verdeckung/Verborgenem', ru:'', modules:['sim-bausteine'] },
  KF080: { category:'visuelle_wahrnehmung', de:'Visuell-motorische Koordination', ru:'', modules:['seq-handbewegungen','sim-rover','sim-dreiecke','sim-tangram'] },
  KF081: { category:'visuelle_wahrnehmung', de:'Visuelle Differenzierungsfähigkeit', ru:'', modules:['sim-konzeptbildung','lern-atlantis','sim-suchbild'] },
  KF082: { category:'visuelle_wahrnehmung', de:'Visuelle Mustererkennung', ru:'', modules:['plan-muster'] },
  KF083: { category:'visuelle_wahrnehmung', de:'Visuelle Wahrnehmung bedeutungshaltiger Reize', ru:'', modules:['seq-wortreihe','plan-geschichten'] },
  KF084: { category:'visuelle_wahrnehmung', de:'Visuelle Wahrnehmung und Organisation', ru:'', modules:['plan-geschichten','sim-gestaltschliessen'] },
  KF085: { category:'visuelle_wahrnehmung', de:'Visuelles Gedächtnis', ru:'', modules:['sim-gesichter','lern-memory','lern-symbole','lern-storycubes'] },
  KF086: { category:'visuelle_wahrnehmung', de:'Visuelles Kurzzeitgedächtnis', ru:'', modules:['seq-zahlenfolgen','seq-handbewegungen','lern-atlantis','lern-memory','sim-gesichter'] },
  KF087: { category:'visuelle_wahrnehmung', de:'Visuelles und auditives Kurzzeitgedächtnis', ru:'', modules:['lern-atlantis'] },
  KF088: { category:'exekutive_funktionen', de:'Wahrnehmungsgebundenes logisches Schlussfolgern', ru:'', modules:['sim-rover'] },
  KF089: { category:'sprache', de:'Wortschatzbreite', ru:'', modules:['wiss-teekesselchen'] },
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