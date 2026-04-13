import 'dart:async';
import 'dart:developer' as dev;
import 'package:cbl/cbl.dart';
import 'package:uuid/uuid.dart';
import '../config/app_config.dart';
import '../models/grocery_item.dart';
import '../models/order.dart';
import '../models/store_profile.dart';

class DatabaseManager {
  static final DatabaseManager _instance = DatabaseManager._internal();
  factory DatabaseManager() => _instance;
  DatabaseManager._internal();

  Database? _database;
  Database? _authDatabase;
  Collection? _inventoryCollection;
  Collection? _ordersCollection;
  Collection? _profileCollection;

  Database? get database => _database;
  Collection? get inventoryCollection => _inventoryCollection;
  Collection? get ordersCollection => _ordersCollection;
  Collection? get profileCollection => _profileCollection;

  bool get isInitialized => _database != null;

  Future<void> initialize() async {
    dev.log('[DB] Initializing database: ${AppConfig.databaseName}, scope: ${AppConfig.scopeName}');
    _database = await Database.openAsync(AppConfig.databaseName);
    _authDatabase = await Database.openAsync(AppConfig.authDatabaseName);
    dev.log('[DB] Databases opened');

    _inventoryCollection = await _database!.createCollection(
      AppConfig.inventoryCollection,
      AppConfig.scopeName,
    );
    _ordersCollection = await _database!.createCollection(
      AppConfig.ordersCollection,
      AppConfig.scopeName,
    );
    _profileCollection = await _database!.createCollection(
      AppConfig.profileCollection,
      AppConfig.scopeName,
    );
    dev.log('[DB] Collections created/opened: inv=$_inventoryCollection, orders=$_ordersCollection, profile=$_profileCollection');

    await _createIndexes();
    dev.log('[DB] Indexes created');
  }

  Future<void> _createIndexes() async {
    if (_inventoryCollection == null) return;
    
    final nameIndex = ValueIndex([ValueIndexItem.property('name')]);
    await _inventoryCollection!.createIndex('name_index', nameIndex);
    
    final categoryIndex = ValueIndex([ValueIndexItem.property('category')]);
    await _inventoryCollection!.createIndex('category_index', categoryIndex);
  }

  // Grocery Items
  Stream<List<GroceryItem>> getGroceryItemsStream() {
    if (_inventoryCollection == null) {
      dev.log('Inventory collection is null');
      return Stream.value([]);
    }

    try {
      final query = const QueryBuilder()
          .select(SelectResult.all(), SelectResult.expression(Meta.id))
          .from(DataSource.collection(_inventoryCollection!));

      return query.changes().asyncMap((change) async {
        final results = await change.results.allResults();
        dev.log('Inventory query returned ${results.length} results');
        return results.map((result) {
          final docId = result.string('id') ?? '';
          final dict = result.dictionary(AppConfig.inventoryCollection);
          if (dict == null) return null;
          final map = dict.toPlainMap().cast<String, dynamic>();
          return GroceryItem.fromDocument(map, docId);
        }).whereType<GroceryItem>().toList();
      }).handleError((error) {
        dev.log('Inventory stream error: $error');
        return <GroceryItem>[];
      });
    } catch (e) {
      dev.log('Error creating inventory stream: $e');
      return Stream.value([]);
    }
  }

  Future<List<GroceryItem>> getAllGroceryItems() async {
    if (_inventoryCollection == null) return [];

    final query = const QueryBuilder()
        .select(SelectResult.all(), SelectResult.expression(Meta.id))
        .from(DataSource.collection(_inventoryCollection!));

    final resultSet = await query.execute();
    final results = await resultSet.allResults();
    
    return results.map((result) {
      final docId = result.string('id') ?? '';
      final dict = result.dictionary(AppConfig.inventoryCollection);
      if (dict == null) return null;
      final map = dict.toPlainMap().cast<String, dynamic>();
      return GroceryItem.fromDocument(map, docId);
    }).whereType<GroceryItem>().toList();
  }

  Future<List<GroceryItem>> searchGroceryItems(String searchText) async {
    final items = await getAllGroceryItems();
    final lower = searchText.toLowerCase();
    return items.where((item) =>
      item.name.toLowerCase().contains(lower) ||
      item.category.toLowerCase().contains(lower)
    ).toList();
  }

  Future<void> updateGroceryItemQuantity(String docId, int newQuantity) async {
    if (_inventoryCollection == null) return;
    
    final doc = await _inventoryCollection!.document(docId);
    if (doc == null) return;
    
    final mutableDoc = doc.toMutable();
    mutableDoc.setInteger(newQuantity, key: 'stockQty');
    await _inventoryCollection!.saveDocument(mutableDoc);
  }

