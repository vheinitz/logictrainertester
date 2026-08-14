/**
 * Plan: was als Nächstes dran ist.
 *
 * Die App hatte alles, was man braucht – Tests, Auswertung, Fördermethoden –
 * aber nichts, was sie verbindet. Wer 29 Module und ein Profil mit 89
 * Faktoren vor sich hat, weiß nicht, womit er anfangen soll. Diese Seite
 * beantwortet genau eine Frage: **was mache ich jetzt?**
 *
 * Sie erfindet dafür nichts hinzu, sondern liest den Stand aus und leitet
 * daraus einen Schritt ab. Der Plan hat vier Zustände, und in jedem gibt es
 * genau eine sinnvolle nächste Handlung:
 *
 *   1. Kein Geburtsjahr      → eintragen, sonst ist nichts einzuordnen
 *   2. Nicht alles getestet  → die nächsten offenen Aufgaben
 *   3. Alles getestet        → die schwächsten Bereiche üben
 *   4. Übungsphase lang genug → erneut testen
 *
 * Warum kein Fortschrittsbalken über allem: der würde nahelegen, es gehe
 * darum, „fertig" zu werden. Es geht darum, an der richtigen Stelle zu üben.
 */
import { modules, getModule, getScale, scales, moduleFreigegeben } from '../data/modules.js';
import { cognitiveFactors, FACTOR_CATEGORIES, aggregateFactorScores } from '../data/cognitive-factors.js';
import { getPerformanceData } from '../data/performance-model.js';
import { methodLinkFor } from '../data/foerderung-links.js';
import { getMethod } from '../data/methods/index.js';
import { alterJahre, alterBekannt } from '../core/norms.js';
import { mittelReihe } from '../core/verlauf.js';
import { sparkline } from './spark.js';
import * as storage from '../core/storage.js';
import { lang, esc } from '../core/html.js';

/** Nach so vielen Wochen lohnt ein zweiter Durchgang. */
export const WIEDERHOLUNG_WOCHEN = 8;
/** Unterhalb dieses Werts gilt ein Faktor als übungsbedürftig. */
export const SCHWACH_UNTER = 60;

