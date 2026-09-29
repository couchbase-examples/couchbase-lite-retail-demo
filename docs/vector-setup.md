# Setting up the Copilot data and models

The Copilot needs three things: the `product_knowledge` and `planograms` collections, a dataset
that actually contains vectors, and the on-device models. The Capella setup in the
[root README](../README.md) now covers the first two. This page adds the detail behind them, the
models, and how to check it all worked.

If Find returns nothing, or the Planogram tab says a shelf has no golden layout, the cause is
almost always on this page.

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

### Where the files are

They are in this repository, at either of these paths, which hold the same content:

```
iOS/GroceryApp/Copilot/Resources/DemoDataset/
Android/app/src/main/assets/copilot/dataset/
```

Do not use the older `demo-dataset.zip` that earlier versions of the root README linked to. It predates the Copilot and has
no vectors in it, so importing it leaves Find with nothing to match against.

Per store, you need:

| File | Into collection | Documents |
| --- | --- | --- |
| `<store>_store_inventory.json` | `inventory` | 104 |
| `<store>-store-01-profile.json` | `profile` | 1 |
| `<store>_store_product_knowledge.json` | `product_knowledge` | 10 |
| `<store>_store_planograms.json` | `planograms` | 336 |

`<store>` is `aa` or `nyc`. The two stores hold equivalent data, so whatever you import into one
scope, import the matching file into the other.

The planograms file is about 3.6 MB. If the copy you are holding is around 34 KB, it is an older
one from before the grid based audit and the Planogram tab will not work with it.

Import each one through **Data Tools > Import** in Capella:

1. Choose **Load from your browser** and pick the JSON file.
2. Set the target bucket, scope and collection.
3. Under **Preview your data**, choose **Field** and enter `id`.
4. Import.

Step 3 is the one that matters. Every document in these files has a top-level `id`, and the app
looks documents up by it. If you leave the default **UUID** option selected, Capella generates
random keys and you get a second copy of every document rather than an update. A collection
holding 208 products instead of 104 is the tell.

The `planograms` file is worth checking twice. It contains two document types: 24 `Planogram`
summaries, one per shelf, each carrying the grid, and 312 `PlanogramCell` documents, one per grid
cell, each carrying the image vector. A shelf whose cells did not import will appear in the shelf
picker but cannot be audited.

The count is the quickest check. A `planograms` collection holding 336 documents is right.
One holding 3 is the old dataset, and one holding 672 means the import ran twice with UUID keys.

## Vector indexes: nothing to do

This surprises people who know Capella's server side vector search, so it is worth stating
plainly: **you do not create any vector index in Capella for this demo.**

Couchbase Lite builds its own indexes locally, on each device, and the apps do that
automatically on launch. Three get created:

| Index | Collection | Field | Dimensions |
| --- | --- | --- | --- |
| `idx_inventory_text` | `inventory` | `embedding.text.vector` | 384 |
| `idx_knowledge_text` | `product_knowledge` | `embedding.text.vector` | 384 |
| `idx_planogram_image` | `planograms` | `embedding.image.vector` | 512 |

The vectors travel as ordinary document fields through sync, and each device indexes its own
copy. That is the point of the demo: the search runs on the device, so there is no server side
index in the query path.

Two behaviours to expect, neither of them a failure.

Index creation is skipped while a collection is still empty, because there is nothing to index
yet. On a first launch the apps wait for replication to finish and then build them, so the
indexes appear a moment after the data does.

The logs then say something like "Untrained index; queries may be slow. 250 vectors needed for
training; 104 present." That is expected at this size and does not need fixing. A vector index
is trained only once a collection holds 25 x centroids vectors, and this dataset does not get
there. Below that point Couchbase Lite does not build an ANN structure at all: it keeps the
vectors as a flat list, treats them as one default centroid, and scans them linearly, which for
around a hundred vectors is faster and more accurate than an approximate search would be. The
same code against a real catalogue trains and runs a true approximate search with nothing
changed.

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
