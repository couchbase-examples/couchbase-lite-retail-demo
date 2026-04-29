using GroceryApp.ViewModels;

namespace GroceryApp.Views;

public partial class SettingsPage : ContentPage
{
    private readonly SettingsViewModel _viewModel;

    public SettingsPage(SettingsViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
        _viewModel.LoggedOut += OnLoggedOut;
    }

    private async void OnLoggedOut(object? sender, EventArgs e)
    {
        await Shell.Current.GoToAsync("//login").ConfigureAwait(false);
    }
}
