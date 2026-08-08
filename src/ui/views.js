/**
 * View renderer – menu, scale, training, stats
 */
import { t } from '../i18n/i18n-core.js';
import { modules, scales, getModule, getScale } from '../data/modules.js';
import { engine } from '../core/engine.js';
import { getPerformanceData } from '../data/performance-model.js';
import { cognitiveFactors, FACTOR_CATEGORIES, aggregateFactorScores } from '../data/cognitive-factors.js';
import * as storage from '../core/storage.js';

function modI18n(id, suffix, fallback) {
  return t('mod_' + id.replace(/-/g, '_') + '_' + suffix, fallback);
}

export function renderView(view) {
  const m = document.getElementById('mainContent');
  switch (view) {
    case 'menu': renderMenu(m); break;
    case 'scale': renderScaleView(m); break;
    case 'training': renderTraining(m); break;
    case 'stats': renderStats(m); break;
    case 'radar': renderRadar(m); break;
    default: renderMenu(m);
  }
}

function renderMenu(main) {
  const ag = engine.ageFilter, sc = engine.scaleFilter;

  // Scale cards
  const scalesHtml = scales.map(s => {
    const count = modules.filter(m => m.scale === s.id).length;
    return `<div class="card card-scale-${s.color}" onclick="navigateTo('scale',{scaleId:'${s.id}'})">
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
    return `<div class="card card-scale-${m.scale}" onclick="startModule('${m.id}')">
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
    <div class="card-grid">${modHtml || `<p style="text-align:center;color:var(--text-light);grid-column:1/-1">${t('noModules')}</p>`}</div>`;
}

function renderScaleView(main) {
  const s = getScale(engine.gameState.scaleId);
  if (!s) { engine.navigateTo('menu'); return; }
  const smods = modules.filter(m => m.scale === s.id);
  const modsHtml = smods.map(m => {
    const title = modI18n(m.id, 'title', m.title);
    const desc = modI18n(m.id, 'desc', '');
    const ml = t(m.mode === 'self' ? 'modeSelfLabel' : m.mode === 'tutor' ? 'modeTutorLabel' : 'modeMixedLabel');
    return `<div class="card card-scale-${s.color}" onclick="startModule('${m.id}')">
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

  let header = `<div class="training-header">
    <span class="icon">${mod.icon}</span>
    <div><h2>${title}</h2>
    <div class="meta">${ml} | ${t('ageLabel')}${mod.ages}${mod.kabcRef ? ' | '+t('moduleLabel')+mod.kabcRef : ''}</div>
    </div></div>`;

  if (gs.step === 'intro') {
    const desc = modI18n(mod.id, 'desc', '');
    let body = `<p>${desc}</p>`;
    if (mod.mode === 'tutor') {
      body += `<div class="tutor-guide"><h3>${t('tutorGuideTitle')}</h3><p>${t('tutorGuideDesc')}</p></div>`;
    } else if (mod.mode === 'mixed') {
      body += `<div class="tutor-guide"><h3>${t('mixedGuideTitle')}</h3><p>${t('mixedGuideDesc')}</p></div>`;
    }

    // --- Info panel with cognitive model ---
    const lang = document.documentElement.lang || 'de';
    const perf = getPerformanceData(mod.id, lang);
    if (perf) {
      body += `<div class="info-panel">
        <h3>${t('infoTabTitle')} – ${perf.subtestRef}</h3>
        <h4>${t('infoWhat')}</h4><p style="font-size:.9em">${perf.whatItMeasures}</p>
        <h4>${t('infoEinfluesse')}</h4><ul>${perf.einfluesse.map(e => '<li>'+e+'</li>').join('')}</ul>
        <h4>${t('infoHypothesen')}</h4><ul>${perf.hypothesen.map(h => '<li>'+h+'</li>').join('')}</ul>
        <h4>${t('infoFoerderung')}</h4><ul>${perf.foerderung.map(f => '<li>'+f+'</li>').join('')}</ul>
      </div>`;
    }

    body += `<button class="btn btn-primary" onclick="window._startGame()">${t('startTraining')}</button>`;
    main.innerHTML = `<div class="training-container">${header}<div class="training-area">${body}</div></div>`;
  } else {
    // Game is running – dynamically import the game module
    const gameId = mod.id;
    import(`../games/${gameId}.js`).then(game => {
      const gameHtml = game.render(gs);
      // Adaptive tests (zahlenfolgen) manage their own flow – no "Neue Runde" button
      const isAdaptive = gameId === 'seq-zahlenfolgen';
      const bottomButtons = isAdaptive ? '' : `<div style="margin-top:16px">
        <button class="btn btn-secondary btn-small" onclick="window._startGame()">${t('newRound')}</button>
        <button class="btn btn-secondary btn-small" onclick="navigateTo('menu')">${t('homeMenu')}</button>
      </div>`;
      const fullHtml = `<div class="training-container">${header}<div class="training-area">
        <div class="score-display"><span class="stars">${'⭐'.repeat(Math.min(gs.score||0,10))}</span>
        <span class="count">Runde ${gs.round||1} • Punkte ${gs.score||0}/${gs.total||0}</span></div>
        ${gameHtml}
        ${bottomButtons}
      </div></div>`;
      main.innerHTML = fullHtml;

      // Auto-persist after render
      autoPersist();
    }).catch(() => {
      main.innerHTML = `<div class="training-container">${header}<div class="training-area">
        <p>⚠️ Spiel-Modul "${gameId}" wird noch entwickelt.</p>
        <button class="btn btn-secondary" onclick="navigateTo('menu')">${t('homeMenu')}</button>
      </div></div>`;
    });
  }
}

// ===== Stats view =====
async function renderStats(main) {
  let html = `<h2 class="page-title">${t('statsTitle')}</h2>`;
  try {
    const scores = await storage.loadAllScores();
    const history = await storage.loadAllHistory(200);
    if (!scores.length && !history.length) {
      html += `<div class="training-container"><div class="training-area"><p>${t('statsEmpty')}</p></div></div>`;
    } else {
      const answered = history.length;
      const correct = history.filter(h => h.correct).length;
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
          const bar = s.accuracy || 0;
          const color = bar >= 80 ? 'var(--green)' : bar >= 50 ? 'var(--gold)' : 'var(--secondary)';
          html += `<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;font-size:.85em"><span>${m?m.icon:''} ${name}</span><span>${s.score}/${s.total} (${bar}%)</span></div><div style="background:#F0EFF8;border-radius:6px;height:8px"><div style="background:${color};height:100%;width:${bar}%;border-radius:6px"></div></div></div>`;
        });
        html += `</div>`;
      }
      html += `<div style="margin-top:20px"><button class="btn btn-secondary btn-small" onclick="window._exportData()">${t('exportBackup')}</button></div>`;
      html += `</div></div>`;
    }
  } catch(e) {
    html += `<div class="training-container"><div class="training-area"><p>${t('statsUnavailable')}</p></div></div>`;
  }
  html += `<div style="text-align:center;margin-top:16px"><button class="btn btn-secondary" onclick="goBack()">${t('backToMenu')}</button></div>`;
  main.innerHTML = html;
}

