import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';

/// Placeholder for Phase 4 — unlocked candidates list.
class MyUnlocksScreen extends StatelessWidget {
  const MyUnlocksScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Unlocks')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.bookmark_border,
                size: 72,
                color: AppColors.primary.withValues(alpha: 0.4),
              ),
              const SizedBox(height: 20),
              Text(
                'Your unlocked candidates will appear here',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Text(
                'Coming in Phase 4',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
