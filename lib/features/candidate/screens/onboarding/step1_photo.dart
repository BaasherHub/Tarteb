import 'package:flutter/material.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step2_role.dart';

class Step1PhotoScreen extends StatelessWidget {
  const Step1PhotoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Step 1 of 5 — Photo')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const CircleAvatar(radius: 60, child: Icon(Icons.camera_alt, size: 40)),
            const SizedBox(height: 24),
            const Text('Add a clear photo of yourself'),
            const Spacer(),
            FilledButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(builder: (_) => const Step2RoleScreen()),
                );
              },
              child: const Text('Continue'),
            ),
          ],
        ),
      ),
    );
  }
}
