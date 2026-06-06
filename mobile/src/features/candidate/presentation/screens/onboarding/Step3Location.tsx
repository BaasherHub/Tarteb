import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { filterNationalities, resolveNationality } from '@/shared/constants/nationalities';
import { parseLocation } from '@/shared/constants/uaeLocations';
import { AutocompleteField } from '@/shared/widgets/AutocompleteField';
import { SectionLabel } from '@/shared/widgets/SectionLabel';
import { FormField } from '@/shared/widgets/FormField';
import { LocationPicker } from '@/shared/widgets/LocationPicker';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import { AuthPhoneNumberField } from '@/features/auth/presentation/components/AuthPhoneNumberField';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import {
  OnboardingStepIntro,
  onboardingStepStyles,
} from '@/features/candidate/presentation/components/OnboardingStepIntro';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { useAuthPhoneInput } from '@/shared/hooks/useAuthPhoneInput';
import type { ArabPhoneCountry } from '@/shared/constants/arabPhoneCountries';

type Errors = {
  name?: string;
  nationality?: string;
  location?: string;
  phone?: string;
  whatsapp?: string;
};

function hasDistrict(location: string | undefined): boolean {
  return Boolean(parseLocation(location ?? '').area?.trim());
}

function e164FromParts(
  dial: string,
  localNumber: string,
  maxLength = localNumber.length,
): string {
  const digits = localNumber.replace(/\D/g, '').slice(0, maxLength);
  return digits ? `${dial}${digits}` : '';
}

export function Step3Location() {
  const { t } = useLocale();
  const { data, update, setStep } = useCandidateOnboarding();
  const [errors, setErrors] = useState<Errors>({});
  const [name, setName] = useState(data.name ?? '');
  const [nationalityQuery, setNationalityQuery] = useState(data.nationality ?? '');

  const phoneInput = useAuthPhoneInput({ initialE164: data.phone });
  const whatsappInput = useAuthPhoneInput({ initialE164: data.whatsapp });

  const nationalityOptions = useMemo(
    () => filterNationalities(nationalityQuery),
    [nationalityQuery],
  );

  const syncPhone = (country: ArabPhoneCountry, localNumber: string) => {
    update({
      phone: e164FromParts(country.dial, localNumber, country.localMaxLength) || undefined,
    });
  };

  const syncWhatsapp = (country: ArabPhoneCountry, localNumber: string) => {
    update({
      whatsapp: e164FromParts(country.dial, localNumber, country.localMaxLength) || null,
    });
  };

  const next = () => {
    const nextErrors: Errors = {};
    if (!name.trim()) nextErrors.name = t.errFullName;

    if (!phoneInput.localNumber.trim() || !phoneInput.isValid) {
      nextErrors.phone = phoneInput.localNumber.trim()
        ? t.errPhoneInvalidArabRegion
        : t.errPhone;
    }

    if (whatsappInput.localNumber.trim() && !whatsappInput.isValid) {
      nextErrors.whatsapp = t.errPhoneInvalidArabRegion;
    }

    const resolved = resolveNationality(nationalityQuery);
    if (!resolved) nextErrors.nationality = t.errNationalityPick;
    if (!hasDistrict(data.location)) {
      nextErrors.location = t.errLocationArea;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    update({
      name: name.trim(),
      nationality: resolved!,
      phone: phoneInput.e164,
      whatsapp: whatsappInput.localNumber.trim() ? whatsappInput.e164 : null,
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
      <OnboardingStepIntro>{t.onboardingStepLocationIntro}</OnboardingStepIntro>

      <SurfaceCard inset style={onboardingStepStyles.formCard}>
        <FormField
          label={t.fullNameOnId}
          value={name}
          onChangeText={(v) => {
            setName(v);
            update({ name: v });
            setErrors((e) => ({ ...e, name: undefined }));
          }}
          placeholder={t.fullNamePlaceholder}
          error={errors.name}
        />

        <View style={onboardingStepStyles.section}>
          <SectionLabel first>{t.contactsSectionTitle}</SectionLabel>
          <AuthPhoneNumberField
            country={phoneInput.country}
            onCountryChange={(country) => {
              phoneInput.setCountry(country);
              syncPhone(country, phoneInput.localNumber);
              setErrors((e) => ({ ...e, phone: undefined }));
            }}
            localNumber={phoneInput.localNumber}
            onChangeLocalNumber={(value) => {
              phoneInput.onChangeLocalNumber(value);
              syncPhone(phoneInput.country, value);
              setErrors((e) => ({ ...e, phone: undefined }));
            }}
            error={errors.phone}
          />
          <AuthPhoneNumberField
            label={t.whatsappOptional}
            country={whatsappInput.country}
            onCountryChange={(country) => {
              whatsappInput.setCountry(country);
              syncWhatsapp(country, whatsappInput.localNumber);
              setErrors((e) => ({ ...e, whatsapp: undefined }));
            }}
            localNumber={whatsappInput.localNumber}
            onChangeLocalNumber={(value) => {
              whatsappInput.onChangeLocalNumber(value);
              syncWhatsapp(whatsappInput.country, value);
              setErrors((e) => ({ ...e, whatsapp: undefined }));
            }}
            error={errors.whatsapp}
          />
        </View>

        <AutocompleteField
          label={t.nationality}
          value={nationalityQuery}
          onChangeText={(q) => {
            setNationalityQuery(q);
            setErrors((e) => ({ ...e, nationality: undefined }));
          }}
          onSelect={(n) => {
            setNationalityQuery(n);
            update({ nationality: n });
            setErrors((e) => ({ ...e, nationality: undefined }));
          }}
          options={nationalityOptions}
          placeholder={t.nationalityPlaceholder}
          emptyHint={t.errNationalityPick}
          error={errors.nationality}
        />

        <LocationPicker
          value={data.location ?? ''}
          onChange={(location) => {
            update({ location });
            setErrors((e) => ({ ...e, location: undefined }));
          }}
          error={errors.location}
          areaHint=""
        />
      </SurfaceCard>
    </CandidateOnboardingStep>
  );
}
