/* Kleinteile, die Spiel und Editor gemeinsam brauchen: Seitenwechsel, Marken
   im Bild, Zahlen- und Zeitformate, Dateidownload und ein Dialog. */

var H = (function () {
  'use strict';

  var SEITEN = ['start', 'spiel', 'ende', 'editor'];

  function $(id) { return document.getElementById(id); }

  function neu(tag, klasse, text) {
    var el = document.createElement(tag);
    if (klasse) el.className = klasse;
    if (text !== undefined && text !== null) el.textContent = text;
    return el;
  }

  function seite(name) {
    SEITEN.forEach(function (s) { $(s).hidden = s !== name; });
  }

  function sichtbar(name) { return !$(name).hidden; }

  function zeit(ms) {
    var s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  function sekunden(ms) { return (ms / 1000).toFixed(1).replace('.', ',') + ' s'; }

  function bytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return Math.round(n / 1024) + ' kB';
    return (n / 1024 / 1024).toFixed(1).replace('.', ',') + ' MB';
  }

  /* Eine Marke sitzt in Prozent auf dem Bild; --gegen skaliert sie gegen den
     Zoom zurück, damit sie ihre Bildschirmgröße behält. */
  function marke(ebene, klassen, rx, ry, beschriftung) {
    var el = neu('div', 'marke ' + klassen);
    el.style.left = (rx * 100) + '%';
    el.style.top = (ry * 100) + '%';
    if (beschriftung) el.appendChild(neu('span', 'nummer', beschriftung));
    ebene.appendChild(el);
    return el;
  }

  function zielring(ebene, rx, ry, radius) {
    var el = neu('div', 'zielring');
    el.style.left = (rx * 100) + '%';
    el.style.top = (ry * 100) + '%';
    el.style.width = (2 * radius) + 'px';
    el.style.height = (2 * radius) + 'px';
    ebene.appendChild(el);
    return el;
  }

  function herunterladen(name, inhalt, typ) {
    var blob = inhalt instanceof Blob ? inhalt
      : new Blob([inhalt], { type: (typ || 'text/plain') + ';charset=utf-8' });
    var a = neu('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  function datenUriHerunterladen(name, datenUri) {
    var teile = datenUri.split(',');
    var roh = atob(teile[1]);
    var puffer = new Uint8Array(roh.length);
    for (var i = 0; i < roh.length; i++) puffer[i] = roh.charCodeAt(i);
    var typ = (teile[0].match(/data:([^;]+)/) || [])[1] || 'application/octet-stream';
    herunterladen(name, new Blob([puffer], { type: typ }));
  }

  function kopieren(text, knopf) {
    var fertig = function () {
      if (!knopf) return;
      var alt = knopf.textContent;
      knopf.textContent = 'kopiert';
      setTimeout(function () { knopf.textContent = alt; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(fertig, function () { fertig(); });
    } else {
      var feld = neu('textarea');
      feld.value = text;
      document.body.appendChild(feld);
      feld.select();
      try { document.execCommand('copy'); } catch (e) { /* dann eben nicht */ }
      document.body.removeChild(feld);
      fertig();
    }
  }

  /* -------------------------------------------------------------- Dialog */

  /* dialog({ titel, text, inhalt: HTMLElement, knoepfe: [{text, klasse, tun}],
              breit: true }) – tun() gibt false zurück, um offen zu bleiben. */
  var offen = null;

  function dialog(gestalt) {
    schliessen();
    var hintergrund = neu('div', 'dialog');
    var fenster = neu('div', 'dialog-fenster' + (gestalt.breit ? ' breit' : ''));
    fenster.appendChild(neu('h2', null, gestalt.titel));
    if (gestalt.text) fenster.appendChild(neu('p', 'hinweis', gestalt.text));

    var koerper = neu('div', 'dialog-koerper');
    if (gestalt.inhalt) koerper.appendChild(gestalt.inhalt);
    fenster.appendChild(koerper);

    var reihe = neu('div', 'knopfreihe');
    (gestalt.knoepfe || [{ text: 'Schließen' }]).forEach(function (k) {
      var b = neu('button', k.klasse || 'neben', k.text);
      b.addEventListener('click', function () {
        /* Genau dieses Fenster schließen, nicht das gerade offene: tun() darf
           einen Folgedialog aufmachen, der dann stehen bleiben muss. */
        if (!k.tun || k.tun(fenster, b) !== false) entfernen(hintergrund);
      });
      if (k.name) b.dataset.name = k.name;
      reihe.appendChild(b);
    });
    fenster.appendChild(reihe);

    hintergrund.appendChild(fenster);
    hintergrund.addEventListener('pointerdown', function (e) {
      if (e.target === hintergrund) schliessen();
    });
    document.body.appendChild(hintergrund);
    offen = hintergrund;

    var erstes = fenster.querySelector('input, textarea, select');
    if (erstes) erstes.focus();
    return fenster;
  }

  function entfernen(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
    if (offen === el) offen = null;
  }

  function schliessen() { entfernen(offen); }

  function istOffen() { return !!offen; }

  function melden(titel, text) {
    dialog({ titel: titel, text: text, knoepfe: [{ text: 'Gut', klasse: 'haupt' }] });
  }

  function fragen(titel, text, jaText, tun) {
    dialog({
      titel: titel,
      text: text,
      knoepfe: [
        { text: jaText, klasse: 'haupt', tun: tun },
        { text: 'Abbrechen' }
      ]
    });
  }

  /* Beschriftetes Eingabefeld für die Dialoge. */
  function feld(beschriftung, art, wert, hinweis) {
    var wrap = neu('label', 'feld');
    wrap.appendChild(neu('span', null, beschriftung));
    var ein = neu(art === 'textarea' ? 'textarea' : 'input');
    if (art !== 'textarea') ein.type = art || 'text';
    ein.value = wert === undefined || wert === null ? '' : wert;
    wrap.appendChild(ein);
    if (hinweis) wrap.appendChild(neu('small', null, hinweis));
    wrap.eingabe = ein;
    return wrap;
  }

  return {
    $: $, neu: neu, seite: seite, sichtbar: sichtbar,
    zeit: zeit, sekunden: sekunden, bytes: bytes,
    marke: marke, zielring: zielring,
    herunterladen: herunterladen, datenUriHerunterladen: datenUriHerunterladen,
    kopieren: kopieren,
    dialog: dialog, schliessen: schliessen, istOffen: istOffen,
    melden: melden, fragen: fragen, feld: feld
  };
})();
