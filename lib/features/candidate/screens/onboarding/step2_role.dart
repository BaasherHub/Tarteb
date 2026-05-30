import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step3_visa_status.dart';

class Step2RoleScreen extends StatefulWidget {
  const Step2RoleScreen({super.key});

  @override
  State<Step2RoleScreen> createState() => _Step2RoleScreenState();
}

class _Step2RoleScreenState extends State<Step2RoleScreen> {
  String? _selectedRole;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Step 2 of 5 — Job role')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: AppStrings.candidateRoles.length,
              itemBuilder: (context, index) {
                final role = AppStrings.candidateRoles[index];
                return RadioListTile<String>(
                  title: Text(role),
                  value: role,
                  groupValue: _selectedRole,
                  onChanged: (v) => setState(() => _selectedRole = v),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24),
            child: FilledButton(
              onPressed: _selectedRole == null
                  ? null
                  : () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => Step3VisaStatusScreen(jobRole: _selectedRole!),
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
