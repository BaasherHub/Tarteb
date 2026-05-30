import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step5_availability.dart';

class Step4SalaryLocationScreen extends StatefulWidget {
  const Step4SalaryLocationScreen({
    super.key,
    required this.jobRole,
    required this.visaStatus,
    required this.nationality,
  });

  final String jobRole;
  final String visaStatus;
  final String nationality;

  @override
  State<Step4SalaryLocationScreen> createState() =>
      _Step4SalaryLocationScreenState();
}

class _Step4SalaryLocationScreenState extends State<Step4SalaryLocationScreen> {
  final _salaryController = TextEditingController();
  String? _location;

  @override
  void dispose() {
    _salaryController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Step 4 of 5 — Salary & location')),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                TextField(
                  controller: _salaryController,
                  decoration: const InputDecoration(
                    labelText: 'Monthly salary expectation (AED)',
                    prefixIcon: Icon(Icons.payments),
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 16),
                const Text('Preferred location'),
                ...AppStrings.locations.map(
                  (loc) => RadioListTile<String>(
                    title: Text(loc),
                    value: loc,
                    groupValue: _location,
                    onChanged: (v) => setState(() => _location = v),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: FilledButton(
              onPressed: _location == null || _salaryController.text.trim().isEmpty
                  ? null
                  : () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => Step5AvailabilityScreen(
                            jobRole: widget.jobRole,
                            visaStatus: widget.visaStatus,
                            nationality: widget.nationality,
                            salaryExpectation:
                                int.parse(_salaryController.text.trim()),
                            location: _location!,
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
