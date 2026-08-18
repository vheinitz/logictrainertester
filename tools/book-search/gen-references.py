#!/usr/bin/env python3
"""
Alle 89 Faktoren + 149 Förderpunkte gegen den Buch-Index suchen.

Ergebnis: references.json mit echten Treffern (Buchtitel + Seite + Ausschnitt).
Keine erfundenen Angaben — nur was im Text belegt ist.
"""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from pipeline import search

ROOT = Path(__file__).parent
points = json.loads((ROOT / "query-points.json").read_text(encoding="utf-8"))

# Buchtitel aus Dateinamen lesbarer machen
def pretty(book):
    return book

def hits_for(query, k=8, min_score=0.05):
    return [h for h in search(query, k) if h["score"] >= min_score]

out = {"factors": [], "foerderung": [], "coverage": {}}
covered_factors = 0

for f in points["factors"]:
    # Russisch primär (Bücher sind RU), Deutsch/Englisch ergänzen
    q = f["ru"] + " " + f["de"]
    hits = hits_for(q)
    out["factors"].append({
        "id": f["id"], "de": f["de"], "ru": f["ru"], "category": f["category"],
        "hits": hits,
    })
    if hits:
        covered_factors += 1

out["coverage"]["factors_with_hits"] = covered_factors
out["coverage"]["factors_total"] = len(points["factors"])

covered_foerder = 0
for f in points["foerderung"]:
    q = f["ru"] + " " + f["de"]
    hits = hits_for(q)
    out["foerderung"].append({
        "mod": f["mod"], "de": f["de"], "ru": f["ru"], "scale": f["scale"], "hits": hits,
    })
    if hits:
        covered_foerder += 1

out["coverage"]["foerderung_with_hits"] = covered_foerder
out["coverage"]["foerderung_total"] = len(points["foerderung"])

(ROOT / "references.json").write_text(
    json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8"
)
print(f"Faktoren mit Treffern: {covered_factors}/{len(points['factors'])}")
print(f"Förderpunkte mit Treffern: {covered_foerder}/{len(points['foerderung'])}")
