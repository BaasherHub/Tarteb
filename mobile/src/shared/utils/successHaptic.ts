import { Platform } from 'react-native';

/** Light success haptic on OTP verify — no-op on web or if module unavailable. */
export async function playSuccessHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const Haptics = await import('expo-haptics');
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    );
  } catch {
    // Simulator or missing native module — ignore
  }
}