const T = {
  titel:      { de: 'Plan', ru: 'План', en: 'Plan' },
  unter:      { de: 'Was als Nächstes dran ist', ru: 'Что делать дальше', en: 'What comes next' },

  schrittJetzt: { de: 'Jetzt', ru: 'Сейчас', en: 'Now' },
  danach:       { de: 'Danach', ru: 'Потом', en: 'After that' },

  alterT: { de: 'Geburtsjahr eintragen', ru: 'Указать год рождения', en: 'Enter the year of birth' },
  alter:  { de: 'Ohne Alter lässt sich kein Ergebnis einordnen – dieselbe Leistung ist mit sechs Jahren stark und mit fünfzehn schwach.',
            ru: 'Без возраста результат не истолковать: одно и то же в шесть лет — сильно, а в пятнадцать — слабо.',
            en: 'Without an age no result can be placed – the same performance is strong at six and weak at fifteen.' },
  alterKnopf: { de: '🎂 Eintragen', ru: '🎂 Указать', en: '🎂 Enter' },

  testT: { de: 'Aufgaben durchgehen', ru: 'Пройти задания', en: 'Work through the tasks' },
  test:  { de: 'Ein Bild entsteht erst, wenn jeder Bereich einmal dran war. Ohne Eile, verteilt über mehrere Tage.',
           ru: 'Картина складывается, только когда каждая область была затронута. Без спешки, за несколько дней.',
           en: 'A picture only emerges once every area has been covered. Without rush, spread over several days.' },
  offen: { de: 'noch offen', ru: 'ещё не пройдено', en: 'still open' },
  erledigt: { de: 'erledigt', ru: 'пройдено', en: 'done' },

  uebenT: { de: 'Diese Bereiche üben', ru: 'Тренировать эти области', en: 'Practise these areas' },
  ueben:  { de: 'Hier lohnt sich Übung am meisten. Wenige Minuten regelmäßig bringen mehr als eine lange Sitzung alle zwei Wochen.',
            ru: 'Здесь занятия дадут больше всего. Несколько минут регулярно полезнее долгого занятия раз в две недели.',
            en: 'Practice pays off most here. A few minutes regularly achieve more than one long session every two weeks.' },
  keineSchwach: { de: 'Zurzeit liegt kein Bereich auffällig zurück. Weiter wie bisher – und in einigen Wochen erneut nachsehen.',
                  ru: 'Сейчас ни одна область заметно не отстаёт. Продолжайте как есть и проверьте снова через несколько недель.',
                  en: 'No area is noticeably behind at the moment. Carry on – and look again in a few weeks.' },

  wiederT: { de: 'Erneut testen', ru: 'Проверить снова', en: 'Test again' },
  wieder:  { de: 'Seit dem letzten Durchgang ist genug Zeit vergangen. Dieselben Aufgaben noch einmal zeigen, was sich bewegt hat.',
             ru: 'С прошлого раза прошло достаточно времени. Те же задания покажут, что изменилось.',
             en: 'Enough time has passed since the last pass. The same tasks will show what has moved.' },
  seit:    { de: 'Letzter Durchgang vor', ru: 'Последний проход', en: 'Last pass' },
  wochen:  { de: 'Wochen', ru: 'нед. назад', en: 'weeks ago' },
  nochWarten: { de: 'Wiederholung sinnvoll in etwa', ru: 'Повтор имеет смысл примерно через', en: 'Repeating makes sense in about' },

  uebungenIn:  { de: 'Übungen in der App', ru: 'Упражнения в приложении', en: 'Exercises in the app' },
  uebungenAlltag: { de: 'Wege für den Alltag', ru: 'Способы для повседневности', en: 'Ways for everyday life' },
  trainiertVon: { de: 'Trainiert wird das mit', ru: 'Тренируется с помощью', en: 'This is trained with' },
  zurueck: { de: '← Zurück', ru: '← Назад', en: '← Back' },
  zumProfil: { de: '🎯 Ganzes Profil', ru: '🎯 Весь профиль', en: '🎯 Full profile' },
  einfuehrung: { de: '📖 So ist es gedacht', ru: '📖 Как это устроено', en: '📖 How this works' },
  vonGetestet: { de: 'von', ru: 'из', en: 'of' },
  quelleEigen: { de: 'eigene Ergänzung, im Skript nicht als Faktor genannt',
                 ru: 'наше дополнение, в методичке как фактор не назван',
                 en: 'our own addition, not named as a factor in the source' }
};
const t = k => { const l = lang(); return T[k][l] || T[k].de; };

/** Karte eines Planschritts. */
function karte(marke, icon, titel, text, inhalt, knopf) {
  return `<div style="background:#fff;border-radius:var(--radius-sm);padding:16px 18px;margin-bottom:14px;
      border-left:4px solid ${marke === 'jetzt' ? 'var(--primary)' : '#DDD9F0'};box-shadow:0 1px 3px rgba(0,0,0,.05)">
    <div style="font-size:.72em;letter-spacing:.08em;text-transform:uppercase;color:var(--text-light)">
      ${marke === 'jetzt' ? t('schrittJetzt') : t('danach')}</div>
    <div style="font-weight:800;font-size:1.1em;margin:2px 0 6px">${icon} ${esc(titel)}</div>
    <p style="line-height:1.6;font-size:.95em">${esc(text)}</p>
    ${inhalt || ''}
    ${knopf || ''}
  </div>`;
}

/** Ein Modul als anklickbare Zeile mit Verlauf. */
function modulZeile(m, history) {
  const titel = (m.title && (m.title[lang()] || m.title.de)) || m.id;
  const reihe = mittelReihe(history, [m.id]);
  return `<div role="button" tabindex="0" onclick="startModule('${m.id}')"
      style="display:flex;align-items:baseline;gap:10px;padding:6px 0;cursor:pointer;
             border-bottom:1px solid #F2F0FA;font-size:.9em">
    <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
      ${m.icon} ${esc(titel)}</span>
    ${reihe.length
      ? `<span style="flex:0 0 auto;display:inline-flex;align-items:baseline">${sparkline(reihe, { titel })}</span>`
      : `<span style="flex:0 0 auto;color:var(--text-light);font-size:.85em">${t('offen')}</span>`}
  </div>`;
}

