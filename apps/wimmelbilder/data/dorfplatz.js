// Wimmelbild "Dorfplatz" – 50 Fragen.
//
// Die Fragen stammen aus der Tabelle unter dem Bild
// (source/dorfplatz-original.jpg), die Koordinaten von dort sind unbrauchbar
// und deshalb nicht übernommen: Das Blatt nennt einen Raum von 1000x1500
// (hochkant), der Bildbereich ist 1152x934 (quer), die Werte sind lückenlos
// nach y sortiert, laufen bis y=1600 und zeigen bei Stichproben ins Leere –
// der Fußball steht mit (840,380) auf einem Hausdach statt unten in der Wiese.
//
// Eingetragen sind die sieben Stellen, die sich im Bild zweifelsfrei
// wiederfinden lassen – drei davon mit mehreren Punkten: die Laterne ist zu
// hoch für einen Punkt, Drachen und Pilz gibt es mehrfach. Die übrigen 43
// Fragen haben keine Stelle; etliche davon beschreiben Dinge, die im Bild gar
// nicht vorkommen (ein Segelboot etwa, oder ein Fernglas – da steht ein
// Fernrohr). Solche Fragen setzt man im Editor oder löscht sie.
//
// Zum Nachschlagen die ursprüngliche Tabelle, Format (x,y) im Raum 1000x1500:
//    1. ( 210,  80)  Wo ist der rote Luftballon?
//    2. (  80, 120)  Wo ist die Katze auf dem Dachfirst?
//    3. ( 340, 190)  Wo ist der Gartenzwerg?
//    4. ( 120, 250)  Wo ist der gelbe Regenschirm?
//    5. ( 670, 180)  Wo ist der Briefkasten?
//    6. ( 890, 220)  Wo ist der Hund im Korb?
//    7. (  40, 310)  Wo ist die rote Rose?
//    8. ( 190, 490)  Wo ist der Frosch am Teich?
//    9. ( 310, 460)  Wo ist die Gießkanne?
//   10. ( 510, 120)  Wo ist der Bienenstock?
//   11. ( 430, 280)  Wo ist der Schmetterling?
//   12. ( 760, 260)  Wo ist die alte Laterne?
//   13. ( 840, 380)  Wo ist der Fußball?
//   14. ( 280, 340)  Wo ist der Hut auf dem Kopf einer Person?
//   15. ( 920, 490)  Wo ist das Fernglas?
//   16. ( 770, 550)  Wo ist die Angelrute?
//   17. ( 680, 620)  Wo ist der Picknickkorb?
//   18. ( 160, 660)  Wo ist das Segelboot?
//   19. ( 760, 680)  Wo ist der Hammer?
//   20. ( 490, 720)  Wo ist die Eule?
//   21. ( 330, 780)  Wo ist der Drachen?
//   22. ( 910, 790)  Wo ist die Lupe?
//   23. ( 800, 820)  Wo ist der Kürbis?
//   24. ( 620, 840)  Wo ist das Buch?
//   25. ( 250, 910)  Wo ist die Gartenschere?
//   26. ( 930, 870)  Wo ist der rote Feuerhydrant?
//   27. ( 380, 930)  Wo ist die Maus?
//   28. ( 720, 950)  Wo ist der Kochlöffel?
//   29. ( 110,1010)  Wo ist das Vogelnest?
//   30. ( 830,1040)  Wo ist die Taschenlampe?
//   31. ( 290,1070)  Wo ist der Marienkäfer?
//   32. ( 570,1100)  Wo ist der Globus?
//   33. ( 940,1120)  Wo ist die Wäscheklammer?
//   34. ( 190,1180)  Wo ist der Pinsel?
//   35. ( 680,1210)  Wo ist der Schlüssel?
//   36. ( 410,1240)  Wo ist die Spinne?
//   37. ( 860,1270)  Wo ist der Wecker?
//   38. (  50,1290)  Wo ist der Pilz?
//   39. ( 730,1320)  Wo ist das Lineal?
//   40. ( 270,1350)  Wo ist der Schuhanzieher?
//   41. ( 520,1380)  Wo ist die Seifenblase?
//   42. ( 890,1410)  Wo ist der Kompass?
//   43. ( 140,1430)  Wo ist die Perle?
//   44. ( 640,1460)  Wo ist der Tennisball?
//   45. ( 360,1490)  Wo ist das Notizbuch?
//   46. ( 780,1520)  Wo ist die Trillerpfeife?
//   47. (  20,1540)  Wo ist der Korken?
//   48. ( 470,1560)  Wo ist das Hufeisen?
//   49. ( 810,1580)  Wo ist die Glühbirne?
//   50. ( 950,1600)  Wo ist der Schraubenzieher?

