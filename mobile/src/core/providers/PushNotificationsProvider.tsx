import React, { useEffect } from 'react';
import * as Linking from 'expo-linking';
import {
  handlePushPayload,
  navigateFromUrl,
  type PushPayload,
} from '@/core/navigation/deepLink';
import { navigationRef } from '@/core/navigation/navigationRef';
import { ensureAndroidChannel } from '@/core/services/notifications';
import { canRegisterNativePushToken } from '@/core/config/push';
import { getNotificationsModule } from '@/core/services/notificationsLazy';

type Props = { children: React.ReactNode };

export function PushNotificationsProvider({ children }: Props) {
  useEffect(() => {
    const onUrl = ({ url }: { url: string }) => {
      void navigateFromUrl(navigationRef, url);
    };

    const urlSub = Linking.addEventListener('url', onUrl);

    return () => urlSub.remove();
  }, []);

  useEffect(() => {
    if (!canRegisterNativePushToken()) return;

    let responseSub: { remove: () => void } | undefined;
    let cancelled = false;

    void (async () => {
      await ensureAndroidChannel();
      const Notifications = await getNotificationsModule();
      if (cancelled) return;

      responseSub = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data = response.notification.request.content.data as PushPayload;
          handlePushPayload(navigationRef, data);
        },
      );

      const last = await Notifications.getLastNotificationResponseAsync();
      if (last) {
        const data = last.notification.request.content.data as PushPayload;
        handlePushPayload(navigationRef, data);
      }
    })();

    return () => {
      cancelled = true;
      responseSub?.remove();
    };
  }, []);

  return <>{children}</>;
}
