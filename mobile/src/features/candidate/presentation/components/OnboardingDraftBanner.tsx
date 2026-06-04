import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';

export function OnboardingDraftBanner() {
  const rtl = useRtlStyles();
  const { isEditMode, draftSavedAt, discardDraft } = useCandidateOnboarding();

  if (isEditMode || !draftSavedAt) return null;

  return (
    <View style={[styles.row, rtl.row]}>
      <Text style={styles.text}>Draft saved</Text>
      <Pressable onPress={discardDraft} accessibilityRole="button">
        <Text style={styles.discard}>Discard</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  text: { fontSize: 12, color: colors.textSecondary },
  discard: { fontSize: 12, color: colors.textSecondary, textDecorationLine: 'underline' },
});

