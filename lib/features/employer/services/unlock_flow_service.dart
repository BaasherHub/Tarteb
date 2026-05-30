import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/employer/screens/buy_credits_screen.dart';
import 'package:tarteb/features/employer/screens/candidate_card_widget.dart';
import 'package:tarteb/features/auth/services/auth_contact.dart';
import 'package:tarteb/features/employer/services/employer_credits_service.dart';
import 'package:tarteb/features/employer/services/whatsapp_support_service.dart';

/// Handles unlock confirmation sheets and [unlock_candidate] RPC.
abstract final class UnlockFlowService {
  static Future<bool> handleUnlockTap(
    BuildContext context, {
    required Map<String, dynamic> candidate,
    required VoidCallback onUnlocked,
    required VoidCallback onCreditsChanged,
  }) async {
    if (candidate['phone'] != null) return false;

    final account = await EmployerCreditsService.fetchAccount();

    if (!context.mounted) return false;

    if (account.creditsBalance < 1) {
      await _showNoCreditsSheet(
        context,
        employerContact: AuthContact.supportIdentifier,
      );
      return false;
    }

    final firstName =
        CandidateCardWidget.firstName(candidate['name'] as String?);
    final confirmed = await _showConfirmSheet(
      context,
      firstName: firstName,
      creditsAfter: account.creditsBalance - 1,
    );

    if (confirmed != true || !context.mounted) return false;

    return _executeUnlock(
      context,
      candidateId: candidate['id'] as String,
      onUnlocked: onUnlocked,
      onCreditsChanged: onCreditsChanged,
    );
  }

  static Future<bool> _executeUnlock(
    BuildContext context, {
    required String candidateId,
    required VoidCallback onUnlocked,
    required VoidCallback onCreditsChanged,
  }) async {
    try {
      await TartebSupabase.client.rpc(
        'unlock_candidate',
        params: {'p_candidate_id': candidateId},
      );

      if (!context.mounted) return false;

      onUnlocked();
      onCreditsChanged();

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Contact unlocked! 🎉')),
      );
      return true;
    } catch (e) {
      if (!context.mounted) return false;

      final msg = e.toString();
      if (msg.contains('Insufficient credits')) {
        await Navigator.of(context).push<void>(
          MaterialPageRoute<void>(builder: (_) => const BuyCreditsScreen()),
        );
        onCreditsChanged();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(msg)),
        );
      }
      return false;
    }
  }

  static Future<bool?> _showConfirmSheet(
    BuildContext context, {
    required String firstName,
    required int creditsAfter,
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
              'Use 1 credit to unlock $firstName?',
              style: Theme.of(ctx).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
            ),
            const SizedBox(height: 12),
            Text(
              'Credits remaining after unlock: $creditsAfter',
              style: Theme.of(ctx).textTheme.bodyLarge,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: () => Navigator.of(ctx).pop(true),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.primary,
              ),
              child: const Text('Confirm'),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(false),
              child: const Text('Cancel'),
            ),
          ],
        ),
      ),
    );
  }

  static Future<void> _showNoCreditsSheet(
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
              'You have no credits remaining',
              style: Theme.of(ctx).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
            ),
            const SizedBox(height: 12),
            const Text('Contact us on WhatsApp to top up'),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: () {
                WhatsAppSupportService.openTopUp(
                  employerContact: employerContact,
                );
              },
              icon: const Icon(Icons.chat),
              label: const Text('WhatsApp'),
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.secondary,
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text('Cancel'),
            ),
          ],
        ),
      ),
    );
  }
}
