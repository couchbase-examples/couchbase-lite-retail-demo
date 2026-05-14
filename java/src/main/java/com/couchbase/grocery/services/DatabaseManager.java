package com.couchbase.grocery.services;

import com.couchbase.grocery.models.AppConfig;
import com.couchbase.grocery.models.GroceryItem;
import com.couchbase.grocery.models.Order;
import com.couchbase.grocery.models.StoreProfile;
import com.couchbase.lite.Collection;
import com.couchbase.lite.CouchbaseLite;
import com.couchbase.lite.CouchbaseLiteException;
import com.couchbase.lite.Database;
import com.couchbase.lite.DataSource;
import com.couchbase.lite.Document;
import com.couchbase.lite.Expression;
import com.couchbase.lite.MutableDocument;
import com.couchbase.lite.Query;
import com.couchbase.lite.QueryBuilder;
import com.couchbase.lite.Result;
import com.couchbase.lite.ResultSet;
import com.couchbase.lite.SelectResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Consumer;

/**
 * Owns the local Couchbase Lite database, per-store scope, and the three
 * domain collections ({@code inventory}, {@code orders}, {@code profile}).
 *
 * <p>Mirrors {@code Services/DatabaseManager.cs} from the .NET MAUI port.
 */
public class DatabaseManager {

    private static final Logger log = LoggerFactory.getLogger(DatabaseManager.class);

    private static boolean cblInitialized = false;

    private Database database;
    private Collection inventoryColl;
    private Collection ordersColl;
    private Collection profileColl;
    private AppConfig config;

    private final List<Consumer<Void>> inventoryListeners = new CopyOnWriteArrayList<>();
    private final List<Consumer<Void>> ordersListeners = new CopyOnWriteArrayList<>();
    private final List<Consumer<Void>> profileListeners = new CopyOnWriteArrayList<>();

    /** Lazy one-time CBL.init() — safe to call from anywhere. */
    public static synchronized void initCBL() {
        if (cblInitialized) return;
        CouchbaseLite.init();
        cblInitialized = true;
        log.info("Couchbase Lite initialized");
    }

    /**
     * Open the database for the given store, ensure the scope + 3 collections
     * exist, and register live change listeners.
     */
    public void openFor(AppConfig cfg) throws CouchbaseLiteException {
        initCBL();
        close(); // idempotent

        this.config = cfg;
        this.database = new Database(AppConfig.LOCAL_DB_NAME);

        this.inventoryColl = ensureCollection(AppConfig.COLLECTION_INVENTORY, cfg.scope());
        this.ordersColl    = ensureCollection(AppConfig.COLLECTION_ORDERS, cfg.scope());
        this.profileColl   = ensureCollection(AppConfig.COLLECTION_PROFILE, cfg.scope());

        inventoryColl.addChangeListener(change -> fire(inventoryListeners));
        ordersColl.addChangeListener(change -> fire(ordersListeners));
        profileColl.addChangeListener(change -> fire(profileListeners));

        log.info("Database '{}' opened, scope='{}', inventory={} orders={} profile={}",
                AppConfig.LOCAL_DB_NAME, cfg.scope(),
                inventoryColl.getCount(), ordersColl.getCount(), profileColl.getCount());
    }

    private Collection ensureCollection(String name, String scope) throws CouchbaseLiteException {
        Collection existing = database.getCollection(name, scope);
        return existing != null ? existing : database.createCollection(name, scope);
    }

    public void close() {
        if (database != null) {
            try { database.close(); } catch (CouchbaseLiteException e) {
                log.warn("Error closing DB: {}", e.getMessage());
            }
            database = null;
            inventoryColl = ordersColl = profileColl = null;
        }
    }

    // ---- Inventory ---------------------------------------------------------

    public List<GroceryItem> getAllInventory() throws CouchbaseLiteException {
        List<GroceryItem> out = new ArrayList<>();
        Query q = QueryBuilder.select(SelectResult.expression(com.couchbase.lite.Meta.id),
                                       SelectResult.all())
                              .from(DataSource.collection(inventoryColl));
        try (ResultSet rs = q.execute()) {
            for (Result r : rs) {
                Document d = inventoryColl.getDocument(r.getString(0));
                if (d != null) out.add(GroceryItem.fromDocument(d));
            }
        }
        out.sort((a, b) -> {
            String an = a.getName() == null ? "" : a.getName();
            String bn = b.getName() == null ? "" : b.getName();
            return an.compareToIgnoreCase(bn);
        });
        return out;
    }

