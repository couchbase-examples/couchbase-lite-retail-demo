import 'package:flutter_dotenv/flutter_dotenv.dart';

enum Store {
  aaStore('AA-Store', 'aa-store-01', 'supermarket-aa'),
  nycStore('NYC-Store', 'nyc-store-01', 'supermarket-nyc');

  final String scopeName;
  final String storeId;
  final String syncDbName;

  const Store(this.scopeName, this.storeId, this.syncDbName);
}

class DemoCredential {
  final String username;
  final String password;
  final Store store;
  final String fullName;
  final String role;

  const DemoCredential({
    required this.username,
    required this.password,
    required this.store,
    required this.fullName,
    required this.role,
  });
}

class AppConfig {
  static const String databaseName = 'GroceryInventoryDB';
  static const String authDatabaseName = 'AuthDB';
  static const String inventoryCollection = 'inventory';
  static const String ordersCollection = 'orders';
  static const String profileCollection = 'profile';

  static String get syncEndpointBase =>
      dotenv.env['SYNC_ENDPOINT'] ?? 'wss://localhost:4984';

  static Store currentStore = Store.nycStore;

  static String get scopeName => currentStore.scopeName;
  static String get storeId => currentStore.storeId;
  static String get syncGatewayUrl => '$syncEndpointBase/${currentStore.syncDbName}';

  static const int syncHeartbeat = 60;
  static const int syncMaxAttempts = 10;
  static const int syncMaxAttemptWaitTime = 300;

  static const List<DemoCredential> demoCredentials = [
    DemoCredential(
      username: 'nyc-store-01@supermarket.com',
      password: 'P@ssword1',
      store: Store.nycStore,
      fullName: 'NYC Store Manager',
      role: 'Store Manager',
    ),
    DemoCredential(
      username: 'aa-store-01@supermarket.com',
      password: 'P@ssword1',
      store: Store.aaStore,
      fullName: 'AA Store Manager',
      role: 'Store Manager',
    ),
  ];
}
