import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/features/candidate/widgets/candidate_confidence_details.dart';
import 'package:tarteb/features/employer/services/favorites_service.dart';
import 'package:tarteb/features/employer/widgets/visa_badge.dart';

/// Compact browse row — tap opens detail.
class CandidateListTile extends StatefulWidget {
  const CandidateListTile({
    super.key,
    required this.candidate,
    required this.onTap,
    this.onFavoriteChanged,
  });

  final Map<String, dynamic> candidate;
  final VoidCallback onTap;
  final VoidCallback? onFavoriteChanged;

  @override
  State<CandidateListTile> createState() => _CandidateListTileState();
}

class _CandidateListTileState extends State<CandidateListTile> {
  bool _isFavorite = false;
  bool _isToggling = false;

  @override
  void initState() {
    super.initState();
    _checkFavorite();
  }

  @override
  void didUpdateWidget(CandidateListTile oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.candidate['id'] != widget.candidate['id']) {
      _checkFavorite();
    }
  }

  void _checkFavorite() {
    final id = widget.candidate['id']?.toString();
    if (id != null) {
      setState(() => _isFavorite = FavoritesService.instance.isFavorite(id));
    }
  }

  Future<void> _toggleFavorite() async {
    if (_isToggling) return;
    final id = widget.candidate['id']?.toString();
    if (id == null) return;

    setState(() => _isToggling = true);
    
    try {
      final newState = await FavoritesService.instance.toggle(id);
      if (mounted) {
        setState(() => _isFavorite = newState);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              newState
                  ? AppStrings.addedToFavorites
                  : AppStrings.removedFromFavorites,
            ),
            duration: const Duration(seconds: 1),
          ),
        );
        widget.onFavoriteChanged?.call();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(AppStrings.somethingWentWrong)),
        );
      }
    } finally {
      if (mounted) setState(() => _isToggling = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final role = widget.candidate['role'] as String? ?? '';
    final visa = widget.candidate['visa_status'] as String? ?? '';
    final location = widget.candidate['location'] as String? ?? '';
    final salary = widget.candidate['salary_expectation'];
    final photoUrl = widget.candidate['photo_url'] as String?;
    final isUnlocked = widget.candidate['phone'] != null;

    return Material(
      color: isDark ? AppColors.surfaceDark : AppColors.surface,
      child: InkWell(
        onTap: widget.onTap,
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
                          color: (isDark
                                  ? AppColors.textSecondaryDark
                                  : AppColors.textSecondary)
                              .withValues(alpha: 0.9),
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
                      candidate: widget.candidate,
                      compact: true,
                    ),
                  ],
                ),
              ),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: Icon(
                      _isFavorite ? Icons.favorite : Icons.favorite_border,
                      color: _isFavorite
                          ? Colors.red
                          : (isDark
                              ? AppColors.textSecondaryDark
                              : AppColors.textSecondary),
                    ),
                    onPressed: _isToggling ? null : _toggleFavorite,
                    tooltip: _isFavorite
                        ? AppStrings.removeFromFavorites
                        : AppStrings.addToFavorites,
                    constraints: const BoxConstraints(
                      minWidth: 36,
                      minHeight: 36,
                    ),
                    padding: EdgeInsets.zero,
                  ),
                  Icon(
                    isUnlocked ? Icons.check_circle_outline : Icons.chevron_right,
                    color: isUnlocked
                        ? AppColors.secondary
                        : (isDark
                            ? AppColors.textSecondaryDark
                            : AppColors.textSecondary),
                  ),
                ],
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
