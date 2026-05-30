import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/features/candidate/constants/candidate_profile_constants.dart';

/// Experience, languages, UAE badge — visible before unlock on browse cards.
class CandidateConfidenceDetails extends StatelessWidget {
  const CandidateConfidenceDetails({
    super.key,
    required this.candidate,
    this.compact = false,
  });

  final Map<String, dynamic> candidate;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final years = CandidateProfileConstants.parseYearsExperience(
      candidate['years_experience'],
    );
    final languages = CandidateProfileConstants.parseLanguages(
      candidate['languages'],
    );
    final uaeExperience = CandidateProfileConstants.parseUaeExperience(
      candidate['uae_experience'],
    );
    final previousEmployer = candidate['previous_employer'] as String?;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          CandidateProfileConstants.experienceLabel(years),
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                fontWeight: FontWeight.w500,
              ),
        ),
        if (languages.isNotEmpty) ...[
          SizedBox(height: compact ? 6 : 8),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: languages.take(3).map((lang) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.divider.withValues(alpha: 0.6),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  lang,
                  style: TextStyle(
                    fontSize: compact ? 10 : 11,
                    color: AppColors.textSecondary,
                  ),
                ),
              );
            }).toList(),
          ),
        ],
        if (uaeExperience) ...[
          SizedBox(height: compact ? 6 : 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.secondary.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppColors.secondary.withValues(alpha: 0.35),
              ),
            ),
            child: const Text(
              'UAE Experience ✓',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.secondary,
              ),
            ),
          ),
        ],
        if (previousEmployer != null && previousEmployer.trim().isNotEmpty) ...[
          SizedBox(height: compact ? 4 : 6),
          Text(
            'Previously at ${previousEmployer.trim()}',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: AppColors.textSecondary,
                  fontSize: compact ? 11 : 12,
                ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ],
    );
  }
}
