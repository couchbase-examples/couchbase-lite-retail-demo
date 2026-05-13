using GroceryApp.ViewModels;

namespace GroceryApp.Views;

public partial class LoginPage : ContentPage
{
    private readonly LoginViewModel _viewModel;

    public LoginPage(LoginViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
        _viewModel.LoginSucceeded += OnLoginSucceeded;
        _viewModel.PropertyChanged += OnViewModelPropertyChanged;
    }

    private async void OnViewModelPropertyChanged(object? sender, System.ComponentModel.PropertyChangedEventArgs e)
    {
        if (e.PropertyName == nameof(LoginViewModel.ShowingCredentials) && _viewModel.ShowingCredentials)
        {
            // Reset the flag immediately so we can re-open later.
            _viewModel.ShowingCredentials = false;
            await Navigation.PushModalAsync(new DemoCredentialsPage(_viewModel)).ConfigureAwait(false);
        }
    }

    private async void OnLoginSucceeded(object? sender, Models.User user)
    {
        // Always land on the Inventory tab after sign-in, regardless of which
        // tab was active before sign-out.
        await Shell.Current.GoToAsync("//inventory").ConfigureAwait(false);
    }
}
