import 'package:tarteb/core/supabase/supabase_client.dart';

/// Phone-first contact for support WhatsApp; email fallback for legacy sessions.
abstract final class AuthContact {
  static String? get phone => TartebSupabase.auth.currentUser?.phone;

  static String? get email => TartebSupabase.auth.currentUser?.email;

  /// Identifier shown in WhatsApp pre-filled messages.
  static String get supportIdentifier {
    final p = phone?.trim();
    if (p != null && p.isNotEmpty) return p;
    final e = email?.trim();
    if (e != null && e.isNotEmpty) return e;
    return '';
  }

  static bool get hasPhone => phone != null && phone!.trim().isNotEmpty;
}
