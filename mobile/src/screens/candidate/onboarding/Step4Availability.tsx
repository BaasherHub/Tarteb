import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { OnboardingProgress } from '../../../components/OnboardingProgress';
import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';
import { useLocale } from '../../../i18n/LocaleContext';
import { supabase } from '../../../lib/supabase';
import { colors } from '../../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CandidateOnboarding'>;

export function Step4Availability({ navigation }: Props) {
  const { t } = useLocale();
  const { data, step, totalSteps } = useCandidateOnboarding();
  const [name, setName] = useState(data.name ?? '');
  const [availableFrom, setAvailableFrom] = useState(
    data.availableFrom ? new Date(data.availableFrom) : new Date(),
  );
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [loading, setLoading] = useState(false);

  const dateStr = availableFrom.toISOString().split('T')[0];

  const submit = async () => {
    if (!name.trim()) {
      Alert.alert(t.required);
      return;
    }
    setLoading(true);
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('Not signed in');

      const payload = {
        user_id: userId,
        name: name.trim(),
        photo_url: data.photoUrl,
        role: data.role,
        visa_status: data.visaStatus,
        nationality: data.nationality,
        salary_expectation: data.salaryExpectation,
        available_from: dateStr,
        location: data.location,
        phone: data.phone,
        whatsapp: data.whatsapp,
        years_experience: data.yearsExperience ?? 0,
        languages: data.languages,
        uae_experience: data.uaeExperience,
        previous_employer: data.previousEmployer,
        is_active: true,
      };

      const { error } = await supabase
        .from('candidates')
        .upsert(payload, { onConflict: 'user_id' });
      if (error) throw error;

      navigation.reset({ index: 0, routes: [{ name: 'CandidateDashboard' }] });
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.flex}>
      <OnboardingProgress step={step} totalSteps={totalSteps} />
      <View style={styles.body}>
        <Text style={styles.label}>{t.fullName}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>{t.availableFrom}</Text>
        {Platform.OS === 'android' && (
          <PrimaryButton
            label={dateStr}
            onPress={() => setShowPicker(true)}
          />
        )}
        {showPicker && (
          <DateTimePicker
            value={availableFrom}
            mode="date"
            minimumDate={new Date()}
            onChange={(_, date) => {
              if (Platform.OS === 'android') setShowPicker(false);
              if (date) setAvailableFrom(date);
            }}
          />
        )}
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          label={data.candidateId ? t.saveProfile : t.submitProfile}
          onPress={submit}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: { flex: 1, padding: 20 },
  label: { marginBottom: 6, color: colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.divider },
});
