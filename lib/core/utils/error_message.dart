import 'package:tarteb/core/constants/app_strings.dart';

abstract final class ErrorMessage {
  static String from(Object error) {
    final text = error.toString().toLowerCase();
    if (text.contains('socket') ||
        text.contains('network') ||
        text.contains('connection') ||
        text.contains('failed host lookup') ||
        text.contains('offline')) {
      return AppStrings.noInternet;
    }
    return AppStrings.somethingWentWrong;
  }
}
