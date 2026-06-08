import { z } from 'zod';
import { parseSchema } from '@/shared/validation/parseSchema';

export const unlockCandidateRpcSchema = z.object({
  p_candidate_id: z.string().uuid(),
});

export type UnlockCandidateRpcArgs = z.infer<typeof unlockCandidateRpcSchema>;

export function parseUnlockCandidateRpcArgs(candidateId: string): UnlockCandidateRpcArgs {
  return parseSchema(unlockCandidateRpcSchema, { p_candidate_id: candidateId });
}
