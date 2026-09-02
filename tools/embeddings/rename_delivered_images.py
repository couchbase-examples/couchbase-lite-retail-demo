#!/usr/bin/env python3
"""Rename Anisha's delivered images to the filenames the dataset already expects.

The dataset is the authority on naming, not us:

  * products   -> `<productId>.png` at the bucket root, from `inventory.imageURL`
  * planograms -> `planograms/<store>_<shelf>_golden.png`, from `planograms.goldenImageURL`

so this script reads those URLs out of the JSON rather than hardcoding a convention.
Non-compliant shelf captures have no dataset URL — they are what the associate photographs
at runtime — so they get an `_actual_<reason>` suffix alongside the golden they contradict.

The delivered files arrive as `Gemini_Generated_Image_<hash> (N).png`, which carries no product
information at all. The mapping below was made by looking at every image and matching it against
the dataset's own `attributes.color`, `brand` and `useCase` fields, then cross-checking the three
golden shelf photos against `expectedLayout` — a shelf photo that shows blue/black/white in that
order confirms A1-L=20001, A1-C=20015, A1-R=20005 independently of the product shots.

Copies rather than moves, so the originals stay untouched and this can be re-run.

Usage:
    python rename_delivered_images.py                 # dry run, prints the plan
    python rename_delivered_images.py --write         # writes into ./s3-upload/
"""

import argparse
import glob
import json
import os
import shutil
import sys

SRC = "/Users/pulkit.midha/Downloads/vector mobile demo images"
DATASET = "/Users/pulkit.midha/Downloads/demo-dataset-extended -vector"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "s3-upload")

# Delivered-file index (1-based, sorted by filename) -> productId.
#
# Ambiguous pairs, resolved on shape because the dataset gives both the same colour:
#   23 vs 29 (both AeroFit grey)  -> 23 has the chunky cushioned midsole = CloudStep Cushion,
#                                    29 is the flatter knit  = BreezeKnit Slip-On
#   04 vs 25 (both white)         -> 04 is the athletic court trainer  = ProCourt Tennis,
#                                    25 is the minimal leather low-top = UrbanWalk Classic
#   01 vs 07 (both StrideLab blue)-> 01 is the structured everyday runner = AeroStride Runner,
#                                    07 is the flat lightweight racer     = FeatherLite Racer
# The A1 golden shelf photo shows the structured blue shoe at A1-L, which is 20001, so 01/07
# is corroborated rather than guessed.
PRODUCTS = {
    1: 20001,   # AeroStride Runner        blue      running
    7: 20016,   # FeatherLite Racer        blue      running
    12: 20002,  # Trailblaze GTX           olive     trail running
    23: 20003,  # CloudStep Cushion        grey      road running
    31: 20004,  # SwiftRace Elite          red       racing
    25: 20005,  # UrbanWalk Classic        white     casual
    26: 20006,  # FlexMove Trainer         black     cross-training
    27: 20007,  # TinyTrek Kids            teal      running
    28: 20008,  # HydroGuard Waterproof    navy      walking
    29: 20009,  # BreezeKnit Slip-On       grey      casual
    30: 20010,  # TrailGrip Hiker          brown     hiking
    2: 20011,   # StudioFlow Yoga          purple    studio
    3: 20012,   # MetroDash Commuter       charcoal  commuter
    4: 20013,   # ProCourt Tennis          white     tennis
    5: 20014,   # RecoverEase Slide        black     recovery
    6: 20015,   # WinterWarm Boot          black     winter
    8: 20017,   # AllDay Comfort Walker    beige     walking
    9: 20018,   # KidSport Active          orange    sport
    10: 21001,  # Chocolate Recovery Shake     GreenLeaf   (brand legible on label)
    11: 21002,  # Vanilla Whey Protein Shake   PrimeChoice
    13: 21003,  # Citrus Electrolyte Hydration BluePeak
    14: 21004,  # Berry Plant Protein Smoothie GreenLeaf
    15: 21005,  # Citrus Energy Gel            Acme
    16: 21006,  # Greek Yogurt Protein Drink   FarmFresh
}

# Delivered-file index -> (shelf, "golden" | "actual", reason-or-None).
# Golden assignment is decided by expectedLayout, not by preference:
#   A1 expects 20001 blue / 20015 black / 20005 white  -> 17 shows exactly that; 22 swaps L and C
#   A2 expects 20002 olive / 20010 brown / 20014 black -> 18 shows all three at full facings;
#                                                          24 is missing facings
#   C3 expects 21001 choc / 21002 vanilla / 21003 citrus -> 19 is full and in order;
#                                                          20 has short facings, 21 has an empty L
SHELVES = {
    17: ("A1", "golden", None),
    22: ("A1", "actual", "misplaced"),      # WinterWarm Boot sitting in the AeroStride slot
    18: ("A2", "golden", None),
    24: ("A2", "actual", "understocked"),
    19: ("C3", "golden", None),
    20: ("C3", "actual", "shortfacings"),
    21: ("C3", "actual", "outofstock"),     # chocolate shake completely out
}


