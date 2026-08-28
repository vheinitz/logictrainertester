/**
 * Plan: was als Nächstes dran ist.
 *
 * Die App hatte alles, was man braucht – Aufgaben, Auswertung, Fördermethoden
 * – aber nichts, was sie verbindet. Wer 29 Module und ein Profil mit 89
 * Faktoren vor sich hat, weiß nicht, womit er anfangen soll. Diese Seite
 * beantwortet genau eine Frage: **was mache ich jetzt?**
 *
 * Für wen sie geschrieben ist
 * ───────────────────────────
 * Für Eltern, die ratlos sind. Nicht für Fachleute. Deshalb steht hier keine
 * Faktorenliste an erster Stelle, sondern ein Vorschlag, der sich heute
 * Abend umsetzen lässt: diese vier Aufgaben, ungefähr so lange, und wenn
 * etwas zurückliegt, diese Übung am Küchentisch.
 *
 * Vier Zustände, in jedem genau eine sinnvolle Handlung:
 *
 *   1. Kein Geburtsjahr      → eintragen, sonst ist nichts einzuordnen
 *   2. Nicht alles getestet  → die nächste Sitzung, zeitlich abgesteckt
 *   3. Etwas liegt zurück    → dort üben, zuerst ohne Bildschirm
 *   4. Übungsphase lang genug → dieselben Bereiche erneut messen
 *
 * Warum kein Fortschrittsbalken über allem: der würde nahelegen, es gehe
 * darum, „fertig" zu werden. Es geht darum, an der richtigen Stelle zu üben.
 *
 * Womit gemessen wird
 * ───────────────────
 * Mit dem erreichten Niveau gegen einen Richtwert (core/richtwerte.js), nicht
 * mit der Trefferquote. Die Quote pendelt sich bauartbedingt um die Mitte
 * ein, weil alle Module mitwachsen – sie kann Starke und Schwache gar nicht
 * unterscheiden.
 */
import { modules, getModule, getScale, scales, moduleFreigegeben } from '../data/modules.js';
import { cognitiveFactors, FACTOR_CATEGORIES, aggregateFactorScores } from '../data/cognitive-factors.js';
import { getPerformanceData } from '../data/performance-model.js';
import { methodLinkFor } from '../data/foerderung-links.js';
import { getMethod } from '../data/methods/index.js';
import { alterJahre, alterBekannt } from '../core/norms.js';
import { profil, schwachePunkte, bewerte, herkunftText, STUFEN } from '../core/richtwerte.js';
import { mittelReihe } from '../core/verlauf.js';
import { sparkline } from './spark.js';
import { analogBox, analogZeile } from './analog-box.js';
import * as storage from '../core/storage.js';
import * as settings from '../core/settings.js';
import { lang, esc } from '../core/html.js';

/** Nach so vielen Wochen lohnt ein zweiter Durchgang. */
export const WIEDERHOLUNG_WOCHEN = 8;

/**
 * So lange soll eine Sitzung höchstens dauern.
 *
 * Zwanzig Minuten sind kein Richtwert aus der Literatur, sondern eine
 * Vorsichtsgrenze: was länger dauert, wird abgebrochen oder unter Quengeln
 * zu Ende gebracht – und dann misst man Erschöpfung statt Fähigkeit. Lieber
 * fünf kurze Sitzungen als eine lange.
 */
export const SITZUNG_MINUTEN = 20;

