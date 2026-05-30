import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/auth/services/auth_navigation.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/widgets/candidate_public_card.dart';
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
      setState(() => _error = e.toString());
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

  void _editProfile() {
    if (_candidate == null) return;
    AuthNavigation.openCandidateOnboarding(
      context,
      initialData: CandidateOnboardingData.fromCandidateRow(_candidate!),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.appName)),
      body: _loading
          ? const LoadingWidget()
          : _error != null
              ? TartebErrorWidget(message: _error!, onRetry: _load)
              : _candidate == null
                  ? const LoadingWidget()
                  : RefreshIndicator(
                      onRefresh: _load,
                      child: ListView(
                        children: [
                          if (!(_candidate!['is_active'] as bool? ?? true))
                            MaterialBanner(
                              backgroundColor:
                                  AppColors.error.withValues(alpha: 0.1),
                              content: Text(
                                AppStrings.profilePausedBanner,
                                style: TextStyle(color: AppColors.error),
                              ),
                              leading: Icon(
                                Icons.pause_circle_outline,
                                color: AppColors.error,
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => _toggleActive(true),
                                  child: const Text('Resume'),
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
                                title: const Text('Profile views'),
                                trailing: Text(
                                  '$_profileViews',
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineSmall
                                      ?.copyWith(
                                        color: AppColors.primary,
                                        fontWeight: FontWeight.bold,
                                      ),
                                ),
                                subtitle: const Text(
                                  'Times employers unlocked your contact',
                                ),
                              ),
                            ),
                          ),
                          SwitchListTile(
                            title: const Text('Profile active'),
                            subtitle: Text(
                              (_candidate!['is_active'] as bool? ?? true)
                                  ? 'Visible to employers'
                                  : 'Paused',
                            ),
                            value: _candidate!['is_active'] as bool? ?? true,
                            activeTrackColor:
                                AppColors.secondary.withValues(alpha: 0.5),
                            onChanged: _toggleActive,
                          ),
                          Padding(
                            padding: const EdgeInsets.all(16),
                            child: FilledButton.icon(
                              onPressed: _editProfile,
                              icon: const Icon(Icons.edit_outlined),
                              label: const Text('Edit profile'),
                            ),
                          ),
                        ],
                      ),
                    ),
    );
  }
}
