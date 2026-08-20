# VK Mini App – Bildgeschichte ordnen

Deploy-fähiges, eigenständiges Paket für die Mini-App `apps/imagestories/`.
Der Original-Code bleibt unverändert; hier liegt nur eine Kopie mit angepasstem
CSS-Pfad (Framework-CSS liegt jetzt lokal als `framework.css` daneben) und einem
minimalen VK-Bridge-Init.

## Inhalt

```
vk/imagestories/
├── index.html        Einstiegspunkt (muss im Zip auf oberster Ebene liegen)
├── app.bundle.js     gebündelte App (Framework + Daten sind bereits enthalten)
├── framework.css     Styles (kopiert aus apps/_framework/)
└── img/              die 5×5-Bildblätter
```

`vk/imagestories.zip` ist das hochladbare Archiv (Dateien auf oberster Ebene).

## In VK veröffentlichen

1. **App anlegen:** https://dev.vk.com → „Мои приложения“ → neue App anlegen,
   Typ **Mini App**.
2. **Hosting (Variante 1, VK-eigenes Hosting):** In der App unter *Hosting*
   `vk/imagestories.zip` hochladen. VK hostet die Dateien dann selbst – du
   brauchst dafür **keinen eigenen Server**.
   - Alternativ: eigene HTTPS-URL eintragen (dann die Dateien dort ausliefern).
3. **Adresse prüfen:** Die `index.html` wird als Startseite geladen; stelle
   sicher, dass sie im Archiv auf der obersten Ebene liegt (ist sie).
4. **Testen:** In der Konsole bzw. in der VK-App über die App-Vorschau öffnen
   (Web, Android, iOS).
5. **Veröffentlichen:** Für den öffentlichen Katalog ist eine Moderation nötig;
   für private Nutzung reicht der Test-/Admin-Modus.

## Hinweise

- Die App ist dreisprachig (de/ru/en); die Sprache kommt aus `localStorage`
  (`miniapp-lang`) und ist im VK-WebView verfügbar.
- `index.html` lädt VK Bridge von unpkg. Fällt der CDN aus, läuft die App
  trotzdem – der Init wird dann still übersprungen.
- Nach Änderungen an `apps/imagestories/`: `npm run build:miniapps` ausführen
  und `app.bundle.js` erneut hierher kopieren.
