import React, { useState } from 'react';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { useLocale } from '@/core/i18n/LocaleContext';

type Errors = { salary?: string; phone?: string };

export function Step3Salary() {
  const { t } = useLocale();
  const { data, update, setStep } = useCandidateOnboarding();
  const [errors, setErrors] = useState<Errors>({});

  const next = () => {
    const salary = parseInt(data.salaryExpectation?.toString() ?? '', 10);
    const nextErrors: Errors = {};
    if (!salary) nextErrors.salary = t.errSalary;
    if (!data.phone?.trim()) nextErrors.phone = t.errPhone;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    update({ salaryExpectation: salary });
    setStep(4);
  };

  return (
    <CandidateOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      backLabel={t.back}
      onBack={() => setStep(2)}
    >
      <FormField
        label={t.monthlySalary}
        keyboardType="number-pad"
        value={data.salaryExpectation?.toString() ?? ''}
        onChangeText={(v) => {
          update({ salaryExpectation: parseInt(v, 10) || undefined });
          setErrors((e) => ({ ...e, salary: undefined }));
        }}
        placeholder={t.salaryPlaceholder}
        error={errors.salary}
      />
      <FormField
        label={t.phoneNumber}
        keyboardType="phone-pad"
        value={data.phone ?? ''}
        onChangeText={(phone) => {
          update({ phone });
          setErrors((e) => ({ ...e, phone: undefined }));
        }}
        placeholder={t.phonePlaceholder}
        error={errors.phone}
      />
      <FormField
        label={t.whatsappOptional}
        keyboardType="phone-pad"
        value={data.whatsapp ?? ''}
        onChangeText={(whatsapp) => update({ whatsapp: whatsapp || null })}
        placeholder={t.whatsappPlaceholder}
      />
    </CandidateOnboardingStep>
  );
}

import { FormField } from '@/shared/widgets/FormField';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';

