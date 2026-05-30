import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/features/employer/screens/unlock_screen.dart';

class CandidateCardWidget extends StatelessWidget {
  const CandidateCardWidget({super.key, required this.candidate});

  final Map<String, dynamic> candidate;

  @override
  Widget build(BuildContext context) {
    final name = candidate['name'] as String? ?? 'Unknown';
    final role = candidate['role'] as String? ?? '';
    final location = candidate['location'] as String? ?? '';
    final salary = candidate['salary_expectation'];
    final hasContact = candidate['phone'] != null;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => UnlockScreen(candidate: candidate),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                backgroundImage: candidate['photo_url'] != null
                    ? NetworkImage(candidate['photo_url'] as String)
                    : null,
                child: candidate['photo_url'] == null
                    ? const Icon(Icons.person, color: AppColors.primary)
                    : null,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    Text('$role · $location'),
                    if (salary != null)
                      Text('AED $salary / month'),
                  ],
                ),
              ),
              Icon(
                hasContact ? Icons.check_circle : Icons.lock_outline,
                color: hasContact ? AppColors.secondary : AppColors.textSecondary,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
