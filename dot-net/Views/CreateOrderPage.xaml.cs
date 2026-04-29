using GroceryApp.ViewModels;

namespace GroceryApp.Views;

public partial class CreateOrderPage : ContentPage
{
    public CreateOrderPage(CreateOrderViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
        viewModel.Closed += async (_, _) => await Navigation.PopModalAsync().ConfigureAwait(false);
    }

    private async void OnDismissTapped(object? sender, TappedEventArgs e)
    {
        await Navigation.PopModalAsync().ConfigureAwait(false);
    }
}
