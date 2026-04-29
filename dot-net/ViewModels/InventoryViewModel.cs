using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GroceryApp.Models;
using GroceryApp.Services;

namespace GroceryApp.ViewModels;

public partial class InventoryViewModel : BaseViewModel
{
    private readonly DatabaseManager _databaseManager;

    [ObservableProperty]
    private string searchText = string.Empty;

    [ObservableProperty]
    private GroceryItem? selectedItem;

    public ObservableCollection<GroceryItem> Items { get; } = new();

    public InventoryViewModel(DatabaseManager databaseManager)
    {
        _databaseManager = databaseManager;
        _databaseManager.InventoryChanged += OnInventoryChanged;
    }

    partial void OnSearchTextChanged(string value)
    {
        _ = RefreshAsync();
    }

    private async void OnInventoryChanged(object? sender, EventArgs e)
    {
        await MainThread.InvokeOnMainThreadAsync(async () => await RefreshAsync().ConfigureAwait(false));
    }

    [RelayCommand]
    public async Task RefreshAsync()
    {
        if (IsBusy) return;
        IsBusy = true;
        try
        {
            List<GroceryItem> results;
            if (string.IsNullOrWhiteSpace(SearchText))
            {
                results = await _databaseManager.GetAllGroceryItemsAsync().ConfigureAwait(true);
            }
            else
            {
                results = await _databaseManager.SearchGroceryAsync(SearchText.Trim()).ConfigureAwait(true);
            }
            results = results.OrderBy(i => i.Name).ToList();
            Items.Clear();
            foreach (var item in results) Items.Add(item);
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

    [RelayCommand]
    private async Task IncrementAsync(GroceryItem item)
    {
        if (item.Id == null) return;
        await _databaseManager.UpdateQuantityAsync(item.Id, item.Quantity + 1).ConfigureAwait(true);
    }

    [RelayCommand]
    private async Task DecrementAsync(GroceryItem item)
    {
        if (item.Id == null || item.Quantity <= 0) return;
        await _databaseManager.UpdateQuantityAsync(item.Id, item.Quantity - 1).ConfigureAwait(true);
    }

    [RelayCommand]
    private async Task CreateOrderAsync(GroceryItem item)
    {
        await _databaseManager.CreateOrderAsync(item).ConfigureAwait(true);
    }

    /// <summary>Raised when the user taps "Re-order now" — the page opens a modal.</summary>
    public event EventHandler<GroceryItem>? OpenCreateOrderRequested;

    [RelayCommand]
    private void OpenCreateOrder(GroceryItem item)
    {
        OpenCreateOrderRequested?.Invoke(this, item);
    }
}
