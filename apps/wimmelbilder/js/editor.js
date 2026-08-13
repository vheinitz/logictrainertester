/* Editor: Bildsätze anlegen, Fragen schreiben, Ziele im Bild setzen,
   importieren und exportieren.

   Gearbeitet wird auf einer Kopie. Jede Änderung wandert kurz verzögert in den
   localStorage; ein Satz aus data/ wird dadurch von einer lokalen Fassung
   verdeckt, die sich jederzeit wieder verwerfen lässt. */

var Editor = (function () {
  'use strict';

  var $ = H.$, neu = H.neu;

  var satz = null;      // Arbeitskopie
  var aktiv = 0;        // ausgewählte Frage
  var reihum = false;   // nach dem Setzen zur nächsten offenen Frage springen
  var ansicht = null;
  var takt = null;      // Verzögerung fürs Speichern

  /* ============================================================== Öffnen */

  function oeffnen(vorlage) {
    satz = Wimmelbild.kopieren(vorlage);
    satz.herkunft = vorlage.herkunft;
    aktiv = 0;
    reihum = false;

    H.seite('editor');
    if (!ansicht) {
      ansicht = new Ansicht($('ed-buehne'), $('ed-leinwand'), $('ed-bild'), bildKlick);
      ansicht.beiZoom = function (z) { $('ed-zoom-wert').textContent = Math.round(z * 100) + ' %'; };
    }
    ansicht.laden(satz);
    requestAnimationFrame(function () { ansicht.einpassen(); });
    zeichnen();
  }

  function schliessen() {
    sofortSpeichern();
    satz = null;
    H.seite('start');
    App.startAufbauen();
  }

  /* ============================================================ Speichern */

  function merken() {
    if (takt) clearTimeout(takt);
    stand('ungespeichert');
    takt = setTimeout(sofortSpeichern, 600);
  }

  function sofortSpeichern() {
    if (takt) { clearTimeout(takt); takt = null; }
    if (!satz) return;
    var fehler = Wimmelbild.speichern(satz);
    if (fehler) {
      stand('nicht gespeichert');
      H.melden('Nicht gespeichert', fehler);
    } else {
      satz.herkunft = 'lokal';
      kopfZeichnen();
      stand('gespeichert');
    }
  }

  function stand(text) {
    var el = $('ed-stand');
    if (!el || !satz) return;
    var offen = Wimmelbild.offeneZiele(satz);
    el.textContent = satz.fragen.length + ' Fragen · ' +
      (satz.fragen.length - offen) + ' Ziele gesetzt' +
      (text ? ' · ' + text : '');
    el.className = 'stat' + (text === 'gespeichert' ? ' leise' : '');
  }

  /* ============================================================ Zeichnen */

  function kopfZeichnen() {
    if (!satz) return;
    var kz = $('ed-herkunft');
    var ausDatei = Wimmelbild.ausDateiVorhanden(satz.id);
    kz.textContent = satz.herkunft === 'lokal'
      ? (ausDatei ? 'lokal geändert' : 'nur lokal') : 'aus data/';
    kz.className = 'kennzeichen' + (satz.herkunft === 'lokal' ? ' lokal' : '');
    $('ed-verwerfen').hidden = !(satz.herkunft === 'lokal' && ausDatei);
  }

  function zeichnen() {
    if (!satz) return;
    $('ed-titel').value = satz.titel;
    $('ed-id').value = satz.id;
    kopfZeichnen();
    $('ed-reihum').setAttribute('aria-pressed', String(reihum));
    $('ed-reihum').textContent = reihum ? 'Reihum: an' : 'Reihum setzen';

    markenZeichnen();
    listeZeichnen();
    hinweisZeichnen();
    stand('');
  }

  function markenZeichnen() {
    var ebene = $('ed-marker');
    ebene.innerHTML = '';
    satz.fragen.forEach(function (f, i) {
      if (!f.gesetzt) return;
      var z = Wimmelbild.ziel(satz, f);
      H.marke(ebene, 'kalibriert' + (i === aktiv ? ' aktiv' : ''), z.rx, z.ry, String(f.nr));
    });
    var jetzt = satz.fragen[aktiv];
    if (jetzt && jetzt.gesetzt) {
      var z2 = Wimmelbild.ziel(satz, jetzt);
      H.zielring(ebene, z2.rx, z2.ry, Wimmelbild.radius(satz, jetzt));
    }
  }

  function hinweisZeichnen() {
    var el = $('ed-hinweis');
    var f = satz.fragen[aktiv];
    if (!satz.fragen.length) {
      el.textContent = 'Noch keine Fragen. Rechts eine anlegen oder eine Liste importieren.';
    } else if (!f) {
      el.textContent = '';
    } else {
      el.textContent = (f.gesetzt ? 'Stelle für „' + f.ziel + '“ verschieben: '
                                  : 'Stelle für „' + f.ziel + '“ setzen: ') + 'ins Bild klicken';
    }
    el.hidden = !el.textContent;
  }

  function listeZeichnen() {
    var liste = $('ed-fragen');
    liste.innerHTML = '';
    satz.fragen.forEach(function (f, i) {
      liste.appendChild(i === aktiv ? zeileOffen(f, i) : zeileZu(f, i));
    });
    var offen = liste.querySelector('[aria-current="true"]');
    if (offen && offen.scrollIntoView) offen.scrollIntoView({ block: 'nearest' });
  }

  function zeileZu(f, i) {
    var li = neu('li', 'frage-zeile' + (f.gesetzt ? ' gesetzt' : ''));
    var knopf = neu('button', 'zeile-kopf');
    knopf.type = 'button';
    knopf.appendChild(neu('span', 'nr', f.nr + '.'));
    knopf.appendChild(neu('span', 'ziel', f.ziel || '(ohne Namen)'));
    knopf.appendChild(neu('span', 'punkt', f.gesetzt ? '●' : '○'));
    knopf.addEventListener('click', function () { waehlen(i); });
    li.appendChild(knopf);
    return li;
  }

  function zeileOffen(f, i) {
    var li = neu('li', 'frage-zeile offen' + (f.gesetzt ? ' gesetzt' : ''));
    li.setAttribute('aria-current', 'true');

    var kopf = neu('div', 'zeile-kopf');
    kopf.appendChild(neu('span', 'nr', f.nr + '.'));
    kopf.appendChild(neu('span', 'punkt', f.gesetzt ? '●' : '○'));
    li.appendChild(kopf);

    var frageFeld = H.feld('Frage', 'text', f.frage);
    frageFeld.eingabe.addEventListener('input', function () {
      /* Der kurze Name wandert mit, solange er nicht von Hand abweicht. */
      var mitziehen = !f.ziel || f.ziel === Wimmelbild.zielAusFrage(f.frage);
      f.frage = frageFeld.eingabe.value;
      if (mitziehen) {
        f.ziel = Wimmelbild.zielAusFrage(f.frage);
        zielFeld.eingabe.value = f.ziel;
      }
      hinweisZeichnen();
      merken();
    });
    li.appendChild(frageFeld);

    var zielFeld = H.feld('Gesuchtes', 'text', f.ziel, 'kurzer Name für Liste und Auswertung');
    zielFeld.eingabe.addEventListener('input', function () {
      f.ziel = zielFeld.eingabe.value;
      hinweisZeichnen();
      merken();
    });
    li.appendChild(zielFeld);

    var zeile = neu('div', 'zeile-fuss');
    zeile.appendChild(neu('span', 'koordinate',
      f.gesetzt ? 'x ' + f.x + ', y ' + f.y : 'noch keine Stelle'));

    if (f.gesetzt) {
      var weg = neu('button', 'winzig', 'Stelle löschen');
      weg.type = 'button';
      weg.addEventListener('click', function () {
        f.gesetzt = false; f.x = 0; f.y = 0;
        markenZeichnen(); listeZeichnen(); hinweisZeichnen(); merken();
      });
      zeile.appendChild(weg);
    }

    var loeschen = neu('button', 'winzig gefahr', 'Frage löschen');
    loeschen.type = 'button';
    loeschen.addEventListener('click', function () { frageLoeschen(i); });
    zeile.appendChild(loeschen);
    li.appendChild(zeile);
    return li;
  }

  /* ========================================================= Bearbeiten */

  function waehlen(i) {
    aktiv = Math.max(0, Math.min(i, satz.fragen.length - 1));
    markenZeichnen();
    listeZeichnen();
    hinweisZeichnen();
  }

  function schritt(d) {
    if (!satz.fragen.length) return;
    waehlen((aktiv + d + satz.fragen.length) % satz.fragen.length);
  }

  function bildKlick(px, py) {
    var f = satz.fragen[aktiv];
    if (!f) {
      H.melden('Keine Frage ausgewählt', 'Erst eine Frage anlegen, dann die Stelle im Bild setzen.');
      return;
    }
    var k = Wimmelbild.ausBildpixel(satz, px, py);
    f.x = k.x;
    f.y = k.y;
    f.gesetzt = true;

    if (reihum) {
      for (var i = 1; i <= satz.fragen.length; i++) {
        var k2 = (aktiv + i) % satz.fragen.length;
        if (!satz.fragen[k2].gesetzt) { aktiv = k2; break; }
      }
    }
    markenZeichnen();
    listeZeichnen();
    hinweisZeichnen();
    merken();
  }

  function frageAnlegen() {
    satz.fragen.push({
      nr: satz.fragen.length + 1,
      frage: '', ziel: '', x: 0, y: 0, gesetzt: false, toleranz: null
    });
    waehlen(satz.fragen.length - 1);
    merken();
    var feld = $('ed-fragen').querySelector('[aria-current="true"] input');
    if (feld) feld.focus();
  }

  function frageLoeschen(i) {
    satz.fragen.splice(i, 1);
    nummerieren();
    if (aktiv >= satz.fragen.length) aktiv = Math.max(0, satz.fragen.length - 1);
    zeichnen();
    merken();
  }

  function nummerieren() {
    satz.fragen.forEach(function (f, i) { f.nr = i + 1; });
  }

  /* ============================================================= Import */

  /* Fragen aus Text oder Datei in den offenen Satz übernehmen. */
  function importDialog() {
    var inhalt = neu('div', 'formular');

    var datei = neu('input');
    datei.type = 'file';
    datei.accept = '.txt,.csv,.json,.js,text/plain,application/json';
    var dateiFeld = neu('label', 'feld');
    dateiFeld.appendChild(neu('span', null, 'Datei wählen'));
    dateiFeld.appendChild(datei);
    dateiFeld.appendChild(neu('small', null,
      'Liste als .txt/.csv, oder ein Bildsatz als .json bzw. data/<id>.js'));
    inhalt.appendChild(dateiFeld);

    var textFeld = H.feld('oder Text einfügen', 'textarea', '',
      'Je Zeile eine Frage, Koordinaten optional: 1. Wo ist der Pilz? (50,1290)');
    textFeld.eingabe.rows = 9;
    inhalt.appendChild(textFeld);

    var wahl = neu('div', 'wahlreihe');
    var anhaengen = radio(wahl, 'import-art', 'anhaengen', 'anhängen', true);
    var ersetzen = radio(wahl, 'import-art', 'ersetzen', 'bestehende Fragen ersetzen', false);
    inhalt.appendChild(wahl);

    var vorschau = neu('p', 'hinweis vorschau', 'Noch nichts eingelesen.');
    inhalt.appendChild(vorschau);

    var gelesen = { fragen: [], satz: null };

    function pruefen(text) {
      if (!text.trim()) {
        gelesen = { fragen: [], satz: null };
        vorschau.textContent = 'Noch nichts eingelesen.';
        return;
      }
      try {
        if (/Wimmelbild\s*\.\s*register\s*\(/.test(text)) {
          gelesen = { fragen: Wimmelbild.ausModulQuelltext(text).satz.fragen, satz: null };
          vorschau.textContent = gelesen.fragen.length + ' Fragen aus einem Datenmodul.';
        } else if (/^\s*[[{]/.test(text)) {
          var j = Wimmelbild.ausJson(text);
          gelesen = { fragen: j.satz ? j.satz.fragen : j.fragen, satz: null };
          vorschau.textContent = gelesen.fragen.length + ' Fragen aus JSON.';
        } else {
          var r = Wimmelbild.fragenAusText(text);
          gelesen = { fragen: r.fragen, satz: null };
          vorschau.textContent = r.fragen.length + ' Fragen erkannt, davon ' +
            (r.fragen.length - r.ohneKoordinaten) + ' mit Koordinaten.' +
            (r.uebergangen.length ? ' ' + r.uebergangen.length + ' Zeile(n) übergangen.' : '') +
            (r.fragen.length ? ' Erste: „' + r.fragen[0].frage + '“' : '');
        }
      } catch (e) {
        gelesen = { fragen: [], satz: null };
        vorschau.textContent = 'Nicht lesbar: ' + e.message;
      }
    }

    textFeld.eingabe.addEventListener('input', function () { pruefen(textFeld.eingabe.value); });
    datei.addEventListener('change', function () {
      var d = datei.files[0];
      if (!d) return;
      var leser = new FileReader();
      leser.onload = function () {
        textFeld.eingabe.value = leser.result;
        pruefen(leser.result);
      };
      leser.readAsText(d);
    });

    H.dialog({
      titel: 'Fragen importieren',
      inhalt: inhalt,
      breit: true,
      knoepfe: [
        {
          text: 'Übernehmen', klasse: 'haupt', tun: function () {
            if (!gelesen.fragen.length) {
              vorschau.textContent = 'Nichts zu übernehmen.';
              return false;
            }
            if (ersetzen.checked) satz.fragen = [];
            gelesen.fragen.forEach(function (f) { satz.fragen.push(f); });
            nummerieren();
            aktiv = 0;
            zeichnen();
            sofortSpeichern();
          }
        },
        { text: 'Abbrechen' }
      ]
    });
    void anhaengen;
  }

  function radio(wo, name, wert, text, an) {
    var l = neu('label', 'schalter');
    var e = neu('input');
    e.type = 'radio';
    e.name = name;
    e.value = wert;
    e.checked = an;
    l.appendChild(e);
    l.appendChild(neu('span', null, text));
    wo.appendChild(l);
    return e;
  }

  /* ============================================================= Export */

  function exportDialog() {
    sofortSpeichern();
    var inhalt = neu('div', 'formular');
    var wahl = neu('div', 'wahlreihe');
    var artModul = radio(wahl, 'export-art', 'modul', 'JS-Modul für data/', true);
    var artJson = radio(wahl, 'export-art', 'json', 'JSON mit eingebettetem Bild', false);
    var artText = radio(wahl, 'export-art', 'text', 'nur die Fragen als Text', false);
    inhalt.appendChild(wahl);

    var feld = neu('textarea', 'quelltext');
    feld.readOnly = true;
    feld.spellcheck = false;
    inhalt.appendChild(feld);
    var notiz = neu('p', 'hinweis');
    inhalt.appendChild(notiz);

    var jetzt = { text: '', name: '', typ: 'text/plain' };

    function bauen() {
      if (artJson.checked) {
        jetzt.text = Wimmelbild.alsJson(satz);
        jetzt.name = satz.id + '.wimmelbild.json';
        jetzt.typ = 'application/json';
        notiz.textContent = 'Enthält Bild und Fragen in einer Datei – zum Weitergeben und ' +
          'zum Wiedereinlesen über „Importieren" auf dem Startbildschirm.';
      } else if (artText.checked) {
        jetzt.text = Wimmelbild.alsText(satz);
        jetzt.name = satz.id + '-fragen.txt';
        jetzt.typ = 'text/plain';
        notiz.textContent = 'Nur die Frageliste. Lässt sich genauso wieder importieren.';
      } else {
        jetzt.text = Wimmelbild.alsQuelltext(satz);
        jetzt.name = satz.id + '.js';
        jetzt.typ = 'text/javascript';
        notiz.textContent = 'Nach data/' + satz.id + '.js speichern und in index.html eine Zeile ' +
          '<script src="data/' + satz.id + '.js"></script> ergänzen. Das Bild gehört als ' +
          satz.bildDatei + ' daneben – dafür unten „Bild speichern".';
      }
      if (jetzt.text.length > 120000) {
        feld.value = '(' + H.bytes(jetzt.text.length) + ' – zu groß für die Vorschau, ' +
          'bitte herunterladen)';
      } else {
        feld.value = jetzt.text;
      }
    }

    [artModul, artJson, artText].forEach(function (r) {
      r.addEventListener('change', bauen);
    });
    bauen();

    var knoepfe = [
      { text: 'Herunterladen', klasse: 'haupt', tun: function () {
          H.herunterladen(jetzt.name, jetzt.text, jetzt.typ);
          return false;
        } },
      { text: 'Kopieren', tun: function (fenster, knopf) {
          H.kopieren(jetzt.text, knopf);
          return false;
        } }
    ];
    if (satz.bild.slice(0, 5) === 'data:') {
      knoepfe.push({ text: 'Bild speichern', tun: function () {
        H.datenUriHerunterladen(satz.bildDatei.replace(/^.*\//, ''), satz.bild);
        return false;
      } });
    }
    knoepfe.push({ text: 'Schließen' });

    H.dialog({ titel: 'Exportieren', inhalt: inhalt, breit: true, knoepfe: knoepfe });
  }

  /* ======================================================= Einstellungen */

  function einstellungenDialog() {
    var inhalt = neu('div', 'formular');
    var untertitel = H.feld('Untertitel', 'text', satz.untertitel);
    var raumB = H.feld('Koordinatenraum Breite', 'number', satz.koordinatenRaum.breite);
    var raumH = H.feld('Koordinatenraum Höhe', 'number', satz.koordinatenRaum.hoehe);
    var toleranz = H.feld('Trefferradius', 'number', satz.toleranz,
      'Anteil der kurzen Bildseite. 0,06 sind bei diesem Bild ' +
      Math.round(0.06 * Math.min(satz.bildGroesse.breite, satz.bildGroesse.hoehe)) + ' px.');
    toleranz.eingabe.step = '0.01';
    var bildDatei = H.feld('Bildpfad beim Export', 'text', satz.bildDatei);

    inhalt.appendChild(untertitel);
    inhalt.appendChild(neu('p', 'hinweis',
      'Der Koordinatenraum ist das Zahlensystem der Fragen. Bei eigenen Fragen ist das ' +
      'die Bildgröße (' + satz.bildGroesse.breite + '×' + satz.bildGroesse.hoehe + '); bei ' +
      'importierten Listen der Raum, aus dem die Zahlen stammen. Ändern verschiebt alle ' +
      'gesetzten Stellen nicht – sie werden mitgerechnet.'));
    var raumReihe = neu('div', 'feldreihe');
    raumReihe.appendChild(raumB);
    raumReihe.appendChild(raumH);
    inhalt.appendChild(raumReihe);
    inhalt.appendChild(toleranz);
    inhalt.appendChild(bildDatei);

    H.dialog({
      titel: 'Einstellungen', inhalt: inhalt, breit: false,
      knoepfe: [
        { text: 'Übernehmen', klasse: 'haupt', tun: function () {
            satz.untertitel = untertitel.eingabe.value.trim();
            var nb = parseFloat(raumB.eingabe.value) || satz.koordinatenRaum.breite;
            var nh = parseFloat(raumH.eingabe.value) || satz.koordinatenRaum.hoehe;
            umrechnen(nb, nh);
            var t = parseFloat(String(toleranz.eingabe.value).replace(',', '.'));
            if (t > 0 && t < 1) satz.toleranz = t;
            satz.bildDatei = bildDatei.eingabe.value.trim() || satz.bildDatei;
            zeichnen();
            sofortSpeichern();
          } },
        { text: 'Abbrechen' }
      ]
    });
  }

  /* Koordinatenraum wechseln, ohne dass die Stellen im Bild wandern. */
  function umrechnen(breite, hoehe) {
    if (breite === satz.koordinatenRaum.breite && hoehe === satz.koordinatenRaum.hoehe) return;
    var alt = satz.koordinatenRaum;
    satz.fragen.forEach(function (f) {
      if (!f.gesetzt) return;
      f.x = Math.round(f.x / alt.breite * breite);
      f.y = Math.round(f.y / alt.hoehe * hoehe);
    });
    satz.koordinatenRaum = { breite: breite, hoehe: hoehe };
  }

  /* ============================================================== Bild */

  function bildErsetzen() {
    Aufnahme.bildDialog({
      titel: 'Bild ersetzen',
      uebernehmen: function (ergebnis) {
        satz.bild = ergebnis.datenUri;
        satz.bildGroesse = { breite: ergebnis.breite, hoehe: ergebnis.hoehe };
        satz.quelle = ergebnis.quelle;
        if (satz.bild.slice(0, 5) === 'data:') satz.bildDatei = 'images/' + satz.id + '.jpg';
        ansicht.laden(satz);
        requestAnimationFrame(function () { ansicht.einpassen(); });
        zeichnen();
        sofortSpeichern();
      }
    });
  }

  /* =========================================================== Umbenennen */

  function kennungAendern(neueId) {
    var sauber = neueId.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (!sauber || sauber === satz.id) {
      $('ed-id').value = satz.id;
      return;
    }
    if (Wimmelbild.get(sauber)) {
      $('ed-id').value = satz.id;
      H.melden('Kennung schon vergeben', 'Ein anderer Bildsatz heißt bereits „' + sauber + '".');
      return;
    }
    var altId = satz.id;
    var warLokal = Wimmelbild.istLokal(altId);
    satz.id = sauber;
    if (satz.bildDatei === 'images/' + altId + '.jpg') satz.bildDatei = 'images/' + sauber + '.jpg';
    if (warLokal) Wimmelbild.verwerfen(altId);
    $('ed-id').value = sauber;
    zeichnen();
    sofortSpeichern();
  }

  /* ============================================================ Verwerfen */

  function lokaleFassungVerwerfen() {
    H.fragen('Änderungen verwerfen',
      'Die lokale Fassung von „' + satz.titel + '" wird gelöscht. Danach gilt wieder, was in ' +
      'data/' + satz.id + '.js steht.',
      'Verwerfen', function () {
        if (takt) { clearTimeout(takt); takt = null; }
        Wimmelbild.verwerfen(satz.id);
        satz = null;
        H.seite('start');
        App.startAufbauen();
      });
  }

  /* ========================================================= Verdrahtung */

  function verdrahten() {
    $('ed-titel').addEventListener('input', function () {
      satz.titel = $('ed-titel').value;
      merken();
    });
    $('ed-id').addEventListener('change', function () { kennungAendern($('ed-id').value); });
    $('ed-speichern').addEventListener('click', sofortSpeichern);
    $('ed-neu-frage').addEventListener('click', frageAnlegen);
    $('ed-import').addEventListener('click', importDialog);
    $('ed-export').addEventListener('click', exportDialog);
    $('ed-einstellungen').addEventListener('click', einstellungenDialog);
    $('ed-bild-ersetzen').addEventListener('click', bildErsetzen);
    $('ed-verwerfen').addEventListener('click', lokaleFassungVerwerfen);
    $('ed-fertig').addEventListener('click', schliessen);
    $('ed-reihum').addEventListener('click', function () {
      reihum = !reihum;
      zeichnen();
    });
    $('ed-zoom-rein').addEventListener('click', function () { ansicht.zoomen(1.4); });
    $('ed-zoom-raus').addEventListener('click', function () { ansicht.zoomen(1 / 1.4); });
    $('ed-zoom-zurueck').addEventListener('click', function () { ansicht.einpassen(); });
  }

  function tasten(e) {
    if (!satz) return;
    var imFeld = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === 'Escape') { schliessen(); return; }
    if (imFeld) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); schritt(1); }
    if (e.key === 'ArrowUp') { e.preventDefault(); schritt(-1); }
    if (e.key === '0') ansicht.einpassen();
    if (e.key === '+') ansicht.zoomen(1.4);
    if (e.key === '-') ansicht.zoomen(1 / 1.4);
  }

  return {
    oeffnen: oeffnen,
    verdrahten: verdrahten,
    tasten: tasten,
    einpassen: function () { if (ansicht) ansicht.einpassen(); },
    offenerSatz: function () { return satz; }
  };
})();
