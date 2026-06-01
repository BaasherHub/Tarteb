import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { OnboardingProgress } from '../../../components/OnboardingProgress';
import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';
import { useLocale } from '../../../i18n/LocaleContext';
import { LOCATIONS, VISA_STATUSES } from '../../../constants/candidate';
import { colors } from '../../../constants/colors';

export function Step2Visa() {
  const { t } = useLocale();
  const { data, update, setStep, step, totalSteps } = useCandidateOnboarding();

  const next = () => {
    if (!data.visaStatus || !data.location || !data.nationality?.trim()) {
      Alert.alert(t.required);
      return;
    }
    setStep(3);
  };

  return (
    <View style={styles.flex}>
      <OnboardingProgress step={step} totalSteps={totalSteps} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t.visaStatus}</Text>
        {VISA_STATUSES.map((status) => {
          const selected = data.visaStatus === status;
          return (
            <Text
              key={status}
              onPress={() => update({ visaStatus: status })}
              style={[styles.visaBtn, selected && styles.visaBtnOn]}
            >
              {status}
            </Text>
          );
        })}
        <Text style={styles.label}>{t.nationality}</Text>
        <TextInput
          style={styles.input}
          value={data.nationality ?? ''}
          onChangeText={(nationality) => update({ nationality })}
        />
        <Text style={styles.label}>{t.location}</Text>
        <View style={styles.locRow}>
          {LOCATIONS.map((loc) => {
            const selected = data.location === loc;
            return (
              <Text
                key={loc}
                onPress={() => update({ location: loc })}
                style={[styles.locChip, selected && styles.locChipOn]}
              >
                {loc}
              </Text>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton label={t.continue} onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 20 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  visaBtn: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  visaBtnOn: {
    backgroundColor: colors.primary,
    color: '#fff',
    borderColor: colors.primary,
    fontWeight: '600',
  },
  label: { marginTop: 16, marginBottom: 6, color: colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.surface,
  },
  locRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  locChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  locChipOn: { borderColor: colors.primary, backgroundColor: `${colors.primary}15` },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.divider },
});
