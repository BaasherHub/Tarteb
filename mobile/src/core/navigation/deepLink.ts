import * as Linking from 'expo-linking';
import type { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '@/core/navigation/types';

export type PushPayload = {
  url?: string;
  type?: 'candidate' | 'subscription' | 'unlock' | 'browse' | 'job' | 'dashboard';
  candidateId?: string;
  success?: string | boolean;
};

let pendingUrl: string | null = null;

export function stashPendingDeepLink(url: string): void {
  pendingUrl = url;
}

export function clearPendingDeepLink(): void {
  pendingUrl = null;
}

function parseSuccess(value: unknown): boolean {
  return value === true || value === '1' || value === 'true';
}

/** Map push data payload → tarteb:// URL. */
export function payloadToUrl(data: PushPayload): string | null {
  if (data.url && typeof data.url === 'string') {
    return data.url;
  }
  switch (data.type) {
    case 'candidate':
      if (data.candidateId) return `tarteb://candidate/${data.candidateId}`;
      break;
    case 'subscription':
      return 'tarteb://browse';
    case 'unlock':
      if (data.candidateId) return `tarteb://candidate/${data.candidateId}`;
      return 'tarteb://unlocks';
    case 'browse':
      return 'tarteb://browse';
    case 'dashboard':
    case 'job':
      return 'tarteb://dashboard';
    default:
      break;
  }
  return null;
}

function candidateIdFromUrl(url: string): string | null {
  const parsed = Linking.parse(url);
  const pathParts = (parsed.path ?? '').split('/').filter(Boolean);
  if (pathParts[0] === 'candidate' && pathParts[1]) return pathParts[1];
  if (parsed.hostname === 'candidate' && pathParts[0]) return pathParts[0];
  const q = parsed.queryParams?.candidateId;
  return typeof q === 'string' ? q : null;
}

export function navigateFromUrl(
  ref: NavigationContainerRef<RootStackParamList>,
  url: string,
): boolean {
  if (!ref.isReady()) {
    stashPendingDeepLink(url);
    return false;
  }

  const parsed = Linking.parse(url);
  const pathParts = (parsed.path ?? '').split('/').filter(Boolean);
  const host = parsed.hostname ?? pathParts[0] ?? '';

  const candidateId = candidateIdFromUrl(url);
  if (candidateId) {
    ref.navigate('CandidateDetail', { candidateId });
    clearPendingDeepLink();
    return true;
  }

  if (host === 'subscription' || pathParts[0] === 'subscription') {
    ref.navigate('EmployerShell', { screen: 'BrowseTab' });
    clearPendingDeepLink();
    return true;
  }

  if (host === 'browse' || pathParts[0] === 'browse') {
    ref.navigate('EmployerShell', { screen: 'BrowseTab' });
    clearPendingDeepLink();
    return true;
  }

  if (host === 'unlocks' || pathParts[0] === 'unlocks') {
    ref.navigate('EmployerShell', { screen: 'UnlocksTab' });
    clearPendingDeepLink();
    return true;
  }

  if (host === 'dashboard' || pathParts[0] === 'dashboard') {
    ref.navigate('CandidateShell', { screen: 'HomeTab' });
    clearPendingDeepLink();
    return true;
  }

  if (host === 'settings' || pathParts[0] === 'settings') {
    ref.navigate('CandidateShell', { screen: 'SettingsTab' });
    clearPendingDeepLink();
    return true;
  }

  if (host === 'employer-settings' || pathParts[0] === 'employer-settings') {
    ref.navigate('EmployerShell', { screen: 'SettingsTab' });
    clearPendingDeepLink();
    return true;
  }

  return false;
}

export function flushPendingDeepLink(
  ref: NavigationContainerRef<RootStackParamList>,
): void {
  if (!pendingUrl) return;
  const url = pendingUrl;
  if (navigateFromUrl(ref, url)) {
    clearPendingDeepLink();
  }
}

export function handlePushPayload(
  ref: NavigationContainerRef<RootStackParamList>,
  data: PushPayload,
): void {
  const url = payloadToUrl(data);
  if (url) navigateFromUrl(ref, url);
}
