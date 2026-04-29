namespace GroceryApp.Models;

public class Order
{
    public string Id { get; set; } = string.Empty;
    public string DocType { get; set; } = "Order";
    /// <summary>String to losslessly accept either string IDs (imported demo data)
    /// or numeric IDs (locally-created orders).</summary>
    public string OrderId { get; set; } = string.Empty;
    public string StoreId { get; set; } = string.Empty;
    public long OrderDate { get; set; }
    /// <summary>"In Review", "Approved", "Submitted" (legacy).</summary>
    public string OrderStatus { get; set; } = "Submitted";
    public int ProductId { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public int OrderQty { get; set; }

    public string OrderDateFormatted
    {
        get
        {
            var date = DateTimeOffset.FromUnixTimeMilliseconds(OrderDate).LocalDateTime;
            return date.ToString("MMM dd, yyyy h:mm tt");
        }
    }
}
