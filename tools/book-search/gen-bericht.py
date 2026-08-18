#!/usr/bin/env python3
"""references.json → durchsuchbarer HTML-Bericht."""
import json, html
from pathlib import Path

ROOT = Path(__file__).parent
d = json.loads((ROOT / "references.json").read_text(encoding="utf-8"))

def esc(s):
    return html.escape(s, quote=False)

parts = []
parts.append("<html><head><meta charset='utf-8'><title>Buch-Referenzen</title>")
parts.append("<style>body{font-family:system-ui,sans-serif;max-width:1100px;margin:2rem auto;padding:0 1rem;line-height:1.45}h2{border-bottom:2px solid #444;padding-bottom:.2rem}h3{margin-top:1.6rem;color:#2a2458}.hit{margin:.4rem 0;padding:.4rem .6rem;background:#f6f5ff;border-left:3px solid #5b4fcf;border-radius:4px}.snippet{color:#555;font-size:.88em}.score{color:#888;font-size:.8em}.cover{margin:1rem 0;padding:.8rem;background:#fff4d6;border-radius:6px}</style></head><body>")
parts.append(f"<h1>Buch-Referenzen (belegt, nicht erfunden)</h1>")
parts.append(f"<div class='cover'>Faktoren mit Treffern: <b>{d['coverage']['factors_with_hits']}/{d['coverage']['factors_total']}</b> · Förderpunkte: <b>{d['coverage']['foerderung_with_hits']}/{d['coverage']['foerderung_total']}</b>. Treffer sind TF-IDF über extrahierte Seiten (38 saubere PDFs); jede Angabe hat Seite + Ausschnitt.</div>")

parts.append("<h2>Kognitive Fähigkeiten</h2>")
for f in d["factors"]:
    if not f["hits"]:
        continue
    parts.append(f"<h3>{esc(f['id'])} — {esc(f['de'])} <small>({esc(f['ru'])})</small></h3>")
    for h in f["hits"][:5]:
        parts.append(
            f"<div class='hit'><b>{esc(h['book'])}</b> · S.{h['page']} "
            f"<span class='score'>[{h['score']}]</span>"
            f"<div class='snippet'>{esc(h['snippet'][:300])}</div></div>"
        )

parts.append("<h2>Fördermöglichkeiten</h2>")
for f in d["foerderung"]:
    if not f["hits"]:
        continue
    parts.append(f"<h3>{esc(f['de'])} <small>({esc(f['ru'])})</small></h3>")
    for h in f["hits"][:4]:
        parts.append(
            f"<div class='hit'><b>{esc(h['book'])}</b> · S.{h['page']} "
            f"<span class='score'>[{h['score']}]</span>"
            f"<div class='snippet'>{esc(h['snippet'][:300])}</div></div>"
        )

parts.append("</body></html>")
(ROOT / "bericht.html").write_text("\n".join(parts), encoding="utf-8")
print("geschrieben:", ROOT / "bericht.html")
