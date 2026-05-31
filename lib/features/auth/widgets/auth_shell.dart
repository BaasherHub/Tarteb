import 'package:flutter/material.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/core/widgets/tarteb_card.dart';
import 'package:tarteb/core/widgets/tarteb_logo.dart';

/// Shared layout for phone and email auth.
class AuthShell extends StatelessWidget {
  const AuthShell({
    super.key,
    required this.child,
    this.footer,
    this.showOtpSection = false,
    this.otpSection,
  });

  final Widget child;
  final Widget? footer;
  final bool showOtpSection;
  final Widget? otpSection;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 440),
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.xl,
                vertical: AppSpacing.xxl,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Center(child: TartebLogo(size: 80)),
                  const SizedBox(height: AppSpacing.xl),
                  Text(
                    AppStrings.welcomeToTarteb,
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    AppStrings.splashTagline,
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  AnimatedSwitcher(
                    duration: const Duration(milliseconds: 280),
                    switchInCurve: Curves.easeOut,
                    switchOutCurve: Curves.easeIn,
                    child: showOtpSection && otpSection != null
                        ? Column(
                            key: const ValueKey('otp'),
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              TartebCard(child: otpSection!),
                              const SizedBox(height: AppSpacing.lg),
                            ],
                          )
                        : const SizedBox.shrink(key: ValueKey('no-otp')),
                  ),
                  TartebCard(child: child),
                  if (footer != null) ...[
                    const SizedBox(height: AppSpacing.xl),
                    footer!,
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
