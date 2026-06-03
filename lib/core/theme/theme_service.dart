import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Persists and notifies when the app theme changes (light / dark / system).
class ThemeService extends ChangeNotifier {
  ThemeService._();
  static final ThemeService instance = ThemeService._();

  static const _prefKey = 'app_theme_mode';
  static const String light = 'light';
  static const String dark = 'dark';
  static const String system = 'system';

  String _themeMode = system;

  String get themeMode => _themeMode;
  bool get isLight => _themeMode == light;
  bool get isDark => _themeMode == dark;
  bool get isSystem => _themeMode == system;

  ThemeMode get flutterThemeMode {
    return switch (_themeMode) {
      light => ThemeMode.light,
      dark => ThemeMode.dark,
      _ => ThemeMode.system,
    };
  }

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    _themeMode = prefs.getString(_prefKey) ?? system;
    notifyListeners();
  }

  Future<void> setThemeMode(String mode) async {
    if (mode != light && mode != dark && mode != system) return;
    _themeMode = mode;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKey, mode);
    notifyListeners();
  }

  Future<void> setLight() => setThemeMode(light);
  Future<void> setDark() => setThemeMode(dark);
  Future<void> setSystem() => setThemeMode(system);
}
