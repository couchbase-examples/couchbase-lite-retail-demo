using GroceryApp.Services;
using GroceryApp.ViewModels;
using GroceryApp.Views;
using Microsoft.Extensions.Logging;

namespace GroceryApp;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        // Load .env file (if present in Resources/Raw) and seed Preferences with
        // the Capella App Services config so it survives across restarts.
        EnvLoader.LoadFromAppPackage();

        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Services
        builder.Services.AddSingleton<DatabaseManager>();
        builder.Services.AddSingleton<AuthenticationManager>();

        // ViewModels
        builder.Services.AddTransient<LoginViewModel>();
        builder.Services.AddTransient<InventoryViewModel>();
        builder.Services.AddTransient<OrdersViewModel>();
        builder.Services.AddTransient<ProfileViewModel>();
        builder.Services.AddTransient<SettingsViewModel>();

        // Pages
        builder.Services.AddTransient<LoginPage>();
        builder.Services.AddTransient<InventoryPage>();
        builder.Services.AddTransient<OrdersPage>();
        builder.Services.AddTransient<ProfilePage>();
        builder.Services.AddTransient<SettingsPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
