using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GroceryApp.Models;
using GroceryApp.Services;

namespace GroceryApp.ViewModels;

public partial class ProfileViewModel : BaseViewModel
{
    private readonly DatabaseManager _databaseManager;

    [ObservableProperty]
    private StoreProfile? profile;

    [ObservableProperty]
    private string addressLine = string.Empty;

    [ObservableProperty]
    private string cityRegion = string.Empty;

    public ProfileViewModel(DatabaseManager databaseManager)
    {
        _databaseManager = databaseManager;
        _databaseManager.ProfileChanged += async (_, _) =>
            await MainThread.InvokeOnMainThreadAsync(async () => await RefreshAsync().ConfigureAwait(false));
    }

    [RelayCommand]
    public async Task RefreshAsync()
    {
        if (IsBusy) return;
        IsBusy = true;
        try
        {
            Profile = await _databaseManager.GetStoreProfileAsync().ConfigureAwait(true);
            if (Profile != null)
            {
                var addr2 = string.IsNullOrWhiteSpace(Profile.Location.Address2) ? string.Empty : $", {Profile.Location.Address2}";
                AddressLine = $"{Profile.Location.Address1}{addr2}";
                CityRegion = $"{Profile.Location.Locality}, {Profile.Location.Region} {Profile.Location.PostalCode}";
            }
            else
            {
                AddressLine = string.Empty;
                CityRegion = string.Empty;
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = ex.Message;
        }
        finally
        {
            IsBusy = false;
        }
    }
}
