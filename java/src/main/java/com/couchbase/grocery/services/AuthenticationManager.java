package com.couchbase.grocery.services;

import com.couchbase.grocery.models.AppConfig;
import com.couchbase.grocery.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Validates demo credentials against the .env config, derives the user's
 * store from the username prefix ({@code aa-...} vs {@code nyc-...}), and
 * builds an {@link AppConfig} ready for the {@link DatabaseManager}.
 *
 * <p>Unlike the iOS / .NET ports we don't persist a session yet — that's a
 * follow-up once the basic flow is working end-to-end.
 */
public class AuthenticationManager {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationManager.class);

    private User currentUser;
    private AppConfig currentConfig;

    public LoginResult login(String username, String password) {
        if (username == null || password == null
                || username.isBlank() || password.isBlank()) {
            return new LoginResult(false, "Username and password are required", null, null);
        }

        String expectedPassword = EnvLoader.get("CBL_PASSWORD");
        if (expectedPassword == null) {
            return new LoginResult(false,
                    "Capella config missing — populate src/main/resources/.env first",
                    null, null);
        }
        if (!expectedPassword.equals(password)) {
            return new LoginResult(false, "Invalid credentials", null, null);
        }

        String baseUrl = EnvLoader.get("CBL_BASE_URL");
        String aaUser  = EnvLoader.get("CBL_AA_USER");
        String nycUser = EnvLoader.get("CBL_NYC_USER");
        String aaDb    = EnvLoader.getOrDefault("CBL_AA_DB", "supermarket-aa");
        String nycDb   = EnvLoader.getOrDefault("CBL_NYC_DB", "supermarket-nyc");

        if (baseUrl == null || baseUrl.isBlank()) {
            return new LoginResult(false, "CBL_BASE_URL is not configured", null, null);
        }

        String store;
        String dbName;
        if (username.equalsIgnoreCase(aaUser) || username.toLowerCase().startsWith("aa-")) {
            store = "AA";
            dbName = aaDb;
        } else if (username.equalsIgnoreCase(nycUser) || username.toLowerCase().startsWith("nyc-")) {
            store = "NYC";
            dbName = nycDb;
        } else {
            return new LoginResult(false,
                    "Unknown user — must match CBL_AA_USER or CBL_NYC_USER", null, null);
        }

        String syncUrl = baseUrl.replaceAll("/$", "") + "/" + dbName;
        String scope = store.equals("AA") ? "AA-Store" : "NYC-Store";

        User user = new User(username, store, "Store Manager");
        AppConfig cfg = new AppConfig(store, AppConfig.LOCAL_DB_NAME, scope, syncUrl,
                username, password);

        this.currentUser = user;
        this.currentConfig = cfg;
        log.info("Logged in {} → store={}, syncUrl={}", username, store, syncUrl);
        return new LoginResult(true, null, user, cfg);
    }

    public void logout() {
        currentUser = null;
        currentConfig = null;
    }

    public boolean isAuthenticated() { return currentUser != null; }
    public User currentUser()        { return currentUser; }
    public AppConfig currentConfig() { return currentConfig; }

    public record LoginResult(boolean success, String errorMessage, User user, AppConfig config) {}
}
