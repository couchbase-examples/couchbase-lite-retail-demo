# Couchbase Lite Retail Demo - iOS

A retail inventory management app for iOS demonstrating Couchbase Lite's offline-first capabilities, real-time sync with Capella App Services, and peer-to-peer sync between devices.

## Requirements

- **Xcode**: 16.4 or later
- **iOS**: 18.5 or later
- **Swift**: 6.0 (included with Xcode)
- **macOS**: Sonoma or later (for running Xcode 16.4)

## Dependencies

The project uses Swift Package Manager (SPM) for dependency management. Dependencies are automatically resolved when you open the project:

- **Couchbase Lite Swift**: 3.3.0 (Enterprise Edition)

## Getting Started

### 1. Open the Project

Open the Xcode project:

```bash
cd iOS
open LiquorApp.xcodeproj
```

Xcode will automatically resolve and download the required Swift packages when you first open the project.

### 2. Configure Capella App Services

Before running the app, you need to configure your Capella App Services connection. You have three options:

#### Option A: Info.plist (Recommended)

Add the configuration values to your `Info.plist` file:

1. Open `LiquorApp/Info.plist` in Xcode
2. Add the following keys and values:
   - `CBL_BASE_URL`: `wss://your-endpoint.apps.cloud.couchbase.com:4984`
   - `CBL_AA_DB`: `supermarket-aa`
   - `CBL_NYC_DB`: `supermarket-nyc`
   - `CBL_AA_USER`: `aa-store-01@supermarket.com`
   - `CBL_NYC_USER`: `nyc-store-01@supermarket.com`
   - `CBL_PASSWORD`: `P@ssword1`

This is the most common approach for iOS projects and keeps configuration in a standard location.

#### Option B: Environment Variables (Terminal Launch)

Set environment variables in your shell:

```bash
export CBL_BASE_URL="wss://your-endpoint.apps.cloud.couchbase.com:4984"
export CBL_AA_DB="supermarket-aa"
export CBL_NYC_DB="supermarket-nyc"
export CBL_AA_USER="aa-store-01@supermarket.com"
export CBL_NYC_USER="nyc-store-01@supermarket.com"
export CBL_PASSWORD="P@ssword1"
```

Then launch Xcode from the terminal to inherit these variables:

```bash
open LiquorApp.xcodeproj
```

#### Option C: Xcode Scheme Configuration

1. In Xcode, select **Product** > **Scheme** > **Edit Scheme**
2. Go to **Run** > **Arguments** tab
3. Add the environment variables under **Environment Variables**:
   - `CBL_BASE_URL`: `wss://your-endpoint.apps.cloud.couchbase.com:4984`
   - `CBL_AA_DB`: `supermarket-aa`
   - `CBL_NYC_DB`: `supermarket-nyc`
   - `CBL_AA_USER`: `aa-store-01@supermarket.com`
   - `CBL_NYC_USER`: `nyc-store-01@supermarket.com`
   - `CBL_PASSWORD`: `P@ssword1`

**Note**: The app checks environment variables first, then falls back to Info.plist. Choose whichever method works best for your workflow.


### 3. Build and Run

Select a simulator or connected device and click **Run** (⌘R).

## Project Structure

```
iOS/
├── LiquorApp/
│   ├── App.swift                        # Main app entry point
│   ├── AppConfig.swift                  # Configuration (database, sync, stores)
│   ├── DatabaseManager.swift            # Couchbase Lite database operations
│   ├── AppServicesSyncManager.swift     # Sync with Capella App Services
│   ├── GroceryMultipeerSyncManager.swift # Peer-to-peer sync
│   ├── AuthenticationManager.swift      # User authentication
│   ├── Views/
│   │   ├── LoginView.swift
│   │   ├── InventoryView.swift
│   │   ├── OrdersView.swift
│   │   └── StoreProfileView.swift
│   └── Models/
│       ├── LiquorItem.swift
│       ├── Order.swift
│       └── StoreProfile.swift
└── LiquorApp.xcodeproj
```

## Configuration Details

### Database Settings

- **Database Name**: `LiquorInventoryDB`
- **Scopes**: `AA-Store`, `NYC-Store` (based on selected store)
- **Collections**: 
  - `inventory` - Product inventory items
  - `orders` - Customer orders
  - `profile` - Store profile information

### Sync Configuration

The app uses continuous replication, which is event-driven (not polling). Changes are pushed and pulled immediately over a persistent WebSocket connection to Capella App Services.

Key settings in `AppConfig.swift`:
- `syncContinuous`: Enables real-time bidirectional sync
- `enableAppServicesSync`: Toggle cloud sync on/off
- `enableP2PSync`: Toggle peer-to-peer sync on/off

## Features

### Real-Time Sync with Capella

The app syncs inventory, orders, and store profile data with your Capella cluster through App Services. Changes made in the app are immediately synced to the cloud and to other connected devices.

### Peer-to-Peer Sync

Devices on the same local network can sync directly with each other without going through the cloud. This is useful for:
- Demo scenarios with multiple devices
- Offline collaboration between nearby devices
- Reducing cloud bandwidth usage

To enable P2P sync, ensure `enableP2PSync` is set to `true` in `AppConfig.swift`.

### Offline-First Architecture

The app works fully offline using Couchbase Lite as the local database. All operations (create, read, update, delete) work without network connectivity. When connectivity is restored, changes automatically sync to the cloud.

## Troubleshooting

### Build Errors

**"Cannot find 'CouchbaseLiteSwift' in scope"**
- Wait for SPM to finish resolving packages (check progress in Xcode's top status bar)
- Try **File** > **Packages** > **Reset Package Caches**
- Clean build folder: **Product** > **Clean Build Folder** (⇧⌘K)

**"Could not resolve package dependencies"**
- Ensure you have an active internet connection
- Check that the package URLs in `Package.resolved` are accessible
- Try removing and re-adding the packages in **File** > **Packages**

### Sync Issues

**Sync not working**
- Verify your `CBL_BASE_URL` is correct and includes `wss://` protocol
- Check that environment variables are set correctly
- Verify your App Services endpoint is running in Capella
- Check Xcode console for sync-related error messages

**Authentication failures**
- Ensure the user credentials match those configured in Capella App Services
- Verify the database name (`CBL_AA_DB` or `CBL_NYC_DB`) matches your App Endpoint

### Runtime Issues

**App crashes on launch**
- Check Xcode console for crash logs
- Verify all required environment variables are set
- Ensure the selected iOS simulator/device meets the minimum iOS version (18.5)

**Data not appearing**
- Confirm your Capella cluster has data imported into the correct scope/collection
- Check that `scopeName` and collection names in `AppConfig.swift` match your Capella setup
- Look for database errors in the console output


## Additional Notes

### Enterprise vs Community Edition

This project uses Couchbase Lite Enterprise Edition, which includes additional features like encrypted sync and delta sync. If you need to use the Community Edition, update the package dependency in Xcode to point to the community repository.

### P2P Network Discovery

Peer-to-peer sync uses Bonjour/mDNS for device discovery on the local network. Make sure:
- Devices are on the same Wi-Fi network
- Local network permissions are granted to the app
- Firewall settings allow Bonjour traffic


## Related Documentation

- [Main Project README](../README.md) - Complete setup including Capella cluster configuration
- [Android App README](../Android/README.md) - Android version of this app
- [Web App README](../web/README.md) - Web version of this app
- [Couchbase Lite iOS Documentation](https://docs.couchbase.com/couchbase-lite/current/swift/quickstart.html)

