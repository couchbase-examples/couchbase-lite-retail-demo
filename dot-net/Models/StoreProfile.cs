namespace GroceryApp.Models;

public class StoreProfile
{
    public string Id { get; set; } = string.Empty;
    public string DocType { get; set; } = "StoreProfile";
    public string StoreId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public ContactInfo Contact { get; set; } = new();
    public LocationInfo Location { get; set; } = new();
    public string? Manager { get; set; }
    public string? OpeningHours { get; set; }

    public class ContactInfo
    {
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

    public class LocationInfo
    {
        public string Address1 { get; set; } = string.Empty;
        public string? Address2 { get; set; }
        public string Locality { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public Coordinates? Coordinates { get; set; }
    }

    public class Coordinates
    {
        public double Lat { get; set; }
        public double Lon { get; set; }
    }
}
