# How the vector search works

Written for someone extending this code, not just running it. For what the features do, read
[The Store Associate Copilot](./copilot.md) first. For getting the data in place, read
[Setting up the Copilot data and models](./vector-setup.md).

## Contents

- [The shape of it](#the-shape-of-it)
- [Where the code lives](#where-the-code-lives)
- [Step 1: semantic search and hybrid filtering](#step-1-semantic-search-and-hybrid-filtering)
- [Step 2: the planogram audit](#step-2-the-planogram-audit)
- [Step 3: retrieval augmented generation](#step-3-retrieval-augmented-generation)
- [Offline behaviour](#offline-behaviour)
- [Keeping the two platforms in step](#keeping-the-two-platforms-in-step)

## The shape of it

Every feature follows the same three moves:

1. Vectors arrive as ordinary document fields through replication, in an `embedding` object on
   the document. They are authored offline by the scripts in `tools/embeddings/`.
2. Couchbase Lite builds a local vector index over that field, on the device.
3. At query time the app embeds the input on the device and runs one SQL++ statement with
   `APPROX_VECTOR_DISTANCE` against the local index.

Nothing about step 3 touches the network. That is what makes the offline demo work, and it is
also why the query encoder has to match whatever produced the stored vectors. A mismatch there
does not error, it just quietly ranks badly, which is a much harder problem to notice. The
diagnostics screen compares the two and warns when they disagree.

Distances are cosine throughout, and every vector is L2 normalised, so a distance of 0 is
identical and larger is worse.

## Where the code lives

| Concern | iOS | Android |
| --- | --- | --- |
| Text embedding | `Copilot/TextEmbedder.swift` | `copilot/TextEmbedder.kt` |
| Image embedding | `Copilot/ImageEmbedder.swift` | `copilot/ClipImageEmbedder.kt` |
| Search and RAG queries | `Copilot/CopilotSearchService.swift` | `copilot/CopilotSearchService.kt` |
| Price filter parsing | `Copilot/QueryConstraints.swift` | `copilot/QueryConstraints.kt` |
| Planogram audit | `Copilot/PlanogramAudit.swift` | `copilot/PlanogramSearch.kt` |
| Local index creation | `Copilot/VectorIndexManager.swift` | `copilot/VectorIndexManager.kt` |
| Answer generation | `Copilot/RAGAssistant.swift` | `copilot/LocalLanguageModel.kt` |
| Image cache warming | `Copilot/ImagePrefetcher.swift` | `copilot/ImagePrefetcher.kt` |

The two platforms are written as deliberate counterparts. Same queries, same thresholds, same
model checkpoints. If you change a threshold or a query on one side, change it on the other, or
the demo starts giving different answers depending on which phone is in the room.

## Step 1: semantic search and hybrid filtering

The query is embedded with MiniLM-L6-v2 into 384 dimensions and matched against
`embedding.text.vector` on `inventory`.

### The query

```sql
SELECT productId, name, price, location, ...,
       APPROX_VECTOR_DISTANCE(embedding.text.vector, $queryVector, "cosine") AS distance
FROM `<scope>`.`inventory`
WHERE APPROX_VECTOR_DISTANCE(embedding.text.vector, $queryVector, "cosine") IS VALUED
  AND price < $maxPrice
ORDER BY distance
LIMIT 20
```

Two details are load bearing. `IS VALUED` is the documented way to make the planner use the
vector index. And the distance is aliased once and ordered by the alias, so the function is not
re-evaluated for every row.

Results are then dropped if their distance is above a relevance threshold, which is adjustable
on the diagnostics screen. Without it, a vector search always returns its `LIMIT` worth of rows,
including for a query nothing in the catalogue answers.

### Why the price filter is parsed before embedding

"electrolyte drink under $3" is two questions. "electrolyte drink" is semantic. "under $3" is
numeric, and MiniLM has no notion of "under" as an ordering, so leaving it in the sentence just
adds noise to the vector.

`QueryConstraints` pulls the price phrase out with a small regex, turns it into a `WHERE`
predicate, and embeds only the remainder.

It matters that this happens *before* the query rather than as a filter on the results. A vector
search spends its `LIMIT` on nearest neighbours, so filtering afterwards throws away rows that
were already chosen. A cheap product ranked 30th by similarity would never appear at all,
because it never made it into the top 20 the filter sees. Filtering inside the query lets the
index skip the expensive rows in the first place.

The grammar is deliberately tiny (`under`, `below`, `less than`, `over`, `above`, `more than`,
and a few synonyms). It is rule based rather than model driven for two reasons: a language model
round trip would take longer than the search it precedes, and a regex that fails to match
degrades to plain semantic search rather than to a confidently wrong filter.

## Step 2: the planogram audit

This is the most involved of the three, and the design went through one wrong turn worth
knowing about.

### The data model

Each shelf is two kinds of document in `planograms`:

- One `Planogram` summary, carrying `grid` (`rows`, `cols`, `cropTop`), the expected layout, and
  a `goldenImageURL`.
- One `PlanogramCell` per grid cell, carrying `row`, `col`, `expectedProduct`, and the CLIP
  embedding of that cell cropped out of the golden shelf photo.

Those cell vectors are what the device searches against.

### The audit

1. Read the shelf's grid.
2. Trim `cropTop` off the top of the photo, which is the header sign, then slice the rest into
   `rows` by `cols` equal cells.
3. Embed each cell with CLIP ViT-B/32 into 512 dimensions.
4. For each cell, find the nearest golden cell **for that shelf**.
5. Classify the cell, then roll the cells up per column into a per-product verdict.

The tiling has to reproduce exactly the geometry used to author the golden cells. If it does
not, cell (r, c) of the photo is not looking at the same place as cell (r, c) of the golden, and
every distance becomes meaningless while still looking plausible.

### The per-cell query

```sql
SELECT `row`, `col`, expectedProduct,
       APPROX_VECTOR_DISTANCE(embedding.image.vector, $vec, "cosine") AS dist
FROM `<scope>`.`planograms`
WHERE docType = "PlanogramCell" AND shelf = $shelf
ORDER BY APPROX_VECTOR_DISTANCE(embedding.image.vector, $vec, "cosine")
LIMIT 1
```

There is a fallback behind this. A predicate applied to an approximate nearest neighbour
candidate set can eliminate every row, which would read as "nothing on this shelf matches" for a
perfectly good photo. So if the hybrid form returns nothing, the same search runs without the
`WHERE`, at a larger limit, and is filtered to the shelf in code.

### Classification

| Condition | Verdict |
| --- | --- |
| distance > 0.18 | Empty. Nothing on the shelf resembles the golden cell |
| nearest golden cell is in this column | Correct |
| nearest golden cell is in a different column | Misplaced |

Then per column, which is per product:

| Condition | Verdict |
| --- | --- |
| median > 0.12 | Flagged. Missing if most cells are empty, otherwise misplaced |
| worst cell > 0.18 | Reduced facings or gaps |
| otherwise | Correctly stocked |

### The wrong turn

The first version cropped each named shelf position and matched it against **product image
vectors on the inventory documents**. It answered "does this look like a product we sell", which
is not the question. It could tell you something had changed but not what moved where.

Matching a photo cell against *golden cells for that shelf* is what localises the problem,
because the nearest golden cell tells you which position of the ideal layout the camera is
looking at. If that position belongs to a different column, the product has shifted. That single
change is what makes "expected this product here, found that one" possible.

The named-position approach is gone, along with the inventory image vectors it needed.

## Step 3: retrieval augmented generation

Retrieval matches the question against `embedding.text.vector` on `product_knowledge`, using the
same MiniLM encoder as Find. When the question arrived from a product card, retrieval is scoped
to that product's category with `ARRAY_CONTAINS(relatedCategories, $category)`, and falls back
to an unscoped search if the category filter empties the candidate set.

Generation is availability gated, and the two platforms differ because the platforms differ:

- **iOS** uses Apple Foundation Models. The model ships with the operating system, so there is
  nothing to install, but it needs real hardware.
- **Android** has no operating system level model, so it uses Gemma 3-1B through MediaPipe. The
  weights are licence gated and roughly half a gigabyte, so they cannot be committed. The app
  downloads them once, resumably, into its own storage.

The download deliberately does not live on the Ask screen's coroutine scope. Compose cancels
that scope when the screen leaves composition, which used to kill a half finished transfer as
soon as someone switched tabs. `LocalLanguageModel` owns it instead, so it survives navigation.

When no model is available, the retrieved passages are shown as they are. Inventing an answer
would undermine the only claim the screen is making.

## Offline behaviour

Documents and vectors are offline first by construction: they replicate into Couchbase Lite and
stay there. The models are on the device too. So Find, Planogram and Ask all work with the
network off.

Images were the exception, and it is worth understanding why. Product photos and golden shelf
references are S3 URLs fetched when a view renders, so a screen that had never been scrolled had
never downloaded its pictures. Going offline and then opening the Copilot for the first time
showed empty frames.

`ImagePrefetcher` fixes that by walking every image URL in the local database once, on the
existing initial sync callback, and pulling them into the same disk cache the UI reads from. It
is bounded to six concurrent requests so it cannot starve the replicator that has just finished,
and it is fire and forget: failures are ignored and already cached URLs are skipped.

The golden reference also falls back to a bundled copy of the image if the URL cannot be
fetched, so the Planogram screen still shows what it is comparing against when offline.

## Keeping the two platforms in step

A few things need to stay identical, and none of them fail loudly if they drift:

- **The embedding models.** Same checkpoints, same preprocessing. `tools/embeddings/verify_clip_parity.py`
  exists because a preprocessing difference between the authoring script and the app shows up as
  slightly worse matching rather than as an error.
- **The thresholds.** 0.18 and 0.12 are duplicated in `PlanogramAudit.swift` and
  `PlanogramSearch.kt`.
- **The price grammar.** `QueryConstraints` on both sides, same patterns.
- **The queries.** Same SQL++, including `IS VALUED` and the fallback behaviour.

If you are changing any of those, change both, and check the diagnostics screen afterwards. It
reports the model in use, the vector dimensions, the metric, the indexes, and the measured
embed and search latency, which is usually enough to spot a mismatch.
