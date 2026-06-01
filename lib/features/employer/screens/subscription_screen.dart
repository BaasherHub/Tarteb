import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/core/widgets/tarteb_card.dart';
import 'package:tarteb/core/widgets/tarteb_primary_button.dart';
import 'package:tarteb/features/auth/services/auth_contact.dart';
import 'package:tarteb/features/employer/services/employer_subscription_service.dart';
import 'package:tarteb/features/employer/services/whatsapp_support_service.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

/// @deprecated Use [SubscriptionScreen]. Kept for existing navigation imports.
typedef BuyCreditsScreen = SubscriptionScreen;

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  EmployerAccount? _account;
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
      final account = await EmployerSubscriptionService.fetchAccount();
      setState(() {
        _account = account;
        _contact = AuthContact.supportIdentifier;
      });
    } catch (_) {
      setState(() {
        _account = null;
        _contact = AuthContact.supportIdentifier;
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  String? _formatEndsAt(DateTime? endsAt) {
    if (endsAt == null) return null;
    return '${endsAt.day}/${endsAt.month}/${endsAt.year}';
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        final account = _account;
        final isActive = account?.hasActiveSubscription ?? false;
        final endsLabel = _formatEndsAt(account?.subscriptionEndsAt);

        return Scaffold(
          appBar: AppBar(title: Text(AppStrings.subscription)),
          body: _loading
              ? const LoadingWidget()
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.all(AppSpacing.xl),
                    children: [
                      Text(
                        AppStrings.subscriptionPriceLabel,
                        style: Theme.of(context)
                            .textTheme
                            .headlineSmall
                            ?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: AppSpacing.sm),
                      Text(
                        isActive && endsLabel != null
                            ? AppStrings.subscriptionValidUntil(endsLabel)
                            : AppStrings.noActiveSubscription,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: isActive
                                  ? AppColors.secondary
                                  : AppColors.textSecondary,
                            ),
                      ),
                      const SizedBox(height: AppSpacing.xl),
                      TartebCard(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              AppStrings.subscribeTitle,
                              style: Theme.of(context)
                                  .textTheme
                                  .titleLarge
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: AppSpacing.md),
                            Text(AppStrings.subscriptionBenefit),
                            const SizedBox(height: AppSpacing.lg),
                            if (!isActive) ...[
                              Text(AppStrings.subscribeSteps),
                              const SizedBox(height: AppSpacing.xl),
                              TartebPrimaryButton(
                                label: AppStrings.subscribeViaWhatsApp,
                                icon: Icons.chat,
                                onPressed: _contact.isEmpty
                                    ? null
                                    : () =>
                                        WhatsAppSupportService.openSubscribe(
                                          employerContact: _contact,
                                        ),
                              ),
                            ] else
                              Row(
                                children: [
                                  Icon(
                                    Icons.check_circle,
                                    color: AppColors.secondary,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      AppStrings.planActive,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            const SizedBox(height: AppSpacing.md),
                            Text(
                              AppStrings.subscriptionActivatedManually,
                              textAlign: TextAlign.center,
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
        );
      },
    );
  }
}
