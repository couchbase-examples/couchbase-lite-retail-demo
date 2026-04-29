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
        IsAppServicesEnabled = _databaseManager.IsAppServicesEnabled;
    }

    private async void OnSyncStateChanged(object? sender, AppServicesSyncState state)
    {
        await MainThread.InvokeOnMainThreadAsync(() => UpdateFromSyncState(state));
    }

    private void UpdateFromSyncState(AppServicesSyncState state)
    {
        SyncStatus = state.Status;
        Progress = state.Progress;
        IsAppServicesEnabled = _databaseManager.IsAppServicesEnabled;
        LastSyncTime = state.LastSyncTime?.ToLocalTime().ToString("HH:mm:ss") ?? "—";
    }

    [RelayCommand]
    private void ToggleSync()
    {
        if (_databaseManager.SyncManager == null) return;
        _databaseManager.SyncManager.ToggleAppServices();
        IsAppServicesEnabled = _databaseManager.SyncManager.IsEnabled;
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
