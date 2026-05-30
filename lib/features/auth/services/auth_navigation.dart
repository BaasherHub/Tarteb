import 'package:flutter/material.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/auth/screens/role_selection_screen.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/candidate_dashboard_screen.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step1_photo.dart';
import 'package:tarteb/features/employer/screens/employer_onboarding_screen.dart';
import 'package:tarteb/features/employer/screens/employer_shell_screen.dart';

/// Routes authenticated users (phone or email OTP session) by [profiles] role.
abstract final class AuthNavigation {
  static Future<void> routeAuthenticatedUser(BuildContext context) async {
    final userId = TartebSupabase.auth.currentUser?.id;
    if (userId == null) return;

    final profile = await TartebSupabase.client
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

    if (!context.mounted) return;

    if (profile == null) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(builder: (_) => const RoleSelectionScreen()),
        (_) => false,
      );
      return;
    }

    final role = profile['role'] as String;
    if (role == 'candidate') {
      await _routeCandidate(context, userId);
    } else {
      await _routeEmployer(context, userId);
    }
  }

  static Future<void> _routeCandidate(
    BuildContext context,
    String userId,
  ) async {
    final candidate = await TartebSupabase.client
        .from('candidates')
        .select()
        .eq('user_id', userId)
        .maybeSingle();

    if (!context.mounted) return;

    if (candidate == null) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(
          builder: (_) => const Step1PhotoScreen(),
        ),
        (_) => false,
      );
    } else {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(
          builder: (_) => const CandidateDashboardScreen(),
        ),
        (_) => false,
      );
    }
  }

  static Future<void> _routeEmployer(
    BuildContext context,
    String userId,
  ) async {
    final employer = await TartebSupabase.client
        .from('employers')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

    if (!context.mounted) return;

    if (employer == null) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(
          builder: (_) => const EmployerOnboardingScreen(),
        ),
        (_) => false,
      );
    } else {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(builder: (_) => const EmployerShellScreen()),
        (_) => false,
      );
    }
  }

  static void openCandidateOnboarding(
    BuildContext context, {
    CandidateOnboardingData? initialData,
  }) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => Step1PhotoScreen(
          data: initialData ?? const CandidateOnboardingData(),
        ),
      ),
    );
  }
}
