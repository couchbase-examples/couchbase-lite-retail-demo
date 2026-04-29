using System.Diagnostics;
using Couchbase.Lite;
using Couchbase.Lite.Query;
using GroceryApp.Models;

namespace GroceryApp.Services;

/// <summary>
/// Couchbase Lite database manager. Owns the database, scoped collections,
/// and indexes; exposes typed queries and CRUD that mirror iOS/Android.
/// </summary>
public class DatabaseManager : IDisposable
{
    private const string Tag = "DatabaseManager";

    private Database? _database;
    private AppServicesSyncManager? _syncManager;

    public AppServicesSyncManager? SyncManager => _syncManager;
    public bool IsAppServicesEnabled { get; private set; }

    /// <summary>Fired when documents in the inventory collection change (after sync).</summary>
    public event EventHandler? InventoryChanged;
    /// <summary>Fired when documents in the orders collection change (after sync).</summary>
    public event EventHandler? OrdersChanged;
    /// <summary>Fired when documents in the profile collection change (after sync).</summary>
    public event EventHandler? ProfileChanged;

    private ListenerToken _inventoryListenerToken;
    private ListenerToken _ordersListenerToken;
    private ListenerToken _profileListenerToken;
    private bool _hasInventoryListener;
    private bool _hasOrdersListener;
    private bool _hasProfileListener;
    private Couchbase.Lite.Collection? _inventoryListenerCollection;
    private Couchbase.Lite.Collection? _ordersListenerCollection;
    private Couchbase.Lite.Collection? _profileListenerCollection;

    public DatabaseManager()
    {
        OpenDatabase();
        SetupAppServicesIntegration();
    }

    public Database? GetDatabase() => _database;

    private void OpenDatabase()
    {
        try
        {
            _database = new Database(AppConfig.DatabaseName);
            Log($"Database opened successfully: {AppConfig.DatabaseName}");
            Log($"Database path: {_database.Path}");
        }
        catch (Exception ex)
        {
            LogError("Error opening database", ex);
        }
    }

    /// <summary>
    /// Get the inventory collection in the active scope, creating it if missing.
    /// </summary>
    public Couchbase.Lite.Collection? GetInventoryCollection()
        => GetOrCreateCollection(AppConfig.CollectionName, AppConfig.ScopeName);

    public Couchbase.Lite.Collection? GetOrdersCollection()
        => GetOrCreateCollection(AppConfig.OrdersCollectionName, AppConfig.ScopeName);

    public Couchbase.Lite.Collection? GetProfileCollection()
        => GetOrCreateCollection(AppConfig.ProfileCollectionName, AppConfig.ScopeName);

    private Couchbase.Lite.Collection? GetOrCreateCollection(string name, string scope)
    {
        if (_database == null) return null;
        try
        {
            return _database.GetCollection(name, scope) ?? _database.CreateCollection(name, scope);
        }
        catch (Exception ex)
        {
            LogError($"Error getting/creating collection {scope}.{name}", ex);
            return null;
        }
    }

    private void SetupIndexes()
    {
        var collection = GetInventoryCollection();
        if (collection == null) return;
        try
        {
            collection.CreateIndex("name_index", new ValueIndexConfiguration("name"));
            collection.CreateIndex("category_index", new ValueIndexConfiguration("category"));
            Log($"Indexes created for scope: {AppConfig.ScopeName}");
        }
        catch (Exception ex)
        {
            LogError("Error creating indexes", ex);
        }
    }

    // --------------------------------------------------------------
    // App Services integration
    // --------------------------------------------------------------
    private void SetupAppServicesIntegration()
    {
        if (_database == null)
        {
            LogError("Database not ready for App Services integration");
            return;
        }
        Log("Setting up App Services integration...");
        _syncManager = new AppServicesSyncManager(_database);
        Log("App Services integration ready");
    }

    /// <summary>
    /// Called after a successful login. Recreates indexes for the active scope,
    /// reconfigures the replicator with the post-login user's endpoint, and
    /// starts continuous sync.
    /// </summary>
    public void StartSyncAfterLogin()
    {
        Log($"Starting sync after login for store: {AppConfig.CurrentStore.DisplayName()}");
        Log($"Sync URL: {AppConfig.SyncGatewayUrl}");
        Log($"Scope: {AppConfig.ScopeName}");
        Log($"Username: {AppConfig.Username}");

        SetupIndexes();
        AttachCollectionListeners();

        if (AppConfig.EnableAppServicesSync && _syncManager != null)
        {
            try
            {
                _syncManager.SetupAndStartSync();
                IsAppServicesEnabled = true;
            }
            catch (Exception ex)
            {
                IsAppServicesEnabled = false;
                LogError("App Services sync setup failed", ex);
            }
        }
    }

