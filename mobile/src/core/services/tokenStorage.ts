import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCESS: '@tarteb/access_token',
  REFRESH: '@tarteb/refresh_token',
  USER: '@tarteb/user',
};

export type StoredUser = { id: string; phone: string };

export async function storeSession(
  accessToken: string,
  refreshToken: string,
  user: StoredUser,
): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.ACCESS, accessToken],
    [KEYS.REFRESH, refreshToken],
    [KEYS.USER, JSON.stringify(user)],
  ]);
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.ACCESS, KEYS.REFRESH, KEYS.USER]);
}

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.ACCESS);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.REFRESH);
}

export async function getStoredUser(): Promise<StoredUser | null> {
  const json = await AsyncStorage.getItem(KEYS.USER);
  if (!json) return null;
  try {
    return JSON.parse(json) as StoredUser;
  } catch {
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getStoredUser();
  return user?.id ?? null;
}

export async function hasSession(): Promise<boolean> {
  const token = await getAccessToken();
  return token !== null;
}
