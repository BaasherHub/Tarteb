import { beforeEach, describe, expect, it, vi } from 'vitest';
import { supabase } from '@/core/lib/supabase';
import {
  employerHasUnlockedCandidate,
  hasCandidateContact,
  isCandidateUnlocked,
} from './candidateUnlock';

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
    vi.mocked(supabase.from).mockReset();
  });

  it('returns true when an unlock row exists', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: { id: 'unlock-1' }, error: null });
    const limit = vi.fn().mockReturnValue({ maybeSingle });
    const eq = vi.fn().mockReturnValue({ limit });
    const select = vi.fn().mockReturnValue({ eq });
    vi.mocked(supabase.from).mockReturnValue({ select } as never);

    await expect(employerHasUnlockedCandidate('candidate-1')).resolves.toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('unlocks');
    expect(eq).toHaveBeenCalledWith('candidate_id', 'candidate-1');
  });

  it('returns false on query error', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'fail' } });
    const limit = vi.fn().mockReturnValue({ maybeSingle });
    const eq = vi.fn().mockReturnValue({ limit });
    const select = vi.fn().mockReturnValue({ eq });
    vi.mocked(supabase.from).mockReturnValue({ select } as never);

    await expect(employerHasUnlockedCandidate('candidate-1')).resolves.toBe(false);
  });

  it('returns false when no unlock row exists', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const limit = vi.fn().mockReturnValue({ maybeSingle });
    const eq = vi.fn().mockReturnValue({ limit });
    const select = vi.fn().mockReturnValue({ eq });
    vi.mocked(supabase.from).mockReturnValue({ select } as never);

    await expect(employerHasUnlockedCandidate('candidate-1')).resolves.toBe(false);
  });
});
