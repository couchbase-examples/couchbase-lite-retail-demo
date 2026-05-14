package com.couchbase.grocery;

import com.couchbase.grocery.services.AuthenticationManager;
import com.couchbase.grocery.services.DatabaseManager;
import com.couchbase.grocery.services.EnvLoader;
import com.couchbase.grocery.ui.LoginController;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.stage.Stage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * JavaFX entry point. Wires up the singleton services (DB, sync, auth)
 * and shows the login screen.
 */
public class App extends Application {

    private static final Logger log = LoggerFactory.getLogger(App.class);

    // App-wide singletons — held on the Application instance so controllers
    // can grab them via the loader's user-data.
    private final DatabaseManager dbManager = new DatabaseManager();
    private final AuthenticationManager authManager = new AuthenticationManager();

    public static class Services {
        public final DatabaseManager db;
        public final AuthenticationManager auth;
        public final Stage stage;

        public Services(DatabaseManager db, AuthenticationManager auth, Stage stage) {
            this.db = db; this.auth = auth; this.stage = stage;
        }
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        // Eagerly load .env so the warning surfaces before login attempts.
        EnvLoader.load();
        // One-time CBL init so we don't pay the cost on first login.
        DatabaseManager.initCBL();

        Services services = new Services(dbManager, authManager, primaryStage);

        FXMLLoader loader = new FXMLLoader(App.class.getResource("/fxml/login.fxml"));
        loader.setControllerFactory(type -> {
            if (type == LoginController.class) return new LoginController(services);
            try {
                return type.getDeclaredConstructor().newInstance();
            } catch (Exception e) {
                throw new RuntimeException("Failed to instantiate " + type, e);
            }
        });

        Scene scene = new Scene(loader.load(), 480, 760);
        scene.getStylesheets().add(App.class.getResource("/css/app.css").toExternalForm());

        primaryStage.setTitle("Grocery Inventory");
        primaryStage.setScene(scene);
        primaryStage.setMinWidth(420);
        primaryStage.setMinHeight(680);
        primaryStage.show();
    }

    @Override
    public void stop() throws Exception {
        log.info("Application shutting down");
        dbManager.close();
        super.stop();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
