package com.couchbase.grocery.services;

import com.couchbase.grocery.models.AppConfig;
import com.couchbase.lite.BasicAuthenticator;
import com.couchbase.lite.CollectionConfiguration;
import com.couchbase.lite.CouchbaseLiteException;
import com.couchbase.lite.ListenerToken;
import com.couchbase.lite.Replicator;
import com.couchbase.lite.ReplicatorActivityLevel;
import com.couchbase.lite.ReplicatorConfiguration;
import com.couchbase.lite.ReplicatorType;
import com.couchbase.lite.URLEndpoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Consumer;

/**
 * Continuous push+pull replicator to Capella App Services.
 *
 * <p>Mirrors {@code Services/AppServicesSyncManager.cs} from the .NET MAUI
 * port — same heartbeat (60s) and retry parameters so the cross-platform
 * behaviour stays consistent.
 */
public class AppServicesSyncManager {

    private static final Logger log = LoggerFactory.getLogger(AppServicesSyncManager.class);

    public enum SyncState { STOPPED, CONNECTING, IDLE, BUSY, OFFLINE, ERROR }

    private final DatabaseManager db;
    private Replicator replicator;
    private ListenerToken token;

    private SyncState state = SyncState.STOPPED;
    private String lastError;

    private final CopyOnWriteArrayList<Consumer<SyncState>> stateListeners = new CopyOnWriteArrayList<>();

    public AppServicesSyncManager(DatabaseManager db) {
        this.db = db;
    }

    public void start() throws CouchbaseLiteException {
        if (replicator != null) return;
        AppConfig cfg = db.config();
        if (cfg == null) throw new IllegalStateException("DatabaseManager has no AppConfig — open a DB first");

        URI uri;
        try {
            uri = new URI(cfg.syncUrl());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid CBL_BASE_URL: " + cfg.syncUrl(), e);
        }

        Set<CollectionConfiguration> collConfigs = new LinkedHashSet<>();
        collConfigs.add(new CollectionConfiguration(db.inventory()));
        collConfigs.add(new CollectionConfiguration(db.orders()));
        collConfigs.add(new CollectionConfiguration(db.profile()));

        ReplicatorConfiguration rc = new ReplicatorConfiguration(collConfigs, new URLEndpoint(uri))
                .setType(ReplicatorType.PUSH_AND_PULL)
                .setContinuous(true)
                .setHeartbeat(60)
                .setMaxAttempts(10)
                .setMaxAttemptWaitTime(300)
                .setAuthenticator(new BasicAuthenticator(
                        cfg.username(), cfg.password().toCharArray()));

        replicator = new Replicator(rc);
        token = replicator.addChangeListener(change -> {
            ReplicatorActivityLevel level = change.getStatus().getActivityLevel();
            switch (level) {
                case STOPPED      -> setState(SyncState.STOPPED);
                case OFFLINE      -> setState(SyncState.OFFLINE);
                case CONNECTING   -> setState(SyncState.CONNECTING);
                case IDLE         -> setState(SyncState.IDLE);
                case BUSY         -> setState(SyncState.BUSY);
            }
            if (change.getStatus().getError() != null) {
                lastError = change.getStatus().getError().getMessage();
                log.warn("Replicator error: {}", lastError);
                setState(SyncState.ERROR);
            }
        });
        replicator.start();
        log.info("Replicator started → {}", cfg.syncUrl());
    }

    public void stop() {
        if (replicator != null) {
            if (token != null) token.remove();
            try { replicator.stop(); } catch (Exception ignore) {}
            replicator = null;
            token = null;
            setState(SyncState.STOPPED);
        }
    }

    public SyncState state()       { return state; }
    public String lastError()      { return lastError; }

    public void onStateChanged(Consumer<SyncState> cb) { stateListeners.add(cb); }

    private void setState(SyncState s) {
        this.state = s;
        for (Consumer<SyncState> l : stateListeners) {
            try { l.accept(s); } catch (Exception e) {
                log.warn("State listener threw: {}", e.getMessage());
            }
        }
    }
}
