using GroceryApp.Services;

namespace GroceryApp;

public partial class AppShell : Shell
{
    public AppShell(AuthenticationManager authManager)
    {
        InitializeComponent();

        // Pick the initial route based on session state.
        Loaded += async (_, _) =>
        {
            try
            {
                if (authManager.IsAuthenticated)
                {
                    // Land on the Inventory tab on app launch (not whichever tab
                    // happened to be persisted by Shell).
                    await Shell.Current.GoToAsync("//inventory").ConfigureAwait(false);
                }
                else
                {
                    await Shell.Current.GoToAsync("//login").ConfigureAwait(false);
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[AppShell] Error setting initial route: {ex.Message}");
            }
        };
    }
}
