/**
 * Mini-App-Framework – gemeinsame Laufzeit für alle Ideen-Apps unter apps/.
 *
 * Jede Mini-App erbt dieselben Bausteine, damit sie einzeln oder gemeinsam in
 * eine Seite eingebunden werden können:
 *
 *   - Shell         Titel, Anweisungsbereich, Hilfe (aufklappbar), Einstellungen
 *   - Canvas        Zeichenfläche (SVG oder HTML), Sprites, Zeiger-Normalisierung
 *   - Interaktion   Tippen (tap) und Ziehen (drag) über Pointer-Events, mit Schwelle
 *   - Einstellungen Schema-basiert, je App und global, in localStorage
 *   - Auswertung    score/level/versuche + Ergebnisseite
 *
 * Vertrag einer App (wie src/games, aber eigenständig):
 *   init(state)      Zustand aufbauen
 *   render(state)    HTML/SVG-String für die Zeichenfläche
 *   dispose(state)   Timer/Listener abräumen
 *   actions          { name(state, ...args) } – Aufruf über dispatch()
 *   evaluate(state)  optional { correct, levelUp } je Zug/Runde
 */

const GLOBAL_SETTINGS = {
  sprache:     { def: 'de', kind: 'select', options: ['de', 'ru', 'en'], label: { de: 'Sprache', ru: 'Язык', en: 'Language' } },
  bildGroesse: { def: 1, min: 0.75, max: 2, step: 0.25, label: { de: 'Bildgröße', ru: 'Размер', en: 'Size' } },
  ton:         { def: 1, min: 0, max: 1, step: 1, bool: true, label: { de: 'Ton', ru: 'Звук', en: 'Sound' } },
};

/** localStorage, keyed pro App. */
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

