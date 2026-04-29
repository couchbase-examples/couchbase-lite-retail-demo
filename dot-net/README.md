# Couchbase Lite Retail Demo - .NET MAUI

A retail inventory management app for iOS, Android, macOS (Mac Catalyst), and Windows built with .NET MAUI, demonstrating Couchbase Lite's offline-first capabilities and real-time sync with Capella App Services.

## Prerequisites

> [!IMPORTANT]
> Before proceeding with the .NET MAUI setup, you **must** complete the Capella backend configuration described in the [root README](../README.md). This includes creating a Capella cluster, deploying an App Service, setting up the bucket / scopes / collections, importing the sample dataset, creating App Endpoints and App Users, and recording the public connection URL. If you skip these steps, the app will fail to authenticate and sync.

## Requirements

- **.NET SDK**: 10.0 or later
- **.NET MAUI workload**: installed via `dotnet workload install maui`
- **Xcode**: 26.3 or later (only for iOS / Mac Catalyst builds)
- **Android SDK**: API level 36 (auto-installed via `dotnet build -t:InstallAndroidDependencies`)
- **JDK**: 17 (for Android builds)
- **Visual Studio 2022 17.12+** or **VS Code with .NET MAUI extension** (optional)
- **Couchbase Lite for C#**: 4.0.3 (Enterprise Edition)

## Dependencies

The project uses NuGet for dependency management. Key packages (declared in `GroceryApp.csproj`):

- **Couchbase.Lite.Enterprise**: 4.0.3 — Couchbase Lite for .NET
- **Microsoft.Maui.Controls**: 10.0.0 — MAUI base
- **CommunityToolkit.Mvvm**: 8.4.0 — ObservableObject + RelayCommand source generators
- **Microsoft.Extensions.Logging.Debug**: 10.0.0 — Debug logging

NuGet packages are restored automatically with `dotnet restore`.

## Getting Started

### 1. Clone and Open the Project

```bash
cd dot-net
```

Open `GroceryApp.sln` in **Visual Studio 2022** (Windows) / **Visual Studio for Mac**, or use the `dotnet` CLI directly.

### 2. Configure Capella App Services

The app reads its Capella configuration from a packaged `.env` file located at `Resources/Raw/.env`. Copy the example and fill in your own Capella values:

```bash
cp Resources/Raw/.env.example Resources/Raw/.env
```

Edit `Resources/Raw/.env`:

```
CBL_BASE_URL=wss://your-endpoint.apps.cloud.couchbase.com:4984
CBL_AA_DB=supermarket-aa
CBL_NYC_DB=supermarket-nyc
CBL_AA_USER=aa-store-01@supermarket.com
CBL_NYC_USER=nyc-store-01@supermarket.com
CBL_PASSWORD=P@ssword1
```

