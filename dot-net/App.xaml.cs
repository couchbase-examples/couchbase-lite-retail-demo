using GroceryApp.Services;

namespace GroceryApp;

public partial class App : Application
{
    private readonly AuthenticationManager _authManager;

    public App(AuthenticationManager authManager)
    {
        InitializeComponent();
        _authManager = authManager;
    }

    protected override Window CreateWindow(IActivationState? activationState)
    {
        return new Window(new AppShell(_authManager));
    }
}
