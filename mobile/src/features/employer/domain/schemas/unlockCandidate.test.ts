import { describe, expect, it } from 'vitest';
import { parseUnlockCandidateRpcArgs } from './unlockCandidate';

describe('parseUnlockCandidateRpcArgs', () => {
  it('returns RPC args for a valid candidate id', () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    expect(parseUnlockCandidateRpcArgs(id)).toEqual({ p_candidate_id: id });
  });

  it('rejects a non-uuid candidate id', () => {
    expect(() => parseUnlockCandidateRpcArgs('not-a-uuid')).toThrow();
  });
});
