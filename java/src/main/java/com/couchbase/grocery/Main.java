package com.couchbase.grocery;

/**
 * Plain-Java launcher. Exists because JavaFX's {@code Application.launch()}
 * can't be called from a JAR whose main class extends {@code Application}
 * without the JavaFX modules being on the runtime module path. This shim
 * sidesteps that — Gradle's {@code application} plugin uses it as
 * {@code mainClass}.
 */
public class Main {
    public static void main(String[] args) {
        App.main(args);
    }
}
