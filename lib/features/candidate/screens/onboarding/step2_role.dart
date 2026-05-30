import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step3_visa_status.dart';
import 'package:tarteb/features/candidate/widgets/onboarding_progress_bar.dart';

class Step2RoleScreen extends StatefulWidget {
  const Step2RoleScreen({super.key, required this.data});

  final CandidateOnboardingData data;

  @override
  State<Step2RoleScreen> createState() => _Step2RoleScreenState();
}

class _Step2RoleScreenState extends State<Step2RoleScreen> {
  String? _selectedRole;

  @override
  void initState() {
    super.initState();
    _selectedRole = widget.data.role;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Job role')),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const OnboardingProgressBar(currentStep: 2),
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.4,
              ),
              itemCount: AppStrings.candidateRoles.length,
              itemBuilder: (context, index) {
                final role = AppStrings.candidateRoles[index];
                final selected = _selectedRole == role;
                return Material(
                  color: selected
                      ? AppColors.primary.withValues(alpha: 0.12)
                      : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  child: InkWell(
                    onTap: () => setState(() => _selectedRole = role),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: selected
                              ? AppColors.primary
                              : AppColors.divider,
                          width: selected ? 2 : 1,
                        ),
                      ),
                      alignment: Alignment.center,
                      padding: const EdgeInsets.all(12),
                      child: Text(
                        role,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontWeight:
                              selected ? FontWeight.w600 : FontWeight.normal,
                          color: selected
                              ? AppColors.primary
                              : AppColors.textPrimary,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: FilledButton(
              onPressed: _selectedRole == null
                  ? null
                  : () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => Step3VisaStatusScreen(
                            data: widget.data.copyWith(role: _selectedRole),
                          ),
                        ),
                      );
                    },
              child: const Text('Continue'),
            ),
          ),
        ],
      ),
    );
  }
}
