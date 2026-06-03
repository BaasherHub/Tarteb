import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'employer_subscription_pending_at';
const PENDING_HOURS = 72;

export async function markSubscriptionPending(): Promise<void> {
  await AsyncStorage.setItem(KEY, new Date().toISOString());
}

export async function clearSubscriptionPending(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

export async function getSubscriptionPendingAt(): Promise<Date | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isSubscriptionPending(
  pendingAt: Date | null,
  subscriptionActive: boolean,
): boolean {
  if (subscriptionActive || !pendingAt) return false;
  const elapsed = Date.now() - pendingAt.getTime();
  return elapsed < PENDING_HOURS * 60 * 60 * 1000;
}
