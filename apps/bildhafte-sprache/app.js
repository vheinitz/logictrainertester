/**
 * Bildhafte Sprache: wörtlich oder gemeint?
 * idee-db: 42
 *
 * Buch: Adaptatsia_Uchebnykh_Materialov_Dlya_Obuchayuschikhsya_S_Ras,
 * S. 22–23, Teil II, 2.2.3 „Литературное чтение“ (bildhafte Sprache,
 * Sprichwörter).
 *
 * Kernspiel des Moduls „Teekesselchen / Rätsel“: Das Kind sieht eine
 * Redewendung oder ein Sprichwort und wählt zwischen zwei Bildern – dem
 * WÖRTLICHEN Bild und der tatsächlich GEMEINTEN Alltagssituation. Jede Karte
 * ist mit einem Emoji-Bild veranschaulicht (echte Bilder können später
 * ergänzt werden). Wer die gemeinte (übertragene) Bedeutung trifft, erkennt
 * den Unterschied zwischen Wortsinn und übertragenem Sinn.
 *
 * Bilder: `wörtlich.emoji` / `übertragen.emoji` sind vorerst Emoji-Platzhalter.
 * Später können echte Bilder ergänzt werden (Konvention: `bilder/<itemId>-*.png`).
 */
import { MiniApp } from '../_framework/framework.js';

/** Mehrsprachiger Text (de/ru/en, für weitere Sprachen einfach ergänzen). */
const T = {
  geschafft: { de: 'Geschafft!', ru: 'Получилось!', en: 'You did it!' },
  richtig:   { de: 'richtig', ru: 'верно', en: 'correct' },
  fehler:    { de: 'Fehler', ru: 'ошибки', en: 'mistakes' },
  weiter:    { de: 'Weiter ➜', ru: 'Дальше ➜', en: 'Next ➜' },
  nochmal:   { de: 'Nochmal', ru: 'Ещё раз', en: 'Again' },
  gut: {
    de: 'Richtig! Das ist die übertragene (gemeinte) Bedeutung.',
    ru: 'Верно! Это переносное значение — то, что имеется в виду.',
    en: 'Correct! That is the figurative (meant) meaning.'
  },
  schlecht: {
    de: 'Das ist die wörtliche Bedeutung. Was ist wirklich gemeint?',
    ru: 'Это буквальное значение. Что имеется в виду на самом деле?',
    en: 'That is the literal meaning. What is really meant?'
  }
};

/** Kategorie-Badge je Aufgabe. */
const TYP = {
  redewendung: { de: 'Redewendung', ru: 'Образное выражение', en: 'Idiom' },
  sprichwort:  { de: 'Sprichwort', ru: 'Пословица', en: 'Proverb' }
};

/**
 * Aufgaben: Redewendungen und Sprichwörter.
 * `wörtlich` = wörtliches Bild, `übertragen` = wirklich gemeinte Alltagssituation
 * (immer die richtige Antwort). `emoji` kann eine gemeinsame Zeichenkette oder
 * ein {de,ru,en}-Objekt sein, falls das Bild sprachabhängig ist.
 */
