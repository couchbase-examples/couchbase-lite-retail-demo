pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
    repositories {
        mavenLocal()  // Check local Maven repository first
        google()
        mavenCentral()
        maven {
            url = uri("https://mobile.maven.couchbase.com/maven2/dev/")
            isAllowInsecureProtocol = false
        }
    }
}

rootProject.name = "LiquorApp"
include(":app")