// ─── Datenlage ────────────────────────────────────────────────────────

/**
 * Stand erheben: was ist getestet, was ist schwach, wie alt ist der letzte
 * Durchgang. Alles aus vorhandenen Daten – der Plan speichert nichts eigenes,
 * sonst liefe er mit der Wirklichkeit auseinander.
 */
async function stand() {
  const scores = await storage.loadAllScores();
  const history = await storage.loadAllHistory(3000);
  const alter = alterJahre();

  const gespielt = new Set(scores.map(s => s.moduleId));
  const verfuegbar = modules.filter(m => moduleFreigegeben(m, alter));
  const offen = verfuegbar.filter(m => !gespielt.has(m.id));

  const byModule = {};
  scores.forEach(s => { byModule[s.moduleId] = s; });
  const faktoren = aggregateFactorScores(byModule);

  const schwach = Object.entries(faktoren)
    .filter(([, f]) => f.accuracy !== null && f.accuracy < SCHWACH_UNTER)
    .sort((a, b) => a[1].accuracy - b[1].accuracy);

  // Ältester der zuletzt gespielten Stände sagt, wie lange der Durchgang her ist
  const zuletzt = scores.length ? Math.max(...scores.map(s => s.updated || 0)) : 0;
  const wochen = zuletzt ? Math.floor((Date.now() - zuletzt) / (7 * 86400000)) : 0;

  return { scores, history, alter, verfuegbar, offen, faktoren, schwach, wochen, zuletzt };
}

// ─── Plan ─────────────────────────────────────────────────────────────

export async function renderPlan(main) {
  let html = `<h2 class="page-title">🗺️ ${t('titel')}</h2>
    <p class="page-subtitle">${esc(t('unter'))}</p>
    <div style="max-width:600px;margin:0 auto">`;

  // Ohne Alter hat nichts anderes Sinn
  if (!alterBekannt()) {
    html += karte('jetzt', '🎂', t('alterT'), t('alter'), '',
      `<div style="margin-top:12px"><button class="btn btn-primary btn-small"
        onclick="navigateTo('settings')">${t('alterKnopf')}</button></div>`);
    html += `</div>`;
    main.innerHTML = html;
    return;
  }

  const s = await stand();

  // Schritt: noch nicht alles getestet
  if (s.offen.length) {
    const naechste = s.offen.slice(0, 5).map(m => modulZeile(m, s.history)).join('');
    const zahl = `<div style="display:flex;gap:16px;margin:10px 0 4px;font-size:.85em;color:var(--text-light)">
        <span><b style="color:var(--primary);font-size:1.3em">${s.verfuegbar.length - s.offen.length}</b>
          ${t('vonGetestet')} ${s.verfuegbar.length} ${t('erledigt')}</span>
      </div>`;
    html += karte('jetzt', '🧪', t('testT'), t('test'), zahl + naechste);
  }

  // Schritt: üben, was zurückliegt
  if (!s.offen.length || s.schwach.length) {
    const marke = s.offen.length ? 'danach' : 'jetzt';
    if (!s.schwach.length) {
      html += karte(marke, '💪', t('uebenT'), t('keineSchwach'));
    } else {
      const liste = s.schwach.slice(0, 5).map(([fid, f]) => {
        const name = f[lang()] || f.de;
        const farbe = f.accuracy < 40 ? 'var(--secondary)' : 'var(--gold)';
        return `<div role="button" tabindex="0" onclick="navigateTo('factor',{factorId:'${fid}'})"
            style="display:flex;align-items:center;gap:10px;padding:7px 0;cursor:pointer;
                   border-bottom:1px solid #F2F0FA;font-size:.92em">
          <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
            ${esc(name)}</span>
          <span style="font-weight:800;color:${farbe}">${f.accuracy}%</span>
          <span style="color:var(--text-light)">›</span>
        </div>`;
      }).join('');
      html += karte(marke, '💪', t('uebenT'), t('ueben'), liste);
    }
  }

  // Schritt: Wiederholung
  if (!s.offen.length) {
    const reif = s.wochen >= WIEDERHOLUNG_WOCHEN;
    const zusatz = reif
      ? `<div style="margin-top:10px;font-size:.85em;color:var(--text-light)">
          ${t('seit')} ${s.wochen} ${t('wochen')}</div>
         <div style="margin-top:10px"><button class="btn btn-primary btn-small"
           onclick="navigateTo('menu')">🧪 ${esc(t('wiederT'))}</button></div>`
      : `<div style="margin-top:10px;font-size:.85em;color:var(--text-light)">
          ${t('nochWarten')} ${Math.max(1, WIEDERHOLUNG_WOCHEN - s.wochen)} ${t('wochen').replace(' назад', '')}</div>`;
    html += karte(reif ? 'jetzt' : 'danach', '🔁', t('wiederT'), t('wieder'), zusatz);
  }

  html += `</div>`;
  main.innerHTML = html;
}

