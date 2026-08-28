/**
 * Herkunft und Hintergrund.
 *
 * Wer die App ernsthaft benutzt, sollte wissen, worauf sie sich stützt und
 * wo sie eigene Wege geht. Das stand bisher nur im README – also dort, wo
 * Eltern und Therapeutinnen es nie sehen.
 *
 * Die Seite nennt Zahlen statt Behauptungen. „Angelehnt an" kann alles
 * heißen; „64 von 89 Faktoren stehen wörtlich im Skript" kann man prüfen.
 */
import { lang, esc } from '../core/html.js';
import { cognitiveFactors } from '../data/cognitive-factors.js';
import { modules } from '../data/modules.js';
import { methods } from '../data/methods/index.js';

const T = {
  titel: { de: 'Herkunft und Hintergrund', ru: 'Истоки и предыстория', en: 'Origin and background' },
  unter: { de: 'Quellen der Aufgaben und des Faktorenmodells, und was davon abweicht',
           ru: 'Источники заданий и модели факторов, и где есть отступления',
           en: 'Sources of the tasks and the factor model, and what departs from them' },

  grundT: { de: 'Die Vorlage', ru: 'Первоисточник', en: 'The source' },
  grund: {
    de: 'Ideengrundlage sind die „Arbeitsmaterialien zur KABC-II" von 2016, erarbeitet von einem Arbeitskreis unter Leitung von Dr. Werner Laschkowski bei der Regierung von Mittelfranken, gemeinsam mit Lehrkräften mittelfränkischer Förderschulen. Von dort stammen die Gliederung in fünf Skalen und achtzehn Subtests sowie ein Teil der Fachbegriffe für Einflussfaktoren, Hypothesen und Fördermöglichkeiten.',
    ru: 'Идейной основой послужили «Рабочие материалы к KABC-II» 2016 года, подготовленные рабочей группой под руководством д-ра Вернера Лашковского при правительстве Средней Франконии вместе с учителями тамошних коррекционных школ. Оттуда взяты деление на пять шкал и восемнадцать субтестов, а также часть терминов для факторов влияния, гипотез и способов развития.',
    en: 'The idea rests on the "Arbeitsmaterialien zur KABC-II" of 2016, compiled by a working group led by Dr Werner Laschkowski at the government of Middle Franconia together with teachers from the region\'s special schools. From there come the division into five scales and eighteen subtests, and part of the terminology for influencing factors, hypotheses and ways to practise.'
  },
  dank: {
    de: 'Dank an den Arbeitskreis für diese Vorarbeit.',
    ru: 'Благодарность рабочей группе за эту подготовительную работу.',
    en: 'Thanks to the working group for that groundwork.'
  },

  uebernommenT: { de: 'Übernommen wurde die Systematik, nicht der Text', ru: 'Взята систематика, а не текст', en: 'The systematics were taken, not the text' },
  uebernommen: {
    de: 'Ein Abgleich aller App-Texte gegen das Skript ergab keinen einzigen übernommenen Satz. Die längste wörtliche Übereinstimmung ist 47 Zeichen lang, der Median 23 – durchweg Fachbegriffe wie „Visuelles Kurzzeitgedächtnis". Übereinstimmungen ab Satzlänge: keine.',
    ru: 'Сверка всех текстов приложения с методичкой не выявила ни одного заимствованного предложения. Самое длинное дословное совпадение — 47 знаков, медиана 23: это термины вроде «зрительная кратковременная память». Совпадений длиной с предложение нет.',
    en: 'Comparing every app text against the source found not one borrowed sentence. The longest verbatim match is 47 characters, the median 23 – throughout these are technical terms such as "visual short-term memory". Matches of sentence length: none.'
  },

  faktorenT: { de: 'Das Faktorenmodell, nachgezählt', ru: 'Модель факторов, посчитано', en: 'The factor model, counted' },
  faktoren: {
    de: 'Die Abschnitte „Was wird geprüft", „Wesentliche Einflüsse" und „Hypothesen zu Stärken und Schwächen" aller achtzehn Subtests enthalten zusammen 284 verschiedene Einzelpunkte. Von unseren Faktoren stehen:',
    ru: 'Разделы «что проверяется», «основные влияния» и «гипотезы о сильных и слабых сторонах» всех восемнадцати субтестов содержат вместе 284 различных пункта. Из наших факторов:',
    en: 'The sections "what is tested", "essential influences" and "hypotheses on strengths and weaknesses" of all eighteen subtests together contain 284 distinct points. Of our factors:'
  },
  fWoertlich: { de: 'wörtlich im Skript genannt', ru: 'названы дословно', en: 'named verbatim in the source' },
  fSinn:      { de: 'sinngemäß, dort anders formuliert', ru: 'по смыслу, сформулированы иначе', en: 'in substance, worded differently there' },
  fEigen:     { de: 'von uns ergänzt', ru: 'добавлены нами', en: 'added by us' },
  fEigenText: {
    de: 'Die eigenen gehören überwiegend zu Aufgaben, die selbst keine Subtests der Vorlage sind. Auf der Seite eines solchen Faktors steht ein Hinweis darauf.',
    ru: 'Добавленные относятся в основном к заданиям, которых в первоисточнике нет. На странице такого фактора об этом сказано.',
    en: 'The added ones mostly belong to tasks that are not subtests of the source at all. The page of such a factor says so.'
  },

  neuT: { de: 'Was hier neu entstanden ist', ru: 'Что появилось здесь', en: 'What is new here' },
  neu1: {
    de: 'Die quantitative Auswertung: Punktwerte je Niveau, das adaptive Hoch- und Runterstufen, die altersnormierte Einordnung. Im Skript existiert davon nichts – es ist ein qualitatives Beobachtungshilfsmittel für Fachleute und enthält keine einzige Auswertungsformel.',
    ru: 'Количественная оценка: баллы по уровням, адаптивное повышение и понижение, возрастная нормировка. В методичке этого нет — она качественный инструмент наблюдения для специалистов и не содержит ни одной расчётной формулы.',
    en: 'The quantitative evaluation: scores per level, adaptive stepping up and down, the age-normed rating. None of this exists in the source – it is a qualitative observation aid for professionals and contains not a single scoring formula.'
  },
  neu2: {
    de: 'Das Faktorenmodell als Modell: die Einordnung in Kategorien und die Zuordnung Faktor → Aufgabe, aus der sich das Profil errechnet. Die einzelnen Begriffe stammen großenteils aus dem Skript, die Verknüpfung nicht.',
    ru: 'Модель факторов как модель: распределение по категориям и связь фактор → задание, из которой считается профиль. Сами термины большей частью из методички, связь — нет.',
    en: 'The factor model as a model: the grouping into categories and the mapping factor → task from which the profile is computed. The individual terms largely come from the source; the mapping does not.'
  },
  nachAngabe: {
    de: 'Beides wurde nach Angabe des Autors mit KI-Unterstützung erarbeitet.',
    ru: 'И то и другое, по словам автора, разработано с помощью ИИ.',
    en: 'Both were developed with AI support, according to the author.'
  },

  nichtT: { de: 'Was diese App nicht ist', ru: 'Чем это приложение не является', en: 'What this app is not' },
  n1: { de: 'Kein Testverfahren und kein Ersatz für eines.', ru: 'Не диагностическая методика и не замена ей.', en: 'Not a test procedure and no substitute for one.' },
  n2: { de: 'Keine Originalaufgaben, keine Normtabellen, keine Standardwerte. Die Aufgaben sind eigene Nachbauten allgemein bekannter Paradigmen – Zahlenspanne, Bausteine zählen, Gestaltschließen –, die deutlich älter sind als die KABC.',
        ru: 'Нет оригинальных заданий, нормативных таблиц и стандартных значений. Задания — собственные реализации общеизвестных парадигм (объём цифр, счёт кубиков, гештальт-замыкание), которые намного старше KABC.',
        en: 'No original items, no norm tables, no standard scores. The tasks are our own rebuilds of widely known paradigms – digit span, block counting, gestalt closure – that are considerably older than the KABC.' },
  n3: { de: 'Ergebnisse sind Übungsrückmeldungen, keine Diagnostik. Wer eine belastbare Einschätzung braucht, wendet sich an eine Fachperson.',
        ru: 'Результаты — обратная связь по упражнениям, а не диагностика. За надёжной оценкой следует обращаться к специалисту.',
        en: 'Results are practice feedback, not diagnostics. Anyone needing a reliable assessment should turn to a professional.' },

  markeT: { de: 'Zur Marke', ru: 'О товарном знаке', en: 'On the trademark' },
  marke: {
    de: 'KABC-II ist eine eingetragene Marke der jeweiligen Rechteinhaber. Sie wird hier ausschließlich als Sachhinweis auf die Struktur verwendet, auf die sich die App bezieht – nicht als Produktname und ohne jede Verbindung zu oder Billigung durch die Rechteinhaber.',
    ru: 'KABC-II — зарегистрированный товарный знак соответствующих правообладателей. Здесь он используется исключительно как указание на структуру, к которой отсылает приложение, — не как название продукта и без какой-либо связи с правообладателями или их одобрения.',
    en: 'KABC-II is a registered trademark of the respective rights holders. It is used here solely as a factual reference to the structure the app relates to – not as a product name, and without any connection to or endorsement by the rights holders.'
  },

  umfangT: { de: 'Umfang', ru: 'Объём', en: 'Scope' },
  uAufgaben: { de: 'Aufgaben', ru: 'заданий', en: 'tasks' },
  uFaktoren: { de: 'Faktoren', ru: 'факторов', en: 'factors' },
  uMethoden: { de: 'Methodenseiten', ru: 'страниц с методами', en: 'method pages' },
  uSprachen: { de: 'Sprachen', ru: 'языка', en: 'languages' }
};
const t = k => { const l = lang(); return T[k][l] || T[k].de; };

