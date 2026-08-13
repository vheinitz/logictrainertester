/* Wimmelbild-Suche – Oberfläche und Spielablauf. */

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var zustand = {
    satz: null,
    runde: null,
    gesperrt: false,
    uhrTakt: null,
    letzteAuswertung: null
  };

  /* =================================================================== */
  /* Bildansicht: Zoom, Verschieben, Klick in Bildkoordinaten            */
  /* =================================================================== */

  function Ansicht(buehne, leinwand, bild, beiKlick) {
    this.buehne = buehne;
    this.leinwand = leinwand;
    this.bild = bild;
    this.beiKlick = beiKlick;
    this.natur = { breite: 1, hoehe: 1 };
    this.basis = 1;
    this.zoom = 1;
    this.tx = 0;
    this.ty = 0;
    this.beiZoom = null;
    this._binden();
  }

  Ansicht.prototype.laden = function (satz) {
    this.natur = { breite: satz.bildGroesse.breite, hoehe: satz.bildGroesse.hoehe };
    this.leinwand.style.width = this.natur.breite + 'px';
    this.leinwand.style.height = this.natur.hoehe + 'px';
    this.bild.src = satz.bild;
    this.einpassen();
  };

  Ansicht.prototype.einpassen = function () {
    var r = this.buehne.getBoundingClientRect();
    if (!r.width || !r.height) return;
    this.basis = Math.min(r.width / this.natur.breite, r.height / this.natur.hoehe);
    this.zoom = 1;
    this._anwenden(true);
  };

  Ansicht.prototype.massstab = function () { return this.basis * this.zoom; };

  Ansicht.prototype._anwenden = function (zentrieren) {
    var r = this.buehne.getBoundingClientRect();
    var s = this.massstab();
    var b = this.natur.breite * s, h = this.natur.hoehe * s;
    if (zentrieren) { this.tx = (r.width - b) / 2; this.ty = (r.height - h) / 2; }
    this.tx = b <= r.width ? (r.width - b) / 2 : Math.min(0, Math.max(r.width - b, this.tx));
    this.ty = h <= r.height ? (r.height - h) / 2 : Math.min(0, Math.max(r.height - h, this.ty));
    this.leinwand.style.transform =
      'translate(' + this.tx + 'px,' + this.ty + 'px) scale(' + s + ')';
    this.leinwand.style.setProperty('--gegen', 1 / s);
    if (this.beiZoom) this.beiZoom(this.zoom);
  };

  /* Zoomt um einen Punkt der Bühne herum (Standard: Mitte). */
  Ansicht.prototype.zoomen = function (faktor, cx, cy) {
    var r = this.buehne.getBoundingClientRect();
    if (cx === undefined) { cx = r.width / 2; cy = r.height / 2; }
    var neu = Math.min(8, Math.max(1, this.zoom * faktor));
    if (neu === this.zoom) return;
    var alt = this.massstab();
    this.zoom = neu;
    var jetzt = this.massstab();
    this.tx = cx - (cx - this.tx) * (jetzt / alt);
    this.ty = cy - (cy - this.ty) * (jetzt / alt);
    this._anwenden(false);
  };

  /* Bühnenkoordinaten -> Bildpixel */
  Ansicht.prototype.zuBild = function (klientX, klientY) {
    var r = this.buehne.getBoundingClientRect();
    var s = this.massstab();
    return {
      px: (klientX - r.left - this.tx) / s,
      py: (klientY - r.top - this.ty) / s
    };
  };

  Ansicht.prototype._binden = function () {
    var self = this;
    var start = null, gezogen = false;

    this.buehne.addEventListener('pointerdown', function (e) {
      start = { x: e.clientX, y: e.clientY, tx: self.tx, ty: self.ty };
      gezogen = false;
      self.buehne.setPointerCapture(e.pointerId);
    });

    this.buehne.addEventListener('pointermove', function (e) {
      if (!start) return;
      var dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!gezogen && Math.abs(dx) + Math.abs(dy) > 5) {
        gezogen = true;
        self.buehne.classList.add('zieht');
      }
      if (gezogen) {
        self.tx = start.tx + dx;
        self.ty = start.ty + dy;
        self._anwenden(false);
      }
    });

    function ende(e) {
      if (!start) return;
      self.buehne.classList.remove('zieht');
      var warGezogen = gezogen;
      start = null; gezogen = false;
      if (!warGezogen && self.beiKlick) {
        var p = self.zuBild(e.clientX, e.clientY);
        if (p.px >= 0 && p.py >= 0 && p.px <= self.natur.breite && p.py <= self.natur.hoehe) {
          self.beiKlick(p.px, p.py);
        }
      }
    }
    this.buehne.addEventListener('pointerup', ende);
    this.buehne.addEventListener('pointercancel', function () { start = null; gezogen = false; });

    this.buehne.addEventListener('wheel', function (e) {
      e.preventDefault();
      var r = self.buehne.getBoundingClientRect();
      self.zoomen(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
  };

  /* =================================================================== */
  /* Hilfen                                                              */
  /* =================================================================== */

  function zeit(ms) {
    var s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  function sekunden(ms) { return (ms / 1000).toFixed(1).replace('.', ',') + ' s'; }

  function seite(name) {
    ['start', 'spiel', 'ende', 'kalib'].forEach(function (s) { $(s).hidden = s !== name; });
  }

  function marke(ebene, klassen, rx, ry, beschriftung) {
    var el = document.createElement('div');
    el.className = 'marke ' + klassen;
    el.style.left = (rx * 100) + '%';
    el.style.top = (ry * 100) + '%';
    if (beschriftung) {
      var n = document.createElement('span');
      n.className = 'nummer';
      n.textContent = beschriftung;
      el.appendChild(n);
    }
    ebene.appendChild(el);
    return el;
  }

  function zielring(ebene, satz, z, r) {
    var el = document.createElement('div');
    el.className = 'zielring';
    el.style.left = (z.rx * 100) + '%';
    el.style.top = (z.ry * 100) + '%';
    el.style.width = (2 * r) + 'px';
    el.style.height = (2 * r) + 'px';
    ebene.appendChild(el);
    return el;
  }

  function herunterladen(name, inhalt, typ) {
    var blob = new Blob([inhalt], { type: (typ || 'text/plain') + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  /* =================================================================== */
  /* Startbildschirm                                                     */
  /* =================================================================== */

  function startAufbauen() {
    var liste = $('satzliste');
    liste.innerHTML = '';
    var saetze = Wimmelbild.alle();

    if (!saetze.length) {
      liste.innerHTML = '<p class="hinweis">Kein Datensatz geladen. In index.html eine ' +
        'Zeile <code>&lt;script src="data/…"&gt;</code> ergänzen.</p>';
      $('knopf-start').disabled = true;
      $('knopf-kalibrieren').disabled = true;
      return;
    }

    saetze.forEach(function (satz) {
      var kal = Wimmelbild.kalibrierungLesen(satz.id);
      var gesetzt = satz.fragen.filter(function (f) { return kal[String(f.nr)]; }).length;
      var geprueft = satz.koordinatenGeprueft || gesetzt === satz.fragen.length;

      var karte = document.createElement('button');
      karte.className = 'karte';
      karte.type = 'button';
      karte.setAttribute('aria-pressed', 'false');
      karte.dataset.id = satz.id;
      karte.innerHTML =
        '<img src="' + satz.bild + '" alt="">' +
        '<div class="kartentext"><b></b><small></small><br>' +
        '<span class="kennzeichen"></span></div>';
      karte.querySelector('b').textContent = satz.titel;
      karte.querySelector('small').textContent =
        satz.fragen.length + ' Fragen · ' + satz.bildGroesse.breite + '×' + satz.bildGroesse.hoehe;
      var kz = karte.querySelector('.kennzeichen');
      if (geprueft) {
        kz.textContent = 'Ziele geprüft';
      } else {
        kz.className = 'kennzeichen offen';
        kz.textContent = gesetzt ? gesetzt + ' von ' + satz.fragen.length + ' kalibriert'
                                 : 'Ziele ungeprüft';
      }
      karte.addEventListener('click', function () { satzWaehlen(satz.id); });
      liste.appendChild(karte);
    });

    satzWaehlen(zustand.satz ? zustand.satz.id : saetze[0].id);
  }

  function satzWaehlen(id) {
    zustand.satz = Wimmelbild.get(id);
    Array.prototype.forEach.call($('satzliste').children, function (k) {
      if (k.dataset) k.setAttribute('aria-pressed', String(k.dataset.id === id));
    });

    var anzahl = $('opt-anzahl');
    var alle = anzahl.querySelector('option[value="0"]');
    alle.textContent = 'alle (' + zustand.satz.fragen.length + ')';

    var kal = Wimmelbild.kalibrierungLesen(id);
    var offen = zustand.satz.fragen.filter(function (f) { return !kal[String(f.nr)]; }).length;
    var warnung = $('warnung-kalibrierung');
    if (zustand.satz.koordinatenGeprueft || offen === 0) {
      warnung.hidden = true;
    } else {
      warnung.hidden = false;
      warnung.innerHTML = '<b>Ziele ungeprüft.</b> Für dieses Bild sind ' + offen +
        ' von ' + zustand.satz.fragen.length + ' Zielen noch so eingetragen, wie sie in der ' +
        'Tabelle unter dem Bild stehen. Diese Angaben treffen die Gegenstände nicht – ' +
        'die Runde lässt sich damit spielen, aber kaum gewinnen. Über ' +
        '<em>Ziele kalibrieren</em> setzt man die richtigen Stellen und exportiert die Datei neu.';
    }
  }

  /* =================================================================== */
  /* Spiel                                                               */
  /* =================================================================== */

  var spielAnsicht = null;

  function spielStarten() {
    var satz = zustand.satz;
    if (!satz) return;

    zustand.runde = Wimmelbild.runde(satz, {
      anzahl: parseInt($('opt-anzahl').value, 10),
      zufall: $('opt-zufall').checked,
      zeitProFrage: parseInt($('opt-zeit').value, 10)
    }).starten();
    zustand.gesperrt = false;

    seite('spiel');
    if (!spielAnsicht) {
      spielAnsicht = new Ansicht($('buehne'), $('leinwand'), $('bild'), antwortGeben);
      spielAnsicht.beiZoom = function (z) { $('zoom-wert').textContent = Math.round(z * 100) + ' %'; };
    }
    spielAnsicht.laden(satz);
    requestAnimationFrame(function () { spielAnsicht.einpassen(); });

    frageZeigen();
    uhrStarten();
  }

  function frageZeigen() {
    var frage = zustand.runde.aktuell();
    if (!frage) { spielBeenden(); return; }
    $('marker').innerHTML = '';
    $('rueckmeldung').hidden = true;
    $('spiel-zaehler').textContent =
      (zustand.runde.index + 1) + ' / ' + zustand.runde.fragen.length;
    $('spiel-frage').textContent = frage.frage;
    standAktualisieren();
    zustand.gesperrt = false;
  }

  function standAktualisieren() {
    var richtig = 0, falsch = 0;
    zustand.runde.antworten.forEach(function (a) { a.richtig ? richtig++ : falsch++; });
    $('spiel-richtig').textContent = richtig;
    $('spiel-falsch').textContent = falsch;
  }

  function uhrStarten() {
    uhrStoppen();
    zustand.uhrTakt = setInterval(function () {
      var r = zustand.runde;
      if (!r) return;
      $('spiel-uhr').textContent = zeit(Date.now() - r.begonnen);

      var limit = r.zeitProFrage * 1000;
      var balken = $('zeitbalken-fuellung');
      if (!limit) { balken.style.width = '0'; return; }
      var vergangen = Date.now() - r.frageBegonnen;
      var anteil = Math.min(1, vergangen / limit);
      balken.style.width = (anteil * 100) + '%';
      balken.classList.toggle('knapp', anteil > 0.75);
      if (anteil >= 1 && !zustand.gesperrt) zeitAbgelaufen();
    }, 100);
  }

  function uhrStoppen() {
    if (zustand.uhrTakt) clearInterval(zustand.uhrTakt);
    zustand.uhrTakt = null;
  }

  function antwortGeben(px, py) {
    if (zustand.gesperrt || !zustand.runde || zustand.runde.fertig()) return;
    zustand.gesperrt = true;

    var frage = zustand.runde.aktuell();
    var antwort = zustand.runde.pruefen(px, py);
    rueckmeldungZeigen(antwort, frage, antwort.richtig ? 'Richtig!' : 'Daneben');
  }

  function zeitAbgelaufen() {
    zustand.gesperrt = true;
    var frage = zustand.runde.aktuell();
    var antwort = zustand.runde.ueberspringen();
    rueckmeldungZeigen(antwort, frage, 'Zeit abgelaufen');
  }

  function ueberspringen() {
    if (zustand.gesperrt || !zustand.runde || zustand.runde.fertig()) return;
    zustand.gesperrt = true;
    var frage = zustand.runde.aktuell();
    var antwort = zustand.runde.ueberspringen();
    rueckmeldungZeigen(antwort, frage, 'Übersprungen');
  }

  function rueckmeldungZeigen(antwort, frage, text) {
    var ebene = $('marker');
    var zeigeZiel = $('opt-aufloesung').checked && !antwort.richtig;

    if (antwort.klick) {
      marke(ebene, 'klick' + (antwort.richtig ? ' richtig' : ''),
        antwort.klick.px / zustand.runde.satz.bildGroesse.breite,
        antwort.klick.py / zustand.runde.satz.bildGroesse.hoehe);
    }
    if (antwort.richtig || zeigeZiel) {
      zielring(ebene, zustand.runde.satz, antwort.ziel, antwort.radius);
      marke(ebene, 'ziel', antwort.ziel.rx, antwort.ziel.ry);
    }

    var rm = $('rueckmeldung');
    rm.hidden = false;
    rm.textContent = text + (antwort.richtig ? '' : ' · ' + sekunden(antwort.dauer));
    rm.className = 'rueckmeldung' + (antwort.richtig ? '' :
      (antwort.uebersprungen ? ' zeit' : ' daneben'));

    standAktualisieren();
    $('zeitbalken-fuellung').style.width = '0';

    setTimeout(function () {
      if (zustand.runde.fertig()) spielBeenden(); else frageZeigen();
    }, antwort.richtig ? 750 : (zeigeZiel ? 1600 : 900));
  }

  function spielBeenden() {
    uhrStoppen();
    zustand.letzteAuswertung = zustand.runde.auswertung();
    auswertungZeigen();
  }

  /* =================================================================== */
  /* Auswertung                                                          */
  /* =================================================================== */

  function auswertungZeigen() {
    var a = zustand.letzteAuswertung;
    var satz = zustand.runde.satz;
    seite('ende');

    $('ende-titel').textContent = satz.titel + ' · ' + a.gesamt + ' Fragen';

    var kennzahlen = [
      { wert: a.richtig + ' / ' + a.gesamt, text: 'gefunden', klasse: a.richtig ? 'gut' : 'schlecht' },
      { wert: Math.round(a.quote * 100) + ' %', text: 'Trefferquote' },
      { wert: zeit(a.gesamtzeit), text: 'Gesamtzeit' },
      { wert: sekunden(a.schnitt), text: 'im Schnitt je Frage' }
    ];
    if (a.schnellste) kennzahlen.push({ wert: sekunden(a.schnellste.dauer), text: 'schnellster Treffer: ' + a.schnellste.frage.ziel });
    if (a.uebersprungen) kennzahlen.push({ wert: String(a.uebersprungen), text: 'übersprungen / Zeit abgelaufen', klasse: 'schlecht' });

    $('ende-kennzahlen').innerHTML = kennzahlen.map(function (k) {
      return '<div class="kennzahl ' + (k.klasse || '') + '"><b></b><small></small></div>';
    }).join('');
    Array.prototype.forEach.call($('ende-kennzahlen').children, function (el, i) {
      el.querySelector('b').textContent = kennzahlen[i].wert;
      el.querySelector('small').textContent = kennzahlen[i].text;
    });

    uebersichtZeichnen(satz, a);
    tabelleZeichnen(a);
  }

  function uebersichtZeichnen(satz, a) {
    var box = $('ende-uebersicht');
    box.innerHTML = '<img src="' + satz.bild + '" alt=""><div class="marker-ebene"></div>';
    var ebene = box.querySelector('.marker-ebene');
    ebene.style.setProperty('--gegen', 1);

    a.antworten.forEach(function (ant) {
      marke(ebene, 'ziel', ant.ziel.rx, ant.ziel.ry, String(ant.frage.nr));
      if (!ant.klick) return;
      var kx = ant.klick.px / satz.bildGroesse.breite;
      var ky = ant.klick.py / satz.bildGroesse.hoehe;
      marke(ebene, 'klick' + (ant.richtig ? ' richtig' : ''), kx, ky);
      if (ant.richtig) return;
      /* Linie vom Klick zum Ziel – zeigt auf einen Blick, wie weit daneben. */
      var dx = (ant.ziel.rx - kx) * box.clientWidth;
      var dy = (ant.ziel.ry - ky) * box.clientHeight;
      var linie = document.createElement('div');
      linie.className = 'linie';
      linie.style.left = (kx * 100) + '%';
      linie.style.top = (ky * 100) + '%';
      linie.style.width = Math.sqrt(dx * dx + dy * dy) + 'px';
      linie.style.transform = 'rotate(' + Math.atan2(dy, dx) + 'rad)';
      ebene.appendChild(linie);
    });
  }

  function tabelleZeichnen(a) {
    var t = $('ende-tabelle');
    t.innerHTML = '<thead><tr><th>Nr.</th><th>Frage</th><th>Zeit</th>' +
      '<th>Abstand</th><th>Ergebnis</th></tr></thead><tbody></tbody>';
    var koerper = t.querySelector('tbody');

    a.antworten.forEach(function (ant) {
      var tr = document.createElement('tr');
      var status = ant.richtig
        ? '<span class="abzeichen gut">gefunden</span>'
        : (ant.uebersprungen ? '<span class="abzeichen neutral">ausgelassen</span>'
                             : '<span class="abzeichen schlecht">daneben</span>');
      tr.innerHTML =
        '<td class="zahl">' + ant.frage.nr + '</td>' +
        '<td class="frage-spalte"></td>' +
        '<td class="zahl">' + sekunden(ant.dauer) + '</td>' +
        '<td class="zahl">' + (ant.klick ? Math.round(ant.abstand) + ' px' : '–') + '</td>' +
        '<td>' + status + '</td>';
      tr.querySelector('.frage-spalte').textContent = ant.frage.frage;
      koerper.appendChild(tr);
    });
  }

  function ergebnisSpeichern() {
    var a = zustand.letzteAuswertung;
    if (!a) return;
    var satz = zustand.runde.satz;
    var daten = {
      bild: satz.id,
      titel: satz.titel,
      zeitpunkt: new Date().toISOString(),
      koordinatenGeprueft: satz.koordinatenGeprueft ||
        satz.fragen.every(function (f) { return zustand.runde.kalibrierung[String(f.nr)]; }),
      gesamt: a.gesamt,
      richtig: a.richtig,
      falsch: a.falsch,
      uebersprungen: a.uebersprungen,
      quote: Math.round(a.quote * 1000) / 1000,
      gesamtzeitMs: a.gesamtzeit,
      antworten: a.antworten.map(function (ant) {
        return {
          nr: ant.frage.nr,
          frage: ant.frage.frage,
          dauerMs: ant.dauer,
          richtig: ant.richtig,
          uebersprungen: ant.uebersprungen,
          abstandPx: ant.klick ? Math.round(ant.abstand) : null
        };
      })
    };
    herunterladen('wimmelbild-' + satz.id + '-ergebnis.json',
      JSON.stringify(daten, null, 2), 'application/json');
  }

  /* =================================================================== */
  /* Kalibrierung                                                        */
  /* =================================================================== */

  var kalibAnsicht = null;
  var kalib = { satz: null, index: 0, daten: {} };

  function kalibrierenStarten() {
    var satz = zustand.satz;
    if (!satz) return;
    kalib.satz = satz;
    kalib.daten = Wimmelbild.kalibrierungLesen(satz.id);
    kalib.index = 0;
    /* Bei der ersten noch offenen Frage anfangen. */
    for (var i = 0; i < satz.fragen.length; i++) {
      if (!kalib.daten[String(satz.fragen[i].nr)]) { kalib.index = i; break; }
    }

    seite('kalib');
    if (!kalibAnsicht) {
      kalibAnsicht = new Ansicht($('kalib-buehne'), $('kalib-leinwand'), $('kalib-bild'), kalibSetzen);
      kalibAnsicht.beiZoom = function (z) { $('kalib-zoom-wert').textContent = Math.round(z * 100) + ' %'; };
    }
    kalibAnsicht.laden(satz);
    requestAnimationFrame(function () { kalibAnsicht.einpassen(); });
    kalibZeichnen();
  }

  function kalibSetzen(px, py) {
    var satz = kalib.satz;
    var frage = satz.fragen[kalib.index];
    if (!frage) return;
    var x = px / satz.bildGroesse.breite * satz.koordinatenRaum.breite;
    var y = py / satz.bildGroesse.hoehe * satz.koordinatenRaum.hoehe;
    kalib.daten = Wimmelbild.kalibrierungSetzen(satz.id, frage.nr, x, y);
    /* Weiter zur nächsten noch offenen Frage. */
    var n = satz.fragen.length;
    for (var i = 1; i <= n; i++) {
      var k = (kalib.index + i) % n;
      if (!kalib.daten[String(satz.fragen[k].nr)]) { kalib.index = k; break; }
    }
    kalibZeichnen();
  }

  function kalibZeichnen() {
    var satz = kalib.satz;
    var frage = satz.fragen[kalib.index];
    var gesetzt = satz.fragen.filter(function (f) { return kalib.daten[String(f.nr)]; }).length;

    $('kalib-zaehler').textContent = (kalib.index + 1) + ' / ' + satz.fragen.length;
    $('kalib-frage').textContent = frage ? 'Wo ist: ' + frage.ziel + '?' : '';
    $('kalib-fortschritt').textContent = gesetzt + ' von ' + satz.fragen.length + ' gesetzt';

    var ebene = $('kalib-marker');
    ebene.innerHTML = '';
    satz.fragen.forEach(function (f, i) {
      var e = kalib.daten[String(f.nr)];
      if (!e) return;
      marke(ebene, 'kalibriert' + (i === kalib.index ? ' aktiv' : ''),
        e.x / satz.koordinatenRaum.breite, e.y / satz.koordinatenRaum.hoehe, String(f.nr));
    });

    var liste = $('kalib-liste');
    liste.innerHTML = '';
    satz.fragen.forEach(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button';
      var ist = !!kalib.daten[String(f.nr)];
      b.className = ist ? 'gesetzt' : '';
      if (i === kalib.index) b.setAttribute('aria-current', 'true');
      b.innerHTML = '<span class="status">' + (ist ? '✓' : '–') + '</span>';
      b.insertBefore(document.createTextNode(f.nr + '. ' + f.ziel), b.firstChild);
      b.addEventListener('click', function () { kalib.index = i; kalibZeichnen(); });
      liste.appendChild(b);
    });
    var aktiv = liste.querySelector('[aria-current="true"]');
    if (aktiv) aktiv.scrollIntoView({ block: 'nearest' });
  }

  function kalibSchritt(d) {
    var n = kalib.satz.fragen.length;
    kalib.index = (kalib.index + d + n) % n;
    kalibZeichnen();
  }

  function kalibExport() {
    var text = Wimmelbild.alsQuelltext(kalib.satz, kalib.daten);
    var offen = kalib.satz.fragen.filter(function (f) { return !kalib.daten[String(f.nr)]; }).length;
    dialogZeigen(
      'data/' + kalib.satz.id + '.js',
      offen
        ? 'Noch ' + offen + ' Ziel(e) ohne eigene Marke – für diese steht weiter der Wert aus ' +
          'der Tabelle. Datei nach data/' + kalib.satz.id + '.js speichern, sie ersetzt die alte.'
        : 'Alle Ziele gesetzt. Datei nach data/' + kalib.satz.id + '.js speichern, sie ersetzt die alte.',
      text,
      kalib.satz.id + '.js'
    );
  }

  /* =================================================================== */
  /* Dialog                                                              */
  /* =================================================================== */

  var dialogDatei = 'export.txt';

  function dialogZeigen(titel, text, inhalt, dateiname) {
    $('dialog-titel').textContent = titel;
    $('dialog-text').textContent = text;
    $('dialog-text-feld').value = inhalt;
    dialogDatei = dateiname;
    $('dialog').hidden = false;
  }

  /* =================================================================== */
  /* Verdrahtung                                                         */
  /* =================================================================== */

  $('knopf-start').addEventListener('click', spielStarten);
  $('knopf-kalibrieren').addEventListener('click', kalibrierenStarten);
  $('knopf-ueberspringen').addEventListener('click', ueberspringen);
  $('knopf-abbrechen').addEventListener('click', function () {
    uhrStoppen();
    zustand.runde = null;
    seite('start');
    startAufbauen();
  });
  $('knopf-nochmal').addEventListener('click', spielStarten);
  $('knopf-zurueck').addEventListener('click', function () { seite('start'); startAufbauen(); });
  $('knopf-ergebnis-speichern').addEventListener('click', ergebnisSpeichern);

  $('zoom-rein').addEventListener('click', function () { spielAnsicht.zoomen(1.4); });
  $('zoom-raus').addEventListener('click', function () { spielAnsicht.zoomen(1 / 1.4); });
  $('zoom-zurueck').addEventListener('click', function () { spielAnsicht.einpassen(); });

  $('kalib-zoom-rein').addEventListener('click', function () { kalibAnsicht.zoomen(1.4); });
  $('kalib-zoom-raus').addEventListener('click', function () { kalibAnsicht.zoomen(1 / 1.4); });
  $('kalib-zoom-zurueck').addEventListener('click', function () { kalibAnsicht.einpassen(); });
  $('kalib-zurueck-frage').addEventListener('click', function () { kalibSchritt(-1); });
  $('kalib-weiter-frage').addEventListener('click', function () { kalibSchritt(1); });
  $('kalib-loeschen').addEventListener('click', function () {
    var f = kalib.satz.fragen[kalib.index];
    kalib.daten = Wimmelbild.kalibrierungLoeschen(kalib.satz.id, f.nr);
    kalibZeichnen();
  });
  $('kalib-export').addEventListener('click', kalibExport);
  $('kalib-fertig').addEventListener('click', function () { seite('start'); startAufbauen(); });

  $('dialog-schliessen').addEventListener('click', function () { $('dialog').hidden = true; });
  $('dialog-herunterladen').addEventListener('click', function () {
    herunterladen(dialogDatei, $('dialog-text-feld').value, 'text/javascript');
  });
  $('dialog-kopieren').addEventListener('click', function () {
    var feld = $('dialog-text-feld');
    feld.select();
    try {
      navigator.clipboard.writeText(feld.value);
    } catch (e) {
      document.execCommand('copy');
    }
    $('dialog-kopieren').textContent = 'kopiert';
    setTimeout(function () { $('dialog-kopieren').textContent = 'In die Zwischenablage'; }, 1500);
  });

  document.addEventListener('keydown', function (e) {
    if (!$('dialog').hidden) {
      if (e.key === 'Escape') $('dialog').hidden = true;
      return;
    }
    if (!$('spiel').hidden) {
      if (e.key === ' ') { e.preventDefault(); ueberspringen(); }
      if (e.key === 'Escape') $('knopf-abbrechen').click();
      if (e.key === '+') spielAnsicht.zoomen(1.4);
      if (e.key === '-') spielAnsicht.zoomen(1 / 1.4);
      if (e.key === '0') spielAnsicht.einpassen();
    } else if (!$('kalib').hidden) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); kalibSchritt(1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); kalibSchritt(-1); }
      if (e.key === 'Escape') $('kalib-fertig').click();
      if (e.key === '0') kalibAnsicht.einpassen();
    } else if (!$('start').hidden) {
      if (e.key === 'Enter') spielStarten();
    }
  });

  window.addEventListener('resize', function () {
    if (!$('spiel').hidden && spielAnsicht) spielAnsicht.einpassen();
    if (!$('kalib').hidden && kalibAnsicht) kalibAnsicht.einpassen();
  });

  startAufbauen();
})();
