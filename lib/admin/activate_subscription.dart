// Activate employer monthly subscription after WhatsApp payment.
//
// Run with service role (never ship this key in the app):
//   flutter run -t lib/admin/activate_subscription.dart \
//     --dart-define=SUPABASE_URL=... \
//     --dart-define=SUPABASE_SERVICE_ROLE_KEY=...
//
// Arguments: <employer_email> [months=1]

import 'dart:io';

import 'package:supabase/supabase.dart';

Future<void> main(List<String> args) async {
  if (Platform.environment.containsKey('FLUTTER_TEST')) return;

  final url = const String.fromEnvironment('SUPABASE_URL');
  final serviceKey = const String.fromEnvironment('SUPABASE_SERVICE_ROLE_KEY');

  if (url.isEmpty || serviceKey.isEmpty) {
    stderr.writeln('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY via --dart-define');
    exit(1);
  }

  final positional = args.where((a) => !a.startsWith('-')).toList();
  if (positional.length < 1) {
    stderr.writeln(
      'Usage: flutter run -t lib/admin/activate_subscription.dart -- '
      '<employer_email> [months]',
    );
    exit(1);
  }

  final email = positional[0];
  final months = positional.length > 1 ? int.tryParse(positional[1]) ?? 1 : 1;

  final client = SupabaseClient(url, serviceKey);

  final employers = await client
      .from('employers')
      .select('id, company_name, subscription_ends_at')
      .eq('email', email);

  if (employers.isEmpty) {
    stderr.writeln('No employer found for $email');
    exit(1);
  }

  final employer = employers.first as Map<String, dynamic>;
  final employerId = employer['id'] as String;

  final updated = await client.rpc(
    'activate_employer_subscription',
    params: {'p_employer_id': employerId, 'p_months': months},
  );

  final endsAt = (updated as Map)['subscription_ends_at'];
  stdout.writeln(
    'Activated $months month(s) for ${employer['company_name']} ($email). '
    'Valid until: $endsAt',
  );
}
