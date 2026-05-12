using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GroceryApp.Models;
using GroceryApp.Services;

namespace GroceryApp.ViewModels;

public partial class SettingsViewModel : BaseViewModel
{
    private readonly DatabaseManager _databaseManager;
    private readonly AuthenticationManager _authManager;

    [ObservableProperty]
    private string syncStatus = "Disconnected";

    [ObservableProperty]
    private string lastSyncTime = "—";

    [ObservableProperty]
    private float progress;

    [ObservableProperty]
    private bool isAppServicesEnabled;

    /// <summary>
    /// Set to <c>true</c> while we're propagating a state change *from* the
    /// sync manager into the bound property, so the resulting setter does
    /// not call back into Enable/Disable and create a feedback loop.
    /// </summary>
    private bool _suppressToggleSideEffect;

    [ObservableProperty]
    private string username = string.Empty;

    [ObservableProperty]
    private string fullName = string.Empty;

    [ObservableProperty]
    private string role = string.Empty;

    [ObservableProperty]
    private string storeDisplayName = string.Empty;

    [ObservableProperty]
    private string syncUrl = string.Empty;

    public event EventHandler? LoggedOut;

    public SettingsViewModel(DatabaseManager databaseManager, AuthenticationManager authManager)
    {
        _databaseManager = databaseManager;
        _authManager = authManager;

        if (_databaseManager.SyncManager != null)
        {
            _databaseManager.SyncManager.SyncStateChanged += OnSyncStateChanged;
            UpdateFromSyncState(_databaseManager.SyncManager.SyncState);
        }

        _authManager.AuthStateChanged += (_, _) => UpdateUserInfo();
        UpdateUserInfo();
    }

    private void UpdateUserInfo()
    {
        var user = _authManager.CurrentUser;
        Username = user?.Username ?? string.Empty;
        FullName = user?.FullName ?? string.Empty;
        Role = user?.Role ?? string.Empty;
        StoreDisplayName = AppConfig.CurrentStore.DisplayName();
        SyncUrl = AppConfig.SyncGatewayUrl;
        SetIsAppServicesEnabledFromManager(_databaseManager.IsAppServicesEnabled);
    }

    private async void OnSyncStateChanged(object? sender, AppServicesSyncState state)
    {
        await MainThread.InvokeOnMainThreadAsync(() => UpdateFromSyncState(state));
    }

    private void UpdateFromSyncState(AppServicesSyncState state)
    {
        SyncStatus = state.Status;
        Progress = state.Progress;
        SetIsAppServicesEnabledFromManager(_databaseManager.IsAppServicesEnabled);
        LastSyncTime = state.LastSyncTime?.ToLocalTime().ToString("HH:mm:ss") ?? "—";
    }

    private void SetIsAppServicesEnabledFromManager(bool enabled)
    {
        if (IsAppServicesEnabled == enabled) return;
        _suppressToggleSideEffect = true;
        try
        {
            IsAppServicesEnabled = enabled;
        }
        finally
        {
            _suppressToggleSideEffect = false;
        }
    }

    /// <summary>
    /// Triggered by the source generator whenever <see cref="IsAppServicesEnabled"/>
    /// changes. Drives the sync manager from a single direction: the bound
    /// switch flips this property, this method calls Enable/Disable, and
    /// programmatic state pushes from the manager use the suppress flag so
    /// they don't echo back through here.
    /// </summary>
    partial void OnIsAppServicesEnabledChanged(bool value)
    {
        if (_suppressToggleSideEffect) return;
        if (_databaseManager.SyncManager == null) return;
        if (_databaseManager.SyncManager.IsEnabled == value) return;
        if (value) _databaseManager.SyncManager.EnableAppServices();
        else _databaseManager.SyncManager.DisableAppServices();
    }

    [RelayCommand]
    private void ResetSync()
    {
        _databaseManager.SyncManager?.ResetSync();
    }

    [RelayCommand]
    private void Logout()
    {
        _authManager.Logout();
        LoggedOut?.Invoke(this, EventArgs.Empty);
    }
}
