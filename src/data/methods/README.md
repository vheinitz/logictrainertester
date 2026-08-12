# Fördermethoden – Seitenformat

Eine Datei je Methode, Dateiname = `id` + `.js`. Der Index
(`src/data/methods/index.js`) wird beim Build aus diesem Verzeichnis erzeugt
(`node tools/gen-method-index.mjs`) – neue Dateien brauchen also nirgends
eingetragen zu werden.

## Schema

```js
export default {
  id: 'loci-methode',              // = Dateiname, kebab-case, muss eindeutig sein
  icon: '🏛️',                      // ein Emoji
  category: 'gedaechtnis',         // siehe CATEGORIES in index.js
  ages: '8-18',                    // Altersband, für das es taugt

  title: { de: '…', ru: '…', en: '' },
  short: { de: '…', ru: '…', en: '' },   // EIN Satz, erscheint in Listen
  what:  { de: '…', ru: '…', en: '' },   // 2–4 Sätze: was es ist, warum es wirkt
  steps: { de: ['…'], ru: ['…'], en: [] },  // Anleitung, 4–8 Schritte
  tips:  { de: ['…'], ru: ['…'], en: [] },  // optional

  links: [
    { url: 'https://de.wikipedia.org/wiki/…',
      kind: 'wiki',                // wiki | anleitung | hersteller | community | video
      label: { de: '…', ru: '…', en: '' } }
  ],

  products: [
    { name: 'N1 Musterwürfel',
      maker: 'Nikitin / Westermann',
      url: 'https://…',            // Bezugsquelle oder Herstellerseite
      price: 'ca. 40 €',           // optional, grob
      note: { de: '…', ru: '…', en: '' },
      diy:  { de: '…', ru: '…', en: '' },   // Selbstbau, oder weglassen
      svg: '<svg …>' }             // optional, siehe unten
  ],

  svg: '<svg …>'                   // optional, Illustration der Methode
};
```

## Bilder

Produktfotos lassen sich nicht mitliefern: die App läuft offline aus einem
Bundle, und fremde Fotos wären urheberrechtlich nicht frei. Deshalb
**selbstgezeichnete schematische SVG** – bei Nikitin-Würfeln, Tangram oder
Story Cubes zeigt eine Schemazeichnung ohnehin mehr als ein Werbefoto. Wer das
echte Produkt sehen will, folgt dem Herstellerlink.

Regeln für `svg`:
- `viewBox="0 0 120 80"`, keine `width`/`height`-Attribute
- keine externen Referenzen, keine `<image>`, keine Schriftarten
- Farben als Hex oder `var(--primary)` etc., damit es zum Erscheinungsbild passt
- schlicht halten: wenige Formen, erkennbar auf 120 px Breite

Fehlt `svg`, zeigt die Seite das `icon`-Emoji.

## Sprachen

`de` und `ru` sind Pflicht, `en` bleibt vorerst leer (`''` bzw. `[]`) – die
englische Fassung ist ein eigener Arbeitsschritt. Die Ansicht fällt bei
fehlendem Text auf Deutsch zurück.

## Links

Nur echte, geprüfte URLs. Lieber drei belastbare Links als zehn geratene.
Bevorzugt: Wikipedia (Sprache passend), Herstellerseite, eine gute
Anleitung/Community. Keine Affiliate-Links, keine Shops ohne Bezug zum
Hersteller, wenn es die Herstellerseite auch tut.
