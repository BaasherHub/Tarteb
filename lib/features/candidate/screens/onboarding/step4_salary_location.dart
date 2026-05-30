import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step5_availability.dart';
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
  String? _location;

  @override
  void initState() {
    super.initState();
    if (widget.data.salaryExpectation != null) {
      _salaryController.text = '${widget.data.salaryExpectation}';
    }
    _phoneController.text = widget.data.phone ?? '';
    _whatsappController.text = widget.data.whatsapp ?? '';
    _location = widget.data.location;
  }

  @override
  void dispose() {
    _salaryController.dispose();
    _phoneController.dispose();
    _whatsappController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Salary & contact')),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const OnboardingProgressBar(currentStep: 4),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(24),
              children: [
                TextField(
                  controller: _salaryController,
                  decoration: const InputDecoration(
                    labelText: 'Monthly salary expectation (AED)',
                    prefixIcon: Icon(Icons.payments_outlined),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 20),
                DropdownButtonFormField<String>(
                  initialValue: _location,
                  decoration: const InputDecoration(
                    labelText: 'Location',
                    prefixIcon: Icon(Icons.location_on_outlined),
                  ),
                  items: AppStrings.locations
                      .map(
                        (loc) => DropdownMenuItem(value: loc, child: Text(loc)),
                      )
                      .toList(),
                  onChanged: (v) => setState(() => _location = v),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: _phoneController,
                  decoration: const InputDecoration(
                    labelText: 'Phone number',
                    prefixIcon: Icon(Icons.phone_outlined),
                  ),
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: _whatsappController,
                  decoration: const InputDecoration(
                    labelText: 'WhatsApp (optional)',
                    prefixIcon: Icon(Icons.chat_outlined),
                  ),
                  keyboardType: TextInputType.phone,
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: FilledButton(
              onPressed: () {
                final salaryText = _salaryController.text.trim();
                final salary = int.tryParse(salaryText);
                final phone = _phoneController.text.trim();
                if (salary == null || _location == null || phone.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Enter salary, location, and phone number',
                      ),
                    ),
                  );
                  return;
                }
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => Step5AvailabilityScreen(
                      data: widget.data.copyWith(
                        salaryExpectation: salary,
                        location: _location,
                        phone: phone,
                        whatsapp: _whatsappController.text.trim().isEmpty
                            ? null
                            : _whatsappController.text.trim(),
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
