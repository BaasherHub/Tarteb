import 'package:tarteb/core/constants/app_strings.dart';
import 'package:url_launcher/url_launcher.dart';

abstract final class WhatsAppSupportService {
  static String get _digits =>
      AppStrings.supportWhatsApp.replaceAll(RegExp(r'\D'), '');

  static Future<void> openBuyCredits({required String employerContact}) async {
    final message =
        'Hi, I want to buy credits for Tarteb.\nMy number: $employerContact';
    await _open(message);
  }

  static Future<void> openSupport() async {
    await _open('Hi, I need support with Tarteb.');
  }

  static Future<void> openTopUp({required String employerContact}) async {
    final message =
        'Hi, I need to top up credits on Tarteb.\nMy number: $employerContact';
    await _open(message);
  }

  static Future<void> _open(String message) async {
    final uri = Uri.parse(
      'https://wa.me/$_digits?text=${Uri.encodeComponent(message)}',
    );
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}
