import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/core/utils/error_message.dart';
import 'package:tarteb/features/auth/services/auth_navigation.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/widgets/candidate_public_card.dart';
import 'package:tarteb/features/shared/screens/settings_screen.dart';
import 'package:tarteb/features/shared/widgets/error_widget.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class CandidateDashboardScreen extends StatefulWidget {
  const CandidateDashboardScreen({super.key});

  @override
  State<CandidateDashboardScreen> createState() =>
      _CandidateDashboardScreenState();
}

class _CandidateDashboardScreenState extends State<CandidateDashboardScreen> {
  Map<String, dynamic>? _candidate;
  int _profileViews = 0;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final userId = TartebSupabase.auth.currentUser!.id;
      final candidate = await TartebSupabase.client
          .from('candidates')
          .select()
          .eq('user_id', userId)
          .maybeSingle();

      if (candidate == null) {
        if (mounted) {
          AuthNavigation.openCandidateOnboarding(context);
        }
        return;
      }

      final unlocks = await TartebSupabase.client
          .from('unlocks')
          .select('id')
          .eq('candidate_id', candidate['id'] as String);

      setState(() {
        _candidate = candidate;
        _profileViews = (unlocks as List).length;
      });
    } catch (e) {
      setState(() => _error = ErrorMessage.from(e));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _toggleActive(bool value) async {
    final userId = TartebSupabase.auth.currentUser!.id;
    await TartebSupabase.client
        .from('candidates')
        .update({'is_active': value})
        .eq('user_id', userId);
    await _load();
  }

  Future<void> _openSettings() async {
    final edit = await Navigator.of(context).push<bool>(
      MaterialPageRoute<bool>(
        builder: (_) => const SettingsScreen(isCandidate: true),
      ),
    );
    if (edit == true) _editProfile();
  }

  void _editProfile() {
    if (_candidate == null) return;
    AuthNavigation.openCandidateOnboarding(
      context,
      initialData: CandidateOnboardingData.fromCandidateRow(_candidate!),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(
            title: Text(AppStrings.appName),
            actions: [
              IconButton(
                icon: const Icon(Icons.settings_outlined),
                onPressed: _openSettings,
              ),
            ],
          ),
          body: _buildBody(),
        );
      },
    );
  }

  Widget _buildBody() {
    if (_loading) return const LoadingWidget();
    if (_error != null) {
      return TartebErrorWidget(message: _error!, onRetry: _load);
    }
    if (_candidate == null) return const LoadingWidget();

    final isActive = _candidate!['is_active'] as bool? ?? true;

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        children: [
          if (!isActive)
            MaterialBanner(
              backgroundColor: AppColors.error.withValues(alpha: 0.1),
              content: Text(
                AppStrings.profilePausedBanner,
                style: const TextStyle(color: AppColors.error),
              ),
              leading: const Icon(
                Icons.pause_circle_outline,
                color: AppColors.error,
              ),
              actions: [
                TextButton(
                  onPressed: () => _toggleActive(true),
                  child: Text(AppStrings.resume),
                ),
              ],
            ),
          CandidatePublicCard(
            candidate: _candidate!,
            showContact: true,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Card(
              child: ListTile(
                leading: const Icon(
                  Icons.visibility_outlined,
                  color: AppColors.primary,
                ),
                title: Text(AppStrings.profileViews),
                trailing: Text(
                  '$_profileViews',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                      ),
                ),
                subtitle: Text(
                  _profileViews == 0
                      ? AppStrings.zeroProfileViews
                      : AppStrings.profileViewsSubtitle,
                ),
              ),
            ),
          ),
          SwitchListTile(
            title: Text(AppStrings.profileActive),
            subtitle: Text(
              isActive ? AppStrings.visibleToEmployers : AppStrings.paused,
            ),
            value: isActive,
            activeTrackColor: AppColors.secondary.withValues(alpha: 0.5),
            onChanged: _toggleActive,
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: FilledButton.icon(
              onPressed: _editProfile,
              icon: const Icon(Icons.edit_outlined),
              label: Text(AppStrings.editProfile),
            ),
          ),
        ],
      ),
    );
  }
}
