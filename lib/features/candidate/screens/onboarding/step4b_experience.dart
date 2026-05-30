import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/features/candidate/constants/candidate_profile_constants.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step6_availability.dart';
import 'package:tarteb/features/candidate/widgets/onboarding_progress_bar.dart';

class Step4bExperienceScreen extends StatefulWidget {
  const Step4bExperienceScreen({super.key, required this.data});

  final CandidateOnboardingData data;

  @override
  State<Step4bExperienceScreen> createState() => _Step4bExperienceScreenState();
}

class _Step4bExperienceScreenState extends State<Step4bExperienceScreen> {
  int? _yearsExperience;
  final Set<String> _languages = {};
  bool _uaeExperience = false;
  final _previousEmployerController = TextEditingController();
  String? _experienceError;
  String? _languagesError;

  @override
  void initState() {
    super.initState();
    _yearsExperience = widget.data.yearsExperience;
    _languages.addAll(widget.data.languages);
    _uaeExperience = widget.data.uaeExperience;
    _previousEmployerController.text = widget.data.previousEmployer ?? '';
  }

  @override
  void dispose() {
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
    if (_yearsExperience == null) {
      _experienceError = 'Select your years of experience';
      ok = false;
    } else {
      _experienceError = null;
    }
    if (_languages.isEmpty) {
      _languagesError = 'Select at least one language';
      ok = false;
    } else {
      _languagesError = null;
    }
    setState(() {});
    return ok;
  }

  void _continue() {
    if (!_validate()) return;

    final prev = _previousEmployerController.text.trim();
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => Step6AvailabilityScreen(
          data: widget.data.copyWith(
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
          appBar: AppBar(title: const Text('Experience & languages')),
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const OnboardingProgressBar(currentStep: 5),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(24),
                  children: [
                    const Text(
                      'Years of experience',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 12),
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
                          labelStyle: TextStyle(
                            color: selected
                                ? AppColors.primary
                                : AppColors.textPrimary,
                            fontWeight:
                                selected ? FontWeight.w600 : FontWeight.normal,
                          ),
                        );
                      }).toList(),
                    ),
                    if (_experienceError != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        _experienceError!,
                        style: const TextStyle(
                          color: AppColors.error,
                          fontSize: 13,
                        ),
                      ),
                    ],
                    const SizedBox(height: 24),
                    const Text(
                      'Languages spoken',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 12),
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
                          checkmarkColor: AppColors.primary,
                        );
                      }).toList(),
                    ),
                    if (_languagesError != null) ...[
                      const SizedBox(height: 8),
                      Text(
                        _languagesError!,
                        style: const TextStyle(
                          color: AppColors.error,
                          fontSize: 13,
                        ),
                      ),
                    ],
                    const SizedBox(height: 24),
                    const Text(
                      'Have you worked in UAE before?',
                      style: TextStyle(fontWeight: FontWeight.w600),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: FilledButton(
                            onPressed: () =>
                                setState(() => _uaeExperience = true),
                            style: FilledButton.styleFrom(
                              backgroundColor: _uaeExperience
                                  ? AppColors.primary
                                  : Colors.white,
                              foregroundColor: _uaeExperience
                                  ? Colors.white
                                  : AppColors.textPrimary,
                              side: const BorderSide(color: AppColors.divider),
                            ),
                            child: const Text('Yes'),
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
                                  : Colors.white,
                              foregroundColor: !_uaeExperience
                                  ? Colors.white
                                  : AppColors.textPrimary,
                              side: const BorderSide(color: AppColors.divider),
                            ),
                            child: const Text('No'),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    TextField(
                      controller: _previousEmployerController,
                      decoration: const InputDecoration(
                        labelText: 'Previous company name (optional)',
                        hintText: "e.g. Carrefour, McDonald's, ADNOC",
                        prefixIcon: Icon(Icons.business_outlined),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(24),
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
