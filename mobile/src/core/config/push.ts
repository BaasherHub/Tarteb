import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** Set in app.config when google-services.json is present (Android FCM). */
export function isAndroidFcmConfigured(): boolean {
  return Constants.expoConfig?.extra?.fcmConfigured === true;
}

/** Native Expo push token registration is supported on this platform/build. */
export function canRegisterNativePushToken(): boolean {
  if (Platform.OS === 'web') return false;
  if (Platform.OS === 'ios') return true;
  return isAndroidFcmConfigured();
}

export function isFirebaseMessagingConfigError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('firebase messaging') ||
    lower.includes('googleservices') ||
    lower.includes('google-services') ||
    lower.includes('default firebaseapp is not initialized')
  );
}
