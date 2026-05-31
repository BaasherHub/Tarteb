import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/features/candidate/constants/candidate_profile_constants.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step6_availability.dart';
import 'package:tarteb/features/candidate/widgets/onboarding_progress_bar.dart';

class Step4SalaryLocationScreen extends StatefulWidget {
  const Step4SalaryLocationScreen({super.key, required this.data});

  final CandidateOnboardingData data;

  @override
  State<Step4SalaryLocationScreen> createState() =>
      _Step4SalaryLocationScreenState();
}

class _Step4SalaryLocationScreenState extends State<Step4SalaryLocationScreen> {
  final _salaryController = TextEditingController();
  final _phoneController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _previousEmployerController = TextEditingController();
  int? _yearsExperience;
  final Set<String> _languages = {};
  bool _uaeExperience = false;
  String? _experienceError;
  String? _languagesError;

  @override
  void initState() {
    super.initState();
    if (widget.data.salaryExpectation != null) {
      _salaryController.text = '${widget.data.salaryExpectation}';
    }
    _phoneController.text = widget.data.phone ?? '';
    _whatsappController.text = widget.data.whatsapp ?? '';
    _yearsExperience = widget.data.yearsExperience;
    _languages.addAll(widget.data.languages);
    _uaeExperience = widget.data.uaeExperience;
    _previousEmployerController.text = widget.data.previousEmployer ?? '';
  }

  @override
  void dispose() {
    _salaryController.dispose();
    _phoneController.dispose();
    _whatsappController.dispose();
    _previousEmployerController.dispose();
    super.dispose();
  }

  void _toggleLanguage(String lang) {
    setState(() {
      if (_languages.contains(lang)) {
        _languages.remove(lang);
      } else {
        _languages.add(lang);
      }
      _languagesError = null;
    });
  }

  bool _validate() {
    var ok = true;
    final salary = int.tryParse(_salaryController.text.trim());
    final phone = _phoneController.text.trim();

    if (salary == null || phone.isEmpty) {
      ok = false;
    }
    if (_yearsExperience == null) {
      _experienceError = AppStrings.requiredField;
      ok = false;
    } else {
      _experienceError = null;
    }
    if (_languages.isEmpty) {
      _languagesError = AppStrings.requiredField;
      ok = false;
    } else {
      _languagesError = null;
    }
    setState(() {});
    return ok;
  }

  void _continue() {
    if (!_validate()) return;

    final salary = int.parse(_salaryController.text.trim());
    final prev = _previousEmployerController.text.trim();

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => Step6AvailabilityScreen(
          data: widget.data.copyWith(
            salaryExpectation: salary,
            phone: _phoneController.text.trim(),
            whatsapp: _whatsappController.text.trim().isEmpty
                ? null
                : _whatsappController.text.trim(),
            yearsExperience: _yearsExperience,
            languages: _languages.toList(),
            uaeExperience: _uaeExperience,
            previousEmployer: prev.isEmpty ? null : prev,
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(title: Text(AppStrings.salaryAndContact)),
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const OnboardingProgressBar(currentStep: 3),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  children: [
                    TextField(
                      controller: _salaryController,
                      decoration: InputDecoration(
                        labelText: AppStrings.monthlySalaryAed,
                        prefixIcon: const Icon(Icons.payments_outlined),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    TextField(
                      controller: _phoneController,
                      decoration: InputDecoration(
                        labelText: AppStrings.phoneNumber,
                        prefixIcon: const Icon(Icons.phone_outlined),
                      ),
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    TextField(
                      controller: _whatsappController,
                      decoration: InputDecoration(
                        labelText: AppStrings.whatsappOptional,
                        prefixIcon: const Icon(Icons.chat_outlined),
                      ),
                      keyboardType: TextInputType.phone,
                    ),
                    const SizedBox(height: AppSpacing.xl),
                    Text(
                      AppStrings.yearsExperienceLabel,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children:
                          CandidateProfileConstants.experienceOptions.map((opt) {
                        final selected = _yearsExperience == opt.years;
                        return ChoiceChip(
                          label: Text(opt.label),
                          selected: selected,
                          onSelected: (_) => setState(() {
                            _yearsExperience = opt.years;
                            _experienceError = null;
                          }),
                          selectedColor:
                              AppColors.primary.withValues(alpha: 0.2),
                        );
                      }).toList(),
                    ),
                    if (_experienceError != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          _experienceError!,
                          style: const TextStyle(color: AppColors.error),
                        ),
                      ),
                    const SizedBox(height: AppSpacing.xl),
                    Text(
                      AppStrings.languages,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children:
                          CandidateProfileConstants.languageOptions.map((lang) {
                        final selected = _languages.contains(lang);
                        return FilterChip(
                          label: Text(lang),
                          selected: selected,
                          onSelected: (_) => _toggleLanguage(lang),
                          selectedColor:
                              AppColors.primary.withValues(alpha: 0.2),
                        );
                      }).toList(),
                    ),
                    if (_languagesError != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          _languagesError!,
                          style: const TextStyle(color: AppColors.error),
                        ),
                      ),
                    const SizedBox(height: AppSpacing.xl),
                    Text(
                      AppStrings.uaeExperienceQuestion,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: AppSpacing.md),
                    Row(
                      children: [
                        Expanded(
                          child: FilledButton(
                            onPressed: () =>
                                setState(() => _uaeExperience = true),
                            style: FilledButton.styleFrom(
                              backgroundColor: _uaeExperience
                                  ? AppColors.primary
                                  : AppColors.surface,
                              foregroundColor: _uaeExperience
                                  ? Colors.white
                                  : AppColors.textPrimary,
                              side: const BorderSide(color: AppColors.divider),
                            ),
                            child: Text(AppStrings.yes),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: FilledButton(
                            onPressed: () =>
                                setState(() => _uaeExperience = false),
                            style: FilledButton.styleFrom(
                              backgroundColor: !_uaeExperience
                                  ? AppColors.primary
                                  : AppColors.surface,
                              foregroundColor: !_uaeExperience
                                  ? Colors.white
                                  : AppColors.textPrimary,
                              side: const BorderSide(color: AppColors.divider),
                            ),
                            child: Text(AppStrings.no),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.lg),
                    TextField(
                      controller: _previousEmployerController,
                      decoration: const InputDecoration(
                        labelText: 'Previous company (optional)',
                        prefixIcon: Icon(Icons.business_outlined),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(AppSpacing.xl),
                child: FilledButton(
                  onPressed: _continue,
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