// ===== Persistence =====
let _lastScore = -1, _lastTotal = -1;

function autoPersist() {
  const gs = engine.gameState;
  if (!gs || !gs.moduleId || gs.step !== 'game') return;
  if (gs.score === _lastScore && gs.total === _lastTotal) return;
  const correct = gs.score > _lastScore;
  _lastScore = gs.score; _lastTotal = gs.total;
  setTimeout(async () => {
    const mod = getModule(gs.moduleId);
    const scale = mod ? mod.scale : 'unknown';
    try {
      // Cap score at 100% and compute average with existing
      const cappedScore = Math.min(gs.score || 0, 100);
      const cappedTotal = Math.min(gs.total || 0, 100);
      
      // Load existing score and compute AVG
      const existing = await storage.loadScore(gs.moduleId);
      let finalScore = cappedScore;
      let finalTotal = cappedTotal;
      let finalRound = gs.round || 1;
      if (existing && existing.total > 0) {
        finalScore = Math.round((existing.score + cappedScore) / 2);
        finalTotal = Math.max(existing.total, cappedTotal);
        finalRound = existing.round + 1;
      }
      
      await storage.saveHistory(gs.moduleId, scale, gs.round, cappedScore, cappedTotal, correct);
      await storage.saveScore(gs.moduleId, scale, finalScore, finalTotal, finalRound);
      showSaveIndicator();
    } catch(e) {}
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
  gs.step = 'game';
  gs.round = (gs.round || 0) + 1;
  gs.score = gs.score || 0;
  gs.total = gs.total || 0;
  if (!gs.gd) gs.gd = {};
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
    
    html += `</div></div>`;
  } catch(e) {
    html += `<div class="training-container"><div class="training-area"><p>⚠️ Daten konnten nicht geladen werden.</p></div></div>`;
  }
  
  html += `<div style="text-align:center;margin-top:16px;"><button class="btn btn-secondary" onclick="goBack()">${t('backToMenu')}</button></div>`;
  main.innerHTML = html;
}
