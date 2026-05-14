package com.couchbase.grocery.ui;

import com.couchbase.grocery.App;
import com.couchbase.grocery.models.Order;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Label;
import javafx.scene.control.ToggleButton;
import javafx.scene.control.ToggleGroup;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class OrdersController {

    private static final Logger log = LoggerFactory.getLogger(OrdersController.class);
    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("MMM d, yyyy · h:mm a").withZone(ZoneId.systemDefault());

    private final App.Services services;

    @FXML private HBox chipsRow;
    @FXML private VBox listContainer;
    @FXML private Label emptyLabel;

    private final ToggleGroup chipGroup = new ToggleGroup();
    private String activeFilter = "All";
    private List<Order> currentOrders = List.of();

    public OrdersController(App.Services services) { this.services = services; }

    @FXML
    public void initialize() {
        for (String label : Arrays.asList("All", "Submitted", "In Review", "Approved")) {
            ToggleButton chip = new ToggleButton(label);
            chip.getStyleClass().add("filter-chip");
            chip.setToggleGroup(chipGroup);
            if (label.equals("All")) chip.setSelected(true);
            chip.setOnAction(e -> {
                if (!chip.isSelected()) chip.setSelected(true);
                activeFilter = label;
                applyFilter();
            });
            chipsRow.getChildren().add(chip);
        }

        services.db.onOrdersChanged(v -> Platform.runLater(this::reload));
        reloadAsync();
    }

    private void reloadAsync() {
        Thread t = new Thread(() -> {
            try {
                List<Order> orders = services.db.getAllOrders();
                Platform.runLater(() -> {
                    currentOrders = orders;
                    applyFilter();
                });
            } catch (Exception e) {
                log.error("Failed to load orders", e);
            }
        }, "orders-load");
        t.setDaemon(true);
        t.start();
    }

    private void reload() {
        try {
            currentOrders = services.db.getAllOrders();
            applyFilter();
        } catch (Exception e) {
            log.error("Failed to reload orders", e);
        }
    }

    private void applyFilter() {
        List<Order> filtered = "All".equals(activeFilter)
                ? currentOrders
                : currentOrders.stream()
                    .filter(o -> activeFilter.equalsIgnoreCase(o.getOrderStatus().label))
                    .collect(Collectors.toList());

        listContainer.getChildren().clear();
        for (Order o : filtered) listContainer.getChildren().add(buildRow(o));
        emptyLabel.setVisible(filtered.isEmpty());
        emptyLabel.setManaged(filtered.isEmpty());
    }

    private HBox buildRow(Order o) {
        // Title line: "Order #123" + sku (if present)
        String title = "Order #" + o.getOrderId();
        if (o.getSku() != null && !o.getSku().isBlank()) title += "  ·  SKU " + o.getSku();
        Label name = new Label(title);
        name.getStyleClass().add("order-name");

        // Meta line: date + qty + unit
        String unit = (o.getUnit() != null && !o.getUnit().isBlank()) ? " " + o.getUnit() : "";
        String meta = formatDate(o.getOrderDate()) + "  ·  Qty " + o.getOrderQty() + unit;
        Label metaLabel = new Label(meta);
        metaLabel.getStyleClass().add("order-meta");

        VBox left = new VBox(4, name, metaLabel);

        Label status = new Label(o.getOrderStatus().label);
        status.getStyleClass().addAll("status-pill", statusStyle(o.getOrderStatus()));

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        HBox row = new HBox(12, left, spacer, status);
        row.getStyleClass().add("order-row");
        row.setAlignment(Pos.CENTER_LEFT);
        row.setPadding(new Insets(14, 16, 14, 16));
        return row;
    }

    private static String statusStyle(Order.Status s) {
        return switch (s) {
            case APPROVED   -> "status-approved";
            case IN_REVIEW  -> "status-review";
            case REJECTED   -> "status-rejected";
            default         -> "status-submitted";
        };
    }

    private static String formatDate(long epochMillis) {
        if (epochMillis <= 0) return "";
        try { return DATE_FMT.format(Instant.ofEpochMilli(epochMillis)); }
        catch (Exception e) { return String.valueOf(epochMillis); }
    }
}
