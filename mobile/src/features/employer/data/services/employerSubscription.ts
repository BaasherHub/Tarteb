import { supabase } from '@/core/lib/supabase';

export type SubscriptionTier = 'starter' | 'business' | 'agency';

export const TIER_LIMITS: Record<SubscriptionTier, number | null> = {
  starter: 5,
  business: 25,
  agency: null, // unlimited
};

export const TIER_PRICES: Record<SubscriptionTier, string> = {
  starter: 'AED 79.9 / mo',
  business: 'AED 199 / mo',
  agency: 'AED 499 / mo',
};

export const TIER_LABELS: Record<SubscriptionTier, string> = {
  starter: 'Starter',
  business: 'Business',
  agency: 'Agency',
};

export type EmployerAccount = {
  id: string;
  email: string;
  subscriptionEndsAt: Date | null;
  subscriptionTier: SubscriptionTier;
  monthlyUnlocksUsed: number;
};

export async function fetchEmployerAccount(): Promise<EmployerAccount> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) throw new Error('Not signed in');

  const { data, error } = await supabase
    .from('employers')
    .select('id, email, subscription_ends_at, subscription_tier')
    .eq('user_id', userId)
    .single();

  if (error) throw error;

  const raw = data.subscription_ends_at as string | null;
  const tier = (data.subscription_tier as SubscriptionTier) ?? 'starter';

  // Fetch this month's unlock count
  const month = new Date();
  const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-01`;
  const { data: mu } = await supabase
    .from('monthly_unlocks')
    .select('count')
    .eq('employer_id', data.id)
    .eq('month', monthStr)
    .maybeSingle();

  return {
    id: data.id as string,
    email: (data.email as string) ?? '',
    subscriptionEndsAt: raw ? new Date(raw) : null,
    subscriptionTier: tier,
    monthlyUnlocksUsed: (mu?.count as number) ?? 0,
  };
}

export function hasActiveSubscription(endsAt: Date | null): boolean {
  if (!endsAt) return false;
  return endsAt.getTime() > Date.now();
}

export function monthlyUnlocksRemaining(account: EmployerAccount): number | null {
  const limit = TIER_LIMITS[account.subscriptionTier];
  if (limit === null) return null; // unlimited
  return Math.max(0, limit - account.monthlyUnlocksUsed);
}


