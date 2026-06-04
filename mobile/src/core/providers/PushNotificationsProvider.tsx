import React, { useEffect } from 'react';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import {
  handlePushPayload,
  navigateFromUrl,
  type PushPayload,
} from '@/core/navigation/deepLink';
import { navigationRef } from '@/core/navigation/navigationRef';
import { ensureAndroidChannel } from '@/core/services/notifications';

type Props = { children: React.ReactNode };

export function PushNotificationsProvider({ children }: Props) {
  useEffect(() => {
    void ensureAndroidChannel();

    const onUrl = ({ url }: { url: string }) => {
      if (navigationRef.isReady()) {
        navigateFromUrl(navigationRef, url);
      }
    };

    const urlSub = Linking.addEventListener('url', onUrl);

    void Linking.getInitialURL().then((url) => {
      if (url && navigationRef.isReady()) {
        navigateFromUrl(navigationRef, url);
      }
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as PushPayload;
        handlePushPayload(navigationRef, data);
      },
    );

    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = response.notification.request.content.data as PushPayload;
      handlePushPayload(navigationRef, data);
    });

    return () => {
      urlSub.remove();
      responseSub.remove();
    };
  }, []);

  return <>{children}</>;
}
