#!/usr/bin/env python3
"""
Pro Buch einen pi-Agenten: Screent das Buch und schreibt eine HTML-Seite
mit Referenzen auf App-Punkte (Test/Übung/Spiel). Max. 3 parallel.

Aufruf:
  python3 tools/book-screening/run.py              # alle Bücher
  python3 tools/book-screening/run.py --limit 1    # nur 1 Buch (Test)
  python3 tools/book-screening/run.py --only NAME  # ein bestimmtes Buch
"""
import argparse, subprocess, sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

REPO = Path("/home/heinitz@AESKU.local/development/eval/logicapp")
BOOKS_DIR = Path("/home/heinitz@AESKU.local/priv/books/books_vk")
WORK = REPO / "tools/book-search/work"
OUT = REPO / "tools/book-referenzen"
PROMPT_DIR = REPO / "tools/book-screening/prompts"
LOGS = REPO / "tools/book-screening/logs"

PROMPT = """Du screennst GENAU EIN Buch für den LOGIK-Trainer.

# Kontext
LOGIK-Trainer ist eine Offline-App für kognitives Training bei Kindern,
angelehnt an die Struktur der KABC-II. Kein Diagnose-Tool — Übungsrückmeldung.

Die App hat 29 Module in 5 Skalen:
- Sequentiell/Gsm: Zahlenfolgen (sehen + hören), Wörter-Kette, Handbewegungen, Koffer packen, Rhythmus-Klopfer
- Simultan/Gv: „Was passt nicht?", Gesichter, Rover im Labyrinth, Dreiecke legen, Bausteine zählen, Gestaltschließen, Tangram, Suchbild
- Lernen/Glr: Atlantis, Symbole merken, Memory, Geschichten-Würfel
- Planung/Gf: Bildergeschichte ordnen, Muster fortsetzen, Bilder-Sudoku, Zaubertrick nachmachen
- Wissen/Gc: Wortschatz, Sachwissen, Rätsel, Oberbegriffe, Teekesselchen
Dazu: 89 kognitive Faktoren (Gedächtnis, Aufmerksamkeit, räumliches Denken, exekutive Funktionen, Motorik, Sprache, …) und Fördermethoden für den Alltag.

# Das Buch
Name: {{BOOK}}
Extrahierter Text (eine Datei = eine Seite, 0001.txt …): tools/book-search/work/{{BOOK}}/

# Deine Aufgabe
Finde die Stellen im Buch, die als Grundlage für neue Tests, Übungen oder Spiele der App taugen. Arbeite nur mit dem extrahierten Text (read-Tool). Bei langen Büchern: zuerst Inhaltsverzeichnis lesen, dann gezielt die Kapitel mit Aufgaben/Übungen.

# Vorgehen
1. Lies zuerst das Inhaltsverzeichnis (falls vorhanden) und einige Seiten aus jedem relevanten Kapitel.
2. Finde KONKRETE Stellen (Seite + Abschnitt), die eine Test-, Übungs- oder Spielidee liefern.
3. Pro Stelle eine Tabellenzeile. Nimm nur wirklich passende Stellen, maximal ~15. Wenn nichts passt, eine einzige Zeile mit „keine nutzbaren Stellen".

# HTML-Ausgabe (minimales Markup)
Schreibe GENAU eine Datei: tools/book-referenzen/{{BOOK}}.html

Inhalt:
- <h1>Buchtitel</h1>
- <p>Ein Satz, worum es im Buch geht.</p>
- <table> mit Kopfzeile und einer Zeile je Stelle. Spalten:
  1. Relevanz (1–5, als ★, z. B. ★★★★☆)
  2. Punkt in App (welches Modul / welcher Faktor / welche Förderung)
  3. Stelle im Buch (Seite + Abschnitt/Kapitelname)
  4. Nutzung für die App: 8–12 EIGENE Sätze, die beschreiben, WIE man diese Stelle als Test, Übung oder Spiel umsetzt — konkret, in eigenen Worten. KEIN wörtliches Kopieren aus dem Buch, KEIN plumper Textextrakt.

Regeln:
- Beschreibungen auf Deutsch.
- Kein CSS, kein JavaScript, keine weiteren Dateien. Nur die eine HTML-Datei.
- Keine anderen Dateien im Repo ändern oder anlegen.
"""


def books():
    for f in sorted(BOOKS_DIR.iterdir()):
        if f.suffix.lower() not in (".pdf", ".djvu"):
            continue
        if not (WORK / f.stem).is_dir():
            continue
        yield f.stem


def make_prompt(book):
    return PROMPT.replace("{{BOOK}}", book)


def run_one(book):
    PROMPT_DIR.mkdir(parents=True, exist_ok=True)
    LOGS.mkdir(parents=True, exist_ok=True)
    pfile = PROMPT_DIR / f"{book}.md"
    pfile.write_text(make_prompt(book), encoding="utf-8")
    logfile = LOGS / f"{book}.log"
    with open(logfile, "w", encoding="utf-8") as log:
        proc = subprocess.run(
            ["pi", "-p", "--no-session", "-n", book, f"@{pfile}"],
            cwd=REPO, stdout=log, stderr=subprocess.STDOUT, timeout=2400,
        )
    out = OUT / f"{book}.html"
    return book, out.exists(), proc.returncode


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--only", default="")
    a = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    todo = list(books())
    if a.only:
        todo = [b for b in todo if a.only in b]
    if a.limit:
        todo = todo[:a.limit]
    print(f"{len(todo)} Bücher, max. 3 parallel")

    done, failed = [], []
    with ThreadPoolExecutor(max_workers=3) as ex:
        futures = {ex.submit(run_one, b): b for b in todo}
        for fut in as_completed(futures):
            b, ok, rc = fut.result()
            (done if ok else failed).append(b)
            print(f"{'OK  ' if ok else 'FEHL'} {b}  ({len(done)+len(failed)}/{len(todo)})")

    print(f"\nfertig: {len(done)} ok, {len(failed)} fehlgeschlagen")
    for b in failed:
        print("  -", b)


if __name__ == "__main__":
    main()
