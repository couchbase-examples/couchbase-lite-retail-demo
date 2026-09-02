# The Store Associate Copilot

The Copilot is the vector search half of this demo. It lives behind the **Copilot** tab in the
iOS and Android apps, and everything it does runs on the device: no cloud inference, no API keys,
no network round trip at query time.

That last point is the whole reason it exists. Semantic search, retrieval augmented generation
and image matching are usually cloud features. Here they run against a local Couchbase Lite
database, which means they keep working in a stockroom with no signal.

> Vector search is implemented on **iOS and Android only**. The React Native and web clients in
> this repo sync the same data but do not have the Copilot.

## Contents

- [The three steps](#the-three-steps)
- [What each step proves](#what-each-step-proves)
- [Trying it](#trying-it)
- [Where to go next](#where-to-go-next)

## The three steps

The tab has three modes, meant to be demoed in order.

### 1. Find: semantic product lookup

An associate describes what a shopper asked for, in the shopper's own words, and gets ranked
products with their aisle and shelf.

Type "a high protein shake that's low in sugar and dairy free" and you get the right products
even though the catalogue never uses those words together. The query is embedded on the device
with MiniLM, then matched against product description vectors already stored in Couchbase Lite.

Alongside the results, the screen shows what a plain keyword search would have returned for the
same query. That comparison is the point of the screen. Keyword search usually returns either
nothing or a long unranked list that happens to contain the right answer somewhere in the middle.

Find also handles price constraints written into the sentence. "electrolyte drink under $3" is
split before the query is embedded: the price becomes a SQL++ predicate, and only "electrolyte
drink" is turned into a vector. Both halves run in one query.

### 2. Planogram: visual shelf audit

A planogram is the plan for how products should sit on a shelf. Vendors pay for specific
placements, so compliance matters commercially. Checking it by eye across a whole store is slow
and inconsistent.

Pick a shelf, then check a photo of it against the "golden" reference layout. The photo is cut
into the shelf's grid, each cell is embedded with CLIP on the device, and each cell is matched
against the golden cells for that shelf. The result names the product that moved rather than just
saying the shelf looks different.

You can also reach this screen from Find. Tapping a product's location on a result card carries
that aisle and shelf straight into the audit, which is the realistic path: an associate looks
something up, walks to the shelf, and checks it while standing there.

### 3. Ask: grounded answers from local knowledge

A shopper asks something the product catalogue cannot answer, like what to drink after a run.
The question is embedded on the device and matched against a local collection of product
knowledge, and the retrieved passages are used to write an answer.

Retrieval always runs on the device. Generation depends on what the platform provides:

- **iOS** uses Apple Foundation Models, which ship with the operating system.
- **Android** downloads a small Gemma model once, in the app, and runs it through MediaPipe.

If no language model is available, the screen shows the retrieved passages as they are rather
than inventing an answer. That is a deliberate choice, and it still demonstrates the interesting
half, which is that the retrieval happened locally.

## What each step proves

| Step | Vector type | What it demonstrates |
| --- | --- | --- |
| Find | Text, 384 dimensions | Semantic search over synced documents, plus hybrid filtering in the same query |
| Planogram | Image, 512 dimensions | Image similarity that localises a change instead of just detecting one |
| Ask | Text, 384 dimensions | Retrieval augmented generation with no cloud call in either half |

## Trying it

The most convincing sequence takes about a minute:

1. Open **Find** and run one of the suggested queries. Note the aisle and shelf on the first
   result, and open the keyword comparison to see what the alternative would have returned.
2. Tap the product's location. You land in **Planogram** on that shelf.
3. Run **Check Organized Shelf**, then **Check Disorganized Shelf**. The second one should flag
   the missing product and show you where on the shelf it belongs.
4. Open **Ask** and use one of the suggested questions.
5. Now turn on airplane mode and do steps 1 to 4 again.

Step 5 is the one worth planning for. Everything still works, because the vectors are on the
device and so are the models. The only thing that changes is that images already cached stay
visible and nothing new can be fetched.

## Where to go next

- [Setting up the Copilot data and models](./vector-setup.md), if search returns nothing or the
  Planogram tab says a shelf cannot be audited. Start here, because the Copilot needs collections
  and a dataset that the base setup does not cover.
- [How the vector search works](./architecture.md), for the data model, the queries, and the
  thresholds.
- [Planogram test plan](../PLANOGRAM-TEST-PLAN.md), for the expected numbers per shelf and a
  symptom to cause table.
