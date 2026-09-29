# Image assets needed — Store Associate Copilot

Everything below was checked against the shipped dataset and against S3 on 30 Jul 2026.

## Already covered — please don't redo these

All **80 original grocery images** (`10000.png` … `10079.png`) exist in S3 and return 200. The
Inventory grid and the copilot's search results both render them correctly today. Nothing is
needed for the original catalogue.

## What's missing

Every image the *extended* dataset references returns **403**. Three groups, in priority order.

| # | Group | Files | Blocks |
|---|---|---|---|
| A | Product shots for the 24 new SKUs | 24 | Find results, Ask header, and per-position shelf matching |
| B | Golden (correct) shelf photos | 3 | The planogram audit's reference vectors |
| C | Non-compliant shelf photos | 3–6 | Demonstrating that the audit actually catches a problem |

Product images are **shared across both stores** — NYC and AA use identical `productId`s and
identical `imageURL`s, so each product is shot once, not twice.

The two stores' planogram layouts are also **byte-identical** (same shelves, same products, same
facings), so one set of shelf photos can serve both. If we ever want visible store-to-store
differentiation, that's a dataset change first, not a photography change.

---

## Group A — product shots (24 files)

These do double duty: they're what the associate sees in search results, **and** what the
planogram audit matches cropped shelf regions against. The second use is why the specs below
matter more than they would for catalogue art alone.

### Footwear — 18 files

| File | Product | Brand | Colour | Use case |
|---|---|---|---|---|
| `20001.png` | AeroStride Runner | StrideLab | blue | running |
| `20002.png` | Trailblaze GTX | TrailForge | olive | trail running |
| `20003.png` | CloudStep Cushion | AeroFit | grey | road running |
| `20004.png` | SwiftRace Elite | StrideLab | red | racing |
| `20005.png` | UrbanWalk Classic | UrbanPace | white | casual |
| `20006.png` | FlexMove Trainer | PeakPro | black | cross-training |
| `20007.png` | TinyTrek Kids | StrideLab | teal | running |
| `20008.png` | HydroGuard Waterproof | TrailForge | navy | walking |
| `20009.png` | BreezeKnit Slip-On | AeroFit | grey | casual |
| `20010.png` | TrailGrip Hiker | TrailForge | brown | hiking |
| `20011.png` | StudioFlow Yoga | PeakPro | purple | studio |
| `20012.png` | MetroDash Commuter | UrbanPace | charcoal | commuter |
| `20013.png` | ProCourt Tennis | PeakPro | white | tennis |
| `20014.png` | RecoverEase Slide | AeroFit | black | recovery |
| `20015.png` | WinterWarm Boot | TrailForge | black | winter |
| `20016.png` | FeatherLite Racer | StrideLab | blue | running |
| `20017.png` | AllDay Comfort Walker | UrbanPace | beige | walking |
| `20018.png` | KidSport Active | AeroFit | orange | sport |

### Sports nutrition — 6 files

| File | Product | Brand | Format | Flavour |
|---|---|---|---|---|
| `21001.png` | Chocolate Recovery Shake | GreenLeaf | bottle | chocolate |
| `21002.png` | Vanilla Whey Protein Shake | PrimeChoice | bottle | vanilla |
| `21003.png` | Citrus Electrolyte Hydration | BluePeak | bottle | citrus |
| `21004.png` | Berry Plant Protein Smoothie | GreenLeaf | bottle | mixed berry |
| `21005.png` | Citrus Energy Gel | Acme | pouch | citrus |
| `21006.png` | Greek Yogurt Protein Drink | FarmFresh | bottle | plain |

> **`21001` and `21002` are the two most important images in the whole set.** They are the hero
> pair for the demo — a shopper asks for a high-protein, low-sugar, dairy-free shake, and the
> copilot has to distinguish the plant-based Chocolate Recovery Shake from the whey-based
> Vanilla shake. If those two are visually near-identical, the shelf audit cannot tell them
> apart and the headline demo moment gets shakier. Give them clearly different packaging
> (colour, label layout), the way two real competing SKUs would look.

### Specs

- **Square**, 512×512 or larger, PNG.
- **Plain light background**, no props, no shadow-heavy staging.
- **One product, front-facing, filling most of the frame.** Consistent framing across all 24 —
  the audit compares crops against these, so a product shot at a wildly different scale or
  angle than how it appears on the shelf will match poorly.
- Packaging text should be **legible**. CLIP reads text in images, and it's a meaningful part
  of how two similar bottles get told apart.

---

## Group B — golden shelf photos (3 files)

