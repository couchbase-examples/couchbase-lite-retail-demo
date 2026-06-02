# Couchbase Lite Retail Demo — Ionic React + Capacitor

Mobile port of the retail inventory demo, built with **Ionic React 8**, **Capacitor 6**, and the **[cbl-ionic](https://cbl-ionic.dev/) plugin (Couchbase Lite Enterprise 4.x)**. Functionally identical to the iOS / Android / React Native / .NET MAUI / Java ports — offline-first inventory + orders + store profile, with continuous WebSocket sync to Capella App Services.

> [!IMPORTANT]
> The `cbl-ionic` plugin only works in a Capacitor runtime (iOS or Android). It has **no web browser implementation**, so `ionic serve` will fail at any database call. You **must** run on a device or simulator/emulator via `npm run ios` or `npm run android`.

## Requirements

| Tool | Version | Notes |
| --- | --- | --- |
| **Node** | 20+ | Tested on 22 LTS |
| **npm** | 10+ | |
| **Xcode** | 15+ | For iOS builds |
| **CocoaPods** | latest | `sudo gem install cocoapods` |
| **Android Studio** | latest | For Android builds; needs JDK 17+ |
| **Ionic CLI** | optional | `npm i -g @ionic/cli` (most commands here use `npx`) |

The cbl-ionic plugin pulls the native CBL Enterprise 4.x library for each platform from Couchbase's Maven / CocoaPods repos.

## Project Layout

```
Ionic/
├── capacitor.config.ts                 # appId, appName, web build dir
├── ionic.config.json
├── package.json
├── vite.config.ts
├── public/couchbase_logo.png           # bundled red Couchbase logomark
├── .env.example                        # template — copy to .env.local
└── src/
    ├── main.tsx                        # React + Ionic boot
    ├── App.tsx                         # Routes (login vs tabs)
    ├── models/
    │   ├── AppConfig.ts                # Per-store DB + scope + sync URL
    │   ├── GroceryItem.ts              # + stockQty / quantity-CRDT fallback
    │   ├── Order.ts                    # + NanoID helper for order doc ids
    │   ├── StoreProfile.ts             # Nested contact / location dicts
    │   └── User.ts                     # + DEMO_USERS list
    ├── services/
    │   ├── envLoader.ts                # Reads VITE_CBL_* envs from Vite
    │   ├── database.ts                 # CBL Database + 3 collections + listeners
    │   ├── sync.ts                     # Continuous push+pull Replicator
    │   └── auth.ts                     # Demo-credential validation
    ├── providers/AppProvider.tsx       # React Context with all singletons
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── DemoCredentialsModal.tsx    # Slide-up sheet
    │   ├── MainTabs.tsx                # IonTabs (Inventory/Orders/Profile/Settings)
    │   ├── InventoryPage.tsx           # 2-col grid + +/-/Re-order
    │   ├── OrdersPage.tsx              # Filter chips + list
    │   ├── ProfilePage.tsx
    │   └── SettingsPage.tsx
    └── theme/
        ├── variables.css               # Ionic CSS variables (default)
        └── app.css                     # Demo-specific styles
```

## Setup

### 1. Install dependencies

```bash
npm install
```

This is the slow step — Vite, Ionic React, Capacitor, and `cbl-ionic` together pull a couple hundred MB.

### 2. Configure Capella App Services

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Capella values. Vite picks up `.env.local` automatically and exposes anything prefixed `VITE_` to the app bundle:

```
VITE_CBL_BASE_URL=wss://your-endpoint.apps.cloud.couchbase.com:4984
VITE_CBL_AA_DB=supermarket-aa
VITE_CBL_NYC_DB=supermarket-nyc
VITE_CBL_AA_USER=aa-store-01@supermarket.com
VITE_CBL_NYC_USER=nyc-store-01@supermarket.com
VITE_CBL_PASSWORD=P@ssword1
```

`CBL_BASE_URL` lives in your Capella dashboard → **App Services** → endpoint → **Connect** → **Public Connection URL**. The per-store database (`/supermarket-aa` or `/supermarket-nyc`) is appended at login.

> [!NOTE]
> If you've never set up Capella for this demo, run through the **root [README](../README.md)** — you need a cluster, an App Service, the sample dataset imported, and demo App Users created before any platform's app can sync.

### 3. Add native platforms

```bash
npx cap add ios
npx cap add android
```

This generates `ios/` and `android/` directories. The cbl-ionic plugin's native bits are auto-linked by Capacitor.

#### iOS — verify the Podfile

After `npx cap add ios`, open `ios/App/Podfile` and confirm:

```ruby
pod 'CblIonic', :path => '../../node_modules/cbl-ionic'
```

Then install pods:

```bash
cd ios/App && pod install && cd ../..
```

#### Android — add the Couchbase Maven repo

Open `android/build.gradle` (the **root** one) and add the Couchbase Mobile Maven repo:

```groovy
allprojects {
    repositories {
        google()
        maven { url 'https://mobile.maven.couchbase.com/maven2/dev/' }
        mavenCentral()
    }
}
```

### 4. Build & run

```bash
# Build web bundle + open in Xcode
npm run ios

# Or Android Studio
npm run android
```

The `npm run ios` / `npm run android` scripts wrap `vite build` + `cap sync` + `cap open`, so they're safe to run after any code change.

## Demo Credentials

| Store | Username | Password |
| --- | --- | --- |
| Ann Arbor Store | `aa-store-01@supermarket.com` | `P@ssword1` |
| NYC Store | `nyc-store-01@supermarket.com` | `P@ssword1` |

Tap **View Demo Credentials** on the login screen → tap **→** on a row to auto-login.

## Architecture

| Layer | Responsibility |
| --- | --- |
| `envLoader` | Reads `VITE_CBL_*` envs into a typed object (build-time). |
| `auth` | Validates the password, derives the store from the username prefix, builds an `AppConfig`. |
| `DatabaseService` | Owns the local CBL database (`GroceryInventoryDB`), opens the per-store scope, ensures the three collections (`inventory`/`orders`/`profile`), fires per-collection change events with the list of changed doc IDs. |
| `SyncService` | Builds a continuous `Replicator` against `wss://.../supermarket-aa`, 60s heartbeat, same retry params as the other ports. Reports IDLE/BUSY/ERROR via a listener. |
| `AppProvider` | React Context that owns the two services + current user state. `useApp()` from any component. |
| Pages | Login → tabs (Inventory / Orders / Profile / Settings). Tabs are `IonTabs` for free iOS-style bottom bar. |

### Couchbase Lite Ionic specifics

- `new CapacitorEngine()` must be called **once** before any database op. We do it lazily inside `DatabaseService.initEngine()`.
- The plugin's `Database`, `Collection`, `MutableDocument`, `Replicator`, etc. mirror the native API surface — same scope+collection model, same `ReplicatorConfiguration` API.
- Queries use SQL++ (`database.createQuery("SELECT * FROM \`NYC-Store\`.inventory")`).

### Performance: targeted UI updates

When a user taps `+/−` on an inventory tile, CBL fires a collection change event with the changed doc IDs. The InventoryPage:

1. Bumps the in-memory item's `quantity` immediately (optimistic UI — feels responsive).
2. Writes `stockQty` to CBL on a background promise.
3. When the change event fires, *only* patches the affected items (no full re-query, no image re-fetch).

Falls back to a full reload if a changed id isn't on screen (new product synced for the first time).

## Status

This is the **initial port** — it compiles, builds, and connects to App Services. The full flow (login → inventory grid + search + +/− / Re-order → orders list with filter chips → store profile card → settings with sync state + sign-out) is implemented.

Known limitations vs the native iOS / Android ports:

- **No P2P sync** — the cbl-ionic plugin supports it, but this demo only wires Capella App Services.
- **No session persistence** yet — sign out + restart returns you to the login screen (the other ports keep an `AuthDB`).

## Troubleshooting

**`cbl-ionic does not have a web implementation`** — you tried `ionic serve`. The plugin only works in a Capacitor native runtime. Use `npm run ios` or `npm run android`.

**`pod install` fails on iOS** — make sure Xcode 15+ is the active developer dir (`sudo xcode-select -s /Applications/Xcode.app`), and CocoaPods is up to date.

**`Could not find com.couchbase.lite:couchbase-lite-android-ee`** on Android — you missed the Maven repo in `android/build.gradle`. See Step 3 above.

**`VITE_CBL_BASE_URL is not configured`** — `.env.local` is missing or has empty values. Make sure the keys start with `VITE_` (Vite only exposes those).

**Replicator stuck on `CONNECTING`** — check the Capella dashboard: is the App Service paused? Does the hostname resolve (`nslookup`)? Are the demo users provisioned in your App Endpoint with the right password?

## Related

- [cbl-ionic plugin docs](https://cbl-ionic.dev/) — the underlying SDK
- [Main project README](../README.md)
- [Java port](../java/README.md) — closest sibling in architecture
- [React Native port](../react-native/README.md) — also uses the cbl-reactnative JS API
- [.NET MAUI port](../dot-net/README.md)
