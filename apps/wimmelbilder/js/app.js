/* Wimmelbild-Suche – Auswahl, Spiel und Auswertung. Der Editor liegt in
   js/editor.js, die Bildaufnahme in js/aufnahme.js. */

var App = (function () {
  'use strict';

  var $ = H.$, neu = H.neu;

  var zustand = {
    satz: null,
    runde: null,
    gesperrt: false,
    uhrTakt: null,
    auswertung: null,
    ansicht: null
  };

  /* =================================================================== */
  /* Auswahl                                                             */
  /* =================================================================== */

  function startAufbauen() {
    var liste = $('satzliste');
    liste.innerHTML = '';
    var saetze = Wimmelbild.alle();

    if (!saetze.length) {
      liste.appendChild(neu('p', 'hinweis',
        'Noch kein Bildsatz vorhanden. Über „Neues Wimmelbild" ein Bild hereinreichen ' +
        'oder eine exportierte Datei importieren.'));
    }

    saetze.forEach(function (satz) { liste.appendChild(karte(satz)); });

    if (saetze.length && (!zustand.satz || !Wimmelbild.get(zustand.satz.id))) {
      zustand.satz = null;
    }
    satzWaehlen(zustand.satz ? zustand.satz.id : (saetze[0] ? saetze[0].id : null));
  }

  function karte(satz) {
    var offen = Wimmelbild.offeneZiele(satz);
    var geprueft = satz.fragen.length > 0 && offen === 0;

    var el = neu('div', 'karte');
    el.dataset.id = satz.id;
    el.setAttribute('aria-pressed', 'false');

    var waehlen = neu('button', 'kartenflaeche');
    waehlen.type = 'button';
    var bild = neu('img');
    bild.src = satz.bild;
    bild.alt = '';
    waehlen.appendChild(bild);
    var text = neu('div', 'kartentext');
    text.appendChild(neu('b', null, satz.titel));
    text.appendChild(neu('small', null, satz.fragen.length + ' Fragen · ' +
      satz.bildGroesse.breite + '×' + satz.bildGroesse.hoehe));
    var kz = neu('span', 'kennzeichen' + (geprueft ? '' : ' offen'),
      satz.fragen.length === 0 ? 'keine Fragen'
        : geprueft ? 'zu jeder Frage eine Stelle' : offen + ' von ' + satz.fragen.length + ' ohne Stelle');
    text.appendChild(kz);
    if (satz.herkunft === 'lokal') {
      text.appendChild(neu('span', 'kennzeichen lokal',
        Wimmelbild.ausDateiVorhanden(satz.id) ? 'lokal geändert' : 'lokal'));
    }
    waehlen.appendChild(text);
    waehlen.addEventListener('click', function () { satzWaehlen(satz.id); });
    el.appendChild(waehlen);

    var werkzeuge = neu('div', 'kartenwerkzeuge');
    var bearbeiten = neu('button', 'winzig', 'Bearbeiten');
    bearbeiten.type = 'button';
    bearbeiten.addEventListener('click', function () { Editor.oeffnen(satz); });
    werkzeuge.appendChild(bearbeiten);
    el.appendChild(werkzeuge);
    return el;
  }

  function satzWaehlen(id) {
    zustand.satz = id ? Wimmelbild.get(id) : null;
    Array.prototype.forEach.call($('satzliste').children, function (k) {
      if (k.dataset) k.setAttribute('aria-pressed', String(k.dataset.id === id));
    });

    var spielbar = !!zustand.satz && zustand.satz.fragen.length > 0;
    $('knopf-start').disabled = !spielbar;

    var anzahl = $('opt-anzahl');
    var alleOption = anzahl.querySelector('option[value="0"]');
    alleOption.textContent = zustand.satz
      ? 'alle (' + zustand.satz.fragen.length + ')' : 'alle';

    var warnung = $('warnung');
    if (!zustand.satz) {
      warnung.hidden = true;
      return;
    }
    var offen = Wimmelbild.offeneZiele(zustand.satz);
    if (offen === 0) {
      warnung.hidden = true;
    } else {
      warnung.hidden = false;
      warnung.innerHTML = '';
      warnung.appendChild(neu('b', null, offen + ' von ' + zustand.satz.fragen.length +
        ' Fragen haben noch keine Stelle im Bild.'));
      warnung.appendChild(document.createTextNode($('opt-nur-gesetzte').checked
        ? ' Sie bleiben draußen, solange oben „nur Fragen mit gesetzter Stelle" angehakt ist. ' +
          'Im Editor lassen sich ihre Stellen setzen – oder die Frage löschen, wenn es die ' +
          'Sache im Bild gar nicht gibt.'
        : ' Diese Fragen kann niemand treffen. Entweder oben „nur Fragen mit gesetzter Stelle" ' +
          'anhaken, oder im Editor die Stellen setzen.'));
    }
  }

  /* =================================================================== */
  /* Spiel                                                               */
  /* =================================================================== */

  function spielStarten() {
    var satz = zustand.satz;
    if (!satz || !satz.fragen.length) return;

    var runde = Wimmelbild.runde(satz, {
      anzahl: parseInt($('opt-anzahl').value, 10),
      zufall: $('opt-zufall').checked,
      zeitProFrage: parseInt($('opt-zeit').value, 10),
      nurGesetzte: $('opt-nur-gesetzte').checked
    });
    if (!runde.fragen.length) {
      H.melden('Keine Frage übrig',
        'Mit „nur Fragen mit gesetzter Stelle" bleibt nichts übrig – im Editor erst Stellen setzen.');
      return;
    }
    zustand.runde = runde.starten();
    zustand.gesperrt = false;

    H.seite('spiel');
    if (!zustand.ansicht) {
      zustand.ansicht = new Ansicht($('buehne'), $('leinwand'), $('bild'), antwortGeben);
      zustand.ansicht.beiZoom = function (z) {
        $('zoom-wert').textContent = Math.round(z * 100) + ' %';
      };
    }
    zustand.ansicht.laden(satz);
    requestAnimationFrame(function () { zustand.ansicht.einpassen(); });

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
      $('spiel-uhr').textContent = H.zeit(Date.now() - r.begonnen);

      var limit = r.zeitProFrage * 1000;
      var balken = $('zeitbalken-fuellung');
      if (!limit) { balken.style.width = '0'; return; }
      var anteil = Math.min(1, (Date.now() - r.frageBegonnen) / limit);
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
    var antwort = zustand.runde.pruefen(px, py);
    rueckmeldung(antwort, antwort.richtig ? 'Richtig!' : 'Daneben');
  }

  function zeitAbgelaufen() {
    zustand.gesperrt = true;
    rueckmeldung(zustand.runde.ueberspringen(), 'Zeit abgelaufen');
  }

  function ueberspringen() {
    if (zustand.gesperrt || !zustand.runde || zustand.runde.fertig()) return;
    zustand.gesperrt = true;
    rueckmeldung(zustand.runde.ueberspringen(), 'Übersprungen');
  }

  function rueckmeldung(antwort, text) {
    var ebene = $('marker');
    var satz = zustand.runde.satz;
    /* Bei einer Frage ohne Stelle wäre die „Auflösung" irreführend. */
    var hatStelle = antwort.stellen.length > 0;
    var zeigeZiel = $('opt-aufloesung').checked && !antwort.richtig && hatStelle;

    if (antwort.klick) {
      H.marke(ebene, 'klick' + (antwort.richtig ? ' richtig' : ''),
        antwort.klick.px / satz.bildGroesse.breite,
        antwort.klick.py / satz.bildGroesse.hoehe);
    }
    if (antwort.richtig) {
      /* Bei mehreren Stellen nur die getroffene hervorheben. */
      H.zielring(ebene, antwort.treffer.rx, antwort.treffer.ry, antwort.radius);
      H.marke(ebene, 'ziel', antwort.treffer.rx, antwort.treffer.ry);
    } else if (zeigeZiel) {
      antwort.stellen.forEach(function (s) {
        H.zielring(ebene, s.rx, s.ry, antwort.radius);
        H.marke(ebene, 'ziel', s.rx, s.ry);
      });
    }

    var rm = $('rueckmeldung');
    rm.hidden = false;
    rm.textContent = text + (antwort.richtig ? '' : ' · ' + H.sekunden(antwort.dauer)) +
      (!antwort.richtig && !hatStelle ? ' · für diese Frage ist keine Stelle gesetzt' : '') +
      (zeigeZiel && antwort.stellen.length > 1
        ? ' · ' + antwort.stellen.length + ' mögliche Stellen' : '');
    rm.className = 'rueckmeldung' + (antwort.richtig ? ''
      : (antwort.uebersprungen ? ' zeit' : ' daneben'));

    standAktualisieren();
    $('zeitbalken-fuellung').style.width = '0';

    setTimeout(function () {
      if (!zustand.runde) return;
      if (zustand.runde.fertig()) spielBeenden(); else frageZeigen();
    }, antwort.richtig ? 750 : (zeigeZiel ? 1600 : 900));
  }

  function spielBeenden() {
    uhrStoppen();
    zustand.auswertung = zustand.runde.auswertung();
    auswertungZeigen();
  }

  function spielAbbrechen() {
    uhrStoppen();
    zustand.runde = null;
    H.seite('start');
    startAufbauen();
  }

  /* =================================================================== */
  /* Auswertung                                                          */
  /* =================================================================== */

  function auswertungZeigen() {
    var a = zustand.auswertung;
    var satz = zustand.runde.satz;
    H.seite('ende');
    $('ende-titel').textContent = satz.titel + ' · ' + a.gesamt + ' Fragen';

    urkundeZeichnen(a);

    var werte = [
      { wert: H.zeit(a.gesamtzeit), text: 'Gesamtzeit' },
      { wert: H.sekunden(a.schnitt), text: 'im Schnitt je Frage' }
    ];
    if (a.schnellste) {
      werte.push({ wert: H.sekunden(a.schnellste.dauer), text: 'schnellste gefundene Sache' });
    }
    if (a.uebersprungen) {
      werte.push({ wert: String(a.uebersprungen), text: 'ausgelassen' });
    }

    var kasten = $('ende-kennzahlen');
    kasten.innerHTML = '';
    werte.forEach(function (k) {
      var el = neu('div', 'kennzahl');
      el.appendChild(neu('b', null, k.wert));
      el.appendChild(neu('small', null, k.text));
      kasten.appendChild(el);
    });

    uebersichtZeichnen(satz, a);
    tabelleZeichnen(a);
  }

  /* Das große Bild oben: Smiley, Sterne, Balken und ein Satz dazu. Für Kinder
     ist die Quote als Zahl wenig wert – das Gesicht und die Sterne sagen es. */
  var STUFEN = [
    { ab: 0.90, gesicht: 'freude',  spruch: 'Super gemacht!' },
    { ab: 0.70, gesicht: 'froh',    spruch: 'Richtig gut!' },
    { ab: 0.50, gesicht: 'lachen',  spruch: 'Schon die Hälfte – prima!' },
    { ab: 0.25, gesicht: 'ruhig',   spruch: 'Gut gesucht. Noch mal?' },
    { ab: 0.00, gesicht: 'denken',  spruch: 'Das Bild ist knifflig. Noch mal versuchen!' }
  ];

  function stufeFuer(quote) {
    for (var i = 0; i < STUFEN.length; i++) if (quote >= STUFEN[i].ab) return STUFEN[i];
    return STUFEN[STUFEN.length - 1];
  }

  function urkundeZeichnen(a) {
    var kasten = $('ende-urkunde');
    kasten.innerHTML = '';
    var stufe = stufeFuer(a.quote);

    kasten.appendChild(smiley(stufe.gesicht));

    var rechts = neu('div', 'urkunde-text');
    rechts.appendChild(neu('p', 'spruch', stufe.spruch));

    var zahl = neu('p', 'gefunden');
    zahl.appendChild(neu('b', null, String(a.richtig)));
    zahl.appendChild(document.createTextNode(' von ' + a.gesamt + ' gefunden'));
    rechts.appendChild(zahl);

    rechts.appendChild(sterne(a.quote));

    var balken = neu('div', 'quotenbalken');
    var fuellung = neu('div', 'quotenbalken-fuellung');
    fuellung.style.width = Math.round(a.quote * 100) + '%';
    balken.appendChild(fuellung);
    balken.appendChild(neu('span', 'quotenzahl', Math.round(a.quote * 100) + ' %'));
    rechts.appendChild(balken);

    kasten.appendChild(rechts);
  }

  /* Fünf Sterne, der angebrochene wird anteilig gefüllt. */
  function sterne(quote) {
    var ns = 'http://www.w3.org/2000/svg';
    var reihe = neu('div', 'sterne');
    reihe.setAttribute('role', 'img');
    var anteil = quote * 5;
    reihe.setAttribute('aria-label', (Math.round(anteil * 10) / 10) + ' von 5 Sternen');

    for (var i = 0; i < 5; i++) {
      var voll = Math.max(0, Math.min(1, anteil - i));
      var svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('class', 'stern');

      var id = 'sternfuellung' + i + '-' + Math.round(quote * 1000);
      var defs = document.createElementNS(ns, 'defs');
      var lauf = document.createElementNS(ns, 'linearGradient');
      lauf.setAttribute('id', id);
      [[0, 'voll'], [voll, 'voll'], [voll, 'leer'], [1, 'leer']].forEach(function (stopp) {
        var s = document.createElementNS(ns, 'stop');
        s.setAttribute('offset', (stopp[0] * 100) + '%');
        s.setAttribute('class', 'stopp-' + stopp[1]);
        lauf.appendChild(s);
      });
      defs.appendChild(lauf);
      svg.appendChild(defs);

      var form = document.createElementNS(ns, 'path');
      form.setAttribute('d', 'M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z');
      form.setAttribute('fill', 'url(#' + id + ')');
      svg.appendChild(form);
      reihe.appendChild(svg);
    }
    return reihe;
  }

  /* Ein Gesicht aus Kreis, Augen und Mund – der Mund macht die Stimmung. */
  var MUENDER = {
    freude: 'M8 13.5q4 5.5 8 0 q-4 2.2 -8 0z',
    froh:   'M8.2 13.6q3.8 4.4 7.6 0',
    lachen: 'M8.6 14.2q3.4 3 6.8 0',
    ruhig:  'M9 15h6',
    denken: 'M9 15.6q3-2 6 0'
  };

  function smiley(art) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'smiley ' + art);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Ergebnis');

    var kopf = document.createElementNS(ns, 'circle');
    kopf.setAttribute('cx', 12); kopf.setAttribute('cy', 12); kopf.setAttribute('r', 10.4);
    kopf.setAttribute('class', 'kopf');
    svg.appendChild(kopf);

    [[8.4, 9.6], [15.6, 9.6]].forEach(function (auge) {
      var e = document.createElementNS(ns, 'circle');
      e.setAttribute('cx', auge[0]);
      e.setAttribute('cy', auge[1]);
      e.setAttribute('r', art === 'freude' ? 1.5 : 1.2);
      e.setAttribute('class', 'auge');
      svg.appendChild(e);
    });

    var mund = document.createElementNS(ns, 'path');
    mund.setAttribute('d', MUENDER[art] || MUENDER.ruhig);
    mund.setAttribute('class', 'mund' + (art === 'freude' ? ' gefuellt' : ''));
    svg.appendChild(mund);
    return svg;
  }

  function uebersichtZeichnen(satz, a) {
    var box = $('ende-uebersicht');
    box.innerHTML = '';
    var bild = neu('img');
    bild.src = satz.bild;
    bild.alt = '';
    box.appendChild(bild);
    var ebene = neu('div', 'marker-ebene');
    ebene.style.setProperty('--gegen', 1);
    box.appendChild(ebene);

    /* Linien Klick -> Ziel als SVG im Bildkoordinatensystem: rechnet ohne
       Layoutwerte und bleibt beim Vergrößern des Fensters richtig. */
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + satz.bildGroesse.breite + ' ' + satz.bildGroesse.hoehe);
    svg.setAttribute('preserveAspectRatio', 'none');
    box.appendChild(svg);

    a.antworten.forEach(function (ant) {
      ant.stellen.forEach(function (s, i) {
        H.marke(ebene, 'ziel', s.rx, s.ry, i === 0 ? String(ant.frage.nr) : null);
      });
      if (!ant.klick) return;
      H.marke(ebene, 'klick' + (ant.richtig ? ' richtig' : ''),
        ant.klick.px / satz.bildGroesse.breite,
        ant.klick.py / satz.bildGroesse.hoehe);
      if (ant.richtig || !ant.treffer) return;
      /* Linie zur nächstgelegenen Stelle – die war gemeint. */
      var linie = document.createElementNS(ns, 'line');
      linie.setAttribute('x1', ant.klick.px);
      linie.setAttribute('y1', ant.klick.py);
      linie.setAttribute('x2', ant.treffer.px);
      linie.setAttribute('y2', ant.treffer.py);
      svg.appendChild(linie);
    });
  }

  function tabelleZeichnen(a) {
    var t = $('ende-tabelle');
    t.innerHTML = '<thead><tr><th></th><th>Nr.</th><th>Frage</th><th>Zeit</th>' +
      '<th>Abstand</th></tr></thead>';
    var koerper = neu('tbody');

    a.antworten.forEach(function (ant) {
      var tr = neu('tr', ant.richtig ? 'treffer' : '');
      var zeichen = neu('td', 'zeichen');
      zeichen.appendChild(haken(ant.richtig, ant.uebersprungen));
      tr.appendChild(zeichen);
      tr.appendChild(zelle('zahl', String(ant.frage.nr)));
      var frage = zelle('frage-spalte', ant.frage.frage);
      if (!ant.stellen.length) {
        frage.appendChild(neu('span', 'abzeichen neutral', 'ohne Stelle'));
      } else if (ant.stellen.length > 1) {
        frage.appendChild(neu('span', 'abzeichen neutral', ant.stellen.length + ' Stellen'));
      }
      tr.appendChild(frage);
      tr.appendChild(zelle('zahl', H.sekunden(ant.dauer)));
      tr.appendChild(zelle('zahl', ant.klick && ant.treffer
        ? Math.round(ant.abstand) + ' px' : '–'));
      koerper.appendChild(tr);
    });
    t.appendChild(koerper);
  }

  /* Haken, Kreuz oder Strich – schneller zu lesen als ein Wort. */
  function haken(richtig, uebersprungen) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'zeichen-bild ' +
      (richtig ? 'gut' : uebersprungen ? 'neutral' : 'schlecht'));
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label',
      richtig ? 'gefunden' : uebersprungen ? 'ausgelassen' : 'daneben');

    var kreis = document.createElementNS(ns, 'circle');
    kreis.setAttribute('cx', 12); kreis.setAttribute('cy', 12); kreis.setAttribute('r', 11);
    kreis.setAttribute('class', 'grund');
    svg.appendChild(kreis);

    var strich = document.createElementNS(ns, 'path');
    strich.setAttribute('d', richtig ? 'M7 12.5l3.4 3.4L17 9'
      : uebersprungen ? 'M7.5 12h9' : 'M8 8l8 8M16 8l-8 8');
    strich.setAttribute('class', 'strich');
    svg.appendChild(strich);
    return svg;
  }

  function zelle(klasse, text) { return neu('td', klasse, text); }

  function ergebnisSpeichern() {
    var a = zustand.auswertung;
    if (!a) return;
    var satz = zustand.runde.satz;
    H.herunterladen('wimmelbild-' + satz.id + '-ergebnis.json', JSON.stringify({
      bild: satz.id,
      titel: satz.titel,
      zeitpunkt: new Date().toISOString(),
      alleFragenMitStelle: Wimmelbild.offeneZiele(satz) === 0,
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
          stellen: ant.stellen.length,
          abstandPx: ant.klick ? Math.round(ant.abstand) : null
        };
      })
    }, null, 2), 'application/json');
  }

  /* =================================================================== */
  /* Verdrahtung                                                         */
  /* =================================================================== */

  function verdrahten() {
    $('knopf-start').addEventListener('click', spielStarten);
    $('opt-nur-gesetzte').addEventListener('change', function () {
      if (zustand.satz) satzWaehlen(zustand.satz.id);
    });
    $('knopf-neu').addEventListener('click', Aufnahme.neuerSatzDialog);
    $('knopf-import').addEventListener('click', Aufnahme.satzImportDialog);
    $('knopf-bearbeiten').addEventListener('click', function () {
      if (zustand.satz) Editor.oeffnen(zustand.satz);
    });

    $('knopf-ueberspringen').addEventListener('click', ueberspringen);
    $('knopf-abbrechen').addEventListener('click', spielAbbrechen);
    $('zoom-rein').addEventListener('click', function () { zustand.ansicht.zoomen(1.4); });
    $('zoom-raus').addEventListener('click', function () { zustand.ansicht.zoomen(1 / 1.4); });
    $('zoom-zurueck').addEventListener('click', function () { zustand.ansicht.einpassen(); });

    $('knopf-nochmal').addEventListener('click', spielStarten);
    $('knopf-zurueck').addEventListener('click', function () { H.seite('start'); startAufbauen(); });
    $('knopf-ergebnis').addEventListener('click', ergebnisSpeichern);

    Editor.verdrahten();

    document.addEventListener('keydown', function (e) {
      if (H.istOffen()) {
        if (e.key === 'Escape') H.schliessen();
        return;
      }
      if (H.sichtbar('spiel')) {
        if (e.key === ' ') { e.preventDefault(); ueberspringen(); }
        if (e.key === 'Escape') spielAbbrechen();
        if (e.key === '+') zustand.ansicht.zoomen(1.4);
        if (e.key === '-') zustand.ansicht.zoomen(1 / 1.4);
        if (e.key === '0') zustand.ansicht.einpassen();
      } else if (H.sichtbar('editor')) {
        Editor.tasten(e);
      } else if (H.sichtbar('start')) {
        if (e.key === 'Enter' && !$('knopf-start').disabled) spielStarten();
      }
    });

    window.addEventListener('resize', function () {
      if (H.sichtbar('spiel') && zustand.ansicht) zustand.ansicht.einpassen();
      if (H.sichtbar('editor')) Editor.einpassen();
    });
  }

  function starten() {
    Wimmelbild.init();
    verdrahten();
    startAufbauen();
  }

  return {
    starten: starten,
    startAufbauen: startAufbauen,
    ansicht: function () { return zustand.ansicht; }
  };
})();

App.starten();
