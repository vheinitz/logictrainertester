/**
 * View renderer – menu, scale, training, stats
 */
import { t } from '../i18n/i18n-core.js';
import { modules, scales, getModule, getScale } from '../data/modules.js';
import { engine } from '../core/engine.js';
import { getPerformanceData } from '../data/performance-model.js';
import { cognitiveFactors, FACTOR_CATEGORIES, aggregateFactorScores } from '../data/cognitive-factors.js';
import * as storage from '../core/storage.js';
import { lang } from '../core/html.js';
import { progressDots, done as sessionDone } from '../core/session.js';
import { renderMethods, renderMethod } from './methods-view.js';
import { renderSettings } from './settings-view.js';
import { methodLinkFor } from '../data/foerderung-links.js';

/**
 * Modultext aus der i18n-Tabelle.
 *
 * t() gibt den Schlüssel selbst zurück, wenn weder Übersetzung noch ein
 * nichtleerer Fallback existiert – auf dem Startbildschirm stand deshalb
 * wörtlich „mod_seq_zahlenfolgen_desc". Fehlt der Text, ist nichts besser
 * als der Rohschlüssel.
 */
function modI18n(id, suffix, fallback) {
  const key = 'mod_' + id.replace(/-/g, '_') + '_' + suffix;
  const val = t(key, fallback);
  return val === key ? (fallback || '') : val;
}

/**
 * Ein Förderpunkt im Info-Panel. Gibt es dazu eine Methodenseite, wird der
 * Punkt anklickbar – sonst bleibt er einfacher Text. So bricht nichts, solange
 * noch nicht jeder Punkt eine Seite hat.
 */
function foerderPunkt(text) {
  const id = methodLinkFor(text);
  if (!id) return '<li>' + text + '</li>';
  return `<li><a href="#" onclick="navigateTo('method',{methodId:'${id}'});return false"
    style="color:var(--primary);font-weight:600;text-decoration:none;border-bottom:1px dotted var(--primary-light)"
    >${text} ›</a></li>`;
}

export function renderView(view) {
  const m = document.getElementById('mainContent');
  switch (view) {
    case 'menu': renderMenu(m); break;
    case 'scale': renderScaleView(m); break;
    case 'training': renderTraining(m); break;
    case 'stats': renderStats(m); break;
    case 'radar': renderRadar(m); break;
    case 'methods': renderMethods(m); break;
    case 'method': renderMethod(m); break;
    case 'insights': renderInsights(m); break;
    case 'settings': renderSettings(m); break;
    default: renderMenu(m);
  }
}

