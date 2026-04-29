using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GroceryApp.Models;
using GroceryApp.Services;

namespace GroceryApp.ViewModels;

public partial class LoginViewModel : BaseViewModel
{
    private readonly AuthenticationManager _authManager;

    [ObservableProperty]
    private string username = string.Empty;

    [ObservableProperty]
    private string password = string.Empty;

    [ObservableProperty]
    private bool isPasswordVisible;

    [ObservableProperty]
    private bool showingCredentials;

    [ObservableProperty]
    private bool canSubmit;

    public ObservableCollection<DemoUser> DemoUsers { get; } = new();

    public LoginViewModel(AuthenticationManager authManager)
    {
        _authManager = authManager;
        foreach (var u in _authManager.GetAllUsers()) DemoUsers.Add(u);
    }

    partial void OnUsernameChanged(string value) => UpdateCanSubmit();
    partial void OnPasswordChanged(string value) => UpdateCanSubmit();

    private void UpdateCanSubmit()
    {
        CanSubmit = !string.IsNullOrWhiteSpace(Username)
                  && !string.IsNullOrWhiteSpace(Password)
                  && !IsBusy;
    }

    [RelayCommand]
    private void ToggleCredentials() => ShowingCredentials = !ShowingCredentials;

    [RelayCommand]
    private void ToggleShowPassword() => IsPasswordVisible = !IsPasswordVisible;

    [RelayCommand]
    private void UseCredential(DemoUser user)
    {
        Username = user.Username;
        Password = user.Password;
        ShowingCredentials = false;
    }

    [RelayCommand(CanExecute = nameof(CanSubmit))]
    private async Task LoginAsync()
    {
        if (IsBusy) return;
        IsBusy = true;
        ErrorMessage = null;
        UpdateCanSubmit();
        try
        {
            var result = await _authManager.LoginAsync(Username.Trim(), Password).ConfigureAwait(true);
            switch (result)
            {
                case LoginResult.Success success:
                    Username = string.Empty;
                    Password = string.Empty;
                    LoginSucceeded?.Invoke(this, success.User);
                    break;
                case LoginResult.Error error:
                    ErrorMessage = error.Message;
                    break;
            }
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Login failed: {ex.Message}";
        }
        finally
        {
            IsBusy = false;
            UpdateCanSubmit();
        }
    }

    public event EventHandler<User>? LoginSucceeded;
}
