import { useQuery } from '@tanstack/react-query';
import { api } from '@/core/lib/api';
import { employerKeys } from '@/features/employer/data/employerQueryKeys';
import { employerHasUnlockedCandidate } from '@/features/employer/domain/candidateUnlock';
import { getErrorMessage } from '@/shared/utils/errors';

export async function fetchCandidateDetail(
  candidateId: string,
): Promise<Record<string, unknown>> {
  const { candidate } = await api.candidates.getById(candidateId);
  if (!candidate) throw new Error('Candidate not found');
  return candidate;
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
