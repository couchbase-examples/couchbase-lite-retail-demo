"""Convert sentence-transformers/all-MiniLM-L6-v2 to CoreML for on-device query embedding.

The exported model bakes the full sentence-transformers pipeline into one graph:
    BERT encoder -> attention-masked mean pooling -> L2 normalize
so Swift only has to tokenize and read 384 floats back out. Keeping pooling inside
the graph is what makes the on-device vector directly comparable to the vectors we
author offline for the dataset -- there is no second implementation to drift.
"""

import json
import os
import numpy as np
import torch
import torch.nn as nn
import coremltools as ct
from transformers import AutoModel, AutoTokenizer

MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"
SEQ_LEN = 128          # descriptions top out ~70 tokens; 128 leaves headroom
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
# eager attention traces to plain matmul/softmax ops; the sdpa path emits an
# aten::Int on a non-scalar that the CoreML torch frontend cannot lower.
base = AutoModel.from_pretrained(MODEL_ID).eval()


class MiniLMEmbedder(nn.Module):
    """BERT + mean pooling + L2 normalize, matching sentence-transformers exactly."""

    def __init__(self, encoder):
        super().__init__()
        self.encoder = encoder

    def forward(self, input_ids, attention_mask):
        hidden = self.encoder(input_ids=input_ids, attention_mask=attention_mask)[0]
        mask = attention_mask.unsqueeze(-1).to(hidden.dtype)
        summed = (hidden * mask).sum(dim=1)
        counts = mask.sum(dim=1).clamp(min=1e-9)
        pooled = summed / counts
        return pooled / pooled.norm(p=2, dim=1, keepdim=True).clamp(min=1e-12)


model = MiniLMEmbedder(base).eval()

ids = torch.zeros(1, SEQ_LEN, dtype=torch.int32)
mask = torch.ones(1, SEQ_LEN, dtype=torch.int32)

# torch.export + run_decompositions lowers to the ATEN dialect coremltools
# supports. torch.jit.trace on this torch build emits an aten::Int the CoreML
# frontend cannot lower, so the export path is the one that works here.
with torch.no_grad():
    exported = torch.export.export(model, (ids, mask)).run_decompositions({})

mlmodel = ct.convert(
    exported,
    inputs=[
        ct.TensorType(name="input_ids", shape=(1, SEQ_LEN), dtype=np.int32),
        ct.TensorType(name="attention_mask", shape=(1, SEQ_LEN), dtype=np.int32),
    ],
    outputs=[ct.TensorType(name="embedding", dtype=np.float32)],
    convert_to="mlprogram",
    compute_precision=ct.precision.FLOAT16,
    minimum_deployment_target=ct.target.iOS17,
    compute_units=ct.ComputeUnit.ALL,
)

mlmodel.short_description = (
    "all-MiniLM-L6-v2 sentence embedder: 384-d, mean-pooled, L2-normalized. "
    "Inputs are WordPiece ids padded/truncated to 128 with a 0/1 attention mask."
)
mlmodel.input_description["input_ids"] = "WordPiece token ids, padded to 128"
mlmodel.input_description["attention_mask"] = "1 for real tokens, 0 for padding"
mlmodel.output_description["embedding"] = "384-d unit-norm sentence embedding"

pkg = os.path.join(OUT_DIR, "MiniLMTextEncoder.mlpackage")
mlmodel.save(pkg)
print("saved", pkg)

# ---- parity check: CoreML fp16 vs torch fp32 reference -----------------------
probes = [
    "high protein shake low sugar dairy free",
    "breathable lightweight blue running shoes",
    "Plant-based high-protein recovery shake with 30g of pea-and-rice protein and only "
    "4g of sugar. Dairy-free, vegan and smooth-textured, designed for post-workout "
    "muscle recovery and endurance training.",
    "organic whole milk one gallon",
    "I'm training for my first 5k, is this good for recovery?",
]


def encode_torch(texts):
    enc = tokenizer(texts, padding="max_length", truncation=True,
                    max_length=SEQ_LEN, return_tensors="pt")
    with torch.no_grad():
        return model(enc["input_ids"].int(), enc["attention_mask"].int()).numpy()


def encode_coreml(text):
    enc = tokenizer([text], padding="max_length", truncation=True,
                    max_length=SEQ_LEN, return_tensors="np")
    out = mlmodel.predict({
        "input_ids": enc["input_ids"].astype(np.int32),
        "attention_mask": enc["attention_mask"].astype(np.int32),
    })
    return np.array(out["embedding"]).reshape(-1)


ref = encode_torch(probes)
print("\n--- CoreML(fp16) vs torch(fp32) parity ---")
worst = 1.0
for i, text in enumerate(probes):
    got = encode_coreml(text)
    cos = float(np.dot(ref[i], got) / (np.linalg.norm(ref[i]) * np.linalg.norm(got)))
    worst = min(worst, cos)
    print(f"  cos={cos:.6f}  norm={np.linalg.norm(got):.6f}  {text[:52]!r}")
print(f"worst-case cosine: {worst:.6f}")

# Token-length census over the real dataset, to justify SEQ_LEN. Optional: pass the
# dataset directory as argv[1] to see whether any document would be truncated.
import sys
if len(sys.argv) > 1:
    ds = sys.argv[1]
    lens = []
    for f in ("nyc_store_inventory.json", "nyc_store_product_knowledge.json"):
        path = os.path.join(ds, f)
        if not os.path.exists(path):
            continue
        for d in json.load(open(path)):
            text = d.get("description") or d.get("chunkText") or ""
            lens.append(len(tokenizer(text)["input_ids"]))
    if lens:
        print(f"\ndataset token lengths: max={max(lens)} p95={int(np.percentile(lens,95))} "
              f"mean={np.mean(lens):.1f}  (SEQ_LEN={SEQ_LEN}, "
              f"truncated={sum(l > SEQ_LEN for l in lens)})")
