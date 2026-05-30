import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Persists and notifies when the app language changes (EN / AR).
class LocaleService extends ChangeNotifier {
  LocaleService._();
  static final LocaleService instance = LocaleService._();

  static const _prefKey = 'app_language';
  static const String english = 'en';
  static const String arabic = 'ar';

  String _languageCode = english;

  String get languageCode => _languageCode;
  bool get isArabic => _languageCode == arabic;
  Locale get locale => Locale(_languageCode);

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _languageCode = prefs.getString(_prefKey) ?? english;
    notifyListeners();
  }

  Future<void> setLanguage(String code) async {
    if (code != english && code != arabic) return;
    _languageCode = code;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKey, code);
    notifyListeners();
  }

  Future<void> setEnglish() => setLanguage(english);
  Future<void> setArabic() => setLanguage(arabic);
}
