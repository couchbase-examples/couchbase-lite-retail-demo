import '../config/app_config.dart';
import 'database_manager.dart';
import 'sync_manager.dart';

class AuthResult {
  final bool success;
  final String? error;
  final String? username;
  final String? fullName;

  AuthResult({required this.success, this.error, this.username, this.fullName});
}

class AuthManager {
  static final AuthManager _instance = AuthManager._internal();
  factory AuthManager() => _instance;
  AuthManager._internal();

  bool _isAuthenticated = false;
  String? _currentUsername;
  String? currentPassword;
  String? _currentFullName;

  bool get isAuthenticated => _isAuthenticated;
  String? get currentUsername => _currentUsername;
  String? get currentFullName => _currentFullName;

  static final Map<String, DemoCredential> _validCredentials = {
    for (final cred in AppConfig.demoCredentials) cred.username: cred,
  };

  Future<AuthResult> login(String username, String password) async {
    final credential = _validCredentials[username];
    if (credential == null || credential.password != password) {
      return AuthResult(success: false, error: 'Invalid credentials');
    }

    AppConfig.currentStore = credential.store;

    final dbManager = DatabaseManager();
    if (!dbManager.isInitialized) {
      await dbManager.initialize();
    }

    _isAuthenticated = true;
    _currentUsername = username;
    currentPassword = password;
    _currentFullName = credential.fullName;

    await dbManager.saveSession(username);

    // Start sync after login
    await SyncManager().startSync(username, password);

    return AuthResult(
      success: true,
      username: username,
      fullName: credential.fullName,
    );
  }

  Future<bool> checkStoredLogin() async {
    final dbManager = DatabaseManager();
    if (!dbManager.isInitialized) {
      await dbManager.initialize();
    }

    final storedUsername = await dbManager.getStoredSession();
    if (storedUsername == null) return false;

    final credential = _validCredentials[storedUsername];
    if (credential == null) return false;

    AppConfig.currentStore = credential.store;
    _isAuthenticated = true;
    _currentUsername = storedUsername;
    currentPassword = credential.password;
    _currentFullName = credential.fullName;

    // Re-initialize DB with correct store scope
    await dbManager.close();
    await dbManager.initialize();

    // Start sync
    await SyncManager().startSync(storedUsername, credential.password);

    return true;
  }

  Future<void> logout() async {
    await SyncManager().stopSync();
    
    final dbManager = DatabaseManager();
    await dbManager.clearSession();
    await dbManager.close();

    _isAuthenticated = false;
    _currentUsername = null;
    currentPassword = null;
    _currentFullName = null;
  }
}
