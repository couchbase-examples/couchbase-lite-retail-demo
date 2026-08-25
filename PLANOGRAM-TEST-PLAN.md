# Step 2 (Planogram) — test plan

On-device shelf audit: photo → tile into the golden's grid → CLIP-embed each cell →
`APPROX_VECTOR_DISTANCE` against that shelf's golden `PlanogramCell` docs → per-product verdict.

Thresholds (identical on both platforms, and to Priya's reference):

| Constant | Value | Meaning |
| --- | --- | --- |
| `emptyThreshold` | `0.18` | Cell distance above this → nothing matches → **empty** |
| `changeThreshold` | `0.12` | Per-product (per-column) **median** above this → flagged |

Verdict order: median > 0.12 → *empty/missing* (if most cells empty) or *misplaced/wrong product*;
else worst cell > 0.18 → *reduced facings / gaps*; else *correctly stocked*.

---

## 0. Preflight — do these before touching the app

**a) Data.** The `planograms` collection needs **24 `Planogram` + 312 `PlanogramCell` docs per
store**. If the Aug dataset with real embeddings has not been imported to Capella and synced,
nothing below will work.

Verify in the app: the shelf dropdown must list **exactly 24** entries.

- Fewer than 24 → sync incomplete, or `planograms` not in the App Services config.
- **336** → the `docType = "Planogram"` filter has regressed; cell docs are leaking into the picker.

**b) Android CLIP model** must exist (gitignored, so a fresh clone will not have it):

```bash
ls -la Android/app/src/main/assets/clip-vit-b-32.onnx   # expect ~335 MB
```

**c) Bundled sample views** — 48 golden + 48 missing per platform:

```bash
ls iOS/GroceryApp/Copilot/Resources/ShelfAssets/*_golden.png | wc -l          # 48
ls iOS/GroceryApp/Copilot/Resources/ShelfAssets/*_actual_missing.png | wc -l  # 48
ls Android/app/src/main/assets/shelf_samples/*.png | wc -l                    # 96
```

