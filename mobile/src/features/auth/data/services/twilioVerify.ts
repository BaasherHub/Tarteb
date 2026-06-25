import { env } from '@/core/config/env';
import { api } from '@/core/lib/api';
import { hasSession, storeSession } from '@/core/services/tokenStorage';
import { isValidUaeMobileE164, normalizeE164 } from '@/shared/utils/phone';

export { normalizeE164, isValidUaeMobileE164 } from '@/shared/utils/phone';

export function isOtpBypassEnabled(): boolean {
  return env.skipOtpVerification;
}

export async function sendOtp(phone: string): Promise<void> {
  const e164 = normalizeE164(phone);
  if (!isValidUaeMobileE164(e164)) throw new Error('Invalid phone number format');
  if (isOtpBypassEnabled()) return;
  await api.auth.sendOtp(e164);
}

/**
 * Verify the OTP and — on success — store the JWT session locally.
 * Returns true when approved, false when the code is wrong/expired.
 * Throws on network errors or unexpected API failures.
 */
export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const e164 = normalizeE164(phone);
  if (!e164) throw new Error('No phone number — send code first');

  try {
    const { access_token, refresh_token, user } = await api.auth.verifyOtp(e164, code.trim());
    await storeSession(access_token, refresh_token, user);
    return true;
  } catch (e) {
    const msg = (e instanceof Error ? e.message : String(e)).toLowerCase();
    // Return false for wrong/expired code rather than throwing
    if (msg.includes('invalid') || msg.includes('expired') || msg.includes('incorrect')) {
      return false;
    }
    throw e;
  }
}

/**
 * Called in OTP-bypass mode (dev/testing only).
 * If a session already exists (verifyOtp ran first), this is a no-op.
 * Otherwise, exchanges the bypass code for a JWT session.
 */
export async function signInWithVerifiedPhone(phone: string): Promise<void> {
  if (await hasSession()) return;

  const e164 = normalizeE164(phone);
  // Backend accepts any code when SKIP_OTP_VERIFICATION=true
  const { access_token, refresh_token, user } = await api.auth.verifyOtp(e164, '000000');
  await storeSession(access_token, refresh_token, user);
}
