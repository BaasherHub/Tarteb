import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/core/utils/error_message.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/candidate_dashboard_screen.dart';
import 'package:tarteb/features/candidate/widgets/onboarding_progress_bar.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/core/widgets/tarteb_primary_button.dart';

class Step6AvailabilityScreen extends StatefulWidget {
  const Step6AvailabilityScreen({super.key, required this.data});

  final CandidateOnboardingData data;

  @override
  State<Step6AvailabilityScreen> createState() => _Step6AvailabilityScreenState();
}

class _Step6AvailabilityScreenState extends State<Step6AvailabilityScreen> {
  final _nameController = TextEditingController();
  DateTime? _availableFrom;
  bool _loading = false;
  String? _nameError;
  String? _dateError;

  @override
  void initState() {
    super.initState();
    _nameController.text = widget.data.name ?? '';
    _availableFrom = widget.data.availableFrom;
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final name = _nameController.text.trim();
    var valid = true;
    if (name.isEmpty) {
      _nameError = AppStrings.requiredField;
      valid = false;
    } else {
      _nameError = null;
    }
    if (_availableFrom == null) {
      _dateError = AppStrings.requiredField;
      valid = false;
    } else {
      _dateError = null;
    }
    setState(() {});
    if (!valid) return;

    setState(() => _loading = true);
    try {
      final userId = TartebSupabase.auth.currentUser!.id;
      final payload = {
        'user_id': userId,
        'name': name,
        'photo_url': widget.data.photoUrl,
        'role': widget.data.role,
        'visa_status': widget.data.visaStatus,
        'nationality': widget.data.nationality,
        'salary_expectation': widget.data.salaryExpectation,
        'available_from':
            _availableFrom!.toIso8601String().split('T').first,
        'location': widget.data.location,
        'phone': widget.data.phone,
        'whatsapp': widget.data.whatsapp,
        'years_experience': widget.data.yearsExperience ?? 0,
        'languages': widget.data.languages,
        'uae_experience': widget.data.uaeExperience,
        'previous_employer': widget.data.previousEmployer,
        'is_active': true,
      };

      await TartebSupabase.client.from('candidates').upsert(
        payload,
        onConflict: 'user_id',
      );

      if (!mounted) return;
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute<void>(
          builder: (_) => const CandidateDashboardScreen(),
        ),
        (_) => false,
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(ErrorMessage.from(e))),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateLabel = _availableFrom == null
        ? AppStrings.availableFrom
        : '${_availableFrom!.day}/${_availableFrom!.month}/${_availableFrom!.year}';

    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(title: Text(AppStrings.availability)),
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const OnboardingProgressBar(currentStep: 4),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      TextField(
                        controller: _nameController,
                        decoration: InputDecoration(
                          labelText: AppStrings.fullName,
                          prefixIcon: const Icon(Icons.person_outline),
                          errorText: _nameError,
                        ),
                        onChanged: (_) {
                          if (_nameError != null) {
                            setState(() => _nameError = null);
                          }
                        },
                      ),
                      const SizedBox(height: AppSpacing.xl),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        title: Text(AppStrings.availableFrom),
                        subtitle: Text(dateLabel),
                        trailing: const Icon(Icons.calendar_today),
                        onTap: () async {
                          final now = DateTime.now();
                          final today =
                              DateTime(now.year, now.month, now.day);
                          final date = await showDatePicker(
                            context: context,
                            firstDate: today,
                            lastDate: today.add(const Duration(days: 365 * 2)),
                            initialDate: _availableFrom ?? today,
                          );
                          if (date != null) {
                            setState(() {
                              _availableFrom = date;
                              _dateError = null;
                            });
                          }
                        },
                      ),
                      if (_dateError != null)
                        Text(
                          _dateError!,
                          style: const TextStyle(
                            color: AppColors.error,
                            fontSize: 13,
                          ),
                        ),
                      const Spacer(),
                      TartebPrimaryButton(
                        label: widget.data.isEditing
                            ? AppStrings.editProfile
                            : AppStrings.continueLabel,
                        onPressed: _loading ? null : _submit,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
