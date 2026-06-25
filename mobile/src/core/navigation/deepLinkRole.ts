import * as Linking from 'expo-linking';
import { api } from '@/core/lib/api';
import { getCurrentUserId } from '@/core/services/tokenStorage';

export type AccountRole = 'candidate' | 'employer';

export async function fetchAccountRole(): Promise<AccountRole | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  try {
    const result = await api.profiles.me();
    const role = result?.profile?.role;
    if (role === 'candidate' || role === 'employer') return role;
  } catch {
    // ignore — return null
  }
  return null;
}

export type DeepLinkIntent =
  | { kind: 'candidateDetail'; candidateId: string }
  | { kind: 'employerTab'; tab: 'BrowseTab' | 'UnlocksTab' | 'SettingsTab' }
  | { kind: 'candidateTab'; tab: 'HomeTab' | 'SettingsTab' }
  | { kind: 'candidateOnboarding'; startStep?: number };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function candidateIdFromUrl(url: string): string | null {
  const parsed = Linking.parse(url);
  const pathParts = (parsed.path ?? '').split('/').filter(Boolean);
  let id: string | null = null;
  if (pathParts[0] === 'candidate' && pathParts[1]) id = pathParts[1];
  else if (parsed.hostname === 'candidate' && pathParts[0]) id = pathParts[0];
  else {
    const q = parsed.queryParams?.candidateId;
    id = typeof q === 'string' ? q : null;
  }
  return id && UUID_RE.test(id) ? id : null;
}

export function parseDeepLinkIntent(url: string): DeepLinkIntent | null {
  const candidateId = candidateIdFromUrl(url);
  if (candidateId) {
    return { kind: 'candidateDetail', candidateId };
  }

  const parsed = Linking.parse(url);
  const pathParts = (parsed.path ?? '').split('/').filter(Boolean);
  const host = parsed.hostname ?? pathParts[0] ?? '';
  const firstPath = pathParts[0] ?? '';
  const normalizedHost = host.toLowerCase();
  const normalizedFirstPath = firstPath.toLowerCase();

  if (
    normalizedHost === 'candidateonboarding' ||
    normalizedFirstPath === 'candidateonboarding'
  ) {
    const rawStartStep = parsed.queryParams?.startStep;
    const startStep =
      typeof rawStartStep === 'string' ? Number.parseInt(rawStartStep, 10) : undefined;
    return {
      kind: 'candidateOnboarding',
      startStep:
        typeof startStep === 'number' && Number.isFinite(startStep)
          ? startStep
          : undefined,
    };
  }

  if (normalizedHost === 'subscription' || normalizedFirstPath === 'subscription') {
    return { kind: 'employerTab', tab: 'BrowseTab' };
  }
  if (normalizedHost === 'browse' || normalizedFirstPath === 'browse') {
    return { kind: 'employerTab', tab: 'BrowseTab' };
  }
  if (normalizedHost === 'unlocks' || normalizedFirstPath === 'unlocks') {
    return { kind: 'employerTab', tab: 'UnlocksTab' };
  }
  if (normalizedHost === 'employer-settings' || normalizedFirstPath === 'employer-settings') {
    return { kind: 'employerTab', tab: 'SettingsTab' };
  }
  if (normalizedHost === 'dashboard' || normalizedFirstPath === 'dashboard') {
    return { kind: 'candidateTab', tab: 'HomeTab' };
  }
  if (normalizedHost === 'settings' || normalizedFirstPath === 'settings') {
    return { kind: 'candidateTab', tab: 'SettingsTab' };
  }

  return null;
}
