using Microsoft.Maui.Storage;

namespace GroceryApp.Models;

public enum StoreLocation
{
    AA,
    NYC
}

public static class StoreLocationExtensions
{
    public static string DisplayName(this StoreLocation location) => location switch
    {
        StoreLocation.AA => "Ann Arbor Store",
        StoreLocation.NYC => "New York City Store",
        _ => "Unknown"
    };

    public static string Code(this StoreLocation location) => location switch
    {
        StoreLocation.AA => "aa",
        StoreLocation.NYC => "nyc",
        _ => "nyc"
    };
}

/// <summary>
/// Centralized application configuration for Couchbase Lite + App Services sync.
/// Mirrors the iOS/Android AppConfig.
/// </summary>
public static class AppConfig
{
    private const string PersistedStoreKey = "AppConfig.persistedCurrentStore";

    private static StoreLocation _currentStore = LoadPersistedStore();

    public static StoreLocation CurrentStore
    {
        get => _currentStore;
        set
        {
            _currentStore = value;
            Preferences.Set(PersistedStoreKey, value.Code());
        }
    }

    private static StoreLocation LoadPersistedStore()
    {
        var raw = Preferences.Get(PersistedStoreKey, "nyc");
        return raw?.ToLowerInvariant() switch
        {
            "aa" => StoreLocation.AA,
            _ => StoreLocation.NYC
        };
    }

    /// <summary>
    /// Map an authenticated username to its corresponding store. Demo
    /// credentials use "aa-store-*" / "nyc-store-*" prefixes.
    /// </summary>
    public static StoreLocation StoreForUser(string username)
    {
        var lowered = username?.ToLowerInvariant() ?? string.Empty;
        if (lowered.StartsWith("aa-store") || lowered.Contains("aa-store"))
            return StoreLocation.AA;
        return StoreLocation.NYC;
    }

    public static void SetStoreForUser(string username)
    {
        CurrentStore = StoreForUser(username);
    }

    // ------------------------------------------------------------------
    // Capella App Services Configuration (env-driven via .env / Preferences)
    // ------------------------------------------------------------------
    private static string GetConfigValue(string key, string fallback = "")
    {
        var fromEnv = Environment.GetEnvironmentVariable(key);
        if (!string.IsNullOrWhiteSpace(fromEnv)) return fromEnv;

        // Preferences allows runtime override (e.g. seeded from MauiAsset .env file).
        return Preferences.Get(key, fallback);
    }

    private static string BaseUrl => GetConfigValue("CBL_BASE_URL");
    private static string AaDb => GetConfigValue("CBL_AA_DB", "supermarket-aa");
    private static string NycDb => GetConfigValue("CBL_NYC_DB", "supermarket-nyc");
    private static string AaUser => GetConfigValue("CBL_AA_USER", "aa-store-01@supermarket.com");
    private static string NycUser => GetConfigValue("CBL_NYC_USER", "nyc-store-01@supermarket.com");
    private static string PasswordValue => GetConfigValue("CBL_PASSWORD", "P@ssword1");

    public static string SyncGatewayUrl => CurrentStore switch
    {
        StoreLocation.AA => $"{BaseUrl.TrimEnd('/')}/{AaDb}",
        _ => $"{BaseUrl.TrimEnd('/')}/{NycDb}"
    };

    public static string Username => CurrentStore switch
    {
        StoreLocation.AA => AaUser,
        _ => NycUser
    };

    public static string Password => PasswordValue;

    public static string StoreId => CurrentStore switch
    {
        StoreLocation.AA => "aa-store-01",
        _ => "nyc-store-01"
    };

    // ------------------------------------------------------------------
    // Database Configuration
    // ------------------------------------------------------------------
    public const string DatabaseName = "GroceryInventoryDB";
    public const string CollectionName = "inventory";
    public const string OrdersCollectionName = "orders";
    public const string ProfileCollectionName = "profile";

    public static string ScopeName => CurrentStore switch
    {
        StoreLocation.AA => "AA-Store",
        _ => "NYC-Store"
    };

    // ------------------------------------------------------------------
    // Sync Configuration (Event-Driven, Real-Time)
    // ------------------------------------------------------------------
    public const int SyncHeartbeat = 60;
    public const int SyncMaxAttempts = 10;
    public const int SyncMaxAttemptWaitTime = 300;
    public const bool SyncContinuous = true;

    // ------------------------------------------------------------------
    // Feature Flags
    // ------------------------------------------------------------------
    public const bool EnableAppServicesSync = true;
    public const bool EnableAutoDataSeeding = false;
    public const bool DebugLogging = true;

    public static IDictionary<string, object> GetEnvironmentInfo() => new Dictionary<string, object>
    {
        ["store"] = CurrentStore.Code(),
        ["store_name"] = CurrentStore.DisplayName(),
        ["sync_url"] = SyncGatewayUrl,
        ["username"] = Username,
        ["store_id"] = StoreId,
        ["database"] = DatabaseName,
        ["scope"] = ScopeName,
        ["collection"] = CollectionName,
        ["app_services_enabled"] = EnableAppServicesSync
    };
}
