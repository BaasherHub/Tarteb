import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { supabase } from '@/core/lib/supabase';
import { EmployerOnboardingStep } from '@/features/employer/presentation/components/EmployerOnboardingStep';
import { useEmployerOnboarding } from '@/features/employer/providers/EmployerOnboardingContext';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import {
  formatUaePhoneInput,
  isValidUaeMobileE164,
  normalizeE164,
  UAE_DIAL_CODE,
} from '@/shared/utils/phone';
import { getErrorMessage } from '@/shared/utils/errors';
import { FormField } from '@/shared/widgets/FormField';
import { PhoneNumberField } from '@/shared/widgets/PhoneNumberField';
import { LocationPicker } from '@/shared/widgets/LocationPicker';
import { InfoBanner } from '@/shared/widgets/InfoBanner';
import { promptForPushNotifications } from '@/core/services/notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'EmployerOnboarding'>;

type Errors = {
  contact?: string;
  phone?: string;
  email?: string;
  location?: string;
};

export function EmployerStep2Contact({ navigation }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { data, update, setStep, isEditMode } = useEmployerOnboarding();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | undefined>();

  const phoneDisplay =
    data.phone ? formatUaePhoneInput(data.phone) : formatUaePhoneInput(UAE_DIAL_CODE);

  const submit = async () => {
    const nextErrors: Errors = {};
    if (!data.contactName.trim()) nextErrors.contact = t.errContact;
    const phoneE164 = normalizeE164(data.phone || UAE_DIAL_CODE);
    if (!data.phone.trim() || !isValidUaeMobileE164(phoneE164)) {
      nextErrors.phone = data.phone.trim() ? t.errPhoneInvalid : t.errPhone;
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
      const payload = {
        company_name: data.companyName.trim(),
        contact_name: data.contactName.trim(),
        phone: phoneE164,
        email: data.email.trim(),
        location: data.location,
        trade_license: data.tradeLicense.trim() || null,
        logo_url: data.logoUrl,
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
      <Text style={[styles.intro, { textAlign: rtl.textAlign }]}>
        {isEditMode ? t.employerOnboardingEditIntro : t.employerOnboardingStep2Intro}
      </Text>

      {submitError ? (
        <View style={styles.bannerWrap}>
          <InfoBanner message={submitError} variant="warning" />
        </View>
      ) : null}

      <View style={styles.card}>
        <FormField
          label={t.contactName}
          value={data.contactName}
          onChangeText={(v) => {
            update({ contactName: v });
            setErrors((e) => ({ ...e, contact: undefined }));
          }}
          placeholder={t.contactPlaceholder}
          error={errors.contact}
        />
        <PhoneNumberField
          label={t.enterPhone}
          value={phoneDisplay}
          onChangeText={(v) => {
            update({ phone: formatUaePhoneInput(v) });
            setErrors((e) => ({ ...e, phone: undefined }));
          }}
          error={errors.phone}
        />
        <FormField
          label={t.email}
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
      </View>
    </EmployerOnboardingStep>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  bannerWrap: { marginBottom: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.divider,
    gap: spacing.xs,
  },
});
