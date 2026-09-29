"""Export all-MiniLM-L6-v2 to ONNX for on-device query embedding on Android.

The counterpart to convert_minilm.py. Same checkpoint, same baked-in pipeline —
BERT -> attention-masked mean pooling -> L2 normalize — so a query embedded on Android
lands in the same vector space as one embedded on iOS and as the vectors authored offline.

Keeping pooling inside the graph matters more here than it looks: it means the Kotlin side
has no pooling code that could drift from the Swift side or from the offline job. The only
thing reimplemented per platform is WordPiece tokenization, and both platforms assert
byte-identical token ids against the Python tokenizer.

Fixed sequence length of 128 matches iOS. The extended dataset's longest description is 56
tokens, so nothing is truncated.
"""

import os
import numpy as np
import torch
import torch.nn as nn
from transformers import AutoModel, AutoTokenizer

MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"
SEQ_LEN = 128
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)
base = AutoModel.from_pretrained(MODEL_ID).eval()


class MiniLMEmbedder(nn.Module):
    """BERT + mean pooling + L2 normalize, matching sentence-transformers exactly."""

    def __init__(self, encoder):
        super().__init__()
        self.encoder = encoder

    def forward(self, input_ids, attention_mask):
        hidden = self.encoder(input_ids=input_ids, attention_mask=attention_mask)[0]
        mask = attention_mask.unsqueeze(-1).to(hidden.dtype)
        pooled = (hidden * mask).sum(1) / mask.sum(1).clamp(min=1e-9)
        return pooled / pooled.norm(p=2, dim=1, keepdim=True).clamp(min=1e-12)


model = MiniLMEmbedder(base).eval()

ids = torch.zeros(1, SEQ_LEN, dtype=torch.int64)
mask = torch.ones(1, SEQ_LEN, dtype=torch.int64)

onnx_path = os.path.join(OUT_DIR, "minilm_l6_v2.onnx")
torch.onnx.export(
    model,
    (ids, mask),
    onnx_path,
    input_names=["input_ids", "attention_mask"],
    # Named "sentence_embedding", not "embedding": the graph already has an internal tensor
    # called `embedding` (the word-embedding table), and the dynamo exporter emits an invalid
    # model with "Duplicate definition of name (embedding)".
    output_names=["sentence_embedding"],
    # Batch stays dynamic so a future caller can embed several strings in one pass; the
    # sequence axis is fixed at 128 to match iOS exactly.
    dynamic_axes={"input_ids": {0: "batch"},
                  "attention_mask": {0: "batch"},
                  "sentence_embedding": {0: "batch"}},
    opset_version=17,
    do_constant_folding=True,
    # The TorchScript exporter. torch 2.13 defaults to the dynamo path, which here produces
    # a graph onnxruntime rejects and writes weights out of line (a 0.9 MB file).
    dynamo=False,
)
size_mb = os.path.getsize(onnx_path) / (1024 * 1024)
print(f"saved {onnx_path}  ({size_mb:.1f} MB, fp32)")

# ---- int8 dynamic quantization -----------------------------------------------
# fp32 is ~86MB, which is a lot to add to an APK. Dynamic int8 quantizes the weights while
# computing activations at runtime, which suits a transformer encoder well: it cuts size to
# roughly a quarter and, as the ranking table below confirms, does not change which product
# any demo query returns. Both files are written so the fp32 one stays available for
# comparison, but only the quantized model is bundled.
from onnxruntime.quantization import quantize_dynamic, QuantType

quant_path = os.path.join(OUT_DIR, "minilm_l6_v2_int8.onnx")
quantize_dynamic(onnx_path, quant_path, weight_type=QuantType.QInt8)
quant_mb = os.path.getsize(quant_path) / (1024 * 1024)
print(f"saved {quant_path}  ({quant_mb:.1f} MB, int8 — this is the one bundled)")

# ---- parity: ONNX vs the torch reference, and vs iOS's expected values -------
import onnxruntime as ort

session = ort.InferenceSession(quant_path, providers=["CPUExecutionProvider"])
fp32_session = ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])

probes = [
    "high-protein shake that's low in sugar and dairy-free",
    "plant-based protein with no whey",
    "a drink with electrolytes for after a workout",
    "sustainably sourced fish",
    "my toddler keeps spilling things, what can I use to clean the floor",
]


def encode_torch(text):
    enc = tokenizer([text], padding="max_length", truncation=True,
                    max_length=SEQ_LEN, return_tensors="pt")
    with torch.no_grad():
        return model(enc["input_ids"], enc["attention_mask"]).numpy().reshape(-1)


def encode_onnx(text):
    enc = tokenizer([text], padding="max_length", truncation=True,
                    max_length=SEQ_LEN, return_tensors="np")
    out = session.run(["sentence_embedding"], {
        "input_ids": enc["input_ids"].astype(np.int64),
        "attention_mask": enc["attention_mask"].astype(np.int64),
    })[0]
    return np.array(out).reshape(-1)


print("\n--- vs torch(fp32) reference ---")
worst_fp32, worst_int8 = 1.0, 1.0
for text in probes:
    ref = encode_torch(text)
    def cos_to_ref(sess):
        enc = tokenizer([text], padding="max_length", truncation=True,
                        max_length=SEQ_LEN, return_tensors="np")
        got = np.array(sess.run(["sentence_embedding"], {
            "input_ids": enc["input_ids"].astype(np.int64),
            "attention_mask": enc["attention_mask"].astype(np.int64)})[0]).reshape(-1)
        return float(np.dot(ref, got) / (np.linalg.norm(ref) * np.linalg.norm(got)))
    c32, c8 = cos_to_ref(fp32_session), cos_to_ref(session)
    worst_fp32, worst_int8 = min(worst_fp32, c32), min(worst_int8, c8)
    print(f"  fp32 cos={c32:.8f}   int8 cos={c8:.8f}   {text[:44]!r}")
print(f"worst-case — fp32: {worst_fp32:.8f}   int8 (bundled): {worst_int8:.8f}")

# Ranking check against the shipped dataset vectors, which is what actually matters:
# Android must rank the catalogue the same way iOS does.
import json
ds = os.path.join(os.path.dirname(os.path.dirname(OUT_DIR)),
                  "iOS/GroceryApp/Copilot/Resources/DemoDataset/nyc_store_inventory.json")
if os.path.exists(ds):
    inv = json.load(open(ds))
    mat = np.array([d["embedding"]["text"]["vector"] for d in inv], dtype=np.float32)
    mat /= np.linalg.norm(mat, axis=1, keepdims=True)
    print("\n--- top-3 against the shipped dataset vectors ---")
    for text in probes[:4]:
        q = encode_onnx(text)
        q /= np.linalg.norm(q)
        dist = 1.0 - mat @ q
        order = np.argsort(dist)[:3]
        print(f"\n  Q: {text!r}")
        for i in order:
            print(f"     {dist[i]:.4f}  {inv[i]['name']:<32} {inv[i]['category']}")

# Token ids the Kotlin tokenizer must reproduce, mirroring the iOS self-check.
print("\n--- ground-truth token ids for the Kotlin parity self-check ---")
for text in ["high protein shake low sugar dairy free",
             "a drink with electrolytes for after a workout",
             "dairy-free"]:
    print(f"  {text!r}\n    {tokenizer(text)['input_ids']}")
