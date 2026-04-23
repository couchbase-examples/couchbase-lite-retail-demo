# Couchbase Lite Retail Demo - Android

A retail inventory management app for Android demonstrating Couchbase Lite's offline-first capabilities, real-time sync with Capella App Services, and peer-to-peer sync between devices.

## Prerequisites

> [!IMPORTANT]
> Before proceeding with the Android setup, you **must** complete the Capella backend configuration described in the [root README](../README.md). This includes creating a Capella cluster, deploying an App Service, setting up the bucket/scopes/collections, importing the sample dataset, creating App Endpoints and App Users, and recording the public connection URL. If you skip these steps, the app will fail to authenticate and sync.

## Quick Start (For Already Configured Systems)

If you've already completed the initial setup and have Java 17 + Couchbase Lite EE installed:

```bash
# Open the project in Android Studio
open -a "Android Studio" /path/to/Android

# Or build from command line
cd /path/to/Android
./gradlew assembleDebug

# Install on device
./gradlew installDebug
```

**First time setup?** Continue reading below for complete installation instructions.

## Requirements and Dependencies

The following requirements apply to both macOS and Windows:

- **Android Studio**: Ladybug (2024.2.1) or later
- **Android SDK**:
  - Minimum SDK: 24 (Android 7.0 Nougat)
  - Target SDK: 35 (Android 15)
  - Compile SDK: 35
- **JDK**: 17 or later
- **Kotlin**: 2.0.21

The project uses Gradle with Kotlin DSL for dependency management. Key dependencies:

- **Couchbase Lite Android**: 3.3.0 (Enterprise Edition with KTX extensions)
- **Jetpack Compose**: Material 3 UI components
- **Kotlin Coroutines**: For asynchronous operations
- **Lifecycle Components**: ViewModel and LiveData

All dependencies are declared in `gradle/libs.versions.toml` and automatically resolved by Gradle.

### macOS-specific

- **Homebrew**: For installing Java on macOS (optional but recommended)

### Windows-specific

