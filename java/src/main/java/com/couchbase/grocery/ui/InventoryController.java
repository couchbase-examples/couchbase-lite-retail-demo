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

import java.util.List;

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
        services.db.onInventoryChanged(v -> Platform.runLater(() -> reload(searchField.getText())));

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
        for (int i = 0; i < results.size(); i++) {
            int row = i / COLUMNS, col = i % COLUMNS;
            VBox tile = buildTile(results.get(i));
            tileGrid.add(tile, col, row);
            GridPane.setHgrow(tile, Priority.ALWAYS);
        }
        emptyLabel.setVisible(results.isEmpty());
        emptyLabel.setManaged(results.isEmpty());
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

        Button minus = new Button("−");
        minus.getStyleClass().add("circle-button");
        minus.setOnAction(e -> adjustQuantity(item, -1));
        Button plus = new Button("+");
        plus.getStyleClass().add("circle-button");
        plus.setOnAction(e -> adjustQuantity(item, +1));
        HBox circleRow = new HBox(16, minus, plus);
        circleRow.setAlignment(Pos.CENTER);

        Button reorder = new Button("Re-order now");
        reorder.getStyleClass().add("primary-button");
        reorder.setMaxWidth(Double.MAX_VALUE);
        reorder.setOnAction(e -> openCreateOrder(item));

        VBox qtyBlock = new VBox(2, invLabel, qty);
        qtyBlock.setAlignment(Pos.CENTER);

        tile.getChildren().addAll(imgWrap, name, price, qtyBlock, circleRow, reorder);
        return tile;
    }

    private void adjustQuantity(GroceryItem item, int delta) {
        int next = Math.max(0, item.getQuantity() + delta);
        if (next == item.getQuantity()) return;
        Thread t = new Thread(() -> {
            try { services.db.updateQuantity(item.getId(), next); }
            catch (Exception ex) { log.error("Failed to update qty", ex); }
        }, "qty-update");
        t.setDaemon(true);
        t.start();
    }

    private void openCreateOrder(GroceryItem item) {
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
