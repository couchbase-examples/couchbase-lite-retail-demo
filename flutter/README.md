# Couchbase Lite Retail Demo - Flutter

A retail inventory management app for iOS and Android built with Flutter, demonstrating Couchbase Lite's offline-first capabilities and real-time sync with Capella App Services.

## Requirements

- **Flutter**: 3.29.3 or later (stable channel)
- **Dart**: 3.7.2 or later
- **Xcode**: 16.0 or later (for iOS builds)
- **Android Studio**: Ladybug (2024.2.1) or later (for Android builds)
- **iOS Deployment Target**: 14.0 or later
- **Android Min SDK**: 22 (Android 5.1 Lollipop)

## Dependencies

The project uses `pub` for dependency management. Key dependencies:

- **cbl**: 3.6.0+2 — Couchbase Lite for Dart (core API)
- **cbl_flutter**: 3.3.5 — Flutter plugin for Couchbase Lite
- **cbl_flutter_ce**: 3.5.1 — Couchbase Lite Community Edition binaries
- **cached_network_image**: Image loading and caching
- **flutter_dotenv**: Environment configuration
- **intl**: Date formatting
- **uuid**: Unique ID generation

All dependencies are declared in `pubspec.yaml` and resolved automatically with `flutter pub get`.

## Getting Started

### 1. Install Flutter

If you don't have Flutter installed:

```bash
# Download and extract Flutter SDK
curl -LO https://storage.googleapis.com/flutter_infra_release/releases/stable/macos/flutter_macos_arm64_3.29.3-stable.zip
unzip flutter_macos_arm64_3.29.3-stable.zip -d ~/flutter_sdk

# Add to PATH (add to ~/.zshrc for persistence)
export PATH="$HOME/flutter_sdk/flutter/bin:$PATH"

# Verify installation
flutter --version
flutter doctor
```

### 2. Get Dependencies

```bash
cd flutter
flutter pub get
```

### 3. Configure Capella App Services

Create a `.env` file in the `flutter/` directory with your Capella App Services endpoint:

```bash
cp .env.example .env
```

Edit `.env` with your endpoint:

```
SYNC_ENDPOINT=wss://your-endpoint.apps.cloud.couchbase.com:4984
```

You can find this URL in your **Capella App Services** dashboard under the **Connect** tab of your App Endpoint.

### 4. Build and Run

#### iOS Simulator

```bash
flutter run -d "iPhone 16 Pro"
```

#### Android Emulator

```bash
flutter run -d <emulator-name>
```

#### List Available Devices

```bash
flutter devices
```

The first build will take a few minutes to download native Couchbase Lite libraries and compile platform-specific code. Subsequent builds are much faster.

## Project Structure

