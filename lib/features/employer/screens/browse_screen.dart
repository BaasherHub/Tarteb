import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/core/utils/error_message.dart';
import 'package:tarteb/features/employer/models/browse_filters.dart';
import 'package:tarteb/features/employer/screens/buy_credits_screen.dart';
import 'package:tarteb/features/employer/screens/candidate_detail_screen.dart';
import 'package:tarteb/features/employer/screens/filter_screen.dart';
import 'package:tarteb/features/employer/services/candidate_browse_repository.dart';
import 'package:tarteb/features/employer/services/employer_credits_service.dart';
import 'package:tarteb/features/employer/widgets/candidate_list_tile.dart';
import 'package:tarteb/features/shared/screens/settings_screen.dart';
import 'package:tarteb/features/shared/widgets/browse_skeleton_list.dart';
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

  Future<void> _openDetail(Map<String, dynamic> candidate) async {
    final refreshed = await Navigator.of(context).push<bool>(
      MaterialPageRoute<bool>(
        builder: (_) => CandidateDetailScreen(
          candidate: candidate,
          onUnlocked: _onCandidateUnlocked,
          onCreditsChanged: _loadCredits,
        ),
      ),
    );
    if (refreshed == true) {
      await _load(refresh: true);
    }
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
            title: Text(AppStrings.browse),
            actions: [
              Padding(
                padding: const EdgeInsets.only(right: 4),
                child: _CreditsPill(
                  balance: _creditsBalance,
                  onTap: _openBuyCredits,
                ),
              ),
              if (_filters.hasActiveFilters)
                Padding(
                  padding: const EdgeInsets.only(right: 4),
                  child: Center(
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
                          fontSize: 11,
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
          body: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 560),
              child: _buildBody(),
            ),
          ),
        );
      },
    );
  }

  Widget _buildBody() {
    if (_initialLoading) return const BrowseSkeletonList();
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
      child: ListView.separated(
        controller: _scrollController,
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: _candidates.length + (_loadingMore ? 1 : 0),
        separatorBuilder: (_, _) => const Divider(height: 1, indent: 84),
        itemBuilder: (context, index) {
          if (index >= _candidates.length) {
            return const Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: CircularProgressIndicator()),
            );
          }
          final candidate = _candidates[index];
          return CandidateListTile(
            candidate: candidate,
            onTap: () => _openDetail(candidate),
          );
        },
      ),
    );
  }
}

class _CreditsPill extends StatelessWidget {
  const _CreditsPill({required this.balance, required this.onTap});

  final int balance;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.primary.withValues(alpha: 0.1),
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.md,
            vertical: AppSpacing.sm,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.account_balance_wallet_outlined,
                  size: 18, color: AppColors.primary),
              const SizedBox(width: 6),
              Text(
                '$balance',
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
