"""Generate placeholder product and shelf imagery for the Step 2 visual shelf audit.

Why this exists: the dataset references product images for the new Footwear and sports-
nutrition SKUs (`.../20001.png`, `.../21001.png`) and golden planogram photos
(`.../planograms/nyc_A1_golden.png`), and none of them exist — every one of those URLs
returns 403. Step 2 is entirely gated on imagery, so this renders a self-consistent set so
the pipeline can be built, tested and demoed now.

These are placeholders, not photographs, and the audit results carry that caveat. When real
shelf photos arrive, only the inputs change: embed_images.py and the on-device crop matching
work identically.

Each product render is driven by the document's own attributes (colour, category, name) so
products are visually distinguishable in the way CLIP actually keys on — dominant colour,
silhouette, and the text printed on the label, which CLIP reads.

Produces, per store:
  products/<productId>.png     one per Footwear / sports-nutrition SKU
  planograms/<store>_<shelf>_golden.png   expected layout, correct positions and facings
  planograms/<store>_<shelf>_messy.png    one product pushed to the back behind another
"""

import json
import os
import sys
from PIL import Image, ImageDraw, ImageFont

if len(sys.argv) < 2:
    sys.exit(f"usage: {os.path.basename(__file__)} <dataset-dir> [output-dir]")
DATASET = sys.argv[1]
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "generated-assets")

PRODUCT_SIZE = 512
SHELF_W, SHELF_H = 1280, 640

COLORS = {
    "blue": (44, 98, 214), "olive": (98, 110, 52), "red": (198, 46, 46),
    "white": (238, 238, 238), "teal": (32, 148, 148), "navy": (26, 44, 92),
    "black": (38, 38, 40), "brown": (110, 74, 44), "charcoal": (70, 74, 80),
    "orange": (226, 120, 30), "grey": (140, 144, 150), "gray": (140, 144, 150),
    "pink": (222, 106, 148), "green": (52, 140, 72), "yellow": (226, 190, 40),
    "purple": (120, 78, 168), "tan": (198, 168, 128), "silver": (186, 190, 196),
}
FLAVOR_COLORS = {
    "chocolate": (92, 58, 40), "vanilla": (238, 224, 186),
    "citrus": (238, 176, 42), "berry": (176, 46, 96), "mixed berry": (176, 46, 96),
}


def font(size, bold=False):
    for path in ("/System/Library/Fonts/Supplemental/HelveticaNeue.ttc",
                 "/System/Library/Fonts/Helvetica.ttc",
                 "/Library/Fonts/Arial.ttf"):
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size, index=1 if bold else 0)
            except Exception:
                pass
    return ImageFont.load_default(size)


def product_color(doc):
    attrs = doc.get("attributes", {})
    if attrs.get("color") in COLORS:
        return COLORS[attrs["color"]]
    flavor = (attrs.get("flavor") or "").lower()
    if flavor in FLAVOR_COLORS:
        return FLAVOR_COLORS[flavor]
    return (120, 126, 134)