    public void DisableAppServices()
    {
        Log("Disabling App Services sync...");
        IsAppServicesEnabled = false;
        _syncManager?.DisableAppServices();
        DetachCollectionListeners();
    }

    private void AttachCollectionListeners()
    {
        DetachCollectionListeners();

        var inv = GetInventoryCollection();
        if (inv != null)
        {
            _inventoryListenerCollection = inv;
            _inventoryListenerToken = inv.AddChangeListener((_, _) =>
                InventoryChanged?.Invoke(this, EventArgs.Empty));
            _hasInventoryListener = true;
        }

        var orders = GetOrdersCollection();
        if (orders != null)
        {
            _ordersListenerCollection = orders;
            _ordersListenerToken = orders.AddChangeListener((_, _) =>
                OrdersChanged?.Invoke(this, EventArgs.Empty));
            _hasOrdersListener = true;
        }

        var profile = GetProfileCollection();
        if (profile != null)
        {
            _profileListenerCollection = profile;
            _profileListenerToken = profile.AddChangeListener((_, _) =>
                ProfileChanged?.Invoke(this, EventArgs.Empty));
            _hasProfileListener = true;
        }
    }

    private void DetachCollectionListeners()
    {
        if (_hasInventoryListener && _inventoryListenerCollection != null)
        {
            _inventoryListenerCollection.RemoveChangeListener(_inventoryListenerToken);
            _hasInventoryListener = false;
            _inventoryListenerCollection = null;
        }
        if (_hasOrdersListener && _ordersListenerCollection != null)
        {
            _ordersListenerCollection.RemoveChangeListener(_ordersListenerToken);
            _hasOrdersListener = false;
            _ordersListenerCollection = null;
        }
        if (_hasProfileListener && _profileListenerCollection != null)
        {
            _profileListenerCollection.RemoveChangeListener(_profileListenerToken);
            _hasProfileListener = false;
            _profileListenerCollection = null;
        }
    }

    // --------------------------------------------------------------
    // Inventory queries
    // --------------------------------------------------------------
    public Task<List<GroceryItem>> GetAllGroceryItemsAsync() => Task.Run(() =>
    {
        var collection = GetInventoryCollection();
        if (collection == null) return new List<GroceryItem>();

        try
        {
            using var query = QueryBuilder.Select(SelectResult.All())
                .From(DataSource.Collection(collection));
            using var results = query.Execute();
            return results.Select(r => MapInventoryRow(r, collection.Name)).Where(i => i != null).Select(i => i!).ToList();
        }
        catch (Exception ex)
        {
            LogError("Error fetching grocery items", ex);
            return new List<GroceryItem>();
        }
    });

    public Task<List<GroceryItem>> SearchGroceryAsync(string searchText) => Task.Run(() =>
    {
        var collection = GetInventoryCollection();
        if (collection == null) return new List<GroceryItem>();
        try
        {
            using var query = QueryBuilder.Select(SelectResult.All())
                .From(DataSource.Collection(collection));
            using var results = query.Execute();
            var upper = searchText.ToUpperInvariant();
            var seen = new HashSet<string>();
            var items = new List<GroceryItem>();
            foreach (var r in results)
            {
                var item = MapInventoryRow(r, collection.Name);
                if (item == null || string.IsNullOrEmpty(item.Id)) continue;
                if (seen.Contains(item.Id)) continue;
                if (item.Name.ToUpperInvariant().Contains(upper) ||
                    item.Type.ToUpperInvariant().Contains(upper))
                {
                    items.Add(item);
                    seen.Add(item.Id);
                }
            }
            return items;
        }
        catch (Exception ex)
        {
            LogError("Error searching grocery", ex);
            return new List<GroceryItem>();
        }
    });

