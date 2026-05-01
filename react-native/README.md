# Couchbase Lite Retail Demo - React Native

A retail inventory management app for iOS and Android built with React Native (Expo), demonstrating Couchbase Lite's offline-first capabilities and real-time sync with Capella App Services.

## Prerequisites

> [!IMPORTANT]
> Before proceeding with the React Native setup, you **must** complete the Capella backend configuration described in the [root README](../README.md). This includes creating a Capella cluster, deploying an App Service, setting up the bucket/scopes/collections, importing the sample dataset, creating App Endpoints and App Users, and recording the public connection URL. If you skip these steps, the app will fail to authenticate and sync.

## Requirements

- **Node.js**: 18 or later
- **npm**: Comes with Node.js
- **Expo CLI**: Installed via npx (no global install required)
- **Xcode**: 15.0 or later (for iOS builds)
- **Android Studio**: Ladybug (2024.2.1) or later (for Android builds)
- **iOS Deployment Target**: 16.0 or later
- **Ruby**: 2.6.10 or later (for CocoaPods on iOS)

## Dependencies

The project uses npm for dependency management. Key dependencies:

- **cbl-reactnative**: 1.0.0 — Couchbase Lite for React Native
- **expo**: ~51.0.32 — Expo SDK
- **expo-router**: ~3.5.23 — File-based routing
- **react-native**: 0.75.2
- **@rneui/themed**: React Native Elements UI components
- **react-native-uuid**: Unique ID generation

All dependencies are declared in `package.json` and resolved with `npm install`.

## Getting Started

### 1. Install Dependencies

```bash
cd react-native
npm install
```

### 2. Configure Capella App Services

The app reads its Capella configuration from the `extra` section in `app.json`. Update the following values with your own Capella App Services details:

```json
{
  "expo": {
    "extra": {
      "cblBaseUrl": "wss://your-endpoint.apps.cloud.couchbase.com:4984",
      "cblAADB": "supermarket-aa",
      "cblNYCDB": "supermarket-nyc",
      "cblAAUser": "aa-store-01@supermarket.com",
      "cblNYCUser": "nyc-store-01@supermarket.com",
      "cblPassword": "P@ssword1"
    }
  }
}
```

**Where to find `cblBaseUrl`**: In your Capella dashboard, go to **App Services** > select your App Endpoint (e.g. `supermarket-nyc`) > **Connect** tab. Copy the **Public Connection URL** — it will look like `wss://<id>.apps.cloud.couchbase.com:4984`. Use only the base URL; do **not** append the database name (that is handled automatically by `cblAADB` / `cblNYCDB`).

### 3. Generate Native Projects

Since this project uses a native Couchbase Lite SDK, you must run Expo prebuild to generate the native iOS and Android projects:

```bash
npx expo prebuild --clean
```

### 4. Build and Run

#### iOS Simulator

```bash
npx expo run:ios
```

#### Android Emulator

```bash
npx expo run:android
```

> [!NOTE]
> The first build will take several minutes to compile native Couchbase Lite libraries. Subsequent builds are much faster.

## Project Structure

```
react-native/
├── app/
│   ├── _layout.tsx                     # Root layout with AuthProvider + navigation
│   ├── login.tsx                       # Login screen with demo credentials
│   ├── (tabs)/
│   │   ├── _layout.tsx                 # Tab navigator with DatabaseProvider
│   │   ├── index.tsx                   # Inventory screen (product grid + search)
│   │   ├── profile.tsx                 # Store profile screen
│   │   ├── orders.tsx                  # Orders list with status filters
│   │   ├── scanner.tsx                 # Barcode scanner screen
│   │   └── settings.tsx                # Sync status, user info, sign out
├── models/
│   ├── AppConfig.ts                    # Store config, sync endpoint, credentials
│   ├── GroceryItem.ts                  # Inventory item data model
│   ├── Order.ts                        # Order data model
│   └── StoreProfile.ts                # Store profile data model
├── services/
│   └── database.service.ts             # Couchbase Lite DB operations + replicator
├── providers/
│   ├── AuthProvider.tsx                # Authentication state management
│   ├── AuthContext.tsx                 # Auth context hook
│   ├── DatabaseProvider.tsx            # Database lifecycle management
│   ├── DatabaseContext.tsx             # Database context hook
│   └── DatabaseContextType.ts         # Database context type definitions
├── components/
│   ├── ThemedText.tsx                  # Theme-aware text component
│   ├── ThemedView.tsx                  # Theme-aware view component
│   ├── navigation/TabBarIcon.tsx       # Tab bar icon component
│   ├── searchBar/ThemedSearchBar.tsx   # Search bar component
│   └── noResults/NoResults.tsx         # Empty state component
├── hooks/
│   ├── useColorScheme.ts              # Color scheme detection
│   └── useThemeColor.ts               # Theme color utility
├── constants/
│   └── Colors.ts                       # Color palette
├── app.json                            # Expo config (including Capella credentials)
├── plugin.config.js                    # Expo config plugin for CBL native setup
├── package.json                        # Dependencies
├── ios/                                # Generated iOS project (after prebuild)
└── android/                            # Generated Android project (after prebuild)
```