/** Mehrsprachiger Text. */
function pick(obj, fallback = '') {
  if (!obj) return fallback;
  if (typeof obj === 'string') return obj;
  const l = localStorage.getItem('miniapp-lang') || 'de';
  return obj[l] || obj.de || fallback;
}
/** Einfache SVG-Bausteine (Sprites). */
export const svg = {
  el(tag, attrs = {}, inner = '') {
    const a = Object.entries(attrs)
      .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`).join(' ');
    return `<${tag} ${a}>${inner}</${tag}>`;
  },
  rect(x, y, w, h, fill, extra = {}) { return svg.el('rect', { x, y, width: w, height: h, fill, rx: extra.rx ?? 2, ...extra }); },
  circle(cx, cy, r, fill, extra = {}) { return svg.el('circle', { cx, cy, r, fill, ...extra }); },
  text(x, y, s, extra = {}) { return svg.el('text', { x, y, ...extra }, s); },
  group(inner, extra = {}) { return svg.el('g', extra, inner); },
};

export class MiniApp {
  /**
   * @param {object} cfg
   *   id, titel {de,ru,en}, anweisung {de,ru,en}, hilfe {de,ru,en}
   *   settingsSchema  { key: {def,min,max,step,bool?,label:{de,ru,en},hint?} }
   *   init/render/dispose/actions/evaluate
   *   auswertung  'zuege' | 'punkte'  (was die Ergebniszeile zeigt)
   */
  constructor(cfg) {
    this.cfg = cfg;
    this.id = cfg.id;
    this.state = null;
    this.settings = this._initSettings();
    this.root = null;
    this.helpOpen = false;
    this.settingsOpen = false;
    this._drag = null;
  }

  _initSettings() {
    const appKey = `miniapp-${this.id}-settings`;
    const schema = { ...(this.cfg.settingsSchema || {}) };
    const global = load('miniapp-global-settings', {});
    const local = load(appKey, {});
    const vals = {};
    for (const [k, s] of Object.entries(schema)) {
      vals[k] = local[k] ?? s.def;
    }
    for (const [k, s] of Object.entries(GLOBAL_SETTINGS)) {
      schema[k] = s;
      vals[k] = global[k] ?? s.def;
    }
    this._schema = schema;
    this._appKey = appKey;
    return vals;
  }

  get(key) { return this.settings[key] ?? this._schema[key]?.def; }

  set(key, val) {
    this.settings[key] = val;
    const appKey = `miniapp-${this.id}-settings`;
    const local = load(appKey, {});
    if (key in this.cfg.settingsSchema) { local[key] = val; save(appKey, local); }
    else { const g = load('miniapp-global-settings', {}); g[key] = val; save('miniapp-global-settings', g); }
    // Sprache an pick() durchreichen, damit alle Texte sofort umschalten.
    if (key === 'sprache') localStorage.setItem('miniapp-lang', val);
    this._render();
    if (typeof this.cfg.onSettingsChange === 'function') this.cfg.onSettingsChange(this);
  }

  // ─── Mount ─────────────────────────────────────────────────────────
  mount(root) {
    this.root = root;
    root.classList.add('miniapp');
    this.state = { _startZeit: Date.now() };
    this.cfg.init(this.state, this);
    this._render();
    this._startTicker();
  }

  dispose() {
    this._stopTicker();
    if (typeof this.cfg.dispose === 'function') this.cfg.dispose(this.state);
    this._drag = null;
  }

  /** Zustand neu aufbauen (Neustart). */
  reset() {
    this.state._startZeit = Date.now();
    this.cfg.init(this.state, this);
    this.rerender();
    this._startTicker();
  }

  /** Vergangene Sekunden seit Start/Neustart – für die Ergebnis-Auswertung. */
  elapsedSek() {
    const s = this.state?._startZeit;
    return s ? Math.round((Date.now() - s) / 100) / 10 : 0;
  }

  // ─── Rendering ─────────────────────────────────────────────────────
  _render() {
    const r = this.root;
    const t = this.cfg;
    r.innerHTML = `
      <header class="ma-kopf">
        <h1>${t.icon || ''} ${pick(t.titel)}</h1>
        <div class="ma-tasten">
          <button data-ma="neu" class="ma-btn" title="Neustart">🔁</button>
          <button data-ma="anweisung" class="ma-btn">📖</button>
          <button data-ma="hilfe" class="ma-btn">❓</button>
          <button data-ma="settings" class="ma-btn">⚙️</button>
        </div>
      </header>
      ${t.anweisung ? `<div class="ma-anweisung" data-ma-panel="anweisung" style="display:none">${pick(t.anweisung)}</div>` : ''}
      ${t.hilfe ? `<div class="ma-hilfe" data-ma-panel="hilfe" style="display:none">${pick(t.hilfe)}</div>` : ''}
      <div class="ma-settings" data-ma-panel="settings" style="display:none">${this._settingsHtml()}</div>
      <div class="ma-canvas">${t.render(this.state, this)}</div>
      <div class="ma-ergebnis">${this._ergebnisHtml()}</div>
    `;
    // Knöpfe verdrahten
    r.querySelectorAll('[data-ma]').forEach(b => {
      b.onclick = b.dataset.ma === 'neu' ? (() => this.reset()) : (() => this._toggle(b.dataset.ma));
    });
    // Einstellungs-Eingaben verdrahten (Slider, Checkbox, Select)
    r.querySelectorAll('[data-set]').forEach(inp => {
      const key = inp.dataset.set;
      const s = this._schema[key];
      const onChange = () => {
        if (inp.type === 'checkbox') this.set(key, inp.checked ? 1 : 0);
        else if (inp.tagName === 'SELECT') this.set(key, inp.value);
        else this.set(key, Number(inp.value));
      };
      inp.addEventListener('change', onChange);
      if (inp.type === 'range') inp.addEventListener('input', onChange);
    });
    // Zeiger für Canvas
    const canvas = r.querySelector('.ma-canvas');
    this._bindPointer(canvas);
  }

  /** Nur die Zeichenfläche neu zeichnen – nicht die ganze Shell. */
  rerender() {
    const c = this.root?.querySelector('.ma-canvas');
    if (c) {
      c.innerHTML = this.cfg.render(this.state, this);
      this._bindPointer(c);
    }
    const e = this.root?.querySelector('.ma-ergebnis');
    if (e) e.innerHTML = this._ergebnisHtml();
  }

  _toggle(which) {
    if (which === 'hilfe') { this.helpOpen = !this.helpOpen; this._show(which, this.helpOpen); }
    else if (which === 'settings') { this.settingsOpen = !this.settingsOpen; this._show(which, this.settingsOpen); }
    else { this._show(which, true); }
  }

  _show(which, on) {
    const p = this.root?.querySelector(`[data-ma-panel="${which}"]`);
    if (p) p.style.display = on ? 'block' : 'none';
  }

  _settingsHtml() {
    const rows = Object.entries(this._schema).map(([k, s]) => {
      const v = this.get(k);
      if (s.bool) {
        return `<label class="ma-zeile"><span>${pick(s.label)}</span>
          <input type="checkbox" ${v ? 'checked' : ''} data-set="${k}"></label>`;
      }
      if (s.kind === 'select') {
        const opts = (s.options || []).map(o =>
          `<option value="${o}" ${v === o ? 'selected' : ''}>${o}</option>`).join('');
        return `<label class="ma-zeile"><span>${pick(s.label)}</span>
          <select data-set="${k}">${opts}</select></label>`;
      }
      const stufe = s.step < 1 ? ` step="${s.step}"` : '';
      return `<label class="ma-zeile"><span>${pick(s.label)}</span>
        <input type="range" min="${s.min}" max="${s.max}"${stufe} value="${v}" data-set="${k}">
        <b>${v}${s.unit || ''}</b></label>`;
    }).join('');
    return `<div class="ma-setze">${rows}</div>`;
  }

  // ─── Interaktion ───────────────────────────────────────────────────
  _bindPointer(canvas) {
    if (!canvas) return;
    canvas.onpointerdown = e => this._down(e, canvas);
    canvas.onpointermove = e => this._move(e, canvas);
    canvas.onpointerup = e => this._up(e, canvas);
    canvas.onpointercancel = () => { this._drag = null; };
  }

  /** Pixel- in viewBox-Koordinaten umrechnen, wenn eine SVG im Canvas liegt. */
  _toCanvas(e, canvas) {
    const svgEl = canvas.querySelector('svg');
    if (svgEl && svgEl.viewBox && svgEl.viewBox.baseVal) {
      const r = svgEl.getBoundingClientRect();
      const vb = svgEl.viewBox.baseVal;
      if (r.width && r.height) {
        return [
          (e.clientX - r.left) * (vb.width / r.width),
          (e.clientY - r.top) * (vb.height / r.height),
        ];
      }
    }
    const r = canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  _down(e, canvas) {
    const [x, y] = this._toCanvas(e, canvas);
    this._drag = { x, y, startX: x, startY: y, moved: false };
  }
  _move(e, canvas) {
    if (!this._drag) return;
    const [x, y] = this._toCanvas(e, canvas);
    const dx = x - this._drag.startX, dy = y - this._drag.startY;
    if (Math.hypot(dx, dy) > 8) this._drag.moved = true;
    this._drag.x = x; this._drag.y = y;
    if (this._drag.moved && typeof this.cfg.onDrag === 'function') {
      this.cfg.onDrag(this.state, this._drag.startX, this._drag.startY, x, y, this);
    }
  }
  _up(e, canvas) {
    if (!this._drag) return;
    const wasDrag = this._drag.moved;
    const [x, y] = this._toCanvas(e, canvas);
    if (wasDrag && typeof this.cfg.onDrop === 'function') {
      this.cfg.onDrop(this.state, this._drag.startX, this._drag.startY, x, y, this);
    } else if (typeof this.cfg.onTap === 'function') {
      this.cfg.onTap(this.state, x, y, this);
    }
    this._drag = null;
  }

  /** Action aufrufen und danach neu zeichnen (dispatch-Muster wie src/core). */
  dispatch(action, ...args) {
    const fn = this.cfg.actions?.[action];
    if (typeof fn !== 'function') return;
    const res = fn.call(this.cfg, this.state, ...args, this);
    if (res !== false) this.rerender();
  }

  // ─── Auswertung ────────────────────────────────────────────────────
  _ergebnisHtml() {
    const s = this.state;
    const t = this.cfg;
    if (!s) return '';
    const r = typeof t.evaluate === 'function' ? t.evaluate(s, this) : null;
    if (r && r.fertig) {
      const wert = r.wert !== undefined ? r.wert : '';
      // Ende: nur Erfolgszeichen + Wert (kein Text), wenn gewünscht.
      const text = t.keinErfolgText ? '' : (pick(r.text) || 'Geschafft!');
      return `<div class="ma-result ma-fertig"><div class="ma-ok">✅</div>${text ? text + ' — ' : ''}${wert}</div>`;
    }
    if (typeof t.statusHtml === 'function') return t.statusHtml(s, this);
    if (r && r.text) return `<div class="ma-result">${pick(r.text)}</div>`;
    return '';
  }

  /** Live-Statuszeile (z. B. laufende Uhr), nur wenn statusHtml existiert. */
  _startTicker() {
    this._stopTicker();
    if (typeof this.cfg.statusHtml !== 'function') return;
    this._ticker = setInterval(() => {
      if (this.state?.fertig) { this._stopTicker(); return; }
      const e = this.root?.querySelector('.ma-ergebnis');
      if (e) e.innerHTML = this._ergebnisHtml();
    }, 1000);
    // In jsdom/Node hält das Intervall den Prozess sonst ewig am Leben.
    if (typeof this._ticker?.unref === 'function') this._ticker.unref();
  }

  _stopTicker() {
    if (this._ticker) { clearInterval(this._ticker); this._ticker = null; }
  }
}

/** Nach einem Durchgang eine Ergebnisseite (einheitlich). */
export function resultScreen(app, { text, wert, optimal }) {
  const t = app.cfg;
  return `
    <div class="ma-result ma-fertig">
      <div style="font-size:2.6em">🏁</div>
      <b>${pick(text) || 'Geschafft!'}</b>
      <div>${wert}</div>
      ${optimal ? `<div class="ma-neben">Optimal: ${optimal}</div>` : ''}
      <button class="ma-btn" onclick="window.__maRestart('${app.id}')">🔁 Nochmal</button>
    </div>`;
}
