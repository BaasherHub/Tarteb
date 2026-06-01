import { supabase } from '../lib/supabase';

export type EmployerAccount = {
  id: string;
  email: string;
  subscriptionEndsAt: Date | null;
};

export async function fetchEmployerAccount(): Promise<EmployerAccount> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not signed in');

  const { data, error } = await supabase
    .from('employers')
    .select('id, email, subscription_ends_at')
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  const raw = data.subscription_ends_at as string | null;
  return {
    id: data.id as string,
    email: (data.email as string) ?? '',
    subscriptionEndsAt: raw ? new Date(raw) : null,
  };
}

export function hasActiveSubscription(endsAt: Date | null): boolean {
  if (!endsAt) return false;
  return endsAt.getTime() > Date.now();
}
