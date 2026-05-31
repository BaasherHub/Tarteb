import 'package:flutter/material.dart';
import 'package:tarteb/core/utils/error_message.dart';

abstract final class TartebSnackbar {
  static void show(BuildContext context, String message) {
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  static void showError(BuildContext context, Object error) {
    show(context, ErrorMessage.from(error));
  }

  static void showSuccess(BuildContext context, String message) {
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green.shade700,
      ),
    );
  }
}