/** Grobe Dauer eines Moduls in Minuten: Übungen mal Zeit pro Übung, plus Anlauf. */
export function minutenFuer(mod) {
  const runden = settings.get('rounds') || 10;
  const proUebung = mod && mod.scale === 'sequential' ? 0.35 : 0.45;
  return Math.max(2, Math.round(runden * proUebung + 1));
}

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

  sitzungT: { de: 'Die nächste Sitzung', ru: 'Следующее занятие', en: 'The next session' },
  sitzung:  { de: 'Diese Aufgaben sind noch offen. Mehr als eine Sitzung am Tag bringt nichts – danach misst man Müdigkeit statt Können.',
              ru: 'Эти задания ещё не пройдены. Больше одного занятия в день не нужно — дальше измеряется усталость, а не способность.',
              en: 'These tasks are still open. More than one session a day achieves nothing – after that you measure tiredness, not ability.' },
  etwa:     { de: 'etwa', ru: 'примерно', en: 'about' },
  minuten:  { de: 'Minuten', ru: 'мин.', en: 'minutes' },
  starten:  { de: '▶ Erste Aufgabe starten', ru: '▶ Начать первое задание', en: '▶ Start the first task' },
  nochOffen:{ de: 'noch offen insgesamt', ru: 'ещё не пройдено всего', en: 'still open in total' },
  offen:    { de: 'noch offen', ru: 'ещё не пройдено', en: 'still open' },
  erledigt: { de: 'erledigt', ru: 'пройдено', en: 'done' },
  vonGetestet: { de: 'von', ru: 'из', en: 'of' },

  uebenT: { de: 'Hier üben', ru: 'Здесь заниматься', en: 'Practise here' },
  ueben:  { de: 'Diese Bereiche liegen hinter dem zurück, was für das Alter zu erwarten wäre. Fang mit dem obersten an – nicht mit allen gleichzeitig.',
            ru: 'Эти области отстают от того, что можно ожидать в этом возрасте. Начните с верхней — не со всех сразу.',
            en: 'These areas lag behind what would be expected at this age. Start with the top one – not with all of them at once.' },
  dosierung: { de: 'Dreimal die Woche zehn Minuten bringt mehr als einmal eine Stunde. Sechs bis acht Wochen dabeibleiben, dann erneut messen.',
               ru: 'Три раза в неделю по десять минут полезнее, чем час раз в неделю. Держитесь шесть-восемь недель, потом измерьте снова.',
               en: 'Ten minutes three times a week does more than one hour once. Keep it up for six to eight weeks, then measure again.' },
  keineSchwach: { de: 'Zurzeit liegt kein Bereich auffällig zurück. Weiter wie bisher – und in einigen Wochen erneut nachsehen.',
                  ru: 'Сейчас ни одна область заметно не отстаёт. Продолжайте как есть и проверьте снова через несколько недель.',
                  en: 'No area is noticeably behind at the moment. Carry on – and look again in a few weeks.' },
  mehrDazu: { de: 'Mehr Wege dazu', ru: 'Другие способы', en: 'More ways to do this' },
  amGeraet: { de: 'Im Notfall auch als Aufgabe in der App', ru: 'В крайнем случае — как задание в приложении', en: 'If need be, also as a task in the app' },

  wiederT: { de: 'Erneut messen', ru: 'Измерить снова', en: 'Measure again' },
  wieder:  { de: 'Seit dem letzten Durchgang ist genug Zeit vergangen. Dieselben Aufgaben zeigen, was sich bewegt hat.',
             ru: 'С прошлого раза прошло достаточно времени. Те же задания покажут, что изменилось.',
             en: 'Enough time has passed since the last pass. The same tasks will show what has moved.' },
  seit:    { de: 'Zuletzt gemessen vor', ru: 'Последнее измерение', en: 'Last measured' },
  wochen:  { de: 'Wochen', ru: 'нед. назад', en: 'weeks ago' },
  nochWarten: { de: 'Sinnvoll wieder in etwa', ru: 'Имеет смысл примерно через', en: 'Makes sense again in about' },
  wochenRein: { de: 'Wochen', ru: 'нед.', en: 'weeks' },

  uebungenIn:  { de: 'Aufgaben in der App', ru: 'Задания в приложении', en: 'Tasks in the app' },
  uebungenAlltag: { de: 'Wege für den Alltag', ru: 'Способы для повседневности', en: 'Ways for everyday life' },
  trainiertVon: { de: 'Trainiert wird das mit', ru: 'Тренируется с помощью', en: 'This is trained with' },
  zumProfil: { de: '🎯 Ganzes Profil', ru: '🎯 Весь профиль', en: '🎯 Full profile' },
  quelleEigen: { de: 'eigene Ergänzung, im Skript nicht als Faktor genannt',
                 ru: 'наше дополнение, в методичке как фактор не назван',
                 en: 'our own addition, not named as a factor in the source' },
  richtwertHinweis: {
    de: 'Richtwert, kein Testergebnis: er sagt, was hier erwartet wurde, nicht wo das Kind im Vergleich zu anderen steht.',
    ru: 'Ориентир, а не результат теста: он говорит, чего здесь ожидали, а не как ребёнок выглядит на фоне других.',
    en: 'A guide value, not a test result: it says what was expected here, not how the child compares with others.'
  }
};
const t = k => { const l = lang(); return T[k][l] || T[k].de; };
const komma = n => String(n).replace('.', ',');

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

const modTitel = m => (m.title && (m.title[lang()] || m.title.de)) || m.id;

