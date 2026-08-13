/**
 * IndexedDB persistence layer
 * Stores: scores (per module), history (per round), settings (kv)
 */
const DB = 'logik-trainer', V = 1;

function open() {
  return new Promise((ok, fail) => {
    const r = indexedDB.open(DB, V);
    r.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('scores'))
        db.createObjectStore('scores', { keyPath: 'moduleId' });
      if (!db.objectStoreNames.contains('history')) {
        const h = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        h.createIndex('moduleId', 'moduleId', { unique: false });
        h.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('settings'))
        db.createObjectStore('settings', { keyPath: 'key' });
    };
    r.onsuccess = e => ok(e.target.result);
    r.onerror = e => fail(e.target.error);
  });
}

export async function saveScore(rec) {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('scores', 'readwrite');
    tx.objectStore('scores').put({ ...rec, updated: Date.now() });
    tx.oncomplete = ok; tx.onerror = e => fail(e.target.error);
  });
}

/**
 * Fortschritt eines Moduls fortschreiben.
 *
 * Es gibt zwei Bewertungsarten, die vorher in denselben Feldern lagen und
 * sich dadurch gegenseitig zerstört haben:
 *   kind 'count'   – Übungsspiele: score = richtig, total = beantwortet.
 *   kind 'percent' – adaptive Tests: Prozentwert aus der Score-Map (bis 150),
 *                    plus erreichtes Niveau.
 *
 * `accuracy` ist das eine Feld (0–100), auf das Statistik und Radar zugreifen.
 * Der Rohwert bleibt in `bestPercent` erhalten, damit ein 150%-Ergebnis nicht
 * verlorengeht, nur weil die Anzeige bei 100 deckelt.
 *
 * @param {object} delta { kind, addScore, addTotal, percent, level }
 */
export async function recordProgress(moduleId, scale, delta) {
  const prev = await loadScore(moduleId);
  const kind = delta.kind || 'count';
  const base = (prev && prev.kind === kind) ? prev : null;

  const rec = {
    moduleId, scale, kind,
    cumScore: base ? base.cumScore || 0 : 0,
    cumTotal: base ? base.cumTotal || 0 : 0,
    bestPercent: base ? base.bestPercent || 0 : 0,
    lastPercent: base ? base.lastPercent || 0 : 0,
    bestLevel: base ? base.bestLevel || 0 : 0,
    rounds: base ? (base.rounds || 0) : 0
  };

  if (kind === 'percent') {
    rec.lastPercent = delta.percent || 0;
    rec.bestPercent = Math.max(rec.bestPercent, delta.percent || 0);
    rec.bestLevel = Math.max(rec.bestLevel, delta.level || 0);
    rec.accuracy = clamp(rec.bestPercent);
  } else {
    rec.cumScore += delta.addScore || 0;
    rec.cumTotal += delta.addTotal || 0;
    rec.accuracy = rec.cumTotal > 0 ? clamp(Math.round(rec.cumScore / rec.cumTotal * 100)) : 0;
  }
  rec.rounds += 1;

  // Für die bestehende Anzeige „score/total"
  rec.score = kind === 'percent' ? rec.bestPercent : Math.round(rec.cumScore);
  rec.total = kind === 'percent' ? 100 : rec.cumTotal;

  await saveScore(rec);
  return rec;
}

function clamp(n) { return Math.max(0, Math.min(100, Number(n) || 0)); }

/** Alte Datensätze konnten accuracy > 100 enthalten – beim Lesen begrenzen. */
function normalize(r) {
  if (!r) return r;
  return { ...r, accuracy: clamp(r.accuracy) };
}

export async function loadAllScores() {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('scores', 'readonly');
    const r = tx.objectStore('scores').getAll();
    r.onsuccess = () => ok((r.result || []).map(normalize));
    r.onerror = e => fail(e.target.error);
  });
}

