/**
 * Einführungsseite: wie das Ganze gedacht ist.
 *
 * Wer die App zum ersten Mal öffnet, sieht 29 Module und weiß nicht, was er
 * damit soll. Der Ablauf – erst alles durchtesten, dann üben, später erneut
 * testen – steht nirgends, obwohl er den Zweck der App ausmacht. Ohne ihn
 * wirkt sie wie eine Sammlung Spiele.
 *
 * Zwei Dinge stehen deshalb bewusst deutlich darin: dass die Tests Zeit
 * brauchen und ohne Eile gemacht werden sollen, und dass ein einzelnes
 * Ergebnis wenig sagt. Beides beeinflusst die Messung stärker als jede
 * Feineinstellung im Ablauf – ein müdes oder gehetztes Kind zeigt nicht,
 * was es kann.
 */
import { lang, esc } from '../core/html.js';
import { modules } from '../data/modules.js';

const T = {
  titel: {
    de: 'So ist es gedacht',
    ru: 'Как это устроено',
    en: 'How this works'
  },
  unter: {
    de: 'Ein Weg in vier Schritten – vom ersten Testen bis zum geplanten Üben',
    ru: 'Путь из четырёх шагов — от первых проб до целенаправленных занятий',
    en: 'A path in four steps – from the first tests to planned practice'
  },
  einleitung: {
    de: 'Diese App ist kein Spielesammlung, auch wenn sie so aussieht. Sie geht einen Weg mit dir und deinem Kind: erst schauen, was schon gut geht und was noch schwerfällt, dann gezielt das Fehlende üben, und nach einiger Zeit noch einmal nachsehen, was sich verändert hat.',
    ru: 'Это приложение — не сборник игр, хотя выглядит похоже. Оно проходит путь вместе с вами и ребёнком: сначала посмотреть, что уже получается и что даётся трудно, затем целенаправленно тренировать недостающее, а через некоторое время снова проверить, что изменилось.',
    en: 'This app is not a collection of games, even though it looks like one. It walks a path with you and your child: first see what already works and what is still hard, then practise what is missing, and after a while look again at what has changed.'
  },

  s1t: { de: 'Alle Aufgaben einmal durchgehen', ru: 'Пройти все задания по разу', en: 'Work through every task once' },
  s1: {
    de: 'Setzt euch zusammen hin und geht die Aufgaben der Reihe nach durch. Erst wenn alle Bereiche einmal dran waren, entsteht ein Bild – ein einzelner Test sagt für sich fast nichts.',
    ru: 'Сядьте вместе и пройдите задания по порядку. Картина складывается только когда все области были затронуты — один тест сам по себе почти ничего не говорит.',
    en: 'Sit down together and work through the tasks in order. A picture only emerges once every area has been covered – a single test on its own says almost nothing.'
  },
  s1zeit: {
    de: 'Plant dafür mehrere Stunden ein, verteilt auf mehrere Tage. Macht Pausen und hört auf, sobald die Konzentration nachlässt. Ein müdes oder gehetztes Kind zeigt nicht, was es kann – das Ergebnis misst dann die Müdigkeit, nicht die Fähigkeit.',
    ru: 'Заложите на это несколько часов, распределённых на несколько дней. Делайте перерывы и прекращайте, как только внимание слабеет. Уставший или подгоняемый ребёнок не покажет, что умеет — результат тогда измеряет усталость, а не способность.',
    en: 'Plan several hours for this, spread over several days. Take breaks and stop as soon as concentration fades. A tired or rushed child will not show what they can do – the result then measures tiredness, not ability.'
  },

  s2t: { de: 'Das Ergebnis anschauen', ru: 'Посмотреть результат', en: 'Look at the result' },
  s2: {
    de: 'Aus den Ergebnissen entsteht ein Profil: welche Fähigkeiten schon tragen und welche noch Unterstützung brauchen. Es ist eine Orientierung, keine Diagnose – dafür braucht es ein geprüftes Verfahren und eine Fachperson.',
    ru: 'Из результатов складывается профиль: какие способности уже опора, а каким нужна поддержка. Это ориентир, а не диагноз — для диагноза нужны стандартизированная методика и специалист.',
    en: 'The results form a profile: which abilities already carry and which still need support. It is an orientation, not a diagnosis – that needs a standardised procedure and a professional.'
  },

  s3t: { de: 'Das Fehlende üben', ru: 'Тренировать недостающее', en: 'Practise what is missing' },
  s3: {
    de: 'Zu jeder schwächeren Fähigkeit schlägt die App Übungen vor – Aufgaben in der App und Wege für den Alltag: Spiele, Material, kleine Gewohnheiten. Wenige Minuten regelmäßig bringen mehr als eine lange Sitzung alle zwei Wochen.',
    ru: 'К каждой слабой стороне приложение предлагает упражнения — задания в приложении и способы для повседневности: игры, материалы, небольшие привычки. Несколько минут регулярно дают больше, чем одно долгое занятие раз в две недели.',
    en: 'For every weaker ability the app suggests exercises – tasks in the app and ways for everyday life: games, materials, small habits. A few minutes regularly achieve more than one long session every two weeks.'
  },

  s4t: { de: 'Nach einiger Zeit erneut testen', ru: 'Через время проверить снова', en: 'Test again after a while' },
  s4: {
    de: 'Nach etwa zwei bis drei Monaten dieselben Aufgaben noch einmal. Der Verlauf in der Statistik zeigt dann, was sich bewegt hat. Früher zu messen lohnt sich selten – Veränderung braucht Zeit, und zu häufiges Testen misst vor allem Gewöhnung an die Aufgabe.',
    ru: 'Примерно через два–три месяца пройдите те же задания снова. Динамика в статистике покажет, что изменилось. Измерять раньше обычно не имеет смысла: изменениям нужно время, а слишком частые проверки измеряют скорее привыкание к заданию.',
    en: 'After about two to three months, run the same tasks again. The history in the statistics then shows what has moved. Measuring earlier rarely pays off – change needs time, and testing too often mainly measures familiarity with the task.'
  },

  achtungT: { de: 'Worauf es beim Testen ankommt', ru: 'Что важно при тестировании', en: 'What matters when testing' },
  a1: { de: 'Ohne Eile. Es gibt nichts zu gewinnen und keine Note.', ru: 'Без спешки. Здесь нечего выигрывать и нет оценок.', en: 'No rush. There is nothing to win and no grade.' },
  a2: { de: 'Nicht helfen und nicht vorsagen, auch nicht durch Blicke – sonst misst der Test euch beide.', ru: 'Не помогать и не подсказывать, в том числе взглядом — иначе тест измеряет вас обоих.', en: 'Do not help or prompt, not even with a glance – otherwise the test measures both of you.' },
  a3: { de: 'Aufhören, wenn das Kind nicht mehr mag. Der Rest läuft nicht weg.', ru: 'Прекращать, когда ребёнок больше не хочет. Остальное никуда не денется.', en: 'Stop when the child has had enough. The rest will keep.' },
  a4: { de: 'Ergebnisse nicht vor dem Kind bewerten. „Schwach" ist kein Urteil über ein Kind, sondern ein Hinweis, wo Üben lohnt.', ru: 'Не оценивайте результаты при ребёнке. «Слабо» — это не приговор ребёнку, а указание, где стоит позаниматься.', en: 'Do not judge results in front of the child. "Weak" is not a verdict on a child but a pointer to where practice pays off.' },

  ohneT: { de: 'Der Bildschirm ist der Notbehelf', ru: 'Экран — это запасной путь', en: 'The screen is the fallback' },
  ohne: {
    de: 'Jede Aufgabe hier lässt sich auch am Küchentisch machen: mit Kärtchen, Bausteinen, Münzen, den eigenen Händen. Auf jedem Startbildschirm steht, wie – und im Plan steht die Anleitung für den Tisch vor dem Verweis auf die App.',
    ru: 'Любое задание здесь можно сделать и за кухонным столом: карточками, кубиками, монетами, собственными руками. На каждом стартовом экране написано как — и в плане инструкция для стола стоит раньше ссылки на приложение.',
    en: 'Every task here can also be done at the kitchen table: with cards, blocks, coins, your own hands. Every start screen says how – and in the plan the table instructions come before the pointer to the app.'
  },
  ohne1: {
    de: 'Ein Mensch sitzt gegenüber. Er sieht, ob das Kind rät, aufgibt, sich verzettelt oder die Aufgabe nur nicht verstanden hat. Kein Programm bemerkt das.',
    ru: 'Напротив сидит человек. Он видит, угадывает ли ребёнок, сдаётся, путается или просто не понял задание. Программа этого не замечает.',
    en: 'A person sits opposite. They see whether the child is guessing, giving up, getting lost, or simply did not understand the task. No program notices that.'
  },
  ohne2: {
    de: 'Was in der Hand liegt, wird anders behalten als was auf Glas erscheint. Und am Tisch lässt sich alles anpassen: ein Kärtchen weniger, die Lieblingstiere statt der vorgegebenen Bilder.',
    ru: 'То, что лежит в руке, запоминается иначе, чем то, что появляется на стекле. И за столом всё можно подстроить: на карточку меньше, любимые звери вместо заданных картинок.',
    en: 'What lies in the hand is retained differently from what appears on glass. And at the table everything can be adapted: one card fewer, the favourite animals instead of the given pictures.'
  },
  ohne3: {
    de: 'Wozu dann die App? Für die Abende ohne Material, für unterwegs – und für den Vergleich über die Zeit: sie misst Zeiten und Stufen gleichmäßig, das gelingt am Küchentisch nicht.',
    ru: 'Зачем тогда приложение? Для вечеров без материалов, для дороги — и для сравнения во времени: оно измеряет время и уровни одинаково, за кухонным столом так не выйдет.',
    en: 'So why the app at all? For evenings without materials, for travelling – and for comparison over time: it measures times and levels evenly, which a kitchen table cannot.'
  },

  losT: { de: 'Womit fange ich an?', ru: 'С чего начать?', en: 'Where do I start?' },
  los: {
    de: 'Trag zuerst das Geburtsjahr ein – ohne Alter lässt sich kein Ergebnis einordnen. Dann nimm die erste Gruppe und arbeite dich durch. Der Plan zeigt dir jederzeit, was als Nächstes dran ist.',
    ru: 'Сначала укажите год рождения — без возраста результат не истолковать. Затем возьмите первую группу и проходите по порядку. План в любой момент покажет, что дальше.',
    en: 'First enter the year of birth – without an age no result can be placed. Then take the first group and work through it. The plan shows you at any time what comes next.'
  },
  herkunft: { de: 'Woher die Aufgaben und das Faktorenmodell stammen',
              ru: 'Откуда взяты задания и модель факторов',
              en: 'Where the tasks and the factor model come from' },
  module: { de: 'Aufgaben', ru: 'заданий', en: 'tasks' },
  dauer: { de: 'Stunden für den ersten Durchgang', ru: 'часов на первый проход', en: 'hours for the first pass' },
  wieder: { de: 'Monate bis zur Wiederholung', ru: 'месяца до повтора', en: 'months until repeating' }
};
const t = k => { const l = lang(); return T[k][l] || T[k].de; };