**Where to find `CBL_BASE_URL`**: In your Capella dashboard, go to **App Services** > select your App Endpoint (e.g. `supermarket-nyc`) > **Connect** tab. Copy the **Public Connection URL** — it will look like `wss://<id>.apps.cloud.couchbase.com:4984`. Use only the base URL; do **not** append the database name (that is appended automatically based on the user's store).

The `.env` file is bundled as a `MauiAsset` and read at startup by `EnvLoader`, which seeds the values into MAUI `Preferences` so they persist across launches.

### 3. Restore Workloads & Packages

```bash
dotnet workload install maui
dotnet workload restore
dotnet restore
```

If your machine is missing Android SDK API 36, install it via the MAUI helper (one-time setup):

```bash
dotnet build -t:InstallAndroidDependencies -f net10.0-android \
    -p:AndroidSdkDirectory=$HOME/Library/Android/sdk \
    -p:AcceptAndroidSDKLicenses=true
```

### 4. Build and Run

#### Android (emulator or device)

```bash
dotnet build -f net10.0-android
dotnet run -f net10.0-android
```

#### iOS (simulator or device, macOS only)

```bash
dotnet build -f net10.0-ios
dotnet run -f net10.0-ios
```

#### Mac Catalyst (macOS only)

```bash
dotnet build -f net10.0-maccatalyst
dotnet run -f net10.0-maccatalyst
```

#### Windows (Windows 10 1809+ only)

```bash
dotnet build -f net10.0-windows10.0.19041.0
dotnet run -f net10.0-windows10.0.19041.0
```

> [!NOTE]
> The first build downloads Couchbase Lite native binaries (~30 MB per platform) and can take several minutes. Subsequent builds are much faster.

## Project Structure

```
dot-net/
├── App.xaml / App.xaml.cs              # Application root, creates AppShell on Window
├── AppShell.xaml / .xaml.cs            # Shell with Login route + main TabBar
├── MauiProgram.cs                      # DI registration + .env loading
├── Models/
│   ├── AppConfig.cs                    # Store, sync, scope/collection names; .env-driven
│   ├── GroceryItem.cs                  # Inventory item model (maps to Capella JSON)
│   ├── Order.cs                        # Order model + flexible orderId handling
│   ├── StoreProfile.cs                 # Profile model (contact, location, manager)
│   ├── User.cs                         # Auth user + DemoUser + LoginResult
│   └── AppServicesSyncState.cs         # Immutable sync state with copy-on-update helper
├── Services/
│   ├── DatabaseManager.cs              # Owns DB, scoped collections, queries, listeners
│   ├── AppServicesSyncManager.cs       # Continuous WebSocket replicator + state
│   ├── AuthenticationManager.cs        # Session persisted in local "AuthDB"
│   └── EnvLoader.cs                    # Reads Resources/Raw/.env into Preferences
├── ViewModels/
│   ├── BaseViewModel.cs                # Shared IsBusy / ErrorMessage observables
│   ├── LoginViewModel.cs               # Demo credentials, login command
│   ├── InventoryViewModel.cs           # List, search, increment/decrement, order
│   ├── OrdersViewModel.cs              # Filter chips (All/Submitted/Approved/In Review)
│   ├── ProfileViewModel.cs             # Live store profile from synced data
│   └── SettingsViewModel.cs            # Sync status + toggle/reset + sign out
├── Views/
│   ├── LoginPage.xaml / .xaml.cs       # Login form + collapsible demo credentials
│   ├── InventoryPage.xaml / .xaml.cs   # Search bar + grid, +/- quantity, "Order Stock"
│   ├── OrdersPage.xaml / .xaml.cs      # Status filter chips + orders list
│   ├── ProfilePage.xaml / .xaml.cs     # Store name, address, contact, manager
│   └── SettingsPage.xaml / .xaml.cs    # Sync toggle, reset, last sync time, sign out
├── Converters/
│   └── Converters.cs                   # XAML value converters (bool, null, eye, sync label)
├── Platforms/
│   ├── Android/MainActivity.cs         # Calls Couchbase.Lite.Support.Droid.Activate(this)
│   ├── iOS/                            # iOS launch + Info.plist
│   ├── MacCatalyst/                    # Mac Catalyst entry
│   └── Windows/                        # WinUI / Windows entry
├── Resources/
│   ├── Raw/.env.example                # Template for Capella config
│   ├── Fonts/                          # OpenSans
│   ├── Images/                         # MAUI image assets
│   ├── Colors.xaml / Styles.xaml       # MAUI theme
│   └── appicon.svg / appiconfg.svg     # App icon source
├── GroceryApp.csproj                   # Multi-target project (android/ios/maccatalyst/windows)
└── README.md
```

## Configuration Details

### Database Settings

- **Local Database Name**: `GroceryInventoryDB`
- **Auth Database Name**: `AuthDB` (separate database for session persistence)
- **Scopes**: `AA-Store`, `NYC-Store` (chosen at login based on user's email prefix)
- **Collections**:
  - `inventory` — Product inventory items
  - `orders` — Customer orders
  - `profile` — Store profile information

### Sync Configuration

- **Type**: Push and Pull
- **Continuous**: True (event-driven, real-time WebSocket — not polling)
- **Heartbeat**: 60 seconds (WebSocket keepalive)
- **Max Attempts**: 10
- **Max Attempt Wait Time**: 300 seconds

### Demo Credentials

The app includes pre-configured demo credentials:

| Store | Username | Password |
|-------|----------|----------|
| Ann Arbor Store | `aa-store-01@supermarket.com` | `P@ssword1` |
| NYC Store | `nyc-store-01@supermarket.com` | `P@ssword1` |

Tap **View Demo Credentials** on the login screen and select **Use This** to auto-fill.

## Features

### Real-Time Sync with Capella App Services

The app maintains a continuous WebSocket connection to your Capella cluster's App Services endpoint. Inventory, orders, and store profile changes are pushed and pulled immediately to/from the cloud, and to/from other connected devices (iOS, Android, React Native, web, .NET).

### Offline-First Architecture

Couchbase Lite provides a local NoSQL database that fully works offline. All operations (browse, search, update quantity, create orders) work without network connectivity. Changes queue locally and automatically sync when the device reconnects.

### Cross-Platform UI (MAUI)

Single codebase running on:
- iOS / iPadOS
- Android
- macOS (Mac Catalyst)
- Windows

The UI is built with XAML + MVVM (CommunityToolkit.Mvvm), targeting feature parity with the Swift / Kotlin / React Native versions:
- Login screen with demo credentials picker
- Inventory list with live search, +/- quantity, and one-tap order creation
- Orders list with status filters (All / Submitted / Approved / In Review)
- Store profile card with address, contact, manager, hours
- Settings: sync status, last sync time, toggle/reset, sign out

### Session Persistence

Login sessions are stored in a separate local Couchbase Lite database (`AuthDB`), so users stay signed in across app restarts. Logging out tears down the replicator and clears the session document.

## Troubleshooting

### Build Errors

**"This version of .NET for iOS requires Xcode 26.3"**
- Install Xcode 26.3 or higher from the App Store / Apple Developer
- Or, build only for Android: `dotnet build -f net10.0-android`

**"Could not find android.jar for API level 36"**
```bash
dotnet build -t:InstallAndroidDependencies -f net10.0-android \
    -p:AndroidSdkDirectory=$HOME/Library/Android/sdk \
    -p:AcceptAndroidSDKLicenses=true
```

**"Could not find required file `jvm` within `/opt/homebrew/opt/openjdk@17`"**
- Set `JAVA_HOME` to the actual JDK home (not the brew opt symlink):
```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
```

**"NETSDK1147: workloads must be installed: maui-android"**
```bash
dotnet workload restore
```

### Sync Issues

**"CBL_BASE_URL is not configured or invalid"**
- Verify `Resources/Raw/.env` exists and has valid `wss://` URL for `CBL_BASE_URL`
- Confirm the file is included as a `MauiAsset` (it should be by default via `csproj`)
- Check the Settings page — `Endpoint:` should show your full sync URL

**Sync stuck on "Connecting..."**
- Confirm the Capella App Service endpoint is running
- Verify your machine has internet access (`curl https://couchbase.com`)
- Check that `CBL_BASE_URL` matches the **Public Connection URL** from Capella (Connect tab)

**Authentication failed**
- Ensure App Users are configured in Capella with the demo emails and matching passwords
- Verify `CBL_AA_USER` / `CBL_NYC_USER` / `CBL_PASSWORD` in `.env`

### Runtime Issues

**"Couchbase Lite has not been initialized" on Android**
- This means the `Couchbase.Lite.Support.Droid.Activate(this)` call is missing
- Check `Platforms/Android/MainActivity.cs` includes the `OnCreate` override

**App stuck on loading on iOS / Mac Catalyst**
- Check Xcode output for replicator errors
- Verify network access in Info.plist (App Transport Security shouldn't block `wss://`)

## Related Documentation

- [Main Project README](../README.md) — Capella cluster setup
- [iOS App README](../iOS/README.md) — Swift version
- [Android App README](../Android/README.md) — Kotlin version
- [Web App README](../web/README.md) — React + TypeScript version
- [React Native App README](../react-native/README.md) — Expo + cbl-reactnative version
- [Couchbase Lite for C# / .NET docs](https://docs.couchbase.com/couchbase-lite/current/csharp/quickstart.html)
- [.NET MAUI docs](https://learn.microsoft.com/en-us/dotnet/maui/)
