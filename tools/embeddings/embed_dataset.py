"""Replace the dataset's placeholder-hash vectors with real all-MiniLM-L6-v2 vectors.

The shipped dataset carries `placeholder-hash384` vectors: a sparse hash of the source
text, L2-normalized. They have the right shape (so index creation works) but only
lexical signal -- which would make a "semantic search beats keyword search" demo prove
the opposite of what it claims. This regenerates them from the real model.

Vectors are authored with the fp32 PyTorch reference, matching `source: "cloud"` in the
embedding envelope. The app embeds queries with the fp16 CoreML export of the same
weights; convert_minilm.py measures the agreement between the two (cosine > 0.99998).
"""

import json
import os
import re
import shutil
import sys
import numpy as np
import torch
import torch.nn as nn
from transformers import AutoModel, AutoTokenizer

MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"
MODEL_NAME = "all-MiniLM-L6-v2"
SEQ_LEN = 128

# usage: embed_dataset.py <source-dataset-dir> [output-dir]
if len(sys.argv) < 2:
    sys.exit(f"usage: {os.path.basename(__file__)} <source-dataset-dir> [output-dir]")
SRC = sys.argv[1]
DST = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "demo-dataset-extended-minilm")

GENERATED_AT = 1785000000000   # fixed so re-runs are byte-identical

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
base = AutoModel.from_pretrained(MODEL_ID).eval()


class MiniLMEmbedder(nn.Module):
    def __init__(self, encoder):
        super().__init__()
        self.encoder = encoder

    def forward(self, input_ids, attention_mask):
        hidden = self.encoder(input_ids=input_ids, attention_mask=attention_mask)[0]
        mask = attention_mask.unsqueeze(-1).to(hidden.dtype)
        pooled = (hidden * mask).sum(1) / mask.sum(1).clamp(min=1e-9)
        return pooled / pooled.norm(p=2, dim=1, keepdim=True).clamp(min=1e-12)


model = MiniLMEmbedder(base).eval()


def embed(texts, batch=32):
    out = []
    for i in range(0, len(texts), batch):
        enc = tokenizer(texts[i:i + batch], padding="max_length", truncation=True,
                        max_length=SEQ_LEN, return_tensors="pt")
        with torch.no_grad():
            out.append(model(enc["input_ids"].int(), enc["attention_mask"].int()).numpy())
    return np.vstack(out)


def round_vec(v):
    # 6 decimals keeps cosine error ~1e-6 and roughly halves the JSON payload
    return [round(float(x), 6) for x in v]


os.makedirs(DST, exist_ok=True)
report = []

for fname in sorted(os.listdir(SRC)):
    if not fname.endswith(".json"):
        continue
    docs = json.load(open(os.path.join(SRC, fname)))

    # Which field feeds the text vector for this collection. `tasks` is deliberately
    # excluded: per the spec it is not a vector collection, and it happens to have a
    # `description` field that would otherwise be picked up here.
    field = None
    if docs and isinstance(docs[0], dict) and docs[0].get("docType") != "Task":
        if "description" in docs[0]:
            field = "description"
        elif "chunkText" in docs[0]:
            field = "chunkText"

    if field:
        texts = [d.get(field, "") or "" for d in docs]
        vecs = embed(texts)
        for d, v in zip(docs, vecs):
            d.setdefault("embedding", {})["text"] = {
                "vector": round_vec(v),
                "model": MODEL_NAME,
                "dim": 384,
                "metric": "cosine",
                "source": "cloud",
                "sourceText": field,
                "generatedAt": GENERATED_AT,
            }
        report.append(f"{fname}: embedded {len(docs)} docs from '{field}'")
    else:
        report.append(f"{fname}: no text field, copied unchanged "
                      f"({len(docs)} docs)")

    json.dump(docs, open(os.path.join(DST, fname), "w"), indent=2)

print("\n".join(report))
print(f"\nwrote {DST}")

# ---------------------------------------------------------------------------
# Validation: does semantic search actually beat keyword search on this data?
# ---------------------------------------------------------------------------
inv = json.load(open(os.path.join(DST, "nyc_store_inventory.json")))
mat = np.array([d["embedding"]["text"]["vector"] for d in inv], dtype=np.float32)
mat /= np.linalg.norm(mat, axis=1, keepdims=True)


def keyword_hits(query):
    """Mimic the app's existing LIKE search: name / category substring match."""
    terms = [t for t in re.split(r"[^a-z0-9]+", query.lower()) if len(t) > 2]
    hits = []
    for d in inv:
        hay = f"{d['name']} {d['category']}".lower()
        if any(t in hay for t in terms):
            hits.append(d)
    return hits


QUERIES = [
    "high-protein shake that's low in sugar and dairy-free",
    "breathable lightweight blue running shoes",
    "something to help me recover after a long run",
    "waterproof shoes for hiking in the rain",
]

print("\n" + "=" * 78)
print(f"SEMANTIC vs KEYWORD  (NYC store, {len(inv)} docs)")
print("=" * 78)
for q in QUERIES:
    qv = embed([q])[0]
    qv /= np.linalg.norm(qv)
    dist = 1.0 - mat @ qv           # cosine distance, matches CBL's metric
    order = np.argsort(dist)[:5]
    print(f"\nQ: {q!r}")
    print("  semantic top-5 (cosine distance):")
    for r in order:
        d = inv[r]
        a = d.get("attributes", {})
        extra = ""
        if "protein_g" in a:
            extra = f"  [protein {a['protein_g']}g, sugar {a['sugar_g']}g, dairyFree={a['dairyFree']}]"
        elif "waterproof" in a:
            extra = f"  [{a['color']}, {a['useCase']}, waterproof={a['waterproof']}, breathable={a['breathable']}]"
        print(f"    {dist[r]:.4f}  {d['productId']} {d['name']:<32}"
              f" {d['location']['section']:<18}{extra}")
    kw = keyword_hits(q)
    print(f"  keyword LIKE match: {len(kw)} hits"
          + (f" -> {[k['name'] for k in kw[:5]]}" if kw else "  <-- ZERO RESULTS"))

# distance distribution, to replace the spec's magic 0.35 threshold
print("\n" + "=" * 78)
print("Cosine-distance distribution for the hero query (threshold calibration)")
print("=" * 78)
qv = embed([QUERIES[0]])[0]
qv /= np.linalg.norm(qv)
dist = np.sort(1.0 - mat @ qv)
for label, val in [("min", dist[0]), ("p5", np.percentile(dist, 5)),
                   ("p25", np.percentile(dist, 25)), ("median", np.median(dist)),
                   ("p75", np.percentile(dist, 75)), ("max", dist[-1])]:
    print(f"  {label:>6}: {val:.4f}")
print(f"  spec's hardcoded 0.35 would return "
      f"{int((dist < 0.35).sum())}/{len(dist)} docs")
