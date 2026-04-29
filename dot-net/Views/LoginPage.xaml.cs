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
    }

    private async void OnLoginSucceeded(object? sender, Models.User user)
    {
        await Shell.Current.GoToAsync("//main").ConfigureAwait(false);
    }
}
