import { api } from '@/core/lib/api';
import { isLikelyNetworkError } from '@/shared/utils/errors';

export function normalizeCompanyName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function isCompanyNameConflict(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  const message = 'message' in error ? String((error as { message: unknown }).message) : '';
  return (
    message.toLowerCase().includes('employers_company_name_unique_idx') ||
    message.toLowerCase().includes('company name') && message.toLowerCase().includes('taken')
  );
}

export function companyNameCheckErrorMessage(error: unknown, t: {
  errorGeneric: string;
  offlineCachedHint: string;
}): string {
  if (isLikelyNetworkError(error)) return t.offlineCachedHint;
  return t.errorGeneric;
}

export async function isCompanyNameAvailable(
  companyName: string,
  _userId: string,
): Promise<boolean> {
  const normalized = normalizeCompanyName(companyName);
  if (!normalized) return false;

  const { available } = await api.employers.checkCompanyName(normalized);
  return available;
}
