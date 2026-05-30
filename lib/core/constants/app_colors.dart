import 'package:flutter/material.dart';

abstract final class AppColors {
  static const Color primary = Color(0xFF1A73E8);
  static const Color secondary = Color(0xFF34A853);
  static const Color background = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF212121);
  static const Color textSecondary = Color(0xFF757575);
  static const Color error = Color(0xFFD93025);
  static const Color divider = Color(0xFFE0E0E0);

  // Visa status badge colors
  static const Color visaEmployment = Color(0xFF1A73E8);
  static const Color visaVisit = Color(0xFF34A853);
  static const Color visaOwn = Color(0xFF9C27B0);
  static const Color visaCancelled = Color(0xFFFF9800);

  static Color visaBadgeColor(String visaStatus) {
    return switch (visaStatus) {
      'Employment Visa' => visaEmployment,
      'Visit Visa' => visaVisit,
      'Own Visa' => visaOwn,
      'Cancelled Visa' => visaCancelled,
      _ => textSecondary,
    };
  }
}
