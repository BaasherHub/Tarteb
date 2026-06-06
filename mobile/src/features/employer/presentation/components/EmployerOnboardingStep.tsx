import React, { RefObject } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { layoutStyles } from '@/core/theme/layout';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { ScreenFooter } from '@/shared/widgets/ScreenFooter';
import { ContentWidth } from '@/shared/widgets/ContentWidth';
import { OnboardingProgress } from '@/shared/widgets/OnboardingProgress';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { SecondaryButton } from '@/shared/widgets/SecondaryButton';
import { useEmployerOnboarding } from '@/features/employer/providers/EmployerOnboardingContext';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  primaryLabel: string;
  onPrimary: () => void | Promise<void>;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  backLabel?: string;
  onBack?: () => void;
  scrollRef?: RefObject<ScrollView | null>;
};

export function EmployerOnboardingStep({
  children,
  scroll = true,
  contentStyle,
  primaryLabel,
  onPrimary,
  primaryLoading,
  primaryDisabled,
  backLabel,
  onBack,
  scrollRef,
}: Props) {
  const { t } = useLocale();
  const { step, totalSteps } = useEmployerOnboarding();
  const stepTitles = [t.employerOnboardingStep1Title, t.employerOnboardingStep2Title];

  const body = scroll ? (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.stepContent}>{children}</View>
    </ScrollView>
  ) : (
    <View style={[styles.body, contentStyle]}>
      <View style={styles.stepContent}>{children}</View>
    </View>
  );

  return (
    <View style={styles.flex}>
      <ContentWidth style={styles.flex} variant="plain">
        <OnboardingProgress
          step={step}
          totalSteps={totalSteps}
          stepTitles={stepTitles}
          accentColor={colors.secondary}
        />
        {body}
        <ScreenFooter>
          {backLabel && onBack && step > 1 ? (
            <SecondaryButton label={backLabel} onPress={onBack} />
          ) : null}
          <PrimaryButton
            label={primaryLabel}
            onPress={onPrimary}
            loading={primaryLoading}
            disabled={primaryDisabled}
          />
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
  stepContent: { gap: spacing.lg },
});