One per audited shelf, showing the shelf **correctly stocked** per the planogram. These become
the reference image vector for that shelf.

| File | Aisle | Shelf | Section | Left | Centre | Right |
|---|---|---|---|---|---|---|
| `planograms/A1_golden.png` | 30 | A1 | Footwear | 20001 AeroStride Runner ×3 | 20015 WinterWarm Boot ×3 | 20005 UrbanWalk Classic ×2 |
| `planograms/A2_golden.png` | 30 | A2 | Footwear | 20002 Trailblaze GTX ×2 | 20010 TrailGrip Hiker ×2 | 20014 RecoverEase Slide ×2 |
| `planograms/C3_golden.png` | 21 | C3 | Sports Nutrition | 21001 Chocolate Recovery Shake ×4 | 21002 Vanilla Whey Protein Shake ×3 | 21003 Citrus Electrolyte Hydration ×3 |

`×N` is the facing count — how many units of that product face forward at that position.

**C3 is the one that matters most.** With the grocery-first narrative, C3 is the only shelf the
app offers by default; the footwear shelves are there for the "generalises to any vertical"
story.

### Specs — please read, these constrain the audit

- **Landscape**, roughly 2:1, 1280×640 or larger, PNG.
- **The whole shelf, edge to edge, shot square-on.** The app crops the photo into *N equal
  vertical bands*, one per position — so the three positions need to occupy roughly the left,
  middle and right thirds of the frame. A photo taken at an angle, or with the shelf occupying
  only part of the frame, will slice the wrong products into the wrong bands.
- **No product should straddle a third boundary.** Leave a little visual gap between positions.
- Even, diffuse lighting. Avoid hard glare on packaging — it's the main thing that degrades
  matching.

---

## Group C — non-compliant shelf photos (3–6 files)

Same shelves, deliberately wrong. Without these there is nothing to demonstrate: a compliant
shelf just reports 100% and the feature looks like it does nothing.

Two variants per shelf would be ideal; one is enough to start.

| File | Scenario |
|---|---|
| `planograms/C3_messy.png` | **The narrative one.** Chocolate Recovery Shake (21001) pushed to the back of C3-L and largely hidden, with Vanilla Whey (21002) spread forward into its facing. Expected result: *"C3-L: expected Chocolate Recovery Shake, found Vanilla Whey Protein Shake."* |
| `planograms/C3_outofstock.png` | C3-L empty — the shake is simply gone. |
| `planograms/A1_messy.png` | AeroStride Runner (20001) and WinterWarm Boot (20015) swapped between A1-L and A1-C. |
| `planograms/A2_messy.png` | A2-C short on facings — TrailGrip Hiker down to one unit. |

Shoot these from the **same position and framing as the matching golden photo**. The audit's
whole-shelf similarity number compares the two directly, so a change in camera position shows
up as a difference the same way a moved product does.

---

## Delivery

- Same S3 bucket and layout as today: product images at the root (`20001.png`), shelf photos
  under a `planograms/` prefix.
- Shelf photo filenames above have no store prefix, since one set serves both stores. If you'd
  rather keep them per-store, use `nyc_A1_golden.png` / `aa_A1_golden.png` and I'll point the
  dataset at whichever convention you pick.
- Once they're up I re-run `embed_images.py` to generate the CLIP vectors and re-import — no app
  changes needed.

## What happens in the meantime

The app is not blocked. `generate_shelf_assets.py` renders a placeholder set — flat vector-style
product shapes and composited shelves — and the audit runs against those end to end today,
correctly reporting *"C3-L: expected Chocolate Recovery Shake, found Vanilla Whey Protein
Shake."* The UI labels them as placeholder renders rather than photographs. Real imagery replaces
the inputs; none of the pipeline changes.

## Where these actually appear in the app

Useful context if you want to see what you're shooting for:

| Surface | Image used |
|---|---|
| Inventory grid (iOS + Android) | product image — already working for the original 80 |
| Copilot → **Find** results | product image, 70×70 thumbnail per result |
| Copilot → **Ask** context header | product image, 44×44 thumbnail of the product being asked about |
| Copilot → **Planogram** result | the shelf photo, full width, with a coloured per-position bar beneath it |
| Copilot → Planogram matching (not visible) | product images, cropped-region comparison — this is what names the misplaced item |

Two places currently have no image and could use one once assets exist: the **Request Help**
sheet (a thumbnail of the product being relocated would make the task clearer to whoever picks
it up), and a **golden-vs-captured side-by-side** in the audit result — the golden image is
already synced on each planogram document but only its vector is used today.
