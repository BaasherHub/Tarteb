import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useLocale } from '../../i18n/LocaleContext';
import { supabase } from '../../lib/supabase';
import { colors } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'EmployerOnboarding'>;

const LOCATIONS = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Other'];

export function EmployerOnboardingScreen({ navigation }: Props) {
  const { t } = useLocale();
  const [company, setCompany] = useState('');
  const [contact, setContact] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;
    if (!company || !contact || !phone || !email) {
      Alert.alert('Error', 'Fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('employers').insert({
        user_id: userId,
        company_name: company,
        contact_name: contact,
        phone,
        email,
        location,
      });
      if (error) throw error;
      navigation.replace('EmployerShell');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t.employerOnboarding}</Text>
        <Field label={t.companyName} value={company} onChangeText={setCompany} />
        <Field label={t.contactName} value={contact} onChangeText={setContact} />
        <Field label={t.enterPhone} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Text style={styles.label}>Location</Text>
        <Text style={styles.location}>{location}</Text>
        <PrimaryButton label={t.startBrowsing} onPress={submit} loading={loading} />
      </ScrollView>
    </Screen>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32, gap: 8 },
  title: { fontSize: 22, fontWeight: '600', marginVertical: 16 },
  label: { marginTop: 8, color: colors.textSecondary, fontSize: 13 },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.surface,
    fontSize: 16,
  },
  location: { fontSize: 16, marginBottom: 16 },
});
