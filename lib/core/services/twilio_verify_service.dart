import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';

/// Twilio Verify via Supabase Edge Functions (credentials stay server-side).
abstract final class TwilioVerifyService {
  /// Set after successful verify; applied when [profiles] row is created.
  static String? pendingPhone;

  /// Last verified phone for the current session (e.g. WhatsApp support).
  static String? verifiedPhone;

  /// E.164 used for the current send/verify pair (must match exactly).
  static String? _otpSessionPhoneE164;

  /// Normalizes to E.164: leading +, digits only, no spaces/dashes/double +.
  static String normalizeE164(String phone) {
    final compact = phone.replaceAll(RegExp(r'[\s\-\(\)\.]'), '');
    var digits = compact.replaceAll(RegExp(r'\D'), '');
    if (digits.isEmpty) return '';

    // Collapse accidental double-plus (e.g. "++971...")
    while (digits.startsWith('00')) {
      digits = digits.substring(1);
    }

    return '+$digits';
  }

  static Future<void> sendOTP(String phone) async {
    final e164 = normalizeE164(phone);
    if (e164.length < 11 || !e164.startsWith('+')) {
      throw Exception('Invalid phone number format');
    }

    _otpSessionPhoneE164 = e164;
    if (kDebugMode) {
      debugPrint('[TwilioVerify] sendOTP E.164: $e164');
    }

    final response = await TartebSupabase.client.functions.invoke(
      'send-otp',
      body: {'phone': e164},
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
    final e164 = _otpSessionPhoneE164 ?? normalizeE164(phone);
    if (e164.isEmpty) {
      throw Exception('No OTP session — send code first');
    }

    if (kDebugMode) {
      debugPrint('[TwilioVerify] verifyOTP E.164: $e164');
    }

    final response = await TartebSupabase.client.functions.invoke(
      'verify-otp',
      body: {'phone': e164, 'code': code.trim()},
    );

    final data = _asMap(response.data);
    return data['approved'] == true;
  }

  /// Anonymous Supabase session + persist phone on [profiles] when possible.
  static Future<void> signInWithVerifiedPhone(String phone) async {
    final e164 = normalizeE164(phone);
    await TartebSupabase.auth.signInAnonymously();
    verifiedPhone = e164;
    pendingPhone = e164;
    _otpSessionPhoneE164 = e164;

    final userId = TartebSupabase.auth.currentUser?.id;
    if (userId == null) return;

    await TartebSupabase.auth.updateUser(
      UserAttributes(data: {'phone': e164}),
    );

    final profile = await TartebSupabase.client
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

    if (profile != null) {
      await TartebSupabase.client
          .from('profiles')
          .update({'phone': e164})
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
