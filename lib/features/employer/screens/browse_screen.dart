import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/features/employer/models/browse_filters.dart';
import 'package:tarteb/features/employer/screens/buy_credits_screen.dart';
import 'package:tarteb/features/employer/screens/candidate_card_widget.dart';
import 'package:tarteb/features/employer/screens/filter_screen.dart';
import 'package:tarteb/features/employer/services/candidate_browse_repository.dart';
import 'package:tarteb/features/employer/services/employer_credits_service.dart';
import 'package:tarteb/features/shared/widgets/error_widget.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

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
      if (mounted) setState(() => _error = e.toString());
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Browse candidates'),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 8),
              child: InkWell(
                onTap: _openBuyCredits,
                borderRadius: BorderRadius.circular(8),
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  child: Text(
                    'Credits: $_creditsBalance',
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
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'Filtered',
                    style: TextStyle(
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
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_initialLoading) return const LoadingWidget();
    if (_error != null) {
      return TartebErrorWidget(message: _error!, onRetry: () => _load(refresh: true));
    }
    if (_candidates.isEmpty) {
      return _EmptyBrowseState(onReset: resetFilters);
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
                childAspectRatio: 0.52,
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

class _EmptyBrowseState extends StatelessWidget {
  const _EmptyBrowseState({required this.onReset});

  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.person_search_outlined,
              size: 64,
              color: AppColors.textSecondary.withValues(alpha: 0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'No candidates found',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Try adjusting your filters or check back later.',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: onReset,
              icon: const Icon(Icons.refresh),
              label: const Text('Reset filters'),
            ),
          ],
        ),
      ),
    );
  }
}
