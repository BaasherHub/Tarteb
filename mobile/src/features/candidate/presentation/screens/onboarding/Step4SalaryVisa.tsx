import React, { useState } from 'react';
import { View } from 'react-native';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import {
  OnboardingStepIntro,
  onboardingStepStyles,
} from '@/features/candidate/presentation/components/OnboardingStepIntro';
import { SectionLabel } from '@/shared/widgets/SectionLabel';
import { FormField } from '@/shared/widgets/FormField';
import { FieldError } from '@/shared/widgets/FieldError';
import { SelectableChip } from '@/shared/widgets/SelectableChip';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { useLocale } from '@/core/i18n/LocaleContext';
import { formatSalaryAmount, parseSalaryAmount } from '@/shared/utils/salary';
import { VISA_STATUSES } from '@/features/candidate/domain/constants/candidate';

type Errors = {
  currentSalary?: string;
  expectedSalary?: string;
  visa?: string;
};

export function Step4SalaryVisa() {
  const { t } = useLocale();
  const { data, update, setStep } = useCandidateOnboarding();
  const [errors, setErrors] = useState<Errors>({});

  const next = () => {
    const nextErrors: Errors = {};
    if (!data.visaStatus) nextErrors.visa = t.errVisa;
    if (!data.currentSalary) nextErrors.currentSalary = t.errCurrentSalary;
    if (!data.salaryExpectation) nextErrors.expectedSalary = t.errExpectedSalary;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStep(5);
  };

  return (
    <CandidateOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      backLabel={t.back}
      onBack={() => setStep(3)}
    >
      <OnboardingStepIntro>{t.onboardingStepSalaryVisaIntro}</OnboardingStepIntro>

      <SurfaceCard inset style={onboardingStepStyles.formCard}>
        <SectionLabel first>{t.visaStatus}</SectionLabel>
        <View style={onboardingStepStyles.chipGrid}>
          {VISA_STATUSES.map((status) => (
            <View key={status} style={onboardingStepStyles.chipCell}>
              <SelectableChip
                label={t.visaStatusLabel(status)}
                selected={data.visaStatus === status}
                onPress={() => {
                  update({ visaStatus: status });
                  setErrors((e) => ({ ...e, visa: undefined }));
                }}
              />
            </View>
          ))}
        </View>
        <FieldError message={errors.visa} />

        <SectionLabel>{t.salarySectionTitle}</SectionLabel>
        <FormField
          label={t.currentSalary}
          prefix="AED"
          keyboardType="number-pad"
          value={formatSalaryAmount(data.currentSalary)}
          onChangeText={(v) => {
            update({ currentSalary: parseSalaryAmount(v) });
            setErrors((e) => ({ ...e, currentSalary: undefined }));
          }}
          error={errors.currentSalary}
        />
        <FormField
          label={t.expectedSalary}
          prefix="AED"
          keyboardType="number-pad"
          value={formatSalaryAmount(data.salaryExpectation)}
          onChangeText={(v) => {
            update({ salaryExpectation: parseSalaryAmount(v) });
            setErrors((e) => ({ ...e, expectedSalary: undefined }));
          }}
          error={errors.expectedSalary}
        />
      </SurfaceCard>
    </CandidateOnboardingStep>
  );
}