/**
 * Grobe Dauer des ersten Durchgangs.
 *
 * Gerechnet, nicht geraten: je Modul ein Durchgang mit den eingestellten
 * Übungen, plus Erklären und Verschnaufen. Die Zahl soll niemanden
 * beruhigen, sondern verhindern, dass jemand alles an einem Abend
 * durchzieht.
 */
function stundenSchaetzung() {
  const proModul = 6;                       // Minuten: Aufgabe erklären, spielen, Pause
  return Math.max(2, Math.round(modules.length * proModul / 60));
}

function schritt(nr, titel, text, extra) {
  return `<div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:18px">
    <div style="flex:0 0 34px;height:34px;border-radius:50%;background:var(--primary);color:#fff;
      display:flex;align-items:center;justify-content:center;font-weight:800">${nr}</div>
    <div style="flex:1;min-width:0">
      <div style="font-weight:700;font-size:1.05em;margin-bottom:4px">${esc(titel)}</div>
      <p style="line-height:1.6">${esc(text)}</p>
      ${extra ? `<p style="line-height:1.6;margin-top:8px;padding:10px 12px;background:var(--bg);
        border-radius:var(--radius-sm);font-size:.93em">${esc(extra)}</p>` : ''}
    </div>
  </div>`;
}

export function renderIntro(main) {
  const kachel = (wert, text) => `<div style="text-align:center;background:var(--bg);
    padding:14px 18px;border-radius:var(--radius-sm);min-width:110px">
    <div style="font-size:1.8em;font-weight:800;color:var(--primary)">${wert}</div>
    <div style="font-size:.8em;color:var(--text-light);line-height:1.35">${esc(text)}</div></div>`;

  main.innerHTML = `<h2 class="page-title">📖 ${t('titel')}</h2>
    <p class="page-subtitle">${esc(t('unter'))}</p>

    <div class="training-container"><div class="training-area" style="align-items:stretch;max-width:640px;margin:0 auto">
      <p style="line-height:1.7;margin-bottom:20px">${esc(t('einleitung'))}</p>

      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:24px">
        ${kachel(modules.length, t('module'))}
        ${kachel('~' + stundenSchaetzung(), t('dauer'))}
        ${kachel('2–3', t('wieder'))}
      </div>

      ${schritt(1, t('s1t'), t('s1'), t('s1zeit'))}
      ${schritt(2, t('s2t'), t('s2'))}
      ${schritt(3, t('s3t'), t('s3'))}
      ${schritt(4, t('s4t'), t('s4'))}

      <h3 class="section-title" style="margin-top:8px">⚠️ ${t('achtungT')}</h3>
      <ul style="line-height:1.8;margin-left:18px">
        <li>${esc(t('a1'))}</li>
        <li>${esc(t('a2'))}</li>
        <li>${esc(t('a3'))}</li>
        <li>${esc(t('a4'))}</li>
      </ul>

      <div data-role="ohne-bildschirm" style="margin-top:22px;background:#F4FAF4;border-left:4px solid var(--green);
          border-radius:var(--radius-sm);padding:16px 18px">
        <div style="font-weight:800;font-size:1.05em;margin-bottom:8px">🧺 ${esc(t('ohneT'))}</div>
        <p style="line-height:1.7">${esc(t('ohne'))}</p>
        <ul style="line-height:1.75;margin:10px 0 0 18px;font-size:.95em">
          <li>${esc(t('ohne1'))}</li>
          <li>${esc(t('ohne2'))}</li>
        </ul>
        <p style="line-height:1.65;margin-top:10px;font-size:.9em;color:var(--text-light)">${esc(t('ohne3'))}</p>
      </div>

      <h3 class="section-title" style="margin-top:22px">🚀 ${t('losT')}</h3>
      <p style="line-height:1.7">${esc(t('los'))}</p>

      <p style="margin-top:22px;padding-top:14px;border-top:1px solid #F0EFF8">
        <a href="#" onclick="navigateTo('background');return false"
           style="color:var(--primary);font-weight:600;text-decoration:none;
                  border-bottom:1px dotted var(--primary-light)">🏛️ ${esc(t('herkunft'))} ›</a></p>
    </div></div>
`;
}
