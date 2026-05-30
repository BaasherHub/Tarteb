import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/auth/screens/role_selection_screen.dart';
import 'package:tarteb/features/candidate/screens/candidate_dashboard_screen.dart';
import 'package:tarteb/features/employer/screens/browse_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _routeUser();
  }

  Future<void> _routeUser() async {
    await Future<void>.delayed(const Duration(milliseconds: 800));
    if (!mounted) return;

    final session = TartebSupabase.auth.currentSession;
    if (session == null) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute<void>(builder: (_) => const RoleSelectionScreen()),
      );
      return;
    }

    final profile = await TartebSupabase.client
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();

    if (!mounted) return;

    if (profile == null) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute<void>(builder: (_) => const RoleSelectionScreen()),
      );
      return;
    }

    final role = profile['role'] as String;
    if (role == 'candidate') {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute<void>(
          builder: (_) => const CandidateDashboardScreen(),
        ),
      );
    } else {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute<void>(builder: (_) => const BrowseScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              AppStrings.appName,
              style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              AppStrings.splashTagline,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 32),
            const CircularProgressIndicator(color: AppColors.primary),
          ],
        ),
      ),
    );
  }
}
