import AsyncStorage from '@react-native-async-storage/async-storage';
import type { QueryClient } from '@tanstack/react-query';
import { api } from '@/core/lib/api';
import { LANGUAGE_SELECTION_DONE_KEY } from '@/core/i18n/LocaleContext';
import { clearPushToken } from '@/core/services/notifications';
import { clearSession } from '@/core/services/tokenStorage';
import { clearAllBrowseCache } from '@/features/employer/data/services/browseCache';

type LogoutOptions = {
  queryClient?: QueryClient;
};

export async function logoutAndClearLocalState({
  queryClient,
}: LogoutOptions = {}): Promise<void> {
  await clearPushToken().catch(() => {});
  await clearAllBrowseCache().catch(() => {});
  await AsyncStorage.removeItem(LANGUAGE_SELECTION_DONE_KEY).catch(() => {});
  await api.auth.logout().catch(() => {});
  await clearSession();
  queryClient?.clear();
}
