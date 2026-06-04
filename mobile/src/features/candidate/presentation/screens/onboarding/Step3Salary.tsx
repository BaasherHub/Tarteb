import React, { useState } from 'react';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { FormField } from '@/shared/widgets/FormField';
import { PhoneNumberField } from '@/shared/widgets/PhoneNumberField';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { useLocale } from '@/core/i18n/LocaleContext';
import {
  formatUaePhoneInput,
  isValidUaeMobileE164,
  normalizeE164,
  UAE_DIAL_CODE,
  validateOptionalUaeMobile,
} from '@/shared/utils/phone';

type Errors = { salary?: string; phone?: string; whatsapp?: string };

export function Step3Salary() {
  const { t } = useLocale();
  const { data, update, setStep } = useCandidateOnboarding();
  const [errors, setErrors] = useState<Errors>({});

  const next = () => {
    const salary = parseInt(data.salaryExpectation?.toString() ?? '', 10);
    const nextErrors: Errors = {};
    if (!salary) nextErrors.salary = t.errSalary;

    const phoneE164 = normalizeE164(data.phone ?? '');
    if (!data.phone?.trim() || !isValidUaeMobileE164(phoneE164)) {
      nextErrors.phone = data.phone?.trim() ? t.errPhoneInvalid : t.errPhone;
    }

    const whatsappResult = validateOptionalUaeMobile(data.whatsapp);
    if (!whatsappResult.ok) {
      nextErrors.whatsapp = t.errPhoneInvalid;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    update({
      salaryExpectation: salary,
      phone: phoneE164,
      whatsapp: whatsappResult.ok ? whatsappResult.e164 : null,
    });
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
      <PhoneNumberField
        value={data.phone ? formatUaePhoneInput(data.phone) : formatUaePhoneInput(UAE_DIAL_CODE)}
        onChangeText={(phone) => {
          update({ phone: formatUaePhoneInput(phone) });
          setErrors((e) => ({ ...e, phone: undefined }));
        }}
        error={errors.phone}
      />
      <PhoneNumberField
        label={t.whatsappOptional}
        allowEmpty
        showExample={false}
        value={
          data.whatsapp ? formatUaePhoneInput(data.whatsapp) : ''
        }
        onChangeText={(whatsapp) => {
          update({
            whatsapp: whatsapp.trim() ? formatUaePhoneInput(whatsapp) : null,
          });
          setErrors((e) => ({ ...e, whatsapp: undefined }));
        }}
        hint={t.whatsappOptionalHint}
        placeholder={t.whatsappPlaceholder}
        error={errors.whatsapp}
      />
    </CandidateOnboardingStep>
  );
}
