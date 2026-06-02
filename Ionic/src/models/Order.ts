/**
 * Replenishment order. Same schema as the seeded Capella docs and the
 * Android / Java / iOS ports — no `itemName` field; UI shows
 * "Order #<orderId>" and (optionally) joins on `productId`.
 */
export type OrderStatus = 'Submitted' | 'In Review' | 'Approved' | 'Rejected';

export interface Order {
  id: string;
  docType: 'Order';
  orderId: number;
  storeId: string;
  orderDate: number;          // epoch millis
  orderStatus: OrderStatus;
  productId?: number;
  sku?: string;
  unit?: string;
  orderQty: number;
}

export function orderFromDoc(id: string, doc: Record<string, unknown>): Order {
  return {
    id,
    docType: 'Order',
    orderId: (doc.orderId as number) ?? 0,
    storeId: (doc.storeId as string) ?? '',
    orderDate: (doc.orderDate as number) ?? 0,
    orderStatus: ((doc.orderStatus as string) ?? 'Submitted') as OrderStatus,
    productId: doc.productId as number | undefined,
    sku: doc.sku as string | undefined,
    unit: doc.unit as string | undefined,
    orderQty: (doc.orderQty as number) ?? 0,
  };
}

/** NanoID-style 21-char id, URL-safe alphabet. Matches the Android port. */
export function nanoId(): string {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-';
  let out = '';
  for (let i = 0; i < 21; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
