import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/notifications/notification_service.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/core/theme/theme_service.dart';
import 'package:tarteb/features/auth/screens/splash_screen.dart';
import 'package:tarteb/features/employer/services/whatsapp_support_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key, required this.isCandidate});

  final bool isCandidate;

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _version = '—';
  @override
  void initState() {
    super.initState();
    _loadVersion();
  }

  Future<void> _loadVersion() async {
    final info = await PackageInfo.fromPlatform();
    if (mounted) setState(() => _version = info.version);
  }

  Future<void> _logout() async {
    await NotificationService.instance.clearExternalUserId();
    await TartebSupabase.auth.signOut();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute<void>(builder: (_) => const SplashScreen()),
      (_) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final lang = LocaleService.instance.languageCode;
    final themeMode = ThemeService.instance.themeMode;
    final notifications = NotificationService.instance;

    return ListenableBuilder(
      listenable: Listenable.merge([
        LocaleService.instance,
        ThemeService.instance,
        NotificationService.instance,
      ]),
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(title: Text(AppStrings.settings)),
          body: ListView(
            children: [
              // Language Section
              ListTile(title: Text(AppStrings.language)),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: SegmentedButton<String>(
                  segments: [
                    ButtonSegment(
                      value: LocaleService.english,
                      label: Text(AppStrings.english),
                    ),
                    ButtonSegment(
                      value: LocaleService.arabic,
                      label: Text(AppStrings.arabic),
                    ),
                  ],
                  selected: {lang},
                  onSelectionChanged: (set) {
                    LocaleService.instance.setLanguage(set.first);
                  },
                ),
              ),
              const SizedBox(height: 16),
              // Theme Section
              ListTile(title: Text(AppStrings.theme)),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: SegmentedButton<String>(
                  segments: [
                    ButtonSegment(
                      value: ThemeService.light,
                      label: Text(AppStrings.themeLight),
                      icon: const Icon(Icons.light_mode_outlined, size: 18),
                    ),
                    ButtonSegment(
                      value: ThemeService.dark,
                      label: Text(AppStrings.themeDark),
                      icon: const Icon(Icons.dark_mode_outlined, size: 18),
                    ),
                    ButtonSegment(
                      value: ThemeService.system,
                      label: Text(AppStrings.themeSystem),
                      icon: const Icon(Icons.settings_suggest_outlined, size: 18),
                    ),
                  ],
                  selected: {themeMode},
                  onSelectionChanged: (set) {
                    ThemeService.instance.setThemeMode(set.first);
                  },
                ),
              ),
              const Divider(height: 32),
              // Notifications Section
              ListTile(
                title: Text(
                  AppStrings.notifications,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ),
              SwitchListTile(
                title: Text(AppStrings.notificationsEnabled),
                value: notifications.enabled,
                onChanged: (value) => notifications.setEnabled(value),
              ),
              if (widget.isCandidate) ...[
                SwitchListTile(
                  title: Text(AppStrings.notifyProfileViews),
                  subtitle: Text(AppStrings.notifyProfileViewsDesc),
                  value: notifications.notifyProfileViews,
                  onChanged: notifications.enabled
                      ? (value) => notifications.setNotifyProfileViews(value)
                      : null,
                ),
              ],
              SwitchListTile(
                title: Text(AppStrings.notifySubscription),
                subtitle: Text(AppStrings.notifySubscriptionDesc),
                value: notifications.notifySubscription,
                onChanged: notifications.enabled
                    ? (value) => notifications.setNotifySubscription(value)
                    : null,
              ),
              const Divider(height: 32),
              ListTile(
                leading: const Icon(Icons.edit_outlined),
                title: Text(AppStrings.editProfile),
                onTap: () => Navigator.of(context).pop(true),
              ),
              ListTile(
                leading: const Icon(Icons.chat),
                title: Text(AppStrings.contactSupport),
                onTap: () => WhatsAppSupportService.openSupport(),
              ),
              ListTile(
                leading: const Icon(Icons.logout),
                title: Text(AppStrings.logout),
                onTap: _logout,
              ),
              const SizedBox(height: 32),
              Center(
                child: Text(
                  AppStrings.versionLabel(_version),
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        );
      },
    );
  }
}
