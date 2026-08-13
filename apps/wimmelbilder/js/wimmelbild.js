/* Wimmelbild – Kern: Bildsätze verwalten, Koordinaten rechnen, Runde spielen,
   Fragen einlesen und wieder ausgeben. Kein Build, keine Abhängigkeiten, läuft
   direkt aus dem Dateisystem (file://).

   Ein Bildsatz sieht so aus:

     {
       id, titel, untertitel,
       bild,                             Pfad zum Bild oder data:-URI
       bildDatei,                        Wunschname beim Export, z. B. images/x.jpg
       bildGroesse:      { breite, hoehe },   Pixelmaße des Bildes
       koordinatenRaum:  { breite, hoehe },   Raum, in dem x/y der Fragen liegen
       toleranz,                         Trefferradius als Anteil der kurzen Bildseite
       koordinatenGeprueft,              true, wenn die Ziele nachgemessen sind
       quelle: { datei, zuschnitt },     Herkunft, nur zur Dokumentation
       fragen: [ { nr, frage, ziel, x, y, toleranz? } ]
     }

   x/y stehen immer im koordinatenRaum des Satzes, nicht in Bildpixeln. Der Kern
   rechnet daraus relative Koordinaten (0..1) und daraus Bildpixel. So lassen
   sich Sätze mit ganz anderen Maßen anhängen, ohne dass die App das merkt.

   Sätze kommen aus zwei Quellen: aus den Dateien in data/ (register) und aus
   dem localStorage (im Editor angelegt oder geändert). Ein lokaler Satz mit
   derselben Kennung verdeckt den aus der Datei; verwerfen() nimmt ihn zurück. */

