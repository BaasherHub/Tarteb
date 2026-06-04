import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { supabase } from '@/core/lib/supabase';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { typography } from '@/core/theme/typography';
import { AppBrand } from '@/shared/widgets/AppBrand';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { FormField } from '@/shared/widgets/FormField';
import { PhoneNumberField } from '@/shared/widgets/PhoneNumberField';
import { formatUaePhoneInput, isValidUaeMobileE164, normalizeE164, UAE_DIAL_CODE } from '@/shared/utils/phone';
import { LocationPicker } from '@/shared/widgets/LocationPicker';
import { Screen } from '@/shared/widgets/Screen';
import { getErrorMessage } from '@/shared/utils/errors';
import { promptForPushNotifications } from '@/core/services/notifications';
import { ContentWidth } from '@/shared/widgets/ContentWidth';

type Props = NativeStackScreenProps<RootStackParamList, 'EmployerOnboarding'>;

type Errors = {
  company?: string;
  contact?: string;
  phone?: string;
  email?: string;
  location?: string;
};

export function EmployerOnboardingScreen({ navigation }: Props) {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState(formatUaePhoneInput(UAE_DIAL_CODE));
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | undefined>();

  const submit = async () => {
    const nextErrors: Errors = {};
    if (!company.trim()) nextErrors.company = t.errCompany;
    if (!contact.trim()) nextErrors.contact = t.errContact;
    const phoneE164 = normalizeE164(phone);
    if (!phone.trim() || !isValidUaeMobileE164(phoneE164)) {
      nextErrors.phone = phone.trim() ? t.errPhoneInvalid : t.errPhone;
    }
    if (!email.trim()) nextErrors.email = t.errEmail;
    else if (!email.includes('@')) nextErrors.email = t.errEmailInvalid;
    if (!location) nextErrors.location = t.errLocation;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    setLoading(true);
    setSubmitError(undefined);
    try {
      const { error } = await supabase.from('employers').insert({
        user_id: userId,
        company_name: company.trim(),
        contact_name: contact.trim(),
        phone: normalizeE164(phone),
        email: email.trim(),
        location,
        trade_license: tradeLicense.trim() || null,
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
    <Screen style={styles.screen}>
      <ContentWidth>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <AppBrand showTagline={false} />
          <Text style={[styles.title, { textAlign: rtl.textAlign }]} numberOfLines={2}>
            {t.employerOnboarding}
          </Text>
          <View style={styles.form}>
            <FormField
              label={t.companyName}
              value={company}
              onChangeText={(v) => {
                setCompany(v);
                setErrors((e) => ({ ...e, company: undefined }));
              }}
              placeholder={t.companyPlaceholder}
              error={errors.company}
            />
            <FormField
              label={t.contactName}
              value={contact}
              onChangeText={(v) => {
                setContact(v);
                setErrors((e) => ({ ...e, contact: undefined }));
              }}
              placeholder={t.contactPlaceholder}
              error={errors.contact}
            />
            <PhoneNumberField
              label={t.enterPhone}
              value={phone}
              onChangeText={(v) => {
                setPhone(formatUaePhoneInput(v));
                setErrors((e) => ({ ...e, phone: undefined }));
              }}
              error={errors.phone}
            />
            <FormField
              label={t.email}
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setErrors((e) => ({ ...e, email: undefined }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder={t.emailPlaceholder}
              error={errors.email}
            />
            <LocationPicker
              value={location}
              onChange={(loc) => {
                setLocation(loc);
                setErrors((e) => ({ ...e, location: undefined }));
              }}
              error={errors.location}
            />
            <FormField
              label={t.tradeLicense}
              value={tradeLicense}
              onChangeText={setTradeLicense}
              placeholder={t.tradeLicensePlaceholder}
              autoCapitalize="characters"
            />
            <Text
              style={[styles.hint, { textAlign: rtl.textAlign }]}
              numberOfLines={3}
            >
              {t.tradeLicenseHint}
            </Text>
            {submitError ? (
              <Text
                style={[styles.err, { textAlign: rtl.textAlign }]}
                accessibilityRole="alert"
                numberOfLines={4}
              >
                {submitError}
              </Text>
            ) : null}
            <PrimaryButton label={t.startBrowsing} onPress={submit} loading={loading} />
          </View>
        </ScrollView>
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  scroll: {
    paddingHorizontal: spacing.screenX,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  title: { ...typography.h2, marginVertical: spacing.lg },
  form: { gap: spacing.xs },
  hint: { ...typography.caption, color: colors.textSecondary, marginTop: -spacing.sm, marginBottom: spacing.lg },
  err: { ...typography.caption, color: colors.error, marginVertical: spacing.sm },
});
