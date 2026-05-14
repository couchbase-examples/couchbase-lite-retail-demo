package com.couchbase.grocery.models;

/**
 * Immutable per-store configuration assembled at login time from the .env values.
 *
 * <p>Mirrors {@code Models/AppConfig.cs} in the .NET MAUI port.
 */
public record AppConfig(
        String store,           // "AA" or "NYC"
        String databaseName,    // local Couchbase Lite database name
        String scope,           // "AA-Store" or "NYC-Store"
        String syncUrl,         // wss://...:4984/supermarket-aa
        String username,
        String password
) {
    public static final String LOCAL_DB_NAME = "GroceryInventoryDB";
    public static final String AUTH_DB_NAME = "AuthDB";

    // Collections live under the per-store scope
    public static final String COLLECTION_INVENTORY = "inventory";
    public static final String COLLECTION_ORDERS = "orders";
    public static final String COLLECTION_PROFILE = "profile";
}
