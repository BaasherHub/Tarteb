import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/core/lib/supabase';
import { employerKeys } from '@/features/employer/data/employerQueryKeys';
import { employerHasUnlockedCandidate } from '@/features/employer/domain/candidateUnlock';
import { getErrorMessage } from '@/shared/utils/errors';

export async function fetchCandidateDetail(
  candidateId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase
    .from('candidate_browse')
    .select('*')
    .eq('id', candidateId)
    .single();
  if (error) throw error;
  return data as Record<string, unknown>;
}

export function useCandidateDetail(candidateId: string, errorLabel: string) {
  return useQuery({
    queryKey: employerKeys.candidate(candidateId),
    queryFn: async () => {
      try {
        return await fetchCandidateDetail(candidateId);
      } catch (e) {
        throw new Error(getErrorMessage(e, errorLabel));
      }
    },
  });
}

export function useEmployerUnlockStatus(candidateId: string) {
  return useQuery({
    queryKey: employerKeys.unlockStatus(candidateId),
    queryFn: () => employerHasUnlockedCandidate(candidateId),
  });
}
