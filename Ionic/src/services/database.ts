import {
  CapacitorEngine,
  Collection,
  Database,
  DatabaseConfiguration,
  MutableDocument,
} from 'cbl-ionic';
// Note on the cbl-ionic API:
//   - `MutableDocument.fromDocument(doc)` is how you turn a Document into a
//     MutableDocument (no `doc.toMutable()` method).
//   - Numeric setters are `setNumber` / `setInt` / `setDouble`.
//   - `mutableDoc.remove(key)` strips a field.
import {
  AppConfig,
  COLLECTION_INVENTORY,
  COLLECTION_ORDERS,
  COLLECTION_PROFILE,
  LOCAL_DB_NAME,
} from '../models/AppConfig';
import { GroceryItem, groceryItemFromDoc } from '../models/GroceryItem';
import { Order, nanoId, orderFromDoc } from '../models/Order';
import { StoreProfile, storeProfileFromDoc } from '../models/StoreProfile';

/**
 * Owns the local CBL database, per-store scope, and the three domain
 * collections (inventory / orders / profile).
 *
 * Mirrors the Java DatabaseManager — same scope/collection names, same
 * stockQty fallback rules, same NanoID-based order-doc id pattern.
 */
export class DatabaseService {
  private static engineInitialized = false;

  private database?: Database;
  private inventory?: Collection;
  private orders?: Collection;
  private profile?: Collection;
  private config?: AppConfig;

  private inventoryListeners: ((ids: string[]) => void)[] = [];
  private orderListeners: ((ids: string[]) => void)[] = [];
  private profileListeners: ((ids: string[]) => void)[] = [];

  private inventoryListenerToken?: string;
  private ordersListenerToken?: string;
  private profileListenerToken?: string;

  /**
   * Lazy one-time `new CapacitorEngine()`. The plugin requires this to run
   * once before any Database operation — calling it from multiple places is
   * harmless, but creating multiple engines isn't.
   */
  static initEngine(): void {
    if (this.engineInitialized) return;
    new CapacitorEngine();
    this.engineInitialized = true;
  }

  async openFor(config: AppConfig): Promise<void> {
    DatabaseService.initEngine();
    await this.close();

    this.config = config;
    // The native plugin (iOS + Android) rejects `database_Open` if `config`
    // is null/missing, so we MUST pass an explicit DatabaseConfiguration
    // even when we don't need to customize anything.
    this.database = new Database(LOCAL_DB_NAME, new DatabaseConfiguration());
    await this.database.open();

    this.inventory = await this.ensureCollection(COLLECTION_INVENTORY, config.scope);
    this.orders    = await this.ensureCollection(COLLECTION_ORDERS, config.scope);
    this.profile   = await this.ensureCollection(COLLECTION_PROFILE, config.scope);

    // Collection change listeners — CBL fires these on any local save and on
    // every replicator pull, with the list of changed document IDs.
    this.inventoryListenerToken = await this.inventory.addChangeListener(change =>
      this.fire(this.inventoryListeners, change.documentIDs),
    );
    this.ordersListenerToken = await this.orders.addChangeListener(change =>
      this.fire(this.orderListeners, change.documentIDs),
    );
    this.profileListenerToken = await this.profile.addChangeListener(change =>
      this.fire(this.profileListeners, change.documentIDs),
    );
  }

  private async ensureCollection(name: string, scope: string): Promise<Collection> {
    // We can't probe-then-create here: the native plugin (Swift + Kotlin)
    // *rejects* `collection_GetCollection` with
    //   "Unable to get collection in scope X for database Y"
    // when the collection doesn't exist yet, instead of resolving to null.
    // That breaks the `await db.collection()` ?? fallback pattern — the
    // promise rejects before we ever reach createCollection.
    //
    // `createCollection` is idempotent in Couchbase Lite (returns the
    // existing collection if one is already there), so it's safe to call
    // unconditionally on every open.
    return await this.database!.createCollection(name, scope);
  }

  async close(): Promise<void> {
    try {
      if (this.inventory && this.inventoryListenerToken)
        await this.inventory.removeChangeListener(this.inventoryListenerToken);
      if (this.orders && this.ordersListenerToken)
        await this.orders.removeChangeListener(this.ordersListenerToken);
      if (this.profile && this.profileListenerToken)
        await this.profile.removeChangeListener(this.profileListenerToken);
    } catch {
      /* listeners may already be gone */
    }
    if (this.database) {
      try { await this.database.close(); } catch { /* ignore */ }
    }
    this.database = undefined;
    this.inventory = this.orders = this.profile = undefined;
    this.inventoryListenerToken = this.ordersListenerToken = this.profileListenerToken = undefined;
  }

  getConfig(): AppConfig | undefined { return this.config; }
  getInventoryCollection(): Collection | undefined { return this.inventory; }
  getOrdersCollection(): Collection | undefined { return this.orders; }
  getProfileCollection(): Collection | undefined { return this.profile; }

  // -- Inventory ----------------------------------------------------------

