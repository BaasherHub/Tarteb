import { supabase } from '@/core/lib/supabase';
import { getErrorMessage, isLikelyNetworkError } from '@/shared/utils/errors';

export function normalizeCompanyName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function isCompanyNameConflict(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const code = 'code' in error ? String((error as { code: unknown }).code) : '';
  if (code === '23505') return true;
  const message = 'message' in error ? String((error as { message: unknown }).message) : '';
  return message.toLowerCase().includes('employers_company_name_unique_idx');
}

function isCompanyNameRpcMissing(error: unknown): boolean {
  const msg = getErrorMessage(error, '').toLowerCase();
  return (
    msg.includes('is_company_name_available') ||
    msg.includes('could not find the function')
  );
}

/** User-facing message when the availability check fails unexpectedly. */
export function companyNameCheckErrorMessage(error: unknown, t: {
  errorGeneric: string;
  offlineCachedHint: string;
}): string {
  if (isLikelyNetworkError(error)) return t.offlineCachedHint;
  return t.errorGeneric;
}

/** Returns true when the name is free for this user (edit mode keeps their own name). */
export async function isCompanyNameAvailable(
  companyName: string,
  userId: string,
): Promise<boolean> {
  const normalized = normalizeCompanyName(companyName);
  if (!normalized) return false;

  const { data, error } = await supabase.rpc('is_company_name_available', {
    p_company_name: normalized,
    p_user_id: userId,
  });

  if (error) {
    // Migration not deployed yet — allow continue; unique index enforces on submit.
    if (isCompanyNameRpcMissing(error)) return true;
    throw error;
  }
  return Boolean(data);
}
