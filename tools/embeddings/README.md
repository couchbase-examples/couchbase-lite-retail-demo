# Embedding tooling — Store Associate Copilot

Scripts that produce the assets edge vector search needs. Text (Steps 1 and 3) first, then
images (Step 2).

| Script | Produces | Consumed by |
|---|---|---|
| `convert_minilm.py` | `MiniLMTextEncoder.mlpackage` | the iOS app, for on-device **text query** embedding |
| `embed_dataset.py` | dataset JSON with 384-d text vectors | Capella import, and the app's bundled demo dataset |
| `convert_clip.py` | `ClipImageEncoder.mlpackage` | the iOS app, for on-device **shelf crop** embedding |
| `generate_shelf_assets.py` | product + golden/messy shelf PNGs | `embed_images.py`, and the app's sample shelves |
| `embed_images.py` | 512-d image vectors on inventory + planograms | the shelf audit's crop matching |
| `verify_clip_parity.py` | pass/fail on every audit verdict | run after regenerating either image side |

Each modality uses one set of weights on both sides — `all-MiniLM-L6-v2` (384-d, cosine) for
text, `CLIP ViT-B/32` (512-d, cosine) for images. That is the point: a query embedded on the
device has to land in the same vector space as the vectors authored offline, or ranking is
meaningless.

A full regeneration, in order:

```bash
DS=../../iOS/GroceryApp/Copilot/Resources/DemoDataset
./.venv/bin/python convert_minilm.py "$DS"
./.venv/bin/python embed_dataset.py "/path/to/demo-dataset-extended -vector" "$DS"
./.venv/bin/python convert_clip.py
./.venv/bin/python generate_shelf_assets.py "$DS" ./generated-assets
./.venv/bin/python embed_images.py "$DS" ./generated-assets
./.venv/bin/python verify_clip_parity.py "$DS" ./generated-assets   # must pass
cp -R MiniLMTextEncoder.mlpackage ClipImageEncoder.mlpackage ../../iOS/GroceryApp/Copilot/Resources/
cp generated-assets/products/*.png generated-assets/planograms/*.png \
   ../../iOS/GroceryApp/Copilot/Resources/ShelfAssets/
```

## Why both, and why they must agree

Product vectors are pre-computed offline and synced to the device — that is what
`"source": "cloud"` in the embedding envelope records. Only the *query* is embedded on-device.
So there are two implementations of the same function, and they can drift in three places:

1. **Weights** — same checkpoint, so identical by construction.
2. **Pooling** — mean pooling and L2 normalization are compiled *into* the CoreML graph, so
   the Swift side has no pooling code that could diverge.
3. **Tokenization** — the one genuine risk. Swift re-implements BERT WordPiece in
   `WordPieceTokenizer.swift`. `CopilotDiagnostics.runTokenizerParityCheck()` asserts it
   produces byte-identical token ids to the Python tokenizer, and the copilot's
   behind-the-scenes screen can run that check on demand.

`convert_minilm.py` reports the CoreML(fp16) vs PyTorch(fp32) agreement. Measured worst case
over the demo queries: **cosine 0.999980**.

## Setup

`coremltools` does not support Python 3.14; use 3.11–3.13.

```bash
python3.13 -m venv .venv && ./.venv/bin/pip install "numpy<3" torch "transformers==4.46.3" coremltools huggingface_hub
```

`transformers` is pinned to 4.x on purpose — with 5.x the traced graph emits an `aten::Int`
on a non-scalar that the CoreML frontend cannot lower.

Behind a TLS-intercepting corporate proxy, point Python at a CA bundle that includes the
proxy root, otherwise the HuggingFace download fails with `CERTIFICATE_VERIFY_FAILED`:

```bash
security find-certificate -a -p /Library/Keychains/System.keychain > corp.pem
cat "$(./.venv/bin/python -c 'import certifi;print(certifi.where())')" corp.pem > ca-bundle.pem
export SSL_CERT_FILE=$PWD/ca-bundle.pem REQUESTS_CA_BUNDLE=$PWD/ca-bundle.pem
```

## Convert the model

```bash
./.venv/bin/python convert_minilm.py [path/to/dataset-dir]
```

