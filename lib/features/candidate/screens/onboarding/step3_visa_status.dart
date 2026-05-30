import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step4_salary_location.dart';

class Step3VisaStatusScreen extends StatefulWidget {
  const Step3VisaStatusScreen({super.key, required this.jobRole});

  final String jobRole;

  @override
  State<Step3VisaStatusScreen> createState() => _Step3VisaStatusScreenState();
}

class _Step3VisaStatusScreenState extends State<Step3VisaStatusScreen> {
  String? _visaStatus;
  final _nationalityController = TextEditingController();

  @override
  void dispose() {
    _nationalityController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Step 3 of 5 — Visa & nationality')),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                ...AppStrings.visaStatuses.map(
                  (status) => RadioListTile<String>(
                    title: Text(status),
                    value: status,
                    groupValue: _visaStatus,
                    onChanged: (v) => setState(() => _visaStatus = v),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _nationalityController,
                  decoration: const InputDecoration(
                    labelText: 'Nationality',
                    prefixIcon: Icon(Icons.flag),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: FilledButton(
              onPressed: _visaStatus == null ||
                      _nationalityController.text.trim().isEmpty
                  ? null
                  : () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => Step4SalaryLocationScreen(
                            jobRole: widget.jobRole,
                            visaStatus: _visaStatus!,
                            nationality: _nationalityController.text.trim(),
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
