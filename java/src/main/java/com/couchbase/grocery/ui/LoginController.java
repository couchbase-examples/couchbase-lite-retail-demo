package com.couchbase.grocery.ui;

import com.couchbase.grocery.App;
import com.couchbase.grocery.models.User;
import com.couchbase.grocery.services.AuthenticationManager;
import javafx.application.Platform;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Modality;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class LoginController {

    private static final Logger log = LoggerFactory.getLogger(LoginController.class);

    private final App.Services services;

    @FXML private TextField usernameField;
    @FXML private PasswordField passwordField;
    @FXML private Button signInButton;
    @FXML private Label errorLabel;
    @FXML private Label demoToggleLabel;
    @FXML private Label eyeIcon;

    private boolean passwordVisible = false;
    private TextField visiblePasswordField;

    public static final List<User.DemoUser> DEMO_USERS = List.of(
            new User.DemoUser("aa-store-01@supermarket.com", "P@ssword1", "AA",
                    "Ann Arbor Store Manager"),
            new User.DemoUser("nyc-store-01@supermarket.com", "P@ssword1", "NYC",
                    "NYC Store Manager"));

    public LoginController(App.Services services) {
        this.services = services;
    }

    @FXML
    public void initialize() {
        errorLabel.setVisible(false);
        errorLabel.setManaged(false);

        demoToggleLabel.setOnMouseClicked(e -> openDemoCredentialsSheet());
        signInButton.setOnAction(e -> attemptLogin(
                usernameField.getText(), passwordField.getText()));
        passwordField.setOnAction(e -> attemptLogin(
                usernameField.getText(), passwordField.getText()));
        eyeIcon.setOnMouseClicked(e -> togglePasswordVisibility());
    }

    private void togglePasswordVisibility() {
        passwordVisible = !passwordVisible;
        if (passwordVisible) {
            if (visiblePasswordField == null) {
                visiblePasswordField = new TextField(passwordField.getText());
                visiblePasswordField.getStyleClass().add("input-borderless");
                javafx.scene.layout.HBox.setHgrow(visiblePasswordField,
                        javafx.scene.layout.Priority.ALWAYS);
            }
            visiblePasswordField.setText(passwordField.getText());
            var parent = (javafx.scene.layout.HBox) passwordField.getParent();
            int idx = parent.getChildren().indexOf(passwordField);
            parent.getChildren().set(idx, visiblePasswordField);
            eyeIcon.setText("🙈");
        } else {
            passwordField.setText(visiblePasswordField.getText());
            var parent = (javafx.scene.layout.HBox) visiblePasswordField.getParent();
            int idx = parent.getChildren().indexOf(visiblePasswordField);
            parent.getChildren().set(idx, passwordField);
            eyeIcon.setText("👁");
        }
    }

    /** Public so the demo-credentials sheet can call back into login. */
    public void attemptLogin(String username, String password) {
        errorLabel.setVisible(false);
        errorLabel.setManaged(false);
        signInButton.setDisable(true);

        AuthenticationManager.LoginResult result = services.auth.login(username, password);

        if (!result.success()) {
            errorLabel.setText(result.errorMessage());
            errorLabel.setVisible(true);
            errorLabel.setManaged(true);
            signInButton.setDisable(false);
            return;
        }

        Thread worker = new Thread(() -> {
            try {
                services.db.openFor(result.config());
                Platform.runLater(this::showMainShell);
            } catch (Exception ex) {
                log.error("Failed to open DB", ex);
                Platform.runLater(() -> {
                    errorLabel.setText("DB error: " + ex.getMessage());
                    errorLabel.setVisible(true);
                    errorLabel.setManaged(true);
                    signInButton.setDisable(false);
                });
            }
        }, "login-worker");
        worker.setDaemon(true);
        worker.start();
    }

    private void openDemoCredentialsSheet() {
        try {
            FXMLLoader loader = new FXMLLoader(App.class.getResource("/fxml/demo_credentials.fxml"));
            DemoCredentialsController controller = new DemoCredentialsController(this);
            loader.setControllerFactory(type -> {
                if (type == DemoCredentialsController.class) return controller;
                try { return type.getDeclaredConstructor().newInstance(); }
                catch (Exception e) { throw new RuntimeException(e); }
            });
            Parent root = loader.load();

            Stage sheet = new Stage(StageStyle.UTILITY);
            sheet.initModality(Modality.WINDOW_MODAL);
            sheet.initOwner(services.stage);
            sheet.setTitle("Demo Credentials");
            Scene scene = new Scene(root, services.stage.getWidth(), services.stage.getHeight() - 80);
            scene.getStylesheets().add(App.class.getResource("/css/app.css").toExternalForm());
            sheet.setScene(scene);
            controller.setSheetStage(sheet);
            sheet.show();
        } catch (Exception e) {
            log.error("Failed to open demo credentials", e);
        }
    }

    private void showMainShell() {
        try {
            FXMLLoader loader = new FXMLLoader(App.class.getResource("/fxml/main.fxml"));
            loader.setControllerFactory(type -> {
                if (type == MainShellController.class) return new MainShellController(services);
                try { return type.getDeclaredConstructor().newInstance(); }
                catch (Exception e) { throw new RuntimeException(e); }
            });
            Parent root = loader.load();
            Scene scene = new Scene(root, services.stage.getWidth(), services.stage.getHeight());
            scene.getStylesheets().add(App.class.getResource("/css/app.css").toExternalForm());
            services.stage.setScene(scene);
        } catch (Exception e) {
            log.error("Failed to load main shell", e);
            errorLabel.setText("UI error: " + e.getMessage());
            errorLabel.setVisible(true);
            errorLabel.setManaged(true);
            signInButton.setDisable(false);
        }
    }
}
