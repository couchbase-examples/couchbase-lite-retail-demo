import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryOrange = Color(0xFFFD9B0B);
  static const Color lightOrangeBackground = Color(0xFFFFF0DB);
  static const Color cardBackground = Colors.white;
  static const Color textPrimary = Color(0xFF1A1A1A);
  static const Color textSecondary = Color(0xFF8E8E93);
  static const Color successGreen = Color(0xFF34C759);
  static const Color errorRed = Color(0xFFFF3B30);
  static const Color statusInReview = Color(0xFFFFA726);
  static const Color statusApproved = Color(0xFF34C759);
  static const Color accentBlue = Color(0xFF007AFF);
  static const Color fieldBackground = Color(0xFFF2F2F7);
  static const Color sectionHeader = Color(0xFF8E8E93);
  static const Color inventoryGreen = Color(0xFF34C759);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryOrange,
        primary: primaryOrange,
      ),
      scaffoldBackgroundColor: const Color(0xFFF2F2F7),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: textPrimary,
        elevation: 0,
        scrolledUnderElevation: 0.5,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: textPrimary,
          fontSize: 17,
          fontWeight: FontWeight.w600,
        ),
      ),
      cardTheme: CardTheme(
        elevation: 0,
        color: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        margin: EdgeInsets.zero,
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: Colors.white,
        elevation: 0,
        height: 56,
        indicatorColor: Colors.transparent,
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const TextStyle(
              color: accentBlue,
              fontWeight: FontWeight.w600,
              fontSize: 10,
            );
          }
          return const TextStyle(color: Colors.grey, fontSize: 10);
        }),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: accentBlue, size: 24);
          }
          return const IconThemeData(color: Colors.grey, size: 24);
        }),
      ),
    );
  }
}
