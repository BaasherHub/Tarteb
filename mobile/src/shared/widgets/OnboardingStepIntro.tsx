import { StyleSheet, Text } from 'react-native';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';

type Props = {
  children: string;
};

/** Shared intro copy at the top of onboarding steps (job seeker and employer). */
export function OnboardingStepIntro({ children }: Props) {
  const rtl = useRtlStyles();
  return (
    <Text
      style={[onboardingStepStyles.intro, { textAlign: rtl.textAlign }]}
      maxFontSizeMultiplier={1.5}
    >
      {children}
    </Text>
  );
}

export const onboardingStepStyles = StyleSheet.create({
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  formCard: {
    gap: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chipCell: {
    flexBasis: '47%',
    flexGrow: 1,
  },
});
