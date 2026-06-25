import { describe, expect, it } from 'vitest';
import { candidateIdFromUnlockRow } from '@/features/employer/domain/unlockRow';

describe('candidateIdFromUnlockRow', () => {
  it('uses candidate_id instead of the unlock row id', () => {
    expect(
      candidateIdFromUnlockRow({
        id: 'unlock-row-id',
        candidate_id: 'candidate-id',
      }),
    ).toBe('candidate-id');
  });

  it('falls back to id for legacy candidate-shaped rows', () => {
    expect(candidateIdFromUnlockRow({ id: 'candidate-id' })).toBe('candidate-id');
  });
});
