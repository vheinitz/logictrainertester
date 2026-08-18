#!/usr/bin/env python3
"""
Lokale Web-Oberfläche über die 922 Buch-Ideenbeiträge.

  python3 app.py            → http://127.0.0.1:5080

Suche (Volltext), Filter (Status/Buch/Relevanz), Sortierung, und je Beitrag
ein Prompt-Feld + Status (Neu/Ignorieren/Erstellen/Nachbearbeiten/Fertig).
"""
import sqlite3
from pathlib import Path
from flask import Flask, g, render_template, request, jsonify

BASE = Path(__file__).parent
DB = BASE / "ideen.db"
app = Flask(__name__)

STATUS = ["Neu", "Ignorieren", "Erstellen", "Nachbearbeiten", "Fertig"]

def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(exc):
    db = g.pop("db", None)
    if db is not None:
        db.close()

@app.get("/")
def index():
    db = get_db()
    q = request.args.get("q", "").strip()
    status = request.args.get("status", "").strip()
    buch = request.args.get("buch", "").strip()
    rel = request.args.get("rel", "").strip()
    sort = request.args.get("sort", "relevanz")
    order = request.args.get("order", "desc")

    where, args = [], []
    if q:
        where.append("(nutzung LIKE ? OR punkt LIKE ? OR stelle LIKE ? OR buch LIKE ? OR titel LIKE ? OR prompt LIKE ?)")
        like = f"%{q}%"
        args += [like] * 6
    if status:
        where.append("status = ?")
        args.append(status)
    if buch:
        where.append("buch = ?")
        args.append(buch)
    if rel:
        where.append("relevanz >= ?")
        args.append(int(rel))

    sort_cols = {"relevanz": "relevanz", "buch": "buch", "stelle": "stelle",
                 "punkt": "punkt", "status": "status", "titel": "titel"}
    col = sort_cols.get(sort, "relevanz")
    direction = "ASC" if order == "asc" else "DESC"

    sql = "SELECT * FROM beitraege"
    if where:
        sql += " WHERE " + " AND ".join(where)
    sql += f" ORDER BY {col} {direction}, id"
    rows = db.execute(sql, args).fetchall()

    buecher = [r["buch"] for r in db.execute(
        "SELECT DISTINCT buch FROM beitraege ORDER BY buch")]

    return render_template(
        "index.html",
        rows=rows, buecher=buecher, statuses=STATUS,
        q=q, status=status, buch=buch, rel=rel, sort=sort, order=order,
    )

@app.post("/update/<int:bid>")
def update(bid):
    data = request.get_json(force=True)
    prompt = (data.get("prompt") or "").strip()
    status = data.get("status") or "Neu"
    if status not in STATUS:
        status = "Neu"
    db = get_db()
    db.execute("UPDATE beitraege SET prompt=?, status=? WHERE id=?", (prompt, status, bid))
    db.commit()
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5080, debug=False)
