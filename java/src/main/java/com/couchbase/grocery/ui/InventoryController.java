package com.couchbase.grocery.ui;

import com.couchbase.grocery.App;
import com.couchbase.grocery.models.GroceryItem;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.TextField;
import javafx.scene.effect.DropShadow;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.ColumnConstraints;
import javafx.scene.layout.GridPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.StackPane;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.couchbase.lite.Document;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InventoryController {

    private static final Logger log = LoggerFactory.getLogger(InventoryController.class);
    private static final int COLUMNS = 2;

    private final App.Services services;

    @FXML private Label welcomeLabel;
    @FXML private Label roleBadge;
    @FXML private TextField searchField;
    @FXML private GridPane tileGrid;
    @FXML private Label emptyLabel;
    @FXML private ScrollPane scrollPane;

    /** Per-item references so a change-event can update one tile in place
     *  instead of rebuilding the whole grid. */
    private final Map<String, Label> qtyLabelByItemId = new HashMap<>();
    private final Map<String, GroceryItem> itemById = new HashMap<>();

    public InventoryController(App.Services services) { this.services = services; }

    @FXML
    public void initialize() {
        var user = services.auth.currentUser();
        if (user != null) roleBadge.setText(user.role());

        // Two equal-width columns
        tileGrid.getColumnConstraints().clear();
        for (int i = 0; i < COLUMNS; i++) {
            ColumnConstraints cc = new ColumnConstraints();
            cc.setPercentWidth(100.0 / COLUMNS);
            cc.setHgrow(Priority.ALWAYS);
            tileGrid.getColumnConstraints().add(cc);
        }

        searchField.textProperty().addListener((obs, oldV, newV) -> reloadAsync(newV));

        // Targeted updates: when CBL fires a change event, only redraw the
        // tiles whose docs actually changed. This stops the whole grid from
        // flickering on every +/- tap, AND it stops every product image from
        // being re-fetched on every replicator pull.
        services.db.onInventoryChanged(changedIds ->
                Platform.runLater(() -> applyIncrementalUpdate(changedIds)));

        reloadAsync(null);
    }

    private void reloadAsync(String query) {
        Thread t = new Thread(() -> {
            try {
                List<GroceryItem> results = (query == null || query.isBlank())
                        ? services.db.getAllInventory()
                        : services.db.searchInventory(query);
                Platform.runLater(() -> applyItems(results));
            } catch (Exception e) {
                log.error("Failed to load inventory", e);
            }
        }, "inventory-load");
        t.setDaemon(true);
        t.start();
    }

    private void reload(String query) {
        try {
            List<GroceryItem> results = (query == null || query.isBlank())
                    ? services.db.getAllInventory()
                    : services.db.searchInventory(query);
            applyItems(results);
        } catch (Exception e) {
            log.error("Failed to reload inventory", e);
        }
    }

    private void applyItems(List<GroceryItem> results) {
        tileGrid.getChildren().clear();
        qtyLabelByItemId.clear();
        itemById.clear();
        for (int i = 0; i < results.size(); i++) {
            int row = i / COLUMNS, col = i % COLUMNS;
            GroceryItem it = results.get(i);
            VBox tile = buildTile(it);
            tileGrid.add(tile, col, row);
            GridPane.setHgrow(tile, Priority.ALWAYS);
            itemById.put(it.getId(), it);
        }
        emptyLabel.setVisible(results.isEmpty());
        emptyLabel.setManaged(results.isEmpty());
    }

    /**
     * Incremental update: for each changed doc id, look it up and patch the
     * existing tile's qty label. If a changed id isn't on screen yet (new
     * product synced down for the first time, or the user has an active
     * search filter that hid it), fall back to a full reload so we don't
     * miss inserts.
     */
    private void applyIncrementalUpdate(List<String> changedIds) {
        if (changedIds == null || changedIds.isEmpty()) return;
        boolean missing = false;
        for (String id : changedIds) {
            if (!qtyLabelByItemId.containsKey(id)) { missing = true; break; }
        }
        if (missing) { reload(searchField.getText()); return; }

        for (String id : changedIds) {
            try {
                Document doc = services.db.getInventoryDocument(id);
                if (doc == null) continue; // deleted — full reload would handle it
                GroceryItem fresh = GroceryItem.fromDocument(doc);
                itemById.put(id, fresh);
                Label qtyLabel = qtyLabelByItemId.get(id);
                if (qtyLabel != null) qtyLabel.setText(String.valueOf(fresh.getQuantity()));
            } catch (Exception ex) {
                log.warn("Incremental update failed for {}: {}", id, ex.getMessage());
            }
        }
    }

    private VBox buildTile(GroceryItem item) {
        VBox tile = new VBox(6);
        tile.getStyleClass().add("inventory-tile");
        tile.setEffect(new DropShadow(10, 0, 3, Color.rgb(0, 0, 0, 0.10)));
        tile.setPadding(new Insets(14));
        tile.setAlignment(Pos.TOP_CENTER);
        tile.setMaxWidth(Double.MAX_VALUE);

        // Product image — pull from imageURL (capital URL!)
        ImageView iv = new ImageView();
        iv.setFitHeight(120);
        iv.setPreserveRatio(true);
        if (item.getImageURL() != null && !item.getImageURL().isBlank()) {
            try { iv.setImage(new Image(item.getImageURL(), true)); }
            catch (Exception ignored) {}
        }
        StackPane imgWrap = new StackPane(iv);
        imgWrap.setMinHeight(130);

        Label name = new Label(item.getName() != null ? item.getName() : "—");
        name.getStyleClass().add("tile-name");
        name.setWrapText(true);
        name.setMaxWidth(Double.MAX_VALUE);

        Label price = new Label(String.format("Price: $%.2f", item.getPrice()));
        price.getStyleClass().add("tile-price");

        Label invLabel = new Label("Inventory Count");
        invLabel.getStyleClass().add("tile-inv-label");

        Label qty = new Label(String.valueOf(item.getQuantity()));
        qty.getStyleClass().add("tile-qty");   // always green, no threshold
        if (item.getId() != null) qtyLabelByItemId.put(item.getId(), qty);

        final String itemId = item.getId();
        Button minus = new Button("−");
        minus.getStyleClass().add("circle-button");
        minus.setOnAction(e -> adjustQuantity(itemId, -1));
        Button plus = new Button("+");
        plus.getStyleClass().add("circle-button");
        plus.setOnAction(e -> adjustQuantity(itemId, +1));
        HBox circleRow = new HBox(16, minus, plus);
        circleRow.setAlignment(Pos.CENTER);

        Button reorder = new Button("Re-order now");
        reorder.getStyleClass().add("primary-button");
        reorder.setMaxWidth(Double.MAX_VALUE);
        reorder.setOnAction(e -> openCreateOrder(itemId));

        VBox qtyBlock = new VBox(2, invLabel, qty);
        qtyBlock.setAlignment(Pos.CENTER);

        tile.getChildren().addAll(imgWrap, name, price, qtyBlock, circleRow, reorder);
        return tile;
    }

    private void adjustQuantity(String itemId, int delta) {
        // Always read the latest cached state by id. The closure-captured
        // GroceryItem instance is replaced by the change-listener on every
        // save, so dereferencing it here would use a stale quantity.
        GroceryItem current = itemById.get(itemId);
        if (current == null) return;
        int next = Math.max(0, current.getQuantity() + delta);
        if (next == current.getQuantity()) return;

        // Optimistic UI: bump the label immediately so consecutive taps feel
        // responsive instead of waiting for the CBL change event round-trip.
        Label label = qtyLabelByItemId.get(itemId);
        if (label != null) label.setText(String.valueOf(next));
        current.setQuantity(next);

        Thread t = new Thread(() -> {
            try { services.db.updateQuantity(itemId, next); }
            catch (Exception ex) { log.error("Failed to update qty", ex); }
        }, "qty-update");
        t.setDaemon(true);
        t.start();
    }

    private void openCreateOrder(String itemId) {
        GroceryItem item = itemById.get(itemId);
        if (item == null) return;
        openCreateOrderDialog(item);
    }

    private void openCreateOrderDialog(GroceryItem item) {
        javafx.scene.control.TextInputDialog d = new javafx.scene.control.TextInputDialog("100");
        d.setTitle("Re-order Stock");
        d.setHeaderText("Re-order: " + (item.getName() != null ? item.getName() : ""));
        d.setContentText("Quantity to order:");
        d.showAndWait().ifPresent(qtyStr -> {
            try {
                int n = Integer.parseInt(qtyStr.trim());
                if (n <= 0) return;
                Thread t = new Thread(() -> {
                    try { services.db.createOrder(item, n); }
                    catch (Exception ex) { log.error("Failed to create order", ex); }
                }, "order-create");
                t.setDaemon(true);
                t.start();
            } catch (NumberFormatException ignored) {}
        });
    }
}
