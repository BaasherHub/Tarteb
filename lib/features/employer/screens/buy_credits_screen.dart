import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/core/widgets/tarteb_card.dart';
import 'package:tarteb/core/widgets/tarteb_primary_button.dart';
import 'package:tarteb/features/auth/services/auth_contact.dart';
import 'package:tarteb/features/employer/services/employer_credits_service.dart';
import 'package:tarteb/features/employer/services/whatsapp_support_service.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class BuyCreditsScreen extends StatefulWidget {
  const BuyCreditsScreen({super.key});

  @override
  State<BuyCreditsScreen> createState() => _BuyCreditsScreenState();
}

class _BuyCreditsScreenState extends State<BuyCreditsScreen> {
  int _balance = 0;
  String _contact = '';
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
        _contact = AuthContact.supportIdentifier;
      });
    } catch (_) {
      setState(() {
        _balance = 0;
        _contact = AuthContact.supportIdentifier;
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(title: Text(AppStrings.buyCredits)),
          body: _loading
              ? const LoadingWidget()
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.all(AppSpacing.xl),
                    children: [
                      Text(
                        AppStrings.creditsCount(_balance),
                        style:
                            Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                      ),
                      const SizedBox(height: AppSpacing.xl),
                      TartebCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              AppStrings.buyCreditsViaWhatsApp,
                              style: Theme.of(context)
                                  .textTheme
                                  .titleLarge
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: AppSpacing.md),
                            Text(
                              AppStrings.buyCreditsSteps,
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            const SizedBox(height: AppSpacing.xl),
                            TartebPrimaryButton(
                              label: AppStrings.contactUsOnWhatsApp,
                              icon: Icons.chat,
                              onPressed: _contact.isEmpty
                                  ? null
                                  : () => WhatsAppSupportService.openBuyCredits(
                                        employerContact: _contact,
                                      ),
                            ),
                            const SizedBox(height: AppSpacing.md),
                            Text(
                              AppStrings.creditsAddedManually,
                              textAlign: TextAlign.center,
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xxl),
                      Text(
                        AppStrings.referencePricing,
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                              color: AppColors.textSecondary,
                            ),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      const _ReferencePriceRow(credits: 1, priceAed: 50),
                      const _ReferencePriceRow(credits: 5, priceAed: 200),
                      const _ReferencePriceRow(credits: 10, priceAed: 350),
                    ],
                  ),
                ),
        );
      },
    );
  }
}

class _ReferencePriceRow extends StatelessWidget {
  const _ReferencePriceRow({
    required this.credits,
    required this.priceAed,
  });

  final int credits;
  final int priceAed;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: Row(
        children: [
          Text(
            '$credits ${AppStrings.credits.toLowerCase()}',
            style: Theme.of(context).textTheme.bodyMedium,
          ),
          const Spacer(),
          Text(
            'AED $priceAed',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.textSecondary,
                ),
          ),
        ],
      ),
    );
  }
}
