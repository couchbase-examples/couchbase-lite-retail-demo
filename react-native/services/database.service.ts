import {
    BasicAuthenticator,
    CblReactNativeEngine,
    Collection,
    CollectionConfiguration,
    Database,
    DatabaseConfiguration,
    FileSystem,
    FullTextIndexItem,
    IndexBuilder,
    LogDomain,
    LogLevel,
    LogSinks,
    MutableDocument,
    Replicator,
    ReplicatorActivityLevel,
    ReplicatorConfiguration,
    URLEndpoint,
    ValueIndexItem,
} from 'cbl-reactnative';
import { StoreConfig, APP_CONFIG } from '@/models/AppConfig';
import { GroceryItem } from '@/models/GroceryItem';
import { Order } from '@/models/Order';
import { StoreProfile } from '@/models/StoreProfile';
import uuid from 'react-native-uuid';

// Sync status type for UI consumption
export type SyncStatus = 'idle' | 'busy' | 'connecting' | 'offline' | 'stopped';

/**
 * Safely converts a value to a number. Returns 0 for null/undefined/NaN/non-numeric.
 */
function safeNumber(val: any): number {
    if (val === null || val === undefined) return 0;
    const n = Number(val);
    return isNaN(n) ? 0 : n;
}

/**
 * Service class for managing the Grocery Inventory database
 * and Capella App Services replication.
 */
export class DatabaseService {
    private database: Database | undefined;
    private replicator: Replicator | undefined;
    private engine: CblReactNativeEngine | undefined;
    private storeConfig: StoreConfig | undefined;
    private inventoryCollection: Collection | undefined;
    private ordersCollection: Collection | undefined;
    private profileCollection: Collection | undefined;
    private syncStatusCallback: ((status: SyncStatus) => void) | undefined;
    private replicatorListenerToken: any | undefined;

    constructor() {
        // Must create a new engine to use the SDK in a React Native environment.
        // This must only be done once for the entire app.
        this.engine = new CblReactNativeEngine();
    }

    // ─── Initialization ────────────────────────────────────────

    /**
     * Initializes the database for a specific store.
     * Opens the database, creates collections/indexes, and starts replication.
     */
    public async initializeDatabase(storeConfig: StoreConfig): Promise<void> {
        try {
            this.storeConfig = storeConfig;

            // Set up console logging
            await LogSinks.setConsole({
                level: LogLevel.DEBUG,
                domains: [LogDomain.ALL],
            });

            await this.setupDatabase();
            const path = await this.database?.getPath();
            console.debug(`[GroceryDB] Database opened at: ${path}`);

            await this.setupCollections();
            await this.setupIndexes();

            if (this.replicator === undefined) {
                await this.setupReplicator();
            }
            await this.replicator?.start(true);
            console.debug('[GroceryDB] Replicator started');
        } catch (error) {
            console.error(`[GroceryDB] Initialization error: ${error}`);
            throw error;
        }
    }

    /**
     * Closes the database and stops the replicator.
     */
    public async closeDatabase(): Promise<void> {
        try {
            // Remove replicator listener token BEFORE stopping to prevent orphaned callbacks
            if (this.replicatorListenerToken && typeof this.replicatorListenerToken.remove === 'function') {
                await this.replicatorListenerToken.remove();
                this.replicatorListenerToken = undefined;
            }
            await this.replicator?.stop();
            this.replicator = undefined;
            await this.database?.close();
            this.database = undefined;
            this.inventoryCollection = undefined;
            this.ordersCollection = undefined;
            this.profileCollection = undefined;
            console.debug('[GroceryDB] Database closed');
        } catch (error) {
            console.error(`[GroceryDB] Close error: ${error}`);
        }
    }

    // ─── Private Setup ─────────────────────────────────────────

    private async setupDatabase(): Promise<void> {
        const fileSystem = new FileSystem();
        const directoryPath = await fileSystem.getDefaultPath();

        const dc = new DatabaseConfiguration();
        dc.setDirectory(directoryPath);
        dc.setEncryptionKey('8e31f8f6-60bd-482a-9c70-69855dd02c39');

        this.database = new Database(APP_CONFIG.databaseName, dc);
        await this.database.open();
    }

    private async setupCollections(): Promise<void> {
        if (!this.database || !this.storeConfig) return;

        const scopeName = this.storeConfig.scopeName;

        // Create or get collections in the store scope
        this.inventoryCollection = await this.database.createCollection(
            APP_CONFIG.collections.inventory,
            scopeName,
        );
        this.ordersCollection = await this.database.createCollection(
            APP_CONFIG.collections.orders,
            scopeName,
        );
        this.profileCollection = await this.database.createCollection(
            APP_CONFIG.collections.profile,
            scopeName,
        );
        console.debug(`[GroceryDB] Collections ready in scope: ${scopeName}`);
    }