## Configuration Details

### Database Settings

- **Database Name**: `GroceryInventoryDB`
- **Scopes**: `AA-Store`, `NYC-Store` (based on selected store)
- **Collections**:
  - `inventory` — Product inventory items
  - `orders` — Customer orders
  - `profile` — Store profile information

### Sync Configuration

The app uses continuous push-and-pull replication over a persistent WebSocket connection to Capella App Services. Changes are synced immediately in both directions.

Key settings in `AppConfig.ts`:
- `syncContinuous`: Enables real-time bidirectional sync
- `syncEndpoint`: Constructed from base URL + store-specific database name

### Demo Credentials

The app includes pre-configured demo credentials:

| Store | Username | Password |
|-------|----------|----------|
| Ann Arbor Store | `aa-store-01@supermarket.com` | `P@ssword1` |
| NYC Store | `nyc-store-01@supermarket.com` | `P@ssword1` |

Tap **View Demo Credentials** on the login screen to auto-fill.

## Features

### Real-Time Sync with Capella

The app syncs inventory, orders, and store profile data with your Capella cluster through App Services. Changes made in the app are immediately synced to the cloud and to other connected devices (iOS, Android, and web).

### Offline-First Architecture

The app works fully offline using Couchbase Lite as the local database. All operations (browse inventory, create orders, update quantities) work without network connectivity. When connectivity is restored, changes automatically sync to the cloud.

### Cross-Platform UI

The React Native app runs on both iOS and Android from a single codebase with:
- Expo Router file-based navigation
- Product inventory grid with search
- Real-time inventory count updates
- Order creation and status filtering (All / Submitted / Approved)
- Store profile display
- Sync status monitoring and sign out controls

## Troubleshooting

### Build Errors

**"cbl-reactnative not found" or native module errors**
- Ensure you ran `npx expo prebuild --clean` before building
- Try deleting `ios/` and `android/` folders and re-running prebuild

**iOS build fails with CocoaPods errors**
```bash
cd ios && pod install --repo-update && cd ..
```

**Android build fails with Gradle errors**
- Verify Java 17 is installed: `java -version`
- Check that `JAVA_HOME` is set correctly
- Try: `cd android && ./gradlew clean && cd ..`

### Sync Issues

**Sync not connecting**
- Verify `cblBaseUrl` in `app.json` is correct and uses `wss://` protocol
- Check that your App Services endpoint is running in Capella
- Look for `[GrocerySync]` messages in the Metro console
- Verify the Settings screen shows sync status as "idle" (connected)

**Authentication failures**
- Ensure the demo credentials match those configured in your Capella App Services App Users
- Verify `cblAADB` and `cblNYCDB` in `app.json` match your App Endpoint names

### Runtime Issues

**App stuck on loading spinner**
- Check Metro console for initialization errors
- Verify `app.json` has valid `extra` config values
- Try clearing the Expo cache: `npx expo start --clear`

**Data not appearing after login**
- Confirm your Capella cluster has data imported into the correct scope/collection
- Check that scope names (`NYC-Store`, `AA-Store`) match your Capella setup
- Pull down to refresh on the Inventory or Orders screens

## Related Documentation

- [Main Project README](../README.md) — Complete setup including Capella cluster configuration
- [iOS App README](../iOS/README.md) — iOS (Swift) version of this app
- [Android App README](../Android/README.md) — Android (Kotlin) version of this app
- [Web App README](../web/README.md) — Web (React + TypeScript) version of this app
- [cbl-reactnative on npm](https://www.npmjs.com/package/cbl-reactnative)
- [Couchbase Lite Documentation](https://docs.couchbase.com/couchbase-lite/current/index.html)
