import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
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
  String? _location;
  final _nationalityController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _visaStatus = widget.data.visaStatus;
    _location = widget.data.location;
    _nationalityController.text = widget.data.nationality ?? '';
  }

  @override
  void dispose() {
    _nationalityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(title: Text(AppStrings.visaStatus)),
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const OnboardingProgressBar(currentStep: 2),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  children: [
                    ...AppStrings.visaStatuses.map((status) {
                      final selected = _visaStatus == status;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: SizedBox(
                          width: double.infinity,
                          height: AppSpacing.minTouchTarget,
                          child: FilledButton(
                            onPressed: () =>
                                setState(() => _visaStatus = status),
                            style: FilledButton.styleFrom(
                              backgroundColor: selected
                                  ? AppColors.primary
                                  : AppColors.surface,
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
                            child: Text(status),
                          ),
                        ),
                      );
                    }),
                    const SizedBox(height: AppSpacing.lg),
                    TextField(
                      controller: _nationalityController,
                      decoration: InputDecoration(
                        labelText: AppStrings.nationality,
                        prefixIcon: const Icon(Icons.flag_outlined),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    DropdownButtonFormField<String>(
                      initialValue: _location,
                      decoration: InputDecoration(
                        labelText: AppStrings.location,
                        prefixIcon: const Icon(Icons.location_on_outlined),
                      ),
                      items: AppStrings.locations
                          .map(
                            (loc) =>
                                DropdownMenuItem(value: loc, child: Text(loc)),
                          )
                          .toList(),
                      onChanged: (v) => setState(() => _location = v),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(AppSpacing.xl),
                child: FilledButton(
                  onPressed: _visaStatus == null ||
                          _location == null ||
                          _nationalityController.text.trim().isEmpty
                      ? null
                      : () {
                          Navigator.of(context).push(
                            MaterialPageRoute<void>(
                              builder: (_) => Step4SalaryLocationScreen(
                                data: widget.data.copyWith(
                                  visaStatus: _visaStatus,
                                  location: _location,
                                  nationality:
                                      _nationalityController.text.trim(),
                                ),
                              ),
                            ),
                          );
                        },
                  child: Text(AppStrings.continueLabel),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
