#!/usr/bin/env python3
"""
Verfahren: Ideen-DB → Mini-Apps.

  python3 tools/ideen-app/prozedere.py            # Plan zeigen (dry run)
  python3 tools/ideen-app/prozedere.py --run      # ausführen (pi, max 3 parallel)

Regeln:
  - Status „Erstellen":     neue App erzeugen. Existiert das Verzeichnis schon,
                            warnen und überspringen. Prompt = Idee + Prompt-Spalte
                            (Prompt-Spalte hat im Zweifel Vorrang).
  - Status „Nachbearbeiten": bestehende App anpassen. Die App wird über die
                            Kennung `idee-db: <id>` im Kopf ihrer app.js gefunden;
                            Anweisungen kommen aus der Prompt-Spalte.
  - App-Verzeichnis: apps/<slug>/. Bei „Erstellen" wählt der Agent den Slug
    (kebab-case) und trägt `idee-db: <id>` in den app.js-Kopf ein.
"""
import argparse, json, re, sqlite3, subprocess, sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

REPO = Path("/home/heinitz@AESKU.local/development/eval/logicapp")
DB = REPO / "tools/ideen-app/ideen.db"
APPS = REPO / "apps"
PROMPT_DIR = REPO / "tools/ideen-app/prompts"
LOGS = REPO / "tools/ideen-app/logs"

RAHMEN = """Du baust/änderst EINE Mini-App im LOGIK-Trainer-Projekt (KABC-II-angelehntes
Kindertraining). Gemeinsames Framework liegt in apps/_framework/ – lies zuerst
dessen README.md und framework.js.

Vertrag jeder App: apps/<slug>/app.js definiert
  new MiniApp({ id, icon, titel{de,ru,en}, anweisung{de,ru,en}, hilfe{de,ru,en},
                settingsSchema, init(state,app), render(state,app)->HTML/SVG,
                actions{}, onTap/onDrag/onDrop(state,…,app), evaluate(state,app) })
und index.html lädt ../_framework/framework.css + ./app.bundle.js (wird nachher
mit `npm run build:miniapps` gebündelt).

Im app.js-Kopf steht die Kennung `idee-db: <id>` (bei neuer App: eintragen).
Texte immer {de,ru,en} – die App ist wie die Haupt-App mehrsprachig und für
weitere Sprachen erweiterbar (einfach einen Schlüssel ergänzen).

Schreibe NUR die Dateien der App; nichts anderes im Repo ändern.
"""


def db_rows(statuses):
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    q = ",".join("?" * len(statuses))
    rows = con.execute(
        f"SELECT * FROM beitraege WHERE status IN ({q}) ORDER BY id", statuses
    ).fetchall()
    con.close()
    return rows


def existing_app_for(beitrag_id):
    """App-Verzeichnis zur DB-Zeile finden (über idee-db: Kennung)."""
    for d in APPS.iterdir():
        if not d.is_dir() or d.name.startswith("_"):
            continue
        app_js = d / "app.js"
        if app_js.exists() and re.search(rf"idee-db:\s*{beitrag_id}\b", app_js.read_text(encoding="utf-8")):
            return d
    return None


def prompt_erstellen(row):
    slug_hint = re.sub(r"[^a-z0-9]+", "-", row["stelle"].lower())[:40].strip("-")
    return RAHMEN + f"""

# AUFGABE: neue Mini-App erstellen

DB-Zeile {row['id']} · Buch: {row['buch']} · Stelle: {row['stelle']}

## Idee (aus der Ideen-Spalte)
{row['nutzung']}

## Zusatzanweisung (hat im Zweifel VORRANG vor der Idee)
{row['prompt'] or '—'}

Erstelle apps/<slug>/ mit index.html + app.js (Slug: kebab-case, kurz;
Vorschlag: {slug_hint}). Trage `idee-db: {row['id']}` in den app.js-Kopf ein.
"""


def prompt_nachbearbeiten(row, appdir):
    app_js = (appdir / "app.js").read_text(encoding="utf-8")
    return RAHMEN + f"""

# AUFGABE: bestehende Mini-App anpassen

DB-Zeile {row['id']} · App: apps/{appdir.name}/

## Anweisungen (Prompt-Spalte, verbindlich)
{row['prompt'] or '—'}

## Aktueller app.js (nur zur Orientierung, nicht neu schreiben)
```js
{app_js[:8000]}
```

Setze die Anweisungen in der App um; Framework-Vertrag beibehalten.
"""


def run_pi(name, prompt, slug_dir=None):
    PROMPT_DIR.mkdir(parents=True, exist_ok=True)
    LOGS.mkdir(parents=True, exist_ok=True)
    pfile = PROMPT_DIR / f"{name}.md"
    pfile.write_text(prompt, encoding="utf-8")
    with open(LOGS / f"{name}.log", "w", encoding="utf-8") as log:
        proc = subprocess.run(
            ["pi", "-p", "--no-session", "-n", name, f"@{pfile}"],
            cwd=REPO, stdout=log, stderr=subprocess.STDOUT, timeout=2400,
        )
    return proc.returncode


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", action="store_true")
    a = ap.parse_args()

    erstellen = db_rows(["Erstellen"])
    nachbearbeiten = db_rows(["Nachbearbeiten"])
    print(f"Erstellen: {len(erstellen)} · Nachbearbeiten: {len(nachbearbeiten)}")

    jobs = []  # (name, prompt, skip_warn)

    for row in erstellen:
        # Existiert schon eine App mit dieser Kennung? sonst: gibt es den
        # vorgeschlagenen Slug schon?
        if existing_app_for(row["id"]):
            print(f"  SKIP (schon da) #{row['id']} {row['stelle']}")
            continue
        jobs.append((f"erstellen-{row['id']}", prompt_erstellen(row)))

    for row in nachbearbeiten:
        appdir = existing_app_for(row["id"])
        if not appdir:
            print(f"  SKIP (keine App mit idee-db:{row['id']}) #{row['id']}")
            continue
        jobs.append((f"nachbearbeiten-{row['id']}", prompt_nachbearbeiten(row, appdir)))

    if not jobs:
        print("nichts zu tun.")
        return
    for name, prompt, *_ in jobs:
        print(f"  geplant: {name}")

    if not a.run:
        print("\n(dry run – zum Ausführen: --run)")
        return

    with ThreadPoolExecutor(max_workers=3) as ex:
        futs = {ex.submit(run_pi, name, prompt): name for name, prompt in jobs}
        for fut in as_completed(futs):
            name = futs[fut]
            rc = fut.result()
            print(f"  {'OK ' if rc == 0 else 'FEHL'} {name}")
    print("fertig. Danach:  npm run build:miniapps")


if __name__ == "__main__":
    main()
