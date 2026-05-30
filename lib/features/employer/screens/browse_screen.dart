import 'package:flutter/material.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/employer/screens/buy_credits_screen.dart';
import 'package:tarteb/features/employer/screens/candidate_card_widget.dart';
import 'package:tarteb/features/employer/screens/filter_screen.dart';
import 'package:tarteb/features/employer/screens/my_unlocks_screen.dart';
import 'package:tarteb/features/shared/widgets/error_widget.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class BrowseScreen extends StatefulWidget {
  const BrowseScreen({super.key});

  @override
  State<BrowseScreen> createState() => _BrowseScreenState();
}

class _BrowseScreenState extends State<BrowseScreen> {
  List<Map<String, dynamic>> _candidates = [];
  bool _loading = true;
  String? _error;
  String? _filterRole;
  String? _filterLocation;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      var query = TartebSupabase.client.from('candidate_browse').select();
      if (_filterRole != null) query = query.eq('role', _filterRole!);
      if (_filterLocation != null) {
        query = query.eq('location', _filterLocation!);
      }
      final data = await query.order('created_at', ascending: false);
      setState(() => _candidates = List<Map<String, dynamic>>.from(data));
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _openFilters() async {
    final result = await Navigator.of(context).push<Map<String, String?>>(
      MaterialPageRoute(
        builder: (_) => FilterScreen(
          initialRole: _filterRole,
          initialLocation: _filterLocation,
        ),
      ),
    );
    if (result != null) {
      setState(() {
        _filterRole = result['role'];
        _filterLocation = result['location'];
      });
      _load();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Browse candidates'),
        actions: [
          IconButton(icon: const Icon(Icons.filter_list), onPressed: _openFilters),
          IconButton(
            icon: const Icon(Icons.lock_open),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute<void>(builder: (_) => const MyUnlocksScreen()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.account_balance_wallet),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute<void>(builder: (_) => const BuyCreditsScreen()),
              );
            },
          ),
        ],
      ),
      body: _loading
          ? const LoadingWidget()
          : _error != null
              ? TartebErrorWidget(message: _error!, onRetry: _load)
              : _candidates.isEmpty
                  ? const Center(child: Text('No candidates match your filters'))
                  : RefreshIndicator(
                      onRefresh: _load,
                      child: ListView.builder(
                        itemCount: _candidates.length,
                        itemBuilder: (context, index) {
                          return CandidateCardWidget(
                            candidate: _candidates[index],
                          );
                        },
                      ),
                    ),
    );
  }
}
