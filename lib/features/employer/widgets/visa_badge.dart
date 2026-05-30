import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';

class VisaBadge extends StatelessWidget {
  const VisaBadge({super.key, required this.visaStatus});

  final String visaStatus;

  @override
  Widget build(BuildContext context) {
    final color = AppColors.visaBadgeColor(visaStatus);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Text(
        visaStatus,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: color,
        ),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
    );
  }
}