// ─── Einzelner Faktor: womit trainiert man ihn? ───────────────────────

/**
 * Von der Schwäche zur Übung.
 *
 * Bisher endete das Profil bei der Feststellung „Auditives Kurzzeitgedächtnis
 * 38 %". Was man dagegen tut, stand woanders und war nicht verlinkt. Diese
 * Seite schließt die Lücke: die Module, die den Faktor trainieren, und die
 * Alltagswege aus den Fördermethoden.
 */
export async function renderFactor(main) {
  const { engine } = await import('../core/engine.js');
  const fid = engine.gameState && engine.gameState.factorId;
  const f = cognitiveFactors[fid];
  if (!f) { renderPlan(main); return; }

  const l = lang();
  const name = f[l] || f.de;
  const kat = FACTOR_CATEGORIES[f.category] || { icon: '📋', de: f.category };
  const history = await storage.loadAllHistory(3000);

  const eigeneModule = (f.modules || []).map(getModule).filter(Boolean);

  // Alltagswege: die Förderpunkte der beteiligten Module, die auf eine
  // Methodenseite zeigen. Doppelte fallen weg – mehrere Module empfehlen
  // oft dasselbe.
  const methoden = new Map();
  for (const m of eigeneModule) {
    const perf = getPerformanceData(m.id, 'de');
    if (!perf) continue;
    const perfL = getPerformanceData(m.id, l) || perf;
    perf.foerderung.forEach((text, i) => {
      const id = methodLinkFor(text);
      if (id && !methoden.has(id)) methoden.set(id, perfL.foerderung[i] || text);
    });
  }

  const reihe = mittelReihe(history, f.modules || []);

  main.innerHTML = `<h2 class="page-title">${kat.icon} ${esc(name)}</h2>
    <p class="page-subtitle">${esc(kat[l] || kat.de)}</p>

    <div class="training-container"><div class="training-area" style="align-items:stretch;max-width:600px;margin:0 auto">
      ${reihe.length ? `<div style="display:flex;justify-content:center;margin-bottom:16px;font-size:.9em">
        ${sparkline(reihe, { titel: name })}</div>` : ''}

      ${f.quelle === 'eigen' ? `<p style="font-size:.78em;color:var(--text-light);
        margin-bottom:14px;line-height:1.5">ℹ️ ${esc(t('quelleEigen'))}</p>` : ''}

      <h3 class="section-title">🎮 ${t('uebungenIn')}</h3>
      <p style="font-size:.85em;color:var(--text-light);margin-bottom:8px">${esc(t('trainiertVon'))}:</p>
      ${eigeneModule.map(m => modulZeile(m, history)).join('') || '—'}

      ${methoden.size ? `<h3 class="section-title" style="margin-top:22px">🧰 ${t('uebungenAlltag')}</h3>
        <ul style="line-height:2.1;margin-left:18px">
          ${[...methoden].map(([id, text]) => {
            const me = getMethod(id);
            const titel = me ? (me.title[l] || me.title.de) : text;
            return `<li><a href="#" onclick="navigateTo('method',{methodId:'${id}'});return false"
              style="color:var(--primary);font-weight:600;text-decoration:none;
                     border-bottom:1px dotted var(--primary-light)">${esc(titel)} ›</a></li>`;
          }).join('')}
        </ul>` : ''}
    </div></div>
`;
}
