package com.couchbase.grocery.ui;

import com.couchbase.grocery.App;
import com.couchbase.grocery.models.StoreProfile;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.scene.control.Label;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ProfileController {

    private static final Logger log = LoggerFactory.getLogger(ProfileController.class);

    private final App.Services services;

    @FXML private Label storeNameLabel;
    @FXML private Label storeIdLabel;
    @FXML private Label emailLabel;
    @FXML private Label phoneLabel;
    @FXML private Label addressLabel;
    @FXML private Label coordsLabel;
    @FXML private Label managerLabel;
    @FXML private Label emptyLabel;
    @FXML private javafx.scene.layout.VBox contentBox;

    public ProfileController(App.Services services) { this.services = services; }

    @FXML
    public void initialize() {
        services.db.onProfileChanged(ids -> Platform.runLater(this::reload));
        reloadAsync();
    }

    private void reloadAsync() {
        Thread t = new Thread(() -> {
            try {
                StoreProfile p = services.db.getProfile();
                Platform.runLater(() -> apply(p));
            } catch (Exception e) {
                log.error("Failed to load profile", e);
            }
        }, "profile-load");
        t.setDaemon(true);
        t.start();
    }

    private void reload() {
        try { apply(services.db.getProfile()); }
        catch (Exception e) { log.error("Failed to reload profile", e); }
    }

    private void apply(StoreProfile p) {
        boolean hasData = p != null;
        contentBox.setVisible(hasData);
        contentBox.setManaged(hasData);
        emptyLabel.setVisible(!hasData);
        emptyLabel.setManaged(!hasData);
        if (!hasData) return;

        storeNameLabel.setText(p.getName() != null ? p.getName() : "—");
        storeIdLabel.setText("Store ID: " + (p.getStoreId() != null ? p.getStoreId() : "—"));
        emailLabel.setText(p.getEmail() != null ? p.getEmail() : "—");
        phoneLabel.setText(p.getPhone() != null ? p.getPhone() : "—");

        StringBuilder addr = new StringBuilder();
        if (p.getAddress1() != null) addr.append(p.getAddress1()).append('\n');
        if (p.getAddress2() != null && !p.getAddress2().isBlank())
            addr.append(p.getAddress2()).append('\n');
        if (p.getLocality() != null || p.getRegion() != null || p.getPostalCode() != null) {
            if (p.getLocality() != null) addr.append(p.getLocality());
            if (p.getRegion() != null)   addr.append(", ").append(p.getRegion());
            if (p.getPostalCode() != null) addr.append(' ').append(p.getPostalCode());
            addr.append('\n');
        }
        if (p.getCountry() != null) addr.append(p.getCountry());
        addressLabel.setText(addr.toString().trim());

        if (p.getLatitude() != null && p.getLongitude() != null) {
            coordsLabel.setText(String.format("📍 %.6f, %.6f", p.getLatitude(), p.getLongitude()));
        } else {
            coordsLabel.setText("");
        }

        managerLabel.setText(p.getManager() != null && !p.getManager().isBlank()
                ? "Manager: " + p.getManager() : "");
    }
}
