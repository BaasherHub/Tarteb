import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step1_photo.dart';
import 'package:tarteb/features/employer/screens/employer_onboarding_screen.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

class PhoneOtpScreen extends StatefulWidget {
  const PhoneOtpScreen({super.key, required this.selectedRole});

  final String selectedRole;

  @override
  State<PhoneOtpScreen> createState() => _PhoneOtpScreenState();
}

class _PhoneOtpScreenState extends State<PhoneOtpScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _otpSent = false;
  bool _loading = false;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    setState(() => _loading = true);
    try {
      final phone = _phoneController.text.trim();
      await TartebSupabase.auth.signInWithOtp(phone: phone);
      setState(() => _otpSent = true);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _verifyOtp() async {
    setState(() => _loading = true);
    try {
      final phone = _phoneController.text.trim();
      final token = _otpController.text.trim();
      await TartebSupabase.auth.verifyOTP(
        phone: phone,
        token: token,
        type: OtpType.sms,
      );

      final userId = TartebSupabase.auth.currentUser!.id;
      await TartebSupabase.client.from('profiles').upsert({
        'user_id': userId,
        'role': widget.selectedRole,
      });

      if (!mounted) return;

      if (widget.selectedRole == 'candidate') {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute<void>(builder: (_) => const Step1PhotoScreen()),
          (_) => false,
        );
      } else {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute<void>(
            builder: (_) => const EmployerOnboardingScreen(),
          ),
          (_) => false,
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: LoadingWidget());

    return Scaffold(
      appBar: AppBar(title: const Text(AppStrings.verifyOtp)),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextField(
              controller: _phoneController,
              decoration: const InputDecoration(
                labelText: AppStrings.enterPhone,
                hintText: '+971501234567',
                prefixIcon: Icon(Icons.phone),
              ),
              keyboardType: TextInputType.phone,
              enabled: !_otpSent,
            ),
            if (_otpSent) ...[
              const SizedBox(height: 16),
              TextField(
                controller: _otpController,
                decoration: const InputDecoration(
                  labelText: 'OTP code',
                  prefixIcon: Icon(Icons.lock),
                ),
                keyboardType: TextInputType.number,
              ),
            ],
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _otpSent ? _verifyOtp : _sendOtp,
              child: Text(_otpSent ? 'Verify' : 'Send OTP'),
            ),
          ],
        ),
      ),
    );
  }
}
