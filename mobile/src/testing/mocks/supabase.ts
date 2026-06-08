import { vi } from 'vitest';

/** Vitest stub — replaced per test via `vi.mocked(supabase.from)`. */
export const supabase = {
  from: vi.fn(),
};
