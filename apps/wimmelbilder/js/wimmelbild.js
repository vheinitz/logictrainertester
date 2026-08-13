/* Wimmelbild – Kern: Registrierung der Bildsätze, Koordinatenrechnung,
   Kalibrierung, Spielrunde und Auswertung. Kein Build, keine Abhängigkeiten,
   läuft direkt aus dem Dateisystem (file://).

   Ein Bildsatz sieht so aus:

     {
       id, titel, untertitel,
       bild,                             Pfad zum zugeschnittenen Bildbereich
       bildGroesse:      { breite, hoehe },   Pixelmaße dieses Bildes
       koordinatenRaum:  { breite, hoehe },   Raum, in dem x/y der Fragen liegen
       toleranz,                         Trefferradius als Anteil der kurzen Bildseite
       koordinatenGeprueft,              true, wenn die Ziele nachgemessen sind
       quelle: { datei, zuschnitt },     Herkunft, nur zur Dokumentation
       fragen: [ { nr, frage, ziel, x, y, toleranz? } ]
     }

   x/y stehen immer im koordinatenRaum des Blattes, nicht in Bildpixeln. Der
   Kern rechnet daraus relative Koordinaten (0..1) und daraus Bildpixel. So
   lassen sich weitere Blätter mit ganz anderen Maßen anhängen, ohne dass die
   App etwas davon merkt. */

