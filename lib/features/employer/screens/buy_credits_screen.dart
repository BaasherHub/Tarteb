import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/employer/services/employer_credits_service.dart';
import 'package:tarteb/features/employer/services/whatsapp_support_service.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

/// Manual credit purchase — contact WhatsApp (no payment gateway yet).
class BuyCreditsScreen extends StatefulWidget {
  const BuyCreditsScreen({super.key});

  @override
  State<BuyCreditsScreen> createState() => _BuyCreditsScreenState();
}

class _BuyCreditsScreenState extends State<BuyCreditsScreen> {
  int _balance = 0;
  String _email = '';
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final account = await EmployerCreditsService.fetchAccount();
      setState(() {
        _balance = account.creditsBalance;
        _email = account.email;
      });
    } catch (_) {
      setState(() {
        _balance = 0;
        _email = '';
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Buy credits')),
      body: _loading
          ? const LoadingWidget()
          : RefreshIndicator(
              onRefresh: _load,
              child: ListView(
                padding: const EdgeInsets.all(24),
                children: [
                  Text(
                    'Current balance: $_balance credits',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                  const SizedBox(height: 24),
                  const _CreditPackageCard(
                    credits: 1,
                    priceAed: 50,
                  ),
                  const SizedBox(height: 12),
                  const _CreditPackageCard(
                    credits: 5,
                    priceAed: 200,
                    savings: 'Save AED 50',
                  ),
                  const SizedBox(height: 12),
                  const _CreditPackageCard(
                    credits: 10,
                    priceAed: 350,
                    savings: 'Save AED 150',
                  ),
                  const SizedBox(height: 32),
                  Text(
                    'To purchase credits, contact us on WhatsApp',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    onPressed: _email.isEmpty
                        ? null
                        : () => WhatsAppSupportService.openBuyCredits(
                              employerEmail: _email,
                            ),
                    icon: const Icon(Icons.chat, size: 28),
                    label: const Text(
                      'Contact on WhatsApp',
                      style: TextStyle(fontSize: 16),
                    ),
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.secondary,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Credits are added manually within 1 hour',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.textSecondary,
                        ),
                  ),
                ],
              ),
            ),
    );
  }
}

class _CreditPackageCard extends StatelessWidget {
  const _CreditPackageCard({
    required this.credits,
    required this.priceAed,
    this.savings,
  });

  final int credits;
  final int priceAed;
  final String? savings;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppColors.divider),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '$credits credit${credits > 1 ? 's' : ''}',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text('AED $priceAed'),
                  if (savings != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      savings!,
                      style: const TextStyle(
                        color: AppColors.secondary,
                        fontWeight: FontWeight.w500,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.textSecondary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'Coming soon',
                style: Theme.of(context).textTheme.labelSmall,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
