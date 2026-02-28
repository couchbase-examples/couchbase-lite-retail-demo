# Contributing to Grocery Inventory Management System

Welcome to the Grocery Inventory Management System! This guide will help you understand the architecture and contribute to the project.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Server-Side Configuration](#server-side-configuration)
- [App Flow](#app-flow)
- [Data Models](#data-models)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)

---

## Architecture Overview

This is a distributed grocery inventory management system built with:
- **Frontend**: iOS (Swift/SwiftUI) and Android (Kotlin/Jetpack Compose)
- **Backend**: Couchbase Server with App Services (Sync Gateway)
- **Sync**: Bi-directional replication with P2P support (Couchbase Lite 3.3+)

### Key Features
- Multi-store inventory management (AA-Store, NYC-Store, etc.)
- Real-time synchronization across devices
- Peer-to-peer sync for offline collaboration
- Order management with status tracking
- Store profile management

---

## Server-Side Configuration

### 1. Couchbase Bucket Structure

The "Supermarket" bucket contains:
- **4 scopes**: `AA-Store`, `NYC-Store`, `_default`, `_system`
- **3 collections per store scope**:
  - `inventory` (80 documents per store)
  - `orders` (150 documents per store)
  - `profile` (1 document per store)

```
📦 supermarket (bucket)
├── 📁 AA-Store (scope)
│   ├── 📚 inventory (80 docs)
│   ├── 📚 orders (150 docs)
│   └── 📚 profile (1 doc)
├── 📁 NYC-Store (scope)
│   ├── 📚 inventory (80 docs)
│   ├── 📚 orders (150 docs)
│   └── 📚 profile (1 doc)
├── 📁 _default (1 collection)
└── 📁 _system (2 collections)
```

### 2. App Service Setup

**Service Name**: `supermarket-appservice` (linked to supermarket cluster)

**App Endpoints** (one per store):
- `supermarket-aa` → AA-Store scope
- `supermarket-nyc` → NYC-Store scope

**Linked Collections** (per endpoint):
- ✅ `inventory`
- ✅ `orders`
- ✅ `profile`

### 3. User Configuration

**Username Format**: `<storeId>@supermarket.com`

**Example Users**:
- **NYC Store**: `nyc-store-01@supermarket.com` / `P@ssword1`
  - App Endpoint: `supermarket-nyc`
  - Channels: `inventory`, `orders`, `profile`
  
- **AA Store**: `aa-store-01@supermarket.com` / `P@ssword1`
  - App Endpoint: `supermarket-aa`
  - Channels: `inventory`, `orders`, `profile`

**Access Control**: Default policy (all users have read/write access to their assigned channels)

---

## App Flow

### Phase 1: Basic Flow (Current Implementation)

#### 1. Login & Profile Fetch

When an employee logs in (e.g., `nyc-store-01@supermarket.com`):

1. **App must have configurable option**: `App Endpoint URL`
   - User updates this to point to their App Endpoint
   
2. **ONE SHOT replication** on the `profile` collection:
   ```swift
   // Pull down store profile document
   let replicator = Replicator(config: profileConfig)
   replicator.start()
   ```
   - ✅ If credentials are correct → fetch profile doc
   - ❌ If credentials are wrong → authentication error
   - Update UI with store info

#### 2. Continuous Bi-Directional Replication

Set up continuous replication on `inventory` and `orders` collections:

```swift
var config = ReplicatorConfiguration(target: endpoint)
config.continuous = true
config.replicatorType = .pushAndPull
config.addCollections([inventoryCollection, ordersCollection])
```

**Conflict Resolution**: Use default policy (last-write-wins or custom CRDT for inventory counts)

#### 3. Inventory Updates

When inventory count is updated (e.g., "Organic Milk"):

**CURRENT Document**:
```json
{
  "_id": "Inventory_NYCStore_10000",
  "docType": "Inventory",
  "productId": 10000,
  "sku": "NYC-10000",
  "name": "Organic Milk",
  "brand": "BudgetBest",
  "category": "Dairy",
  "price": 29.86,
  "unit": "gallon",
  "stockQty": 71,
  "location": {"aisle": 24, "bin": 7},
  "attributes": {"organic": true, "size": "1 gallon", "perishable": true},
  "imageURL": "http://images.nycstore.com/dairy/organic-milk-budgetbest-gallon.jpg",
  "expirationDate": 1758488734450,
  "lastUpdated": 1748483079450,
  "storeId": "nyc-store-01"
}
```

**NEW Document** (after update):
```json
{
  "_id": "Inventory_NYCStore_10000",
  "docType": "Inventory",
  "productId": 10000,
  "sku": "NYC-10000",
  "name": "Organic Milk",
  "brand": "BudgetBest",
  "category": "Dairy",
  "price": 29.86,
  "unit": "gallon",
  "stockQty": 30,  // ← Updated from 71 to 30
  "location": {"aisle": 24, "bin": 7},
  "attributes": {"organic": true, "size": "1 gallon", "perishable": true},
  "imageURL": "http://images.nycstore.com/dairy/organic-milk-budgetbest-gallon.jpg",
  "expirationDate": 1758488734450,
  "lastUpdated": 1748483079450,
  "storeId": "nyc-store-01"
}
```

- Document is saved locally
- Continuous replicator syncs to server
- Other employees see the update in real-time

#### 4. Order Management

**Creating an Order** (for now, one item per order):

1. User selects an item (e.g., "Organic Milk")
2. Pre-populated order form displays with item details
3. User enters order quantity
4. Clicks "Create Order"

**Order Document Format**:
```json
{
  "_id": "order-nyc-store-01-V1StGXR8_Z5jdHi6B-myT",
  "docType": "Order",
  "storeId": "nyc-store-01",
  "orderDate": 1755257767451,
  "orderStatus": "Submitted",
  "productId": 10000,
  "sku": "NYC-10000",
  "unit": "gallon",
  "orderQty": 30
}
```

**Order ID Format**: `order-<StoreID>-<UUID>` (or NanoID if UUID is too long)

**Example**: `order-nyc-store-01-V1StGXR8_Z5jdHi6B-myT`

#### 5. Server-Side Order Processing

**On Server Side**:
- Admin navigates to cluster → views orders in document browser
- Updates `orderStatus` to:
  - `"Processing"` (order being prepared)
  - `"Rejected"` (order declined)
  - `"Fulfilled"` (order completed)

**Example Update**:
```json
{
  "_id": "order-nyc-store-01-V1StGXR8_Z5jdHi6B-myT",
  "docType": "Order",
  "storeId": "nyc-store-01",
  "orderDate": 1755257767451,
  "orderStatus": "Processing",  // ← Updated by admin
  "productId": 10000,
  "sku": "NYC-10000",
  "unit": "gallon",
  "orderQty": 30
}
```

- Changes sync down to all store employees
- Employees see updated order status in Orders page

---

## Data Models

### Inventory Document
```json
{
  "_id": "Inventory_<StoreID>_<ProductID>",
  "docType": "Inventory",
  "productId": 10000,
  "sku": "<STORE>-10000",
  "name": "Product Name",
  "brand": "Brand Name",
  "category": "Category",
  "price": 29.86,
  "unit": "gallon",
  "stockQty": 71,
  "location": {
    "aisle": 24,
    "bin": 7
  },
  "attributes": {
    "organic": true,
    "size": "1 gallon",
    "perishable": true
  },
  "imageURL": "https://res.cloudinary.com/.../10000.png",
  "expirationDate": 1758488734450,
  "lastUpdated": 1748483079450,
  "storeId": "store-id"
}
```

### Order Document
```json
{
  "_id": "order-<storeId>-<UUID>",
  "docType": "Order",
  "storeId": "nyc-store-01",
  "orderDate": 1755257767451,
  "orderStatus": "Submitted|Processing|Rejected|Fulfilled",
  "productId": 10000,
  "sku": "NYC-10000",
  "unit": "gallon",
  "orderQty": 30
}
```

### Store Profile Document
```json
{
  "_id": "aa-store-01-profile",
  "docType": "StoreProfile",
  "storeId": "aa-store-01",
  "name": "AA Supermarket - Downtown",
  "location": {
    "address1": "123 Market Street",
    "locality": "Springfield",
    "region": "IL",
    "postalCode": "62704",
    "country": "US",
    "coordinates": {"lat": 39.7817, "lon": -89.6501}
  },
  "contact": {
    "phone": "217-555-0199",
    "email": "contact-aa@supermarket.com"
  },
  "hours": {
    "monday": "08:00-21:00",
    "tuesday": "08:00-21:00",
    "wednesday": "08:00-21:00",
    "thursday": "08:00-21:00",
    "friday": "08:00-22:00",
    "saturday": "08:00-22:00",
    "sunday": "09:00-20:00"
  },
  "services": ["In-Store Shopping", "Curbside Pickup", "Home Delivery", "Pharmacy"],
  "manager": {
    "name": "Jordan Taylor",
    "employeeId": "EMP-44321",
    "email": "jordan.taylor@aasupermarket.com"
  },
  "establishedYear": 2010,
  "lastRenovated": 2021,
  "features": {
    "parkingCapacity": 120,
    "evChargingStations": 4,
    "wheelchairAccessible": true
  },
  "status": "Open",
  "lastUpdated": 1737971200123
}
```

---

## P2P Sync (Couchbase Lite 3.3+)

**Leverage auto-discovery** for peer-to-peer synchronization:

```swift
// iOS: Use MultipeerConnectivity
let multipeerSync = MultipeerP2PSyncManager(database: database)
multipeerSync.start()

// Android: Use Network Service Discovery
val p2pSync = P2PSyncManager(database)
p2pSync.startAdvertising()
p2pSync.startDiscovery()
```

**Benefits**:
- Offline collaboration between store employees
- No server required for local sync
- Automatic conflict resolution with CRDT

---

## Development Setup

### Prerequisites
- **iOS**: Xcode 15+, Swift 5.9+
- **Android**: Android Studio, Kotlin 1.9+
- **Couchbase Lite**: 3.3.0+
- **Couchbase Server**: 7.6+ with App Services

### iOS Setup

1. Clone the repository
2. Open `GroceryApp.xcodeproj` in Xcode
3. Add `aa_store_inventory.json` to project (if not already added)
4. Update App Endpoint URL in settings:
   ```swift
   // AppServicesSyncManager.swift
   private let syncGatewayURL = "wss://your-endpoint.apps.cloud.couchbase.com:4984/supermarket-aa"
   ```
5. Build and run on simulator or device

### Android Setup

1. Clone the repository
2. Open `GroceryApplication` in Android Studio
3. Add AAR files to `app/libs/`
4. Update App Endpoint URL:
   ```kotlin
   // AppServicesSyncManager.kt
   private val SYNC_GATEWAY_URL = "wss://your-endpoint.apps.cloud.couchbase.com:4984/supermarket-nyc"
   ```
5. Build and run

### Database Reset (for testing)

**iOS**:
```bash
xcrun simctl uninstall booted com.couchbase.GroceryApp
```

**Android**:
```bash
adb uninstall com.example.groceryapplication
```

---

## Contributing Guidelines

### Code Style
- **iOS**: Follow Swift API Design Guidelines
- **Android**: Follow Kotlin Coding Conventions
- Use meaningful variable names
- Add comments for complex logic

### Commit Messages
```
feat: Add order creation functionality
fix: Resolve inventory sync conflict
docs: Update CONTRIBUTING.md with P2P setup
refactor: Simplify image caching logic
```

### Pull Request Process

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/order-management`
3. **Make your changes** with clear commits
4. **Test thoroughly** on both iOS and Android
5. **Update documentation** if needed
6. **Submit PR** with description of changes

### Testing Checklist

- [ ] Login with valid/invalid credentials
- [ ] Profile fetch works correctly
- [ ] Inventory updates sync across devices
- [ ] Order creation and status updates work
- [ ] P2P sync works between devices
- [ ] Images load asynchronously without blocking UI
- [ ] App works offline (local changes queue for sync)

---

## Known Limitations (Phase 1)

- ❌ Improved authentication (not Oct target)
- ❌ Prebuilt database (not Oct target)
- ⚠️ Orders limited to ONE item per order
- ⚠️ Multiple item selection not implemented yet
- ⚠️ Order conflicts unlikely (each order is unique document)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Contributing! 🚀**