    private static GroceryItem? MapInventoryRow(Result r, string collectionName)
    {
        var dict = r.GetDictionary(collectionName);
        if (dict == null) return null;
        var id = dict.GetString("id");
        if (string.IsNullOrEmpty(id)) return null;
        var quantity = dict.GetInt("stockQty");
        if (quantity <= 0)
        {
            var qDict = dict.GetDictionary("quantity");
            if (qDict != null) quantity = qDict.GetInt("value");
            if (quantity <= 0) quantity = dict.GetInt("quantity");
        }
        return new GroceryItem
        {
            Id = id,
            Name = dict.GetString("name") ?? string.Empty,
            Type = dict.GetString("category") ?? dict.GetString("type") ?? "Unknown",
            Price = dict.GetDouble("price"),
            ImageUrl = dict.GetString("imageURL") ?? string.Empty,
            Quantity = quantity,
            ProductId = dict.Contains("productId") ? dict.GetInt("productId") : null,
            Sku = dict.GetString("sku"),
            Brand = dict.GetString("brand"),
            Unit = dict.GetString("unit"),
            StoreId = dict.GetString("storeId"),
            DocType = dict.GetString("docType")
        };
    }

    public Task UpdateQuantityAsync(string itemId, int newQuantity) => Task.Run(() =>
    {
        var collection = GetInventoryCollection();
        if (collection == null) return;
        try
        {
            var doc = collection.GetDocument(itemId);
            if (doc == null) return;
            using var mutable = doc.ToMutable();
            mutable.SetInt("stockQty", newQuantity);
            // Strip any CRDT-style "quantity" field to avoid conflicts with simple writers.
            if (mutable.Contains("quantity"))
            {
                mutable.Remove("quantity");
            }
            collection.Save(mutable, ConcurrencyControl.LastWriteWins);
            Log($"Updated quantity for {itemId} to {newQuantity}");

            if (IsAppServicesEnabled)
            {
                _syncManager?.PushDocumentImmediately(itemId);
            }
        }
        catch (Exception ex)
        {
            LogError("Error updating quantity", ex);
        }
    });

    // --------------------------------------------------------------
    // Profile
    // --------------------------------------------------------------
    public Task<StoreProfile?> GetStoreProfileAsync() => Task.Run<StoreProfile?>(() =>
    {
        var collection = GetProfileCollection();
        if (collection == null) return null;
        try
        {
            using var query = QueryBuilder.Select(SelectResult.All())
                .From(DataSource.Collection(collection))
                .Where(Expression.Property("storeId").EqualTo(Expression.String(AppConfig.StoreId)));
            using var results = query.Execute();
            foreach (var r in results)
            {
                var dict = r.GetDictionary(collection.Name);
                if (dict == null) continue;
                var id = dict.GetString("id");
                var name = dict.GetString("name");
                var storeId = dict.GetString("storeId");
                if (id == null || name == null || storeId == null) continue;

                var contactDict = dict.GetDictionary("contact");
                var locationDict = dict.GetDictionary("location");
                var contact = new StoreProfile.ContactInfo
                {
                    Email = contactDict?.GetString("email") ?? string.Empty,
                    Phone = contactDict?.GetString("phone") ?? string.Empty
                };
                StoreProfile.Coordinates? coords = null;
                var coordDict = locationDict?.GetDictionary("coordinates");
                if (coordDict != null)
                {
                    coords = new StoreProfile.Coordinates
                    {
                        Lat = coordDict.GetDouble("lat"),
                        Lon = coordDict.GetDouble("lon")
                    };
                }
                var location = new StoreProfile.LocationInfo
                {
                    Address1 = locationDict?.GetString("address1") ?? string.Empty,
                    Address2 = locationDict?.GetString("address2"),
                    Locality = locationDict?.GetString("locality") ?? string.Empty,
                    Region = locationDict?.GetString("region") ?? string.Empty,
                    PostalCode = locationDict?.GetString("postalCode") ?? string.Empty,
                    Country = locationDict?.GetString("country") ?? string.Empty,
                    Coordinates = coords
                };
                return new StoreProfile
                {
                    Id = id,
                    DocType = dict.GetString("docType") ?? "StoreProfile",
                    StoreId = storeId,
                    Name = name,
                    Contact = contact,
                    Location = location,
                    Manager = dict.GetString("manager"),
                    OpeningHours = dict.GetString("openingHours")
                };
            }
            return null;
        }
        catch (Exception ex)
        {
            LogError("Error fetching store profile", ex);
            return null;
        }
    });

