using GroceryApp.ViewModels;

namespace GroceryApp.Views;

public partial class InventoryPage : ContentPage
{
    private readonly InventoryViewModel _viewModel;

    public InventoryPage(InventoryViewModel viewModel)
    {
        InitializeComponent();
        _viewModel = viewModel;
        BindingContext = _viewModel;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.RefreshAsync().ConfigureAwait(false);
    }
}
