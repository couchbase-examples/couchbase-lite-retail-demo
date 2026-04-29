using System.Diagnostics;
using Couchbase.Lite;
using Couchbase.Lite.Sync;
using GroceryApp.Models;

namespace GroceryApp.Services;

/// <summary>
/// Manages the continuous WebSocket replicator that pushes/pulls
/// inventory, orders, and profile changes to/from Capella App Services.
/// </summary>
public class AppServicesSyncManager : IDisposable
{
    private const string Tag = "AppServicesSync";

    private readonly Database _database;
    private readonly object _gate = new();

    private Replicator? _replicator;
    private ListenerToken _replicatorChangeToken;
    private bool _hasChangeListener;
    private bool _isSyncActive;

    public bool IsEnabled { get; private set; }

    private AppServicesSyncState _syncState = new();
    public AppServicesSyncState SyncState
    {
        get => _syncState;
        private set
        {
            _syncState = value;
            SyncStateChanged?.Invoke(this, value);
        }
    }

    public event EventHandler<AppServicesSyncState>? SyncStateChanged;

    public AppServicesSyncManager(Database database)
    {
        _database = database;
    }

    /// <summary>
    /// (Re)build the replicator using current AppConfig values.
    /// Stops any existing replicator first. Does not start sync.
    /// </summary>
    public void SetupAppServicesSync()
    {
        lock (_gate)
        {
            try
            {
                StopSync();
                if (_hasChangeListener && _replicator != null)
                {
                    _replicator.RemoveChangeListener(_replicatorChangeToken);
                    _hasChangeListener = false;
                }
                _replicator?.Dispose();
                _replicator = null;

                Log($"Setting up App Services sync configuration...");
                Log($"Scope: {AppConfig.ScopeName}");
                Log($"URL: {AppConfig.SyncGatewayUrl}");
                Log($"User: {AppConfig.Username}");

                var inventory = _database.GetCollection(AppConfig.CollectionName, AppConfig.ScopeName)
                                ?? _database.CreateCollection(AppConfig.CollectionName, AppConfig.ScopeName);
                var profile = _database.GetCollection(AppConfig.ProfileCollectionName, AppConfig.ScopeName)
                              ?? _database.CreateCollection(AppConfig.ProfileCollectionName, AppConfig.ScopeName);
                var orders = _database.GetCollection(AppConfig.OrdersCollectionName, AppConfig.ScopeName)
                             ?? _database.CreateCollection(AppConfig.OrdersCollectionName, AppConfig.ScopeName);

                if (string.IsNullOrWhiteSpace(AppConfig.SyncGatewayUrl) || !Uri.TryCreate(AppConfig.SyncGatewayUrl, UriKind.Absolute, out var uri))
                {
                    throw new InvalidOperationException("CBL_BASE_URL is not configured or invalid. Set it in your .env file or app preferences.");
                }

                var target = new URLEndpoint(uri);
                var collectionConfigs = CollectionConfiguration.FromCollections(
                    inventory, profile, orders);

                var config = new ReplicatorConfiguration(collectionConfigs, target)
                {
                    ReplicatorType = ReplicatorType.PushAndPull,
                    Continuous = AppConfig.SyncContinuous,
                    Heartbeat = TimeSpan.FromSeconds(AppConfig.SyncHeartbeat),
                    MaxAttempts = AppConfig.SyncMaxAttempts,
                    MaxAttemptsWaitTime = TimeSpan.FromSeconds(AppConfig.SyncMaxAttemptWaitTime),
                    Authenticator = new BasicAuthenticator(AppConfig.Username, AppConfig.Password)
                };

                _replicator = new Replicator(config);
                _replicatorChangeToken = _replicator.AddChangeListener(HandleReplicationChange);
                _hasChangeListener = true;

                Log("App Services sync configured successfully");
                SyncState = SyncState.With(status: "Ready to sync", clearError: true);
            }
            catch (Exception ex)
            {
                LogError("Failed to setup App Services sync", ex);
                SyncState = SyncState.With(status: "Setup failed", error: ex.Message);
                throw;
            }
        }
    }

    /// <summary>Convenience: setup + start.</summary>
    public void SetupAndStartSync()
    {
        SetupAppServicesSync();
        EnableAppServices();
    }

    public void EnableAppServices()
    {
        lock (_gate)
        {
            if (_isSyncActive)
            {
                Log("enableAppServices: sync already active, skipping");
                return;
            }
            Log("Enabling App Services sync...");
            IsEnabled = true;
            StartSync();
            SyncState = SyncState.With(status: "Starting cloud sync...");
        }
    }

