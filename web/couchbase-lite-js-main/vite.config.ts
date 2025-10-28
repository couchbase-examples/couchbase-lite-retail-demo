/// <reference types="vitest/config" />
/// <reference types="@vitest/browser/providers/playwright" />
import { defineConfig } from "vite";
import { resolve } from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import pkg from "./package.json";

export default defineConfig({
    plugins: [tsconfigPaths(), dts({ include: "src/**/*.ts" })],
    publicDir: false,
    build: {
        lib: {
            entry: resolve(__dirname, "src/couchbase-lite.ts"),
            name: "CouchbaseLite",
            formats: ["es", "cjs", "umd"],
            fileName: (format) => {
                return format === "umd" ? "couchbase-lite.js" : `couchbase-lite.${format}.js`;
            },
        },
        rollupOptions: {
            external: ["node:fs", "node:path", "node:crypto", "node:buffer", "node:stream", "node:util"],
            output: {
                globals: {
                    // Global dependencies that should be bundled in UMD builds
                },
            },
        },
        sourcemap: true,
        minify: "esbuild",
    },
    test: {
        // https://vitest.dev/config/
        include: ["src/**/*.test.ts"],
        browser: {
            instances: [{
                name: "chromium",
                browser: "chromium",
                headless: true,
            }],
            provider: "playwright"
        }
    },
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
    }
});
