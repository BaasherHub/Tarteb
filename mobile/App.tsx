import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { validateProductionConfig } from '@/core/config/env';
import { LocaleProvider } from '@/core/i18n/LocaleContext';
import { AppErrorBoundary } from '@/core/providers/AppErrorBoundary';
import { AuthProvider } from '@/core/providers/AuthProvider';
import { PushNotificationsProvider } from '@/core/providers/PushNotificationsProvider';
import { ToastProvider } from '@/core/providers/ToastProvider';
import { NotificationToastBridge } from '@/core/providers/NotificationToastBridge';
import { RootNavigator } from '@/core/navigation/RootNavigator';

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    const issues = validateProductionConfig();
    if (issues.length > 0) {
      console.warn('[Tarteb] Production config issues:\n', issues.join('\n'));
    }
  }, []);

  return (
    <SafeAreaProvider>
      <LocaleProvider>
        <AppErrorBoundary>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <ToastProvider>
                <NotificationToastBridge />
                <PushNotificationsProvider>
                  <RootNavigator />
                  <StatusBar style="auto" />
                </PushNotificationsProvider>
              </ToastProvider>
            </QueryClientProvider>
          </AuthProvider>
        </AppErrorBoundary>
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