function renderMenu(main) {
  // Eine Rückmeldung zum Zurücksetzen gehört zu genau einem Besuch der
  // Statistik – beim Weg über das Menü ist sie erledigt.
  resetState = null;
  const ag = engine.ageFilter, sc = engine.scaleFilter;

  // Scale cards
  const scalesHtml = scales.map(s => {
    const count = modules.filter(m => m.scale === s.id).length;
    return `<div class="card card-scale-${s.color}" role="button" tabindex="0" onclick="navigateTo('scale',{scaleId:'${s.id}'})">
      <div class="card-icon">${s.icon}</div>
      <div class="card-title">${s.name}</div>
      <div class="card-desc">${t('scaleDesc_'+s.id, '')}</div>
      <div class="card-badges">
        <span class="badge badge-age">${count} ${t('statsModules')}</span>
      </div>
    </div>`;
  }).join('');

  // Filter modules
  const visible = modules.filter(m => {
    if (ag && ag !== 'all') {
      const [lo,hi] = ag.split('-').map(Number);
      const [mlo,mhi] = m.ages.split('-').map(Number);
      if (mlo > hi || mhi < lo) return false;
    }
    if (sc && sc !== 'all' && m.scale !== sc) return false;
    return true;
  });

  const modHtml = visible.map(m => {
    const title = modI18n(m.id, 'title', m.title);
    const desc = modI18n(m.id, 'desc', '');
    const ml = t(m.mode === 'self' ? 'modeSelfLabel' : m.mode === 'tutor' ? 'modeTutorLabel' : 'modeMixedLabel');
    return `<div class="card card-scale-${m.scale}" role="button" tabindex="0" onclick="startModule('${m.id}')">
      <div class="card-icon">${m.icon}</div>
      <div class="card-title">${title}</div>
      <div class="card-desc">${desc}</div>
      <div class="card-badges">
        <span class="badge badge-age">${t('ageLabel')}${m.ages}</span>
        <span class="badge badge-mode-${m.mode}">${ml}</span>
        ${m.kabcRef ? `<span class="badge" style="background:#FFF0F8;color:#C44D9A">${t('moduleLabel')}${m.kabcRef}</span>` : ''}
      </div>
    </div>`;
  }).join('');

  main.innerHTML = `<h2 class="page-title">${t('menuTitle')}</h2>
    <p class="page-subtitle">${t('menuSubtitle')}</p>
    <div style="text-align:center;margin-bottom:20px">
      <button class="btn btn-accent btn-small" onclick="navigateTo('stats')">📊 ${t('statsTitle')}</button>
      <button class="btn btn-accent btn-small" onclick="navigateTo('radar')" style="background:var(--pink)">🎯 Kognitives Profil</button>
      <button class="btn btn-accent btn-small" onclick="navigateTo('methods')" style="background:var(--orange)">🧰 Fördermethoden</button>
      <button class="btn btn-accent btn-small" onclick="navigateTo('settings')" style="background:var(--text-light)">⚙️ Einstellungen</button>
    </div>
    <h3 class="section-title">${t('trainByScale')}</h3>
    <div class="card-grid">${scalesHtml}</div>
    <h3 class="section-title">${t('allModules')} (${visible.length})</h3>
    <div class="tabs" id="ageTabs">
      <button class="tab${!ag||ag==='all'?' active':''}" onclick="window._setFilter('all',this)">${t('allAges')}</button>
      <button class="tab${ag==='3-6'?' active':''}" onclick="window._setFilter('3-6',this)">${t('age3to6')}</button>
      <button class="tab${ag==='7-12'?' active':''}" onclick="window._setFilter('7-12',this)">${t('age7to12')}</button>
      <button class="tab${ag==='13-18'?' active':''}" onclick="window._setFilter('13-18',this)">${t('age13to18')}</button>
    </div>
    <div class="card-grid">${modHtml || `<p style="text-align:center;color:var(--text-light);grid-column:1/-1">${t('noModules')}</p>`}</div>
    <p style="text-align:center;color:var(--text-light);font-size:.72em;margin-top:28px;opacity:.7">
      Build ${buildId()}
    </p>`;
}

/**
 * Build-Kennung aus dem ?v= des Script-Tags.
 *
 * Sie macht von außen erkennbar, welcher Stand tatsächlich im Browser läuft –
 * ohne das war nach einem Rebuild nicht unterscheidbar, ob ein Fehler noch im
 * Code steckt oder der Browser bloß die alte Datei aus dem Cache zeigt.
 */
