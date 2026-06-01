import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { OnboardingProgress } from '../../../components/OnboardingProgress';
import { useCandidateOnboarding } from '../../../context/CandidateOnboardingContext';
import { useLocale } from '../../../i18n/LocaleContext';
import { EXPERIENCE_OPTIONS, LANGUAGE_OPTIONS } from '../../../constants/candidate';
import { colors } from '../../../constants/colors';

export function Step3Salary() {
  const { t } = useLocale();
  const { data, update, setStep, step, totalSteps } = useCandidateOnboarding();

  const toggleLang = (lang: string) => {
    const set = new Set(data.languages);
    if (set.has(lang)) set.delete(lang);
    else set.add(lang);
    update({ languages: [...set] });
  };

  const next = () => {
    const salary = parseInt(data.salaryExpectation?.toString() ?? '', 10);
    if (!salary || !data.phone?.trim()) {
      Alert.alert(t.required);
      return;
    }
    if (data.yearsExperience === undefined || data.languages.length === 0) {
      Alert.alert(t.required);
      return;
    }
    update({ salaryExpectation: salary });
    setStep(4);
  };

  return (
    <View style={styles.flex}>
      <OnboardingProgress step={step} totalSteps={totalSteps} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>{t.monthlySalary}</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={data.salaryExpectation?.toString() ?? ''}
          onChangeText={(v) => update({ salaryExpectation: parseInt(v, 10) || undefined })}
        />
        <Text style={styles.label}>{t.phoneNumber}</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={data.phone ?? ''}
          onChangeText={(phone) => update({ phone })}
        />
        <Text style={styles.label}>{t.whatsappOptional}</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={data.whatsapp ?? ''}
          onChangeText={(whatsapp) => update({ whatsapp: whatsapp || null })}
        />
        <Text style={styles.section}>{t.yearsExperience}</Text>
        <View style={styles.wrap}>
          {EXPERIENCE_OPTIONS.map((opt) => {
            const selected = data.yearsExperience === opt.years;
            return (
              <Text
                key={opt.years}
                onPress={() => update({ yearsExperience: opt.years })}
                style={[styles.chip, selected && styles.chipOn]}
              >
                {opt.label}
              </Text>
            );
          })}
        </View>
        <Text style={styles.section}>{t.languages}</Text>
        <View style={styles.wrap}>
          {LANGUAGE_OPTIONS.map((lang) => {
            const selected = data.languages.includes(lang);
            return (
              <Text
                key={lang}
                onPress={() => toggleLang(lang)}
                style={[styles.chip, selected && styles.chipOn]}
              >
                {lang}
              </Text>
            );
          })}
        </View>
        <Text style={styles.section}>{t.uaeExperience}</Text>
        <View style={styles.row}>
          <Text
            onPress={() => update({ uaeExperience: true })}
            style={[styles.yesNo, data.uaeExperience && styles.yesNoOn]}
          >
            {t.yes}
          </Text>
          <Text
            onPress={() => update({ uaeExperience: false })}
            style={[styles.yesNo, !data.uaeExperience && styles.yesNoOn]}
          >
            {t.no}
          </Text>
        </View>
        <Text style={styles.label}>{t.previousEmployer}</Text>
        <TextInput
          style={styles.input}
          value={data.previousEmployer ?? ''}
          onChangeText={(previousEmployer) =>
            update({ previousEmployer: previousEmployer || null })
          }
        />
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
  label: { marginTop: 12, marginBottom: 6, color: colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.surface,
  },
  section: { fontWeight: '600', marginTop: 20, marginBottom: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: `${colors.primary}15` },
  row: { flexDirection: 'row', gap: 12 },
  yesNo: {
    flex: 1,
    textAlign: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  yesNoOn: { backgroundColor: colors.primary, color: '#fff', borderColor: colors.primary },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.divider },
});
