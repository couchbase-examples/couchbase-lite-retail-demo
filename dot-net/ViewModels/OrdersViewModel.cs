using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GroceryApp.Models;
using GroceryApp.Services;

namespace GroceryApp.ViewModels;

public partial class OrdersViewModel : BaseViewModel
{
    private readonly DatabaseManager _databaseManager;
    private List<Order> _allOrders = new();

    public ObservableCollection<Order> Orders { get; } = new();

    public IReadOnlyList<string> Filters { get; } = new[] { "All", "Submitted", "Approved", "In Review" };

    [ObservableProperty]
    private string selectedFilter = "All";

    public OrdersViewModel(DatabaseManager databaseManager)
    {
        _databaseManager = databaseManager;
        _databaseManager.OrdersChanged += OnOrdersChanged;
    }

    private async void OnOrdersChanged(object? sender, EventArgs e)
    {
        await MainThread.InvokeOnMainThreadAsync(async () => await RefreshAsync().ConfigureAwait(false));
    }

    partial void OnSelectedFilterChanged(string value) => ApplyFilter();

    [RelayCommand]
    private void SetFilter(string filter) => SelectedFilter = filter;

    [RelayCommand]
    public async Task RefreshAsync()
    {
        if (IsBusy) return;
        IsBusy = true;
        try
        {
            _allOrders = await _databaseManager.GetAllOrdersAsync().ConfigureAwait(true);
            ApplyFilter();
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

    private void ApplyFilter()
    {
        IEnumerable<Order> filtered = _allOrders;
        if (!string.Equals(SelectedFilter, "All", StringComparison.OrdinalIgnoreCase))
        {
            filtered = _allOrders.Where(o => string.Equals(o.OrderStatus, SelectedFilter, StringComparison.OrdinalIgnoreCase));
        }
        Orders.Clear();
        foreach (var o in filtered) Orders.Add(o);
    }
}
