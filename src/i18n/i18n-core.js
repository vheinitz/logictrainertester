/**
 * Simple i18n – DE/RU
 * Key-value pairs with fallback to German
 */
const i18n = {};

// German
i18n.de = {
  appTitle:'LOGIK-Trainer', appHeader:'🧠 LOGIK-Trainer', back:'← Zurück',
  menuTitle:'🧠 LOGIK-Training',
  menuSubtitle:'Spielerisches Training aller kognitiven Fähigkeiten für Kinder von 3–18 Jahren',
  trainByScale:'📊 Training nach Skalen', allModules:'🎯 Alle Trainings-Module',
  allAges:'Alle Alter', age3to6:'3–6 Jahre', age7to12:'7–12 Jahre', age13to18:'13–18 Jahre',
  allScales:'Alle Skalen', scaleSequential:'🔢 Sequentiell', scaleSimultan:'👁️ Simultan',
  scaleLernen:'🧩 Lernen', scalePlanung:'💡 Planung', scaleWissen:'📚 Wissen',
  noModules:'Keine Module für diesen Filter.',
  modeSelfLabel:'👦 Kind', modeTutorLabel:'👩‍🏫 Tutor', modeMixedLabel:'👨‍👩‍👧 Beide',
  modeSelfDesc:'👦 Selbständig', modeTutorDesc:'👩‍🏫 Mit Tutor', modeMixedDesc:'👨‍👩‍👧 Teilw. mit Tutor',
  footerInfo:'👦 = Kind selbständig | 👩‍🏫 = Mit Tutor | 👨‍👩‍👧 = Teils/teils',
  backToMenu:'← Zurück zum Menü',
  tutorGuideTitle:'👩‍🏫 Anleitung für den Tutor',
  tutorGuideDesc:'Dieses Training wird vom Tutor angeleitet. Die App zeigt Anweisungen – du führst sie mit dem Kind durch.',
  mixedGuideTitle:'👨‍👩‍👧 Hinweis',
  mixedGuideDesc:'Teile kann das Kind selbst machen, für andere wird ein Tutor benötigt.',
  startTraining:'🚀 Training starten', newRound:'🔄 Neue Runde', homeMenu:'🏠 Menü',
  check:'✅ Prüfen',
  statsTitle:'📊 Statistiken & Trainingsverlauf',
  statsEmpty:'Noch keine Daten. Starte ein Training!',
  statsQuestions:'Fragen beantwortet', statsAccuracy:'Richtig', statsModules:'Module gespielt', statsToday:'Heute',
  statsPerModule:'📈 Ergebnisse pro Modul', statsActivity:'📅 Aktivität (letzte 7 Tage)',
  statsUnavailable:'⚠️ Browser-Speicher nicht verfügbar.',
  exportBackup:'💾 Backup exportieren', importBackup:'📥 Backup importieren',
  saved:'💾 Gespeichert',
  correct:'🎉 Richtig!', wrong:'😔 Leider falsch.', correctSuper:'🎉 Super!', wrongRetry:'Nochmal üben!',
  rightBtn:'✅ Richtig!', wrongBtn:'❌ Falsch',
  round:'Runde', points:'Punkte:', moduleLabel:'LOGIK: ', ageLabel:'Alter ',
  infoTab:'📋 Info', infoTabTitle:'📋 Kognitive Faktoren & Förderung',
  infoWhat:'🧠 Was wird trainiert?', infoEinfluesse:'⚡ Einflussfaktoren',
  infoHypothesen:'🔍 Hypothesen zu Stärken/Schwächen', infoFoerderung:'🎯 Fördermöglichkeiten',
  closeInfo:'✕ Schließen',
  
  // Scale descriptions
  scaleDesc_sequential:'Informationen in der richtigen Reihenfolge behalten und wiedergeben.',
  scaleDesc_simultan:'Visuelle Muster und räumliche Zusammenhänge erfassen und verarbeiten.',
  scaleDesc_lernen:'Neue Informationen verknüpfen, speichern und später wieder abrufen.',
  scaleDesc_planung:'Neuartige Probleme durch schlussfolgerndes Denken lösen.',
  scaleDesc_wissen:'Erworbenes Wissen, Wortschatz und Allgemeinbildung anwenden.',

  // Memory
  memoryPairs:'Paare', memoryWin:'Alle Paare gefunden!',
};