```
flutter/
├── lib/
│   ├── main.dart                       # App entry point, CBL initialization
│   ├── config/
│   │   └── app_config.dart             # Configuration (database, sync, stores)
│   ├── models/
│   │   ├── grocery_item.dart           # GroceryItem data model
│   │   ├── order.dart                  # Order data model
│   │   └── store_profile.dart          # StoreProfile data model
│   ├── services/
│   │   ├── database_manager.dart       # Couchbase Lite database operations
│   │   ├── sync_manager.dart           # Sync with Capella App Services
│   │   └── auth_manager.dart           # User authentication
│   ├── screens/
│   │   ├── login_screen.dart           # Login with demo credentials
│   │   ├── landing_screen.dart         # Bottom navigation shell
│   │   ├── inventory_screen.dart       # Product inventory grid
│   │   ├── orders_screen.dart          # Order list with filters
│   │   ├── profile_screen.dart         # Store profile details
│   │   └── settings_screen.dart        # Sync controls, user info, sign out
│   ├── widgets/
│   │   ├── grocery_item_card.dart      # Product card with quantity controls
│   │   └── order_form_dialog.dart      # Create order dialog
│   └── theme/
│       └── app_theme.dart              # Material 3 theme (iOS-style design)
├── .env.example                        # Environment template
├── .env                                # Your local config (gitignored)
├── pubspec.yaml                        # Dependencies and assets
├── ios/                                # iOS platform files
└── android/                            # Android platform files
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

Key settings in `app_config.dart`:
- `syncHeartbeat`: 60 seconds (WebSocket keepalive)
- `syncMaxAttempts`: 10 (retry limit)
- `syncMaxAttemptWaitTime`: 300 seconds (max backoff)

### Demo Credentials

The app includes pre-configured demo credentials:

| Store | Username | Password |
|-------|----------|----------|
| NYC Store | `nyc-store-01@supermarket.com` | `P@ssword1` |
| AA Store | `aa-store-01@supermarket.com` | `P@ssword1` |

Tap **View Demo Credentials** on the login screen to auto-fill.

## Features

### Real-Time Sync with Capella

The app syncs inventory, orders, and store profile data with your Capella cluster through App Services. Changes made in the app are immediately synced to the cloud and to other connected devices (iOS, Android, and web).

### Offline-First Architecture

The app works fully offline using Couchbase Lite as the local database. All operations (browse inventory, create orders, update quantities) work without network connectivity. When connectivity is restored, changes automatically sync to the cloud.

### Cross-Platform UI

The Flutter app replicates the native iOS/Android UI design with:
- Material 3 theming with iOS-style aesthetics
- Product inventory grid with cached network images
- Real-time inventory count updates with +/- controls
- Order creation and filtering (All / In Review / Approved)
- Store profile display
- Sync status monitoring and toggle controls

## Building the App

### Debug Build (iOS)

```bash
flutter build ios --debug
```

### Debug Build (Android)

```bash
flutter build apk --debug
```

Output: `build/app/outputs/flutter-apk/app-debug.apk`

### Release Build (iOS)

```bash
flutter build ios --release
```

### Release Build (Android)

```bash
flutter build apk --release
```

### Run Static Analysis

```bash
flutter analyze
```

## Troubleshooting

### Build Errors

**"CocoaPods not installed" (iOS)**
```bash
sudo gem install cocoapods
cd ios && pod install
```

**"Couchbase Lite pod not found" (iOS)**
- Ensure the iOS deployment target is set to 14.0 or later in `ios/Podfile`
- Run `cd ios && pod install --repo-update`

**"minSdk too low" (Android)**
- Verify `android/app/build.gradle.kts` has `minSdk = 22`

### Sync Issues

**Sync not connecting**
- Verify your `.env` file contains the correct `SYNC_ENDPOINT` URL with `wss://` protocol
- Check that the App Services endpoint is running in Capella
- Look for sync status on the Settings screen (should show "Connected" when idle)
- Check debug logs in DevTools for `[SyncManager]` messages

**Authentication failures**
- Ensure the demo credentials match those configured in your Capella App Services App Users
- Verify the database names (`supermarket-aa` / `supermarket-nyc`) match your App Endpoints

### Runtime Issues

**Images not loading**
- The app bypasses SSL certificate verification in debug mode for S3-hosted images
- In release builds, ensure image URLs use valid HTTPS certificates
- Check that `NSAppTransportSecurity` is configured in `ios/Runner/Info.plist`

**Profile or orders not loading**
- Confirm your Capella cluster has data imported into the correct scope/collection
- Check that scope names (`NYC-Store`, `AA-Store`) and collection names match your Capella setup
- Pull to refresh on the Profile screen or tap the refresh icon on Orders

**App stuck on splash screen**
- Check DevTools console for initialization errors
- Verify `.env` file exists and contains a valid `SYNC_ENDPOINT`
- Try deleting the app from the simulator and reinstalling

### Community vs Enterprise Edition

This project uses Couchbase Lite **Community Edition** (`cbl_flutter_ce`). The Community Edition supports:
- Full CRUD operations
- SQL++ and QueryBuilder queries
- Replication with Sync Gateway / Capella App Services
- Full-Text Search

The Enterprise Edition (`cbl_flutter_ee`) adds:
- Encrypted databases
- Delta sync
- Peer-to-peer sync

To switch to Enterprise Edition, replace `cbl_flutter_ce` with `cbl_flutter_ee` in `pubspec.yaml`.

## Related Documentation

- [Main Project README](../README.md) — Complete setup including Capella cluster configuration
- [Android App README](../Android/README.md) — Android (Kotlin) version of this app
- [iOS App README](../iOS/README.md) — iOS (Swift) version of this app
- [Web App README](../web/README.md) — Web version of this app
- [Couchbase Lite for Dart Documentation](https://cbl-dart.dev/)
- [cbl package on pub.dev](https://pub.dev/packages/cbl)
- [cbl_flutter package on pub.dev](https://pub.dev/packages/cbl_flutter)
