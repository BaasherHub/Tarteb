import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '@/core/lib/api';
import {
  employerHasUnlockedCandidate,
  hasCandidateContact,
  isCandidateUnlocked,
} from './candidateUnlock';

vi.mock('@/core/lib/api', () => ({
  api: {
    unlocks: {
      status: vi.fn(),
    },
  },
}));

describe('hasCandidateContact', () => {
  it('returns true when phone is set', () => {
    expect(hasCandidateContact({ phone: '+971501234567' })).toBe(true);
  });

  it('returns true when whatsapp is set', () => {
    expect(hasCandidateContact({ whatsapp: '+971501234567' })).toBe(true);
  });

  it('returns false when both are empty', () => {
    expect(hasCandidateContact({ phone: '', whatsapp: '  ' })).toBe(false);
  });
});

describe('isCandidateUnlocked', () => {
  it.each([
    ['boolean true', { is_unlocked: true }],
    ['string "true"', { is_unlocked: 'true' }],
    ['postgres "t"', { is_unlocked: 't' }],
    ['numeric 1', { is_unlocked: 1 }],
  ])('treats is_unlocked %s as unlocked', (_label, row) => {
    expect(isCandidateUnlocked(row)).toBe(true);
  });

  it('falls back to contact fields when is_unlocked is absent', () => {
    expect(isCandidateUnlocked({ phone: '+971501234567' })).toBe(true);
  });

  it('returns false when not unlocked and no contact', () => {
    expect(isCandidateUnlocked({ is_unlocked: false })).toBe(false);
  });
});

describe('employerHasUnlockedCandidate', () => {
  beforeEach(() => {
    vi.mocked(api.unlocks.status).mockReset();
  });

  it('returns true when unlock status is true', async () => {
    vi.mocked(api.unlocks.status).mockResolvedValue({ unlocked: true });
    await expect(employerHasUnlockedCandidate('candidate-1')).resolves.toBe(true);
    expect(api.unlocks.status).toHaveBeenCalledWith('candidate-1');
  });

  it('returns false when unlock status is false', async () => {
    vi.mocked(api.unlocks.status).mockResolvedValue({ unlocked: false });
    await expect(employerHasUnlockedCandidate('candidate-1')).resolves.toBe(false);
  });

  it('propagates errors from the API', async () => {
    vi.mocked(api.unlocks.status).mockRejectedValue(new Error('network error'));
    await expect(employerHasUnlockedCandidate('candidate-1')).rejects.toThrow('network error');
  });
});