export async function loadScore(moduleId) {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('scores', 'readonly');
    const r = tx.objectStore('scores').get(moduleId);
    r.onsuccess = () => ok(r.result ? normalize(r.result) : null);
    r.onerror = e => fail(e.target.error);
  });
}

export async function saveHistory(moduleId, scale, round, score, total, correct, kind = 'count', sessionId = 0) {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('history', 'readwrite');
    tx.objectStore('history').add({
      // sessionId hält zusammen, was in einem Durchgang entstanden ist.
      // Ohne sie ließe sich später nicht mehr sagen, welche Antworten zu
      // welchem Sitzungsverlauf gehören – und genau daraus liest man ab,
      // ob die Leistung bis zum Schluss hält.
      moduleId, scale, round, score, total, correct, kind, sessionId,
      timestamp: Date.now(),
      dateStr: new Date().toISOString().split('T')[0]
    });
    tx.oncomplete = ok; tx.onerror = e => fail(e.target.error);
  });
}

export async function loadAllHistory(limit = 500) {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('history', 'readonly');
    const r = tx.objectStore('history').getAll(null, limit);
    r.onsuccess = () => { const a = r.result || []; a.sort((x, y) => y.timestamp - x.timestamp); ok(a); };
    r.onerror = e => fail(e.target.error);
  });
}

export async function saveSetting(key, value) {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('settings', 'readwrite');
    tx.objectStore('settings').put({ key, value, updated: Date.now() });
    tx.oncomplete = ok; tx.onerror = e => fail(e.target.error);
  });
}

export async function loadSetting(key, def = null) {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('settings', 'readonly');
    const r = tx.objectStore('settings').get(key);
    r.onsuccess = () => ok(r.result ? r.result.value : def);
    r.onerror = e => fail(e.target.error);
  });
}

/**
 * Alle Fortschrittsdaten löschen: Spielstände und Verlauf.
 *
 * Einstellungen bleiben absichtlich stehen – Sprache und Tempo sind keine
 * Ergebnisse, und wer seine Statistik zurücksetzt, will nicht auch noch die
 * Oberfläche neu einstellen müssen. Für das vollständige Leeren gibt es
 * clearAll().
 *
 * @returns {Promise<{scores:number, history:number}>} Anzahl gelöschter Einträge
 */
export async function resetProgress() {
  const db = await open();
  const [scores, history] = await Promise.all([loadAllScores(), loadAllHistory(100000)]);
  await new Promise((ok, fail) => {
    const tx = db.transaction(['scores', 'history'], 'readwrite');
    tx.objectStore('scores').clear();
    tx.objectStore('history').clear();
    tx.oncomplete = ok; tx.onerror = e => fail(e.target.error);
  });
  return { scores: scores.length, history: history.length };
}

export async function clearAll() {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction(['scores', 'history', 'settings'], 'readwrite');
    tx.objectStore('scores').clear();
    tx.objectStore('history').clear();
    tx.objectStore('settings').clear();
    tx.oncomplete = ok; tx.onerror = e => fail(e.target.error);
  });
}

export async function exportAll() {
  const db = await open();
  const [scores, history, settings] = await Promise.all([
    loadAllScores(),
    loadAllHistory(10000),
    new Promise((ok, fail) => {
      const tx = db.transaction('settings', 'readonly');
      const r = tx.objectStore('settings').getAll();
      r.onsuccess = () => ok(r.result || []);
      r.onerror = e => fail(e.target.error);
    })
  ]);
  return { version: 1, exported: new Date().toISOString(), scores, history, settings };
}

export async function importAll(data) {
  if (!data || data.version !== 1) throw new Error('Invalid format');
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction(['scores', 'history', 'settings'], 'readwrite');
    for (const s of (data.scores || [])) tx.objectStore('scores').put(s);
    for (const h of (data.history || [])) tx.objectStore('history').add(h);
    for (const s of (data.settings || [])) tx.objectStore('settings').put(s);
    tx.oncomplete = ok; tx.onerror = e => fail(e.target.error);
  });
}