function buildId() {
  const s = document.querySelector('script[src*="logik-trainer"]');
  const m = s && (s.getAttribute('src') || '').match(/[?&]v=([^&"]+)/);
  return m ? m[1] : 'dev';
}

function renderScaleView(main) {
  const s = getScale(engine.gameState.scaleId);
  if (!s) { engine.navigateTo('menu'); return; }
  const smods = modules.filter(m => m.scale === s.id);
  const modsHtml = smods.map(m => {
    const title = modI18n(m.id, 'title', m.title);
    const desc = modI18n(m.id, 'desc', '');
    const ml = t(m.mode === 'self' ? 'modeSelfLabel' : m.mode === 'tutor' ? 'modeTutorLabel' : 'modeMixedLabel');
    return `<div class="card card-scale-${s.color}" role="button" tabindex="0" onclick="startModule('${m.id}')">
      <div class="card-icon">${m.icon}</div>
      <div class="card-title">${title}</div>
      <div class="card-desc">${desc}</div>
      <div class="card-badges">
        <span class="badge badge-age">${t('ageLabel')}${m.ages}</span>
        <span class="badge badge-mode-${m.mode}">${ml}</span>
      </div>
    </div>`;
  }).join('');
  main.innerHTML = `<h2 class="page-title">${s.icon} ${s.name}</h2>
    <div class="card-grid">${modsHtml}</div>
    <div style="text-align:center;margin-top:16px">
      <button class="btn btn-secondary" onclick="goBack()">${t('backToMenu')}</button>
    </div>`;
}

function renderTraining(main) {
  const mod = getModule(engine.gameState.moduleId);
  if (!mod) { engine.navigateTo('menu'); return; }
  const gs = engine.gameState;
  const ml = t(mod.mode === 'self' ? 'modeSelfDesc' : mod.mode === 'tutor' ? 'modeTutorDesc' : 'modeMixedDesc');
  const title = modI18n(mod.id, 'title', mod.title);

  const header = `<div class="training-header">
    <span class="icon">${mod.icon}</span>
    <div><h2>${title}</h2>
    <div class="meta">${ml} | ${t('ageLabel')}${mod.ages}${mod.kabcRef ? ' | '+t('moduleLabel')+mod.kabcRef : ''}</div>
    </div></div>`;

  if (gs.step === 'intro') renderIntro(main, mod, header);
  else renderGameScreen(main, mod, header);
}

/**
 * Oberflächentexte für Startbildschirm und Schwerpunkte-Ansicht.
 * Wenige Begriffe, die nur hier gebraucht werden – daneben statt in der
 * zentralen i18n-Tabelle, wo sie schwerer zu finden wären.
 */
const INTRO_UI = {
  schwerpunkte: { de: 'Schwerpunkte & Trainingswege', ru: 'Что тренируется и как' },
  zurueck:      { de: '← Zurück zur Aufgabe', ru: '← Назад к заданию' },
  wege:         { de: 'Trainingswege im Alltag', ru: 'Как тренировать в жизни' },
  wegeHinweis:  { de: 'Tippe einen Punkt an – dahinter steht eine Anleitung mit Material und Links.',
                  ru: 'Нажмите на пункт — за ним инструкция с материалами и ссылками.' },
  alleMethoden: { de: 'Alle Methoden', ru: 'Все методы' }
};
const iu = k => { const l = lang(); return INTRO_UI[k][l] || INTRO_UI[k].de; };

/** Texte für das Zurücksetzen der Fortschrittsdaten. */
const RESET_UI = {
  knopf:    { de: '🗑️ Fortschritt zurücksetzen', ru: '🗑️ Сбросить результаты' },
  frage:    { de: 'Wirklich alle Ergebnisse löschen?', ru: 'Точно удалить все результаты?' },
  was:      { de: 'Gelöscht werden alle Spielstände und der ganze Verlauf – für jedes Modul und damit auch das kognitive Profil. Das lässt sich nicht rückgängig machen.',
              ru: 'Будут удалены все результаты и вся история — по каждому модулю, а значит и когнитивный профиль. Отменить это будет нельзя.' },
  bleibt:   { de: 'Sprache und Tempo-Einstellung bleiben erhalten.',
              ru: 'Язык и настройка темпа сохранятся.' },
  sichern:  { de: 'Vorher sichern', ru: 'Сначала сохранить' },
  loeschen: { de: 'Ja, löschen', ru: 'Да, удалить' },
  abbruch:  { de: 'Abbrechen', ru: 'Отмена' },
  fertig:   { de: 'Alle Ergebnisse wurden gelöscht.', ru: 'Все результаты удалены.' }
};
const ru_ = k => { const l = lang(); return RESET_UI[k][l] || RESET_UI[k].de; };

/** Zustand der Sicherheitsabfrage: null | 'frage' | 'fertig' */
let resetState = null;

/**
 * Zurücksetzen-Bereich für Statistik und Profil.
 *
 * Bewusst zweistufig statt eines einzelnen Knopfes: Löschen ist endgültig,
 * und ein Fehlgriff kostet den gesamten Verlauf eines Kindes. Die Abfrage
 * benennt darum genau, was verschwindet und was bleibt, und bietet das
 * Sichern gleich daneben an.
 */
function resetPanel() {
  if (resetState === 'fertig') {
    return `<div class="feedback-banner feedback-correct" style="margin-top:20px">
      ✅ ${ru_('fertig')}</div>`;
  }
  if (resetState !== 'frage') {
    return `<div style="margin-top:20px">
      <button class="btn btn-secondary btn-small" onclick="window._askReset()">${ru_('knopf')}</button>
    </div>`;
  }
  return `<div style="margin-top:20px;background:#FFF0F0;border:2px solid var(--secondary);
       border-radius:var(--radius-sm);padding:16px 18px;max-width:520px;text-align:left">
    <div style="font-weight:800;color:#C92A2A;margin-bottom:6px">⚠️ ${ru_('frage')}</div>
    <p style="font-size:.92em;line-height:1.6">${ru_('was')}</p>
    <p style="font-size:.85em;color:var(--text-light);margin-top:6px">${ru_('bleibt')}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
      <button class="btn btn-secondary btn-small" onclick="window._exportData()">💾 ${ru_('sichern')}</button>
      <button class="btn btn-small" style="background:var(--secondary);color:#fff"
              onclick="window._doReset()">${ru_('loeschen')}</button>
      <button class="btn btn-secondary btn-small" onclick="window._cancelReset()">${ru_('abbruch')}</button>
    </div>
  </div>`;
}

/**
 * Startbildschirm eines Moduls: groß und deutlich nur das, was zum Loslegen
 * nötig ist – Aufgabe, Durchführung, Hinweise für die Begleitperson.
 *
 * Alles Erklärende (was der Test misst, Einflüsse, Hypothesen, Förderwege)
 * liegt hinter einem Symbol auf einer eigenen Seite. Vorher stand es als
 * langes Panel unter dem Startknopf: wer mit einem Kind vor dem Gerät sitzt,
 * scrollt daran vorbei, und es lenkt vom eigentlichen Start ab.
 */
async function renderIntro(main, mod, header) {
  const desc = modI18n(mod.id, 'desc', '');
  const l = document.documentElement.lang || 'de';
  const perf = getPerformanceData(mod.id, l);

  let game = null;
  try { game = await engine.ensureGame(mod.id); } catch (e) { /* Stub o. ä. */ }

  let body = '<div style="width:100%;max-width:560px;text-align:center">';

  // Aufgabe: die Anleitung des Moduls, groß gesetzt
  if (game && game.instruction) {
    body += `<p data-role="instruction" style="font-size:1.22em;line-height:1.6;margin:4px 0 18px">
      ${game.instruction}</p>`;
  } else if (desc) {
    body += `<p data-role="instruction" style="font-size:1.22em;line-height:1.6;margin:4px 0 18px">${desc}</p>`;
  }
  if (game && game.instruction && desc) {
    body += `<p style="color:var(--text-light);line-height:1.6;margin-bottom:18px">${desc}</p>`;
  }

  // Hinweise für die Begleitperson – bei Tutor-Modulen der wichtigste Teil
  if (mod.mode === 'tutor') {
    body += `<div class="tutor-guide" style="text-align:left;max-width:none">
      <h3>${t('tutorGuideTitle')}</h3><p>${t('tutorGuideDesc')}</p></div>`;
  } else if (mod.mode === 'mixed') {
    body += `<div class="tutor-guide" style="text-align:left;max-width:none">
      <h3>${t('mixedGuideTitle')}</h3><p>${t('mixedGuideDesc')}</p></div>`;
  }

  body += `<button class="btn btn-primary" style="font-size:1.1em;padding:14px 36px;margin-top:8px"
    onclick="window._startGame()">${t('startTraining')}</button>`;

  // Erklärendes hinter einem Symbol
  if (perf) {
    body += `<div style="margin-top:22px">
      <a href="#" class="info-link" onclick="navigateTo('insights',{moduleId:'${mod.id}',step:'intro'});return false">
        🎯 ${iu('schwerpunkte')} ›</a></div>`;
  }

  body += '</div>';
  main.innerHTML = `<div class="training-container">${header}<div class="training-area">${body}</div></div>`;
}

/**
 * Was der Test misst und wie man es im Alltag trainiert – eigene Seite,
 * erreichbar über das Symbol auf dem Startbildschirm.
 */
function renderInsights(main) {
  const mod = getModule(engine.gameState.moduleId);
  if (!mod) { engine.navigateTo('menu'); return; }
  const l = document.documentElement.lang || 'de';
  const perf = getPerformanceData(mod.id, l);
  const title = modI18n(mod.id, 'title', mod.title);

  let html = `<div class="training-container">
    <div class="training-header">
      <span class="icon">${mod.icon}</span>
      <div><h2>${title}</h2>
      <div class="meta">🎯 ${iu('schwerpunkte')}</div></div>
    </div>
    <div style="width:100%">`;

  if (perf) {
    html += `<div class="info-panel" style="max-width:none;margin-top:0">
      <h3>${t('infoTabTitle')} – ${perf.subtestRef}</h3>
      <h4>${t('infoWhat')}</h4><p style="font-size:.95em;line-height:1.6">${perf.whatItMeasures}</p>
      <h4>${t('infoEinfluesse')}</h4><ul>${perf.einfluesse.map(e => '<li>' + e + '</li>').join('')}</ul>
      <h4>${t('infoHypothesen')}</h4><ul>${perf.hypothesen.map(h => '<li>' + h + '</li>').join('')}</ul>
    </div>

    <h3 class="section-title" style="margin-top:22px">🧰 ${iu('wege')}</h3>
    <p style="color:var(--text-light);font-size:.9em;margin-bottom:10px">${iu('wegeHinweis')}</p>
    <ul style="line-height:2.1;margin-left:18px">${perf.foerderung.map(foerderPunkt).join('')}</ul>`;
  }

  html += `</div></div>
    <div style="text-align:center;margin-top:16px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="goBack()">${iu('zurueck')}</button>
      <button class="btn btn-secondary" onclick="navigateTo('methods')">🧰 ${iu('alleMethoden')}</button>
    </div>`;

  main.innerHTML = html;
}


async function renderGameScreen(main, mod, header) {
  const gs = engine.gameState;
  let game;
  try {
    game = await engine.ensureGame(mod.id);
  } catch (e) {
    main.innerHTML = `<div class="training-container">${header}<div class="training-area">
      <p>⚠️ Spiel-Modul "${mod.id}" wird noch entwickelt.</p>
      <button class="btn btn-secondary" onclick="navigateTo('menu')">${t('homeMenu')}</button>
    </div></div>`;
    return;
  }

  // Spiele initialisieren sich nicht mehr implizit im render(); dispose()
  // setzt _ready zurück, damit ein erneuter Einstieg sauber neu startet.
  if (!gs.gd || !gs.gd._ready) {
    try { game.init(gs); } catch (e) { console.error('[game init] ' + mod.id, e); }
  }

  let gameHtml;
  try { gameHtml = game.render(gs); }
  catch (e) {
    console.error('[game render] ' + mod.id, e);
    gameHtml = `<p>⚠️ Fehler im Spielmodul – bitte zurück zum Menü.</p>`;
  }

  // Minimal-Hülle: die adaptiven Tests zeigen im Spiel nur die Aufgabe.
  // Kopfzeile, Punktestand und Rundenknöpfe würden nur ablenken – und eine
  // sichtbare Niveauanzeige macht aus dem Test einen Wettbewerb.
  const minimal = game.chrome === 'minimal';

  // Am Ende eines Durchgangs führt die Ergebnisseite selbst weiter – die
  // Rundenknöpfe darunter wären eine zweite, widersprüchliche Navigation.
  const bottom = (minimal || game.scoring === 'percent') ? '' : `<div id="roundButtons" style="margin-top:16px">
    <button class="btn btn-secondary btn-small" onclick="window._startGame()">${t('newRound')}</button>
    <button class="btn btn-secondary btn-small" onclick="navigateTo('menu')">${t('homeMenu')}</button>
  </div>`;

  main.innerHTML = `<div class="training-container">
    ${minimal ? '' : header}
    <div class="training-area">
      <div id="gameProgress" style="display:flex;justify-content:center;margin-bottom:14px">${progressDots(gs)}</div>
      ${minimal ? '' : `<div class="score-display" id="gameScore">${scoreLineHtml()}</div>`}
      <div id="gameArea" style="width:100%;display:flex;flex-direction:column;align-items:center">${gameHtml}</div>
      ${bottom}
    </div></div>`;

  autoPersist();
}

/** Score-Zeile – für adaptive Tests Niveau/Prozent, sonst richtig/beantwortet. */
function scoreLineHtml() {
  const gs = engine.gameState;
  const g = engine.activeGame;
  if (g && g.mod.scoring === 'percent') {
    const lvl = gs.level || 0;
    return `<span class="stars">${'⭐'.repeat(Math.max(0, Math.min(lvl - 1, 10)))}</span>
      <span class="count">Niveau ${lvl || '–'} • Bewertung ${gs.percent || 0}%</span>`;
  }
  const score = Math.round((gs.score || 0) * 10) / 10;
  return `<span class="stars">${'⭐'.repeat(Math.min(Math.floor(gs.score || 0), 10))}</span>
    <span class="count">Richtig ${score}/${gs.total || 0}</span>`;
}

/**
 * Rahmen auffrischen: Fortschrittspunkte und – falls vorhanden – Punktestand.
 * Wird nach jedem renderGame() aufgerufen. Beides liegt außerhalb von
 * #gameArea, damit kein Modul es selbst zeichnen muss.
 */
export function updateScoreLine() {
  const el = document.getElementById('gameScore');
  if (el) el.innerHTML = scoreLineHtml();
  const p = document.getElementById('gameProgress');
  if (p) p.innerHTML = progressDots(engine.gameState);

  // Am Ende eines Durchgangs führt die Ergebnisseite selbst weiter – die
  // Rundenknöpfe darunter wären eine zweite, widersprüchliche Navigation.
  // Der Rahmen wird beim Rundenende nicht neu gebaut, deshalb hier.
  const rb = document.getElementById('roundButtons');
  if (rb) rb.style.display = sessionDone(engine.gameState) ? 'none' : '';
}

// ===== Stats view =====
async function renderStats(main) {
  let html = `<h2 class="page-title">${t('statsTitle')}</h2>`;
  try {
    const scores = await storage.loadAllScores();
    const history = await storage.loadAllHistory(200);
    if (!scores.length && !history.length) {
      html += `<div class="training-container"><div class="training-area"><p>${t('statsEmpty')}</p>${resetState ? resetPanel() : ''}</div></div>`;
    } else {
      // Trefferquote nur aus Übungsspielen – die adaptiven Tests schreiben
      // Prozentwerte, die hier sonst als „100% richtig" durchschlagen würden.
      const counted = history.filter(h => h.kind !== 'percent');
      const answered = counted.reduce((s,h) => s + (h.total || 0), 0);
      const correct = counted.reduce((s,h) => s + (h.score || 0), 0);
      const acc = answered ? Math.round(correct/answered*100) : 0;
      const today = new Date().toISOString().split('T')[0];
      const todayCount = history.filter(h => h.dateStr === today).length;
      html += `<div class="training-container"><div class="training-area">
        <div style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center;margin-bottom:20px">
          <div style="text-align:center;background:var(--bg);padding:16px 24px;border-radius:var(--radius-sm)"><div style="font-size:2em;font-weight:800;color:var(--primary)">${answered}</div><div style="font-size:.85em;color:var(--text-light)">${t('statsQuestions')}</div></div>
          <div style="text-align:center;background:var(--bg);padding:16px 24px;border-radius:var(--radius-sm)"><div style="font-size:2em;font-weight:800;color:var(--green)">${acc}%</div><div style="font-size:.85em;color:var(--text-light)">${t('statsAccuracy')}</div></div>
          <div style="text-align:center;background:var(--bg);padding:16px 24px;border-radius:var(--radius-sm)"><div style="font-size:2em;font-weight:800;color:var(--orange)">${scores.length}</div><div style="font-size:.85em;color:var(--text-light)">${t('statsModules')}</div></div>
          <div style="text-align:center;background:var(--bg);padding:16px 24px;border-radius:var(--radius-sm)"><div style="font-size:2em;font-weight:800;color:var(--accent)">${todayCount}</div><div style="font-size:.85em;color:var(--text-light)">${t('statsToday')}</div></div>
        </div>`;
      // Per module bars
      if (scores.length) {
        html += `<h4 style="margin:16px 0 8px">${t('statsPerModule')}</h4><div style="width:100%;max-width:500px">`;
        scores.sort((a,b) => b.updated - a.updated).forEach(s => {
          const m = getModule(s.moduleId);
          const name = m ? modI18n(m.id, 'title', m.title) : s.moduleId;
          const bar = Math.max(0, Math.min(100, s.accuracy || 0));
          const color = bar >= 80 ? 'var(--green)' : bar >= 50 ? 'var(--gold)' : 'var(--secondary)';
          const detail = s.kind === 'percent'
            ? `Niveau ${s.bestLevel || '–'} • ${s.bestPercent || 0}%`
            : `${Math.round(s.cumScore ?? s.score ?? 0)}/${s.cumTotal ?? s.total ?? 0} (${bar}%)`;
          html += `<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;font-size:.85em"><span>${m?m.icon:''} ${name}</span><span>${detail}</span></div><div style="background:#F0EFF8;border-radius:6px;height:8px"><div style="background:${color};height:100%;width:${bar}%;border-radius:6px"></div></div></div>`;
        });
        html += `</div>`;
      }
      html += `<div style="margin-top:20px"><button class="btn btn-secondary btn-small" onclick="window._exportData()">${t('exportBackup')}</button></div>`;
      html += resetPanel();
      html += `</div></div>`;
    }
  } catch(e) {
    html += `<div class="training-container"><div class="training-area"><p>${t('statsUnavailable')}</p></div></div>`;
  }
  html += `<div style="text-align:center;margin-top:16px"><button class="btn btn-secondary" onclick="goBack()">${t('backToMenu')}</button></div>`;
  main.innerHTML = html;
}

// ===== Persistence =====
/**
 * Merkt sich den zuletzt gespeicherten Stand *pro Modul*. Vorher waren das
 * zwei Modul-Globals, die beim Modulwechsel nie zurückgesetzt wurden – dadurch
 * war das `correct`-Flag in der History teils falsch und der erste Treffer in
 * einem neuen Modul wurde verschluckt.
 */
let _last = { moduleId: null, score: 0, total: 0, percent: 0 };

export function autoPersist() {
  const gs = engine.gameState;
  if (!gs || !gs.moduleId || gs.step !== 'game') return;
  const g = engine.activeGame;
  if (!g) return;
  const kind = g.mod.scoring === 'percent' ? 'percent' : 'count';

  // Neues Modul – oder dasselbe Modul in einer neuen Sitzung (die Zähler
  // starten dann wieder bei 0 und wären sonst für immer „schon gespeichert").
  if (_last.moduleId !== gs.moduleId
      || (gs.total || 0) < _last.total
      || (gs.percent || 0) < _last.percent) {
    _last = { moduleId: gs.moduleId, score: 0, total: 0, percent: 0 };
  }

  const mod = getModule(gs.moduleId);
  const scale = mod ? mod.scale : 'unknown';

  if (kind === 'percent') {
    const percent = gs.percent || 0;
    if (percent <= _last.percent) return;      // nur Verbesserungen schreiben
    _last.percent = percent;
    persist(scale, { kind, percent, level: gs.level || 0 },
            () => storage.saveHistory(gs.moduleId, scale, gs.attempts || 0, percent, 100, true, 'percent'));
  } else {
    const score = gs.score || 0, total = gs.total || 0;
    if (total <= _last.total) return;          // erst zählen, wenn eine Antwort dazukam
    const addScore = score - _last.score;
    const addTotal = total - _last.total;
    const correct = addScore > 0;
    _last.score = score; _last.total = total;
    persist(scale, { kind, addScore, addTotal },
            () => storage.saveHistory(gs.moduleId, scale, total, addScore, addTotal, correct, 'count'));
  }
}

function persist(scale, delta, historyFn) {
  const moduleId = engine.gameState.moduleId;
  setTimeout(async () => {
    try {
      await historyFn();
      await storage.recordProgress(moduleId, scale, delta);
      showSaveIndicator();
    } catch (e) { console.warn('[persist]', e); }
  }, 0);
}

let saveTimer = null;
function showSaveIndicator() {
  let el = document.getElementById('saveIndicator');
  if (!el) {
    el = document.createElement('div');
    el.id = 'saveIndicator';
    el.style.cssText = 'position:fixed;bottom:16px;right:16px;background:var(--green);color:#fff;padding:8px 16px;border-radius:20px;font-weight:700;font-size:.85em;z-index:200;opacity:0;transition:opacity .3s;pointer-events:none';
    el.textContent = t('saved');
    document.body.appendChild(el);
  }
  el.style.opacity = '1';
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { el.style.opacity = '0'; }, 1500);
}

// ===== Global bridges =====
window.startModule = (id) => engine.navigateTo('training', { moduleId: id, step: 'intro', round: 0, score: 0, total: 0 });
window._setFilter = (val, btn) => {
  engine.ageFilter = val;
  document.querySelectorAll('#ageTabs .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  engine.render();
};
window._startGame = () => {
  const gs = engine.gameState;
  const g = engine.activeGame;
  // Laufende Timer des vorigen Durchgangs abräumen, sonst starten zwei
  // Abläufe parallel, sobald jemand „Neue Runde" während einer Aufgabe drückt.
  if (g && typeof g.mod.dispose === 'function') { try { g.mod.dispose(gs); } catch (e) { /* egal */ } }
  gs.step = 'game';
  gs.round = (gs.round || 0) + 1;
  gs.rounds = 0;              // Übungszähler des Durchgangs
  gs.gd = {};
  gs.score = gs.score || 0;
  gs.total = gs.total || 0;
  engine.render();
};

/**
 * Tempo (Sekunden pro Element) setzen – bewusst kein Bedienelement im Spiel.
 * Das Tempo ist eine Voreinstellung der Testleitung, keine Spieloption, und
 * würde als Regler nur den Bildschirm füllen. Von der Konsole aus:
 *   _setTempo('seq-zahlenfolgen', 1.5)
 * Der Wert bleibt in localStorage erhalten.
 */
window._setTempo = (moduleId, val) => {
  const g = engine.activeGame;
  if (g && g.id === moduleId && typeof g.mod.setFactor === 'function') return g.mod.setFactor(val);
  // auch ohne geladenes Modul setzbar
  import('../core/adaptive.js').then(m => m.setFactor(moduleId, val));
};
window._askReset = () => { resetState = 'frage'; engine.render(); };
window._cancelReset = () => { resetState = null; engine.render(); };

/**
 * Löschen ausführen. Danach muss auch der Merker der Persistenz zurück –
 * sonst vergleicht der nächste Spielstand gegen Zahlen, die es nicht mehr gibt,
 * und der erste Treffer nach dem Zurücksetzen ginge verloren.
 */
window._doReset = async () => {
  try {
    const weg = await storage.resetProgress();
    _last = { moduleId: null, score: 0, total: 0, percent: 0 };
    resetState = 'fertig';
    console.info(`[reset] ${weg.scores} Spielstände, ${weg.history} Verlaufseinträge gelöscht`);
  } catch (e) {
    console.error('[reset]', e);
    resetState = null;
  }
  engine.render();
};

window._exportData = async () => {
  try {
    const data = await storage.exportAll();
    const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'logik-backup-'+new Date().toISOString().split('T')[0]+'.json';
    a.click(); URL.revokeObjectURL(url);
  } catch(e) { alert('Export failed: '+e); }
};

// ===== RADAR / KOGNITIVES PROFIL =====
async function renderRadar(main) {
  let html = `<h2 class="page-title">🎯 Kognitives Profil</h2>`;
  
  try {
    const scores = await storage.loadAllScores();
    const scoresByModule = {};
    scores.forEach(s => { scoresByModule[s.moduleId] = s; });
    
    // Aggregate factor scores
    const factorScores = aggregateFactorScores(scoresByModule);
    const factors = Object.entries(factorScores);
    const testedCount = factors.filter(([_,f]) => f.accuracy !== null).length;
    const totalCount = factors.length;
    
    // Group by category
    const byCategory = {};
    for (const [fid, f] of factors) {
      if (!byCategory[f.category]) byCategory[f.category] = [];
      byCategory[f.category].push({id:fid, ...f});
    }
    
    html += `<div class="training-container"><div class="training-area">`;
    html += `<p style="margin-bottom:8px;">${testedCount}/${totalCount} Faktoren getestet • ${scores.length} Module gespielt</p>`;
    
    // ---- Compact category cards ----
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;width:100%;">`;
    
    for (const [catId, catFactors] of Object.entries(byCategory).sort()) {
      const cat = FACTOR_CATEGORIES[catId] || { icon:'📋', de:catId };
      
      // Category header with aggregate
      const testedInCat = catFactors.filter(f => f.accuracy !== null).length;
      const catAcc = testedInCat > 0 
        ? Math.round(catFactors.filter(f=>f.accuracy!==null).reduce((s,f)=>s+f.accuracy,0) / testedInCat)
        : null;
      
      const barColor = catAcc === null ? '#E0DDF5' 
        : catAcc >= 80 ? 'var(--green)' 
        : catAcc >= 50 ? 'var(--gold)' 
        : 'var(--secondary)';
      
      html += `<div style="background:var(--bg);border-radius:var(--radius-sm);padding:12px;">`;
      html += `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">`;
      html += `<span style="font-weight:700;">${cat.icon} ${cat.de}</span>`;
      html += `<span style="font-size:0.85em;color:var(--text-light);">${testedInCat}/${catFactors.length}</span>`;
      html += `</div>`;
      
      // Mini bar for category
      if (catAcc !== null) {
        html += `<div style="background:#F0EFF8;border-radius:4px;height:6px;margin-bottom:8px;">`;
        html += `<div style="background:${barColor};height:100%;width:${catAcc}%;border-radius:4px;"></div></div>`;
      }
      
      // Individual factors
      html += `<div style="font-size:0.8em;">`;
      for (const f of catFactors) {
        const tested = f.accuracy !== null;
        const dot = tested 
          ? (f.accuracy >= 70 ? '🟢' : f.accuracy >= 40 ? '🟡' : '🔴')
          : '⚪';
        const label = tested ? `${f.accuracy}%` : '—';
        html += `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid #F0EFF8;">`;
        html += `<span>${dot} ${f.de}</span>`;
        html += `<span style="font-weight:600;color:${tested?'var(--text)':'var(--text-light)'};">${label}</span>`;
        html += `</div>`;
      }
      html += `</div></div>`;
    }
    
    html += `</div>`;
    
    // Legend
    html += `<div style="margin-top:16px;font-size:0.8em;color:var(--text-light);text-align:center;">`;
    html += `🟢 ≥70% &nbsp; 🟡 40–69% &nbsp; 🔴 <40% &nbsp; ⚪ nicht getestet`;
    html += `</div>`;
    html += resetPanel();
    
    html += `</div></div>`;
  } catch(e) {
    html += `<div class="training-container"><div class="training-area"><p>⚠️ Daten konnten nicht geladen werden.</p></div></div>`;
  }
  
  html += `<div style="text-align:center;margin-top:16px;"><button class="btn btn-secondary" onclick="goBack()">${t('backToMenu')}</button></div>`;
  main.innerHTML = html;
}