**d) Device.** iOS CLIP is expected to need a **physical device** (Priya: "DOES NOT WORK ON
SIMULATOR"). Ours falls back to CPU-only, so the Simulator *may* work but slowly — treat a
Simulator pass as inconclusive and a device pass as authoritative.

```bash
xcrun xctrace list devices | grep -v Simulator   # iPhone should appear
adb devices                                      # Android device should appear
```

---

## 1. Build & install

```bash
cd Android && ./gradlew installDebug
```

For iOS, open `iOS/GroceryApp.xcodeproj` in Xcode, pick your iPhone, and Run (device builds need
your signing identity, so the CLI route needs `DEVELOPMENT_TEAM` set).

Live logs:

```bash
adb logcat -s ClipImageEmbedder:V PlanogramSearch:V
```

iOS logs print with `[Planogram]` / `[ImageEmbedder]` prefixes — watch Xcode's console.

---

## 2. Grid reference — expected cell counts

The shelf map shows **one column per product**, each column stacking `rows` cells. Every shelf is
`cropTop = 0.2` (trims the header sign) and 3 rows.

| Grid | Cells | Shelves |
| --- | --- | --- |
| 3×3 | 9 | P3, C3, C4 |
| 3×4 | 12 | R1, R2, D4, M1, SH1, B4, P1, P2, A1, A2 |
| 3×5 | 15 | K1, D1, D2, D3, N1, N2, B1, B2, B3, A3, A4 |

Totals: 24 shelves, **312 cells** — matches the dataset's cell-doc count exactly.

> **Note on Priya's screenshots.** Her shared screenshots show a shelf map of *5 cells* for B3
> (a 3×5 shelf). Those values (0.03/0.02/0.03/0.07/0.22) are the per-product **medians**, not
> cells. Our map shows all 15 actual cells (5 columns × 3), which is strictly more detail and
> matches her committed `cellGrid` code. Ours is not wrong for showing more.

---

## 3. Core test matrix

Run for **both stores** (NYC and AA — they use `nyc_` / `aa_` asset prefixes) on **both platforms**.

### T1 — Organized shelf (the happy path)

1. Pick a shelf from the dropdown.
2. Tap **Check Organized Shelf** → preview appears with column guides drawn over it.
3. Tap **Audit shelf**.

**Expect:** every cell green · every product *"correctly stocked"* · all medians well under 0.12
(Priya's B3 golden run: 0.010–0.023) · summary reads *"All N products in compliance"*.

**Any red or orange here is a real failure** — see §5.

### T2 — Disorganized shelf (the money shot)

Same, but **Check Disorganized Shelf**.

**Expect:** at least one product flagged · that product's column shows red/orange cells with
distances above threshold · summary reads *"N of M products flagged"*.

Reference (Priya's Aisle 7 / B3, `actual_missing`): `Imported Coffee` median **0.224** →
*"empty / missing — restock"*; the other four pass at 0.024–0.074. Exact digits will differ
slightly, but the **verdict and rough magnitude should match**.

### T3 — Coverage sweep

Spot-check at least one shelf of each grid size, and confirm cell count matches §2:

- 3×3 → **C3** (9 cells)
- 3×4 → **A2** (12 cells) ← the only shelf tested before this dataset
- 3×5 → **B3** (15 cells) ← matches Priya's screenshots

Then run all 24 if you have patience — every shelf now has data, so any shelf that errors is a
genuine gap.

### T4 — Step 1 → Step 2 hand-off

1. Go to **Find**, search a product (e.g. `high protein shake`).
2. Tap the **location line** on a result card.
3. Lands on Planogram with **that** aisle/shelf preselected, showing
   *"Carried over from the product you looked up in Find."*

### T5 — Store switch

Log out, switch store, log back in. Samples must still resolve (prefix flips `nyc_` ⇄ `aa_`) and
the dropdown must still show 24.

### T6 — Model-not-ready guard (Android)

Cold-start the app and tap **Audit shelf** immediately. Expect
*"CLIP model not ready yet (…) — wait a moment and try again."*
**Must not** report the shelf as empty. This is the guard that stops a model-loading race from
masquerading as a genuine audit result.

---

## 4. What to record for Priya

She asked for a screen recording. Most convincing sequence:

1. Dropdown open, showing all 24 shelves.
2. B3 → **Check Organized Shelf** → Audit → all green.
3. B3 → **Check Disorganized Shelf** → Audit → `Imported Coffee` flagged.
4. Scroll to **Behind the scenes** (model, tiling, cell count, timing).
5. Repeat step 3 in **airplane mode** — the audit still runs; only the S3 golden thumbnail is
   blank. That is the whole edge-vector claim in one shot.

---

## 5. Symptom → cause

| Symptom | Likely cause |
| --- | --- |
| *"No planogram documents in this store yet"* | `planograms` not synced / not in App Services config |
| Dropdown shows 336 entries | `docType = "Planogram"` filter regressed |
| *"No planogram grid for shelf X"* | `Planogram` doc synced but `grid` absent, or its `PlanogramCell` docs missing |
| **Golden shelf comes back flagged** | Embeddings still `placeholder: true`; or wrong CLIP variant (must be ViT-B/32, 512-d); or `cropTop`/grid mismatch between data and tiling |
| Every cell red on every shelf | Model loaded but producing garbage — check preprocessing (CHW, RGB, 224×224) |
| *"Audit failed: … modelMissing"* (iOS) | `ClipImageEncoder.mlmodelc` not in the app bundle |
| *"CLIP model not ready"* (Android) | Still loading — or `clip-vit-b-32.onnx` absent from assets |
| *"Sample view … is not in the app bundle"* | PNG missing from target/assets (all 24×2 should be present) |
| Audit takes seconds, not ~100 ms | CPU-only fallback — check the console for the `.all failed` warning |
| Golden reference thumbnail blank | S3/network only. **Does not affect the audit** (it embeds the bundled view) |

---

## 6. Known gaps — not bugs

- **Short-facings variant is excluded.** Priya: *"Lets ONLY do MISSING images. The other variant
  showfacings is a hit or miss"* (~80% match). The images exist but are deliberately not bundled.
- **Photo capture is hidden.** The audit compares against golden imagery shot from one fixed
  angle, so an arbitrary phone photo will not line up. `normalizedUp()` (EXIF orientation) is in
  place for when a capture path returns, but is untestable through the UI today.
- **Fix & Organize / Flag Resolved buttons hidden** pending the P2P task flow (Priya's item 8).
- **Golden and per-store images are identical** for many shelves — the dataset is contrived by
  design.
