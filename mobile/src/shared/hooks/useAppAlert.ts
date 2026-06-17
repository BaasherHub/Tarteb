import { Alert, Platform } from 'react-native';
import { useToast } from '@/core/providers/ToastProvider';

/** Error feedback that works on web (toast) and native (Alert). */
export function useAppAlert() {
  const { showToast } = useToast();

  const showError = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      showToast({
        message: message.trim() ? `${title}: ${message}` : title,
        variant: 'error',
        durationMs: 5000,
      });
      return;
    }
    Alert.alert(title, message);
  };

  return { showError };
}
