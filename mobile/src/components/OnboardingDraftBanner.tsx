import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCandidateOnboarding } from '../context/CandidateOnboardingContext';
import { useRtlStyles } from '../hooks/useRtlStyles';
import { colors } from '../constants/colors';

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
