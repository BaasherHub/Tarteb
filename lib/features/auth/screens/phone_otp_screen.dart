import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/services/twilio_verify_service.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/core/widgets/tarteb_phone_field.dart';
import 'package:tarteb/core/widgets/tarteb_primary_button.dart';
import 'package:tarteb/core/widgets/tarteb_snackbar.dart';
import 'package:tarteb/core/widgets/tarteb_text_field.dart';
import 'package:tarteb/features/auth/constants/phone_countries.dart';
import 'package:tarteb/features/auth/screens/email_otp_screen.dart';
import 'package:tarteb/features/auth/services/auth_navigation.dart';
import 'package:tarteb/features/auth/widgets/auth_shell.dart';

class PhoneOtpScreen extends StatefulWidget {
  const PhoneOtpScreen({super.key});

  @override
  State<PhoneOtpScreen> createState() => _PhoneOtpScreenState();
}

class _PhoneOtpScreenState extends State<PhoneOtpScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  PhoneCountry _country = PhoneCountries.defaultCountry;
  bool _otpSent = false;
  String? _e164Phone;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  String _buildE164Phone() {
    final local = _phoneController.text.replaceAll(RegExp(r'\s'), '');
    final e164 = PhoneCountries.toE164(_country, local);
    return TwilioVerifyService.normalizeE164(e164);
  }

  Future<void> _sendOtp() async {
    final local = _phoneController.text.replaceAll(RegExp(r'\s'), '');
    if (local.isEmpty) {
      TartebSnackbar.show(context, AppStrings.enterPhone);
      return;
    }

    final phone = _buildE164Phone();
    if (phone.length < 11 || !phone.startsWith('+')) {
      TartebSnackbar.show(context, 'Enter a valid phone number');
      return;
    }

    try {
      await TwilioVerifyService.sendOTP(phone);
      if (!mounted) return;
      setState(() {
        _otpSent = true;
        _e164Phone = phone;
      });
    } catch (e) {
      if (mounted) TartebSnackbar.showError(context, e);
    }
  }

  Future<void> _verifyOtp() async {
    final phone = _e164Phone != null
        ? TwilioVerifyService.normalizeE164(_e164Phone!)
        : _buildE164Phone();
    final token = _otpController.text.trim();
    if (phone.isEmpty || token.length != 6) {
      TartebSnackbar.show(context, 'Enter the 6-digit code');
      return;
    }

    try {
      final approved = await TwilioVerifyService.verifyOTP(phone, token);
      if (!approved) {
        if (mounted) TartebSnackbar.show(context, 'Invalid or expired code');
        return;
      }

      await TwilioVerifyService.signInWithVerifiedPhone(phone);

      if (!mounted) return;
      TartebSnackbar.show(context, AppStrings.phoneSavedNote);
      await AuthNavigation.routeAuthenticatedUser(context);
    } catch (e) {
      if (mounted) TartebSnackbar.showError(context, e);
    }
  }

  void _openEmailAuth() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => const EmailOtpScreen()),
    );
  }

  void _resetPhone() {
    setState(() {
      _otpSent = false;
      _e164Phone = null;
      _otpController.clear();
    });
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
              Text(
                '${AppStrings.codeSentTo} $_e164Phone',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: AppSpacing.lg),
              TartebTextField(
                controller: _otpController,
                label: AppStrings.otpCode,
                hint: '000000',
                prefixIcon: Icons.lock_outline,
                keyboardType: TextInputType.number,
                maxLength: 6,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 22, letterSpacing: 8),
              ),
              const SizedBox(height: AppSpacing.lg),
              TartebPrimaryButton(
                label: AppStrings.verify,
                onPressed: _verifyOtp,
              ),
              TextButton(
                onPressed: _resetPhone,
                child: Text(AppStrings.changePhoneNumber),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (!_otpSent) ...[
                Text(
                  AppStrings.otpHelper,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: AppSpacing.lg),
                TartebPhoneField(
                  country: _country,
                  controller: _phoneController,
                  onCountryChanged: (c) => setState(() => _country = c),
                ),
                const SizedBox(height: AppSpacing.xl),
                TartebPrimaryButton(
                  label: AppStrings.sendOtp,
                  onPressed: _sendOtp,
                ),
              ],
            ],
          ),
          footer: TextButton(
            onPressed: _openEmailAuth,
            child: Text(AppStrings.signInWithEmailInstead),
          ),
        );
      },
    );
  }
}
