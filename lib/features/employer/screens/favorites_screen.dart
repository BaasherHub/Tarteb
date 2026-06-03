import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/features/employer/screens/candidate_detail_screen.dart';
import 'package:tarteb/features/employer/services/favorites_service.dart';
import 'package:tarteb/features/employer/widgets/visa_badge.dart';
import 'package:tarteb/features/shared/widgets/empty_state_widget.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key, this.onBrowseTap});

  final VoidCallback? onBrowseTap;

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  List<Map<String, dynamic>> _favorites = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    final data = await FavoritesService.instance.fetchFavorites();
    if (mounted) {
      setState(() {
        _favorites = data;
        _loading = false;
      });
    }
  }

  Future<void> _removeFavorite(String candidateId) async {
    await FavoritesService.instance.remove(candidateId);
    await _load();
  }

  Future<void> _openDetail(Map<String, dynamic> candidate) async {
    await Navigator.of(context).push<void>(
      MaterialPageRoute<void>(
        builder: (_) => CandidateDetailScreen(
          candidate: candidate,
          onUnlocked: _load,
          onSubscriptionChanged: () {},
        ),
      ),
    );
    await _load();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(title: Text(AppStrings.favorites)),
          body: _buildBody(isDark),
        );
      },
    );
  }

  Widget _buildBody(bool isDark) {
    if (_loading) return const LoadingWidget();
    
    if (_favorites.isEmpty) {
      return EmptyStateWidget(
        icon: Icons.favorite_border,
        title: AppStrings.noFavoritesYet,
        subtitle: AppStrings.noFavoritesSubtitle,
        actionLabel: AppStrings.browseCandidates,
        onAction: widget.onBrowseTap,
      );
    }

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _favorites.length,
        separatorBuilder: (_, _) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final favorite = _favorites[index];
          final candidate = favorite['candidates'] as Map<String, dynamic>?;
          if (candidate == null) return const SizedBox.shrink();

          return _FavoriteCard(
            candidate: candidate,
            onTap: () => _openDetail(candidate),
            onRemove: () => _removeFavorite(candidate['id'].toString()),
            isDark: isDark,
          );
        },
      ),
    );
  }
}

class _FavoriteCard extends StatelessWidget {
  const _FavoriteCard({
    required this.candidate,
    required this.onTap,
    required this.onRemove,
    required this.isDark,
  });

  final Map<String, dynamic> candidate;
  final VoidCallback onTap;
  final VoidCallback onRemove;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    final role = candidate['role'] as String? ?? '';
    final visa = candidate['visa_status'] as String? ?? '';
    final location = candidate['location'] as String? ?? '';
    final salary = candidate['salary_expectation'];
    final photoUrl = candidate['photo_url'] as String?;

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: isDark ? AppColors.dividerDark : AppColors.divider,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.md),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: SizedBox(
                  width: 64,
                  height: 64,
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
                          color: isDark
                              ? AppColors.textSecondaryDark
                              : AppColors.textSecondary,
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
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.favorite, color: Colors.red),
                onPressed: onRemove,
                tooltip: AppStrings.removeFromFavorites,
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
