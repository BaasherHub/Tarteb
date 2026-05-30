// Admin only - remove before public launch
//
// Add credits manually after WhatsApp payment confirmation.
//
// Usage:
//   flutter run -t lib/admin/add_credits.dart \
//     --dart-define=SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
//     --dart-define=SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY \
//     -- employer@company.com 5
//
// Arguments after -- : <employer_email> <credits_amount>

import 'dart:io';

import 'package:flutter/widgets.dart';
import 'package:supabase/supabase.dart';

List<String> _scriptArgs = [];

void main(List<String> args) async {
  WidgetsFlutterBinding.ensureInitialized();
  _scriptArgs = args;
  runApp(const _AdminCreditsApp());
}

class _AdminCreditsApp extends StatefulWidget {
  const _AdminCreditsApp();

  @override
  State<_AdminCreditsApp> createState() => _AdminCreditsAppState();
}

class _AdminCreditsAppState extends State<_AdminCreditsApp> {
  @override
  void initState() {
    super.initState();
    _run();
  }

  Future<void> _run() async {
    final exitCode = await AddCreditsAdmin.run(_scriptArgs);
    if (mounted) exit(exitCode);
  }

  @override
  Widget build(BuildContext context) => const SizedBox.shrink();
}

abstract final class AddCreditsAdmin {
  static const String url = String.fromEnvironment('SUPABASE_URL');
  static const String serviceRoleKey =
      String.fromEnvironment('SUPABASE_SERVICE_ROLE_KEY');

  static Future<int> run(List<String> args) async {
    if (url.isEmpty || serviceRoleKey.isEmpty) {
      stderr.writeln(
        'Error: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY via --dart-define',
      );
      return 1;
    }

    final positional = args.where((a) => !a.startsWith('-')).toList();
    if (positional.length < 2) {
      stderr.writeln(
        'Usage: flutter run -t lib/admin/add_credits.dart -- '
        '<employer_email> <credits>',
      );
      return 1;
    }

    final email = positional[0].trim();
    final credits = int.tryParse(positional[1]);
    if (credits == null || credits < 1) {
      stderr.writeln('Error: credits must be a positive integer');
      return 1;
    }

    final client = SupabaseClient(url, serviceRoleKey);

    try {
      stdout.writeln('Looking up employer: $email');

      final employer = await client
          .from('employers')
          .select('id, company_name, credits_balance')
          .eq('email', email)
          .maybeSingle();

      if (employer == null) {
        stderr.writeln('Error: No employer found with email $email');
        return 1;
      }

      final employerId = employer['id'] as String;
      final company = employer['company_name'] as String? ?? '';
      final currentBalance = employer['credits_balance'] as int? ?? 0;

      stdout.writeln('Found: $company (balance: $currentBalance)');

      final amountAed = credits * 50;
      final payment = await client
          .from('payments')
          .insert({
            'employer_id': employerId,
            'amount': amountAed,
            'credits_purchased': credits,
            'status': 'pending',
          })
          .select('id')
          .single();

      final paymentId = payment['id'] as String;
      stdout.writeln('Created pending payment $paymentId');

      await client.rpc('add_employer_credits', params: {
        'p_employer_id': employerId,
        'p_credits': credits,
        'p_payment_id': paymentId,
      });

      final updated = await client
          .from('employers')
          .select('credits_balance')
          .eq('id', employerId)
          .single();

      final newBalance = updated['credits_balance'] as int? ?? 0;
      stdout.writeln(
        'Success: added $credits credits. New balance: $newBalance',
      );
      return 0;
    } catch (e, st) {
      stderr.writeln('Error: $e');
      stderr.writeln(st);
      return 1;
    }
  }
}
