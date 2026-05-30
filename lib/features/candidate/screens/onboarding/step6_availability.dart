import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/core/utils/error_message.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/candidate_dashboard_screen.dart';
import 'package:tarteb/features/candidate/widgets/onboarding_progress_bar.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class Step6AvailabilityScreen extends StatefulWidget {
  const Step6AvailabilityScreen({super.key, required this.data});

  final CandidateOnboardingData data;

  @override
  State<Step6AvailabilityScreen> createState() => _Step6AvailabilityScreenState();
}

class _Step6AvailabilityScreenState extends State<Step6AvailabilityScreen> {
  final _nameController = TextEditingController();
  final _nationalityController = TextEditingController();
  DateTime? _availableFrom;
  bool _loading = false;
  String? _nameError;
  String? _nationalityError;
  String? _dateError;

  @override
  void initState() {
    super.initState();
    _nameController.text = widget.data.name ?? '';
    _nationalityController.text = widget.data.nationality ?? '';
    _availableFrom = widget.data.availableFrom;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _nationalityController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final name = _nameController.text.trim();
    final nationality = _nationalityController.text.trim();
    var valid = true;
    if (name.isEmpty) {
      _nameError = AppStrings.requiredField;
      valid = false;
    } else {
      _nameError = null;
    }
    if (nationality.isEmpty) {
      _nationalityError = AppStrings.requiredField;
      valid = false;
    } else {
      _nationalityError = null;
    }
    if (_availableFrom == null) {
      _dateError = 'Select availability date';
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
        'nationality': nationality,
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
    if (_loading) return const Scaffold(body: LoadingWidget());

    final dateLabel = _availableFrom == null
        ? 'Select date'
        : '${_availableFrom!.day}/${_availableFrom!.month}/${_availableFrom!.year}';

    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(title: const Text('Availability')),
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const OnboardingProgressBar(currentStep: 6),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      TextField(
                        controller: _nameController,
                        decoration: InputDecoration(
                          labelText: 'Full name',
                          prefixIcon: const Icon(Icons.person_outline),
                          errorText: _nameError,
                        ),
                        onChanged: (_) {
                          if (_nameError != null) {
                            setState(() => _nameError = null);
                          }
                        },
                      ),
                      const SizedBox(height: 20),
                      TextField(
                        controller: _nationalityController,
                        decoration: InputDecoration(
                          labelText: AppStrings.nationality,
                          prefixIcon: const Icon(Icons.flag_outlined),
                          errorText: _nationalityError,
                        ),
                        onChanged: (_) {
                          if (_nationalityError != null) {
                            setState(() => _nationalityError = null);
                          }
                        },
                      ),
                      const SizedBox(height: 20),
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
                      FilledButton(
                        onPressed: _submit,
                        child: Text(
                          widget.data.isEditing
                              ? 'Save profile'
                              : 'Submit profile',
                        ),
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
