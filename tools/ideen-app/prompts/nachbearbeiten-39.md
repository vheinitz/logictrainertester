Du baust/änderst EINE Mini-App im LOGIK-Trainer-Projekt (KABC-II-angelehntes
Kindertraining). Gemeinsames Framework liegt in apps/_framework/ – lies zuerst
dessen README.md und framework.js.

Vertrag jeder App: apps/<slug>/app.js definiert
  new MiniApp({ id, icon, titel{de,ru,en}, anweisung{de,ru,en}, hilfe{de,ru,en},
                settingsSchema, init(state,app), render(state,app)->HTML/SVG,
                actions{}, onTap/onDrag/onDrop(state,…,app), evaluate(state,app) })
und index.html lädt ../_framework/framework.css + ./app.bundle.js (wird nachher
mit `npm run build:miniapps` gebündelt).

Im app.js-Kopf steht die Kennung `idee-db: <id>` (bei neuer App: eintragen).
Texte immer {de,ru,en} – die App ist wie die Haupt-App mehrsprachig und für
weitere Sprachen erweiterbar (einfach einen Schlüssel ergänzen).

Schreibe NUR die Dateien der App; nichts anderes im Repo ändern.


# AUFGABE: bestehende Mini-App anpassen

DB-Zeile 39 · App: apps/tiere-sortieren/

## Anweisungen (NUR die Prompt-Spalte ist verbindlich; die Ideen-Spalte bitte ignorieren)
Nachbesserung: Bitte Gruppentiere Größer, immer feste Bilder und ohne Text

