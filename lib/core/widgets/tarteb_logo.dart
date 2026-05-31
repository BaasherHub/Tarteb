import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_colors.dart';

class TartebLogo extends StatelessWidget {
  const TartebLogo({
    super.key,
    this.size = 72,
    this.tint,
  });

  final double size;
  final Color? tint;

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(size * 0.22),
      child: Image.asset(
        'assets/icon/app_icon.png',
        width: size,
        height: size,
        errorBuilder: (_, _, _) => Icon(
          Icons.work_rounded,
          size: size,
          color: tint ?? AppColors.primary,
        ),
      ),
    );
  }
}