def wrap(draw, text, f, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if draw.textlength(trial, font=f) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def draw_shoe(draw, box, color):
    """A shoe silhouette: sole plus upper, distinct enough to read as footwear."""
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    sole_top = y0 + int(h * 0.66)
    # upper
    draw.polygon([
        (x0 + int(w * 0.10), sole_top),
        (x0 + int(w * 0.20), y0 + int(h * 0.34)),
        (x0 + int(w * 0.46), y0 + int(h * 0.22)),
        (x0 + int(w * 0.62), y0 + int(h * 0.30)),
        (x0 + int(w * 0.88), y0 + int(h * 0.50)),
        (x0 + int(w * 0.94), sole_top),
    ], fill=color)
    # midsole
    draw.rounded_rectangle([x0 + int(w * 0.06), sole_top,
                            x0 + int(w * 0.96), sole_top + int(h * 0.16)],
                           radius=int(h * 0.07), fill=(246, 246, 248))
    # outsole
    draw.rounded_rectangle([x0 + int(w * 0.06), sole_top + int(h * 0.13),
                            x0 + int(w * 0.96), sole_top + int(h * 0.24)],
                           radius=int(h * 0.05), fill=(58, 58, 62))
    # laces
    for i in range(3):
        ly = y0 + int(h * (0.34 + i * 0.08))
        draw.line([(x0 + int(w * 0.30), ly), (x0 + int(w * 0.52), ly - int(h * 0.03))],
                  fill=(250, 250, 250), width=max(2, h // 90))


def draw_bottle(draw, box, color):
    """A bottle silhouette for the shake / hydration SKUs."""
    x0, y0, x1, y1 = box
    w, h = x1 - x0, y1 - y0
    neck_w = int(w * 0.26)
    cx = x0 + w // 2
    draw.rounded_rectangle([cx - neck_w // 2, y0 + int(h * 0.04),
                            cx + neck_w // 2, y0 + int(h * 0.18)],
                           radius=int(w * 0.04), fill=(72, 76, 82))
    draw.rounded_rectangle([x0 + int(w * 0.22), y0 + int(h * 0.16),
                            x0 + int(w * 0.78), y1 - int(h * 0.04)],
                           radius=int(w * 0.12), fill=color)
    # label band, which is where CLIP picks up the printed text
    draw.rectangle([x0 + int(w * 0.22), y0 + int(h * 0.42),
                    x0 + int(w * 0.78), y0 + int(h * 0.72)], fill=(250, 250, 250))


def render_product(doc, path):
    img = Image.new("RGB", (PRODUCT_SIZE, PRODUCT_SIZE), (252, 250, 246))
    draw = ImageDraw.Draw(img)
    color = product_color(doc)
    is_shoe = doc.get("category") == "Footwear"

    box = (int(PRODUCT_SIZE * 0.08), int(PRODUCT_SIZE * 0.14),
           int(PRODUCT_SIZE * 0.92), int(PRODUCT_SIZE * 0.70))
    if is_shoe:
        draw_shoe(draw, box, color)
    else:
        draw_bottle(draw, box, color)

    name_f, brand_f = font(34, bold=True), font(26)
    y = int(PRODUCT_SIZE * 0.74)
    for line in wrap(draw, doc["name"], name_f, PRODUCT_SIZE - 48)[:2]:
        draw.text((24, y), line, font=name_f, fill=(28, 28, 32))
        y += 38
    draw.text((24, y + 4), doc.get("brand", ""), font=brand_f, fill=(120, 122, 128))

    attrs = doc.get("attributes", {})
    tag = attrs.get("useCase") or attrs.get("flavor") or doc.get("category", "")
    if tag:
        draw.text((24, y + 38), tag.upper(), font=font(22, bold=True), fill=color)

    img.save(path)


def paste_facing(shelf, product_img, cx, baseline, width):
    """Place one facing of a product, centred on `cx` and standing on `baseline`.

    Sized by *width* rather than height so a facing always fits inside its slot — a facing
    that bleeds into the neighbouring slot would corrupt that position's crop and make the
    audit blame the wrong product.
    """
    height = int(product_img.height * (width / product_img.width))
    item = product_img.resize((width, height), Image.LANCZOS)
    shelf.paste(item, (cx - width // 2, baseline - height))


def render_shelf(planogram, products, path, messy=False):
    shelf = Image.new("RGB", (SHELF_W, SHELF_H), (228, 224, 214))
    draw = ImageDraw.Draw(shelf)
    # backboard and shelf lip, so the crops have consistent context
    draw.rectangle([0, 0, SHELF_W, int(SHELF_H * 0.86)], fill=(238, 234, 226))
    draw.rectangle([0, int(SHELF_H * 0.86), SHELF_W, SHELF_H], fill=(176, 168, 152))

    layout = planogram["expectedLayout"]
    slot_w = SHELF_W // max(1, len(layout))
    baseline = int(SHELF_H * 0.86)
    # Facings sit within the middle ~60% of the slot so each position's crop is dominated
    # by its own product.
    item_w = int(slot_w * 0.46)

    for slot, entry in enumerate(layout):
        doc = products.get(entry["productId"])
        if doc is None:
            continue
        img = Image.open(doc["_imagePath"]).convert("RGB")
        cx = slot * slot_w + slot_w // 2
        spread = min(entry.get("facings", 1), 3)
        step = int(item_w * 0.28)

        # The messy shelf reproduces the narrative's failure at exactly one position: the
        # product that belongs at the leftmost slot has been pushed to the back, and its
        # neighbour has spread forward into the empty facing. Painting the expected product
        # first and the interloper over it is what makes it read as "hidden behind".
        if messy and slot == 0 and len(layout) >= 2:
            paste_facing(shelf, img, cx - int(item_w * 0.30), baseline,
                         int(item_w * 0.62))          # expected, small and behind
            neighbour = products.get(layout[1]["productId"])
            if neighbour:
                intruder = Image.open(neighbour["_imagePath"]).convert("RGB")
                for f in range(2):
                    paste_facing(shelf, intruder, cx + int(item_w * 0.12) + f * step,
                                 baseline - f * 5, item_w)
        elif messy and slot == 1 and len(layout) >= 2:
            # It spread from here, so this position is short a facing.
            for f in range(max(1, spread - 1)):
                offset = int((f - (max(1, spread - 1) - 1) / 2) * step)
                paste_facing(shelf, img, cx + offset, baseline - f * 5, item_w)
        else:
            for f in range(spread):
                offset = int((f - (spread - 1) / 2) * step)
                paste_facing(shelf, img, cx + offset, baseline - f * 5, item_w)

        draw.text((slot * slot_w + 12, baseline + 12), entry["position"],
                  font=font(26, bold=True), fill=(250, 248, 244))

    title = f"{planogram['section']} — aisle {planogram['aisle']} shelf {planogram['shelf']}"
    draw.text((12, 10), title + ("  [MESSY]" if messy else "  [GOLDEN]"),
              font=font(24, bold=True), fill=(90, 88, 92))
    shelf.save(path)


def main():
    os.makedirs(os.path.join(OUT, "products"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "planograms"), exist_ok=True)

    for store, prefix in (("nyc", "nyc_store"), ("aa", "aa_store")):
        inv_path = os.path.join(DATASET, f"{prefix}_inventory.json")
        plan_path = os.path.join(DATASET, f"{prefix}_planograms.json")
        if not (os.path.exists(inv_path) and os.path.exists(plan_path)):
            print(f"skipping {store}: dataset files not found")
            continue

        inventory = json.load(open(inv_path))
        products = {}
        for doc in inventory:
            pid = doc.get("productId", 0)
            # Only the new SKUs need renders; the original grocery images exist in S3.
            if pid < 20000:
                continue
            path = os.path.join(OUT, "products", f"{pid}.png")
            if store == "nyc" or not os.path.exists(path):
                render_product(doc, path)
            doc["_imagePath"] = path
            products[pid] = doc
        print(f"{store}: rendered {len(products)} product images")

        for planogram in json.load(open(plan_path)):
            shelf = planogram["shelf"]
            for messy in (False, True):
                kind = "messy" if messy else "golden"
                path = os.path.join(OUT, "planograms", f"{store}_{shelf}_{kind}.png")
                render_shelf(planogram, products, path, messy=messy)
            print(f"  {store} shelf {shelf}: golden + messy")

    print(f"\nwrote {OUT}")


if __name__ == "__main__":
    main()
