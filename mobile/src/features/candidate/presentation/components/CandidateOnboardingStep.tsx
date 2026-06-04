import React, { RefObject } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { typography } from '@/core/theme/typography';
import { layout, layoutStyles } from '@/core/theme/layout';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { ScreenFooter } from '@/shared/widgets/ScreenFooter';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { OnboardingProgress } from '@/shared/widgets/OnboardingProgress';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import { OnboardingDraftBanner } from '@/features/candidate/presentation/components/OnboardingDraftBanner';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';

export type OnboardingSelectionSummary = {
  label: string;
  value: string;
};

export type RoleSelectionSummary = {
  primary: string;
};

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  /** @deprecated Use roleSelectionSummary */
  selectionSummary?: OnboardingSelectionSummary | null;
  roleSelectionSummary?: RoleSelectionSummary | null;
  primaryLabel: string;
  onPrimary: () => void | Promise<void>;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  secondaryDisabled?: boolean;
  backLabel?: string;
  onBack?: () => void;
  scrollRef?: RefObject<ScrollView | null>;
};

export function CandidateOnboardingStep({
  children,
  scroll = true,
  contentStyle,
  primaryLabel,
  onPrimary,
  primaryLoading,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
  secondaryDisabled,
  backLabel,
  onBack,
  scrollRef,
  selectionSummary,
  roleSelectionSummary,
}: Props) {
  const { step, totalSteps } = useCandidateOnboarding();
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const stepTitles = [
    t.onboardingStepPhotoTitle,
    t.onboardingStepRoleTitle,
    t.onboardingStepLocationTitle,
    t.onboardingStepSalaryVisaTitle,
    t.onboardingStepExperienceTitle,
  ];

  const body = scroll ? (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.body, contentStyle]}>{children}</View>
  );

  return (
    <View style={styles.flex}>
      <ContentWidth style={styles.flex} variant="plain">
        <OnboardingProgress
          step={step}
          totalSteps={totalSteps}
          stepTitles={stepTitles}
        />
        <OnboardingDraftBanner />
        {body}
        <ScreenFooter>
          {roleSelectionSummary ? (
            <View style={[styles.selectionBar, rtl.row]}>
              <Text style={[styles.selectionLabel, { textAlign: rtl.textAlign }]}>
                {t.roleSelectedPrimary}
              </Text>
              <Text
                style={[styles.selectionValue, { textAlign: rtl.textAlignEnd }]}
                numberOfLines={1}
              >
                {roleSelectionSummary.primary}
              </Text>
            </View>
          ) : selectionSummary ? (
            <View style={[styles.selectionBar, rtl.row]}>
              <Text
                style={[styles.selectionLabel, { textAlign: rtl.textAlign }]}
                numberOfLines={1}
              >
                {selectionSummary.label}
              </Text>
              <Text
                style={[styles.selectionValue, { textAlign: rtl.textAlignEnd }]}
                numberOfLines={1}
              >
                {selectionSummary.value}
              </Text>
            </View>
          ) : null}
          {backLabel && onBack && step > 1 ? (
            <SecondaryButton label={backLabel} onPress={onBack} />
          ) : null}
          <PrimaryButton
            label={primaryLabel}
            onPress={onPrimary}
            loading={primaryLoading}
            disabled={primaryDisabled}
          />
          {secondaryLabel && onSecondary ? (
            <SecondaryButton
              label={secondaryLabel}
              onPress={onSecondary}
              disabled={secondaryDisabled || primaryLoading}
            />
          ) : null}
        </ScreenFooter>
      </ContentWidth>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.scaffold },
  scroll: { flex: 1 },
  scrollContent: { ...layoutStyles.screenContent, paddingBottom: spacing.xxl },
  body: { flex: 1, ...layoutStyles.screenContent },
  selectionBar: {
    backgroundColor: colors.primaryTint,
    borderRadius: layout.cardRadius,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    marginBottom: spacing.xs,
  },
  selectionRow: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    flexShrink: 0,
  },
  selectionValue: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
    flex: 1,
  },
});

