using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using GroceryApp.Models;
using GroceryApp.Services;

namespace GroceryApp.ViewModels;

public partial class CreateOrderViewModel : BaseViewModel
{
    private readonly DatabaseManager _databaseManager;

    public GroceryItem Item { get; }

    [ObservableProperty]
    private string orderQty = "100";

    public string ProductName => Item.Name;
    public string ProductIdText => Item.ProductId?.ToString() ?? "—";
    public string SkuText => string.IsNullOrEmpty(Item.Sku) ? "—" : Item.Sku!;
    public string StoreIdText => AppConfig.StoreId;
    public string UnitText => string.IsNullOrEmpty(Item.Unit) ? "unit" : Item.Unit!;
    public string OrderStatus => "Submitted";

    public event EventHandler? Closed;

    public CreateOrderViewModel(DatabaseManager databaseManager, GroceryItem item)
    {
        _databaseManager = databaseManager;
        Item = item;
    }

    [RelayCommand]
    private async Task CreateAsync()
    {
        if (IsBusy) return;
        IsBusy = true;
        try
        {
            if (!int.TryParse(OrderQty, out var qty) || qty <= 0)
            {
                ErrorMessage = "Order quantity must be a positive number.";
                return;
            }
            await _databaseManager.CreateOrderAsync(Item, qty).ConfigureAwait(true);
            Closed?.Invoke(this, EventArgs.Empty);
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
    private void Cancel() => Closed?.Invoke(this, EventArgs.Empty);
}