const ITEMS = [
  {
    id: 'schmetterlinge',
    typ: 'redewendung',
    wendung: {
      de: 'Schmetterlinge im Bauch haben',
      ru: 'Бабочки в животе',
      en: 'To have butterflies in your stomach'
    },
    wörtlich: {
      text: {
        de: 'Im Bauch flattern echte Schmetterlinge.',
        ru: 'В животе порхают настоящие бабочки.',
        en: 'Real butterflies flutter in your belly.'
      },
      emoji: '🦋'
    },
    übertragen: {
      text: {
        de: 'Man ist verliebt oder sehr aufgeregt.',
        ru: 'Человек влюблён или очень волнуется.',
        en: 'You are in love or very excited.'
      },
      emoji: '💕'
    },
    erklaerung: {
      de: 'Niemand hat echte Schmetterlinge im Bauch. Die Wendung meint das kribbelige Gefühl, wenn man verliebt oder ganz aufgeregt ist.',
      ru: 'Настоящих бабочек в животе нет. Так говорят о приятном волнении, когда человек влюблён или очень радуется.',
      en: 'Nobody really has butterflies inside. It describes the fluttery feeling when you are in love or very excited.'
    }
  },
  {
    id: 'wolke-sieben',
    typ: 'redewendung',
    wendung: {
      de: 'Auf Wolke sieben schweben',
      ru: 'Быть на седьмом небе',
      en: 'To be on cloud nine'
    },
    wörtlich: {
      text: {
        de: 'Man schwebt wirklich auf einer Wolke hoch oben.',
        ru: 'Человек по-настоящему парит на облаке высоко в небе.',
        en: 'You really float on a cloud high up in the sky.'
      },
      emoji: '☁️'
    },
    übertragen: {
      text: {
        de: 'Man ist überglücklich.',
        ru: 'Человек очень счастлив.',
        en: 'You are overjoyed.'
      },
      emoji: '😍'
    },
    erklaerung: {
      de: 'Die Wolke ist ein Bild für ein Gefühl: Wer auf Wolke sieben schwebt, ist so glücklich, als würde er schweben.',
      ru: 'Облако — это образ чувства: «быть на седьмом небе» значит быть очень счастливым, будто паришь.',
      en: 'The cloud is a picture for a feeling: being on cloud nine means being so happy it feels like floating.'
    }
  },
  {
    id: 'krokodilstraenen',
    typ: 'redewendung',
    wendung: {
      de: 'Krokodilstränen weinen',
      ru: 'Лить крокодиловы слёзы',
      en: 'To cry crocodile tears'
    },
    wörtlich: {
      text: {
        de: 'Ein Krokodil weint echte Tränen.',
        ru: 'Крокодил по-настоящему плачет.',
        en: 'A crocodile is really crying.'
      },
      emoji: '🐊😢'
    },
    übertragen: {
      text: {
        de: 'Die Tränen sind gespielt, nicht echt.',
        ru: 'Слёзы притворные, ненастоящие.',
        en: 'The tears are fake, not real.'
      },
      emoji: '🎭'
    },
    erklaerung: {
      de: 'Krokodile weinen nicht vor Trauer. Krokodilstränen sind gespielte Tränen, mit denen man Mitleid erregen will.',
      ru: 'Крокодилы не плачут от горя. «Крокодиловы слёзы» — это притворные слёзы, чтобы вызвать жалость.',
      en: 'Crocodiles do not cry from sadness. “Crocodile tears” are pretend tears used to get sympathy.'
    }
  },
  {
    id: 'auge-zudruecken',
    typ: 'redewendung',
    wendung: {
      de: 'Ein Auge zudrücken',
      ru: 'Закрыть глаза на что-то',
      en: 'To turn a blind eye'
    },
    wörtlich: {
      text: {
        de: 'Man schaut mit einem geschlossenen Auge.',
        ru: 'Человек смотрит, прикрыв глаз.',
        en: 'You look with one eye closed.'
      },
      emoji: '😉'
    },
    übertragen: {
      text: {
        de: 'Man übersieht einen kleinen Fehler absichtlich.',
        ru: 'Человек нарочно не замечает маленькую ошибку.',
        en: 'You purposely ignore a small mistake.'
      },
      emoji: '🤫'
    },
    erklaerung: {
      de: 'Niemand hält wirklich ein Auge zu. Die Wendung meint: einen Fehler absichtlich nicht sehen, um jemanden zu schonen.',
      ru: 'На самом деле глаз не закрывают. Это значит: намеренно не заметить ошибку, чтобы не наказывать.',
      en: 'Nobody really closes one eye. It means deliberately not seeing a mistake to be kind to someone.'
    }
  },
  {
    id: 'haare-zu-berge',
    typ: 'redewendung',
    wendung: {
      de: 'Die Haare stehen zu Berge',
      ru: 'Волосы встают дыбом',
      en: 'One’s hair stands on end'
    },
    wörtlich: {
      text: {
        de: 'Die Haare stehen aufrecht nach oben.',
        ru: 'Волосы действительно встают торчком.',
        en: 'The hair really stands straight up.'
      },
      emoji: '🙀'
    },
    übertragen: {
      text: {
        de: 'Man hat große Angst oder erschrickt.',
        ru: 'Человеку очень страшно, он испугался.',
        en: 'You are very frightened or shocked.'
      },
      emoji: '😱'
    },
    erklaerung: {
      de: 'Haare bewegen sich nicht von selbst. Die Wendung beschreibt das Gefühl, wenn man sich sehr erschrickt.',
      ru: 'Волосы сами не поднимаются. Так говорят, когда человек очень сильно испугался.',
      en: 'Hair does not move by itself. The phrase describes the feeling of being very scared.'
    }
  },
  {
    id: 'stein-vom-herzen',
    typ: 'redewendung',
    wendung: {
      de: 'Mir fällt ein Stein vom Herzen',
      ru: 'Камень с души упал',
      en: 'A weight off my shoulders'
    },
    wörtlich: {
      text: {
        de: 'Ein Stein fällt vom Herzen.',
        ru: 'С души падает камень.',
        en: 'A heavy weight is lifted from your shoulders.'
      },
      emoji: { de: '🪨❤️', ru: '🪨', en: '🏋️' }
    },
    übertragen: {
      text: {
        de: 'Man ist erleichtert, die Sorge ist weg.',
        ru: 'Человеку стало легко, тревога ушла.',
        en: 'You feel relieved, the worry is gone.'
      },
      emoji: '😌'
    },
    erklaerung: {
      de: 'Es fällt kein echter Stein. Die Wendung meint: Die Angst ist vorbei, und man fühlt sich erleichtert.',
      ru: 'Настоящий камень не падает. Это значит: тревога прошла, и стало легко.',
      en: 'No real stone falls. It means the worry is over and you feel relieved.'
    }
  },
  {
    id: 'katze-aus-dem-sack',
    typ: 'redewendung',
    wendung: {
      de: 'Die Katze aus dem Sack lassen',
      ru: 'Выпустить кота из мешка',
      en: 'To let the cat out of the bag'
    },
    wörtlich: {
      text: {
        de: 'Eine Katze springt aus einem Sack.',
        ru: 'Кот выпрыгивает из мешка.',
        en: 'A cat jumps out of a bag.'
      },
      emoji: '🐈'
    },
    übertragen: {
      text: {
        de: 'Ein Geheimnis wird verraten.',
        ru: 'Тайна становится известна.',
        en: 'A secret is revealed.'
      },
      emoji: '💬'
    },
    erklaerung: {
      de: 'Es geht nicht um eine echte Katze. Die Wendung meint: Etwas, das geheim war, wird nun verraten.',
      ru: 'Речь не о настоящем коте. Это значит: тайное стало явным, секрет раскрыт.',
      en: 'It is not about a real cat. It means something that was secret is now revealed.'
    }
  },
  {
    id: 'morgenstund',
    typ: 'sprichwort',
    wendung: {
      de: 'Morgenstund hat Gold im Mund',
      ru: 'Кто рано встаёт, тому бог подаёт',
      en: 'The early bird catches the worm'
    },
    wörtlich: {
      text: {
        de: 'Der Morgen hat Gold im Mund.',
        ru: 'Тому, кто рано встаёт, что-то подают.',
        en: 'A bird catches a worm early.'
      },
      emoji: { de: '🌅👄', ru: '🌅🙏', en: '🐦🪱' }
    },
    übertragen: {
      text: {
        de: 'Wer früh aufsteht, schafft mehr.',
        ru: 'Кто рано встаёт, тот больше успевает.',
        en: 'Early risers get more done.'
      },
      emoji: '⏰✅'
    },
    erklaerung: {
      de: 'Das Sprichwort meint: Wer morgens früh beginnt, hat Vorteile und erreicht mehr.',
      ru: 'Смысл: кто рано начинает, тот больше успевает и получает пользу.',
      en: 'It means: whoever starts early in the morning gains an advantage and gets more done.'
    }
  },
  {
    id: 'grube-graben',
    typ: 'sprichwort',
    wendung: {
      de: 'Wer anderen eine Grube gräbt, fällt selbst hinein',
      ru: 'Не рой другому яму — сам в неё попадёшь',
      en: 'He who digs a pit for others falls into it himself'
    },
    wörtlich: {
      text: {
        de: 'Jemand gräbt eine Grube und fällt hinein.',
        ru: 'Человек копает яму и сам в неё падает.',
        en: 'Someone digs a pit and falls in.'
      },
      emoji: '⛏️🕳️'
    },
    übertragen: {
      text: {
        de: 'Wer anderen schaden will, schadet sich selbst.',
        ru: 'Кто хочет навредить другому, вредит себе.',
        en: 'Whoever wants to harm others harms themselves.'
      },
      emoji: '⚖️'
    },
    erklaerung: {
      de: 'Das Sprichwort warnt: Böses, das man anderen antun will, fällt oft auf einen selbst zurück.',
      ru: 'Смысл: зло, которое хочешь причинить другому, часто возвращается к тебе.',
      en: 'It warns that the harm you plan for others often comes back to you.'
    }
  },
  {
    id: 'apfel-stamm',
    typ: 'sprichwort',
    wendung: {
      de: 'Der Apfel fällt nicht weit vom Stamm',
      ru: 'Яблоко от яблони недалеко падает',
      en: 'The apple doesn’t fall far from the tree'
    },
    wörtlich: {
      text: {
        de: 'Ein Apfel liegt dicht neben dem Baum.',
        ru: 'Яблоко падает рядом с яблоней.',
        en: 'An apple lies close to the tree.'
      },
      emoji: '🍎🌳'
    },
    übertragen: {
      text: {
        de: 'Kinder ähneln oft ihren Eltern.',
        ru: 'Дети часто похожи на родителей.',
        en: 'Children are often like their parents.'
      },
      emoji: '👨‍👩‍👦'
    },
    erklaerung: {
      de: 'Es geht nicht um Äpfel. Das Sprichwort meint: Kinder sind ihren Eltern oft sehr ähnlich.',
      ru: 'Речь не о яблоках. Смысл: дети часто похожи на своих родителей.',
      en: 'It is not about apples. It means children often resemble their parents.'
    }
  },
  {
    id: 'luegen-kurze-beine',
    typ: 'sprichwort',
    wendung: {
      de: 'Lügen haben kurze Beine',
      ru: 'У лжи короткие ноги',
      en: 'Lies have short legs'
    },
    wörtlich: {
      text: {
        de: 'Die Lüge hat kurze Beine.',
        ru: 'У лжи короткие ноги.',
        en: 'A lie has short legs.'
      },
      emoji: '🦵'
    },
    übertragen: {
      text: {
        de: 'Lügen kommen schnell heraus.',
        ru: 'Ложь быстро раскрывается.',
        en: 'Lies are quickly found out.'
      },
      emoji: '🔍'
    },
    erklaerung: {
      de: 'Eine Lüge „läuft“ nicht weit: Die Wahrheit kommt schnell ans Licht.',
      ru: 'Ложь «не убежит» далеко: правда быстро раскроется.',
      en: 'A lie does not “run” far: the truth soon comes to light.'
    }
  },
  {
    id: 'geschenkter-gaul',
    typ: 'sprichwort',
    wendung: {
      de: 'Einem geschenkten Gaul schaut man nicht ins Maul',
      ru: 'Дарёному коню в зубы не смотрят',
      en: 'Don’t look a gift horse in the mouth'
    },
    wörtlich: {
      text: {
        de: 'Man schaut einem Pferd ins Maul.',
        ru: 'Человек смотрит в зубы коню.',
        en: 'You look into a horse’s mouth.'
      },
      emoji: '🐴👀'
    },
    übertragen: {
      text: {
        de: 'An einem Geschenk meckert man nicht.',
        ru: 'Подарку не придираются.',
        en: 'Don’t criticize a gift.'
      },
      emoji: '🎁'
    },
    erklaerung: {
      de: 'Es geht nicht um Pferde. Das Sprichwort meint: Über ein Geschenk soll man sich freuen und nicht daran herummäkeln.',
      ru: 'Речь не о лошадях. Смысл: подарку радуются и не придираются к нему.',
      en: 'It is not about horses. It means: be glad about a gift and don’t find fault with it.'
    }
  }
];

