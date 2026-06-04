import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';
import { supabase } from '@/core/lib/supabase';
import type { Strings } from '@/core/i18n/strings';

const PUSH_PROMPT_KEY = '@tarteb/push_permission_prompted';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Tarteb',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
  });
}

function expoProjectId(): string | undefined {
  return Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
}

export async function registerPushToken(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  await ensureAndroidChannel();

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return false;

  const projectId = expoProjectId();
  const token = (
    await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    )
  ).data;
  if (!token) return false;

  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return false;

  await supabase
    .from('profiles')
    .update({ push_token: token })
    .eq('user_id', userId);

  return true;
}

/** Register token only if permission already granted (no system dialog). */
export async function registerPushTokenIfGranted(): Promise<void> {
  if (Platform.OS === 'web') return;
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') {
    await registerPushToken();
  }
}

export async function clearPushToken(): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return;
  await supabase
    .from('profiles')
    .update({ push_token: null })
    .eq('user_id', userId);
}

export async function wasPushPromptShown(): Promise<boolean> {
  return (await AsyncStorage.getItem(PUSH_PROMPT_KEY)) === '1';
}

/**
 * Ask once (pre-dialog + system permission) after onboarding or first candidate view.
 */
export async function promptForPushNotifications(t: Strings): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (await wasPushPromptShown()) {
    await registerPushTokenIfGranted();
    return false;
  }

  await AsyncStorage.setItem(PUSH_PROMPT_KEY, '1');

  return new Promise((resolve) => {
    Alert.alert(t.notificationPermissionTitle, t.notificationPermissionMessage, [
      {
        text: t.notificationNotNow,
        style: 'cancel',
        onPress: () => {
          void registerPushTokenIfGranted();
          resolve(false);
        },
      },
      {
        text: t.notificationAllow,
        onPress: () => {
          void registerPushToken().then((ok) => resolve(ok));
        },
      },
    ]);
  });
}
