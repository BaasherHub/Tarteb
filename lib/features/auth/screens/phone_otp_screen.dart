import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/auth/constants/phone_countries.dart';
import 'package:tarteb/features/auth/screens/email_otp_screen.dart';
import 'package:tarteb/features/auth/services/auth_navigation.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

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
  bool _loading = false;
  String? _e164Phone;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    final local = _phoneController.text.trim();
    if (local.isEmpty) {
      _showError('Enter your phone number');
      return;
    }

    final phone = PhoneCountries.toE164(_country, local);
    if (phone.length < 10) {
      _showError('Enter a valid phone number');
      return;
    }

    setState(() => _loading = true);
    try {
      await TartebSupabase.auth.signInWithOtp(phone: phone);
      setState(() {
        _otpSent = true;
        _e164Phone = phone;
      });
    } catch (e) {
      _showError(e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _verifyOtp() async {
    final phone = _e164Phone;
    final token = _otpController.text.trim();
    if (phone == null || token.length != 6) {
      _showError('Enter the 6-digit code');
      return;
    }

    setState(() => _loading = true);
    try {
      await TartebSupabase.auth.verifyOTP(
        phone: phone,
        token: token,
        type: OtpType.sms,
      );

      if (!mounted) return;
      await AuthNavigation.routeAuthenticatedUser(context);
    } catch (e) {
      _showError(e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _showError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  void _openEmailAuth() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(builder: (_) => const EmailOtpScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: LoadingWidget());

    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Center(
                    child: Icon(
                      Icons.work_outline,
                      size: 72,
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'Welcome to ${AppStrings.appName}',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    AppStrings.splashTaglineAr,
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: AppColors.textSecondary,
                        ),
                  ),
                  const SizedBox(height: 32),
                  if (!_otpSent) ...[
                    _CountryPhoneInput(
                      country: _country,
                      controller: _phoneController,
                      enabled: true,
                      onCountryChanged: (c) => setState(() => _country = c),
                    ),
                    const SizedBox(height: 24),
                    FilledButton(
                      onPressed: _sendOtp,
                      child: Text(AppStrings.sendOtp),
                    ),
                  ] else ...[
                    Text(
                      'Code sent to $_e164Phone',
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                          ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _otpController,
                      decoration: InputDecoration(
                        labelText: AppStrings.otpCode,
                        prefixIcon: const Icon(Icons.lock_outline),
                        hintText: '000000',
                      ),
                      keyboardType: TextInputType.number,
                      maxLength: 6,
                      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 22,
                        letterSpacing: 8,
                      ),
                    ),
                    const SizedBox(height: 24),
                    FilledButton(
                      onPressed: _verifyOtp,
                      child: Text(AppStrings.verify),
                    ),
                    const SizedBox(height: 8),
                    TextButton(
                      onPressed: () => setState(() {
                        _otpSent = false;
                        _otpController.clear();
                      }),
                      child: const Text('Change phone number'),
                    ),
                  ],
                  const SizedBox(height: 24),
                  Center(
                    child: TextButton(
                      onPressed: _openEmailAuth,
                      child: Text(AppStrings.signInWithEmailInstead),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _CountryPhoneInput extends StatelessWidget {
  const _CountryPhoneInput({
    required this.country,
    required this.controller,
    required this.enabled,
    required this.onCountryChanged,
  });

  final PhoneCountry country;
  final TextEditingController controller;
  final bool enabled;
  final ValueChanged<PhoneCountry> onCountryChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        DropdownButtonFormField<PhoneCountry>(
          initialValue: country,
          decoration: InputDecoration(
            labelText: 'Country',
            prefixIcon: const Icon(Icons.public),
          ),
          items: PhoneCountries.all
              .map(
                (c) => DropdownMenuItem(
                  value: c,
                  child: Text(c.label),
                ),
              )
              .toList(),
          onChanged: enabled
              ? (c) {
                  if (c != null) onCountryChanged(c);
                }
              : null,
        ),
        const SizedBox(height: 16),
        TextField(
          controller: controller,
          enabled: enabled,
          decoration: InputDecoration(
            labelText: AppStrings.enterPhone,
            hintText: '501234567',
            prefixText: '${country.dialCode} ',
          ),
          keyboardType: TextInputType.phone,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        ),
      ],
    );
  }
}
