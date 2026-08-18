#!/usr/bin/env python3
"""
Bücher screenen → Text extrahieren → TF-IDF-Index → semantisch suchen.

Ausgangspunkt für Referenzen: kognitive Faktoren + Fördermöglichkeiten sollen
belegte Stellen in den Büchern finden, keine erfundenen Seitenzahlen.

Schritt 1: extract  (PDF → bookname/*.txt je Seite, unbrauchbare überspringen)
Schritt 2: index    (TF-IDF über Seiten, speichert index.json + pages.json)
Schritt 3: search   (Anfragen aus JSON → Top-N Treffer mit Seite + Ausschnitt)

Nur moderne PDFs liefern sauberen Text; alte sowjetische Scans haben kaputte
Textlayer (erkennbar an verstreutem Kyrillisch/Steuerzeichen) und werden als
"unbrauchbar" markiert statt hineinzufälschen.
"""
import argparse, json, os, re, subprocess, sys, unicodedata
from pathlib import Path

BOOKS = Path("/home/heinitz@AESKU.local/priv/books/books_vk")
OUT = Path("/home/heinitz@AESKU.local/development/eval/logicapp/tools/book-search")
WORK = OUT / "work"

CYR = re.compile(r"[\u0400-\u04FF]")
LAT = re.compile(r"[A-Za-zÄÖÜäöüß]")
GARBAGE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f]")

def is_garbled(text):
    """Kaputte alte Scans erkennt man an Steuerzeichen + gehäuftem Ñ/Í-Muster."""
    if not text.strip():
        return True
    ctrl = len(GARBAGE.findall(text))
    if ctrl > len(text) * 0.01:
        return True
    # „ÐÑÐÀÐ²Ð¸" statt Russisch: viele Dierese-Ñ im Verhältnis zu echtem Kyrillisch
    if "Ñ" in text:
        cyr = len(CYR.findall(text))
        if cyr and text.count("Ñ") > cyr * 0.3:
            return True
    return False

def extract_all():
    WORK.mkdir(parents=True, exist_ok=True)
    report = {}
    for pdf in sorted(BOOKS.glob("*.pdf")):
        name = pdf.stem
        outdir = WORK / name
        outdir.mkdir(exist_ok=True)
        # ganzes PDF einmal, Seiten als \f
        raw = subprocess.run(
            ["pdftotext", "-layout", str(pdf), "-"],
            capture_output=True, text=True, timeout=120,
        ).stdout
        pages = raw.split("\f")
        kept = 0
        for i, page in enumerate(pages, 1):
            if is_garbled(page):
                continue
            page = page.strip()
            if len(page) < 30:
                continue
            (outdir / f"{i:04d}.txt").write_text(page, encoding="utf-8")
            kept += 1
        report[name] = {"pages_total": len(pages), "pages_ok": kept, "ok": kept > 0}
        print(f"{name}: {kept}/{len(pages)} Seiten brauchbar")
    (WORK / "extract-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    return report

def load_pages():
    """Alle brauchbaren Seiten als [{book, page, text}]."""
    pages = []
    for bookdir in sorted(WORK.iterdir()):
        if not bookdir.is_dir():
            continue
        for txt in sorted(bookdir.glob("*.txt")):
            pages.append({
                "book": bookdir.name,
                "page": int(txt.stem),
                "text": txt.read_text(encoding="utf-8"),
            })
    return pages

def build_index():
    from sklearn.feature_extraction.text import TfidfVectorizer
    pages = load_pages()
    if not pages:
        print("keine Seiten – erst extract"); sys.exit(1)
    vec = TfidfVectorizer(
        analyzer="word", ngram_range=(1, 2), max_df=0.85, min_df=2,
        max_features=40000, strip_accents=None, lowercase=True,
    )
    matrix = vec.fit_transform([p["text"] for p in pages])
    from scipy import sparse
    meta = [{"book": p["book"], "page": int(p["page"]), "text": p["text"][:2000]} for p in pages]
    sparse.save_npz(WORK / "matrix.npz", matrix.tocsr().astype("float32"))
    (WORK / "pages.json").write_text(json.dumps(meta, ensure_ascii=False), encoding="utf-8")
    (WORK / "vocab.json").write_text(
        json.dumps({k: int(v) for k, v in vec.vocabulary_.items()}, ensure_ascii=False), encoding="utf-8"
    )
    import numpy as np
    np.save(WORK / "idf.npy", vec.idf_.astype("float32"))
    print(f"indexiert: {len(pages)} Seiten, Vokabular {len(vec.vocabulary_)}")

def search(query, k=20):
    import numpy as np
    from scipy import sparse
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    matrix = sparse.load_npz(WORK / "matrix.npz")
    pages = json.loads((WORK / "pages.json").read_text(encoding="utf-8"))
    vocab = json.loads((WORK / "vocab.json").read_text(encoding="utf-8"))
    idf = np.load(WORK / "idf.npy")
    vec = TfidfVectorizer(analyzer="word", ngram_range=(1, 2), lowercase=True, vocabulary=vocab)
    vec.idf_ = idf
    vec._tfidf._idf_diag = sparse.spdiags(idf, 0, len(idf), len(idf))
    q = vec.transform([query])
    sim = cosine_similarity(q, matrix)[0]
    order = np.argsort(sim)[::-1][:k]
    hits = []
    for idx in order:
        if sim[idx] <= 0:
            continue
        p = pages[idx]
        snippet = p["text"][:600].replace("\n", " ")
        hits.append({
            "book": p["book"], "page": p["page"], "score": round(float(sim[idx]), 4),
            "snippet": snippet,
        })
    return hits

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("step", choices=["extract", "index", "search"])
    ap.add_argument("query", nargs="?", default="")
    ap.add_argument("--k", type=int, default=20)
    a = ap.parse_args()
    if a.step == "extract":
        r = extract_all()
        print(f"\nbrauchbar: {sum(1 for v in r.values() if v['ok'])} von {len(r)} PDFs")
    elif a.step == "index":
        build_index()
    elif a.step == "search":
        hits = search(a.query, a.k)
        for h in hits:
            print(f"[{h['score']:.3f}] {h['book']} · S.{h['page']}")
            print("   ", h["snippet"][:220])
            print()
