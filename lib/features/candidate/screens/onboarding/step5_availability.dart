import 'package:flutter/material.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/candidate_dashboard_screen.dart';
import 'package:tarteb/features/candidate/widgets/onboarding_progress_bar.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class Step5AvailabilityScreen extends StatefulWidget {
  const Step5AvailabilityScreen({super.key, required this.data});

  final CandidateOnboardingData data;

  @override
  State<Step5AvailabilityScreen> createState() => _Step5AvailabilityScreenState();
}

class _Step5AvailabilityScreenState extends State<Step5AvailabilityScreen> {
  final _nameController = TextEditingController();
  final _nationalityController = TextEditingController();
  DateTime? _availableFrom;
  bool _loading = false;

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
    if (name.isEmpty || nationality.isEmpty || _availableFrom == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Complete all fields')),
      );
      return;
    }

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

    final dateLabel = _availableFrom == null
        ? 'Select date'
        : '${_availableFrom!.day}/${_availableFrom!.month}/${_availableFrom!.year}';

    return Scaffold(
      appBar: AppBar(title: const Text('Availability')),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const OnboardingProgressBar(currentStep: 5),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Full name',
                      prefixIcon: Icon(Icons.person_outline),
                    ),
                  ),
                  const SizedBox(height: 20),
                  TextField(
                    controller: _nationalityController,
                    decoration: const InputDecoration(
                      labelText: 'Nationality',
                      prefixIcon: Icon(Icons.flag_outlined),
                    ),
                  ),
                  const SizedBox(height: 20),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Available from'),
                    subtitle: Text(dateLabel),
                    trailing: const Icon(Icons.calendar_today),
                    onTap: () async {
                      final now = DateTime.now();
                      final today = DateTime(now.year, now.month, now.day);
                      final date = await showDatePicker(
                        context: context,
                        firstDate: today,
                        lastDate: today.add(const Duration(days: 365 * 2)),
                        initialDate: _availableFrom ?? today,
                      );
                      if (date != null) setState(() => _availableFrom = date);
                    },
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
  }
}
