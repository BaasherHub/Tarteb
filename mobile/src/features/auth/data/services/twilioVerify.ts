import { env } from '@/core/config/env';
import { supabase } from '@/core/lib/supabase';
import { isValidUaeMobileE164, normalizeE164 } from '@/shared/utils/phone';

export { normalizeE164, isValidUaeMobileE164 } from '@/shared/utils/phone';

/** TESTING ONLY — when true, no Twilio SMS (see archive/flutter/TESTING_OTP_BYPASS.md). */
export function isOtpBypassEnabled(): boolean {
  return env.skipOtpVerification;
}

export async function sendOtp(phone: string): Promise<void> {
  const e164 = normalizeE164(phone);
  if (!isValidUaeMobileE164(e164)) {
    throw new Error('Invalid phone number format');
  }

  if (isOtpBypassEnabled()) return;

  const { data, error } = await supabase.functions.invoke('send-otp', {
    body: { phone: e164 },
  });
  if (error) throw error;
  const body = data as { success?: boolean; status?: string; error?: string };
  if (body?.success !== true) {
    throw new Error(body?.status ?? body?.error ?? 'Failed to send OTP');
  }
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const e164 = normalizeE164(phone);
  if (!e164) throw new Error('No phone number — send code first');

  if (isOtpBypassEnabled()) return true;

  const { data, error } = await supabase.functions.invoke('verify-otp', {
    body: { phone: e164, code: code.trim() },
  });
  if (error) throw error;
  const body = data as {
    approved?: boolean;
    twilioError?: string | { message?: string };
  };
  if (body?.approved === true) return true;
  const twilioMsg =
    typeof body?.twilioError === 'string'
      ? body.twilioError
      : body?.twilioError?.message;
  if (twilioMsg) throw new Error(twilioMsg);
  return false;
}

export async function signInWithVerifiedPhone(phone: string): Promise<void> {
  const e164 = normalizeE164(phone);

  // Only create a new anonymous session if there is no existing one.
  // Calling signInAnonymously unconditionally would assign a new user ID to
  // returning users, silently destroying their profile and all app data.
  const { data: { session: existingSession } } = await supabase.auth.getSession();
  if (!existingSession) {
    const { error: authError } = await supabase.auth.signInAnonymously();
    if (authError) throw authError;
  }

  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Sign-in succeeded but no user ID returned');

  const { error: updateError } = await supabase.auth.updateUser({ data: { phone: e164 } });
  if (updateError) throw updateError;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (profile) {
    const { error } = await supabase
      .from('profiles')
      .update({ phone: e164 })
      .eq('user_id', userId);
    if (error) throw error;
  }
}