def dataset_expectations():
    """Pull the filenames the dataset actually asks for, so we cannot drift from it."""
    product_names, golden_names = {}, {}
    for store in ("nyc", "aa"):
        inv = json.load(open(os.path.join(DATASET, f"{store}_store_inventory.json")))
        for item in inv if isinstance(inv, list) else inv.get("docs", inv):
            pid = item.get("productId")
            if pid and pid >= 20000 and item.get("imageURL"):
                product_names[pid] = os.path.basename(item["imageURL"])
        pgs = json.load(open(os.path.join(DATASET, f"{store}_store_planograms.json")))
        for pg in pgs if isinstance(pgs, list) else pgs.get("docs", pgs):
            golden_names[(store, pg["shelf"])] = os.path.basename(pg["goldenImageURL"])
    return product_names, golden_names


def build_plan():
    files = sorted(glob.glob(os.path.join(SRC, "*.png")))
    if not files:
        sys.exit(f"no PNGs under {SRC}")
    product_names, golden_names = dataset_expectations()

    plan = []  # (source_path, relative_destination, note)
    for idx, pid in sorted(PRODUCTS.items(), key=lambda kv: kv[1]):
        expected = product_names.get(pid)
        if not expected:
            sys.exit(f"dataset has no imageURL for productId {pid}")
        plan.append((files[idx - 1], expected, f"product {pid}"))

    for idx, (shelf, kind, reason) in sorted(SHELVES.items()):
        if kind == "golden":
            # Both stores reference the same shelf layout byte-for-byte, so one photo is
            # copied to each store's expected filename rather than shot twice.
            for store in ("nyc", "aa"):
                name = golden_names.get((store, shelf))
                if not name:
                    sys.exit(f"dataset has no goldenImageURL for {store} {shelf}")
                plan.append((files[idx - 1], f"planograms/{name}", f"{shelf} golden ({store})"))
        else:
            for store in ("nyc", "aa"):
                plan.append((files[idx - 1],
                             f"planograms/{store}_{shelf}_actual_{reason}.png",
                             f"{shelf} non-compliant: {reason} ({store})"))
    return plan


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true", help="actually copy the files")
    ap.add_argument("--max-px", type=int, default=1024, metavar="N",
                    help="downscale the long edge to N px (default 1024; 0 keeps 2048 originals). "
                         "The delivered files are 2048x2048 at ~5MB each, against ~780KB for the "
                         "existing catalogue images. Every device downloads these on first sync, "
                         "and CLIP resizes to 224x224 before embedding, so full resolution is "
                         "transfer cost with no quality benefit.")
    args = ap.parse_args()

    plan = build_plan()
    covered = set(PRODUCTS) | set(SHELVES)
    total = len(glob.glob(os.path.join(SRC, "*.png")))
    unused = sorted(set(range(1, total + 1)) - covered)

    for src, dest, note in plan:
        print(f"{os.path.basename(src):50s} -> {dest:44s} {note}")
    print(f"\n{len(plan)} files to write, from {len(covered)} delivered images")
    if unused:
        print(f"NOT MAPPED (delivered but unused): {unused}")

    if not args.write:
        print("\ndry run — pass --write to copy into", OUT)
        return

    resize = args.max_px > 0
    if resize:
        try:
            from PIL import Image
        except ImportError:
            sys.exit("--max-px needs pillow (pip install pillow), or pass --max-px 0")

    for src, dest, _ in plan:
        target = os.path.join(OUT, dest)
        os.makedirs(os.path.dirname(target), exist_ok=True)
        if resize:
            im = Image.open(src)
            if max(im.size) > args.max_px:
                im.thumbnail((args.max_px, args.max_px), Image.LANCZOS)
            im.save(target, "PNG", optimize=True)
        else:
            shutil.copy2(src, target)

    written = sum(os.path.getsize(os.path.join(dp, f))
                  for dp, _, fs in os.walk(OUT) for f in fs)
    print(f"\nwrote {OUT}  ({written / 1e6:.0f} MB total"
          + (f", long edge capped at {args.max_px}px)" if resize else ", originals)"))
    print("upload with:")
    print(f"  aws s3 sync {OUT}/ s3://cbm-retaildemo-dataset/ --acl public-read")


if __name__ == "__main__":
    main()