var Wimmelbild = (function () {
  'use strict';

  var SCHLUESSEL = 'wimmelbild.satz.';
  var ALT_SCHLUESSEL = 'wimmelbild.kalibrierung.';

  var ausDatei = [];   // aus data/*.js, unveränderlich
  var ausSpeicher = {};  // aus dem localStorage, nach Kennung

  /* ============================================================ Anlegen */

  function normieren(satz) {
    var groesse = satz.bildGroesse || { breite: 1000, hoehe: 1000 };
    return {
      id: satz.id,
      titel: satz.titel || satz.id,
      untertitel: satz.untertitel || '',
      bild: satz.bild,
      bildDatei: satz.bildDatei || (istDatenUri(satz.bild) ? 'images/' + satz.id + '.jpg' : satz.bild),
      bildGroesse: { breite: groesse.breite, hoehe: groesse.hoehe },
      koordinatenRaum: satz.koordinatenRaum
        ? { breite: satz.koordinatenRaum.breite, hoehe: satz.koordinatenRaum.hoehe }
        : { breite: groesse.breite, hoehe: groesse.hoehe },
      toleranz: typeof satz.toleranz === 'number' ? satz.toleranz : 0.06,
      koordinatenGeprueft: satz.koordinatenGeprueft === true,
      quelle: satz.quelle || null,
      herkunft: satz.herkunft || 'datei',
      bearbeitet: satz.bearbeitet || null,
      fragen: (satz.fragen || []).map(function (f, i) {
        return {
          nr: typeof f.nr === 'number' ? f.nr : i + 1,
          frage: f.frage,
          ziel: f.ziel || zielAusFrage(f.frage),
          x: typeof f.x === 'number' ? f.x : 0,
          y: typeof f.y === 'number' ? f.y : 0,
          gesetzt: f.gesetzt === true,
          toleranz: typeof f.toleranz === 'number' ? f.toleranz : null
        };
      })
    };
  }

  function istDatenUri(s) { return typeof s === 'string' && s.slice(0, 5) === 'data:'; }

  /* Vollständigkeit für Sätze aus data/ – die sollen fertig sein. */
  function pruefen(satz, streng) {
    if (!satz || typeof satz !== 'object') return 'kein Objekt';
    if (!satz.id) return 'id fehlt';
    if (!/^[a-z0-9][a-z0-9-]*$/.test(satz.id)) return 'id nur aus Kleinbuchstaben, Ziffern und Bindestrich';
    if (!satz.bild) return 'bild fehlt';
    if (!satz.bildGroesse || !satz.bildGroesse.breite || !satz.bildGroesse.hoehe) {
      return 'bildGroesse fehlt oder unvollständig';
    }
    if (streng && (!Array.isArray(satz.fragen) || satz.fragen.length === 0)) return 'keine Fragen';
    var fragen = satz.fragen || [];
    for (var i = 0; i < fragen.length; i++) {
      if (!fragen[i].frage) return 'Frage ' + (i + 1) + ' ohne Text';
      if (streng && (typeof fragen[i].x !== 'number' || typeof fragen[i].y !== 'number')) {
        return 'Frage ' + (i + 1) + ' ohne Koordinaten';
      }
    }
    return null;
  }

  /* Wird von den Dateien in data/ aufgerufen. */
  function register(satz) {
    var fehler = pruefen(satz, true);
    if (!fehler && ausDatei.some(function (s) { return s.id === satz.id; })) {
      fehler = 'id doppelt: ' + satz.id;
    }
    if (fehler) {
      console.error('Wimmelbild: Datensatz verworfen – ' + fehler, satz);
      return null;
    }
    var fertig = normieren(satz);
    fertig.herkunft = 'datei';
    fertig.fragen.forEach(function (f) { f.gesetzt = fertig.koordinatenGeprueft; });
    ausDatei.push(fertig);
    return fertig;
  }

  /* Leerer Satz für ein neu hereingereichtes Bild. */
  function neuerSatz(vorgaben) {
    var v = vorgaben || {};
    return normieren({
      id: v.id || 'neues-bild',
      titel: v.titel || 'Neues Bild',
      untertitel: v.untertitel || '',
      bild: v.bild || '',
      bildDatei: v.bildDatei,
      bildGroesse: v.bildGroesse,
      koordinatenRaum: v.koordinatenRaum || v.bildGroesse,
      toleranz: v.toleranz,
      quelle: v.quelle,
      herkunft: 'lokal',
      fragen: v.fragen || []
    });
  }

  /* ============================================================ Speicher */

  function speicher() {
    try {
      window.localStorage.setItem('wimmelbild.probe', '1');
      window.localStorage.removeItem('wimmelbild.probe');
      return window.localStorage;
    } catch (e) {
      return null;
    }
  }

  function ladenAusSpeicher() {
    var s = speicher();
    ausSpeicher = {};
    if (!s) return;
    for (var i = 0; i < s.length; i++) {
      var k = s.key(i);
      if (!k || k.indexOf(SCHLUESSEL) !== 0) continue;
      try {
        var satz = normieren(JSON.parse(s.getItem(k)));
        satz.herkunft = 'lokal';
        ausSpeicher[satz.id] = satz;
      } catch (e) {
        console.error('Wimmelbild: gespeicherter Satz unlesbar – ' + k, e);
      }
    }
  }

  /* Legt den Satz im localStorage ab. Liefert null bei Erfolg, sonst den Grund. */
  function speichern(satz) {
    var fehler = pruefen(satz, false);
    if (fehler) return fehler;
    var s = speicher();
    if (!s) return 'Der Browser lässt keinen lokalen Speicher zu.';
    var fertig = normieren(satz);
    fertig.herkunft = 'lokal';
    fertig.bearbeitet = new Date().toISOString();
    fertig.koordinatenGeprueft = fertig.fragen.length > 0 &&
      fertig.fragen.every(function (f) { return f.gesetzt; });
    try {
      s.setItem(SCHLUESSEL + fertig.id, JSON.stringify(fertig));
    } catch (e) {
      return 'Der lokale Speicher ist voll (das eingebettete Bild ist zu groß). ' +
        'Den Satz als JSON exportieren, dann bleibt er erhalten.';
    }
    ausSpeicher[fertig.id] = fertig;
    return null;
  }

  /* Nimmt die lokale Fassung zurück. Ein Satz aus data/ taucht dann wieder auf. */
  function verwerfen(id) {
    var s = speicher();
    if (s) s.removeItem(SCHLUESSEL + id);
    delete ausSpeicher[id];
  }

  function istLokal(id) { return Object.prototype.hasOwnProperty.call(ausSpeicher, id); }

  function ausDateiVorhanden(id) {
    return ausDatei.some(function (s) { return s.id === id; });
  }

  /* Frühere Fassung legte nur die nachgemessenen Punkte ab. Einmal übernehmen. */
  function altesUebernehmen() {
    var s = speicher();
    if (!s) return;
    var alt = [];
    for (var i = 0; i < s.length; i++) {
      var k = s.key(i);
      if (k && k.indexOf(ALT_SCHLUESSEL) === 0) alt.push(k);
    }
    alt.forEach(function (k) {
      var id = k.slice(ALT_SCHLUESSEL.length);
      var basis = ausDatei.filter(function (x) { return x.id === id; })[0];
      var punkte;
      try { punkte = JSON.parse(s.getItem(k)) || {}; } catch (e) { punkte = {}; }
      s.removeItem(k);
      if (!basis || istLokal(id) || Object.keys(punkte).length === 0) return;
      var kopie = kopieren(basis);
      kopie.fragen.forEach(function (f) {
        var p = punkte[String(f.nr)];
        if (p) { f.x = p.x; f.y = p.y; f.gesetzt = true; }
      });
      speichern(kopie);
    });
  }

  function init() {
    ladenAusSpeicher();
    altesUebernehmen();
  }

  /* ============================================================== Sicht */

  function alle() {
    var liste = ausDatei.map(function (s) { return ausSpeicher[s.id] || s; });
    Object.keys(ausSpeicher).forEach(function (id) {
      if (!ausDateiVorhanden(id)) liste.push(ausSpeicher[id]);
    });
    return liste;
  }

  function get(id) {
    var treffer = alle().filter(function (s) { return s.id === id; });
    return treffer.length ? treffer[0] : null;
  }

  function kopieren(satz) { return normieren(JSON.parse(JSON.stringify(satz))); }

  /* ======================================================== Koordinaten */

  function ziel(satz, frage) {
    var rx = frage.x / satz.koordinatenRaum.breite;
    var ry = frage.y / satz.koordinatenRaum.hoehe;
    return {
      rx: rx,
      ry: ry,
      px: rx * satz.bildGroesse.breite,
      py: ry * satz.bildGroesse.hoehe,
      gesetzt: frage.gesetzt === true,
      ausserhalb: rx < 0 || rx > 1 || ry < 0 || ry > 1
    };
  }

  /* Bildpixel -> Koordinaten im Raum des Satzes. */
  function ausBildpixel(satz, px, py) {
    return {
      x: Math.round(px / satz.bildGroesse.breite * satz.koordinatenRaum.breite),
      y: Math.round(py / satz.bildGroesse.hoehe * satz.koordinatenRaum.hoehe)
    };
  }

  function radius(satz, frage) {
    var anteil = frage && frage.toleranz !== null && frage.toleranz !== undefined
      ? frage.toleranz : satz.toleranz;
    return anteil * Math.min(satz.bildGroesse.breite, satz.bildGroesse.hoehe);
  }

  function offeneZiele(satz) {
    return satz.fragen.filter(function (f) { return !f.gesetzt; }).length;
  }

  /* ============================================================== Runde */

  function mischen(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* optionen: { anzahl, zufall, zeitProFrage, nurGesetzte } */
  function runde(satz, optionen) {
    var opt = optionen || {};
    var pool = satz.fragen.slice();
    if (opt.nurGesetzte) pool = pool.filter(function (f) { return f.gesetzt; });
    if (opt.zufall !== false) pool = mischen(pool);
    var anzahl = opt.anzahl && opt.anzahl > 0 ? Math.min(opt.anzahl, pool.length) : pool.length;

    return {
      satz: satz,
      fragen: pool.slice(0, anzahl),
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

      ziel: function (frage) { return ziel(this.satz, frage || this.aktuell()); },
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
        var schnellste = null;
        this.antworten.forEach(function (a) {
          if (a.richtig) richtig++;
          if (a.uebersprungen) uebersprungen++;
          gesamtzeit += a.dauer;
          if (a.richtig && (!schnellste || a.dauer < schnellste.dauer)) schnellste = a;
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
          antworten: this.antworten.slice()
        };
      }
    };
  }

  /* ============================================================= Import */

  /* "Wo ist der rote Luftballon?" -> "roter Luftballon" */
  function zielAusFrage(text) {
    if (!text) return '';
    var t = String(text).trim().replace(/\s*\?\s*$/, '');
    t = t.replace(/^(wo\s+(ist|sind|liegt|steht|befindet\s+sich)|finde|suche|zeige)\s+/i, '');

    var mit = t.match(/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+(.*)$/i);
    if (mit) {
      t = mit[2];
      /* Ohne Artikel braucht das Adjektiv die starke Endung: aus "der rote
         Luftballon" wird "roter Luftballon", aus "das gelbe Haus" "gelbes
         Haus". Klein geschrieben und auf -e endend heißt Adjektiv –
         Substantive stehen im Deutschen groß und bleiben unberührt. */
      var artikel = mit[1].toLowerCase();
      var endung = artikel === 'der' ? 'er' : (artikel === 'das' ? 'es' : null);
      if (endung) {
        t = t.replace(/^([a-zäöüß]+)e(\s)/, function (ganz, stamm, leer) {
          return stamm + endung + leer;
        });
      }
    }
    return t.trim() || String(text).trim();
  }

  /* Liest eine Frageliste aus Text. Erkannt werden unter anderem:

       1. Wo ist der rote Luftballon? (210,80)
       1) Wo ist die Katze?   210 ; 80
       Wo ist der Pilz?;50;1290
       Wo ist die Eule?                      (ohne Koordinaten)
       1. Wo ist X? (10,20)   26. Wo ist Y? (30,40)   (zweispaltige Tabelle)

     Kopfzeilen der Tabelle und Leerzeilen werden übergangen. */
  function fragenAusText(text) {
    var fragen = [];
    var uebergangen = [];
    var zeilen = String(text || '').split(/\r?\n/);
    /* Eintrag mit Nummer und geklammerten Koordinaten – davon können mehrere
       nebeneinander in einer Zeile stehen. */
    var mehrspaltig = /(\d{1,3})\s*[.)]\s*([^()\n]*?)\s*\(\s*(-?\d+(?:[.,]\d+)?)\s*[,;]\s*(-?\d+(?:[.,]\d+)?)\s*\)/g;

    zeilen.forEach(function (zeile) {
      var roh = zeile.trim();
      if (!roh) return;
      if (/^(nr\.?|frage|koordinaten|nummer)\b/i.test(roh) && !/\?/.test(roh)) {
        uebergangen.push(roh);
        return;
      }

      mehrspaltig.lastIndex = 0;
      var treffer, gefunden = 0;
      while ((treffer = mehrspaltig.exec(roh)) !== null) {
        gefunden++;
        fragen.push(eintrag(treffer[2], zahl(treffer[3]), zahl(treffer[4])));
      }
      if (gefunden) return;

      /* Einspaltig: Koordinaten am Zeilenende, mit oder ohne Klammern. */
      var einfach = roh.match(/^\s*(?:\d{1,3}\s*[.)]\s*)?(.*?)[\s;,:]*\(?\s*(-?\d+(?:[.,]\d+)?)\s*[,;\s]\s*(-?\d+(?:[.,]\d+)?)\s*\)?\s*$/);
      if (einfach && einfach[1].trim() && /[a-zäöüß]/i.test(einfach[1])) {
        fragen.push(eintrag(einfach[1], zahl(einfach[2]), zahl(einfach[3])));
        return;
      }

      /* Ohne Koordinaten: alles, was Buchstaben enthält, gilt als Frage. */
      var nurText = roh.replace(/^\s*\d{1,3}\s*[.)]\s*/, '').trim();
      if (/[a-zäöüß]/i.test(nurText)) {
        fragen.push(eintrag(nurText, null, null));
      } else {
        uebergangen.push(roh);
      }
    });

    fragen.forEach(function (f, i) { f.nr = i + 1; });
    return {
      fragen: fragen,
      uebergangen: uebergangen,
      ohneKoordinaten: fragen.filter(function (f) { return !f.gesetzt; }).length
    };
  }

  function zahl(s) { return parseFloat(String(s).replace(',', '.')); }

  function eintrag(text, x, y) {
    var frage = String(text).trim().replace(/[\s.;,:]+$/, '');
    if (!/\?$/.test(frage) && /^wo\s/i.test(frage)) frage += '?';
    return {
      nr: 0,
      frage: frage,
      ziel: zielAusFrage(frage),
      x: x === null || isNaN(x) ? 0 : Math.round(x),
      y: y === null || isNaN(y) ? 0 : Math.round(y),
      gesetzt: !(x === null || isNaN(x)),
      toleranz: null
    };
  }

  /* Nimmt ein exportiertes JSON entgegen: Vollformat, nackter Satz oder eine
     reine Frageliste. Liefert { satz, bild } oder wirft. */
  function ausJson(roh) {
    var obj = typeof roh === 'string' ? JSON.parse(roh) : roh;
    if (Array.isArray(obj)) return { satz: null, fragen: normierteFragen(obj), bild: null };
    if (obj.fragen && !obj.satz) return { satz: normieren(obj), bild: obj.bild || null };
    if (obj.satz) {
      var satz = normieren(obj.satz);
      if (obj.bild) satz.bild = obj.bild;
      return { satz: satz, bild: obj.bild || null };
    }
    throw new Error('Unbekanntes Format – erwartet wird ein Bildsatz oder eine Frageliste.');
  }

  /* Liest eine Datei aus data/ ein: Der Quelltext wird mit einem eigenen
     Wimmelbild-Objekt ausgeführt, das den Satz nur entgegennimmt statt ihn
     anzumelden. Der Code kommt aus einer Datei, die der Benutzer selbst
     ausgewählt hat – dieselbe Vertrauensstellung wie beim Eintragen in
     index.html. */
  function ausModulQuelltext(code) {
    var gefangen = null;
    var stellvertreter = { register: function (s) { gefangen = s; return s; } };
    (new Function('Wimmelbild', '"use strict";\n' + code))(stellvertreter);
    if (!gefangen) throw new Error('Die Datei ruft kein Wimmelbild.register auf.');
    return { satz: normieren(gefangen), bild: null };
  }

  function normierteFragen(liste) {
    return liste.map(function (f, i) {
      return {
        nr: typeof f.nr === 'number' ? f.nr : i + 1,
        frage: f.frage || String(f),
        ziel: f.ziel || zielAusFrage(f.frage || String(f)),
        x: typeof f.x === 'number' ? f.x : 0,
        y: typeof f.y === 'number' ? f.y : 0,
        gesetzt: f.gesetzt === true || (typeof f.x === 'number' && typeof f.y === 'number' && (f.x || f.y)),
        toleranz: typeof f.toleranz === 'number' ? f.toleranz : null
      };
    });
  }

  /* ============================================================= Export */

  /* Als Modul für data/<id>.js – das Bild bleibt eine Pfadangabe. */
  function alsQuelltext(satz) {
    var offen = offeneZiele(satz);
    var zeilen = satz.fragen.map(function (f) {
      return '    { nr: ' + fuell(String(f.nr), 2) +
        ', frage: ' + fuellRechts(hoch(f.frage) + ',', 48) +
        ' ziel: ' + fuellRechts(hoch(f.ziel) + ',', 34) +
        ' x: ' + fuell(String(f.x), 4) + ', y: ' + fuell(String(f.y), 4) + ' }';
    });
    return '// Wimmelbild "' + satz.titel + '" – ' + satz.fragen.length + ' Fragen.\n' +
      '// Im Editor der App erstellt.' +
      (offen ? ' Noch ' + offen + ' Ziel(e) ohne gesetzte Stelle.' : ' Alle Ziele gesetzt.') + '\n\n' +
      'Wimmelbild.register({\n' +
      '  id: ' + hoch(satz.id) + ',\n' +
      '  titel: ' + hoch(satz.titel) + ',\n' +
      '  untertitel: ' + hoch(satz.untertitel) + ',\n' +
      '  bild: ' + hoch(satz.bildDatei || satz.bild) + ',\n' +
      '  bildGroesse: { breite: ' + satz.bildGroesse.breite + ', hoehe: ' + satz.bildGroesse.hoehe + ' },\n' +
      '  koordinatenRaum: { breite: ' + satz.koordinatenRaum.breite + ', hoehe: ' + satz.koordinatenRaum.hoehe + ' },\n' +
      '  toleranz: ' + satz.toleranz + ',\n' +
      '  koordinatenGeprueft: ' + (offen === 0 && satz.fragen.length > 0) + ',\n' +
      (satz.quelle ? '  quelle: ' + JSON.stringify(satz.quelle) + ',\n' : '') +
      '  fragen: [\n' + zeilen.join(',\n') + '\n  ]\n});\n';
  }

  /* Alles in einer Datei, Bild eingebettet – zum Weitergeben und Wiedereinlesen. */
  function alsJson(satz) {
    var kopie = kopieren(satz);
    var bild = kopie.bild;
    delete kopie.bild;
    delete kopie.herkunft;
    kopie.koordinatenGeprueft = offeneZiele(satz) === 0 && satz.fragen.length > 0;
    return JSON.stringify({ format: 'wimmelbild/1', satz: kopie, bild: bild }, null, 2);
  }

  /* Nur die Fragen, so wie sie auch wieder eingelesen werden. */
  function alsText(satz) {
    return satz.fragen.map(function (f) {
      return f.nr + '. ' + f.frage + ' (' + f.x + ',' + f.y + ')';
    }).join('\n') + '\n';
  }

  function hoch(s) { return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }
  function fuell(s, n) { while (s.length < n) s = ' ' + s; return s; }
  function fuellRechts(s, n) { while (s.length < n) s = s + ' '; return s; }

  return {
    init: init,
    register: register,
    alle: alle,
    get: get,
    kopieren: kopieren,
    neuerSatz: neuerSatz,
    pruefen: pruefen,
    speichern: speichern,
    verwerfen: verwerfen,
    istLokal: istLokal,
    ausDateiVorhanden: ausDateiVorhanden,
    runde: runde,
    ziel: ziel,
    ausBildpixel: ausBildpixel,
    radius: radius,
    offeneZiele: offeneZiele,
    mischen: mischen,
    zielAusFrage: zielAusFrage,
    fragenAusText: fragenAusText,
    ausJson: ausJson,
    ausModulQuelltext: ausModulQuelltext,
    alsQuelltext: alsQuelltext,
    alsJson: alsJson,
    alsText: alsText
  };
})();