    private async setupIndexes(): Promise<void> {
        if (!this.inventoryCollection || !this.ordersCollection) return;

        // Inventory indexes
        const nameIndex = IndexBuilder.valueIndex(
            ValueIndexItem.property('name'),
            ValueIndexItem.property('type'),
            ValueIndexItem.property('brand'),
        );
        await this.inventoryCollection.createIndex('idxInventoryNameType', nameIndex);

        // Full-text search index on name for search functionality
        const ftsName = FullTextIndexItem.property('name');
        const ftsBrand = FullTextIndexItem.property('brand');
        const ftsIndex = IndexBuilder.fullTextIndex(ftsName, ftsBrand).setIgnoreAccents(true);
        await this.inventoryCollection.createIndex('idxInventoryFTS', ftsIndex);

        // Orders index
        const orderIndex = IndexBuilder.valueIndex(
            ValueIndexItem.property('orderDate'),
            ValueIndexItem.property('orderStatus'),
        );
        await this.ordersCollection.createIndex('idxOrderDate', orderIndex);

        console.debug('[GroceryDB] Indexes created');
    }

    private async setupReplicator(): Promise<void> {
        if (!this.storeConfig || !this.inventoryCollection || !this.ordersCollection || !this.profileCollection) {
            throw new Error('Database and collections must be initialized before replicator');
        }

        const collections = [this.inventoryCollection, this.ordersCollection, this.profileCollection];
        const targetUrl = new URLEndpoint(this.storeConfig.syncEndpoint);
        const auth = new BasicAuthenticator(this.storeConfig.username, this.storeConfig.password);

        const collectionConfigs = collections.map(col => new CollectionConfiguration(col));
        const config = new ReplicatorConfiguration(collectionConfigs, targetUrl);
        config.setAuthenticator(auth);
        config.setContinuous(APP_CONFIG.syncContinuous);
        config.setAcceptOnlySelfSignedCerts(false);

        this.replicator = await Replicator.create(config);

        // Listen for sync status changes — store token for proper cleanup
        this.replicatorListenerToken = await this.replicator.addChangeListener((change) => {
            const level = change.status.getActivityLevel();
            let status: SyncStatus = 'stopped';
            switch (level) {
                case ReplicatorActivityLevel.IDLE:
                    status = 'idle';
                    break;
                case ReplicatorActivityLevel.BUSY:
                    status = 'busy';
                    break;
                case ReplicatorActivityLevel.CONNECTING:
                    status = 'connecting';
                    break;
                case ReplicatorActivityLevel.OFFLINE:
                    status = 'offline';
                    break;
                case ReplicatorActivityLevel.STOPPED:
                    status = 'stopped';
                    break;
            }
            console.debug(`[GrocerySync] Status: ${status}`);
            this.syncStatusCallback?.(status);
        });
    }

    /**
     * Register a callback to receive sync status updates.
     */
    public onSyncStatusChange(callback: (status: SyncStatus) => void): void {
        this.syncStatusCallback = callback;
    }

    // ─── Inventory Queries ─────────────────────────────────────

    /**
     * Returns all inventory items in the current store scope.
     */
    public async getInventoryItems(): Promise<GroceryItem[]> {
        if (!this.database || !this.storeConfig) return [];
        const scope = this.storeConfig.scopeName;
        const queryStr = `SELECT META().id, * FROM \`${scope}\`.\`${APP_CONFIG.collections.inventory}\``;
        const results = await this.database.createQuery(queryStr).execute();
        return this.mapInventoryResults(results);
    }

    /**
     * Search inventory items by name, category, or brand using LIKE.
     */
    public async searchInventory(searchTerm: string): Promise<GroceryItem[]> {
        if (!this.database || !this.storeConfig) return [];
        const scope = this.storeConfig.scopeName;
        const col = APP_CONFIG.collections.inventory;
        const term = searchTerm.toLowerCase();
        const queryStr = `SELECT META().id, * FROM \`${scope}\`.\`${col}\` WHERE LOWER(name) LIKE '%${term}%' OR LOWER(type) LIKE '%${term}%' OR LOWER(brand) LIKE '%${term}%'`;
        const results = await this.database.createQuery(queryStr).execute();
        return this.mapInventoryResults(results);
    }

    /**
     * Update the stock quantity for an inventory item.
     */
    public async updateStockQuantity(documentId: string, newQuantity: number): Promise<void> {
        if (!this.inventoryCollection) return;
        const doc = await this.inventoryCollection.document(documentId);
        if (doc) {
            const mutableDoc = MutableDocument.fromDocument(doc);

            // CRITICAL: Remove the CRDT 'quantity' field before saving.
            // The Swift/Android apps use a CRDT counter in 'quantity' for P2P sync.
            // If we save it back as raw data, it corrupts the CRDT structure and
            // causes the Swift conflict resolver to reject our changes.
            // (Same approach the web app uses — see web/src/pages/Inventory.tsx)
            mutableDoc.remove('quantity');

            // Write to 'stockQty' — the canonical App Services field
            mutableDoc.setInt('stockQty', newQuantity);
            mutableDoc.setFloat('lastUpdated', Date.now());
            await this.inventoryCollection.save(mutableDoc);
            console.debug(`[GroceryDB] Updated stock for ${documentId} to ${newQuantity}`);
        }
    }

