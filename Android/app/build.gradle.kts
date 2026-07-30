plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.example.groceryapplication"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.groceryapplication"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // Inject configuration from Gradle properties or environment variables
        // Use: export CBL_BASE_URL=... CBL_AA_DB=... CBL_NYC_DB=... CBL_AA_USER=... CBL_NYC_USER=... CBL_PASSWORD=...
        val env = System.getenv()
        fun prop(name: String): String = (project.findProperty(name)?.toString()
            ?: env[name]
            ?: "")

        buildConfigField("String", "CBL_BASE_URL", "\"${prop("CBL_BASE_URL")}\"")
        buildConfigField("String", "CBL_AA_DB", "\"${prop("CBL_AA_DB")}\"")
        buildConfigField("String", "CBL_NYC_DB", "\"${prop("CBL_NYC_DB")}\"")
        buildConfigField("String", "CBL_AA_USER", "\"${prop("CBL_AA_USER")}\"")
        buildConfigField("String", "CBL_NYC_USER", "\"${prop("CBL_NYC_USER")}\"")
        buildConfigField("String", "CBL_PASSWORD", "\"${prop("CBL_PASSWORD")}\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        compose = true
        buildConfig = true  // Enable BuildConfig generation for environment variables
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    
    // Compose
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    // Version comes from the Compose BOM above. Pinning it explicitly is what previously
    // dragged animation-core ahead of the BOM's material3 and crashed
    // CircularProgressIndicator with a NoSuchMethodError on KeyframesSpecConfig.at().
    implementation("androidx.compose.material:material-icons-extended")
    debugImplementation(libs.androidx.compose.ui.tooling)
    
    // Couchbase Lite - Enterprise Edition 4.1.0 with KTX (adds the Bluetooth
    // multipeer transport). Resolved from the public Maven repo in settings.gradle.kts.
    implementation("com.couchbase.lite:couchbase-lite-android-ee-ktx:4.1.0")

    // Vector search extension, needed for APPROX_VECTOR_DISTANCE. Must be major version 2
    // to match Couchbase Lite 4.1.0 — with 1.x the native library loads but reports a
    // version mismatch, the `vectorsearch` SQLite module never registers, and every index
    // creation fails silently. The failure surfaces only as a log line, so it is easy to
    // mistake for "vector search is broken".
    //
    // Shipped as separate per-ABI artifacts, and they cannot both be on the classpath: each
    // AAR contains the same `com.couchbase.lite.vectorsearch.BuildConfig`, so including both
    // fails with a duplicate-class error. Pick the one matching what you are deploying to:
    //
    //   arm64  — physical Android devices, and emulators on Apple Silicon (the default)
    //   x86_64 — emulators on Intel hosts
    //
    // Override without editing this file:
    //   ./gradlew :app:assembleDebug -PcopilotVectorSearchAbi=x86_64
    //
    // Vector search does NOT require a physical device; it requires the artifact for the ABI
    // the emulator actually runs.
    val copilotVectorSearchAbi =
        (project.findProperty("copilotVectorSearchAbi") as String?) ?: "arm64"
    implementation(
        "com.couchbase.lite:couchbase-lite-android-vector-search-$copilotVectorSearchAbi:2.0.0"
    )

    // ONNX Runtime — on-device query embedding with all-MiniLM-L6-v2, the Android
    // counterpart to CoreML on iOS. Same checkpoint and the same in-graph mean pooling,
    // so both platforms produce vectors comparable to the ones authored offline.
    implementation("com.microsoft.onnxruntime:onnxruntime-android:1.20.0")
    
    // Coil - Image loading library for Compose
    implementation("io.coil-kt:coil-compose:2.5.0")
    
    // Coroutines for async operations
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    
    // Lifecycle components for State management
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.7.0")
    implementation("androidx.compose.runtime:runtime-livedata:1.6.0")
    
    // JSON parsing
    implementation("com.google.code.gson:gson:2.10.1")
    
    // Testing
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}