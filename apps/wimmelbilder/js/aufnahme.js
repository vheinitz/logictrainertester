/* Aufnahme: ein Bild hereinreichen, den Bildbereich zuschneiden, daraus einen
   neuen Bildsatz anlegen – und ganze Sätze aus einer Datei einlesen. */

var Aufnahme = (function () {
  'use strict';

  var neu = H.neu;

  /* Bilddatei wählen, Bildbereich erkennen und bestätigen lassen.
     ruft uebernehmen({ datenUri, breite, hoehe, quelle }) auf. */
  function bildDialog(gestalt) {
    var inhalt = neu('div', 'formular');

    var datei = neu('input');
    datei.type = 'file';
    datei.accept = 'image/*';
    var dateiFeld = neu('label', 'feld');
    dateiFeld.appendChild(neu('span', null, 'Bilddatei'));
    dateiFeld.appendChild(datei);
    dateiFeld.appendChild(neu('small', null,
      'Das ganze Blatt genügt – der Bildbereich wird herausgeschnitten.'));
    inhalt.appendChild(dateiFeld);

    var schalter = neu('label', 'schalter');
    var haken = neu('input');
    haken.type = 'checkbox';
    haken.checked = true;
    schalter.appendChild(haken);
    schalter.appendChild(neu('span', null, 'Bildbereich automatisch zuschneiden'));
    schalter.hidden = true;
    inhalt.appendChild(schalter);

    var rahmen = neu('div', 'zuschnitt-vorschau');
    rahmen.hidden = true;
    var vorschauBild = neu('img');
    var kasten = neu('div', 'zuschnitt-kasten');
    rahmen.appendChild(vorschauBild);
    rahmen.appendChild(kasten);
    inhalt.appendChild(rahmen);

    var felder = neu('div', 'feldreihe');
    felder.hidden = true;
    var fX = H.feld('x', 'number', 0), fY = H.feld('y', 'number', 0);
    var fB = H.feld('Breite', 'number', 0), fH = H.feld('Höhe', 'number', 0);
    [fX, fY, fB, fH].forEach(function (f) { felder.appendChild(f); });
    inhalt.appendChild(felder);

    var notiz = neu('p', 'hinweis', 'Noch kein Bild gewählt.');
    inhalt.appendChild(notiz);

    var geladen = null;   // { element, breite, hoehe, name }
    var bereich = null;

    function kastenZeichnen() {
      if (!geladen || !bereich) return;
      kasten.style.left = (bereich.x / geladen.breite * 100) + '%';
      kasten.style.top = (bereich.y / geladen.hoehe * 100) + '%';
      kasten.style.width = (bereich.breite / geladen.breite * 100) + '%';
      kasten.style.height = (bereich.hoehe / geladen.hoehe * 100) + '%';
      kasten.hidden = !haken.checked;
      notiz.textContent = haken.checked
        ? 'Bildbereich: x ' + bereich.x + ', y ' + bereich.y + ', ' +
          bereich.breite + '×' + bereich.hoehe + ' – Werte bei Bedarf anpassen.'
        : 'Das ganze Blatt wird übernommen (' + geladen.breite + '×' + geladen.hoehe + ').';
    }

    function felderSetzen() {
      fX.eingabe.value = bereich.x;
      fY.eingabe.value = bereich.y;
      fB.eingabe.value = bereich.breite;
      fH.eingabe.value = bereich.hoehe;
    }

    [fX, fY, fB, fH].forEach(function (f) {
      f.eingabe.addEventListener('input', function () {
        if (!geladen) return;
        bereich = {
          x: begrenzen(fX.eingabe.value, 0, geladen.breite - 1),
          y: begrenzen(fY.eingabe.value, 0, geladen.hoehe - 1),
          breite: begrenzen(fB.eingabe.value, 1, geladen.breite),
          hoehe: begrenzen(fH.eingabe.value, 1, geladen.hoehe)
        };
        kastenZeichnen();
      });
    });

    haken.addEventListener('change', function () {
      felder.hidden = !haken.checked;
      kastenZeichnen();
    });

    datei.addEventListener('change', function () {
      var d = datei.files[0];
      if (!d) return;
      notiz.textContent = 'Bild wird gelesen …';
      Bild.ausDatei(d).then(function (erg) {
        geladen = erg;
        vorschauBild.src = erg.datenUri;
        /* Höhe begrenzen, ohne das Bild im Kasten zu zentrieren – sonst läge
           der Zuschnittrahmen daneben. Also über die Breite deckeln. */
        rahmen.style.maxWidth = (erg.breite / erg.hoehe * 42) + 'vh';
        rahmen.hidden = false;
        schalter.hidden = false;
        var gefunden = Bild.bereichFinden(erg.element);
        if (!gefunden || gefunden.ganzesBild) {
          bereich = { x: 0, y: 0, breite: erg.breite, hoehe: erg.hoehe };
          haken.checked = false;
        } else {
          bereich = gefunden;
          haken.checked = true;
        }
        felder.hidden = !haken.checked;
        felderSetzen();
        kastenZeichnen();
        if (gestalt.beiBild) gestalt.beiBild(erg);
      }, function (fehler) {
        notiz.textContent = fehler.message;
      });
    });

    H.dialog({
      titel: gestalt.titel || 'Bild aufnehmen',
      text: gestalt.text,
      inhalt: inhalt,
      breit: true,
      knoepfe: [
        { text: gestalt.knopf || 'Übernehmen', klasse: 'haupt', tun: function () {
            if (!geladen) { notiz.textContent = 'Erst eine Bilddatei wählen.'; return false; }
            var b = haken.checked ? bereich
              : { x: 0, y: 0, breite: geladen.breite, hoehe: geladen.hoehe };
            var erg = Bild.zuschneiden(geladen.element, b);
            gestalt.uebernehmen({
              datenUri: erg.datenUri,
              breite: erg.breite,
              hoehe: erg.hoehe,
              name: geladen.name,
              quelle: { datei: geladen.name, zuschnitt: b }
            });
          } },
        { text: 'Abbrechen' }
      ]
    });
  }

  function begrenzen(wert, min, max) {
    var n = Math.round(parseFloat(wert));
    if (isNaN(n)) n = min;
    return Math.max(min, Math.min(max, n));
  }

  /* Neues Bild anlegen: Bild wählen, Name vergeben, Editor öffnen. */
  function neuerSatzDialog() {
    bildDialog({
      titel: 'Neues Wimmelbild',
      text: 'Bild wählen und zuschneiden. Die Fragen kommen danach im Editor dazu – ' +
            'einzeln getippt oder als Liste importiert.',
      knopf: 'Weiter',
      uebernehmen: function (erg) {
        var vorschlag = (erg.name || 'wimmelbild').replace(/\.[^.]+$/, '');
        namenDialog(vorschlag, function (titel, id) {
          var satz = Wimmelbild.neuerSatz({
            id: id,
            titel: titel,
            bild: erg.datenUri,
            bildDatei: 'images/' + id + '.jpg',
            bildGroesse: { breite: erg.breite, hoehe: erg.hoehe },
            koordinatenRaum: { breite: erg.breite, hoehe: erg.hoehe },
            quelle: erg.quelle,
            fragen: []
          });
          var fehler = Wimmelbild.speichern(satz);
          if (fehler) { H.melden('Nicht angelegt', fehler); return; }
          Editor.oeffnen(Wimmelbild.get(id));
        });
      }
    });
  }

  function namenDialog(vorschlag, weiter) {
    var inhalt = neu('div', 'formular');
    var titel = H.feld('Titel', 'text', huebsch(vorschlag));
    var kennung = H.feld('Kennung', 'text', kennungAus(vorschlag),
      'Dateiname ohne Endung: data/<Kennung>.js, images/<Kennung>.jpg');
    inhalt.appendChild(titel);
    inhalt.appendChild(kennung);

    var vonHand = false;
    kennung.eingabe.addEventListener('input', function () { vonHand = true; });
    titel.eingabe.addEventListener('input', function () {
      if (!vonHand) kennung.eingabe.value = kennungAus(titel.eingabe.value);
    });

    H.dialog({
      titel: 'Name des Bildsatzes',
      inhalt: inhalt,
      knoepfe: [
        { text: 'Anlegen', klasse: 'haupt', tun: function (fenster) {
            var id = kennungAus(kennung.eingabe.value);
            if (!id) { return meckern(fenster, 'Die Kennung darf nicht leer sein.'); }
            if (Wimmelbild.get(id)) {
              return meckern(fenster, 'Die Kennung „' + id + '" ist schon vergeben.');
            }
            weiter(titel.eingabe.value.trim() || id, id);
          } },
        { text: 'Abbrechen' }
      ]
    });
  }

  function meckern(fenster, text) {
    var p = fenster.querySelector('.meckern') || neu('p', 'hinweis meckern');
    p.textContent = text;
    fenster.querySelector('.dialog-koerper').appendChild(p);
    return false;
  }

  function kennungAus(text) {
    return String(text || '').toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  }

  function huebsch(text) {
    var t = String(text || '').replace(/[-_]+/g, ' ').trim();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  /* Ganzen Bildsatz aus einer Datei einlesen (.json mit Bild oder data/<id>.js). */
  function satzImportDialog() {
    var inhalt = neu('div', 'formular');
    var datei = neu('input');
    datei.type = 'file';
    datei.accept = '.json,.js,application/json,text/javascript';
    var dateiFeld = neu('label', 'feld');
    dateiFeld.appendChild(neu('span', null, 'Datei'));
    dateiFeld.appendChild(datei);
    dateiFeld.appendChild(neu('small', null,
      'Ein exportiertes .wimmelbild.json (mit Bild) oder ein Modul aus data/'));
    inhalt.appendChild(dateiFeld);

    var notiz = neu('p', 'hinweis', 'Noch keine Datei gewählt.');
    inhalt.appendChild(notiz);

    var bereit = null;

    datei.addEventListener('change', function () {
      var d = datei.files[0];
      if (!d) return;
      var leser = new FileReader();
      leser.onload = function () {
        try {
          var text = String(leser.result);
          var erg = /Wimmelbild\s*\.\s*register\s*\(/.test(text)
            ? Wimmelbild.ausModulQuelltext(text)
            : Wimmelbild.ausJson(text);
          if (!erg.satz) throw new Error('Die Datei enthält nur Fragen, keinen ganzen Bildsatz. ' +
            'Solche Listen importiert man im Editor unter „Fragen importieren".');
          bereit = erg.satz;
          notiz.textContent = '„' + bereit.titel + '" mit ' + bereit.fragen.length + ' Fragen' +
            (bereit.bild && bereit.bild.slice(0, 5) === 'data:'
              ? ' und eingebettetem Bild (' + bereit.bildGroesse.breite + '×' +
                bereit.bildGroesse.hoehe + ').'
              : '. Ohne eingebettetes Bild – es wird unter ' + bereit.bild + ' gesucht.') +
            (Wimmelbild.get(bereit.id) ? ' Achtung: Kennung „' + bereit.id +
              '" ist belegt und wird überschrieben.' : '');
        } catch (e) {
          bereit = null;
          notiz.textContent = 'Nicht lesbar: ' + e.message;
        }
      };
      leser.readAsText(d);
    });

    H.dialog({
      titel: 'Bildsatz importieren',
      inhalt: inhalt,
      breit: true,
      knoepfe: [
        { text: 'Importieren', klasse: 'haupt', tun: function () {
            if (!bereit) { notiz.textContent = 'Erst eine lesbare Datei wählen.'; return false; }
            var fehler = Wimmelbild.speichern(bereit);
            if (fehler) { H.melden('Nicht importiert', fehler); return; }
            Editor.oeffnen(Wimmelbild.get(bereit.id));
          } },
        { text: 'Abbrechen' }
      ]
    });
  }

  return {
    bildDialog: bildDialog,
    neuerSatzDialog: neuerSatzDialog,
    satzImportDialog: satzImportDialog,
    kennungAus: kennungAus
  };
})();
