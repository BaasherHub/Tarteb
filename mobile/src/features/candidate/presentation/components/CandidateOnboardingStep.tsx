import React, { RefObject } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { OnboardingProgress } from '@/shared/widgets/OnboardingProgress';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import { OnboardingDraftBanner } from '@/features/candidate/presentation/components/OnboardingDraftBanner';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
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
}: Props) {
  const { step, totalSteps } = useCandidateOnboarding();
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  const stepTitles = [
    t.onboardingStepPhotoTitle,
    t.onboardingStepRoleTitle,
    t.onboardingStep2Title,
    t.onboardingStep3Title,
    t.onboardingStep4Title,
  ];

  const body = scroll ? (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
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
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
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
        </View>
      </ContentWidth>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.scaffold },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.xl, paddingBottom: spacing.xxl },
  body: { flex: 1, padding: spacing.xl },
  footer: {
    padding: spacing.xl,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.scaffold,
    ...(Platform.OS === 'web'
      ? { position: 'relative' as const, zIndex: 10 }
      : {}),
  },
});

