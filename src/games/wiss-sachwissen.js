import { t } from '../i18n/i18n-core.js';
import { engine } from '../core/engine.js';
import * as storage from '../core/storage.js';

export function init(gs) {
  const gd = gs.gd || {};
  gd.answered = false;
  gs.gd = gd;
  return gs;
}

export function render(gs) {
  const gd = gs.gd;
  if (!gd.answered) {
    return '<p style="font-size:1.4em;text-align:center;padding:40px">🚧 Dieses Spiel-Modul ist in Entwicklung.<br><span style="font-size:.7em;color:var(--text-light)">wiss-sachwissen</span></p>';
  }
  return gd.feedback || '';
}
