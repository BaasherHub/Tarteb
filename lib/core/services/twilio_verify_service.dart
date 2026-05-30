import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';

/// Twilio Verify via Supabase Edge Functions (credentials stay server-side).
abstract final class TwilioVerifyService {
  /// Set after successful verify; applied when [profiles] row is created.
  static String? pendingPhone;

  /// Last verified phone for the current session (e.g. WhatsApp support).
  static String? verifiedPhone;

  static Future<void> sendOTP(String phone) async {
    final response = await TartebSupabase.client.functions.invoke(
      'send-otp',
      body: {'phone': phone},
    );

    final data = _asMap(response.data);
    if (data['success'] != true) {
      throw Exception(
        data['status']?.toString() ??
            data['error']?.toString() ??
            'Failed to send OTP',
      );
    }
  }

  static Future<bool> verifyOTP(String phone, String code) async {
    final response = await TartebSupabase.client.functions.invoke(
      'verify-otp',
      body: {'phone': phone, 'code': code},
    );

    final data = _asMap(response.data);
    return data['approved'] == true;
  }

  /// Anonymous Supabase session + persist phone on [profiles] when possible.
  static Future<void> signInWithVerifiedPhone(String phone) async {
    await TartebSupabase.auth.signInAnonymously();
    verifiedPhone = phone;
    pendingPhone = phone;

    final userId = TartebSupabase.auth.currentUser?.id;
    if (userId == null) return;

    await TartebSupabase.auth.updateUser(
      UserAttributes(data: {'phone': phone}),
    );

    final profile = await TartebSupabase.client
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

    if (profile != null) {
      await TartebSupabase.client
          .from('profiles')
          .update({'phone': phone})
          .eq('user_id', userId);
      pendingPhone = null;
    }
  }

  static Map<String, dynamic> _asMap(dynamic data) {
    if (data is Map<String, dynamic>) return data;
    if (data is Map) return Map<String, dynamic>.from(data);
    return {};
  }
}