  async getAllInventory(): Promise<GroceryItem[]> {
    if (!this.database || !this.inventory) return [];
    const scope = this.inventory.scope.name;
    const sql = `SELECT META().id AS _id, * FROM \`${scope}\`.\`${COLLECTION_INVENTORY}\``;
    const query = this.database.createQuery(sql);
    const result = await query.execute();
    const items: GroceryItem[] = [];
    for (const row of result) {
      const id = row._id as string;
      const body = row[COLLECTION_INVENTORY] as Record<string, unknown> | undefined;
      if (!id || !body) continue;
      items.push(groceryItemFromDoc(id, body));
    }
    items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }

  async searchInventory(text: string): Promise<GroceryItem[]> {
    const all = await this.getAllInventory();
    if (!text.trim()) return all;
    const needle = text.toLowerCase();
    return all.filter(i => (i.name ?? '').toLowerCase().includes(needle));
  }

  async getInventoryItem(id: string): Promise<GroceryItem | null> {
    if (!this.inventory) return null;
    const doc = await this.inventory.getDocument(id);
    if (!doc) return null;
    return groceryItemFromDoc(id, doc.toDictionary());
  }

  async updateQuantity(itemId: string, newQuantity: number): Promise<void> {
    if (!this.inventory) return;
    const existing = await this.inventory.getDocument(itemId);
    if (!existing) return;
    const mutable = MutableDocument.fromDocument(existing);
    mutable.setNumber('stockQty', newQuantity);
    // Strip the CRDT `quantity` dict if present — matches the Android port's
    // conflict-avoidance behavior with the web/iOS clients.
    const body = mutable.toDictionary();
    if (body && typeof body.quantity === 'object' && body.quantity !== null) {
      mutable.remove('quantity');
    }
    await this.inventory.save(mutable);
  }

  // -- Orders -------------------------------------------------------------

  async getAllOrders(): Promise<Order[]> {
    if (!this.database || !this.orders) return [];
    const scope = this.orders.scope.name;
    const sql = `SELECT META().id AS _id, * FROM \`${scope}\`.\`${COLLECTION_ORDERS}\``;
    const query = this.database.createQuery(sql);
    const result = await query.execute();
    const orders: Order[] = [];
    for (const row of result) {
      const id = row._id as string;
      const body = row[COLLECTION_ORDERS] as Record<string, unknown> | undefined;
      if (!id || !body) continue;
      orders.push(orderFromDoc(id, body));
    }
    orders.sort((a, b) => b.orderDate - a.orderDate);
    return orders;
  }

  async createOrder(item: GroceryItem, qty: number): Promise<void> {
    if (!this.orders || !this.config) return;
    const storeId = `${this.config.store.toLowerCase()}-store-01`;
    const docId = `order-${storeId}-${nanoId()}`;

    const existing = await this.getAllOrders();
    const nextOrderId = existing.reduce((m, o) => Math.max(m, o.orderId), 0) + 1;

    const doc = new MutableDocument();
    doc.setId(docId);
    doc.setString('docType', 'Order');
    doc.setNumber('orderId', nextOrderId);
    doc.setString('storeId', storeId);
    doc.setNumber('orderDate', Date.now());
    doc.setString('orderStatus', 'In Review');
    doc.setNumber('orderQty', qty);
    if (item.productId !== undefined) doc.setNumber('productId', item.productId);
    if (item.sku) doc.setString('sku', item.sku);
    if (item.unit) doc.setString('unit', item.unit);
    await this.orders.save(doc);
  }

  // -- Profile ------------------------------------------------------------

  async getProfile(): Promise<StoreProfile | null> {
    if (!this.database || !this.profile) return null;
    const scope = this.profile.scope.name;
    const sql = `SELECT META().id AS _id, * FROM \`${scope}\`.\`${COLLECTION_PROFILE}\` LIMIT 1`;
    const query = this.database.createQuery(sql);
    const result = await query.execute();
    if (!result.length) return null;
    const row = result[0];
    const id = row._id as string;
    const body = row[COLLECTION_PROFILE] as Record<string, unknown> | undefined;
    if (!id || !body) return null;
    return storeProfileFromDoc(id, body);
  }

  // -- Listeners ----------------------------------------------------------

  onInventoryChanged(cb: (ids: string[]) => void): () => void {
    this.inventoryListeners.push(cb);
    return () => { this.inventoryListeners = this.inventoryListeners.filter(c => c !== cb); };
  }

  onOrdersChanged(cb: (ids: string[]) => void): () => void {
    this.orderListeners.push(cb);
    return () => { this.orderListeners = this.orderListeners.filter(c => c !== cb); };
  }

  onProfileChanged(cb: (ids: string[]) => void): () => void {
    this.profileListeners.push(cb);
    return () => { this.profileListeners = this.profileListeners.filter(c => c !== cb); };
  }

  private fire(listeners: ((ids: string[]) => void)[], ids: string[]): void {
    for (const cb of listeners) {
      try { cb(ids); } catch (e) { console.warn('[DatabaseService] listener threw', e); }
    }
  }
}
