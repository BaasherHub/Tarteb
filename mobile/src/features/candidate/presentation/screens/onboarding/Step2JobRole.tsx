import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { FieldError } from '@/shared/widgets/FieldError';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { JobRoleGrid } from '@/shared/widgets/JobRoleGrid';

export function Step2JobRole() {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { data, update, setStep } = useCandidateOnboarding();
  const [roleError, setRoleError] = useState<string | undefined>();

  const next = () => {
    if (!data.role) {
      setRoleError(t.errRole);
      return;
    }
    setRoleError(undefined);
    setStep(3);
  };

  return (
    <CandidateOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      backLabel={t.back}
      onBack={() => setStep(1)}
    >
      <Text style={[styles.title, { textAlign: rtl.textAlign }]}>{t.onboardingStepRoleTitle}</Text>
      <Text style={[styles.intro, { textAlign: rtl.textAlign }]}>{t.candidatePickRoleHint}</Text>
      <JobRoleGrid
        selectedRole={data.role}
        onSelectRole={(role) => {
          update({ role });
          setRoleError(undefined);
        }}
      />
      <FieldError message={roleError} />
    </CandidateOnboardingStep>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, marginBottom: spacing.sm },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
});
