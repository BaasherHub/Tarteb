import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { useLocale } from '../i18n/LocaleContext';

export function OnboardingProgress({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) {
  const { t } = useLocale();
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t.stepOf(step, totalSteps)}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(step / totalSteps) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingTop: 8 },
  label: { color: colors.textSecondary, marginBottom: 8, fontWeight: '500' },
  track: {
    height: 6,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.primary },
});
