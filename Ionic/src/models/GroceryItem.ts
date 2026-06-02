/**
 * Inventory item — field names match the seeded Capella documents (and the
 * Java / Android / iOS ports). Specifically:
 *   - `stockQty` is the authoritative quantity field. A separate `quantity`
 *     dict exists on some docs for P2P CRDT sync; we treat it as fallback.
 *   - `imageURL` uses capital URL (matches the doc key, not camelCase).
 */
export interface GroceryItem {
  id: string;
  name: string;
  type?: string;
  price: number;
  imageURL?: string;
  quantity: number;
  productId?: number;
  sku?: string;
  unit?: string;
}

/** Build a GroceryItem from a raw document body returned by CBL. */
export function groceryItemFromDoc(id: string, doc: Record<string, unknown>): GroceryItem {
  const quantity = readQuantity(doc);
  return {
    id,
    name: (doc.name as string) ?? '',
    type: doc.type as string | undefined,
    price: typeof doc.price === 'number' ? doc.price : 0,
    imageURL: doc.imageURL as string | undefined,
    quantity,
    productId: typeof doc.productId === 'number' ? doc.productId : undefined,
    sku: doc.sku as string | undefined,
    unit: doc.unit as string | undefined,
  };
}

function readQuantity(doc: Record<string, unknown>): number {
  const stockQty = doc.stockQty;
  if (typeof stockQty === 'number' && stockQty > 0) return stockQty;
  const crdt = doc.quantity as { value?: number } | undefined;
  if (crdt && typeof crdt.value === 'number') return crdt.value;
  if (typeof doc.quantity === 'number') return doc.quantity;
  return 0;
}
