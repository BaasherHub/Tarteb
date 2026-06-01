import 'package:tarteb/features/employer/services/employer_subscription_service.dart';

/// @deprecated Credits replaced by monthly subscription. Use [EmployerSubscriptionService].
abstract final class EmployerCreditsService {
  static Future<EmployerAccount> fetchAccount() =>
      EmployerSubscriptionService.fetchAccount();

  static Future<int> fetchBalance() async {
    final account = await fetchAccount();
    return account.hasActiveSubscription ? 1 : 0;
  }
}
