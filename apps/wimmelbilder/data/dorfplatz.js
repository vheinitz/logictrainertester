// Wimmelbild "Dorfplatz" – 50 Fragen.
//
// Fragen und Koordinaten stammen aus der Tabelle unter dem Bild
// (source/dorfplatz-original.jpg), abgelesen und hier eingetragen.
//
// ACHTUNG: koordinatenGeprueft ist false. Die Koordinaten aus der Tabelle
// stimmen nicht mit dem Bild überein – das Blatt nennt einen Koordinatenraum
// von 1000x1500 (hochkant), der Bildbereich ist aber 1152x934 (quer), und die
// Werte sind durchgehend nach y sortiert, laufen bis y=1600 und zeigen bei
// Stichproben ins Leere. Sie sind als Platzhalter eingetragen; die richtigen
// Stellen setzt man im Kalibrier-Modus der App und exportiert die Datei neu.

Wimmelbild.register({
  id: 'dorfplatz',
  titel: 'Dorfplatz',
  untertitel: 'Wimmelbild – 100 Gegenstände & Figuren',
  bild: 'images/dorfplatz.jpg',
  bildGroesse: { breite: 1152, hoehe: 934 },
  koordinatenRaum: { breite: 1000, hoehe: 1500 },
  toleranz: 0.06,
  koordinatenGeprueft: false,
  quelle: {
    datei: 'source/dorfplatz-original.jpg',
    zuschnitt: { x: 0, y: 117, breite: 1152, hoehe: 934 }
  },
  fragen: [
    { nr:  1, frage: 'Wo ist der rote Luftballon?',              ziel: 'roter Luftballon',            x: 210, y:   80 },
    { nr:  2, frage: 'Wo ist die Katze auf dem Dachfirst?',      ziel: 'Katze auf dem Dachfirst',     x:  80, y:  120 },
    { nr:  3, frage: 'Wo ist der Gartenzwerg?',                  ziel: 'Gartenzwerg',                 x: 340, y:  190 },
    { nr:  4, frage: 'Wo ist der gelbe Regenschirm?',            ziel: 'gelber Regenschirm',          x: 120, y:  250 },
    { nr:  5, frage: 'Wo ist der Briefkasten?',                  ziel: 'Briefkasten',                 x: 670, y:  180 },
    { nr:  6, frage: 'Wo ist der Hund im Korb?',                 ziel: 'Hund im Korb',                x: 890, y:  220 },
    { nr:  7, frage: 'Wo ist die rote Rose?',                    ziel: 'rote Rose',                   x:  40, y:  310 },
    { nr:  8, frage: 'Wo ist der Frosch am Teich?',              ziel: 'Frosch am Teich',             x: 190, y:  490 },
    { nr:  9, frage: 'Wo ist die Gießkanne?',                    ziel: 'Gießkanne',                   x: 310, y:  460 },
    { nr: 10, frage: 'Wo ist der Bienenstock?',                  ziel: 'Bienenstock',                 x: 510, y:  120 },
    { nr: 11, frage: 'Wo ist der Schmetterling?',                ziel: 'Schmetterling',               x: 430, y:  280 },
    { nr: 12, frage: 'Wo ist die alte Laterne?',                 ziel: 'alte Laterne',                x: 760, y:  260 },
    { nr: 13, frage: 'Wo ist der Fußball?',                      ziel: 'Fußball',                     x: 840, y:  380 },
    { nr: 14, frage: 'Wo ist der Hut auf dem Kopf einer Person?', ziel: 'Hut auf dem Kopf',           x: 280, y:  340 },
    { nr: 15, frage: 'Wo ist das Fernglas?',                     ziel: 'Fernglas',                    x: 920, y:  490 },
    { nr: 16, frage: 'Wo ist die Angelrute?',                    ziel: 'Angelrute',                   x: 770, y:  550 },
    { nr: 17, frage: 'Wo ist der Picknickkorb?',                 ziel: 'Picknickkorb',                x: 680, y:  620 },
    { nr: 18, frage: 'Wo ist das Segelboot?',                    ziel: 'Segelboot',                   x: 160, y:  660 },
    { nr: 19, frage: 'Wo ist der Hammer?',                       ziel: 'Hammer',                      x: 760, y:  680 },
    { nr: 20, frage: 'Wo ist die Eule?',                         ziel: 'Eule',                        x: 490, y:  720 },
    { nr: 21, frage: 'Wo ist der Drachen?',                      ziel: 'Drachen',                     x: 330, y:  780 },
    { nr: 22, frage: 'Wo ist die Lupe?',                         ziel: 'Lupe',                        x: 910, y:  790 },
    { nr: 23, frage: 'Wo ist der Kürbis?',                       ziel: 'Kürbis',                      x: 800, y:  820 },
    { nr: 24, frage: 'Wo ist das Buch?',                         ziel: 'Buch',                        x: 620, y:  840 },
    { nr: 25, frage: 'Wo ist die Gartenschere?',                 ziel: 'Gartenschere',                x: 250, y:  910 },
    { nr: 26, frage: 'Wo ist der rote Feuerhydrant?',            ziel: 'roter Feuerhydrant',          x: 930, y:  870 },
    { nr: 27, frage: 'Wo ist die Maus?',                         ziel: 'Maus',                        x: 380, y:  930 },
    { nr: 28, frage: 'Wo ist der Kochlöffel?',                   ziel: 'Kochlöffel',                  x: 720, y:  950 },
    { nr: 29, frage: 'Wo ist das Vogelnest?',                    ziel: 'Vogelnest',                   x: 110, y: 1010 },
    { nr: 30, frage: 'Wo ist die Taschenlampe?',                 ziel: 'Taschenlampe',                x: 830, y: 1040 },
    { nr: 31, frage: 'Wo ist der Marienkäfer?',                  ziel: 'Marienkäfer',                 x: 290, y: 1070 },
    { nr: 32, frage: 'Wo ist der Globus?',                       ziel: 'Globus',                      x: 570, y: 1100 },
    { nr: 33, frage: 'Wo ist die Wäscheklammer?',                ziel: 'Wäscheklammer',               x: 940, y: 1120 },
    { nr: 34, frage: 'Wo ist der Pinsel?',                       ziel: 'Pinsel',                      x: 190, y: 1180 },
    { nr: 35, frage: 'Wo ist der Schlüssel?',                    ziel: 'Schlüssel',                   x: 680, y: 1210 },
    { nr: 36, frage: 'Wo ist die Spinne?',                       ziel: 'Spinne',                      x: 410, y: 1240 },
    { nr: 37, frage: 'Wo ist der Wecker?',                       ziel: 'Wecker',                      x: 860, y: 1270 },
    { nr: 38, frage: 'Wo ist der Pilz?',                         ziel: 'Pilz',                        x:  50, y: 1290 },
    { nr: 39, frage: 'Wo ist das Lineal?',                       ziel: 'Lineal',                      x: 730, y: 1320 },
    { nr: 40, frage: 'Wo ist der Schuhanzieher?',                ziel: 'Schuhanzieher',               x: 270, y: 1350 },
    { nr: 41, frage: 'Wo ist die Seifenblase?',                  ziel: 'Seifenblase',                 x: 520, y: 1380 },
    { nr: 42, frage: 'Wo ist der Kompass?',                      ziel: 'Kompass',                     x: 890, y: 1410 },
    { nr: 43, frage: 'Wo ist die Perle?',                        ziel: 'Perle',                       x: 140, y: 1430 },
    { nr: 44, frage: 'Wo ist der Tennisball?',                   ziel: 'Tennisball',                  x: 640, y: 1460 },
    { nr: 45, frage: 'Wo ist das Notizbuch?',                    ziel: 'Notizbuch',                   x: 360, y: 1490 },
    { nr: 46, frage: 'Wo ist die Trillerpfeife?',                ziel: 'Trillerpfeife',               x: 780, y: 1520 },
    { nr: 47, frage: 'Wo ist der Korken?',                       ziel: 'Korken',                      x:  20, y: 1540 },
    { nr: 48, frage: 'Wo ist das Hufeisen?',                     ziel: 'Hufeisen',                    x: 470, y: 1560 },
    { nr: 49, frage: 'Wo ist die Glühbirne?',                    ziel: 'Glühbirne',                   x: 810, y: 1580 },
    { nr: 50, frage: 'Wo ist der Schraubenzieher?',              ziel: 'Schraubenzieher',             x: 950, y: 1600 }
  ]
});
