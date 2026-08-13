/* Bildwerkzeuge im Browser: Datei einlesen, Bildbereich eines Wimmelbild-
   Blattes finden, zuschneiden und verkleinern.

   Die Bereichserkennung ist dieselbe wie in tools/zuschneiden.py: Die
   Illustration ist bunt, Überschrift und Fragentabelle sind grau. Gesucht wird
   also der längste zusammenhängende Streifen kräftig gefärbter Zeilen, und der
   wird anschließend nach oben und unten erweitert, solange die Zeilen nicht
   weiß sind – der helle Himmel am oberen Bildrand ist kaum gesättigt und würde
   sonst abgeschnitten. */

var Bild = (function () {
  'use strict';

  var SAETTIGUNG_SCHWELLE = 40;   // ab hier gilt eine Zeile als Illustration
  var WEISS_SCHWELLE = 247;       // ab hier gilt eine Zeile als leeres Papier
  var MIN_HOEHE = 50;             // kürzere Streifen sind Zierlinien
  var ANALYSE_KANTE = 200;        // Auflösung quer zur Untersuchungsrichtung
  var MAX_KANTE = 2000;           // größer wird kein Bild abgelegt

  /* Datei -> { datenUri, breite, hoehe, name, typ } */
  function ausDatei(datei) {
    return new Promise(function (erfuellen, ablehnen) {
      if (!/^image\//.test(datei.type)) {
        ablehnen(new Error('Das ist keine Bilddatei (' + (datei.type || 'unbekannt') + ').'));
        return;
      }
      var leser = new FileReader();
      leser.onerror = function () { ablehnen(new Error('Datei nicht lesbar.')); };
      leser.onload = function () {
        laden(leser.result).then(function (el) {
          erfuellen({
            datenUri: leser.result,
            element: el,
            breite: el.naturalWidth,
            hoehe: el.naturalHeight,
            name: datei.name,
            typ: datei.type
          });
        }, ablehnen);
      };
      leser.readAsDataURL(datei);
    });
  }

  function laden(quelle) {
    return new Promise(function (erfuellen, ablehnen) {
      var el = new Image();
      el.onload = function () { erfuellen(el); };
      el.onerror = function () { ablehnen(new Error('Bild nicht lesbar.')); };
      el.src = quelle;
    });
  }

  function flaeche(el, breite, hoehe) {
    var c = document.createElement('canvas');
    c.width = breite;
    c.height = hoehe;
    c.getContext('2d').drawImage(el, 0, 0, breite, hoehe);
    return c.getContext('2d').getImageData(0, 0, breite, hoehe).data;
  }

  /* Mittlere Sättigung und Helligkeit je Zeile bzw. Spalte. */
  function streifenwerte(daten, breite, hoehe, nachZeilen) {
    var aussen = nachZeilen ? hoehe : breite;
    var innen = nachZeilen ? breite : hoehe;
    var saettigung = new Float64Array(aussen);
    var helligkeit = new Float64Array(aussen);
    for (var a = 0; a < aussen; a++) {
      var sS = 0, sH = 0;
      for (var i = 0; i < innen; i++) {
        var p = (nachZeilen ? a * breite + i : i * breite + a) * 4;
        var r = daten[p], g = daten[p + 1], b = daten[p + 2];
        var max = r > g ? (r > b ? r : b) : (g > b ? g : b);
        var min = r < g ? (r < b ? r : b) : (g < b ? g : b);
        sS += max === 0 ? 0 : (max - min) / max * 255;
        sH += (r + g + b) / 3;
      }
      saettigung[a] = sS / innen;
      helligkeit[a] = sH / innen;
    }
    return { saettigung: saettigung, helligkeit: helligkeit };
  }

  function laengsterStreifen(saettigung, helligkeit, minLaenge) {
    var laeufe = [], start = null;
    for (var i = 0; i < saettigung.length; i++) {
      var bunt = saettigung[i] > SAETTIGUNG_SCHWELLE;
      if (bunt && start === null) start = i;
      if (!bunt && start !== null) { laeufe.push([start, i]); start = null; }
    }
    if (start !== null) laeufe.push([start, saettigung.length]);
    laeufe = laeufe.filter(function (l) { return l[1] - l[0] >= minLaenge; });
    if (!laeufe.length) return null;

    var beste = laeufe.reduce(function (a, b) { return (b[1] - b[0]) > (a[1] - a[0]) ? b : a; });
    var oben = beste[0], unten = beste[1];
    while (oben > 0 && helligkeit[oben - 1] < WEISS_SCHWELLE) oben--;
    while (unten < saettigung.length && helligkeit[unten] < WEISS_SCHWELLE) unten++;
    return { von: oben, bis: unten };
  }

  /* Findet den Illustrationsbereich. Liefert null, wenn nichts erkennbar ist –
     dann ist das Bild vermutlich schon der reine Bildbereich. */
  function bereichFinden(el) {
    var breite = el.naturalWidth || el.width;
    var hoehe = el.naturalHeight || el.height;
    if (!breite || !hoehe) return null;

    // Zeilen: volle Höhe, schmale Breite. Spalten umgekehrt.
    var schmal = Math.max(8, Math.min(ANALYSE_KANTE, breite));
    var zeilen = streifenwerte(flaeche(el, schmal, hoehe), schmal, hoehe, true);
    var senkrecht = laengsterStreifen(zeilen.saettigung, zeilen.helligkeit, MIN_HOEHE);
    if (!senkrecht) return null;

    var flach = Math.max(8, Math.min(ANALYSE_KANTE, hoehe));
    var spalten = streifenwerte(flaeche(el, breite, flach), breite, flach, false);
    var waagerecht = laengsterStreifen(spalten.saettigung, spalten.helligkeit, MIN_HOEHE)
      || { von: 0, bis: breite };

    return {
      x: waagerecht.von,
      y: senkrecht.von,
      breite: waagerecht.bis - waagerecht.von,
      hoehe: senkrecht.bis - senkrecht.von,
      ganzesBild: senkrecht.von === 0 && senkrecht.bis === hoehe &&
                  waagerecht.von === 0 && waagerecht.bis === breite
    };
  }

  /* Schneidet aus und verkleinert, wenn nötig. -> { datenUri, breite, hoehe } */
  function zuschneiden(el, bereich, maxKante) {
    var b = bereich || { x: 0, y: 0, breite: el.naturalWidth, hoehe: el.naturalHeight };
    var grenze = maxKante || MAX_KANTE;
    var faktor = Math.min(1, grenze / Math.max(b.breite, b.hoehe));
    var breite = Math.round(b.breite * faktor);
    var hoehe = Math.round(b.hoehe * faktor);

    var c = document.createElement('canvas');
    c.width = breite;
    c.height = hoehe;
    var ctx = c.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(el, b.x, b.y, b.breite, b.hoehe, 0, 0, breite, hoehe);
    return { datenUri: c.toDataURL('image/jpeg', 0.9), breite: breite, hoehe: hoehe };
  }

  /* Grobe Größe eines data:-URI in Byte. */
  function groesse(datenUri) {
    if (!datenUri) return 0;
    var komma = datenUri.indexOf(',');
    return Math.round((datenUri.length - komma - 1) * 0.75);
  }

  return {
    ausDatei: ausDatei,
    laden: laden,
    bereichFinden: bereichFinden,
    zuschneiden: zuschneiden,
    groesse: groesse,
    MAX_KANTE: MAX_KANTE
  };
})();
