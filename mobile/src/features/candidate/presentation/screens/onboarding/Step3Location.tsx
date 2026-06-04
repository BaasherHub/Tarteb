import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { filterNationalities, resolveNationality } from '@/shared/constants/nationalities';
import { parseLocation } from '@/shared/constants/uaeLocations';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AutocompleteField } from '@/shared/widgets/AutocompleteField';
import { SectionLabel } from '@/shared/widgets/SectionLabel';
import { FormField } from '@/shared/widgets/FormField';
import { LocationPicker } from '@/shared/widgets/LocationPicker';
import { PhoneNumberField } from '@/shared/widgets/PhoneNumberField';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import {
  formatUaePhoneInput,
  isValidUaeMobileE164,
  normalizeE164,
  UAE_DIAL_CODE,
  validateOptionalUaeMobile,
} from '@/shared/utils/phone';

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

export function Step3Location() {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { data, update, setStep } = useCandidateOnboarding();
  const [errors, setErrors] = useState<Errors>({});
  const [name, setName] = useState(data.name ?? '');
  const [nationalityQuery, setNationalityQuery] = useState(data.nationality ?? '');

  const nationalityOptions = useMemo(
    () => filterNationalities(nationalityQuery),
    [nationalityQuery],
  );

  const next = () => {
    const nextErrors: Errors = {};
    if (!name.trim()) nextErrors.name = t.errFullName;

    const phoneE164 = normalizeE164(data.phone ?? '');
    if (!data.phone?.trim() || !isValidUaeMobileE164(phoneE164)) {
      nextErrors.phone = data.phone?.trim() ? t.errPhoneInvalid : t.errPhone;
    }
    const whatsappResult = validateOptionalUaeMobile(data.whatsapp);
    if (!whatsappResult.ok) {
      nextErrors.whatsapp = t.errPhoneInvalid;
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

      <View style={styles.section}>
        <SectionLabel>{t.contactsSectionTitle}</SectionLabel>
        <PhoneNumberField
          value={
            data.phone ? formatUaePhoneInput(data.phone) : formatUaePhoneInput(UAE_DIAL_CODE)
          }
          onChangeText={(phone) => {
            update({ phone: formatUaePhoneInput(phone) });
            setErrors((e) => ({ ...e, phone: undefined }));
          }}
          showExample={false}
          showHelper={false}
          error={errors.phone}
        />
        <PhoneNumberField
          label={t.whatsappOptional}
          allowEmpty
          showExample={false}
          showHelper={false}
          placeholder=""
          value={data.whatsapp ? formatUaePhoneInput(data.whatsapp) : ''}
          onChangeText={(whatsapp) => {
            update({
              whatsapp: whatsapp.trim() ? formatUaePhoneInput(whatsapp) : null,
            });
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
    </CandidateOnboardingStep>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
});
