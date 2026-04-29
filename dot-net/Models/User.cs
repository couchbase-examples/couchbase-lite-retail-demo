namespace GroceryApp.Models;

public class User
{
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? ProfileName { get; set; }
}

public class DemoUser
{
    public string Username { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Endpoint { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public abstract class LoginResult
{
    public sealed class Success : LoginResult
    {
        public User User { get; }
        public Success(User user) => User = user;
    }

    public sealed class Error : LoginResult
    {
        public string Message { get; }
        public Error(string message) => Message = message;
    }
}
