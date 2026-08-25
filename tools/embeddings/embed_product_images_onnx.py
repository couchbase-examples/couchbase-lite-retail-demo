"""Add `embedding.image` (512-d CLIP, cosine) to inventory documents.

Why this exists alongside embed_images.py: that script also rewrites the planograms file and
repoints `goldenImageURL` at bundled filenames, which would clobber the real golden cell
vectors and S3 URLs in the current dataset. This one touches inventory only.

It runs the *same ONNX graph the Android app ships* rather than torch/transformers, so the
stored vectors come from the identical weights the device queries with. Preprocessing mirrors
ImageEmbedder.swift / ClipImageEmbedder.kt: resize shortest side to 224 (bicubic), centre-crop
224x224, scale to [0,1], normalize with CLIP's mean/std, NCHW float32.

usage: embed_product_images_onnx.py <dataset-dir> <products-dir> <onnx-model> [out-dir]
"""
import json, os, sys
import numpy as np
import onnxruntime as ort
from PIL import Image

if len(sys.argv) < 4:
    sys.exit(__doc__)
DATASET, PRODUCTS, MODEL = sys.argv[1], sys.argv[2], sys.argv[3]
OUT = sys.argv[4] if len(sys.argv) > 4 else DATASET

SIDE = 224
CLIP_MEAN = np.array([0.48145466, 0.4578275, 0.40821073], dtype=np.float32)
CLIP_STD = np.array([0.26862954, 0.26130258, 0.27577711], dtype=np.float32)
GENERATED_AT = 1785000000000

sess = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
inp = sess.get_inputs()[0].name
out = sess.get_outputs()[0].name
print(f"model in={inp} {sess.get_inputs()[0].shape} out={out} {sess.get_outputs()[0].shape}")


def preprocess(path):
    img = Image.open(path).convert("RGB")
    w, h = img.size
    scale = SIDE / min(w, h)
    img = img.resize((max(SIDE, int(round(w * scale))), max(SIDE, int(round(h * scale)))),
                     Image.BICUBIC)
    w, h = img.size
    left, top = (w - SIDE) // 2, (h - SIDE) // 2
    img = img.crop((left, top, left + SIDE, top + SIDE))
    a = np.asarray(img, dtype=np.float32) / 255.0          # HWC [0,1]
    a = (a - CLIP_MEAN) / CLIP_STD
    return np.transpose(a, (2, 0, 1))[None, ...].astype(np.float32)  # NCHW


def embed(path):
    v = sess.run([out], {inp: preprocess(path)})[0][0].astype(np.float32)
    n = float(np.linalg.norm(v))
    return (v / max(n, 1e-12)).tolist()


def envelope(vec, note):
    return {"vector": [round(x, 6) for x in vec], "model": "clip-vit-b-32", "dim": 512,
            "metric": "cosine", "source": "cloud", "sourceImage": note,
            "placeholder": False, "generatedAt": GENERATED_AT}


os.makedirs(OUT, exist_ok=True)
for prefix in ("nyc_store", "aa_store"):
    path = os.path.join(DATASET, f"{prefix}_inventory.json")
    if not os.path.exists(path):
        print(f"skip {prefix}: not found")
        continue
    docs = json.load(open(path))
    done = missing = 0
    for d in docs:
        pid = d.get("productId", 0)
        img = os.path.join(PRODUCTS, f"{pid}.png")
        if not os.path.exists(img):
            missing += 1
            continue
        d.setdefault("embedding", {})["image"] = envelope(embed(img), f"{pid}.png")
        done += 1
    json.dump(docs, open(os.path.join(OUT, f"{prefix}_inventory.json"), "w"), indent=2)
    print(f"{prefix}: embedded {done}, no image for {missing}")
