# Couchbase Lite Retail Demo — React Native

A retail inventory management app for iOS and Android built with React Native (Expo), demonstrating Couchbase Lite's offline-first capabilities and real-time sync with Capella App Services.

> **New to Couchbase?** Read the [Key Concepts section in the root README](../README.md#key-concepts) first. It explains what Couchbase Lite, Capella, App Services, scopes, collections, and replication mean — terms that appear throughout this guide.

## How This App Works

This app demonstrates a common mobile architecture: **local-first storage with cloud sync**.

```
[React Native App (iOS or Android)]
           ↕  local reads & writes — always instant, works offline
[Couchbase Lite — embedded NoSQL database inside the app]
           ↕  WebSocket replication — runs in background when online
[Capella App Services — cloud sync gateway]
           ↕
[Couchbase Capella — cloud database cluster]
```

When you open the app and log in, Couchbase Lite opens a local database on the device. All reads and writes go to that local database immediately — there is no waiting for a network call. In the background, a **replicator** (the sync engine built into Couchbase Lite) connects to Capella App Services over a persistent WebSocket and syncs changes in both directions continuously.

If you go offline, the app keeps working normally. When you come back online, all changes made while offline are automatically pushed to the cloud and any missed remote changes are pulled down.

### Why Two Stores?

The demo simulates two separate supermarket locations: **Ann Arbor (AA-Store)** and **NYC (NYC-Store)**. Each store has its own scope in the database and its own App Endpoint in Capella. This shows how the same app binary can serve different tenants, each with isolated data, all syncing to the same cloud cluster.

---

## Prerequisites

> [!IMPORTANT]
> Before setting up the React Native app, you **must** complete the Capella backend configuration described in the [root README](../README.md). This means creating a Capella cluster, a `supermarket` bucket, `AA-Store` and `NYC-Store` scopes with `inventory`/`orders`/`profile` collections, importing the sample dataset, creating App Endpoints (`supermarket-aa`, `supermarket-nyc`), creating App Users, and copying the public connection URL. Without this, the app will open but won't sync any data.

---

## Requirements

- **Node.js**: 18 or later
- **npm**: Comes with Node.js
- **Expo CLI**: Installed via `npx` (no global install required)
- **Xcode**: 15.0 or later (for iOS builds — macOS only)
- **Android Studio**: Ladybug (2024.2.1) or later (for Android builds)
- **iOS Deployment Target**: 16.0 or later
- **Ruby**: 2.6.10 or later (needed by CocoaPods for iOS)

### Pre-Flight Checks

Run these before starting to avoid common setup failures:

```bash
# Verify Node version (must be 18+)
node --version

# Verify npm is available
npm --version

# iOS only: verify CocoaPods is installed
pod --version

# Android only: verify Java 17
java -version   # Must show 17.x
echo $JAVA_HOME # Must point to a JDK 17 installation
```

---

## Dependencies

Key dependencies (all declared in `package.json` and installed via `npm install`):

- **cbl-reactnative** 1.0.0 — Couchbase Lite for React Native. This is a native module that wraps the Couchbase Lite C++ SDK for both iOS and Android. It is **not** a pure JavaScript library, which is why a native build step is required (see [Why Prebuild is Required](#why-prebuild-is-required)).
- **expo** ~51.0.32 — Expo SDK
- **expo-router** ~3.5.23 — File-based navigation
- **react-native** 0.75.2
- **@rneui/themed** — React Native Elements UI components
- **react-native-uuid** — Unique ID generation

### Community Edition vs Enterprise Edition

The `cbl-reactnative` package ships with **Couchbase Lite Enterprise Edition (EE)**. EE is required for certain features and has different licensing terms than the Community Edition (CE):

| Feature | Community (CE) | Enterprise (EE) |
|---------|---------------|-----------------|
| Local database (CRUD, queries) | ✅ | ✅ |
| Cloud sync (App Services) | ✅ | ✅ |
| Encrypted database at rest | ❌ | ✅ |
| Delta sync (bandwidth-efficient) | ❌ | ✅ |

For production use, review [Couchbase licensing](https://www.couchbase.com/pricing/) to ensure EE is appropriate for your project.

---

## Getting Started

### Step 1: Install JavaScript Dependencies

```bash
cd react-native
npm install
```

### Step 2: Configure Capella App Services

> [!WARNING]
> The `app.json` file is where Capella credentials are stored. **Do not commit this file with real credentials to a public repository.** Replace the placeholder values below with your own and keep the file out of version control if it contains sensitive data.

Open `app.json` and update the `extra` section with the values from your Capella setup:

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

**What each value means:**

| Key | What it is | Where to find it |
|-----|-----------|-----------------|
| `cblBaseUrl` | The WebSocket URL of your App Services instance | Capella dashboard → App Services → your endpoint → **Connect** tab → **Public Connection URL**. Use the base URL only — do **not** append the database name. |
| `cblAADB` | The App Endpoint name for the Ann Arbor store | The name you gave when creating the AA App Endpoint (e.g., `supermarket-aa`) |
| `cblNYCDB` | The App Endpoint name for the NYC store | The name you gave when creating the NYC App Endpoint (e.g., `supermarket-nyc`) |
| `cblAAUser` | Login username for the Ann Arbor store | The App User you created in the `supermarket-aa` endpoint |
| `cblNYCUser` | Login username for the NYC store | The App User you created in the `supermarket-nyc` endpoint |
| `cblPassword` | Password for both demo users | The password you set when creating the App Users |

### Step 3: Generate Native Projects

> [!IMPORTANT]
> This step is required and is different from most Expo apps. Read [Why Prebuild is Required](#why-prebuild-is-required) if you want to understand why.

```bash
npx expo prebuild --clean
```

This generates the `ios/` and `android/` folders with native Xcode and Gradle projects. The `--clean` flag removes any previously generated folders first for a clean slate.

**Verify it worked:**
```bash
ls ios/      # Should exist and contain an Xcode project
ls android/  # Should exist and contain a Gradle project
```

### Step 4: Build and Run

#### iOS Simulator

```bash
npx expo run:ios
```

#### Android Emulator

```bash
npx expo run:android
```

> [!NOTE]
> The **first build will take several minutes** to compile the native Couchbase Lite C++ libraries for both platforms. Subsequent builds are much faster as the compiled output is cached.

---

## Why Prebuild is Required

Most Expo apps use the **managed workflow**, where Expo handles all native code for you and you never see an `ios/` or `android/` folder. You can just run `npx expo start` and it works.

This project uses the **bare workflow** because `cbl-reactnative` is a **native module** — it includes compiled C++ code (the Couchbase Lite engine) that must be linked into the iOS and Android build systems. Expo's managed workflow cannot do this automatically.

`npx expo prebuild` generates the native projects and runs `plugin.config.js` (see below) to wire up the Couchbase Lite SDK. After prebuild, you build and run using `npx expo run:ios` / `npx expo run:android` instead of `npx expo start`.

> If you re-run `npm install` or upgrade `cbl-reactnative`, run `npx expo prebuild --clean` again to regenerate the native projects with the updated library.

---

## Project Structure

```
react-native/
├── app/
│   ├── _layout.tsx                     # Root layout: wraps app in AuthProvider + navigation
│   ├── login.tsx                       # Login screen with demo credential auto-fill
│   ├── (tabs)/
│   │   ├── _layout.tsx                 # Tab navigator: wraps tabs in DatabaseProvider
│   │   ├── index.tsx                   # Inventory screen (product grid + search)
│   │   ├── profile.tsx                 # Store profile screen
│   │   ├── orders.tsx                  # Orders list with status filters
│   │   ├── scanner.tsx                 # Barcode scanner screen
│   │   └── settings.tsx                # Sync status, user info, sign out
├── models/
│   ├── AppConfig.ts                    # Store config, sync endpoint, credentials
│   ├── GroceryItem.ts                  # Inventory item type definition
│   ├── Order.ts                        # Order type definition
│   └── StoreProfile.ts                 # Store profile type definition
├── services/
│   └── database.service.ts             # ⭐ Core Couchbase Lite file — see below
├── providers/
│   ├── AuthProvider.tsx                # Manages login/logout state
│   ├── AuthContext.tsx                 # React context hook for auth state
│   ├── DatabaseProvider.tsx            # Opens/closes the database on mount/unmount
│   ├── DatabaseContext.tsx             # React context hook for database access
│   └── DatabaseContextType.ts         # TypeScript types for the database context
├── components/
│   ├── ThemedText.tsx                  # Text component with dark/light mode support
│   ├── ThemedView.tsx                  # View component with dark/light mode support
│   ├── navigation/TabBarIcon.tsx       # Tab bar icon
│   ├── searchBar/ThemedSearchBar.tsx   # Search input component
│   └── noResults/NoResults.tsx         # Empty-state component
├── hooks/
│   ├── useColorScheme.ts               # Detects system color scheme
│   └── useThemeColor.ts                # Returns the right color for current theme
├── constants/
│   └── Colors.ts                       # Color palette for light and dark themes
├── app.json                            # Expo config — Capella credentials live here
├── plugin.config.js                    # Expo config plugin — wires CBL into native builds
├── package.json                        # JavaScript dependencies
├── ios/                                # Generated iOS Xcode project (created by prebuild)
└── android/                            # Generated Android Gradle project (created by prebuild)
```

### Key Files to Understand

**`services/database.service.ts`** — This is the most important file in the project for understanding how Couchbase Lite works. It contains:
- Opening and closing the local `GroceryInventoryDB` database
- All CRUD operations (fetch inventory items, create orders, update quantities, etc.)
- Setting up the **replicator** that syncs data with Capella App Services
- Listening for live query changes and pushing updates to the UI

If you want to understand how this app uses Couchbase Lite, start here.

**`plugin.config.js`** — A custom Expo config plugin that modifies the native iOS and Android projects during `expo prebuild`. It adds the Couchbase Lite Gradle configuration to the Android build and links the CocoaPods podspec for iOS. You do not need to modify this file. It runs automatically during prebuild.

**`providers/DatabaseProvider.tsx`** — Manages the lifecycle of the Couchbase Lite database: opens it when the user logs in and closes it on sign-out. It wraps all tab screens so that every screen has access to the database via `DatabaseContext`.

---

## Configuration Details

### Database Structure

The app uses a single local database named `GroceryInventoryDB`. Inside it, data is organized using Couchbase Lite's scope/collection model:

| Scope | Collection | Contents |
|-------|-----------|----------|
| `AA-Store` | `inventory` | Product inventory items for the Ann Arbor store |
| `AA-Store` | `orders` | Customer orders for the Ann Arbor store |
| `AA-Store` | `profile` | Store profile for the Ann Arbor store |
| `NYC-Store` | `inventory` | Product inventory items for the NYC store |
| `NYC-Store` | `orders` | Customer orders for the NYC store |
| `NYC-Store` | `profile` | Store profile for the NYC store |

When a user logs in as an Ann Arbor user, the replicator syncs only the `AA-Store` scope. This keeps each store's data isolated.

### Sync Configuration

The app uses **continuous bidirectional replication** — the replicator keeps a persistent WebSocket connection to Capella App Services and syncs changes immediately in both directions as they happen.

Key settings in `AppConfig.ts`:
- `syncContinuous: true` — Enables real-time sync (as opposed to a one-shot sync)
- `syncEndpoint` — Constructed at runtime by combining `cblBaseUrl` from `app.json` with the store-specific database name (`cblAADB` or `cblNYCDB`)

### Demo Credentials

The app includes pre-configured demo credentials that match the App Users you created in Capella:

| Store | Username | Password |
|-------|----------|----------|
| Ann Arbor Store | `aa-store-01@supermarket.com` | `P@ssword1` |
| NYC Store | `nyc-store-01@supermarket.com` | `P@ssword1` |

Tap **View Demo Credentials** on the login screen to auto-fill them.

---

## Features

### Offline-First Architecture

All reads and writes go directly to the local Couchbase Lite database — there are no blocking network calls on the main thread. The app works fully offline: browse inventory, create orders, and update quantities without any internet connection. When connectivity returns, the replicator syncs all pending changes automatically.

### Real-Time Cloud Sync

The replicator maintains a live connection to Capella App Services and syncs changes immediately in both directions. A change made on an Android device running this app will appear on an iOS device (or the iOS/Android native versions of the app) within seconds.

### Cross-Platform from One Codebase

The React Native app runs on both iOS and Android from a single TypeScript codebase:
- File-based navigation with Expo Router
- Product inventory grid with real-time search
- Order creation and status filtering (All / Submitted / Approved)
- Store profile display
- Sync status monitoring and sign-out controls

---

## Troubleshooting

### Before You Build — Common Root Causes

Most build and runtime failures come from one of these:

1. **Skipped Capella setup** — The app opens but shows no data and fails to authenticate. Complete the [root README](../README.md) Capella setup first.
2. **`app.json` not updated** — The `cblBaseUrl` still has the placeholder value. Update it with your real endpoint URL.
3. **Prebuild not run** — Native module errors at build time. Run `npx expo prebuild --clean`.
4. **Wrong Java version for Android** — Gradle build errors. Must be Java 17.

### Build Errors

**"cbl-reactnative not found" or "Native module not found"**
- You must run `npx expo prebuild --clean` before the first build, and again after any native dependency changes.
- Try deleting the `ios/` and `android/` folders and re-running prebuild from scratch.

**iOS: CocoaPods errors during build**
```bash
cd ios && pod install --repo-update && cd ..
```
If that doesn't help, delete the `ios/` folder and run `npx expo prebuild --clean` again.

**Android: Gradle build fails**
```bash
# Verify Java 17
java -version    # Must show 17.x

# Clean and retry
cd android && ./gradlew clean && cd ..
npx expo run:android
```
Ensure `JAVA_HOME` points to a JDK 17 installation (`echo $JAVA_HOME`).

**Build is very slow on first run**
This is expected. Couchbase Lite includes native C++ libraries that take several minutes to compile the first time. Subsequent builds use the compiled cache and are much faster.

### Sync Issues

**Sync not connecting / stays in "connecting" state**
- Verify `cblBaseUrl` in `app.json` is the correct URL from your Capella dashboard and uses the `wss://` protocol (not `https://`).
- Confirm your Capella App Services endpoint is running (check the Capella dashboard).
- Check the Metro/terminal console for `[GrocerySync]` log messages — they will show connection errors.
- The Settings screen in the app shows live sync status.

**Authentication failures on login**
- Confirm the username and password in `app.json` (or typed manually) exactly match the App Users you created in Capella App Services.
- Verify `cblAADB` / `cblNYCDB` in `app.json` exactly match the App Endpoint names in Capella (they are case-sensitive).

### Runtime Issues

**App stuck on a loading spinner after login**
- Check the Metro console for errors during database initialization.
- Verify all `extra` values in `app.json` are filled in (no empty strings or placeholder values).
- Clear the Expo cache and retry: `npx expo start --clear`

**Logged in but no data appears**
- Confirm you imported the sample dataset into Capella (see [root README](../README.md)).
- Check that scope names in Capella (`AA-Store`, `NYC-Store`) exactly match the values in `AppConfig.ts` — they are case-sensitive.
- Pull down to refresh on the Inventory or Orders screens to trigger a manual reload.
- Look for errors in the Metro console filtered by `[GrocerySync]` or `[DatabaseService]`.

---

## Related Documentation

- [Root README](../README.md) — Key Concepts glossary, Capella setup, data model, architecture overview
- [iOS App README](../iOS/README.md) — Native Swift/SwiftUI version (includes peer-to-peer sync)
- [Android App README](../Android/README.md) — Native Kotlin/Compose version (includes peer-to-peer sync)
- [Web App README](../web/README.md) — React + TypeScript web version
- [cbl-reactnative on npm](https://www.npmjs.com/package/cbl-reactnative) — The React Native Couchbase Lite package
- [Couchbase Lite Documentation](https://docs.couchbase.com/couchbase-lite/current/index.html) — Full API reference
- [Capella App Services Documentation](https://docs.couchbase.com/cloud/app-services/index.html) — Sync gateway configuration
