import { env } from '@/core/config/env';
import { supabase } from '@/core/lib/supabase';


let otpSessionPhoneE164: string | null = null;

/** TESTING ONLY — when true, no Twilio SMS (see TESTING_OTP_BYPASS.md). */
export function isOtpBypassEnabled(): boolean {
  return env.skipOtpVerification;
}
export function normalizeE164(phone: string): string {
  const compact = phone.replace(/[\s\-().]/g, '');
  let digits = compact.replace(/\D/g, '');
  while (digits.startsWith('00')) {
    digits = digits.slice(1);
  }
  return digits ? `+${digits}` : '';
}

export async function sendOtp(phone: string): Promise<void> {
  const e164 = normalizeE164(phone);
  if (e164.length < 11 || !e164.startsWith('+')) {
    throw new Error('Invalid phone number format');
  }
  otpSessionPhoneE164 = e164;

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
  const e164 = otpSessionPhoneE164 ?? normalizeE164(phone);
  if (!e164) throw new Error('No OTP session — send code first');

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
  const { error: authError } = await supabase.auth.signInAnonymously();
  if (authError) throw authError;

  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return;

  await supabase.auth.updateUser({ data: { phone: e164 } });

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (profile) {
    await supabase.from('profiles').update({ phone: e164 }).eq('user_id', userId);
  }
}
