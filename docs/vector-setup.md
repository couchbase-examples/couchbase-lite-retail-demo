# Setting up the Copilot data and models

Follow this after the Capella and App Services setup in the [root README](../README.md). The
Copilot needs three things the base setup does not cover: two extra collections, a dataset that
actually contains vectors, and the on-device models.

If Find returns nothing, or the Planogram tab says a shelf has no golden layout, the cause is
almost always on this page.

> **The base setup in the root README is not enough on its own.** It documents three collections
> (`inventory`, `orders`, `profile`) and links a dataset with no vectors in it. Both were written
> before the Copilot existed.

## Contents

- [Collections](#collections)
- [The dataset](#the-dataset)
- [Vector indexes: nothing to do](#vector-indexes-nothing-to-do)
- [On-device models](#on-device-models)
- [Verifying it worked](#verifying-it-worked)
- [Common problems](#common-problems)

## Collections

Each store scope needs **five** collections. The base setup covers the first three.

| Collection | Holds | Needed for |
| --- | --- | --- |
| `inventory` | 104 products, with 384-d text vectors | Everything, including Find |
| `profile` | One store profile document | Store identity |
| `orders` | Starts empty, written by the app | Re-ordering |
| `product_knowledge` | 10 knowledge passages, with 384-d text vectors | Ask |
| `planograms` | Shelf layouts plus per-cell 512-d image vectors | Planogram |

`product_knowledge` is the one people miss, and it fails in a confusing way: Find works normally
while Ask returns nothing at all. If you only add one thing after the base setup, add that.

Create the same five in both `NYC-Store` and `AA-Store`, and enable all five on the App Endpoint.
A collection that exists in the bucket but is not enabled on the endpoint will never reach a
device.

## The dataset

Use the dataset that contains embeddings. The `demo-dataset.zip` linked from the root README
predates the Copilot and has no vectors, so importing it leaves Find with nothing to match
against.

Per store, you need:

| File | Into collection |
| --- | --- |
| `<store>_store_inventory.json` | `inventory` |
| `<store>-store-01-profile.json` | `profile` |
| `<store>_store_product_knowledge.json` | `product_knowledge` |
| `<store>_store_planograms.json` | `planograms` |

Import each one through **Data Tools > Import** in Capella:

1. Choose **Load from your browser** and pick the JSON file.
2. Set the target bucket, scope and collection.
3. Under **Preview your data**, choose **Field** and enter `id`.
4. Import.

Step 3 is the one that matters. Every document in these files has a top-level `id`, and the app
looks documents up by it. If you leave the default **UUID** option selected, Capella generates
random keys and you get a second copy of every document rather than an update. A collection
holding 208 products instead of 104 is the tell.

The `planograms` file is worth checking twice. It contains two document types: one `Planogram`
summary per shelf, carrying the grid, and one `PlanogramCell` per grid cell, carrying the image
vector. A shelf whose cells did not import will appear in the shelf picker but cannot be audited.

## Vector indexes: nothing to do

This surprises people who know Capella's server side vector search, so it is worth stating
plainly: **you do not create any vector index in Capella for this demo.**

Couchbase Lite builds its own indexes locally, on each device, and the apps do that
automatically on launch. Four get created:

| Index | Collection | Field | Dimensions |
| --- | --- | --- | --- |
| `idx_inventory_text` | `inventory` | `embedding.text.vector` | 384 |
| `idx_knowledge_text` | `product_knowledge` | `embedding.text.vector` | 384 |
| `idx_planogram_image` | `planograms` | `embedding.image.vector` | 512 |
| `idx_planogram_cells` | `planograms` | `embedding.image.vector` | 512 |

The vectors travel as ordinary document fields through sync, and each device indexes its own
copy. That is the point of the demo: the search runs on the device, so there is no server side
index in the query path.

One behaviour to expect. Index creation is skipped while a collection is still empty, because an
index built against no documents can never train. On a first launch the apps wait for
replication to finish and then build them, so the indexes appear a moment after the data does.
That is normal, not a failure.

## On-device models

Three of the four models are committed to the repo. One is not.

| Model | Used by | In the repo |
| --- | --- | --- |
| MiniLM-L6-v2 (CoreML) | iOS, Find and Ask retrieval | Yes |
| MiniLM-L6-v2 (int8 ONNX) | Android, Find and Ask retrieval | Yes |
| CLIP ViT-B/32 (CoreML, int8) | iOS, Planogram | Yes |
| CLIP ViT-B/32 (fp32 ONNX) | Android, Planogram | **No, fetch it** |

The Android CLIP export is 335 MB, so it is deliberately kept out of git. Without it the app
still runs and Find and Ask are unaffected; only the Planogram tab reports the model as
unavailable. To enable it, put the file here:

```
Android/app/src/main/assets/clip-vit-b-32.onnx
```

### The answer generator for Ask

Retrieval runs on the device on both platforms. Generation differs:

- **iOS** uses Apple Foundation Models, supplied by the operating system. It needs a physical
  iPhone with Apple Intelligence enabled. The Simulator reports the model as available and then
  fails at inference, which is confusing but is a Simulator limitation, not a bug in the app.
- **Android** downloads a Gemma model on demand. Open the Ask tab and tap **Download assistant
  model**. It is a one time download, cached afterwards, and it continues if you navigate to
  another tab.

With no model present, both platforms fall back to showing the retrieved passages. That is a
reasonable thing to demo on its own, since the retrieval is the part that runs locally.

## Verifying it worked

Run these in the Capella Query Workbench, once per scope.

Products and their text vectors, expect 104 and 104:

```sql
SELECT COUNT(*) AS total, COUNT(embedding.text.vector) AS with_vectors
FROM `supermarket`.`NYC-Store`.`inventory`
```

Knowledge passages, expect 10 and 10:

```sql
SELECT COUNT(*) AS total, COUNT(embedding.text.vector) AS with_vectors
FROM `supermarket`.`NYC-Store`.`product_knowledge`
```

Shelves that can be audited. This should return nothing, and every row it does return is a shelf
the Planogram tab will refuse to audit:

```sql
SELECT shelf FROM `supermarket`.`NYC-Store`.`planograms`
WHERE docType = "Planogram" AND grid IS MISSING
```

On the device side, the apps log what they actually loaded. Filter for `[ShelfAudit]` and you
will see a line like this, which tells you the store, the shelf count, and exactly which shelves
are unusable:

```
[ShelfAudit] store=aa scope=AA-Store planograms=24 auditable=21 blocked=3 ["21/C3", "30/A1", "30/A2"]
```

## Common problems

| Symptom | Cause |
| --- | --- |
| Find says no products on this device | Nothing synced yet. Check the collection is enabled on the App Endpoint |
| Find returns results but they look random | The imported dataset has no `embedding.text` on its documents |
| Ask retrieves nothing while Find works | `product_knowledge` is missing, or not enabled on the endpoint |
| A shelf says its golden layout has not synced | That shelf's `Planogram` document has no `grid`. Re-import the planograms file |
| Every product appears twice | Imported with UUID keys instead of the `id` field |
| Planogram says the CLIP model is unavailable (Android) | `clip-vit-b-32.onnx` is not in the assets folder |
| Ask shows passages but never an answer | No language model. Expected on iOS Simulator, or before the Android download |
| Images are blank after going offline | The app caches images after the first sync. Let it finish once while online |
