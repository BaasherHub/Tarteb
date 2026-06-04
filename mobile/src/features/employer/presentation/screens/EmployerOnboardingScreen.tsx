import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/core/navigation/types';
import { useLocale } from '@/core/i18n/LocaleContext';
import { supabase } from '@/core/lib/supabase';
import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';
import { AppBrand } from '@/shared/widgets/AppBrand';
import { PrimaryButton } from '@/shared/widgets/PrimaryButton';
import { FormField } from '@/shared/widgets/FormField';
import { LocationPicker } from '@/shared/widgets/LocationPicker';
import { Screen } from '@/shared/widgets/Screen';
import { getErrorMessage } from '@/shared/utils/errors';
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
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
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
    if (!phone.trim()) nextErrors.phone = t.errPhone;
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
        phone: phone.trim(),
        email: email.trim(),
        location,
        trade_license: tradeLicense.trim() || null,
      });
      if (error) throw error;
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
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <AppBrand showTagline={false} />
          <Text style={styles.title}>{t.employerOnboarding}</Text>
          <FormField
            label={t.companyName}
            value={company}
            onChangeText={(v) => { setCompany(v); setErrors((e) => ({ ...e, company: undefined })); }}
            placeholder={t.companyPlaceholder}
            error={errors.company}
          />
          <FormField
            label={t.contactName}
            value={contact}
            onChangeText={(v) => { setContact(v); setErrors((e) => ({ ...e, contact: undefined })); }}
            placeholder={t.contactPlaceholder}
            error={errors.contact}
          />
          <FormField
            label={t.enterPhone}
            value={phone}
            onChangeText={(v) => { setPhone(v); setErrors((e) => ({ ...e, phone: undefined })); }}
            keyboardType="phone-pad"
            placeholder={t.phonePlaceholder}
            error={errors.phone}
          />
          <FormField
            label={t.email}
            value={email}
            onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder={t.emailPlaceholder}
            error={errors.email}
          />
          <LocationPicker
            value={location}
            onChange={(loc) => { setLocation(loc); setErrors((e) => ({ ...e, location: undefined })); }}
            error={errors.location}
          />
          <FormField
            label={t.tradeLicense}
            value={tradeLicense}
            onChangeText={setTradeLicense}
            placeholder={t.tradeLicensePlaceholder}
            autoCapitalize="characters"
          />
          <Text style={styles.hint}>{t.tradeLicenseHint}</Text>
          {submitError ? <Text style={styles.err}>{submitError}</Text> : null}
          <PrimaryButton label={t.startBrowsing} onPress={submit} loading={loading} />
        </ScrollView>
      </ContentWidth>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 0 },
  scroll: { paddingHorizontal: 20, paddingBottom: 32, paddingTop: 8 },
  title: { ...typography.h2, marginVertical: 16 },
  hint: { fontSize: 13, color: colors.textSecondary, marginTop: -8, marginBottom: 16 },
  err: { color: colors.error, fontSize: 13, marginBottom: 8, marginTop: 8 },
});
