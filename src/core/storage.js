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

export async function saveScore(moduleId, scale, score, total, round) {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('scores', 'readwrite');
    tx.objectStore('scores').put({
      moduleId, scale, score, total, round,
      accuracy: total > 0 ? Math.round(score / total * 100) : 0,
      updated: Date.now()
    });
    tx.oncomplete = ok; tx.onerror = e => fail(e.target.error);
  });
}

export async function loadAllScores() {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('scores', 'readonly');
    const r = tx.objectStore('scores').getAll();
    r.onsuccess = () => ok(r.result || []);
    r.onerror = e => fail(e.target.error);
  });
}

export async function loadScore(moduleId) {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('scores', 'readonly');
    const r = tx.objectStore('scores').get(moduleId);
    r.onsuccess = () => ok(r.result || null);
    r.onerror = e => fail(e.target.error);
  });
}

export async function saveHistory(moduleId, scale, round, score, total, correct) {
  const db = await open();
  return new Promise((ok, fail) => {
    const tx = db.transaction('history', 'readwrite');
    tx.objectStore('history').add({
      moduleId, scale, round, score, total, correct,
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