    public List<GroceryItem> searchInventory(String query) throws CouchbaseLiteException {
        if (query == null || query.isBlank()) return getAllInventory();
        String needle = query.toLowerCase();
        List<GroceryItem> all = getAllInventory();
        all.removeIf(i -> i.getName() == null || !i.getName().toLowerCase().contains(needle));
        return all;
    }

    public void updateQuantity(String itemId, int newQuantity) throws CouchbaseLiteException {
        Document existing = inventoryColl.getDocument(itemId);
        if (existing == null) return;
        MutableDocument m = existing.toMutable().setLong("stockQty", newQuantity);
        // Strip the P2P CRDT "quantity" dict if present, so we don't fight
        // the web/iOS clients that treat it as a conflict-replicated counter.
        if (m.contains("quantity") && m.getDictionary("quantity") != null) {
            m.remove("quantity");
        }
        inventoryColl.save(m);
    }

    // ---- Orders ------------------------------------------------------------

    public List<Order> getAllOrders() throws CouchbaseLiteException {
        List<Order> out = new ArrayList<>();
        Query q = QueryBuilder.select(SelectResult.expression(com.couchbase.lite.Meta.id))
                              .from(DataSource.collection(ordersColl));
        try (ResultSet rs = q.execute()) {
            for (Result r : rs) {
                Document d = ordersColl.getDocument(r.getString(0));
                if (d != null) out.add(Order.fromDocument(d));
            }
        }
        // Newest first (epoch millis — bigger is newer)
        out.sort((a, b) -> Long.compare(b.getOrderDate(), a.getOrderDate()));
        return out;
    }

    private static final String NANOID_ALPHABET =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
    private static final java.security.SecureRandom NANO_RNG = new java.security.SecureRandom();

    private static String generateNanoId() {
        StringBuilder sb = new StringBuilder(21);
        for (int i = 0; i < 21; i++) sb.append(NANOID_ALPHABET.charAt(NANO_RNG.nextInt(NANOID_ALPHABET.length())));
        return sb.toString();
    }

    public void createOrder(GroceryItem item, int qty) throws CouchbaseLiteException {
        // Match Android's scheme: doc id = "order-${storeId}-${nanoId}",
        // orderId = max(existing) + 1, "In Review" as the initial status.
        String storeIdStr = config != null ? config.store().toLowerCase() + "-store-01" : "store-01";
        String docId = "order-" + storeIdStr + "-" + generateNanoId();

        int nextOrderId = 1;
        for (Order existing : getAllOrders()) {
            if (existing.getOrderId() >= nextOrderId) nextOrderId = existing.getOrderId() + 1;
        }

        Order o = new Order();
        o.setId(docId);
        o.setOrderId(nextOrderId);
        o.setStoreId(storeIdStr);
        o.setOrderDate(System.currentTimeMillis());
        o.setOrderStatus(Order.Status.IN_REVIEW);
        o.setProductId(item.getProductId());
        o.setSku(item.getSku());
        o.setUnit(item.getUnit());
        o.setOrderQty(qty);
        ordersColl.save(o.toMutable());
    }

    // ---- Profile -----------------------------------------------------------

    public StoreProfile getProfile() throws CouchbaseLiteException {
        // The profile collection in seeded data contains exactly one doc per store.
        Query q = QueryBuilder.select(SelectResult.expression(com.couchbase.lite.Meta.id))
                              .from(DataSource.collection(profileColl));
        try (ResultSet rs = q.execute()) {
            for (Result r : rs) {
                Document d = profileColl.getDocument(r.getString(0));
                if (d != null) return StoreProfile.fromDocument(d);
            }
        }
        return null;
    }

    // ---- Change listeners --------------------------------------------------

    public void onInventoryChanged(Consumer<Void> cb) { inventoryListeners.add(cb); }
    public void onOrdersChanged(Consumer<Void> cb)    { ordersListeners.add(cb); }
    public void onProfileChanged(Consumer<Void> cb)   { profileListeners.add(cb); }

    private static void fire(List<Consumer<Void>> listeners) {
        for (Consumer<Void> c : listeners) {
            try { c.accept(null); } catch (Exception e) {
                log.warn("Listener threw: {}", e.getMessage());
            }
        }
    }

    // ---- Accessors for the SyncManager -------------------------------------

    public Database database()       { return database; }
    public Collection inventory()    { return inventoryColl; }
    public Collection orders()       { return ordersColl; }
    public Collection profile()      { return profileColl; }
    public AppConfig config()        { return config; }
}
