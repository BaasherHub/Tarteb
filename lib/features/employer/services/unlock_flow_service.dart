import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/employer/screens/candidate_card_widget.dart';
import 'package:tarteb/features/employer/screens/subscription_screen.dart';
import 'package:tarteb/features/auth/services/auth_contact.dart';
import 'package:tarteb/features/employer/services/employer_subscription_service.dart';
import 'package:tarteb/features/employer/services/whatsapp_support_service.dart';

/// Handles unlock confirmation and [unlock_candidate] RPC (subscription-gated).
abstract final class UnlockFlowService {
  static Future<bool> handleUnlockTap(
    BuildContext context, {
    required Map<String, dynamic> candidate,
    required VoidCallback onUnlocked,
    VoidCallback? onSubscriptionChanged,
  }) async {
    if (candidate['phone'] != null) return false;

    final account = await EmployerSubscriptionService.fetchAccount();

    if (!context.mounted) return false;

    if (!account.hasActiveSubscription) {
      await _showNoSubscriptionSheet(
        context,
        employerContact: AuthContact.supportIdentifier,
      );
      return false;
    }

    final firstName =
        CandidateCardWidget.firstName(candidate['name'] as String?);
    final confirmed = await _showConfirmSheet(context, firstName: firstName);

    if (confirmed != true || !context.mounted) return false;

    return _executeUnlock(
      context,
      candidateId: candidate['id'] as String,
      onUnlocked: onUnlocked,
      onSubscriptionChanged: onSubscriptionChanged,
    );
  }

  static Future<bool> _executeUnlock(
    BuildContext context, {
    required String candidateId,
    required VoidCallback onUnlocked,
    VoidCallback? onSubscriptionChanged,
  }) async {
    try {
      await TartebSupabase.client.rpc(
        'unlock_candidate',
        params: {'p_candidate_id': candidateId},
      );

      if (!context.mounted) return false;

      onUnlocked();
      onSubscriptionChanged?.call();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppStrings.contactUnlocked)),
      );
      return true;
    } catch (e) {
      if (!context.mounted) return false;

      if (e is PostgrestException && e.code == 'P0001') {
        await Navigator.of(context).push<void>(
          MaterialPageRoute<void>(builder: (_) => const SubscriptionScreen()),
        );
        onSubscriptionChanged?.call();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
      return false;
    }
  }

  static Future<bool?> _showConfirmSheet(
    BuildContext context, {
    required String firstName,
  }) {
    return showModalBottomSheet<bool>(
      context: context,
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              AppStrings.confirmUnlockContact(firstName),
              style: Theme.of(ctx).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
            ),
            const SizedBox(height: 12),
            Text(
              AppStrings.includedInYourPlan,
              style: Theme.of(ctx).textTheme.bodyLarge,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: () => Navigator.of(ctx).pop(true),
              child: Text(AppStrings.confirm),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(false),
              child: Text(AppStrings.cancel),
            ),
          ],
        ),
      ),
    );
  }

  static Future<void> _showNoSubscriptionSheet(
    BuildContext context, {
    required String employerContact,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      builder: (ctx) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              AppStrings.subscriptionRequired,
              style: Theme.of(ctx).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
            ),
            const SizedBox(height: 12),
            Text(
              '${AppStrings.subscriptionPriceLabel} — ${AppStrings.contactUsToSubscribe}',
            ),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: () {
                WhatsAppSupportService.openSubscribe(
                  employerContact: employerContact,
                );
              },
              icon: const Icon(Icons.chat),
              label: Text(AppStrings.subscribeViaWhatsApp),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: Text(AppStrings.cancel),
            ),
          ],
        ),
      ),
    );
  }
}
