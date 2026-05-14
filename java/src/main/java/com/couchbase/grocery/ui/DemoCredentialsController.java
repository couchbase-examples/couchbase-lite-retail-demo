package com.couchbase.grocery.ui;

import com.couchbase.grocery.models.User;
import javafx.fxml.FXML;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.Separator;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.util.List;

/**
 * Modal sheet that lists demo users. Tapping a row auto-fills the login form
 * and submits — mirrors the Swift "DEMO USER ACCOUNTS - TAP TO LOGIN" sheet.
 */
public class DemoCredentialsController {

    private final LoginController loginController;
    private Stage sheetStage;

    @FXML private Button doneButton;
    @FXML private VBox accountsCard;

    public DemoCredentialsController(LoginController login) {
        this.loginController = login;
    }

    public void setSheetStage(Stage stage) { this.sheetStage = stage; }

    @FXML
    public void initialize() {
        doneButton.setOnAction(e -> close());

        List<User.DemoUser> users = LoginController.DEMO_USERS;
        for (int i = 0; i < users.size(); i++) {
            accountsCard.getChildren().add(buildRow(users.get(i)));
            if (i < users.size() - 1) {
                Separator sep = new Separator();
                sep.getStyleClass().add("credentials-separator");
                accountsCard.getChildren().add(sep);
            }
        }
    }

    private VBox buildRow(User.DemoUser u) {
        // Top line: email (bold, wraps) + Store Manager pill + arrow button
        Label email = new Label(u.username());
        email.getStyleClass().add("credential-email");
        email.setWrapText(true);
        email.setMaxWidth(Double.MAX_VALUE);
        HBox.setHgrow(email, Priority.ALWAYS);

        Label roleBadge = new Label("Store Manager");
        roleBadge.getStyleClass().add("credential-role-pill");

        Button arrow = new Button("→");
        arrow.getStyleClass().add("credential-arrow-button");
        arrow.setOnAction(e -> useCredential(u));

        HBox top = new HBox(10, email, roleBadge, arrow);
        top.setAlignment(Pos.CENTER_LEFT);

        Label description = new Label(u.label());
        description.getStyleClass().add("credential-description");

        Label endpoint = new Label();
        endpoint.getStyleClass().add("credential-endpoint");
        // monospace + colored "Endpoint:" prefix
        endpoint.setText("Endpoint:  supermarket-" + u.store().toLowerCase());

        Label password = new Label("Password:  " + u.password());
        password.getStyleClass().add("credential-password");

        VBox row = new VBox(6, top, description, endpoint, password);
        row.setPadding(new Insets(14, 16, 14, 16));
        row.setOnMouseClicked(e -> useCredential(u));
        row.getStyleClass().add("credential-row");
        return row;
    }

    private void useCredential(User.DemoUser u) {
        close();
        loginController.attemptLogin(u.username(), u.password());
    }

    private void close() {
        if (sheetStage != null) sheetStage.close();
    }
}
