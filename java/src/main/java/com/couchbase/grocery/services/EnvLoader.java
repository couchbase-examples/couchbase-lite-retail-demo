package com.couchbase.grocery.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Loads Capella App Services config from a {@code .env} file.
 *
 * <p>Resolution order:
 * <ol>
 *   <li>Bundled classpath resource at {@code /.env} (i.e.
 *       {@code src/main/resources/.env} — the default location, matches what
 *       the README tells the user to populate)</li>
 *   <li>{@code .env} in the current working directory (handy for prod /
 *       packaged deployments)</li>
 *   <li>OS environment variables override anything from the file</li>
 * </ol>
 *
 * <p>We deliberately don't use {@code dotenv-java}'s {@code Dotenv.entries()},
 * because by default it merges system env vars into the result — which made
 * the "is the file populated?" check unreliable (a stack with 45 random shell
 * vars looked just like a populated file).
 *
 * <p>Mirrors {@code Services/EnvLoader.cs} in the .NET MAUI port — same key
 * names so a single {@code .env} file works for both platforms.
 */
public final class EnvLoader {

    private static final Logger log = LoggerFactory.getLogger(EnvLoader.class);

    private static final String[] EXPECTED_KEYS = {
            "CBL_BASE_URL", "CBL_AA_DB", "CBL_NYC_DB",
            "CBL_AA_USER", "CBL_NYC_USER", "CBL_PASSWORD"
    };

    private static Map<String, String> cache;

    public static synchronized Map<String, String> load() {
        if (cache != null) return cache;

        Map<String, String> values = new LinkedHashMap<>();

        // 1. Classpath resource — this is where the README tells the user to
        //    drop their .env, and it's what `./gradlew run` ships to the
        //    application classloader.
        try (InputStream in = EnvLoader.class.getResourceAsStream("/.env")) {
            if (in != null) {
                int loaded = parseInto(in, values);
                log.info("Loaded {} entries from classpath /.env", loaded);
            }
        } catch (Exception e) {
            log.warn("Failed to read classpath /.env: {}", e.getMessage());
        }

        // 2. Working-dir .env (useful for packaged deployments where the file
        //    sits next to the launch script). Does NOT override values from
        //    the classpath copy — first-write wins.
        Path cwdEnv = Path.of(System.getProperty("user.dir"), ".env");
        if (Files.isRegularFile(cwdEnv)) {
            try (InputStream in = Files.newInputStream(cwdEnv)) {
                Map<String, String> diskValues = new HashMap<>();
                int loaded = parseInto(in, diskValues);
                diskValues.forEach(values::putIfAbsent);
                log.info("Loaded {} entries from {}", loaded, cwdEnv);
            } catch (IOException e) {
                log.warn("Failed to read {}: {}", cwdEnv, e.getMessage());
            }
        }

        // 3. OS env vars override file values for the known keys (handy for
        //    CI / containerized runs).
        for (String key : EXPECTED_KEYS) {
            String fromEnv = System.getenv(key);
            if (fromEnv != null && !fromEnv.isBlank()) values.put(key, fromEnv);
        }

        if (values.isEmpty()) {
            log.warn("No .env config found — Capella sync will fail until you "
                    + "populate src/main/resources/.env (see .env.example).");
        } else {
            int matched = 0;
            for (String key : EXPECTED_KEYS) if (values.containsKey(key)) matched++;
            log.info(".env loaded: {} expected keys present out of {}",
                    matched, EXPECTED_KEYS.length);
        }

        cache = Map.copyOf(values);
        return cache;
    }

    /** Minimal .env parser: {@code KEY=VALUE} per line, {@code #} comments, blank lines ignored. */
    private static int parseInto(InputStream in, Map<String, String> out) throws IOException {
        int count = 0;
        try (BufferedReader r = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            String line;
            while ((line = r.readLine()) != null) {
                String trimmed = line.trim();
                if (trimmed.isEmpty() || trimmed.startsWith("#")) continue;
                int eq = trimmed.indexOf('=');
                if (eq <= 0) continue;
                String key = trimmed.substring(0, eq).trim();
                String value = trimmed.substring(eq + 1).trim();
                // Strip optional surrounding quotes
                if (value.length() >= 2
                        && ((value.charAt(0) == '"' && value.charAt(value.length() - 1) == '"')
                            || (value.charAt(0) == '\'' && value.charAt(value.length() - 1) == '\''))) {
                    value = value.substring(1, value.length() - 1);
                }
                out.put(key, value);
                count++;
            }
        }
        return count;
    }

    public static String get(String key) { return load().get(key); }

    public static String getOrDefault(String key, String def) {
        return load().getOrDefault(key, def);
    }

    private EnvLoader() {}
}
