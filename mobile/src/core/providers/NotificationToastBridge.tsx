import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useToast } from '@/core/providers/ToastProvider';
import type { PushPayload } from '@/core/navigation/deepLink';

/** In-app toast when a push arrives while the app is foregrounded. */
export function NotificationToastBridge() {
  const { t } = useLocale();
  const { showToast } = useToast();

  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data as PushPayload;
      const body = notification.request.content.body;
      const title = notification.request.content.title;

      let message = body ?? title ?? '';
      let variant: 'default' | 'success' = 'default';

      switch (data?.type) {
        case 'unlock':
          message = t.toastNewUnlock;
          variant = 'success';
          break;
        case 'job':
        case 'dashboard':
          message = body ?? t.toastProfileViewed;
          break;
        case 'subscription':
          message = t.toastSubscriptionActive;
          variant = 'success';
          break;
        case 'candidate':
          message = body ?? title ?? message;
          break;
        default:
          break;
      }

      if (!message) return;
      showToast({ message, variant });
    });

    return () => sub.remove();
  }, [showToast, t]);

  return null;
}
