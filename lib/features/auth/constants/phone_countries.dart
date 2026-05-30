/// Countries offered on the phone login picker (default: UAE).
class PhoneCountry {
  const PhoneCountry({
    required this.name,
    required this.dialCode,
    required this.iso,
  });

  final String name;
  final String dialCode;
  final String iso;

  String get label => '$name $dialCode';
}

abstract final class PhoneCountries {
  static const List<PhoneCountry> all = [
    PhoneCountry(name: 'UAE', dialCode: '+971', iso: 'AE'),
    PhoneCountry(name: 'India', dialCode: '+91', iso: 'IN'),
    PhoneCountry(name: 'Philippines', dialCode: '+63', iso: 'PH'),
    PhoneCountry(name: 'Pakistan', dialCode: '+92', iso: 'PK'),
    PhoneCountry(name: 'Bangladesh', dialCode: '+880', iso: 'BD'),
    PhoneCountry(name: 'Egypt', dialCode: '+20', iso: 'EG'),
    PhoneCountry(name: 'Sudan', dialCode: '+249', iso: 'SD'),
    PhoneCountry(name: 'Nigeria', dialCode: '+234', iso: 'NG'),
  ];

  static const PhoneCountry defaultCountry =
      PhoneCountry(name: 'UAE', dialCode: '+971', iso: 'AE');

  /// Builds E.164 phone (e.g. +971501234567).
  static String toE164(PhoneCountry country, String localInput) {
    var digits = localInput.replaceAll(RegExp(r'\D'), '');
    if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    final codeDigits = country.dialCode.replaceAll('+', '');
    if (digits.startsWith(codeDigits)) {
      return '+$digits';
    }
    return '${country.dialCode}$digits';
  }
}
