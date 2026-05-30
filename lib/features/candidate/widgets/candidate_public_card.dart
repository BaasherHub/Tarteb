import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';

/// Profile card shown to employers (browse) and on the candidate dashboard.
class CandidatePublicCard extends StatelessWidget {
  const CandidatePublicCard({
    super.key,
    required this.candidate,
    this.showContact = false,
  });

  final Map<String, dynamic> candidate;
  final bool showContact;

  @override
  Widget build(BuildContext context) {
    final name = candidate['name'] as String? ?? 'Unknown';
    final role = candidate['role'] as String? ?? '';
    final location = candidate['location'] as String? ?? '';
    final salary = candidate['salary_expectation'];
    final photoUrl = candidate['photo_url'] as String?;
    final visa = candidate['visa_status'] as String?;
    final nationality = candidate['nationality'] as String?;

    return Card(
      margin: const EdgeInsets.all(16),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppColors.divider),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CircleAvatar(
              radius: 36,
              backgroundColor: AppColors.primary.withValues(alpha: 0.1),
              backgroundImage:
                  photoUrl != null ? NetworkImage(photoUrl) : null,
              child: photoUrl == null
                  ? const Icon(Icons.person, size: 36, color: AppColors.primary)
                  : null,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text('$role · $location'),
                  if (salary != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      'AED $salary / month',
                      style: const TextStyle(fontWeight: FontWeight.w500),
                    ),
                  ],
                  if (visa != null) ...[
                    const SizedBox(height: 4),
                    Text(visa, style: Theme.of(context).textTheme.bodySmall),
                  ],
                  if (nationality != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      nationality,
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                  if (showContact) ...[
                    const SizedBox(height: 8),
                    if (candidate['phone'] != null)
                      Text('Phone: ${candidate['phone']}'),
                    if (candidate['whatsapp'] != null &&
                        (candidate['whatsapp'] as String).isNotEmpty)
                      Text('WhatsApp: ${candidate['whatsapp']}'),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