/** Zahlen aus den Daten, nicht aus dem Gedächtnis. */
function herkunftZaehlen() {
  const z = { skript: 0, sinngemaess: 0, eigen: 0 };
  for (const f of Object.values(cognitiveFactors)) if (z[f.quelle] !== undefined) z[f.quelle]++;
  return z;
}

export function renderBackground(main) {
  const z = herkunftZaehlen();
  const gesamt = Object.keys(cognitiveFactors).length;

  const kachel = (wert, text) => `<div style="text-align:center;background:var(--bg);
    padding:12px 16px;border-radius:var(--radius-sm);min-width:96px">
    <div style="font-size:1.6em;font-weight:800;color:var(--primary)">${wert}</div>
    <div style="font-size:.76em;color:var(--text-light);line-height:1.35">${esc(text)}</div></div>`;

  const zeile = (n, text, farbe) => `<div style="display:flex;align-items:baseline;gap:10px;
      padding:5px 0;border-bottom:1px solid #F2F0FA">
    <span style="font-weight:800;color:${farbe};min-width:2.4em;text-align:right">${n}</span>
    <span style="flex:1">${esc(text)}</span>
  </div>`;

  main.innerHTML = `<h2 class="page-title">🏛️ ${t('titel')}</h2>
    <p class="page-subtitle">${esc(t('unter'))}</p>

    <div class="training-container"><div class="training-area" style="align-items:stretch;max-width:640px;margin:0 auto">

      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:22px">
        ${kachel(modules.length, t('uAufgaben'))}
        ${kachel(gesamt, t('uFaktoren'))}
        ${kachel(methods.length, t('uMethoden'))}
        ${kachel(3, t('uSprachen'))}
      </div>

      <h3 class="section-title">📚 ${t('grundT')}</h3>
      <p style="line-height:1.7">${esc(t('grund'))}</p>
      <p style="line-height:1.7;margin-top:8px;font-style:italic;color:var(--text-light)">${esc(t('dank'))}</p>

      <h3 class="section-title" style="margin-top:22px">✂️ ${t('uebernommenT')}</h3>
      <p style="line-height:1.7">${esc(t('uebernommen'))}</p>

      <h3 class="section-title" style="margin-top:22px">🔢 ${t('faktorenT')}</h3>
      <p style="line-height:1.7;margin-bottom:10px">${esc(t('faktoren'))}</p>
      ${zeile(z.skript, t('fWoertlich'), 'var(--green)')}
      ${zeile(z.sinngemaess, t('fSinn'), 'var(--primary)')}
      ${zeile(z.eigen, t('fEigen'), 'var(--secondary)')}
      <p style="line-height:1.6;margin-top:10px;font-size:.92em;color:var(--text-light)">${esc(t('fEigenText'))}</p>

      <h3 class="section-title" style="margin-top:22px">🆕 ${t('neuT')}</h3>
      <p style="line-height:1.7">${esc(t('neu1'))}</p>
      <p style="line-height:1.7;margin-top:10px">${esc(t('neu2'))}</p>
      <p style="line-height:1.6;margin-top:10px;font-size:.92em;color:var(--text-light)">${esc(t('nachAngabe'))}</p>

      <h3 class="section-title" style="margin-top:22px">⛔ ${t('nichtT')}</h3>
      <ul style="line-height:1.8;margin-left:18px">
        <li>${esc(t('n1'))}</li>
        <li>${esc(t('n2'))}</li>
        <li>${esc(t('n3'))}</li>
      </ul>

      <h3 class="section-title" style="margin-top:22px">®️ ${t('markeT')}</h3>
      <p style="line-height:1.7;font-size:.93em;color:var(--text-light)">${esc(t('marke'))}</p>
    </div></div>`;
}
