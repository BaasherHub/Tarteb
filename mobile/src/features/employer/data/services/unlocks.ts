import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/lib/api';
import { employerKeys } from '@/features/employer/data/employerQueryKeys';
import { getErrorMessage } from '@/shared/utils/errors';
import { candidateIdFromUnlockRow } from '@/features/employer/domain/unlockRow';

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
    const { unlocks } = await api.unlocks.list();
    const rows = unlocks as UnlockRow[];

    const candidatesById: Record<string, Record<string, unknown>> = {};
    for (const row of rows) {
      // The list endpoint already joins candidate data — store the full row keyed by candidate_id
      candidatesById[candidateIdFromUnlockRow(row as Record<string, unknown>)] =
        row as Record<string, unknown>;
    }

    return { rows, candidatesById };
  } catch (e) {
    throw new Error(getErrorMessage(e, errorLabel));
  }
}

export function useUnlocks(errorLabel: string) {
  return useQuery({
    queryKey: employerKeys.unlocks(),
    queryFn: () => fetchUnlocks(errorLabel),
  });
}

export function useUnlockCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (candidateId: string) => {
      await api.unlocks.unlock(candidateId);
      return candidateId;
    },
    onSuccess: (candidateId) => {
      queryClient.setQueryData(employerKeys.unlockStatus(candidateId), true);
      void queryClient.invalidateQueries({ queryKey: employerKeys.unlocks() });
      void queryClient.invalidateQueries({ queryKey: employerKeys.candidate(candidateId) });
      void queryClient.invalidateQueries({ queryKey: [...employerKeys.all, 'browse'] });
    },
  });
}