function sprache(app) {
  return (app && typeof app.get === 'function') ? (app.get('sprache') || 'de') : 'de';
}
function tt(app, obj) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  const l = sprache(app);
  return obj[l] || obj.de || '';
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const app = new MiniApp({
  id: 'bildhafte-sprache',
  icon: '💬',
  titel: {
    de: 'Bildhafte Sprache: wörtlich oder gemeint?',
    ru: 'Образный язык: буквально или по смыслу?',
    en: 'Figurative language: literal or meant?'
  },
  anweisung: {
    de: 'Lies die Redewendung oder das Sprichwort. Wähle dann die Bedeutung, die WIRKLICH gemeint ist – nicht das wörtliche Bild. Tippe auf die passende Karte.',
    ru: 'Прочитай образное выражение или пословицу. Выбери значение, которое имеется в виду НА САМОМ ДЕЛЕ — не буквальную картинку. Нажми на подходящую карточку.',
    en: 'Read the idiom or proverb. Then choose the meaning that is REALLY meant – not the literal picture. Tap the matching card.'
  },
  hilfe: {
    de: 'Redewendungen und Sprichwörter meinen oft etwas anderes, als ihre Wörter sagen. Beispiel: „Schmetterlinge im Bauch haben“ heißt nicht, dass echte Schmetterlinge im Bauch sind, sondern dass man verliebt oder aufgeregt ist. Du siehst immer zwei Karten: eine zeigt das WÖRTLICHE Bild, die andere die GEMEINTE Alltagssituation. Wähle die gemeinte Bedeutung. Bei einem Fehler darfst du es noch einmal versuchen. Mit ⚙️ stellst du ein, wie viele Aufgaben du spielen möchtest.',
    ru: 'Образные выражения и пословицы часто означают не то, что говорят их слова. Например, «бабочки в животе» — это не настоящие бабочки, а чувство влюблённости или волнения. Ты видишь две карточки: одна показывает БУКВАЛЬНУЮ картинку, другая — НАСТОЯЩУЮ жизненную ситуацию. Выбери значение, которое имеется в виду. При ошибке можно попробовать ещё раз. В ⚙️ можно выбрать количество заданий.',
    en: 'Idioms and proverbs often mean something different from what their words say. For example, “to have butterflies in your stomach” does not mean real butterflies inside you, but that you are in love or excited. You always see two cards: one shows the LITERAL picture, the other the MEANT everyday situation. Choose the meant meaning. If you make a mistake you may try again. In ⚙️ you can choose how many tasks to play.'
  },
  settingsSchema: {
    anzahl: {
      def: 6, min: 3, max: 12, step: 1,
      label: { de: 'Aufgaben', ru: 'Задания', en: 'Tasks' }
    }
  },
  auswertung: 'punkte',

  // ─── Zustand ───────────────────────────────────────────────────────
  init(state, app) {
    state.anzahl = Math.min(app.get('anzahl'), ITEMS.length);
    state.aufgaben = shuffle(ITEMS).slice(0, state.anzahl);
    state.pos = 0;
    state.richtig = 0;
    state.fehler = 0;
    state.fertig = false;
    this._setzeAufgabe(state);
  },

  _setzeAufgabe(state) {
    // Auf welcher Seite (0 oder 1) steht das WÖRTLICHE Bild?
    // Die richtige Antwort ist immer die übertragene Bedeutung auf der anderen Seite.
    state.wörtlichSeite = Math.random() < 0.5 ? 0 : 1;
    state.geloest = false;
    state.gewaehlt = null;
  },

  onSettingsChange(app) { app.reset(); },

  // ─── Rendering ────────────────────────────────────────────────────
  render(state, app) {
    if (state.fertig) {
      return `<div class="bs-fertig">🎉<div>${tt(app, T.geschafft)}</div></div>`;
    }
    const it = state.aufgaben[state.pos];
    const l = sprache(app);
    const bs = app.get('bildGroesse') || 1;
    const karten = [0, 1].map(i => this._karte(state, app, i)).join('');
    const feedback = (state.geloest || state.gewaehlt !== null) ? this._feedback(state, app) : '';
    return `<div class="bs-wrap" style="font-size:${Math.round(bs * 100)}%">
      <div class="bs-aufgabe">
        <span class="bs-typ">${tt(app, TYP[it.typ])}</span>
        <div class="bs-wendung">${it.wendung[l]}</div>
      </div>
      <div class="bs-karten">${karten}</div>
      ${feedback}
    </div>`;
  },

  _karte(state, app, i) {
    const it = state.aufgaben[state.pos];
    const istWort = state.wörtlichSeite === i;
    const bed = istWort ? it.wörtlich : it.übertragen;
    const l = sprache(app);
    let kl = 'bs-karte';
    if (state.geloest) {
      kl += istWort ? ' bs-neutral' : ' bs-richtig';
    } else if (state.gewaehlt === i) {
      kl += ' bs-falsch';
    }
    return `<button type="button" class="${kl}" onclick="window.__bsWaehle(${i})">
      <div class="bs-bild">${tt(app, bed.emoji)}</div>
      <div class="bs-text">${bed.text[l]}</div>
    </button>`;
  },

  _feedback(state, app) {
    const it = state.aufgaben[state.pos];
    const l = sprache(app);
    if (state.geloest) {
      return `<div class="bs-feedback bs-gut">
        <div class="bs-fb-titel">✅ ${tt(app, T.gut)}</div>
        <div class="bs-erklaerung">${it.erklaerung[l]}</div>
        <button type="button" class="ma-btn" onclick="window.__bsWeiter()">${tt(app, T.weiter)}</button>
      </div>`;
    }
    return `<div class="bs-feedback bs-schlecht">
      <div class="bs-fb-titel">❌ ${tt(app, T.schlecht)}</div>
    </div>`;
  },

  // ─── Interaktion (über window.__bs…-Knöpfe) ───────────────────────
  actions: {
    waehle(state, i, app) {
      if (state.geloest || state.fertig) return;
      const richtigSeite = 1 - state.wörtlichSeite;
      if (i === richtigSeite) {
        state.richtig++;
        state.geloest = true;
        state.gewaehlt = null;
      } else {
        state.fehler++;
        state.gewaehlt = i;
      }
    },
    weiter(state, app) {
      if (!state.geloest || state.fertig) return;
      state.pos++;
      if (state.pos >= state.aufgaben.length) {
        state.fertig = true;
      } else {
        this._setzeAufgabe(state);
      }
    }
  },

  // ─── Auswertung ───────────────────────────────────────────────────
  statusHtml(state, app) {
    const n = state.aufgaben.length;
    return `<div class="ma-result">📖 ${state.pos + 1}/${n} · ✔ ${state.richtig} · ❌ ${state.fehler} · ⏱ ${app.elapsedSek()} s</div>`;
  },

  evaluate(state, app) {
    if (state.fertig) {
      const n = state.aufgaben.length;
      return {
        fertig: true,
        text: T.geschafft,
        wert: `✔ ${state.richtig}/${n} ${tt(app, T.richtig)} · ❌ ${state.fehler} ${tt(app, T.fehler)}
          <div style="margin-top:.6rem"><button class="ma-btn" onclick="window.__bsNeustart()">🔁 ${tt(app, T.nochmal)}</button></div>`
      };
    }
    return null;
  }
});

// Knöpfe in der Zeichenfläche rufen Aktionen über das Framework auf.
if (typeof window !== 'undefined') {
  window.__bsWaehle = (i) => app.dispatch('waehle', i);
  window.__bsWeiter = () => app.dispatch('weiter');
  window.__bsNeustart = () => app.reset();
}

export default app;
export function mount(root) { app.mount(root); }
