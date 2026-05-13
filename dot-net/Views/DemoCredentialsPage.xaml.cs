using GroceryApp.Models;
using GroceryApp.ViewModels;

namespace GroceryApp.Views;

public partial class DemoCredentialsPage : ContentPage
{
    private readonly LoginViewModel _viewModel;

    public DemoCredentialsPage(LoginViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
    }

    private async void OnDismissTapped(object? sender, TappedEventArgs e)
    {
        await Navigation.PopModalAsync().ConfigureAwait(false);
    }

    private async void OnCredentialTapped(object? sender, TappedEventArgs e)
    {
        if (sender is BindableObject bo && bo.BindingContext is DemoUser user)
        {
            _viewModel.UseCredentialCommand.Execute(user);
            await Navigation.PopModalAsync();
            // Continuation runs on UI thread (no ConfigureAwait(false)), so triggering
            // the LoginCommand here is safe — it updates UI-bound state (IsBusy etc.).
            MainThread.BeginInvokeOnMainThread(() => _viewModel.LoginCommand.Execute(null));
        }
    }
}
