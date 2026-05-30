import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/utils/error_message.dart';
import 'package:tarteb/features/employer/models/browse_filters.dart';
import 'package:tarteb/features/employer/screens/buy_credits_screen.dart';
import 'package:tarteb/features/employer/screens/candidate_card_widget.dart';
import 'package:tarteb/features/employer/screens/filter_screen.dart';
import 'package:tarteb/features/employer/services/candidate_browse_repository.dart';
import 'package:tarteb/features/employer/services/employer_credits_service.dart';
import 'package:tarteb/features/shared/screens/settings_screen.dart';
import 'package:tarteb/features/shared/widgets/browse_skeleton_grid.dart';
import 'package:tarteb/features/shared/widgets/empty_state_widget.dart';
import 'package:tarteb/features/shared/widgets/error_widget.dart';

class BrowseScreen extends StatefulWidget {
  const BrowseScreen({super.key});

  @override
  BrowseScreenState createState() => BrowseScreenState();
}

class BrowseScreenState extends State<BrowseScreen> {
  final List<Map<String, dynamic>> _candidates = [];
  final ScrollController _scrollController = ScrollController();

  BrowseFilters _filters = BrowseFilters.empty;
  bool _initialLoading = true;
  bool _loadingMore = false;
  bool _hasMore = true;
  String? _error;
  int _page = 0;
  int _creditsBalance = 0;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    _loadCredits();
    _load(refresh: true);
  }

  Future<void> refreshCredits() => _loadCredits();

  Future<void> _loadCredits() async {
    try {
      final balance = await EmployerCreditsService.fetchBalance();
      if (mounted) setState(() => _creditsBalance = balance);
    } catch (_) {
      if (mounted) setState(() => _creditsBalance = 0);
    }
  }

  Future<void> _openBuyCredits() async {
    await Navigator.of(context).push<void>(
      MaterialPageRoute<void>(builder: (_) => const BuyCreditsScreen()),
    );
    await _loadCredits();
  }

  Future<void> _openSettings() async {
    await Navigator.of(context).push<bool>(
      MaterialPageRoute<bool>(
        builder: (_) => const SettingsScreen(isCandidate: false),
      ),
    );
  }

  void _onCandidateUnlocked() {
    _loadCredits();
    _load(refresh: true);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (!_scrollController.hasClients) return;
    final max = _scrollController.position.maxScrollExtent;
    final current = _scrollController.position.pixels;
    if (current >= max - 240 && !_loadingMore && _hasMore && !_initialLoading) {
      _load();
    }
  }

  Future<void> _load({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _initialLoading = true;
        _error = null;
        _page = 0;
        _hasMore = true;
        _candidates.clear();
      });
    } else {
      if (_loadingMore || !_hasMore) return;
      setState(() => _loadingMore = true);
    }

    try {
      final data = await CandidateBrowseRepository.fetchPage(
        filters: _filters,
        page: refresh ? 0 : _page,
      );

      if (!mounted) return;

      setState(() {
        if (refresh) {
          _candidates
            ..clear()
            ..addAll(data);
          _page = 1;
        } else {
          _candidates.addAll(data);
          _page++;
        }
        _hasMore = data.length >= CandidateBrowseRepository.pageSize;
        _error = null;
      });
    } catch (e) {
      if (mounted) setState(() => _error = ErrorMessage.from(e));
    } finally {
      if (mounted) {
        setState(() {
          _initialLoading = false;
          _loadingMore = false;
        });
      }
    }
  }

  Future<void> _openFilters() async {
    final result = await FilterBottomSheet.show(
      context,
      initialFilters: _filters,
    );
    if (result == null) return;
    setState(() => _filters = result);
    await _load(refresh: true);
  }

  void resetFilters() {
    setState(() => _filters = BrowseFilters.empty);
    _load(refresh: true);
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(
            title: Text(AppStrings.browseCandidates),
            actions: [
              Center(
                child: Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: InkWell(
                    onTap: _openBuyCredits,
                    borderRadius: BorderRadius.circular(8),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 6,
                      ),
                      child: Text(
                        AppStrings.creditsCount(_creditsBalance),
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              if (_filters.hasActiveFilters)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 4),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        AppStrings.filtered,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              IconButton(
                icon: const Icon(Icons.filter_list),
                onPressed: _openFilters,
              ),
              IconButton(
                icon: const Icon(Icons.settings_outlined),
                onPressed: _openSettings,
              ),
            ],
          ),
          body: _buildBody(),
        );
      },
    );
  }

  Widget _buildBody() {
    if (_initialLoading) return const BrowseSkeletonGrid();
    if (_error != null) {
      return TartebErrorWidget(
        message: _error!,
        onRetry: () => _load(refresh: true),
      );
    }
    if (_candidates.isEmpty) {
      return EmptyStateWidget(
        icon: Icons.person_search_outlined,
        title: AppStrings.noCandidatesMatchFilters,
        subtitle: AppStrings.tryAdjustingFilters,
        actionLabel: AppStrings.resetFilters,
        onAction: resetFilters,
      );
    }

    return RefreshIndicator(
      onRefresh: () => _load(refresh: true),
      child: CustomScrollView(
        controller: _scrollController,
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.all(12),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.46,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  return CandidateCardWidget(
                    candidate: _candidates[index],
                    onUnlocked: _onCandidateUnlocked,
                    onCreditsChanged: _loadCredits,
                  );
                },
                childCount: _candidates.length,
              ),
            ),
          ),
          if (_loadingMore)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Center(child: CircularProgressIndicator()),
              ),
            ),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }
}
