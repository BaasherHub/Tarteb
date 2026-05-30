import 'package:tarteb/core/supabase/supabase_client.dart';

abstract final class EmployerCreditsService {
  static Future<EmployerAccount> fetchAccount() async {
    final userId = TartebSupabase.auth.currentUser!.id;
    final data = await TartebSupabase.client
        .from('employers')
        .select('id, credits_balance, email')
        .eq('user_id', userId)
        .single();

    return EmployerAccount(
      id: data['id'] as String,
      creditsBalance: data['credits_balance'] as int? ?? 0,
      email: data['email'] as String? ?? '',
    );
  }

  static Future<int> fetchBalance() async {
    final account = await fetchAccount();
    return account.creditsBalance;
  }
}

class EmployerAccount {
  const EmployerAccount({
    required this.id,
    required this.creditsBalance,
    required this.email,
  });

  final String id;
  final int creditsBalance;
  final String email;
}
