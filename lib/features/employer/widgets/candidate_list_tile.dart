import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/features/candidate/widgets/candidate_confidence_details.dart';
import 'package:tarteb/features/employer/widgets/visa_badge.dart';

/// Compact browse row — tap opens detail.
class CandidateListTile extends StatelessWidget {
  const CandidateListTile({
    super.key,
    required this.candidate,
    required this.onTap,
  });

  final Map<String, dynamic> candidate;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final role = candidate['role'] as String? ?? '';
    final visa = candidate['visa_status'] as String? ?? '';
    final location = candidate['location'] as String? ?? '';
    final salary = candidate['salary_expectation'];
    final photoUrl = candidate['photo_url'] as String?;
    final isUnlocked = candidate['phone'] != null;

    return Material(
      color: AppColors.surface,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.md,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: SizedBox(
                  width: 56,
                  height: 56,
                  child: photoUrl != null
                      ? Image.network(
                          photoUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, _, _) => _placeholder(),
                        )
                      : _placeholder(),
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      role,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    VisaBadge(visaStatus: visa),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Icon(
                          Icons.location_on_outlined,
                          size: 14,
                          color: AppColors.textSecondary.withValues(alpha: 0.9),
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            location,
                            style: Theme.of(context).textTheme.bodySmall,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    if (salary != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        'AED $salary${AppStrings.perMonth}',
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ],
                    const SizedBox(height: 6),
                    CandidateConfidenceDetails(
                      candidate: candidate,
                      compact: true,
                    ),
                  ],
                ),
              ),
              Icon(
                isUnlocked ? Icons.check_circle_outline : Icons.chevron_right,
                color: isUnlocked ? AppColors.secondary : AppColors.textSecondary,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _placeholder() {
    return ColoredBox(
      color: AppColors.primary.withValues(alpha: 0.08),
      child: const Icon(Icons.person, color: AppColors.primary),
    );
  }
}