  // Orders
  Stream<List<Order>> getOrdersStream() {
    if (_ordersCollection == null) {
      dev.log('Orders collection is null');
      return Stream.value([]);
    }

    try {
      final query = const QueryBuilder()
          .select(SelectResult.all(), SelectResult.expression(Meta.id))
          .from(DataSource.collection(_ordersCollection!))
          .where(Expression.property('storeId').equalTo(
            Expression.string(AppConfig.storeId)))
          .orderBy(Ordering.property('orderDate').descending());

      return query.changes().asyncMap((change) async {
        final results = await change.results.allResults();
        dev.log('Orders query returned ${results.length} results');
        return results.map((result) {
          final docId = result.string('id') ?? '';
          final dict = result.dictionary(AppConfig.ordersCollection);
          if (dict == null) return null;
          final map = dict.toPlainMap().cast<String, dynamic>();
          return Order.fromDocument(map, docId);
        }).whereType<Order>().toList();
      }).handleError((error) {
        dev.log('Orders stream error: $error');
        return <Order>[];
      });
    } catch (e) {
      dev.log('Error creating orders stream: $e');
      return Stream.value([]);
    }
  }

  Future<void> createOrder(GroceryItem item, int quantity) async {
    if (_ordersCollection == null) return;

    final uuid = const Uuid();
    final nanoId = uuid.v4().substring(0, 8);
    final docId = 'order-${AppConfig.storeId}-$nanoId';

    final allOrders = await _getAllOrderIds();
    final nextOrderId = allOrders.isEmpty ? 1 : allOrders.reduce((a, b) => a > b ? a : b) + 1;

    final order = Order(
      id: docId,
      orderId: nextOrderId,
      storeId: AppConfig.storeId,
      orderDate: DateTime.now().millisecondsSinceEpoch,
      orderStatus: 'In Review',
      productId: item.productId ?? 0,
      sku: item.sku ?? '',
      unit: item.unit ?? 'each',
      orderQty: quantity,
    );

    final doc = MutableDocument.withId(docId, order.toMap());
    await _ordersCollection!.saveDocument(
      doc,
      ConcurrencyControl.lastWriteWins,
    );
  }

  Future<List<int>> _getAllOrderIds() async {
    if (_ordersCollection == null) return [];
    
    final query = const QueryBuilder()
        .select(SelectResult.property('orderId'))
        .from(DataSource.collection(_ordersCollection!));
    
    final resultSet = await query.execute();
    final results = await resultSet.allResults();
    return results
        .map((r) => r.integer('orderId'))
        .toList();
  }

  // Profile
  Future<StoreProfile?> getStoreProfile() async {
    if (_profileCollection == null) {
      dev.log('Profile collection is null');
      return null;
    }

    try {
      // First try with storeId filter (matches Android behavior)
      var query = const QueryBuilder()
          .select(SelectResult.all(), SelectResult.expression(Meta.id))
          .from(DataSource.collection(_profileCollection!))
          .where(Expression.property('storeId')
              .equalTo(Expression.string(AppConfig.storeId)));

      var resultSet = await query.execute();
      var results = await resultSet.allResults();

      // Fallback: if no results with storeId filter, try without filter
      if (results.isEmpty) {
        dev.log('No profile with storeId=${AppConfig.storeId}, trying without filter');
        final fallbackQuery = const QueryBuilder()
            .select(SelectResult.all(), SelectResult.expression(Meta.id))
            .from(DataSource.collection(_profileCollection!));
        resultSet = await fallbackQuery.execute();
        results = await resultSet.allResults();
      }

      dev.log('Profile query returned ${results.length} results');

      if (results.isEmpty) return null;

      final result = results.first;
      final docId = result.string('id') ?? '';
      final dict = result.dictionary(AppConfig.profileCollection);
      if (dict == null) {
        dev.log('Profile dict is null for docId=$docId');
        return null;
      }
      final map = dict.toPlainMap().cast<String, dynamic>();
      dev.log('Profile data: $map');
      return StoreProfile.fromDocument(map, docId);
    } catch (e) {
      dev.log('Error fetching profile: $e');
      return null;
    }
  }

  // Auth session management
  Future<void> saveSession(String username) async {
    final defaultCollection = await _authDatabase!.defaultCollection;
    final doc = MutableDocument.withId('user_session', {
      'username': username,
      'store': AppConfig.currentStore.name,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    });
    await defaultCollection.saveDocument(doc, ConcurrencyControl.lastWriteWins);
  }

  Future<String?> getStoredSession() async {
    if (_authDatabase == null) return null;
    final defaultCollection = await _authDatabase!.defaultCollection;
    final doc = await defaultCollection.document('user_session');
    return doc?.string('username');
  }

  Future<void> clearSession() async {
    if (_authDatabase == null) return;
    final defaultCollection = await _authDatabase!.defaultCollection;
    final doc = await defaultCollection.document('user_session');
    if (doc != null) {
      await defaultCollection.deleteDocument(doc);
    }
  }

  Future<void> close() async {
    await _database?.close();
    await _authDatabase?.close();
    _database = null;
    _authDatabase = null;
    _inventoryCollection = null;
    _ordersCollection = null;
    _profileCollection = null;
  }
}
