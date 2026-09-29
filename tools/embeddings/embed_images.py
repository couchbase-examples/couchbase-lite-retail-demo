"""Author CLIP image vectors for products and golden planograms.

Adds `embedding.image` (512-d, cosine) to:
  * inventory documents that have a rendered product image — this is what per-facing crop
    matching compares against, and the data-model spec already allows it as an optional
    field on inventory;
  * planogram documents, replacing the shipped `placeholder-hash512` vector with a real
    embedding of the golden shelf image.

Preprocessing matches `ImageEmbedder.swift` exactly: resize shortest side to 224 with
bicubic, centre crop 224x224, scale to [0,1], normalize with CLIP's mean/std. Any drift here
shows up as inexplicably poor crop matching, so verify_clip_parity.py checks the two paths
agree on the same PNG.
"""

import json
import os
import sys
import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from transformers import CLIPVisionModelWithProjection

if len(sys.argv) < 3:
    sys.exit(f"usage: {os.path.basename(__file__)} <dataset-dir> <assets-dir> [output-dir]")
DATASET, ASSETS = sys.argv[1], sys.argv[2]
OUT = sys.argv[3] if len(sys.argv) > 3 else DATASET

MODEL_ID = "openai/clip-vit-base-patch32"
MODEL_NAME = "clip-vit-b-32"
GENERATED_AT = 1785000000000

CLIP_MEAN = np.array([0.48145466, 0.4578275, 0.40821073], dtype=np.float32)
CLIP_STD = np.array([0.26862954, 0.26130258, 0.27577711], dtype=np.float32)

vision = CLIPVisionModelWithProjection.from_pretrained(MODEL_ID).eval()


class ClipImageEmbedder(nn.Module):
    def __init__(self, tower):
        super().__init__()
        self.tower = tower

    def forward(self, pixel_values):
        e = self.tower(pixel_values=pixel_values).image_embeds
        return e / e.norm(p=2, dim=-1, keepdim=True).clamp(min=1e-12)


model = ClipImageEmbedder(vision).eval()


def preprocess(img: Image.Image) -> np.ndarray:
    """Resize shortest side to 224 (bicubic), centre crop, normalize. Mirrors Swift."""
    img = img.convert("RGB")
    w, h = img.size
    scale = 224 / min(w, h)
    img = img.resize((max(224, round(w * scale)), max(224, round(h * scale))), Image.BICUBIC)
    w, h = img.size
    left, top = (w - 224) // 2, (h - 224) // 2
    img = img.crop((left, top, left + 224, top + 224))
    arr = np.asarray(img, dtype=np.float32) / 255.0
    arr = (arr - CLIP_MEAN) / CLIP_STD
    return arr.transpose(2, 0, 1)[None, ...]


def embed_image(path: str) -> list:
    pixels = preprocess(Image.open(path))
    with torch.no_grad():
        vec = model(torch.from_numpy(pixels)).numpy().reshape(-1)
    return [round(float(x), 6) for x in vec]


def envelope(vector, source_note):
    return {
        "vector": vector,
        "model": MODEL_NAME,
        "dim": 512,
        "metric": "cosine",
        "source": "cloud",
        "sourceImage": source_note,
        "generatedAt": GENERATED_AT,
    }


os.makedirs(OUT, exist_ok=True)

for store, prefix in (("nyc", "nyc_store"), ("aa", "aa_store")):
    inv_path = os.path.join(DATASET, f"{prefix}_inventory.json")
    plan_path = os.path.join(DATASET, f"{prefix}_planograms.json")
    if not (os.path.exists(inv_path) and os.path.exists(plan_path)):
        print(f"skipping {store}: dataset files not found")
        continue

    # ---- product image vectors ----
    inventory = json.load(open(inv_path))
    embedded = 0
    for doc in inventory:
        pid = doc.get("productId", 0)
        image = os.path.join(ASSETS, "products", f"{pid}.png")
        if not os.path.exists(image):
            continue
        doc.setdefault("embedding", {})["image"] = envelope(embed_image(image), f"{pid}.png")
        embedded += 1
    json.dump(inventory, open(os.path.join(OUT, f"{prefix}_inventory.json"), "w"), indent=2)
    print(f"{store}: embedded {embedded} product images into inventory")

    # ---- golden planogram vectors ----
    planograms = json.load(open(plan_path))
    for planogram in planograms:
        shelf = planogram["shelf"]
        golden = os.path.join(ASSETS, "planograms", f"{store}_{shelf}_golden.png")
        if not os.path.exists(golden):
            print(f"  {store} {shelf}: golden image missing, leaving vector as-is")
            continue
        planogram.setdefault("embedding", {})["image"] = envelope(
            embed_image(golden), f"{store}_{shelf}_golden.png")
        # Point at the bundled asset name; the S3 URLs in the shipped dataset 403.
        planogram["goldenImageURL"] = f"{store}_{shelf}_golden.png"
        print(f"  {store} {shelf}: golden embedded")
    json.dump(planograms, open(os.path.join(OUT, f"{prefix}_planograms.json"), "w"), indent=2)

# ---- sanity check: does crop matching actually discriminate? --------------------
print("\n" + "=" * 78)
print("Crop-match sanity check on the NYC A1 shelf")
print("=" * 78)

inventory = {d["productId"]: d for d in json.load(open(os.path.join(OUT, "nyc_store_inventory.json")))}
planograms = {p["shelf"]: p for p in json.load(open(os.path.join(OUT, "nyc_store_planograms.json")))}
planogram = planograms.get("A1")

if planogram:
    layout = planogram["expectedLayout"]
    candidates = {}
    for entry in layout:
        doc = inventory.get(entry["productId"], {})
        vec = (doc.get("embedding") or {}).get("image", {}).get("vector")
        if vec:
            candidates[entry["productId"]] = (doc["name"], np.array(vec, dtype=np.float32))

    for kind in ("golden", "messy"):
        path = os.path.join(ASSETS, "planograms", f"nyc_A1_{kind}.png")
        if not os.path.exists(path):
            continue
        shelf_img = Image.open(path).convert("RGB")
        W, H = shelf_img.size
        print(f"\n{kind.upper()} shelf:")
        for i, entry in enumerate(layout):
            # Same crop geometry the app uses: an equal-width vertical band per position.
            band = shelf_img.crop((int(i * W / len(layout)), 0,
                                   int((i + 1) * W / len(layout)), H))
            pixels = preprocess(band)
            with torch.no_grad():
                q = model(torch.from_numpy(pixels)).numpy().reshape(-1)
            ranked = sorted(
                ((1.0 - float(np.dot(q, v)), pid, name) for pid, (name, v) in candidates.items())
            )
            best_d, best_pid, best_name = ranked[0]
            expected = inventory.get(entry["productId"], {}).get("name", "?")
            verdict = "OK " if best_pid == entry["productId"] else "!! "
            print(f"  {verdict}{entry['position']}: expected {expected:<26} "
                  f"found {best_name:<26} d={best_d:.4f}"
                  f"  (runner-up {ranked[1][2]} d={ranked[1][0]:.4f})")

print(f"\nwrote {OUT}")
