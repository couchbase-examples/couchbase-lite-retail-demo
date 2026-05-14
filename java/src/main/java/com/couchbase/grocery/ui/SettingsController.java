package com.couchbase.grocery.ui;

import com.couchbase.grocery.App;
import com.couchbase.grocery.services.AppServicesSyncManager;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.control.Button;
import javafx.scene.control.ButtonType;
import javafx.scene.control.Label;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class SettingsController {

    private static final Logger log = LoggerFactory.getLogger(SettingsController.class);
    private static final DateTimeFormatter TS = DateTimeFormatter.ofPattern("h:mm:ss a");

    private final App.Services services;
    private AppServicesSyncManager syncManager;

    @FXML private Label syncStateLabel;
    @FXML private Label endpointLabel;
    @FXML private Label userLabel;
    @FXML private Label lastSyncLabel;
    @FXML private Button toggleSyncButton;
    @FXML private Button signOutButton;

    public SettingsController(App.Services services) { this.services = services; }

    public void setSyncManager(AppServicesSyncManager mgr) {
        this.syncManager = mgr;
        if (mgr != null) {
            mgr.onStateChanged(state -> Platform.runLater(() -> applyState(state)));
            applyState(mgr.state());
        }
    }

    @FXML
    public void initialize() {
        var user = services.auth.currentUser();
        var cfg  = services.auth.currentConfig();
        if (user != null) userLabel.setText(user.username() + "  ·  " + user.role());
        if (cfg  != null) endpointLabel.setText(cfg.syncUrl());

        toggleSyncButton.setOnAction(e -> toggleSync());
        signOutButton.setOnAction(e -> signOut());
    }

    private void applyState(AppServicesSyncManager.SyncState state) {
        syncStateLabel.setText("Sync: " + state);
        syncStateLabel.getStyleClass().removeIf(s -> s.startsWith("state-"));
        syncStateLabel.getStyleClass().add(switch (state) {
            case IDLE       -> "state-ok";
            case BUSY       -> "state-ok";
            case CONNECTING -> "state-pending";
            case OFFLINE    -> "state-pending";
            case ERROR      -> "state-error";
            case STOPPED    -> "state-stopped";
        });
        lastSyncLabel.setText("Last update: " + TS.format(LocalDateTime.now()));
        toggleSyncButton.setText(state == AppServicesSyncManager.SyncState.STOPPED
                ? "Start sync" : "Stop sync");
    }

    private void toggleSync() {
        if (syncManager == null) return;
        try {
            if (syncManager.state() == AppServicesSyncManager.SyncState.STOPPED) {
                syncManager.start();
            } else {
                syncManager.stop();
            }
        } catch (Exception ex) {
            log.error("Toggle sync failed", ex);
            new Alert(AlertType.ERROR, ex.getMessage(), ButtonType.OK).showAndWait();
        }
    }

    private void signOut() {
        try {
            if (syncManager != null) syncManager.stop();
            services.db.close();
            services.auth.logout();

            FXMLLoader loader = new FXMLLoader(App.class.getResource("/fxml/login.fxml"));
            loader.setControllerFactory(type -> {
                if (type == LoginController.class) return new LoginController(services);
                try { return type.getDeclaredConstructor().newInstance(); }
                catch (Exception e) { throw new RuntimeException(e); }
            });
            Parent root = loader.load();
            Scene scene = new Scene(root, services.stage.getWidth(), services.stage.getHeight());
            scene.getStylesheets().add(App.class.getResource("/css/app.css").toExternalForm());
            services.stage.setScene(scene);
        } catch (Exception e) {
            log.error("Sign-out failed", e);
            new Alert(AlertType.ERROR, e.getMessage(), ButtonType.OK).showAndWait();
        }
    }
}
