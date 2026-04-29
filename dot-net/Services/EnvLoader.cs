using System.Diagnostics;
using Microsoft.Maui.Storage;

namespace GroceryApp.Services;

/// <summary>
/// Loads a packaged .env file (under Resources/Raw/.env) and copies its
/// CBL_* keys into <see cref="Preferences"/> so AppConfig can read them
/// across launches without re-bundling. Falls back silently if no file is
/// present or values are already set.
/// </summary>
public static class EnvLoader
{
    private const string Tag = "EnvLoader";
    private static readonly string[] KnownKeys =
    {
        "CBL_BASE_URL",
        "CBL_AA_DB",
        "CBL_NYC_DB",
        "CBL_AA_USER",
        "CBL_NYC_USER",
        "CBL_PASSWORD"
    };

    public static void LoadFromAppPackage()
    {
        try
        {
            using var stream = FileSystem.OpenAppPackageFileAsync(".env").GetAwaiter().GetResult();
            using var reader = new StreamReader(stream);
            string? line;
            var loaded = 0;
            while ((line = reader.ReadLine()) != null)
            {
                line = line.Trim();
                if (string.IsNullOrEmpty(line) || line.StartsWith("#")) continue;
                var eq = line.IndexOf('=');
                if (eq <= 0) continue;
                var key = line[..eq].Trim();
                var value = line[(eq + 1)..].Trim().Trim('"', '\'');
                if (Array.IndexOf(KnownKeys, key) < 0) continue;
                Preferences.Set(key, value);
                loaded++;
            }
            Debug.WriteLine($"[{Tag}] Loaded {loaded} key(s) from .env");
        }
        catch (FileNotFoundException)
        {
            Debug.WriteLine($"[{Tag}] No .env file packaged; relying on Preferences/env vars");
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"[{Tag}] Error loading .env: {ex.Message}");
        }
    }
}
