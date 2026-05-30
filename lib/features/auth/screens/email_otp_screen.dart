import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';
import 'package:tarteb/features/auth/services/auth_navigation.dart';
import 'package:tarteb/features/shared/widgets/loading_widget.dart';

/// MVP auth: email OTP. Switch to phone OTP before production.
class EmailOtpScreen extends StatefulWidget {
  const EmailOtpScreen({super.key});

  @override
  State<EmailOtpScreen> createState() => _EmailOtpScreenState();
}

class _EmailOtpScreenState extends State<EmailOtpScreen> {
  final _emailController = TextEditingController();
  final _otpController = TextEditingController();
  bool _otpSent = false;
  bool _loading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    final email = _emailController.text.trim();
    if (email.isEmpty || !email.contains('@')) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter a valid email address')),
      );
      return;
    }

    setState(() => _loading = true);
    try {
      await TartebSupabase.auth.signInWithOtp(email: email);
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
      final email = _emailController.text.trim();
      final token = _otpController.text.trim();
      await TartebSupabase.auth.verifyOTP(
        email: email,
        token: token,
        type: OtpType.email,
      );

      if (!mounted) return;
      await AuthNavigation.routeAuthenticatedUser(context);
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
            Text(
              'Sign in with email',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: AppStrings.enterEmail,
                hintText: 'you@example.com',
                prefixIcon: Icon(Icons.email_outlined),
              ),
              keyboardType: TextInputType.emailAddress,
              autocorrect: false,
              enabled: !_otpSent,
            ),
            if (_otpSent) ...[
              const SizedBox(height: 16),
              TextField(
                controller: _otpController,
                decoration: const InputDecoration(
                  labelText: 'OTP code',
                  prefixIcon: Icon(Icons.lock_outline),
                ),
                keyboardType: TextInputType.number,
                maxLength: 8,
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
