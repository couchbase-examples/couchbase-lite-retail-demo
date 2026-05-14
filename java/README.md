# Couchbase Lite Retail Demo — Java + JavaFX

A desktop port of the retail inventory demo, built with the **Couchbase Lite Java SDK (Enterprise Edition 4.0.3)** and **JavaFX 21**. Functionally identical to the iOS, Android, React Native, web, and .NET MAUI versions — offline-first inventory + orders + store profile, with continuous WebSocket sync to Capella App Services.

> [!IMPORTANT]
> This project is for **desktop Java** (Windows / macOS / Linux). For Android, see the Kotlin app in [`../Android/`](../Android/). Couchbase Lite ships separate artifacts for the two — `couchbase-lite-java` (this project) vs `couchbase-lite-android`.

## Requirements

| Tool | Version | Notes |
| --- | --- | --- |
| **JDK** | 17 or later | Couchbase Lite Java requires JDK 11+; we target 17 for modern language features (records, switch expressions). |
| **Gradle** | — | Not required — use the bundled `./gradlew`. |

JavaFX modules are pulled from Maven Central per-OS, so there's no separate SDK install.

## Project Layout

```
java/
├── build.gradle                              # Gradle build, dependencies, JavaFX
├── settings.gradle
├── gradle.properties
├── gradlew / gradlew.bat                     # Wrapper — no system Gradle needed
├── src/main/java/com/couchbase/grocery/
│   ├── Main.java                             # Plain-Java launcher shim
│   ├── App.java                              # JavaFX Application root
│   ├── models/
│   │   ├── AppConfig.java                    # Per-store local DB + scope + sync URL
│   │   ├── GroceryItem.java
│   │   ├── Order.java
│   │   ├── StoreProfile.java
│   │   └── User.java
│   ├── services/
│   │   ├── EnvLoader.java                    # Reads .env into a Map
│   │   ├── DatabaseManager.java              # Opens DB + 3 scoped collections + listeners
│   │   ├── AppServicesSyncManager.java       # Continuous push+pull Replicator
│   │   └── AuthenticationManager.java        # Demo-credential validation
│   └── ui/
│       ├── LoginController.java
│       └── MainShellController.java
└── src/main/resources/
    ├── .env.example
    ├── fxml/login.fxml
    ├── fxml/main.fxml
    └── css/app.css
```

## Setup

### 1. Configure Capella App Services

The app reads its sync configuration from `src/main/resources/.env`. Copy the example and fill in your own values:

```bash
cp src/main/resources/.env.example src/main/resources/.env
```

Edit `src/main/resources/.env`:

```
CBL_BASE_URL=wss://your-endpoint.apps.cloud.couchbase.com:4984
CBL_AA_DB=supermarket-aa
CBL_NYC_DB=supermarket-nyc
CBL_AA_USER=aa-store-01@supermarket.com
CBL_NYC_USER=nyc-store-01@supermarket.com
CBL_PASSWORD=P@ssword1
```

Get `CBL_BASE_URL` from your Capella dashboard → **App Services → your endpoint → Connect**. Copy the **Public Connection URL** (base only — the per-store database is appended at login).

> [!NOTE]
> If you've never set up Capella for this demo, run through the **root [README](../README.md)** first — you need a cluster, an App Service, the sample dataset imported, and demo App Users created before any platform's app can sync.

### 2. Build

```bash
./gradlew build
```

First run takes ~2 minutes while Gradle pulls Couchbase Lite + JavaFX + their natives (~50 MB). Subsequent builds are seconds.

### 3. Run

```bash
./gradlew run
```

The login window opens. Tap **View Demo Credentials → Use →** on a row to auto-login, or type credentials manually.

## Architecture

The Java port mirrors the .NET MAUI structure 1:1 — same scope/collection names, same `.env` keys, same replicator parameters — so a single Capella App Service backs all five clients.

| Component | Responsibility |
| --- | --- |
| `EnvLoader` | Reads `.env` from the working dir or `/resources/.env` on the classpath; env vars override. |
| `AuthenticationManager` | Validates the demo username + password against `.env`, derives the store (`AA` / `NYC`) from the username prefix, and builds an `AppConfig`. |
| `DatabaseManager` | Owns the local Couchbase Lite database (`GroceryInventoryDB`), ensures the per-store scope and the three collections (`inventory`, `orders`, `profile`) exist, exposes CRUD helpers, and fires change events from CBL's native listeners. |
| `AppServicesSyncManager` | Builds a continuous push+pull `Replicator` against `wss://.../supermarket-aa`, with the same 60s heartbeat and retry parameters as the other ports. |
| `App` + controllers | JavaFX shell — login → 4-tab main view (Inventory / Orders / Profile / Settings). |

### Couchbase Lite Java specifics

- `CouchbaseLite.init()` must be called once before any `Database` operation. We do it lazily inside `DatabaseManager.initCBL()` and again on startup in `App.start()`.
- Collections are addressed by `(name, scope)` — e.g. `database.getCollection("inventory", "NYC-Store")`.
- The replicator is configured per-collection via `CollectionConfiguration`, then bundled into a `ReplicatorConfiguration` with a `URLEndpoint` + `BasicAuthenticator`.

## Demo Credentials

| Store | Username | Password |
| --- | --- | --- |
| Ann Arbor Store | `aa-store-01@supermarket.com` | `P@ssword1` |
| NYC Store | `nyc-store-01@supermarket.com` | `P@ssword1` |

Both are pre-provisioned in the sample Capella dataset.

## Status

This is the **initial scaffold** of the Java port — it compiles, launches, and connects to App Services, but the four authenticated tabs are placeholders. The next iterations add:

- [ ] Inventory tab — grid + search + +/− quantity + "Re-order now"
- [ ] Orders tab — list with status-filter chips
- [ ] Profile tab — store details card
- [ ] Settings tab — sync status + reset + sign out
- [ ] Session persistence (separate `AuthDB` like the .NET / iOS versions)

## Troubleshooting

**`Error: JavaFX runtime components are missing`** — make sure you're running through `./gradlew run`, not a hand-built `java -jar`. JavaFX modules are listed as Gradle dependencies but need to be on the module path; the wrapper does that for you.

**`CBL_BASE_URL is not configured`** — `src/main/resources/.env` is missing or the variable is empty. Copy from `.env.example`.

**Replicator status `ERROR — network error`** — check that your Capella cluster + App Service are running (not paused), and that the hostname in `CBL_BASE_URL` resolves (`nslookup`).

**On Linux**: Couchbase Lite Java needs the bundled native lib path on `LD_LIBRARY_PATH` for some distros. See the [official install docs](https://docs.couchbase.com/couchbase-lite/current/java/gs-install.html#deploy-to-linux).

## Related

- [Couchbase Lite for Java docs](https://docs.couchbase.com/couchbase-lite/current/java/quickstart.html)
- [Main project README](../README.md)
- [.NET MAUI port](../dot-net/README.md) — closest sibling in terms of architecture
- [Android port](../Android/README.md)
- [iOS port](../iOS/README.md)
