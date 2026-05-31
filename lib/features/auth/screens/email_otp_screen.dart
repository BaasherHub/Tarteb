import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/core/widgets/tarteb_primary_button.dart';
import 'package:tarteb/core/widgets/tarteb_snackbar.dart';
import 'package:tarteb/core/widgets/tarteb_text_field.dart';
import 'package:tarteb/features/auth/services/auth_navigation.dart';
import 'package:tarteb/features/auth/widgets/auth_shell.dart';

class EmailOtpScreen extends StatefulWidget {
  const EmailOtpScreen({super.key});

  @override
  State<EmailOtpScreen> createState() => _EmailOtpScreenState();
}

class _EmailOtpScreenState extends State<EmailOtpScreen> {
  final _emailController = TextEditingController();
  final _otpController = TextEditingController();
  bool _otpSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    final email = _emailController.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      TartebSnackbar.show(context, 'Enter a valid email address');
      return;
    }

    try {
      await TartebSupabase.auth.signInWithOtp(
        email: email,
        shouldCreateUser: true,
      );
      if (mounted) setState(() => _otpSent = true);
    } catch (e) {
      if (mounted) TartebSnackbar.showError(context, e);
    }
  }

  Future<void> _verifyOtp() async {
    try {
      final email = _emailController.text.trim();
      final token = _otpController.text.trim();
      await TartebSupabase.auth.verifyOTP(
        type: OtpType.email,
        token: token,
        email: email,
      );

      if (!mounted) return;
      await AuthNavigation.routeAuthenticatedUser(context);
    } catch (e) {
      if (mounted) TartebSnackbar.showError(context, e);
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return AuthShell(
          showOtpSection: _otpSent,
          otpSection: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TartebTextField(
                controller: _otpController,
                label: AppStrings.otpCode,
                hint: '000000',
                prefixIcon: Icons.lock_outline,
                keyboardType: TextInputType.number,
                maxLength: 6,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: AppSpacing.lg),
              TartebPrimaryButton(
                label: AppStrings.verify,
                onPressed: _verifyOtp,
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (!_otpSent) ...[
                Text(
                  AppStrings.signInWithEmail,
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: AppSpacing.lg),
                TartebTextField(
                  controller: _emailController,
                  label: AppStrings.enterEmail,
                  hint: 'you@example.com',
                  prefixIcon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: AppSpacing.xl),
                TartebPrimaryButton(
                  label: AppStrings.sendOtp,
                  onPressed: _sendOtp,
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
