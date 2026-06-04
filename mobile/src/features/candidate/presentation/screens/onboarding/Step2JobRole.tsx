import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import type { RoleSelectionSummary } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { FieldError } from '@/shared/widgets/FieldError';
import {
  JobRoleGrid,
  type JobRoleGridFilterState,
} from '@/shared/widgets/JobRoleGrid';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import type { RoleCategoryId } from '@/features/candidate/domain/constants/candidate';

export function Step2JobRole() {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { data, update, setStep } = useCandidateOnboarding();
  const [roleError, setRoleError] = useState<string | undefined>();
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<RoleCategoryId | null>(null);

  const filter: JobRoleGridFilterState = useMemo(
    () => ({
      query,
      categoryId,
      onQueryChange: setQuery,
      onCategoryChange: setCategoryId,
    }),
    [query, categoryId],
  );

  const roleSelectionSummary: RoleSelectionSummary | null = useMemo(() => {
    if (!data.role) return null;
    return { primary: data.role };
  }, [data.role]);

  const next = () => {
    if (!data.role) {
      setRoleError(t.errRole);
      return;
    }
    setRoleError(undefined);
    setStep(3);
  };

  const setPrimary = (role: string) => {
    update({ role });
    setRoleError(undefined);
  };

  return (
    <CandidateOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      backLabel={t.back}
      onBack={() => setStep(1)}
      roleSelectionSummary={roleSelectionSummary}
    >
      <Text style={[styles.intro, { textAlign: rtl.textAlign }]}>
        {t.candidatePickRoleHint}
      </Text>

      <Text style={[styles.pickerHint, { textAlign: rtl.textAlign }]}>
        {t.candidatePrimaryRoleHint}
      </Text>

      <JobRoleGrid
        filter={filter}
        selectionMode="single"
        selectedRole={data.role}
        onSelectRole={setPrimary}
      />

      <FieldError message={roleError} />
    </CandidateOnboardingStep>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  pickerHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
});
