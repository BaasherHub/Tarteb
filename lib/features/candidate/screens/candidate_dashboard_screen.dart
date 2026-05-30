import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/candidate/screens/candidate_profile_screen.dart';

class CandidateDashboardScreen extends StatelessWidget {
  const CandidateDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppStrings.appName),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => const CandidateProfileScreen(),
                ),
              );
            },
          ),
        ],
      ),
      body: const Center(
        child: Text('Your profile is live. Employers can discover you.'),
      ),
    );
  }
}
