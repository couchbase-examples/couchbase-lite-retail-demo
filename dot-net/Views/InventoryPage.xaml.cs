using GroceryApp.Models;
using GroceryApp.Services;
using GroceryApp.ViewModels;

namespace GroceryApp.Views;

public partial class InventoryPage : ContentPage
{
    private readonly InventoryViewModel _viewModel;
    private readonly DatabaseManager _databaseManager;

    public InventoryPage(InventoryViewModel viewModel, DatabaseManager databaseManager)
    {
        InitializeComponent();
        _viewModel = viewModel;
        _databaseManager = databaseManager;
        BindingContext = _viewModel;
        _viewModel.OpenCreateOrderRequested += OnOpenCreateOrderRequested;
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _viewModel.RefreshAsync().ConfigureAwait(false);
    }

    private async void OnOpenCreateOrderRequested(object? sender, GroceryItem item)
    {
        var vm = new CreateOrderViewModel(_databaseManager, item);
        var page = new CreateOrderPage(vm);
        await Navigation.PushModalAsync(page).ConfigureAwait(false);
    }
}
