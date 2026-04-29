using System.Globalization;

namespace GroceryApp.Converters;

public class InverseBoolConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is bool b ? !b : value;

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is bool b ? !b : value;
}

public class StringNotEmptyConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => !string.IsNullOrWhiteSpace(value as string);

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

public class NotNullConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value != null;

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

public class EyeIconConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is bool b && b ? "Hide" : "Show";

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

public class SyncToggleLabelConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is bool b && b ? "Pause Sync" : "Start Sync";

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

/// <summary>
/// Maps an order status string (Submitted / In Review / Approved) to a
/// background color for the status pill.
/// </summary>
public class StatusToBackgroundConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        var status = (value as string)?.Trim().ToLowerInvariant();
        return status switch
        {
            "in review" => Color.FromArgb("#DBEAFE"),
            "approved" => Color.FromArgb("#DCFCE7"),
            _ => Color.FromArgb("#FC9C0C") // Submitted / default
        };
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

public class StatusToForegroundConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        var status = (value as string)?.Trim().ToLowerInvariant();
        return status switch
        {
            "in review" => Color.FromArgb("#1E40AF"),
            "approved" => Color.FromArgb("#166534"),
            _ => Colors.White
        };
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

/// <summary>
/// Maps an inventory quantity (int) to a color: red for low, orange for
/// medium, green for healthy stock.
/// </summary>
public class QuantityToColorConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        var qty = value switch
        {
            int i => i,
            long l => (int)l,
            _ => 0
        };
        if (qty <= 10) return Color.FromArgb("#DC2626");
        if (qty <= 30) return Color.FromArgb("#F59E0B");
        return Color.FromArgb("#16A34A");
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

/// <summary>
/// Returns true if the bound string equals the converter parameter -
/// used to highlight the active "tab" button on the Orders page.
/// </summary>
public class StringEqualsConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => string.Equals(value as string, parameter as string, StringComparison.OrdinalIgnoreCase);

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

/// <summary>Active tab gets the primary color text.</summary>
public class TabSelectedTextColorConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        var selected = (value as string)?.ToLowerInvariant() == (parameter as string)?.ToLowerInvariant();
        return selected ? Color.FromArgb("#FC9C0C") : Color.FromArgb("#666666");
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

/// <summary>Active tab gets a 2px orange underline; others transparent.</summary>
public class TabSelectedUnderlineConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        var selected = (value as string)?.ToLowerInvariant() == (parameter as string)?.ToLowerInvariant();
        return selected ? Color.FromArgb("#FC9C0C") : Colors.Transparent;
    }

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}

/// <summary>Sync row subtext: "Connected to Capella" / "Disconnected".</summary>
public class SyncStatusSubtextConverter : IValueConverter
{
    public object? Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
        => value is bool b && b ? "Connected to Capella" : "Disconnected";

    public object? ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}
