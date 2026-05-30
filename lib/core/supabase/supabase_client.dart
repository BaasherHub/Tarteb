import 'package:supabase_flutter/supabase_flutter.dart';

/// Initialize before runApp. Set values via --dart-define.
abstract final class TartebSupabase {
  static const String supabaseUrl = String.fromEnvironment('SUPABASE_URL');
  static const String supabaseAnonKey =
      String.fromEnvironment('SUPABASE_ANON_KEY');

  static Future<void> initialize() async {
    assert(
      supabaseUrl.isNotEmpty,
      'SUPABASE_URL is required. Pass via --dart-define',
    );
    assert(
      supabaseAnonKey.isNotEmpty,
      'SUPABASE_ANON_KEY is required. Pass via --dart-define',
    );
    await Supabase.initialize(
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    );
  }

  static SupabaseClient get client => Supabase.instance.client;
  static GoTrueClient get auth => client.auth;
}
