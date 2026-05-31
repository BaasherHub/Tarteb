import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/theme/app_spacing.dart';

class BrowseSkeletonList extends StatelessWidget {
  const BrowseSkeletonList({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: AppColors.divider,
      highlightColor: Colors.white,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
        physics: const NeverScrollableScrollPhysics(),
        itemCount: 8,
        separatorBuilder: (_, _) => const Divider(height: 1),
        itemBuilder: (_, _) => Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.md,
          ),
          child: Row(
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: AppColors.divider,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      height: 16,
                      width: 140,
                      color: AppColors.divider,
                    ),
                    const SizedBox(height: 8),
                    Container(
                      height: 12,
                      width: 100,
                      color: AppColors.divider,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
