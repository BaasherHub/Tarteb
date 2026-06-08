import React, { useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { supabase } from '@/core/lib/supabase';
import { EmployerOnboardingStep } from '@/features/employer/presentation/components/EmployerOnboardingStep';
import { useEmployerOnboarding } from '@/features/employer/providers/EmployerOnboardingContext';
import {
  isCompanyNameAvailable,
  isCompanyNameConflict,
  normalizeCompanyName,
} from '@/features/employer/data/services/companyName';
import { getErrorMessage } from '@/shared/utils/errors';
import { FormField } from '@/shared/widgets/FormField';
import { LocationPicker } from '@/shared/widgets/LocationPicker';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import {
  OnboardingStepIntro,
  onboardingStepStyles,
} from '@/shared/widgets/OnboardingStepIntro';
import { SurfaceCard } from '@/shared/widgets/SurfaceCard';
import { SectionLabel } from '@/shared/widgets/SectionLabel';
import { AuthPhoneNumberField } from '@/features/auth/presentation/components/AuthPhoneNumberField';
import { useAuthPhoneInput } from '@/shared/hooks/useAuthPhoneInput';
import type { ArabPhoneCountry } from '@/shared/constants/arabPhoneCountries';
import { promptForPushNotifications } from '@/core/services/notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'EmployerOnboarding'>;

type Errors = {
  contact?: string;
  phone?: string;
  email?: string;
  location?: string;
};

function e164FromParts(
  dial: string,
  localNumber: string,
  maxLength = localNumber.length,
): string {
  const digits = localNumber.replace(/\D/g, '').slice(0, maxLength);
  return digits ? `${dial}${digits}` : '';
}

export function EmployerStep2Contact({ navigation }: Props) {
  const { t } = useLocale();
  const { data, update, setStep, isEditMode } = useEmployerOnboarding();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | undefined>();

  const phoneInput = useAuthPhoneInput({ initialE164: data.phone });

  const syncPhone = (country: ArabPhoneCountry, localNumber: string) => {
    update({
      phone: e164FromParts(country.dial, localNumber, country.localMaxLength),
    });
  };

  const submit = async () => {
    const nextErrors: Errors = {};
    if (!data.contactName.trim()) nextErrors.contact = t.errContact;
    if (!phoneInput.localNumber.trim() || !phoneInput.isValid) {
      nextErrors.phone = phoneInput.localNumber.trim()
        ? t.errPhoneInvalidArabRegion
        : t.errPhone;
    }
    if (!data.email.trim()) nextErrors.email = t.errEmail;
    else if (!data.email.includes('@')) nextErrors.email = t.errEmailInvalid;
    if (!data.location) nextErrors.location = t.errLocation;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    setLoading(true);
    setSubmitError(undefined);
    try {
      const companyName = normalizeCompanyName(data.companyName);
      const available = await isCompanyNameAvailable(companyName, userId);
      if (!available) {
        setSubmitError(t.errCompanyTaken);
        return;
      }

      const payload = {
        company_name: companyName,
        contact_name: data.contactName.trim(),
        phone: phoneInput.e164,
        email: data.email.trim(),
        location: data.location,
        trade_license: data.tradeLicense.trim() || null,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('employers')
          .update(payload)
          .eq('user_id', userId);
        if (error) throw error;
        navigation.goBack();
        return;
      }

      const { error } = await supabase.from('employers').insert({
        user_id: userId,
        ...payload,
      });
      if (error) throw error;
      await promptForPushNotifications(t);
      navigation.replace('EmployerShell');
    } catch (e) {
      if (isCompanyNameConflict(e)) {
        setSubmitError(t.errCompanyTaken);
        return;
      }
      setSubmitError(getErrorMessage(e, t.errorGeneric));
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployerOnboardingStep
      primaryLabel={isEditMode ? t.saveCompanyProfile : t.startBrowsing}
      onPrimary={submit}
      primaryLoading={loading}
      backLabel={t.back}
      onBack={() => setStep(1)}
    >
      <OnboardingStepIntro>
        {isEditMode ? t.employerOnboardingEditIntro : t.employerOnboardingStep2Intro}
      </OnboardingStepIntro>

      {submitError ? <InfoBanner message={submitError} variant="warning" /> : null}

      <SurfaceCard inset style={onboardingStepStyles.formCard}>
        <FormField
          label={t.contactName}
          required
          value={data.contactName}
          onChangeText={(v) => {
            update({ contactName: v });
            setErrors((e) => ({ ...e, contact: undefined }));
          }}
          error={errors.contact}
        />

        <View style={onboardingStepStyles.section}>
          <SectionLabel>{t.contactsSectionTitle}</SectionLabel>
          <AuthPhoneNumberField
            required
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
        </View>

        <FormField
          label={t.email}
          required
          value={data.email}
          onChangeText={(v) => {
            update({ email: v });
            setErrors((e) => ({ ...e, email: undefined }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder={t.emailPlaceholder}
          error={errors.email}
        />
        <LocationPicker
          value={data.location}
          onChange={(loc) => {
            update({ location: loc });
            setErrors((e) => ({ ...e, location: undefined }));
          }}
          error={errors.location}
          areaHint={t.employerLocationAreaHint}
        />
      </SurfaceCard>
    </EmployerOnboardingStep>
  );
}
