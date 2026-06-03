import 'package:flutter/material.dart';

abstract final class AppColors {
  // ============ LIGHT THEME COLORS ============
  static const Color primary = Color(0xFF1565D8);
  static const Color secondary = Color(0xFF34A853);
  static const Color scaffoldBackground = Color(0xFFF6F8FB);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color background = surface;
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color error = Color(0xFFD93025);
  static const Color divider = Color(0xFFE0E0E0);

  // ============ DARK THEME COLORS ============
  static const Color primaryDark = Color(0xFF4A90E2);
  static const Color secondaryDark = Color(0xFF4CAF50);
  static const Color scaffoldBackgroundDark = Color(0xFF121212);
  static const Color surfaceDark = Color(0xFF1E1E1E);
  static const Color backgroundDark = surfaceDark;
  static const Color textPrimaryDark = Color(0xFFE0E0E0);
  static const Color textSecondaryDark = Color(0xFF9E9E9E);
  static const Color errorDark = Color(0xFFEF5350);
  static const Color dividerDark = Color(0xFF2C2C2C);

  // ============ CARD SHADOWS ============
  static List<BoxShadow> get cardShadow => [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.06),
          blurRadius: 8,
          offset: const Offset(0, 2),
        ),
      ];

  static List<BoxShadow> get cardShadowDark => [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.3),
          blurRadius: 8,
          offset: const Offset(0, 2),
        ),
      ];

  // ============ VISA STATUS BADGE COLORS ============
  static const Color visaEmployment = Color(0xFF1A73E8);
  static const Color visaVisit = Color(0xFF34A853);
  static const Color visaOwn = Color(0xFF9C27B0);
  static const Color visaCancelled = Color(0xFFFF9800);

  // Dark mode visa colors (slightly brighter for contrast)
  static const Color visaEmploymentDark = Color(0xFF5C9CE6);
  static const Color visaVisitDark = Color(0xFF66BB6A);
  static const Color visaOwnDark = Color(0xFFBA68C8);
  static const Color visaCancelledDark = Color(0xFFFFB74D);

  static Color visaBadgeColor(String visaStatus, {bool isDark = false}) {
    if (isDark) {
      return switch (visaStatus) {
        'Employment Visa' => visaEmploymentDark,
        'Visit Visa' => visaVisitDark,
        'Own Visa' => visaOwnDark,
        'Cancelled Visa' => visaCancelledDark,
        _ => textSecondaryDark,
      };
    }
    return switch (visaStatus) {
      'Employment Visa' => visaEmployment,
      'Visit Visa' => visaVisit,
      'Own Visa' => visaOwn,
      'Cancelled Visa' => visaCancelled,
      _ => textSecondary,
    };
  }
}
