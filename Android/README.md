# Couchbase Lite Retail Demo - Android

A retail inventory management app for Android demonstrating Couchbase Lite's offline-first capabilities, real-time sync with Capella App Services, and peer-to-peer sync between devices.

## Requirements

- **Android Studio**: Ladybug (2024.2.1) or later
- **Android SDK**: 
  - Minimum SDK: 24 (Android 7.0 Nougat)
  - Target SDK: 35 (Android 15)
  - Compile SDK: 35
- **JDK**: 17 or later (bundled with Android Studio)
- **Kotlin**: 2.0.21

## Dependencies

The project uses Gradle with Kotlin DSL for dependency management. Key dependencies:

- **Couchbase Lite Android**: 3.3.0 (Enterprise Edition with KTX extensions)
- **Jetpack Compose**: Material 3 UI components
- **Kotlin Coroutines**: For asynchronous operations
- **Lifecycle Components**: ViewModel and LiveData

All dependencies are declared in `gradle/libs.versions.toml` and automatically downloaded by Gradle.

## Getting Started

### 1. Open the Project

Open Android Studio and select **File** > **Open**, then navigate to the `Android` directory and open it.

Android Studio will automatically sync Gradle and download all required dependencies. This may take a few minutes on first open.

### 2. Configure Capella App Services

Before running the app, configure your Capella App Services connection using environment variables or Gradle properties.

#### Option A: Environment Variables (Recommended)

Set these environment variables before running Android Studio:

```bash
export CBL_BASE_URL="wss://your-endpoint.apps.cloud.couchbase.com:4984"
export CBL_AA_DB="supermarket-aa"
export CBL_NYC_DB="supermarket-nyc"
export CBL_AA_USER="aa-store-01@supermarket.com"
export CBL_NYC_USER="nyc-store-01@supermarket.com"
export CBL_PASSWORD="P@ssword1"
```

Then launch Android Studio from the same terminal:

```bash
studio.sh  # or open -a "Android Studio" on macOS
```

#### Option B: Gradle Properties

