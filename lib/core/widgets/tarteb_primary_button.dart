import 'package:flutter/material.dart';

/// Primary action with inline loading (min 48dp height via theme).
class TartebPrimaryButton extends StatefulWidget {
  const TartebPrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
  });

  final String label;
  final Future<void> Function()? onPressed;
  final IconData? icon;

  @override
  State<TartebPrimaryButton> createState() => _TartebPrimaryButtonState();
}

class _TartebPrimaryButtonState extends State<TartebPrimaryButton> {
  bool _loading = false;

  Future<void> _handlePress() async {
    if (_loading || widget.onPressed == null) return;
    setState(() => _loading = true);
    try {
      await widget.onPressed!();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.icon != null) {
      return FilledButton.icon(
        onPressed: _loading ? null : _handlePress,
        icon: _loading
            ? const SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : Icon(widget.icon),
        label: Text(widget.label),
      );
    }

    return FilledButton(
      onPressed: _loading ? null : _handlePress,
      child: _loading
          ? const SizedBox(
              width: 22,
              height: 22,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Text(widget.label),
    );
  }
}
