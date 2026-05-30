import 'package:tarteb/core/constants/app_strings.dart';

/// Experience options shown in onboarding (label → DB value).
abstract final class CandidateProfileConstants {
  static const List<String> languageOptions = [
    'English',
    'Arabic',
    'Hindi',
    'Urdu',
    'Tagalog',
    'Bengali',
    'Malayalam',
    'French',
    'Other',
  ];

  static List<({String label, int years})> get experienceOptions => [
        (label: AppStrings.noExperience, years: 0),
        (label: AppStrings.oneYear, years: 1),
        (label: AppStrings.twoThreeYears, years: 2),
        (label: AppStrings.fourFiveYears, years: 4),
        (label: AppStrings.fivePlusYears, years: 5),
      ];

  static String experienceLabel(int years) {
    if (years <= 0) return AppStrings.noExperience;
    if (years == 1) return AppStrings.oneYearExperience;
    return AppStrings.yearsExperience(years);
  }

  static List<String> parseLanguages(dynamic value) {
    if (value == null) return [];
    if (value is List) {
      return value.map((e) => e.toString()).where((s) => s.isNotEmpty).toList();
    }
    return [];
  }

  static bool parseUaeExperience(dynamic value) {
    if (value is bool) return value;
    return false;
  }

  static int parseYearsExperience(dynamic value) {
    if (value is int) return value;
    if (value is num) return value.toInt();
    return 0;
  }
}
