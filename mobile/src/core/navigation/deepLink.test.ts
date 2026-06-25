import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearPendingDeepLink,
  getPendingDeepLink,
  navigateFromUrl,
} from './deepLink';
import { fetchAccountRole } from '@/core/navigation/deepLinkRole';
import { hasSession } from '@/core/services/tokenStorage';

vi.mock('@/core/navigation/deepLinkRole', () => ({
  fetchAccountRole: vi.fn(),
  parseDeepLinkIntent: vi.fn(() => ({ kind: 'candidateTab', tab: 'HomeTab' })),
}));

vi.mock('@/core/services/tokenStorage', () => ({
  hasSession: vi.fn(),
}));

function createRef() {
  return {
    isReady: vi.fn(() => true),
    navigate: vi.fn(),
    reset: vi.fn(),
  };
}

describe('deep link navigation', () => {
  beforeEach(() => {
    clearPendingDeepLink();
    vi.clearAllMocks();
  });

  it('routes no-role deep links to auth when there is no session', async () => {
    vi.mocked(fetchAccountRole).mockResolvedValue(null);
    vi.mocked(hasSession).mockResolvedValue(false);
    const ref = createRef();

    const result = await navigateFromUrl(ref as never, 'tarteb://dashboard');

    expect(result).toBe(false);
    expect(getPendingDeepLink()).toBe('tarteb://dashboard');
    expect(ref.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'PhoneOtp' }],
    });
  });

  it('routes signed-in no-role deep links to role selection', async () => {
    vi.mocked(fetchAccountRole).mockResolvedValue(null);
    vi.mocked(hasSession).mockResolvedValue(true);
    const ref = createRef();

    const result = await navigateFromUrl(ref as never, 'tarteb://dashboard');

    expect(result).toBe(false);
    expect(getPendingDeepLink()).toBe('tarteb://dashboard');
    expect(ref.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'RoleSelection' }],
    });
  });
});