    public void DisableAppServices()
    {
        lock (_gate)
        {
            if (!IsEnabled) return;
            Log("Disabling App Services sync...");
            IsEnabled = false;
            StopSync();
            SyncState = SyncState.With(status: "Cloud sync stopped", isConnected: false);
        }
    }

    public void ToggleAppServices()
    {
        if (IsEnabled) DisableAppServices(); else EnableAppServices();
    }

    private void StartSync()
    {
        if (_replicator == null)
        {
            LogError("Cannot start sync - replicator not available");
            return;
        }
        if (_isSyncActive) return;
        Log("Starting App Services replicator...");
        _isSyncActive = true;
        _replicator.Start();
        SyncState = SyncState.With(status: "Connecting to cloud...");
    }

    private void StopSync()
    {
        if (!_isSyncActive) return;
        Log("Stopping App Services replicator...");
        _replicator?.Stop();
        _isSyncActive = false;
        SyncState = SyncState.With(status: "Sync stopped", isConnected: false);
    }

    public void ResetSync()
    {
        Log("Resetting App Services sync...");
        StopSync();
        Task.Run(async () =>
        {
            await Task.Delay(1000).ConfigureAwait(false);
            lock (_gate)
            {
                if (IsEnabled) StartSync();
            }
        });
        SyncState = SyncState.With(status: "Resetting sync...", progress: 0f, clearError: true);
    }

    public void PushDocumentImmediately(string documentId)
    {
        if (!IsEnabled || _replicator == null)
        {
            Log("Cannot push document - sync not enabled");
            return;
        }
        Log($"Triggering immediate push for document: {documentId}");
        if (!_isSyncActive) StartSync();
    }

    private void HandleReplicationChange(object? sender, ReplicatorStatusChangedEventArgs e)
    {
        var status = e.Status;
        var progress = status.Progress;
        Log($"Sync change: {status.Activity} - {progress.Completed}/{progress.Total}");

        var isConnected = status.Activity == ReplicatorActivityLevel.Busy
                         || status.Activity == ReplicatorActivityLevel.Idle;
        var progressValue = progress.Total > 0
            ? (float)progress.Completed / progress.Total
            : 0f;
        var statusMessage = status.Activity switch
        {
            ReplicatorActivityLevel.Connecting => "Connecting to cloud...",
            ReplicatorActivityLevel.Busy => $"Syncing... ({progress.Completed}/{progress.Total})",
            ReplicatorActivityLevel.Idle => "Cloud sync ready",
            ReplicatorActivityLevel.Stopped => "Sync stopped",
            ReplicatorActivityLevel.Offline => "Cloud offline",
            _ => "Unknown"
        };

        var newState = SyncState.With(
            isConnected: isConnected,
            status: statusMessage,
            progress: progressValue,
            documentsCompleted: (int)progress.Completed,
            totalDocuments: (int)progress.Total,
            documentsInSync: (int)progress.Total);

        if (status.Activity == ReplicatorActivityLevel.Idle)
        {
            newState = newState.With(lastSyncTime: DateTime.UtcNow, progress: 1f);
        }

        if (status.Error != null)
        {
            LogError("App Services sync error", status.Error);
            var msg = status.Error.Message;
            var pretty = msg switch
            {
                var m when m?.Contains("network", StringComparison.OrdinalIgnoreCase) == true => "Network error - will retry",
                var m when m?.Contains("auth", StringComparison.OrdinalIgnoreCase) == true => "Authentication failed",
                var m when m?.Contains("forbidden", StringComparison.OrdinalIgnoreCase) == true => "Access denied",
                var m when m?.Contains("not found", StringComparison.OrdinalIgnoreCase) == true => "Database not found",
                _ => $"Sync error: {msg}"
            };
            newState = newState.With(status: pretty, error: msg, isConnected: false);
        }
        else
        {
            newState = newState.With(clearError: true);
        }

        SyncState = newState;
    }

    public string GetSyncStatusSummary()
    {
        if (!IsEnabled) return "App Services sync disabled";
        var s = SyncState;
        var baseStatus = s.Status;
        if (s.IsConnected && s.LastSyncTime != null)
        {
            return $"{baseStatus} • Last: {s.LastSyncTime.Value.ToLocalTime():HH:mm:ss}";
        }
        return baseStatus;
    }

    public void Dispose()
    {
        Log("Cleaning up AppServicesSyncManager...");
        try
        {
            StopSync();
            if (_hasChangeListener && _replicator != null)
            {
                _replicator.RemoveChangeListener(_replicatorChangeToken);
                _hasChangeListener = false;
            }
            _replicator?.Dispose();
            _replicator = null;
        }
        catch (Exception ex)
        {
            LogError("Error during dispose", ex);
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
