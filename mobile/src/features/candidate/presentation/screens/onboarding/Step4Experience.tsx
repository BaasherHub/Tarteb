import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocale } from '@/core/i18n/LocaleContext';
import { useRtlStyles } from '@/core/hooks/useRtlStyles';
import { colors } from '@/core/theme/colors';
import { typography } from '@/core/theme/typography';
import { FieldError } from '@/shared/widgets/FieldError';
import { SelectableChip } from '@/shared/widgets/SelectableChip';
import { FormField } from '@/shared/widgets/FormField';
import { CandidateOnboardingStep } from '@/features/candidate/presentation/components/CandidateOnboardingStep';
import { useCandidateOnboarding } from '@/features/candidate/providers/CandidateOnboardingContext';
import { EXPERIENCE_OPTIONS, LANGUAGE_OPTIONS } from '@/features/candidate/domain/constants/candidate';

type Errors = { experience?: string; languages?: string; uae?: string };

export function Step4Experience() {
  const { t } = useLocale();
  const rtl = useRtlStyles();
  const { data, update, setStep } = useCandidateOnboarding();
  const [errors, setErrors] = useState<Errors>({});

  const toggleLang = (lang: string) => {
    const set = new Set(data.languages);
    if (set.has(lang)) set.delete(lang);
    else set.add(lang);
    update({ languages: [...set] });
    setErrors((e) => ({ ...e, languages: undefined }));
  };

  const next = () => {
    const nextErrors: Errors = {};
    if (data.yearsExperience === undefined) nextErrors.experience = t.errExperience;
    if (data.languages.length === 0) nextErrors.languages = t.errLanguages;
    if (data.uaeExperience === undefined) nextErrors.uae = t.errUae;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStep(5);
  };

  return (
    <CandidateOnboardingStep
      primaryLabel={t.continue}
      onPrimary={next}
      backLabel={t.back}
      onBack={() => setStep(3)}
    >
      <Text style={[styles.section, { textAlign: rtl.textAlign }]}>{t.yearsExperience}</Text>
      <FieldError message={errors.experience} />
      <View style={[styles.wrap, rtl.row]}>
        {EXPERIENCE_OPTIONS.map((opt) => (
          <SelectableChip
            key={opt.years}
            label={opt.label}
            selected={data.yearsExperience === opt.years}
            onPress={() => {
              update({ yearsExperience: opt.years });
              setErrors((e) => ({ ...e, experience: undefined }));
            }}
          />
        ))}
      </View>

      <Text style={[styles.section, { textAlign: rtl.textAlign }]}>{t.languages}</Text>
      <FieldError message={errors.languages} />
      <View style={[styles.wrap, rtl.row]}>
        {LANGUAGE_OPTIONS.map((lang) => (
          <SelectableChip
            key={lang}
            label={lang}
            selected={data.languages.includes(lang)}
            onPress={() => toggleLang(lang)}
          />
        ))}
      </View>

      <Text style={[styles.section, { textAlign: rtl.textAlign }]}>{t.uaeExperience}</Text>
      <FieldError message={errors.uae} />
      <View style={styles.yesNo}>
        <View style={styles.half}>
          <SelectableChip
            label={t.yes}
            selected={data.uaeExperience === true}
            onPress={() => {
              update({ uaeExperience: true });
              setErrors((e) => ({ ...e, uae: undefined }));
            }}
          />
        </View>
        <View style={styles.half}>
          <SelectableChip
            label={t.no}
            selected={data.uaeExperience === false}
            onPress={() => {
              update({ uaeExperience: false });
              setErrors((e) => ({ ...e, uae: undefined }));
            }}
          />
        </View>
      </View>

      <FormField
        label={t.previousEmployer}
        value={data.previousEmployer ?? ''}
        onChangeText={(v) => update({ previousEmployer: v || null })}
        placeholder={t.companyPlaceholder}
      />
    </CandidateOnboardingStep>
  );
}

const styles = StyleSheet.create({
  section: { ...typography.h3, marginTop: 16, marginBottom: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  yesNo: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});

