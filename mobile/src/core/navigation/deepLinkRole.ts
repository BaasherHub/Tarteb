import * as Linking from 'expo-linking';
import { supabase } from '@/core/lib/supabase';

export type AccountRole = 'candidate' | 'employer';

export async function fetchAccountRole(): Promise<AccountRole | null> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data?.role) return null;
  if (data.role === 'candidate' || data.role === 'employer') {
    return data.role;
  }
  return null;
}

export type DeepLinkIntent =
  | { kind: 'candidateDetail'; candidateId: string }
  | { kind: 'employerTab'; tab: 'BrowseTab' | 'UnlocksTab' | 'SettingsTab' }
  | { kind: 'candidateTab'; tab: 'HomeTab' | 'SettingsTab' };

function candidateIdFromUrl(url: string): string | null {
  const parsed = Linking.parse(url);
  const pathParts = (parsed.path ?? '').split('/').filter(Boolean);
  if (pathParts[0] === 'candidate' && pathParts[1]) return pathParts[1];
  if (parsed.hostname === 'candidate' && pathParts[0]) return pathParts[0];
  const q = parsed.queryParams?.candidateId;
  return typeof q === 'string' ? q : null;
}

export function parseDeepLinkIntent(url: string): DeepLinkIntent | null {
  const candidateId = candidateIdFromUrl(url);
  if (candidateId) {
    return { kind: 'candidateDetail', candidateId };
  }

  const parsed = Linking.parse(url);
  const pathParts = (parsed.path ?? '').split('/').filter(Boolean);
  const host = parsed.hostname ?? pathParts[0] ?? '';

  if (host === 'subscription' || pathParts[0] === 'subscription') {
    return { kind: 'employerTab', tab: 'BrowseTab' };
  }
  if (host === 'browse' || pathParts[0] === 'browse') {
    return { kind: 'employerTab', tab: 'BrowseTab' };
  }
  if (host === 'unlocks' || pathParts[0] === 'unlocks') {
    return { kind: 'employerTab', tab: 'UnlocksTab' };
  }
  if (host === 'employer-settings' || pathParts[0] === 'employer-settings') {
    return { kind: 'employerTab', tab: 'SettingsTab' };
  }
  if (host === 'dashboard' || pathParts[0] === 'dashboard') {
    return { kind: 'candidateTab', tab: 'HomeTab' };
  }
  if (host === 'settings' || pathParts[0] === 'settings') {
    return { kind: 'candidateTab', tab: 'SettingsTab' };
  }

  return null;
}
