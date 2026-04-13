import 'dart:developer' as dev;
import 'dart:io';
import 'package:cbl_flutter/cbl_flutter.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'services/auth_manager.dart';
import 'services/database_manager.dart';
import 'theme/app_theme.dart';
import 'screens/login_screen.dart';
import 'screens/landing_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: '.env');

  if (kDebugMode) {
    HttpOverrides.global = _DebugHttpOverrides();
  }

  await CouchbaseLiteFlutter.init();
  runApp(const GroceryApp());
}

class _DebugHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return super.createHttpClient(context)
      ..badCertificateCallback = (cert, host, port) => true;
  }
}

class GroceryApp extends StatelessWidget {
  const GroceryApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Supermarket Inventory',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initApp();
  }

  Future<void> _initApp() async {
    try {
      dev.log('[App] Initializing...');
      await DatabaseManager().initialize();
      dev.log('[App] DB initialized, checking stored login...');
      final hasSession = await AuthManager().checkStoredLogin();
      dev.log('[App] Has stored session: $hasSession');

      if (!mounted) return;

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => hasSession ? const LandingScreen() : const LoginScreen(),
        ),
      );
    } catch (e) {
      dev.log('[App] Init error: $e');
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.lightOrangeBackground,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.store_rounded, size: 80, color: AppTheme.primaryOrange),
            const SizedBox(height: 24),
            const CircularProgressIndicator(color: AppTheme.primaryOrange),
          ],
        ),
      ),
    );
  }
}
