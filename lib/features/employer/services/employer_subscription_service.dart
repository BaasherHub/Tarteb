import 'package:tarteb/core/supabase/supabase_client.dart';

abstract final class EmployerSubscriptionService {
  static Future<EmployerAccount> fetchAccount() async {
    final userId = TartebSupabase.auth.currentUser!.id;
    final data = await TartebSupabase.client
        .from('employers')
        .select('id, credits_balance, email, subscription_ends_at')
        .eq('user_id', userId)
        .single();

    final endsAtRaw = data['subscription_ends_at'];
    final endsAt = endsAtRaw != null
        ? DateTime.tryParse(endsAtRaw.toString())
        : null;

    return EmployerAccount(
      id: data['id'] as String,
      email: data['email'] as String? ?? '',
      creditsBalance: data['credits_balance'] as int? ?? 0,
      subscriptionEndsAt: endsAt,
    );
  }

  static Future<bool> hasActiveSubscription() async {
    final account = await fetchAccount();
    return account.hasActiveSubscription;
  }
}

class EmployerAccount {
  const EmployerAccount({
    required this.id,
    required this.email,
    required this.creditsBalance,
    this.subscriptionEndsAt,
  });

  final String id;
  final String email;
  final int creditsBalance;
  final DateTime? subscriptionEndsAt;

  bool get hasActiveSubscription {
    final ends = subscriptionEndsAt;
    if (ends == null) return false;
    return ends.isAfter(DateTime.now());
  }
}
