#!/usr/bin/env python3
"""HTML-Ideenseiten → SQLite-Datenbank.

Jede Buch-HTML (tools/book-referenzen/*.html) enthält eine Tabelle mit
Spalten: Relevanz, Punkt in App, Stelle im Buch, Nutzung für die App.
Daraus entsteht eine Zeile je Beitrag.
"""
import sqlite3, sys
from html.parser import HTMLParser
from pathlib import Path

REF = Path("/home/heinitz@AESKU.local/development/eval/logicapp/tools/book-referenzen")
DB = Path("/home/heinitz@AESKU.local/development/eval/logicapp/tools/ideen-app/ideen.db")

class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_h1 = False
        self.in_p = False
        self.p_count = 0
        self.h1 = ""
        self.desc = ""
        self.in_td = False
        self.td_buf = []
        self.row = []
        self.rows = []
    def handle_starttag(self, tag, attrs):
        if tag == "h1":
            self.in_h1 = True
        elif tag == "p" and self.p_count == 0:
            self.in_p = True
        elif tag == "td":
            self.in_td = True
            self.td_buf = []
    def handle_endtag(self, tag):
        if tag == "h1":
            self.in_h1 = False
        elif tag == "p" and self.in_p:
            self.in_p = False
            self.p_count += 1
        elif tag == "td":
            self.in_td = False
            self.row.append(" ".join("".join(self.td_buf).split()))
        elif tag == "tr":
            if self.row:
                self.rows.append(self.row)
            self.row = []
    def handle_data(self, data):
        if self.in_h1:
            self.h1 += data
        elif self.in_p:
            self.desc += data
        elif self.in_td:
            self.td_buf.append(data)

def stern_zahl(s):
    return s.count("★")

def parse_one(path):
    p = TableParser()
    p.feed(path.read_text(encoding="utf-8"))
    buch = path.stem
    records = []
    for row in p.rows:
        if len(row) < 4:
            continue
        relevanz, punkt, stelle, nutzung = row[0], row[1], row[2], row[3]
        records.append({
            "buch": buch,
            "titel": p.h1.strip(),
            "relevanz": stern_zahl(relevanz),
            "punkt": punkt,
            "stelle": stelle,
            "nutzung": nutzung,
            "prompt": "",
            "status": "Neu",
        })
    return records

def build():
    DB.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB)
    con.execute("""
        CREATE TABLE IF NOT EXISTS beitraege (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            buch TEXT NOT NULL,
            titel TEXT,
            relevanz INTEGER,
            punkt TEXT,
            stelle TEXT,
            nutzung TEXT,
            prompt TEXT DEFAULT '',
            status TEXT DEFAULT 'Neu'
        )
    """)
    con.execute("DELETE FROM beitraege")
    total = 0
    for f in sorted(REF.glob("*.html")):
        for r in parse_one(f):
            con.execute(
                "INSERT INTO beitraege (buch, titel, relevanz, punkt, stelle, nutzung, prompt, status) "
                "VALUES (?,?,?,?,?,?,?,?)",
                (r["buch"], r["titel"], r["relevanz"], r["punkt"], r["stelle"],
                 r["nutzung"], r["prompt"], r["status"]),
            )
            total += 1
    con.commit()
    con.close()
    print(f"{total} Beiträge aus {len(list(REF.glob('*.html')))} Büchern")

if __name__ == "__main__":
    build()
