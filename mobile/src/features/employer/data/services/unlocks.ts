import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/lib/supabase';
import { getErrorMessage } from '@/shared/utils/errors';

export type UnlockRow = {
  id: string;
  candidate_id: string;
  unlocked_at: string;
};

export type UnlocksResult = {
  rows: UnlockRow[];
  candidatesById: Record<string, Record<string, unknown>>;
};

async function fetchUnlocks(errorLabel: string): Promise<UnlocksResult> {
  try {
    const { data: unlockData, error: unlockError } = await supabase
      .from('unlocks')
      .select('id, candidate_id, unlocked_at')
      .order('unlocked_at', { ascending: false });
    if (unlockError) throw unlockError;

    const rows = (unlockData ?? []) as UnlockRow[];
    const ids = rows.map((r) => r.candidate_id);
    if (!ids.length) {
      return { rows: [], candidatesById: {} };
    }

    const { data: browseData, error: browseError } = await supabase
      .from('candidate_browse')
      .select('*')
      .in('id', ids);
    if (browseError) throw browseError;

    const candidatesById: Record<string, Record<string, unknown>> = {};
    for (const row of browseData ?? []) {
      const id = String((row as { id: string }).id);
      candidatesById[id] = row as Record<string, unknown>;
    }

    return { rows, candidatesById };
  } catch (e) {
    throw new Error(getErrorMessage(e, errorLabel));
  }
}

export function useUnlocks(errorLabel: string) {
  return useQuery({
    queryKey: ['employer', 'unlocks'],
    queryFn: () => fetchUnlocks(errorLabel),
  });
}

