import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';

export function OnboardingDraftBanner() {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { isEditMode, draftSavedAt, draftError, discardDraft } = useCandidateOnboarding();

  if (isEditMode || (!draftSavedAt && !draftError)) return null;

  return (
    <View style={[styles.row, rtl.row]}>
      <Text style={[styles.text, draftError && styles.error]}>
        {draftError ? t.errorGeneric : t.draftSavedBanner}
      </Text>
      <Pressable onPress={discardDraft} accessibilityRole="button" style={styles.discardBtn}>
        <Text style={styles.discard}>{t.discardDraftLink}</Text>
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
  discardBtn: { minHeight: 44, justifyContent: 'center' },
  discard: { fontSize: 12, color: colors.textSecondary, textDecorationLine: 'underline' },
  error: { color: colors.error },
});