- [Git for Windows](https://git-scm.com/install/windows)

Android Studio manages library dependencies via Gradle. Third-party libraries such as Couchbase Lite Enterprise Edition are **not** bundled with the IDE and must be resolved from a Maven repository. If Gradle sync fails with SSL or certificate errors when fetching Couchbase Lite EE, complete the Windows equivalents of macOS [Step 2](#step-2-configure-gradle-for-ssl) and [Step 3](#step-3-install-couchbase-lite-enterprise-edition-local-repository) — concrete PowerShell commands are provided below.

> [!WARNING]
> Do **not** copy `-Djavax.net.ssl.trustStoreType=KeychainStore` verbatim on Windows. `KeychainStore` is macOS-only and the JVM on Windows will fail with a `KeyStoreException`. Either omit that JVM arg entirely (the JDK default trust store usually works), or replace it with `-Djavax.net.ssl.trustStoreType=Windows-ROOT` to use the Windows certificate store.

**Windows equivalent of Step 2 — global `gradle.properties` (PowerShell):**

```powershell
# Ensure the .gradle directory exists, then write global gradle.properties
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.gradle" | Out-Null
@'
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8 -Djavax.net.ssl.trustStoreType=Windows-ROOT
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true
'@ | Set-Content -Encoding ASCII "$env:USERPROFILE\.gradle\gradle.properties"
```

**Windows equivalent of Step 3 — download Couchbase Lite EE into local Maven repo.** We recommend `curl.exe` (ships with Windows 10 1803+ and Windows 11) because it mirrors the macOS instructions exactly and supports `-k` to bypass the SSL verification that triggers this step in the first place. PowerShell's `Invoke-WebRequest` has no simple `-k` equivalent.

PowerShell:

```powershell
$repo = "$env:USERPROFILE\.m2\repository\com\couchbase\lite"
$base = "https://mobile.maven.couchbase.com/maven2/dev/com/couchbase/lite"

# Create target directories
New-Item -ItemType Directory -Force -Path "$repo\couchbase-lite-android-ee-ktx\3.3.0" | Out-Null
New-Item -ItemType Directory -Force -Path "$repo\couchbase-lite-android-ee\3.3.0"     | Out-Null

# Download EE KTX (aar + pom) — -k bypasses SSL verification, -L follows redirects
curl.exe -kL "$base/couchbase-lite-android-ee-ktx/3.3.0/couchbase-lite-android-ee-ktx-3.3.0.aar" -o "$repo\couchbase-lite-android-ee-ktx\3.3.0\couchbase-lite-android-ee-ktx-3.3.0.aar"
curl.exe -kL "$base/couchbase-lite-android-ee-ktx/3.3.0/couchbase-lite-android-ee-ktx-3.3.0.pom" -o "$repo\couchbase-lite-android-ee-ktx\3.3.0\couchbase-lite-android-ee-ktx-3.3.0.pom"

# Download EE core (aar + pom)
curl.exe -kL "$base/couchbase-lite-android-ee/3.3.0/couchbase-lite-android-ee-3.3.0.aar" -o "$repo\couchbase-lite-android-ee\3.3.0\couchbase-lite-android-ee-3.3.0.aar"
curl.exe -kL "$base/couchbase-lite-android-ee/3.3.0/couchbase-lite-android-ee-3.3.0.pom" -o "$repo\couchbase-lite-android-ee\3.3.0\couchbase-lite-android-ee-3.3.0.pom"

# Verify
Get-ChildItem "$repo\couchbase-lite-android-ee\3.3.0"
Get-ChildItem "$repo\couchbase-lite-android-ee-ktx\3.3.0"
```

Command Prompt (CMD):

```cmd
set REPO=%USERPROFILE%\.m2\repository\com\couchbase\lite
set BASE=https://mobile.maven.couchbase.com/maven2/dev/com/couchbase/lite

mkdir "%REPO%\couchbase-lite-android-ee-ktx\3.3.0" 2>nul
mkdir "%REPO%\couchbase-lite-android-ee\3.3.0" 2>nul

curl.exe -kL "%BASE%/couchbase-lite-android-ee-ktx/3.3.0/couchbase-lite-android-ee-ktx-3.3.0.aar" -o "%REPO%\couchbase-lite-android-ee-ktx\3.3.0\couchbase-lite-android-ee-ktx-3.3.0.aar"
curl.exe -kL "%BASE%/couchbase-lite-android-ee-ktx/3.3.0/couchbase-lite-android-ee-ktx-3.3.0.pom" -o "%REPO%\couchbase-lite-android-ee-ktx\3.3.0\couchbase-lite-android-ee-ktx-3.3.0.pom"
curl.exe -kL "%BASE%/couchbase-lite-android-ee/3.3.0/couchbase-lite-android-ee-3.3.0.aar" -o "%REPO%\couchbase-lite-android-ee\3.3.0\couchbase-lite-android-ee-3.3.0.aar"
curl.exe -kL "%BASE%/couchbase-lite-android-ee/3.3.0/couchbase-lite-android-ee-3.3.0.pom" -o "%REPO%\couchbase-lite-android-ee\3.3.0\couchbase-lite-android-ee-3.3.0.pom"

dir "%REPO%\couchbase-lite-android-ee\3.3.0"
dir "%REPO%\couchbase-lite-android-ee-ktx\3.3.0"
```

> [!NOTE]
> The `-k` flag bypasses SSL certificate verification and is only needed for this one-time download. Once the files are in your local Maven repository, Gradle resolves them directly without further network access.

## Initial Setup (macOS)

### Step 1: Install Java 17

If you don't have Java 17 installed, install it using Homebrew:

```bash
# Install OpenJDK 17
brew install openjdk@17

# Configure environment variables in ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc

# Apply changes
source ~/.zshrc

# Verify installation
java -version
```

You should see: `openjdk version "17.0.x"`

### Step 2: Configure Gradle for SSL

Create global Gradle configuration to handle SSL certificates:

```bash
# Create global gradle.properties
cat > ~/.gradle/gradle.properties << 'EOF'
# Global Gradle properties
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8 -Djavax.net.ssl.trustStoreType=KeychainStore
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true
EOF
```

### Step 3: Install Couchbase Lite Enterprise Edition (Local Repository)

Due to SSL certificate issues with the Couchbase Maven repository, we need to manually download the Enterprise Edition libraries:

```bash
# Create local Maven repository directories
mkdir -p ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee-ktx/3.3.0
mkdir -p ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee/3.3.0

# Download EE KTX (72KB)
cd ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee-ktx/3.3.0
curl -L -k "https://mobile.maven.couchbase.com/maven2/dev/com/couchbase/lite/couchbase-lite-android-ee-ktx/3.3.0/couchbase-lite-android-ee-ktx-3.3.0.aar" -o couchbase-lite-android-ee-ktx-3.3.0.aar
curl -L -k "https://mobile.maven.couchbase.com/maven2/dev/com/couchbase/lite/couchbase-lite-android-ee-ktx/3.3.0/couchbase-lite-android-ee-ktx-3.3.0.pom" -o couchbase-lite-android-ee-ktx-3.3.0.pom

# Download EE Core (9.4MB)
cd ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee/3.3.0
curl -L -k "https://mobile.maven.couchbase.com/maven2/dev/com/couchbase/lite/couchbase-lite-android-ee/3.3.0/couchbase-lite-android-ee-3.3.0.aar" -o couchbase-lite-android-ee-3.3.0.aar
curl -L -k "https://mobile.maven.couchbase.com/maven2/dev/com/couchbase/lite/couchbase-lite-android-ee/3.3.0/couchbase-lite-android-ee-3.3.0.pom" -o couchbase-lite-android-ee-3.3.0.pom

# Verify files were downloaded
ls -lh ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee-ktx/3.3.0/
ls -lh ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee/3.3.0/
```

**Note**: The `-k` flag bypasses SSL certificate verification. This is only needed for the initial download. Once files are in your local Maven repository (`~/.m2/`), Gradle will use them directly.

After completing the macOS-specific steps above, continue with the [Common Setup Steps](#common-setup-steps) that apply to both platforms.

## Initial Setup (Windows)

### Step 1: Clone the Repository

We use Android Studio to clone the repository.

- Open Android Studio
- On the Welcome screen, click **Clone Repository**
- Enter URL `https://github.com/couchbase-examples/couchbase-lite-retail-demo.git`
- Select a folder into which to clone the repository
- Once the project has been cloned, **close the project** (File -> Close Project)
- Remove the project from recent history (Click the three dots and select **Remove from recent projects**)

### Step 2: Properly Import the Project into Android Studio

- On the Welcome screen, click **Open**
- Navigate to the folder into which you cloned the project
- Important: Do **not** select the main `couchbase-lite-retail-demo` folder. Instead, **select only the `Android` folder**
- Android Studio will now start a "Gradle Sync". At the bottom of the screen you will see a progress bar. Wait until this finishes. If it asks to "Trust Project," click Trust.

After import completes, proceed to the [Common Setup Steps](#common-setup-steps). In particular, modify the `gradle.properties` file as described in [Step 3: Configure Capella App Services — Option B: Gradle Properties](#option-b-gradle-properties). You can find the `gradle.properties` file after expanding `Gradle Scripts` on the left hand side.

## Common Setup Steps

The following steps apply to both macOS and Windows. Complete your platform-specific setup above before continuing.

### Step 1: Verify Prerequisites

Before opening the project, ensure the following. Commands below are shown for a Unix-like shell (macOS Terminal, Linux, or Git Bash on Windows); Windows Command Prompt / PowerShell equivalents are noted inline.

**macOS / Linux / Git Bash:**

```bash
# Check Java version
java -version  # Should show 17.0.x

# Check Gradle wrapper exists
cd <path-to-repo>/Android
ls -la gradlew  # Should exist and be executable

# Verify Couchbase EE (core + KTX) is installed locally
ls -la ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee/3.3.0/*.aar
ls -la ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee-ktx/3.3.0/*.aar
```

**Windows — Command Prompt (CMD):**

```cmd
:: Check Java version
java -version

:: Check Gradle wrapper exists (use gradlew.bat on Windows, not gradlew)
cd <path-to-repo>\Android
dir gradlew.bat

:: Verify Couchbase EE (core + KTX) is installed locally
dir %USERPROFILE%\.m2\repository\com\couchbase\lite\couchbase-lite-android-ee\3.3.0\*.aar
dir %USERPROFILE%\.m2\repository\com\couchbase\lite\couchbase-lite-android-ee-ktx\3.3.0\*.aar
```

**Windows — PowerShell:**

```powershell
# Check Java version
java -version

# Check Gradle wrapper exists (use gradlew.bat on Windows, not gradlew)
cd <path-to-repo>\Android
Get-ChildItem gradlew.bat

# Verify Couchbase EE (core + KTX) is installed locally
Get-ChildItem "$env:USERPROFILE\.m2\repository\com\couchbase\lite\couchbase-lite-android-ee\3.3.0\*.aar"
Get-ChildItem "$env:USERPROFILE\.m2\repository\com\couchbase\lite\couchbase-lite-android-ee-ktx\3.3.0\*.aar"
```

> [!NOTE]
> On Windows, always invoke `gradlew.bat` (not `gradlew`) from Command Prompt or PowerShell. The `gradlew` script without the `.bat` extension is a Unix shell script and will not run natively on Windows outside of a POSIX shell like Git Bash. Note also that `%USERPROFILE%` only works in CMD — PowerShell uses `$env:USERPROFILE`.

### Step 2: Open the Project

Open Android Studio and select **File** > **Open**, then navigate to the `Android` directory and open it.

Android Studio will automatically sync Gradle and resolve dependencies from:
1. Local Maven repository (`~/.m2/repository/` on macOS, `%USERPROFILE%\.m2\repository\` on Windows) for Couchbase Lite EE
2. Google Maven for Android libraries
3. Maven Central for other dependencies

This may take a few minutes on first open.

### Step 3: Configure Capella App Services

Before running the app, configure your Capella App Services connection using environment variables or Gradle properties.

**Where to find `CBL_BASE_URL`**: In your Capella dashboard, go to **App Services** > select your App Endpoint (e.g. `supermarket-nyc`) > **Connect** tab. Copy the **Public Connection URL** — it will look like `wss://<id>.apps.cloud.couchbase.com:4984`. Use only the base URL; do **not** append the database name (that is handled separately by `CBL_AA_DB` / `CBL_NYC_DB`).

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

On Windows, set the variables via **System Properties** > **Environment Variables**, or in a PowerShell session using `$env:CBL_BASE_URL = "..."`, then launch Android Studio from that same session.

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

## Build and Run

### Step 1: Create a Virtual Device

Creating a virtual device is documented at [Create and manage virtual devices | Android Studio | Android Developers](https://developer.android.com/studio/run/managing-avds). In short:

- Go to Tools -> Device Manager
- Click **Add a new device**, then **Create virtual device**
- Select, e.g., **Pixel 3a**
- On the next screen, select, e.g.:
    - API: **API 28 "Pie"**
    - System image: **Google Play Intel x86 Atom System Image** on Intel/AMD Macs and Windows PCs, or **Google Play ARM 64 v8a System Image** on Apple Silicon Macs (M1/M2/M3/M4). Choose the image matching your host architecture — emulating the wrong architecture is either unsupported or prohibitively slow.
- Click **Finish**

### Step 2: Run the app on the Emulator

At the top toolbar, ensure your virtual device emulator is selected. Click the **Green Run button (▶)**. The emulator comes up on the right hand side, running the application.

Further documentation: [Run apps on the Android Emulator | Android Studio | Android Developers](https://developer.android.com/studio/run/emulator#runningapp)

## Project Structure

```
Android/
├── app/
│   ├── src/main/
│   │   ├── java/com/example/groceryapplication/
│   │   │   ├── GroceryApplication.kt          # Application class
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

- **Database Name**: `GroceryInventoryDB`
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

**"Could not install Gradle distribution" or SSL/Certificate errors**

If you see errors related to Gradle distribution or SSL certificates:

```bash
# Stop all Gradle daemons
cd /path/to/Android
./gradlew --stop

# Clean caches
rm -rf .gradle/
rm -rf ~/.gradle/daemon/

# Verify global gradle.properties exists with SSL config
cat ~/.gradle/gradle.properties
# Should contain: -Djavax.net.ssl.trustStoreType=KeychainStore

# Restart Android Studio and sync again
```

**"Could not resolve com.couchbase.lite:couchbase-lite-android-ee-ktx"**

This usually means the Couchbase Lite EE libraries aren't in your local Maven repository:

```bash
# Verify the files exist
ls -la ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee/3.3.0/*.aar
ls -la ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee-ktx/3.3.0/*.aar

# If missing, re-run Step 3 from Initial Setup
```

Also verify that `settings.gradle.kts` includes `mavenLocal()`:

```kotlin
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        mavenLocal()  // Must be first!
        google()
        mavenCentral()
    }
}
```

**"BuildConfig cannot be resolved"**
- Make sure `buildFeatures { buildConfig = true }` is set in `app/build.gradle.kts`
- Sync project with Gradle files (**File** > **Sync Project with Gradle Files**)
- Verify all required environment variables or Gradle properties are set

**Gradle sync failures**
- Verify Java 17 is installed: `java -version`
- Check `JAVA_HOME` is set: `echo $JAVA_HOME`
- Update Android Gradle Plugin: **Tools** > **SDK Manager** > **SDK Tools**
- Clean and rebuild: **Build** > **Clean Project**, then **Build** > **Rebuild Project**
- Try invalidating caches: **File** > **Invalidate Caches** > **Invalidate and Restart**

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
1. Pull the database from device: `adb pull /data/data/com.example.groceryapplication/files/GroceryInventoryDB.cblite2`
2. Use `cblite` tool to query the database

## Additional Notes

### Configuration Files Created During Setup

The following files were created or configured during the initial setup process:

#### Global Configuration (`~/.gradle/gradle.properties`)

Contains JVM arguments and Gradle settings, including SSL certificate handling:

```properties
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8 -Djavax.net.ssl.trustStoreType=KeychainStore
org.gradle.daemon=true
org.gradle.parallel=true
org.gradle.caching=true
```

#### Project Configuration (`settings.gradle.kts`)

Configured with `mavenLocal()` repository to use locally downloaded Couchbase Lite EE:

```kotlin
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        mavenLocal()  // Check local Maven repository first
        google()
        mavenCentral()
        maven {
            url = uri("https://mobile.maven.couchbase.com/maven2/dev/")
            isAllowInsecureProtocol = false
        }
    }
}
```

#### Environment Variables (`~/.zshrc`)

Java configuration added to your shell profile:

```bash
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
```

### Enterprise vs Community Edition

This project uses Couchbase Lite Enterprise Edition, which includes features like:
- **Peer-to-peer sync** (MultipeerReplicator) - Required for this demo
- **Encrypted sync** - Additional security layer
- **Delta sync** - More efficient synchronization

The Community Edition does **not** include peer-to-peer sync, so the MultipeerSyncManager features won't work if you switch to CE.

To use the Community Edition (if you don't need P2P sync), change the dependency in `app/build.gradle.kts`:

```kotlin
// Replace enterprise edition
implementation("com.couchbase.lite:couchbase-lite-android-ee-ktx:3.3.0")

// With community edition (available on Maven Central)
implementation("com.couchbase.lite:couchbase-lite-android-ktx:3.3.0")
```

You would also need to comment out or remove the P2P sync functionality in:
- `MultipeerSyncManager.kt`
- `MultipeerSyncComponents.kt`
- References to MultipeerSyncManager in other screens

### Verification Commands

To verify your setup:

```bash
# Check Java
java -version  # Should show: openjdk version "17.0.x"

# Check Gradle
./gradlew --version  # Should show: Gradle 8.11.1

# Check Couchbase EE locally installed
ls -la ~/.m2/repository/com/couchbase/lite/couchbase-lite-android-ee/3.3.0/*.aar

# Test build
./gradlew assembleDebug  # Should complete successfully
```

## Related Documentation

- [Main Project README](../README.md) - Complete setup including Capella cluster configuration
- [iOS App README](../iOS/README.md) - iOS version of this app
- [Web App README](../web/README.md) - Web version of this app
- [Couchbase Lite Android Documentation](https://docs.couchbase.com/couchbase-lite/current/android/quickstart.html)
