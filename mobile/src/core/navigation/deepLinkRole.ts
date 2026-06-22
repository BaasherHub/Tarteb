import * as Linking from 'expo-linking';
import { supabase } from '@/core/lib/supabase';

export type AccountRole = 'candidate' | 'employer';

export async function fetchAccountRole(): Promise<AccountRole | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data?.role) return null;
  if (data.role === 'candidate' || data.role === 'employer') {
    return data.role;
  }
  return null;
}

export type DeepLinkIntent =
  | { kind: 'candidateDetail'; candidateId: string }
  | { kind: 'employerTab'; tab: 'BrowseTab' | 'UnlocksTab' | 'SettingsTab' }
  | { kind: 'candidateTab'; tab: 'HomeTab' | 'SettingsTab' };

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