Add these properties to your local `gradle.properties` file (create it in the `Android` directory if it doesn't exist):

```properties
CBL_BASE_URL=wss://your-endpoint.apps.cloud.couchbase.com:4984
CBL_AA_DB=supermarket-aa
CBL_NYC_DB=supermarket-nyc
CBL_AA_USER=aa-store-01@supermarket.com
CBL_NYC_USER=nyc-store-01@supermarket.com
CBL_PASSWORD=P@ssword1
```

**Note**: Do not commit `gradle.properties` with sensitive credentials to version control.

### 3. Build and Run

Select an emulator or connected device from the device dropdown and click **Run** (▶).

## Project Structure

```
Android/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/liquorapplication/
│   │   │   ├── LiquorApplication.kt          # Application class
│   │   │   ├── MainActivity.kt                # Main activity with Compose setup
│   │   │   ├── AppConfig.kt                   # Configuration (database, sync, stores)
│   │   │   ├── DatabaseManager.kt             # Couchbase Lite database operations
│   │   │   ├── AppServicesSyncManager.kt      # Sync with Capella App Services
│   │   │   ├── MultipeerSyncManager.kt        # Peer-to-peer sync
│   │   │   ├── AuthenticationManager.kt       # User authentication
│   │   │   ├── Screens/
│   │   │   │   ├── LoginScreen.kt
│   │   │   │   ├── InventoryScreen.kt
│   │   │   │   ├── OrdersScreen.kt
│   │   │   │   └── ProfileScreen.kt
│   │   │   └── Models/
│   │   │       ├── GroceryItem.kt
│   │   │       ├── Order.kt
│   │   │       └── StoreProfile.kt
│   │   ├── res/                               # Resources (layouts, drawables, etc.)
│   │   └── AndroidManifest.xml
│   ├── build.gradle.kts                       # App-level Gradle build file
│   └── proguard-rules.pro
├── gradle/
│   ├── libs.versions.toml                     # Centralized dependency versions
│   └── wrapper/                               # Gradle wrapper files
├── build.gradle.kts                           # Project-level Gradle build file
└── gradle.properties                          # Gradle configuration
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

Key settings in `AppConfig.kt`:
- `SYNC_CONTINUOUS`: Enables real-time bidirectional sync
- `ENABLE_APP_SERVICES_SYNC`: Toggle cloud sync on/off
- `ENABLE_P2P_SYNC`: Toggle peer-to-peer sync on/off

## Features

### Real-Time Sync with Capella

The app syncs inventory, orders, and store profile data with your Capella cluster through App Services. Changes made in the app are immediately synced to the cloud and to other connected devices.

### Peer-to-Peer Sync

Devices on the same local network can sync directly with each other without going through the cloud. This is useful for:
- Demo scenarios with multiple devices
- Offline collaboration between nearby devices
- Reducing cloud bandwidth usage

P2P sync uses the same peer group ID as the iOS app, enabling cross-platform local sync between Android and iOS devices.

### Offline-First Architecture

The app works fully offline using Couchbase Lite as the local database. All operations (create, read, update, delete) work without network connectivity. When connectivity is restored, changes automatically sync to the cloud.

### Jetpack Compose UI

The app is built entirely with Jetpack Compose, Google's modern declarative UI toolkit for Android. This provides a responsive and intuitive user experience.

## Building the App

### Debug Build

```bash
./gradlew assembleDebug
```

Output: `app/build/outputs/apk/debug/app-debug.apk`

### Release Build

```bash
./gradlew assembleRelease
```

For production releases, configure signing in `app/build.gradle.kts`.

### Install on Device

```bash
./gradlew installDebug
```

## Troubleshooting

### Build Errors

**"Could not resolve com.couchbase.lite:couchbase-lite-android-ee-ktx"**
- Ensure you have internet connectivity for Gradle to download dependencies
- Try **File** > **Invalidate Caches** > **Invalidate and Restart**
- Check your `gradle/libs.versions.toml` has the correct Couchbase Lite version

**"BuildConfig cannot be resolved"**
- Make sure `buildFeatures { buildConfig = true }` is set in `app/build.gradle.kts`
- Sync project with Gradle files (**File** > **Sync Project with Gradle Files**)
- Verify all required environment variables or Gradle properties are set

**Gradle sync failures**
- Update Android Gradle Plugin: **Tools** > **SDK Manager** > **SDK Tools**
- Check you have JDK 17 or later installed
- Clean and rebuild: **Build** > **Clean Project**, then **Build** > **Rebuild Project**

### Sync Issues

**Sync not working**
- Verify your `CBL_BASE_URL` is correct and includes `wss://` protocol
- Check that configuration variables are properly set (check Logcat for printed config)
- Verify your App Services endpoint is running in Capella
- Check Logcat for sync-related error messages (filter by "AppServicesSyncManager")

**Authentication failures**
- Ensure the user credentials match those configured in Capella App Services
- Verify the database name (`CBL_AA_DB` or `CBL_NYC_DB`) matches your App Endpoint
- Check that the username format matches the expected pattern

### Runtime Issues

**App crashes on launch**
- Check Logcat for stack traces
- Verify all required configuration values are set (not empty strings)
- Ensure the device/emulator meets minimum API level 24

**Data not appearing**
- Confirm your Capella cluster has data imported into the correct scope/collection
- Check that scope and collection names in `AppConfig.kt` match your Capella setup
- Look for database errors in Logcat (filter by "DatabaseManager")

**P2P sync not discovering devices**
- Ensure devices are on the same Wi-Fi network
- Check that local network permissions are granted
- Verify the `P2P_PEER_GROUP_ID` is the same across all devices
- Look for P2P-related logs in Logcat (filter by "MultipeerSyncManager")


## Debugging

### Enable Verbose Logging

Couchbase Lite logging can be configured in `DatabaseManager.kt` to help debug sync and database issues:

```kotlin
Database.log.console.level = LogLevel.VERBOSE
```

### Inspect Database

You can use the Couchbase Lite command-line tool to inspect the database file:
1. Pull the database from device: `adb pull /data/data/com.example.liquorapplication/files/LiquorInventoryDB.cblite2`
2. Use `cblite` tool to query the database

## Additional Notes

### Enterprise vs Community Edition

This project uses Couchbase Lite Enterprise Edition, which includes features like encrypted sync and delta sync. To use the Community Edition, change the dependency in `app/build.gradle.kts`:

```kotlin
// Replace enterprise edition
implementation("com.couchbase.lite:couchbase-lite-android-ee-ktx:3.3.0")

// With community edition
implementation("com.couchbase.lite:couchbase-lite-android-ktx:3.3.0")
```

## Related Documentation

- [Main Project README](../README.md) - Complete setup including Capella cluster configuration
- [iOS App README](../iOS/README.md) - iOS version of this app
- [Web App README](../web/README.md) - Web version of this app
- [Couchbase Lite Android Documentation](https://docs.couchbase.com/couchbase-lite/current/android/quickstart.html)

