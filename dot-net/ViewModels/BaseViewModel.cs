using CommunityToolkit.Mvvm.ComponentModel;

namespace GroceryApp.ViewModels;

public partial class BaseViewModel : ObservableObject
{
    [ObservableProperty]
    private bool isBusy;

    [ObservableProperty]
    private string? errorMessage;
}
