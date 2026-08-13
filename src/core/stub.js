/**
 * Platzhalter für noch nicht implementierte Module.
 * Erfüllt denselben Kontrakt wie ein echtes Spiel, damit die Engine nichts
 * gesondert behandeln muss.
 */
import { lang, pick } from './html.js';

const STUB_UI = {
  bau: { de: 'Dieses Modul ist noch nicht umgesetzt.',
         ru: 'Этот модуль ещё не реализован.',
         en: 'This module is not implemented yet.' }
};

export function createStub(id, note) {
  return {
    scoring: 'count',
    init(gs) { gs.gd = gs.gd || {}; gs.gd._ready = true; return gs; },
    dispose(gs) { if (gs && gs.gd) gs.gd._ready = false; },
    actions: {},
    render() {
      return `<div style="text-align:center;padding:32px 16px">
        <div style="font-size:3em;margin-bottom:8px">🚧</div>
        <p style="font-size:1.15em;font-weight:700">${(STUB_UI.bau[lang()] || STUB_UI.bau.de)}</p>
        ${note ? `<p style="font-size:.9em;color:var(--text-light);max-width:420px;margin:10px auto 0">${pick(note)}</p>` : ''}
        <p style="font-size:.75em;color:var(--text-light);margin-top:10px">${id}</p>
      </div>`;
    }
  };
}