Writes `MiniLMTextEncoder.mlpackage` (~43 MB fp16) and prints the parity table. Pass the
dataset directory to also get a token-length census confirming nothing is truncated at
`SEQ_LEN=128` (the extended dataset's longest description is 56 tokens).

Install it into the app:

```bash
cp -R MiniLMTextEncoder.mlpackage ../../iOS/GroceryApp/Copilot/Resources/
```

Xcode compiles the `.mlpackage` to `.mlmodelc` at build time. The vocabulary
(`minilm-vocab.txt`, from the same HuggingFace snapshot) must sit alongside it.

> **Size note:** the fp16 CoreML package is ~43 MB, not the ~80 MB quoted in the proposal
> (that is the fp32 PyTorch checkpoint). Int8 palettization would reach ~23 MB if the app
> binary size ever becomes a constraint.

## Re-embed the dataset

```bash
./.venv/bin/python embed_dataset.py "/path/to/demo-dataset-extended -vector" ./out
```

Replaces `embedding.text.vector` on every document that has a `description` (inventory) or
`chunkText` (product_knowledge), rewrites the envelope metadata, and drops the
`placeholder: true` flag. `tasks` is skipped deliberately — it has a `description` field but
is not a vector collection.

`generatedAt` is a fixed constant so re-runs are byte-identical and produce no spurious diffs.

Then it prints a semantic-vs-keyword comparison over the real corpus. Current output for the
two headline queries:

```
Q: "high-protein shake that's low in sugar and dairy-free"
    0.2386  21001 Chocolate Recovery Shake      [protein 30g, sugar 4g, dairyFree=True]
    0.2876  21002 Vanilla Whey Protein Shake    [protein 25g, sugar 6g, dairyFree=False]
    0.4053  21004 Berry Plant Protein Smoothie  [protein 20g, sugar 9g, dairyFree=True]
  keyword LIKE match: 24 hits -> ['Organic Milk', 'Classic Cheese', 'Classic Eggs', ...]

Q: 'breathable lightweight blue running shoes'
    0.1572  20001 AeroStride Runner             [blue, running, breathable=True]
  keyword LIKE match: 0 hits  <-- ZERO RESULTS
```

It also prints the distance distribution used to pick `AppConfig.defaultRelevanceThreshold`.
For the hero query the best match is at 0.24 and the median document at 0.81, which is why
the threshold is 0.60 rather than the 0.35 in the data-model spec — 0.35 returns only 2 of
104 documents and discards legitimate near-misses.

## Where the output goes

1. **Capella** — import the JSON per scope/collection via inline import, mapping the `id`
   field as the document ID (same flow as the base demo's dataset).
2. **The app bundle** — `iOS/GroceryApp/Copilot/Resources/DemoDataset/` holds a copy so the
   copilot works with no backend at all. `LocalDatasetSeeder` loads it into any collection
   that comes up empty, using the same document IDs, so synced documents supersede the
   seeded ones normally.

## Step 2 — the image side

### Why the imagery is generated

Every image the dataset refers to returns **403**: the Footwear product shots
(`.../20001.png`), the sports-nutrition shots (`.../21001.png`), and all the planogram
goldens (`.../planograms/nyc_A1_golden.png`). Step 2 is entirely gated on imagery, so
`generate_shelf_assets.py` renders a self-consistent set — one product image per new SKU,
driven by that document's own colour/category/name, plus a **golden** and a **messy** shelf
per planogram.

They are placeholders, not photographs, and the audit UI says so. When real shelf photos
arrive, only the inputs change; `embed_images.py` and the on-device crop matching are
unaffected.

The messy variant reproduces the narrative's failure at exactly one position: the product
that belongs at the leftmost slot is pushed to the back and its neighbour has spread forward
into the empty facing.

### Why per-facing crops, not one shelf vector

A single global CLIP vector per photo cannot say *which* item moved — it carries no
per-position information, and CLIP is documented to overlook the fine spatial detail a
planogram check depends on. So each expected position is cropped out and matched separately
against product-image vectors. That is what makes "expected AeroStride Runner at A1-L, found
WinterWarm Boot" possible.

The app still shows whole-shelf similarity as a secondary number, and the gap is instructive:
on the messy A1 shelf it reads **91%** — "basically fine" — while the per-position pass
correctly flags the violation.

### Why CLIP is quantized

CLIP's vision tower is 87M parameters, so fp16 weights are **~168MB** — over GitHub's 100MB
per-file hard limit. `convert_clip.py` applies int8 per-channel weight quantization, giving
**84MB**.

`verify_clip_parity.py` checks the thing that actually matters. Stored product vectors are
authored from the fp32 PyTorch model; shelf-crop queries come from the int8 CoreML export. So
rather than reporting a cosine, it re-runs every audit and asserts the *verdicts* hold:

```
positions checked: 36   failures: 0
decision margin — min +0.0397  mean +0.1485
```

Quantization changed no verdict. The narrowest margin is two visually similar trail shoes
(olive Trailblaze GTX vs brown TrailGrip Hiker), which the app surfaces as "low confidence"
rather than implying certainty the vectors do not support.

Preprocessing is the other place these two paths can diverge: resize shortest side to 224
(bicubic), centre crop, scale to [0,1], normalize with CLIP's mean/std. `ImageEmbedder.swift`
reproduces it, and `verify_clip_parity.py` is what confirms the agreement.

> One host-side quirk: the int8 graph trips an `MLIR pass manager failed` assertion inside
> MPSGraph on some Mac GPU drivers, so the verification script pins `CPU_ONLY`. The iOS
> loader falls back to CPU for the same reason — a slower correct answer beats a failed audit.

## If the model ever changes

Re-run **both** scripts from the same checkpoint and re-import. The stored envelope records
`model`, `dim` and `metric`, and the behind-the-scenes screen flags a mismatch between stored
vectors and the on-device model — but it cannot fix one. Note that a different model usually
means a different dimension (EmbeddingGemma is 768, truncatable only to 512/256/128 — there
is no 384 option), which also requires rebuilding every device-side vector index.
