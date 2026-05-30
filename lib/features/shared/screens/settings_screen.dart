import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/auth/screens/splash_screen.dart';
import 'package:tarteb/features/employer/services/employer_credits_service.dart';
import 'package:tarteb/features/employer/services/whatsapp_support_service.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key, required this.isCandidate});

  final bool isCandidate;

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _version = '—';
  String _supportEmail = '';

  @override
  void initState() {
    super.initState();
    _loadVersion();
    if (!widget.isCandidate) _loadEmployerEmail();
  }

  Future<void> _loadVersion() async {
    final info = await PackageInfo.fromPlatform();
    if (mounted) setState(() => _version = info.version);
  }

  Future<void> _loadEmployerEmail() async {
    try {
      final account = await EmployerCreditsService.fetchAccount();
      if (mounted) setState(() => _supportEmail = account.email);
    } catch (_) {}
  }

  Future<void> _logout() async {
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

    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(title: Text(AppStrings.settings)),
          body: ListView(
            children: [
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
              const Divider(),
              ListTile(
                leading: const Icon(Icons.edit_outlined),
                title: Text(AppStrings.editProfile),
                onTap: () => Navigator.of(context).pop(true),
              ),
              ListTile(
                leading: const Icon(Icons.chat),
                title: Text(AppStrings.contactSupport),
                onTap: () {
                  final email = _supportEmail.isNotEmpty
                      ? _supportEmail
                      : TartebSupabase.auth.currentUser?.email ?? '';
                  WhatsAppSupportService.openBuyCredits(
                    employerEmail: email.isNotEmpty ? email : 'support',
                  );
                },
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
