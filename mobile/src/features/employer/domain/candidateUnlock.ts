import { supabase } from '@/core/lib/supabase';

export function isCandidateUnlocked(row: Record<string, unknown>): boolean {
  const flag = row.is_unlocked;
  if (flag === true || flag === 'true' || flag === 't' || flag === 1) return true;
  return hasCandidateContact(row);
}

export async function employerHasUnlockedCandidate(candidateId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('unlocks')
    .select('id')
    .eq('candidate_id', candidateId)
    .limit(1)
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}

export function hasCandidateContact(row: Record<string, unknown>): boolean {
  const phone = String(row.phone ?? '').trim();
  const whatsapp = String(row.whatsapp ?? '').trim();
  return Boolean(phone || whatsapp);
}
