import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step4_salary_location.dart';
import 'package:tarteb/features/candidate/widgets/onboarding_progress_bar.dart';

class Step3VisaStatusScreen extends StatefulWidget {
  const Step3VisaStatusScreen({super.key, required this.data});

  final CandidateOnboardingData data;

  @override
  State<Step3VisaStatusScreen> createState() => _Step3VisaStatusScreenState();
}

class _Step3VisaStatusScreenState extends State<Step3VisaStatusScreen> {
  String? _visaStatus;

  @override
  void initState() {
    super.initState();
    _visaStatus = widget.data.visaStatus;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Visa status')),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const OnboardingProgressBar(currentStep: 3),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: AppStrings.visaStatuses.map((status) {
                final selected = _visaStatus == status;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: FilledButton(
                      onPressed: () => setState(() => _visaStatus = status),
                      style: FilledButton.styleFrom(
                        backgroundColor: selected
                            ? AppColors.primary
                            : Colors.white,
                        foregroundColor: selected
                            ? Colors.white
                            : AppColors.textPrimary,
                        side: BorderSide(
                          color: selected
                              ? AppColors.primary
                              : AppColors.divider,
                        ),
                        elevation: 0,
                      ),
                      child: Text(
                        status,
                        style: const TextStyle(fontSize: 16),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: FilledButton(
              onPressed: _visaStatus == null
                  ? null
                  : () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => Step4SalaryLocationScreen(
                            data: widget.data.copyWith(
                              visaStatus: _visaStatus,
                            ),
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
