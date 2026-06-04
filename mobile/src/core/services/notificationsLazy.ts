import type * as ExpoNotifications from 'expo-notifications';

type NotificationsModule = typeof ExpoNotifications;

let modulePromise: Promise<NotificationsModule> | null = null;
let handlerReady = false;

/** Avoid loading expo-notifications native FCM until needed (Android dev without google-services). */
export function getNotificationsModule(): Promise<NotificationsModule> {
  if (!modulePromise) {
    modulePromise = import('expo-notifications');
  }
  return modulePromise;
}

export async function ensureNotificationHandler(): Promise<NotificationsModule> {
  const Notifications = await getNotificationsModule();
  if (!handlerReady) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerReady = true;
  }
  return Notifications;
}
