import React, { useMemo, useState } from 'react';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import type { RoleSelectionSummary } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { OnboardingStepIntro } from '@/features/candidate/presentation/components/OnboardingStepIntro';
import { useLocale } from '@/core/i18n/LocaleContext';
import { FieldError } from '@/shared/widgets/FieldError';
import {
  JobRoleGrid,
  type JobRoleGridFilterState,
} from '@/shared/widgets/JobRoleGrid';
import { SectionHint, SectionLabel } from '@/shared/widgets/SectionLabel';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import type { RoleCategoryId } from '@/features/candidate/domain/constants/candidate';

export function Step2JobRole() {
  const { t } = useLocale();
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
      <OnboardingStepIntro>{t.candidatePickRoleHint}</OnboardingStepIntro>
      <SectionLabel first required>
        {t.jobRole}
      </SectionLabel>
      <SectionHint>{t.candidatePrimaryRoleHint}</SectionHint>

      <JobRoleGrid
        displayMode="native-picker"
        filter={filter}
        selectionMode="single"
        selectedRole={data.role}
        onSelectRole={setPrimary}
        onClearRole={() => update({ role: undefined })}
      />

      <FieldError message={roleError} />
    </CandidateOnboardingStep>
  );
}