/** Ein Modul als anklickbare Zeile mit Verlauf. */
function modulZeile(m, history, extra) {
  const titel = modTitel(m);
  const reihe = mittelReihe(history, [m.id]);
  return `<div role="button" tabindex="0" onclick="startModule('${m.id}')"
      style="display:flex;align-items:baseline;gap:10px;padding:6px 0;cursor:pointer;
             border-bottom:1px solid #F2F0FA;font-size:.9em">
    <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
      ${m.icon} ${esc(titel)}</span>
    ${extra || ''}
    ${reihe.length
      ? `<span style="flex:0 0 auto;display:inline-flex;align-items:baseline">${sparkline(reihe, { titel })}</span>`
      : `<span style="flex:0 0 auto;color:var(--text-light);font-size:.85em">${t('offen')}</span>`}
  </div>`;
}

// ─── Datenlage ────────────────────────────────────────────────────────

/**
 * Die nächste Sitzung zusammenstellen.
 *
 * Nicht einfach die ersten fünf aus der Liste: die stehen alle in derselben
 * Gruppe, und viermal hintereinander Merkspanne ermüdet mehr als vier
 * verschiedene Aufgaben. Deshalb reihum durch die Skalen, bis die Zeit voll
 * ist.
 */
export function sitzungVorschlag(offen, minuten = SITZUNG_MINUTEN) {
  const nachSkala = new Map();
  for (const m of offen) {
    if (!nachSkala.has(m.scale)) nachSkala.set(m.scale, []);
    nachSkala.get(m.scale).push(m);
  }
  const reihen = [...nachSkala.values()];
  const gewaehlt = [];
  let summe = 0;
  let i = 0;
  while (reihen.some(r => r.length)) {
    const reihe = reihen[i % reihen.length];
    i++;
    if (!reihe.length) continue;
    const m = reihe.shift();
    const d = minutenFuer(m);
    if (gewaehlt.length && summe + d > minuten) break;
    gewaehlt.push(m);
    summe += d;
    if (summe >= minuten) break;
  }
  return { module: gewaehlt, minuten: summe };
}

/**
 * Stand erheben: was ist getestet, was liegt zurück, wie alt ist der letzte
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

  // Einordnung über das erreichte Niveau, nicht über die Trefferquote.
  const eingeordnet = profil(scores, alter);
  const schwach = schwachePunkte(scores, alter)
    .filter(p => moduleFreigegeben(p.mod, alter));

  const byModule = {};
  scores.forEach(s => { byModule[s.moduleId] = s; });
  const faktoren = aggregateFactorScores(byModule);

  const zuletzt = scores.length ? Math.max(...scores.map(s => s.updated || 0)) : 0;
  const wochen = zuletzt ? Math.floor((Date.now() - zuletzt) / (7 * 86400000)) : 0;

  return { scores, history, alter, verfuegbar, offen, eingeordnet, schwach, faktoren, wochen, zuletzt };
}

/** Kurze Einordnungsmarke: 🔴 2 / 4,5 – erreicht gegen erwartet. */
function marke(b) {
  return `<span style="flex:0 0 auto;font-size:.82em;color:${b.farbe};white-space:nowrap">
    ${b.icon} ${komma(b.erreicht)} / ${komma(b.erwartet)}</span>`;
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

  // ── Schritt: die nächste Sitzung ────────────────────────────────────
  if (s.offen.length) {
    const v = sitzungVorschlag(s.offen);
    const liste = v.module.map(m =>
      modulZeile(m, s.history,
        `<span style="flex:0 0 auto;color:var(--text-light);font-size:.8em">${minutenFuer(m)}′</span>`)
    ).join('');

    const kopf = `<div style="display:flex;gap:16px;margin:10px 0 6px;font-size:.85em;color:var(--text-light);
        flex-wrap:wrap">
      <span><b style="color:var(--primary);font-size:1.3em">${v.module.length}</b>
        ${esc(t('vonGetestet'))} ${s.verfuegbar.length} · ${esc(t('etwa'))} ${v.minuten} ${esc(t('minuten'))}</span>
      <span>${s.offen.length} ${esc(t('nochOffen'))}</span>
    </div>`;

    const knopf = v.module.length
      ? `<div style="margin-top:12px"><button class="btn btn-primary btn-small"
          onclick="startModule('${v.module[0].id}')">${esc(t('starten'))}</button></div>`
      : '';

    html += karte('jetzt', '🧪', t('sitzungT'), t('sitzung'), kopf + liste, knopf);
  }

  // ── Schritt: üben, was zurückliegt ──────────────────────────────────
  {
    const stelle = s.offen.length ? 'danach' : 'jetzt';
    if (!s.schwach.length) {
      // Nur melden, wenn überhaupt schon etwas gemessen wurde
      if (s.eingeordnet.length) html += karte(stelle, '💪', t('uebenT'), t('keineSchwach'));
    } else {
      const liste = s.schwach.slice(0, 3).map(p => uebungsBlock(p)).join('');
      const fuss = `<p style="font-size:.84em;color:var(--text-light);line-height:1.6;margin-top:12px">
        ⏱️ ${esc(t('dosierung'))}</p>
        <p style="font-size:.75em;color:var(--text-light);line-height:1.5;margin-top:6px">
        ${esc(t('richtwertHinweis'))}</p>`;
      html += karte(stelle, '💪', t('uebenT'), t('ueben'), liste + fuss);
    }
  }

  // ── Schritt: Wiederholung ───────────────────────────────────────────
  if (!s.offen.length) {
    const reif = s.wochen >= WIEDERHOLUNG_WOCHEN;
    const zusatz = reif
      ? `<div style="margin-top:10px;font-size:.85em;color:var(--text-light)">
          ${t('seit')} ${s.wochen} ${t('wochen')}</div>
         <div style="margin-top:10px"><button class="btn btn-primary btn-small"
           onclick="navigateTo('menu')">🧪 ${esc(t('wiederT'))}</button></div>`
      : `<div style="margin-top:10px;font-size:.85em;color:var(--text-light)">
          ${t('nochWarten')} ${Math.max(1, WIEDERHOLUNG_WOCHEN - s.wochen)} ${t('wochenRein')}</div>`;
    html += karte(reif ? 'jetzt' : 'danach', '🔁', t('wiederT'), t('wieder'), zusatz);
  }

  html += `</div>`;
  main.innerHTML = html;
}

