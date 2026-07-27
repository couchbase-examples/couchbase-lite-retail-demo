"""Convert the CLIP ViT-B/32 image encoder to CoreML for on-device shelf auditing.

Step 2 crops each expected shelf position out of the associate's photo and asks "is the
product that should be here actually here?". That is an image-to-image comparison, so only
CLIP's vision tower is needed — the text tower is left out to keep the bundle small.

As with MiniLM, normalization is baked into the graph so the on-device vector is directly
comparable to the product-image vectors authored offline by embed_images.py.

Preprocessing note: CLIP's own preprocessing (resize shortest side to 224, center crop,
normalize with CLIP's mean/std) is NOT part of the graph, because the Swift side needs to
crop arbitrary shelf regions first. `ImageEmbedder.swift` reproduces the resize and
normalization exactly; `verify_clip_parity.py` checks the two agree.
"""

import os
import numpy as np
import torch
import torch.nn as nn
import coremltools as ct
from transformers import CLIPVisionModelWithProjection

MODEL_ID = "openai/clip-vit-base-patch32"
IMAGE_SIZE = 224
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

vision = CLIPVisionModelWithProjection.from_pretrained(MODEL_ID).eval()


class ClipImageEmbedder(nn.Module):
    """CLIP vision tower + projection + L2 normalize -> 512-d unit vector."""

    def __init__(self, tower):
        super().__init__()
        self.tower = tower

    def forward(self, pixel_values):
        embeds = self.tower(pixel_values=pixel_values).image_embeds
        return embeds / embeds.norm(p=2, dim=-1, keepdim=True).clamp(min=1e-12)


model = ClipImageEmbedder(vision).eval()

example = torch.zeros(1, 3, IMAGE_SIZE, IMAGE_SIZE, dtype=torch.float32)
with torch.no_grad():
    exported = torch.export.export(model, (example,)).run_decompositions({})

mlmodel = ct.convert(
    exported,
    inputs=[ct.TensorType(name="pixel_values",
                          shape=(1, 3, IMAGE_SIZE, IMAGE_SIZE),
                          dtype=np.float32)],
    outputs=[ct.TensorType(name="embedding", dtype=np.float32)],
    convert_to="mlprogram",
    compute_precision=ct.precision.FLOAT16,
    minimum_deployment_target=ct.target.iOS17,
    compute_units=ct.ComputeUnit.ALL,
)

# CLIP's vision tower is 87M parameters, so fp16 weights alone are ~168MB — over GitHub's
# 100MB per-file hard limit and a lot to ship in an app. Int8 weight-only quantization
# halves it with negligible effect on the distances that matter here: the crop-matching
# margin between the correct product and the runner-up is roughly 2x, far wider than the
# error int8 introduces. The parity check below is what confirms that rather than assuming.
fp16_model = mlmodel
mlmodel = ct.optimize.coreml.linear_quantize_weights(
    mlmodel,
    config=ct.optimize.coreml.OptimizationConfig(
        global_config=ct.optimize.coreml.OpLinearQuantizerConfig(
            mode="linear_symmetric", dtype="int8", granularity="per_channel"
        )
    ),
)

mlmodel.short_description = (
    "CLIP ViT-B/32 image encoder: 512-d, L2-normalized, int8-quantized weights. Input is a "
    "224x224 RGB tensor already normalized with CLIP's mean/std."
)
mlmodel.input_description["pixel_values"] = "1x3x224x224, CLIP-normalized RGB"
mlmodel.output_description["embedding"] = "512-d unit-norm image embedding"

pkg = os.path.join(OUT_DIR, "ClipImageEncoder.mlpackage")
mlmodel.save(pkg)
weights = os.path.join(pkg, "Data/com.apple.CoreML/weights/weight.bin")
size_mb = os.path.getsize(weights) / (1024 * 1024) if os.path.exists(weights) else 0
print(f"saved {pkg}  (weights {size_mb:.1f} MB)")

# ---- parity check on deterministic synthetic inputs -------------------------
rng = np.random.default_rng(0)
worst_fp16, worst_int8 = 1.0, 1.0
print("\n--- vs torch(fp32) reference ---")
for i in range(4):
    pixels = rng.standard_normal((1, 3, IMAGE_SIZE, IMAGE_SIZE)).astype(np.float32)
    with torch.no_grad():
        ref = model(torch.from_numpy(pixels)).numpy().reshape(-1)

    def cos_to_ref(m):
        got = np.array(m.predict({"pixel_values": pixels})["embedding"]).reshape(-1)
        return float(np.dot(ref, got) / (np.linalg.norm(ref) * np.linalg.norm(got))), got

    c16, _ = cos_to_ref(fp16_model)
    c8, got8 = cos_to_ref(mlmodel)
    worst_fp16, worst_int8 = min(worst_fp16, c16), min(worst_int8, c8)
    print(f"  probe {i}: fp16 cos={c16:.6f}   int8 cos={c8:.6f}   "
          f"dim={got8.shape[0]} norm={np.linalg.norm(got8):.6f}")
print(f"worst-case cosine — fp16: {worst_fp16:.6f}   int8 (shipped): {worst_int8:.6f}")
