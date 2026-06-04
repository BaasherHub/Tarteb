import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'tarteb.pendingAccountRole';

export type PendingAccountRole = 'candidate' | 'employer';

export async function setPendingAccountRole(
  role: PendingAccountRole,
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, role);
}

export async function getPendingAccountRole(): Promise<PendingAccountRole | null> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  if (value === 'candidate' || value === 'employer') return value;
  return null;
}

export async function clearPendingAccountRole(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
