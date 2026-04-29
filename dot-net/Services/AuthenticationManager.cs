using System.Diagnostics;
using Couchbase.Lite;
using GroceryApp.Models;

namespace GroceryApp.Services;

/// <summary>
/// Persists session state in a local "AuthDB" Couchbase Lite database
/// so logins survive cold starts. Mirrors iOS/Android.
/// </summary>
public class AuthenticationManager : IDisposable
{
    private const string Tag = "AuthManager";
    private const string SessionDocId = "user_session";

    private readonly DatabaseManager _databaseManager;
    private Database? _database;

    public User? CurrentUser { get; private set; }
    public bool IsAuthenticated { get; private set; }
    public StoreProfile? StoreProfile { get; private set; }

    public event EventHandler? AuthStateChanged;

    private record UserCredentials(string Password, string FullName, string Role, string Endpoint);

    private readonly Dictionary<string, UserCredentials> _validCredentials = new(StringComparer.OrdinalIgnoreCase)
    {
        ["nyc-store-01@supermarket.com"] = new("P@ssword1", "NYC Store Manager", "Store Manager", "supermarket-nyc"),
        ["aa-store-01@supermarket.com"] = new("P@ssword1", "Ann Arbor Store Manager", "Store Manager", "supermarket-aa")
    };

    public AuthenticationManager(DatabaseManager databaseManager)
    {
        _databaseManager = databaseManager;
        InitializeDatabase();
        CheckStoredLogin();
    }

    private void InitializeDatabase()
    {
        try
        {
            _database = new Database("AuthDB");
            Log("Authentication database initialized");
        }
        catch (Exception ex)
        {
            LogError("Failed to initialize auth database", ex);
        }
    }

    public async Task<LoginResult> LoginAsync(string username, string password)
    {
        try
        {
            if (!_validCredentials.TryGetValue(username, out var creds) || creds.Password != password)
            {
                return new LoginResult.Error("Invalid username or password");
            }

            AppConfig.SetStoreForUser(username);
            _databaseManager.StartSyncAfterLogin();

            // Give sync a brief moment to pull the profile doc; we don't block forever.
            StoreProfile = await TryFetchProfileAsync().ConfigureAwait(false);

            var user = new User
            {
                Username = username.ToLowerInvariant(),
                FullName = creds.FullName,
                Role = creds.Role,
                ProfileName = StoreProfile?.Name
            };

            StoreSession(user);
            CurrentUser = user;
            IsAuthenticated = true;
            AuthStateChanged?.Invoke(this, EventArgs.Empty);
            Log($"Login successful: {user.FullName}");
            return new LoginResult.Success(user);
        }
        catch (Exception ex)
        {
            LogError("Login error", ex);
            return new LoginResult.Error($"Login failed: {ex.Message}");
        }
    }

    private async Task<StoreProfile?> TryFetchProfileAsync()
    {
        for (var i = 0; i < 5; i++)
        {
            var p = await _databaseManager.GetStoreProfileAsync().ConfigureAwait(false);
            if (p != null) return p;
            await Task.Delay(500).ConfigureAwait(false);
        }
        return null;
    }

    public void Logout()
    {
        try
        {
            _databaseManager.DisableAppServices();
            ClearSession();
            CurrentUser = null;
            IsAuthenticated = false;
            StoreProfile = null;
            AuthStateChanged?.Invoke(this, EventArgs.Empty);
            Log("User logged out");
        }
        catch (Exception ex)
        {
            LogError("Logout error", ex);
        }
    }

    private void CheckStoredLogin()
    {
        try
        {
            var collection = _database?.GetDefaultCollection();
            if (collection == null) return;
            using var sessionDoc = collection.GetDocument(SessionDocId);
            if (sessionDoc == null) { Log("No stored session document"); return; }

            var username = sessionDoc.GetString("username");
            var fullName = sessionDoc.GetString("fullName");
            var role = sessionDoc.GetString("role");
            var profileName = sessionDoc.GetString("profileName");
            var isAuth = sessionDoc.GetBoolean("isAuthenticated");

            if (!isAuth || username == null || fullName == null || role == null)
            {
                Log("No valid stored session found");
                return;
            }
            if (!_validCredentials.ContainsKey(username))
            {
                Log("Stored credentials no longer valid; clearing session");
                ClearSession();
                return;
            }

            AppConfig.SetStoreForUser(username);
            CurrentUser = new User
            {
                Username = username,
                FullName = fullName,
                Role = role,
                ProfileName = profileName
            };
            IsAuthenticated = true;
            AuthStateChanged?.Invoke(this, EventArgs.Empty);
            Log($"Restored login session: {fullName}");

            _databaseManager.StartSyncAfterLogin();
        }
        catch (Exception ex)
        {
            LogError("Error checking stored login", ex);
            ClearSession();
        }
    }

    private void StoreSession(User user)
    {
        try
        {
            var collection = _database?.GetDefaultCollection();
            if (collection == null) return;
            using var doc = new MutableDocument(SessionDocId);
            doc.SetString("username", user.Username);
            doc.SetString("fullName", user.FullName);
            doc.SetString("role", user.Role);
            if (user.ProfileName != null) doc.SetString("profileName", user.ProfileName);
            doc.SetBoolean("isAuthenticated", true);
            doc.SetLong("loginTime", DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
            collection.Save(doc);
            Log("Session stored in Couchbase Lite");
        }
        catch (Exception ex)
        {
            LogError("Error storing session", ex);
        }
    }

    private void ClearSession()
    {
        try
        {
            var collection = _database?.GetDefaultCollection();
            if (collection == null) return;
            using var sessionDoc = collection.GetDocument(SessionDocId);
            if (sessionDoc != null)
            {
                collection.Delete(sessionDoc);
                Log("Session cleared from Couchbase Lite");
            }
        }
        catch (Exception ex)
        {
            LogError("Error clearing session", ex);
        }
    }

    public IReadOnlyList<DemoUser> GetAllUsers()
    {
        return _validCredentials
            .Select(kv => new DemoUser
            {
                Username = kv.Key,
                FullName = kv.Value.FullName,
                Role = kv.Value.Role,
                Endpoint = kv.Value.Endpoint,
                Password = kv.Value.Password
            })
            .OrderBy(u => u.Username)
            .ToList();
    }

    public void Dispose()
    {
        try
        {
            _database?.Close();
            _database?.Dispose();
            _database = null;
        }
        catch (Exception ex)
        {
            LogError("Error closing auth database", ex);
        }
        GC.SuppressFinalize(this);
    }

    private static void Log(string message)
    {
        if (AppConfig.DebugLogging) Debug.WriteLine($"[{Tag}] {message}");
    }

    private static void LogError(string message, Exception? ex = null)
    {
        Debug.WriteLine($"[{Tag}] ERROR: {message}{(ex != null ? $" - {ex.Message}" : string.Empty)}");
    }
}
