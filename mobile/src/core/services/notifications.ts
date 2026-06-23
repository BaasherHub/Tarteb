import AsyncStorage from '@react-native-async-storage/async-storage';

import Constants from 'expo-constants';

import { Alert, Platform } from 'react-native';

import {

  canRegisterNativePushToken,

  isFirebaseMessagingConfigError,

} from '@/core/config/push';

import { ensureNotificationHandler } from '@/core/services/notificationsLazy';

import { supabase } from '@/core/lib/supabase';

import type { Strings } from '@/core/i18n/strings';

import { getErrorMessage } from '@/shared/utils/errors';



const PUSH_PROMPT_KEY = '@tarteb/push_permission_prompted';
const DASHBOARD_PUSH_PROMPT_KEY = '@tarteb/dashboard_push_prompted';



export async function ensureAndroidChannel(): Promise<void> {

  if (Platform.OS !== 'android') return;

  if (!canRegisterNativePushToken()) return;

  const Notifications = await ensureNotificationHandler();

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

  if (!canRegisterNativePushToken()) {

    if (__DEV__ && Platform.OS === 'android') {

      console.warn(

        '[Tarteb] Android push skipped — add google-services.json and rebuild. See docs/FCM.md',

      );

    }

    return false;

  }



  const Notifications = await ensureNotificationHandler();

  await ensureAndroidChannel();



  const { status: existing } = await Notifications.getPermissionsAsync();

  let finalStatus = existing;



  if (existing !== 'granted') {

    const { status } = await Notifications.requestPermissionsAsync();

    finalStatus = status;

  }



  if (finalStatus !== 'granted') return false;



  const projectId = expoProjectId();

  let token: string | undefined;

  try {

    token = (

      await Notifications.getExpoPushTokenAsync(

        projectId ? { projectId } : undefined,

      )

    ).data;

  } catch (e) {

    const msg = getErrorMessage(e, '');

    if (isFirebaseMessagingConfigError(msg)) {

      if (__DEV__) {

        console.warn('[Tarteb] Push token unavailable — configure FCM. See docs/FCM.md');

      }

      return false;

    }

    throw e;

  }

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

  if (!canRegisterNativePushToken()) return;

  const Notifications = await ensureNotificationHandler();

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

/** Ask once on first Profile tab visit (separate from onboarding prompt). */
export async function promptForPushOnFirstDashboardVisit(t: Strings): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if ((await AsyncStorage.getItem(DASHBOARD_PUSH_PROMPT_KEY)) === '1') {
    await registerPushTokenIfGranted();
    return false;
  }
  await AsyncStorage.setItem(DASHBOARD_PUSH_PROMPT_KEY, '1');
  if (await wasPushPromptShown()) {
    await registerPushTokenIfGranted();
    return false;
  }
  return promptForPushNotifications(t);
}

export type PushPromptAudience = 'candidate' | 'employer';

export async function promptForPushNotifications(
  t: Strings,
  audience: PushPromptAudience = 'candidate',
): Promise<boolean> {

  if (Platform.OS === 'web') return false;

  if (await wasPushPromptShown()) {

    await registerPushTokenIfGranted();

    return false;

  }



  await AsyncStorage.setItem(PUSH_PROMPT_KEY, '1');

  const message =
    audience === 'employer'
      ? t.employerNotificationPermissionMessage
      : t.notificationPermissionMessage;



  return new Promise((resolve) => {

    Alert.alert(t.notificationPermissionTitle, message, [

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

/** Returns true when the user has explicitly denied push permission at the OS level. */
export async function isPushPermissionDenied(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  if (!canRegisterNativePushToken()) return false;
  const Notifications = await ensureNotificationHandler();
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'denied';
}
