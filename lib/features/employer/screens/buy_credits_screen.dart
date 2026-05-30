import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

/// Credits purchased via Stripe (integrate later).
/// 1 credit = 1 unlock = AED 50.
class BuyCreditsScreen extends StatefulWidget {
  const BuyCreditsScreen({super.key});

  @override
  State<BuyCreditsScreen> createState() => _BuyCreditsScreenState();
}

class _BuyCreditsScreenState extends State<BuyCreditsScreen> {
  int _balance = 0;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadBalance();
  }

  Future<void> _loadBalance() async {
    setState(() => _loading = true);
    try {
      final userId = TartebSupabase.auth.currentUser!.id;
      final data = await TartebSupabase.client
          .from('employers')
          .select('credits_balance')
          .eq('user_id', userId)
          .single();
      setState(() => _balance = data['credits_balance'] as int? ?? 0);
    } catch (_) {
      setState(() => _balance = 0);
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Buy credits')),
      body: _loading
          ? const LoadingWidget()
          : Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Balance: $_balance credits',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Each credit unlocks one candidate (AED ${AppStrings.unlockCostAed}).',
                  ),
                  const SizedBox(height: 32),
                  _CreditPack(
                    credits: 1,
                    priceAed: 50,
                    onBuy: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Stripe integration coming soon'),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                  _CreditPack(
                    credits: 5,
                    priceAed: 225,
                    onBuy: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Stripe integration coming soon'),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 12),
                  _CreditPack(
                    credits: 10,
                    priceAed: 400,
                    onBuy: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Stripe integration coming soon'),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
    );
  }
}

class _CreditPack extends StatelessWidget {
  const _CreditPack({
    required this.credits,
    required this.priceAed,
    required this.onBuy,
  });

  final int credits;
  final int priceAed;
  final VoidCallback onBuy;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text('$credits credit${credits > 1 ? 's' : ''}'),
        subtitle: Text('AED $priceAed'),
        trailing: FilledButton(onPressed: onBuy, child: const Text('Buy')),
      ),
    );
  }
}
