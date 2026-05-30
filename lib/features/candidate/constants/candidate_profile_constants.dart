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

  static const List<({String label, int years})> experienceOptions = [
    (label: 'No experience', years: 0),
    (label: '1 year', years: 1),
    (label: '2-3 years', years: 2),
    (label: '4-5 years', years: 4),
    (label: '5+ years', years: 5),
  ];

  static String experienceLabel(int years) {
    if (years <= 0) return 'No experience';
    if (years == 1) return '1 year experience';
    return '$years years experience';
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