// Russian
i18n.ru = {
  appTitle:'ЛОГИК-Тренажёр', appHeader:'🧠 ЛОГИК-Тренажёр', back:'← Назад',
  menuTitle:'🧠 ЛОГИК-Тренировка',
  menuSubtitle:'Игровая тренировка когнитивных способностей для детей 3–18 лет',
  trainByScale:'📊 Тренировка по шкалам', allModules:'🎯 Все модули',
  allAges:'Все возраста', age3to6:'3–6 лет', age7to12:'7–12 лет', age13to18:'13–18 лет',
  allScales:'Все шкалы', scaleSequential:'🔢 Последовательная', scaleSimultan:'👁️ Симультанная',
  scaleLernen:'🧩 Обучение', scalePlanung:'💡 Планирование', scaleWissen:'📚 Знания',
  noModules:'Нет модулей для этого фильтра.',
  modeSelfLabel:'👦 Ребёнок', modeTutorLabel:'👩‍🏫 Наставник', modeMixedLabel:'👨‍👩‍👧 Оба',
  modeSelfDesc:'👦 Самостоятельно', modeTutorDesc:'👩‍🏫 С наставником', modeMixedDesc:'👨‍👩‍👧 Частично с наставником',
  footerInfo:'👦 = Ребёнок самостоятельно | 👩‍🏫 = Нужен наставник | 👨‍👩‍👧 = Частично',
  backToMenu:'← Назад в меню',
  tutorGuideTitle:'👩‍🏫 Инструкция для наставника',
  tutorGuideDesc:'Это упражнение с наставником. Приложение показывает инструкции – вы проводите их с ребёнком.',
  mixedGuideTitle:'👨‍👩‍👧 Примечание',
  mixedGuideDesc:'Частично ребёнок сам, частично с наставником.',
  startTraining:'🚀 Начать тренировку', newRound:'🔄 Новый раунд', homeMenu:'🏠 Меню',
  check:'✅ Проверить',
  statsTitle:'📊 Статистика и история',
  statsEmpty:'Данных пока нет. Начните тренировку!',
  statsQuestions:'Отвечено вопросов', statsAccuracy:'Правильно', statsModules:'Модулей сыграно', statsToday:'Сегодня',
  statsPerModule:'📈 Результаты по модулям', statsActivity:'📅 Активность (7 дней)',
  statsUnavailable:'⚠️ Хранилище браузера недоступно.',
  exportBackup:'💾 Экспорт', importBackup:'📥 Импорт',
  saved:'💾 Сохранено',
  correct:'🎉 Правильно!', wrong:'😔 Неправильно.', correctSuper:'🎉 Отлично!', wrongRetry:'Попробуй ещё!',
  rightBtn:'✅ Правильно!', wrongBtn:'❌ Нет',
  round:'Раунд', points:'Очки:', moduleLabel:'ЛОГИК: ', ageLabel:'Возраст ',
  infoTab:'📋 Инфо', infoTabTitle:'📋 Когнитивные факторы и развитие',
  infoWhat:'🧠 Что тренируется?', infoEinfluesse:'⚡ Факторы влияния',
  infoHypothesen:'🔍 Гипотезы о сильных/слабых сторонах', infoFoerderung:'🎯 Способы развития',
  closeInfo:'✕ Закрыть',

  // Scale descriptions
  scaleDesc_sequential:'Удерживать и воспроизводить информацию в правильной последовательности.',
  scaleDesc_simultan:'Воспринимать и обрабатывать визуальные образы и пространственные связи.',
  scaleDesc_lernen:'Связывать, сохранять и извлекать новую информацию.',
  scaleDesc_planung:'Решать новые задачи с помощью логического мышления.',
  scaleDesc_wissen:'Применять знания, словарный запас и эрудицию.',

  // Memory
  memoryPairs:'Пары', memoryWin:'Все пары найдены!',
};

let currentLang = 'de';

// Load saved language
try {
  const saved = localStorage.getItem('logik-lang');
  if (saved && i18n[saved]) currentLang = saved;
} catch(e) {}

export function t(key, fallback) {
  const lang = i18n[currentLang];
  if (!lang) return fallback || key;
  return lang[key] || fallback || key;
}

export function setLanguage(lang) {
  if (!i18n[lang]) return;
  currentLang = lang;
  try { localStorage.setItem('logik-lang', lang); } catch(e) {}
  // Re-render via engine
  import('../core/engine.js').then(m => m.engine.render());
}

export function getLang() { return currentLang; }

// Global language switcher
window.setLanguage = setLanguage;