/**
 * Ein Übungsvorschlag zu einem zurückliegenden Modul.
 *
 * Zuerst die Übung am Tisch, dann die Alltagswege, erst zuletzt die App. Die
 * Reihenfolge ist Absicht: was hier oben steht, wird gemacht.
 */
function uebungsBlock(p) {
  const m = p.mod;
  const b = p.bewertung;
  const l = lang();

  // Methodenseiten aus den Förderpunkten des Moduls
  const methoden = new Map();
  const perf = getPerformanceData(m.id, 'de');
  const perfL = getPerformanceData(m.id, l) || perf;
  if (perf) {
    perf.foerderung.forEach((text, i) => {
      const id = methodLinkFor(text);
      if (id && !methoden.has(id)) methoden.set(id, (perfL && perfL.foerderung[i]) || text);
    });
  }
  const methodenListe = [...methoden].slice(0, 3).map(([id]) => {
    const me = getMethod(id);
    const titel = me ? (me.title[l] || me.title.de) : id;
    return `<a href="#" onclick="navigateTo('method',{methodId:'${id}'});return false"
      style="color:var(--primary);font-weight:600;text-decoration:none;font-size:.88em;
             border-bottom:1px dotted var(--primary-light)">${esc(titel)}</a>`;
  }).join(' · ');

  return `<div style="border-top:1px solid #F2F0FA;padding:12px 0 4px">
    <div style="display:flex;align-items:baseline;gap:10px">
      <span style="flex:1;font-weight:700">${m.icon} ${esc(modTitel(m))}</span>
      ${marke(b)}
    </div>
    <div style="font-size:.8em;color:${b.farbe};margin-top:2px">${esc(b.text)}</div>
    ${analogBox(m.id, { margin: '10px 0 0', warum: false })}
    ${methodenListe ? `<div style="margin-top:8px;font-size:.85em;color:var(--text-light)">
      🧰 ${esc(t('mehrDazu'))}: ${methodenListe}</div>` : ''}
    <div style="margin-top:6px;font-size:.82em">
      <a href="#" onclick="startModule('${m.id}');return false"
        style="color:var(--text-light);text-decoration:none">💻 ${esc(t('amGeraet'))} ›</a></div>
  </div>`;
}

// ─── Einzelner Faktor: womit trainiert man ihn? ───────────────────────

/**
 * Von der Schwäche zur Übung.
 *
 * Bisher endete das Profil bei der Feststellung „Auditives Kurzzeitgedächtnis
 * 38 %". Was man dagegen tut, stand woanders und war nicht verlinkt. Diese
 * Seite schließt die Lücke: die Module, die den Faktor trainieren, die
 * Übungen ohne Bildschirm und die Alltagswege aus den Fördermethoden.
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
  const scores = await storage.loadAllScores();
  const alter = alterJahre();
  const byId = {};
  scores.forEach(s => { byId[s.moduleId] = s; });

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
      ${eigeneModule.map(m => {
        const b = byId[m.id] ? bewerte(m, byId[m.id].bestLevel || 0, alter) : null;
        return modulZeile(m, history, b ? marke(b) : '') + analogZeile(m.id);
      }).join('') || '—'}

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