## Aktueller app.js (nur zur Orientierung, nicht neu schreiben)
```js
/**
 * Oberbegriffe: Tiere sortieren.
 * idee-db: 39
 *
 * Buch: Adaptatsia_Uchebnykh_Materialov_Dlya_Obuchayuschikhsya_S_Ras,
 * S. 61–63, Teil III, 3.2.4 „Окружающий мир“, Пример № 17.
 *
 * Kernspiel des Moduls „Oberbegriffe“: Tierbilder werden auf Felder für
 * Insekten, Fische, Vögel und Säugetiere verteilt. Jede Gruppe zeigt als
 * Anker zunächst ein Beispielbild. Das Kind zieht (oder tippt) jedes Tier in
 * die richtige Gruppe und bekommt sofort Rückmeldung, die erklärt, WARUM das
 * Tier dorthin gehört.
 *
 * Leichte Stufe (⚙️): statt der Tierkarten werden vorgegebene Gruppenkarten
 * auf die Tierbilder gezogen – das Kind muss die Namen nicht selbst kennen.
 *
 * Bilder: `img` ist pro Tier vorerst `null`. Solange kein Bild hinterlegt ist,
 * zeichnet die App einen Platzhalter (Rechteck mit Wort + Emoji). Die
 * Platzhalter dienen später als Vorlage für mit Grok generierte Bilder
 * (Konvention: `bilder/<tierId>.png`).
 */
import { MiniApp, svg } from '../_framework/framework.js';

const VIEW_W = 620, VIEW_H = 560;

/** Die übergeordneten Klassen (Gruppen). `anker` = Beispielbild je Gruppe. */
const GROUPS = [
  {
    id: 'insekten',
    anker: 'schmetterling',
    name: { de: 'Insekten', ru: 'Насекомые', en: 'Insects' },
    merkmal: {
      de: 'sie haben 6 Beine',
      ru: 'у них 6 ног',
      en: 'they have 6 legs'
    }
  },
  {
    id: 'fische',
    anker: 'fisch',
    name: { de: 'Fische', ru: 'Рыбы', en: 'Fish' },
    merkmal: {
      de: 'sie leben im Wasser und atmen mit Kiemen',
      ru: 'они живут в воде и дышат жабрами',
      en: 'they live in water and breathe with gills'
    }
  },
  {
    id: 'voegel',
    anker: 'adler',
    name: { de: 'Vögel', ru: 'Птицы', en: 'Birds' },
    merkmal: {
      de: 'sie haben Federn und Flügel',
      ru: 'у них есть перья и крылья',
      en: 'they have feathers and wings'
    }
  },
  {
    id: 'saeugetiere',
    anker: 'hund',
    name: { de: 'Säugetiere', ru: 'Млекопитающие', en: 'Mammals' },
    merkmal: {
      de: 'ihre Babys trinken Milch und sie haben Fell',
      ru: 'их детёныши пьют молоко, и у них есть шерсть',
      en: 'their babies drink milk and they have fur'
    }
  }
];

/**
 * Tierpool – 6 je Gruppe, damit auch 12 Tiere mit nur 2 Gruppen möglich sind.
 * `img` bleibt `null`, bis echte Bilder vorliegen (Platzhalter s. o.).
 */
const TIERE = [
  // Insekten
  { id: 'schmetterling', gruppe: 'insekten', e: '🦋', img: null, name: { de: 'Schmetterling', ru: 'Бабочка', en: 'Butterfly' } },
  { id: 'biene',         gruppe: 'insekten', e: '🐝', img: null, name: { de: 'Biene', ru: 'Пчела', en: 'Bee' } },
  { id: 'ameise',        gruppe: 'insekten', e: '🐜', img: null, name: { de: 'Ameise', ru: 'Муравей', en: 'Ant' } },
  { id: 'marienkaefer',  gruppe: 'insekten', e: '🐞', img: null, name: { de: 'Marienkäfer', ru: 'Божья коровка', en: 'Ladybug' } },
  { id: 'heuschrecke',   gruppe: 'insekten', e: '🦗', img: null, name: { de: 'Heuschrecke', ru: 'Кузнечик', en: 'Grasshopper' } },
  { id: 'kaefer',        gruppe: 'insekten', e: '🪲', img: null, name: { de: 'Käfer', ru: 'Жук', en: 'Beetle' } },

  // Fische
  { id: 'fisch',      gruppe: 'fische', e: '🐟', img: null, name: { de: 'Fisch', ru: 'Рыба', en: 'Fish' } },
  { id: 'goldfisch',  gruppe: 'fische', e: '🐠', img: null, name: { de: 'Goldfisch', ru: 'Золотая рыбка', en: 'Goldfish' } },
  { id: 'hai',        gruppe: 'fische', e: '🦈', img: null, name: { de: 'Hai', ru: 'Акула', en: 'Shark' } },
  { id: 'kugelfisch', gruppe: 'fische', e: '🐡', img: null, name: { de: 'Kugelfisch', ru: 'Рыба-ёж', en: 'Pufferfish' } },
  { id: 'lachs',      gruppe: 'fische', e: '🐟', img: null, name: { de: 'Lachs', ru: 'Лосось', en: 'Salmon' } },
  { id: 'hecht',      gruppe: 'fische', e: '🐟', img: null, name: { de: 'Hecht', ru: 'Щука', en: 'Pike' } },

  // Vögel
  { id: 'adler',   gruppe: 'voegel', e: '🦅', img: null, name: { de: 'Adler', ru: 'Орёл', en: 'Eagle' } },
  { id: 'eule',    gruppe: 'voegel', e: '🦉', img: null, name: { de: 'Eule', ru: 'Сова', en: 'Owl' } },
  { id: 'ente',    gruppe: 'voegel', e: '🦆', img: null, name: { de: 'Ente', ru: 'Утка', en: 'Duck' } },
  { id: 'papagei', gruppe: 'voegel', e: '🦜', img: null, name: { de: 'Papagei', ru: 'Попугай', en: 'Parrot' } },
  { id: 'pinguin', gruppe: 'voegel', e: '🐧', img: null, name: { de: 'Pinguin', ru: 'Пингвин', en: 'Penguin' } },
  { id: 'taube',   gruppe: 'voegel', e: '🕊️', img: null, name: { de: 'Taube', ru: 'Голубь', en: 'Pigeon' } },

  // Säugetiere
  { id: 'hund',    gruppe: 'saeugetiere', e: '🐶', img: null, name: { de: 'Hund', ru: 'Собака', en: 'Dog' } },
  { id: 'katze',   gruppe: 'saeugetiere', e: '🐱', img: null, name: { de: 'Katze', ru: 'Кошка', en: 'Cat' } },
  { id: 'loewe',   gruppe: 'saeugetiere', e: '🦁', img: null, name: { de: 'Löwe', ru: 'Лев', en: 'Lion' } },
  { id: 'elefant', gruppe: 'saeugetiere', e: '🐘', img: null, name: { de: 'Elefant', ru: 'Слон', en: 'Elephant' } },
  { id: 'pferd',   gruppe: 'saeugetiere', e: '🐴', img: null, name: { de: 'Pferd', ru: 'Лошадь', en: 'Horse' } },
  { id: 'wal',     gruppe: 'saeugetiere', e: '🐋', img: null, name: { de: 'Wal', ru: 'Кит', en: 'Whale' } }
];

const T = {
  beispiel: { de: 'Beispiel', ru: 'Пример', en: 'Example' },
  tiere:    { de: 'Tiere', ru: 'животных', en: 'animals' },
  fehler:   { de: 'Fehler', ru: 'ошибки', en: 'mistakes' },
  geschafft: { de: 'Geschafft!', ru: 'Получилось!', en: 'You did it!' }
};

function sprache(app) {
  return (app && typeof app.get === 'function') ? (app.get('sprache') || 'de') : 'de';
}
function tt(app, o) {
  const l = sprache(app);
  return (o && (o[l] || o.de)) || '';
}
function tierVonId(id) { return TIERE.find(t => t.id === id); }
function gruppeVonId(id) { return GROUPS.find(g => g.id === id); }

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Rückmeldung, die erklärt, WARUM ein Tier in die Gruppe gehört. */
function gutText(app, tier, gruppe) {
  const l = sprache(app);
  const t = tt(app, tier.name), g = tt(app, gruppe.name), m = tt(app, gruppe.merkmal);
  if (l === 'ru') return `${t} — правильно! Это «${g}», так как ${m}.`;
  if (l === 'en') return `${t} — correct! It belongs to ${g}, because ${m}.`;
  return `${t} — richtig! Gehört zu „${g}“, denn ${m}.`;
}
function falschText(app, tier, versuch, richtig) {
  const l = sprache(app);
  const t = tt(app, tier.name), v = tt(app, versuch.name), r = tt(app, richtig.name);
  if (l === 'ru') return `${t} — нет. Это не «${v}», а «${r}».`;
  if (l === 'en') return `${t} — no. Not ${v}, but ${r}.`;
  return `${t} — nein. Gehört nicht zu „${v}“, sondern zu „${r}“.`;
}

/** Tierkarte: echtes Bild, sonst Platzhalter (Rechteck mit Wort + Emoji). */
function tierKarte(app, tier, x, y, w, h, extra = {}) {
  const p = [];
  const fill = extra.falsch ? '#ffe3e3'
    : extra.selected ? '#eef0ff'
    : '#fff';
  const stroke = extra.falsch ? '#e03131'
    : extra.selected ? '#5b4fcf'
    : '#d8d4f0';
  const sw = (extra.falsch || extra.selected) ? 3 : 1.5;
  p.push(svg.rect(x, y, w, h, fill, { rx: 10, stroke, 'stroke-width': sw }));

  if (extra.badge) {
    p.push(svg.text(x + w / 2, y + 14, extra.badge,
      { 'font-size': 9, 'font-weight': 'bold', fill: '#5b4fcf', 'text-anchor': 'middle' }));
  }

  if (tier.img) {
    p.push(svg.el('image', {
      href: tier.img, x: x + 3, y: y + 3, width: w - 6, height: h - 6,
      preserveAspectRatio: 'xMidYMid slice'
    }));
  } else {
    const emojiSize = h >= 90 ? 34 : (h >= 55 ? 22 : 16);
    const wordSize  = h >= 90 ? 10 : (h >= 70 ? 8 : 7);
    const emojiY = y + (extra.badge ? h * 0.52 : h * 0.46);
    p.push(svg.text(x + w / 2, emojiY, tier.e, { 'font-size': emojiSize, 'text-anchor': 'middle' }));
    if (h >= 50) {
      p.push(svg.text(x + w / 2, y + h - (h >= 90 ? 14 : 8), tt(app, tier.name),
        { 'font-size': wordSize, 'text-anchor': 'middle', fill: '#333'
```

Setze die Anweisungen in der App um; Framework-Vertrag beibehalten.
