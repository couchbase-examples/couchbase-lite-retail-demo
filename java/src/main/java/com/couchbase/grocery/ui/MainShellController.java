package com.couchbase.grocery.ui;

import com.couchbase.grocery.App;
import com.couchbase.grocery.services.AppServicesSyncManager;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.geometry.Pos;
import javafx.scene.Parent;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Main shell — a {@link StackPane} that swaps between the four authenticated
 * views, with a custom iOS-style bottom tab bar built from {@link Button}s
 * instead of {@link javafx.scene.control.TabPane} (which carries chrome
 * iOS doesn't have).
 */
public class MainShellController {

    private static final Logger log = LoggerFactory.getLogger(MainShellController.class);

    private final App.Services services;
    private AppServicesSyncManager syncManager;
    private SettingsController settingsController;

    @FXML private StackPane contentArea;
    @FXML private HBox tabBar;
    @FXML private Label syncStatusLabel;

    private final Map<String, Parent> contentByTab = new LinkedHashMap<>();
    private final List<Button> tabButtons = new ArrayList<>();
    private Button activeButton;

    public MainShellController(App.Services services) {
        this.services = services;
    }

    @FXML
    public void initialize() {
        // Build 4 tab buttons.
        tabButtons.add(makeTabButton("inventory", "🛒", "Inventory"));
        tabButtons.add(makeTabButton("orders",    "🧾", "Orders"));
        tabButtons.add(makeTabButton("profile",   "🏬", "Profile"));
        tabButtons.add(makeTabButton("settings",  "⚙",  "Settings"));
        for (Button b : tabButtons) {
            HBox.setHgrow(b, Priority.ALWAYS);
            tabBar.getChildren().add(b);
        }

        // Default tab
        selectTab(tabButtons.get(0));

        // Replicator off the FX thread.
        Thread starter = new Thread(() -> {
            syncManager = new AppServicesSyncManager(services.db);
            syncManager.onStateChanged(state ->
                    Platform.runLater(() -> {
                        syncStatusLabel.setText("Sync: " + state);
                        if (settingsController != null) settingsController.setSyncManager(syncManager);
                    }));
            try {
                syncManager.start();
            } catch (Exception e) {
                log.error("Replicator failed to start", e);
                Platform.runLater(() ->
                        syncStatusLabel.setText("Sync: error — " + e.getMessage()));
            }
        }, "sync-starter");
        starter.setDaemon(true);
        starter.start();
    }

    private Button makeTabButton(String id, String glyph, String label) {
        Label iconLabel = new Label(glyph);
        iconLabel.getStyleClass().add("tab-icon");
        Label textLabel = new Label(label);
        textLabel.getStyleClass().add("tab-label");

        VBox stack = new VBox(2, iconLabel, textLabel);
        stack.setAlignment(Pos.CENTER);

        Button b = new Button();
        b.setGraphic(stack);
        b.getStyleClass().add("ios-tab-button");
        b.setUserData(id);
        b.setOnAction(e -> selectTab(b));
        return b;
    }

    private void selectTab(Button b) {
        if (activeButton == b) return;
        if (activeButton != null) activeButton.getStyleClass().remove("ios-tab-button-active");
        b.getStyleClass().add("ios-tab-button-active");
        activeButton = b;

        String id = (String) b.getUserData();
        Parent content = contentByTab.computeIfAbsent(id, this::loadTabContent);
        contentArea.getChildren().setAll(content);
    }

    private Parent loadTabContent(String id) {
        try {
            String fxml = "/fxml/" + id + ".fxml";
            FXMLLoader loader = new FXMLLoader(App.class.getResource(fxml));
            loader.setControllerFactory(type -> {
                if (type == InventoryController.class) return new InventoryController(services);
                if (type == OrdersController.class)    return new OrdersController(services);
                if (type == ProfileController.class)   return new ProfileController(services);
                if (type == SettingsController.class)  return new SettingsController(services);
                try { return type.getDeclaredConstructor().newInstance(); }
                catch (Exception ex) { throw new RuntimeException(ex); }
            });
            Parent root = loader.load();
            if (id.equals("settings")) {
                settingsController = loader.getController();
                if (syncManager != null) settingsController.setSyncManager(syncManager);
            }
            return root;
        } catch (Exception e) {
            log.error("Failed to load tab content {}", id, e);
            return new Label("Failed to load: " + e.getMessage());
        }
    }
}
