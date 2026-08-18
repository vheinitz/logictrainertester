/**
 * 50 Buch-Ideen: Kreuztabelle App × books_vk.
 */
import { ERWEITERUNGEN, ARTEN } from '../data/buch-erweiterungen.js';
import { esc, lang, pick } from '../core/html.js';

const UI = {
  titel: { de: '50 Ideen aus der Bücherliste', ru: '50 идей из книг', en: '50 ideas from the book list' },
  unter: { de: 'Anregungen, keine abgeschriebenen Aufgaben. Methode oder Alltag, nicht Diagnose.',
           ru: 'Идеи, не списанные задания. Не диагностика.',
           en: 'Prompts, not copied items. Not diagnosis.' },
  buch: { de: 'Buch', ru: 'Книга', en: 'Book' },
  app: { de: 'Hakt an', ru: 'К приложению', en: 'Hooks into' }
};

export function renderIdeen(main) {
  const l = lang();
  const u = k => UI[k][l] || UI[k].de;
  let rows = ERWEITERUNGEN.map(e => {
    const art = ARTEN[e.art] || ARTEN.uebung;
    return `<tr>
      <td class="umbruchfrei">${e.n}</td>
      <td><b>${esc(pick(e.title))}</b><br><span class="nebentext">${esc(pick(e.text))}</span></td>
      <td class="nebentext">${esc(e.buch)}</td>
      <td class="nebentext">${esc(e.app)}</td>
      <td class="umbruchfrei">${esc(art[l] || art.de)}</td>
    </tr>`;
  }).join('');
  main.innerHTML = `<h2 class="page-title">📚 ${u('titel')}</h2>
    <p class="page-subtitle">${u('unter')}</p>
    <table class="sortierbar">
      <thead><tr><th>#</th><th></th><th>${u('buch')}</th><th>${u('app')}</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}
