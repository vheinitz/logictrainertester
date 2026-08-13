/* Bildansicht: einpassen, zoomen, verschieben, und ein Klick liefert die
   Stelle in Bildpixeln. Spiel und Editor benutzen dieselbe Mechanik. */

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
  if (this.bild.getAttribute('src') !== satz.bild) this.bild.src = satz.bild;
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
    if (self.buehne.setPointerCapture) self.buehne.setPointerCapture(e.pointerId);
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

  this.buehne.addEventListener('pointerup', function (e) {
    if (!start) return;
    self.buehne.classList.remove('zieht');
    var warGezogen = gezogen;
    start = null; gezogen = false;
    if (warGezogen || !self.beiKlick) return;
    var p = self.zuBild(e.clientX, e.clientY);
    if (p.px >= 0 && p.py >= 0 && p.px <= self.natur.breite && p.py <= self.natur.hoehe) {
      self.beiKlick(p.px, p.py);
    }
  });

  this.buehne.addEventListener('pointercancel', function () {
    start = null; gezogen = false;
    self.buehne.classList.remove('zieht');
  });

  this.buehne.addEventListener('wheel', function (e) {
    e.preventDefault();
    var r = self.buehne.getBoundingClientRect();
    self.zoomen(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX - r.left, e.clientY - r.top);
  }, { passive: false });
};
