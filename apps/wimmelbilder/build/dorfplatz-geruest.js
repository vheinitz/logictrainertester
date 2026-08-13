// Datensatz "dorfplatz" – erzeugt von tools/zuschneiden.py, Fragen noch eintragen.
Wimmelbild.register({
  id: 'dorfplatz',
  titel: 'dorfplatz',
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
    // { nr: 1, frage: 'Wo ist ...?', ziel: '...', x: 0, y: 0 },
  ]
});
