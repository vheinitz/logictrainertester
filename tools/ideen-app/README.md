# Ideen-DB — lokale Web-Oberfläche über die Buch-Ideen

Aus den 64 gescreenten Büchern (`tools/book-referenzen/*.html`) wurden
**922 Beiträge** in eine SQLite-DB geparst. Jeder Beitrag hat:

- Buch (Titel + Dateiname)
- Relevanz (1–5 ★)
- Punkt in App (Modul / kognitiver Faktor / Förderung)
- Stelle im Buch (Seite + Kapitel)
- Nutzung (8–12 eigene Sätze, wie die Stelle als Test/Übung/Spiel umsetzbar ist)
- Prompt (eigenes Feld, wird in der DB gespeichert)
- Status: Neu / Ignorieren / Erstellen / Nachbearbeiten / Fertig

## Starten

```bash
cd tools/ideen-app
python3 app.py            # http://127.0.0.1:5080
```

## Neu aufbauen (falls HTML geändert)

```bash
cd tools/ideen-app
python3 build_db.py       # liest tools/book-referenzen/*.html neu ein
```

## Bedienung

- **Suche:** Volltext über Nutzung, Punkt, Stelle, Buch, Titel, Prompt.
- **Filter:** Status, Buch, Mindest-Relevanz.
- **Sortierung:** Relevanz, Buch, Stelle, Punkt, Status (auf-/absteigend).
- **Prompt + Status** werden beim Ändern sofort per AJAX gespeichert.

## Sind die Quellbücher noch nötig?

Für die Ideen-DB: **nein.** Das Wesentliche steckt bereits in den
HTML-Dateien und der DB (die 8–12-Satz-Umsetzungen, Seitenangaben, App-Punkte).

Die Original-PDFs/DJVUs (`input_data/books_vk/`) brauchst du nur noch, wenn du
einen echten Buchtext nachschlagen, neu extrahieren oder Seitenbilder ansehen
willst. Der extrahierte Text liegt zusätzlich in `tools/book-search/work/`.
