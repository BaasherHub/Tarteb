import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

type Props = {
  step: number;
  totalSteps: number;
  stepTitles: readonly string[];
  accentColor?: string;
};

export function OnboardingProgress({
  step,
  totalSteps,
  stepTitles,
  accentColor = colors.primary,
}: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const stepTitle = stepTitles[step - 1] ?? '';

  return (
    <View style={styles.wrap}>
      <View style={[styles.meta, rtl.row]}>
        <Text style={[styles.stepLabel, { textAlign: rtl.textAlign }]}>
          {t.stepOf(step, totalSteps)}
        </Text>
        {stepTitle ? (
          <Text
            style={[styles.stepName, { textAlign: rtl.textAlignEnd, color: accentColor }]}
            numberOfLines={1}
          >
            {stepTitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.dots, rtl.row]}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <View
              key={n}
              style={[
                styles.dot,
                done && styles.dotDone,
                active && [styles.dotActive, { backgroundColor: accentColor }],
              ]}
              accessibilityLabel={t.stepOf(n, totalSteps)}
            />
          );
        })}
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${(step / totalSteps) * 100}%`, backgroundColor: accentColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  meta: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  stepLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  stepName: {
    ...typography.caption,
    fontWeight: '700',
    flex: 1,
  },
  dots: {
    gap: 6,
    marginBottom: spacing.sm,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.divider,
  },
  dotDone: { backgroundColor: colors.secondary },
  dotActive: { width: 22 },
  track: {
    height: 4,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
});
