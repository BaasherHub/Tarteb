import { Platform } from 'react-native';

/** Light tap feedback for role cards and similar selections. */
export async function playSelectionHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const Haptics = await import('expo-haptics');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Simulator — ignore
  }
}
