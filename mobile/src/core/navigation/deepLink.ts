import type { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '@/core/navigation/types';
import { supabase } from '@/core/lib/supabase';
import {
  fetchAccountRole,
  parseDeepLinkIntent,
  type AccountRole,
  type DeepLinkIntent,
} from '@/core/navigation/deepLinkRole';

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

export function getPendingDeepLink(): string | null {
  return pendingUrl;
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

function navigateIntent(
  ref: NavigationContainerRef<RootStackParamList>,
  intent: DeepLinkIntent,
  role: AccountRole | null,
): boolean {
  if (intent.kind === 'candidateDetail') {
    if (role === 'employer') {
      ref.navigate('CandidateDetail', { candidateId: intent.candidateId });
      return true;
    }
    ref.navigate('CandidateShell', { screen: 'HomeTab' });
    return true;
  }

  if (intent.kind === 'employerTab') {
    if (role === 'employer') {
      ref.navigate('EmployerShell', { screen: intent.tab });
      return true;
    }
    ref.navigate('CandidateShell', { screen: 'HomeTab' });
    return true;
  }

  if (intent.kind === 'candidateTab') {
    if (role === 'candidate') {
      ref.navigate('CandidateShell', { screen: intent.tab });
      return true;
    }
    ref.navigate('EmployerShell', { screen: 'BrowseTab' });
    return true;
  }

  return false;
}

export async function navigateFromUrl(
  ref: NavigationContainerRef<RootStackParamList>,
  url: string,
): Promise<boolean> {
  if (!ref.isReady()) {
    stashPendingDeepLink(url);
    return false;
  }

  const intent = parseDeepLinkIntent(url);
  if (!intent) return false;

  let role: AccountRole | null;
  try {
    role = await fetchAccountRole();
  } catch {
    stashPendingDeepLink(url);
    return false;
  }
  if (!role) {
    stashPendingDeepLink(url);
    const { data } = await supabase.auth.getUser();
    ref.reset({
      index: 0,
      routes: [{ name: data.user ? 'RoleSelection' : 'PhoneOtp' }],
    });
    return false;
  }

  const ok = navigateIntent(ref, intent, role);
  if (ok) clearPendingDeepLink();
  return ok;
}

export function flushPendingDeepLink(
  ref: NavigationContainerRef<RootStackParamList>,
): void {
  if (!pendingUrl) return;
  const url = pendingUrl;
  void navigateFromUrl(ref, url).then((ok) => {
    if (ok) clearPendingDeepLink();
  });
}

export function handlePushPayload(
  ref: NavigationContainerRef<RootStackParamList>,
  data: PushPayload,
): void {
  const url = payloadToUrl(data);
  if (url) void navigateFromUrl(ref, url);
}
