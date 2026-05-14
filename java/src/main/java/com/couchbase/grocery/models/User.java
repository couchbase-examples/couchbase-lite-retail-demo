package com.couchbase.grocery.models;

/**
 * Authenticated user session.
 */
public record User(String username, String store, String role) {

    public boolean isAnnArbor() { return "AA".equalsIgnoreCase(store); }
    public boolean isNyc()      { return "NYC".equalsIgnoreCase(store); }

    /**
     * Demo users hard-coded on the login page (mirrors the iOS / Android / .NET
     * "View Demo Credentials" picker).
     */
    public record DemoUser(String username, String password, String store, String label) {}
}