    // --------------------------------------------------------------
    // Orders
    // --------------------------------------------------------------
    public Task<List<Order>> GetAllOrdersAsync() => Task.Run(() =>
    {
        var collection = GetOrdersCollection();
        if (collection == null) return new List<Order>();
        try
        {
            using var query = QueryBuilder.Select(SelectResult.All())
                .From(DataSource.Collection(collection))
                .Where(Expression.Property("storeId").EqualTo(Expression.String(AppConfig.StoreId)))
                .OrderBy(Ordering.Property("orderDate").Descending());
            using var results = query.Execute();
            return results.Select(r => MapOrderRow(r, collection.Name)).Where(o => o != null).Select(o => o!).ToList();
        }
        catch (Exception ex)
        {
            LogError("Error fetching orders", ex);
            return new List<Order>();
        }
    });

    private static Order? MapOrderRow(Result r, string collectionName)
    {
        var dict = r.GetDictionary(collectionName);
        if (dict == null) return null;
        var orderIdRaw = dict.GetValue("orderId");
        var orderId = orderIdRaw switch
        {
            string s => s,
            long l => l.ToString(),
            int i => i.ToString(),
            _ => orderIdRaw?.ToString() ?? string.Empty
        };
        var storeId = dict.GetString("storeId") ?? string.Empty;
        return new Order
        {
            Id = $"order-{orderId}-{storeId}",
            DocType = dict.GetString("docType") ?? "Order",
            OrderId = orderId,
            StoreId = storeId,
            OrderDate = dict.GetLong("orderDate"),
            OrderStatus = dict.GetString("orderStatus") ?? "Submitted",
            ProductId = dict.GetInt("productId"),
            Sku = dict.GetString("sku") ?? string.Empty,
            Unit = dict.GetString("unit") ?? string.Empty,
            OrderQty = dict.GetInt("orderQty")
        };
    }

    private static string GenerateNanoId()
    {
        const string alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-";
        var bytes = new byte[21];
        System.Security.Cryptography.RandomNumberGenerator.Fill(bytes);
        var sb = new System.Text.StringBuilder(21);
        for (var i = 0; i < 21; i++)
        {
            sb.Append(alphabet[bytes[i] % alphabet.Length]);
        }
        return sb.ToString();
    }

    public async Task<Order?> CreateOrderAsync(GroceryItem item, int quantity = 100)
    {
        var collection = GetOrdersCollection();
        if (collection == null) return null;
        try
        {
            var nanoId = GenerateNanoId();
            var documentId = $"order-{AppConfig.StoreId}-{nanoId}";
            var existingOrders = await GetAllOrdersAsync().ConfigureAwait(false);
            var nextOrderId = (existingOrders
                .Select(o => int.TryParse(o.OrderId, out var v) ? v : 0)
                .DefaultIfEmpty(0)
                .Max()) + 1;

            var order = new Order
            {
                Id = documentId,
                DocType = "Order",
                OrderId = nextOrderId.ToString(),
                StoreId = AppConfig.StoreId,
                OrderDate = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                OrderStatus = "In Review",
                ProductId = item.ProductId ?? 0,
                Sku = item.Sku ?? "UNKNOWN",
                Unit = item.Unit ?? "unit",
                OrderQty = quantity
            };

            using var doc = new MutableDocument(documentId);
            doc.SetString("docType", order.DocType);
            doc.SetString("storeId", order.StoreId);
            doc.SetLong("orderDate", order.OrderDate);
            doc.SetString("orderStatus", order.OrderStatus);
            doc.SetInt("productId", order.ProductId);
            doc.SetString("sku", order.Sku);
            doc.SetString("unit", order.Unit);
            doc.SetInt("orderQty", order.OrderQty);
            doc.SetInt("orderId", nextOrderId);
            collection.Save(doc, ConcurrencyControl.LastWriteWins);

            Log($"Created order: {documentId} (productId: {order.ProductId}, qty: {quantity})");
            if (IsAppServicesEnabled) _syncManager?.PushDocumentImmediately(documentId);
            return order;
        }
        catch (Exception ex)
        {
            LogError("Error creating order", ex);
            return null;
        }
    }

    public void Dispose()
    {
        try
        {
            DisableAppServices();
            _syncManager?.Dispose();
            _database?.Close();
            _database?.Dispose();
        }
        catch (Exception ex)
        {
            LogError("Error during DatabaseManager.Dispose", ex);
        }
        GC.SuppressFinalize(this);
    }

    private static void Log(string message)
    {
        if (AppConfig.DebugLogging) Debug.WriteLine($"[{Tag}] {message}");
    }

    private static void LogError(string message, Exception? ex = null)
    {
        Debug.WriteLine($"[{Tag}] ERROR: {message}{(ex != null ? $" - {ex.Message}" : string.Empty)}");
    }
}
