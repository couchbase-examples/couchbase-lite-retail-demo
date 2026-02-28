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
    implementation("androidx.compose.material:material-icons-extended:1.6.0")
    debugImplementation(libs.androidx.compose.ui.tooling)
    
    // Couchbase Lite - Enterprise Edition 3.3.0 with KTX
    implementation("com.couchbase.lite:couchbase-lite-android-ee-ktx:3.3.0")
    
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