var Wimmelbild = (function () {
  'use strict';

  var saetze = [];
  var SPEICHER_PRAEFIX = 'wimmelbild.kalibrierung.';

  /* ---------------------------------------------------------------- Sätze */

  function register(satz) {
    var fehler = pruefen(satz);
    if (fehler) {
      console.error('Wimmelbild: Datensatz verworfen – ' + fehler, satz);
      return;
    }
    var fertig = {
      id: satz.id,
      titel: satz.titel || satz.id,
      untertitel: satz.untertitel || '',
      bild: satz.bild,
      bildGroesse: satz.bildGroesse,
      koordinatenRaum: satz.koordinatenRaum || satz.bildGroesse,
      toleranz: typeof satz.toleranz === 'number' ? satz.toleranz : 0.06,
      koordinatenGeprueft: satz.koordinatenGeprueft === true,
      quelle: satz.quelle || null,
      fragen: satz.fragen.map(function (f, i) {
        return {
          nr: typeof f.nr === 'number' ? f.nr : i + 1,
          frage: f.frage,
          ziel: f.ziel || f.frage,
          x: f.x,
          y: f.y,
          toleranz: typeof f.toleranz === 'number' ? f.toleranz : null
        };
      })
    };
    saetze.push(fertig);
    return fertig;
  }

  function pruefen(satz) {
    if (!satz || typeof satz !== 'object') return 'kein Objekt';
    if (!satz.id) return 'id fehlt';
    if (!satz.bild) return 'bild fehlt';
    if (!satz.bildGroesse || !satz.bildGroesse.breite || !satz.bildGroesse.hoehe) {
      return 'bildGroesse fehlt oder unvollständig';
    }
    if (!Array.isArray(satz.fragen) || satz.fragen.length === 0) return 'keine Fragen';
    for (var i = 0; i < satz.fragen.length; i++) {
      var f = satz.fragen[i];
      if (!f.frage) return 'Frage ' + (i + 1) + ' ohne Text';
      if (typeof f.x !== 'number' || typeof f.y !== 'number') {
        return 'Frage ' + (i + 1) + ' ohne Koordinaten';
      }
    }
    if (saetze.some(function (s) { return s.id === satz.id; })) return 'id doppelt: ' + satz.id;
    return null;
  }

  function alle() { return saetze.slice(); }

  function get(id) {
    for (var i = 0; i < saetze.length; i++) if (saetze[i].id === id) return saetze[i];
    return null;
  }

  /* -------------------------------------------------------- Kalibrierung */

  /* Nachgemessene Ziele liegen im localStorage, damit die Datendatei nicht
     angefasst werden muss. Über den Export in der App wandern sie dann fest
     in data/<id>.js. Format: { "<nr>": { x, y } } im koordinatenRaum. */

  function kalibrierungLesen(satzId) {
    try {
      var roh = window.localStorage.getItem(SPEICHER_PRAEFIX + satzId);
      return roh ? JSON.parse(roh) : {};
    } catch (e) {
      return {};
    }
  }

  function kalibrierungSchreiben(satzId, daten) {
    try {
      window.localStorage.setItem(SPEICHER_PRAEFIX + satzId, JSON.stringify(daten));
      return true;
    } catch (e) {
      return false;
    }
  }

  function kalibrierungSetzen(satzId, nr, x, y) {
    var daten = kalibrierungLesen(satzId);
    daten[String(nr)] = { x: Math.round(x), y: Math.round(y) };
    kalibrierungSchreiben(satzId, daten);
    return daten;
  }

  function kalibrierungLoeschen(satzId, nr) {
    var daten = kalibrierungLesen(satzId);
    if (nr === undefined) {
      try { window.localStorage.removeItem(SPEICHER_PRAEFIX + satzId); } catch (e) { /* egal */ }
      return {};
    }
    delete daten[String(nr)];
    kalibrierungSchreiben(satzId, daten);
    return daten;
  }

  /* ------------------------------------------------------- Koordinaten */

  /* Ziel einer Frage in Bildpixeln, Kalibrierung eingerechnet. */
  function ziel(satz, frage, kalibrierung) {
    var k = kalibrierung && kalibrierung[String(frage.nr)];
    var x = k ? k.x : frage.x;
    var y = k ? k.y : frage.y;
    var rx = x / satz.koordinatenRaum.breite;
    var ry = y / satz.koordinatenRaum.hoehe;
    return {
      rx: rx,
      ry: ry,
      px: rx * satz.bildGroesse.breite,
      py: ry * satz.bildGroesse.hoehe,
      geprueft: !!k || satz.koordinatenGeprueft,
      ausserhalb: rx < 0 || rx > 1 || ry < 0 || ry > 1
    };
  }

  /* Trefferradius in Bildpixeln. */
  function radius(satz, frage) {
    var anteil = frage && frage.toleranz !== null && frage.toleranz !== undefined
      ? frage.toleranz : satz.toleranz;
    return anteil * Math.min(satz.bildGroesse.breite, satz.bildGroesse.hoehe);
  }

  /* ------------------------------------------------------------- Runde */

  function mischen(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* optionen: { anzahl, zufall, zeitProFrage } */
  function runde(satz, optionen) {
    var opt = optionen || {};
    var kalibrierung = kalibrierungLesen(satz.id);
    var pool = opt.zufall === false ? satz.fragen.slice() : mischen(satz.fragen);
    var anzahl = opt.anzahl && opt.anzahl > 0 ? Math.min(opt.anzahl, pool.length) : pool.length;
    var fragen = pool.slice(0, anzahl);

    return {
      satz: satz,
      kalibrierung: kalibrierung,
      fragen: fragen,
      zeitProFrage: opt.zeitProFrage || 0,
      index: 0,
      antworten: [],
      begonnen: 0,
      frageBegonnen: 0,

      aktuell: function () { return this.fragen[this.index] || null; },
      fertig: function () { return this.index >= this.fragen.length; },

      starten: function () {
        this.begonnen = Date.now();
        this.frageBegonnen = this.begonnen;
        return this;
      },

      ziel: function (frage) { return ziel(this.satz, frage || this.aktuell(), this.kalibrierung); },
      radius: function (frage) { return radius(this.satz, frage || this.aktuell()); },

      /* Klick in Bildpixeln bewerten. Liefert den Antwortsatz zurück. */
      pruefen: function (px, py) {
        var frage = this.aktuell();
        if (!frage) return null;
        var z = this.ziel(frage);
        var r = this.radius(frage);
        var abstand = px === null ? Infinity
          : Math.sqrt(Math.pow(px - z.px, 2) + Math.pow(py - z.py, 2));
        var antwort = {
          frage: frage,
          ziel: z,
          radius: r,
          klick: px === null ? null : { px: px, py: py },
          abstand: abstand,
          richtig: abstand <= r,
          uebersprungen: px === null,
          dauer: Date.now() - this.frageBegonnen
        };
        this.antworten.push(antwort);
        this.index++;
        this.frageBegonnen = Date.now();
        return antwort;
      },

      ueberspringen: function () { return this.pruefen(null, null); },

      auswertung: function () {
        var richtig = 0, gesamtzeit = 0, uebersprungen = 0;
        var schnellste = null, langsamste = null;
        this.antworten.forEach(function (a) {
          if (a.richtig) richtig++;
          if (a.uebersprungen) uebersprungen++;
          gesamtzeit += a.dauer;
          if (a.richtig) {
            if (!schnellste || a.dauer < schnellste.dauer) schnellste = a;
            if (!langsamste || a.dauer > langsamste.dauer) langsamste = a;
          }
        });
        var n = this.antworten.length;
        return {
          gesamt: n,
          richtig: richtig,
          falsch: n - richtig - uebersprungen,
          uebersprungen: uebersprungen,
          quote: n ? richtig / n : 0,
          gesamtzeit: gesamtzeit,
          schnitt: n ? gesamtzeit / n : 0,
          schnellste: schnellste,
          langsamste: langsamste,
          antworten: this.antworten.slice()
        };
      }
    };
  }

  /* ------------------------------------------------------------ Export */

  /* Schreibt den Satz mit eingerechneter Kalibrierung als data/<id>.js zurück. */
  function alsQuelltext(satz, kalibrierung) {
    var k = kalibrierung || kalibrierungLesen(satz.id);
    var offen = satz.fragen.filter(function (f) { return !k[String(f.nr)]; }).length;
    var geprueft = offen === 0;
    var zeilen = satz.fragen.map(function (f) {
      var e = k[String(f.nr)];
      var x = e ? e.x : f.x;
      var y = e ? e.y : f.y;
      return '    { nr: ' + fuell(String(f.nr), 2) +
        ', frage: ' + fuellRechts(hoch(f.frage) + ',', 48) +
        ' ziel: ' + fuellRechts(hoch(f.ziel) + ',', 34) +
        ' x: ' + fuell(String(x), 4) + ', y: ' + fuell(String(y), 4) + ' }';
    });
    return '// Wimmelbild "' + satz.titel + '" – ' + satz.fragen.length + ' Fragen.\n' +
      '// Erzeugt vom Kalibrier-Modus der App.' +
      (geprueft ? ' Alle Ziele nachgemessen.' : ' Noch ' + offen + ' Ziel(e) ungeprüft.') + '\n\n' +
      'Wimmelbild.register({\n' +
      '  id: ' + hoch(satz.id) + ',\n' +
      '  titel: ' + hoch(satz.titel) + ',\n' +
      '  untertitel: ' + hoch(satz.untertitel) + ',\n' +
      '  bild: ' + hoch(satz.bild) + ',\n' +
      '  bildGroesse: { breite: ' + satz.bildGroesse.breite + ', hoehe: ' + satz.bildGroesse.hoehe + ' },\n' +
      '  koordinatenRaum: { breite: ' + satz.koordinatenRaum.breite + ', hoehe: ' + satz.koordinatenRaum.hoehe + ' },\n' +
      '  toleranz: ' + satz.toleranz + ',\n' +
      '  koordinatenGeprueft: ' + geprueft + ',\n' +
      (satz.quelle ? '  quelle: ' + JSON.stringify(satz.quelle) + ',\n' : '') +
      '  fragen: [\n' + zeilen.join(',\n') + '\n  ]\n});\n';
  }

  function hoch(s) { return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }
  function fuell(s, n) { while (s.length < n) s = ' ' + s; return s; }
  function fuellRechts(s, n) { while (s.length < n) s = s + ' '; return s; }

  return {
    register: register,
    alle: alle,
    get: get,
    runde: runde,
    ziel: ziel,
    radius: radius,
    mischen: mischen,
    kalibrierungLesen: kalibrierungLesen,
    kalibrierungSetzen: kalibrierungSetzen,
    kalibrierungLoeschen: kalibrierungLoeschen,
    alsQuelltext: alsQuelltext
  };
})();
