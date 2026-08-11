/**
 * Module Registry – all 26 training modules
 */
export const scales = [
  {id:'sequential', name:'Sequentiell / Kurzzeitgedächtnis (Gsm)', icon:'🔢', color:'sequential',
   kabcSubtests:['Zahlen nachsprechen','Wortreihe','Handbewegungen']},
  {id:'simultan', name:'Simultan / Visuelle Verarbeitung (Gv)', icon:'👁️', color:'simultan',
   kabcSubtests:['Konzeptbildung','Gesichter','Rover','Dreiecke','Bausteine','Gestaltschließen','Muster ergänzen','Geschichten ergänzen']},
  {id:'lernen', name:'Lernen / Langzeitgedächtnis (Glr)', icon:'🧩', color:'lernen',
   kabcSubtests:['Atlantis','Symbole','Atlantis Abruf','Symbole Abruf']},
  {id:'planung', name:'Planung / Fluide Intelligenz (Gf)', icon:'💡', color:'planung',
   kabcSubtests:['Geschichten ergänzen','Muster ergänzen']},
  {id:'wissen', name:'Wissen / Kristalline Fähigkeiten (Gc)', icon:'📚', color:'wissen',
   kabcSubtests:['Wortschatz','Wort- und Sachwissen','Rätsel']}
];

export const modules = [
  {id:'seq-zahlenfolgen',scale:'sequential',title:'Zahlenfolgen merken',icon:'🔢',ages:'4-18',mode:'self',kabcRef:'Zahlen nachsprechen'},
  {id:'seq-wortreihe',scale:'sequential',title:'Wörter-Kette',icon:'🔗',ages:'3-18',mode:'self',kabcRef:'Wortreihe'},
  {id:'seq-handbewegungen',scale:'sequential',title:'Händchen-Folge',icon:'✋',ages:'4-18',mode:'self',kabcRef:'Handbewegungen'},
  {id:'seq-koffer-packen',scale:'sequential',title:'Ich packe meinen Koffer',icon:'🧳',ages:'3-18',mode:'self'},
  {id:'seq-rhythmus',scale:'sequential',title:'Rhythmus-Klopfer',icon:'🥁',ages:'4-18',mode:'self'},
  {id:'sim-konzeptbildung',scale:'simultan',title:'Was passt nicht?',icon:'❓',ages:'3-6',mode:'self',kabcRef:'Konzeptbildung'},
  {id:'sim-gesichter',scale:'simultan',title:'Gesichter-Merkspiel',icon:'😀',ages:'4-18',mode:'self',kabcRef:'Wiedererkennen von Gesichtern'},
  {id:'sim-rover',scale:'simultan',title:'Rover im Labyrinth',icon:'🤖',ages:'6-18',mode:'self',kabcRef:'Rover'},
  {id:'sim-dreiecke',scale:'simultan',title:'Dreiecke legen',icon:'🔺',ages:'3-12',mode:'mixed',kabcRef:'Dreiecke'},
  {id:'sim-bausteine',scale:'simultan',title:'Bausteine zählen',icon:'🧱',ages:'5-18',mode:'self',kabcRef:'Bausteine zählen'},
  {id:'sim-gestaltschliessen',scale:'simultan',title:'Was ist das?',icon:'🧐',ages:'3-18',mode:'self',kabcRef:'Gestaltschließen'},
  {id:'sim-tangram',scale:'simultan',title:'Tangram-Puzzle',icon:'🔷',ages:'6-18',mode:'self'},
  {id:'sim-suchbild',scale:'simultan',title:'Suchbild-Vergleich',icon:'🔍',ages:'4-18',mode:'self'},
  {id:'lern-atlantis',scale:'lernen',title:'Atlantis: Fisch-Namen',icon:'🐠',ages:'3-18',mode:'self',kabcRef:'Atlantis'},
  {id:'lern-symbole',scale:'lernen',title:'Symbole merken',icon:'⭐',ages:'4-18',mode:'self',kabcRef:'Symbole'},
  {id:'lern-memory',scale:'lernen',title:'Memory',icon:'🃏',ages:'3-18',mode:'self'},
  {id:'lern-storycubes',scale:'lernen',title:'Geschichten-Würfel',icon:'🎲',ages:'6-18',mode:'tutor'},
  {id:'plan-geschichten',scale:'planung',title:'Bildergeschichte ordnen',icon:'📖',ages:'7-18',mode:'self',kabcRef:'Geschichten ergänzen'},
  {id:'plan-muster',scale:'planung',title:'Muster fortsetzen',icon:'🔲',ages:'7-18',mode:'self',kabcRef:'Muster ergänzen'},
  {id:'plan-sudoku',scale:'planung',title:'Bilder-Sudoku',icon:'🧮',ages:'8-18',mode:'self'},
  {id:'plan-zaubertricks',scale:'planung',title:'Zaubertrick nachmachen',icon:'🪄',ages:'7-18',mode:'tutor'},
  {id:'wiss-wortschatz',scale:'wissen',title:'Wortschatz-Quiz',icon:'💬',ages:'3-6',mode:'self',kabcRef:'Wortschatz'},
  {id:'wiss-sachwissen',scale:'wissen',title:'Was weißt du?',icon:'🌍',ages:'7-18',mode:'self',kabcRef:'Wort- und Sachwissen'},
  {id:'wiss-raetsel',scale:'wissen',title:'Rätsel-Raten',icon:'🤔',ages:'3-18',mode:'self',kabcRef:'Rätsel'},
  {id:'wiss-oberbegriffe',scale:'wissen',title:'Oberbegriffe finden',icon:'🏷️',ages:'6-18',mode:'self'},
  {id:'wiss-teekesselchen',scale:'wissen',title:'Teekesselchen',icon:'🫖',ages:'6-18',mode:'self'}
];

export function getModule(id) { return modules.find(m => m.id === id); }
export function getScale(id) { return scales.find(s => s.id === id); }
