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
        : geprueft ? 'alle Ziele gesetzt' : offen + ' von ' + satz.fragen.length + ' ohne Ziel');
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
        ' Fragen ohne gesicherte Stelle.'));
      warnung.appendChild(document.createTextNode(
        ' Gewertet wird gegen den eingetragenen Wert, überprüft ist er nicht – Treffer sind ' +
        'dort Zufall, und die richtige Stelle wird nach einem Fehlversuch nicht gezeigt. ' +
        'Im Editor die Stellen setzen, oder oben „nur Fragen mit gesetztem Ziel" anhaken.'));
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
        'Mit „nur Fragen mit gesetztem Ziel" bleibt nichts übrig – im Editor erst Ziele setzen.');
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
    /* Bei einer Frage ohne gesetztes Ziel wäre die „Auflösung" irreführend. */
    var zeigeZiel = $('opt-aufloesung').checked && !antwort.richtig && antwort.ziel.gesetzt;

    if (antwort.klick) {
      H.marke(ebene, 'klick' + (antwort.richtig ? ' richtig' : ''),
        antwort.klick.px / satz.bildGroesse.breite,
        antwort.klick.py / satz.bildGroesse.hoehe);
    }
    if (antwort.richtig || zeigeZiel) {
      H.zielring(ebene, antwort.ziel.rx, antwort.ziel.ry, antwort.radius);
      H.marke(ebene, 'ziel', antwort.ziel.rx, antwort.ziel.ry);
    }

    var rm = $('rueckmeldung');
    rm.hidden = false;
    rm.textContent = text + (antwort.richtig ? '' : ' · ' + H.sekunden(antwort.dauer)) +
      (!antwort.richtig && !antwort.ziel.gesetzt ? ' · Stelle nicht gesichert' : '');
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

    var werte = [
      { wert: a.richtig + ' / ' + a.gesamt, text: 'gefunden', klasse: a.richtig ? 'gut' : 'schlecht' },
      { wert: Math.round(a.quote * 100) + ' %', text: 'Trefferquote' },
      { wert: H.zeit(a.gesamtzeit), text: 'Gesamtzeit' },
      { wert: H.sekunden(a.schnitt), text: 'im Schnitt je Frage' }
    ];
    if (a.schnellste) {
      werte.push({ wert: H.sekunden(a.schnellste.dauer),
        text: 'schnellster Treffer: ' + a.schnellste.frage.ziel });
    }
    if (a.uebersprungen) {
      werte.push({ wert: String(a.uebersprungen), text: 'ausgelassen', klasse: 'schlecht' });
    }

    var kasten = $('ende-kennzahlen');
    kasten.innerHTML = '';
    werte.forEach(function (k) {
      var el = neu('div', 'kennzahl ' + (k.klasse || ''));
      el.appendChild(neu('b', null, k.wert));
      el.appendChild(neu('small', null, k.text));
      kasten.appendChild(el);
    });

    uebersichtZeichnen(satz, a);
    tabelleZeichnen(a);
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
      if (ant.ziel.gesetzt) H.marke(ebene, 'ziel', ant.ziel.rx, ant.ziel.ry, String(ant.frage.nr));
      if (!ant.klick) return;
      H.marke(ebene, 'klick' + (ant.richtig ? ' richtig' : ''),
        ant.klick.px / satz.bildGroesse.breite,
        ant.klick.py / satz.bildGroesse.hoehe);
      if (ant.richtig || !ant.ziel.gesetzt) return;
      var linie = document.createElementNS(ns, 'line');
      linie.setAttribute('x1', ant.klick.px);
      linie.setAttribute('y1', ant.klick.py);
      linie.setAttribute('x2', ant.ziel.px);
      linie.setAttribute('y2', ant.ziel.py);
      svg.appendChild(linie);
    });
  }

  function tabelleZeichnen(a) {
    var t = $('ende-tabelle');
    t.innerHTML = '<thead><tr><th>Nr.</th><th>Frage</th><th>Zeit</th>' +
      '<th>Abstand</th><th>Ergebnis</th></tr></thead>';
    var koerper = neu('tbody');

    a.antworten.forEach(function (ant) {
      var tr = neu('tr');
      tr.appendChild(zelle('zahl', String(ant.frage.nr)));
      tr.appendChild(zelle('frage-spalte', ant.frage.frage));
      tr.appendChild(zelle('zahl', H.sekunden(ant.dauer)));
      tr.appendChild(zelle('zahl', ant.klick && ant.ziel.gesetzt
        ? Math.round(ant.abstand) + ' px' : '–'));
      var status = neu('td');
      status.appendChild(neu('span',
        'abzeichen ' + (ant.richtig ? 'gut' : ant.uebersprungen ? 'neutral' : 'schlecht'),
        ant.richtig ? 'gefunden' : ant.uebersprungen ? 'ausgelassen' : 'daneben'));
      if (!ant.ziel.gesetzt) status.appendChild(neu('span', 'abzeichen neutral', 'ohne Ziel'));
      tr.appendChild(status);
      koerper.appendChild(tr);
    });
    t.appendChild(koerper);
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
      alleZieleGesetzt: Wimmelbild.offeneZiele(satz) === 0,
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
          zielGesetzt: ant.ziel.gesetzt,
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

  return { starten: starten, startAufbauen: startAufbauen };
})();

App.starten();
