import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step1_photo.dart';
import 'package:tarteb/features/employer/screens/employer_onboarding_screen.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class RoleSelectionScreen extends StatefulWidget {
  const RoleSelectionScreen({super.key});

  @override
  State<RoleSelectionScreen> createState() => _RoleSelectionScreenState();
}

class _RoleSelectionScreenState extends State<RoleSelectionScreen> {
  bool _loading = false;

  Future<void> _selectRole(String role) async {
    setState(() => _loading = true);
    try {
      final userId = TartebSupabase.auth.currentUser!.id;
      await TartebSupabase.client.from('profiles').upsert(
        {'user_id': userId, 'role': role},
        onConflict: 'user_id',
      );

      if (!mounted) return;

      if (role == 'candidate') {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute<void>(builder: (_) => const Step1PhotoScreen()),
          (_) => false,
        );
      } else {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute<void>(
            builder: (_) => const EmployerOnboardingScreen(),
          ),
          (_) => false,
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: LoadingWidget());

    return Scaffold(
      appBar: AppBar(title: Text(AppStrings.selectRole)),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 24),
            _RoleCard(
              title: AppStrings.roleCandidate,
              subtitle: 'List your profile for free',
              icon: Icons.person,
              color: AppColors.secondary,
              onTap: () => _selectRole('candidate'),
            ),
            const SizedBox(height: 16),
            _RoleCard(
              title: AppStrings.roleEmployer,
              subtitle: 'Browse and unlock candidates',
              icon: Icons.business,
              color: AppColors.primary,
              onTap: () => _selectRole('employer'),
            ),
          ],
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  const _RoleCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppColors.divider),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: color.withValues(alpha: 0.15),
                child: Icon(icon, color: color),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    const SizedBox(height: 4),
                    Text(subtitle),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right),
            ],
          ),
        ),
      ),
    );
  }
}