Wimmelbild.register({
  id: 'dorfplatz',
  titel: 'Dorfplatz',
  untertitel: 'Wimmelbild – 100 Gegenstände & Figuren',
  bild: 'images/dorfplatz.jpg',
  bildGroesse: { breite: 1152, hoehe: 934 },
  koordinatenRaum: { breite: 1152, hoehe: 934 },
  toleranz: 0.06,
  quelle: {
    datei: 'source/dorfplatz-original.jpg',
    zuschnitt: { x: 0, y: 117, breite: 1152, hoehe: 934 }
  },
  fragen: [
    { nr:  1, frage: 'Wo ist der rote Luftballon?',                       punkte: [{ x: 582, y: 52 }] },
    { nr:  2, frage: 'Wo ist die Katze auf dem Dachfirst?',               punkte: [] },
    { nr:  3, frage: 'Wo ist der Gartenzwerg?',                           punkte: [] },
    { nr:  4, frage: 'Wo ist der gelbe Regenschirm?',                     punkte: [] },
    { nr:  5, frage: 'Wo ist der Briefkasten?',                           punkte: [] },
    { nr:  6, frage: 'Wo ist der Hund im Korb?',                          punkte: [] },
    { nr:  7, frage: 'Wo ist die rote Rose?',                             punkte: [] },
    { nr:  8, frage: 'Wo ist der Frosch am Teich?',                       punkte: [] },
    { nr:  9, frage: 'Wo ist die Gießkanne?',                             punkte: [{ x: 182, y: 644 }] },
    { nr: 10, frage: 'Wo ist der Bienenstock?',                           punkte: [] },
    { nr: 11, frage: 'Wo ist der Schmetterling?',                         punkte: [] },
    { nr: 12, frage: 'Wo ist die alte Laterne?',                          punkte: [{ x: 260, y: 225 }, { x: 260, y: 300 }, { x: 260, y: 372 }] },
    { nr: 13, frage: 'Wo ist der Fußball?',                               punkte: [{ x: 746, y: 904 }] },
    { nr: 14, frage: 'Wo ist der Hut auf dem Kopf einer Person?',         punkte: [] },
    { nr: 15, frage: 'Wo ist das Fernglas?',                              punkte: [] },
    { nr: 16, frage: 'Wo ist die Angelrute?',                             punkte: [] },
    { nr: 17, frage: 'Wo ist der Picknickkorb?',                          punkte: [] },
    { nr: 18, frage: 'Wo ist das Segelboot?',                             punkte: [] },
    { nr: 19, frage: 'Wo ist der Hammer?',                                punkte: [] },
    { nr: 20, frage: 'Wo ist die Eule?',                                  punkte: [] },
    { nr: 21, frage: 'Wo ist der Drachen?',                               punkte: [{ x: 150, y: 579 }, { x: 205, y: 581 }] },
    { nr: 22, frage: 'Wo ist die Lupe?',                                  punkte: [] },
    { nr: 23, frage: 'Wo ist der Kürbis?',                                punkte: [] },
    { nr: 24, frage: 'Wo ist das Buch?',                                  punkte: [] },
    { nr: 25, frage: 'Wo ist die Gartenschere?',                          punkte: [] },
    { nr: 26, frage: 'Wo ist der rote Feuerhydrant?',                     punkte: [{ x: 1102, y: 430 }] },
    { nr: 27, frage: 'Wo ist die Maus?',                                  punkte: [] },
    { nr: 28, frage: 'Wo ist der Kochlöffel?',                            punkte: [] },
    { nr: 29, frage: 'Wo ist das Vogelnest?',                             punkte: [] },
    { nr: 30, frage: 'Wo ist die Taschenlampe?',                          punkte: [] },
    { nr: 31, frage: 'Wo ist der Marienkäfer?',                           punkte: [] },
    { nr: 32, frage: 'Wo ist der Globus?',                                punkte: [] },
    { nr: 33, frage: 'Wo ist die Wäscheklammer?',                         punkte: [] },
    { nr: 34, frage: 'Wo ist der Pinsel?',                                punkte: [] },
    { nr: 35, frage: 'Wo ist der Schlüssel?',                             punkte: [] },
    { nr: 36, frage: 'Wo ist die Spinne?',                                punkte: [] },
    { nr: 37, frage: 'Wo ist der Wecker?',                                punkte: [] },
    { nr: 38, frage: 'Wo ist der Pilz?',                                  punkte: [{ x: 842, y: 750 }, { x: 869, y: 755 }] },
    { nr: 39, frage: 'Wo ist das Lineal?',                                punkte: [] },
    { nr: 40, frage: 'Wo ist der Schuhanzieher?',                         punkte: [] },
    { nr: 41, frage: 'Wo ist die Seifenblase?',                           punkte: [] },
    { nr: 42, frage: 'Wo ist der Kompass?',                               punkte: [] },
    { nr: 43, frage: 'Wo ist die Perle?',                                 punkte: [] },
    { nr: 44, frage: 'Wo ist der Tennisball?',                            punkte: [] },
    { nr: 45, frage: 'Wo ist das Notizbuch?',                             punkte: [] },
    { nr: 46, frage: 'Wo ist die Trillerpfeife?',                         punkte: [] },
    { nr: 47, frage: 'Wo ist der Korken?',                                punkte: [] },
    { nr: 48, frage: 'Wo ist das Hufeisen?',                              punkte: [] },
    { nr: 49, frage: 'Wo ist die Glühbirne?',                             punkte: [] },
    { nr: 50, frage: 'Wo ist der Schraubenzieher?',                       punkte: [] }
  ]
});
