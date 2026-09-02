"""End-to-end check of the shipped Step 2 configuration.

The two sides of the shelf audit are produced differently on purpose:

  * stored product-image vectors — authored offline from the fp32 PyTorch model
    (`"source": "cloud"` in the envelope);
  * shelf-crop query vectors — produced on-device by the int8-quantized CoreML export.

Quantization was necessary to get CLIP's vision tower under GitHub's 100MB per-file limit,
so the question this script answers is not "how close are the vectors" but the one that
actually matters: **do the audit verdicts still come out right, and with how much margin?**

Run it after regenerating either side. It re-does exactly what the app does — same crop
geometry, same preprocessing — and prints the verdict and margin per shelf position.
"""

import json
import os
import sys
import numpy as np
import coremltools as ct
from PIL import Image

if len(sys.argv) < 3:
    sys.exit(f"usage: {os.path.basename(__file__)} <dataset-dir> <assets-dir> [mlpackage]")
DATASET, ASSETS = sys.argv[1], sys.argv[2]
PKG = sys.argv[3] if len(sys.argv) > 3 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "ClipImageEncoder.mlpackage")

CLIP_MEAN = np.array([0.48145466, 0.4578275, 0.40821073], dtype=np.float32)
CLIP_STD = np.array([0.26862954, 0.26130258, 0.27577711], dtype=np.float32)

# CPU_ONLY: the Mac GPU path asserts inside MPSGraph for this int8 transformer. It is a
# host-side quirk, not an iOS one, but pinning it here keeps this check reproducible.
model = ct.models.MLModel(PKG, compute_units=ct.ComputeUnit.CPU_ONLY)


def preprocess(img: Image.Image) -> np.ndarray:
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


def embed(img: Image.Image) -> np.ndarray:
    out = model.predict({"pixel_values": preprocess(img)})["embedding"]
    return np.array(out, dtype=np.float32).reshape(-1)


failures = 0
margins = []

for store, prefix in (("nyc", "nyc_store"), ("aa", "aa_store")):
    inv_path = os.path.join(DATASET, f"{prefix}_inventory.json")
    plan_path = os.path.join(DATASET, f"{prefix}_planograms.json")
    if not (os.path.exists(inv_path) and os.path.exists(plan_path)):
        continue

    inventory = {d["productId"]: d for d in json.load(open(inv_path))}
    planograms = json.load(open(plan_path))

    print("=" * 84)
    print(f"{store.upper()} — stored vectors: fp32 offline | query vectors: int8 CoreML")
    print("=" * 84)

    for planogram in planograms:
        shelf = planogram["shelf"]
        layout = planogram["expectedLayout"]

        # Candidate set: the products this planogram expects. The app scopes its vector
        # query to the section, which is a superset of this.
        candidates = {}
        for entry in layout:
            doc = inventory.get(entry["productId"], {})
            vec = ((doc.get("embedding") or {}).get("image") or {}).get("vector")
            if vec:
                candidates[entry["productId"]] = (doc.get("name", "?"),
                                                  np.array(vec, dtype=np.float32))
        if not candidates:
            print(f"  {shelf}: no product image vectors, skipping")
            continue

        for kind in ("golden", "messy"):
            path = os.path.join(ASSETS, "planograms", f"{store}_{shelf}_{kind}.png")
            if not os.path.exists(path):
                continue
            shelf_img = Image.open(path).convert("RGB")
            W, H = shelf_img.size
            print(f"\n  shelf {shelf} / {kind}")

            for i, entry in enumerate(layout):
                band = shelf_img.crop((int(i * W / len(layout)), 0,
                                       int((i + 1) * W / len(layout)), H))
                q = embed(band)
                ranked = sorted((1.0 - float(np.dot(q, v)), pid, name)
                                for pid, (name, v) in candidates.items())
                best_d, best_pid, best_name = ranked[0]
                runner_d = ranked[1][0] if len(ranked) > 1 else float("nan")
                margin = runner_d - best_d
                margins.append(margin)

                expected_pid = entry["productId"]
                expected = inventory.get(expected_pid, {}).get("name", "?")
                # On the golden shelf every position must match; on the messy shelf the
                # left position is *supposed* to mismatch.
                should_match = not (kind == "messy" and i == 0)
                matched = best_pid == expected_pid
                ok = matched == should_match
                if not ok:
                    failures += 1
                print(f"    {'OK ' if ok else 'FAIL'} {entry['position']}: "
                      f"expected {expected:<26} found {best_name:<26} "
                      f"d={best_d:.4f} margin={margin:+.4f}")

print("\n" + "=" * 84)
if margins:
    print(f"positions checked: {len(margins)}   failures: {failures}")
    print(f"decision margin — min {min(margins):+.4f}  mean {np.mean(margins):+.4f}")
    if failures == 0 and min(margins) > 0.05:
        print("PASS — int8 query vectors reproduce every expected verdict with margin to spare.")
    elif failures == 0:
        print("PASS (thin) — verdicts correct but at least one margin is narrow; review.")
    else:
        print("FAIL — quantization changed an audit verdict.")
sys.exit(1 if failures else 0)