    private mapInventoryResults(results: any): GroceryItem[] {
        if (!results) return [];
        const items: GroceryItem[] = [];
        for (const row of results) {
            try {
                // The result structure from SQL++ SELECT META().id, * returns
                // the id and the collection name as key for the document fields
                const data = row[APP_CONFIG.collections.inventory] || row;
                if (!data || typeof data !== 'object') continue;
                items.push({
                    id: String(row.id || data.id || ''),
                    docType: String(data.docType || data.type || ''),
                    productId: safeNumber(data.productId),
                    sku: String(data.sku || ''),
                    name: String(data.name || ''),
                    brand: String(data.brand || ''),
                    category: String(data.type || data.category || ''),
                    price: safeNumber(data.price),
                    unit: String(data.unit || ''),
                    stockQty: safeNumber(data.stockQty ?? data.quantity),
                    location: data.location,
                    attributes: data.attributes,
                    imageURL: String(data.imageURL || data.imageUrl || ''),
                    expirationDate: data.expirationDate,
                    lastUpdated: data.lastUpdated,
                    storeId: String(data.storeId || ''),
                });
            } catch (e) {
                console.warn('[GroceryDB] Skipping malformed inventory row:', e);
            }
        }
        return items;
    }

    // ─── Orders Queries ────────────────────────────────────────

    /**
     * Returns all orders in the current store scope, newest first.
     */
    public async getOrders(): Promise<Order[]> {
        if (!this.database || !this.storeConfig) return [];
        const scope = this.storeConfig.scopeName;
        const col = APP_CONFIG.collections.orders;
        const queryStr = `SELECT META().id, * FROM \`${scope}\`.\`${col}\` ORDER BY orderDate DESC`;
        const results = await this.database.createQuery(queryStr).execute();
        return this.mapOrderResults(results);
    }

    /**
     * Create a new reorder for an inventory item.
     */
    public async createOrder(item: GroceryItem, orderQty: number): Promise<void> {
        if (!this.ordersCollection || !this.storeConfig) return;

        const orderId = `order-${uuid.v4()}`;
        const doc = new MutableDocument(orderId);
        doc.setString('docType', 'order');
        doc.setString('orderId', orderId);
        doc.setString('storeId', this.storeConfig.storeId);
        doc.setFloat('orderDate', Date.now());
        doc.setString('orderStatus', 'Submitted');
        doc.setInt('productId', item.productId || 0);
        doc.setString('sku', item.sku || '');
        doc.setString('name', item.name);
        doc.setString('unit', item.unit || 'each');
        doc.setInt('orderQty', orderQty);

        await this.ordersCollection.save(doc);
        console.debug(`[GroceryDB] Created order ${orderId} for ${item.name} qty=${orderQty}`);
    }

    private mapOrderResults(results: any): Order[] {
        if (!results) return [];
        const orders: Order[] = [];
        for (const row of results) {
            try {
                const data = row[APP_CONFIG.collections.orders] || row;
                if (!data || typeof data !== 'object') continue;
                orders.push({
                    id: String(row.id || data.id || ''),
                    docType: String(data.docType || 'order'),
                    orderId: data.orderId || '',
                    storeId: String(data.storeId || ''),
                    orderDate: safeNumber(data.orderDate),
                    orderStatus: String(data.orderStatus || ''),
                    productId: safeNumber(data.productId),
                    sku: String(data.sku || ''),
                    unit: String(data.unit || ''),
                    orderQty: safeNumber(data.orderQty),
                });
            } catch (e) {
                console.warn('[GroceryDB] Skipping malformed order row:', e);
            }
        }
        return orders;
    }

    // ─── Profile Queries ───────────────────────────────────────

    /**
     * Returns the store profile for the current scope.
     */
    public async getStoreProfile(): Promise<StoreProfile | null> {
        if (!this.database || !this.storeConfig) return null;
        const scope = this.storeConfig.scopeName;
        const col = APP_CONFIG.collections.profile;
        const queryStr = `SELECT META().id, * FROM \`${scope}\`.\`${col}\` LIMIT 1`;
        const results = await this.database.createQuery(queryStr).execute();
        if (results && results.length > 0) {
            const row = results[0];
            const data = row[col] || row;
            return {
                id: row.id || data.id || '',
                docType: data.docType || 'profile',
                storeId: data.storeId || '',
                name: data.name || '',
                contact: data.contact || { email: '', phone: '' },
                location: data.location || {
                    address1: '',
                    locality: '',
                    region: '',
                    postalCode: '',
                    country: '',
                },
                manager: data.manager,
                openingHours: data.openingHours,
            } as StoreProfile;
        }
        return null;
    }

    // ─── Change Listeners ──────────────────────────────────────

    /**
     * Add a change listener for the inventory collection.
     * Fires whenever documents in the inventory collection change.
     */
    public async addInventoryChangeListener(callback: () => void): Promise<any> {
        return this.inventoryCollection?.addChangeListener(() => {
            callback();
        });
    }

    /**
     * Add a change listener for the orders collection.
     */
    public async addOrdersChangeListener(callback: () => void): Promise<any> {
        return this.ordersCollection?.addChangeListener(() => {
            callback();
        });
    }
}
