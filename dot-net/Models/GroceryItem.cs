namespace GroceryApp.Models;

public class GroceryItem
{
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    /// <summary>JSON field "category" in Capella; surfaced as "Type" in code.</summary>
    public string Type { get; set; } = "Unknown";
    public double Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    /// <summary>JSON field "stockQty" in Capella; surfaced as "Quantity" in code.</summary>
    public int Quantity { get; set; }

    public int? ProductId { get; set; }
    public string? Sku { get; set; }
    public string? Brand { get; set; }
    public string? Unit { get; set; }
    public Location? ItemLocation { get; set; }
    public Attributes? ItemAttributes { get; set; }
    public long? ExpirationDate { get; set; }
    public long? LastUpdated { get; set; }
    public string? StoreId { get; set; }
    public string? DocType { get; set; }

    public class Location
    {
        public int Aisle { get; set; }
        public int Bin { get; set; }
    }

    public class Attributes
    {
        public bool Organic { get; set; }
        public string Size { get; set; } = string.Empty;
        public bool Perishable { get; set; }
    }
}
