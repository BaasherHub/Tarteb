import { api } from '@/core/lib/api';

export function isCandidateUnlocked(row: Record<string, unknown>): boolean {
  const flag = row.is_unlocked;
  if (flag === true || flag === 'true' || flag === 't' || flag === 1) return true;
  return hasCandidateContact(row);
}

export async function employerHasUnlockedCandidate(candidateId: string): Promise<boolean> {
  const { unlocked } = await api.unlocks.status(candidateId);
  return unlocked;
}

export function hasCandidateContact(row: Record<string, unknown>): boolean {
  const phone = String(row.phone ?? '').trim();
  const whatsapp = String(row.whatsapp ?? '').trim();
  return Boolean(phone || whatsapp);
}
